//@author mu @16/4/27

var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
    load: function() {},
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show()
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
        self.initScene()
        self.initPeople() //创建人物
        return true
    },
    initScene: function() {
        var self = this
        var uilist = [
            "show",
            "item_ear",
        ]

        var earList = [
            "item_txg",
            "item_ed",
            "item_gm",
            "item_ew",
            "item_tjsj",
        ]

        var fontList = [
            "font1",
            "font2",
            "font3",
            "font4",
            "font5",
        ]

        var fontInside = [
            "normal",
            "select"
        ]

        var imgList = [
            "img1",
            "img2",
            "img3",
            "img4",
            "img5",
        ]
        var node = loadNode(res.sydcb_see, uilist, "bg")

        loadList(node, earList)

        loadList(node, fontList)

        loadList(node, imgList)

        node.show.showIn = function(index) {
            var show = this
            for (var i = 0; i < imgList.length; i++) {
                var img = node[imgList[i]]
                img.setVisible(index == i)
            }
            show.setVisible(true)
            show.stopAllActions()
            addShowType({
                item: show,
                show: "fadeIn",
                time: 0.5,
            })
            self.nodebs.say({
                key: sprintf("s%d", index + 1),
                force: true,
                fun: function() {
                    addShowType({
                        item: show,
                        show: "fadeOut",
                        time: 0.5,
                    })
                }
            })
        }

        var showAct = function(judge) {
            var font = this
            font.normal.setVisible(!judge)
            font.select.setVisible(judge)
            font.showColor(judge)
            node[earList[font.index]].red.setVisible(judge)
            if (judge) {
                node.show.showIn(font.index)
            }
        }

        var showColor = function(judge) {
            var font = this
            if (judge) {
                if (!font.colorLine) {
                    var line = createDrawLines({
                        buf: font.lineData,
                        pos: cc.p(0, 0),
                        father: font,
                        line: 1.5,
                        color: cc.color(255, 0, 0, 255),
                    })
                    font.colorLine = line
                }
                font.colorLine.setVisible(true)
            } else {
                if (font.colorLine) {
                    font.colorLine.setVisible(false)
                }
            }
        }

        var showLine = function(judge) {
            var font = this
            if (judge) {
                if (!font.line) {
                    var line = createDrawLines({
                        buf: font.lineData,
                        pos: cc.p(0, 0),
                        father: font,
                        line: 1.5,
                        color: cc.color(255, 255, 0, 255),
                    })
                    font.line = line
                }
                font.line.setVisible(true)
            } else {
                if (font.line) {
                    font.line.setVisible(false)
                }
            }
        }

        for (var i = 0; i < fontList.length; i++) {
            var font = node[fontList[i]]
            loadList(font, fontInside)
            font.index = i
            font.normal.index = i
            font.showAct = showAct
            font.showLine = showLine
            font.showColor = showColor
        }
        node.showIndex = function(index) {
            var node = this
            for (var i = 0; i < imgList.length; i++) {
                var font = node[fontList[i]]
                font.showAct(index == i)
            }
        }

        node.init = function() {
            var node = this
            var drawList = [
                [
                    [cc.p(-18, -50), cc.p(330, -50)]
                ],
                [
                    [cc.p(-28, -8), cc.p(60, -8)],
                    [cc.p(60, -8), cc.p(182, 88)]
                ],
                [
                    [cc.p(-37, 35), cc.p(37, 35)],
                    [cc.p(0, 35), cc.p(0, 94)]
                ],
                [
                    [cc.p(33, -13), cc.p(-47, -13)],
                    [cc.p(-47, -13), cc.p(-134, 53)]
                ],
                [
                    [cc.p(-74, -28), cc.p(59, -28)],
                    [cc.p(0, -28), cc.p(-59, -84)]
                ],
            ]

            for (var i = 0; i < earList.length; i++) {
                var item = node[earList[i]]
                item.index = i
                item.red = item.getChildByName("red")
                item.red.setVisible(false)
                createTouchEvent({
                    item: item,
                    begin: function(data) {
                        var item = data.item
                        var result = judgeOpInPos(data)
                        if (result) {
                            node.showIndex(item.index)
                        }
                        return result
                    }
                })
            }

            for (var i = 0; i < fontList.length; i++) {
                var font = node[fontList[i]]
                font.lineData = drawList[i]
                font.showLine(true)
                font.select.setVisible(false)
                createTouchEvent({
                    item: font.normal,
                    begin: function(data) {
                        var item = data.item
                        var index = item.index
                        node.showIndex(index)
                        return true
                    },
                    // move: function(data) {
                    //     var pos = data.pos
                    //     var item = data.item
                    //     var par = item.getParent()
                    //     pos = par.convertToNodeSpace(pos)
                    //     cc.log(pos)
                    // }
                })
            }
            node.show.setVisible(false)
        }
        node.init()
        self.addChild(node)
    },
    initPeople: function() {
        var self = this
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs) //添加人物对话
        var list = [
            "s1",
            "s2",
            "s3",
            "s4",
            "s5",
        ]
        for (var i = 0; i < list.length; i++) {
            addContent({
                people: self.nodebs,
                key: list[i],
                sound: res[list[i]]
            })
        }
    }
})