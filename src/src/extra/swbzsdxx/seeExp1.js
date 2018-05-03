//@author mu @16/4/27

var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("see_plist")
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
        self.initPeople() //创建人物
        self.initScene()
        return true
    },
    initScene: function() {
        var self = this
        var uilist = []
        for (var i = 0; i <= 10; i++) {
            uilist[uilist.length] = sprintf("item%d", i)
        }
        var bg = loadNode(res.swbz_see, uilist)
        safeAdd(self, bg)
        bg.init = function() {
            var bg = this
            for (var i = 0; i < uilist.length; i++) {
                var item = bg[uilist[i]]
                item.setScale(0.9)
                item.index = i
                createTouchEvent({
                    item: item,
                    begin: function(data) {
                        var item = data.item
                        var result = judgeOpInPos(data)
                        if (result) {
                            item.setScale(1.0)
                        }
                        return result
                    },
                    end: function(data) {
                        var item = data.item
                        item.setScale(0.9)
                        if (!item.showImg) {
                            var show = createShowImg({
                                img: sprintf("#spbz_%02d.png", 23 - item.index),
                                showType: "up",
                                inFun: function() {
                                    if (self.nodebs) {
                                        self.nodebs.say({
                                            key: sprintf("sound%d", item.index),
                                            force: true,
                                        })
                                    }
                                },
                                outFun: function(node) {
                                    node.close = true
                                }
                            })
                            safeAdd(self, show)
                            item.showImg = show
                        }
                        if (self.pastImg && !self.pastImg.close) {
                            self.pastImg.show(false)
                            self.pastImg.close = true
                        }
                        item.showImg.setPosition(getMiddle(0, -20))
                        item.showImg.show(true)
                        self.pastImg = item.showImg
                        self.pastImg.close = false
                        self.pastIndex = item.index
                    }
                })
            }
        }
        var drawList = [
            [cc.p(738, 432), cc.p(674, 367)],
            [cc.p(739, 347), cc.p(686, 338)],
            [cc.p(721, 241), cc.p(661, 271)],
            [cc.p(635, 229), cc.p(648, 212)],
            [cc.p(578, 226), cc.p(571, 197)],
            [cc.p(529, 259), cc.p(472, 215)],
            [cc.p(473, 285), cc.p(521, 289)],
            [cc.p(498, 352), cc.p(533, 331)],
            [cc.p(524, 418), cc.p(560, 376)],
            [cc.p(630, 429), cc.p(623, 387)],
        ]
        createDrawLines({
            buf: drawList,
            pos: cc.p(0, 0),
            father: self,
            line: 2,
            color: cc.color(255, 255, 0, 255)
        })
        bg.init()
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        for (var i = 0; i <= 10; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("sound%d", i), //对话标签 之后让人物说话需要用到的参数
                sound: res[sprintf("sound%d", i)]
            })
        }
    }
})