var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true;
    },

    initUI: function () {
        var self = this
        loadPlist("lazhu_plist")
        loadPlist("do2_hu_plist")
        loadPlist("do2_xi_plist")
        self.nodebs.show(function(){
            self.nodebs.say({key:"do2_tip1"})
        })
        var createSp = function (sprite,pos,father) {
            var sp = new cc.Sprite(sprite)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }
        createSp(res.tip_do2title, cc.p(600,600),self)
        //火焰动画
        var ani_huoyan = function() {
            return cc.repeatForever(cc.sequence(createAnimation({
                frame: "huoyan%02d.png",
                end: 8,
                time:0.2,
            })))
        }
        var lazhu1 = createSp("#lazhu.png",cc.p(400,100),self)
        var lazhu2 = createSp("#lazhu.png",cc.p(700,100),self)
        var huoyan1 = createSp("#huoyan01.png",cc.p(15,120),lazhu1)
        var huoyan2 = createSp("#huoyan01.png",cc.p(15,120),lazhu2)
        huoyan1.setAnchorPoint(0.5,0)
        huoyan2.setAnchorPoint(0.5,0)
        huoyan1.runAction(ani_huoyan())
        huoyan2.runAction(ani_huoyan())
        lazhu1.setScale(0.8)
        lazhu2.setScale(0.8)

        var btn_dao = new ccui.Button(res.btn_do2_normal,res.btn_do2_select)
        btn_dao.setPosition(1000,450)
        self.addChild(btn_dao)
        var btn_result = new ccui.Button(res.btn_result_normal,res.btn_result_select)
        btn_result.setPosition(1000,-350)//350
        self.addChild(btn_result)
        btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"do2_result"})
        })

        var bottle_hu = createSp("#do2_hu01.png",cc.p(437,430),self)
        var bottle_xi = createSp("#do2_xi01.png",cc.p(737,415),self)
        var hot1 = null
        var hot2 = null
        btn_dao.addClickEventListener(function(){
            btn_dao.setPositionY(-300)
            bottle_hu.runAction(cc.sequence(
                ani("do2_hu%02d.png",1,10,0.2),
                cc.moveTo(0.5,437,313),
                cc.delayTime(0.5),
                cc.callFunc(function(){
                    bottle_hu.setPosition(315,280)
                }),
                ani("do2_hu%02d.png",11,15,0.2),
                cc.delayTime(0.5),
                cc.moveTo(0.5,315,120),
                ani("do2_hu%02d.png",15,16,0.1),
                cc.delayTime(4),
                cc.callFunc(function(){
                    huoyan1.runAction(cc.sequence(
                        cc.scaleTo(0.5,0),
                        cc.callFunc(function(){
                            hot1 = hotFun(lazhu1)
                        }),
                        cc.delayTime(5),
                        cc.callFunc(function(){
                            hot1.runAction(cc.sequence(
                                cc.scaleTo(0.5,0),
                                cc.callFunc(function(){
                                    hot1.removeFromParent(true)
                                })
                            ))
                            huoyan1.stopAllActions()
                        })
                    ))
                })
            ))

            bottle_xi.runAction(cc.sequence(
                ani("do2_xi%02d.png",1,10,0.2),
                cc.moveTo(0.5,737,313),
                cc.delayTime(0.5),
                cc.callFunc(function(){
                    bottle_xi.setPosition(615,280)
                }),
                ani("do2_xi%02d.png",11,15,0.2),
                cc.delayTime(0.5),
                cc.moveTo(0.5,615,120),
                ani("do2_xi%02d.png",15,16,0.1),
                cc.delayTime(7),
                cc.callFunc(function(){
                    huoyan2.runAction(cc.sequence(
                        cc.scaleTo(0.5,0),
                        cc.callFunc(function(){
                            hot2 = hotFun(lazhu2)
                        }),
                        cc.delayTime(5),
                        cc.callFunc(function(){
                            hot2.runAction(cc.sequence(
                                cc.scaleTo(0.5,0),
                                cc.callFunc(function(){
                                    hot2.removeFromParent(true)
                                })
                            ))
                            btn_result.setPositionY(350)
                            huoyan2.stopAllActions()
                        })
                    ))
                })
            ))
        })

        //创建热气
        var hotFun = function(father){
            var hot = createWaterAir()
            hot.setPosition(14,125)
            hot.setScaleX(0.3)
            hot.setScaleY(0.5)
            hot.setOpacity(200)
            father.addChild(hot)
            return hot
        }
        

        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
            }))
        }

    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do2_tip1",img:res.do2_tip1,sound:res.do2_sound1},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
        addContent({
            people: this.nodebs,
            key: "do2_result",
            img: res.do2_result,
            sound: res.do2_result_sound,
            id: "result",
        })
    },
})