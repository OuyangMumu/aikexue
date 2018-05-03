//@author mu @16/4/27
var keyRef = {
    heilongjiang: "img_hlj",
    neimenggu: "img_nmg",
    jilin: "img_jl",
    qinghai: "img_qh",
    shanxi: "img_sx", //陕西
    liaoning: "img_ln",
    guizhou: "img_gz",
    xizang: "img_xz",
    fujian: "img_fj",
    gansu: "img_gs",
    hunan: "img_hn",
    hubei: "img_hb",
    zhejiang: "img_zj",
    henan: "img_hn2",
    jiangxi: "img_jx",
    jiangsu: "img_js",
    xinjiang: "img_xj",
    yunnan: "img_yn",
    guangdong: "img_gd",
    guangxi: "img_gx",
    shanxi2: "img_sx2", //山西
    shandong: "img_sd",
    anhui: "img_ah",
    ningxia: "img_nx",
    sichuan: "img_sc",
    chongqing: "img_cq",
    taiwan: "img_tw",
    shanghai: "img_sh",
    hainan: "img_hn3"
}

var toolRef = [
    "shanghai",
    "yunnan",
    "neimenggu",
    "taiwan",
    "jilin",
    "sichuan",
    "ningxia",
    "anhui",
    "shandong",
    "shanxi2",
    "guangdong",
    "guangxi",
    "xinjiang",
    "jiangsu",
    "jiangxi",
    "henan",
    "zhejiang",
    "hainan",
    "hubei",
    "hunan",
    "gansu",
    "fujian",
    "xizang",
    "guizhou",
    "liaoning",
    "chongqing",
    "shanxi",
    "qinghai",
    "heilongjiang",
]

var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("do2tool")
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
        self.totalLen = 0
        for (var i in keyRef) {
            self.totalLen++
        }
        self.allCount = self.totalLen
        self.initPeople() //创建人物
        self.initScene()
        return true
    },
    initScene: function() {
        var self = this
        var uilist = []
        for (var i in keyRef) {
            uilist[uilist.length] = keyRef[i]
        }
        var node = loadNode(res.do2_json, uilist)
        node.init = function() {
            for (var i = 0; i < uilist.length; i++) {
                node[uilist[i]].setVisible(false)
            }
        }
        node.init()
        safeAdd(self, node)
        var judgeAll = function(data) {
            var item = data.item
            var pos = data.pos
            var judge = node[item.key]
                // var result = judgeOpInPos({
                //     item: judge,
                //     pos: pos,
                // })
            var result = judgeItemCrash({
                item1: item,
                item2: judge,
            })
            if (result) {
                judge.setVisible(true)
                self.allCount = self.allCount - 1
                if (self.allCount == 0) {
                    AddDialog("Tips", {
                        res: res.img_retry,
                        face: 1,
                        ifCancle: true,
                        yesCall: function() {
                            if (self.refreshCall) {
                                self.refreshCall()
                            }
                        }
                    })
                }
                return true
            } else {
                playEffect(res.zswd_wrong)
                item.removeFromParent(true)
            }
            return false
        }
        var showList = createList({
            type: "H",
            list: self.getRand(),
            pos: getMiddle(100, 250),
            num: 5,
            size: cc.size(500, 136),
            mix: 20,
            arrOff: cc.p(0, 0),
            color: "op",
            arrow: "blue",
            btnScale: 0.7,
            canUp: true,
            getFun: function(data) {
                var index = data.index
                var tex = data.tex
                var pos = data.pos
                var key = keyRef[toolRef[self.curRand[index]]]
                var sprite = new cc.Sprite(node[key].getSpriteFrame())
                sprite.setPosition(pos)
                sprite.key = key
                safeAdd(self, sprite)
                return sprite
            },
            outFun: function(data) {
                var item = data.item
                var pos = data.pos
                var index = data.index
                var result = judgeAll({
                    item: item,
                    pos: pos,
                    index: index,
                })
                if (!result) {
                    self.showList.judgeIndex(index, false)
                }
            }
        })
        self.addChild(showList)
        self.showList = showList
    },
    getRand: function() {
        var self = this
        var list = []
        var rand = getRand(self.totalLen)
        self.curRand = rand
        for (var i = 0; i < self.totalLen; i++) {
            list.push(sprintf("#dt_tool_%02d.png", rand[i] + 1))
        }
        return list
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
            img: res.do_content1, //图片和声音文件
            sound: res.do2_content
        })
    }
})