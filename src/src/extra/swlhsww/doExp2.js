//@author mu @16/4/27

var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("swl_fonts")
        loadPlist("swl_items")
        loadPlist("swl_imgs")
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
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: self.curkey,
                    force: true,
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
        this.expCtor() //实验模板
        var self = this
        self.initPeople() //创建人物
        self.initScene()
        self.curkey = "do2_sound1"
        return true
    },
    initScene: function() {
        var self = this
        var list = [
            "img_daotian",
            "img_chitang",
            "img_shulin",
            "img_shamo",
            "img_caoyuan",
            "img_haiyang",
        ]
        var fontList = [
            "daotian",
            "chitang",
            "shulin",
            "shamo",
            "caoyuan",
            "dahai"
        ]

        var countList = [
            6,
            7,
            10,
            8,
            7,
            8,
        ]

        var itemList = [
            ["nongzuowu", "huangchong1", "qingwa", "she1", "ji", "laoying"],
            ["shuicao", "qingtingyouchong", "tianluo", "kedou", "jiyu", "xia", "wuli"],
            ["maotouying", "xiaoniao", "huangchong1", "zhizhu", "she3", "linwa", "zhiwu2", "lang2", "tuzi", "shu"],
            ["xianrenzhang", "she2", "laoying", "hulang", "shamoshu", "huangchong2", "xiezi", "xiyi"],
            ["zhiwu1", "yang", "shu", "she1", "laoying", "lang1", "tuzi"],
            ["haizao", "yibei", "shuizao", "qingyu", "xueyu", "jinqiangyu", "shayu", "youyu"],
        ]

        var finalFontList = [
            ["nongzuowu", "huangchong", "qingwa", "she", "ji", "laoying"],
            ["shuicao", "qingtingyouchong", "tianluo", "kedou", "jiyu", "xia", "wuli"],
            ["maotouying", "xiaoniao", "huangchong", "zhizhu", "she", "linwa", "zhiwu", "lang", "tuzi", "shu"],
            ["xianrenzhang", "she", "laoying", "hulang", "shamoshu", "huangchong", "xiezi", "xiyi"],
            ["zhiwu", "yang", "shu", "she", "laoying", "lang", "tuzi"],
            ["haizao", "yibei", "shuizao", "qingyu", "xueyu", "jinqiangyu", "shayu", "youyu"],
        ]

        var posOff = [
            cc.p(0, 0),
            cc.p(30, 0),
            cc.p(40, 0),
            cc.p(40, 0),
            cc.p(30, 0),
            cc.p(50, 0),
        ]
        var width = 300
        var height = 120
        self.canshow = true

        var backBtn = new ccui.Button(res.btn_swl_back_normal, res.btn_swl_back_select)
        backBtn.setPosition(1040, 450)
        safeAdd(self, backBtn)
        backBtn.setVisible(false)

        backBtn.addClickEventListener(function() {
            backBtn.setVisible(false)
            if (self.curItem) {
                self.curItem.back()
            }
        })
        var showTime = 0.5
        for (var i = 0; i < list.length; i++) {
            var item = new cc.Sprite(res[list[i]])

            var layOut = createLayout({
                size: item.getContentSize(),
                clip: true,
            })
            layOut.setLocalZOrder(1)
            item.layOut = layOut
            safeAdd(item, layOut)

            var back = new cc.Sprite(res.bg_blue)
            back.setLocalZOrder(-1)
            back.setPosition(1136 / 2, 640 / 2)
            safeAdd(item, back)

            item.setScale(0.25)
            var indexi = i % 3 - 1
            var indexj = Math.floor(i / 3) ? -1 : 1
            var pos = getMiddle(-100 + indexi * width, indexj * height)
            item.setPosition(pos)
            var font = new cc.Sprite(sprintf("#font_%s.png", fontList[i]))
            font.setPosition(pos.x, pos.y - 110)
            safeAdd(self.inside_node, font)
            safeAdd(self.inside_node, item)
            item.index = i
            item.rootPos = pos
            item.rootScale = item.getScale()
            item.showItems = function() {
                var item = this
                var index = item.index
                if (!item.final) {
                    var uilist = []
                    for (var i = 0; i < countList[index]; i++) {
                        uilist[i] = sprintf("item%d", i + 1)
                    }
                    var json = res[sprintf("swl_%s", fontList[index])]
                    var inside = loadNode(json, uilist)
                    var off = posOff[index]
                    inside.setPosition(getMiddle(off.x, off.y))
                    safeAdd(item, inside)
                    item.final = inside
                    inside.list = uilist
                    for (var i = 0; i < uilist.length; i++) {
                        var initem = inside[uilist[i]]
                        initem.show = initem.getChildByName("show")
                        initem.show.setVisible(false)
                    }
                }
            }
            item.back = function() {
                var item = this
                if (!item.showing) {
                    item.showing = true
                    if (item.final) {
                        item.final.removeFromParent(true)
                        item.final = null
                    }
                    if (item.itemList) {
                        item.itemList.removeFromParent(true)
                        item.itemList = null
                    }
                    addShowType({
                        item: item,
                        show: "scaleTo",
                        buf: item.rootScale,
                        time: showTime,
                        fun: function(item) {
                            backBtn.setVisible(false)
                            item.layOut.setTouchEnabled(false)
                            item.showing = false
                        }
                    })
                    addShowType({
                        item: item,
                        show: "moveTo",
                        buf: item.rootPos,
                        time: showTime,
                    })
                    self.curItem = null
                    self.canshow = true
                }
            }
            item.judgeFinal = function() {
                var item = this
                var final = item.final
                var list = final.list
                var judge = true
                for (var i = 0; i < list.length; i++) {
                    var temp = final[list[i]]
                    if (!temp.finish) {
                        judge = false
                        break
                    }
                }
                if (judge) {
                    if (!self.hasShowdia) {
                        self.hasShowdia = true
                        AddDialog("Judge", {
                            judge: true,
                            sound: "student",
                            fun: function() {
                                self.hasShowdia = false
                            }
                        })
                    }
                }
            }

            item.showList = function(judge) {
                var item = this
                if (!item.itemList) {
                    var inlist = itemList[item.index]
                    var finalList = []
                    var imgList = []
                    var inFontList = finalFontList[item.index]
                    var tempInFontList = []
                    for (var i = 0; i < inlist.length; i++) {
                        finalList[i] = sprintf("#item_%s.png", inlist[i])
                        imgList[i] = sprintf("#img_%s.png", inlist[i])
                        tempInFontList[i] = sprintf("#font_%s.png", inFontList[i])
                    }
                    var showList = createList({ 
                        type: "S",
                        list: finalList,
                        pos: getMiddle(-500, -40),
                        num: 4,
                        size: cc.size(136, 440),
                        mix: 20,
                        arrOff: cc.p(0, 0),
                        color: "op",
                        arrow: "yellow",
                        btnScale: 0.7,
                        disTri: true,
                        //canUp: true,
                        // upInfo: {
                        //     normal: res.swl_up_normal,
                        //     select: res[sprintf("swl_select%d", item.index + 1)]
                        // },
                        getFun: function(data) {
                            var index = data.index
                            var tex = data.tex
                            var pos = data.pos
                            var sprite = new cc.Sprite(imgList[index])
                            sprite.setPosition(pos)
                            safeAdd(item.layOut, sprite)
                            return sprite
                        },
                        outFun: function(data) {
                            var item1 = data.item
                            var pos = data.pos
                            var index = data.index
                            var final = item.final
                            var list = final.list
                            var tempList = []
                            for (var i = 0; i < list.length; i++) {
                                var item2 = final[list[i]]
                                tempList[i] = getDis(getWorldPos(item2), pos)
                            }
                            var min = tempList[0]
                            var mini = 0
                            for (var i = 1; i < tempList.length; i++) {
                                if (tempList[i] < min) {
                                    min = tempList[i]
                                    mini = i
                                }
                            }

                            var finalTarget = final[sprintf("item%d", mini + 1)]

                            var result = judgeItemCrash({
                                item1: item1,
                                item2: finalTarget,
                            })
                            if (result) {
                                if (index == mini) {
                                    var size = finalTarget.getContentSize()
                                    item1.setPosition(size.width / 2, size.height / 2)
                                    safeAdd(finalTarget, item1)
                                    finalTarget.finish = true
                                    setFinalScale({
                                        item: item1,
                                        scale: 1,
                                    })
                                    var font = new cc.Sprite(tempInFontList[index])
                                    var inSize = item1.getContentSize()
                                    font.setPosition(inSize.width / 2, -15)
                                    safeAdd(item1, font)
                                    playEffect(res.zswd_right)
                                    item.judgeFinal()
                                } else {
                                    item.itemList.judgeIndex(index, false)
                                    addShowType({
                                        item: finalTarget.show,
                                        show: "blink",
                                        time: 0.5,
                                        count: 2,
                                    })
                                    playEffect(res.zswd_wrong)
                                }
                            } else {
                                item.itemList.judgeIndex(index, false)
                            }
                        }
                    })
                    safeAdd(item.layOut, showList)
                    item.itemList = showList
                }
            }

            item.show = function() {
                var item = this
                item.setLocalZOrder(1)
                reAdd(item)
                item.showItems()
                addShowType({
                    item: item,
                    show: "scaleTo",
                    buf: 1.0,
                    time: showTime,
                    fun: function(item) {
                        self.curItem = item
                        item.layOut.setTouchEnabled(true)
                        backBtn.setVisible(true)
                        item.showList()
                        self.curkey = "do2_sound2"
                        if (self.canSay) {
                            self.nodebs.say({
                                key: self.curkey,
                                force: true,
                            })
                        }
                    }
                })
                addShowType({
                    item: item,
                    show: "moveTo",
                    buf: getMiddle(),
                    time: showTime,
                })
            }
            createTouchEvent({
                item: item,
                begin: function() {
                    if (self.canshow) {
                        self.canshow = false
                        return true
                    }
                    return false
                },
                end: function(data) {
                    var item = data.item
                    var index = item.index
                    item.show()
                }
            })
        }
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
                key: sprintf("do2_sound%d", i + 1), //对话标签 之后让人物说话需要用到的参数
                img: res[sprintf("do2_content%d", i + 1)], //图片和声音文件
                sound: res[sprintf("do2_sound%d", i + 1)]
            })
        }
    }
})