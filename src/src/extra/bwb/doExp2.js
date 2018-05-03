var tempList = {
    bei:2.5,
    bei_gai:2.2,
    bei_mj:1.8,
    bei_pm:2,
    bei_gai_mj:1.3,
    bei_gai_pm:1.5,
}
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
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
                            json: res.bwb_tableNode2_json,
                            scale:0.8,
                            inputNum: 18,
                            //rootColor:cc.color(130, 95, 205, 255),
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
        self.nodebs.show(function() {
            self.nodebs.say({key:"do2_tip1"})
        })
        self.createTool()
    },

    createTool : function(){
        var self = this
        loadPlist("do2_plist")
        loadPlist("sbds")
        loadPlist("rq_plist")
        var curLocal = 20
        var curNum = 1
        var tipJudge = [true,true,true,false]
        var toolbtn = createTool({
            pos: cc.p(120, 520),
            nums: 3,
            scale:0.8,
            tri: "down",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.6),
            itempos: cc.p(0, -15),
            circlepos: cc.p(0, 18),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [1000, 1000, 1000, 1000,1000,1000,1000],
            swallow: [true, true, true, true, true, true, true],
            files: [res.tools_1, res.tools_2, res.tools_3, res.tools_4,res.tools_5,res.tools_6,res.tools_7],
            gets: ["#bei.png","#sb.png","#du1.png",null,"#gai.png","#maojin.png","#paomo.png"],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                firstFun(index,item)
                if(index == 3){
                    item = createWatch()
                    item.setScale(0.9)
                }
                item.setLocalZOrder(curLocal)
                return item
            },
            clickfun : function(data){
                var item = data.sp
                var pos = data.pos
                var index = data.index
                if(index == 2 && item.noMove){
                    return false
                }
                if(index == 4 && item.inGai){//点击盖子触发事件
                    item.getParent().noGai = true
                    item.setPosition(pos)
                    item.inGai = false
                    item.canGai = false
                    if(item.getParent().getChildByName("rq"))
                        createHot(item.getParent().getChildByName("rq"))
                    if(getCurIndex(2)){
                        for (var i = getCurIndex(2).length - 1; i >= 0; i--) {
                            if(getCurIndex(2)[i].num == item.num){
                                getCurIndex(2)[i].setPosition(114,265)
                                safeAdd(item.getParent(),getCurIndex(2)[i])
                                safeAdd(item.getParent(),item.getParent().getChildByName("bei2"))
                                getCurIndex(2)[i].setLocalZOrder(0)
                                changeTime(item.getParent())
                            }
                        }
                    }
                    safeAdd(self,item)
                }
                if(index == 5 && item.inBei){
                    item.getParent().noMj = true
                    item.setSpriteFrame("maojin.png")
                    item.inBei = false
                    item.canBei = false
                    if(!item.getParent().noWdj)
                        changeTime(item.getParent())
                    safeAdd(self,item)
                    item.setPosition(pos)
                }
                if(index == 6 && item.inBei){
                    item.getParent().noPm = true
                    item.setSpriteFrame("paomo.png")
                    item.inBei = false
                    item.canBei = false
                    if(!item.getParent().noWdj)
                        changeTime(item.getParent())
                    safeAdd(self,item)
                    item.setPosition(pos)
                }
                item.setLocalZOrder(curLocal)
                curLocal++
                return true
            },
            movefun:function(data){
                var item = data.sp
                var index = data.index
                var delta = data.delta
                var pos = data.pos
                var beis = getCurIndex(0)
                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                }

                if(beis){
                    //烧杯碰到杯子开始倒水
                    if(index == 1){
                        for (var i = beis.length - 1; i >= 0; i--) {
                            if(cc.rectIntersectsRect(item,beis[i]) && beis[i].noWater){
                                var bei = beis[i]
                                bei.noWater = false
                                item.getChildByName("rq").removeFromParent(true)
                                item.runAction(anisbds(item,bei))
                                item.setPosition(bei.x-150,bei.y+200)
                                item.disMove(true)
                                bei.disMove(true)
                            }
                        }
                    }
                    //温度计碰到杯子
                    if(index == 2){
                        for (var i = beis.length - 1; i >= 0; i--) {
                            if(rectIntersectsRect(item,beis[i]) && beis[i].noWdj){
                                var bei = beis[i]
                                //判断当前杯子中没有水
                                if(bei.noWater){
                                     item.dialog = true
                                }else{
                                    bei.noWdj = false
                                    safeAdd(bei,item)
                                    item.setName("WDJ")
                                    item.setLocalZOrder(0)
                                    item.inGai = true
                                    item.disMove(true)
                                    item.num = bei.num
                                    if(!bei.noGai){
                                        for(var j = getCurIndex(4).length - 1 ; j >= 0 ; j--){
                                            if(getCurIndex(4)[j].num == item.num){
                                                item.gai = getCurIndex(4)[j]
                                                item.gai.setLocalZOrder(0)
                                                safeAdd(item.gai,item)
                                                safeAdd(item.gai,item.gai.getChildByName("gai2"))
                                                item.setLocalZOrder(0)
                                                item.stopAllActions()
                                                item.setPosition(102,246)
                                                item.stopAllActions()
                                                item.runAction(cc.sequence(
                                                    cc.moveTo(0.4,102,86.73),
                                                    cc.callFunc(function(){
                                                        createBigWdj(bei)
                                                        item.getChildByName("du").setScaleY(7.5)
                                                        changeTime(bei)
                                                    })
                                                ))
                                                //safeAdd(bei,bei.getChildByName("bei2"))
                                            }
                                        }
                                    }else{
                                        item.setPosition(114,430)
                                        item.runAction(cc.sequence(
                                        cc.moveTo(0.4,114,265),
                                        cc.callFunc(function(){
                                            createBigWdj(bei)
                                            item.getChildByName("du").setScaleY(7.5)
                                            changeTime(bei)
                                            })
                                        ))
                                    }
                                    safeAdd(bei,bei.getChildByName("bei2"))
                                    if(tipJudge[1]){
                                    self.nodebs.say({key:"do2_tip3",force:true})
                                    tipJudge[1] = false
                                    tipJudge[2] = true
                                    }
                                }      
                            }else if(item.dialog){
                                item.dialog = false
                            }
                        } 
                    }

                    //盖子碰到杯子
                    if(index == 4){
                        for (var i = beis.length - 1; i >= 0; i--) {
                            if(cc.rectIntersectsRect(item,beis[i]) && beis[i].noGai && item.canGai){
                            var bei = beis[i]
                            if(!bei.noWater){
                                bei.noGai = false
                                safeAdd(bei,item)
                                item.setName("GAI")
                                item.setPosition(80,210)
                                item.inGai = true
                                item.disMove(true)
                                item.num = bei.num
                                if(bei.getChildByName("rq")){
                                    bei.getChildByName("rq").removeAllChildren()
                                }
                                if(!bei.noWdj){
                                    for(var j = getCurIndex(2).length - 1 ; j >= 0 ; j--){
                                        if(getCurIndex(2)[j].num == item.num){
                                            item.wdj = getCurIndex(2)[j]
                                            item.setLocalZOrder(0)
                                            safeAdd(item,item.wdj)
                                            safeAdd(item,item.getChildByName("gai2"))
                                            item.wdj.setName("WDJ")
                                            item.wdj.setLocalZOrder(0)
                                            item.wdj.setPosition(102,86.75)
                                            safeAdd(bei,bei.getChildByName("bei2"))
                                            changeTime(bei)
                                        }
                                    }
                                }
                            }else{
                                    item.dialog = true
                                }
                            }else if(item.dialog){
                                item.dialog = false
                            }
                        } 
                    }

                    //毛巾碰到杯子
                    if(index == 5){
                        for (var i = beis.length - 1; i >= 0; i--) {
                            if(cc.rectIntersectsRect(item,beis[i]) && beis[i].noMj && item.canBei){
                                var bei = beis[i]
                                bei.noMj = false
                                safeAdd(bei,item)
                                item.setPosition(105,93)
                                item.setSpriteFrame("maojin2.png")
                                item.disMove(true)
                                item.inBei = true
                                item.num = bei.num            //用来检测当前在第几个杯子中
                                if(!bei.noPm){
                                    for(var j = getCurIndex(6).length-1 ; j >= 0 ; j--){
                                        if(getCurIndex(6)[j].num == bei.num){
                                            getCurIndex(6)[j].forceBack()
                                            beis[i].noPm = true
                                        }
                                    }
                                }
                                if(!item.getParent().noWdj)
                                    changeTime(item.getParent())
                            }
                        }
                    }
                    //泡沫碰到杯子
                    if(index == 6){
                        for (var i = beis.length - 1; i >= 0; i--) {
                            if(cc.rectIntersectsRect(item,beis[i]) && beis[i].noPm && item.canBei){
                                var bei = beis[i]
                                bei.noPm = false
                                safeAdd(bei,item)
                                item.setPosition(82,96)
                                item.setSpriteFrame("paomo2.png")
                                item.disMove(true)
                                item.inBei = true
                                item.num = bei.num            //用来检测当前在第几个杯子中
                                if(!bei.noMj){
                                    for(var j = getCurIndex(5).length-1 ; j >= 0 ; j--){
                                        if(getCurIndex(5)[j].num == bei.num){
                                            getCurIndex(5)[j].forceBack()
                                            beis[i].noMj = true
                                        }  
                                    }
                                }
                                if(!item.getParent().noWdj)
                                    changeTime(item.getParent())
                            }
                        }
                    }
                }
            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
                if((index == 2 || index == 4)&& item.dialog){
                    item.dialog = false
                    createDialog()
                }
                if(index == 4){
                    if(item.inGai)
                        item.disMove(false)
                    if(!item.canGai)
                        item.canGai = true
                }
                if(index == 5 || index == 6){
                    if(item.inBei)
                        item.disMove(false)
                    if(!item.canBei)
                        item.canBei = true
                }
            },
            backfun:function(data){
                var index = data.index
                var item = data.sp
                if(index == 0){
                    if(item.myKey){
                        removeTimer(item.myKey)
                        cc.log("stop timer")
                    }    
                }else if(index == 2){
                    if(item.noMove)
                        return false
                }
             return true
            }
        });
        this.addChild(toolbtn)
        toolbtn.show()
        self.toolbtn = toolbtn

        var changeTime = function(bei){
            var bei = bei
            var dis = 2.5
            if(!bei.noGai && !bei.noPm)     dis = tempList.bei_gai_pm
            else if(!bei.noGai && !bei.noMj)   dis = tempList.bei_gai_mj
            else if(!bei.noPm && bei.noGai)     dis = tempList.bei_pm
            else if(!bei.noMj && bei.noGai)     dis = tempList.bei_mj
            else if(!bei.noGai)     dis = tempList.bei_gai

            var wdj = bei.getChildByName("WDJ")
            if(!bei.noGai)
                 wdj = bei.getChildByName("GAI").getChildByName("WDJ")
            cc.log("curDis---",dis)
            
            var line = wdj.getChildByName("du")
            var kd = bei.getChildByName("layOut").getChildByName("kd")
            kd.dis = dis
            if(bei.myKey){
                removeTimer(bei.myKey)
            }
            var kdFun = function(curkd,bei){
                curkd.setPositionY(curkd.y+curkd.dis)
                if(tipJudge[2] && curkd.y > 350){  //判断能否提示第四句对话框
                    self.nodebs.say({key:"do2_tip4",force:true})
                    tipJudge[2] = false                                
                }
                if(curkd.y >= 420){
                    removeTimer(bei.myKey)
                }      
            }
            bei.myKey = sprintf("kdKey%d", bei.num)
            addTimer({
                fun:function(){
                    kdFun(kd,bei)
                },
                time:1.5,
                repeat:1000,
                key:bei.myKey
            })
            line.stopAllActions()
            line.time = 322 / (kd.dis/1.5)
            line.runAction(cc.scaleTo(line.time,1,4.3))
        }


        var getCurIndex = function(index){
            var item = self.toolbtn.getindex(index)
            return item
        }

        var anisbds = function(item,bei) {
            return cc.sequence(createAnimation({
                frame: "sbds%02d.png",
                start: 1,
                end: 16,
                time: 0.2
            }), cc.callFunc(function() {
                item.removeFromParent(true)
                bei.disMove(false)
                createHot(bei.getChildByName("rq"))
                if(tipJudge[0]){
                    self.nodebs.say({key:"do2_tip2",force:true})
                    tipJudge[0] = false
                }
            }))
        }

        var firstFun = function(index,item){
            if(index == 0){
                var bei2 = new cc.Sprite("#bei2.png")
                bei2.setPosition(103,95)
                item.addChild(bei2)
                bei2.setName("bei2")
                item.num = curNum
                curNum++
                item.noWater = true
                item.noWdj = true
                item.noGai = true
                item.noMj = true
                item.noPm = true

                var rq = new cc.Sprite("#rq.png")
                rq.setPosition(-30,50)
                item.addChild(rq)
                rq.setName("rq")
                rq.setScaleX(1.3)
            }
            if(index == 1){
                var rq = new cc.Sprite("#rq.png")
                rq.setPosition(-30,0)
                item.addChild(rq)
                rq.setScaleX(1.3)
                createHot(rq)
                rq.setName("rq")
            }
            if(index == 2){
                var du2 = new cc.Sprite("#du2.png")
                du2.setPosition(11.27,176.5)
                item.addChild(du2)
                var du5 = new cc.Sprite("#du5.png")
                du5.setPosition(11,20.5)
                item.addChild(du5)
                var du3 = new cc.Sprite("#du3.png")
                du3.setPosition(11.8,214)
                item.addChild(du3)
                var du = new cc.Sprite("#du6.png")
                du.setPosition(11,39)
                du.setAnchorPoint(0.5,0)
                item.addChild(du)
                du.setName("du")
                item.dialog = false
            }
            if(index == 4){
                var gai2 = new cc.Sprite("#gai2.png")
                gai2.setPosition(68,21)
                gai2.setScale(0.97)
                gai2.setName("gai2")
                item.addChild(gai2)
                item.inGai = false
                item.canGai = true
            }

            if(index == 5){
                item.inBei = false   //用来控制碰撞后不能移动
                item.canBei = true   //用来控制，再次拖出来的时候能够拖出来
            }
            if(index == 6){
                item.inBei = false
                item.canBei = true
            }
        }

        var createBigWdj = function(bei){
            var layOut = createLayout({
            pos: cc.p(30, 380),
            size: cc.size(103,198),
            })
            bei.addChild(layOut)
            layOut.setClippingEnabled(true)
            layOut.setAnchorPoint(0.5,0.5)
            var box = new cc.Sprite("#box.png")
            box.setPosition(30,380)
            bei.addChild(box)
            var kd_bg = new cc.Sprite("#kd_bg.png")
            kd_bg.setPosition(50,80)
            layOut.addChild(kd_bg)
            var line = new cc.Sprite("#line.png")
            line.setScaleY(2)
            line.setPosition(52,17.5)
            layOut.addChild(line)
            var kd = new cc.Sprite("#kd.png")
            kd.setPosition(48,98)
            kd.setAnchorPoint(0.35,0.57)
            layOut.addChild(kd)
            kd.setName("kd")
            layOut.setName("layOut")
        }

        var createHot = function(item){
            var anirq = function(start,end) {
                return cc.repeatForever(cc.sequence(createAnimation({
                    frame: "rq%02d.png",
                    start:start,
                    end: end,
                    time: 0.4
                })))
            }
            for(var i = 0 ; i < 3 ; i++){
                var hot = new cc.Sprite(res.rq)
                item.addChild(hot)
                hot.setPosition(80+i*30,200)
                hot.start = 1 + i*1
                hot.end = 10 - i*1
                hot.runAction(anirq(hot.start,hot.end))
            }
        }

        var createDialog = function(){
            AddDialog("Tips", {
                res: res.dialog_1,
                face: 2,
                confirmBtn:true,
            })
         }

        var rectIntersectsRect = function( ra, rb ){
            var maxax = ra.x + ra.width/2,
                maxay = ra.y + ra.height/2,
                maxbx = rb.x + rb.width/2,
                maxby = rb.y + rb.height/2;
            return !(maxax < rb.x-rb.width/2 || maxbx < ra.x-ra.width/2 || maxay < rb.y-rb.height/2 || maxby < ra.y-ra.height/2);
    }          
},

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do2_tip1",img:res.do2_tip1,sound:res.do2_sound_1},
            {key:"do2_tip2",img:res.do2_tip2,sound:res.do2_sound_2},
            {key:"do2_tip3",img:res.do2_tip3,sound:res.do2_sound_3},
            {key:"do2_tip4",img:res.do2_tip4,sound:res.do2_sound_4},
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