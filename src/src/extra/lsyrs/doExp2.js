//@author mu @14/4/27

var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    load: function() {
        loadPlist("sgpz")
    },
    myExit: function() {
        this.nodebs.stopSay()
    },
    myDelete: function() {
        removeTimer("ANISGPZ")
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({
                    key: "Show",
                    force: true,
                })
            })
        }
    },
    dataControl: {},
    ctor: function() {
        this._super();
        this.load()
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.expCtor({
            vis:true,
        })
        var node = loadNode(res.lsyrs_do2)
        this.loadUI.addChild(node)
            //this.btn_result.setVisible(false)
        this.btn_result.addClickEventListener(function() {
            self.nodebs.say({
                key: "Result",
            })
        })
        var item_sg = seekWidgetByName(node, "img_sg")
        item_sg.setSpriteFrame("img_sg_13.png")
        item_sg.setPosition(0, 65)
        this.initPeople()
        var item_rs = seekWidgetByName(node, "item_hotwater")

        dataControl.rootX = item_sg.getPositionX()
        dataControl.limitX = dataControl.rootX + 20
        dataControl.minY = item_sg.getPositionY()
        dataControl.canMoveY = 240

        var zq = getZq({
            pos: cc.p(100, 220),
            father: item_rs,
            devide: 20,
            scale: 1.5,
        })
        var box = this.createLimit()
        item_sg.jia = true
        item_sg.noMove = false
        var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize()
                var rect = cc.rect(0, 0, s.width, s.height)
                var item = target
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    // if(item.jia){
                    //     item.beginPos = item.getPosition()
                    //     item.jia = false
                    //     item.runAction(cc.moveTo(0.3,5,270))
                    // }
                    //target.lastpos = target.getPosition()
                    return true
                }
                return false
            },
            onTouchMoved: function(touch, event) {
                var target = event.getCurrentTarget()
                var delta = touch.getDelta()
                var item = event.getCurrentTarget()//220,320,480,600
                var posX = item.x + delta.x
                var posY = item.y + delta.y
                //cc.log("item.x:",item.x,"item.y:",item.y)
                if(posX > 0 && posX <= 5 && posY > 60 && posY <= 240){
                    move(item,delta)//在架子里面
                }else if(posX > 0 && posX < 220 && posY > 240){
                    move(item,delta)//在杯子左侧
                }else if(posX >= 220 && posX <= 320 && posY > 70){
                    move(item,delta)//在热水杯子里
                }else if(posX > 320 && posX <= 480 && posY > 240){
                    move(item,delta)//在热水和热水杯子的中间
                }else if(posX > 480 && posX < 600 && posY > 70){
                    move(item,delta)//在冷水杯子里
                }

                judge()
            },
            onTouchEnded: function(touch, event) {
                //judge()
            }
        })

        var move = function(item,delta){
            item.x += delta.x 
            item.y += delta.y
        }

        // var checkdistans = function(ra,rb,dis){
        //     var dx =  ra.x - rb.x
        //     var dy = ra.y - rb.y
        //     var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
        //     if(distance <= dis)
        //         return true
        //     else
        //         return false
        // }

        var judge = function() {
            var target = item_sg
            if (judgeTouch({
                    box: dataControl.hot,
                    item: target,
                    pos: cc.p(0, 0)
                })) {
                dataControl.ani.changeStatus("back", function() {
                    if (!dataControl.FinishHot) {
                        dataControl.FinishHot = true
                        self.nodebs.say({
                            key: "Next",
                            force: true,
                        })
                    }
                })
            } else if (judgeTouch({
                    box: dataControl.cold,
                    item: target,
                    pos: cc.p(0, 0)
                })) {
                dataControl.ani.changeStatus("forward", function() {
                    if (dataControl.FinishHot) {
                        if (!dataControl.FinishCold) {
                            dataControl.FinishCold = true
                            self.btn_result.setVisible(true)
                            self.nodebs.finish()
                                /*
                                self.nodebs.say({
                                    key:"Result"
                                })*/
                        }
                    }
                })
            } else {
                dataControl.ani.changeStatus("forward")
            }
        }
        cc.eventManager.addListener(listener1, item_sg)
        dataControl.ani = createControlAni({
            frame: "img_sg_%02d.png",
            start: 1,
            end: 24,
            time: 0.5,
            key: "ANISGPZ",
            beginIndex: 13,
            item: item_sg
        })
        return true
    },
    createLimit: function() {
        // var boxs = createBoxs({
        //     boxs: [
        //     // {
        //     //     pos: cc.p(-10, 0),
        //     //     size: cc.size(115, 640)
        //     // }, 
        //     // {
        //     //     pos: cc.p(100, 0),
        //     //     size: cc.size(1200, 120)
        //     // }, 
        //     // {
        //     //     pos: cc.p(155, 120),
        //     //     size: cc.size(160, 190)
        //     // }, 
        //     // {
        //     //     pos: cc.p(300, 120),
        //     //     size: cc.size(30, 190)
        //     // }, 
        //     // {
        //     //     pos: cc.p(470, 120),
        //     //     size: cc.size(130, 190)
        //     // }, 
        //     // {
        //     //     pos: cc.p(570, 120),
        //     //     size: cc.size(30, 190)
        //     // }, 
        //     {
        //         pos: cc.p(740, 120),
        //         size: cc.size(30, 190)
        //     }],
        //     op: 255,
        // })

        var hot = createBoxs({
            boxs: [{
                pos: cc.p(330, 120),
                size: cc.size(140, 80)
            }],
            op: 0
        })
        var cold = createBoxs({
            boxs: [{
                pos: cc.p(600, 120),
                size: cc.size(140, 80)
            }],
            op: 0
        })
        //this.dataControl.boxs = boxs
        this.dataControl.hot = hot
        this.dataControl.cold = cold
        //this.loadUI.addChild(boxs)
        this.loadUI.addChild(hot)
        this.loadUI.addChild(cold)
        //return boxs
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.loadUI.addChild(this.nodebs)
        addContent({
            people: this.nodebs,
            key: "Show",
            img: res.do2_content_1,
            sound: res.do2_content_1_sound
        })
        addContent({
            people: this.nodebs,
            key: "Next",
            img: res.do2_content_2,
            sound: res.do2_content_2_sound,
        })
        addContent({
            people: this.nodebs,
            key: "Result",
            img: res.do2_content_3,
            sound: res.do2_content_3_sound,
            id: "result",
        })
    }
})