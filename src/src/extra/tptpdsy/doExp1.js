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
        if (this.nodebs) {
            var self = this
            this.nodebs.show()
        }
        if (self.toolbtn) {
            self.toolbtn.show()
        }
    },
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
            //var base = 20.2
        var inputKeys = ["20.2", "40.4", "60.6", "80.8", "101"]
            // for (var i = 0; i < 5; i++) {
            //     inputKeys[i] = String(base * (i + 1))
            // }
        this.expCtor({
                vis: false,
                settingData: {
                    pos: cc.p(1080, 580),
                    biaogeFun: function() {
                        if (!self.biaoge) {
                            var bg = createBiaoge({
                                json: res.tp_biaoge,
                                inputNum: 5,
                                scale: 0.8,
                                rootColor: [
                                    cc.color(255, 0, 0, 255),
                                    cc.color(255, 0, 0, 255),
                                    cc.color(255, 0, 0, 255),
                                    cc.color(255, 0, 0, 255),
                                    cc.color(255, 0, 0, 255)
                                ],
                                inputKeys: inputKeys,
                                answerShowKey: true,
                            })
                            self.addChild(bg)
                            self.biaoge = bg
                        }
                        var bg = self.biaoge
                        bg.show()
                    },
                }
            }) //实验模板
        var self = this
        self.initScene()
        self.createTool()
        self.initPeople() //创建人物
        return true
    },
    createTool: function() {
        var self = this
        var toolbtn = createTool({
            pos: cc.p(70, 490),
            nums: 5,
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
            files: [res.tool1, res.tool2, res.tool3, res.tool4, res.tool5],
            gets: [res.item1, res.item2, res.item3, res.item4, res.item5],
            clickfun: function(data) {
                var item = data.sp
                var pos = data.pos
                var index = data.index
                if (item.inTp) {
                    item.inTp = false
                    self.tp.disWeight(20.2 * (index + 1))
                    item.setPosition(pos)
                    safeAdd(self, item)
                    for (var i = 0; i < self.itemList.length; i++) {
                        if (self.itemList[i] == item) {
                            self.itemList.splice(i, 1)
                            if (self.sort) {
                                self.sort()
                            }
                            break
                        }
                    }
                }
                return true
            },
            outfun: function(data) {
                var sp = data.sp
                var pos = data.pos
                var index = data.index
                data.weight = 20.2 * (index + 1)
                data.item = sp
                self.tp.addItem(data)
            },
        })
        this.toolbtn = toolbtn
        this.addChild(toolbtn)
    },
    initScene: function() {
        var self = this
        var tp = createTp({
            tppos: cc.p(350, 80),
            balanceShu: true,
            addFun: function(data) {
                var item = data.item
                item.inTp = true
                self.itemList[self.itemList.length] = item
                if (self.sort) {
                    self.sort()
                }
            }
        })
        var posList = [
            [cc.p(95, 60)],
            [cc.p(60, 60), cc.p(130, 60)],
            [cc.p(50, 60), cc.p(90, 60), cc.p(130, 60)],
            [cc.p(50, 65), cc.p(90, 65), cc.p(130, 65), cc.p(80, 50)],
            [cc.p(50, 65), cc.p(90, 65), cc.p(130, 65), cc.p(70, 50), cc.p(110, 50)],
        ]
        self.itemList = []
        var sort = function() {
            var itemList = self.itemList
            var len = itemList.length
            var curPos = posList[len - 1]
            for (var i = 0; i < len; i++) {
                itemList[i].setPosition(curPos[i])
            }
        }
        self.sort = sort
        self.tp = tp
        safeAdd(self, tp)
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