//@author mu @16/4/27

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("tool")
        loadPlist("leafs")
        loadPlist("yeji")
        loadPlist("yemai")
        loadPlist("yeyuan")
        loadPlist("yepian")
        loadPlist("yejian")
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
            this.nodebs.show()
        }
        if (self.toolbtn) {
            self.toolbtn.show()
        }
    },
    dataControl: {},
    getCurInfo: function() {
        var self = this
        var dataControl = self.dataControl
        var leaf = dataControl.curLeaf
        var index = 0
        if (leaf) {
            index = leaf.index
        }
        if (!dataControl.infoList) {
            dataControl.infoList = []
        }
        if (!dataControl.infoList[index]) {
            var info = {}
            info.index = index
            dataControl.infoList[index] = info
        }
        return dataControl.infoList[index]
    },
    clearCurInfo: function() {
        var self = this
        var dataControl = self.dataControl
        var leaf = dataControl.curLeaf
        var index = 0
        if (leaf) {
            index = leaf.index
        }
        if (!dataControl.infoList) {
            dataControl.infoList = []
        }
        if (dataControl.infoList[index]) {
            var info = {}
            info.index = index
            dataControl.infoList[index] = info
        }
    },
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
        var self = this
        this.dataControl = {}
        var dataControl = this.dataControl
        this.expCtor({
                vis: false,
                settingData: {
                    pos: cc.p(1080, 580),
                    biaogeFun: function() {
                        if (!self.biaoge) {
                            var bg = createBiaoge({
                                json: res.do_bg,
                                inputNum: 1,
                                scale: 0.8,
                                downData: {
                                    nums: 1,
                                    bufs: [
                                        ["#bg_03.png", "#bg_05.png", "#bg_06.png", "#bg_07.png"],
                                    ],
                                },
                                CloseFun: function() {
                                    if (self.selector && self.selector.isShow) {
                                        self.selector.show()
                                    }
                                }
                            })
                            var list = [
                                "string1",
                                "btn1",
                                "btn2",
                                "btn3",
                                "btn4",
                                "btn5",
                            ]
                            var allList = []
                            for (var i = 0; i < 5; i++) {
                                allList[i] = []
                            }
                            var allNums = [
                                [4, 4, 4],
                                [5, 5, 6],
                                [6, 5],
                                [3, 3],
                                [4, 4, 4]
                            ]
                            for (var i = 0; i < 12; i++) {
                                allList[0][i] = sprintf("#yy_%02d.png", i + 1)
                            }
                            for (var i = 0; i < 16; i++) {
                                allList[1][i] = sprintf("#yp_%02d.png", i + 1)
                            }
                            for (var i = 0; i < 11; i++) {
                                allList[2][i] = sprintf("#yj_%02d.png", i + 1)
                            }
                            for (var i = 0; i < 6; i++) {
                                allList[3][i] = sprintf("#ym_%02d.png", i + 1)
                            }
                            for (var i = 0; i < 12; i++) {
                                allList[4][i] = sprintf("#yjian_%02d.png", i + 1)
                            }
                            var allSize = [
                                cc.size(550, 450),
                                cc.size(580, 470),
                                cc.size(580, 400),
                                cc.size(500, 420),
                                cc.size(550, 460),
                            ]
                            var allModify = [
                                cc.p(20, 5),
                                cc.p(10, 0),
                                cc.p(10, 0),
                                cc.p(25, 0),
                                cc.p(25, 0),
                            ]
                            loadList(bg, list)
                            var btnlist = []
                            for (var i = 0; i < 5; i++) {
                                var btn = bg[sprintf("btn%d", i + 1)]
                                btnlist[i] = btn
                                btn.index = i
                                btn.setTex = function(tex) {
                                    var btn = this
                                    btn.setVisible(false)
                                    if (btn.selector) {
                                        var sel = btn.selector
                                        if (sel.isShow) {
                                            sel.show()
                                        }
                                    }
                                    if (btn.link) {
                                        btn.link.removeListen()
                                        btn.link.removeFromParent(true)
                                    }
                                    btn.tex = tex
                                    btn.link = new cc.Sprite(tex)
                                    switch (btn.index) {
                                        case 3:
                                            btn.link.setScale(0.8)
                                            break
                                    }
                                    btn.link.setPosition(btn.getPosition())
                                    safeAdd(btn.getParent(), btn.link)
                                    btn.link.setVisible(true)
                                    createTouchEvent({
                                        item: btn.link,
                                        begin: function() {
                                            if (btn.selector) {
                                                btn.selector.show()
                                            }
                                            return true
                                        }
                                    })
                                    var info = self.getCurInfo()
                                    if (!info.btns) {
                                        info.btns = []
                                    }
                                    info.btns[btn.index] = tex
                                }
                                btn.reSet = function() {
                                    var btn = this
                                    if (btn.link) {
                                        btn.link.removeListen()
                                        btn.link.removeFromParent(true)
                                        btn.link = null
                                    }
                                    btn.setVisible(true)
                                }
                                btn.addClickEventListener(function(btn) {
                                    if (!btn.selector) {
                                        var selector = createSelector({
                                            //bg: new cc.Scale9Sprite("bg_08.png", cc.rect(0, 0, 82, 90), cc.rect(20, 20, 40, 40)),
                                            bg: new cc.Scale9Sprite(res.biaoge_back, cc.rect(0, 0, 82, 90), cc.rect(20, 20, 40, 40)),
                                            list: allList[btn.index],
                                            numLines: allNums[btn.index],
                                            size: allSize[btn.index],
                                            border: cc.p(30, 20),
                                            closeModify: cc.p(0, -10),
                                            posModify: allModify[btn.index],
                                            selectFun: function(data) {
                                                var tex = data.tex
                                                btn.setTex(tex)
                                            }
                                        })
                                        btn.selector = selector
                                    }
                                    var selector = btn.selector

                                    var past = self.selector
                                    if (past && past != selector && past.isShow) {
                                        past.show()
                                    }
                                    self.selector = selector
                                    safeAdd(self, selector)
                                    selector.show()
                                })
                            }
                            bg.setClear(function() {
                                bg.string1.setString("")
                                for (var i = 0; i < btnlist.length; i++) {
                                    var btn = btnlist[i]
                                    if (btn.link) {
                                        btn.link.removeFromParent(true)
                                        btn.link = null
                                    }
                                    btn.setVisible(true)
                                }
                                self.clearCurInfo()
                            })
                            var fontList = [
                                "枫叶一",
                                "枫叶二",
                                "银杏叶一",
                                "银杏叶二",
                                "棉花叶",
                                "厚叶榕叶",
                                "松树叶",
                                "杨树叶",
                                "小叶榄仁叶",
                                "竹叶",
                                "桑叶",
                                "芋叶",
                                "番薯叶",
                                "紫荆叶",
                                "丝瓜叶",
                                "罗汉松叶",
                                "柳叶",
                                "肯式蒲桃叶",
                                "福木叶",
                                "刺蓼叶",
                                "雷公叶",
                                "黄栌叶",
                            ]
                            var down = bg.down1.down
                            var input = bg.input1
                            input.myCallBack = function() {
                                var input = this
                                var info = self.getCurInfo()
                                info.input = input.getStr()
                                    //cc.log("get input")
                            }
                            down.myCallBack = function() {
                                var info = self.getCurInfo()
                                info.down = {
                                        src: down.src,
                                        key: down.key,
                                        noBack: true,
                                        noShow: true,
                                    }
                                    //cc.log("get down")
                            }

                            bg.changeData = function() {
                                var info = self.getCurInfo()
                                var index = info.index
                                    //cc.log("curindex", info.index)
                                if (index == 0) {
                                    bg.string1.setString("")
                                } else {
                                    bg.string1.setString(fontList[index - 2])
                                }
                                if (info.down) {
                                    cc.log("has down")
                                    //down.set(info.down)
                                } else {
                                    cc.log("not clear")
                                    down.clear()
                                }
                                if (info.input) {
                                    input.setStr(info.input)
                                } else {
                                    input.setStr("")
                                }
                                if (info.btns) {
                                    for (var i = 0; i < btnlist.length; i++) {
                                        if (info.btns[i]) {
                                            btnlist[i].setTex(info.btns[i])
                                        } else {
                                            btnlist[i].reSet()
                                        }
                                    }
                                } else {
                                    for (var i = 0; i < btnlist.length; i++) {
                                        btnlist[i].reSet()
                                    }
                                }
                            }
                            self.biaoge = bg
                            safeAdd(self, bg)
                        }
                        var bg = self.biaoge
                        var leaf = self.dataControl.curLeaf
                        if (leaf) {
                            bg.changeData(leaf.index - 1)
                        } else {
                            bg.changeData(0)
                        }
                        bg.show()
                    },
                }
            }) //实验模板

        dataControl.drawIndexList = []
        dataControl.penPos = cc.p(getMiddle(300, 0))
        dataControl.drawing = false
        self.initPeople() //创建人物
        self.createTool()
        return true
    },
    judgeIndex: function(index) {
        var self = this
        var dataControl = self.dataControl
        if (dataControl.drawIndexList) {
            var indexList = dataControl.drawIndexList
            for (var i = 0; i < indexList.length; i++) {
                if (indexList[i] == index) {
                    return false
                }
            }
        }
        return true
    },
    allReAdd: function() {
        var self = this
        var dataControl = self.dataControl
        if (dataControl.page) {
            reAdd(dataControl.page)
        }
        if (dataControl.curLeaf) {
            reAdd(dataControl.curLeaf)
        }
        if (dataControl.pen) {
            reAdd(dataControl.pen)
        }
    },
    createTool: function() {
        var self = this
        var dataControl = self.dataControl
        var fileList = []
        for (var i = 0; i < 24; i++) {
            fileList[i] = sprintf("tool_%02d.png", i + 1)
        }
        var drawLink = function(data) {
            var list = data.list
            var speed = data.speed || 0.01
            var node = new cc.DrawNode()
            var key = data.key
            var num = data.num || 5
            var time = data.time || 0.1
            var index = data.index
            node.list = list
            node.curIndex = 0
            dataControl.drawing = true
            addTimer({
                fun: function() {
                    var pen = null
                    if (dataControl.pen) {
                        pen = dataControl.pen
                    }
                    for (var i = 0; i < num; i++) {
                        if (node.curIndex < node.list.length) {
                            var indata = node.list[node.curIndex]
                            var pos = cc.p(indata[0], indata[1])
                            node.drawDot(pos, 1.0, cc.color(255, 0, 0, 255))
                            node.curIndex++
                                if (pen) {
                                    pen.setPosition(node.convertToWorldSpace(pos))
                                }
                        } else {
                            dataControl.drawIndexList[dataControl.drawIndexList.length] = index
                            if (pen) {
                                var pos = dataControl.page.getPosition()
                                pen.setPosition(pos.x + 230, pos.y + 90)
                            }
                            dataControl.drawing = false
                            removeTimer(key)
                        }
                    }
                },
                time: time,
                repeat: cc.REPEAT_FOREVER,
                key: key
            })

            return node
        }

        var toolbtn = createTool({
            pos: cc.p(70, 480),
            nums: 4,
            tri: "right",
            showTime: 0.3,
            //itempos: [cc.p(0, -10), cc.p(0, -10), cc.p(0, -8), cc.p(0, -8)],
            itemScale: 0.8,
            circlepos: cc.p(0, 15),
            devide: cc.p(1, 1.1),
            moveTime: 0.2,
            father: self,
            ifcircle: true,
            circleScale: 0.7,
            files: fileList,
            ifFrame: true,
            gets: [null],
            judge: function() {
                if (dataControl.drawing) {
                    self.showAlarm("stop")
                    return false
                }
                return true
            },
            clickfun: function(data) {
                var index = data.index
                var sp = data.sp
                var pos = data.pos
                if (dataControl.drawing) {
                    return false
                }
                switch (index) {
                    case 0:
                        sp.stopAllActions()
                        sp.setScale(0.2)
                        sp.hasItem = false
                        break
                }
                return true
            },
            firstClick: function(data) {
                var index = data.index
                var sp = data.sp
                var pos = data.pos
                switch (index) {
                    case 0: //纸
                        sp = createPaper({
                            width: 130,
                            rate: 2.8,
                            seg: 0.3,
                            changeFun: function() {
                                if (dataControl.curLeaf && dataControl.page && dataControl.page.hasItem) {
                                    dataControl.page.hasItem = false
                                    dataControl.curLeaf.forceBack()
                                    dataControl.curLeaf = null
                                }
                            },
                            judgeChange: function() {
                                var page = dataControl.page
                                return !dataControl.drawing
                            }
                        })
                        sp.setScale(0.2)
                        sp.setLocalZOrder(0)
                        dataControl.page = sp
                        break
                    case 1: //笔
                        sp = new cc.Sprite(res.pen)
                        sp.setScale(0.5)
                        sp.setAnchorPoint(0, 0)
                        sp.setLocalZOrder(2)
                        dataControl.pen = sp
                        break
                    default:
                        sp = new cc.Sprite(sprintf("#ye_%02d.png", index - 1))
                        sp.setLocalZOrder(1)
                        if (index == 13 || index == 19) {
                            sp.setScale(0.6)
                        } else {
                            sp.setScale(0.8)
                        }
                        if (dataControl.curLeaf) {
                            dataControl.curLeaf.forceBack()
                            if (dataControl.page) {
                                dataControl.page.hasItem = false
                            }
                            dataControl.curLeaf = null
                        }
                        dataControl.curLeaf = sp
                        sp.index = index
                        if (self.biaoge) {
                            self.biaoge.changeData()
                        }
                        break
                }
                return sp
            },
            outfun: function(data) {
                var sp = data.sp
                var pos = data.pos
                var index = data.index
                switch (index) {
                    case 0:
                        sp.setPosition(getMiddle(0, -100))
                        sp.x = pos.x
                        addShowType({
                            item: sp,
                            show: "scale",
                            time: 0.3,
                        })
                        break
                    case 1:
                        if (dataControl.page && dataControl.page.hasItem) {
                            var page = dataControl.page
                            var result = judgeInside({
                                item: page,
                                pos: pos,
                            })
                            if (result) {
                                if (page.judgeItem()) {
                                    self.showAlarm("drawed")
                                } else {
                                    var key = sprintf("item%d", page.curDrawIndex)
                                    var node = drawLink({
                                        list: posList[key],
                                        key: key,
                                        num: 15,
                                        time: 0.05,
                                        index: page.curDrawIndex,
                                    })
                                    var leaf = dataControl.curLeaf
                                    var scale = leaf.getScale()
                                    node.setScale(scale)
                                    var final = page.convertToNodeSpace(dataControl.curLeaf.getPosition())
                                    final = cc.p(final.x - leaf.width / 2 * scale, final.y - leaf.height / 2 * scale)
                                    node.setPosition(final)
                                    page.addItem(node)
                                }
                                //node.setPosition(getMiddle())
                                //safeAdd(self, node)
                            }
                        }
                        break
                    default:
                        if (dataControl.page) {
                            var page = dataControl.page
                            if (page.judgeItem()) {
                                page.hasItem = false
                                if (judgeItemCrash({
                                        item1: sp,
                                        item2: page,
                                    })) {
                                    if (self.judgeIndex(index - 1)) {
                                        self.showAlarm("new")
                                    } else {
                                        self.showAlarm("drawed")
                                    }
                                }
                            } else {
                                var result = judgeInside({
                                    item: page,
                                    pos: pos,
                                })
                                if (result) {
                                    if (self.judgeIndex(index - 1)) {
                                        sp.setPosition(page.convertToWorldSpace(cc.p(page.width / 2, page.height / 2 + 10)))
                                        page.curDrawIndex = index - 1
                                    } else {
                                        result = false
                                        self.showAlarm("drawed")
                                    }
                                }
                                page.hasItem = result
                            }
                        }
                        break
                }
                self.allReAdd()
            },
            // beginfail: function(data) {
            //     var item = data.sp
            //     var pos = data.pos
            //     var index = data.index
            //     switch (index) {
            //         case indexList.MuBang:
            //         case indexList.TieBang:
            //         case indexList.ShuLiaoBang:
            //             pos = item.convertToNodeSpace(pos)
            //             var result = item.judgePos(pos)
            //             if (result) {
            //                 var tempfun = function(line) {
            //                     line.backS()
            //                     line.showHelp(false)
            //                 }
            //                 tempfun(item)
            //                 item.linkFun(function(data) {
            //                     tempfun(data.item)
            //                 })
            //             }
            //             return result
            //             break
            //     }
            //     return false
            // },
            // movefun: function(data) {
            //     var sp = data.sp
            //     var pos = data.pos
            //     var delta = data.delta
            //     var index = data.index
            //     switch (index) {
            //         case indexList.MuBang:
            //         case indexList.TieBang:
            //         case indexList.ShuLiaoBang:
            //             delta.y = 0
            //             scaleMove({
            //                 item: sp,
            //                 delta: delta,
            //                 xmin: -270,
            //                 xmax: 230,
            //             })
            //             sp.linkFun(function(data) {
            //                 var item = data.item
            //                 item.x = sp.x
            //                 item.y = sp.y
            //             })
            //             break
            //         case indexList.GouMa:
            //             scaleMove({
            //                 item: sp,
            //                 delta: delta,
            //             })
            //             sp.linkFun(function(data) {
            //                 var item = data.item
            //                 item.x = sp.x
            //                 item.y = sp.y
            //             })
            //             break
            //     }
            //     return true
            // },
            backfun: function(data) {
                var sp = data.sp
                var pos = data.pos
                var index = data.index
                switch (index) {
                    case 0:
                        sp.setPosition(getMiddle(0, -100))
                        addShowType({
                            item: sp,
                            show: "scale",
                            time: 0.3,
                        })
                        return false
                        break
                    case 1:
                        dataControl.pen = null
                        break
                    default:
                        dataControl.curLeaf = null
                        if (self.biaoge) {
                            self.biaoge.changeData()
                        }
                        break
                }
                return true
            }
        })
        this.toolbtn = toolbtn
        this.addChild(toolbtn)
    },
    showAlarm: function(key) {
        var self = this
        switch (key) {
            case "drawed":
                self.nodebs.say({
                    key: "tip2",
                    force: true,
                })
                break
            case "new":
                self.nodebs.say({
                    key: "tip1",
                    force: true,
                })
                break
            case "stop":
                self.nodebs.say({
                    key: "tip3",
                    force: true,
                })
                break
        }
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        for (var i = 0; i < 3; i++) {
            var key = sprintf("tip%d", i + 1)
            var sound = sprintf("tip%d_sound", i + 1)
            addContent({
                people: this.nodebs,
                key: key, //对话标签 之后让人物说话需要用到的参数
                img: res[key], //图片和声音文件
                sound: res[sound]
            })
        }
    }
})