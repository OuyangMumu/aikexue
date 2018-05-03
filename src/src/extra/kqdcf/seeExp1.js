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
        var uiList = [
            "lazhu1","lazhu2","lazhu3","huoyan1","huoyan2","huoyan3",
            "cup1","cup2"
        ]
        var node = loadNode(res.kqdcf_seeExp1_json, uiList)
        self.inside_node.addChild(node)
        loadPlist("huoyan_plist")

        self.nodebs.show(function(){
            self.nodebs.say({key:"see_tip1"})
        })

        var btn_result = new ccui.Button(res.btn_get_normal,res.btn_get_select)
        btn_result.setPosition(1030,450)
        self.addChild(btn_result)
        btn_result.setVisible(false)

        btn_result.addClickEventListener(function(){
            if(btn_result.isVisible()){
                self.nodebs.say({key:"result"})
            }
        })

        var cupList = [node.cup1,node.cup2]
        var lazhuList = [node.lazhu1,node.lazhu2,node.lazhu3]
        var huoyanList = []
        for(var i in cupList){
            var cup = cupList[i]
            cup.index = i
            cup.judge = false
            cup.noMove = false
            cup.over = false
            cup.over2 = false  //蜡烛已经熄灭
            cup.time = 8 + i * 4
            cup.cup = cup.getChildren()[0]
            cup.cup.setLocalZOrder(-1)
            createTouchEvent({
                item:cup,
                begin:function(data){
                    return true
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta

                    if(item.over){
                        return false
                    }
                    if(!item.noMove){
                        item.x += delta.x 
                        item.y += delta.y
                    }else{
                        if(item.y + delta.y > 90){
                            item.y += delta.y
                            item.cup.y += delta.y
                            if(item.y < 95){
                                item.y = 90
                                item.over = true
                                item.runAction(cc.sequence(
                                    cc.delayTime(item.time),
                                    cc.callFunc(function(){
                                        item.lazhu.stopAllActions()
                                        item.over2 = true
                                        item.lazhu.runAction(cc.scaleTo(0.5,0))
                                        if(cupList[0].over2 && cupList[1].over2){
                                            btn_result.setVisible(true)
                                        }
                                    })
                                ))
                                cc.log("over over over")
                            }
                        }
                    }
                     

                    for(var j in lazhuList){
                        if(!item.judge && !lazhuList[j].over && checkdistans(item,lazhuList[j],40)){
                            cc.log("in in in")
                            item.judge = true
                            item.noMove = true
                            item.lazhu = huoyanList[j]
                            lazhuList[j].over = true
                            item.x = lazhuList[j].x
                            item.la = lazhuList[j]
                            changeFather({item:item.cup,father:node})
                            safeAdd(node, lazhuList[j])
                            safeAdd(node, item)
                            if(item.index == 0)
                                item.cup.setScale(0.65)
                        }else if(item.judge && item.y > 220 && item.y < 225){
                            cc.log("out out out")
                            item.judge = false 
                            item.noMove = false 
                            item.la.over = false
                            changeFather({item:item.cup,father:item})
                            if(item.index == 0)
                                item.cup.setScale(1)
                        }
                    }
                },
                end:function(data){

                }
            })
        }

        var aniRepeat = function(){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:"huoyan%02d.png",
                end: 11,
                time: 0.15
            })))
        }

        for(var i = 3 ; i < 6 ; i++){
            huoyanList.push(node[uiList[i]])
            node[uiList[i]].runAction(aniRepeat())
            lazhuList[i-3].over = false
        }

        var checkdistans = function(ra,rb,dis){
            var dx = ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis)
                return true
            else
                return false
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"see_tip1",img: res.see_tip1,sound:res.see_sound1},
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
            img: res.see_tip2,
            sound: res.see_sound2,
            id: "result"
        })
    },
})