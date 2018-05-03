//@author mu @16/4/27

var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("tools")
        loadPlist("do_fonts")
        loadPlist("do_results")
        loadPlist("btrj")
    },
    myExit: function() { //退出时调用
        this._super()
    },
    myDelete: function() { //删除时调用
        this._super()
        var self = this
        if (self.biaoge) {
            self.biaoge.removeFromParent(false)
        }
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({
                    key: "do2_sound1"
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
        var self = this
        this.dataControl = {}
        var dataControl = this.dataControl
        dataControl.countRenZhen = 0
        dataControl.countEnd = 0
        this.expCtor({
                vis: false,
                settingData: {
                    pos: cc.p(1080, 580),
                    biaogeFun: function() {
                        var bg = rjdkm_biaoge()
                        safeAdd(self, bg)
                        self.biaoge = bg
                        bg.showBgIndex(1)
                        bg.show()
                    },
                }
            }) //实验模板

        self.initPeople() //创建人物
        self.initScene()
        self.createTool()
        var btn = new ccui.Button(res.btn_jielun_normal, res.btn_jielun_select)
        btn.setPosition(getMiddle(510, 160))
        btn.addClickEventListener(function() {
            if (self.nodebs) {
                self.nodebs.say({
                    key: "do_result_sound",
                })
            }
        })
        safeAdd(self, btn)
        return true
    },
    initScene: function() {
        var self = this
        var desk = new cc.Sprite(res.img_desk)
        desk.setPosition(572, 132)
        safeAdd(self, desk)
    },
    createTool: function() {
        var self = this
        var dataControl = self.dataControl
        var fileList = []
        var numList = [5, 7, 2, 3]
        for (var i = 0; i < numList.length; i++) {
            fileList[i] = sprintf("tools_%02d.png", numList[i])
        }
        var reSetHand = function() {
            if (self.nieziPan) {
                var pan = self.nieziPan
                pan.niezi.setVisible(true)
                pan.isHand = false
                if (pan.hand) {
                    var hand = pan.hand
                    addShowType({
                        item: hand,
                        show: "fadeOut",
                        time: 0.3,
                    })
                }
            }
        }
        var judgeEnd = function(hand) {
            var item = hand.niezi.item
            var pos = getWorldPos(item)
            var bingtang = self.bt
            var list = self.shaobeiList
            if (bingtang) {
                var result = judgeInside({
                    item: bingtang,
                    pos: pos,
                    mix: cc.p(1.2, 3.0)
                })
                if (result) {
                    if (!item.bt) {
                        var bt = new cc.Sprite("#btrj_01.png")
                        safeAdd(item, bt)
                        bt.setPosition(1.27, 71.48)
                        item.bt = bt
                    }
                }
            }
            if (item.bt && list) {
                for (var i = 0; i < list.length; i++) {
                    var sb = list[i]
                    if (!sb.hasBt) {
                        var result = sb.judgePos(pos)
                        if (result) {
                            sb.hasBt = true
                            var worldPos = sb.convertToNodeSpace(getWorldPos(item))
                            item.bt.setPosition(cc.p(worldPos.x - 2, worldPos.y + 72))
                            item.bt.setLocalZOrder(-1)
                            safeAdd(sb, item.bt)
                            sb.bt = item.bt
                            sb.bt.sb = sb
                            item.bt = null
                            reSetHand()
                            var bt = sb.bt
                            bt.index = sb.index
                            var pos = bt.getPosition()
                            var target = cc.p(pos.x, 95)
                            addShowType({
                                item: bt,
                                show: "moveTo",
                                buf: target,
                                time: 0.3,
                                fun: function(item) {
                                    var jxmb = createJXMB()
                                    jxmb.setPosition(item.index == 0 ? cc.p(210, 340) : cc.p(360, 340))
                                    safeAdd(self, jxmb)
                                    if (!self.jxmbList) {
                                        self.jxmbList = []
                                    }
                                    self.jxmbList[item.index] = jxmb
                                    jxmb.start()
                                    item.ani = createControlAni({
                                        frame: "btrj_%02d.png",
                                        end: 84,
                                        time: item.index == 0 ? 0.22 : 0.08,
                                        item: item,
                                    })
                                    var sb = item.sb
                                    sb.ani = item.ani
                                    dataControl.countRenZhen++
                                        item.ani.changeStatus("forward", function() {
                                            jxmb.end()
                                            dataControl.countEnd++
                                                sb.finish = true
                                            if (dataControl.countEnd == 2 && dataControl.countRenZhen == 2) {
                                                var sp = new cc.Sprite("#img_result2.png")
                                                sp.setPosition(getMiddle(150, 50))
                                                safeAdd(self, sp)
                                                self.nodebs.say({
                                                    key: "do2_sound2",
                                                    force: true,
                                                })
                                                addShowType({
                                                    item: sp,
                                                    show: "fadeIn",
                                                    time: 0.5,
                                                })
                                            }
                                        })
                                }
                            })
                        }
                    }
                }
            }
        }
        var toolbtn = createTool({
            pos: cc.p(70, 480),
            nums: 4,
            tri: "right",
            showTime: 0.3,
            itemScale: 0.8,
            circlepos: cc.p(0, 10),
            devide: cc.p(1, 1.1),
            moveTime: 0.2,
            father: self,
            ifcircle: true,
            circleScale: 0.7,
            files: fileList,
            ifFrame: true,
            fileAnchor: cc.p(0.5, 0),
            itempos: cc.p(0, -55),
            itemScale: [1.1, 1.1, 0.7, 0.7],
            gets: [null],
            clickfun: function(data) {
                var index = data.index
                var sp = data.sp
                var pos = data.pos
                if (!self.clickJudge()) {
                    return false
                }
                switch (index) {
                    case 0:
                    case 1:
                    case 2:
                        return false
                        break
                    case 3:
                        if (!sp.isHand) {
                            if (!sp.hand) {
                                var niezi = createNiezi()
                                niezi.setRotation(132)
                                var hand = createHand({
                                    item: niezi,
                                })
                                hand.setLocalZOrder(10)
                                hand.setScale(0.7)
                                niezi.setScale(1 / 0.8)
                                sp.hand = hand
                                hand.niezi = niezi
                                safeAdd(self, hand)
                                createTouchEvent({
                                    item: hand,
                                    autoMove: true,
                                    end: function(data) {
                                        judgeEnd(data.item)
                                    }
                                })
                            }
                            sp.niezi.setVisible(false)
                            var hand = sp.hand
                            hand.setOpacity(255)
                            hand.setPosition(pos)
                            hand.setVisible(true)
                            sp.isHand = true
                        } else {
                            return false
                        }
                        break
                }
                return true
            },
            movefun: function(data) {
                var index = data.index
                var sp = data.sp
                var pos = data.pos
                var delta = data.delta
                switch (index) {
                    case 0:
                    case 1:
                    case 2:
                        sp.x += delta.x
                        sp.y += delta.y
                        break
                    case 3:
                        if (sp.isHand) {
                            sp.hand.x += delta.x
                            sp.hand.y += delta.y
                        } else {
                            sp.x += delta.x
                            sp.y += delta.y
                        }
                        break
                }
            },
            firstClick: function(data) {
                var index = data.index
                var sp = data.sp
                var pos = data.pos
                if (!self.clickJudge()) {
                    return null
                }
                switch (index) {
                    case 0: //水
                    case 1:
                        sp = createShaobei({
                            hot: index == 1,
                        })
                        sp.setWater(70)
                        if (!self.shaobeiList) {
                            self.shaobeiList = []
                        }
                        self.shaobeiList[self.shaobeiList.length] = sp
                        break
                    case 2: //冰糖
                        sp = createInTool()
                        sp.addItem(new cc.Sprite("#img_3.png"))
                        sp.setAnchorPoint(0.5, 0)
                        self.bt = sp
                        break
                    case 3: //镊子
                        var niezi = createNiezi()
                        niezi.setRotation(172)
                        niezi.setScale(0.8)
                        sp = createInTool(niezi)
                        sp.niezi = niezi
                        sp.setAnchorPoint(0.5, 0)
                        self.nieziPan = sp
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
                    case 1:
                        sp.setPosition(index == 0 ? cc.p(200, 180) : cc.p(350, 180))
                        break
                    case 2:
                        sp.setPosition(500, 120)
                        break
                    case 3:
                        sp.setPosition(650, 120)
                        if (sp.isHand) {
                            judgeEnd(sp.hand)
                        }
                        break
                }
            },
            backfun: function(data) {
                var sp = data.sp
                var pos = data.pos
                var index = data.index
                switch (index) {
                    case 0:
                    case 1:
                        sp.setPosition(index == 0 ? cc.p(200, 180) : cc.p(350, 180))
                        break
                    case 2:
                        sp.setPosition(500, 120)
                        break
                    case 3:
                        sp.setPosition(650, 120)
                        break
                }
                return false
            }
        })
        this.toolbtn = toolbtn
        this.addChild(toolbtn)
    },
    clickJudge: function() {
        var self = this
        var dataControl = self.dataControl
        if (dataControl.countEnd == 2) {
            self.nodebs.say({
                key: "do_tips2",
                force: true,
                sameStop: true,
            })
            return false
        }
        if (dataControl.countRenZhen == 2) {
            self.nodebs.say({
                key: "do_tips1",
                force: true,
                sameStop: true,
            })
            return false
        }
        return true
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        var soundList = [
            "do2_sound1",
            "do2_sound2",
            "do_result_sound",
            "do_tips1",
            "do_tips2"
        ]
        var imgList = [
            "#do2_img1.png",
            null,
            res.rjdkm_result,
            "#do_tips1.png",
            "#do_tips2.png",
        ]
        for (var i = 0; i < soundList.length; i++) {
            var off = soundList[i] != "do_tips1" ? cc.p(0, 0) : cc.p(0, -30)
            var id = soundList[i] != "do_result_sound" ? "normal" : "result"
            if (id == "result") {
                off = cc.p(10, 10)
            }
            addContent({
                people: this.nodebs,
                key: soundList[i], //对话标签 之后让人物说话需要用到的参数
                img: imgList[i], //图片和声音文件
                sound: res[soundList[i]],
                offset: off,
                id: id,
            })
        }
    }
})