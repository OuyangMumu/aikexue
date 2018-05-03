//@author mu @16/4/27
var seeExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp2", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("see_tool")
    },
    myExit: function() { //退出时调用
        this._super()
    },
    myDelete: function() { //删除时调用
        this._super()
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        var self = this
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: "Show"
                })
            })
        }
        if (self.toolbtn) {
            self.toolbtn.show()
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
        item.setPosition(0, 0)
        hand.item = item
        safeAdd(hand.add, item)
        safeAdd(self, hand)
            //hand.setPosition(hand.getParent().convertToNodeSpace(getMiddle()))
            //hand.noPos = true
        return hand
    },
    dataControl: {},
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
        var self = this
        this.expCtor({
                vis: false,
                settingData: {
                    pos: cc.p(1080, 580),
                    biaogeFun: function() {
                        if (!self.biaoge) {
                            var bg = createBiaoge({
                                json: res.wtdcf_bg1,
                                downData: {
                                    nums: 7,
                                    bufs: [
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                    ],
                                },
                            })
                            self.biaoge = bg
                            safeAdd(self, bg)
                            var judgeList = []
                            var resultList = []
                            var imgList = []
                            var judgeAll = null
                            var finalList = [4, 4, 4, 2, 4, 2, 2, ]
                            var addItem = function(item) {
                                var judge = this
                                if (!judge.itemList) {
                                    judge.itemList = []
                                }
                                var list = judge.itemList
                                for (var i = 0; i < list.length; i++) {
                                    if (list[i].key == item.key) {
                                        return false
                                    }
                                }
                                if (list.length >= 2) {
                                    return false
                                }
                                list[list.length] = item
                                safeAdd(judge, item)
                                item.father = judge
                                createTouchEvent({
                                    item: item,
                                    begin: function(data) {
                                        var item = data.item
                                        item.father.del(item)
                                        changeFather({
                                            item: item,
                                            father: item.pastFather,
                                        })
                                        return true
                                    },
                                    autoMove: true,
                                    end: function(data) {
                                        var item = data.item
                                        if (!judgeAll(item)) {
                                            item.removeFromParent(true)
                                        }
                                    }
                                })
                                judge.sort()
                                return true
                            }
                            var sort = function() {
                                var judge = this
                                var size = judge.getContentSize()
                                var list = judge.itemList
                                if (list.length > 0) {
                                    if (list.length == 1) {
                                        list[0].setPosition(size.width / 2, size.height / 2)
                                    } else {
                                        list[0].setPosition(size.width / 2, size.height / 4 * 3)
                                        list[1].setPosition(size.width / 2, size.height / 4)
                                    }
                                }
                            }
                            var del = function(item) {
                                var judge = this
                                var list = judge.itemList
                                for (var i = 0; i < list.length; i++) {
                                    if (list[i] == item) {
                                        list.splice(i, 1)
                                        judge.sort()
                                        return
                                    }
                                }
                            }

                            for (var i = 0; i < 7; i++) {
                                judgeList[i] = sprintf("judge%d", i + 1)
                                resultList[i] = sprintf("result%d", i + 1)
                            }
                            for (var i = 0; i < 8; i++) {
                                imgList[i] = sprintf("img_r%d", i + 1)
                            }
                            loadList(bg, judgeList)
                            loadList(bg, resultList)
                            loadList(bg, imgList)
                            for (var i = 0; i < judgeList.length; i++) {
                                var judge = bg[judgeList[i]]
                                judge.addItem = addItem
                                judge.sort = sort
                                judge.del = del
                            }
                            judgeAll = function(item) {
                                for (var i = 0; i < judgeList.length; i++) {
                                    var judge = bg[judgeList[i]]
                                    if (judgeItemCrash({
                                            item1: item,
                                            item2: judge
                                        })) {
                                        if (judge.addItem(item)) {
                                            return true
                                        }
                                    }
                                }
                                return false
                            }
                            bg.linkAnswer = function() {
                                for (var i = 0; i < resultList.length; i++) {
                                    var result = bg[resultList[i]]
                                    if (!result.insp) {
                                        var size = result.getContentSize()
                                        var insp = new cc.Sprite(sprintf("#wtdcf_bg_%02d.png", finalList[i]))
                                        insp.setScale(1.5)
                                        insp.setPosition(size.width / 2, size.height / 2)
                                        safeAdd(result, insp)
                                        result.insp = insp
                                    } else {
                                        result.insp.setVisible(true)
                                    }
                                }
                            }
                            bg.ClearFun = function(){
                                for (var i = 0; i < resultList.length; i++) {
                                    var result = bg[resultList[i]]
                                    if (result.insp) {
                                        result.insp.setVisible(false)
                                    }
                                }

                                for (var i = 0; i < judgeList.length; i++) {
                                    var judge = bg[judgeList[i]]
                                    judge.itemList = null
                                    judge.removeAllChildren(true)
                                }
                            }
                            for (var i = 0; i < imgList.length; i++) {
                                var item = bg[imgList[i]]
                                item.key = i
                                createTouchEvent({
                                    item: item,
                                    begin: function(data) {
                                        var item = data.item
                                        var pos = data.pos
                                        var temp = new cc.Sprite(item.getSpriteFrame())
                                        safeAdd(item.getParent(), temp)
                                        temp.setScale(item.getScale())
                                        temp.key = item.key
                                        temp.setPosition(item.getPosition())
                                        item.current = temp
                                        temp.pastFather = item.getParent()
                                        return true
                                    },
                                    move: function(data) {
                                        var item = data.item.current
                                        var delta = data.delta
                                        item.x += delta.x
                                        item.y += delta.y
                                    },
                                    end: function(data) {
                                        var item = data.item.current
                                        if (!judgeAll(item)) {
                                            item.removeFromParent(true)
                                        }
                                    }
                                })
                            }
                        }
                        self.biaoge.show()
                    },
                }
            }) //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        createWaterPhy({
            layer: self,
            //showDebug: true,
        })
        self.initPeople() //创建人物
        self.initScene()
        self.createTool()
        self.totalCount = 0
        return true
    },
    createTool: function() {
        var self = this
        var fileList = []
        for (var i = 0; i < 7; i++) {
            fileList[i] = sprintf("img_tool%d.png", i + 1)
        }
        var infoList = [{
            type: "poly",
            buf: [0, 90 - 54, 0, 90 - 10, 42, 90 - 0, 96, 90 - 30, 96, 90 - 80, 50, 90 - 90],
            offset: cc.p(-48, -45),
            mass: 0.2,
        }, {
            type: "poly",
            buf: [0, 82 - 52, 52, 82 - 0, 82, 82 - 35, 29, 82 - 82],
            offset: cc.p(-41, -41),
            mass: 0.1,
        }, {
            type: "poly",
            buf: [1, 64 - 49, 1, 64 - 9, 36, 64 - 0, 61, 64 - 13, 61, 64 - 54, 25, 64 - 64],
            offset: cc.p(-31, -32),
            mass: 0.1,
        }, {
            type: "box",
            mass: 0.27,
        }, {
            type: "poly",
            buf: [0, 63 - 54, 25, 63 - 11, 34, 63 - 5, 41, 63 - 9, 40, 63 - 21, 14, 63 - 63],
            offset: cc.p(-22, -31.5),
            mass: 0.07,
        }, {
            type: "circle",
            buf: {
                r1: 18,
                r2: 18
            },
            offset: cc.p(0, 0),
            mass: 0.2,
        }, {
            type: "poly",
            buf: [0, 31 - 25, 24, 31 - 0, 29, 31 - 0, 31, 31 - 2, 31, 31 - 5, 24, 31 - 17, 9, 31 - 31, 3, 31 - 31],
            offset: cc.p(-15.5, -15.5),
            mass: 0.08,
        }, ]
        var toolbtn = createTool({
            pos: cc.p(70, 480),
            ifFrame: true,
            nums: 3,
            tri: "down",
            showTime: 0.3,
            itempos: [cc.p(0, -55), cc.p(0, -63), cc.p(0, -55), cc.p(0, -55), cc.p(0, -55), cc.p(0, -55), cc.p(0, -55), ],
            circlepos: cc.p(0, 15),
            devide: cc.p(1, 1.3),
            moveTime: 0.2,
            father: self,
            ifcircle: true,
            circleScale: 0.7,
            fileAnchor: [cc.p(0.5, 0), cc.p(0.5, 0.05), cc.p(0.5, 0), cc.p(0.5, 0), cc.p(0.5, 0), cc.p(0.5, 0), cc.p(0.5, 0)],
            itemScale: [0.8, 0.7, 0.8, 0.8, 0.8, 0.8, 0.8],
            files: fileList,
            gets: [null, null, null, null, null, null, null],
            firstClick: function(data) {
                var index = data.index
                var info = infoList[index]
                var sp = self.addItem({
                    tex: sprintf("#item_tool%d.png", index + 1),
                    mass: info.mass,
                    disAct: true,
                    type: info.type,
                    buf: info.buf,
                    offset: info.offset,
                })
                var hand = self.inHand({
                    item: sp,
                })
                self.pyActItem({
                    item: sp,
                    act: false,
                })
                sp.hand = hand
                return hand
            },
            movefun: function(data) {
                var item = data.sp
                var delta = data.delta
                data.left = 280
                data.right = 580
                data.bottom = 40
                data.item = item
                judgeMove(data)
            },
            outfun: function(data) {
                var index = data.index
                var item = data.sp.item
                var shuigang = self.shuigang
                var result = judgeItemCrash({
                    item1: item,
                    item2: shuigang.judgeWater,
                })
                if (result) {
                    item.setPosition(self.convertToNodeSpace(getWorldPos(item)))
                    safeAdd(self, item)
                    item.hand.removeFromParent(true)

                    self.pyActItem({
                        item: item,
                        act: true,
                    })
                    removeMoving(item)
                    self.totalCount++
                        if (self.totalCount == 7) {
                            self.nodebs.say({
                                key: "see_result",
                                force: true,
                            })
                        }
                } else {
                    item.hand.forceBack()
                }
            }
        })
        this.toolbtn = toolbtn
        this.addChild(toolbtn)
        var off = cc.p(130, 120)
        var img = new cc.Sprite(res.img_show_normal)
        img.setPosition(230 + off.x, 380 + off.y)
        safeAdd(self, img)

        var btn = createJudgeBtn({
            normal: res.btn_change_normal,
            select: res.btn_change_select,
            fun: function() {
                img.setTexture(res.img_show_select)
                toolbtn.changeSort([1, 3, 5, 2, 4, 0, 6])
            },
            back: function() {
                img.setTexture(res.img_show_normal)
                toolbtn.changeSort()
            },
        })
        btn.setPosition(70 + off.x, 380 + off.y)
        safeAdd(self, btn)
    },
    initScene: function() {
        var self = this

        var shuigang = createShuiGang()
        shuigang.setPosition(getMiddle(-120, -160))
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

        self.actPys(true)
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
            img: res.see2_conten1, //图片和声音文件
            sound: res.see2_sound1
        })
        addContent({
            people: this.nodebs,
            key: "see_result", //对话标签 之后让人物说话需要用到的参数
            sound: res.see2_sound2,
            img: res.see2_conten2,
        })
    }
})