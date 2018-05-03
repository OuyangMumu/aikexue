//@author mu @16/4/27

var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("seejson")
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
            setZ: 1,
        })
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        self.initScene()
        return true
    },
    initScene: function() {
        var self = this
        var uilist = [
            "addBg",
            "btn_answer",
            "img_bg",
        ]
        var bg = loadNode(res.seebg, uilist)
        bg.setPosition(getMiddle(100, -30))
        safeAdd(self, bg)

        var start = cc.p(30, 327)
        var devideY = -43
        var list = getRand(8)
        self.randList = list
        var zOrder = {
            base: 0,
            touch: 1,
        }
        var btnFind = new ccui.Button(res.btn_get_normal, res.btn_get_select)
        btnFind.setPosition(910, 480)
        btnFind.setVisible(false)
        safeAdd(self, btnFind)
        btnFind.addClickEventListener(function() {
            self.nodebs.say({
                key: "Result",
                force: true,
            })
        })
        self.btnFind = btnFind
        var judgeShowBtn = function() {
            var list = self.judgeList
            var finalJudge = true
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    var judge = list[i]
                    if (!(judge && judge.item)) {
                        finalJudge = false
                        break
                    }
                }
                if (finalJudge) {
                    self.getFind = true
                    self.btnFind.setVisible(true)
                }
            }
        }
        var judgeAll = function(data) {
            if (self.judgeList) {
                var list = self.judgeList
                var judgeFinal = false
                var minDis = null
                var minI = null
                for (var i = 0; i < list.length; i++) {
                    var dis = getDis(getWorldPos(data.item), getWorldPos(list[i]))
                    if (minDis != null) {
                        if (dis < minDis) {
                            minDis = dis
                            minI = i
                        }
                    } else {
                        minDis = dis
                        minI = i
                    }
                }
                var judge = list[minI]
                if (judge.judge(data)) {
                    judgeFinal = true
                }
                if (!judgeFinal) {
                    var item = data.item
                    if (item.father) {
                        item.father.item = null
                    }
                    item.back()
                }
            }
            if (!self.getFind) {
                judgeShowBtn()
            }
        }
        var packLink = function(data) {
            var lay = data.lay
            createTouchEvent({
                item: lay,
                begin: function(data) {
                    var item = data.item
                    if (!item.rootPos) {
                        item.rootPos = item.getPosition()
                    }
                    item.setLocalZOrder(zOrder.touch)
                    item.showBase(true)
                    item.width = 260
                    changeFather({
                        item: item,
                        father: self,
                    })
                    return true
                },
                autoMove: true,
                end: function(data) {
                    var item = data.item
                    judgeAll(data)
                }
            })
        }
        for (var i = 0; i < 8; i++) {
            var lay = createLayout({
                size: cc.size(260, 40),
                op: 0,
            })
            var sp1 = new cc.Sprite(sprintf("#px_font_%02d.png", list[i] * 4 + 1))
            sp1.setAnchorPoint(0, 0)
            safeAdd(lay, sp1)
            var sp2 = new cc.Sprite(sprintf("#px_font_%02d.png", list[i] * 4 + 3))
            sp2.setAnchorPoint(0, 0)
            sp2.setPosition(140, 0)
            safeAdd(lay, sp2)

            var sp3 = new cc.Sprite(sprintf("#px_font_%02d.png", list[i] * 4 + 2))
            sp3.setAnchorPoint(0, 0)
            sp3.setPositionX(30)
            safeAdd(lay, sp3)
            sp3.setVisible(false)

            var sp4 = new cc.Sprite(sprintf("#px_font_%02d.png", list[i] * 4 + 4))
            sp4.setAnchorPoint(0, 0)
            sp4.setPositionX(220)
            safeAdd(lay, sp4)
            sp4.setVisible(false)

            lay.setPosition(start.x, start.y + devideY * i)
            lay.setLocalZOrder(zOrder.base)
            safeAdd(bg.addBg, lay)
            lay.sp1 = sp1
            lay.sp2 = sp2
            lay.sp3 = sp3
            lay.sp4 = sp4
            lay.back = function() {
                var lay = this
                lay.father = null
                lay.width = 260
                lay.showBase(true)
                if (lay.rootPos) {
                    lay.setPosition(lay.rootPos)
                }
                safeAdd(bg.addBg, lay)
            }
            lay.showBase = function(judge) {
                var lay = this
                lay.sp1.setVisible(judge)
                lay.sp2.setVisible(judge)
                lay.sp3.setVisible(!judge)
                lay.sp4.setVisible(!judge)
            }
            packLink({
                lay: lay,
            })
        }
        var begin = cc.p(78, 317)
        var disY = 45
        var judgeList = []
        for (var i = 0; i < 8; i++) {
            var touch = createLayout({
                size: cc.size(382, 43),
                op: 0,
                pos: cc.p(begin.x, begin.y - i * disY)
            })
            safeAdd(bg.img_bg, touch)
            judgeList[i] = touch
            touch.judge = function(data) {
                var item = data.item
                var judge = this
                var result = judgeItemCrash({
                    item1: item,
                    item2: judge
                })
                if (result) {
                    if (judge.item) {
                        var inItem = judge.item
                        if (item.father) {
                            var inFather = item.father
                            safeAdd(inFather, inItem)
                            inItem.father = inFather
                            inFather.item = inItem
                        } else {
                            inItem.back()
                        }
                    } else {
                        if (item.father) {
                            item.father.item = null
                        }
                    }
                    judge.item = item
                    item.father = judge
                    item.setPosition(0, 0)
                    item.width = 382
                    item.showBase(false)
                    safeAdd(judge, item)
                }
                return result
            }
        }
        self.judgeList = judgeList

        bg.btn_answer.addClickEventListener(function() {
            if (!self.resultBg1) {
                var img = createShowImg({
                    img: res.see_deco1,
                })
                safeAdd(self, img)
                self.resultBg1 = img
            }
            self.resultBg1.show()
        })
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        addContent({
            people: this.nodebs,
            key: "Show", //对话标签 之后让人物说话需要用到的参数
            img: res.see_content1, //图片和声音文件    
            sound: res.see_sound1
        })
        addContent({
            people: this.nodebs,
            key: "Result",
            img: res.see_content2,
            sound: res.see_sound2,
            id: "result", //结论的时候的特殊标签
            //offset: cc.p(85, 30),
            btnModify: cc.p(10, 10),
            btnScale: 0.8,
        })
    }
})