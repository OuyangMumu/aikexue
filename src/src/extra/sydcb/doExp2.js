//@author mu @16/4/27

var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {},
    myExit: function() { //退出时调用
        this._super()
        removeTimer("JUDGE_SOUND_VOLUM")
    },
    myDelete: function() { //删除时调用
        this._super()
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        var self = this
        this._super()
        if (this.nodebs) {
            this.nodebs.show(function() {
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: "Show"
                })
            })
        }
        var zkz = self.zkz
        addTimer({
            key: "JUDGE_SOUND_VOLUM",
            time: 0.1,
            fun: function() {
                var percent = zkz.getAirPercent()
                if (zkz.isReady() && !self.showTips) {
                    cc.log("fuck here")
                    self.showTips = true
                    self.nodebs.say({ //当存在key为show的对话ID才调用
                        key: "Next",
                        force: true,
                    })
                }
                if (!IF_SOUND_ON) {
                    cc.audioEngine.setEffectsVolume(0)
                } else {
                    if (percent > 0.3) {
                        cc.audioEngine.setEffectsVolume(1)
                    } else {
                        cc.audioEngine.setEffectsVolume(percent * 3.3)
                    }
                }
            },
            father: self,
            repeat: cc.REPEAT_FOREVER,
        })
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
        var zkz = createZKZ()
        zkz.setPosition(316, 88)
        zkz.setScale(1.2)
        safeAdd(self.inside_node, zkz)
        var nz = createClock({
            ifsec: true,
            type: "naozhong",
            ifsound: true,
        })
        nz.setPosition(0, 90)
        zkz.addItem(nz)
        nz.start()
        self.zkz = zkz
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
            img: res.sydcb_do2_content1, //图片和声音文件
            sound: res.do2_sound1
        })
        addContent({
            people: this.nodebs,
            key: "Next",
            img: res.sydcb_do2_content2,
            sound: res.do2_sound2,
        })
    }
})