//@author mu @16/4/27

var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("ftrj")
    },
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
                    key: "show1"
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
        var count = 0
        var ani_ftrj = function(time, fun) {
            return cc.sequence(createAnimation({
                frame: "ftrj_%02d.png",
                end: 66,
                time: time,
            }), cc.callFunc(function() {
                if (fun) {
                    fun()
                }
            }))
        }

        var img1 = new cc.Sprite(res.see_img2)
        img1.setPosition(getMiddle(-150, 150))
        safeAdd(self, img1)

        addShowType({
            item: img1,
            show: "fadeIn",
            time: 1.0,
            fun: function() {
                addTimer({
                    fun: function() {
                        for (var i = 0; i < self.waterList.length; i++) {
                            self.waterList[i].showHnad()
                        }
                    },
                    time: 2.0,
                })
            },
        })

        var packWater = function(key) {
            var water = createWater({
                key: key,
            })
            var pos = null
            switch (key) {
                case "hot":
                    pos = getMiddle(220, -150)
                    break
                case "cold":
                    pos = getMiddle(-220, -150)
                    break
            }
            water.setPosition(pos)
            water.key = key
            safeAdd(self, water)

            water.showHnad = function() {
                var water = this
                var ft = new cc.Sprite("#ftrj_01.png")
                ft.setPosition(0, 75)

                var niezi = createNiezi({
                    flip: true,
                    item: ft,
                })
                var hand = createHand({
                        item: niezi,
                        flip: true,
                    })
                    //ft.setRotation(50)
                hand.setPosition(-70, 209)
                if (!safeAdd(water, hand)) {
                    return
                }

                addShowType({
                    item: hand,
                    show: "fadeIn",
                    time: 0.1,
                })

                addTimer({
                    fun: function() {
                        if (!changeFather({
                                item: ft,
                                father: water,
                            })) {
                            return
                        }
                        addShowType({
                            item: hand,
                            show: "fadeOut",
                            time: 0.1,
                        })
                        addShowType({
                            item: ft,
                            show: "moveBy",
                            time: 0.5,
                            buf: cc.p(0, -150),
                            fun: function(item) {
                                item.runAction(ani_ftrj(water.key == "hot" ? 0.05 : 0.10, function() {
                                    count++
                                    item.setVisible(false)
                                    if (count == 2) {
                                        img1.setTexture(res.see_img1)
                                        img1.stopAllActions()
                                        addShowType({
                                            item: img1,
                                            show: "fadeIn",
                                            time: 0.1,
                                            fun: function() {
                                                self.nodebs.say({
                                                    key: "show2",
                                                    force: true,
                                                    fun: function() {
                                                        self.nodebs.say({
                                                            key: "show3",
                                                            force: true,
                                                            fun: function() {
                                                                self.nodebs.say({
                                                                    key: "show4",
                                                                    force: true,
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }))
                            }
                        })
                    },
                    time: 2.0,
                })
            }
            return water
        }
        self.waterList = []
        self.waterList[0] = packWater("hot")
        self.waterList[1] = packWater("cold")
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        for (var i = 0; i < 4; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("show%d", i + 1), //对话标签 之后让人物说话需要用到的参数
                sound: res[sprintf("see_sound%d", i + 1)]
            })
        }
    }
})