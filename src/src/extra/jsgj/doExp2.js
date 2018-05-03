//@author mu @16/4/27

var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2", //必要！ 用于判定各种按钮的返回和进入
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
        dataControl.curMin = parseInt(Math.floor(Math.random() * 3))
        dataControl.curSec = parseFloat(parseFloat(Math.floor(Math.random() * 30)).toFixed(1))
        dataControl.curTime = dataControl.curMin * 60 + dataControl.curSec
        return dataControl.curTime
    },
    getResult: function() {
        var self = this
        var dataControl = self.dataControl
        var node = dataControl.node
        var inputs = [
            "input1",
        ]
        var results = []
        for (var i = 0; i < inputs.length; i++) {
            var input = node[inputs[i]].input
            if (input) {
                results.push(parseFloat(input.getString()))
            }
        }
        var mix = 0
        return Math.abs(results[0] - self.getCurTime()) <= mix
    },
    getCurTime: function() {
        var self = this
        var clock = self.clock
        if (clock) {
            var result = (clock.getTime()).toFixed(1)
            return result
        }
    },
    initScene: function() {
        var self = this
        var dataControl = self.dataControl
        var clock = createWatch()
        clock.changeStatus("start")
        self.clock = clock

        var uilist = [
            "step0",
            "step1",
            "step2",
            "step3",
            "step4",
            "node_show",
            "input1",
            "btn_upload",
            "btn_answer",
            "correct",
            "result",
            "hand",
            "item_dmz",
            "item_zz",
            "inside"
        ]

        var node = loadNode(res.jsgj_do2_json, uilist)
        self.inside_node.addChild(node)
        var nodescale = 1.5
        var mix = 0.85
        var clockscale = 1 / nodescale * mix
        node.hand.setScale(nodescale)
        clock.setScale(clockscale)
        clock.setPosition(cc.p(7, 20))
        node.inside.addChild(clock)
        node.hand.setPosition(getMiddle())

        var teach = clock.changeTeach({
            father: node,
            scale: getLoopScale(node) * mix,
        })

        node.btn_upload.addClickEventListener(function() {
            if (self.getResult()) {
                node.correct.setString("答案正确。")
            } else {
                node.correct.setString("答案错误。")
            }
        })

        node.btn_answer.addClickEventListener(function() {
            var temp = sprintf("%s", self.getCurTime())
            node.result.setString(temp)
        })

        var judgeList = [
            "step0",
            "step1",
            "step2",
            "step3",
            "step4",
        ]

        var mapping = [
            "show1",
            "show1",
            "show2",
            "show3",
            "show4",
        ]
        node.clear = function() {
            node.correct.setString("")
            node.result.setString("")
            var inputs = [
                "input1",
            ]
            for (var i = 0; i < inputs.length; i++) {
                node[inputs[i]].input.setString("")
            }
        }
        clock.setBack({
            statu: "stop",
            before: function() {
                var dmz = node.item_dmz
                dmz.setRotation(dmz.rootRotation + 5)
            },
            fun: function() {
                dataControl.isResume = true
                var dmz = node.item_dmz
                dmz.setRotation(dmz.rootRotation)
            }
        })
        clock.setBack({
            statu: "start",
            before: function() {
                var zz = node.item_zz
                zz.y = zz.rootY - 10
            },
            fun: function() {
                dataControl.isStart = true
                var zz = node.item_zz
                zz.y = zz.rootY
            }
        })
        node.showIndex = function(index) {
            var node = this
            var show = node.node_show
            if (index == 0) {
                index = 1
            }
            dataControl.isStart = true
            dataControl.isResume = true
            node.hand.setVisible(false)
            teach.setVisible(false)
            if (dataControl.watchs) {
                for (var i = 0; i < dataControl.watchs.length; i++) {
                    dataControl.watchs[i].setVisible(false)
                }
            }
            node.hand.setScale(1.5)
            node.hand.setPosition(getMiddle())

            removeTimer("STOP_MOVE")
            removeTimer("RESUME")
            for (var i = 0; i < mapping.length; i++) {
                var child = show.getChildByName(mapping[i])
                var judge = node[judgeList[i]]
                if (index == i) {
                    child.setVisible(true)
                    if (judge) {
                        judge.getChildByName("select").setVisible(true)
                        judge.getChildByName("normal").setVisible(false)
                    }
                    switch (index) {
                        case 1:
                            teach.setVisible(true)
                            node.hand.setVisible(true)
                            clock.changeStatus("stop")
                            clock.changeStatus("start")
                            var dmz = node.item_dmz
                            dmz.setRotation(dmz.rootRotation)
                            dataControl.isResume = false
                            if (!dataControl.initTimer) {
                                dataControl.initTimer = true
                                addTimer({
                                    fun: function() {
                                        removeTimer("RESUME")
                                        clock.changeStatus("stop", {
                                            beforeFun: function() {
                                                dmz.setRotation(dmz.rootRotation + 5)
                                            },
                                            time: 0.5,
                                            afterFun: function() {
                                                dmz.setRotation(dmz.rootRotation)
                                            },
                                            delay: 1,
                                            judgeFun: function() {
                                                var result = !dataControl.isResume
                                                return result
                                            },
                                        })
                                    },
                                    time: 5,
                                    repeat: 1,
                                    key: "RESUME",
                                    type:"action",
                                })
                            }
                            break
                        case 2:
                            teach.setVisible(true)
                            node.hand.setVisible(true)
                            clock.changeStatus("stop")
                            var zz = node.item_zz
                            zz.y = zz.rootY
                            dataControl.isResume = false
                            dataControl.isStart = false
                            clock.changeStatus("start", {
                                beforeFun: function() {
                                    zz.y = zz.rootY - 10
                                    addTimer({
                                        fun: function() {
                                            removeTimer("STOP_MOVE")
                                            if (!dataControl.isStart && !dataControl.isResume) {
                                                clock.showClick({
                                                    statu: "pause",
                                                    time: 0.5,
                                                })
                                            }
                                        },
                                        time: 10.5,
                                        repeat: 1,
                                        key: "STOP_MOVE",
                                        type:"action",
                                    })
                                },
                                time: 0.5,
                                afterFun: function() {
                                    zz.y = zz.rootY
                                },
                                delay: 1,
                                judgeFun: function() {
                                    var result = !dataControl.isStart && !dataControl.isResume
                                    return result
                                },
                            })
                            break
                        case 3:
                            if (!dataControl.watchs) {
                                dataControl.watchs = []
                                var watch = createWatch()
                                watch.setTime(80)
                                watch.setScale(mix)
                                watch.setPosition(getMiddle(-155, 100))
                                watch.setUse(false)
                                self.addChild(watch)
                                dataControl.watchs.push(watch)
                                watch = createWatch()
                                watch.setTime(105)
                                watch.setScale(mix)
                                watch.setPosition(getMiddle(155, 100))
                                watch.setUse(false)
                                self.addChild(watch)
                                dataControl.watchs.push(watch)
                            }
                            for (var j = 0; j < dataControl.watchs.length; j++) {
                                dataControl.watchs[j].setVisible(true)
                            }
                            break
                        case 4:
                            node.clear()
                            node.hand.setVisible(true)
                            clock.changeStatus("stop")
                            clock.setTime(self.randomTime())
                            clock.changeStatus("start")
                            node.hand.setScale(nodescale)
                            node.hand.setPosition(getMiddle(200, -30))
                            break
                    }
                } else {
                    if (judge) {
                        child.setVisible(false)
                        if (index <= 3 && i == 0) {
                            judge.getChildByName("select").setVisible(true)
                            judge.getChildByName("normal").setVisible(false)
                        } else {
                            if (index == 4 && i != 0) {
                                judge.getChildByName("select").setVisible(false)
                                judge.getChildByName("normal").setVisible(false)
                            } else {
                                judge.getChildByName("select").setVisible(false)
                                judge.getChildByName("normal").setVisible(true)
                            }

                        }
                    }
                }
            }
        }
        node.init = function() {
            var node = this
            node.item_dmz.rootRotation = node.item_dmz.getRotationX()
            node.item_zz.rootY = node.item_zz.getPositionY()
            for (var i = 0; i < judgeList.length; i++) {
                var item = node[judgeList[i]]
                if (item) {
                    var judge = item.getChildByName("normal")
                    var link = item.getChildByName("select")
                    judge.link = link
                    judge.index = i
                    createTouchEvent({
                        item: judge,
                        end: function(data) {
                            var item = data.item
                            dataControl.initTimer = false
                            if (item.isVisible() || item.link.isVisible()) {
                                node.showIndex(item.index)
                            }
                        }
                    })
                }
            }
            var inputs = [
                "input1",
            ]
            for (var i = 0; i < inputs.length; i++) {
                addInput({
                    item: node[inputs[i]],
                    backFun: function(item) {
                        var input = item.input
                        var str = input.getString()
                        str = parseFloat(str).toString()
                        if(str == "NaN"){
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