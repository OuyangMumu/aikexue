//@author mu @16/5/19

var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        var self = this
        self.initPageBtns([{
            btn: [res.btn1_normal, res.btn1_select, res.btn1_act],
            pics: [
                function() {
                    var uilist = [
                        "btn_result",
                        "judge1",
                        "judge2"
                    ]
                    var bg = loadNode(res.learn_bg, uilist, "bg")
                    bg.btn_result.addClickEventListener(function() {
                        if (!bg.showImg) {
                            var show = createShowImg({
                                img: res.learn_result,
                                outFun: function() {
                                    if (bg.showImg) {
                                        bg.showImg.setPosition(bg.convertToNodeSpace(getMiddle()))
                                    }
                                }
                            })
                            bg.showImg = show
                            safeAdd(bg, show)
                            show.setPosition(bg.convertToNodeSpace(getMiddle()))
                        }
                        bg.showImg.show()
                    })
                    var judgeItem = function(data) {
                        var judge = this
                        var pos = data.pos
                        var item = data.item
                        var result = judgeInside({
                            item: judge,
                            pos: pos,
                        })
                        if (!result) {
                            return false
                        }
                        var index = data.index
                        if (!judge.list) {
                            judge.list = []
                        }
                        if (result) {
                            item.father = judge
                            judge.list.push(item)
                            judge.sort()
                            return true
                        }
                    }
                    var sort = function() {
                        var judge = this
                        if (judge.list) {
                            var count = 0
                            var list = judge.list
                            var start = cc.p(55, 110)
                            var devidex = 110
                            var devidey = 40
                            var nums = 2
                            for (var i = 0; i < list.length; i++) {
                                if (list[i]) {
                                    var item = list[i]
                                    item.setScale(1)
                                    item.bg.setVisible(false)
                                    item.setAnchorPoint(0.5, 0.5)
                                    list[i].setPosition(cc.p(start.x + count % nums * devidex, start.y - Math.floor(count / nums) * devidey))
                                    safeAdd(judge, item)
                                    count++
                                }
                            }
                        } else {
                            return
                        }
                    }
                    var del = function(item) {
                        var judge = this
                        if (judge.list) {
                            var list = judge.list
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].index == item.index) {
                                    list.splice(i, 1)
                                    judge.sort()
                                    return
                                }
                            }
                        }
                    }
                    bg.judge1.judgeItem = judgeItem
                    bg.judge2.judgeItem = judgeItem
                    bg.judge1.sort = sort
                    bg.judge2.sort = sort
                    bg.judge1.del = del
                    bg.judge2.del = del
                    var judgeAll = function(data) {
                        var pos = data.pos
                        var item = data.item
                        var index = data.index
                        var judgeList = [
                            bg.judge1,
                            bg.judge2
                        ]
                        var temp = false
                        for (var i = 0; i < judgeList.length; i++) {
                            var result = judgeList[i].judgeItem({
                                pos: pos,
                                item: item,
                                index: item.judgeIndex,
                            })
                            if (result) {
                                temp = true
                                createTouchEvent({
                                    item: item.sp,
                                    move:function(data){
                                        var item = data.item.getParent()
                                        var delta = data.delta
                                        item.x += delta.x
                                        item.y += delta.y
                                    },
                                    begin: function(data) {
                                        var item = data.item.getParent()
                                        item.bg.setVisible(true)
                                        var pos = data.pos
                                        if (item.father) {
                                            item.father.del(item)
                                        }
                                        item.setPosition(bg.convertToNodeSpace(pos))
                                        safeAdd(bg, item)
                                        return true
                                    },
                                    end: function(data) {
                                        var item = data.item.getParent()
                                        var pos = data.pos
                                        judgeAll({
                                            item: item,
                                            pos: pos,
                                            index: item.index,
                                        })
                                    }
                                })
                                break
                            }
                        }
                        if (!temp) {
                            if (bg.showList) {
                                bg.showList.judgeIndex(index, false)
                                item.removeFromParent(true)
                            }
                        }
                    }
                    var showList = createList({
                        scale: 1,
                        noBg: true,
                        noArrow: true,
                        list: [
                            res.item1,
                            res.item2,
                            res.item3,
                            res.item4,
                            res.item5,
                        ],
                        pos: cc.p(820, 200),
                        num: 5,
                        disTri: true,
                        size: cc.size(150, 350),
                        initFun: function(tex) {
                            var item = new cc.Sprite(res.item0)
                            var initem = new cc.Sprite(tex)
                            initem.setPosition(item.getContentSize().width / 2, item.getContentSize().height / 2)
                            safeAdd(item, initem)
                            return item
                        },
                        getFun: function(data) {
                            var index = data.index
                            var pos = data.pos
                            var tex = data.tex
                            var node = new cc.Node()
                            var item = new cc.Sprite(res.item0)
                            var sp = new cc.Sprite(tex)
                            //sp.setPosition(item.getContentSize().width / 2, item.getContentSize().height / 2)
                            node.setPosition(bg.convertToNodeSpace(pos))
                            safeAdd(node, item)
                            safeAdd(node, sp)
                            node.index = index
                            node.bg = item
                            node.sp = sp
                            safeAdd(bg, node)
                            return node
                        },
                        outFun: function(data) {
                            var item = data.item
                            var pos = data.pos
                            var index = data.index
                            judgeAll({
                                item: item,
                                pos: pos,
                                index: index,
                            })
                        }
                    })
                    bg.showList = showList
                    bg.addChild(showList)

                    return bg
                },
                res.learn1_img2,
            ],
            posOff: [
                cc.p(0, 10),
                cc.p(0, 10),
            ],
        }, {
            btn: [res.btn2_normal, res.btn2_select, res.btn2_act],
            pics: [
                res.learn2_img1,
            ],
        }])
        return true
    },
    dataControl: {},
})