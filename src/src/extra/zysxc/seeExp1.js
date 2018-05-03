//@author mu @16/4/27

var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
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
                    key: "Show"
                })
            })
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
        var self = this
        var img = new cc.Sprite(res.see_bg)
        img.setScale(0.8)
        img.setAnchorPoint(0, 1)
        safeAdd(self.inside_node, img)
        var size = img.getContentSize()
        var dis = size.height - 1100
        var buf = cc.p(0, dis)
        var boat = createBoat()
        boat.setScale(0.8)
        var hw = new cc.Sprite(res.img_see_hw)
        hw.setScale(0.8)
        hw.setPosition(212, 308)
        boat.addItem(hw)
        safeAdd(self, boat)

        var btns = createPlayBtns({
            type: "H",
            pos: cc.p(40, 30),
            startFun: function() {
                img.setPosition(-200, 640)
                boat.setPosition(getMiddle(-150, -100 - dis))
                addShowType({
                    item: img,
                    show: "moveBy",
                    time: 2.0,
                    buf: buf,
                    fun: function(item) {
                        boat.act()
                        addShowType({
                            item: item,
                            show: "moveBy",
                            time: 5.0,
                            buf: cc.p(-1700, 0),
                            fun: function() {
                                addShowType({
                                    item: boat,
                                    show: "moveBy",
                                    time: 0.6,
                                    buf: cc.p(270, 0),
                                    fun: function() {
                                        boat.inStop()
                                        self.btnFind.setVisible(true)
                                        self.btns.end()
                                    }
                                })
                            }
                        })
                    }
                })
                addShowType({
                    item: boat,
                    show: "moveBy",
                    time: 2.0,
                    buf: buf,
                })
            },
            pauseFun: function() {
                img.pause()
                boat.pause()
                boat.inPause()
            },
            resumeFun: function() {
                img.resume()
                boat.resume()
                boat.inResume()
            },
            stopFun: function() {
                img.setPosition(-200, 640)
                boat.setPosition(getMiddle(-150, -100 - dis))
                boat.inStop()
                img.stopAllActions()
                boat.stopAllActions()
            }
        })
        self.btns = btns
        safeAdd(self, btns)

        var btnFind = new ccui.Button(res.btn_get_normal, res.btn_get_select)
        btnFind.setPosition(1070, 480)
        btnFind.setVisible(false)
        safeAdd(self.inside_node, btnFind)
        btnFind.addClickEventListener(function() {
            self.nodebs.say({
                key: "find",
                force: true,
            })
        })
        self.btnFind = btnFind
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
            sound: res.see_content
        })
        addContent({
            people: this.nodebs,
            key: "find", //对话标签 之后让人物说话需要用到的参数
            img: res.img_see_result, //图片和声音文件
            sound: res.see_result,
            id: "result",
            btnModify: cc.p(0, 10),
            btnScale: 0.8,
        })
    }
})