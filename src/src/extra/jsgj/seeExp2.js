//@author mu @16/4/27

var seeExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp2", //必要！ 用于判定各种按钮的返回和进入
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
        var dataControl = self.dataControl
        var uilist = [
            "item_qdb",
            "item_fwb",
            "item_mz",
            "item_fz",
            "item_fzkd",
            "item_mzkd",
            "node_show"
        ]
        var mapping = [
            "show1",
            "show2",
            "show3",
            "show4",
            "show5",
            "show6",
            "show7",
        ]

        var judgeList = [
            null,
            "item_qdb",
            "item_fwb",
            "item_mz",
            "item_fz",
            "item_fzkd",
            "item_mzkd",
        ]
        var link = [
            null,
            "qdb",
            "fwb",
            "mz",
            "fz",
            "fzkd",
            "mzkd",
        ]

        var linkPos = [
            null,
            getMiddle(0, 210),
            getMiddle(-145, 150),
            getMiddle(-25, 25),
            getMiddle(0, 80),
            getMiddle(40, 60),
            getMiddle(130, -20),
        ]
        var node = loadNode(res.jsgj_see2_json, uilist)

        var addContens = function() {
            for (var i = 0; i < mapping.length; i++) {
                addContent({
                    people: self.nodebs,
                    key: mapping[i], //对话标签 之后让人物说话需要用到的参数
                    sound: res[sprintf("jsgj_see2_sound%d", i + 1)]
                })
            }
        }
        addContens()

        node.showIndex = function(index) {
            var node = this
            var show = node.node_show
            if (node.pastIndex != index) {
                node.pastIndex = index
                for (var i = 0; i < mapping.length; i++) {
                    var child = show.getChildByName(mapping[i])
                    var judge = node[judgeList[i]]
                    if (index == i) {
                        if (index != 0) {
                            self.nodebs.say({
                                key: mapping[index],
                                force: true,
                            })
                        }
                        child.setVisible(true)
                        if (judge) {
                            judge.getChildByName("select").setVisible(true)
                            judge.getChildByName("normal").setVisible(false)
                        }
                    } else {
                        child.setVisible(false)
                        if (judge) {
                            judge.getChildByName("select").setVisible(false)
                            judge.getChildByName("normal").setVisible(true)
                        }
                    }
                }
            }
        }

        var draw = new cc.DrawNode()

        node.init = function() {
            var node = this
            for (var i = 0; i < judgeList.length; i++) {
                var item = node[judgeList[i]]
                if (item) {
                    var judge = item.getChildByName("normal")
                    judge.index = i
                    judge.link = link[i]
                    var clock = dataControl.clock
                    var buf = {
                        item: judge,
                    }

                    clock.setGuideFunc(link[i], buf, function(data) {
                        var item = data.item
                        node.showIndex(item.index)
                        clock.showRed(item.link)
                        draw.clear()
                        var pos = item.getParent().getPosition()
                        draw.drawSegment(pos, linkPos[item.index], 1, cc.color(255, 0, 0, 255))
                    })

                    createTouchEvent({
                        item: judge,
                        end: function(data) {
                            var item = data.item
                            node.showIndex(item.index)
                            if (clock) {
                                clock.showRed(item.link)
                                draw.clear()
                                var pos = item.getParent().getPosition()
                                draw.drawSegment(pos, linkPos[item.index], 1, cc.color(255, 0, 0, 255))
                            }
                        }
                    })
                }
            }
            node.showIndex(0)
            node.pastIndex = 0
        }
        self.inside_node.addChild(node)
        dataControl.node = node
        dataControl.uilist = uilist
        node.setCascadeOpacityEnabled(true)

        var clock = createWatch()
        clock.setPosition(getMiddle(0, 70))
        clock.setTime(24.8)
        self.inside_node.addChild(clock)
        dataControl.clock = clock
        node.init()
        clock.setUse(false)
        self.inside_node.addChild(draw)
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.loadUI.addChild(this.nodebs) //添加人物对话
    }
})