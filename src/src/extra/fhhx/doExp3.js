var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp3",
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
        loadPlist("daoshui_plist")
        loadPlist("huchu_plist")
        loadPlist("xiru_plist")
        self.nodebs.show(function(){
            self.nodebs.say({key:"do3_tip1"})
        })
        var createSp = function (sprite,pos,father) {
            var sp = new cc.Sprite(sprite)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }
        createSp(res.tip_do3title, cc.p(600,600),self)
        var btn_dao = new ccui.Button(res.btn_do3_normal,res.btn_do3_select)
        btn_dao.setPosition(1000,450)
        self.addChild(btn_dao)
        var btn_tips = new ccui.Button(res.btn_tips_normal,res.btn_tips_select)
        btn_tips.setPosition(1000,380)
        self.addChild(btn_tips)
        var btn_result = new ccui.Button(res.btn_result_normal,res.btn_result_select)
        btn_result.setPosition(1000,-300)
        self.addChild(btn_result)

        btn_tips.addClickEventListener(function() {
            self.answerImg.show()
        })
        btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"do3_result"})
        })

        var shihui1 = createSp("#daoshui01.png", cc.p(380,350), self)
        var shihui2 = createSp("#daoshui01.png", cc.p(680,350), self)
        var huchu = createSp("#huchu01.png", cc.p(450,180), self)
        var xiru = createSp("#xiru01.png", cc.p(750,185), self)
        btn_dao.addClickEventListener(function(){
            btn_dao.setPositionY(-300)
            shihui1.runAction(cc.sequence(
                cc.delayTime(0.5),
                cc.callFunc(function(){
                    huchu.runAction(cc.sequence(
                        ani("huchu%02d.png",1,5,0.3),
                        cc.delayTime(1),
                        ani("huchu%02d.png",5,16,0.3),
                        cc.delayTime(0.5),
                        cc.callFunc(function(){
                            huchu.runAction(ani_yaohuang("huchu%02d.png",17,20,0.08))
                        })
                    ))
                }),
                cc.moveTo(0.8,450,280),
                ani("daoshui%02d.png",1,20,0.24),
                cc.callFunc(function(){
                    shihui1.setPositionY(-600)
                }),
                cc.delayTime(5),
                cc.callFunc(function(){
                    huchu.stopAllActions()
                    huchu.runAction(ani("huchu%02d.png",21,23,0.8))
                })
            ))

            shihui2.runAction(cc.sequence(
                cc.delayTime(0.5),
                cc.callFunc(function(){
                    xiru.runAction(cc.sequence(
                        ani("xiru%02d.png",1,5,0.3),
                        cc.delayTime(1),
                        ani("xiru%02d.png",5,16,0.3),
                        cc.delayTime(0.5),
                        cc.callFunc(function(){
                            xiru.runAction(ani_yaohuang("xiru%02d.png",17,20,0.08))
                        })
                    ))
                }),
                cc.moveTo(0.8,750,280),
                ani("daoshui%02d.png",1,20,0.24),
                cc.callFunc(function(){
                    shihui2.setPositionY(-600)
                }),
                cc.delayTime(5),
                cc.callFunc(function(){
                    xiru.stopAllActions()
                    xiru.runAction(ani("xiru%02d.png",16,16,0.8))
                    btn_result.setPositionY(300)
                })
            ))
        })

        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
            }))
        }
        var ani_yaohuang = function(frame,start,end,time) {
            return cc.repeatForever(cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
            })))
        }
    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        addContent({
            people: this.nodebs,
            key: "do3_tip1",
            sound: res.do3_sound1,
            img: res.do3_tip1
        })
        addContent({
            people: this.nodebs,
            key: "do3_result",
            img: res.do3_result,
            sound: res.do3_result_sound,
            id: "result",
        })
        this.answerImg = createShowImg({
            img:res.do3_tips,
        })
        safeAdd(this, this.answerImg)
    }
})