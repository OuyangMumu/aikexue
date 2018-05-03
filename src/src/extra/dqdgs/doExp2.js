//@author mu @16/4/27

var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2", //必要！ 用于判定各种按钮的返回和进入
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
            "desk",
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
        var node = loadNode(res.do2, uilist)
        node.setPosition(0, 0)
        safeAdd(self, node)
        node.ship.rootPos = node.ship.getPosition()
        var ship = node.show_ship
        createTouchEvent({
            item: node.ship,
            autoMove: true,
            end: function(data) {
                var item = data.item
                var result = judgeItemCrash({
                    item1: item,
                    item2: node.desk,
                })
                if (result) {
                    safeAdd(node.desk, item)
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
        ship.rootScale = ship.getScale()
        ship.rootPos = ship.getPosition()
        ship.setVisible(false)

        node.act = function() {
            if (!node.acting) {
                node.acting = true
                ship.setVisible(true)
                ship.setScale(ship.rootScale)
                ship.setPosition(ship.rootPos)
                node.ship.setPosition(530, 311)
                addShowType({
                    item: node.ship,
                    show: "moveBy",
                    buf: cc.p(-330, 0),
                    time: 72 / 24,
                    fun: function() {
                        node.acting = false
                        self.btn_result.setVisible(true)
                    }
                })
                addShowType({
                    item: ship,
                    show: "scaleTo",
                    buf: cc.p(0.7, 0.7),
                    time: 72 / 24,
                })
                addShowType({
                    item: ship,
                    show: "moveBy",
                    buf: cc.p(0, -45),
                    time: 72 / 24,
                })
            }
        }
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
            img: res.do2_content, //图片和声音文件
            sound: res.do2_sound1
        })
        addContent({
            people: this.nodebs,
            key: "result", //对话标签 之后让人物说话需要用到的参数
            img: res.do2_result, //图片和声音文件
            sound: res.do2_sound2,
            id: "result",
            btnModify: cc.p(5, 5),
        })
    }
})