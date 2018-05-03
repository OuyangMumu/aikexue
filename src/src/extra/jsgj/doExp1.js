//@author mu @16/4/27

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {},
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {})
        }
    },
    dataControl: {},
    randomTime: function() {
        var self = this
        var dataControl = self.dataControl
        dataControl.curHour = parseInt(Math.floor(Math.random() * 12)) + 1
        dataControl.curMin = parseInt(Math.floor(Math.random() * 60))
        dataControl.curSec = parseInt(Math.floor(Math.random() * 60))
        dataControl.curTime = dataControl.curHour * 3600 + dataControl.curMin * 60 + dataControl.curSec
        return dataControl.curTime
    },
    getResult: function() {
        var self = this
        var dataControl = self.dataControl
        var node = dataControl.node
        var inputs = [
            "input1",
            "input2",
            "input3",
        ]
        var results = []
        for (var i = 0; i < inputs.length; i++) {
            var input = node[inputs[i]].input
            if (input) {
                results.push(parseInt(input.getString()))
            }
        }
        return results[0] == dataControl.curHour && results[1] == dataControl.curMin && results[2] == dataControl.curSec
    },
    initScene: function() {
        var self = this
        var dataControl = self.dataControl
        var clock = createClock()
        clock.setPosition(getMiddle(0, 70))
        clock.setTime(4 * 3600 + 50 * 60 + 29)
        self.clock = clock
        self.inside_node.addChild(clock)

        var uilist = [
            "step1",
            "step2",
            "step3",
            "node_show",
            "input1",
            "input2",
            "input3",
            "btn_upload",
            "btn_answer",
            "correct",
            "result",
        ]

        var node = loadNode(res.jsgj_do1_json, uilist)
        self.inside_node.addChild(node)

        node.btn_upload.addClickEventListener(function() {
            if (self.getResult()) {
                node.correct.setString("答案正确。")
            } else {
                node.correct.setString("答案错误。")
            }
        })

        node.btn_answer.addClickEventListener(function() {
            var temp = sprintf("%02d时%02d分%02d秒", dataControl.curHour, dataControl.curMin, dataControl.curSec)
            node.result.setString(temp)
        })

        var judgeList = [
            "step1",
            "step2",
            "step3",
        ]

        var mapping = [
            "show1",
            "show2",
            "show3",
        ]
        node.clear = function() {
            node.correct.setString("")
            node.result.setString("")
            var inputs = [
                "input1",
                "input2",
                "input3",
            ]
            for (var i = 0; i < inputs.length; i++) {
                node[inputs[i]].input.setString("")
            }
        }
        node.showIndex = function(index) {
            var node = this
            var show = node.node_show
            for (var i = 0; i < mapping.length; i++) {
                var child = show.getChildByName(mapping[i])
                var judge = node[judgeList[i]]
                if (index == i) {
                    child.setVisible(true)
                    if (judge) {
                        judge.getChildByName("select").setVisible(true)
                        judge.getChildByName("normal").setVisible(false)
                    }
                    if (index == 0) {
                        if (!self.sx) {
                            var sx = new cc.Sprite(res.jsgj_sx)
                            self.sx = sx
                            sx.setAnchorPoint(0, 1)
                            var size = clock.deco.getContentSize()
                            sx.setPosition(cc.p(size.width / 2, size.height / 2))
                            sx.setScale(1.13)
                            sx.setLocalZOrder(-1)
                            clock.deco.addChild(sx)
                        }
                        var sx = self.sx
                        sx.setVisible(true)
                    } else {
                        var sx = self.sx
                        if (sx) {
                            sx.setVisible(false)
                        }
                    }
                    if (index == 2) {
                        clock.setTime(self.randomTime())
                        node.clear()
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
        node.init = function() {
            var node = this
            for (var i = 0; i < judgeList.length; i++) {
                var item = node[judgeList[i]]
                if (item) {
                    var judge = item.getChildByName("normal")
                    judge.index = i
                    createTouchEvent({
                        item: judge,
                        end: function(data) {
                            var item = data.item
                            node.showIndex(item.index)
                        }
                    })
                }
            }
            var inputs = [
                "input1",
                "input2",
                "input3",
            ]
            for (var i = 0; i < inputs.length; i++) {
                addInput({
                    item: node[inputs[i]],
                    backFun: function(item) {
                        var input = item.input
                        var str = input.getString()
                        str = parseInt(str).toString()
                        if (str == "NaN") {
                            str = ""
                        }
                        input.setString(str)
                    }
                })
            }
            node.result.setString("")
            node.correct.setString("")
            node.showIndex(0)
        }
        node.init()
        dataControl.node = node
    },
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
    initPeople: function() {
    }
})