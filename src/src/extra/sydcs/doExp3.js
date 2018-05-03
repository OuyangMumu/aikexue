//@author mu @16/4/27
var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp3", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {},
    myExit: function() { //退出时调用
        this._super()
    },
    myDelete: function() { //删除时调用
        var self = this
        this._super()
        if (self.biaoge) {
            self.biaoge.removeFromParent(false)
        }
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
                vis: false,
                settingData: {
                    pos: cc.p(1080, 580),
                    biaogeFun: function() {
                        var bg = sydcs_biaoge()
                        safeAdd(self, bg)
                        self.biaoge = bg
                        bg.show()
                    },
                }
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
        var item_do = loadDo({
            key: "do3",
        })
        safeAdd(self, item_do)

        var uilist = [
            "item_hand",
            "add",
            "item_left",
            "item_right",
            "hand1",
            "hand2",
            "hand3",
            "hand4",
        ]
        var lineColor = cc.color(255, 204, 0, 255)
        loadList(item_do, uilist)
        var add = item_do.add
        var hand = item_do.item_hand
        var hand1 = item_do.hand1
        var hand2 = item_do.hand2
        var hand3 = item_do.hand3
        var hand4 = item_do.hand4

        hand3.setVisible(false)
        hand4.setVisible(false)
        hand.rootPos = hand.getPosition()
        var lineWidth = 4
        hand.draw = function() {
            var hand = this
            if (!hand.drawNode) {
                var draw = new cc.DrawNode()
                safeAdd(add, draw)
                hand.drawNode = draw
            }
            var draw = hand.drawNode
            draw.clear()
            var leftPoint = draw.convertToNodeSpace(getWorldPos(item_do.item_left))
            var rightPoint = draw.convertToNodeSpace(getWorldPos(item_do.item_right))
            draw.drawSegment(leftPoint, cc.p(0, 0), lineWidth, lineColor)
            draw.drawSegment(rightPoint, cc.p(0, 0), lineWidth, lineColor)
        }
        hand.back = function() {
            var hand = this
            var draw = hand.drawNode
            var dis = Math.abs(hand.getPositionY() - hand.rootPos.y)
            var minus = 2.5
            hand.setPosition(hand.rootPos)
            var leftPoint = draw.convertToNodeSpace(getWorldPos(item_do.item_left))
            var rightPoint = draw.convertToNodeSpace(getWorldPos(item_do.item_right))
            var count = 0
            if (dis >= minus) {
                draw.clear()
                playEffect(res.do3_sound)
            }
            addTimer({
                fun: function(key) {
                    draw.clear()
                    if (dis == 0) {
                        draw.drawSegment(leftPoint, cc.p(0, 0), lineWidth, lineColor)
                        draw.drawSegment(rightPoint, cc.p(0, 0), lineWidth, lineColor)
                        removeTimer(key)
                        hand1.setVisible(true)
                        hand2.setVisible(true)
                        return
                    } else {
                        if (cc.sys.isNative) {
                            for (var i = -lineWidth / 2; i < lineWidth / 2; i++) {
                                draw.drawQuadBezier(cc.p(leftPoint.x, leftPoint.y + i),
                                    cc.p(0, (count % 2 ? dis : -dis) + i), cc.p(rightPoint.x, rightPoint.y + i), 50, 1, lineColor)
                            }
                        } else {
                            draw.drawQuadBezier(leftPoint, cc.p(0, count % 2 ? dis : -dis), rightPoint, 50, lineWidth * 2, lineColor)
                        }
                    }
                    count++
                    dis -= 2
                    if (dis <= 0) {
                        dis = 0
                    }
                },
                time: 1 / 24,
                repeat: cc.REPEAT_FOREVER,
            })
        }
        hand.draw()

        var limit = 150
        createTouchEvent({
            item: hand,
            begin: function(data) {
                var item = data.item
                if (hand1.isVisible()) {
                    hand1.setVisible(false)
                    hand2.setVisible(false)
                    hand3.setVisible(true)
                    hand4.setVisible(true)
                        //var pos = data.pos
                        //item.rootPos = item.getParent().convertToNodeSpace(pos)
                    return true
                }
                return false
            },
            move: function(data) {
                var item = data.item
                var pos = item.getParent().convertToNodeSpace(data.pos)
                if (pos.y > item.rootPos.y + limit) {
                    pos.y = item.rootPos.y + limit
                }
                if (pos.y < item.rootPos.y - limit) {
                    pos.y = item.rootPos.y - limit
                }
                item.y = pos.y
                item.draw()
            },
            end: function(data) {
                var item = data.item
                hand3.setVisible(false)
                hand4.setVisible(false)
                item.back()
            }
        })
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
            img: res.do_content3, //图片和声音文件
            sound: res.sound_do3
        })
    }
})