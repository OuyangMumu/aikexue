
//@author mu @14/4/15
var mainLayer = myLayer.extend({
    sprite: null,
    viedo: null,
    layerName: "mainLayer",
    changeDelete: false, //是否退出删除
    ctor: function() {
        this._super();
        var ui_list = [
            "btn_see",
            "btn_do",
            "btn_learn",
            "btn_show",
            "btn_help",
            "btn_close",
            "btn_start",
            "view_show",
            "img_title",
        ]
        var self = this
        loadUI(this, res.mainLayer, ui_list)

        this.btn_close.setScale(1.5)
        this.btn_help.setScale(1.5)
        this.btn_close.setContentSize(70, 68)//限制在网页上按钮变形问题

        var tempPos = this.btn_close.getPosition()
        this.btn_close.setPosition(cc.p(tempPos.x, tempPos.y + 20))
        tempPos = this.btn_help.getPosition()
        this.btn_help.setPosition(cc.p(tempPos.x - 15, tempPos.y + 20))

        var enter = function(layername) {
            changeLayer({
                out: self,
                in : layerControl.getLayer(layername, true),
            })
        }

        this.btn_see.addClickEventListener(function() {
            if (mainInfo.seeList.length == 1) {
                enter("seeExp1")
                return
            }
            changeLayer({
                out: self,
                in : layerControl.getLayer("seeLayer")
            })
        })
        this.btn_do.addClickEventListener(function() {
            if (mainInfo.doList.length == 1) {
                enter("doExp1")
                return
            }
            changeLayer({
                out: self,
                in : layerControl.getLayer("doLayer")
            })
        })
        this.btn_show.setVisible(false)
        // this.btn_show.addClickEventListener(function() {
        //     if (mainInfo.noShow) //判断秀一秀不能点击
        //         return
        //     changeLayer({
        //         out: self,
        //         in : layerControl.getLayer("showLayer")
        //     })
        // })
        this.btn_learn.addClickEventListener(function() {
            changeLayer({
                out: self,
                in : layerControl.getLayer("learnLayer")
            })
        })
        this.btn_help.addClickEventListener(function() {
            changeLayer({
                out: self,
                in : layerControl.getLayer("helpLayer"),
                back: "mainLayer"
            })
        })
        this.btn_close.addClickEventListener(function() {
            dialogControl.AddDialog("Exit")
        })
        this.KeyBack = function() {
            dialogControl.AddDialog("Exit")
        }
        self.img_title.setTexture(mainInfo.titleFile)

        if (mainInfo.mainLoop.length == 1) {
            self.btn_start.setVisible(true)
            self.btn_start.addClickEventListener(function() {
                changeLayer({
                    out: self,
                    in : layerControl.getLayer("videoLayer")
                })
            })
        } else {
            self.btn_start.setVisible(false)
        }
        var self = this
        self.loopnode = self.addLoop(mainInfo.mainLoop)
        if (mainInfo.noSee) //传递参数，判断是否可见看一看按钮
            this.btn_see.setVisible(false)
        if (mainInfo.noDo) //传递参数，判断是否可见做一做按钮
            this.btn_do.setVisible(false)
        if (mainInfo.noStudy) //传递参数，判断是否可见学一学按钮
            this.btn_learn.setVisible(false)

        var self = this
        var initPos = function() {
            var posList = []
            var btnList = [
                "btn_see",
                "btn_do",
                "btn_learn",
                "btn_show",
            ]
            var keyList = [1, 1, 1, 1]
            var judgeList = [
                mainInfo.noSee,
                mainInfo.noDo,
                mainInfo.noStudy,
                false
            ]
            for (var i = 0; i < judgeList.length; i++) {
                if (judgeList[i]) {
                    keyList[i] = 0
                }
            }
            for (var i = 0; i < btnList.length; i++) {
                posList[i] = self[btnList[i]].getPosition()
            }
            var count = 0
            for (var i = 0; i < keyList.length; i++) {
                if (keyList[i]) {
                    self[btnList[i]].setPosition(posList[count])
                    count++
                }
            }
        }
        initPos()

        return true
    },
    myCtor: function() {
        var self = this
        if (self.loopnode) {
            self.loopnode.init()
        }
    },
    myEnter: function() {
        this._super()
    },
    myExit: function() {},
    afterCtor: function() {
        //ctor后只调用一次
        playMusic(mainInfo.soundFile)
    },
    addLoop: function(list, offset) { //添加轮播图
        offset = offset || cc.p(5, -10)
        var node = new cc.Node()
        var self = this
        var view = self.view_show
        var size = view.getContentSize()
        var startx = size.width / 2
        var height = size.height / 2
        var devide = size.width
        var timePerMove = 2.0
        var timeMove = 0.3
        var minPox = offset.x
        var maxPox = (list.length - 1) * devide + offset.x
        node.list = []
        for (var i = 0; i < list.length; i++) {
            var item = new ccui.ImageView(list[i])
            item.setAnchorPoint(cc.p(0.5, 0.5))
            item.setPosition(i * devide + offset.x, offset.y)
            item.past = i * devide + offset.x
            node.list[i] = item
            node.addChild(item)
        }
        view.addChild(node)
        node.setCascadeOpacityEnabled(true)
        node.setPosition(startx, height)
        var judge = function() {
            for (var i = 0; i < node.list.length; i++) {
                var item = node.list[i]
                addShowType({
                    item: item,
                    show: "moveBy",
                    time: timeMove,
                    buf: cc.p(-devide, 0),
                    fun: function(item) {
                        item.x = item.past - devide
                        if (item.x < minPox) {
                            item.x = maxPox
                        }
                        item.past = item.x
                    },
                })
            }
        }
        if (node.list.length > 1)
            addTimer({
                fun: judge,
                repeat: cc.REPEAT_FOREVER,
                time: timePerMove,
                key: "LOOP",
                delay: 0,
                father: self.loadUI,
            })
        node.init = function() {
            this.setOpacity(255)
            for (var i = 0; i < this.list.length; i++) {
                this.list[i].setOpacity(255)
            }
        }
        return node
    },
    update: function(dt) {}
})