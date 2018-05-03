//@author mu @16/4/27

var seeExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp2", //必要！ 用于判定各种按钮的返回和进入
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
        var self = this.inside_node
        var bg = new cc.Sprite(res.see_bg2)
        bg.setPosition(getMiddle())
        safeAdd(self, bg)

        var fade = createLayout({
            pos: cc.p(0, 0),
            size: cc.director.getWinSize(),
            op: 255,
            color: cc.color(0, 0, 0, 255),
        })
        safeAdd(self, fade)

        var sun = new cc.Sprite(res.img_moon)
        var size = sun.getContentSize()
        sun.setPosition(869, 489)
        safeAdd(self, sun)
        var clip = new cc.Sprite(res.img_eat)
        clip.setScale(0.9)
        var sunClip = new cc.ClippingNode(clip)
        sunClip.setPosition(size.width / 2, size.height / 2)
        sunClip.setAlphaThreshold(0)
        safeAdd(sun, sunClip)
        var nodebs = this.nodebs

        var buf = [
            cc.p(-158, -117),
            cc.p(170, -109),
        ]
        var eat = new cc.Sprite(res.img_eat)
        safeAdd(sunClip, eat)

        var btnFind = new ccui.Button(res.btn_get_normal, res.btn_get_select)
        btnFind.setPosition(80, 500)
        btnFind.setVisible(false)
        safeAdd(self, btnFind)
        btnFind.addClickEventListener(function() {
            nodebs.say({
                key: "find",
                force: true,
            })
        })

        var btns = createPlayBtns({
            type: "S",
            pos: cc.p(40, 100),
            startFun: function() {
                fade.setOpacity(0)
                eat.setPosition(buf[0])
                eat.setColor(cc.color(0, 0, 0, 255))    
                var count = 0
                addShowType({
                    item: eat,
                    show: "moveTo",
                    buf: cc.p(0, 0),
                    time: 3.0,
                    fun: function() {
                        addShowType({
                            item: eat,
                            show: "moveTo",
                            buf: cc.p(buf[1]),
                            time: 3.0,
                            delay: 0.5,
                            fun: function() {
                                count++
                                if (count == 2) {
                                    btnFind.setVisible(true)
                                    self.btns.end()
                                }
                            }
                        })
                    }
                })
                addShowType({
                    item: fade,
                    show: "fadeTo",
                    buf: 255,
                    time: 3.0,
                    fun: function() {
                        addShowType({
                            item: fade,
                            show: "fadeTo",
                            buf: 0,
                            time: 3.0,
                            delay: 0.5,
                            fun: function() {
                                count++
                                if (count == 2) {
                                    btnFind.setVisible(true)
                                    self.btns.end()
                                }
                            }
                        })
                    }
                })
            },
            pauseFun: function() {
                eat.pause()
                fade.pause()
            },
            resumeFun: function() {
                eat.resume()
                fade.resume()
            },
            stopFun: function() {
                fade.setOpacity(0)
                eat.setPosition(buf[0])
                fade.stopAllActions()
                eat.stopAllActions()
            }
        })
        self.btns = btns
        safeAdd(self, btns)

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
            img: res.see_font2, //图片和声音文件
            sound: res.see_sound2
        })
        addContent({
            people: this.nodebs,
            key: "find", //对话标签 之后让人物说话需要用到的参数
            img: res.see_cont2, //图片和声音文件
            sound: res.sound_find2,
            id: "result",
            btnModify:cc.p(0, 0)
        })
    }
})