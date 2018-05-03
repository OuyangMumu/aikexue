//@author mu @16/4/27

var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp3", //必要！ 用于判定各种按钮的返回和进入
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
                                json: res.dobg2,
                                downData: {
                                    nums: 5,
                                    bufs: [
                                        [null, "#xpn_bg_03.png", "#xpn_bg_04.png"],
                                        [null, "#xpn_bg_03.png", "#xpn_bg_04.png"],
                                        [null, "#xpn_bg_03.png", "#xpn_bg_04.png"],
                                        [null, "#xpn_bg_03.png", "#xpn_bg_04.png"],
                                        [null, "#xpn_bg_03.png", "#xpn_bg_04.png"],
                                    ],
                                },
                                inputNum: 15,
                            })
                            self.biaoge = bg
                            var uilist = [
                                "btn_we",
                                "img_we"
                            ]
                            loadList(bg, uilist)
                            bg.img_we.setVisible(false)
                            bg.btn_we.addClickEventListener(function() {
                                bg.img_we.setVisible(!bg.img_we.isVisible())
                            })
                            safeAdd(self, bg)
                        }
                        self.biaoge.show()
                    },
                }
            }) //实验模板
        this.dataControl = {}
        var self = this
        self.initPeople() //创建人物
        initScene({
            list: [2, 5, 15, 18, 21, 24, 27, 30, 41, 42],
            deco: "#xpn_14.png",
            judgePos: cc.p(400, 80),
            layer: self.inside_node,
            layKey: 3,
            itemList: [43, 44, 45, 46, 47],
            finalList: [263, 263, 280, 280, 280],
            donwFun: function() {
                if (!self.showFont) {
                    var font = new cc.Sprite("#xpn_10.png")
                    font.setPosition(getMiddle(20, 170))
                    safeAdd(self, font)
                    self.showFont = font
                    self.nodebs.say({
                        key: "next",
                        force: true,
                    })
                }
            }
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
            img: res.do3_content1, //图片和声音文件
            sound: res.do3_sound1
        })
        addContent({
            people: this.nodebs,
            key: "next", //对话标签 之后让人物说话需要用到的参数
            sound: res.do3_sound2
        })
    }
})