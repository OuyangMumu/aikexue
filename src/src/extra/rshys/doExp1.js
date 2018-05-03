//@author mu @16/4/27
var indexList = {
    allEat: 0,
    partEat: 1,
    huanEat: 2,
    moonAllEat: 3,
    moonPartEat: 4,
}
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("earth_plist")
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
                    key: "Show"
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
    createMoonMv: function(index) {
        var self = this.inside_node
        if (!self.moon_bg) {
            var sun_bg = new cc.Sprite(res.img_moon_bg)
            sun_bg.setAnchorPoint(0, 0)
            sun_bg.setPosition(0, 0)
            safeAdd(self, sun_bg)
            self.moon_bg = sun_bg
        }
        if (self.img_bg) {
            self.img_bg.setVisible(false)
        }
        var img_bg = self.moon_bg
        img_bg.setVisible(index != null)
        if (img_bg.action) {
            img_bg.action.stopAllActions()
            img_bg.action.removeFromParent(true)
            img_bg.action = null
        }
        if (index != null) {
            var sp = new cc.Sprite()
            sp.setPosition(220, 130)
            safeAdd(img_bg, sp)
            img_bg.action = sp
            switch (index) {
                case indexList.moonAllEat:
                    var ani = createAnimation({
                        ifFile: true,
                        frame: "rshys_ys_%03d",
                        start: 40,
                        end: 60,
                        time: 1 / 12,
                    })
                    sp.runAction(ani)
                    break
                case indexList.moonPartEat:
                    var ani = createAnimation({
                        ifFile: true,
                        frame: "rshys_ys_%03d",
                        start: 1,
                        end: 30,
                        time: 1 / 12,
                    })
                    sp.runAction(ani)
                    break
            }
        }
    },
    createMv: function(index) {
        var self = this.inside_node
        if (!self.sun_bg) {
            var sun_bg = new cc.Sprite(res.img_sun_bg)
            sun_bg.setAnchorPoint(0, 0)
            sun_bg.setPosition(0, 0)
            safeAdd(self, sun_bg)
            var clip = new cc.Sprite(res.clip_node)
            setSize({
                item: clip,
                width: 410,
                height: 240,
            })
            clip.setAnchorPoint(0, 0)
            clip.setPosition(0, 0)
            var clip_node = new cc.ClippingNode(clip)
            clip_node.setLocalZOrder(-1)
            safeAdd(sun_bg, clip_node)

            var back = new cc.Sprite(res.clip_node)
            setSize({
                item: back,
                width: 410,
                height: 240,
            })
            back.setAnchorPoint(0, 0)
            safeAdd(clip_node, back)
            addMoving(back, true, true)
            self.sun_bg = clip_node
            self.img_bg = sun_bg
        }
        if (self.moon_bg) {
            self.moon_bg.setVisible(false)
        }
        var img_bg = self.img_bg
        img_bg.setVisible(index != null)
        var self = self.sun_bg

        if (self.node_show) {
            self.node_show.removeFromParent(true)
            self.node_show = null
        }
        var buf = null
        var delay = null
        var scale = null
        if (index != null) {
            switch (index) {
                case indexList.allEat:
                    buf = [
                        cc.p(170, -109),
                        cc.p(0, 0),
                        cc.p(-158, -117),
                    ]
                    delay = 0.5
                    scale = 1.25
                    break
                case indexList.partEat:
                    buf = [
                        cc.p(170, 80),
                        cc.p(0, -50),
                        cc.p(-158, -160),
                    ]
                    delay = 0
                    scale = 1.25
                    break
                case indexList.huanEat:
                    buf = [
                        cc.p(170, -109),
                        cc.p(0, 0),
                        cc.p(-158, 117),
                    ]
                    delay = 0
                    scale = 1.0
                    break
            }
            var sun = new cc.Sprite(res.img_sun)
            sun.setScale(0.8)
            var size = sun.getContentSize()
            sun.setPosition(210, 120)
            safeAdd(self, sun)
            var clip = new cc.Sprite(res.img_eat)
            var sunClip = new cc.ClippingNode(clip)
            sunClip.setPosition(size.width / 2, size.height / 2)
            sunClip.setAlphaThreshold(0)
            sunClip.setScale(scale)
            safeAdd(sun, sunClip)
            var nodebs = this.nodebs
            var eat = new cc.Sprite(res.img_eat)
            safeAdd(sunClip, eat)
            eat.setPosition(buf[0])
            eat.setColor(cc.color(0, 0, 0, 255))
            var count = 0
            addShowType({
                item: eat,
                show: "moveTo",
                buf: buf[1],
                time: 3.0,
                fun: function() {
                    addShowType({
                        item: eat,
                        show: "moveTo",
                        buf: cc.p(buf[2]),
                        time: 3.0,
                        delay: delay,
                    })
                }
            })
            self.node_show = sun
        }
    },
    initScene: function() {
        var self = this
        var trueSelf = this
        var timeDevide = 0.01
        var bg = new cc.Sprite(res.rshys_bg)
        bg.setPosition(getMiddle())
        safeAdd(this.inside_node, bg)
        var nodebs = this.nodebs
        var createFirst = function() {
            var node = new cc.Node()
            var self = node
            var mix = 50
            node.setPosition(0, mix)
                //var sun = new cc.Sprite(res.img_sun2)
            var sun = createPlanet({
                time: 18,
                type: "sun",
                radiu: 120,
            })
            sun.setPosition(getMiddle())
            safeAdd(self, sun)
            var light = new ccui.ImageView(res.light)
            light.setPosition(569, 319)
            light.setLocalZOrder(-1)
            self.addChild(light)
            addShowType({
                item: light,
                show: "scaleLoop",
                buf: {
                    from: 0.5,
                    to: 0.6,
                },
                time: 1.0,
                repeat: cc.REPEAT_FOREVER / 2,
            })
            var points = getEllipsePoint({
                a: 354,
                b: 173,
                devide: 1,
                ifRotate: true,
            })
            var ell = drawEllipse({
                buf: points,
                color: cc.color(255, 255, 255, 255),
                seg: 1.0,
            })
            ell.setPosition(getMiddle())
            safeAdd(self, ell)

            //var earth = new cc.Sprite(res.img_earth2)
            var earth = new cc.Node()
            var inearth = new cc.Sprite("#earth01.png")
            inearth.runAction(cc.repeatForever(
                createAnimation({
                    frame: "earth%02d.png",
                    time: 1 / 24,
                    end: 90,
                })
            ))
            inearth.setScale(0.4)
            safeAdd(earth, inearth)
            trueSelf.earth = earth
            safeAdd(self, earth)
            goWithPos({
                    item: earth,
                    posList: points,
                    time: timeDevide,
                    repeat: cc.REPEAT_FOREVER,
                    init: true,
                    rootPos: getMiddle(),
                })
                //var moon = new cc.Sprite(res.img_moon2)
            var moon = createPlanet({
                time: 9,
            })
            var moonPoints = getEllipsePoint({
                a: 105,
                b: 69,
                devide: 1,
                ifRotate: true,
            })
            var moonEll = drawEllipse({
                buf: moonPoints,
                color: cc.color(255, 0, 0, 255),
                seg: 1.0,
            })
            var earthSize = earth.getContentSize()
            var pos = cc.p(earthSize.width / 2, earthSize.height / 2)
            moonEll.setPosition(pos)
            safeAdd(earth, moonEll)
            safeAdd(earth, moon)

            // setFinalScale({
            //     item: moonEll,
            //     scale: 1,
            // })
            // setFinalScale({
            //     item: moon,
            //     scale: 1,
            // })

            goWithPos2({
                item: moon,
                posList: moonPoints,
                time: 0.1 / 12,
                repeat: cc.REPEAT_FOREVER,
                init: true,
                rootPos: pos,
            })
            trueSelf.moon = moon

            var img = new cc.Sprite(res.do_content1)
            img.setPosition(getMiddle(0, -250 - mix))
            safeAdd(node, img)
            return node
        }
        var first = createFirst()
        safeAdd(self, first)

        var btnList = [
            [res.btn_sun_normal, res.btn_sun_select],
            [res.btn_moon_normal, res.btn_moon_select],
        ]

        var createSunEat = function(index) {
            if (first) {
                self.earth.stopAct()
                self.moon.stopAct()
                first.removeFromParent(true)
                first = null
            }
            var current = self.showList[0]
            current.setTexture(current.showImg)
            var dis = self.showList[1]
            dis.setTexture(dis.normalImg)
            var node = self.pastNode
            if (self.changeList) {
                var changeList = self.changeList
                for (var i = 0; i < changeList.length; i++) {
                    changeList[i].removeFromParent(true)
                }
                self.changeList = []
            }
            if (node) {
                node.removeFromParent(true)
                node = null
            }
            var uilist = null
            var itemlist = null
            var clickList = null
            var posList = null
            var json = null
            var imgName = null
            var sunName = null
            switch (index) {
                case 0:
                    uilist = [
                        "node_show",
                        "item1",
                        "item2",
                        "item3",
                        "item4",
                        "click1",
                        "click2",
                        "click3",
                        "click4",
                    ]
                    itemlist = [
                        "item1",
                        "item2",
                        "item3",
                        "item4",
                    ]
                    clickList = [
                        "click1",
                        "click2",
                        "click3",
                        "click4",
                    ]
                    posList = [
                        cc.p(getMiddle(0, -200)),
                        cc.p(getMiddle(200, -200)),
                        cc.p(getMiddle(200, -200)),
                        cc.p(getMiddle(200, -200)),
                        cc.p(getMiddle(200, -200)),
                    ]
                    json = res.sun1
                    imgName = "img1"
                    sunName = "sun1"
                    break
                case 1:
                    uilist = [
                        "node_show",
                        "item1",
                        "item2",
                        "item3",
                        "item4",
                        "item5",
                        "click1",
                        "click2",
                        "click3",
                        "click4",
                        "click5",
                    ]
                    itemlist = [
                        "item1",
                        "item2",
                        "item3",
                        "item4",
                        "item5",
                    ]
                    clickList = [
                        "click1",
                        "click2",
                        "click3",
                        "click4",
                        "click5",
                    ]
                    posList = [
                        cc.p(getMiddle(0, -200)),
                        cc.p(getMiddle(200, -200)),
                        cc.p(getMiddle(200, -200)),
                        cc.p(getMiddle(200, -200)),
                        cc.p(getMiddle(200, -200)),
                        cc.p(getMiddle(200, -200)),
                    ]
                    json = res.sun2
                    imgName = "img2"
                    sunName = "sun2"
                    break
            }
            node = new cc.Node()
            safeAdd(self, node)
            var sun1 = loadNode(json, uilist, "bg")
            safeAdd(node, sun1)

            for (var i = 0; i < itemlist.length; i++) {
                var item = sun1[itemlist[i]]
                var red = item.getChildByName("red")
                var show = item.getChildByName("show")
                item.red = red
                item.show = show
                item.index = i + 1
                red.setVisible(false)
                show.setVisible(false)
                createTouchEvent({
                    item: item,
                    begin: function(data) {
                        var result = judgeOpInPos(data)
                        return result
                    },
                    end: function(data) {
                        var item = data.item
                        node.showIndex(item.index)
                    }
                })
            }
            createCoverMove({
                item: sun1.node_show,
                time: 4.0,
                tex: res.clip_node,
            })
            for (var i = 0; i < clickList.length; i++) {
                var click = sun1[clickList[i]]
                click.index = i + 1
                createTouchEvent({
                    item: click,
                    end: function(data) {
                        var item = data.item
                        node.showIndex(item.index)
                    }
                })
            }

            node.showIndex = function(index) {
                var node = this
                if (!node.font) {
                    var font = new cc.Sprite()
                    node.font = font
                    safeAdd(node, font)
                }
                for (var i = 0; i <= clickList.length; i++) {
                    var click = sun1[sprintf("click%d", i)]
                    if (click) {
                        click.setColor(index == i ? cc.color(255, 255, 0, 255) : cc.color(255, 255, 255, 255))
                    }
                    var item = sun1[sprintf("item%d", i)]
                    if (item) {
                        if (!item.hasChange) {
                            if (!self.changeList) {
                                self.changeList = []
                            }
                            changeFather({
                                item: item.show,
                                father: self,
                            })
                            changeFather({
                                item: item.red,
                                father: self,
                            })
                            self.changeList[self.changeList.length] = item.show
                            self.changeList[self.changeList.length] = item.red
                            item.hasChange = true
                        }
                        item.red.setVisible(index == i)
                        item.show.setVisible(index == i)
                    }
                }
                var font = node.font
                font.setTexture(res[sprintf("%s_font%d", imgName, index)])
                font.setPosition(posList[index])
                if (index == 0) {
                    if (!self.showFirst) {
                        self.showFirst = true
                        nodebs.say({
                            key: sprintf("%s_sound%d", sunName, index),
                            force: true,
                        })
                    }
                } else {
                    nodebs.say({
                        key: sprintf("%s_sound%d", sunName, index),
                        force: true,
                    })
                }
                if (sunName == "sun1") {
                    switch (index) {
                        case 3:
                            trueSelf.createMv(indexList.allEat)
                            break
                        case 4:
                            trueSelf.createMv(indexList.partEat)
                            break
                        default:
                            trueSelf.createMv()
                            break
                    }
                } else {
                    switch (index) {
                        case 4:
                            trueSelf.createMv(indexList.huanEat)
                            break
                        case 5:
                            trueSelf.createMv(indexList.partEat)
                            break
                        default:
                            trueSelf.createMv()
                            break
                    }
                }
            }
            node.showIndex(0)
            node.eatList = []
            var btnEatList = [
                [res.btn_sun2_normal, res.btn_sun2_select],
                [res.btn_sun1_normal, res.btn_sun1_select],
            ]
            for (var i = 0; i < 2; i++) {
                var sp = new cc.Sprite(btnEatList[i][0])
                sp.showImg = btnEatList[i][1]
                sp.normalImg = btnEatList[i][0]
                sp.index = i
                sp.setPosition(350 + i * 150, 580)
                safeAdd(node, sp)
                node.eatList[i] = sp
                createTouchEvent({
                    item: sp,
                    end: function(data) {
                        var item = data.item
                        createSunEat(item.index)
                    }
                })
            }
            var one = node.eatList[0]
            one.setTexture(index == 0 ? one.showImg : one.normalImg)
            var two = node.eatList[1]
            two.setTexture(index == 1 ? two.showImg : two.normalImg)
            self.pastNode = node
        }
        var createMoonEat = function() {
            if (first) {
                self.earth.stopAct()
                self.moon.stopAct()
                first.removeFromParent(true)
                first = null
            }
            if (self.changeList) {
                var changeList = self.changeList
                for (var i = 0; i < changeList.length; i++) {
                    changeList[i].removeFromParent(true)
                }
                self.changeList = []
            }
            if (self.pastNode) {
                self.pastNode.removeFromParent(true)
                self.pastNode = null
            }
            var current = self.showList[1]
            current.setTexture(current.showImg)
            var dis = self.showList[0]
            dis.setTexture(dis.normalImg)

            var uilist = [
                "node_show",
                "item1",
                "item2",
                "item3",
                "item4",
                "click1",
                "click2",
                "click3",
                "click4",
            ]
            var itemlist = [
                "item1",
                "item2",
                "item3",
                "item4",
            ]
            var clickList = [
                "click1",
                "click2",
                "click3",
                "click4",
            ]
            var posList = [
                cc.p(getMiddle(-60, -200)),
                cc.p(getMiddle(200, -200)),
                cc.p(getMiddle(200, -200)),
                cc.p(getMiddle(200, -200)),
                cc.p(getMiddle(200, -200)),
            ]

            node = new cc.Node()
            safeAdd(self, node)
            var sun1 = loadNode(res.moon, uilist, "bg")
            safeAdd(node, sun1)

            for (var i = 0; i < itemlist.length; i++) {
                var item = sun1[itemlist[i]]
                var red = item.getChildByName("red")
                var show = item.getChildByName("show")
                item.red = red
                item.show = show
                item.index = i + 1
                red.setVisible(false)
                show.setVisible(false)
                createTouchEvent({
                    item: item,
                    begin: function(data) {
                        var result = judgeOpInPos(data)
                        return result
                    },
                    end: function(data) {
                        var item = data.item
                        node.showIndex(item.index)
                    }
                })
            }
            createCoverMove({
                item: sun1.node_show,
                time: 4.0,
                tex: res.clip_node,
            })
            for (var i = 0; i < clickList.length; i++) {
                var click = sun1[clickList[i]]
                click.index = i + 1
                createTouchEvent({
                    item: click,
                    end: function(data) {
                        var item = data.item
                        node.showIndex(item.index)
                    }
                })
            }

            node.showIndex = function(index) {
                var node = this
                if (!node.font) {
                    var font = new cc.Sprite()
                    node.font = font
                    safeAdd(node, font)
                }
                for (var i = 0; i <= clickList.length; i++) {
                    var click = sun1[sprintf("click%d", i)]
                    if (click) {
                        click.setColor(index == i ? cc.color(255, 255, 0, 255) : cc.color(255, 255, 255, 255))
                    }
                    var item = sun1[sprintf("item%d", i)]
                    if (item) {
                        if (!item.hasChange) {
                            if (!self.changeList) {
                                self.changeList = []
                            }
                            changeFather({
                                item: item.show,
                                father: self,
                            })
                            changeFather({
                                item: item.red,
                                father: self,
                            })
                            self.changeList[self.changeList.length] = item.show
                            self.changeList[self.changeList.length] = item.red
                            item.hasChange = true
                        }
                        item.red.setVisible(index == i)
                        item.show.setVisible(index == i)
                    }
                }
                var font = node.font
                font.setTexture(res[sprintf("moon_font%d", index)])
                font.setPosition(posList[index])
                nodebs.say({
                    key: sprintf("moon_sound%d", index),
                    force: true,
                })
                switch (index) {
                    case 3:
                        trueSelf.createMoonMv(indexList.moonAllEat)
                        break
                    case 4:
                        trueSelf.createMoonMv(indexList.moonPartEat)
                        break
                    default:
                        trueSelf.createMoonMv()
                        break
                }
            }
            node.showIndex(0)
            self.pastNode = node
        }
        self.showList = []
        for (var i = 0; i < 2; i++) {
            var sp = new cc.Sprite(btnList[i][0])
            sp.showImg = btnList[i][1]
            sp.normalImg = btnList[i][0]
            sp.index = i
            sp.setPosition(80, 450 - i * 120)
            safeAdd(self, sp)
            self.showList[i] = sp
            createTouchEvent({
                item: sp,
                end: function(data) {
                    var item = data.item
                    switch (item.index) {
                        case 0:
                            self.showFirst = false
                            createSunEat(0)
                            break
                        case 1:
                            createMoonEat()
                            break
                    }
                }
            })
        }
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
            sound: res.sound_do1
        })
        for (var i = 0; i <= 4; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("sun1_sound%d", i), //对话标签 之后让人物说话需要用到的参数
                sound: res[sprintf("sun1_sound%d", i)]
            })
        }
        for (var i = 1; i <= 5; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("sun2_sound%d", i), //对话标签 之后让人物说话需要用到的参数
                sound: res[sprintf("sun2_sound%d", i)]
            })
        }
        for (var i = 0; i <= 4; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("moon_sound%d", i), //对话标签 之后让人物说话需要用到的参数
                sound: res[sprintf("moon_sound%d", i)]
            })
        }
    }
})