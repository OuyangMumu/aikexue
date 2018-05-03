var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super();
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("turn_plist")
        var uiList = [
            "xianquan","arrow1","arrow2","arrow3","arrow4",
            "speed_1","speed_2","speed_3","curSpeed",
            "hand","light","hand2"
        ]
        var node = loadNode(res.fdj_doExp1_json, uiList)
        self.inside_node.addChild(node)

        var btn_result = new ccui.Button(res.btn_result_normal,res.btn_result_select)
        btn_result.setPosition(1030,450)
        self.addChild(btn_result)
        btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"result"})
        })

        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })

        var speedList = [node.speed_1,node.speed_2,node.speed_3]
        for(var i = 0 ; i < 3 ; i++){
            var speed = speedList[i]
            speed.index = i
            createTouchEvent({
                item:speed,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    if(curIndex == index)   return false 
                    curIndex = index
                    if(!judgeHand)
                        action()
                    node.curSpeed.setPosition(item.getPosition())
                }
            })
        }

        //开始
        var firstSay = true
        var judgeHand = true
        createTouchEvent({
            item:node.hand,
            begin:function(data){
                var item = data.item
                if(judgeHand){
                    if(!node.light.isVisible()){
                        for(var i = 0 ; i < list.length ; i++){
                            list[i].setVisible(true)
                        }
                    }
                    judgeHand = false
                    action()
                    if(firstSay){
                        firstSay = false
                        node.hand.runAction(cc.sequence(
                            cc.delayTime(1.5),
                            cc.callFunc(function(){
                                self.nodebs.say({key:"do_tip2",force:true})
                            })
                        ))
                    }
                    return true
                }
                return false
            }
        })

        var list = [node.arrow1,node.arrow2,node.arrow3,node.arrow4,node.light,node.xianquan]
        //停止
        createTouchEvent({
            item:node.hand2,
            begin:function(data){
                var item = data.item
                if(!judgeHand){
                    judgeHand = true
                    for(var i = 0 ; i < list.length ; i++){
                        list[i].stopAllActions()
                        list[i].setVisible(false)
                    }
                    node.xianquan.setVisible(true)
                    node.xianquan.setSpriteFrame("xianquan16.png")
                    return true
                }
                return false
            }
        })

        var curIndex = 0
        var timeList = [0.1,0.06,0.02]
        var action = function(){
            for(var i = 0 ; i < list.length ; i++){
                list[i].stopAllActions()
            }
            node.xianquan.runAction(cc.repeatForever(ani("xianquan%02d.png",1,15,timeList[curIndex])))
            
            node.arrow3.runAction(cc.repeatForever(ani("arrow1_%02d.png",1,16,timeList[curIndex])))

            node.arrow4.runAction(cc.repeatForever(ani("arrow1_%02d.png",1,16,timeList[curIndex])))
            
            node.arrow1.runAction(cc.repeatForever(ani("arrow2_%02d.png",1,16,timeList[curIndex])))

            node.arrow2.runAction(cc.repeatForever(ani("arrow2_%02d.png",1,16,timeList[curIndex])))

            node.light.runAction(cc.repeatForever(ani("light%02d.png",1,3,timeList[curIndex])))
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
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)

        var addList = [
            {key:"do_tip1",img:res.do_tip1,sound:res.do_sound1},
            {key:"do_tip2",img:res.do_tip2,sound:res.do_sound2},
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
            img: res.do_tip3,
            sound: res.do_sound3,
            id: "result",
        })
    }
})