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
        var self = this
        if (this.nodebs) {
            this.nodebs.show(function() {
                self.canSay = true
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: self.curKey,
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
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        self.initScene()
        self.curKey = "sound1"
        return true
    },
    initScene: function() {
        var self = this
        var uilist = [
            "tree",
            "chan",
            "tanglang",
            "huangque",
            "mogu",
            "swl_normal"
        ]

        var soundList = [
            2, 3, 3, 3, 4, 5
        ]
        var bg = loadNode(res.swl_see, uilist)

        for (var i = 0; i < uilist.length; i++) {
            var item = bg[uilist[i]]
            item.index = soundList[i]
            var show = item.getChildByName("show")
            if (show) {
                item.show = show
                item.show.setVisible(false)
            }
            var normal = item.getChildByName("normal")
            if (normal) {
                item.normal = normal
                normal.item = item
                var nor_show = normal.getChildByName("show")
                if (nor_show) {
                    normal.show = nor_show
                    nor_show.setVisible(false)
                }
                createTouchEvent({
                    item: normal,
                    // begin:function(data){
                    //     return judgeOpInPos(data)
                    // },
                    end: function(data) {
                        bg.clear()
                        data.item.item.act()
                    }
                })
            }
            if (i == 0) {
                createTouchEvent({
                    item: item,
                    begin: function(data) {
                        return judgeOpInPos(data)
                    },
                    end: function(data) {
                        bg.clear()
                        data.item.act()
                    }
                })
            } else {
                createTouchEvent({
                    item: item,
                    // begin:function(data){
                    //     return judgeOpInPos(data)
                    // },
                    end: function(data) {
                        bg.clear()
                        data.item.act()
                    }
                })
            }

            item.act = function() {
                var item = this
                if (item.show) {
                    item.show.setVisible(true)
                }
                if (item.normal && item.normal.show) {
                    item.normal.show.setVisible(true)
                }
                self.curKey = sprintf("sound%d", item.index)
                if (self.canSay) {
                    self.nodebs.say({
                        key: self.curKey,
                        force: true,
                    })
                }
            }
        }
        bg.clear = function() {
            var bg = this
            for (var i = 0; i < uilist.length; i++) {
                var item = bg[uilist[i]]
                if (item.show) {
                    item.show.setVisible(false)
                }
                if (item.normal && item.normal.show) {
                    item.normal.show.setVisible(false)
                }
            }
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
                key: sprintf("sound%d", i + 1), //对话标签 之后让人物说话需要用到的参数
                img: res[sprintf("see_content%d", i + 1)], //图片和声音文件
                sound: res[sprintf("see_sound%d", i + 1)]
            })
        }
    }
})