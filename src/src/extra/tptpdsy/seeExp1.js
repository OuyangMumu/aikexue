//@author mu @16/4/27

var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("seeplist")
    },
    myExit: function() { //退出时调用
        this._super()
    },
    myDelete: function() { //删除时调用
        this._super()
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                // self.nodebs.say({//当存在key为show的对话ID才调用
                //     key:"Show"
                // })
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
        self.initScene()
        self.initPeople() //创建人物
        return true
    },
    initScene: function() {
        var self = this
        var linkFun = null
        var linkList = [
            "tp",
            "fdp",
            "phlm",
            "ym",
            "zz",
            "hl",
            "dz",
            "bc"
        ]
        var drawList = [
            [
                [cc.p(50, 0), cc.p(170, 0), cc.p(170, -100)],
                [cc.p(170, 0), cc.p(480, 0), cc.p(480, -100)]
            ],
            [
                [cc.p(0, 25), cc.p(0, 130), cc.p(300, 130)],
            ],
            [
                [cc.p(70, 0), cc.p(95, 0), cc.p(95, 50)],
                [cc.p(70, 0), cc.p(565, 0), cc.p(565, 50)],
            ],
            [
                [cc.p(50, 0), cc.p(220, 0), cc.p(220, 150)],
            ],
            [
                [cc.p(-50, 0), cc.p(-330, 0)]
            ],
            [
                [cc.p(-50, 0), cc.p(-320, 0), cc.p(-320, -50)]
            ],
            [
                [cc.p(-50, 0), cc.p(-150, 0)]
            ],
            [
                [cc.p(-50, 0), cc.p(-320, 0), cc.p(-320, 170)]
            ],
        ]

        var size = cc.director.getWinSize()
        var xpast = 330
        var ydevide = 120
        var height = 4
        var width = 2
        var rootheight = 480
        var posList = []
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                posList[i * height + j] = cc.p(size.width / 2 + (i == 0 ? -xpast : xpast), rootheight - j * ydevide)
            }
        }

        var tp = createTp({
            noFama: true,
            tppos: getMiddle(0, -150),
            teach: true,
            teachFun: function(judge) {
                if (linkFun) {
                    linkFun(judge)
                    var index = null
                    for (var i = 0; i < linkList.length; i++) {
                        if (judge == linkList[i]) {
                            index = i
                            break
                        }
                    }
                    var drawData = drawList[index]
                    if (!self.drawList) {
                        self.drawList = []
                    }
                    if (drawData && !self.drawList[judge]) {
                        self.drawList[judge] = createDrawLines({
                            buf: drawData,
                            pos: posList[index],
                            father: self,
                            line: 1.5,
                        })
                    }
                }
            },
            teachFail: function(judge) {
                if (self.drawList && self.drawList[judge]) {
                    self.drawList[judge].removeFromParent(true)
                    self.drawList[judge] = null
                }
            }
        })
        safeAdd(self, tp)
        var list = [2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 6, 7, 14, 15, 16, 17]
        var imgList = []
        for (var i = 0; i < list.length; i++) {
            imgList[i] = sprintf("see%02d.png", list[i])
        }


        linkFun = function(judge) {
            if (self.imgList) {
                for (var i = 0; i < linkList.length; i++) {
                    if (judge == linkList[i]) {
                        self.imgList.btnList[i].change(true, false)
                        if (self.nodebs) {
                            self.nodebs.say({
                                key: sprintf("sound%d", i),
                                force: true,
                                sameStop: true,
                            })
                        }
                    } else {
                        self.imgList.btnList[i].change(false, false)
                        if (self.drawList && self.drawList[linkList[i]]) {
                            self.drawList[linkList[i]].removeFromParent(true)
                            self.drawList[linkList[i]] = null
                        }
                    }
                }
            }
        }
        var node = createNewLink({
            imgList: imgList,
            posList: posList,
            init: function() {
                var sp = new cc.Sprite("#see01.png")
                sp.setPosition(getMiddle(0, 235))
                self.addChild(sp)
            },
            linkFun: function(index) {
                if (tp && tp.showTeach) {
                    tp.showTeach(linkList[index])
                }
            },
        })
        self.imgList = node
        safeAdd(self, node)
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        for (var i = 0; i < 8; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("sound%d", i), //对话标签 之后让人物说话需要用到的参数
                sound: res[sprintf("sound%d", i + 1)] //图片和声音文件
            })
        }
    }
})