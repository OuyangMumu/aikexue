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
        loadPlist("moca_plist")
        var uiList = [
            "btn_touch","glass","silk","jin1","jin2","hand","yandianqi",
        ]
        var node = loadNode(res.ydq_doExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
        })

        createTouchEvent({
            item:node.silk,
            begin:function(data){
                var item = data.item
                var pos = data.pos
                item.setTexture(res.silk2)
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta

                item.x += delta.x 
                item.y += delta.y
                if(checkdistans3(node.glass,item,120)){
                    item.setPositionY(-200)
                    item.removeListen()
                    var moca = new cc.Sprite("#moca01.png")
                    node.glass.setVisible(false)
                    moca.setPosition(300,300)
                    self.addChild(moca)
                    moca.runAction(cc.sequence(
                        cc.delayTime(0.2),
                        ani(),
                        aniRever(),
                        ani(),
                        aniRever(),
                        ani(),
                        aniRever(),
                        ani(),
                        aniRever(),
                        ani(),
                        aniRever(),
                        cc.callFunc(function(){
                            moca.setPositionY(-300)
                            node.glass.setVisible(true)
                            node.glass.setPosition(300,300)
                            node.glass.isTouch = true
                        })
                    ))
                }
            },
            end:function(data){
                var item = data.item
                item.setTexture(res.silk1)
            }
        })

        var btn_result = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
        btn_result.setPosition(1030,450)
        self.addChild(btn_result)
        btn_result.setVisible(false)
        btn_result.addClickEventListener(function(){
            if(btn_result.isVisible()){
                self.nodebs.say({key:"result"})
            }
        })

        var count = -1
        var roteteList = [60,45,30,0]
        var judgeCount = true
        //判断是否有说第二句话
        node.judge = true
        node.glass.isTouch = false
        createTouchEvent({
            item:node.glass,
            begin:function(data){
                var item = data.item
                var pos = data.pos
                if(!item.isVisible())
                    return false
                if(judgeOpInPos({item:item,pos:pos})){
                    return true
                }
                return false
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                item.x += delta.x 
                item.y += delta.y
                if(checkdistans2(item,node.yandianqi,100)){
                    if(judgeCount && item.isTouch && node.jin1.getRotation() == 0){
                        judgeCount = false
                        count++
                        if(count > 3)  count = 3
                        btn_result.setVisible(true)
                        node.jin1.runAction(cc.rotateTo(0.5,roteteList[count]))
                        node.jin2.runAction(cc.rotateTo(0.5,-(roteteList[count])))
                    }else if(!item.isTouch){
                        if(node.judge){
                            node.judge = false
                            self.nodebs.say({key:"do1_tip2",force:true})
                        }
                    }
                }
            },
            end:function(data){
                var item = data.item
            }
        })

        node.btn_touch.addClickEventListener(function(){
            judgeCount = true
            node.glass.setPosition(300,300)
            node.hand.stopAllActions()
            node.hand.runAction(cc.sequence(
                cc.moveTo(0.4,730,460),
                cc.delayTime(0.4),
                cc.callFunc(function(){
                    if(node.jin1.getRotation() != 0){
                        node.jin1.runAction(cc.rotateTo(0.3,0))
                        node.jin2.runAction(cc.rotateTo(0.3,0))
                    }
                }),
                cc.moveTo(0.4,730,700)
            ))
        })
        var checkdistans = function(ra,rb,dis){
            var dx = ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis)
                return true
            else
                return false
        }
        var checkdistans2 = function(ra,rb,dis){
            var dx = ra.x + 150 - rb.x
            var dy = ra.y + 150 - (rb.y + 160)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis)
                return true
            else
                return false
        }
        var checkdistans3 = function(ra,rb,dis){
            var dx = ra.x + 100 - (rb.x - rb.width/2)
            var dy = ra.y + 150 - (rb.y + rb.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            cc.log(distance)
            if(distance <= dis)
                return true
            else
                return false
        }
        var ani = function() {
            return cc.sequence(createAnimation({
                frame: "moca%02d.png",
                start: 1,
                end: 4,
                time:0.1,
            }))
        }
        var aniRever = function() {
            return cc.sequence(createAnimation({
                frame: "moca%02d.png",
                start: 1,
                end: 4,
                time:0.1,
                rever:true,
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
            {key:"do1_tip1",img:res.do1_tip1,sound:res.do1_sound1},
            {key:"do1_tip2",img:res.do1_tip2,sound:res.do1_sound2},
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
            key: "result",
            img: res.do1_tip3,
            sound: res.do1_sound3,
            id: "result"
        })
    },
})