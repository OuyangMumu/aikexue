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
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: "Show"
                })
            })
        }
    },
    inHand: function(data) {
        var self = this
        var item = data.item
        var uilist = [
            "back",
            "front",
            "add"
        ]
        var hand = loadNode(res.wtdcf_hand, uilist)
        hand.setPosition(item.getPosition())
        item.setPosition(0, 0)
        safeAdd(hand.add, item)
        safeAdd(self, hand)
        self.shuigang.addItem({
            item: hand,
        })
        return hand
    },
    dataControl: {},
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
        var self = this
        this.expCtor()
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        createWaterPhy({
            layer: self,
            //showDebug: true,
        })
        self.initPeople() //创建人物
        self.initScene()
        var btn = new ccui.Button(res.btn_jielun_normal, res.btn_jielun_select)
        btn.setPosition(getMiddle(510, 160))
        btn.addClickEventListener(function() {
            if (self.nodebs) {
                self.nodebs.say({
                    key: "result",
                })
            }
        })
        safeAdd(self, btn)
        return true
    },
    initScene: function() {
        var self = this

        var shuigang = createShuiGang()
        shuigang.setPosition(getMiddle(-220, -120))
        safeAdd(self, shuigang)


        shuigang.setHeight(200)

        shuigang.clipNode.setLocalZOrder(1)
        shuigang.water_front.setLocalZOrder(1)
        shuigang.deco.setLocalZOrder(1)
        changeFather({
            item: shuigang.clipNode,
            father: self,
        })

        changeFather({
            item: shuigang.water_front,
            father: self,
            needScale: true,
        })

        changeFather({
            item: shuigang.deco,
            father: self,
            needScale: true,
        })

        self.shuigang = shuigang

        var water = self.addWater({
            item: shuigang.judgeWater,
            disHeight: 45,
        })

        var apple = self.addItem({
            tex: res.img_apple,
            mass: 0.5,
            pos: getMiddle(180, -230),
            disAct: true,
        })

        var rock = self.addItem({
            tex: res.img_rock,
            mass: 0.6,
            pos: getMiddle(280, -240),
            disAct: true,
        })

        var itemList = [
            apple,
            rock
        ]
        for (var i = 0; i < itemList.length; i++) {
            var item = itemList[i]
            self.pyActItem({
                item: item,
                act: false,
            })
            createTouchEvent({
                item: item,
                autoMove: true,
                begin: function(data) {
                    var item = data.item
                        // water = water.mixHeight({
                        //     mix: -10,
                        // })
                    item.rootPos = item.getPosition()
                    item.pastParent = item.getParent()
                    var hand = self.inHand({
                        item: item,
                    })
                    item.hand = hand
                    self.pyActItem({
                        item: item,
                        act: false,
                    })
                    return true
                },
                move: function(data) {
                    var item = data.item.hand
                    var delta = data.delta
                    var tx = item.x + delta.x
                    var ty = item.y + delta.y
                    var bottom = -185
                    var right_left = 275
                    var right_right = 525
                    var upJudge = 92
                    var left_left = -170
                    var left_right = 132

                    if (item.x >= right_left && item.x <= right_right && item.y < upJudge) {
                        if (tx < right_left) {
                            tx = right_left
                        }
                        if (tx > right_right) {
                            tx = right_right
                        }
                        item.x = tx
                        if (ty < bottom) {
                            ty = bottom
                        }
                        item.y = ty
                    } else if (item.y > upJudge) {
                        if (tx < left_left) {
                            tx = left_left
                        }
                        if (tx > right_right) {
                            tx = right_right
                        }
                        item.x = tx
                        item.y = ty
                    } else {
                        if (tx < left_left) {
                            tx = left_left
                        }
                        if (tx > left_right) {
                            tx = left_right
                        }
                        item.x = tx
                        if (ty < bottom) {
                            ty = bottom
                        }
                        item.y = ty
                    }
                },
                end: function(data) {
                    var item = data.item
                    item.setPosition(item.pastParent.convertToNodeSpace(getWorldPos(item)))
                    safeAdd(item.pastParent, item)
                    item.hand.removeFromParent(true)
                    var result = judgeItemCrash({
                        item1: item,
                        item2: shuigang.judgeWater,
                    })
                    if (result) {
                        self.pyActItem({
                            item: item,
                            act: true,
                        })
                        removeMoving(item)
                    } else {
                        item.setPosition(item.rootPos)
                    }
                    // water = water.mixHeight({
                    //     mix: 10,
                    // })
                }
            })
        }

        self.actPys(true)
        return false
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        addContent({
            people: this.nodebs,
            key: "Show", //对话标签 之后让人物说话需要用到的参数
            img: res.see1_conten1, //图片和声音文件
            sound: res.see1_sound1
        })
        addContent({
            people: this.nodebs,
            key: "result", //对话标签 之后让人物说话需要用到的参数
            img: res.see_result, //图片和声音文件
            sound: res.see1_sound2,
            id: "result",
            btnModify: cc.p(15, 5),
        })
    }
})