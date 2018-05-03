//@author mu @16/4/27

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("do1_item")
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
                self.canSay = true
                if (!self.hasSay && self.curKey) {
                    self.hasSay = true
                    if (self.curKey) {
                        self.nodebs.say({
                            key: self.curKey,
                            force: true,
                        })
                    }
                }
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
                setZ: 99,
                settingData: {
                    pos: cc.p(1080, 580),
                    biaogeFun: function() {
                        if (!self.biaoge) {
                            var bg = createBiaoge({
                                json: res.do_bg,
                                downData: {
                                    nums: 3,
                                    bufs: [
                                        [null, "#gszycbd_bg_01.png", "#gszycbd_bg_02.png"],
                                        [null, "#gszycbd_bg_01.png", "#gszycbd_bg_02.png"],
                                        [null, "#gszycbd_bg_01.png", "#gszycbd_bg_02.png"],
                                    ],
                                    scale: 1.5,
                                    keys: [1, 2, 1],
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
        return true
    },
    showBg2: function() {
        var self = this
        if (!self.bg2) {
            var uilist = [
                "action",
            ]
            var bg = loadNode(res.do_rg, uilist)
            bg.setPosition(-50, 30)
            safeAdd(self, bg)

            var light = new cc.Sprite("#do_item_14.png")
            light.setPosition(1100, 228)
            light.setLocalZOrder(-1)
            light.setScaleX(7)

            var action = bg.action
            action.curIndex = 0
            action.count = 0
            createTouchEvent({
                item: action,
                begin: function(data) {
                    var item = data.item
                    item.curMove = 0
                    item.auto = false
                    return getLoopVis(item)
                },
                move: function(data) {
                    var item = data.item
                    var delta = data.delta
                    item.curMove += delta.y
                },
                end: function(data) {
                    var item = data.item
                    item.curMove = 0
                    item.auto = true
                }
            })
            var judgeDis = 2
            var countjudge = 1
            action.changeIndex = function() {
                var item = this
                var index = item.curIndex
                if (index > 29) {
                    index = 29
                }
                if (index < -29) {
                    index = -29
                }
                item.curIndex = index
                if (index < 0) {
                    item.setScaleY(-1)
                } else {
                    item.setScaleY(1)
                }
                var final = Math.abs(index) + 1
                item.setTexture(res[sprintf("rg_act_%02d", final)])
                    //12 18
                if (final < 12) {
                    light.setScaleY(1)
                }
                if (final > 18) {
                    light.setScaleY(0)
                }
                if (final >= 12 && final <= 18) {
                    var per = (18 - final) / 6
                    light.setScaleY(per)
                }
                if (final == 1 && self.autoJudge) {
                    self.btn_result.setVisible(true)
                }
            }
            action.disIndex = function() {
                var item = this
                var index = item.curIndex
                if (index > 0) {
                    index--;
                    self.autoJudge = true
                } else if (index < 0) {
                    index++;
                    self.autoJudge = true
                }
                item.curIndex = index
                item.changeIndex()
            }
            action.update = function() {
                var item = this
                var tri = item.curMove > 0 ? -1 : 1
                while (Math.abs(item.curMove) >= judgeDis) {
                    item.curMove += (judgeDis * tri)
                    item.curIndex += tri
                    item.changeIndex()
                }
                if (item.auto) {
                    item.count++;
                    if (item.count >= countjudge) {
                        item.count -= countjudge
                        item.disIndex()
                    }
                }
            }
            action.scheduleUpdate()
            safeAdd(bg, light)
            var btn_result = new ccui.Button(res.btn_jielun_normal, res.btn_jielun_select)
            btn_result.setPosition(getMiddle(400, 140))
            safeAdd(bg, btn_result)
            btn_result.addClickEventListener(function() {
                self.nodebs.say({
                    key: "Result",
                    force: true,
                })
            })
            bg.btn_result = btn_result
            btn_result.setVisible(false)
            self.autoJudge = false
            self.btn_result = btn_result
            self.bg2 = bg
        }
        self.pastBg = self.bg2
        self.bg2.setVisible(true)
        self.curKey = "Show"
        if (self.canSay) {
            self.nodebs.say({
                key: "Show",
                force: true,
            })
        }
    },
    showBg1: function() {
        var self = this
        if (!self.bg1) {


            var node = new cc.Node()
            self.bg1 = node
            var jgd = new cc.Sprite("#img_jgd.png")
            jgd.setPosition(260, 95)
            jgd.rootPos = jgd.getPosition()
            var light = new cc.Sprite("#img_light.png")
            light.setPosition(119, 149)
            light.setLocalZOrder(-1)
            safeAdd(jgd, light)
            jgd.light = light
            safeAdd(self, node)
            var stick = new cc.Sprite(res.img_stick)

            var str = "拖动手电筒和遮光板,\n观察光在不同位置形成的图像,\n并思考为什么"

            var font = new cc.LabelTTF(str, "", 24)
            font.setPosition(320, 540)
            safeAdd(node, font)


            stick.setAnchorPoint(1, 1)
            stick.setVisible(false)
            stick.setRotation(-3)
            stick.setLocalZOrder(100)
            safeAdd(node, stick)
            stick.setPosition(jgd.getPosition())
            var links = []
            var judgeMix = 6
            var judgeMax = 68
            var getFinalIndex = function() {
                var fitstDis = jgd.x - jgd.rootPos.x
                var final = links.length - 1
                for (var i = 0; i < links.length - 1; i++) {
                    var link = links[i]
                    if (link && link.item) {
                        var item = link.item
                        var dis = item.x - item.rootPos.x
                        if (!(Math.abs(dis - fitstDis) <= judgeMix || Math.abs(dis + 2 - fitstDis) >= judgeMax)) {
                            final = i
                            break
                        }
                    }
                }
                return final
            }

            var changeUp = function(judge) {
                for (var i = 0; i < links.length - 1; i++) {
                    var link = links[i]
                    if (link && link.up) {
                        var up = link.up
                        if (!up.pastParent) {
                            up.pastParent = up.getParent()
                            up.pastOrder = up.getLocalZOrder()
                        }
                        if (judge) {
                            up.setLocalZOrder(101)
                            changeFather({
                                item: up,
                                father: node,
                            })
                        } else {
                            up.setLocalZOrder(up.pastOrder)
                            changeFather({
                                item: up,
                                father: up.pastParent,
                            })
                        }
                    }
                }
            }

            var showLight = function(judge) {
                light.setVisible(judge)
                for (var i = 0; i < links.length; i++) {
                    var item = links[i]
                    if (item && item.light) {
                        item.light.setVisible(judge)
                    }
                }
                if (!judge) {
                    var index = getFinalIndex()
                    var inlight = links[index].light
                    var firstLight = links[0].light
                    if (inlight && firstLight) {
                        stick.stopAllActions()
                        var firstPos = node.convertToNodeSpace(getWorldPos(firstLight))
                        var tempPos = cc.p(firstPos.x - 300, firstPos.y - 300)
                        stick.setPosition(tempPos)

                        var pos = node.convertToNodeSpace(getWorldPos(inlight))
                        stick.setVisible(true)
                        var dis = getDis(firstPos, pos)
                        var time = dis / 100 * 0.5

                        addShowType({
                            item: stick,
                            show: "moveTo",
                            buf: pos,
                            time: time,
                        })
                        changeUp(true)
                    }
                } else {
                    stick.setVisible(false)
                    changeUp(false)
                }
            }

            var singleMove = function(data) {
                var item = data.item
                var delta = data.delta
                var children = item.getChildren()
                var disItem = data.disItem || false
                if (!disItem) {
                    item.x += delta.x
                    item.y += delta.y
                }
                if (children) {
                    for (var i = 0; i < children.length; i++) {
                        children[i].x -= delta.x
                        children[i].y -= delta.y
                    }
                }
            }
            var linkMove = function(data) {
                var item = data.item
                var buf = data.buf
                var index = data.index
                var limit = data.limit
                switch (item) {
                    case "light":
                        var temp = jgd.x + buf
                        if (temp > limit[1]) {
                            temp = limit[1]
                        }
                        if (temp < limit[0]) {
                            temp = limit[0]
                        }
                        buf = temp - jgd.x
                        jgd.x += buf
                        for (var i = 0; i < links.length; i++) {
                            if (links[i]) {
                                var light = links[i].light
                                if (light) {
                                    light.x += buf
                                }
                            }
                        }
                        break
                    case "board":
                        for (var i = index + 1; i < links.length; i++) {
                            if (links[i]) {
                                var clip = links[i][sprintf("clip%d", index + 1)]
                                if (clip) {
                                    singleMove({
                                        item: clip,
                                        delta: cc.p(buf, 0),
                                    })
                                }
                            }
                        }
                        break
                }
            }
            var createItem = function(inver) {
                inver = inver || false
                var out = new cc.Sprite(res.img_cover)
                out.setScale(1 / 5)
                var clip = new cc.ClippingNode(out)
                clip.setAlphaThreshold(0)
                clip.setInverted(inver)
                return clip
            }



            var createCover = function(data) {
                var pos = data.pos
                var order = data.order
                var black = data.black
                var index = data.index
                var clip = createItem()
                var clip1 = null
                var clip2 = null
                var clip3 = null
                var inSp = new cc.Sprite("#img_base_light.png")
                inSp.setPosition(-2, 1)
                switch (index) {
                    case 0:
                        safeAdd(clip, inSp)
                        break
                    case 1:
                        clip1 = createItem(true)
                        safeAdd(clip1, inSp)
                        safeAdd(clip, clip1)
                        break
                    case 2:
                        clip1 = createItem(true)
                        clip2 = createItem(true)
                        safeAdd(clip2, inSp)
                        safeAdd(clip1, clip2)
                        safeAdd(clip, clip1)
                        break
                    case 3:
                        clip1 = createItem(true)
                        clip2 = createItem(true)
                        clip3 = createItem(true)
                        safeAdd(clip3, inSp)
                        safeAdd(clip2, clip3)
                        safeAdd(clip1, clip2)

                        clip = clip1
                            //safeAdd(clip, clip1)
                        break
                }
                if (!black) {
                    var item = new cc.Sprite("#img_down.png")
                    var size = item.getContentSize()

                    clip.setPosition(size.width / 2, 223)
                    var upCover = new cc.Sprite("#img_top.png")
                    upCover.setAnchorPoint(0.5, 0)
                    upCover.setPosition(size.width / 2, size.height - 0.8)
                    upCover.setLocalZOrder(0)
                    safeAdd(item, upCover)
                    clip.setLocalZOrder(1)
                    safeAdd(item, clip)
                    item.setPosition(pos)
                    item.setLocalZOrder(order)
                    var down = new cc.Sprite("#img_muc.png")
                    down.setPosition(cc.p(pos.x, pos.y - 115))
                    safeAdd(node, down)
                    safeAdd(node, item)
                    upCover.father = item
                    item.inSp = inSp
                    item.index = index
                    item.clip = clip
                    item.rootPos = pos
                    item.judgeMove = function(data) {
                        var item = this
                        var limit = 118
                        var delta = data.delta
                        var temp = item.x + delta.x
                        if (temp > item.rootPos.x + limit) {
                            temp = item.rootPos.x + limit
                        }
                        if (temp < item.rootPos.x - limit) {
                            temp = item.rootPos.x - limit
                        }
                        var inSp = item.inSp
                        var final = temp - item.x
                        item.x += final

                        singleMove({
                            item: item.clip,
                            delta: cc.p(final, 0),
                            disItem: true,
                        })

                        linkMove({
                            item: "board",
                            index: item.index,
                            buf: final,
                        })
                    }
                    createTouchEvent({
                        item: item,
                        begin: function(data) {
                            var result = getLoopVis(data.item) && judgeOpInPos(data)
                            if (result && node.showIng) {
                                node.judgeBtn.change(false, true)
                            }
                            return result
                        },
                        move: function(data) {
                            data.item.judgeMove(data)
                        },
                    })
                    createTouchEvent({
                        item: upCover,
                        begin: function(data) {
                            var result = getLoopVis(data.item) && judgeOpInPos(data)
                            if (result && node.showIng) {
                                node.judgeBtn.change(false, true)
                            }
                            return result
                        },
                        move: function(data) {
                            data.item.father.judgeMove(data)
                        },
                    })
                    return {
                        item: item,
                        light: inSp,
                        clip1: clip1,
                        clip2: clip2,
                        clip3: clip3,
                        up: upCover,
                    }
                } else {
                    var item = new cc.Sprite("#img_down.png")
                    var size = item.getContentSize()
                    clip.setPosition(size.width / 2, 223)
                    item.setPosition(pos)
                    safeAdd(node, item)
                    safeAdd(item, clip)

                    var bl = new cc.Sprite("#img_wall.png")
                    bl.setPosition(cc.p(pos.x + 10, pos.y + 40))
                    safeAdd(node, bl)

                    changeFather({
                        item: clip,
                        father: bl,
                    })

                    item.removeFromParent(true)

                    return {
                        light: inSp,
                        clip1: clip1,
                        clip2: clip2,
                        clip3: clip3,
                    }
                }
            }
            var start = cc.p(500, 240)
            var devide = 90
            for (var i = 0; i < 4; i++) {
                var info = createCover({
                    pos: cc.p(start.x + devide * i, start.y + devide * i),
                    order: 4 - i,
                    black: i == 3,
                    index: i,
                })
                links[i] = info
            }
            createTouchEvent({
                item: jgd,
                begin: function(data) {
                    var result = getLoopVis(data.item)
                    if (result && node.showIng) {
                        node.judgeBtn.change(false, true)
                    }
                    return result
                },
                move: function(data) {
                    var item = data.item
                    var delta = data.delta
                    linkMove({
                        item: "light",
                        buf: delta.x,
                        limit: [94, 450],
                    })
                }
            })
            safeAdd(node, jgd)
            node.setScale(0.9)
            node.setPositionX(50)

            var btn = createJudgeBtn({
                normal: "btn_zhi_normal.png",
                select: "btn_zhi_select.png",
                frame: true,
                pos: cc.p(50, 250),
                fun: function() {
                    showLight(false)
                    node.showIng = true
                },
                back: function() {
                    showLight(true)
                    node.showIng = false
                }
            })
            safeAdd(node, btn)
            node.judgeBtn = btn
        }
        self.pastBg = self.bg1
        self.bg1.setVisible(true)
        self.curKey = null
        if (self.canSay) {
            self.nodebs.stopSay()
        }
    },
    initScene: function() {
        var self = this
        var btnList = []
        for (var i = 0; i < 2; i++) {
            var btn = createJudgeBtn({
                normal: res[sprintf("btn_e%d_normal", i + 1)],
                select: res[sprintf("btn_e%d_select", i + 1)],
                pos: cc.p(100, 480 - 90 * i),
                onlyTrue: true,
                fun: function(btn) {
                    for (var i = 0; i < btnList.length; i++) {
                        if (btn != btnList[i]) {
                            btnList[i].change(false, false)
                        }
                    }
                    if (self.pastBg) {
                        self.pastBg.setVisible(false)
                    }
                    self[sprintf("showBg%d", btn.index)]()
                },
            })
            btnList[i] = btn
            btn.index = i + 1
            safeAdd(self, btn)
        }
        btnList[0].change(true, true)
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
            img: res.do_content1, //图片和声音文件
            sound: res.do_sound1
        })
        addContent({
            people: this.nodebs,
            key: "Result",
            img: res.do_content4,
            sound: res.do_sound4,
            id: "result", //结论的时候的特殊标签
            // offset: cc.p(85, 30),
            // btnModify: cc.p(10, 10),
            // btnScale: 0.8,
        })
    }
})