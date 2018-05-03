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
        loadPlist("jianping_plist")
        loadPlist("daocao_plist")
        loadPlist("daoshui_plist")
        loadPlist("qipao_plist")
        loadPlist("diguan_plist")
        loadPlist("bolipian_plist")
        loadPlist("xishui_plist")

        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
        })
        var sayFun = function(key){
            self.nodebs.say({key:key,force:true})
        }
        var createSp = function(sprite,pos,father){
            var sp = new cc.Sprite(sprite)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var judgeList = [true,false,false,false,false,false,false,false,false]
        var judgeFun = function(i,j){//判断该提示哪一个提示
            judgeList[i] = false
            judgeList[j] = true
        }
        var cup = null //瓶子
        var slide = null //载玻片
        var xwj = null //显微镜
        var toolbtn = createTool({
            pos: cc.p(290, 550),
            nums: 4,
            scale:0.7,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -15),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            arrow:false,
            father: self,
            counts: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            swallow: [true, true, true, true, true, true, true, true, true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3, res.do_tools4, 
                    res.do_tools5, res.do_tools6, res.do_tools7, res.do_tools8, 
                    res.do_tools9, res.do_tools10, res.do_tools11],
            gets: ["#jianping01.png","#jiandao.png","#daocao.png","#daoshui01.png",
                    "#bolipian01.png",res.gauze,"#diguan.png",res.gaitool,
                    res.niezi,"#xishui.png",null],
            firstClick: function(data) {
                var item = data.sp 
                var index = data.index
                if(judgeList[0] && index > 1){
                    sayFun("do1_tip0")
                    return false 
                }else if(judgeList[1] && index > 2){
                    sayFun("do1_tip0")
                    return false 
                }else if(judgeList[2] && index > 3){
                    sayFun("do1_tip0")
                    return false 
                }else if(judgeList[3] && index > 5){//此处取出载玻片和纱布
                    sayFun("do1_tip0")
                    return false 
                }else if(judgeList[4] && index > 6){
                    sayFun("do1_tip0")
                    return false
                }else if(judgeList[5] && index > 8){
                    sayFun("do1_tip0")
                    return false
                }else if(judgeList[6] && index > 9){
                    sayFun("do1_tip0")
                    return false
                }

                if(index == 4)
                    item.over = false
                else if(index == 6)
                    item.haveWater = false 
                else if(index == 8)
                    item.havegai = false
                else if(index == 10){
                    XWJFun()
                    xwj.havezbp = false
                    xwj.ypj = false
                    xwj.zbp_OK = false
                    xwj.curCount = [false,false,false]
                    return xwj
                }
                return item
            },
            clickfun: function(data){
                var item = data.sp 
                var index = data.index
                if(item.noMove)
                    return false

                if(index == 4 && item.over){
                    if(xwj){//已有显微镜
                        if(!xwj.havezbp){//可以放入载玻片
                            sayFun("do1_tip9")
                            return false
                        }
                    item.setLocalZOrder(xwj.getLocalZOrder()+1)
                    }else{//没有拖出显微镜，提示取出显微镜
                        sayFun("do1_tip10")
                        return false 
                    }
                }

                return true 
            },
            movefun: function(data){
                var item = data.sp 
                var index = data.index
                var delta = data.delta 
                if(!item.noMove){
                    item.x += delta.x 
                    item.y += delta.y
                }
                switch(index){
                    case 1:  //剪刀
                        if(cup){
                            jiandaoFun(item)
                        }
                    break
                    case 2:
                        if(!item.noMove && checkdistans(item,cup,200)){
                            safeAdd(self, cup)
                            item.setPosition(435,215)
                            item.noMove = true
                            item.runAction(cc.sequence(
                                ani("daocao%02d.png",1,14,0.2),
                                cc.callFunc(function(){
                                    judgeFun(1,2)
                                })
                            ))
                        }
                    break
                    case 3://倒水
                    daoshuiFun(item)
                    break
                    case 4://载玻片
                    zbpFun(item)
                    break
                    case 5://擦玻璃
                    slideFun(item)
                    break
                    case 8://盖玻片
                    gaibopianFun(item)
                    break
                    case 9://吸水纸
                    xishuiFun(item)
                    break
                    case 6://滴管
                    diguanFun(item)
                    break
                }
            },
            outfun: function(data){
                var item = data.sp 
                var index = data.index
                switch(index){
                    case 0:
                        item.setPosition(320,250)
                        item.noMove = true 
                        cup = item
                        cc.log("this is cup")
                    break 
                    case 4:
                        if(!item.over){
                            item.noMove = true 
                            slide = item
                            item.setPosition(630,70)
                        }
                    break
                    case 7://盖玻片盒子
                        item.noMove = true
                        item.setPosition(300,80)
                    break
                    case 10:
                        item.showHand(false)
                        item.setPosition(750,250)
                        item.noMove = true 
                    break
                }
            },
            backfun: function(data){
                return false 
            }
        })
        self.inside_node.addChild(toolbtn,1)
        self.toolbtn = toolbtn
        toolbtn.show()

        //放大镜
        var XWJFun = function(){
            xwj = createXwj({
                radius: 100,
                zhqFun: function(key) {
                    var see = xwj.getSee({
                        ifMove: false,
                        pos: getMiddle(-300, 0),
                        scale: 0.6,
                    })
                    safeAdd(self, see)
                    xwj.curKey = key
                    var tex = null
                    switch(xwj.curKey){
                        case "db":
                            tex = res.do1_db
                            break
                        case "gb":
                            tex = res.do1_gb
                            break
                    }
                    if(xwj.ypj){
                        xwj.setFile({
                            tex: tex,
                            scale: 0.6,
                        })
                    }
                },
                fgjFun:function(){
                    //提示可以放入载玻片
                    cc.log("put zbp")
                    xwj.havezbp = true
                    sayFun("do1_tip8")
                },
                ypjFun:function(){
                    //判断压片夹是否已经盖住
                    cc.log("take over")
                    xwj.ypj = true
                },
                judgeLxFun:function(){//压片夹未盖住，旋转调用
                    if(!xwj.ypj && xwj.zbp_OK){
                        sayFun("do1_tip11")
                        return false
                    }
                    return true
                },
                judgeCountFun:function(data){//判断次数
                    var name = data.name
                    if(name == "czjlx"){
                        xwj.curCount[0] = true
                    }else if(name == "xzjlx"){
                        xwj.curCount[1] = true
                    }
                    if(xwj.ypj && xwj.curCount[0] && xwj.curCount[1] && !xwj.curCount[2]){
                        xwj.curCount[2] = true
                        //提示说话,创建按钮
                        sayFun("do1_tip12")
                        var btn_result = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
                        btn_result.setPosition(1030,450)
                        self.addChild(btn_result)
                        btn_result.addClickEventListener(function(){
                            self.nodebs.say({key:"result"})
                        })
                    }
                    
                }
            })
        }
        //载玻片放入到显微镜上
        var zbpFun = function(item){
            if(item.over){//将载玻片放到显微镜上面
                if(!self.finishGet && xwj){
                    var result = xwj.addItem({
                        item: slide,
                        pos: cc.p(30, 30),//放在载物台上的位置
                        scale: 1.0,
                        fun:function(){
                            slide.noMove = true
                            var tex = null
                            switch(xwj.curKey){
                                case "db":
                                    tex = res.do1_db
                                    break
                                case "gb":
                                    tex = res.do1_gb
                                    break
                            }
                            xwj.setFile({
                                tex: tex,
                                scale: 0.6,
                            })
                        }
                    })
                    if(result){
                        xwj.zbp_OK = true
                        self.finishGet = true
                    }
                }
            }
        }
        //滴管的吸水和放水
        var diguanFun = function(item){
            if(!item.haveWater && checkdistans2(item,cup,50)){
                item.haveWater = true
                item.noMove = true
                item.runAction(cc.sequence(
                    cc.moveTo(0.2,370,380),
                    cc.moveTo(0.4,370,250),
                    cc.callFunc(function(){
                        var yeti = createSp("#diguan01.png",cc.p(18,6),item)
                        yeti.setScale(0)
                        yeti.setAnchorPoint(0.5,0)
                        yeti.runAction(cc.scaleTo(0.4,1.5,1.5))    
                    }),
                    cc.delayTime(0.5),
                    cc.moveTo(0.4,370,380),
                    cc.callFunc(function(){
                        item.noMove = false
                        item.getChildren()[0].runAction(cc.repeatForever(
                            ani("diguan%02d.png",1,10,0.2)
                        ))
                    })
                ))
            }else if(item.haveWater && !item.noMove && checkdistans2(item,slide,50)){
                item.noMove = true 
                item.setPosition(slide.x+100,slide.y+110)
                item.runAction(cc.sequence(
                    cc.callFunc(function(){
                        item.getChildren()[0].runAction(cc.scaleTo(0.6,0.7,0.7))
                    }),
                    cc.delayTime(0.7),
                    cc.callFunc(function(){
                        //滴管滴水到载玻片上，移除瓶子
                        sayFun("do1_tip5")
                        judgeFun(4,5)
                        item.setPositionY(-500)
                        item.removeFromParent()
                        cup.removeFromParent()
                        self.toolbtn.getindex(2).removeFromParent()
                        cup = null
                        slide.setSpriteFrame("bolipian02.png")
                    })
                ))
            }
        }
        //吸水纸
        var xishuiFun = function(item){
            if(!item.noMove && checkdistans(item,slide,100)){
                item.noMove = true
                item.setPosition(470,145)
                item.runAction(cc.sequence(
                    ani("xishui%02d.png",1,10,0.3),
                    cc.delayTime(0.3),
                    cc.callFunc(function(){
                        item.setPositionY(-500)
                        slide.runAction(cc.sequence(
                            ani("bolipian%02d.png",10,15,0.2),
                            cc.callFunc(function(){
                                slide.setPosition(470,100)
                                slide.setSpriteFrame("bolipian16.png")
                            }),
                            cc.delayTime(0.5),
                            cc.callFunc(function(){
                                //提示该放显微镜了
                                slide.noMove = false
                                slide.over = true
                                sayFun("do1_tip7")
                                judgeFun(6,7)
                            })
                        ))
                    })
                ))
            }
        }
        //盖玻片方法 镊子
        var gaibopianFun = function(item){
            if(self.toolbtn.getindex(7)){//取出盖玻片
                if(!item.havegai && checkdistans2(item,self.toolbtn.getindex(7),40)){
                    item.havegai = true
                    item.noMove = true 
                    item.setPosition(400,165)
                    var gai = createSp(res.gai, cc.p(-14,-4), item)
                    item.runAction(cc.sequence(
                        cc.moveTo(0.6,430,260),
                        cc.callFunc(function(){
                            item.noMove = false
                            self.toolbtn.getindex(7).setPositionY(-300)
                        })
                    ))

                }
            }
            //将盖玻片盖到载玻片上面
            if(item.havegai && checkdistans2(item,slide,60)){
                item.havegai = false 
                item.noMove = true
                item.setPosition(slide.x+120,slide.y+80)
                item.removeAllChildren()
                item.runAction(cc.sequence(
                    cc.delayTime(0.2),
                    cc.moveTo(1,slide.x+140,slide.y+80)
                ))
                slide.runAction(cc.sequence(
                    ani("bolipian%02d.png",3,9,0.25),
                    cc.delayTime(0.3),
                    cc.callFunc(function(){
                        item.setPositionY(-500)
                        //提示取出吸水纸
                        sayFun("do1_tip6")
                        judgeFun(5,6)
                    })
                ))
            }
        }
        //纱布 载玻片
        var gauzeCall = function(item){
            var call = function(){
                item.runAction(cc.sequence(
                    cc.delayTime(0.1),
                    cc.moveTo(0.05,slide.x+130,slide.y+40),
                    cc.moveTo(0.3,slide.x+80,slide.y+40),
                    cc.delayTime(0.1),
                    cc.moveTo(0.2,slide.x+130,slide.y+60)
                ))
            }

            item.runAction(cc.sequence(
                cc.callFunc(function(){
                    call()
                }),
                cc.delayTime(0.8),
                cc.callFunc(function(){
                    call()
                }),
                cc.delayTime(0.8),
                cc.callFunc(function(){
                    call()
                }),
                cc.delayTime(0.8),
                cc.callFunc(function(){
                    item.setPositionY(-600)
                    sayFun("do1_tip4")
                    judgeFun(3,4)
                })
            ))
        }
        //倒水
        var daoshuiFun = function(item){
            if(!item.noMove && checkdistans(item,cup,180)){
                safeAdd(self, cup)
                item.setPosition(480,350)
                item.noMove = true
                item.runAction(cc.sequence(
                    ani("daoshui%02d.png",1,16,0.2),
                    cc.callFunc(function(){
                        item.setPositionY(-500)
                        //生长
                        sayFun("do1_tip14")
                        var wenzi = createSp(res.do_wenzi,cc.p(570,420),self)
                        var time = ["第一天","第二天","第三天","第四天","第五天",
                                    "第六天","第七天","第八天","第九天","第十天"]
                        var label = new cc.LabelTTF("第一天", "Arial", 28)
                        label.setPosition(320,340)
                        self.addChild(label)
                        //水变色
                        var bianse = createSp("#bianse01.png", cc.p(75,120), cup)
                        var qipao2 = createSp("#qipao2_01.png", cc.p(75,120), cup)
                        qipao2.setScale(0.52,0.75)
                        qipao2.setLocalZOrder(-1)
                        bianse.setLocalZOrder(-2)
                        qipao2.runAction(cc.sequence(
                            ani("qipao2_%02d.png",1,10,0.3),
                            cc.callFunc(function(){
                                var qipao1 = createSp("#qipao1_01.png", cc.p(75,120), cup)
                                qipao1.setScaleX(0.63)
                                qipao1.setLocalZOrder(-1)
                                qipao1.runAction(cc.repeatForever(
                                    ani("qipao2_%02d.png",1,30,0.15)
                                ))
                                qipao2.runAction(cc.repeatForever(
                                    ani("qipao2_%02d.png",1,30,0.15)
                                ))
                            }),
                            cc.delayTime(5),
                            cc.callFunc(function(){
                                cc.log("qipao3,start")
                                var qipao3 = createSp("#qipao2_01.png", cc.p(75,120), cup)
                                qipao3.setScale(0.52,0.75)
                                qipao3.setLocalZOrder(-1)
                                qipao3.runAction(cc.repeatForever(
                                    ani("qipao2_%02d.png",1,30,0.15)
                                ))
                            })
                        ))
                        var count = 0
                        addTimer({
                            fun:function(key){
                                count++
                                if(count == 10){
                                    removeTimer(key)
                                    label.removeFromParent()
                                    wenzi.removeFromParent()
                                    sayFun("do1_tip3")
                                    judgeFun(2,3)
                                    return
                                }
                                cc.log(count)
                                bianse.setSpriteFrame(sprintf("bianse%02d.png",count))
                                label.setString(time[count])
                            },
                            time:3,
                            repeat: cc.REPEAT_FOREVER
                        })
                    })
                ))
                var shuimian = createSp("#shuimian.png",cc.p(75,15),cup)
                shuimian.setVisible(false)
                shuimian.runAction(cc.sequence(
                    cc.delayTime(1.2),
                    cc.callFunc(function(){
                        shuimian.setVisible(true)
                    }),
                    cc.moveTo(2,75,235)
                ))                   
            }
        }
        //剪刀
        var jiandaoFun = function(item){
            if(!item.noMove && checkdistans(item,cup,150)){
                item.noMove = true
                cup.runAction(cc.sequence(
                    ani("jianping%02d.png", 1, 5, 0.2),
                    cc.callFunc(function(){
                        item.setPositionY(-500)
                    }),
                    ani("jianping%02d.png", 6, 16, 0.2),
                    cc.callFunc(function(){
                        cup.setSpriteFrame("pingzi.png")
                        cup.setPosition(cup.x+6,cup.y-109)
                        sayFun("do1_tip2")
                        judgeFun(0,1)
                    })
                ))
            }
        }
        //插玻璃
        var slideFun = function(item){
            if(slide){
                if(!item.noMove && checkdistans(item,slide,100)){
                    item.setLocalZOrder(10)
                    item.noMove = true 
                    item.setPosition(slide.x+100,slide.y+40)
                    gauzeCall(item)
                }
            }
        }

        var ani = function(frame,start,end,time){
            return cc.sequence(createAnimation({
                frame: frame,
                start:start,
                end: end,
                time: time,
            }))
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
        var checkdistans2 = function(ra,rb,dis){
            var dx =  ra.x-ra.width/2 - rb.x
            var dy = ra.y-ra.height/2 - (rb.y+rb.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis){
                return true
            }else
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
            {key:"do1_tip0",img:res.do1_tip0,sound:res.do1_sound0},
            {key:"do1_tip1",img:res.do1_tip1,sound:res.do1_sound1},
            {key:"do1_tip2",img:res.do1_tip2,sound:res.do1_sound2},
            {key:"do1_tip3",img:res.do1_tip3,sound:res.do1_sound3},
            {key:"do1_tip4",img:res.do1_tip4,sound:res.do1_sound4},
            {key:"do1_tip5",img:res.do1_tip5,sound:res.do1_sound5},
            {key:"do1_tip6",img:res.do1_tip6,sound:res.do1_sound6},
            {key:"do1_tip7",img:res.do1_tip7,sound:res.do1_sound7},
            {key:"do1_tip8",img:res.do1_tip8,sound:res.do1_sound8},
            {key:"do1_tip9",img:res.do1_tip9,sound:res.do1_sound9},
            {key:"do1_tip10",img:res.do1_tip10,sound:res.do1_sound10},
            {key:"do1_tip11",img:res.do1_tip11,sound:res.do1_sound11},
            {key:"do1_tip12",img:res.do1_tip12,sound:res.do1_sound12},
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
            key: "do1_tip14",
            sound: res.do1_sound14,
        })
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.do1_tip13,
            sound: res.do1_sound13,
            id: "result"
        })
    },
})