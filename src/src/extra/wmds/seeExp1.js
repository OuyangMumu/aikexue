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
        loadPlist("see_plist")
        var self = this
        var uiList = [
            "btn_qie","btn_wo","btn_xin","btn_bei","hand_judge",
            "penBox","penHand","pen","black","brush","brushHand"
        ]
        var node = loadNode(res.wmds_seeExp1_json, uiList)
        self.inside_node.addChild(node)

        node.txt = new cc.LabelTTF("1.点击粉笔盒，拖动拿着粉笔的手\n到黑板左侧，点击可写按钮,即可\n在黑板上画,可切换粉笔颜色。\n2.点击黑板擦，可一次性将黑板擦干净。","",22)
        node.txt.setPosition(830,70)
        self.addChild(node.txt)

        node.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.callFunc(function(){
                self.nodebs.show(function(){
                    self.nodebs.say({key:"see_tip1"})
                })
            })
        ))

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp 
        }

        var curLocal = 0
        node.brush.setLocalZOrder(20)
        node.brush.draw = null
        //黑板檫
        createTouchEvent({
            item:node.brush,
            begin:function(data){
                var item = data.item
                //node.brushHand.setVisible(true)
                // if(item.draw){
                //     item.draw2 = item.draw 
                //     item.draw = null
                // }
                node.black.removeAllChildren(true)
                node.penHand.draw = null
                return true
            },
            // move:function(data){
            //     var item = data.item
            //     var delta = data.delta
            //     var pos = data.pos
            //     item.x += delta.x 
            //     item.y += delta.y
            //     if(rectContainsPoint(node.black,item)){
            //         if(!item.draw){
            //             item.draw = new cc.DrawNode()
            //             node.black.addChild(item.draw)
            //             item.draw.setLocalZOrder(curLocal++)
            //         }
            //         item.draw.drawDot(getBrushPos(),20,cc.color(0,51,51))
            //     }
            // },
            // end:function(data){
            //     var item = data.item
            //     node.brushHand.setVisible(false)
            // }
        })

        //粉笔
        var colorList = [cc.color(255,251,240,255),cc.color(0,255,0,255),cc.color(255,255,0,255),cc.color(255,0,255,255)]
        //移动粉笔
        node.penHand.draw = null
        createTouchEvent({
            item:node.penHand,
            begin:function(data){
                var item = data.item
                var pos = data.pos
                if(!item.isVisible())
                    return false
                // if(item.draw){
                //     item.draw2 = item.draw 
                //     item.draw = null
                // }
                item.myColor = colorList[item.curColor-1]
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                //var pos = data.pos
                item.x += delta.x 
                item.y += delta.y
                var pos = getPenPos()
                if(rectContainsPoint(node.black,pos)){
                    if(!item.draw){
                        item.draw = new cc.DrawNode()
                        node.black.addChild(item.draw)
                    }
                    item.penPos = getPenPos_toBalck()
                    if(item.canDraw)
                        item.draw.drawDot(item.penPos,3,item.myColor)
                }
            },
            end:function(data){
                var item = data.item
            }
        })

        var getPenPos = function(){
            //var pos = node.black.convertToNodeSpace(cc.p(node.penHand.x-72,node.penHand.y+32))
            return cc.p(node.penHand.x-72,node.penHand.y+32)
        }

        var getPenPos_toBalck = function(){
            var pos = node.black.convertToNodeSpace(cc.p(node.penHand.x-72,node.penHand.y+32))
            return pos
        }

        var getBrushPos = function(){
            var pos = node.black.convertToNodeSpace(cc.p(node.brush.x,node.brush.y))
            return pos
        }

        var drawFun = function(item){
            if(!item.draw){
                item.draw = new cc.DrawNode()
                //item.draw.setLocalZOrder(1)
                node.black.addChild(item.draw)
                item.myColor = colorList[item.curColor-1]
            }
        }

        //切换可写或不可写
        node.penHand.setLocalZOrder(30)
        changeFather({item:node.penHand,father:self})
        node.penHand.canDraw = false
        node.penHand.write = createSp("#pen_btn.png",cc.p(1030,440),self)
        node.penHand.write.setVisible(false)
        node.penHand.write.w = createSp("#pen_w1.png",cc.p(70,20),node.penHand.write)
        createTouchEvent({
            item:node.penHand.write,
            begin:function(data){
                var item = data.item
                if(!item.isVisible())   return false
                if(!node.penHand.canDraw){
                    node.penHand.canDraw = true
                    item.w.setSpriteFrame("pen_w2.png")
                }else{
                    node.penHand.canDraw = false
                    item.w.setSpriteFrame("pen_w1.png")
                }
                return true
            }
        })
        //点击取出粉笔
        createTouchEvent({
            item:node.penBox,
            begin:function(data){
                var item = data.item
                if(node.penHand.isVisible()){
                    item.setOpacity(250)
                    node.penHand.write.setVisible(false)
                    node.penHand.setVisible(false)
                    node.penHand.setPosition(1030,340)
                }else{
                    item.setOpacity(200)
                    node.penHand.write.setVisible(true)
                    node.penHand.setVisible(true)
                    node.penHand.curColor = getRand(4)[0]+1
                    node.pen.setSpriteFrame(sprintf("pen%d.png",node.penHand.curColor))
                }
            }
        })

        //小球弹跳
        var ball = createSp("#ball.png",cc.p(400,30),self)
        ball.hand = createSp("#hand_ball.png",cc.p(35,135),ball)
        ball.hand.setVisible(false)
        ball.tip = createSp("#ballImg.png",cc.p(180,60),ball)
        ball.setAnchorPoint(0.5,0)
        ball.judge = true
        createTouchEvent({
            item:ball,
            begin:function(){
                if(!ball.judge)     return false
                if(ball.tip){
                    ball.tip.removeFromParent(true)
                    ball.tip = null
                }
                ball.hand.setVisible(true)
                return true 
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                var posx = item.x + delta.x
                var posy = item.y + delta.y 
                if(posy > 28 && posy < 630){
                    item.x = posx
                    item.y = posy 
                }
            },
            end:function(data){
                var item = data.item
                ball.hand.setVisible(false)
                item.judge = false
                ball.begin = item.y / 2 
                removeTimer("key")
                addTimer({
                    fun:function(buf){
                        if(ball.y > ball.begin - 5){
                            if(ball.up)
                                ball.begin = ball.begin - ball.begin / 10
                            ball.up = false
                        }
                        if(ball.y <= 32){
                            ball.up = true
                            if(ball.begin - ball.begin / 10 < 2){
                                removeTimer("key")
                                ball.y = 30
                                ball.judge = true
                            }
                        }

                        if(ball.up){
                            ball.y = ball.y + 0.8
                        }else{
                            ball.y = ball.y - 1.5
                        }
                    },
                    time:0.002,
                    repeat:100000000000000000,
                    key:"key"
                })
            }
        })

        //四个按钮点击后，才可以提示说话
        node.label = null
        node.judgeList = [false,false,false,false]
        //左右手切换
        for(var i = 0 ; i < 4 ; i++){
            var btn = node[uiList[i]]
            btn.index = i 
            btn.addClickEventListener(function(selector,type){
                node.hand_judge.stopAllActions()
                node.judgeList[selector.index] = true
                node.one = true
                for(var i = 0 ; i < 4 ; i++){
                    if(!node.judgeList[i])
                        node.one = false
                }
                if(node.one){
                    self.nodebs.say({key:"see_tip2",force:true})
                    node.label = new cc.LabelTTF("我们拥有一双灵巧的手，可以做许多的事情。","",30)
                    self.addChild(node.label)
                    node.label.setPosition(570,580)
                }

                switch(selector.index){
                    case 0:
                       node.hand_judge.setScaleX(-node.hand_judge.getScaleX())
                       if(node.hand_judge.xin)
                            node.hand_judge.setSpriteFrame("handxin01.png")
                        else
                            node.hand_judge.setSpriteFrame("handbei01.png")
                    break
                    case 1:
                        if(node.hand_judge.xin){
                            node.hand_judge.runAction(cc.sequence(
                                ani("handxin%02d.png",6),
                                aniRever("handxin%02d.png",6)
                            ))
                        }else{
                            node.hand_judge.runAction(cc.sequence(
                                ani("handbei%02d.png",5),
                                aniRever("handbei%02d.png",5)
                            ))
                        }
                    break
                    case 2:
                        node.hand_judge.xin = true
                        node.hand_judge.setSpriteFrame("handxin01.png")
                    break
                    case 3:
                        node.hand_judge.xin = false
                        node.hand_judge.setSpriteFrame("handbei01.png")
                    break
                }
            })
        }

        var rectContainsPoint = function (rect, point) {
            return (point.x >= rect.x - rect.width/2 && 
                    point.x <= rect.x + rect.width/2 &&
                    point.y  >= rect.y - rect.height/2 && 
                    point.y <= rect.y + rect.height/2)
        }

        var ani = function(frame,end) {
            return cc.sequence(createAnimation({
                frame: frame,
                end: end,
                time:0.1
            }))
        }
        var aniRever = function(frame,end) {
            return cc.sequence(createAnimation({
                frame: frame,
                end: end,
                time:0.1,
                rever:true,
            }))
        }
    },

    initPeople : function(){
        var self = this
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1040, 90)
        })
        this.addChild(this.nodebs,99)
        this.addList = [
            {key:"see_tip1",sound:res.see_sound1},
            {key:"see_tip2",sound:res.see_sound2},
        ]
        for (var i = 0 ; i < self.addList.length ; i++) {
            addContent({
                people: this.nodebs,
                key: self.addList[i].key,
                sound: self.addList[i].sound,
            })
        }
    }
})