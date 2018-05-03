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
        var self = this
        if (this.nodebs) {
            this.nodebs.show(function() {
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: "do1"
                })
            })
        }
        if (self.toolbtn) {
            self.toolbtn.show()
        }
    },
    createTool: function() {
        var self = this
        var outJudge = function(item) {
            var index = item.index
            if (index == 1 && self.xwj && self.xwj.addItem({
                    item: item,
                    pos: cc.p(27, 24.5),
                    scale: 1,
                })) {
                removeMoving(item)
                self.nodebs.say({
                    key: "do4",
                    force: true,
                })
                if (self.curBs) {
                    switch (self.curBs) {
                        case "db":
                            self.xwj.setFile({
                                tex: res.img_small
                            })
                            break
                        case "gb":
                            self.xwj.setFile({
                                tex: res.img_big
                            })
                            break
                    }
                }
                self.hasItem = true
            } else {
                var pos = item.getPosition()
                var final = item.final
                var dis = getDis(pos, final)
                var time = dis / 1000
                if (index != 1) {
                    removeMoving(item)
                }
                addShowType({
                    item: item,
                    show: "moveTo",
                    time: time,
                    buf: final,
                    fun: function(item) {
                        if (item.index == 0) {
                            item.showHand(false)
                            self.nodebs.say({
                                key: "do2",
                                force: true,
                            })
                            var see = item.getSee({
                                pos: getMiddle(-130, -100),
                                scale: 0.7,
                            })
                            safeAdd(self, see)
                        }
                    }
                })
            }
        }
        var toolbtn = createTool({
            pos: cc.p(70, 460),
            nums: 2,
            tri: "right",
            showTime: 0.3,
            itempos: [cc.p(0, 0), cc.p(0, -11)],
            circlepos: cc.p(0, 25),
            devide: cc.p(1.0, 1.3),
            moveTime: 0.2,
            father: self,
            ifcircle: true,
            circleScale: 0.7,
            //fileAnchor: cc.p(0.5, 0),
            itemScale: 0.8,
            files: [res.img_tool1, res.img_tool2],
            gets: [null, null],
            judge: function(index) {
                if (index && !self.canBp) {
                    return false
                }
                return true
            },
            firstClick: function(data) {
                var index = data.index
                var sp = null
                switch (index) {
                    case 0:
                        sp = createXwj({
                            fgjFun: function() {
                                self.nodebs.say({
                                    key: "do3",
                                    force: true,
                                })
                                self.canBp = true
                            },
                            ypjFun: function() {
                                self.nodebs.say({
                                    key: "do5",
                                    force: true,
                                })
                            },
                            zhqFun: function(key) {
                                if (self.hasItem) {
                                    switch (key) {
                                        case "db":
                                            self.xwj.setFile({
                                                tex: res.img_small
                                            })
                                            self.xwj.setMax(27)
                                            break
                                        case "gb":
                                            self.xwj.setFile({
                                                tex: res.img_big
                                            })
                                            self.xwj.setMax(40)
                                            break
                                    }
                                }
                                self.curBs = key
                            }
                        })
                        self.xwj = sp
                        sp.final = getMiddle(250, -100)
                        break
                    case 1:
                        sp = new cc.Sprite(res.img_bp)
                        sp.final = getMiddle(50, -250)
                        break
                }
                return sp
            },
            // clickfun: function(data) {
            //     var item = data.sp
            //     item.setRotation(0)
            //     self.pyActItem({
            //         item: item,
            //         act: false,
            //     })
            //     if (self.hand) {
            //         self.hand.setVisible(false)
            //     }
            //     if (self.forceNode) {
            //         self.forceNode.setVisible(false)
            //     }
            //     if (self.btn_judge) {
            //         self.btn_judge.change(false, true)
            //     }
            //     return true
            // },
            // movefun: function(data) {
            //     var item = data.sp
            //     var delta = data.delta
            //     data.item = item
            //         //data.show = true
            //     data.left = 400
            //     data.right = 736
            //     data.bottom = 116
            //     judgeMove(data)
            //     item.hasMove = true
            // },
            outfun: function(data) {
                var index = data.index
                var item = data.sp
                outJudge(item)
            },
            backfun: function(data) {
                var index = data.index
                var item = data.sp
                outJudge(item)
                return false
            }
        })
        this.toolbtn = toolbtn
        this.addChild(toolbtn)
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
                        if (!self.biaoge) {
                            var bg = createBiaoge({
                                json: res.xwj_bg,
                            })
                            self.biaoge = bg
                            bg.setLocalZOrder(9999)
                            safeAdd(self, bg)
                            var judgeList = [
                                "judge1",
                                "judge2",
                                "judge3",
                            ]
                            loadList(bg, judgeList)
                            var itemList = [
                                "item_chose1",
                                "item_chose2",
                                "item_chose3",
                            ]
                            loadList(bg, itemList)
                            var packJudge = function(data) {
                                var judgeList = data.judgeList
                                var itemList = data.itemList
                                var addItem = function(data) {
                                    var item = data.item
                                    var disJudge = data.disJudge || false
                                    var pos = data.pos
                                    var judge = this
                                    var size = judge.getContentSize()
                                    if (disJudge) {
                                        item.setPosition(size.width / 2, size.height / 2)
                                        item.father = judge
                                        judge.item = item
                                        safeAdd(judge, item)
                                    } else {
                                        var finalPos = judge.convertToNodeSpace(pos)
                                        var inrect = cc.rect(0, 0, size.width, size.height)
                                            // var result = judgeItemCrash({
                                            //     item1: item,
                                            //     item2: judge,
                                            // })
                                        var result = cc.rectContainsPoint(inrect, finalPos)
                                        if (result) {
                                            if (judge.item) {
                                                if (item.father) {
                                                    //内部存在并且传入对象之前也存在父节点
                                                    var item1 = item
                                                    var father1 = judge
                                                    var item2 = judge.item
                                                    var father2 = item.father
                                                    father1.addItem({
                                                        item: item1,
                                                        disJudge: true,
                                                    })
                                                    father2.addItem({
                                                        item: item2,
                                                        disJudge: true,
                                                    })
                                                    cc.log("fuck me")
                                                } else {
                                                    //内部存在并且传入对象无父节点
                                                    var item1 = item
                                                    var father1 = judge
                                                    var item2 = judge.item
                                                    father1.addItem({
                                                        item: item1,
                                                        disJudge: true
                                                    })
                                                    item2.back()
                                                }
                                            } else { //内部不存在
                                                if (item.father) {
                                                    item.father.item = null
                                                }
                                                judge.addItem({
                                                    item: item,
                                                    disJudge: true
                                                })
                                            }
                                            // if (pos) {
                                            //     item.setPosition(pos)
                                            // } else {
                                            //     item.setPosition(size.width / 2, size.height / 2)
                                            // }
                                        }
                                        return result
                                    }
                                }
                                var clear = function() {
                                    var judge = this
                                    var item = judge.item
                                    judge.item = null
                                }
                                for (var i = 0; i < judgeList.length; i++) {
                                    var judge = judgeList[i]
                                    judge.addItem = addItem
                                    judge.clear = clear
                                }
                                var judgeAll = function(data) {
                                    var judgeBack = true
                                    var item = data.item
                                    var pos = data.pos
                                    for (var i = 0; i < judgeList.length; i++) {
                                        var judge = judgeList[i]
                                        var result = judge.addItem({
                                            item: item,
                                            pos: pos,
                                        })
                                        if (result) {
                                            judgeBack = false
                                            break
                                        }
                                    }
                                    if (judgeBack) {
                                        item.back()
                                    }
                                }
                                var packItem = function(item) {
                                    item.rootPos = item.getPosition()
                                    item.rootFather = item.getParent()
                                    item.back = function() {
                                        var item = this
                                        item.father = null
                                        item.setPosition(item.rootPos)
                                        safeAdd(item.rootFather, item)
                                    }
                                    createTouchEvent({
                                        item: item,
                                        begin: function(data) {
                                            var item = data.item
                                            if (item.father) {
                                                item.father.clear()
                                            }
                                            return true
                                        },
                                        autoMove: true,
                                        end: function(data) {
                                            judgeAll({
                                                item: data.item,
                                                pos: data.pos,
                                            })
                                        }
                                    })
                                }
                                for (var i = 0; i < itemList.length; i++) {
                                    var item = itemList[i]
                                    packItem(item)
                                }
                            }
                            var inJudgeList = []
                            for (var i = 0; i < judgeList.length; i++) {
                                inJudgeList[i] = bg[judgeList[i]]
                            }
                            var inItemList = []
                            for (var i = 0; i < itemList.length; i++) {
                                inItemList[i] = bg[itemList[i]]
                            }
                            for (var i = 0; i < inItemList.length; i++) {
                                var item = inItemList[i]
                                item.setLocalZOrder(2)
                                reAdd(item)
                                var temp = new cc.Sprite(item.getSpriteFrame())
                                temp.setPosition(item.getPosition())
                                temp.setAnchorPoint(item.getAnchorPoint())
                                safeAdd(item.getParent(), temp)
                                temp.setOpacity(127)
                            }
                            packJudge({
                                judgeList: inJudgeList,
                                itemList: inItemList,
                            })
                            bg.upLoadFun = function() {
                                var final = [bg.item_chose2, bg.item_chose1, bg.item_chose3]
                                var count = inJudgeList.length
                                for (var i = 0; i < inJudgeList.length; i++) {
                                    var judge = inJudgeList[i]
                                    if (judge && judge.item && judge.item == final[i]) {
                                        count--
                                    }
                                }
                                if (!self.hasShow) {
                                    self.hasShow = true
                                    AddDialog("Judge", {
                                        judge: count == 0,
                                        fun: function() {
                                            self.hasShow = false
                                        },
                                        sound: "student",
                                    })
                                }
                            }
                            bg.ClearFun = function() {
                                for (var i = 0; i < inJudgeList.length; i++) {
                                    inJudgeList[i].clear()
                                }
                                for (var i = 0; i < inItemList.length; i++) {
                                    inItemList[i].back()
                                }
                            }
                        }
                        self.biaoge.show()
                    },
                }
            }) //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        self.createTool()
        return true
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        for (var i = 0; i < 5; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("do%d", i + 1), //对话标签 之后让人物说话需要用到的参数
                img: res[sprintf("do_content%d", i + 1)], //图片和声音文件
                sound: res[sprintf("do_sound%d", i + 1)]
            })
        }
    }
})