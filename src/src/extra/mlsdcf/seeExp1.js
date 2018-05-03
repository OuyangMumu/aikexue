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
        return true
    },
    initScene: function() {
        var self = this
        var uiList = [
            "walk",
            "act",
            "item",
            "font1",
            "font2",
            "font3",
            "font4",
        ]
        var bg = loadNode(res.see_json, uiList, "bg")
        bg.setPosition(getMiddle())

        var walk = bg.walk
        var act = bg.act
        var item = bg.item
        walk.rootPos = walk.getPosition()

        bg.showFont = function(index) {
            for (var i = 1; i <= 4; i++) {
                var font = bg[sprintf("font%d", i)]
                font.setVisible(i == index)
            }
        }

        var back = function() {
            stopMusic()
            walk.stopAllActions()
            walk.setSpriteFrame("walk_01.png")
            walk.setPosition(walk.rootPos)
            walk.setVisible(true)
            act.setVisible(false)
            act.stopAllActions()
            act.setTexture(res.act_01)
            item.setVisible(true)
            bg.showFont()
        }

        var btns = createPlayBtns({
            type: "S",
            pos: cc.p(40, 90),
            startFun: function() {
                back()
                var walkTime = 2
                bg.showFont(1)
                playMusic(res.sound_act1)
                walk.runAction(cc.repeatForever(createAnimation({
                    frame: "walk_%02d.png",
                    end: 21,
                    time: 1 / 24,
                })))
                addShowType({
                    item: walk,
                    show: "moveTo",
                    buf: cc.p(545, walk.rootPos.y),
                    time: walkTime,
                    fun: function() {
                        item.setVisible(false)
                        act.setVisible(true)
                        walk.setVisible(false)
                        walk.stopAllActions()
                        act.runAction(createAnimation({
                            frame: "act_%02d",
                            ifFile: true,
                            time: 5 / 24,
                            callList: [{
                                start: 1,
                                end: 1,
                                fun: function() {
                                    bg.showFont(2)
                                    playMusic(res.sound_act2)
                                }
                            }, {
                                start: 2,
                                end: 18,
                                fun: function() {
                                    bg.showFont(3)
                                    playMusic(res.sound_act3)
                                }
                            }, {
                                start: 19,
                                end: 53,
                                fun: function() {
                                    bg.showFont(4)
                                    playMusic(res.sound_act4)
                                }
                            }, {
                                start: 54,
                                end: 65,
                                fun: function() {
                                    self.btns.end()
                                }
                            }, ]
                        }))
                    }
                })
            },
            pauseFun: function() {
                pauseMusic()
                walk.pause()
                act.pause()
            },
            resumeFun: function() {
                walk.resume()
                act.resume()
                resumeMusic()
            },
            stopFun: function() {
                back()
            }
        })
        self.btns = btns
        safeAdd(self.inside_node, bg)
        safeAdd(self.inside_node, btns)
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
    }
})