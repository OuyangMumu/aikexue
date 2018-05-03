var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "seeExp1", 
    preLayer: "seeLayer", 
    ctor: function() { 
        this._super()
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("jiantou_plist")
        var uiList = [
            "btn_normal1","btn_normal2","btn_normal3",
            "btn_select1","btn_select2","btn_select3",
            "tip1","tip2","tip3",
            "water","bolang1","bolang2","huomen1",
            "huomen2","qilun"
        ]
        var node = loadNode(res.blfd_seeExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"see_tip1"})
        })

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        for(var i = 0 ; i < 3 ; i++){
            var normal = node[uiList[i]]
            normal.index = i
            createTouchEvent({
                item:normal,
                begin:function(data){
                    var index = data.item.index
                    for(var j = 0 ; j < 3 ; j++){
                        if(index == j){
                            node[uiList[j]].setVisible(false)
                            node[uiList[3+j]].setVisible(true)
                            node[uiList[6+j]].setVisible(true)
                            callFun(index)
                            self.nodebs.say({key:self.addList[index].key,force:true})
                        }else{
                            node[uiList[j]].setVisible(true)
                            node[uiList[3+j]].setVisible(false)
                            node[uiList[6+j]].setVisible(false)
                        }
                    }
                    return true
                }
            })
        }

        var callFun = function(index){
            removeTimer("key1")
            removeTimer("key2")
            removeTimer("key3")
            removeTimer("key4")
            acNode.stopAllActions()
            acNode.removeAllChildren(true)
            node.huomen1.stopAllActions()
            node.huomen1.setRotation(0)
            node.huomen2.stopAllActions()
            node.huomen2.setRotation(0)
            node.water.stopAllActions()
            switch(index){
                case 0:
                    acNode.runAction(cc.repeatForever(cc.sequence(
                        cc.callFunc(function(){
                            node.huomen1.stopAllActions()
                            node.huomen1.runAction(cc.rotateTo(0.5,0))
                            up()
                        }),
                        cc.delayTime(8),
                        cc.callFunc(function(){
                            node.huomen2.stopAllActions()
                            node.huomen2.runAction(cc.rotateTo(0.5,0))
                            down()
                        }),
                        cc.delayTime(8)
                    )))
                break
                case 1:
                    up()
                break
                case 2:
                    down()
                break
            }
        }

        var up = function(){
            node.bolang1.setSpriteFrame("bolang_up.png")
            node.bolang2.setSpriteFrame("bolang_up.png")
            node.water.setPositionY(60)
            node.water.runAction(cc.moveTo(5,560,120))
            node.qilun.stopAllActions()
            node.qilun.runAction(aniRepeat())
            node.huomen2.runAction(cc.sequence(
                cc.rotateTo(0.5,-45),
                cc.delayTime(8),
                cc.callFunc(function(){
                    node.qilun.stopAllActions()
                }),
                cc.rotateTo(0.3,0)
            ))
            fun("#jiantou3_01.png",cc.p(650,410),"jiantou3_%02d.png",23,1)
            fun("#jiantou2_01.png",cc.p(750,350),"jiantou2_%02d.png",23,2)
        }

        var down = function(){
            node.bolang1.setSpriteFrame("bolang_down.png")
            node.bolang2.setSpriteFrame("bolang_down.png")
            node.water.setPositionY(120)
            node.water.runAction(cc.moveTo(5,560,60))
            node.qilun.stopAllActions()
            node.qilun.runAction(aniRepeat())
            node.huomen1.runAction(cc.sequence(
                cc.rotateTo(0.5,-45),
                cc.delayTime(8),
                cc.callFunc(function(){
                    node.qilun.stopAllActions()
                }),
                cc.rotateTo(0.3,0)
            ))
            fun("#jiantou1_01.png",cc.p(570,400),"jiantou1_%02d.png",23,3)
            fun("#jiantou4_01.png",cc.p(440,350),"jiantou4_%02d.png",16,4)
        }

        var acNode = new cc.Node()
        acNode.setPosition(0,0)
        self.addChild(acNode)

        var ani = function(frame,end) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: 1,
                end: end,
                time: 0.12,
            }))
        }

        var aniRepeat = function(){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:"qilun%02d.png",
                end: 3,
                time: 0.15
            })))
        }

        var fun = function(img,pos,frame,end,key){
            addTimer({
                fun:function(){
                    var sp = createSp(img,pos,acNode)
                    sp.runAction(cc.sequence(
                        ani(frame,end),
                        cc.callFunc(function(){
                            sp.removeFromParent()
                            sp = null
                        })
                    ))
                },
                time:0.5,
                repeat:10,
                key: sprintf("key%d",key)
            })
        }

        callFun(0)      
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"see_tip1",sound:res.see_sound1},
            {key:"see_tip2",sound:res.see_sound2},
            {key:"see_tip3",sound:res.see_sound3}
        ]
        this.addList = addList
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                sound: addList[i].sound,
            })
        }
    },
})