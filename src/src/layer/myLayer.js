//@author mu @16/5/18
var CC_CURRENT_LAYER = null
var IF_SOUND_ON = true
var MUSIC_VOL = null
var EFFECT_VOL = null
var LOCAL_ORDER = 100
var WEB_TYPE = {
    FIREFOX: "firefox",
}
var CUR_WEB_TYPE = null //判断当前浏览器是否为火狐浏览器

if (!cc.sys.isMobile) {
    if (cc.sys.browserType == WEB_TYPE.FIREFOX) {
        CUR_WEB_TYPE = WEB_TYPE.FIREFOX
    }
}

var KEYCODE_REF = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
}
var myLayer = cc.Layer.extend({
    needSet: true,
    needRedo: true,
    stopMusic: true,
    ctor: function() {
        this._super()
        var self = this
        CC_CURRENT_LAYER = self
        if (cc.sys.isMobile) {
            cc.eventManager.addListener({
                        event: cc.EventListener.KEYBOARD,
                        onKeyReleased: function(keyCode, event) {
                            if (keyCode == cc.KEY.back) {
                                if (CC_CURRENT_LAYER == self && self.KeyBack) {
                                    if (CAN_BACK) {
                                        self.KeyBack()
                                    }
                                }
                            }
                        }
                    },
                    this)
                // cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function() {
                //     if (CC_CURRENT_LAYER == self && self.KeyBack) {
                //         self.KeyBack()
                //     }
                // });
        } else {
            if (!cc.sys.isNative) {
                cc.eventManager.addListener({
                        event: cc.EventListener.KEYBOARD,
                        onKeyReleased: function(keyCode, event) {
                            switch (keyCode) {
                                case KEYCODE_REF.LEFT:
                                    if (self.KEY_LEFT_FUNC) {
                                        self.KEY_LEFT_FUNC()
                                    }
                                    break
                                case KEYCODE_REF.RIGHT:
                                    if (self.KEY_RIGHT_FUNC) {
                                        self.KEY_RIGHT_FUNC()
                                    }
                                    break
                            }
                        }
                    },
                    this)
            }
        }
        self.refreshCall = function() {
            var curPage = self
            var restartPage = self.layerName
            if (curPage && restartPage) {
                if (curPage.myExit) {
                    curPage.myExit()
                }
                if (curPage.myDelete) {
                    curPage.myDelete()
                }
                deleteLayer(curPage)
                var temp = getLayer(restartPage)
                myAddLayer(temp)
                if (temp.myCtor) {
                    temp.myCtor()
                }
                if (temp.myEnter) {
                    temp.myEnter()
                    temp.alreadyEnter = true
                }
            }
        }
    },
    learnCtor: function() {
        var ui_list = [
            "btn_home",
            "img_title",
            "img_page",
            "btn_help",
            "bg_title",
            "inside_node",
            "img_grass"
        ]
        loadUI(this, res.learnLayer, ui_list)
        if (this.load) {
            this.load()
        }
        var self = this
        this.btn_home.addClickEventListener(function() {
            changeLayer({
                out: self,
                in : layerControl.getLayer("mainLayer")
            })
        })
        this.KeyBack = function() {
            changeLayer({
                out: self,
                in : layerControl.getLayer("mainLayer")
            })
        }
        this.btn_help.addClickEventListener(function() {
            changeLayer({
                out: self,
                in : layerControl.getLayer("helpLayer"),
                back: "learnLayer",
                forceD: false
            })
        })
    },
    expCtor: function(data) {
        var ui_list = [
            "btn_result",
            "bg_title",
            "btn_home",
            "btn_help",
            "btn_menu",
            "btn_refresh",
            "inside_node",
            "bg",
        ]
        loadUI(this, res.seeExp, ui_list)
        this.initButton(data)
    },
    initButton: function(data) {
        var self = this
        data = data || {}
        var vis = data.vis || false
        var setZ = data.setZ || 1
        var settingData = data.settingData || {
            pos: cc.p(1080, 580)
        }
        var btnOff = data.btnOff || cc.p(0, 0)
        var noBtn = data.noBtn || false //此参数用于不需要三个按钮的时候使用

        if (noBtn) {
            self.btn_home.setVisible(false)
            self.btn_help.setVisible(false)
            self.btn_menu.setVisible(false)
            self.btn_refresh.setVisible(false)
        }
        if (self.btn_home) {
            setOff(self.btn_home, btnOff)
            self.btn_home.addClickEventListener(function() {
                changeLayer({
                    out: self,
                    in : layerControl.getLayer("mainLayer")
                })
            })
        }
        var judgeSingle = false
        if (self.preLayer) {
            var finalLayer = self.preLayer
            if (self.preLayer == "doLayer") {
                if (mainInfo.doList && mainInfo.doList.length == 1) {
                    finalLayer = "mainLayer"
                    judgeSingle = true
                }
            }
            if (self.preLayer == "seeLayer") {
                if (mainInfo.seeList && mainInfo.seeList.length == 1) {
                    finalLayer = "mainLayer"
                    judgeSingle = true
                }
            }
            self.KeyBack = function() {
                changeLayer({
                    out: self,
                    in : layerControl.getLayer(finalLayer)
                })
            }
        }
        if (self.btn_help && self.layerName) {
            setOff(self.btn_help, btnOff)
            self.btn_help.addClickEventListener(function() {
                changeLayer({
                    out: self,
                    in : layerControl.getLayer("helpLayer"),
                    back: self.layerName,
                    forceD: false
                })
            })
        }
        if (self.btn_menu && self.preLayer && self.layerName) {
            setOff(self.btn_menu, btnOff)
            if (!judgeSingle) {
                this.btn_menu.addClickEventListener(function() {
                    // dialogControl.AddDialog("QuitExp", {
                    //     cur: self,
                    //     back: self.preLayer,
                    //     restart: self.layerName,
                    // })
                    var curPage = self
                    var choosePage = self.preLayer
                    if (curPage && choosePage) {
                        changeLayer({
                            out: curPage,
                            in : layerControl.getLayer(choosePage)
                        })
                    }
                })
            } else {
                self.btn_menu.setVisible(false)
            }
        }
        if (self.btn_refresh && self.needRedo) {
            setOff(self.btn_refresh, btnOff)
            if (judgeSingle) {
                self.btn_refresh.setPosition(self.btn_menu.getPosition())
            }
            self.btn_refresh.addClickEventListener(function() {
                self.refreshCall()
            })
        } else {
            if (self.btn_refresh) {
                self.btn_refresh.setVisible(false)
            }
        }
        if (self.btn_result) {
            this.btn_result.setVisible(vis)
        }
        if (self.needSet) {
            var setting = createSetting(settingData)
            if (setZ != null) {
                setting.setLocalZOrder(setZ)
            }
            self.addChild(setting)
            self.setting = setting
        }
    },
    load: function(loadCallback) {
        if (loadCallback)
            loadCallback()
    },
    preExit: function() { //退出准备

    },
    myExit: function(exitCallback) { ////退出时调用
        if (exitCallback)
            exitCallback()
    },
    myDelete: function(deleteCallback) { //删除时调用
        if (deleteCallback)
            deleteCallback()
        if (this.stopMusic) {
            stopMusic()
            stopEffect()
        }
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        var self = this
            //stopMusic()
        CC_CURRENT_LAYER = self
        if (this.afterCtor) {
            this.afterCtor()
            this.afterCtor = null
        }
    },
    pageReEnter: function() {
        var self = this
        if (self.pageNode) {
            self.pageNode.setOpacity(255)
            for (var i = 0; i < self.pageNode.list.length; i++) {
                var item = self.pageNode.list[i]
                item.setOpacity(255)
            }
            if (self.pageNode.pageNum) {
                self.pageNode.pageNum.setOpacity(255)
            }
        }
    },
    reEnter: function() {},
    changeSelf: function(data) {
        var self = this
        data = data || {}
        var change = data.change || false
        var tempNew = layerControl.newLayer(self.layerName)
        changeLayer({
            out: self,
            in : tempNew,
            fun: function() {
                layerControl.change(self, tempNew)
            },
            notChange: change,
        })
    },
    initPageBtns: function(info) {
        var self = this
        if (info && info.length) {
            var btnlist = []
            var node = new cc.Node()
            node.setPosition(0, 0)
            node.setCascadeOpacityEnabled(true)
            node.curIndex = 0
            self.addChild(node)
            var setShowPage = function(vis) {
                vis = vis || false
                self.img_page.setVisible(vis)
            }

            var addBtns = function() {
                var btns = {
                    left: {
                        normal: res.btn_left_normal,
                        select: res.btn_left_select,
                    },
                    right: {
                        normal: res.btn_right_normal,
                        select: res.btn_right_select,
                    }
                }
                if (btns) { //屏蔽左右按钮
                    var judge = 430
                    var upPos = 50
                    var btnscale = 0.3
                    var btnleft = new ccui.Button(btns.left.normal, btns.left.select)
                    var size = cc.director.getWinSize()
                    addShowType({
                        item: btnleft,
                        show: "shakeF",
                        time: 0.7,
                        buf: cc.p(10, 0)
                    })
                    btnleft.setAnchorPoint(0.5, 0.5)
                    btnleft.setPosition(judge, upPos)
                    btnleft.setScale(btnscale)
                    node.addChild(btnleft)
                    var changePageFunc = function(key) {
                        var temp = node[sprintf("show%d", node.curIndex)]
                        if (temp && temp.finalChange) {
                            temp.finalChange(key)
                        }
                    }
                    self.KEY_LEFT_FUNC = function() {
                        changePageFunc(-1)
                    }
                    btnleft.addClickEventListener(function() {
                        changePageFunc(-1)
                    })
                    node.btnleft = btnleft
                    var btnright = new ccui.Button(btns.right.normal, btns.right.select)
                    addShowType({
                        item: btnright,
                        show: "shakeF",
                        time: 0.7,
                        buf: cc.p(-10, 0)
                    })
                    btnleft.setAnchorPoint(0.5, 0.5)
                    btnright.setPosition(size.width - judge, upPos)
                    btnright.setScale(btnscale)
                    btnright.addClickEventListener(function() {
                        changePageFunc(1)
                    })
                    self.KEY_RIGHT_FUNC = function() {
                        changePageFunc(1)
                    }
                    node.btnright = btnright
                    node.addChild(btnright)
                }
            }

            var judgeBtns = function() {
                var temp = node[sprintf("show%d", node.curIndex)]
                var left = false
                var right = false
                if (temp && temp.finalJudge) {
                    var result = temp.finalJudge()
                    left = result.left
                    right = result.right
                }
                if (node.btnleft) {
                    node.btnleft.setVisible(left)
                }
                if (node.btnright) {
                    node.btnright.setVisible(right)
                }
            }

            var showIndex = function(index) {
                self.img_page.setVisible(true)
                node.curIndex = index
                for (var i = 0; i < info.length; i++) {
                    var btn = node[sprintf("btn%d", i)]
                    var show = node[sprintf("show%d", i)]
                    var showPage = node[sprintf("showPage%d", i)]
                    var isShowPage = node[sprintf("show%d", i)].isShowPage
                    if (index == i) {
                        //新添加，为了点击按钮重复调用
                        var againIf = info[i].againIf || false
                        if(againIf){
                            var createFun = info[i].createFun
                            createFun()
                        }
                        if (btn) {
                            btn.loadTexture(btn.select)
                        }
                        if (show) {
                            show.setVisible(true)
                        }
                        if (showPage != null) {
                            self.img_page.setVisible(showPage)
                        }
                        if (isShowPage != null) {
                            self.img_page.setVisible(isShowPage)
                        }
                        if (self.img_page.isVisible()) {
                            if (show.changePage) {
                                show.changePage()
                            }
                        }
                    } else {
                        if (btn) {
                            btn.loadTexture(btn.normal)
                            btn.setContentSize(getSize(btn.normal))
                        }
                        if (show) {
                            show.setVisible(false)
                        }
                    }
                }
                judgeBtns()
            }
            for (var i = 0; i < info.length; i++) {
                var data = info[i]
                var btn = data.btn
                var btnScale = data.btnScale || 1
                var titles = data.titles
                var createFun = data.createFun
                var tabs = data.tabs
                var pics = data.pics
                var scales = data.scales
                var posOff = data.posOff
                var cuts = data.cuts || 100
                var modify = data.modify || cc.p(0, 0)
                if (btn) {
                    self.img_title.setVisible(false)
                    var upBtn = new ccui.ImageView(btn[0])
                    upBtn.normal = btn[0]
                    upBtn.select = btn[1]
                    upBtn.act = btn[2]
                    upBtn.setScale(btnScale)
                    upBtn.modify = modify
                    upBtn.index = i
                    btnlist.push(upBtn)
                    self.bg_title.addChild(upBtn)
                    createTouchEvent({
                        item: upBtn,
                        begin: function(data) {
                            var item = data.item
                            if (item.act) {
                                item.loadTexture(item.act)
                                item.setContentSize(getSize(item.act))
                            } else {
                                item.loadTexture(item.select)
                                item.setContentSize(getSize(item.select))
                            }
                            return true
                        },
                        end: function(data) {
                            var item = data.item
                            showIndex(item.index)
                        }
                    })
                    node[sprintf("btn%d", i)] = upBtn
                }
                if (tabs) {
                    if (!node[sprintf("show%d", i)]) {
                        var tempNode = new cc.Node()
                        tempNode.setCascadeOpacityEnabled(true)
                        tempNode.setPosition(0, 0)
                        node.addChild(tempNode)
                        node[sprintf("show%d", i)] = tempNode
                        tempNode.showIn = function() {
                            var father = this
                            father.changeTabs(father.curIndex)
                        }
                        tempNode.curIndex = 0
                        tempNode.changePage = function(){
                            var father = this
                            var index = father.curIndex
                            var show = father.showList[index]
                            if(show && show.changePage){
                                show.changePage()
                            }
                        }
                        tempNode.changeTabs = function(index) {
                            var father = this
                            for (var j = 0; j < father.tabList.length; j++) {
                                var curBtn = father.tabList[j]
                                var curShow = father.showList[j]
                                if (index == j) {
                                    curBtn.loadTexture(curBtn.select)
                                    curShow.setVisible(true)
                                    curShow.changePage()
                                    setShowPage(curShow.isShowPage)
                                    father.curIndex = index
                                } else {
                                    curBtn.loadTexture(curBtn.normal)
                                    curShow.setVisible(false)
                                }
                            }
                            judgeBtns()
                        }
                        tempNode.finalChange = function(key) {
                            var tempNode = this
                            var item = tempNode.showList[tempNode.curIndex]
                            if (item.list[item.curIndex + key]) {
                                item.curIndex += key
                                item.Move()
                            } else {
                                item.Move()
                            }
                        }
                        tempNode.finalJudge = function() {
                            var temoNode = this
                            var item = tempNode.showList[tempNode.curIndex]
                            var result = {
                                left: item.list[item.curIndex - 1] != null,
                                right: item.list[item.curIndex + 1] != null
                            }
                            return result
                        }
                        tempNode.tabList = []
                        tempNode.showList = []
                    }
                    var father = node[sprintf("show%d", i)]
                    for (var j = 0; j < tabs.length; j++) {
                        var normal = tabs[j].normal
                        var select = tabs[j].select
                        var pos = tabs[j].pos
                        var pics = tabs[j].pics
                        var tabBtn = new ccui.ImageView(normal)
                        var scales = tabs[j].scales
                        var posOff = tabs[j].posOff
                        tabBtn.setPosition(pos)
                        father.addChild(tabBtn)
                        tabBtn.normal = normal
                        tabBtn.select = select
                        tabBtn.index = j
                        createTouchEvent({
                            item: tabBtn,
                            begin: function(data) {
                                var item = data.item
                                item.loadTexture(item.select)
                                return true
                            },
                            end: function(data) {
                                var item = data.item
                                father.changeTabs(item.index)
                            }
                        })
                        tempNode.tabList.push(tabBtn)
                        tabBtn.setLocalZOrder(1)
                        var tempShow = createPages({
                            father: father,
                            pics: pics,
                            posOff: posOff,
                            scales: scales,
                            layer: self,
                            moveFun: function() {
                                judgeBtns()
                            }
                        })
                        tempNode.showList.push(tempShow)
                    }
                    father.changeTabs(0)
                } else if (pics) {
                    var item = createPages({
                        father: self,
                        pics: pics,
                        layer: self,
                        scales: scales,
                        posOff: posOff,
                        moveFun: function() {
                            judgeBtns()
                        }
                    })
                    node[sprintf("show%d", i)] = item
                    item.finalChange = function(key) {
                        var item = this
                        if (item.list[item.curIndex + key]) {
                            item.curIndex += key
                            item.Move()
                        } else {
                            item.Move()
                        }
                    }
                    item.finalJudge = function() {
                        var item = this
                        var result = {
                            left: item.list[item.curIndex - 1] != null,
                            right: item.list[item.curIndex + 1] != null
                        }
                        return result
                    }
                }
                if (createFun) {
                    var temp = createFun()
                    node[sprintf("show%d", i)] = temp
                    node.addChild(temp)
                    node[sprintf("showPage%d", i)] = false
                }
            }
            var size = self.bg_title.getContentSize()
            var devide = (size.width - cuts) / btnlist.length
            var begin = (cuts + devide) / 2
            for (var i = 0; i < btnlist.length; i++) {
                var modify = btnlist[i].modify || cc.p(0, 0)
                btnlist[i].setAnchorPoint(0.5, 0.5)
                btnlist[i].setPositionY(52 + modify.y)
                btnlist[i].setPositionX(begin + i * devide + modify.x)
            }
            addBtns()
            showIndex(0)
        }
    },
    initPages: function(data) {
        var self = this
        var mixLimit = 100
        var borderLimit = 120
        var jdtHeight = 90
        var changeFun = data.changeFun
        var btns = data.btns || {
            left: {
                normal: res.btn_left_normal,
                select: res.btn_left_select,
            },
            right: {
                normal: res.btn_right_normal,
                select: res.btn_right_select,
            }
        }
        var btnscale = data.btnScale || 0.3
        var imgScale = data.imgScale
        var titlescale = data.titleScale || 1
        var titles = data.titles
        var imgs = data.imgs
        var judgeScale = false
        if (imgScale != null) {
            if (!imgScale[0]) {
                judgeScale = true
            }
        } else {
            judgeScale = true
        }
        if (judgeScale) {
            var temp = []
            for (var i = 0; i < imgs.length; i++) {
                temp[i] = imgScale
            }
            imgScale = temp
        }
        var node = new ccui.Layout()
        var size = cc.director.getWinSize()
        var titleModify = data.titleModify || cc.p(0, 0)
        var mix = data.mix || 20 //移动差值
        var time = data.time || 0.1
        var numsModify = data.numsModify || cc.p(6, 12)
        var modify = data.modify || cc.p(0, 0)
        self.pageNode = node
        node.setContentSize(size)
        node.setPosition(0, 0)
        node.setClippingEnabled(true)
        node.curIndex = 0
        node.title = self.img_title
        node.maxIndex = imgs.length
        node.list = []
        node.titles = []



        node.changeTitle = function() {
            var res = this.titles[this.curIndex]
            this.title.loadTexture(res)
            this.title.setContentSize(getSize(res))
            this.title.setScale(titlescale)
            this.changePage()
        }
        node.changePage = function() {
            var node = this
            if (!node.pageNum) {
                var img = self.img_page
                var temp = new cc.LabelBMFont("", res.nums)
                temp.setAnchorPoint(0.5, 0.5)
                var size = img.getContentSize()
                temp.setPosition(size.width / 2 + numsModify.x, size.height / 2 + numsModify.y)
                img.addChild(temp)
                node.pageNum = temp
            }
            var num = node.pageNum
            num.setString(sprintf("%d/%d", node.curIndex + 1, node.maxIndex))
            if (node.jdt) {
                var jdt = node.jdt
                jdt.stopAllActions()
                var target = jdt.rootX + node.curIndex * jdt.devide
                addShowType({
                    item: jdt,
                    show: "moveTo",
                    buf: cc.p(target, jdtHeight),
                    time: time,
                })
            }
            if (changeFun) {
                changeFun()
            }
        }
        node.changeIndex = function(index) {}
        node.judgePage = function() {
            var node = this
            if (node.btnright) {
                node.btnright.setVisible(node.list[node.curIndex + 1] != null)
            }
            if (node.btnleft) {
                node.btnleft.setVisible(node.list[node.curIndex - 1] != null)
            }
        }
        node.Move = function() {
            node.changeTitle()
            var item = this
            var dis = item.minPos.x - item.list[item.curIndex].x
            var count = 0
            item.Moving = true
            for (var i = 0; i < item.list.length; i++) {
                var img = item.list[i]
                count++
                addShowType({
                    item: img,
                    show: "moveBy",
                    time: time,
                    buf: cc.p(dis, 0),
                    fun: function() {
                        count--
                        if (count == 0) {
                            item.Moving = false
                            node.judgePage()
                        }
                    }
                })
            }
        }
        createTouchEvent({
            item: node,
            swallow: false,
            begin: function(data) {
                var item = data.item
                var pos = data.pos
                if (!item.Moving) {
                    item.startPos = pos
                } else {
                    return false
                }
                return true
            },
            move: function(data) {
                var item = data.item
                var pos = data.pos
                var delta = data.delta
                for (var i = 0; i < item.list.length; i++) {
                    var img = item.list[i]
                    img.x += delta.x
                }
                if (item.jdt) {
                    var jdt = item.jdt
                    var judgex = delta.x * (jdt.devide / jdt.judge)
                    jdt.x -= judgex
                }
            },
            end: function(data) {
                var item = data.item
                var pos = data.pos
                var dis = pos.x - item.startPos.x
                var judge = dis > 0 ? -1 : 1
                var abs = Math.abs(dis)
                if (abs > mix) {
                    if (item.list[item.curIndex + judge]) {
                        item.curIndex += judge
                        item.Move()
                    } else {
                        item.Move()
                    }
                } else {
                    item.Move()
                }
            },
        })
        node.init = function() {
            var node = this
            if (imgs.length > 1) {
                if (!node.jdt) {
                    var jdt = new cc.Scale9Sprite(res.img_jdt, cc.rect(0, 0, 13, 13), cc.rect(4, 0, 5, 0))
                    jdt.setAnchorPoint(0, 0.5)
                    jdt.height = 13
                    var screenW = cc.director.getWinSize().width
                    jdt.width = (screenW - borderLimit * 2 - mixLimit) / imgs.length
                    node.addChild(jdt)
                    node.jdt = jdt
                    jdt.devide = (screenW - borderLimit * 2) / imgs.length
                    jdt.setPosition(cc.p(borderLimit, jdtHeight))
                    jdt.rootX = jdt.getPositionX()
                    jdt.judge = (screenW - borderLimit * 2)
                }
            }
            node.title.setPosition(node.title.getPositionX() + titleModify.x, node.title.getPositionY() + titleModify.y)
            for (var i = 0; i < imgs.length; i++) {
                var img = null
                switch (typeof(imgs[i])) {
                    case "function":
                        img = imgs[i]()
                        break
                    default:
                        img = new ccui.ImageView(imgs[i])
                        break
                }

                img.setAnchorPoint(0.5, 0.5)
                var temppos = cc.p(size.width / 2 + size.width * i + modify.x, size.height / 2 + modify.y)
                img.setPosition(temppos)
                if (i == 0) {
                    node.minPos = temppos
                }
                img.index = i
                if (imgScale[i] != null) {
                    img.setScale(imgScale[i])
                }
                node.list[i] = img
                node.titles[i] = titles[i]
                img.setCascadeOpacityEnabled(true)
                node.addChild(img)
            }
            node.setCascadeOpacityEnabled(true)
            if (btns) { //屏蔽左右按钮
                var judge = 430
                var upPos = 50
                var btnleft = new ccui.Button(btns.left.normal, btns.left.select)
                addShowType({
                    item: btnleft,
                    show: "shakeF",
                    time: 0.7,
                    buf: cc.p(10, 0)
                })
                btnleft.setAnchorPoint(0.5, 0.5)
                btnleft.setPosition(judge, upPos)
                btnleft.setScale(btnscale)
                node.addChild(btnleft)
                var changePageFunc = function(key) {
                    if (node.list[node.curIndex + key]) {
                        node.curIndex += key
                        node.Move()
                    }
                }
                self.KEY_LEFT_FUNC = function() {
                    changePageFunc(-1)
                }
                btnleft.addClickEventListener(function() {
                    changePageFunc(-1)
                })

                node.btnleft = btnleft
                var btnright = new ccui.Button(btns.right.normal, btns.right.select)
                addShowType({
                    item: btnright,
                    show: "shakeF",
                    time: 0.7,
                    buf: cc.p(-10, 0)
                })
                btnleft.setAnchorPoint(0.5, 0.5)
                btnright.setPosition(size.width - judge, upPos)
                btnright.setScale(btnscale)
                btnright.addClickEventListener(function() {
                    changePageFunc(1)
                })
                self.KEY_RIGHT_FUNC = function() {
                    changePageFunc(1)
                }
                node.btnright = btnright
                node.addChild(btnright)
            }
            node.judgePage()
            node.changeTitle()
            self.img_page.setVisible(imgs.length >= 1)
        }
        node.init()
        return node
    },

    initPagegsr: function(data) {
        var self = this

        var data = data || {}
        var imgs = data.imgs
        var btns = data.btns || []
        var btnpos = data.btnpos
        var pavedata = data.pavedata
        var func = data.func
        var titlepng = data.titlepng || null
        var titlepos = data.titlepos || cc.p(0, 0)
        var btnSkipbackFun = data.btnSkipbackFun
        var father = data.father

        var allLabel = data.allLabel
        var pagelist = []
        var btnslist = []
        var lay = createLayout({
            pos: cc.p(0, 0),
            size: cc.winSize,
            op: 0,
        })
        this.alllay = lay
        lay.setClippingEnabled(true)
        lay.setCascadeOpacityEnabled(true)
        father = father == null ? this : father
        father.addChild(lay)


        this.img_title.setVisible(false)
        if (titlepng) {
            this.img_title.setVisible(true)
            this.img_title.loadTexture(titlepng)
            this.img_title.setContentSize(getSize(titlepng))
            this.img_title.setPosition(this.img_title.x + titlepos.x, this.img_title.y + titlepos.y)
        }

        var btnleft = new ccui.Button(res.btn_left_normal, res.btn_left_select)
        btnleft.setAnchorPoint(0.5, 0.5)
        btnleft.setPosition(430, 50)
        btnleft.setScale(0.3)
        father.addChild(btnleft)
        father.btnleft = btnleft
        addShowType({
            item: btnleft,
            show: "shakeF",
            time: 0.7,
            buf: cc.p(10, 0)
        })

        var btnright = new ccui.Button(res.btn_right_normal, res.btn_right_select)
        btnright.setAnchorPoint(0.5, 0.5)
        btnright.setPosition(cc.winSize.width - 430, 50)
        btnright.setScale(0.3)
        father.addChild(btnright)
        father.btnright = btnright
        addShowType({
            item: btnright,
            show: "shakeF",
            time: 0.7,
            buf: cc.p(-10, 0)
        })

        for (var i in imgs) {
            var simipage = new similarityPageView(imgs[i], -cc.winSize.width, -65, true, lay, true, pavedata[i]);
            pagelist.push(simipage)
            simipage.Tagnum = i
            if (pagelist.length >= 2) {
                simipage.getPageViewNode().y = -600
                simipage.getPageViewNode().jdt.y = -600
            }
            simipage.addMovePageListener(function() {
                if (pagelist[this.Tagnum].getCurPageIndex() == pagelist[this.Tagnum].getPages()) {
                    btnright.setVisible(false)
                    btnleft.setVisible(true)
                    if (pagelist[this.Tagnum].getPages() == 1)
                        btnleft.setVisible(false)

                } else if (pagelist[this.Tagnum].getCurPageIndex() == 1) {
                    btnleft.setVisible(false)
                    btnright.setVisible(true)
                } else {
                    btnright.setVisible(true)
                    btnleft.setVisible(true)
                }

                allLabel.setString(pagelist[this.Tagnum].getCurPageIndex() + "  /  " + pagelist[this.Tagnum].getPages());
                if (func)
                    func({
                        index:this.Tagnum,
                        num: pagelist[this.Tagnum].getCurPageIndex()
                    })
            })
        }
        //页码显示
        var labelstr = 0
        if (pagelist[0])
            labelstr = "1/" + pagelist[0].getPages()

        var allLabel = new cc.LabelBMFont(labelstr, res.nums)
        allLabel.setPosition(106, 40)
        this.img_page.addChild(allLabel)

        var currentTag = 0
        var btnleftfun = function() {
            if (!pagelist[currentTag].scrollNext(-1)) {
                btnleft.setVisible(false)
                btnright.setVisible(true)
            } else {
                btnright.setVisible(true)
                btnleft.setVisible(true)
            }
        }
        btnleft.addClickEventListener(btnleftfun)
        self.KEY_LEFT_FUNC = function() {
            if (btnleft.isVisible()) {
                btnleftfun()
            }
        }

        var btnrightfun = function() {
            if (!pagelist[currentTag].scrollNext(1)) {
                btnright.setVisible(false)
                btnleft.setVisible(true)
            } else {
                btnright.setVisible(true)
                btnleft.setVisible(true)
            }
        }
        btnright.addClickEventListener(btnrightfun)
        self.KEY_RIGHT_FUNC = function() {
            if (btnright.isVisible()) {
                btnrightfun()
            }
        }

        if (pagelist[0].getPages() == 1) {
            btnleft.setVisible(false)
            btnright.setVisible(false)
        } else
            btnleft.setVisible(false)

        for (var i = 0; i < btns.length; i++) {
            var btn = new ccui.Button(btns[i][2], btns[i][1]);
            btn.setPosition(btnpos[i])
            father.addChild(btn)
            btn.Tagnum = i
            btnslist.push(btn)
            if (btnslist.length == 1)
                btn.loadTextureNormal(btns[i][1])

            btn.addClickEventListener(function(sender, type) {
                if(sender.notClick){
                  return
                }
                for (var k in btnslist) {
                    btnslist[k].loadTextureNormal(btns[k][2])
                    btnslist[k].notClick = false
                    pagelist[k].getPageViewNode().y = -600
                    pagelist[k].getPageViewNode().jdt.y = -600
                }
                sender.loadTextureNormal(btns[sender.Tagnum][1])
                currentTag = sender.Tagnum
                sender.notClick = true
                pagelist[currentTag].setCurPageIndex(1)
                
                if (pagelist[sender.Tagnum].getPageViewNode().y < 0) {
                    pagelist[sender.Tagnum].changepaveViewPos(0, 120);
                    var pages = pagelist[sender.Tagnum].getPages()
                    if (pages <= 1) {
                        btnleft.setVisible(false)
                        btnright.setVisible(false)
                    } else {
                        btnleft.setVisible(false)
                        btnright.setVisible(true)
                    }
                    allLabel.setString("1  /  " + pages);
                }

                if (btnSkipbackFun)
                    btnSkipbackFun(currentTag)
            })
        }
        if(btnslist[0]){
           btnslist[0].notClick = true 
        }
        
        return pagelist
    }
})