//@author mu @16/5/11

var countsType = 8
var types = [{
    type: "shucai",
    contains: [0, 1],
}, {
    type: "shuiguo",
    contains: [2, 3],
}, {
    type: "liangshi",
    contains: [4, 5],
}, {
    type: "douzhipin",
    contains: [6],
}, {
    type: "jiaqinlei",
    contains: [7],
}, {
    type: "jiaxulei",
    contains: [8, 9],
}, {
    type: "qindanlei",
    contains: [10],
}, {
    type: "shuichanlei",
    contains: [11, 12],
}, ]

var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    preLayer: "doLayer",
    layerName: "doExp2",
    load: function() {
        loadPlist("gswfl_dolist")
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({
                    key: "Show"
                })
            })
        }
    },
    dataControl: {},
    judgePut: function(data) {
        var index = data.index
        var type = data.type
        var contain = types[data.type].contains
        for (var i = 0; i < contain.length; i++) {
            if (index == contain[i]) {
                return true
            }
        }
        return false
    },
    judgeFinish: function() {
        var self = this
        var dataControl = self.dataControl
        return (dataControl[dataControl.curChoose + "Count"] == dataControl[dataControl.curChoose + "Max"])
    },
    createLoop: function(data) {
        var self = this
        var dataControl = self.dataControl
        var normals = data.normals
        var selects = data.selects
        var gray = data.grays || []
        var nums = data.nums
        var arrow = data.arrow
        var pos = data.pos
        var judgeList = data.judgeList || []
        var arrmodify = data.arrmodify || cc.p(0, 0)
        var arrscale = data.arrscale || 1
        if (nums < normals.length) {
            arrow = true
        }
        var devide = data.devide || cc.p(50, 0)
        var scale = data.scale || 1
        var btnsize = getSize(normals[0], scale)
        var arrsize = getSize(res.btn_arrow_normal, arrscale)
        var finalsize = cc.size(btnsize.width * nums + (nums + 1) * devide.x, btnsize.height)
        var node = new cc.Node()
        dataControl.myNode = node
        var lay = createLayout({
            pos: cc.p((arrow ? arrsize.width : 0), 0),
            size: finalsize,
            op: 0,
        })
        node.setPosition(pos)
        node.curIndex = 0
        node.list = []
        node.arrows = []
        var judgeTime = 0.2
        var mix = 10
        var tempClick = false
        for (var i = 0; i < normals.length; i++) {
            var img = new cc.Sprite(normals[i])
            img.setScale(scale)
            img.index = i
            img.setAnchorPoint(0.5, 0.5)
            var temp = cc.p(btnsize.width / 2 + devide.x + (btnsize.width + devide.x) * i, btnsize.height / 2)
            img.setPosition(temp)
            node.list[i] = img
            img.curType = dataControl.curChoose
            img.rootPos = temp
            img.judgeIndex = judgeList[i]

            createTouchEvent({
                item: img,
                swallow: false,
                begin: function(data) {
                    var item = data.item
                    var pos = data.pos

                    if (item.curType == dataControl.curChoose && !node.Moving) {
                        var tempjudge = item.index - node.curIndex
                        if (!item.select && tempjudge < nums && tempjudge >= 0) {
                            tempClick = true
                            item.startPos = pos
                            item.judge = false
                            item.tri = null
                            item.stopAllActions()
                            item.runAction(cc.sequence(
                                cc.delayTime(judgeTime),
                                cc.callFunc(function() {
                                    item.judge = true
                                })))
                            return true
                        } else {
                            return false
                        }
                    } else {
                        return false
                    }
                },
                move: function(data) {
                    var item = data.item
                    var pos = data.pos
                    var delta = data.delta
                    if (item.select) {
                        item.select.x += delta.x
                        item.select.y += delta.y
                    }
                    var angle = getAngle(item.startPos, pos)

                    if ((angle >= 0 && angle <= 70) || (angle >= 337.5 && angle <= 360)) {
                        angle = "left"
                    }
                    if ((angle >= 70 && angle <= 110)) {
                        angle = "up"
                    }
                    if ((angle >= 110 && angle <= 202.5)) {
                        angle = "right"
                    }
                    if ((angle >= 202.5 && angle <= 337.5)) {
                        angle = "down"
                    }

                    var tri = angle

                    var dis = getDis(item.startPos, pos)
                    if (!item.judge) {
                        if (dis >= mix && (tri == "down" || tri == "up")) {
                            item.judge = true
                            if (!item.select) {
                                var sp = new cc.Sprite(selects[item.index])
                                sp.setPosition(pos)
                                sp.setScale(0.4)
                                self.loadUI.addChild(sp)
                                item.select = sp
                                item.setOpacity(127)
                            }
                        }
                        if (dis >= mix && (tri == "left" || tri == "right")) {
                            item.judge = true
                            item.tri = tri
                        }
                    } else {
                        if (!item.select && !item.tri) {
                            var sp = new cc.Sprite(selects[item.index])
                            sp.setPosition(pos)
                            sp.setScale(0.4)
                            self.loadUI.addChild(sp)
                            item.select = sp
                            item.setOpacity(127)
                        }
                    }
                },
                end: function(data) {
                    var item = data.item
                    var pos = data.pos
                    var result = self.judgeBox(pos)
                    tempClick = false
                    if (item.select) {
                        if (!result) {
                            var sp = item.select
                            sp.removeFromParent(true)
                            item.select = null
                            item.setOpacity(255)
                        } else {
                            var node = dataControl.scene[result]
                            var type = node[dataControl.curChoose + "type"]
                            if (self.judgePut({
                                    index: item.judgeIndex,
                                    type: type,
                                })) {
                                if (!node[dataControl.curChoose + "inside"]) {
                                    var temp = new cc.Node()
                                    node.addChild(temp)
                                    node[dataControl.curChoose + "inside"] = temp
                                    temp.startPos = cc.p(175, 50)
                                }
                                var sp = item.select
                                sp.retain()
                                sp.removeFromParent(false)
                                var father = node[dataControl.curChoose + "inside"]
                                father.addChild(sp)
                                sp.release()
                                sp.setAnchorPoint(0.5, 0)
                                sp.setScale(0.55)
                                if (item.judgeIndex == 11) {
                                    sp.setScale(0.45)
                                }
                                sp.setPosition(father.startPos)
                                father.startPos.x += 180
                                dataControl[dataControl.curChoose + "Count"]++
                                    if (self.judgeFinish()) {
                                        AddDialog("Tips", {
                                            res: res.gswfl_right,
                                            face: 1,
                                            scale: 0.5,
                                            sound: res.sound_right,
                                        })
                                    }
                            } else {
                                var sp = item.select
                                sp.removeFromParent(true)
                                item.select = null
                                item.setOpacity(255)
                            }
                        }
                    } else {
                        if (item.tri) {
                            switch (item.tri) {
                                case "left":
                                    dataControl.myNode.Move(true)
                                    break
                                case "right":
                                    dataControl.myNode.Move(false)
                                    break
                            }
                        }
                    }
                }
            })
            lay.addChild(img)
        }
        createTouchEvent({
            item: dataControl.scene.img_top,
            begin: function(data) {
                var item = data.item
                var pos = data.pos
                item.startPos = pos
                return !tempClick
            },
            end: function(data) {
                var item = data.item
                var pos = data.pos
                if (pos.x == item.startPos.x) {
                    return
                }
                dataControl.myNode.Move(pos.x > item.startPos.x)
            }
        })
        node.judgeArrow = function() {
            if (arrow) {
                var result1 = node.list[0].x + 100 < node.list[0].rootPos.x
                var result2 = node.list[node.list.length - 1].x > node.list[nums - 1].rootPos.x + 100
                node.arrows[0].setVisible(result1)
                node.arrows[1].setVisible(result2)
            }
        }
        node.Move = function(tri) {
            var temp = node.curIndex + (nums * (tri ? -1 : 1))
            var dis = (tri ? 1 : -1) * nums * (devide.x + btnsize.width)
            if (!node.Moving && node.list[temp]) {
                node.curIndex = temp
                node.Moving = true
                var count = 0
                for (var i = 0; i < node.list.length; i++) {
                    var img = node.list[i]
                    count++
                    addShowType({
                        item: img,
                        show: "moveBy",
                        buf: cc.p(dis, 0),
                        time: 0.3,
                        fun: function() {
                            count--
                            if (count == 0) {
                                node.Moving = false
                                node.judgeArrow()
                            }
                        }
                    })
                }
            }
        }
        node.addChild(lay)
        lay.setClippingEnabled(true)
        if (arrow) {
            for (var i = 0; i < 2; i++) {
                var item = new ccui.ImageView(res.btn_arrow_normal)
                item.setAnchorPoint(0.5, 0.5)
                item.setScale(arrscale)
                item.curType = dataControl.curChoose
                addShowType({
                    item: item,
                    show: "shakeF",
                    time: 0.3,
                    buf: (i == 0 ? cc.p(-4, 0) : cc.p(4, 0))
                })
                item.tri = (i == 0)
                item.setPosition((i == 0 ? (arrsize.width / 2 + arrmodify.x) : (arrsize.width * 1.5 + finalsize.width - arrmodify.x)), btnsize.height / 2 + arrmodify.y)
                item.setFlippedX(i == 1)
                node.addChild(item)
                node.arrows[i] = item

                createTouchEvent({
                    swallow: false,
                    item: item,
                    begin: function(data) {
                        var item = data.item
                        return (item.curType == dataControl.curChoose) && item.isVisible()
                    },
                    end: function(data) {
                        var item = data.item
                        node.Move(item.tri)
                    }
                })
            }
        }
        node.judgeArrow()
        return node
    },
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
        this.expCtor()
        this.dataControl = {}
        var self = this
        var dataControl = self.dataControl
        dataControl.curChoose = "dw"
        dataControl.zwFinish = false
        dataControl.zwCount = 0
        dataControl.dwCount = 0
        dataControl.zwMax = 7
        dataControl.dwMax = 6
        self.initScene()
        self.initPeople()
        return true
    },
    initBox: function() {
        var self = this
        var dataControl = self.dataControl
        var node = dataControl.scene
        var list = [
            "img_kuang_1",
            "img_kuang_2",
            "img_kuang_3",
            "img_kuang_4",
        ]
        var fonts = [
            "img_font_1",
            "img_font_2",
            "img_font_3",
            "img_font_4",
        ]
        for (var i = 0; i < list.length; i++) {
            var item = node[list[i]]
            item.font = node[fonts[i]]
            item.font.setScale(1.3)
            item.itemRect = createLayout({
                pos: cc.p(0, 0),
                size: cc.size(435, 270),
                op: 0,
                color: cc.color(255, 255, 0, 255),
            })
            item.itemRect.father = list[i]
            item.addChild(item.itemRect)
        }
    },
    judgeBox: function(pos) {
        var self = this
        var dataControl = self.dataControl
        var node = dataControl.scene
        var list = [
            "img_kuang_1",
            "img_kuang_2",
            "img_kuang_3",
            "img_kuang_4",
        ]
        for (var i = 0; i < list.length; i++) {
            var rect = node[list[i]].itemRect
            if (judgeIn(rect, pos)) {
                return rect.father
            }
        }
        return null
    },
    initScene: function() {
        var dataControl = this.dataControl
        var list = [
            "btn_zw",
            "btn_dw",
            "label_zw",
            "label_dw",
            "img_kuang_1",
            "img_font_1",
            "img_kuang_2",
            "img_font_2",
            "img_kuang_3",
            "img_font_3",
            "img_kuang_4",
            "img_font_4",
            "img_top",
        ]
        var node = loadNode(res.gswfl_do_json, list)
        dataControl.scene = node
        dataControl.judgedw = 0
        dataControl.judgezw = 0
        node.btn_zw.myname = "zw"
        node.btn_dw.myname = "dw"
        node.btn_zw.setVisible(false)
        node.btn_dw.setVisible(false)
        this.loadUI.addChild(node)
        this.initControl()
        this.initBox()
        this.changeFont()
    },
    getList: function(ifcur) {
        var final = ""
        var self = this
        var dataControl = self.dataControl
        if (ifcur) {
            final = dataControl.curChoose
        } else {
            switch (dataControl.curChoose) {
                case "zw":
                    final = "dw"
                    break
                case "dw":
                    final = "zw"
                    break
            }
        }
        if (!dataControl["top" + final]) {
            var node = new cc.Node()
            self.loadUI.addChild(node)
            dataControl["top" + final] = node
            var scale = 0.5
            var list = getRand(countsType)
            for (var i = 0; i < countsType; i++) {
                var item = new cc.Sprite("#gswfl_btn_back.png")
                var name = sprintf("gswfl_font%d.png", list[i] + 1)
                var font = new cc.Sprite("#" + name)
                font.setPosition(item.getContentSize().width / 2, item.getContentSize().height / 2)
                font.setAnchorPoint(0.5, 0.5)
                item.addChild(font)
                item.setScale(scale)
                item.myType = list[i]
                item.tex = name
                font.setScale(1 / scale)
                item.setAnchorPoint(0.5, 0.5)
                item.setPosition(355 + i * 70, 570)
                item.rootPos = item.getPosition()
                item.mytype = list[i] > 3 ? "dw" : "zw"
                node.addChild(item)
                createTouchEvent({
                    item: item,
                    swallow: false,
                    begin: function() {
                        if (dataControl.curChoose != final) {
                            return false
                        }
                        return true
                    },
                    move: function(data) {
                        var item = data.item
                        var pos = data.pos
                        var delta = data.delta
                        item.x += delta.x
                        item.y += delta.y
                    },
                    end: function(data) {
                        var item = data.item
                        var pos = data.pos
                        var result = self.judgeBox(pos)
                        if (result && item.mytype == dataControl.curChoose) {
                            var kuang = dataControl.scene[result]
                            if (!kuang[dataControl.curChoose]) {
                                kuang[dataControl.curChoose] = item.tex
                                kuang[dataControl.curChoose + "type"] = item.myType
                                    //cc.log(types[item.myType])
                                kuang.font.setSpriteFrame(item.tex)
                                    //kuang.font.setContentSize(getSize(item.tex))
                                item.removeFromParent(true)
                                dataControl["judge" + dataControl.curChoose]++
                                    self.judgeLoop()
                            } else {
                                item.setPosition(item.rootPos)
                            }
                        } else {
                            item.setPosition(item.rootPos)
                        }
                    },
                })
            }
        }
        return dataControl["top" + final]
    },
    judgeLoop: function() {
        var self = this
        var dataControl = self.dataControl
        if (dataControl["judge" + dataControl.curChoose] == 4) { //mark
            var list = getRand(13)
            var fileList = []
            var selectList = []
            for (var i = 0; i < list.length; i++) {
                fileList[i] = sprintf("#gswfl_btn_%02d.png", list[i] + 1)
                selectList[i] = sprintf("#gswfl_food_%02d.png", list[i] + 1)
            }
            var node = self.createLoop({
                nums: 5,
                normals: fileList,
                judgeList: list,
                selects: selectList,
                scale: 0.45,
                arrscale: 0.6,
                devide: cc.p(15, 0),
                pos: cc.p(305, 510),
                arrmodify: cc.p(10, 16),
            })
            dataControl["loop" + dataControl.curChoose] = node
            self.loadUI.addChild(node)
            self.initTop()
        }
    },
    getLoop: function(ifcur) {
        var self = this
        var dataControl = self.dataControl
        var final = null
        if (ifcur) {
            final = dataControl.curChoose
        } else {
            switch (dataControl.curChoose) {
                case "dw":
                    final = "zw"
                    break
                case "zw":
                    final = "dw"
                    break
            }
        }
        return dataControl["loop" + final]
    },
    initTop: function() {
        var dataControl = this.dataControl
        var self = this
        if (self.getLoop(true)) {
            self.getLoop(true).setVisible(true)
            self.getList(true).removeAllChildren(true)
        } else {
            self.getList(true).setVisible(true)
        }
        if (self.getLoop(false)) {
            self.getLoop(false).setVisible(false)
        }
        self.getList(false).setVisible(false)
    },
    initControl: function() {
        var dataControl = this.dataControl
        var self = this
        var callback = function(data) {
            var item = data.item
            var pos = data.pos
            switch (item.myname) {
                case "zw":
                    if (dataControl.curChoose != item.myname) {
                        dataControl.curChoose = item.myname
                        self.changeFont()
                    }
                    break
                case "dw":
                    if (dataControl.curChoose != item.myname) { //mark add tips judge by zwfinish
                        dataControl.curChoose = item.myname
                        self.changeFont()
                    }
                    break
            }
        }
        createTouchEvent({
            item: dataControl.scene.btn_zw,
            end: callback,
        })
        createTouchEvent({
            item: dataControl.scene.btn_dw,
            end: callback,
        })

    },
    getNoCur: function() {
        var self = this
        var dataControl = self.dataControl
        switch (dataControl.curChoose) {
            case "dw":
                return "zw"
                break
            case "zw":
                return 'dw'
                break
        }
    },
    changeFont: function() {
        var dataControl = this.dataControl
        var judge = dataControl.curChoose == "zw"
        var self = this
        dataControl.scene.label_zw.setVisible(judge)
        dataControl.scene.label_dw.setVisible(!judge)
        dataControl.scene.btn_zw.setSpriteFrame(judge ? "gswfl_btn_zw_select.png" : "gswfl_btn_zw_normal.png")
        dataControl.scene.btn_dw.setSpriteFrame(judge ? "gswfl_btn_dw_normal.png" : "gswfl_btn_dw_select.png")
        this.initTop()
        var list = [
            "img_kuang_1",
            "img_kuang_2",
            "img_kuang_3",
            "img_kuang_4",
        ]
        for (var i = 0; i < list.length; i++) {
            var kuang = dataControl.scene[list[i]]
            var font = kuang.font
            var final = kuang[dataControl.curChoose]
            if (!final) {
                final = "gswfl_font0.png"
            }
            font.setSpriteFrame(final)
            var inside = kuang[dataControl.curChoose + "inside"]
            if (inside) {
                inside.setVisible(true)
            }
            var outside = kuang[self.getNoCur() + "inside"]
            if (outside) {
                outside.setVisible(false)
            }
        }
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.loadUI.addChild(this.nodebs)
        addContent({
            people: this.nodebs,
            key: "Show",
            sound: res.gswfl_do1_content_sound,
            scale: 0.4,
        })
    }
})