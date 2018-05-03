views.mainLayer = views.ILayer.extend({
	ctor:function () {
        this._super();
        this.judge = false
        this.initUI()
        return true
    },
    KeyBack:function(){
        this._super()
        this.exitAllGame()
    },
    onEnter:function(){
    	this._super();
        playMyMusic(res.sound_select,true)
    },
    onEnterTransitionDidFinish:function(){
    	this._super();
    },
    onExit:function(){
    	this._super();
    },
    initUI:function(){
        //进入游戏主场景界面显示
        loadPlist("birdFly_plist")
        var self = this
        var createSprite = function(img,pos){
            var sp = createSp({
                img:img,
                pos:pos,
                father:self
            })
            return sp
        }
        //背景图
        createSprite(res.main_bg,cc.p(568,320))
        var girl = createSprite(res.main_girl,cc.p(840,320))
        cartoon_main_action(self)
        var glass = createSprite(res.main_glass,cc.p(1136,0))
        var bird = createSprite(res.main_bird,cc.p(950,670))
        var title = createSprite(res.main_title,cc.p(500,420))
        var btn_start = createSprite(res.main_btn_start,cc.p(540,119))
        if (cc.sys.isNative){
            if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
                var EXIT_btn = createSprite(res.exit_btn,cc.p(540,50))
                EXIT_btn.setScale(0.8)
                scaleButtonFun({
                    item:EXIT_btn,
                    fun:function(){
                        self.KeyBack()
                    }
                })
            }
        }
        
        //鸟飞
        var birdFly = createSprite("#birdFly01.png",cc.p(170,480))
        
        var sun = createSprite(res.main_sun,cc.p(120,600))
        glass.setAnchorPoint(1,0)
        sun.setAnchorPoint(0,0.75)
        var sun2 = createSprite(res.main_sun,cc.p(120,600))
        sun2.setAnchorPoint(0,0.75)
        sun2.setRotation(-10)
        girl.setScale(0.6)

        birdFly.runAction(aniPlay({
            frame:"birdFly%02d.png",
            end:8,
            repeat:true,
            rever:true,
            time:0.15
        }))

        title.runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(2,500,425),
            cc.delayTime(1),
            cc.moveTo(2,500,420),
            cc.delayTime(1)
        )))

        bird.runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(4,320,370),
            cc.callFunc(function(){
                //鸟飞的位置，随机
                var posx = Math.floor(800 + Math.random() * 400)
                bird.setPosition(posx,670)
            }),
            cc.delayTime(2)
        )))
        //阳光收缩变化
        repForActionFun({
            item:sun,
            toScale:2,
            delTime:0.5,
            duration:2,
        })
        repForActionFun({
            item:sun2,
            toScale:3,
            delTime:1,
            duration:3
        })
        repForActionFun({
            item:btn_start,
            toScale:0.95,
            delTime:0.2,
            duration:1
        })
        //进入选择场景
        scaleButtonFun({
            item:btn_start,
            fun:function () {
                HTTP.sendData({
                    url:userInfo_url + TOKEN,
                    successBack:function(data){
                        var jsonData = data.jsonData
                        Person = jsonData.data.person
                        OldPerson.coinNum=Person.coinNum;
                        
                        if(!self.judge){
                            self.judge = true
                            layerControl.showLayer("selectLayer")
                        }
                    },
                    failBack:function(){
                        //cc.log("网络有问题")
                    },
                    errorBack:function(){
                        if(!self.Error){
                            self.Error = HTTP.showError({
                                            text:"网络连不上，请检查一下！",
                                            fontSize:30,
                                            color:cc.color(30,100,100)
                                        })
                            self.Error.setPosition(390,120)
                            self.addChild(self.Error)
                        }
                        self.Error.show()
                        //btn_start.setVisible(false)
                        cc.log("网络有问题")
                    }
                })
            }
        })
    }
})