//@author mu @16/4/27
var seeExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp3", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("sydcs_pm")
        loadPlist("boy_cq")
    },
    myExit: function() { //退出时调用
        this._super()
        stopEffect()
    },
    myDelete: function() { //删除时调用
        this._super()
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: "Show"
                })
            })
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
        var btn = new ccui.Button(res.btn_jielun_normal, res.btn_jielun_select)
        btn.setPosition(getMiddle(510, 160))
        btn.addClickEventListener(function() {
            if (self.nodebs) {
                self.nodebs.say({
                    key: "see_result",
                })
            }
        })
        safeAdd(self, btn)
        return true
    },
    initScene: function() {
        var self = this
        var see = loadSee({
            key: "see3",
        })
        safeAdd(self, see)
        var uilist = [
            "item_bottle",
            "item_pm",
            "boy",
            "judge",
            "action"
        ]
        loadList(see, uilist)
        see.boy.setVisible(false)
        var pm = see.item_pm
        pm.rootPos = pm.getPosition()
        var bottle = see.item_bottle
        var judge = see.judge
        var boy = see.boy
        var action = see.action
            //judge.setLocalZOrder(-1)
            //reAdd(judge)
        bottle.drop = function() {
            var bottle = this
            if (!bottle.ifDrop) {
                bottle.ifDrop = true
                var item = new cc.Sprite("#pm_drop_01.png")
                var size = judge.getContentSize()
                item.setPosition(size.width / 2, size.height / 2 + 100)
                safeAdd(judge, item)
                addShowType({
                    item: item,
                    show: "moveBy",
                    buf: cc.p(0, -165),
                    time: 0.2,
                    fun: function(item) {
                        item.runAction(createAnimation({
                            frame: "pm_drop_%02d.png",
                            end: 6,
                            time: 0.02,
                            fun: function() {
                                boy.setVisible(true)
                            }
                        }))
                    }
                })
                bottle.pm = item
            }
        }
        createTouchEvent({
            item: boy,
            begin: function(data) {
                var item = data.item
                item.playCq()
            }
        })
        boy.setPosition(599, 436)
        boy.playCq = function() {
            var boy = this
            if (!self.cqing) {
                self.cqing = true
                boy.setSpriteFrame("sydcs_see_09.png")
                var times = 4
                if (!action.sp) {
                    var sp = new cc.Sprite()
                    action.setLocalZOrder(-1)
                    reAdd(action)
                    sp.setPosition(158, 40)
                    safeAdd(action, sp)
                    action.sp = sp
                    sp.setAnchorPoint(1, 1)
                }
                action.sp.setVisible(true)
                action.sp.runAction(
                    cc.sequence(cc.repeat(
                            createAnimation({
                                frame: "boy_cq_%02d.png",
                                end: 18,
                                time: 1 / 24,
                            }), 4),
                        cc.callFunc(function() {
                            self.cqing = false
                            action.sp.setVisible(false)
                            boy.setSpriteFrame("sydcs_see_01.png")
                        }))
                )
                if (bottle.pm) {
                    bottle.pm.setPosition(46.5, -178)
                    bottle.pm.runAction(cc.repeat(
                        cc.sequence(
                            cc.callFunc(function() {
                                playEffect(res.sound_see3_item)
                            }),
                            createAnimation({
                                frame: "pm_jump_%02d.png",
                                end: 12,
                                time: 1 / 24,
                            }),
                            cc.delayTime(1 / 24 * (18 - 12))
                        ), 4))
                }

            }
        }
        createTouchEvent({
            item: pm,
            move: function(data) {
                var item = data.item
                var delta = data.delta
                if (judgeItemCrash({
                        item1: item,
                        item2: see.judge,
                    })) {
                    item.judge = true
                    item.setVisible(false)
                    bottle.drop()
                } else {
                    item.x += delta.x
                    item.y += delta.y
                }
            },
            end: function(data) {
                var item = data.item
                if (!item.judge) {
                    item.setPosition(item.rootPos)
                }
            }
        })

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
            key: "Show", //对话标签 之后让人物说话需要用到的参数
            img: res.see_content3, //图片和声音文件
            sound: res.sound_see3
        })
        addContent({
            people: this.nodebs,
            key: "see_result", //对话标签 之后让人物说话需要用到的参数
            img: res.see_content4, //图片和声音文件
            sound: res.sound_see4,
            id:"result",
        })
    }
})