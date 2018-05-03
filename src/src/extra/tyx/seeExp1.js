//@author mu @16/4/27

var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("tyx_planet")
    },
    myDelete: function() { //删除时调用
        var self = this
        this._super()
        var dataControl = self.dataControl
        var itemList = dataControl.itemList
        for (var i = 0; i < itemList; i++) {
            if(itemList[i].stopAct)
            {
                itemList[i].stopAct()
            }
        }
        disTimer(dataControl.blink)
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: "tyx1"
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
        var dataControl = self.dataControl
        var uiList = [
            "node_glax",
            "disvis1",
            "disvis2",
            "node_change",
            "normal",
        ]
        var dis = [
            "disvis1",
            "disvis2",
            "node_change",
        ]
        var node = loadNode(res.tyx_see1, uiList)
        node.dis = dis
        self.inside_node.addChild(node)
        var tyx_node = new cc.Node()
        tyx_node.setPosition(cc.p(0, 0))
        tyx_node.setAnchorPoint(cc.p(0.5, 0.5))
        self.inside_node.addChild(tyx_node)
        self.tyx_node = tyx_node
        blink({
            item: node.node_change,
            time: 0.4,
        })
        dataControl.blink = node.node_change
        node.disvis = function() {
            var node = this
            for (var i = 0; i < node.dis.length; i++) {
                node[node.dis[i]].setVisible(false)
            }
        }
        var actTime = 0.5
        createTouchEvent({
            item: node.normal,
            end: function(data) {
                var item = data.item
                disTimer(node.node_change)
                node.disvis()
                addShowType({
                    item: node.node_glax,
                    show: "scaleTo",
                    time: actTime,
                    buf: 0.35,
                })
                addShowType({
                    item: node.node_glax,
                    show: "moveTo",
                    time: actTime,
                    buf: cc.p(getMiddle(350, 200)),
                    fun: function() {
                        var sp = new cc.Sprite(res.tyx_img_tri2)
                        sp.setScale(0.7)
                        sp.setRotation(40)
                        sp.setPosition(cc.p(849.2, 572.3))
                        sp.setAnchorPoint(cc.p(0.47, 1))
                        dataControl.tri = sp
                        node.addChild(sp)
                        addShowType({
                            item: sp,
                            show: "fadeIn",
                            time: actTime,
                            fun: function() {
                                self.nodebs.say({
                                    key: "tyx2",
                                    force: true,
                                })
                                self.tyx_node.setCascadeOpacityEnabled(true)
                                var font = new ccui.ImageView(res.tyx_font)
                                font.setCascadeOpacityEnabled(true)
                                font.setPosition(getMiddle(0, -280))
                                font.setScale(0.8)
                                self.drawEll()
                                self.initTyBtns()
                                self.tyx_node.addChild(font)
                                var show = new ccui.ImageView(res.tyx_show)
                                show.setScale(0.6)
                                show.setPosition(getMiddle(400, 0))
                                show.setCascadeOpacityEnabled(true)
                                font.setLocalZOrder(99)
                                self.tyx_node.show = show
                                self.tyx_node.addChild(show)
                            }
                        })
                    }
                })
                item.removeListen()
            }
        })
    },
    initTyBtns: function() {
        var self = this
        var dataControl = self.dataControl
        var uiList = [
            null,
            "show1",
            "show2",
            "show3",
            "show4",
            "show5",
            "show6",
            "show7",
            "show8",
            "show9",
        ]
        var node = loadNode(res.tyx_see_btn, uiList)
        cc.log(node.show1.getChildByName("normal"))
        node.showIndex = function(index) {
            var node = this
            for (var i = 0; i < uiList.length; i++) {
                var show = node[sprintf("show%d", i)]
                if (show) {
                    if (index == i) {
                        var run = function() {
                            if (index != 0) {
                                if (index != dataControl.pastIndex) {
                                    self.nodebs.say({
                                        key: sprintf("tyx%d", index + 2),
                                        force: true,
                                    })
                                    var img = dataControl.showImg
                                    var initImg = function(img) {
                                        var data = dataControl.dataList[index - 1]
                                        var posOff = data.pos || cc.p(0, 0)
                                        var scale = data.scale || 1
                                        var triData = data.triData || {}
                                        img.setPosition(getMiddle(-100 + posOff.x, -100 + posOff.y))
                                        img.setScale(scale)
                                        var tri = img.tri
                                        tri.setPosition(triData.pos)
                                        tri.setScaleX(triData.scaleX)
                                        tri.setScaleY(triData.scaleY)
                                        tri.setRotation(triData.rotate)
                                        if (index == 1) { //sun
                                            if (!img.light) {
                                                var light = new ccui.ImageView(res.tyx_light)
                                                light.setPosition(398, 615)
                                                light.setLocalZOrder(-1)
                                                img.addChild(light)
                                                addShowType({
                                                    item: light,
                                                    show: "scaleLoop",
                                                    buf: {
                                                        from: 0.7,
                                                        to: 1.4,
                                                    },
                                                    time: 1.0,
                                                    repeat: cc.REPEAT_FOREVER / 2,
                                                })
                                                img.light = light
                                            } else {
                                                img.light.setVisible(true)
                                            }
                                        } else {
                                            if (img.light) {
                                                img.light.setVisible(false)
                                            }
                                        }
                                        if (index == 4) { //earth
                                            if (!img.beside) {
                                                var uiList = [
                                                    "moon",
                                                ]
                                                var node = loadNode(res.tyx_earth, uiList, "bg")
                                                node.setPosition(394, 685)
                                                node.setScale(1.4)
                                                img.addChild(node)
                                                img.beside = node
                                                var size = node.getContentSize()
                                                var points = getEllipsePoint({
                                                    a: 177.1334,
                                                    b: 54.5379,
                                                    devide: 4,
                                                })
                                                goWithPos({
                                                    item: node.moon,
                                                    posList: points,
                                                    time: 0.03,
                                                    repeat: cc.REPEAT_FOREVER,
                                                    init: true,
                                                    rootPos: cc.p(size.width / 2, size.height / 2 + 3)
                                                })
                                            } else {
                                                img.beside.setVisible(true)
                                            }
                                        } else {
                                            if (img.beside) {
                                                img.beside.setVisible(false)
                                            }
                                        }
                                        addShowType({
                                            item: img,
                                            show: "fadeIn",
                                            time: 0.3,
                                        })
                                    }
                                    if (img) {
                                        img.stopAllActions()
                                        addShowType({
                                            item: img,
                                            show: "fadeOut",
                                            time: 0.3,
                                            fun: function(img) {
                                                img.loadTexture(res[sprintf("tyx_show_%d", index)])
                                                initImg(img)
                                            }
                                        })
                                    } else {
                                        var top = new ccui.ImageView(res.tyx_top_font)
                                        top.setCascadeOpacityEnabled(true)
                                        top.setPosition(getMiddle(-120, 270))
                                        top.setScale(0.7)
                                        self.inside_node.addChild(top)
                                        var img = new ccui.ImageView(res[sprintf("tyx_show_%d", index)])
                                        dataControl.showImg = img
                                        var tri = new ccui.ImageView(res.tyx_img_tri2)
                                        tri.setAnchorPoint(cc.p(0.47, 1))
                                        img.addChild(tri)
                                        img.tri = tri
                                            //addMoving(tri, false, true)
                                        self.inside_node.addChild(img)
                                        initImg(img)
                                    }
                                    dataControl.pastIndex = index
                                }
                            }
                        }
                        if (!dataControl.isMove) {
                            self.tyx_node.show.setVisible(false)
                            var judgeCount = 0
                            dataControl.isMove = true
                            var afterFun = function() {
                                judgeCount--
                                if (judgeCount == 0) {
                                    for (var i = 0; i < dataControl.ellList.length; i++) {
                                        dataControl.ellList[i].reDraw()
                                    }
                                    run()
                                }
                            }
                            addShowType({
                                item: dataControl.tri,
                                show: "scaleTo",
                                buf: {
                                    x: 0.3,
                                    y: 0.7,
                                },
                                time: 0.5,
                                fun: afterFun,
                            })
                            judgeCount++
                            addShowType({
                                item: dataControl.tri,
                                show: "rotateTo",
                                buf: 0,
                                time: 0.5,
                                fun: afterFun,
                            })
                            judgeCount++
                            addShowType({
                                item: self.tyx_node,
                                show: "scaleTo",
                                time: 0.5,
                                buf: 0.4,
                                fun: afterFun,
                            })
                            judgeCount++
                            addShowType({
                                item: self.tyx_node,
                                show: "moveTo",
                                time: 0.5,
                                buf: cc.p(650, 180),
                                fun: afterFun,
                            })
                            judgeCount++
                        } else {
                            run()
                        }
                        show.getChildByName("act").setVisible(false)
                        show.getChildByName("normal").setVisible(false)
                        show.getChildByName("select").setVisible(true)
                    } else {
                        show.getChildByName("act").setVisible(false)
                        show.getChildByName("normal").setVisible(true)
                        show.getChildByName("select").setVisible(false)
                    }
                }
            }
        }
        node.init = function() {
            var node = this
            for (var i = 0; i < uiList.length; i++) {
                if (uiList[i]) {
                    var temp = node[uiList[i]]
                    if (temp) {
                        temp.index = i
                        var touch = temp.getChildByName("normal")
                        touch.index = i
                        touch.link = temp.getChildByName("select")
                        touch.act = temp.getChildByName("act")
                        createTouchEvent({
                            item: touch,
                            begin: function(data) {
                                var item = data.item
                                item.setVisible(false)
                                item.act.setVisible(true)
                                item.link.setVisible(false)
                                return true
                            },
                            end: function(data) {
                                var item = data.item
                                node.showIndex(item.index)
                            },
                        })
                    }
                }
            }
            node.showIndex(0)
        }
        node.init()
        self.inside_node.addChild(node)
    },
    drawEll: function() {
        var self = this
        var dataControl = self.dataControl
        var bufs = [{
            name: "Mercury",
            a: 45.5336,
            b: 23.7889,
            r: -351.8698,
            x: 521.7248,
            y: 339.0554,
            mix: 100,
            posOff: cc.p(0, 100),
            scale: 0.7,
            triData: {
                pos: cc.p(977, 445),
                scaleX: 0.3,
                scaleY: 1.7,
                rotate: 105,
            },
            time: 0.05,
        }, {
            name: "Venus",
            a: 65.4197,
            b: 33.8249,
            r: -351.8698,
            x: 521.7248,
            y: 339.0554,
            mix: 300,
            posOff: cc.p(0, 100),
            scale: 0.7,
            triData: {
                pos: cc.p(963, 452),
                scaleX: 0.3,
                scaleY: 1.6,
                rotate: 105,
            },
            time: 0.04,
        }, {
            name: "Earth",
            a: 83.2614,
            b: 44.4185,
            r: -351.8698,
            x: 521.7248,
            y: 339.0554,
            mix: 300,
            posOff: cc.p(0, 70),
            scale: 0.6,
            triData: {
                pos: cc.p(1045, 495),
                scaleX: 0.3,
                scaleY: 1.8,
                rotate: 105,
            },
            time: 0.015,
        }, {
            name: "Mars",
            a: 111.8841,
            b: 57.5693,
            r: -351.8698,
            x: 521.7248,
            y: 339.0554,
            mix: 300,
            posOff: cc.p(0, 80),
            scale: 0.7,
            triData: {
                pos: cc.p(937, 485),
                scaleX: 0.3,
                scaleY: 1.5,
                rotate: 110,
            },
            time: 0.021,
        }, {
            name: "Jupiter",
            a: 185.0231,
            b: 84.3053,
            r: -347.9885,
            x: 523.0390,
            y: 331.1704,
            mix: 300,
            posOff: cc.p(0, 80),
            scale: 0.7,
            triData: {
                pos: cc.p(904, 495),
                scaleX: 0.3,
                scaleY: 1.6,
                rotate: 110,
            },
            time: 0.022,
        }, {
            name: "Saturn",
            a: 223.6465,
            b: 106.7036,
            r: -350.1852,
            x: 520.4106,
            y: 327.2279,
            mix: 300,
            posOff: cc.p(0, 80),
            scale: 0.7,
            triData: {
                pos: cc.p(881, 499),
                scaleX: 0.3,
                scaleY: 1.5,
                rotate: 107,
            },
            time: 0.023,
        }, {
            name: "Uranus",
            a: 262.6993,
            b: 140.7349,
            r: -350.1852,
            x: 519.0965,
            y: 316.7145,
            mix: 200,
            posOff: cc.p(0, 80),
            scale: 0.7,
            triData: {
                pos: cc.p(859, 500),
                scaleX: 0.3,
                scaleY: 1.4,
                rotate: 110,
            },
            time: 0.024,
        }, {
            name: "Neptune",
            a: 332.1671,
            b: 219.0836,
            r: -356.0244,
            x: 511.2114,
            y: 273.3470,
            mix: 3000,
            posOff: cc.p(0, 80),
            scale: 0.7,
            triData: {
                pos: cc.p(823, 500),
                scaleX: 0.3,
                scaleY: 1.2,
                rotate: 113,
            },
            time: 0.025,
        }]
        dataControl.curIndex = 0
        dataControl.ellList = []
        dataControl.dataList = []
        dataControl.itemList = []
        dataControl.dataList.push({
            pos: cc.p(0, 10),
            scale: 0.8,
            triData: {
                pos: cc.p(921, 551),
                scaleX: 0.3,
                scaleY: 1.5,
                rotate: 100,
            }
        })
        var zOrder = 99
        var createPlanet = function() {
            var tnode = new cc.Node()
            var buf = bufs[dataControl.curIndex]
            var points = getEllipsePoint({
                a: buf.a,
                b: buf.b,
                devide: 4,
            })
            var ell = drawEllipse({
                buf: points,
                color: cc.color(106, 104, 203, 255),
                seg: 1.0,
            })
            var temp = drawEllipse({
                buf: points,
                color: cc.color(106, 104, 203, 255),
                seg: 3.0,
            })
            temp.setVisible(false)
            ell.link = temp
            ell.points = points
            ell.reDraw = function() {
                var self = this
                self.setVisible(false)
                self.link.setVisible(true)
            }
            tnode.setRotation(buf.r + 15)
            tnode.setPosition(cc.p(buf.x, buf.y + 50))
            tnode.addChild(ell)
            tnode.addChild(temp)
            dataControl.ellList.push(ell)
            dataControl.dataList.push({
                pos: buf.posOff,
                scale: buf.scale,
                triData: buf.triData,
            })
            tnode.setLocalZOrder(zOrder--)
            self.tyx_node.addChild(tnode)
            var item = new cc.Sprite(sprintf("#%s.png", buf.name))
            item.setAnchorPoint(cc.p(0.5, 0.5))
                // goWithEll({
                //     item: item,
                //     time: 0.01,
                //     startx: buf.a,
                //     a: buf.a,
                //     b: buf.b,
                //     mix: buf.mix,
                //     init: true,
                // })
            goWithPos({
                item: item,
                posList: points,
                time: buf.time || 0.01,
                repeat: cc.REPEAT_FOREVER,
                init: true,
                //rootPos: cc.p(size.width / 2, size.height / 2 + 3)
            })
            dataControl.itemList.push(item)
            tnode.addChild(item)
            addShowType({
                item: tnode,
                show: "fadeIn",
                time: 0.2
            })
            addTimer({
                    fun: function() {
                        dataControl.curIndex++
                            if (dataControl.curIndex < bufs.length) {
                                createPlanet()
                            }
                    },
                    time: 0.1,
                    repeat: 1,
                    key: getRandKey()
                })
                // dataControl.curIndex++
                //     if (dataControl.curIndex < bufs.length) {
                //         createPlanet()
                //     }
        }
        var tempkey = getRandKey()
        addTimer({
            fun: function() {
                removeTimer(tempkey)
                var sun = new ccui.ImageView(res.tyx_sun)
                sun.setPosition(cc.p(520, 389))
                sun.setScale(0.8)
                sun.setLocalZOrder(zOrder--)

                var light = new ccui.ImageView(res.tyx_light)
                light.setPosition(33.64, 32.28)
                light.setLocalZOrder(-1)
                sun.addChild(light)
                addShowType({
                    item: light,
                    show: "scaleLoop",
                    buf: {
                        from: 0.2,
                        to: 0.28,
                    },
                    time: 1.0,
                    repeat: cc.REPEAT_FOREVER / 2,
                })
                //addMoving(light, false, true)

                self.tyx_node.addChild(sun)
                createPlanet()
            },
            time: 0.1,
            key: tempkey,
            repeat: 1,
        })
    },
    initPeople: function() {
        var self = this
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        for (var i = 0; i < 11; i++) {
            addContent({
                people: self.nodebs,
                key: sprintf("tyx%d", i + 1),
                sound: res[sprintf("tyx_sound%d", i + 1)],
            })
        }
        this.loadUI.addChild(this.nodebs) //添加人物对话
    }
})