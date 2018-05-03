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
        var uiList = [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
        ]
        var itemList = [
            "font",
            "show",
            "click",
        ]
        var bg = loadNode(res.see1, uiList, "bg")
        var fontList = [9, 5, 3, 11, 7]

        var showIndex = function(index) {
            for (var i = 0; i < uiList.length; i++) {
                item = bg[uiList[i]]
                item.show.setVisible(index == i)
            }
            if (!self.fontImg) {
                var sp = new cc.Sprite()
                sp.setPosition(getMiddle(0, -260))
                safeAdd(self, sp)
                self.fontImg = sp
            }
            var sp = self.fontImg
            sp.setSpriteFrame(sprintf("see_img_%02d.png", fontList[index]))
            self.nodebs.say({
                key: sprintf("sound%d", index),
                force: true
            })
        }
        for (var i = 0; i < uiList.length; i++) {
            var item = bg[uiList[i]]
            loadList(item, itemList)
            item.show.setVisible(false)
            item.click.setVisible(false)
            item.font.index = i
            item.click.index = i
            createTouchEvent({
                item: item.font,
                end: function(data) {
                    var item = data.item
                    showIndex(item.index)
                }
            })
            createTouchEvent({
                item: item.click,
                begin: function(data) {
                    var result = judgeOpInPos(data)
                    return result
                },
                end: function(data) {
                    var item = data.item
                    showIndex(item.index)
                }
            })
        }
        safeAdd(self, bg)
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        for (var i = 0; i < 5; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("sound%d", i), //对话标签 之后让人物说话需要用到的参数
                sound: res[sprintf("see_sound%d", i + 1)]
            })
        }
    }
})