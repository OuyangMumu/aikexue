//@author mu @16/4/27

var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("cldrx_run")
        loadPlist("cldrx_up")
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
                vis: true,
            }) //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initScene()
        self.initPeople() //创建人物
        return true
    },
    changeStatus: function(statu) {
        var self = this
        var dataControl = self.dataControl
        var btns = self.btns
        var btnlist = [
            "btn_play",
            "btn_pause",
            "btn_stop",
            "btn_restart",
        ]
        var control = ""
        var resume = false
        if (statu) {
            if (statu == "play" && dataControl.statu == "pause") {
                control = "resume"
                dataControl.statu = statu
            } else {
                dataControl.statu = statu
                control = dataControl.statu
            }
        } else {
            control = dataControl.statu
        }

        switch (dataControl.statu) {
            case "play":
                result = [false, true, true, false]
                break
            case "pause":
                result = [true, false, true, false]
                break
            case "stop":
                result = [true, false, false, false]
                break
            case "end":
                result = [false, false, false, true]
                break
        }
        for (var i = 0; i < btnlist.length; i++) {
            btns[btnlist[i]].setVisible(result[i])
        }
        switch (control) {
            case "play":
                self.reSet()
                self.startAni()
                break
            case "stop":
                self.reSet()
                break
        }
        for (var i = 0; i < dataControl.aniList.length; i++) {
            if (dataControl.aniList[i]) {
                switch (control) {
                    case "resume":
                        dataControl.aniList[i].resume()
                        break
                    case "end":
                        break
                    case "pause":
                        dataControl.aniList[i].pause()
                        break
                }
            }
        }
    },
    reSet: function() {
        var self = this
        var scale = 1.26
        var start = 500
        var dataControl = self.dataControl
        for (var i = 0; i < dataControl.aniList.length; i++) {
            var item = dataControl.aniList[i]
            if (item) {
                item.stopAllActions()
                item.removeFromParent(true)
                dataControl.aniList[i] = null
            }
        }
        if (self.resetMan) {
            self.resetMan.removeFromParent(true)
            self.resetMan = null
        }
        var man = new cc.Sprite("#cldrx_run_01.png")
        man.setScale(scale)
        man.setPosition(getMiddle(-start, -60))
        safeAdd(self, man)
        self.resetMan = man
    },
    startAni: function() {
        var self = this
        var dataControl = self.dataControl
        var start = 500
        var devidetime = 0.05
        var pertime = devidetime * 15
        var dis = 370
        var count = 3
        var time = pertime * count
        var scale = 1.26
        var scale2 = 1.05
        var man = null
        if (self.resetMan) {
            self.resetMan.removeFromParent(true)
            self.resetMan = null
        }
        man = new cc.Sprite("#cldrx_run_01.png")
        man.setScale(scale)
        man.setPosition(getMiddle(-start, -60))
        if (!man.act) {
            man.act = function() {
                var man = this
                var ani = cc.repeatForever(createAnimation({
                    frame: "cldrx_run_%02d.png",
                    end: 15,
                    time: devidetime,
                }))
                man.runAction(ani)
            }
        }
        addShowType({
            item: man,
            show: "moveBy",
            time: time,
            buf: cc.p(dis, 0),
            fun: function(item) {
                item.stopAllActions()
                item.setVisible(false)
                var man2 = new cc.Sprite("#cldrx_up_01.png")
                var ani = cc.sequence(
                    createAnimation({
                        frame: "cldrx_up_%02d.png",
                        end: 20,
                        time: devidetime,
                    }),
                    cc.callFunc(function() {
                        self.changeStatus("end")
                    })
                )
                man2.setScale(scale2)
                man2.setPosition(582.5, 329.6)
                man2.runAction(ani)
                safeAdd(self.inside_node, man2)
                dataControl.aniList.push(man2)
            }
        })
        man.act()
        safeAdd(self.inside_node, man)
        dataControl.aniList.push(man)
    },
    initScene: function() {
        var self = this
        var dataControl = self.dataControl
        dataControl.aniList = []
        var bg = new ccui.ImageView(res.cldrx_see_back)
        bg.setPosition(getMiddle(0, -80))
        safeAdd(self.inside_node, bg)
        var btnlist = [
            "btn_play",
            "btn_pause",
            "btn_stop",
            "btn_restart",
        ]
        var btns = loadNode(res.see_btns, btnlist)
        btns.setPosition(200, 70)
        safeAdd(self, btns)
        self.btns = btns
        self.changeStatus("play")

        btns.btn_pause.addClickEventListener(function() {
            self.changeStatus("pause")
        })
        btns.btn_play.addClickEventListener(function() {
            self.changeStatus("play")
        })
        btns.btn_restart.addClickEventListener(function() {
            self.changeStatus("play")
        })
        btns.btn_stop.addClickEventListener(function() {
            self.changeStatus("stop")
        })
        self.btn_result.addClickEventListener(function() {
            self.nodebs.say({
                key: "result",
            })
        })
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs) //添加人物对话
        addContent({
            people: this.nodebs,
            key: "Show", //对话标签 之后让人物说话需要用到的参数
            img: res.cldrx_see_conten, //图片和声音文件
            sound: res.cldrx_see_sound1
        })
        addContent({
            people: this.nodebs,
            key: "result", //对话标签 之后让人物说话需要用到的参数
            img: res.cldrx_see1_result, //图片和声音文件
            sound: res.cldrx_see_sound2,
            id: "result", //结论的时候的特殊标签
            offbg: cc.p(20, 0)
        })
    }
})