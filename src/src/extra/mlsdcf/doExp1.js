//@author mu @16/4/27

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("dotool")
    },
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
            this.nodebs.show()
        }
        if (self.toolbtn) {
            self.toolbtn.show()
        }
    },
    showFont: function(index) {
        var self = this
        if (!self.font) {
            var font = new cc.Sprite()
            safeAdd(self, font)
            font.setScale(0.5)
            self.font = font
        }
        var font = self.font
        if (index == 4) {
            font.setPosition(getMiddle(-200, 40))
        } else {
            font.setPosition(getMiddle(-200, 60))
        }
        font.setSpriteFrame(sprintf("show%d.png", index))
    },
    createTool: function() {

        var self = this
        var fileList = []
        for (var i = 0; i < 5; i++) {
            fileList[i] = sprintf("tool%d.png", i + 1)
        }
        var act = false
        var judgeReAdd = function() {
            if (!act) {
                if (self.sb && self.mls) {
                    reAdd(self.sb)
                    reAdd(self.mls)
                    act = true
                }
            }
        }
        var outJudge = function(item) {
            switch (item.index) {
                case 0:
                    item.setPosition(800, 130)
                    self.showFont(2)
                    removeMoving(item)
                    break
                case 1:
                    var off = null
                    var final = null
                    if (item.link) {
                        off = cc.p(item.x - item.link.x, item.y - item.link.y)
                    }
                    final = cc.p(819, 294)
                    if (self.tp && self.tp.addItem({
                            item: item,
                            judge: true,
                            noFather: true,
                            needpos: final,
                            judgeOn: true,
                        })) {
                        if (!self.show3) {
                            self.showFont(3)
                            self.show3 = true
                        }
                        item.canAdd = true
                        self.canSalt = true
                        if (item.link && !self.show4) {
                            self.showFont(4)
                            self.show4 = true
                        }
                        if (self.isGetSalt) {
                            self.showFont(5)
                        }
                    } else {
                        final = cc.p(530, 144)
                        item.setPosition(final)
                    }
                    if (item.link) {
                        item.link.setPosition(final.x - off.x, final.y - off.y)
                        self.pyActItem({
                            item: item.link,
                            act: true,
                        })
                    }
                    if (!item.pyWater) {
                        var water = self.addWater({
                            item: item.water,
                            addWall: 70,
                        })
                        item.pyWater = water
                    }
                    item.link = null
                    judgeReAdd()
                    break
                case 2:
                    item.setPosition(119, 115)
                    removeMoving(item)
                    break
                case 3:
                    item.setPosition(287, 114)
                    break
                case 4:
                    if (self.sb && self.sb.canAdd && !self.sb.inTp) {
                        var sb = self.sb
                        var result = judgeItemCrash({
                            item1: item,
                            item2: sb.judgeAll
                        })
                        if (result) {
                            item.inBox = true
                            self.pyActItem({
                                item: item,
                                act: true,
                            })
                            if (self.tp && self.sb.inTp) {
                                self.tp.addWeight(30, true)
                            }
                            sb.weight += 30
                            item.setLocalZOrder(1)
                            reAdd(item)
                            removeMoving(item)
                        } else {
                            item.inBox = false
                            item.setPosition(385, 96)
                        }
                    } else {
                        item.inBox = false
                        item.setPosition(385, 96)
                    }
                    judgeReAdd()
                    break
            }
        }

        var itemList = []

        var createIndex = function(index) {
            var sp = null
            switch (index) {
                case 0:
                    sp = createDZTP()
                    break
                case 1:
                    sp = createShaobei({
                        tri: "right",
                        height: 100,
                    })
                    sp.weight = 120
                    sp.saltCount = 0
                    sp.showDown = function(fun) {
                        var sp = this
                        if (!sp.down) {
                            var down = new cc.Sprite()
                            safeAdd(sp.back, down)
                            sp.down = down
                            down.setPosition(cc.p(110, 120))
                            down.setScale(1.8)
                        }
                        var down = sp.down
                        down.setVisible(true)
                        down.runAction(createAnimation({
                            frame: "drop_%02d.png",
                            time: 2 / 24,
                            end: 14,
                            fun: function() {
                                sp.weight += 6;
                                sp.saltCount++;
                                if (sp.inTp) {
                                    self.tp.addWeight(6, true)
                                }
                                down.setVisible(false)
                                sp.jiaoBan({
                                    blb: true,
                                })
                                addTimer({
                                    fun: function(key) {
                                        removeTimer(key)
                                        sp.stopJiaoBan()
                                        if (fun) {
                                            fun()
                                        }
                                    },
                                    time: 1.5,
                                })
                            }
                        }))
                    }
                    break
                case 2:
                    sp = new cc.Sprite("#salt_01.png")
                    sp.setAnchorPoint(cc.p(0.3, 0.3))
                    sp.opJudge = true
                    var judge = createLayout({
                        size: cc.size(129, 58),
                    })
                    safeAdd(sp, judge)
                    sp.judge = judge
                    break
                case 3:
                    sp = new cc.Sprite("#img_empty.png")
                    break
                case 4:
                    sp = self.addItem({
                        tex: "#img_potato.png",
                        mass: 0.3,
                        disAct: true,
                        type: "box",
                    })
                    self.pyActItem({
                        item: sp,
                        act: false,
                    })
                    break
            }
            sp.setLocalZOrder(index + 1)
            itemList[index] = sp
            sp.setVisible(false)
            safeAdd(self, sp)
        }

        for (var i = 0; i <= 4; i++) {
            createIndex(i)
        }

        var toolbtn = createTool({
            pos: cc.p(70, 480),
            nums: 5,
            tri: "right",
            showTime: 0.3,
            itempos: cc.p(0, -55),
            circlepos: cc.p(0, 10),
            devide: cc.p(1, 1.1),
            moveTime: 0.2,
            father: self,
            ifcircle: true,
            ifFrame: true,
            circleScale: 0.7,
            fileAnchor: cc.p(0.5, 0),
            itemScale: 0.7,
            files: fileList,
            gets: [null, null, null, null, null],
            firstClick: function(data) {
                var index = data.index
                var sp = null
                sp = itemList[index]
                sp.setVisible(true)
                switch (index) {
                    case 0:
                        self.tp = sp
                        break
                    case 1:
                        self.sb = sp
                        break
                    case 2:
                        self.salt = sp
                        break
                    case 3:
                        break
                    case 4:
                        self.mls = sp
                        break
                }
                return sp
            },
            clickfun: function(data) {
                var item = data.sp
                var index = data.index
                switch (index) {
                    case 1:
                        if (self.tp) {
                            self.tp.disWeight({
                                item: item,
                                noFather: true,
                            })
                        }
                        if (item.pyWater) {
                            self.removeWater(item.pyWater)
                            item.pyWater = null
                        }
                        if (self.mls && self.mls.inBox) {
                            var mls = self.mls
                            self.pyActItem({
                                item: self.mls,
                                act: false,
                            })
                            item.link = mls
                        } else {
                            item.link = null
                        }
                        break
                    case 4:
                        if (item.inBox) {
                            item.inBox = false
                            var sb = self.sb
                            sb.weight -= 30
                            if (sb.inTp) {
                                self.tp.addWeight(-30, true)
                            }
                        }
                        self.pyActItem({
                            item: item,
                            act: false,
                        })
                        break
                }
                return true
            },
            movefun: function(data) {
                var item = data.sp
                var index = data.index
                data.item = item
                    //data.show = true
                switch (index) {
                    case 3:
                        if (self.salt && self.canSalt && !item.getSalt && !self.upSalting) {
                            var salt = self.salt
                            var result = judgeItemCrash({
                                item1: item,
                                item2: salt.judge
                            })
                            if (result) {
                                self.upSalting = true
                                item.setVisible(false)
                                salt.runAction(
                                    createAnimation({
                                        frame: "salt_%02d.png",
                                        end: 12,
                                        origin: true,
                                        time: 1 / 24,
                                        fun: function() {
                                            self.upSalting = false
                                            item.getSalt = true
                                            item.setVisible(true)
                                            item.setSpriteFrame("img_full.png")
                                        }
                                    })
                                )
                            }
                        }
                        if (self.sb && item.getSalt && !self.downSalting && self.canSalt && !self.sb.inTp && self.mls && self.mls.inBox && self.show4) {
                            self.isGetSalt = true
                            var sb = self.sb
                            var result = judgeItemCrash({
                                item1: item,
                                item2: sb.judge,
                            })
                            if (result) {
                                if (sb.saltCount >= 5) {
                                    if (self.canShow) {
                                        AddDialog("Tips", {
                                            res: "img_tip2.png",
                                            face: 2,
                                            type: ccui.Widget.PLIST_TEXTURE,
                                            modify: cc.p(10, 0),
                                            closeBack: function() {
                                                self.canShow = true
                                            }
                                        })
                                        self.canShow = false
                                    }
                                } else {
                                    self.downSalting = true
                                    item.setVisible(false)
                                    sb.showDown(function() {
                                        self.downSalting = false
                                        item.getSalt = false
                                        item.setVisible(true)
                                        item.setSpriteFrame("img_empty.png")
                                        var mls = self.mls
                                        if (mls) {
                                            mls.setMass(mls.getMass() - 0.04)
                                            if (mls.inBox) {
                                                self.pyActItem({
                                                    item: mls,
                                                    act: false,
                                                })
                                                self.pyActItem({
                                                    item: mls,
                                                    act: true,
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        }
                        break
                    case 4:
                        var sb = self.sb
                        if (sb) {
                            var width = sb.getContentSize().width
                            if (item.inBox) {
                                data.left = sb.x - width / 2 + 30
                                data.right = sb.x + width / 2 - 60
                                data.bottom = sb.y - 70
                            }
                        }
                        break
                }
                judgeMove(data)
                if (item.link) {
                    data.item = item.link
                    judgeMove(data)
                }
            },
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
                                json: res.mls_bg,
                                inputNum: 10,
                            })
                            self.biaoge = bg
                            safeAdd(self, bg)
                        }
                        self.biaoge.show()
                    },
                }
            }) //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        self.showFont(1)
        var sp = new cc.Sprite(res.img_desk)
        sp.setPosition(571, 80)
        safeAdd(self, sp)
        self.canShow = true
        createWaterPhy({
            layer: self,
            //showDebug: true,
        })
        self.actPys(true)
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
    }
})