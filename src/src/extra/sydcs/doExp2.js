//@author mu @16/4/27
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2", //必要！ 用于判定各种按钮的返回和进入
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
            key: "do2",
        })
        safeAdd(self, item_do)
        var uilist = [
            "item_ruler",
            "judge",
            "item_hand",
        ]
        loadList(item_do, uilist)
        var hand = item_do.item_hand
        var judge = item_do.judge
        var ruler = item_do.item_ruler
        hand.rootPos = hand.getPosition()

        var judgePos = getWorldPos(judge)
        createTouchEvent({
            item: hand,
            move: function(data) {
                var item = data.item
                var delta = data.delta
                var pos = data.pos
                item.x += delta.x
                item.y += delta.y
                if (!item.isTouch) {
                    var result = judgeInside({
                        item: judge,
                        pos: getWorldPos(item)
                    })
                    if (result) {
                        item.isTouch = true
                        item.setVisible(false)
                    }
                } else {
                    var devide = judgePos.y - getWorldPos(item).y
                    ruler.showInDevide(devide)
                }
            },
            end: function(data) {
                var item = data.item
                item.setPosition(item.rootPos)
                item.setVisible(true)
                if(item.isTouch)//2017/8/14 修改点击手直接出发直尺bug问题
                    ruler.rever()
                item.isTouch = false
            }
        })
        ruler.curDevide = 0
        var devideList = [
            7,
            8,
            3,
            10,
            7,
            10,
            13,
            8,
            7,
        ]
        for (var i = 1; i < devideList.length; i++) {
            devideList[i] = devideList[i] + devideList[i - 1]
        }
        ruler.showInDevide = function(devide) {
            if (devide > ruler.curDevide) {
                ruler.curDevide = devide
            }
            var curIndex = null
            for (var i = 0; i < devideList.length; i++) {
                if (ruler.curDevide < devideList[i]) {
                    curIndex = i
                    break
                }
            }
            if (curIndex == null) {
                curIndex = devideList.length
            }
            ruler.setSpriteFrame(sprintf("ruler_pos_%02d.png", curIndex + 2))
            ruler.curIndex = curIndex
        }
        ruler.rever = function() {
            var ruler = this
            ruler.curDevide = 0
            playEffect(res.do2_sound)
            ruler.runAction(createAnimation({
                frame: "ruler_shake_%02d.png",
                start: 16,
                end: 27 - (devideList.length - ruler.curIndex) - 2,
                rever: true,
                fun: function() {
                    ruler.setSpriteFrame("ruler_pos_01.png")
                    stopEffect()
                },
                time: 1 / 24,
            }))
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
            img: res.do_content2, //图片和声音文件
            sound: res.sound_do2
        })
    }
})