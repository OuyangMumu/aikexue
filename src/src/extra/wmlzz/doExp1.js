var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor({
            setZ:99,
        })
        this.initPeople()
        this.initUI()
        return true;
    },

    initUI : function(){
    	var self = this

        self.createTool()
    },

    createTool:function(){
        var self = this
        loadPlist("dzdh")
        loadPlist("jbz")
        loadPlist("jb")
        loadPlist("ds")
        loadPlist("mjAni")
        loadPlist("pps")
        loadPlist("czAni")
        self.nodebs.show(function() {
            self.nodebs.say({key:"do1_tip1"})
        })

        var btn_fx = new ccui.Button("res/btn/btn_get_normal.png","res/btn/btn_get_select.png")
        btn_fx.setPosition(100,200)
        self.addChild(btn_fx)
        btn_fx.addClickEventListener(function () {
            self.nodebs.say({key:"do1_faxian"})
        })

        var xiang_hou = new cc.Sprite(res.xiang_hou)
        xiang_hou.setPosition(568,150)
        self.addChild(xiang_hou)
        var paper = new cc.Sprite("#jbz01.png")
        paper.setPosition(568,105)
        self.addChild(paper)
        paper.setScale(0.9)
        var xiang_zhong = new cc.Sprite(res.xiang_zhong)
        xiang_zhong.setPosition(568,105)
        self.addChild(xiang_zhong)
        var xiang_qian = new cc.Sprite(res.xiang_qian)
        xiang_qian.setPosition(568,147)
        self.addChild(xiang_qian)
        var xiangList = [xiang_hou,paper,xiang_zhong,xiang_qian]
        var curDialog = 0
        var toolbtn = createTool({
            pos: cc.p(250, 520),
            nums: 4,
            scale:0.95,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.2, 1.5),
            itempos: cc.p(0, -10),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [1, 1, 1, 1],
            swallow: [true, true, true, true],
            files: [res.tools_1, res.tools_2, res.tools_3, res.tools_4],
            gets: [res.paper, res.hand, res.chaozhi, res.towel],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                if(index != curDialog  && curDialog != 3){
                    dialog(index)   //判断点击了其他工具，并创建提示框
                    return false
                }
                if(index == 1)  item.setAnchorPoint(0.5,0.8)
                if(index == 2){
                    item.setAnchorPoint(0.5,0.3)
                    item.setScale(0.9)
                    item.over = false
                    item.mj = false   //用来可以和毛巾开始检测
                    item.drag = false //用来判断可以把纸撕出来了
                }
                if(index == 3)  item.setScale(0.8)
                return item
            },
            clickfun : function(data){
                var item = data.sp
                var pos = data.pos
                var index = data.index
                if(index == 2 && item.drag){
                    item.drag = false
                    item.setScale(0.9)
                    item.setPosition(item.x-30,item.y)
                    item.runAction(ani(1,12,0.2,"czAni%02d.png",item))
                }
                if(item.noMove) return false
                item.setPosition(pos)
                return true
            },
            movefun:function(data){
                var item = data.sp
                var index = data.index
                var delta = data.delta
                if(index == 0){
                    if(judgeRect(item)){
                        item.setPosition(480,260)
                        item.setRotation(30)
                        item.setScale(0.9)
                        item.runAction(ani(1,11,0.1,"dzdh%02d.png",item))
                    }
                }else if(index == 1){
                    if(judgeRect(item)){
                        item.setPosition(650,340)
                        item.runAction(anirepeat())
                        paper.runAction(ani(2,21,0.25,"jbz%02d.png",item))
                    }
                }else if(index == 2){
                    if(!item.over){
                        if(judgeRect(item)){
                            safeAdd(self,paper)
                            safeAdd(self,xiang_qian)
                            item.setPosition(568,310)
                            item.runAction(cc.sequence(
                                cc.moveTo(0.5,cc.p(568,130)),
                                cc.callFunc(function () {
                                    czAction(item)
                                })))
                        }
                    }

                    //抄纸和毛巾接触后的动画
                    if(item.mj && cc.rectIntersectsRect(item,toolbtn.getindex(3))){
                        item.mj = false
                        item.disMove(true)
                        var mj = toolbtn.getindex(3)
                        item.runAction(cc.sequence(
                            cc.moveTo(0.2,cc.p(568,200)),
                            cc.callFunc(function () {
                                item.setScale(0.75)
                            }),
                            ani(1,6,0.2,"czs%02d.png"),
                            cc.callFunc(function () {
                                mj.setPositionY(220)
                                mj.setScale(0.8)
                                mj.runAction(ani(1,3,0.2,"mjAni%02d.png"))
                            }),
                            cc.delayTime(0.6),
                            cc.callFunc(function () {
                                item.setVisible(false)
                                mj.setSpriteFrame("mjAni04.png")
                            }),
                            cc.delayTime(0.2),
                            cc.callFunc(function(){
                                var pps = new cc.Sprite("#pps01.png")
                                pps.setPosition(200,250)
                                mj.addChild(pps)
                                pps.runAction(ani(1,19,0.1,"pps%02d.png",mj))
                            }),
                            cc.delayTime(2),
                            cc.callFunc(function(){
                                item.setVisible(true)
                                mj.runAction(ani(5,8,0.2,"mjAni%02d.png"))
                            }),
                            cc.delayTime(0.8),
                            cc.callFunc(function(){
                                mj.setTexture(res.towel)
                                mj.setPositionY(200)
                                mj.setScale(0.9)
                                item.drag = true
                                self.nodebs.say({key:"do1_tip4",force:true})
                            })

                        ))

                    }

                }

                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                 }
            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
                if(index == 3){
                    item.disMove(true)
                    item.setPosition(568,200)
                    var cz = toolbtn.getindex(2)
                    cz.mj = true
                    safeAdd(self,cz)
                }
            },
            backfun:function(data){
                var item = data.sp
                if(item.noMove){
                    return false
                }else{
                    return true
                }
            }
        });
        this.addChild(toolbtn)
        toolbtn.show()

        var dialog = function (index) {
            var dataDialog = [
                {index:1,img:res.dialog_1,img2:res.dialog_2},
                {index:2,img:res.dialog_3,img2:res.dialog_5},
                {index:3,img:res.dialog_6,img2:res.dialog_6},
            ]
            for(var i = 0 ; i < dataDialog.length ; i++){
                if(curDialog == i){
                    if(index == dataDialog[i].index)
                        self.createDialog(dataDialog[i].img)
                    else
                        self.createDialog(dataDialog[i].img2)
                }
            }
        }

        var judgeRect = function (item) {
            if(cc.rectIntersectsRect(item,xiang_hou) && !item.noMove){
                safeAdd(self,xiang_qian)
                item.disMove(true)
                return true
            }
            return false
        }

        var czAction = function(item){
            var time = 0.4
            item.runAction(cc.sequence(
                cc.moveTo(time,cc.p(580,item.y)),
                cc.moveTo(time,cc.p(550,item.y)),
                cc.moveTo(time,cc.p(580,item.y)),
                cc.moveTo(time,cc.p(550,item.y)),
                cc.moveTo(time,cc.p(580,item.y)),
                cc.moveTo(time,cc.p(550,item.y)),
                cc.moveTo(time,cc.p(568,item.y)),
                cc.moveTo(0.2,cc.p(568,item.y-20)),
                cc.callFunc(function(){
                    item.setTexture(res.chaozhi2)
                }),
                cc.moveTo(0.4,cc.p(568,item.y+220)),
                cc.callFunc(function(){
                    addWater(item)
                })
            ))
        }

        var addWater = function(cz){
            var ds = new cc.Sprite("#ds01.png")
            ds.setPosition(160,-100)
            cz.addChild(ds)
            ds.setScale(0.8)
            ds.runAction(cc.sequence(
                anids(),
                anids(),
                anids(),
                cc.callFunc(function () {
                    ds.stopAllActions()
                    cz.removeAllChildren()
                    cz.disMove(false)
                    cz.over = true
                    self.nodebs.say({key:"do1_tip5",force:true})
                    curDialog = 3
                    for(var i = 0 ; i < xiangList.length ; i++){
                        xiangList[i].removeFromParent(true)
                    }
                })
            ))
        }

        var anids = function(){
            return createAnimation({
                frame:"ds%02d.png",
                start: 1,
                end: 5,
                time: 0.2
            })
        }
        // var aniseq = function(start,end,time,frame){
        //     return createAnimation({
        //         frame: frame,
        //         start: start,
        //         end: end,
        //         time: time
        //     })
        // }

        var ani = function(start,end,time,frame,item) {
            return cc.sequence(createAnimation({
                frame: frame,
                start:start,
                end: end,
                time: time
            }), cc.callFunc(function() {
                if(end == 11){
                    item.setPositionY(item.y-30)
                    self.scheduleOnce(function () {
                        item.removeFromParent(true)
                        paper.setSpriteFrame("jbz02.png")
                    },0.1)
                    self.nodebs.say({key:"do1_tip2",force:true})
                    curDialog = 1
                }else if(end == 21){
                    item.stopAllActions()
                    item.runAction(cc.sequence(
                        cc.moveTo(0.5,cc.p(item.x+100,item.y+200)),
                        cc.callFunc(function(){
                            item.removeFromParent(true)
                            self.nodebs.say({key:"do1_tip3",force:true})
                            curDialog = 2
                        })
                    ))
                }else if(end == 19){
                    item.removeAllChildren()
                }else if(end == 12){
                    toolbtn.getindex(3).removeFromParent(true)
                }

            }))
        }


        var anirepeat = function(){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:"jb%02d.png",
                start: 1,
                end: 8,
                time: 0.06
            })))
        }
    },

    createDialog : function(img){
        AddDialog("Tips", {
            res: img,
            face: 2,
            confirmBtn:true,
        })
    },

    initPeople : function(){
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
            {key:"do1_tip5",img:res.do1_tip5,sound:res.do1_sound5},
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
            key: "do1_faxian",
            img: res.do1_faxian,
            sound: res.do1_faxian_sound,
            id: "result",
        })
    },
})