var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
    preLayer: "doLayer",
    myDelete: function() { //删除时调用
        var self = this
        this._super()
        if(self.biaoge){
            cc.log("calling")
            self.biaoge.removeFromParent(false)
        }
    },
    ctor: function () {
        this._super();
        var self = this
        this.expCtor({
            vis: false,
            setZ:99,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun:function(){
                    if(!biaoge){
                        var bg = createBiaoge({
                            json: res.shsyydbj_tableNode_json,
                            scale:0.9,
                            inputNum: 3,
                        })
                        biaoge = bg
                        biaoge.retain()
                    }
                    safeAdd(self, biaoge)
                    self.biaoge = biaoge
                    biaoge.show()
                },
            }
        });
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        loadPlist("sb_plist")
        var uiList = ["soil","water","sb_soil","sb_water","mt1","mt2",
                        "sg_soil","sg_water","wenzi"
        ]
        var node = loadNode(res.shsyydbj_do2_json,uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"do2_tip1"})
        })
        node.sb_water.over = false
        node.sb_soil.over = false
        var sbList = [node.sb_soil,node.sb_water]
        for (var i = 0; i < sbList.length ; i++) {
            sbList[i].index = i
            createTouchEvent({
                item:sbList[i],
                rect:cc.rect(0,0,131,147),
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    item.beginPos = item.getPosition()
                    if(index == 1)
                        item.setSpriteFrame("sb_water2.png")
                    else
                        item.setSpriteFrame("sb_soil2.png")
                    return true
                },
                move:function(data){
                    var item = data.item
                    var index = item.index
                    var delta = data.delta
                    if(index == 0 && checkDistance(item,node.sb_water) && item.isVisible()){
                        item.removeListen()
                        node.sb_water.removeListen()
                        node.sb_water.over = true
                        item.setVisible(false)
                        item.setPosition(item.beginPos)
                        node.sb_water.runAction(cc.sequence(
                            anisb("water_sb%02d.png",13),
                            cc.callFunc(function(){
                                item.setSpriteFrame("soil_null.png")
                                item.setVisible(true)
                            })
                        ))
                    }
                    if(index == 1 && checkDistance(item,node.sb_soil) && item.isVisible()){
                        item.removeListen()
                        node.sb_soil.removeListen()
                        item.setVisible(false)
                        node.sb_soil.over = true
                        item.setPosition(item.beginPos)
                        node.sb_soil.runAction(cc.sequence(
                            anisb("soil_sb%02d.png",12),
                            cc.callFunc(function(){
                                item.setSpriteFrame("water_null.png")
                                item.setVisible(true)
                            })
                        ))
                    }
                    item.x += delta.x 
                    item.y += delta.y
                },
                end:function(data){
                    var item = data.item
                    var index = item.index
                    item.setPosition(item.beginPos)
                    if(index == 1)
                        item.setSpriteFrame("water_sb01.png")
                    else
                        item.setSpriteFrame("soil_sb01.png")
                }
            })
        }

        var anisb = function(frame,end) {
            return cc.sequence(createAnimation({
                frame: frame,
                end: end,
                time:0.17
            }), cc.callFunc(function() {
                judgeOver()
            }))
        }

        var checkDistance = function(ra,rb){
            var dx = (ra.x-ra.width/2) - rb.x+80
            var dy = (ra.y-90) - rb.y+40
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < 100){
                return true
            }else{
                return false
            }
        }

        node.sg_soil.over = false
        node.sg_water.over = false
        var mtList = [node.mt1,node.mt2]
        for (var i = 0; i < sbList.length ; i++) {
            mtList[i].index = i
            createTouchEvent({
                item:mtList[i],
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    var pos = data.pos
                    if(item.getRotation() != 0)
                        item.setRotation(0)
                    item.setPosition(pos)
                    return true
                },
                move:function(data){
                    var item = data.item
                    var index = item.index
                    var delta = data.delta
                    item.x += delta.x 
                    item.y += delta.y

                    if(checkDistance2(item,node.sg_soil) && !node.sg_soil.over){
                        node.sg_soil.over = true
                        var sg = node.sg_soil
                        item.removeListen()
                        item.setPosition(sg.x,sg.y+240)
                        item.runAction(cc.sequence(
                            cc.moveTo(0.8,sg.x,sg.y-20),
                            cc.delayTime(0.2),
                            cc.moveTo(0.5, sg.x, sg.y),
                             cc.callFunc(function(){judgeOver()})
                        ))
                        node.soil.runAction(cc.sequence(
                            cc.delayTime(0.4),
                            cc.scaleTo(0.4, 0.95, 0.75),
                            cc.delayTime(0.3),
                            cc.scaleTo(0.4, 0.95, 0.70)
                        ))
                    }
                    if(checkDistance2(item,node.sg_water) && !node.sg_water.over){
                        node.sg_water.over = true
                        var sg = node.sg_water
                        item.removeListen()
                        item.setPosition(sg.x,sg.y+240)
                        item.runAction(cc.sequence(
                            cc.moveTo(0.8,sg.x,sg.y-20),
                            cc.delayTime(0.2),
                            cc.moveTo(0.5, sg.x, sg.y+40),
                            cc.callFunc(function(){judgeOver()})
                        ))
                        node.water.runAction(cc.sequence(
                            cc.delayTime(0.4),
                            cc.scaleTo(0.4, 0.95, 0.70),
                            cc.delayTime(0.3),
                            cc.scaleTo(0.4, 0.95, 0.60)
                        ))
                    }
                },
                end:function(data){
                    var item = data.item
                    var index = item.index
                    
                }
            })
        }

        var judgeOver = function(){
            if(node.sg_soil.over && node.sg_water.over && 
                (node.sb_soil.over || node.sb_water.over)){
                node.wenzi.setVisible(true)
                self.nodebs.say({key:"do2_tip2",force:true})
            }
        }

        var checkDistance2 = function(ra,rb){
            var dx = ra.x - rb.x
            var dy = (ra.y-ra.height/2) - (rb.y+rb.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < 30){
                return true
            }else{
                return false
            }
        }
        
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        
        addContent({
            people: this.nodebs,
            key: "do2_tip1",
            img: res.do2_tip1,
            sound: res.do2_sound1,
        })
        addContent({
            people: this.nodebs,
            key: "do2_tip2",
            sound: res.do2_sound2,
        })
    },
})