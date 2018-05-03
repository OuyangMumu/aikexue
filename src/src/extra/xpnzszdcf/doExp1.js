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
                                json: res.dobg1,
                                downData: {
                                    nums: 4,
                                    bufs: [
                                        [null, "#xpn_bg_03.png", "#xpn_bg_04.png"],
                                        [null, "#xpn_bg_03.png", "#xpn_bg_04.png"],
                                        [null, "#xpn_bg_03.png", "#xpn_bg_04.png"],
                                        [null, "#xpn_bg_03.png", "#xpn_bg_04.png"],
                                    ],
                                },
                                inputNum: 12,
                            })
                            self.biaoge = bg
                            safeAdd(self, bg)
                        }
                        self.biaoge.show()
                    },
                }
            }) //实验模板
        var self = this
        self.initPeople() //创建人物
        initScene({
            list: [4, 7, 17, 20, 23, 26, 29, 32],
            deco: "#xpn_12.png",
            judgePos: cc.p(400, 80),
            layer: self.inside_node,
            itemList: [33, 34, 35, 36],
            layKey: 1,
        })
        return true
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.inside_node.addChild(this.nodebs) //添加人物对话
        addContent({
            people: this.nodebs,
            key: "Show", //对话标签 之后让人物说话需要用到的参数
            img: res.do1_content1, //图片和声音文件
            sound: res.do1_sound1
        })
    }
})