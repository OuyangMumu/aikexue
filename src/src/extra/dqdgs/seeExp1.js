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
                self.canSay = true
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: sprintf("see_sound%d", self.curIndex + 1),
                    force: true,
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
        self.curIndex = 0
        return true
    },
    initScene: function() {
        var self = this
        var posx = 230
        var posy = 460
        var posD = 100
        var node = createNewLink({
            imgList: [res.btn1_normal, res.btn1_act, res.btn2_normal, res.btn2_act, res.btn3_normal, res.btn3_act],
            posList: [cc.p(posx, posy), cc.p(posx, posy - posD), cc.p(posx, posy - 2 * posD)],
            noFrame: true,
            onlyTrue: true,
            linkFun: function(index) {
                if (!self.showImg) {
                    var img = new cc.Sprite(res[sprintf("see_img%d", index + 1)])
                    img.setPosition(getMiddle(0, -40))
                    safeAdd(self, img)
                    self.showImg = img
                }
                var img = self.showImg
                img.setTexture(res[sprintf("see_img%d", index + 1)])
                self.curIndex = index
                if (self.canSay) {
                    self.nodebs.say({
                        key: sprintf("see_sound%d", index + 1),
                        force: true,
                    })
                }
            },
            init: function() {
                var sp = new cc.Sprite(res.img_font)
                sp.setPosition(getMiddle(70, 250))
                safeAdd(self, sp)
            },
            failBack: false,
            firstIndex: 0,
        })
        safeAdd(self, node)
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        for (var i = 0; i < 3; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("see_sound%d", i + 1), //对话标签 之后让人物说话需要用到的参数
                sound: res[sprintf("see_sound%d", i + 1)]
            })
        }
    }
})