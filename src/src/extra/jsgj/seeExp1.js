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
        var dataControl = self.dataControl
        var uilist = [
            "item_kd",
            "item_sz",
            "item_fz",
            "item_mz",
            "node_show"
        ]
        var mapping = [
            "show1",
            "show2",
            "show3",
            "show4",
            "show5",
        ]

        var judgeList = [
            null,
            "item_kd",
            "item_sz",
            "item_fz",
            "item_mz",
        ]
        var link = [
            null,
            "kd",
            "sz",
            "fz",
            "mz",
        ]

        var linkPos = [
            null,
            getMiddle(100, 180),
            getMiddle(-10, 50),
            getMiddle(0, 120),
            getMiddle(26, 48),
        ]
        var node = loadNode(res.jsgj_see1_json, uilist)

        var addContens = function() {
            for (var i = 0; i < mapping.length; i++) {
                addContent({
                    people: self.nodebs,
                    key: mapping[i], //对话标签 之后让人物说话需要用到的参数
                    sound: res[sprintf("jsgj_see1_sound%d", i + 1)]
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
                            if (dataControl.clock) {
                                clock.showRed(item.link)
                                draw.clear()
                                var pos = item.getParent().getPosition()
                                draw.drawSegment(cc.p(pos.x, pos.y), linkPos[item.index], 1, cc.color(255, 0, 0, 255))
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
        var clock = createClock()
        clock.setPosition(getMiddle(0, 70))
        clock.setTime(7 * 3600 - 7)
        self.inside_node.addChild(clock)
        dataControl.clock = clock
        node.init()
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