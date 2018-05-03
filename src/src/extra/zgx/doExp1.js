var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer",
    myEnter: function() {
        loadPlist("bottle3_1_plist")
        loadPlist("bottle3_2_plist")
        loadPlist("bottle2_1_plist")
        loadPlist("bottle2_2_plist")
        loadPlist("bottle1_1_plist")
        loadPlist("bottle1_2_plist")
        loadPlist("part_plist")
    },
    ctor: function() {
        this._super()
        var self = this
        this.expCtor({
            setZ:999,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    if(!self.bgg) {
                        var bg = createBiaoge({
                            json: res.zgx_tableNode_json,
                            scale: 0.9,
                            inputNum:7,
                        })
                        self.addChild(bg)
                        self.bgg = bg
                    }
                    var bg = self.bgg
                    bg.show()
                }
            }
        })
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        var hand = new cc.Sprite(res.hand)
        hand.setPosition(850,340)
        self.addChild(hand,10)

        var wz1 = new cc.Sprite(res.do_wz1)
        wz1.setPosition(568,460)
        self.addChild(wz1)
        var wz2 = new cc.Sprite(res.do_wz2)
        wz2.setPosition(568,430)
        self.addChild(wz2)
        wz1.setVisible(false)
        wz2.setVisible(false)

        var judgeSay = [true,true]
        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })

        var sayFun = function(){
            wz1.runAction(cc.sequence(
                cc.delayTime(15),
                cc.callFunc(function(){
                    if(judgeSay[0]){
                        self.nodebs.say({key:"do_tip2",force:true})
                    }
                })
            ))
        }
        

        var curBottle = null //当前所放的瓶子
        var jiandao = null // 剪刀
        createTouchEvent({
            item:hand,
            begin:function(data){
                var item = data.item
                if(!item.isVisible())
                    return false
                return true
            },
            move:function(data){
                var item = data.item 
                var delta = data.delta
                if(item.isVisible()){
                    item.x += delta.x 
                    item.y += delta.y
                }
                if(curBottle){
                    if(item.isVisible() && !curBottle.over && checkdistans(item,curBottle,150)){
                        judgeSay[0] = false//判断是否已经提示说了第二句话
                        curBottle.draw = false
                        item.setVisible(false)
                        item.setPosition(850,340)
                        item.ani = "bottle"+(curBottle.index+1)+"_%02d.png"
                        curBottle.stopAllActions()
                        curBottle.runAction(cc.sequence(
                            ani(item.ani,3,6),
                            ani(item.ani,5,6),
                            ani(item.ani,5,6),
                            ani(item.ani,5,6),
                            ani(item.ani,5,6),
                            ani(item.ani,5,6),
                            cc.delayTime(0.8),
                            ani(item.ani,7,11),
                            cc.delayTime(0.8),
                            ani(item.ani,12,15),
                            ani(item.ani,14,15),
                            ani(item.ani,14,15),
                            ani(item.ani,14,15),
                            ani(item.ani,14,15),
                            ani(item.ani,14,14),
                            cc.delayTime(0.8),
                            cc.callFunc(function(){
                                curBottle.runAction(aniRepeat(item.ani,1,2))
                                item.setVisible(true)
                                curBottle.draw = true
                                wz1.setVisible(true)
                                if(judgeSay[1]){
                                    judgeSay[1] = false
                                    self.nodebs.say({key:"do_tip3",force:true})
                                }
                            })
                        ))
                    }
                }
            }
        })
        var toolbtn = createTool({
            pos: cc.p(290, 550),
            nums: 4,
            scale:0.7,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -10),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            //arrow:true,
            father: self,
            counts: [99, 99, 99, 1],
            swallow: [true, true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3, res.do_tools4],
            gets: ["#bottle1_01.png","#bottle2_01.png","#bottle3_01.png",res.jiandao],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                if(index != 3){
                    if(judgeSay[0]){
                        sayFun()
                    }
                    judgeBottle()
                    item.index = index
                    item.first = true // 是否是第一次点击出来
                    item.draw = true  //判断是否用手在抓
                    curBottle = item
                    item.over = false  //判断是否已经被剪开完成所有操作
                }else if(index == 3){
                    jiandao = item
                }
                return item
            },
            clickfun: function(data){
                var item = data.sp 
                var index = data.index
                var pos = data.pos
                if(item.noMove)
                    return false
                var result = judgeOpInPos({
                    item:item,
                    pos:pos,
                })//像素判定
                cc.log(result)
                return result
            },
            movefun: function(data){
                var item = data.sp 
                var index = data.index
                var delta = data.delta
                item.x += delta.x
                item.y += delta.y
                if(index == 3){
                    if(curBottle){
                        if(!curBottle.over && curBottle.draw && checkdistans(item,curBottle,80)){
                            item.setVisible(false)
                            judgeSay[1] = false
                            judgeSay[0] = false
                            curBottle.over = true
                            item.ani = "bottle"+(curBottle.index+1)+"_%02d.png"
                            curBottle.stopAllActions()
                            curBottle.runAction(cc.sequence(
                                ani(item.ani,16,45),
                                cc.callFunc(function(){
                                    item.setVisible(true)
                                    item.setPosition(290,100)
                                    wz2.setVisible(true)
                                })
                            ))
                        }
                        
                    }
                }
            },
            outfun: function(data){
                var item = data.sp
                var index = data.index
                if(index != 3 && item.first){
                    item.first = false
                    item.setPosition(568,200)
                    var name = "bottle"+(index+1)+"_%02d.png"
                    item.runAction(aniRepeat(name,1,2))
                }else if(index == 3){
                    item.setPosition(290,100)
                }
            },
            backfun: function(data){
                var item = data.sp 
                var index = data.index
                if(index != 3){
                    judgeBottle()
                }else if(index == 3){
                    jiandao = null
                }
                return true 
            }
        })

        self.inside_node.addChild(toolbtn,1)
        self.toolbtn = toolbtn
        toolbtn.show()

        var judgeBottle = function(){
            wz1.setVisible(false)
            wz2.setVisible(false)
            if(curBottle){
                hand.setVisible(true)
                curBottle.stopAllActions()
                curBottle.removeFromParent(true)
                curBottle = null
            }
            if(jiandao){
                jiandao.setVisible(true)
                jiandao.setPosition(290,100)
            }
        }

        var ani = function(frame,start,end) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:0.25,
            }))
        }

        var aniRepeat = function(frame,start,end){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:frame,
                start:start,
                end: end,
                time: 0.2,
            })))
        }

        var checkdistans = function(ra,rb,dis){
            var dx =  ra.x - rb.x
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
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do_tip1",img:res.do_tip1,sound:res.do_sound1},
            {key:"do_tip2",img:res.do_tip2,sound:res.do_sound2},
            {key:"do_tip3",img:res.do_tip3,sound:res.do_sound3},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
    },
})