var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super()
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("do_plist")
        loadPlist("daoshui_plist")

        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        createSp("#zhuozi.png",cc.p(550,90),self)
        var leftWater = createSp("#water.png",cc.p(370,110),self)
        var rightWater = createSp("#water.png",cc.p(596,110),self)
        leftWater.setScale(0)
        rightWater.setScale(0)
        var cup = createSp("#cup.png",cc.p(500,220),self)
        var gai = createSp("#gai.png",cc.p(675,140),self)
        var shaobei = createSp("#shaobei.png",cc.p(840,420),self)
        var jiantou1 = createSp("#xiang2.png",cc.p(570,138),self)
        jiantou1.setVisible(false)

        var btn_result = new ccui.Button(res.btn_xianxiang_1,res.btn_xianxiang_2)
        btn_result.setPosition(1010,450)
        self.addChild(btn_result)
        btn_result.setVisible(false)
        btn_result.addClickEventListener(function(){
            if(btn_result.isVisible()){
                self.nodebs.say({key:"result"})
            }
        })

        var gaiFun = function(){
            createTouchEvent({
                item:gai,
                begin:function(data){
                    if(!gai.judge){
                        gai.judge = true
                        self.jiantou2.stopAllActions()
                        self.jiantou2.setVisible(false)
                        gai.runAction(cc.sequence(
                            cc.moveTo(0.2,690,140),
                            cc.callFunc(function(){
                                var liu = createSp("#liu01.png",cc.p(705,130),self)
                                liu.runAction(aniRepeat())
                                var water = createSp("#shuiliu01.png",cc.p(960,100),self)
                                water.setScale(1.5)
                                water.runAction(ani("shuiliu%02d.png",18,0.2))
                                rightWater.runAction(cc.sequence(
                                    cc.moveTo(4.5,596,135),
                                    cc.callFunc(function(){
                                        liu.stopAllActions()
                                        liu.setVisible(false)
                                        jiantou1.stopAllActions()
                                        jiantou1.setVisible(false)
                                        btn_result.setVisible(true)
                                    })
                                ))
                                leftWater.runAction(cc.moveTo(4.5,370,135))
                                //箭头
                                jiantou1.setScaleX(-1)
                                jiantou1.runAction(cc.repeatForever(cc.sequence(
                                    cc.callFunc(function(){
                                        jiantou1.setVisible(true)
                                        jiantou1.setPositionX(420)
                                    }),
                                    cc.moveTo(0.4,570,138),
                                    cc.callFunc(function(){
                                        jiantou1.setVisible(false)
                                    }),
                                    cc.delayTime(0.2)
                                )))
                            }),
                            cc.moveTo(0.2,670,85)
                        ))
                    }
                    return true
                }
            })
        }

        shaobei.judge = true 
        createTouchEvent({
            item:shaobei,
            begin:function(data){
                return true 
            },
            move:function(data){
                var item = data.item 
                var delta = data.delta
                if(!item.noMove){
                    item.x += delta.x 
                    item.y += delta.y
                }

                if(rectIntersectsRect(item,cup) && item.judge){
                    item.judge = false 
                    item.noMove = true 
                    item.setScale(1.2)
                    item.setPosition(750,390)
                    
                    rightWater.runAction(cc.sequence(
                        cc.delayTime(0.1),
                        cc.callFunc(function(){
                            rightWater.runAction(cc.scaleTo(0.5,1))
                        }),
                        cc.moveTo(3,596,240),
                        cc.callFunc(function(){
                            jiantou1.stopAllActions()
                            jiantou1.setVisible(false)
                            //箭头
                            self.jiantou2 = createSp("#xiang1.png",cc.p(700,100),self)
                            self.jiantou2.runAction(cc.repeatForever(cc.sequence(
                                cc.delayTime(0.1),
                                cc.moveTo(0.2,690,110),
                                cc.delayTime(0.1),
                                cc.moveTo(0.2,700,100)
                            )))
                            gaiFun()
                            //提示说话
                            self.nodebs.say({key:"do_tip2",force:true})
                        })
                    ))
                    leftWater.runAction(cc.sequence(
                        cc.delayTime(1),
                        cc.callFunc(function(){
                            leftWater.runAction(cc.scaleTo(0.3,1))
                            jiantou1.runAction(cc.repeatForever(cc.sequence(
                                cc.callFunc(function(){
                                    jiantou1.setVisible(true)
                                    jiantou1.setPositionX(570)
                                }),
                                cc.moveTo(0.4,420,138),
                                cc.callFunc(function(){
                                    jiantou1.setVisible(false)
                                }),
                                cc.delayTime(0.2)
                            )))
                        }),
                        cc.moveTo(2,370,240)
                    ))
                    item.runAction(cc.sequence(
                        ani("daoshui%02d.png",22,0.15),
                        cc.callFunc(function(){
                            item.setPositionY(-700)
                        })
                    ))
                }
                
            }
        })

        var ani = function(frame,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: 1,
                end: end,
                time:time,
            }))
        }
        var aniRepeat = function(){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:"liu%02d.png",
                end: 2,
                time: 0.1
            })))
        }

        var  rectIntersectsRect = function (ra, rb) {
            var maxax = ra.x + ra.width/2,
                maxay = ra.y + ra.height/2,
                maxbx = rb.x + rb.width/2,
                maxby = rb.y + rb.height/2;
            return !(maxax < rb.x - rb.width/2 || 
                maxbx < ra.x - ra.width/2 || 
                maxay < rb.y - rb.height/2 ||
                maxby < ra.y - ra.height/2/2);
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do_tip1",img:res.do_tip1,sound:res.do_sound1},
            {key:"do_tip2",img:res.do_tip2,sound:res.do_sound2}
        ]
        this.addList = addList
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.do_tip3,
            sound: res.do_sound3,
            id:"result"
        })
    },
})