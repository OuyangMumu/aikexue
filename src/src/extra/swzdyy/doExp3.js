var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp3",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        var self = this
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        var btn_result = new ccui.Button("res/btn/btn_jielun_normal.png","res/btn/btn_jielun_select.png")
        btn_result.setPosition(1060,460)
        self.addChild(btn_result)
        btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"do3_tip4"})
        })

        self.createTool()
    },

    createTool:function(){
        var self = this
        loadPlist("do3_plist")
        loadPlist("fire_plist")
        loadPlist("burn_plist")
        var haveItem = false
        var curItem = null

        self.nodebs.show(function(){
            self.nodebs.say({key:"do3_tip1"})
        })
        var wenzi = new cc.Sprite(res.wenzi)
        wenzi.setPosition(568,420)
        self.addChild(wenzi)
        wenzi.setScale(0.9)
        wenzi.setVisible(false)

        var jjd = new cc.Sprite("#jjd.png")
        jjd.setPosition(260,100)
        self.addChild(jjd)
        var gai = new cc.Sprite("#gai.png")
        gai.setPosition(jjd.x+2,jjd.y+50)
        self.addChild(gai)
        var match = new cc.Sprite("#match.png")
        match.setPosition(370,170)
        self.addChild(match)

        //酒精灯上的火焰
        var jjdFire = new cc.Sprite("#jjdFire01.png")
        jjdFire.setPosition(63,156)
        jjd.addChild(jjdFire)
        jjdFire.setScaleX(0.8)
        jjdFire.setScaleY(0.6)
        //火柴上的火焰
        var matchFire = new cc.Sprite("#matchFire01.png")
        matchFire.setPosition(15,30)
        match.addChild(matchFire)
        match.setVisible(false)
        jjdFire.setVisible(false)

        var niezi = new cc.Sprite("#niezi.png")
        niezi.setPosition(800,170)
        self.addChild(niezi,10)
        niezi.setRotation(55)
        var niezi2 = new cc.Sprite("#niezi2.png")
        niezi2.setPosition(18,136)
        niezi.addChild(niezi2,5)

        var judgeOver = [false,false,false]

        var judgeInf = [{
            curPos:cc.p(0,0),
            burnPos:cc.p(390,280),  //燃烧时镊子的位置
            itemPos:cc.p(75,-31),  //燃烧时物质的位置
            burnImg:"burn_yumao01.png",//燃烧时换图
            time:1,   //燃烧时延迟的时间
            frame:"burn_yumao%02d.png",
            end:16,
            wenzidel:1.5,
        },{
            curPos:cc.p(10,10),
            burnPos:cc.p(380,280),
            itemPos:cc.p(-30,20),
            burnImg:"burn_shourou01.png",
            time:1,
            frame:"burn_shourou%02d.png",
            end:14,
            wenzidel:1.3,
        },{
            curPos:cc.p(0,0),
            burnPos:cc.p(380,280),
            itemPos:cc.p(-2,0),
            burnImg:"burn_dadou01.png",
            time:2,
            frame:"burn_dadou%02d.png",
            end:7,
            wenzidel:0.5,
        }]
        gai.out = false
        gai.canGai = false  //只有第二次的时候才可以盖住
        gai.noMove = false
        createTouchEvent({
            item:gai,
            begin:function(data){
                var item = data.item
                if(item.noMove)
                    return false
                else
                    return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(item.out){
                    item.x += delta.x 
                    item.y += delta.y
                    if(item.canGai && checkDistance(item, jjd,20)){
                        item.setPosition(jjd.x+2,jjd.y+50)
                        item.out = false
                        item.canGai = false
                        match.setVisible(false)
                        jjdFire.setVisible(false)
                        jjdFire.stopAllActions()
                        if(judgeOver[0] && judgeOver[1] && judgeOver[2]){
                            item.noMove = true //判断不能在拿开
                            self.nodebs.say({key:"do3_tip3",force:true})
                            item.runAction(cc.sequence(
                                cc.delayTime(0.5),
                                cc.callFunc(function(){
                                    item.setTexture(res.gai2)
                                    item.setPosition(item.x+70,item.y+20)
                                }),
                                cc.delayTime(0.3),
                                cc.moveTo(0.7, 332, 210),
                                cc.moveTo(0.7, 332, 170),
                                cc.callFunc(function(){
                                    item.setSpriteFrame("gai.png")
                                    item.setPosition(262,150)
                                })
                            ))
                        }
                    }
                }else{
                    if(item.y + delta.y > jjd.y+48){
                        item.y += delta.y
                        if(item.y > jjd.y + 90)
                            item.out = true
                    }
                }    
            },
            end:function(data){
                var item = data.item
                item.canGai = true
                if(!item.out){
                    item.setPosition(jjd.x+2,jjd.y+50)
                    item.canGai = false
                }else{
                    item.setPosition(160,80)
                    if(!judgeOver[0]){
                        item.noMove = true
                        match.setVisible(true)
                        matchFire.runAction(aniFire("matchFire%02d.png",5,0.2))
                    }
                }
            }
        })
        createTouchEvent({
            item:match,
            begin:function(data){
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(item.isVisible()){
                    item.x += delta.x 
                    item.y += delta.y
                    if(checkDistance2(item,jjd)){
                        item.setPosition(370,170)
                        item.setVisible(false)
                        jjdFire.setVisible(true)
                        matchFire.stopAllActions()
                        jjdFire.runAction(aniFire("jjdFire%02d.png", 5, 0.35))
                    }
                }
            },
            end:function(data){
                var item = data.item
                
            }
        })
        //镊子
        niezi.canBurn = false   //判断能否烧
        niezi.noMove = false
        createTouchEvent({
            item:niezi,
            begin:function(data){
                var item = data.item
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(!item.noMove){
                    item.x += delta.x 
                    item.y += delta.y
                }
                
                if (haveItem) {
                    if(checkDistance3(item,curItem)){
                        item.canBurn = true
                        safeAdd(item,curItem)
                        curItem.setRotation(-55)
                        curItem.noMove = true
                        curItem.setPosition(judgeInf[curItem.index].curPos)
                    }

                    if(match.isVisible() && checkDistance4(item,match)){
                        createDialog(res.dialog1)
                    }

                    //镊子拖动烧物质
                    if(item.canBurn && jjdFire.isVisible() && checkDistance4(item,jjd)){
                        item.canBurn = false
                        item.noMove = true
                        item.runAction(cc.sequence(
                            cc.callFunc(function(){
                                curItem.setSpriteFrame(judgeInf[curItem.index].burnImg)
                                curItem.setPosition(judgeInf[curItem.index].itemPos)
                            }),
                            cc.moveTo(0.2,judgeInf[curItem.index].burnPos),
                            cc.delayTime(judgeInf[curItem.index].time),
                            cc.callFunc(function(){
                                curItem.runAction(cc.sequence(
                                    cc.callFunc(function(){
                                        wenzi.runAction(cc.sequence(
                                            cc.delayTime(judgeInf[curItem.index].wenzidel),
                                            cc.callFunc(function(){
                                                wenzi.setVisible(true)
                                            })
                                        ))
                                    }),
                                    aniBurn(judgeInf[curItem.index].frame,judgeInf[curItem.index].end),
                                    cc.delayTime(1),
                                    cc.callFunc(function(){
                                        haveItem = false
                                        curItem.setPositionY(-600)
                                        item.runAction(cc.moveTo(0.5,800,170))
                                        item.noMove = false
                                        wenzi.setVisible(false)
                                        judgeOver[curItem.index] = true
                                        if(judgeOver[0] && judgeOver[1] && judgeOver[2]){
                                            //判断完成
                                            gai.noMove = false
                                            self.nodebs.say({key:"do3_tip2",force:true})
                                        }
                                    })
                                ))
                            })
                        ))
                    }
                }
                
            },
            end:function(data){
                var item = data.item
                
            }
        })


        var haveItem = false
        var curItem = null
        var judgeOver = [false,false]

        var toolbtn = createTool({
            pos: cc.p(380, 540),
            nums: 3,
            scale:0.8,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -10),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [1, 1, 1],
            swallow: [true, true, true],
            files: [res.do3_tools1, res.do3_tools2, res.do3_tools3],
            gets: ["#yumao.png","#shourou.png","#dadou.png"],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                if(!haveItem){
                    if(curItem)
                        curItem.setPositionY(-600)
                    item.index = index
                    curItem = null
                    curItem = item
                    haveItem = true
                    return item
                }   
                else
                    return false
            },
            clickfun : function(data){
                var index = data.index
                var item = data.sp
                var pos = data.pos
                
                if(item.noMove)
                    return false
                return true
            },
            movefun:function(data){
                var item = data.sp
                var index = data.index
                var delta = data.delta
                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                 }

                if(match.isVisible() && checkDistance5(item,match)){
                    createDialog(res.dialog2)
                }
                if(jjdFire.isVisible() && checkDistance6(item,jjd)){
                    createDialog(res.dialog3)
                }
            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
            },
            backfun:function(data){
                return false
            }
        });
        this.addChild(toolbtn)
        toolbtn.show()

        var aniFire = function(frame,end,time) {
            return cc.repeatForever(createAnimation({
                frame: frame,
                start:1,
                end: end,
                time:time
            }))
        }
        var aniBurn = function(frame,end) {
            return cc.sequence(createAnimation({
                frame: frame,
                start:1,
                end: end,
                time:0.2
            }))
        }
        
        var checkDistance = function(ra,rb,dis){
            var dx = ra.x - rb.x
            var dy = (ra.y-ra.height/2) - (rb.y+rb.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < dis){
                return true
            }else{
                return false
            }
        }

        var checkDistance2 = function(ra,rb){
            var dx = (ra.x-ra.width/2) - rb.x
            var dy = ra.y - (rb.y+rb.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < 30){
                return true
            }else{
                return false
            }
        }
        var checkDistance3 = function(ra,rb){
            var dx = (ra.x-100) - rb.x
            var dy = (ra.y-60) - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < 40){
                return true
            }else{
                return false
            }
        }

        var checkDistance4 = function(ra,rb){
            var dx = (ra.x-100) - rb.x
            var dy = (ra.y-60) - (rb.y+rb.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < 50){
                return true
            }else{
                return false
            }
        }

        //火柴和其他的材料接触
        var checkDistance5 = function(ra,rb){
            var dx = ra.x - (rb.x-rb.width/2)
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < 45){
                return true
            }else{
                return false
            }
        }
        //酒精灯和其他材料接触
        var checkDistance6 = function(ra,rb){
            var dx = ra.x - rb.x
            var dy = ra.y - (rb.y+rb.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < 45){
                return true
            }else{
                return false
            }
        }

        var createDialog = function(img){
            AddDialog("Tips", {
            res: img,
            face: 2,
            confirmBtn:true,
        })
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do3_tip1",img:res.do3_tip1,sound:res.do3_sound1},
            {key:"do3_tip2",img:res.do3_tip2,sound:res.do3_sound2},
            {key:"do3_tip3",img:res.do3_tip3,sound:res.do3_sound3},
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
            key: "do3_tip4",
            img: res.do3_tip4,
            sound: res.do3_sound4,
            id: "result",
        })
    },
})