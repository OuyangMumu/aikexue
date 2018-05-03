var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp3", 
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
        loadPlist("do3_plist")
        loadPlist("liu_plist")
        var uiList = [
            "handle","shan1","shan2","shan3","shan4","jiantou","wenzi"
        ]
        var node = loadNode(res.bbyt_doExp3_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"do3_tip1"})
        })

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        //145,45   160,55
        node.jiantou.runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(0.3,160,55),
            cc.delayTime(0.1),
            cc.moveTo(0.3,145,45),
            cc.delayTime(0.1)
        )))

        var dianji = createSp("#dianji.png",cc.p(590,530),self)
        var wenzi = createSp("#wenzi.png",cc.p(560,380),self)
        dianji.setVisible(false)

        var shanList = [node.shan1,node.shan2,node.shan3,node.shan4]
        createTouchEvent({
            item: dianji,
            begin: function(data){
                node.jiantou.stopAllActions()
                node.wenzi.setPositionY(-500)
                dianji.setPositionY(-500)
                node.handle.runAction(ani("handle%02d.png",1,7,0.15))
                for(var i = 0 ; i < 4 ; i++){
                    shanList[i].runAction(aniRepeat())
                }
                var shuiliu = createSp("#shuiliu01.png",cc.p(492,160),self)
                shuiliu.runAction(cc.sequence(
                    ani("shuiliu%02d.png",1,14,0.2),
                    cc.callFunc(function(){
                        shanList[0].stopAllActions()
                        shanList[0].setSpriteFrame("part_8.png")
                    })
                ))
                var jiangliu = createSp("#jiangliu01.png",cc.p(532,160),self)
                jiangliu.runAction(cc.sequence(
                    ani("jiangliu%02d.png",1,24,0.2),
                    cc.callFunc(function(){
                        shanList[1].stopAllActions()
                        shanList[1].setSpriteFrame("part_8.png")
                    })
                ))
                var youliu = createSp("#youliu01.png",cc.p(568,160),self)
                youliu.runAction(cc.sequence(
                    ani("youliu%02d.png",1,22,0.3),
                    cc.callFunc(function(){
                        shanList[2].stopAllActions()
                        shanList[2].setSpriteFrame("part_8.png")
                    })
                ))
                var xiliu = createSp("#xiliu01.png",cc.p(605,160),self)
                xiliu.runAction(cc.sequence(
                    ani("xiliu%02d.png",1,33,0.35),
                    cc.callFunc(function(){
                        xiliu.setSpriteFrame("youliu22.png")
                        shanList[3].stopAllActions()
                        shanList[3].setSpriteFrame("part_8.png")

                        var btn_result = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
                        btn_result.setPosition(1000,400)
                        self.addChild(btn_result)
                        btn_result.addClickEventListener(function(){
                            self.nodebs.say({key:"result"})
                        })

                    })
                ))

                var fun = function(img,pos,t1,t2){
                    var myshui = createSp(img,pos,self)
                    myshui.setAnchorPoint(0.5,0)
                    myshui.setScaleY(0)
                    myshui.runAction(cc.sequence(
                        cc.delayTime(t1),
                        cc.scaleTo(t2,1,1)
                    ))
                }
                
                fun("#myshui.png",cc.p(450,22),2,1)
                fun("#myjiang.png",cc.p(490,22),2.5,2)
                fun("#myyou.png",cc.p(530,22),3.5,3)
                fun("#myxi.png",cc.p(572,22),4,5)

                return true
            }
        })

        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time
            }))
        }
        var aniRepeat = function(){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:"part_%d.png",
                start: 7,
                end: 8,
                time: 0.15
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
            img: res.do3_tip1,
            sound: res.do3_sound1,
        })
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.do3_tip2,
            sound: res.do3_sound2,
            id: "result"
        })
    },
})