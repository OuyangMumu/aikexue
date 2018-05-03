//@author mu @16/4/27
var itemKey = {
    fqsb: 0,
    ld: 1,
    tdn: 2,
    ys: 3,
    sjj: 4,
    jjd: 5,
}

var posList = [
    cc.p(400, 130),
    cc.p(680, 130)
]

var itemScale = 0.7
var actTimes = 7

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
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: "sound1"
                })
            })
        }
        if (self.toolbtn) {
            self.toolbtn.show()
        }
    },
    judgeTips: function(index) {
        var self = this
        if (index == null) {
            switch (self.curMove) {
                case 0:
                    index = 7
                    break
                case 1:
                    index = 8
                    break
                case 2:
                    index = 9
                    break
            }
        }
        if (index != null) {
            var dialog = AddDialog("Tips", {
                res: res[sprintf("content%d", index)],
                face: 2,
                diaScale: 0.8,
            })
            return false
        }
        return true
    },
    dataControl: {},
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
        this.expCtor() //实验模板
        this.dataControl = {}
        var self = this
        self.curMove = 0
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        self.createTool()
        var btnFind = new ccui.Button(res.btn_get_normal, res.btn_get_select)
        btnFind.setPosition(1080, 480)
        btnFind.setVisible(false)
        safeAdd(self, btnFind)
        btnFind.addClickEventListener(function() {
            self.nodebs.say({
                key: "sound5",
                force: true,
            })
        })
        self.btnFind = btnFind

        return true
    },
    getItem: function(key) {
        var self = this
        var node = null
        var uilist = []
        switch (key) {
            case itemKey.fqsb:
                uilist = [
                    "item_td",
                    "item_fqj",
                    "item_fqld",
                    "judge",
                    "front",
                    "item_tdn",
                    "item_act",
                    "item_fqz",
                    "item_act",
                    "item_qp",
                    "item_fqd"
                ]
                node = loadNode(res.do1, uilist, "item_sb")
                node.item_td.setVisible(false)
                node.item_fqld.setVisible(false)
                node.item_tdn.setVisible(false)
                node.item_fqz.setVisible(false)
                node.item_act.setVisible(false)
                node.item_fqd.setVisible(false)
                node.setLocalZOrder(3)
                break
            case itemKey.ld:
                uilist = [
                    "judge"
                ]
                node = loadNode(res.do1, uilist, "item_ld")
                break
            case itemKey.tdn:
                uilist = [
                    "item_td",
                    "item_fqj",
                    "item_fqld",
                    "judge",
                    "front",
                    "item_tdn",
                    "item_fqz",
                    "item_act",
                    "item_fqd"
                ]
                node = loadNode(res.do1, uilist, "item_sb")
                node.item_fqj.setVisible(false)
                node.item_fqld.setVisible(false)
                node.item_tdn.setVisible(false)
                node.item_fqz.setVisible(false)
                node.item_act.setVisible(false)
                node.item_fqd.setVisible(false)
                break
            case itemKey.ys:
                node = new cc.Sprite(res.putitem_01)
                break
            case itemKey.sjj:
                uilist = [
                    "back",
                    "front",
                    "judge",
                ]
                node = loadNode(res.do1, uilist, "item_sjj")
                node.setLocalZOrder(2)
                self.sjj = node
                break
            case itemKey.jjd:
                if (self.curMove == 3) {
                    node = createJJD({
                        judgeBeforeDgFun: function() {
                            if (self.curMove == 3) {
                                self.judgeTips(6)
                            }
                        }
                    })
                    node.setCanClick(false)
                } else {
                    node = createJJD()
                }
                node.fireFunc = function() {
                    self.jjd.setCanClick(false)
                    var fqz = self.fqsb.item_fqz
                    var fqd = self.fqsb.item_fqd
                    var act = self.fqsb.item_act
                    var upTuDou = self.fqsb.upTuDou
                    fqz.setScaleY(0)
                    fqd.setScaleY(0)
                    fqd.setVisible(true)
                    fqz.setVisible(true)

                    var particle_ls = self.createNewWater({
                        total: 100,
                        res: res.img_ball,
                        scale: 0.15,
                        scalevar: 0,
                        width: 223,
                        height: 132,
                        time: 1.0,
                        minx: 20,
                        miny: 100,
                        xvar: 10,
                        yvar: 20,
                        finaly: 300,
                        finalTime: 2.0,
                        finalScale: 0.6,
                        finalScaleVar: 0.05,
                    })
                    particle_ls.setPosition(0, 0)
                    safeAdd(self.fqsb.item_qp, particle_ls)
                    self.particle = particle_ls

                    addShowType({
                        item: fqd,
                        show: "scaleTo",
                        buf: cc.p(1, 1),
                        time: 2.0,
                        delay: 2.0,
                        fun: function() {
                            addShowType({
                                item: fqz,
                                show: "scaleTo",
                                buf: cc.p(1, 1),
                                time: 3.0,
                                fun: function() {
                                    act.setVisible(true)
                                    upTuDou.setVisible(false)
                                    self.finishFire = true
                                    act.runAction(createAnimation({
                                        frame: "explode_%02d",
                                        ifFile: true,
                                        end: 52,
                                        time: 1 / 24,
                                        fun: function() {
                                            self.btnFind.setVisible(true)
                                            self.nodebs.say({
                                                key: "sound4",
                                                force: true,
                                            })
                                            self.jjd.setCanClick(true)
                                        }
                                    }))
                                }
                            })
                        }
                    })
                }
                node.downFunc = function() {
                    if (self.finishFire) {
                        addTimer({
                            fun: function(key) {
                                self.particle.disAct()
                                removeTimer(key)
                            },
                            time: 2.0,
                        })

                    }
                }
                node.setLocalZOrder(1)
                self.jjd = node
                break
        }
        if (key != itemKey.jjd) {
            node.setScale(itemScale)
        }
        return node
    },
    createNewWater: function(data) {
        var self = this
        var total = data.total
        var width = data.width
        var height = data.height
        var tex = data.res
        var scale = data.scale
        var scalevar = data.scalevar
        if (scalevar == null) {
            scalevar = 0.3
        }
        var finalScale = data.finalScale
        var finalScaleVar = data.finalScaleVar
        var minx = data.minx
        var miny = data.miny
        var xvar = data.xvar || 10
        var yvar = data.yvar || 10
        var finalTime = data.finalTime
        var finaly = data.finaly
        var pertime = 0.02
        var perMiny = (finaly - miny) / 5
        var time = data.time
        var timevar = data.timevar || 0.5
        var node = new cc.SpriteBatchNode(tex)
        node.list = []

        var count = 0
        var disReinit = false
        var reinit = function(temp) {
            if (!disReinit) {
                temp.setPosition(width * Math.random(), height / 2 * Math.random())
                temp.setScale(scale + Math.random() * scalevar)
                temp.tri = Math.random() > 0.5
                temp.curtime = Math.random() * (time + Math.random() * timevar)
                temp.time = time + Math.random() * timevar
                temp.movex = minx + xvar * Math.random()
                temp.movey = miny + yvar * Math.random()
                temp.scaleMove = finalScale + Math.random() * finalScaleVar - scale
                temp.perx = pertime / temp.time * temp.movex
                temp.pery = pertime / temp.time * temp.movey
                temp.perScale = pertime / temp.time * temp.scaleMove
                count++
                if (count >= total && miny < finaly) {
                    miny += perMiny
                    count = 0
                }
            } else {
                temp.setVisible(false)
            }
        }
        var perTotal = total / 30
        addTimer({
            fun: function(key) {
                for (var i = 0; i < perTotal; i++) {
                    var temp = new cc.Sprite(tex)
                    reinit(temp)
                    node.list[node.list.length] = temp
                    node.addChild(temp)
                }
                if (node.list.length >= total) {
                    removeTimer(key)
                }
            },
            time: pertime * 5,
            repeat: cc.REPEAT_FOREVER,
        })
        node.disAct = function() {
            disReinit = true
        }
        node.schedule(function() {
            for (var i = 0; i < node.list.length; i++) {
                var temp = node.list[i]
                temp.curtime += pertime
                var judge = temp.tri ? 1 : -1
                temp.x += judge * temp.perx
                temp.y += temp.pery
                temp.setScale(temp.getScale() + temp.perScale)
                if (temp.curtime >= temp.time) {
                    temp.curtime = 0
                    temp.tri = !temp.tri
                }
                if (temp.y > height) {
                    temp.y = 0
                    reinit(temp)
                }
            }
        }, pertime, cc.REPEAT_FOREVER)
        return node
    },
    createTool: function() {
        var self = this
        var judgeBack = function(data) {
            var index = data.index
            var sp = data.sp
            switch (index) {
                case itemKey.fqsb:
                    if (self.curMove >= 0) {
                        if (self.curMove < 3) {
                            sp.setPositionY(150)
                            sp.setPosition(posList[0])
                        } else {
                            if (self.sjj) {
                                var result = judgeItemCrash({
                                    item1: sp,
                                    item2: self.sjj.judge,
                                })
                                if (result) {
                                    sp.setPosition(657, 289)
                                    removeMoving(sp)
                                    self.curMove = 4
                                    if (self.jjd) {
                                        self.jjd.setCanClick(true)
                                    }
                                }
                            }
                        }
                    }
                    sp.front.setScale(itemScale)
                    changeFather({
                        item: sp.front,
                        father: self,
                    })
                    break
                case itemKey.tdn:
                    sp.setPosition(posList[1])
                    sp.front.setScale(itemScale)
                    changeFather({
                        item: sp.front,
                        father: self,
                    })
                    break
                case itemKey.sjj:
                    sp.back.setLocalZOrder(0)
                    sp.back.setScale(itemScale)
                    sp.setPosition(getMiddle(100, -230))
                    changeFather({
                        item: sp.back,
                        father: self.inside_node,
                    })
                    removeMoving(sp)
                    break
                case itemKey.jjd:
                    sp.setPosition(653, 48)
                    removeMoving(sp)
                    break
            }
            return false
        }
        var toolbtn = createTool({
            pos: cc.p(70, 480),
            nums: 6,
            tri: "right",
            showTime: 0.3,
            itempos: cc.p(0, -10),
            circlepos: cc.p(0, 20),
            devide: cc.p(1, 1.3),
            moveTime: 0.2,
            father: self.inside_node,
            ifcircle: true,
            circleScale: 0.7,
            itemScale: 0.7,
            files: [res.img_tool1, res.img_tool2, res.img_tool3, res.img_tool4, res.img_tool5, res.img_tool6],
            gets: [null, null, null, null, null, null],
            clickfun: function(data) {
                var index = data.index
                var sp = data.sp
                var pos = data.pos
                switch (index) {
                    case itemKey.fqsb:
                    case itemKey.tdn:
                        sp.front.setScale(1.0)
                        changeFather({
                            item: sp.front,
                            father: sp,
                        })
                        break
                    case itemKey.ys:
                        var result = judgeOpInPos({
                            item: sp,
                            pos: pos,
                        })
                        return result
                        break
                }
                return true
            },
            firstClick: function(data) {
                var index = data.index
                var pos = data.pos
                var sp = null
                switch (index) {
                    case itemKey.fqsb:
                        sp = self.getItem(index)
                        self.fqsb = sp
                        break
                    case itemKey.ld:
                        sp = self.getItem(index)
                        break
                    case itemKey.tdn:
                        if (self.curMove == 1) {
                            sp = self.getItem(index)
                            self.tdn = sp
                        } else {
                            self.judgeTips()
                        }
                        break
                    case itemKey.ys:
                        if (self.curMove == 1) {
                            sp = self.getItem(index)
                            var judge = createLayout({
                                pos: cc.p(0, 0),
                                size: cc.size(60, 80),
                                op: 0,
                                color: cc.color(255, 0, 0, 255)
                            })
                            judge.setPosition(489, 175)
                            safeAdd(sp, judge)
                            sp.judge = judge
                            sp.setPosition(pos.x - 100, pos.y + 80)
                            sp.nopos = true
                        } else {
                            self.judgeTips()
                        }
                        break
                    case itemKey.sjj:
                    case itemKey.jjd:
                        if (self.curMove == 3 || self.curMove == 4) {
                            sp = self.getItem(index)
                        } else {
                            self.judgeTips()
                        }
                        break
                    default:
                        break
                }
                return sp
            },
            outfun: function(data) {
                var sp = data.sp
                var pos = data.pos
                var index = data.index
                switch (index) {
                    case itemKey.fqsb:
                    case itemKey.tdn:
                    case itemKey.sjj:
                    case itemKey.jjd:
                        if (!self.acting) {
                            judgeBack(data)
                        }
                        break
                    case itemKey.ld:
                        if (self.fqsb) {
                            var result = judgeItemCrash({
                                item1: self.fqsb.judge,
                                item2: sp.judge,
                            })
                            if (result) {
                                sp.removeFromParent(true)
                                self.fqsb.item_fqld.setVisible(true)
                                self.curMove = 1
                                self.nodebs.say({
                                    key: "sound2",
                                    force: true,
                                })
                                var sb = self.fqsb
                                changeFather({
                                    item: sb.front,
                                    father: sb,
                                })
                                self.fqsb.setPosition(posList[0])
                                changeFather({
                                    item: sb.front,
                                    father: self,
                                })
                            }
                        }
                        break
                    case itemKey.ys:
                        if (self.tdn && self.fqsb) {
                            var result = judgeItemCrash({
                                item1: sp.judge,
                                item2: self.tdn.judge,
                            })
                            if (result && !self.acting) {
                                self.acting = true
                                self.curMove = 2
                                self.tdn.front.setScale(1)
                                changeFather({
                                    item: self.tdn.front,
                                    father: self.tdn,
                                })
                                sp.setPosition(627.8, 354.4)
                                var tdn = self.fqsb.item_tdn
                                var count = 1
                                sp.runAction(cc.sequence(cc.repeat(cc.sequence(createAnimation({
                                    ifFile: true,
                                    frame: "putitem_%02d",
                                    end: 28,
                                    time: 1 / 24,
                                    fun: function() {
                                        tdn.setVisible(true)
                                        if (count <= 7 && count >= 1) {
                                            tdn.setSpriteFrame(sprintf("tdn_%02d.png", count))
                                        }
                                        count++
                                    }
                                }), createAnimation({
                                    ifFile: true,
                                    frame: "putitem_%02d",
                                    start: 29,
                                    end: 43,
                                    time: 1 / 24,
                                })), actTimes), createAnimation({
                                    ifFile: true,
                                    frame: "getitem_%02d",
                                    end: 41,
                                    time: 1 / 24,
                                    fun: function() {
                                        addShowType({
                                            item: self.tdn,
                                            show: "fadeOut",
                                            time: 1.0,
                                            fun: function(item) {
                                                sp.setScale(1)
                                                changeFather({
                                                    item: sp,
                                                    father: self.fqsb,
                                                })
                                                self.fqsb.upTuDou = sp
                                                self.fqsb.noMove = false
                                                self.curMove = 3
                                                self.acting = false
                                                item.removeFromParent(true)
                                                self.nodebs.say({
                                                    key: "sound3",
                                                    force: true,
                                                })
                                            }
                                        })
                                    }
                                })))
                                self.tdn.noMove = true
                                self.fqsb.noMove = true
                                sp.noMove = true
                            }
                        }
                        break
                }
            },
            backfun: function(data) {
                judgeBack(data)
            }
        })
        this.toolbtn = toolbtn
        safeAdd(self.inside_node, toolbtn)
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        var imgList = [
            1, 2, 3, 4, null
        ]
        for (var i = 0; i < 5; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("sound%d", i + 1), //对话标签 之后让人物说话需要用到的参数
                img: imgList[i] ? res[sprintf("content%d", imgList[i])] : res.img_find, //图片和声音文件
                sound: res[sprintf("do_sound%d", i + 1)],
                id: imgList[i] ? "normal" : "result",
                offbg: imgList[i] ? null : cc.p(20, 20),
                btnModify: cc.p(20, 10)
            })
        }
    }
})