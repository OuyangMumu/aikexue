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
                    key: sprintf("sound%d%d", self.judgeindex, self.curIndex)
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
        self.curIndex = 0
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        self.initScene()
        var resultbtn = new ccui.Button(res.btn_jielun_normal, res.btn_jielun_select)
        this.addChild(resultbtn)
        resultbtn.setPosition(250, 500)
        resultbtn.addClickEventListener(function() {
            self.nodebs.say({
                key: "result"
            })
        })
        return true
    },
    initScene: function() {
        var self = this
        var node = createNewLink({
            imgList: [res.dt_btn1_normal, res.dt_btn1_select, res.dt_btn2_normal, res.dt_btn2_select],
            posList: [cc.p(100, 500), cc.p(100, 440)],
            noFrame: true,
            onlyTrue: true,
            linkFun: function(index) {
                self.getScene(index + 1)
            },
            failBack: false,
            firstIndex: 0,
        })
        safeAdd(self, node)
    },
    getScene: function(index) {
        var self = this
        self.judgeindex = index
        if (!self[sprintf("bg%d", index)]) {
            var allNode = new cc.Node()
            var uilist = [
                "bg",
                "bg2",
                "item1_normal",
                "item1_show",
                "item2_normal",
                "item2_show",
                "show0",
                "show1",
                "show2",
            ]
            var json = res[sprintf("see%d_json", index)]
            var bg = loadNode(json, uilist)
            safeAdd(allNode, bg)
            bg.init = function() {
                var itemList = [
                    "item1_normal",
                    "item2_normal",
                ]
                for (var i = 0; i < itemList.length; i++) {
                    var item = bg[itemList[i]]
                    item.index = i + 1
                    item.judgeindex = index
                    createTouchEvent({
                        item: item,
                        begin: function(data) {
                            var item = data.item
                            return item.judgeindex == self.judgeindex
                        },
                        end: function(data) {
                            bg.showIndex(data.item.index)
                        }
                    })
                }
            }
            bg.showIndex = function(index) {
                for (var i = 0; i < 3; i++) {
                    bg[sprintf("show%d", i)].setVisible(index == i)
                    var show = bg[sprintf("item%d_show", i)]
                    if (show) {
                        show.setVisible(index == i)
                    }
                    self.curIndex = index
                    if (self.canSay) {
                        self.nodebs.say({ //当存在key为show的对话ID才调用
                            key: sprintf("sound%d%d", self.judgeindex, self.curIndex),
                            force: true,
                        })
                    }
                }
            }
            bg.init()
            bg.showIndex(0)
            var fdj = createStaticFDJ({
                pos: cc.p(500, 300),
                insideScale: 1.5,
                judgeFun:function(item){
                    return item.index == self.judgeindex
                }
            })
            fdj.index = self.judgeindex
            fdj.setOutsideScale(0.5)
            fdj.setMoveItem(bg.bg)
            safeAdd(allNode, fdj)
            fdj.addItem(bg.bg2)
            safeAdd(self, allNode)
            self[sprintf("bg%d", index)] = allNode
        }
        var bg1 = self[sprintf("bg%d", self.judgeindex)]
        var bg2 = self[sprintf("bg%d", self.judgeindex == 1 ? 2 : 1)]
        if (bg1) {
            bg1.setVisible(true)
        }
        if (bg2) {
            bg2.setVisible(false)
        }
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
                key: sprintf("sound1%d", i), //对话标签 之后让人物说话需要用到的参数
                sound: res[sprintf("see1_sound%d", i)]
            })
        }

        addContent({
            people: this.nodebs,
            key: sprintf("sound2%d", 0), //对话标签 之后让人物说话需要用到的参数
            sound: res[sprintf("see1_sound%d", 0)]
        })
        for (var i = 1; i < 3; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("sound2%d", i), //对话标签 之后让人物说话需要用到的参数
                sound: res[sprintf("see2_sound%d", i)]
            })
        }
        addContent({
            people: this.nodebs,
            key: "result", //对话标签 之后让人物说话需要用到的参数
            sound: res.see_result,
            img: res.see_result_content,
            id: "result",
        })
    }
})