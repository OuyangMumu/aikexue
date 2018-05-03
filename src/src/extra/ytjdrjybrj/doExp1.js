var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor({
            vis: false,
            setZ:99,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun:function(){
                    if(!self.biaoge){
                        var bg = createBiaoge({
                            json: res.ytjdrjybrj_table_json,
                            scale:0.9,
                            judgeScale:0.7,
                            downData: {
                                scale:1.3,
                                nums: 10,
                                bufs: [
                                    [null, res.table_yes, res.table_no],[null, res.table_yes, res.table_no],
                                    [null, res.table_yes, res.table_no],[null, res.table_yes, res.table_no],
                                    [null, res.table_yes, res.table_no],[null, res.table_yes, res.table_no],
                                    [null, res.table_yes, res.table_no],[null, res.table_yes, res.table_no],
                                    [null, res.table_yes, res.table_no],[null, res.table_yes, res.table_no],   
                                ],
                                keys: [
                                    1, 1, 1, 2, 1,  1, 1, 1, 2, 1
                                ]
                            },
                        })
                        self.biaoge = bg
                        safeAdd(self, bg)
                    }
                    self.biaoge.show()
                },
            }
        })
        this.initPeople()
        this.initUI()
        return true;
    },
 
    initUI: function () {
    	var self = this
        self.createTool()
    },

    createTool:function(){
        var self = this
        loadPlist("jiaoban_plist") //玻璃棒搅拌
        loadPlist("xijiejing_plist") //洗洁精瓶子
        loadPlist("itemTip_plist") //各种提示文字
        loadPlist("xjjjb_plist") //洗洁精液体
        loadPlist("jiujing_plist") //酒精
        loadPlist("jjjb_plist") //酒精液体
        loadPlist("jiaoshui_plist") //胶水
        loadPlist("jsjb_plist") //胶水液体
        loadPlist("huashengyou_plist") //花生油
        loadPlist("hsyjb_plist") //花生油液体
        loadPlist("xifashui_plist") //洗发水
        loadPlist("xfsjb_plist") //洗发水液体

        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })

        var btn_result = new ccui.Button("res/btn/btn_jielun_normal.png","res/btn/btn_jielun_select.png")
        btn_result.setPosition(1050,480)
        self.addChild(btn_result)

        btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"do_result"})
        })

        //创建盖子
        var gaizi = new cc.Sprite("#jjdGai.png")
        gaizi.setPosition(550,-400)
        self.addChild(gaizi)

        var itemTip = new cc.Sprite("#item1_tip1.png")//提示文字
        itemTip.setPosition(550,400)
        self.addChild(itemTip)
        itemTip.setOpacity(0)

        var jiaoban = new cc.Sprite("#jiaoban01.png")
        jiaoban.setPosition(0,-500)
        self.addChild(jiaoban)
        var cup = new cc.Sprite(res.do1_cup)
        cup.setPosition(350,150)
        self.addChild(cup)
        var yeti = new cc.Sprite("#xjjjb01.png")
        yeti.setPosition(72,58)
        cup.addChild(yeti,-1)  //杯子中各种物质搅拌
        var waterImg = new cc.Sprite("#waterImg.png")
        waterImg.setPosition(344,32)
        self.addChild(waterImg)
        waterImg.setVisible(false)
        cup.setVisible(false)
               
        var curItem = null
        var toolbtn = createTool({
            pos: cc.p(280, 540),
            nums: 5,
            scale:0.8,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.2, 1.5),
            itempos: cc.p(0, -10),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            father: self,
            counts: [1, 1, 1, 1, 1, 1],
            swallow: [true, true, true, true, true],
            files: [res.do1_tools1, res.do1_tools2, res.do1_tools3, res.do1_tools4, res.do1_tools5],
            gets: ["#xijiejing01.png", "#jiujing01.png", "#jiaoshui01.png", "#huashengyou01.png","#xifashui01.png"],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                var pos = data.pos

                item.nopos = true
                item.noMove = true
            
                if(!cup.isVisible())
                    cup.setVisible(true)
                item.setPosition(infList[index].pos)
                //每次点击工具箱，将所有的对象归位
                if(curItem){
                    curItem.stopAllActions()
                    curItem.forceBack()
                    jiaoban.stopAllActions()
                    jiaoban.setPositionY(-500)
                    jiaoban.noMove = false
                    jiaoban.inRun = false
                    yeti.stopAllActions()
                    itemTip.setOpacity(0)
                }
                yeti.setPosition(infList[index].yetiPos)
                yeti.setSpriteFrame(infList[index].yetiImg)
                curItem = item
                againTouch(item,index)
                item.noEvent = true
                return item
            },
            clickfun : function(data){
                var item = data.sp
                var pos = data.pos
                var index = data.index

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
            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
                var pos = data.pos
            },
            backfun:function(data){
                return false
            }
        });
        this.addChild(toolbtn)
        toolbtn.show()

        var againTouch = function(item,index){
            self.nodebs.say({key:infList[index].sayKey[0],force:true})
            waterImg.setVisible(true)
            item.index = index
            item.haveGai = true //检测是否还有盖子
            item.canPut = false //可以往杯子中倒入
            gaizi.setPositionY(-500)
            createTouchEvent({
                item:item,
                rect:infList[item.index].rect,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    var pos = data.pos
                    if(!item.noMove && !item.canPut){//手拿item
                        item.stopAllActions()
                        item.runAction(itemAni(infList[index].beginAni[0], infList[index].beginAni[1], infList[index].beginAni[2], infList[index].beginAni[3])),
                        item.canPut = true
                    }

                    if(item.haveGai && checkDistans(getGaiPos(item), pos, 20)){
                        item.haveGai = false//拿出盖子
                        item.runAction(cc.sequence(
                            itemAni(infList[index].gaiAni[0], infList[index].gaiAni[1], infList[index].gaiAni[2], infList[index].gaiAni[3]),
                            cc.callFunc(function(){
                                item.noMove = false
                                if(index != 0 && index != 4){
                                    gaizi.setPosition(infList[index].gaiPos)
                                    gaizi.setSpriteFrame(infList[index].gaiImg)
                                }
                            })
                        ))
                    } 
                    
                    return true
                   
                },
                move:function(data){
                    var item = data.item
                    var index = item.index
                    var delta = data.delta
                    
                    if(item.canPut && rectContainsPoint(item, cup)){
                        item.canPut = false 
                        item.noMove = true
                        item.setPosition(infList[index].putPos)
                        waterImg.setVisible(false)

                        var curInf = infList[index].moveAni
                        switch(index){
                            case 0:{
                                item.runAction(cc.sequence(
                                    itemAni(curInf[0], curInf[1], curInf[2], curInf[3]),
                                    cc.callFunc(function(){
                                        yeti.setPosition(infList[index].yetiPos)
                                        yeti.setSpriteFrame(infList[index].yetiImg_2)
                                        myTipFun(item)
                                    })
                                ))
                            }   
                            break
                            case 1:{
                                yeti.runAction(cc.sequence(
                                    cc.delayTime(1),
                                    itemAni("jjjb%02d.png", 1, 7, 0.2)
                                ))
                                item.runAction(cc.sequence(
                                    itemAni(curInf[0], curInf[1], curInf[2], curInf[3]),
                                    cc.moveTo(0.3,infList[index].pos),
                                    cc.callFunc(function(){ gaizi.setPositionY(-500) }),
                                    itemAni("jiujing%02d.png", 23, 28, 0.25),
                                    cc.callFunc(function(){
                                        myTipFun(item)
                                    })
                                ))
                            }
                            break
                            case 2:{
                                yeti.runAction(cc.sequence(
                                    cc.delayTime(1.5),
                                    cc.callFunc(function(){
                                        yeti.setSpriteFrame("jsjb02.png")
                                    })
                                ))
                                item.runAction(cc.sequence(
                                    itemAni(curInf[0], curInf[1], curInf[2], curInf[3]),
                                    cc.moveTo(0.3,infList[index].pos),
                                    cc.callFunc(function(){ gaizi.setPositionY(-500) }),
                                    itemAni("jiaoshui%02d.png", 22, 29, 0.25),
                                    cc.callFunc(function(){
                                        myTipFun(item)
                                    })
                                ))
                            }    
                            break
                            case 3:{
                                yeti.runAction(cc.sequence(
                                    cc.delayTime(1.5),
                                    itemAni("hsyjb%02d.png", 1, 5, 0.2)
                                ))
                                item.runAction(cc.sequence(
                                    itemAni(curInf[0], curInf[1], curInf[2], curInf[3]),
                                    cc.moveTo(0.3,infList[index].pos),
                                    cc.callFunc(function(){ gaizi.setPositionY(-500) }),
                                    itemAni("huashengyou%02d.png", 24, 31, 0.25),
                                    cc.callFunc(function(){
                                        myTipFun(item)
                                    })
                                ))
                            }   
                            break
                            case 4:{
                                yeti.runAction(cc.sequence(
                                    cc.delayTime(1.5),
                                    cc.callFunc(function(){
                                        yeti.setSpriteFrame("xfsjb02.png")
                                    })
                                ))
                                item.runAction(cc.sequence(
                                    itemAni(curInf[0], curInf[1], curInf[2], curInf[3]),
                                    cc.moveTo(0.3,infList[index].pos),
                                    itemAni("xifashui%02d.png", 21, 25, 0.25),
                                    cc.callFunc(function(){
                                        myTipFun(item)
                                    })
                                ))
                            }   
                            break
                        }
                        
                    }

                    if(!item.noMove){
                        item.x += delta.x 
                        item.y += delta.y
                    }
                },
                end:function(data){
                    var item = data.item
                    var index = item.index
                    if(!item.noMove && item.canPut){
                        item.stopAllActions()
                        item.runAction(itemBackAni(infList[index].endAni[0], infList[index].endAni[1], infList[index].endAni[2]))
                        item.setPosition(infList[index].pos)
                        item.canPut = false
                    }
                    
                }
            })
        }

        var myTipFun = function(item){
            var index = item.index
            item.stopAllActions()
            item.setPositionY(-500)
            tipInFun(infList[index].itemTip[0])
            item.runAction(cc.sequence(
                cc.delayTime(0.5),
                cc.callFunc(function(){
                    //此处说话
                    self.nodebs.say({key:infList[index].sayKey[1],force:true})
                }),
                cc.delayTime(infList[index].delay[0]),
                cc.callFunc(function(){
                    tipOutFun(infList[index].itemTip[0])
                }),
                cc.delayTime(infList[index].delay[1]),
                cc.callFunc(function(){
                    //搅拌棒出现 说话
                    jiaoban.setPosition(700,300)
                    self.nodebs.say({key:"do_tip2",force:true})
                })
            )) 
        }

        //搅拌棒监听
        jiaoban.noMove = false
        jiaoban.inRun = false
        createTouchEvent({
            item:jiaoban,
            begin:function(data){
                var item = data.item
                return true
            },
            move:function(data){
                var item = data.item 
                var delta = data.delta 
                if(!item.inRun && rectContainsPoint(item, cup)){
                    item.inRun = true 
                    item.noMove = true
                    item.setPosition(450,420)

                    item.runAction(cc.sequence(
                        cc.moveTo(0.4,450,280),
                        cc.callFunc(function(){
                            item.stopAllActions()
                            item.runAction(aniJiaoban())
                        })
                    ))
                    yeti.runAction(cc.sequence(
                        cc.delayTime(1),
                        itemAni(infList[curItem.index].yetiAni[0], infList[curItem.index].yetiAni[1], 
                            infList[curItem.index].yetiAni[2], infList[curItem.index].yetiAni[3]),
                        cc.callFunc(function(){
                            item.stopAllActions()
                            item.runAction(cc.sequence(
                                cc.moveTo(0.4, 450, 420),
                                cc.moveTo(0.2,600,420),
                                cc.callFunc(function(){
                                    item.setPositionY(-500)
                                    tipInFun(infList[curItem.index].itemTip[1])  //第二条提示出现
                                    self.nodebs.say({key:infList[curItem.index].sayKey[2],force:true})
                                })
                            ))
                        })
                    ))
                }
                if(!item.noMove){
                    item.x += delta.x 
                    item.y += delta.y
                }
            },
            end:function(data){
                
            }
        })

        var itemAni = function(frame,start,end,time){
            return cc.sequence(createAnimation({
                frame:frame,
                start:start,
                end:end,
                time: time || 0.2,
            }))
        }
        var itemBackAni = function(frame,start,end){
            return cc.sequence(createAnimation({
                rever:true,
                frame:frame,
                start:start,
                end:end,
                time:0.1
            }))
        }
        var aniJiaoban = function(){
            return cc.repeatForever(createAnimation({
                frame:"jiaoban%02d.png",
                start:1,
                end:8,
                time:0.07
            }))
        }
        //得到盖子的位置
        var getGaiPos = function(item){
            var pos = null
            switch(item.index){
                case 0: pos = cc.p(item.x-140,item.y+70)
                break
                case 1: pos = cc.p(item.x-190,item.y-2)
                break
                case 2: pos = cc.p(item.x-120,item.y+40)
                break
                case 3: pos = cc.p(item.x-113,item.y+40)
                break
                case 4: pos = cc.p(item.x-100,item.y+45)
                break
            }
            return pos
        }
        //每个对象的信息配置表
        var infList = [{
            pos: cc.p(850,250),//每个对象的位置
            rect: cc.rect(0,0,80,286),//每个对象的触摸rect
            //gaiAni: itemAni("xijiejing%02d.png", 2, 8,0.15),//给每个对象揭盖
            gaiAni: ["xijiejing%02d.png", 2, 8,0.15],//给每个对象揭盖
            beginAni: ["xijiejing%02d.png",9,11,0.1],//点击对象后的动画
            endAni: ["xijiejing%02d.png",8,11],//放手后动画
            moveAni: ["xijiejing%02d.png",11,30,0.25], //碰到杯子后的动画
            lastFrame: "xijiejing08.png",  //点击瓶子放手后图片
            putPos: cc.p(630,265),  //倒液体的时候的位置
            itemTip: ["item1_tip1.png","item1_tip2.png"],
            delay: [2,1], //提示语音延迟
            yetiAni: ["xjjjb%02d.png", 2, 17,0.4],
            yetiPos: cc.p(72,58),  //液体的位置
            yetiImg : "xjjjb01.png",
            yetiImg_2: "xjjjb02.png", //倒完后，液体图片的变化
            sayKey: ["do_sound1_1","do_sound1_2","do_sound1_3"],//语音提示关键字
        },{
            pos: cc.p(900,220),
            rect: cc.rect(0,32,100,176),
            gaiAni: ["jiujing%02d.png", 2, 9,0.15],
            beginAni: ["jiujing%02d.png",10,13,0.1],
            endAni: ["jiujing%02d.png",9,13],
            moveAni: ["jiujing%02d.png",14,23,0.25], 
            lastFrame: "jiujing09.png", 
            putPos: cc.p(600,250), 
            itemTip: ["item2_tip1.png","item2_tip2.png"],
            delay: [3.5,1],
            yetiAni: ["jjjb%02d.png", 8, 19,0.4],
            yetiPos: cc.p(70,79),
            yetiImg: "jjjb01.png" ,
            gaiPos: cc.p(814,78),
            gaiImg:"jjdGai.png",
            sayKey: ["do_sound2_1","do_sound2_2","do_sound2_3"],
        },{
            pos: cc.p(830,180),
            rect: cc.rect(55,58,60,200),
            gaiAni: ["jiaoshui%02d.png", 2, 9,0.15],
            beginAni: ["jiaoshui%02d.png",10,12,0.1],
            endAni: ["jiaoshui%02d.png",9,12],
            moveAni: ["jiaoshui%02d.png",13,22,0.25], 
            lastFrame: "jiaoshui09.png", 
            putPos: cc.p(540,300), 
            itemTip: ["item3_tip1.png","item3_tip2.png"],
            delay: [2,1],
            yetiAni: ["jsjb%02d.png",2, 15,0.4],
            yetiPos: cc.p(68,54),
            yetiImg: "jsjb01.png" ,
            gaiPos: cc.p(786,98),
            gaiImg:"jsGai.png",
            sayKey: ["do_sound3_1","do_sound3_2","do_sound3_3"],
        },{
            pos: cc.p(820,220),
            rect: cc.rect(45,0,76,230),
            gaiAni: ["huashengyou%02d.png", 2, 10,0.15],
            beginAni: ["huashengyou%02d.png",11,13,0.1],
            endAni: ["huashengyou%02d.png",10,13],
            moveAni: ["huashengyou%02d.png",14,24,0.25], 
            lastFrame: "huashengyou10.png", 
            putPos: cc.p(570,280), 
            itemTip: ["item4_tip1.png","item4_tip2.png"],
            delay: [2,1],
            yetiAni: ["hsyjb%02d.png",6, 17,0.4],
            yetiPos: cc.p(71,87),
            yetiImg: "hsyjb01.png" ,
            gaiPos: cc.p(800,79),
            gaiImg:"hsyGai.png",
            sayKey: ["do_sound4_1","do_sound4_2","do_sound4_3"],
        },{
            pos: cc.p(810,240),
            rect: cc.rect(54,0,102,253),
            gaiAni: ["xifashui%02d.png", 2, 8,0.15],
            beginAni: ["xifashui%02d.png",9,11,0.1],
            endAni: ["xifashui%02d.png",8,11],
            moveAni: ["xifashui%02d.png",12,20,0.25], 
            lastFrame: "xifashui08.png", 
            putPos: cc.p(560,310), 
            itemTip: ["item5_tip1.png","item5_tip2.png"],
            delay: [2,1],
            yetiAni: ["xfsjb%02d.png",2, 16,0.4],
            yetiPos: cc.p(66,63),
            yetiImg: "xfsjb01.png" ,
            sayKey: ["do_sound5_1","do_sound5_2","do_sound5_3"],
        }]

        var checkDistans = function(ra,rb,dis) {
            var dx = ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
            if (distance <= dis)
                return true
            else
                return false
        }
        var tipInFun = function(frame){
            itemTip.setSpriteFrame(frame)
            itemTip.setPosition(550,380)
            addShowType({item:itemTip,show:"fadeIn",time:0.5,fun:function(){}})
            addShowType({item:itemTip,show:"moveBy",time:0.5,buf:cc.p(0,30),fun:function(){}})
        }
        var tipOutFun = function(frame){
            addShowType({item:itemTip,show:"fadeOut",time:0.5,fun:function(){}})
            addShowType({item:itemTip,show:"moveBy",time:0.5,buf:cc.p(0,30),fun:function(){}})
        }


        var rectContainsPoint = function (rect, point) {
            if (point.x+point.width/2 >= rect.x-rect.width/2 && point.x+point.width/2 <= rect.x + rect.width/2 &&
                point.y+point.height/2 >= rect.y-rect.height/2 && point.y+point.height/2 <= rect.y + rect.height/2) {
                return true
            }
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
            {key:"do_sound1_2",sound:res.do_sound1_2},
            {key:"do_sound1_3",sound:res.do_sound1_3},
            {key:"do_sound2_2",sound:res.do_sound2_2},
            {key:"do_sound2_3",sound:res.do_sound2_3},
            {key:"do_sound3_2",sound:res.do_sound3_2},
            {key:"do_sound3_3",sound:res.do_sound3_3},
            {key:"do_sound4_2",sound:res.do_sound4_2},
            {key:"do_sound4_3",sound:res.do_sound4_3},
            {key:"do_sound5_2",sound:res.do_sound5_2},
            {key:"do_sound5_3",sound:res.do_sound5_3},
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                sound: addList[i].sound,
            })
        }
        var sayList = [
            {key:"do_sound1_1",img:res.do_tip3,sound:res.do_sound1_1},
            {key:"do_sound2_1",img:res.do_tip4,sound:res.do_sound2_1},
            {key:"do_sound3_1",img:res.do_tip5,sound:res.do_sound3_1},
            {key:"do_sound4_1",img:res.do_tip6,sound:res.do_sound4_1},
            {key:"do_sound5_1",img:res.do_tip7,sound:res.do_sound5_1},
            {key:"do_tip1",img:res.do_tip1,sound:res.do_sound0},
            {key:"do_tip2",img:res.do_tip2,sound:res.do_sound6},
        ]

        for (var i = 0 ; i < sayList.length ; i++){
            addContent({
                people: this.nodebs,
                key: sayList[i].key,
                img: sayList[i].img,
                sound: sayList[i].sound,
            })
        }
        
        addContent({
            people: this.nodebs,
            key: "do_result",
            img:res.do_result,
            sound: res.do_sound_jielun,
            id:"result"
        })
    }
})