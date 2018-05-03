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
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.canSay = true
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: sprintf("sound%d", self.curIndex)
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
        self.curIndex = 0
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        self.initScene()
        return true
    },
    initScene: function() {
        var self = this
        var uilist = []
        for (var i = 1; i <= 7; i++) {
            uilist[uilist.length] = sprintf("item%d", i)
            uilist[uilist.length] = sprintf("font%d", i)
            uilist[uilist.length] = sprintf("show%d", i)
        }
        var bg = loadNode(res.see_json, uilist, "bg")
        safeAdd(self, bg)
        bg.showIndex = function(index) {
            self.curIndex = index
            for (var i = 1; i <= 7; i++) {
                bg[sprintf("item%d", i)].setVisible(index == i)
                bg[sprintf("show%d", i)].setVisible(index == i)
                bg[sprintf("font%d", i)].setColor(index == i ? cc.color(255, 0, 0, 255) : cc.color(255, 255, 255, 255))
            }
            if (self.canSay) {
                self.nodebs.say({
                    key: sprintf("sound%d", index),
                    force: true,
                })
            }
        }
        bg.showIndex(0)
        for (var i = 1; i <= 7; i++) {
            var font = bg[sprintf("font%d", i)]
            font.index = i
            createTouchEvent({
                item: font,
                end: function(data) {
                    var item = data.item
                    bg.showIndex(item.index)
                }
            })
        }
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        for (var i = 0; i <= 7; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("sound%d", i), //对话标签 之后让人物说话需要用到的参数
                sound: res[sprintf("sound%d", i)]
            })
        }
    }
})