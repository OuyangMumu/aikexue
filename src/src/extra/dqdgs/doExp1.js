//@author mu @16/4/27

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
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
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: "Show"
                })
            })
        }
    },
    dataControl: {},
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
        this.expCtor({
                vis: true,
            }) //实验模板
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
            "ball",
            "rotate",
            "show",
            "ship",
            "show_ship"
        ]
        self.btn_result.addClickEventListener(function() {
            self.nodebs.say({
                key: "result",
                force: true,
            })
        })
        var node = loadNode(res.do1, uilist)
        node.setPosition(100, 0)
        safeAdd(self, node)
        node.ship.rootPos = node.ship.getPosition()
        createTouchEvent({
            item: node.ship,
            autoMove: true,
            end: function(data) {
                var item = data.item
                var result = judgeItemCrash({
                    item1: item,
                    item2: node.ball,
                })
                if (result) {
                    item.setPosition(0, 144.5)
                    safeAdd(node.rotate, item)
                    removeMoving(item)
                    createTouchEvent({
                        item: item,
                        end: function() {
                            node.act()
                        }
                    })
                    node.act()
                } else {
                    item.setPosition(item.rootPos)
                }
            }
        })
        var ship = node.show_ship
        ship.rootScale = ship.getScale()

        node.judgeList = []
        node.judgeList[node.judgeList.length] = node.rotate
        node.judgeList[node.judgeList.length] = ship
        var distance = 290
        node.act = function() {
                if (!node.acting) {
                    node.acting = true
                    addShowType({
                        item: node.rotate,
                        show: "rotateBy",
                        buf: -360,
                        time: 160 / 24,
                        fun: function() {
                            node.acting = false
                            self.btn_result.setVisible(true)
                        }
                    })
                    addShowType({
                        item: ship,
                        show: "scaleTo",
                        buf: cc.p(0.9, 0.9),
                        time: 74 / 24,
                        fun: function(item) {
                            item.setScale(item.rootScale)
                        }
                    })
                    addShowType({
                        item: ship,
                        show: "moveBy",
                        buf: cc.p(0, distance),
                        time: 37 / 24,
                        fun: function(item) {
                            addShowType({
                                item: item,
                                show: "moveBy",
                                buf: cc.p(0, -distance),
                                time: 37 / 24,
                            })
                        }
                    })
                }
            }
            //test flag
            // var judge = true
            // createTouchEvent({
            //     item: node.ball,
            //     begin: function() {
            //         for (var i = 0; i < node.judgeList.length; i++) {
            //             if (judge) {
            //                 node.judgeList[i].pause()
            //             } else {
            //                 node.judgeList[i].resume()
            //             }

        //         }
        //         judge = !judge
        //     }
        // })
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        addContent({
            people: this.nodebs,
            key: "Show", //对话标签 之后让人物说话需要用到的参数
            img: res.do1_content, //图片和声音文件
            sound: res.do1_sound1
        })
        addContent({
            people: this.nodebs,
            key: "result", //对话标签 之后让人物说话需要用到的参数
            img: res.do1_result, //图片和声音文件
            sound: res.do1_sound2,
            id: "result",
            btnModify: cc.p(5, 5),
            offbg: cc.p(20, 20),
        })
    }
})