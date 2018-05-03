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
            "show1",
            "show2",
            "show3",
            "show4",
            "bg_show",
            "btn_close",
            "btn_tips",
        ]
        var list = [
            "link",
            "select",
            "normal",
            "show",
            "font",
            "link2",
        ]
        var node = loadNode(res.fzcl_see, uilist)
        for (var i = 0; i < uilist.length - 3; i++) {
            loadList(node[uilist[i]], list)
        }
        node.init = function() {
            var touchs = ["link", "normal", "link2"]
            var shows = ["select", "show", "font"]
            var node = this
            var judges = [
                "show1",
                "show2",
                "show3",
                "show4",
            ]
            node.showIndex = function(index) {
                var node = this
                for (var i = 0; i < judges.length; i++) {
                    var item = node[judges[i]]
                    if (index == i) {
                        if (node.pastIndex != index) {
                            node.pastIndex = i
                            self.nodebs.say({
                                key: sprintf("show%d", i + 1),
                                force: true,
                            })
                        }
                        item.act(true)
                    } else {
                        item.act(false)
                    }
                }
            }
            for (var i = 0; i < judges.length; i++) {
                var item = node[judges[i]]
                item.act = function(judge) {
                    var item = this
                    item.normal.setVisible(!judge)
                    item.select.setVisible(judge)
                    item.link.setVisible(judge)
                    item.show.setVisible(judge)
                    item.font.setVisible(judge)
                    if (item.link2) {
                        item.link2.setVisible(judge)
                    }
                }
                for (var j = 0; j < touchs.length; j++) {
                    var temp = item[touchs[j]]
                    if (temp) {
                        temp.index = i
                        createTouchEvent({
                            item: temp,
                            end: function(data) {
                                var item = data.item
                                node.showIndex(item.index)
                            }
                        })
                    }
                }
            }
            node.showIndex(-1)
        }
        node.init()
        initBg({
            item: node.bg_show,
            move: true,
            init: false,
        })
        node.btn_close.addClickEventListener(function() {
            node.bg_show.out()
        })
        node.btn_tips.addClickEventListener(function() {
            node.bg_show.act()
        })
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
            "fzcl_see_sound1",
            "fzcl_see_sound2",
            "fzcl_see_sound3",
            "fzcl_see_sound4",
        ]
        for (var i = 0; i < list.length; i++) {
            addContent({
                people: self.nodebs,
                key: sprintf("show%d", i + 1),
                sound: res[list[i]]
            })
        }
    }
})