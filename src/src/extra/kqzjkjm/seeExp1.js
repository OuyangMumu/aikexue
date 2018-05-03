var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "seeExp1", 
    preLayer: "seeLayer", 
    ctor: function() { 
        this._super();
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("chuiqi_plist")

        self.nodebs.show(function(){
            self.nodebs.say({key:"see1_tip1"})
        })

        var btn_result = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
        btn_result.setPosition(1000,450)
        self.addChild(btn_result)
        btn_result.setVisible(false)
        btn_result.addClickEventListener(function(){
            if(btn_result.isVisible()){
                self.nodebs.say({key:"result"})
            }
        })

        var createSp = function(res,pos,father){
            var sp = new cc.Sprite(res)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        createSp("#pingzi2.png",cc.p(400,327),self)
        var guanzi = createSp("#guanzi.png",cc.p(445,450),self)//445,260
        createSp("#pingzi.png",cc.p(400,200),self)
        var child = createSp("#chuiqi01.png",cc.p(610,400),self)
        var water = createSp("#water.png",cc.p(400,220),self)//140
        var penshui = createSp("#penshui01.png",cc.p(392,440),self)
        penshui.setScale(1.3)
        penshui.setVisible(false)

        var btn_chui = new ccui.Button(res.btn_see1_3,res.btn_see1_4)
        btn_chui.setPosition(850,350)
        self.addChild(btn_chui)
        var btn_fu = new ccui.Button(res.btn_see1_1,res.btn_see1_2)
        btn_fu.setPosition(850,270)
        self.addChild(btn_fu)
        btn_fu.setVisible(false)
        btn_chui.setVisible(false)

        btn_chui.addClickEventListener(function(){
            if(btn_chui.isVisible()){
                btn_chui.setVisible(false)
                child.runAction(cc.sequence(
                    ani("chuiqi%02d.png",1,18,0.15),
                    cc.callFunc(function(){
                        btn_fu.setVisible(true)
                        btn_result.setVisible(true)
                        penshui.stopAllActions()
                        penshui.setVisible(false)
                    })
                ))
                water.runAction(cc.sequence(
                    cc.delayTime(0.5),
                    cc.callFunc(function(){
                        penshui.setVisible(true)
                        penshui.runAction(aniRepeat("penshui%02d.png"))
                    }),
                    cc.moveTo(2,400,140)
                ))
            }
        })

        btn_fu.addClickEventListener(function(){
            if(btn_fu.isVisible()){
                btn_fu.setVisible(false)
                btn_chui.setVisible(true)
                water.setPositionY(220)
            }
            
        })

        guanzi.runAction(cc.sequence(
            cc.moveTo(1,445,260),
            cc.callFunc(function(){
                btn_chui.setVisible(true)
            })
        ))

        var aniRepeat = function(frame){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:frame,
                end: 3,
                time: 0.1
            })))
        }

        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time
            }))
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"see1_tip1",img: res.see1_tip1,sound:res.see1_sound1},
        ]
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
            img: res.see1_tip2,
            sound: res.see1_sound2,
            id: "result"
        })
    },
})