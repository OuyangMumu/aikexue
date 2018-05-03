//@author mu @16/4/27
var seeExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp2", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("bowen")
        loadPlist("sh")
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
        createWaterPhy({
            layer: self,
            showDebug: false,
        })
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
            key: "see2",
        })
        see.setLocalZOrder(1)
        safeAdd(self, see)

        var uilist = [
            "item_pen",
            "deco",
            "item_hs",
            "water",
            "water_back",
            "water_front",
        ]
        loadList(see, uilist)
        self.addWater({
            item: see.water
        })
        see.water_back.setLocalZOrder(0)
        changeFather({
            item: see.water_back,
            father: self,
        })
        var rootPos = cc.p(see.item_pen.getPositionX(), see.item_pen.getPositionY() + 150)
        var hs = self.addItem({
            tex: "#sydcs_see_02.png",
            mass: 0.25,
            pos: see.item_hs.getPosition()
        })
        see.item_hs.setVisible(false)
        createTouchEvent({
            item: hs,
            autoMove: true,
            begin: function(data) {
                var item = data.item
                hs.judge = false
                hs.finishShow = false
                self.actPys(false)
                item.setPosition(rootPos)
                return true
            },
            move: function(data) {
                var item = data.item
                var pos = data.pos
                if (pos.y >= rootPos.y) {
                    item.y = pos.y
                }
            },
            end: function(data) {
                hs.judge = true
                self.actPys(true)
            }
        })
        var water = see.water_back
        water.showBw = function(fun) {
            playEffect(res.sound_see2_item)
            var water = this
            if (!water.bw) {
                var bw = new cc.Sprite()
                bw.act = function() {
                    var bw = this
                    var ani = createAnimation({
                        frame: "pen_bw_%02d.png",
                        end: 30,
                        time: 1 / 24,
                    })
                    bw.runAction(ani)
                }
                var size = water.getContentSize()
                bw.setPosition(size.width / 2, 0)
                safeAdd(water, bw)
                water.bw = bw
            }
            if(!water.sh){
                var bw = new cc.Sprite()
                bw.act = function() {
                    var bw = this
                    bw.setVisible(true)
                    var ani = createAnimation({
                        frame: "water_fire_%02d.png",
                        end: 15,
                        time: 1 / 24,
                        fun:function(){
                            bw.setVisible(false)
                        }
                    })
                    bw.runAction(ani)
                }
                var size = water.getContentSize()
                bw.setPosition(size.width / 2, 0)
                bw.setAnchorPoint(0.5, 0)
                safeAdd(water, bw)
                water.sh = bw
            }
            var bw = water.bw
            bw.act()
            var sh = water.sh
            sh.act()
        }
        hs.update = function(dt){
            var hs = this
            if (hs.judge && !hs.finishShow) {
                var result = judgeItemCrash({
                    item1: hs,
                    item2: see.water,
                })
                if (result) {
                    water.showBw()
                    hs.finishShow = true
                }
            }
        }
        hs.scheduleUpdate()
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
            img: res.see_content2, //图片和声音文件
            sound: res.sound_see2
        })
        addContent({
            people: this.nodebs,
            key: "see_result", //对话标签 之后让人物说话需要用到的参数
            img: res.see_content4, //图片和声音文件
            sound: res.sound_see4,
            id: "result",
        })
    }
})