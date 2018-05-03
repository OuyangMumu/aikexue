//@author mu @16/4/27

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
        var self = this
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
                                json: res.zysxc_bg,
                                inputNum: 13,
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
        self.initScene()
        self.createTool()
        return true
    },
    createTool: function() {
        var self = this
        var fileList = []
        var toolList = [
            2, 3, 4, 1
        ]
        for (var i = 0; i < 4; i++) {
            fileList[i] = res[sprintf("tool%d", toolList[i])]
        }
        var imgList = [
            "img1",
            "img2",
            "img3",
            "img_coin",
        ]
        var outJudge = function(item) {
            switch (item.index) {
                case 1:
                case 2:
                case 0:
                    self.showIndex(item.index)
                    item.forceBack()
                    break
                case 3:
                    var devide = 100
                    if (self.curItem) {
                        var pos = getWorldPos(self.curItem)
                        if (item.x >= pos.x - devide && item.x <= pos.x + devide && item.y >= pos.y) {
                            self.curItem.add(item)
                            return
                        }
                    }
                    var count = 0
                    addShowType({
                        item: item,
                        show: "fadeOut",
                        time: 0.5,
                        fun: function(item) {
                            count--
                            if (count == 0) {
                                item.forceBack()
                            }
                        }
                    })
                    count++
                    addShowType({
                        item: item,
                        show: "moveBy",
                        time: 0.5,
                        buf: cc.p(0, -300),
                        fun: function(item) {
                            count--
                            if (count == 0) {
                                item.forceBack()
                            }
                        }
                    })
                    count++
                    break
            }
        }
        var toolbtn = createTool({
            pos: cc.p(70, 480),
            nums: 4,
            tri: "right",
            showTime: 0.3,
            itempos: cc.p(0, -65),
            circlepos: cc.p(0, 15),
            devide: cc.p(1, 1.3),
            moveTime: 0.2,
            father: self,
            ifcircle: true,
            circleScale: 0.7,
            fileAnchor: cc.p(0.5, 0),
            itemScale: 0.8,
            files: fileList,
            gets: [null, null, null, null],
            counts: [1, 1, 1, 9999],
            firstClick: function(data) {
                var index = data.index
                var sp = new cc.Sprite(res[imgList[index]])
                if (index != 3) {
                    self.cover()
                }
                return sp
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
    initScene: function() {
        var self = this
        var uilist = [
            "item1",
            "item2",
            "item3"
        ]
        var bg = loadNode(res.do_json, uilist)
        bg.init = function() {
            bg.setPosition(getMiddle(0, -150))
            var init = function() {
                var item = this
                if (item.coinList) {
                    var list = item.coinList
                    for (var i = 0; i < list.length; i++) {
                        list[i].removeFromParent(true)
                    }
                    item.coinList = []
                }
                item.setPosition(item.rootPos)
            }
            var speed = 700
            var add = function(coin) {
                var item = this
                if (!item.coinList) {
                    item.coinList = []
                }
                coin.setPositionX(getWorldPos(item).x)
                changeFather({
                    item: coin,
                    father: item,
                })
                removeMoving(coin)
                item.coinList[item.coinList.length] = coin
                var size = item.getContentSize()
                var finalY = size.height / 2 + item.coinList.length * 5
                var buf = cc.p(size.width / 2, finalY)
                var disT = Math.abs(finalY - coin.getPositionY())
                var time = disT / speed
                var inAdd = 0
                if (disT > 100 && disT < 250) {
                    inAdd = 1
                }
                if (disT >= 250) {
                    inAdd = 2
                }
                addShowType({
                    item: coin,
                    show: "moveTo",
                    buf: buf,
                    time: time,
                    fun: function() {
                        if (!item.finish) {
                            setOff(item, cc.p(0, item.off))
                            if (item.coinList.length + inAdd > item.max) {
                                addShowType({
                                    item: item,
                                    show: "moveBy",
                                    buf: cc.p(0, -60),
                                    time: 0.5,
                                })
                                item.finish = true
                            }
                        }
                    }
                })
            }
            var offList = [-0.7, -1, -1.5]
            var maxList = [10, 8, 5]
            for (var i = 0; i < uilist.length; i++) {
                var item = bg[uilist[i]]
                item.setVisible(false)
                item.rootPos = item.getPosition()
                item.init = init
                item.add = add
                item.off = offList[i]
                item.max = maxList[i]
            }
            self.cover = function() {
                for (var i = 0; i < uilist.length; i++) {
                    bg[uilist[i]].setVisible(false)
                }
                if (self.curItem) {
                    self.curItem.init()
                }
            }
            self.showIndex = function(index) {
                bg[uilist[index]].setVisible(true)
                self.curItem = bg[uilist[index]]
                self.curItem.finish = false
            }
        }
        bg.init()
        safeAdd(self, bg)
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
            img: res.do_content1, //图片和声音文件
            sound: res.do_content
        })
    }
})