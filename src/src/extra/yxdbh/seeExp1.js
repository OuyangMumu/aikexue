//@author mu @16/4/27

var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("yxdbh_yq")
    },
    myExit: function() { //退出时调用
        this._super()
    },
    myDelete: function() { //删除时调用
        this._super()
    },
    preExit: function() { //退出准备
        var self = this
        if (self.sunLight) {
            self.sunLight.setVisible(false)
        }
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: "sound0"
                })
            })
        }
    },
    reEnter: function() {
        this._super()
        var self = this
        if (self.sunLight) {
            self.sunLight.setVisible(true)
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
        var trueSelf = this
        var nodebs = this.nodebs
        var self = this.inside_node
        var bg = new cc.Sprite(res.yxbh_bg)
        var mix = cc.p(20, 50)
        bg.setPosition(getMiddle())
        safeAdd(self, bg)
        var timeDevide = 0.01
        var createSun = function() {
            var sun = new cc.Sprite(res.sun)
            sun.setScaleY(1.3)
            sun.setPosition(1200, 320)
            var light = new ccui.ImageView(res.light)
            light.setPosition(279, 318)
            light.setLocalZOrder(-1)
            sun.addChild(light)
            trueSelf.sunLight = light
            addShowType({
                item: light,
                show: "scaleLoop",
                buf: {
                    from: 2.2,
                    to: 2.6,
                },
                time: 1.0,
                repeat: cc.REPEAT_FOREVER / 2,
            })
            safeAdd(self, sun)
        }
        var createEarth = function() {
            var clip = new cc.ClippingNode(new cc.Sprite(res.yxbh_clip))
            clip.setAlphaThreshold(0)
            var earth = new cc.Sprite()
            var ani = cc.repeatForever(createAnimation({
                ifFile: true,
                frame: "yxbh_dq_%03d",
                end: 180,
                time: 1 / 12,
            }))
            earth.runAction(ani)
            clip.setScale(0.8)
            clip.setPosition(getMiddle(mix.x, mix.y))
            safeAdd(clip, earth)
            var cover = new cc.Sprite(res.cover)
            safeAdd(clip, cover)
            safeAdd(self, clip)
        }
        var createMoon = function() {
            var points = getEllipsePoint({
                a: 310.8059 * 0.9,
                b: 191.7270 * 0.9,
                devide: 1,
                ifRotate: true,
            })
            var ell = drawEllipse({
                buf: points,
                color: cc.color(245, 180, 0, 255),
                seg: 2.0,
            })
            ell.setPosition(getMiddle(mix.x, mix.y))
            safeAdd(self, ell)
            var moon = new cc.Sprite()
            var ani = cc.repeatForever(createAnimation({
                frame: "yxbh_yq_%03d.png",
                end: 180,
                time: 1 / 12,
            }))
            moon.runAction(ani)
            var dateList = [
                "初一", //新月
                "初二",
                "初三",
                "初四",
                "初五",
                "初六",
                "初七",
                "初八", //上弦月

                "初九",
                "初十",
                "十一",
                "十二",
                "十三",
                "十四",
                "十五", //满月

                "十六",
                "十七",
                "十八",
                "十九",
                "廿十",
                "廿一",
                "廿二",
                "廿三", //下弦月

                "廿四",
                "廿五",
                "廿六",
                "廿七",
                "廿八",
                "廿九",
                "三十",
                "初一",
            ]
            var label = new cc.LabelTTF(null, null, 24)
            label.setPosition(130, 320)
            safeAdd(self, label)
            goWithPos({
                item: moon,
                posList: points,
                time: timeDevide,
                repeat: cc.REPEAT_FOREVER,
                init: true,
                rootPos: getMiddle(mix.x, mix.y),
                fun: function(index) {
                    if (self.yx) {
                        var yx = self.yx
                        switch (Math.floor((index - 1) / 90)) {
                            case 0:
                                var percent = index / 90
                                yx.run1(percent)
                                label.setString(sprintf("农历日期:%s", dateList[Math.floor(percent * 7)]))
                                break
                            case 1:
                                var percent = (index - 90) / 90
                                yx.run2(percent)
                                label.setString(sprintf("农历日期:%s", dateList[Math.floor(percent * 7) + 7]))
                                break
                            case 2:
                                var percent = (index - 180) / 90
                                yx.run3(percent)
                                label.setString(sprintf("农历日期:%s", dateList[Math.floor(percent * 8) + 14]))
                                break
                            case 3:
                                var percent = (index - 270) / 90
                                yx.run4(percent)
                                label.setString(sprintf("农历日期:%s", dateList[Math.floor(percent * 7) + 23]))
                                break
                        }
                    }
                }
            })
            safeAdd(self, moon)
            var modify = 50
            var fontList = [{
                name: "新月",
                index: 360,
                modify: cc.p(modify + 30, 0),
                date: 0,
            }, {
                name: "上弦月",
                index: 90,
                modify: cc.p(0, modify - 5),
                date: 7,
            }, {
                name: "满月",
                index: 180,
                modify: cc.p(-modify - 30, 0),
                date: 14,
            }, {
                name: "下弦月",
                index: 270,
                modify: cc.p(0, -modify - 30),
                date: 22,
            }, ]
            createTouchEvent({
                item: moon,
                end: function(data) {
                    var item = data.item
                    item.changeAct()
                }
            })
            var beside = getMiddle(mix.x, mix.y)
            for (var i = 0; i < fontList.length; i++) {
                var font = new cc.LabelTTF(fontList[i].name, null, 30)
                var point = points[fontList[i].index]
                font.setPosition(point.x + beside.x + fontList[i].modify.x, point.y + beside.y + fontList[i].modify.y)
                safeAdd(self, font)
                font.index = i
                createTouchEvent({
                    item: font,
                    begin: function(data) {
                        var item = data.item
                        if (self.curDate) {
                            self.curDate.setVisible(false)
                        }
                        item.setColor(cc.color(99, 98, 191, 255))
                        if (!item.date) {
                            var inFont = new cc.LabelTTF(dateList[fontList[item.index].date], null, 24)
                            var size = item.getContentSize()
                            inFont.setPosition(size.width / 2, size.height)
                            inFont.setAnchorPoint(0.5, 0)
                            safeAdd(item, inFont)
                            item.date = inFont
                        }
                        item.date.setVisible(true)
                        self.curDate = item.date
                        return true
                    },
                    end: function(data) {
                        var item = data.item
                        item.setColor(cc.color(255, 255, 255, 255))
                        nodebs.say({
                            key: sprintf("sound%d", item.index + 1),
                            force: true,
                        })
                        self.showIndex(item.index + 1)
                        moon.goTo({
                            index: fontList[item.index].index,
                        })
                    }
                })
            }
        }
        var createYX = function() {
            var moon = new cc.Sprite(res.img_moon)
            moon.setPosition(130, 450)
            moon.setScale(0.5)
            safeAdd(self, moon)
            var size = moon.getContentSize()
            var yx = new cc.Node()
            yx.setPosition(size.width / 2, size.height / 2)
            safeAdd(moon, yx)
            var leftClip = new cc.Sprite(res.yxclip)
            leftClip.setFlippedX(true)
            leftClip.setAnchorPoint(1, 0.5)
            var left = new cc.ClippingNode()
            left.setStencil(leftClip)
            left.setAlphaThreshold(0)
            safeAdd(yx, left)
            var leftIn = new cc.Sprite(res.yxclip)
            leftIn.setAnchorPoint(1, 0.5)
            leftIn.setFlippedX(true)
            safeAdd(left, leftIn)

            var rightClip = new cc.Sprite(res.yxclip)
            rightClip.setAnchorPoint(0, 0.5)
            var right = new cc.ClippingNode()
            right.setStencil(rightClip)
            right.setAlphaThreshold(0)
            safeAdd(yx, right)
            var rightIn = new cc.Sprite(res.yxclip)
            rightIn.setAnchorPoint(0, 0.5)
            safeAdd(right, rightIn)
            var time = 90 * timeDevide
            var run1 = function(percent) {
                leftClip.setScaleX(0)
                left.setInverted(true)
                rightClip.setScaleX(1 - percent)
                right.setInverted(false)
                    // addShowType({
                    //     item: rightClip,
                    //     show: "scaleTo",
                    //     buf: cc.p(0, 1),
                    //     time: time,
                    //     fun: function() {
                    //         if (fun) {
                    //             fun()
                    //         }
                    //     }
                    // })
            }
            var run2 = function(percent) {
                right.setInverted(true)
                rightClip.setScaleX(1)
                leftClip.setScaleX(percent)
                left.setInverted(true)
                    // addShowType({
                    //     item: leftClip,
                    //     show: "scaleTo",
                    //     buf: cc.p(1, 1),
                    //     time: time,
                    //     fun: function() {
                    //         if (fun) {
                    //             fun()
                    //         }
                    //     }
                    // })
            }
            var run3 = function(percent) {
                right.setInverted(true)
                rightClip.setScaleX(1 - percent)
                leftClip.setScaleX(0)
                left.setInverted(false)
                    // addShowType({
                    //     item: rightClip,
                    //     show: "scaleTo",
                    //     buf: cc.p(0, 1),
                    //     time: time,
                    //     fun: function() {
                    //         if (fun) {
                    //             fun()
                    //         }
                    //     }
                    // })
            }
            var run4 = function(percent) {
                leftClip.setScaleX(percent)
                left.setInverted(false)
                right.setInverted(false)
                rightClip.setScaleX(1)
                    // addShowType({
                    //     item: leftClip,
                    //     show: "scaleTo",
                    //     buf: cc.p(1, 1),
                    //     time: time,
                    //     fun: function() {
                    //         if (fun) {
                    //             fun()
                    //         }
                    //     }
                    // })
            }
            yx.run1 = run1
            yx.run2 = run2
            yx.run3 = run3
            yx.run4 = run4
            return yx
                // var loop = function(fun) {
                //     run1(function() {
                //         run2(function() {
                //             run3(function() {
                //                 run4(function() {
                //                     loop()
                //                 })
                //             })
                //         })
                //     })
                // }
                // loop()
        }
        var scaleList = [
            cc.p(1.2, 1.3),
            cc.p(1.2, 1.3),
            cc.p(1.2, 1.55),
        ]
        var posList = [
            cc.p(0, -30),
            cc.p(0, -20),
            cc.p(0, -20)
        ]
        for (var i = 0; i < 3; i++) {
            var btn = new ccui.Button(res[sprintf("btn%d_normal", i + 1)], res[sprintf("btn%d_select", i + 1)])
            btn.setPosition(getMiddle(180 + i * 110, 270))
            btn.index = i
            safeAdd(self, btn)
            btn.addClickEventListener(function(btn) {
                if (!btn.img) {
                    var img = createShowImg({
                        img: res[sprintf("img_font%d", btn.index + 1)],
                        bgInfo: {
                            bg: res.img_font_bg,
                            offx: 0.1,
                            offx2: 0.2,
                            offy: 0.7,
                            offy2: 0.1,
                            sizeScale: scaleList[btn.index],
                            posOff: posList[btn.index],
                        },
                        closeOff: cc.p(-50, -40),
                        clsScale: 0.8,
                        inFun: function() {
                            nodebs.say({
                                key: sprintf("sound_font%d", btn.index + 1),
                                force: true,
                            })
                        },
                        outFun: function() {
                            nodebs.stopSay()
                        }
                    })
                    safeAdd(self, img)
                    btn.img = img
                }
                var img = btn.img
                if (self.pastImg == img) {
                    img.show()
                } else {
                    if (self.pastImg) {
                        self.pastImg.show(false, true)
                    }
                    img.show(true)
                    self.pastImg = img
                }
            })
        }
        createSun()
        createEarth()
        createMoon()
        self.showIndex = function(index) {
            if (!self[sprintf("show%d", index)]) {
                var sp = new cc.Sprite(res[sprintf("img_show%d", index)])
                sp.setPosition(getMiddle(20, -265))
                safeAdd(self, sp)
                self[sprintf("show%d", index)] = sp
            }
            if (self.curSp) {
                self.curSp.setVisible(false)
            }
            var sp = self[sprintf("show%d", index)]
            sp.setVisible(true)
            self.curSp = sp
        }
        self.showIndex(0)
        self.yx = createYX()
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        for (var i = 0; i <= 4; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("sound%d", i), //对话标签 之后让人物说话需要用到的参数
                sound: res[sprintf("sound%d", i)]
            })
        }
        for (var i = 1; i <= 3; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("sound_font%d", i), //对话标签 之后让人物说话需要用到的参数
                sound: res[sprintf("sound_font%d", i)]
            })
        }

        // addContent({
        //     people: this.nodebs,
        //     key: "Next",
        //     img: res.do2_content_2,
        //     sound: res.do2_content_2_sound,
        //     offset: cc.p(130, 40) //图片偏移值
        // })
        // addContent({
        //     people: this.nodebs,
        //     key: "Result",
        //     img: res.do2_content_3,
        //     sound: res.do2_content_3_sound,
        //     id: "result", //结论的时候的特殊标签
        //     offset: cc.p(85, 30)
        // })
    }
})