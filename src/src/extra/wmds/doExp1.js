var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
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
        loadPlist("do_plist")
        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp 
        }

        var label = null    //显示文字

        createSp(res.zhuozi,cc.p(568,40),self)
        createSp(res.do_black,cc.p(568,350),self)

        var fdj = createFDJ({
            father: self,
            type:3,
            getPos: cc.p(500,60),
            hidebtn:true,
        })
        var fdj_small = fdj.get[0]
        var fdj_big = fdj.see[0]
        //fdj_big.setVisible(true)
        fdj_small.setVisible(true)

        fdj_big.setPosition(900,250)

        var paperHua = function(data){
            var pos = data.pos
            var img = data.img
            var sp = new cc.Sprite(img)
            sp.setScale(0.2)
            sp.setPosition(pos)
            sp.draw = null
            sp.myPos = pos
            sp.index = 0
            sp.dotList = []
            sp.paper = createSp("#paper1_2.png",cc.p(370,210),sp)
            sp.paper.setVisible(false)
            sp.paper.setScale(1.1)
            sp.ci1 = createSp("#cishi1.png",cc.p(0,400),sp)
            sp.ci2 = createSp("#cishi2.png",cc.p(750,400),sp)
            sp.ci1.setVisible(false)
            sp.ci2.setVisible(false)
            return sp
        }
        var paperYin = function(data){
            var pos = data.pos
            var img = data.img
            var sp = new cc.Sprite(img)
            sp.setScale(0.2)
            sp.setPosition(pos)
            sp.myPos = pos
            sp.index = 1
            sp.paper = createSp("#paper2_2.png",cc.p(370,210),sp)
            sp.paper.setVisible(false)
            sp.paper.setScale(1.1)
            sp.ci1 = createSp("#cishi3.png",cc.p(0,400),sp)
            sp.ci2 = createSp("#cishi4.png",cc.p(750,400),sp)
            sp.ci1.setVisible(false)
            sp.ci2.setVisible(false)
            sp.node = new cc.Node()
            sp.node.setPosition(0,0)
            sp.addChild(sp.node)
            return sp
        }

        var pen_fun = function(data){
            var pos = data.pos
            var img = data.img
            var sp = new cc.Sprite(img)
            sp.setScale(0.3)
            sp.setPosition(pos)
            sp.hand = createSp("#penHand.png",cc.p(435,6),sp)
            sp.hand.setVisible(false)
            sp.myPos = pos
            sp.key = "pen"
            sp.setLocalZOrder(40)
            return sp
        }

        var hand_fun = function(data){
            var pos = data.pos
            var img = data.img
            var sp = new cc.Sprite(img)
            sp.setScale(0.3)
            sp.setPosition(pos)
            sp.yin = createSp("#shouYin.png",cc.p(35,145),sp)
            sp.yin.setVisible(false)
            sp.ok = false
            sp.key = "hand"
            sp.setLocalZOrder(40)
            return sp
        }

        //第一张纸
        fdj.createNew({
            key: "paper_hua",
            fun: paperHua,
            buf:{
                pos:cc.p(150,60),
                img: "#paper1_1.png",
            }
        })
        var paper_hua = fdj.getOut("paper_hua")
        paper_hua.big = fdj.getIn("paper_hua")
        paper_hua.key = "paper_hua"
        paper_hua.draw = null //用于在这张纸上面画图
        //paper_hua.paper.setVisible(false)
        //第二张纸
        fdj.createNew({
            key: "paper_yin",
            fun: paperYin,
            buf:{
                pos:cc.p(350,60),
                img: "#paper2_1.png",
            }
        })
        var paper_yin = fdj.getOut("paper_yin")
        paper_yin.big = fdj.getIn("paper_yin")
        paper_yin.key = "paper_yin"
        //paper_yin.paper.setVisible(false)
        //笔
        fdj.createNew({
            key: "pen",
            fun: pen_fun,
            buf:{
                pos:cc.p(650,60),
                img: "#pen.png",
            }
        })
        var pen = fdj.getOut("pen")
        //手
        fdj.createNew({
            key: "hand",
            fun: hand_fun,
            buf:{
                pos:cc.p(850,60),
                img: "#hand.png",
            }
        })
        var hand = fdj.getOut("hand")

        //手移动的功能
        createTouchEvent({
            item:hand,
            begin:function(data){
                var item = data.item
                var pos = data.pos

                fdj.runData({
                    key:item.key,
                    fun:function(data){
                        var item = data.item
                        if(!item.myScale)
                            item.setScale(item.getScaleX()*5/3)
                    }
                })

                if(item.ok && paper_hua.getScaleX() == 0.5 && rectContainsPoint2(paper_hua,item)){
                    createDialog(res.dialog_3)
                }

                //把纸印黑
                if(item.ok && paper_yin.getScaleX() == 0.5 && rectContainsPoint2(paper_yin,hand)){
                    item.ok = false
                    
                    fdj.runData({
                        key:item.key,
                        fun:function(data){
                            var item = data.item
                            item.yin.setVisible(false) 
                        }
                    })
                    hand.num = getRand(4)[0]+1
                    var yinPos = paper_yin.convertToNodeSpace(cc.p(item.x - item.width/2 * item.getScaleX(),
                            item.y + item.height/2 * item.getScaleX() - 20))
                    fdj.runData({
                        key:"paper_yin",
                        fun:function(data){
                            var item = data.item
                            createSp(sprintf("#finger%d.png",hand.num),yinPos,item.node)
                        }
                    })

                    if(!label){
                        label = new cc.LabelTTF("指纹有三种基本类型---斗型、弓型和箕型。","",30)
                        self.addChild(label)
                        label.setPosition(570,580)
                        self.nodebs.say({key:"do_tip2",force:true})
                    }
                }

                //把手指印黑
                if(!item.ok && paper_hua.getScaleX() == 0.5 && rectContainsPoint2(paper_hua,item)){
                    if(paper_hua.draw){
                        //遍历黑点所在处
                        for(var i = 0 ; i < paper_hua.dotList.length ; i++){
                            if(checkdistans(paper_hua.dotList[i],getHandPos(item),10)){
                                item.ok = true
                                fdj.runData({
                                    key:item.key,
                                    fun:function(data){
                                        var item = data.item
                                        item.yin.setVisible(true) 
                                    }
                                })
                                break
                            }
                        }
                    }
                }
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                fdj.runData({
                    key:item.key,
                    fun:function(data){
                        var item = data.item
                        data.delta = delta
                        item.x += delta.x
                        item.y += delta.y
                    }
                })
            },
            end:function(data){
                var item = data.item
                fdj.runData({
                    key:item.key,
                    fun:function(data){
                        var item = data.item
                        if(item.y < 100){
                            item.setPosition(850,60)
                            item.setScale(item.getScaleX()*3/5)
                            item.myScale = false
                        }else{
                            item.myScale = true
                        }
                    }
                })
            }   
        })

        var local = 1
        //笔的移动功能
        createTouchEvent({
                item:pen,
                begin:function(data){
                    var item = data.item
                    item.judge = false
                    fdj.runData({
                        key:item.key,
                        fun:function(data){
                            var item = data.item
                            item.hand.setVisible(true)
                            if(!item.myScale)
                                item.setScale(item.getScale()*5/3)
                        }
                    })
                    return true
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta

                    if(paper_hua.getLocalZOrder() <= paper_yin.getLocalZOrder() && 
                        rectIntersectsRect(paper_hua,paper_yin) && 
                        rectContainsPoint(paper_hua,item)){
                        if(!item.judge){
                            createDialog(res.dialog_1)
                            item.judge = true
                        }
                        return false
                    }

                    fdj.runData({
                        key:item.key,
                        fun:function(data){
                            var item = data.item
                            item.x += delta.x
                            item.y += delta.y
                            data.delta = delta

                            if(paper_hua.getScaleX() == 0.5 && rectContainsPoint(paper_hua,item)){
                                fdj.runData({
                                    key:"paper_hua",
                                    fun:function(data){
                                        var item = data.item
                                        if(!item.draw){
                                            item.draw = new cc.DrawNode()
                                            item.addChild(item.draw)
                                        }
                                        var penPos = getPenPos()
                                        item.draw.drawDot(penPos,5,cc.color(0,0,0))
                                        item.dotList.push(penPos)
                                    }
                                })
                            }
                        }
                    })

                    if(paper_yin.getScaleX() == 0.5 && rectContainsPoint(paper_yin,item)){
                        if(!item.judge){
                            item.judge = true
                            createDialog(res.dialog_2)
                        }
                    }
                },
                end:function(data){
                    var item = data.item
                    fdj.runData({
                        key:item.key,
                        fun:function(data){
                            var item = data.item
                            if(item.y > 100){
                                item.myScale = true
                            }else{
                                item.setScale(item.getScale()*3/5)
                                item.myScale = false
                                item.hand.setVisible(false)
                                item.setPosition(item.myPos)
                            }
                        }
                    })
                }
        })

        var rectContainsPoint3 = function (rect, point) {
            return (point.x >= rect.x - rect.width/2 * rect.getScaleX() + 20 && 
            point.x <= rect.x + rect.width/2 * rect.getScaleX() - 20 &&
            point.y >= rect.y - rect.height/2 * rect.getScaleX() + 20 && 
            point.y <= rect.y + rect.height/2 * rect.getScaleX() - 20 )
        }

        var getHandPos = function(item){
            var pos = paper_hua.convertToNodeSpace(cc.p(item.x - item.width/2 * item.getScaleX(),
                item.y + item.height/2 * item.getScaleX() - 20))
            return pos
        }
        var getPenPos = function(){
            var pos = paper_hua.convertToNodeSpace(cc.p(pen.x + 5 -pen.width/2 * pen.getScaleX(),pen.y 
                - 10 +pen.height/2 * pen.getScaleX()))
            return pos
        }

        //两张纸同步移动
        var paperList = [paper_hua,paper_yin]
        for(var i = 0 ; i < 2 ; i++){
            var paper = paperList[i]
            paper.index = i
            createTouchEvent({
                item:paper,
                begin:function(data){
                    var item = data.item
                    var index = data.index
                    fdj.runData({
                        key:item.key,
                        fun:function(data){
                            var item = data.item
                            item.setLocalZOrder(local++)
                            item.paper.setVisible(false)
                            item.ci1.setVisible(false)
                            item.ci2.setVisible(false)
                            if(!item.myScale)
                                item.setScale(item.getScale()*5/2)
                        }
                    })
                    return true
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta
                    fdj.runData({
                        key:item.key,
                        fun:function(data){
                            var item = data.item
                            data.delta = delta
                            item.x += delta.x
                            item.y += delta.y
                        }
                    })
                },
                end:function(data){
                    var item = data.item
                    var index = data.index
                    fdj.runData({
                        key:item.key,
                        fun:function(data){
                            var item = data.item
                            if(item.y > 100){
                                item.paper.setVisible(true)
                                item.ci1.setVisible(true)
                                item.ci2.setVisible(true)
                                item.myScale = true
                            }else{
                                item.setScale(item.getScale()*2/5)
                                item.myScale = false
                                item.setPosition(item.myPos)
                                if(item.index == 0){
                                    if(item.draw){
                                        item.dotList = []
                                        item.draw.removeFromParent(true)
                                        item.draw = null
                                    }
                                }else{
                                    item.node.removeAllChildren(true)
                                }
                            }

                        }
                    })

                }
            })
        }

        //放大镜移动放大功能
        createTouchEvent({
            item:fdj_small,
            begin:function(data){
                var item = data.item
                fdj_big.setVisible(true)
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                fdj.move(delta)
            },
            end:function(data){
                var item = data.item
                fdj_big.setVisible(false)
            }
        })

        var rectContainsPoint = function (rect, point) {
            return (point.x - point.width/2 * point.getScaleX() >= rect.x - rect.width/2 * rect.getScaleX() + 20 && 
            point.x - point.width/2 * point.getScaleX() <= rect.x + rect.width/2 * rect.getScaleX() - 20 &&
            point.y + point.height/2 * point.getScaleX() >= rect.y - rect.height/2 * rect.getScaleX() + 20 && 
            point.y + point.height/2 * point.getScaleX() <= rect.y + rect.height/2 * rect.getScaleX() - 20 )
        }

        var rectContainsPoint2 = function (rect, point) {
            return (point.x - point.width/2 * point.getScaleX() >= rect.x - rect.width/2 * rect.getScaleX() - 20 && 
            point.x - point.width/2 * point.getScaleX() <= rect.x + rect.width/2 * rect.getScaleX() - 20 &&
            point.y + point.height/2 * point.getScaleX() - 20 >= rect.y - rect.height/2 * rect.getScaleX() + 20 && 
            point.y + point.height/2 * point.getScaleX() - 20<= rect.y + rect.height/2 * rect.getScaleX() - 20 )
        }

        var checkdistans = function(ra,rb,dis){
            var dx =  ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis){
                return true
            }else
                return false
        }

        var  rectIntersectsRect = function (ra, rb) {
            var maxax = ra.x + ra.width/2 * ra.getScaleX(),
                maxay = ra.y + ra.height/2 * ra.getScaleX(),
                maxbx = rb.x + rb.width/2 * rb.getScaleX(),
                maxby = rb.y + rb.height/2 * rb.getScaleX();
            return !(maxax < rb.x - rb.width/2 * rb.getScaleX() || 
                maxbx < ra.x - ra.width/2 * ra.getScaleX() || 
                maxay < rb.y - rb.height/2 * rb.getScaleX() ||
                maxby < ra.y - ra.height/2 * ra.getScaleX());
        }

        var createDialog = function(img){
            AddDialog("Tips", {
                res: img,
                face: 2,
                confirmBtn:true,
            })
        }

        paper_hua.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.callFunc(function(){
                self.nodebs.show(function(){
                    self.nodebs.say({key:"do_tip1"})
                })
            })
        ))
    },

    initPeople : function(){
        var self = this
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1030, 130)
        })
        this.addChild(this.nodebs,99)
        this.addList = [
            {key:"do_tip1",sound:res.do_sound1},
            {key:"do_tip2",sound:res.do_sound2},
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