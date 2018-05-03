//@author mu @16/4/27
var doExp4 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp4", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {},
    myExit: function() { //退出时调用
        this._super()
    },
    myDelete: function() { //删除时调用
        var self = this
        this._super()
        if(self.biaoge){
            self.biaoge.removeFromParent(false)
        }
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
        this.expCtor({
                vis: false,
                settingData: {
                    pos: cc.p(1080, 580),
                    biaogeFun: function() {
                        var bg = sydcs_biaoge()
                        safeAdd(self, bg)
                        self.biaoge = bg
                        bg.show()
                    },
                }
            }) //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        self.initScene()
        return true
    },
    initScene: function() {
        var self = this
        var item_do = loadDo({
            key: "do4",
        })
        safeAdd(self, item_do)
        var uilist = [
            "item_cz",
            "item_yc",
        ]
        loadList(item_do, uilist)
        var cz = item_do.item_cz
        var yc = item_do.item_yc
        cz.rootPos = cz.getPosition()
        setOff(cz, cc.p(200, 0))
        createTouchEvent({
            item: cz,
            begin: function(data) {
                var item = data.item
                item.stopAllActions()
                yc.stopShake()
                return true
            },
            move: function(data) {
                var item = data.item
                var pos = item.getPosition()
                var delta = data.delta
                if (!item.isTouch) {
                    pos.x += delta.x
                    if (pos.x < item.rootPos.x) {
                        item.isTouch = true
                        pos.x = item.rootPos.x
                    }
                    item.x = pos.x
                    if (item.isTouch) {
                        addShowType({
                            item: item,
                            show: "moveBy",
                            buf: cc.p(20, 0),
                            time: 2.0,
                        })
                        yc.shake(delta.x)
                    }
                }
            },
            end: function(data) {
                var item = data.item
                item.isTouch = false
            }
        })
        yc.buf = 0
        var minus = 0.05
        var pars = 0.005
        var rate = 3//cc.sys.isNative ? 3 : 1
        yc.shake = function(buf) {
            playEffect(res.do4_sound)
            yc.buf += (Math.abs(buf * pars) * rate)
            if (!yc.shaking) {
                yc.shaking = true
                var count = 1
                addTimer({
                    fun: function(key) {
                        yc.setRotation(count % 2 ? -yc.buf : yc.buf)
                        yc.buf -= minus
                        if (yc.buf < 0) {
                            yc.buf = 0
                            stopEffect()
                        }
                        count++
                    },
                    time: 1 / 24,
                    repeat: cc.REPEAT_FOREVER,
                    father: self,
                })
            }
        }
        yc.stopShake = function(){
            yc.buf = 0
        }
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
            img: res.do_content4, //图片和声音文件
            sound: res.sound_do4
        })
    }
})