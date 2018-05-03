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
            this.nodebs.show(function() {
                self.nodebs.say({
                    key: "show1",
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
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        self.initScene()
        return true
    },
    initScene: function() {
        var self = this
        var uilist = [
            "font0",
            "show1",
            "show2",
            "btn_result",
        ]
        var list = [
            "show",
            "select",
            "normal",
            "font",
            "touch1",
            "touch2",
        ]
        var cat = [
            "show1",
            "show2",
        ]
        var node = loadNode(res.tsyq_see1_json, uilist)
        for (var i = 0; i < uilist.length; i++) {
            loadList(node[cat[i]], list)
        }
        node.font0.act = node.setVisible
        node.init = function() {
            var touchs = ["touch1", "touch2", "normal"]
            var shows = ["select", "show", "font"]
            var node = this
            var judges = [
                "font0",
                "show1",
                "show2",
            ]
            node.showIndex = function(index) {
                var node = this
                for (var i = 0; i < judges.length; i++) {
                    var item = node[judges[i]]
                    if (index == i) {
                        if (node.pastIndex != index) {
                            node.pastIndex = i
                            if (index != 0) {
                                self.nodebs.say({
                                    key: sprintf("show%d", i + 1),
                                    force: true,
                                })
                            }
                            node.btn_result.setVisible(index == 2)
                        }
                        item.act(true)
                    } else {
                        item.act(false)
                    }
                }
            }
            for (var i = 1; i < judges.length; i++) {
                var item = node[judges[i]]
                item.act = function(judge) {
                    var item = this
                    for (var k = 0; k < shows.length; k++) {
                        item[shows[k]].setVisible(judge)
                    }
                    item.normal.setVisible(!judge)
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
            node.showIndex(0)
        }
        node.init()

        // initBg({
        //     item: node.bg_show,
        //     move: true,
        //     init: false,
        // })
        node.btn_result.addClickEventListener(function() {
            self.nodebs.say({
                key: "show4",
            })
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
            "tsyq_see1_sound1",
            "tsyq_see1_sound2",
            "tsyq_see1_sound3",
            "tsyq_see1_sound4",
        ]
        for (var i = 0; i < list.length; i++) {
            var img = null
            var id = null
            if (i == 3) {
                img = res.tsyq_see_result,
                    id = "result"
            }
            addContent({
                people: self.nodebs,
                key: sprintf("show%d", i + 1),
                sound: res[list[i]],
                id: id,
                img: img,
            })
        }
    }
})