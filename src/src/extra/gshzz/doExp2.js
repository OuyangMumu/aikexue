var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor()
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
        loadPlist("yumiq_plist")
        loadPlist("yumils_plist")
        self.nodebs.show(function(){
            self.nodebs.say({key:"do2_tip1"})
        })
        var btn_phe = new ccui.Button("res/btn/btn_result_normal.png","res/btn/btn_result_select.png")
        btn_phe.setPosition(1020,480)
        self.addChild(btn_phe)
        btn_phe.setVisible(false)
        btn_phe.addClickEventListener(function(){
            if(btn_phe.isVisible()){
                self.nodebs.say({key:"do2_phe"})
            }
        })
        var yumi = new cc.Sprite(res.yumi)
        yumi.setPosition(100,-100)
        self.addChild(yumi,3)
        yumi.qie = true  //判断是否已经切开玉米
        yumi.noMove = false  //玉米能否移动
        yumi.isOver = false  //判断是否全部操作完成
        yumi.fristTip = true //判断只提示一次提示框
        var curLocal = 10
        createTouchEvent({
            item:yumi,
            begin:function(data){
                var item = data.item
                if(item.noMove){
                    createDialog()
                    return false
                }
                item.setLocalZOrder(curLocal++)
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(!item.noMove){ 
                    item.x += delta.x
                    item.y += delta.y
                }
                
            }
        })
        var toolbtn = createTool({
            pos: cc.p(300, 510),
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
            files: [res.do2_tools1, res.do2_tools2, res.do2_tools3],
            gets: [res.do2_item2,res.dao,null],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                if(index == 1){
                    item.setRotation(-35)
                    item.setLocalZOrder(yumi.getLocalZOrder()+1)
                }
                if(index == 2){
                    item = self.createDiWater({
                       //rect:cc.rect(yumi.x-yumi.width/2,yumi.y-yumi.height/2,yumi.width,yumi.height),
                       sp:yumi,
                       father:self,
                       offsetX:90,
                       offsetY:155,
                       pullMidFun:function(node){
                            if(!yumi.isOver && !yumi.qie){  //判断玉米已经操作完成了
                                yumi.isOver = true
                                yumi.noMove = true
                                yumi.runAction(cc.sequence(
                                    aniyumi("yumils%02d.png", 13, 0.2),
                                    cc.delayTime(0.3),
                                    cc.scaleTo(0.7,1),
                                    cc.callFunc(function(){
                                        yumi.noMove = false
                                        var jieshao = new cc.Sprite(res.jieshao)
                                        jieshao.setPosition(230,236)
                                        yumi.addChild(jieshao)
                                        btn_phe.setVisible(true)
                                    })
                                ))
                            }
                       }
                   })
                }
                return item
            },
            clickfun : function(data){
                var index = data.index
                var item = data.sp
                var pos = data.pos
                if(index != 0)
                    item.setLocalZOrder(curLocal++)
                if(item.noMove)
                    return false
                return true
            },
            movefun:function(data){
                var item = data.sp
                var index = data.index
                var delta = data.delta

                if(index == 1)
                    if(yumi.qie && checkDistance(item,yumi)){
                        yumi.qie = false
                        yumi.noMove = true
                        item.setPositionY(-200)
                        yumi.setScale(0.8)
                        yumi.setPosition(yumi.x+80,yumi.y-120)
                        yumi.runAction(cc.sequence(
                            aniyumi("yumiq%02d.png",25,0.15),
                            cc.callFunc(function(){
                                yumi.setPosition(yumi.x-66,yumi.y+118)
                                yumi.setSpriteFrame("yumils01.png")
                                yumi.setScale(0.22)
                                yumi.noMove = false
                                item.forceBack()
                                if(yumi.fristTip){
                                    yumi.fristTip = false
                                    self.nodebs.say({key:"do2_tip2",force:true})
                                }
                            })
                        ))
                    }

                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                 }
            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
                if(index == 0){
                    item.disMove(true)
                    item.setPosition(200,100)
                    createTouchEvent({
                        item:item,
                        begin:function(data){
                            var pos = data.pos
                            if(yumi.noMove){
                                createDialog()
                                return false
                            }
                            yumiRegain()
                            yumi.setPosition(pos)
                            return true
                        },
                        move:function(data){
                            var delta = data.delta
                            yumi.x += delta.x
                            yumi.y += delta.y
                        }
                    })
                }
                else if(index == 2)
                    item.setPosition(900,100)
            }
        });
        this.addChild(toolbtn)
        toolbtn.show()
        self.toolbtn = toolbtn
        //恢复玉米为最先开始的属性
        var yumiRegain = function(){
            yumi.stopAllActions()
            yumi.setTexture(res.yumi)
            yumi.setScale(1)
            yumi.qie  = true
            yumi.isOver = false
            if(yumi.getChildrenCount() > 0)
                yumi.removeAllChildren(true)
        }
        //创建提示框
        var createDialog = function(){
            AddDialog("Tips", {
                res: res.do2_dialog,
                face: 2,
                confirmBtn:true,
            })
        }

        var aniyumi = function(frame,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                end: end,
                time: time
            }))
        }

        var checkDistance = function(ra,rb){
            var dx = (ra.x-ra.height/2+50) - rb.x
            var dy = (ra.y+ra.height/2-30) - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < 50){
                return true
            }else{
                return false
            }
        }
    },

    createDiWater:function (data) {
        var self = this
        var data = data || {}
        var pos = data.pos || cc.p(220, 150)
        var father = data.father
        var rect = data.rect || cc.rect(0,0,50,50)
        var sp = data.sp
        var offsetY = data.offsetY  || 0
        var offsetX = data.offsetX || 0
        var pullback = data.pullback
        var pullMidFun = data.pullMidFun
        cc.assert(res.diwater, "please copy plist and png from zdgc to your exp")
        loadPlist("diwater")
        loadPlist("pull")

        var node = new cc.Node()
        node.setPosition(pos)
        if (father)
            father.addChild(node)

        var di = new cc.Sprite("#di.png")
        di.y = 50
        di.initpos = di.getPosition()
        node.addChild(di, 1)
        node.di = di
        node.gaiClick = true
        var dimao = new cc.Sprite("#gaizi.png")
        dimao.y = 105
        dimao.initpos = dimao.getPosition()
        dimao.setOpacity(0)
        node.addChild(dimao, 2)
        node.dimao = dimao
        dimao.initpos = dimao.getPosition()
        var bei = new cc.Sprite("#cup.png")
        node.addChild(bei, 3)
        dimao.state = "in"

        dimao.inrect = cc.rect(-4, 300, 8, 50)

        var dimaotouch = new cc.Sprite("#gaizi.png")//gaizi
        dimaotouch.setPosition(83, 53)
        dimaotouch.setScale(9, 2.4)
        dimaotouch.setOpacity(0)
        dimao.addChild(dimaotouch)
        node.flag = true

        node.setAllnosee = function() {
            di.setVisible(false)
            dimao.setVisible(false)
            di.setPosition(0, -1000)
            dimao.setPosition(0, -1000)
        }
        node.init = function() {
            di.setVisible(true)
            dimao.setVisible(true)
            di.setPosition(di.initpos)
            dimao.setPosition(dimao.initpos)
            if (dimao.water)
                dimao.water.removeFromParent()
            dimao.disListen(false)
            dimaotouch.disListen(true)
            dimao.state = "in"
        }
        node.setGaiClick = function(jude, fun) {
            node.gaiClick = jude
            node.warnfun = fun
        }

        node.pullWater = function() {
            var pullwater = new cc.Sprite()
            pullwater.runAction(
                cc.sequence(createAnimation({
                        start: 1,
                        frame: "pull%02d.png",
                        end: 17,
                        time: 0.12,
                    }),
                    cc.callFunc(function() {

                        node.init()
                        pullwater.removeFromParent()
                        if (pullback)
                            pullback()
                    })
                ))
            pullwater.setScale(1.4)
            pullwater.setPosition(sp.x + offsetX, sp.y + offsetY)
            father.addChild(pullwater,20)
        }

        dimao.pushWater = function() {
            var water = new cc.Sprite()
            water.runAction(
                createAnimation({
                    frame: "push%02d.png",
                    end: 6,
                    time: 0.05
                })
            )
            //water.setScale(0.87)
            water.setPosition(70, -14)
            this.water = water
            this.addChild(water)
        }

        createTouchEvent({
            item: dimaotouch,
            swallow: false,
            begin: function(data) {
                return true
            },
            move: function(data) {
                var item = data.item
                var delta = data.delta
                var father = item.getParent()
                var tempx = father.x + delta.x
                var tempy = father.y + delta.y
                if (father.state == "in" && father.y <= 180) {
                    tempx = 0
                    if (father.y <= 104){
                        father = father.y + 1
                        return
                    }
                }
                if (father.y > 180) {
                    father.state = "out"
                }

                if (father.y >= 170 && father.y <= 190 && father.x >= -4 && father.x <= 4) {
                    father.state = "in"
                    father.setLocalZOrder(1)
                }

                father.x = tempx
                father.y = tempy
       
                var worldpos = node.convertToWorldSpace(dimao.getPosition())
                if (checkDistance(worldpos,sp)) {
                    if(!sp.isOver  && !sp.qie){
                        node.setAllnosee()
                        node.pullWater()
                    }
                    if (pullMidFun)
                        pullMidFun()
                        
                }
            },
            end: function(data) {
                var item = data.item
                var father = item.getParent()
                if (father.state == "in") {
                    node.init()
                }
            }
        })
        dimaotouch.disListen(true)

        createTouchEvent({
            item:bei,
            begin:function(){
                return true
            },
            move:function(data){
                var item = data.sp
                var delta = data.delta
                node.x += delta.x
                node.y += delta.y  
            },
            end:function(data){
                var item = data.sp
                node.setPosition(900,100)
                if(self.toolbtn){
                    self.toolbtn.judgeAct({
                        act:"end",
                        pos:data.pos,
                        item:node,
                    })
                }
            }
        })

        createTouchEvent({
            item: dimao,
            begin: function(data) {
                if (!node.gaiClick) {
                    if (node.warnfun)
                        node.warnfun()
                    return false
                }
                var item = data.item
                node.di.setVisible(false)
                item.pushWater()
                return true
            },
            move: function(data) {
                var item = data.item
                var delta = data.delta
                var tempx = item.x + delta.x
                var tempy = item.y + delta.y
                
                if (item.state == "in" && item.y <= 180) {
                    tempx = 0
                    //item.setLocalZOrder(10)
                    if (item.y <= 104){
                        tempy = item.y + 1
                        return
                    }
                }
                if (item.y > 180) {
                    item.state = "out"
                    node.setLocalZOrder(20)
                    //item.setLocalZOrder(100)
                }

                if (item.y >= 170 && item.y <= 190 && item.x >= -4 && item.x <= 4) {
                    item.state = "in"
                    item.setLocalZOrder(1)
                }
                item.x = tempx
                item.y = tempy

                var worldpos = item.getParent().convertToWorldSpace(item.getPosition())
                if (checkDistance(worldpos,sp)) {
                    if(!sp.isOver && !sp.qie){
                        node.pullWater()
                        node.setAllnosee()
                    }
                    if (pullMidFun)
                        pullMidFun()
                        
                }
            },
            end: function(data) {
                var item = data.item
                if (item.state == "in") {
                    node.di.setVisible(true)
                    if (item.water) {
                        item.water.removeFromParent()
                        item.water = null
                    }

                    item.setPosition(item.initpos)
                }
                if (item.state == "out") {
                    item.disListen(true)
                    dimaotouch.disListen(false)
                }
            }
        })

        var checkDistance = function(ra,rb){
            var dx = ra.x - rb.x
            var dy = ra.y-150 - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < 30){
                return true
            }else{
                return false
            }
        }

        return node
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1030, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do2_tip1",img:res.do2_tip1,sound:res.do2_sound1},
            {key:"do2_tip2",img:res.do2_tip2,sound:res.do2_sound2},
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
        addContent({
            people: this.nodebs,
            key: "do2_phe",
            img: res.do2_phe,
            sound: res.do2_phe_sound,
            id:"result"
        })
    },

})