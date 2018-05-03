//@author mu @14/4/18

var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp1",
    preLayer: "seeLayer",
    myExit: function() { //退出执行的操作 自动
        this.nodebs.stopSay()
    },
    myDelete: function() {
        removeTimer("judgeEnd")
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
    ctor: function() {
        this._super();
        this.dataControl = {}
        var self = this
        self.expCtor({
            vis:true
        })
        addTimer({
            fun: function() {
                if (judgeAniDone()) {
                    removeTimer("judgeAniDone")
                    self.btn_result.setVisible(true)
                    self.nodebs.finish()
                        /*self.nodebs.say({
                            key:"Result"
                        })*/
                }
            },
            repeat: cc.REPEAT_FOREVER,
            time: 1.0,
            key: "judgeAniDone"
        })
        this.btn_result.addClickEventListener(function() {
            self.nodebs.say({
                key: "Result",
            })
        })

        loadPlist("lsjb")
        loadPlist("rsjb")
        loadPlist("msxq")
        loadPlist("msdx")

        var dataControl = {

        }
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.loadUI.addChild(this.nodebs)
        addContent({
            people: this.nodebs,
            key: "Show",
            img: res.see1_content_1,
            sound: res.see1_content_1_sound
        })
        addContent({
            people: this.nodebs,
            key: "Result",
            img: res.see1_content_2,
            sound: res.see1_content_2_sound,
            id: "result",
        })
        this.nodebs.setLocalZOrder(999)
        var nodels = new cc.Sprite("#ls0001.png")
        var noders = new cc.Sprite("#rs0001.png")
        var nodemsxq = new cc.Sprite("#msxq01.png")

        var anils = function() {
            return cc.sequence(createAnimation({
                frame: "ls%04d.png",
                end: 40,
                time: 0.2,
            }), cc.callFunc(function() {
                dataControl.anilsEnd = true
            }))
        }
        var anirs = function() {
            return cc.sequence(createAnimation({
                frame: "rs%04d.png",
                end: 11,
                time:0.15,
            }), cc.callFunc(function() {
                dataControl.anirsEnd = true
            }))
        }
        var animsdx = function() {
            return cc.sequence(createAnimation({
                frame: "msdx%02d.png",
                end: 17
            }), cc.callFunc(function() {
                switch (dataControl.targetWater) {
                    case "LS":
                        msReturn()
                        nodels.runAction(anils())
                        break
                    case "RS":
                        msReturn()
                        noders.runAction(anirs())
                        break
                }
            }))
        }

        var animsxq = function() {
            return cc.sequence(createAnimation({
                frame: "msxq%02d.png",
                end: 14,
                time: 0.05
            }), cc.callFunc(function() {
                dataControl.done = true
                if (dataControl.finalPos) {
                    nodemsxq.setPosition(dataControl.finalPos)
                }
                if (dataControl.finalPos) {
                    allJudge(dataControl.finalPos)
                }
            }))
        }

        var nodems = new cc.Sprite(res.img_ms)
        var rootpos = cc.p(205, 305)
        var rootfinal = cc.p(192, 215)
        nodems.setPosition(200, 120)
        nodemsxq.setPosition(rootpos)
        nodemsxq.setAnchorPoint(cc.p(0.9, 0.75))
        nodemsxq.finalPos = cc.p(207, 230)
        nodels.setPosition(430, 200)
        noders.setPosition(750, 200)


        var zq = getZq({
            pos: cc.p(150, 250),
            father: noders,
            devide: 20,
            scale: 1.5,
        })

        this.loadUI.addChild(nodemsxq)
        this.loadUI.addChild(nodems)
        this.loadUI.addChild(nodels)
        this.loadUI.addChild(noders)

        var touchNode = createTouchRect({
            size: cc.size(40, 55),
            pos: cc.p(rootfinal.x - 10, rootfinal.y - 10),
            //op:50,
        })

        var judgeNode1 = createTouchRect({
            size: cc.size(160, 200),
            pos: cc.p(375, 320),
            //op:50,
        })

        var judgeNode2 = createTouchRect({
            size: cc.size(160, 200),
            pos: cc.p(695, 320),
            //op:50,
        })

        var judgeFun = function(item, location, fun) {
            var locationInNode = item.convertToNodeSpace(location)
            var s = item.getContentSize()
            var rect = cc.rect(0, 0, s.width, s.height)
            if (cc.rectContainsPoint(rect, locationInNode)) {
                if (fun) {
                    fun()
                }
            }
        }

        var allJudge = function(location) {
            var askMs = function(judgeNode, key) {
                if (!dataControl.msdx_done) {
                    nodemsxq.runAction(animsdx())
                    dataControl.msdx_done = true
                    dataControl.done = false
                    dataControl.targetWater = key
                    nodemsxq.setPosition(cc.p(judgeNode.getPositionX() + 80, judgeNode.getPositionY() + 75))
                }
            }
            judgeFun(judgeNode1, location, function() {
                if (!dataControl.lsDone) {
                    dataControl.lsDone = true
                    askMs(judgeNode1, "LS")
                }
            })
            judgeFun(judgeNode2, location, function() {
                if (!dataControl.rsDone) {
                    dataControl.rsDone = true
                    askMs(judgeNode2, "RS")
                }
            })
        }
        this.loadUI.addChild(judgeNode1)
        this.loadUI.addChild(judgeNode2)

        var judgeEnd = function() {
            return (dataControl.lsDone && dataControl.rsDone)
        }

        var judgeAniDone = function() {
            return (dataControl.anirsEnd && dataControl.anilsEnd)
        }

        var msReturn = function() {
            dataControl.done = false
            nodemsxq.setPosition(rootpos)
            nodemsxq.stopAllActions()
            nodemsxq.setSpriteFrame("msxq01.png")
            dataControl.finalPos = rootfinal
            dataControl.msdx_done = false
        }

        var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                if (!dataControl.msdx_done && !judgeEnd()) {
                    var target = event.getCurrentTarget()
                    var locationInNode = target.convertToNodeSpace(touch.getLocation())
                    var s = target.getContentSize()
                    var rect = cc.rect(0, 0, s.width, s.height)
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        nodemsxq.runAction(animsxq())
                        return true;
                    }
                }
                return false;
            },
            onTouchMoved: function(touch, event) {
                if (dataControl.done) {
                    var target = event.getCurrentTarget()
                    var delta = touch.getDelta()
                    nodemsxq.x += delta.x
                    nodemsxq.y += delta.y
                    allJudge(touch.getLocation())
                } else {
                    dataControl.finalPos = touch.getLocation()
                }
            },
            onTouchEnded: function(touch, event) {
                if (!dataControl.msdx_done) {
                    msReturn()
                }
            }
        })
        cc.eventManager.addListener(listener1, touchNode);
        this.loadUI.addChild(touchNode)
        return true
    }
})