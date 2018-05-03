//@author mu @16/4/27

var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("fzcl_mb_fire")
        loadPlist("fzcl_nl_fire")
    },
    myDelete: function() { //删除时调用
        var self = this
        this._super()
        if (self.biaoge) {
            self.biaoge.removeFromParent(false)
        }
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        var self = this
        if (this.nodebs) {
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
                        var bg = fzcl_biaoge()
                        safeAdd(self, bg)
                        self.biaoge = bg
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
    createTool: function() {
        var self = this
        var dataControl = self.dataControl
        var judge = [
            "mb",
            "nl",
        ]
        var keys = [
            "sz",
            "cj",
        ]
        var start = [
            2,
            41,
        ]
        var repeat = [
            6,
            4,
        ]
        var finalPos = [
            cc.p(746, 380),
            cc.p(752, 380),
        ]
        var mixPos = [
            cc.p(10, -1),
            cc.p(18, 38)
        ]
        var judgeFire = function() {
            var nz = dataControl.nz
            if (nz && nz.catch) {
                var item = nz.catch
                var pos = self.jjd.getFirePos()
                if (pos && item) {
                    var result = (judgeInside({
                        item: item,
                        pos: pos,
                    }))
                    if (result && !dataControl.firing) {
                        dataControl.firing = true
                        var index = item.judgeType == "mb" ? 0 : 1
                        nz.setPosition(finalPos[index])
                        var rx = item.getPosition()
                        var temp = mixPos[index]
                        var final = cc.p(rx.x + temp.x, rx.y + temp.y)
                        item.setPosition(final)
                        item.myFire()
                    }
                }
            }
        }
        dataControl.fun = judgeFire
        var judgeTouch = function() {
            var item = dataControl.item
            var nz = dataControl.nz
            if (item && nz && !nz.catch) {
                if (item.judgeNz(nz.getPos())) {
                    nz.catch = item
                    var size = item.getContentSize()
                    item.setPosition(0, -size.height * 0.4)
                    item.setRotation(11)
                    item.removeListen()
                    item.setLocalZOrder(-1)
                    safeAdd(nz.nz, item)
                }
            }
            judgeFire()
        }
        var judgeNz = function(pos) {
            var item = this
            var result = judgeInside({
                item: item,
                pos: pos,
            })
            return result
        }
        var myFire = function() {
            var item = this
            var action = cc.sequence(createAnimation({
                frame: sprintf("fzcl_%s_fire_%%02d.png", item.judgeType),
                start: 1,
                end: item.start,
                time: 0.03,
            }), cc.callFunc(function() {
                var smell = createSmell({
                    pos: getMiddle(-120, 130),
                    key: item.key,
                    scale: 1.1,
                    father: self,
                    repeat: item.repeat,
                    fun: function() {
                        self.nodebs.say({ //当存在key为show的对话ID才调用
                            key: item.key,
                        })
                    }
                })
                smell.setLocalZOrder(99)
            }), createAnimation({
                frame: sprintf("fzcl_%s_fire_%%02d.png", item.judgeType),
                start: item.start + 1,
                end: item.max,
                time: 0.03,
            }), cc.callFunc(function() {
                dataControl.firing = false
                dataControl.item = null
                dataControl.nz.catch = null
                item.forceBack()
            }))
            item.runAction(action)
        }
        var getPos = function() {
            var hand = this
            var pos = hand.nz.convertToWorldSpace(cc.p(0, 0))
            return pos
        }
        var toolbtn = createTool({
            pos: cc.p(70, 480),
            nums: 3,
            tri: "right",
            showTime: 0.3,
            itempos: cc.p(0, -10),
            circlepos: cc.p(0, 10),
            devide: cc.p(1, 1.1),
            moveTime: 0.2,
            father: self,
            ifcircle: true,
            circleScale: 0.7,
            itemScale: 1.3,
            files: [res.fzcl_tool1, res.fzcl_tool2, res.fzcl_tool3],
            gets: [res.fzcl_mb, res.fzcl_nl, null],
            judge: function() {
                if (dataControl.firing) {
                    return false
                }
                return true
            },
            firstClick: function(data) {
                var index = data.index
                var sp = null
                switch (index) {
                    case 0:
                    case 1:
                        var item = data.sp
                        item.judgeNz = judgeNz
                        if (dataControl.item) {
                            dataControl.item.forceBack()
                            dataControl.item = null
                        }
                        dataControl.item = item
                        item.judgeType = judge[index]
                        var nz = dataControl.nz
                        if (nz && nz.catch) {
                            nz.catch = null
                        }
                        item.max = index == 0 ? 73 : 71
                        item.start = start[index]
                        item.myFire = myFire
                        item.key = keys[index]
                        item.repeat = repeat[index]
                        return true
                        break
                    case 2:
                        var nz = new cc.Sprite(res.fzcl_niezi)
                        var hand = createHand({
                            item: nz
                        })
                        dataControl.nz = hand
                        hand.setLocalZOrder(10)
                        hand.nz = nz
                        hand.getPos = getPos
                        return hand
                        break
                }
                return sp
            },
            reTouch: function(data) {
                var sp = data.sp
                var pos = data.pos
                var index = data.index
                if (dataControl.firing) {
                    return null
                }
                sp.setPosition(pos)
                switch (index) {
                    case 0:
                    case 1:
                        sp.setLocalZOrder(1)
                        sp.setRotation(0)
                        safeAdd(self, sp)
                        if (dataControl.nz) {
                            dataControl.nz.catch = null
                        }
                        break
                    case 2:
                        break
                }
                return sp
            },
            outfun: function(data) {
                var sp = data.sp
                var pos = data.pos
                var index = data.index
                judgeTouch()
            },
            movefun: function(data) {
                if (dataControl.firing) {
                    return false
                }
                var sp = data.sp
                var pos = data.pos
                var delta = data.delta
                var index = data.index
                sp.x += delta.x
                sp.y += delta.y
                switch (index) {
                    case 2:
                        judgeFire()
                        break
                }
                return true
            },
            backfun: function(data) {
                var index = data.index
                var sp = data.sp
                switch (index) {
                    case 0:
                    case 1:
                        return false
                        break
                    case 2:
                        if (sp.catch) {
                            return false
                        }
                        dataControl.nz = null
                        return true
                        break
                }
                return false
            }
        })
        this.toolbtn = toolbtn
        this.addChild(toolbtn)
    },
    initScene: function() {
        var self = this
        var dataControl = self.dataControl
        self.jjd = createJJD({
            father: self,
            pos: getMiddle(0, -200),
            fun: function() {
                if (dataControl.fun) {
                    dataControl.fun()
                }
            }
        })
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs) //添加人物对话
        addContent({
            people: this.nodebs,
            key: "Show", //对话标签 之后让人物说话需要用到的参数
            img: res.fzcl_do2_content, //图片和声音文件
            sound: res.fzcl_do2_sound1
        })
        addContent({
            people: this.nodebs,
            key: "sz",
            sound: res.fzcl_do2_sound2
        })
        addContent({
            people: this.nodebs,
            key: "cj",
            sound: res.fzcl_do2_sound3
        })
    }
})