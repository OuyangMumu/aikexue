//@author mu @16/4/27
var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp3", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("do3plist")
    },
    myExit: function() { //退出时调用
        this._super()
    },
    myDelete: function() { //删除时调用
        this._super()
        var self = this
        if (self.biaoge) {
            self.biaoge.removeFromParent(false)
        }
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        var self = this
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: "sound1"
                })
            })
        }
        if (self.toolbtn) {
            self.toolbtn.show()
        }
    },
    dataControl: {},
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
        var self = this
        this.expCtor({
                vis: false,
                settingData: {
                    pos: cc.p(1080, 580),
                    biaogeFun: function() {
                        var bg = gb_biaoge()
                        safeAdd(self, bg)
                        self.biaoge = bg
                        bg.show()
                    },
                }
            }) //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        createInPy({
            layer: self,
            //show: true,
        })
        self.initPeople() //创建人物
        self.initScene()
        self.createTool()
        return true
    },
    createTool: function() {
        var self = this
        var fileList = []
        for (var i = 0; i < 2; i++) {
            fileList[i] = sprintf("do3_tool%d.png", i + 1)
        }
        var outJudge = function(item) {
            // data.left = 403
            // data.right = 735
            // data.bottom = 107
            if (item.x > 403 && item.x < 735 && item.y > 104) {
                self.pyActItem({
                    item: item,
                    act: true,
                })
                removeMoving(item)
                item.update = function(dt) {
                    var hs = this
                    var result = (hs.y <= 280)
                    if (result) {
                        self.showNext = true
                        self.nodebs.say({
                            key: "sound2",
                            force: true,
                        })
                        hs.unscheduleUpdate()
                    }
                }
                item.scheduleUpdate()
                createTouchEvent({
                    item: item,
                    begin: function(data) {
                        var item = data.item
                        self.pyActItem({
                            item: item,
                            act: false,
                        })
                        return true
                    },
                    move: function(data) {
                        data.left = 403
                        data.right = 735
                        data.bottom = 107
                        if (!self.finish) {
                            //data.show = true
                            judgeMove(data)
                            judgeAll()
                        }
                    },
                    end: function(data) {
                        var item = data.item
                        if (!self.finish) {
                            self.pyActItem({
                                item: item,
                                act: true,
                            })
                        }
                    }
                })
            }

        }
        var judgeAll = function() {
            var mk = self.mk
            var tk = self.tk
            if (tk && mk) {
                var result = judgeItemCrash({
                    item1: mk,
                    item2: tk
                })
                if (result && !self.finish) {
                    self.finish = true
                    self.pyActItem({
                        item: mk,
                        act: false,
                    })
                    removeMoving(mk)
                    mk.setVisible(false)
                        //mk.removeFromParent(true)
                    removeMoving(tk)
                    tk.setVisible(false)
                        //tk.removeFromParent(true)

                    var info = {
                        type: "poly",
                        buf: [1, 86 - 66, 1, 86 - 13, 49, 86 - 1, 82, 86 - 18, 82, 86 - 72, 33, 86 - 86],
                        offset: cc.p(-41.5, -43),
                        mass: 2,
                    }
                    var sp = self.addItem({
                        tex: "#do3_all.png",
                        mass: info.mass,
                        disAct: true,
                        type: info.type,
                        buf: info.buf,
                        offset: info.offset,
                    })
                    self.pyActItem({
                        item: sp,
                        act: false,
                    })
                    sp.setPosition(getMiddle(0, 100))
                    var act = new cc.Sprite()
                    var size = sp.getContentSize()
                    act.setPosition(size.width / 2, size.height / 4)
                    safeAdd(sp, act)
                    act.runAction(createAnimation({
                        frame: "kb_%02d.png",
                        end: 35,
                        time: 1 / 12,
                        fun: function() {
                            createTouchEvent({
                                item: sp,
                                begin: function(data) {
                                    var item = data.item
                                    self.pyActItem({
                                        item: item,
                                        act: false,
                                    })
                                    return true
                                },
                                move: function(data) {
                                    data.left = 403
                                    data.right = 735
                                    data.bottom = 107
                                    judgeMove(data)
                                },
                                end: function(data) {
                                    var item = data.item
                                    self.pyActItem({
                                        item: item,
                                        act: true,
                                    })
                                }
                            })
                        }
                    }))
                }
            }
        }
        var toolbtn = createTool({
            pos: cc.p(70, 480),
            ifFrame: true,
            nums: 2,
            tri: "down",
            showTime: 0.3,
            itempos: [cc.p(0, -50), cc.p(0, -50)],
            circlepos: cc.p(0, 30),
            devide: cc.p(1.5, 1),
            moveTime: 0.2,
            father: self,
            ifcircle: true,
            circleScale: 0.7,
            fileAnchor: cc.p(0.5, 0),
            itemScale: 0.8,
            files: fileList,
            gets: [null, null],
            judge: function(index) {
                if (index == 1 && !self.showNext) {
                    return false
                }
                return true
            },
            firstClick: function(data) {
                var index = data.index
                var sp = null
                switch (index) {
                    case 0:
                        var info = {
                            type: "poly",
                            buf: [1, 86 - 66, 1, 86 - 13, 49, 86 - 1, 82, 86 - 18, 82, 86 - 72, 33, 86 - 86],
                            offset: cc.p(-41.5, -43),
                            mass: 0.2,
                        }
                        sp = self.addItem({
                            tex: "#do3_mk.png",
                            mass: info.mass,
                            disAct: true,
                            type: info.type,
                            buf: info.buf,
                            offset: info.offset,
                        })
                        self.pyActItem({
                            item: sp,
                            act: false,
                        })
                        self.mk = sp
                        addCrashRect({
                            item: sp,
                            list: [{
                                item: self.shuigang.judgeRect,
                            }]
                        })
                        break
                    case 1:
                        sp = new cc.Sprite("#do3_tk.png")
                        self.tk = sp
                        break
                }
                return sp
            },
            movefun: function(data) {
                var index = data.index
                var delta = data.delta
                var item = data.sp
                data.item = item
                switch (data.index) {
                    case 0:
                        //data.bottom = 107
                        item._judgeCrash({
                            delta: delta
                        })
                        break
                    case 1:
                        judgeMove(data)
                        break
                }
                judgeAll()
            },
            outfun: function(data) {
                var index = data.index
                var item = data.sp
                switch (index) {
                    case 0:
                        outJudge(item)
                        break
                }
            },
            backfun: function(data) {
                var index = data.index
                var item = data.sp
                switch (index) {
                    case 0:
                        outJudge(item)
                        break
                }
                return false
            }
        })
        this.toolbtn = toolbtn
        this.addChild(toolbtn)
    },
    initScene: function() {
        var self = this
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        for (var i = 0; i < 2; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("sound%d", i + 1), //对话标签 之后让人物说话需要用到的参数
                img: res[sprintf("do3_content%d", i + 1)], //图片和声音文件
                sound: res[sprintf("do3_sound%d", i + 1)],
            })
        }
    }
})