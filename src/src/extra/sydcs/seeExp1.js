//@author mu @16/4/27
var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("bowen")
    },
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
        var btn = new ccui.Button(res.btn_jielun_normal, res.btn_jielun_select)
        btn.setPosition(getMiddle(510, 160))
        btn.addClickEventListener(function() {
            if (self.nodebs) {
                self.nodebs.say({
                    key: "see_result",
                })
            }
        })
        safeAdd(self, btn)
        return true
    },
    initScene: function() {
        var self = this
        var see = loadSee({
            key: "see1",
        })
        var uilist = [
            "item_bei",
            "water",
            "hand",
            "item_chop"
        ]
        loadList(see, uilist)
        safeAdd(self, see)
        var buf = -9
        var time = 0.2
        var water = see.water
        water.setLocalZOrder(-1)
        reAdd(water)
        createTouchEvent({
            item: see.hand,
            begin: function(data) {
                var item = data.item
                if (!self.clicking) {
                    self.clicking = true
                    addShowType({
                        item: item,
                        show: "rotateBy",
                        buf: buf,
                        time: time,
                        fun: function() {
                            water.showBw(function() {
                                self.clicking = false
                            })
                            addShowType({
                                item: item,
                                show: "rotateBy",
                                buf: -buf,
                                time: time,
                            })
                        }
                    })
                }
            }
        })

        water.showBw = function(fun) {
            playEffect(res.sound_see1_item)
            var water = this
            if (!water.bw) {
                var bw = new cc.Sprite()
                bw.act = function() {
                    var bw = this
                    var ani = createAnimation({
                        frame: "bei_bw_%02d.png",
                        end: 30,
                        time: 1 / 24,
                        fun: function() {
                            if (fun) {
                                fun()
                            }
                        }
                    })
                    bw.runAction(ani)
                }
                var size = water.getContentSize()
                bw.setPosition(size.width / 2, size.height / 2)
                safeAdd(water, bw)
                water.bw = bw
            }
            var bw = water.bw
            bw.act()
        }
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
            sound: res.sound_see1
        })
        addContent({
            people: this.nodebs,
            key: "see_result", //对话标签 之后让人物说话需要用到的参数
            img: res.see_content4, //图片和声音文件
            sound: res.sound_see4,
            id:"result",
        })
    }
})