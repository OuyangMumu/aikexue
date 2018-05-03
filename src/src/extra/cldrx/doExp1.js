//@author mu @16/4/27
var cmPix = 6.5

var CLDRX_orderList = {
    TABLE: 0,
    BANG: 1,
    BLOCK: 2,
    RULER: 3,
    GOUMA: 4,
}

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {},
    getLinePos: function(data) {
        var self = this
        var xbegin = data.xbegin || 0
        var xend = data.xend || 1136
        var a = data.a
        var b = data.b
        var c = data.c
        var allCount = data.allCount
        var start = data.start || 0
        var list = []
        var pasti = 0
        var pastj = 0
        for (var i = xbegin, j = xbegin, count = 0; count <= allCount;) {
            if (count <= start) {
                j += pastj
                var pos = cc.p(j, 0)
                list.push(pos)
                pastj = cmPix
            } else {
                i += pasti
                var pos = cc.p(i + j, -(a * i * i + b * i + c) + 1)
                list.push(pos)
                var k = 2 * a * i + b
                var r = Math.atan(k) / Math.PI * 180
                pasti = cmPix * Math.cos(r / 180 * Math.PI)
            }
            count++
        }

        return list
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
        if (self.toolbtn) {
            self.toolbtn.show()
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
                        if (!self.biaoge) {
                            var bg = createBiaoge({
                                json: res.cldrx_do,
                                inputNum: 9,
                                scale: 0.7,
                                rootColor: [
                                    cc.color(255, 0, 0, 255),
                                    cc.color(255, 0, 0, 255),
                                    cc.color(255, 0, 0, 255),
                                    cc.color(255, 0, 0, 255),
                                    cc.color(255, 0, 0, 255),
                                    cc.color(255, 0, 0, 255),
                                    cc.color(255, 0, 0, 255),
                                    cc.color(255, 0, 0, 255),
                                    cc.color(255, 0, 0, 255),
                                ],
                            })
                            self.addChild(bg)
                            self.biaoge = bg
                        }
                        var bg = self.biaoge
                        bg.show()
                    },
                }
            }) //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initScene()
        self.createTool()
        self.initPeople() //创建人物
        return true
    },
    judgeAll: function(item) {
        var self = this
        var dataControl = self.dataControl
        var bangList = dataControl.bangList
        for (var i = 0; i < bangList.length; i++) {
            if (bangList[i]) {
                if (bangList[i].judgeGouMa(item)) {
                    return true
                }
            }
        }
        return false
    },
    resetGouma: function() {
        var self = this
        var dataControl = self.dataControl
        var gouma = dataControl.gouma
        if (gouma) {
            self.fdj.runData({
                key: "gouma",
                fun: function(data) {
                    var item = data.item
                    var all = data.all
                    item.setScale(item.rootScale)
                    item.setPosition(150, 80)
                    item.setLocalZOrder(CLDRX_orderList.GOUMA)
                    safeAdd(all, item)
                    item.fatherIndex = null
                }
            })
        }
    },
    clearBang: function() {
        var self = this
        var dataControl = self.dataControl
        for (var i = 0; i < dataControl.bangList.length; i++) {
            if (dataControl.bangList[i]) {
                self.fdj.deleteInside(sprintf("line%d", i))
                var item = dataControl.bangList[i]
                if (item.isGouma) {
                    dataControl.gouma.forceBack()
                    self.fdj.deleteInside("gouma")
                    dataControl.gouma = null
                        //self.resetGouma()
                    item.isGouma = false
                }
                item.forceBack()
                dataControl.bangList[i] = null
            }
        }
    },
    createTool: function() {
        var self = this
        var dataControl = self.dataControl
        var indexList = {
            MuBang: 0,
            TieBang: 1,
            ShuLiaoBang: 2,
            GouMa: 3,
        }
        var toolbtn = createTool({
            pos: cc.p(70, 480),
            nums: 4,
            tri: "down",
            showTime: 0.3,
            itempos: [cc.p(0, -10), cc.p(0, -10), cc.p(0, -8), cc.p(0, -8)],
            circlepos: cc.p(0, 10),
            devide: cc.p(1, 1.1),
            moveTime: 0.2,
            father: self,
            ifcircle: true,
            circleScale: 0.7,
            itemScale: [0.8, 0.8, 0.8, 0.8],
            files: [res.cldrx_tool1, res.cldrx_tool2, res.cldrx_tool3, res.cldrx_tool4],
            gets: [null, null, null, null],
            // judge: function() {
            //     if (dataControl.firing) {
            //         return false
            //     }
            //     return true
            // },
            clickfun: function(data) {
                var index = data.index
                var sp = data.sp
                var pos = data.pos
                switch (index) {
                    case indexList.MuBang:
                    case indexList.TieBang:
                    case indexList.ShuLiaoBang:
                        self.fdj.runData({
                            key: sprintf("line%d", index),
                            fun: function(data) {
                                var line = data.item
                                line.showHelp(false)
                            }
                        })
                        break
                    case indexList.GouMa:
                        if (sp.fatherIndex !=  null) {
                            var line = dataControl.bangList[sp.fatherIndex]
                            self.fdj.runData({
                                key: sprintf("line%d", sp.fatherIndex),
                                fun: function(data) {
                                    var line = data.item
                                    var all = data.all
                                    line.baoBian.setVisible(false)
                                    line.backS()
                                    if (self.showHelp) {
                                        line.drawHelp(false)
                                        line.showHelp(true)
                                    }
                                    line.isGouma = false
                                }
                            })
                            self.fdj.runData({
                                key: "gouma",
                                fun: function(data) {
                                    var item = data.item
                                    var all = data.all
                                    item.setScale(item.rootScale)
                                    item.setPosition(pos)
                                    item.setLocalZOrder(CLDRX_orderList.GOUMA)
                                    safeAdd(all, item)
                                }
                            })
                            sp.fatherIndex = null
                        }
                        break
                }
                return true
            },
            firstClick: function(data) {
                var index = data.index
                var sp = data.sp
                var pos = data.pos
                switch (index) {
                    case indexList.MuBang:
                    case indexList.TieBang:
                    case indexList.ShuLiaoBang:
                        self.clearBang()
                        var linePos = cc.p(60, 387)
                        sp = self.packLine({
                            index: index,
                            start: linePos,
                            straight: true,
                        })
                        sp.nopos = true
                        sp.judgeGouMa = function(item) {
                            var sp = this
                            var tnode = sp.hxz
                            var left = tnode.left
                            var right = tnode.right
                            var pos = item.getUpPos()
                            var mix = cc.p(6, 1.2)
                            var resultL = judgeInside({
                                item: left,
                                pos: pos,
                                mix: mix,
                            })
                            var resultR = judgeInside({
                                item: right,
                                pos: pos,
                                mix: mix,
                            })
                            var result = (resultL || resultR)
                            if (result) {
                                self.fdj.runData({
                                    key: "gouma",
                                    fun: function(data) {
                                        var item = data.item
                                        var all = data.all
                                        item.setPosition(0, -105)
                                        var key = sprintf("line%d", sp.index)
                                        var line = all[key]
                                        line.baoBian.setVisible(true)
                                        var tright = line.hxz.right
                                        item.setScale(item.rootScale / getLoopScale(right) / right.getScale())
                                        safeAdd(tright, item)
                                        item.fatherIndex = sp.index
                                        sp.isGouma = true
                                        line.changeLine()
                                    }
                                })
                            }
                            return result
                        }
                        dataControl.bangList[index] = sp
                        break
                    case indexList.GouMa:
                        sp = self.getGouma(pos)
                        dataControl.gouma = sp
                        sp.nopos = true
                        break
                }
                return sp
            },
            outfun: function(data) {
                var sp = data.sp
                var pos = data.pos
                var index = data.index
                switch (index) {
                    case indexList.MuBang:
                    case indexList.TieBang:
                    case indexList.ShuLiaoBang:
                        var tempfun = null
                        if (sp.isGouma) {
                            tempfun = function(line) {
                                line.changeLine()
                            }
                            tempfun(sp)
                        } else {
                            tempfun = function(sp) {
                                sp.backS()
                            }
                        }
                        if (tempfun) {
                            tempfun(sp)
                            sp.linkFun(function(data) {
                                tempfun(data.item)
                            })
                        }
                        break
                    case indexList.GouMa:
                        self.judgeAll(sp)
                        break
                }
            },
            beginfail: function(data) {
                var item = data.sp
                var pos = data.pos
                var index = data.index
                switch (index) {
                    case indexList.MuBang:
                    case indexList.TieBang:
                    case indexList.ShuLiaoBang:
                        pos = item.convertToNodeSpace(pos)
                        var result = item.judgePos(pos)
                        if (result) {
                            var tempfun = function(line) {
                                line.backS()
                                line.showHelp(false)
                            }
                            tempfun(item)
                            item.linkFun(function(data) {
                                tempfun(data.item)
                            })
                        }
                        return result
                        break
                }
                return false
            },
            movefun: function(data) {
                var sp = data.sp
                var pos = data.pos
                var delta = data.delta
                var index = data.index
                switch (index) {
                    case indexList.MuBang:
                    case indexList.TieBang:
                    case indexList.ShuLiaoBang:
                        delta.y = 0
                        scaleMove({
                            item: sp,
                            delta: delta,
                            xmin: -270,
                            xmax: 230,
                        })
                        sp.linkFun(function(data) {
                            var item = data.item
                            item.x = sp.x
                            item.y = sp.y
                        })
                        break
                    case indexList.GouMa:
                        scaleMove({
                            item: sp,
                            delta: delta,
                        })
                        sp.linkFun(function(data) {
                            var item = data.item
                            item.x = sp.x
                            item.y = sp.y
                        })
                        break
                }
                return true
            },
            backfun: function(data) {
                var sp = data.sp
                var pos = data.pos
                var index = data.index
                switch (index) {
                    case indexList.MuBang:
                    case indexList.TieBang:
                    case indexList.ShuLiaoBang:
                        return false
                            // dataControl.bangList[index] = null
                            // self.fdj.deleteInside(sprintf("line%d", index))
                        break
                    case indexList.GouMa:
                        self.fdj.deleteInside("gouma")
                        dataControl.gouma = null
                        break
                }
                return true
            }
        })
        this.toolbtn = toolbtn
        this.addChild(toolbtn)
    },
    initScene: function() {
        var self = this
        var dataControl = self.dataControl
        dataControl.bangList = []
        self.showHelp = false
        var fdj = createFDJ({
            father: self,
            nums: 2,
            type: [2, 1],
            rootScale: 0.2,
            perscale: 0.05,
            max: 0.4,
            min: 0.1,
            seePos: [cc.p(568, 20), cc.p(940, 215)],
            getPos: [cc.p(160, 210), cc.p(910, 556)],
        })
        self.fdj = fdj
        dataControl.judgeBtn = createJudgeBtn({
            normal: res.cldrx_btn_help_normal,
            select: res.cldrx_btn_help_select,
            pos: cc.p(320, 530),
            father: self,
            fun: function() {
                self.showHelp = true
                if (self.curIndex != null) {
                    fdj.runData({
                        key: sprintf("line%d", self.curIndex),
                        fun: function(data) {
                            var item = data.item
                            item.showHelp(true)
                        }
                    })
                }
            },
            back: function() {
                self.showHelp = false
                if (self.curIndex != null) {
                    fdj.runData({
                        key: sprintf("line%d", self.curIndex),
                        fun: function(data) {
                            var item = data.item
                            item.showHelp(false)
                        }
                    })
                }
            }
        })
        var createTable = function() {
            var table = new cc.Sprite(res.cldrx_zhuo)
            table.setAnchorPoint(0, 0)
            table.setPosition(-52, 0)
            table.setLocalZOrder(CLDRX_orderList.TABLE)
            return table
        }
        fdj.createNew({
            key: "table",
            fun: createTable
        })
        var createBlock = function() {
            var block = new cc.Sprite(res.cldrx_zt)
            block.setPosition(240, 400)
            block.setLocalZOrder(CLDRX_orderList.BLOCK)
            return block
        }
        fdj.createNew({
            key: "block",
            fun: createBlock
        })

        var createGouma = function(pos) {
            var gouma = new cc.Sprite(res.cldrx_gm)
            gouma.setPosition(pos)
            gouma.setLocalZOrder(CLDRX_orderList.GOUMA)
            gouma.setScale(0.15)
            gouma.rootScale = gouma.getScale()
            gouma.retain()
            return gouma
        }

        self.getGouma = function(pos) {
            fdj.createNew({
                key: "gouma",
                fun: createGouma,
                buf: pos,
            })
            var gouma = fdj.getOut("gouma")
            gouma.getUpPos = function() {
                var gouma = this
                var result = cc.p(0, 0)
                var modify = cc.p(0, 20)
                if (gouma.getParent()) {
                    var par = gouma.getParent()
                    result = par.convertToWorldSpace(gouma.getPosition())
                } else {
                    result = gouma.getPosition()
                }
                result = cc.p(result.x + modify.x, result.y + modify.y)
                return result
            }
            return gouma
        }
        var infos = [{
            insideWidth: 3,
            outsideWidth: 6,
            insideColor: cc.color(231, 171, 118, 255),
            outsideColor: cc.color(169, 123, 83, 255),
            a: 1 / 75000 * 2500 / cmPix / cmPix,
            b: -2 / 375 * 50 / cmPix,
            c: 1,
        }, {
            insideWidth: 3,
            outsideWidth: 6,
            insideColor: cc.color(200, 200, 200, 255),
            outsideColor: cc.color(63, 62, 63, 255),
            a: 1 / 450000 * 2500 / cmPix / cmPix,
            b: 11 / 9000 * 50 / cmPix,
            c: -31 / 90,
        }, {
            insideWidth: 3,
            outsideWidth: 6,
            insideColor: cc.color(184, 155, 231, 255),
            outsideColor: cc.color(227, 214, 213, 255),
            a: 1 / 56250 * 2500 / cmPix / cmPix,
            b: -31 / 4500 * 50 / cmPix,
            c: 127 / 90,
        }]
        self.createLine = function(data) {
            data = data || {}
            var index = data.index
            var straight = data.straight
            var startCount = data.startCount || 0
            var info = infos[index]
            var insideWidth = info.insideWidth
            var outsideWidth = info.outsideWidth
            var insideColor = info.insideColor
            var outsideColor = info.outsideColor
            var a = info.a
            var b = info.b
            var c = info.c

            var allCount = 100
            var start = data.start || cc.p(300, 500)
            var node = data.node || new cc.DrawNode()
            var length = cmPix * allCount

            node.changeLine = function(data) {
                var node = this
                data = data || {}
                var posx = node.getPositionX()
                var start = allCount - (posx + 350) / node.length * allCount
                var list = self.getLinePos({
                    a: node.a,
                    b: node.b,
                    c: node.c,
                    allCount: allCount,
                    start: Math.floor(start),
                })
                node.clear()
                node.drawCatmullRom(list, allCount, node.judgeWidth * 2, node.outsideColor)
                node.drawCatmullRom(list, allCount, node.insideWidth * 2, node.insideColor)
                node.hxz.setPosition(list[list.length - 1])
                node.straight = false
                node.posList = list
                node.startIndex = start + 9
                    //cc.log("startIndex", node.startIndex)
                node.startJudge = Math.floor(start) * cmPix
                node.drawHelp(true)
                if (self.showHelp) {
                    node.showHelp(true)
                }
            }
            node.backS = function() {
                var node = this
                node.clear()
                node.drawSegment(cc.p(0, 0), cc.p(node.length, 0), node.outsideWidth, node.outsideColor)
                node.drawSegment(cc.p(0, 0), cc.p(node.length, 0), node.insideWidth, node.insideColor)
                node.hxz.setPosition(cc.p(node.length, 0))
                node.straight = true
                var posx = node.getPositionX()
                var start = allCount - (posx + 350) / node.length * allCount + 9
                node.posList = [cc.p(start * cmPix, 0), cc.p(node.length, 0)]
                node.startIndex = 0
                node.drawHelp(false)
                if (self.showHelp) {
                    node.showHelp(true)
                }
            }
            node.judgePos = function(pos) {
                var node = this
                var x = pos.x
                var y = pos.y
                var i = pos.x
                var temp = (x >= -node.judgeWidth && x <= (node.length + node.judgeWidth) && y >= (-node.judgeWidth * 2) && y <= (node.judgeWidth * 2))
                if (!node.straight) {
                    if (temp) {
                        return temp
                    } else {
                        i = i - node.startJudge
                        var y = -(node.a * i * i + node.b * i + node.c)
                        var judgeY = pos.y
                        return (Math.abs(y - judgeY) <= node.judgeWidth * 2)
                    }
                } else {
                    return temp
                }
            }
            var CreateFzx = function(data) {
                var pos = data.pos
                var rotate = data.rotate || 0
                var width = data.width
                var height = data.height
                var modify = data.modify || cc.p(0, 0)
                var unit = data.unit || "cm"
                var buf = data.buf
                var anchor = data.anchor
                var fontModify = data.fontModify || cc.p(0, 0)
                var fzx = new cc.Scale9Sprite(res.img_fzx, cc.rect(0, 0, 32, 16), cc.rect(12, 0, 8, 16))
                fzx.width = width
                fzx.height = height
                fzx.setAnchorPoint(0, 0)
                fzx.setRotation(rotate)
                fzx.setPosition(cc.p(pos.x + modify.x, pos.y + modify.y))
                if (buf != null) {
                    var label = new cc.LabelBMFont(buf.toFixed(2).toString() + unit, res.rulerfnt)
                    label.setPosition(cc.p(width / 2 + fontModify.x, height / 2 + fontModify.y))
                    label.setRotation(-rotate)
                    label.setAnchorPoint(anchor)
                    label.setScale(0.5)
                    safeAdd(fzx, label)
                }
                return fzx
            }
            node.showHelp = function(act) {
                if (node.nodeHelp) {
                    node.nodeHelp.setVisible(act)
                }
            }
            node.drawHelp = function(act) {
                if (!node.nodeHelp) {
                    var help = new cc.Node()
                    node.nodeHelp = help
                    safeAdd(node, help)
                }
                node.nodeHelp.setVisible(act && self.showHelp)
                node.nodeHelp.removeAllChildren(true)
                if (node.posList && node.startIndex != null) {
                    //var total = 23.6 * 100 / 102
                    var beginPos = null
                    if (act) {
                        beginPos = cc.p(node.startIndex * cmPix, 0)
                    } else {
                        beginPos = node.posList[node.startIndex]
                    }
                    var endPos = node.posList[node.posList.length - 1]
                    var width = node.length - beginPos.x + 5
                    var height = beginPos.y - endPos.y + (act ? 5 : 0)
                    var hx = CreateFzx({
                        pos: beginPos,
                        width: width,
                        height: 16,
                        modify: cc.p(0, 8),
                        buf: width / 28,
                        anchor: cc.p(0.5, 0.5),
                        fontModify: cc.p(0, 20),
                    })
                    safeAdd(node.nodeHelp, hx)
                    var sx = CreateFzx({
                        pos: endPos,
                        width: height,
                        height: 16,
                        modify: cc.p(10, -5),
                        anchor: cc.p(0, 0.5),
                        rotate: -90,
                        buf: height / 28,
                        fontModify: cc.p(0, -10),
                    })
                    safeAdd(node.nodeHelp, sx)
                }
            }
            node.init = function() {
                var node = this
                node.setPosition(start)
                node.a = a
                node.b = b
                node.c = c
                node.outsideWidth = outsideWidth
                node.judgeWidth = outsideWidth
                node.insideWidth = insideWidth
                node.outsideColor = outsideColor
                node.insideColor = insideColor
                node.length = length
                node.startJudge = 0
                node.setLocalZOrder(CLDRX_orderList.BANG)
                if (!node.hxz) {
                    var tnode = {}
                    var mix = 0.5
                    var left = new cc.Sprite(res.cldrx_hxz_left)
                    left.setAnchorPoint(1, 1)
                    left.setScale(0.2)
                    node.addChild(left)
                    var right = new cc.Sprite(res.cldrx_hxz_right)
                    right.setAnchorPoint(0, 1)
                    right.setScale(0.2)
                    right.setLocalZOrder(-1)
                    node.addChild(right)
                    tnode.left = left
                    tnode.right = right
                    node.hxz = tnode
                    tnode.setPosition = function(pos) {
                        var tnode = this
                        var left = tnode.left
                        var right = tnode.right
                        left.setPosition(cc.p(pos.x + mix, pos.y))
                        right.setPosition(cc.p(pos.x - mix, pos.y))
                    }
                }
                var baoBian = new cc.Sprite(res.cldrx_baobian)
                baoBian.setAnchorPoint(0, 0.5)
                baoBian.setPosition(-outsideWidth - 2, 0)
                node.addChild(baoBian)
                baoBian.setVisible(false)
                node.baoBian = baoBian
                baoBian.setLocalZOrder(-1)
                node.backS()
            }
            node.init()
            return node
        }
        self.packLine = function(data) {
            var index = data.index
            self.curIndex = index
            var key = sprintf("line%d", index)
            fdj.createNew({
                key: key,
                fun: self.createLine,
                buf: data,
            })
            return fdj.getOut(key)
        }

        var getRuler = function(index) {
            var ruler = createNewRuler({
                max: index == 0 ? 25 : 15,
                devide: 28,
                seg: 0.65,
                height: 25,
                fontScale: 0.2,
                fontY: 10,
                line1: 2,
                line2: 3,
                line3: 5,
                seg: 0.3,
                unit: "cm",
                rotate: index == 0 ? 0 : 90,
            })
            ruler.setLocalZOrder(CLDRX_orderList.RULER)
            return ruler
        }
        fdj.actMove()
        var packRuler = function(index) {
            var key = sprintf("ruler%d", index)
            fdj.createNew({
                key: key,
                fun: function() {
                    var ruler = getRuler(index)
                    var pos = index == 0 ? cc.p(520, 200) : cc.p(910, 342)
                    ruler.setPosition(pos)
                    return ruler
                }
            })
            createTouchEvent({
                item: fdj.getOut(key),
                begin: function() {
                    fdj.see[index].setVisible(true)
                    addMoving(fdj.see[index])
                    fdj.get[index].setVisible(true)
                    return true
                },
                move: function(data) {
                    var target = data.item
                    var pos = data.pos
                    var delta = data.delta
                    scaleMove(data)
                    target.linkFun(function(data) {
                        var item = data.item
                        item.x = target.x
                        item.y = target.y
                    })
                    fdj.move(delta, index)
                }
            })
        }
        packRuler(0)
        packRuler(1)
        fdj.actMove({
            judgeGet: function(data) {
                var index = data.index
                var item = data.item
                var delta = data.delta
                var pos = data.pos
                var ruler = fdj.getOut(sprintf("ruler%d", index))
                var tempPos = item.getParent().convertToWorldSpace(item.getPosition())
                tempPos.x += delta.x
                tempPos.y += delta.y
                var judge = judgeInside({
                    item: ruler,
                    pos: tempPos,
                })
                if (!judge) {
                    var backPos = getBackPos({
                        item: ruler,
                        pos: tempPos,
                    })
                    switch (index) {
                        case 0:
                            delta.x += backPos.x
                            delta.y += backPos.y
                            break
                        case 1:
                            delta.x += backPos.y
                            delta.y -= backPos.x
                            break
                    }
                }
                return delta
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
            img: res.cldrx_do_content, //图片和声音文件
            sound: res.cldrx_do_sound
        })
    }
})