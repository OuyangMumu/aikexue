var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        var self = this
        self.result = parseInt(10*Math.random()) //產生0-10的隨機整數
        cc.log(self.result)
        var resultList = []
        for(var i = 0 ; i < 12 ; i++){
            resultList[i] =  20 + self.result
        }
        this.expCtor({
            vis: false,
            setZ:99,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun:function(){
                    if(!self.biaoge){
                        var bg = createBiaoge({
                            json: res.rqll_tableNode_json,
                            scale:0.9,
                            judgeScale:0.7,
                            inputNum: 12,
                            inputKeys:resultList,
                            initFinal:function(final){
                                for(var i = 1 ; i < 13 ; i++){
                                    var name  = "Text_" + i
                                    var text = final.getChildByName(name)
                                    text.setString( 20 + self.result)
                                }
                                
                            }
                        })
                        self.biaoge = bg
                        safeAdd(self, bg)
                    }
                    self.biaoge.show()
                },
            }
        });
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        this.createTool()
    },

    createTool:function(){
        loadPlist("book_plist")
        var self = this
        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })
        var uiList = ["jm","big_kd","big_wdj","wdj","kd","dwk",
                    "btn_bigClose","btn_big","btn_small","panel",
                    "book","book2","maoyiBg","my_r","my_l1","my_u1",
                    "my_u2","my_l2"]
        var node = loadNode(res.rqll_doExp1_json,uiList)
        self.inside_node.addChild(node,2)
        
        var jm = node.jm
        var big_wdj = node.big_wdj
        var big_kd = node.big_kd
        var wdj = node.wdj
        var kd = node.kd
        var dwk = node.dwk
        var book = node.book 
        var book2 = node.book2 
        var maoyiBg = node.maoyiBg
        var maoyi = node.my_r
        var bigWdjPos_List = [330,320,308,295,283,271,260,248,235,225,210]
        var bigKdScale_list = [0.69,0.72,0.76,0.79,0.81,0.85,0.89,0.92,0.95,0.98,1]
        big_wdj.setPositionX(bigWdjPos_List[self.result])
        big_kd.setScaleX(bigKdScale_list[self.result])
        kd.setScaleX(0.8 + 0.02 * self.result)
        dwk.setPositionX(232 + 4 * self.result)

        var judgeSay = [false,false]  //判断该提示哪一个语音
        var judgeSayFun = function(){
            jm.stopAllActions()
            jm.runAction(cc.sequence(
                cc.delayTime(80),
                cc.callFunc(function(){
                    if(judgeSay[0]){
                        self.nodebs.say({key:"do_tip2",force:true})
                        judgeSay[0] = false
                    }else if(judgeSay[1]){
                        self.nodebs.say({key:"do_tip3",force:true})
                        judgeSay[1] = false
                    }
                })
            ))
        }
        

        big_wdj.moveX = 3
        big_wdj.moveY = 4
        //放大镜的几个按钮功能
        var fdjBtnFun = function(){
            node.btn_bigClose.addClickEventListener(function(){
                jm.pos = jm.getPosition()
                jm.setVisible(false)
                jm.setPositionY(-200)
            })
            node.btn_big.addClickEventListener(function(){
                node.panel.MyScale = node.panel.getScale()
                cc.log(node.panel.MyScale)
                if(node.panel.MyScale > 1.2){
                    return 
                }
                if(node.btn_small.getOpacity() != 250){
                    node.btn_small.setEnabled(true)
                    node.btn_small.setOpacity(250)
                }
                node.panel.setScale(node.panel.MyScale + 0.1)
                dwk.setScale(dwk.getScale() - 0.1)
                if(node.panel.MyScale > 1.2){
                    node.btn_big.setEnabled(false)
                    node.btn_big.setOpacity(100)
                }
            })
            node.btn_small.addClickEventListener(function(){
                node.panel.MyScale = node.panel.getScale()
                if(node.panel.MyScale < 0.9){
                    return 
                }
                if(node.btn_big.getOpacity() != 250){
                    node.btn_big.setEnabled(true)
                    node.btn_big.setOpacity(250)
                }
                node.panel.setScale(node.panel.MyScale - 0.1)
                dwk.setScale(dwk.getScale() + 0.1)
                if(node.panel.MyScale < 0.9){
                    node.btn_small.setEnabled(false)
                    node.btn_small.setOpacity(100)
                }
            })
        }
        fdjBtnFun()
        createTouchEvent({
            item:jm,
            begin:function(data){
                return true 
            },
            move:function(data){
                var item = data.item
                var delta = data.delta 
                item.x += delta.x 
                item.y += delta.y
            }
        })
        createTouchEvent({
            item:dwk,
            begin:function(data){
                if(!jm.isVisible()){
                    jm.setPosition(jm.pos)
                    jm.setVisible(true)
                }
                return true 
            },
            move:function(data){
                var item = data.item
                var delta = data.delta 
                if((item.x + delta.x < 612 && item.x + delta.x > 0) && 
                    (item.y + delta.y < 26 && item.y + delta.y > 6)){
                    item.x += delta.x 
                    item.y += delta.y
                    big_wdj.x -= delta.x * (3 * big_wdj.getScaleX())
                    big_wdj.y -= delta.y * (4 * big_wdj.getScaleY())
                }
                
            },
            end:function(data){
                var item = data.item
                item.setPosition(232 + 4 * self.result,16)
                big_wdj.setPosition(bigWdjPos_List[self.result] * big_wdj.getScaleX(),68.5)
            }
        })
        maoyi.noMove = false
        createTouchEvent({
            item:maoyi,
            begin:function(data){
                return true 
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(!item.noMove){
                    item.getParent().x += delta.x 
                    item.getParent().y += delta.y
                }
            },
            end:function(data){
                var item = data.item
                var bg = self.toolbtn.bg
                if(self.toolbtn.getStatus() && bg){
                    var result = judgeItemCrash({
                        item1:item,
                        item2:bg,
                    })
                    //判断毛衣一件对折后，就可以回收
                    if(result && !maoyiBg.canFold){
                        maoyiBg.setPositionY(-500)
                        if(maoyiBg.haveWdj)
                            jm.setPositionY(-500)
                    }
                }
            }
        })

        var localOrder = 10 
        wdj.canAdd = true //判断温度计是否已放置
        maoyiBg.canFold = true //判断毛衣是否可以对折
        book.haveWdj = false
        book.inMaoyi = false
        maoyiBg.haveWdj = false 
        maoyiBg.haveBook = false
        wdj.inBook = false
        wdj.inMaoyi = false
        var toolbtn = createTool({
            pos: cc.p(270, 530),
            nums: 4,
            scale:0.9,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -10),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:false,
            father: self.inside_node,
            counts: [1000, 1000, 1000, 1],
            swallow: [true, true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3, res.do_tools4],
            gets: [null,null,null,null],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                localOrder++
                //item.setPosition(pos)
                backFun_item(index)
                if(index == 0){
                    book.noMove = false
                    book.setLocalZOrder(localOrder)
                    book.stopAllActions()
                    return book
                }else if(index == 1){
                    maoyiBg.setLocalZOrder(localOrder)
                    maoyiBg.stopAllActions()
                    maoyiBg.getChildByName("my_l2").myFather = maoyiBg
                    return maoyiBg
                }else if(index == 2){
                    jm.setLocalZOrder(localOrder)
                    jm.setPosition(950,350)
                    wdj.stopAllActions()
                    return wdj
                }else if(index == 3){
                    var watch = createWatch()
                    watch.setPosition(200,-600)
                    self.addChild(watch)
                    watch.setScale(0.7)
                    watch.setLocalZOrder(localOrder)
                    return watch
                }
                return item
            },
            clickfun : function(data){
                var index = data.index
                var item = data.sp 
                var pos = data.pos
                
                if(item.noMove){
                    return false
                }else{
                    localOrder++
                    item.setLocalZOrder(localOrder)
                }
                return true
            },
            movefun:function(data){
                var item = data.sp
                var index = data.index
                var delta = data.delta
                if(index == 2){
                    if(!item.haveWdj &&rectContainsPoint_wdj(book, item)){
                        cc.log("book_wdj")
                        judgeSay[0] = true
                        judgeSayFun()
                        book.haveWdj = true
                        maoyiBg.canFold = false
                        wdj.inBook = true
                        wdjAddToBook()
                        item.setLocalZOrder(0)
                        item.setPosition(510,80)
                        wdj.runAction(cc.sequence(
                            cc.callFunc(function(){
                                book2.runAction(ani_tool("book%02d.png",5,0.2))
                            }),
                            cc.delayTime(1),
                            cc.moveTo(0.5,380,80),
                            cc.callFunc(function(){
                                book2.runAction(ani_toolRever("book%02d.png",5,0.2))
                                //wdj.noMove = false
                                book.noMove = false
                            })
                        ))
                    }else if(item.canAdd && !maoyiBg.canFold && rectContainsPoint_maoyi(maoyiBg, item)){
                        cc.log("maoyi_book_wdj")
                        jm.stopAllActions()//停止再次提示
                        judgeSay[1] = false
                        item.canAdd = false
                        maoyi.noMove = true
                        book.inMaoyi = true
                        maoyiBg.haveWdj = true
                        maoyiBg.haveBook = true
                        wdj.inBook = true
                        wdj.inMaoyi = true
                        wdjAddToBook()
                        item.setPosition(510,80)
                        wdj.runAction(cc.sequence(
                            cc.callFunc(function(){
                                book2.runAction(ani_tool("book%02d.png",5,0.2))
                            }),
                            cc.delayTime(1),
                            cc.moveTo(0.5,380,80),
                            cc.callFunc(function(){
                                book2.runAction(ani_toolRever("book%02d.png",5,0.2))
                                //wdj.noMove = false
                                //book.noMove = false
                                maoyi.noMove = false
                            })
                        ))
                    }else if(item.canAdd && maoyiBg.canFold && rectContainsPoint_wdj(maoyiBg, item)){
                        //温度计直接放到毛衣上
                        judgeSay[0] = false
                        cc.log("maoyi_wdj")
                        if(!judgeSay[1]){
                            judgeSay[1] = true
                            judgeSayFun()
                        }
                        
                        item.canAdd = false
                        maoyiBg.canFold = false
                        maoyiBg.haveWdj = true
                        wdj.inMaoyi = true
                        safeAdd(maoyiBg, item)
                        safeAdd(maoyiBg, node.my_l2)
                        node.my_l2.setLocalZOrder(2)
                        //item.setPosition(760,100)
                        maoyiAction()
                        item.noMove = true
                        item.setLocalZOrder(0)
                        item.runAction(cc.sequence(
                            cc.moveTo(0.4,760,100),
                            cc.delayTime(0.3),
                            cc.moveTo(0.5,600,100)
                        ))
                    }
                }

                if(index == 0){
                    if(maoyiBg.canFold && !item.inMaoyi && !item.haveWdj && rectContainsPoint(maoyiBg,item)){
                        cc.log("maoyi_book")
                        maoyiBg.canFold = false 
                        book.inMaoyi = true
                        maoyiBg.haveBook = true
                        safeAdd(maoyiBg, item)
                        safeAdd(maoyiBg, node.my_l2)
                        node.my_l2.setLocalZOrder(10)
                        maoyiAction()
                        item.setPosition(355,94)
                        item.noMove = true
                        item.setLocalZOrder(0)
                    }
                }
                if(!item.noMove){
                    if(index == 2 && !item.canAdd){
                        item.getParent().x += delta.x
                        item.getParent().y += delta.y
                        return 
                    }
                    item.x += delta.x
                    item.y += delta.y
                 }
            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
            },
            backfun:function(data){
                var index = data.index
                var item = data.item
                var pos = data.pos
                if(index == 3){
                    return true
                }else if(index == 0){
                    book.setPositionY(-500)
                    if(book.haveWdj)
                        jm.setPositionY(-500)
                }else if(index == 1){
                    maoyiBg.setPositionY(-500)
                    if(maoyiBg.haveWdj)
                        jm.setPositionY(-500)
                }else if(index == 2){
                    wdj.setPositionY(-500)
                    jm.setPositionY(-500)
                }
                return false
            }
        });
        self.inside_node.addChild(toolbtn,1)
        toolbtn.show()
        self.toolbtn = toolbtn

        var backFun_item = function(index){
            switch(index){
                case 0:
                if(book.haveWdj && !book.inMaoyi){
                    safeAdd(book.getParent(), wdj)
                    wdj.setPositionY(-500)
                    jm.setPositionY(-500)
                    wdj.inBook = false
                }else if(book.haveWdj && book.inMaoyi){
                    safeAdd(maoyiBg.getParent(), book)
                    //maoyiAgain()
                    safeAdd(maoyiBg.getParent(), wdj)
                    wdj.setPositionY(-500)
                    jm.setPositionY(-500)
                    backFun_item(1)
                }else if(!book.haveWdj && book.inMaoyi){
                    safeAdd(maoyiBg.getParent(), book)
                    //maoyiAgain()
                    backFun_item(1)
                }
                book.haveWdj = false
                book.inMaoyi = false
                break
                case 1:
                if(maoyiBg.haveWdj){
                    safeAdd(maoyiBg.getParent(), wdj)
                    wdj.setPositionY(-500)
                    jm.setPositionY(-500)
                    backFun_item(2)
                }
                if(maoyiBg.haveBook){
                    safeAdd(maoyiBg.getParent(), book)
                    book.setPositionY(-500) 
                    book.inMaoyi = false
                }

                maoyiBg.haveWdj = false
                maoyiBg.haveBook = false
                maoyiBg.canFold = true
                maoyiAgain()
                break
                case 2:
                cc.log(wdj.inBook)
                if(wdj.inBook && wdj.inMaoyi){
                    safeAdd(maoyiBg.getParent(),book)
                    book.setPositionY(-500)
                }
                if(wdj.inBook){
                    safeAdd(book.getParent(), wdj)
                    book.setPositionY(-500)
                    //backFun_item(0)
                    wdj.inBook = false
                    book.haveWdj = false
                    book.inMaoyi = false
                    cc.log("11111111--------------")
                }
                if(wdj.inMaoyi){
                    safeAdd(maoyiBg.getParent(), wdj)
                    maoyiBg.setPositionY(-600)
                    //maoyiAgain()
                    //backFun_item(1)
                    maoyiBg.haveWdj = false
                    maoyiBg.haveBook = false
                    maoyiBg.canFold = true
                    maoyiAgain()
                    cc.log("222222222--------------")
                }
                
                
                wdj.canAdd = true
                wdj.inBook = false
                wdj.inMaoyi = false
                wdj.noMove = false
                cc.log("22222222222")
                break
            }
        }

        var maoyiAgain = function(){
            maoyiBg.stopAllActions()
            maoyiBg.setPositionY(-600)
            node.my_l1.setVisible(true)
            node.my_u1.setVisible(true)
            node.my_u2.setVisible(false)
            node.my_l2.setVisible(false)
            maoyiBg.noMove = false
        }

        var wdjAddToBook = function(){
            wdj.canAdd = false
            safeAdd(book, wdj)
            safeAdd(book, book2)
            wdj.noMove = true
            book.noMove = true
            wdj.setLocalZOrder(0)
            book2.setLocalZOrder(2)
        }

        var maoyiAction = function(){
            maoyiBg.runAction(cc.sequence(
                cc.callFunc(function(){
                    maoyiBg.noMove = true
                    maoyi.noMove = true
                    node.my_u1.setVisible(false)
                }),
                cc.delayTime(0.3),
                cc.callFunc(function(){
                    node.my_u2.setVisible(true)
                }),
                cc.delayTime(0.3),
                cc.callFunc(function(){
                    node.my_u2.setVisible(false)
                    node.my_l1.setVisible(false)
                }),
                cc.delayTime(0.3),
                cc.callFunc(function(){
                    node.my_l2.setVisible(true)
                    maoyi.noMove = false
                })
            ))
        }

        var ani_tool = function(frame,end,time){
            return cc.sequence(createAnimation({
                frame: frame,
                start:1,
                end: end,
                time: time
            }))
        }

        var ani_toolRever = function(frame,end,time){
            return cc.sequence(createAnimation({
                frame: frame,
                start:1,
                end: end,
                time: time,
                rever: true
            }))
        }

        var rectContainsPoint_wdj = function (rect, point) {
            return (point.x - point.width/2 >= rect.x - rect.width/2 && 
                point.x - point.width/2 <= rect.x + rect.width/2 &&
                point.y >= rect.y - rect.height/2 && 
                point.y <= rect.y + rect.height/2)
        }
        var rectContainsPoint = function (rect, point) {
            return (point.x >= rect.x - rect.width/2 && 
                    point.x <= rect.x + rect.width/2 &&
                    point.y >= rect.y - rect.height/2 && 
                    point.y <= rect.y + rect.height/2)
        }

        var rectContainsPoint_maoyi = function (rect, point) {
            return (point.x - point.width/2 >= rect.x && 
                    point.x - point.width/2 <= rect.x + rect.width/2 &&
                    point.y >= rect.y - rect.height/2 && 
                    point.y <= rect.y)
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