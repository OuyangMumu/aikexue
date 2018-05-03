//@author mu @16/4/27

var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("seeJson")
        loadPlist("do2json")
    },
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
            this.nodebs.show(function() {
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: "Show"
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
        this.expCtor({
                vis: false,
                settingData: {
                    pos: cc.p(1080, 580),
                    biaogeFun: function() {
                        if (!self.biaoge) {
                            var bg = createBiaoge({
                                json: res.fl_bg2,
                                inputNum: 9,
                                downData: {
                                    nums: 3,
                                    bufs: [
                                        [null, "#fl_bg_02.png", "#fl_bg_04.png", "#fl_bg_06.png"],
                                        [null, "#fl_bg_02.png", "#fl_bg_04.png", "#fl_bg_06.png"],
                                        [null, "#fl_bg_02.png", "#fl_bg_04.png", "#fl_bg_06.png"],
                                    ],
                                },
                            })
                            self.biaoge = bg
                            safeAdd(self, bg)
                        }
                        self.biaoge.show()
                    },
                }
            }) //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        self.initScene()
        self.createTool()

        return true
    },
    createTool: function() {
        var self = this
        var fileList = []
        for (var i = 0; i < 3; i++) {
            fileList[i] = sprintf("do2_tool%d.png", i + 1)
        }

        var outJudge = function(item) {
            var judge1 = item.judge
            var judge2 = self.th.judge
            var th = self.th
            var result = judgeItemCrash({
                item1: judge1,
                item2: judge2,
            })
            if (result) {
                removeMoving(item)
                var scale = item.getScale()
                var force = null
                var limit = null
                switch (item.index) {
                    case 0:
                        force = 8.2
                        limit = [500, 340]
                        item.setPosition(-3.6, -278.9)
                        break
                    case 1:
                        force = 7.8
                        limit = [500, 300]
                        item.setPosition(-6, -154)
                        break
                    case 2:
                        force = 3.8
                        limit = [500, 280]
                        item.setPosition(-6, -125)
                        break
                }
                th.addItem({
                    item: item,
                    force: force,
                    init: function(item) {
                        setFinalScale({
                            item: item,
                            scale: scale,
                        })
                        th.item = item
                    }
                })

                th.setLimit(limit)
                th.follow()
                if (!self.show2) {
                    self.show2 = true
                    self.nodebs.say({
                        key: "Next",
                        force: true,
                    })
                }
            }
        }

        var toolbtn = createTool({
            pos: cc.p(70, 500),
            ifFrame: true,
            nums: 3,
            tri: "down",
            showTime: 0.3,
            itempos: [cc.p(0, -53), cc.p(0, -60), cc.p(0, -50)],
            circlepos: [cc.p(0, 15), cc.p(0, 15), cc.p(0, 25)],
            devide: cc.p(1.4, 1.0),
            moveTime: 0.2,
            father: self,
            ifcircle: true,
            circleScale: 0.7,
            fileAnchor: cc.p(0.5, 0),
            itemScale: 0.8,
            files: fileList,
            gets: [null, null, null],
            firstClick: function(data) {
                var th = self.th
                if (self.current) {
                    self.current.forceBack()
                }
                if (th) {
                    th.reSet()
                    th.follow()
                }
                if (self.shuigang) {
                    self.shuigang.setHeight(140)
                }
                var index = data.index
                var sp = new cc.Sprite(sprintf("#do2_img%d.png", index + 1))
                var lay = createLayout({
                    size: cc.size(25, 40),
                    op: 0,
                    color: cc.color(255, 0, 0, 255),
                })
                switch (index) {
                    case 0:
                        lay.setPosition(45, 85)
                        break
                    case 1:
                        lay.setPosition(13, 40)
                        break
                    case 2:
                        lay.setPosition(7, 26)
                        break
                }
                safeAdd(sp, lay)
                sp.judge = lay
                self.current = sp
                addCrashRect({
                    item: sp,
                    list: [{
                        item: self.judgeRect,
                    }]
                })
                return sp
            },
            movefun:function(data){
                var item = data.sp
                var delta = data.delta
                item._judgeCrash({
                    delta: delta
                })
            },
            outfun: function(data) {
                var index = data.index
                var item = data.sp
                outJudge(item)
            },
            backfun: function(data) {
                var index = data.index
                var item = data.sp
                outJudge(item)
                return false
            }
        })
        this.toolbtn = toolbtn
        this.addChild(toolbtn)
    },
    initScene: function() {
        var self = this


        var desk = new cc.Sprite("#img_desk.png")
        desk.setPosition(getMiddle(0, -400))
        safeAdd(self, desk)

        var shuigang = createShuiGang({
            height: 140,
        })
        shuigang.setPosition(getMiddle(0, -180))
        safeAdd(self, shuigang)
        shuigang.clipNode.setLocalZOrder(2)
        shuigang.water_front.setLocalZOrder(2)
        shuigang.deco.setLocalZOrder(2)
        changeFather({
            item: shuigang.clipNode,
            father: self,
        })
        changeFather({
            item: shuigang.water_front,
            father: self,
            needScale: true,
        })
        changeFather({
            item: shuigang.deco,
            father: self,
            needScale: true,
        })

        self.shuigang = shuigang
        self.judgeRect = shuigang.judgeRect
        var upList = [20, 10, 10]
        var node = craeteThclj({
            pos: getMiddle(0, 150),
            layer: self,
            scale: 0.2,
            fdjRoot: 0.17,
            hand: true,
            follow: true,
            judgeFun: function() {
                var th = self.th
                if (!(th && th.item)) {
                    if (!self.hasShow) {
                        AddDialog("Tips", {
                            res: res.img_tip2,
                            face: 2,
                            closeBack: function() {
                                self.hasShow = false
                            }
                        })
                        self.hasShow = true
                    }
                    return false
                }
                return true
            },
            move: function() {
                var th = self.th
                if (th) {
                    var item = th.item
                    if (item) {
                        var per = 0
                        var up = null
                        var down = null
                        var maxForce = null
                        var minForce = null
                        var pos = getWorldPos(item)
                        switch (item.index) {
                            case 0:
                                up = 213
                                down = 143
                                maxForce = 8.2
                                minForce = 5.3
                                break
                            case 1:
                                up = 189
                                down = 151
                                maxForce = 7.8
                                minForce = 6.8
                                break
                            case 2:
                                up = 184
                                down = 153
                                maxForce = 3.8
                                minForce = 3.3
                                break
                        }
                        if (pos.y > up) {
                            per = 0
                        } else if (pos.y < down) {
                            per = 1
                        } else {
                            per = (up - pos.y) / (up - down)
                        }
                        var final = 140 + upList[item.index] * per
                        self.shuigang.setHeight(final)
                        th.setForce(maxForce - (maxForce - minForce) * per)
                        th.follow()
                    }
                }
            }
        })

        var th = node.th
        var fjd = node.fdj
        self.th = th
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        addContent({
            people: this.nodebs,
            key: "Show", //对话标签 之后让人物说话需要用到的参数
            img: res.do2_content1, //图片和声音文件
            sound: res.do2_sound1
        })
        addContent({
            people: this.nodebs,
            key: "Next", //对话标签 之后让人物说话需要用到的参数
            img: res.do2_content2, //图片和声音文件
            sound: res.do2_sound2
        })
    }
})