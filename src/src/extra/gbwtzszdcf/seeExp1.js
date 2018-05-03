//@author mu @16/4/27

var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
    load: function() {},
    myExit: function() { //退出时调用
        this._super()
    },
    myDelete: function() { //删除时调用
        this._super()
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        var self = this
        if (this.nodebs) {
            this.nodebs.show()
        }
        if (self.toolbtn) {
            self.toolbtn.show()
        }
    },
    dataControl: {},
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
        this.expCtor() //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        self.initScene()
        var btnFind = new ccui.Button(res.btn_get_normal, res.btn_get_select)
        btnFind.setPosition(1070, 480)
        btnFind.setVisible(false)
        safeAdd(self.inside_node, btnFind)
        btnFind.addClickEventListener(function() {
            self.nodebs.say({
                key: "find",
                force: true,
            })
        })
        self.btnFind = btnFind
        return true
    },
    say: function(index, fun) {
        var info = [{
            pos: cc.p(842, 434),
            sound: 1,
            key: 1,
            offset: cc.p(10, 0),
        }, {
            pos: cc.p(540, 435),
            sound: 2,
            key: 2,
            offset: cc.p(10, 0),
            scale: 0.8,
        }, {
            pos: cc.p(140, 462),
            sound: 3,
            key: 3,
            offset: cc.p(10, 0),
            scale: 0.8,
        }, {
            pos: cc.p(737, 505),
            sound: 4,
            key: 4,
            offset: cc.p(10, 0),
            scale: 0.7,
        }, {
            pos: cc.p(770, 527),
            sound: 5,
            key: 5,
            offset: cc.p(10, 0),
            scale: 0.7,
        }, {
            pos: cc.p(770, 527),
            sound: 6,
            key: 6,
            offset: cc.p(10, 0),
            scale: 0.8,
        }, ]
        var self = this
        if (!self.font_bg) {
            self.font_bg = new cc.Sprite("#dialog.png")
            safeAdd(self, self.font_bg)
            self.font_bg.addIndex = function(key, offset, scale) {
                var bg = this
                if (bg.img) {
                    bg.img.removeFromParent(true)
                }
                offset = offset || cc.p(0, 0)
                scale = scale || 1
                var img = new cc.Sprite(sprintf("#font%d.png", key))
                var size = bg.getContentSize()
                img.setPosition(size.width / 2 + offset.x, size.height / 2 + offset.y)
                img.setScale(scale)
                safeAdd(bg, img)
                bg.img = img
            }
        }
        var bg = self.font_bg
        var tempInfo = info[index]
        bg.addIndex(tempInfo.key, tempInfo.offset, tempInfo.scale)
        bg.setPosition(tempInfo.pos)
        bg.setVisible(true)
        playMusicLoopCall({
            music: res[sprintf("sound_act%d", tempInfo.sound)],
            fun: function() {
                bg.setVisible(false)
                if (fun) {
                    fun()
                }
            }
        })
    },
    initScene: function() {
        var self = this
        var uilist = [
            "back",
            "girl2",
            "girl",
            "boy2",
            "boy",
            "boy_final",
            "boy_mouse",
            "girl_final",
            "girl_mouse",
            "front",
            "item_fb",
            "back2",
            "item_chen",
            "water",
            "item_fu",
            "girl_hand",
            "sand",
            "boy_hand",
        ]
        var node = loadNode(res.see_json, uilist)
        var boy = node.boy
        var girl = node.girl
        var boy_final = node.boy_final
        var girl_final = node.girl_final
        var back2 = node.back2
        var boy2 = node.boy2
        var girl2 = node.girl2
        var boy_hand = node.boy_hand
        var sand = node.sand
        var fb = node.item_fb
        var boy_mouse = node.boy_mouse
        var girl_mouse = node.girl_mouse
        var girl_hand = node.girl_hand
        var item_chen = node.item_chen

        for (var i = 0; i < uilist.length; i++) {
            node[uilist[i]].setLocalZOrder(i)
        }

        var itemList = [
            boy,
            girl,
            boy_final,
            girl_final,
            boy2,
            girl2,
            boy_mouse,
            girl_mouse,
            girl_hand,
            item_chen,
            sand,
        ]

        for (var i = 0; i < itemList.length; i++) {
            var item = itemList[i]
            item.rootPos = item.getPosition()
            item.rootPar = item.getParent()
            item.rootOrder = item.getLocalZOrder()
        }

        boy.rootPos = boy.getPosition()
        girl.rootPos = girl.getPosition()
        node.setPosition(getMiddle())

        node.showBack2 = function(fun) {
            back2.setVisible(true)
            self.say(2)
            var hand = node.girl_hand
            var moveTime = 2
            hand.rootPos = hand.getPosition()
            addShowType({
                item: hand,
                show: "moveTo",
                buf: cc.p(219, 650),
                time: moveTime,
                fun: function(hand) {
                    var chen = node.item_chen
                    chen.setLocalZOrder(-1)
                    changeFather({
                        item: chen,
                        father: hand,
                    })
                    addShowType({
                        item: hand,
                        show: "moveTo",
                        time: moveTime,
                        buf: hand.rootPos,
                        fun: function() {
                            back2.setVisible(false)
                            if (fun) {
                                fun()
                            }
                        }
                    })
                }
            })
        }
        node.showBoy2 = function(fun) {
            //486 520
            node.setScale(1.8)
            node.setPosition(486, 520)
            girl2.setVisible(false)
            boy2.setVisible(true)
            self.say(4)
            boy2.runAction(createAnimation({
                ifFile: true,
                frame: "boy_final_%02d",
                time: 3 / 24,
                callList: [{
                    start: 1,
                    end: 12,
                    fun: function() {
                        boy_hand.setVisible(true)
                    },
                }, {
                    start: 13,
                    end: 21,
                    fun: function() {
                        boy_hand.setVisible(false)
                        fb.setVisible(false)
                    }
                }, {
                    start: 22,
                    end: 33,
                    fun: function() {
                        self.say(5)
                    }
                }, {
                    start: 34,
                    end: 63,
                    fun: function() {
                        if (fun) {
                            fun()
                        }
                        self.btnFind.setVisible(true)
                        self.btns.end()
                    }
                }, ]
            }))
        }
        node.showGirl2 = function(fun) {
            //820 520
            node.setScale(1.8)
            node.setPosition(820, 520)
            girl_final.setVisible(false)
            boy_final.setVisible(false)
            girl2.setVisible(true)
            girl2.runAction(createAnimation({
                ifFile: true,
                frame: "girl_final_%02d",
                time: 3 / 24,
                callList: [{
                    start: 1,
                    end: 1,
                    fun: function() {
                        sand.setVisible(true)
                        sand.runAction(createAnimation({
                            frame: "sand_%02d.png",
                            end: 13,
                            time: 1 / 24,
                        }))
                        self.say(3)
                    },
                }, {
                    start: 2,
                    end: 35,
                    fun: function() {
                        if (fun) {
                            fun()
                        }
                    }
                }]
            }))
        }
        node.init = function() {
            var node = this
            var moveTime = 2.0
            boy.runAction(cc.repeatForever(createAnimation({
                frame: "boy_act_%02d.png",
                end: 14,
                time: 1 / 24,
            })))
            girl.runAction(cc.repeatForever(createAnimation({
                frame: "girl_act_%02d.png",
                end: 15,
                time: 1 / 24,
            })))
            boysay = function(judge) {
                if (judge) {
                    boy_mouse.runAction(cc.repeatForever(createAnimation({
                        frame: "boy_mouse_%02d.png",
                        end: 7,
                        time: 1 / 24,
                    })))
                } else {
                    boy_mouse.stopAllActions()
                    boy_mouse.setSpriteFrame("boy_mouse_05.png")
                }
            }
            girlsay = function(judge) {
                if (judge) {
                    girl_mouse.runAction(cc.repeatForever(createAnimation({
                        frame: "girl_mouse_%02d.png",
                        end: 9,
                        time: 1 / 24,
                    })))
                } else {
                    girl_mouse.stopAllActions()
                    girl_mouse.setSpriteFrame("girl_mouse_06.png")
                }
            }
            addShowType({
                item: boy,
                show: "moveTo",
                buf: boy_final.getPosition(),
                time: moveTime,
                fun: function(item) {
                    item.stopAllActions()
                    item.setVisible(false)
                    boy_final.setVisible(true)
                    boysay(true)
                    self.say(0, function() {
                        boysay(false)
                        addTimer({
                            fun: function(key) {
                                removeTimer(key)
                                girlsay(true)
                                self.say(1, function() {
                                    girlsay(false)
                                    node.showBack2(function() {
                                        node.showGirl2(function() {
                                            node.showBoy2()
                                        })
                                    })
                                })
                            },
                            time: 0.5,
                        })
                    })
                }
            })
            addShowType({
                item: girl,
                show: "moveTo",
                buf: cc.p(girl_final.getPositionX(), girl.getPositionY()),
                time: moveTime + 1.5,
                fun: function(item) {
                    item.stopAllActions()
                    item.setVisible(false)
                    girl_final.setVisible(true)
                    girlsay(false)
                }
            })
        }
        node.reInit = function() {
            node.setPosition(getMiddle())
            node.setScale(1.0)
            boy2.setVisible(false)
            girl2.setVisible(false)
            boy_hand.setVisible(false)
            sand.setVisible(false)
            back2.setVisible(false)
            boy_final.setVisible(false)
            girl_final.setVisible(false)
            boy.setVisible(true)
            girl.setVisible(true)
            fb.setVisible(true)
            stopMusic()
            if (self.font_bg) {
                self.font_bg.setVisible(false)
            }
            for (var i = 0; i < itemList.length; i++) {
                var item = itemList[i]
                item.setPosition(item.rootPos)
                item.setLocalZOrder(item.rootOrder)
                safeAdd(item.rootPar, item)
                item.stopAllActions()
            }
        }
        node.allPause = function() {
            for (var i = 0; i < itemList.length; i++) {
                itemList[i].pause()
            }
            pauseMusic()
        }
        node.allResume = function() {
            for (var i = 0; i < itemList.length; i++) {
                itemList[i].resume()
            }
            resumeMusic()
        }
        safeAdd(self.inside_node, node)

        var btns = createPlayBtns({
            type: "H",
            pos: cc.p(40, 30),
            startFun: function() {
                node.reInit()
                node.init()
            },
            pauseFun: function() {
                node.allPause()
            },
            resumeFun: function() {
                node.allResume()
            },
            stopFun: function() {
                node.reInit()
            }
        })
        self.btns = btns
        safeAdd(self, btns)
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        addContent({
            people: this.nodebs,
            key: "find", //对话标签 之后让人物说话需要用到的参数
            img: res.see_final, //图片和声音文件
            sound: res.see_result,
            id: "result",
            btnModify: cc.p(10, 10),
            btnScale: 0.8,
        })
    }
})