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
        loadPlist("do1_plist")
        loadPlist("daoshui_plist")

        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
        })

        var btn_result1 = new ccui.Button(res.btn_do1_1,res.btn_do1_2)
        btn_result1.setPosition(100,450)
        self.addChild(btn_result1)
        var btn_result2 = new ccui.Button(res.btn_do1_3,res.btn_do1_4)
        btn_result2.setPosition(100,350)
        self.addChild(btn_result2)
        btn_result1.setVisible(false)
        btn_result2.setVisible(false)

        btn_result1.addClickEventListener(function(){
            if(btn_result1.isVisible()){
                self.nodebs.say({key:"result"})
            }
        })
        btn_result2.addClickEventListener(function(){
            if(btn_result2.isVisible()){
                self.answerImg.show()
                //self.nodebs.say({key:"do1_tip6"})
            }
        })

        var createSp = function(res,pos,father){
            var sp = new cc.Sprite(res)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var caoh = createSp("#caoh.png",cc.p(550,125),self)
        var shuimian = createSp("#shuimian.png",cc.p(550,31),self)
        shuimian.setAnchorPoint(0.5,0)
        var caoq = createSp("#caoq.png",cc.p(550,120),self)
        var huocai = createSp("#huocai.png",cc.p(570,-100),self)
        huocai.huo = createSp("#huo01.png",cc.p(18,20),huocai)
        var lazhu = null

        var createDialog = function(img){
            AddDialog("Tips", {
                res: img,
                face: 2,
                confirmBtn:true,
            })
        }

        var judgeList = [false,false,false,false]

        var toolbtn = createTool({
            pos: cc.p(350, 550),
            nums: 4,
            scale:0.75,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -15),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [1, 1, 1, 1],
            swallow: [true, true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3, res.do_tools4],
            gets: ["#lazhu.png", "#cup.png", "#cupGai01.png","#daoshui.png"],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp

                switch(index){
                    case 1:
                        if(!judgeList[0]){
                            createDialog(res.dialog1)
                            return false
                        }
                    break
                    case 2:
                        if(!judgeList[1]){
                            createDialog(res.dialog2)
                            return false
                        }
                    break
                    case 3:
                        if(!judgeList[2]){
                            createDialog(res.dialog3)
                            return false
                        }
                    break
                }

                if(index == 0)
                    lazhu = item
                
                return item 
            },
            clickfun: function(data){
                var index = data.index
                var item = data.sp
                var pos = data.pos
                
                return true 
            },
            movefun: function(data){
                var index = data.index
                var item = data.sp
                var delta = data.delta

                switch(index){
                    case 0:
                        if(!item.noMove && rectIntersectsRect(item,caoh)){
                            item.noMove = true
                            safeAdd(self, caoq)
                            item.runAction(cc.sequence(
                                cc.moveTo(0.2,550,250),
                                cc.moveTo(0.4,550,80),
                                cc.callFunc(function(){
                                    huocai.setPositionY(400)
                                    huocai.huo.runAction(aniRepeat("huo%02d.png",5))
                                })
                            ))
                        }
                    break
                    case 1:
                        if(item.x != 550)
                            item.x = 550
                        if(item.y < 220){
                            item.noMove = true
                        }
                        if(!item.noMove){
                            item.y += delta.y
                        }
                    break
                    case 2:
                        if(!item.noMove && rectIntersectsRect(item,self.toolbtn.getindex(1))){
                            item.noMove = true
                            var cup = self.toolbtn.getindex(1)
                            item.setPosition(cup.x+2,cup.y+180)
                            item.runAction(aniRepeat("cupGai%02d.png",2))
                            item.runAction(cc.sequence(
                                cc.moveTo(1,cup.x+2,cup.y+160),
                                cc.callFunc(function(){
                                    //蜡烛开始计时
                                    lazhu.runAction(cc.sequence(
                                        cc.delayTime(10),
                                        cc.callFunc(function(){
                                            lazhu.huoyan.stopAllActions()
                                            lazhu.huoyan.runAction(cc.sequence(
                                                cc.scaleTo(0.3,0),
                                                cc.callFunc(function(){
                                                    //提示倒水
                                                    btn_result1.setVisible(true)
                                                    judgeList[2] = true
                                                    self.nodebs.say({key:"do1_tip3",force:true})
                                                })
                                            ))
                                        })
                                    ))
                                    shuimian.shuizhu = createSp("#shuizhu.png",cc.p(170,70),caoh)
                                    shuimian.shuizhu.setScaleY(0)
                                    shuimian.shuizhu.runAction(cc.sequence(
                                        cc.scaleTo(11,1,0.5)
                                    ))
                                    item.stopAllActions()
                                })
                            ))
                        }
                    break
                    case 3:
                        if(rectIntersectsRect(item,caoh) && !item.noMove){
                            item.noMove = true 
                            item.setPosition(800,300)
                            shuimian.runAction(cc.sequence(
                                cc.delayTime(1),
                                cc.scaleTo(0.6,1,1.4)
                            ))
                            item.runAction(cc.sequence(
                                ani("daoshui%02d.png",1,17,0.15),
                                cc.delayTime(0.5),
                                cc.callFunc(function(){
                                    item.setPositionY(-1000)
                                    //盖子
                                    var gai = self.toolbtn.getindex(2)
                                    gai.runAction(aniRepeat("cupGai%02d.png",2))
                                    gai.runAction(cc.sequence(
                                        cc.moveTo(1,self.toolbtn.getindex(1).x+2,self.toolbtn.getindex(1).y+180),
                                        cc.delayTime(0.5),
                                        cc.callFunc(function(){
                                            gai.stopAllActions()
                                            gai.setPositionY(-100)
                                            huocai.setPosition(660,400)
                                            huocai.runAction(cc.sequence(
                                                cc.moveTo(0.5,580,390),
                                                cc.rotateTo(0.4,-30),
                                                cc.delayTime(2.5),
                                                cc.callFunc(function(){
                                                    huocai.huo.stopAllActions()
                                                    huocai.huo.setScale(0)
                                                    //huocai.huo.runAction(cc.scaleTo(0.3,0))
                                                }),
                                                cc.delayTime(1),
                                                cc.moveTo(0.5,580,440),
                                                cc.moveTo(0.5,660,400),
                                                cc.callFunc(function(){
                                                    //结论二设置可见
                                                    btn_result2.setVisible(true)
                                                })
                                            ))
                                        })
                                    ))
                                })
                            ))
                        }
                    break
                }

                if(!item.noMove && index != 1){
                    item.x += delta.x 
                    item.y += delta.y
                }
                
            },
            outfun: function(data){
                var index = data.index
                var item = data.sp
                if(index == 1){
                    if(item.noMove && item.y != 210){
                        item.y = 210
                        judgeList[1] = true
                    }
                }
                
            },
            backfun: function(){
                return false
            }
        })
        self.inside_node.addChild(toolbtn,1)
        self.toolbtn = toolbtn
        toolbtn.show()

        huocai.judge = false
        huocai.noMove = false 
        loadPlist("huoyan_plist")
        createTouchEvent({
            item:huocai,
            begin:function(data){
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(!item.noMove) 
                    item.y += delta.y
                if(item.y < 150 && !item.judge){
                    judgeList[0] = true
                    self.nodebs.say({key:"do1_tip2",force:true})
                    item.judge = true
                    item.y = -1000
                    item.noMove = true
                    lazhu.huoyan = createSp("#huoyan01.png",cc.p(126,88),lazhu)
                    lazhu.huoyan.setAnchorPoint(0.5,0)
                    lazhu.huoyan.runAction(aniRepeat("huoyan%02d.png",11))
                }
            }
        })

        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time
            }))
        }

        var aniRepeat = function(frame,end){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame: frame,
                end: end,
                time: 0.15
            })))
        }

        var rectIntersectsRect = function (ra, rb) {
            var maxax = ra.x + ra.width/2,
                maxay = ra.y + ra.height/2,
                maxbx = rb.x + rb.width/2,
                maxby = rb.y + rb.height/2;
            return !(maxax < rb.x - rb.width/2 || 
                maxbx < ra.x - ra.width/2 || 
                maxay < rb.y - rb.height/2 ||
                maxby < ra.y - ra.height/2/2);
        }
    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)

        var addList = [
            {key:"do1_tip1",img:res.do1_tip1,sound:res.do1_sound1},
            {key:"do1_tip2",img:res.do1_tip2,sound:res.do1_sound2},
            {key:"do1_tip3",img:res.do1_tip3,sound:res.do1_sound3},
            {key:"do1_tip4",img:res.do1_tip4,sound:res.do1_sound4},
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
            img: res.do1_tip5,
            sound: res.do1_sound5,
            id: "result",
        })
        addContent({
            people: this.nodebs,
            key: "do1_tip6",
            sound: res.do1_sound6,
        })
        var self = this
        this.answerImg = createShowImg({
            img:res.do1_tip6,
            inFun: function(){
                self.nodebs.say({key:"do1_tip6"})
            },
            outFun: function(){
                self.nodebs.stopSay()
            }
        })
        safeAdd(this, this.answerImg)
        
    },
})