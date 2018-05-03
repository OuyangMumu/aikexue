//@author mu @16/5/12

var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp1",
    preLayer: "seeLayer",
    load: function() {
        loadPlist("gswfl_piclist")
        loadPlist("gswfl_girl")
        loadPlist("gswfl_girl_hand")
        loadPlist("gswfl_father")
        loadPlist("gswfl_father_hand")
        loadPlist("gswfl_conpic")
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        var self = this
        if (this.nodebs) {
            var self = this
            this.nodebs.show()
        }
    },
    aniCall: function(item, data) {
        var self = this
        if (data) {
            var dataControl = self.dataControl
            var calls = function(info) {
                //cc.log(info)
                var list = []
                var item = info.item
                var index = item.curIndex
                var call = item.callIndex
                var data = info.data
                var time = data.time || 0.1
                var key = data.key
                var buf = data.data
                var reslist = buf.res
                var numlist = buf.nums
                var piclist = buf.piclist || []
                var conver = buf.conver || []
                

                list[list.length] = createAnimation({
                    start: numlist[index] + 1,
                    frame: sprintf("%s/%%04d", key),
                    end: numlist[index + 1],
                    time: time,
                })
                if (reslist && reslist[index]) {
                    list[list.length] = cc.callFunc(function() {
                        playMusic(reslist[call])
                        if (piclist[call]) {
                            dataControl.picNode.setVisible(true)
                            dataControl.picNode.setSpriteFrame(piclist[call])
                        }

                        var tlist = [
                            dataControl.confather,
                            dataControl.congirl
                        ]

                        for (var i = 0; i < tlist.length; i++) {
                            if (tlist[i].acting) {
                                tlist[i].acting = false
                                addShowType({
                                    item: tlist[i],
                                    show: "fadeOut",
                                    time: 0.3,
                                    fun: function(item) {
                                        item.setVisible(false)
                                    }
                                })
                                addShowType({
                                    item: tlist[i],
                                    show: "zoom",
                                    time: 0.3,
                                })
                            }
                        }
                        if (conver[call]) {
                            dataControl.acting = false
                            var temp = conver[call]
                            var con = dataControl["con" + temp.key]
                            con.setVisible(true)
                            con.setSpriteFrame(temp.file)
                            addShowType({
                                item: con,
                                show: "fadeIn",
                                time: 0.3,
                                fun: function(item) {
                                    item.acting = true
                                }
                            })
                            addShowType({
                                item: con,
                                show: "scale",
                                time: 0.3,
                                scale: 0.7,
                            })
                        }
                        item.callIndex++
                    })
                }
                if (index == numlist.length) {
                    list[list.length] = cc.callFunc(function() {
                        self.changeBtnsStatu("end")
                    })
                } else {
                    list[list.length] = cc.callFunc(function() {
                        item.curIndex++
                        calls(info)
                    })
                }
                item.runAction(cc.sequence(list))
            }
            item.curIndex = 0
            item.callIndex = 0
            calls({
                item:item,
                data:data
            })
        } else {
            return createAnimation({
                start: 0,
                frame: sprintf("%s/%%04d", key),
                end: 2029,
                time: time,
            })
        }
    },
    dataControl: {},
    initButtons: function() {
        var self = this
        var dataControl = self.dataControl
        var btns = dataControl.btns
        btns.btn_pause.addClickEventListener(function() {
            self.changeBtnsStatu("pause")
        })
        btns.btn_play.addClickEventListener(function() {
            self.changeBtnsStatu("play")
        })
        btns.btn_restart.addClickEventListener(function() {
            self.changeBtnsStatu("play")
        })
        btns.btn_stop.addClickEventListener(function() {
            self.changeBtnsStatu("stop")
        })
    },
    changeBtnsStatu: function(statu) {
        var self = this
        var dataControl = self.dataControl
        var btns = dataControl.btns
        var result = []
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
            case "pause":
                pauseMusic()
                break
            case "resume":
                resumeMusic()
                break
            case "stop":
                stopMusic()
                dataControl.picNode.setVisible(false)
                dataControl.confather.setVisible(false)
                dataControl.congirl.setVisible(false)
                break
            case "play":
                dataControl.picNode.setVisible(false)
                dataControl.confather.setVisible(false)
                dataControl.congirl.setVisible(false)
                break
        }
        for (var i = 0; i < dataControl.aniList.length; i++) {
            switch (control) {
                case "resume":
                    dataControl.aniList[i].resume()
                    break
                case "stop":
                    dataControl.aniList[i].stopAllActions()
                    dataControl.aniList[i].setSpriteFrame(dataControl.aniList[i].frame)
                    break
                case "end":
                    break
                case "pause":
                    dataControl.aniList[i].pause()
                    break
                case "play":
                    dataControl.aniList[i].stopAllActions()
                    self.aniCall(dataControl.aniList[i], dataControl.aniList[i].actdata)
                    break
            }
        }
    },
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
        this.expCtor()
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        dataControl.aniList = []
        var lay = new cc.Node()
        lay.setScale(0.7)
        lay.setPosition(getMiddle(-420, -200))
        self.inside_node.addChild(lay)
        var mis = cc.p(180, -80)
        var backmis = cc.p(0, -450)
        var miscale = 1.5
        var nums = [
            0,
            42,
            173,
            262,
            743,
            940,
            1025,
            1350,
            1630,
            1788,
            1900,
        ]
        var resList = [
            res.gswfl_see_s1,
            res.gswfl_see_s2,
            res.gswfl_see_s3,
            res.gswfl_see_s4,
            res.gswfl_see_s5,
            res.gswfl_see_s6,
            res.gswfl_see_s7,
            res.gswfl_see_s8,
            res.gswfl_see_s9,
        ]
        var piclist = []
        for (var i = 0; i < resList.length; i++) {
            piclist[i] = sprintf("gswfl_see_c%d.png", i + 1)
        }
        var conver = [
            null, {
                key: "father",
                file: "gswfl_see_p1.png"
            }, {
                key: "girl",
                file: "gswfl_see_p2.png"
            },
            null,
            null, {
                key: "father",
                file: "gswfl_see_p3.png"
            }, {
                key: "girl",
                file: "gswfl_see_p4.png"
            },
            null,
            null,
        ]
        var list = [{
            type: "img",
            key: res.gswfl_back,
            posoff: backmis
        }, {
            type: "img",
            key: res.gswfl_deskback,
            posoff: mis,
            scale: miscale
        }, {
            type: "ani",
            key: "father",
            frame: "father/0000",
            data: {
                nums: nums,
            }
        }, {
            type: "ani",
            key: "girl",
            frame: "girl/0000",
            data: {
                nums: nums,
                res: resList,
                conver: conver,
                piclist: piclist,
            }
        }, {
            type: "img",
            key: res.gswfl_deskfront,
            posoff: mis,
            scale: miscale
        }, {
            type: "ani",
            key: "father_hand",
            frame: "father_hand/0000",
            data: {
                nums: nums,
            }
        }, {
            type: "ani",
            key: "girl_hand",
            frame: "girl_hand/0000",
            data: {
                nums: nums
            }
        }, ]
        for (var i = 0; i < list.length; i++) {
            switch (list[i].type) {
                case "img":
                    var node = new cc.Sprite(list[i].key)
                    list[i].posoff = list[i].posoff || cc.p(0, 0)
                    list[i].scale = list[i].scale || 1.0
                    var pos = list[i].posoff
                    node.setPosition(getMiddle(pos.x, pos.y))
                    node.setScale(list[i].scale)
                    lay.addChild(node)
                    break
                case "ani":
                    var node = new cc.Sprite()
                    node.setPosition(getMiddle())
                    lay.addChild(node)
                    node.frame = list[i].frame
                    node.actdata = {
                        key: list[i].key,
                        time: 0.035,
                        data: list[i].data,
                    }
                    dataControl.aniList[dataControl.aniList.length] = node
                    break
            }
        }
        self.initScene()
        self.initPeople()
        var sp = new cc.Sprite()
        sp.setAnchorPoint(0, 0.5)
        sp.setScale(1.2)
        sp.setPosition(180, 150)
        self.loadUI.addChild(sp)
        dataControl.picNode = sp
        var confather = new cc.Sprite()
        confather.setAnchorPoint(0, 0)
        confather.setPosition(350, 500)
        self.loadUI.addChild(confather)
        dataControl.confather = confather
        var congirl = new cc.Sprite()
        congirl.setAnchorPoint(0, 0)
        congirl.setPosition(640, 450)
        self.loadUI.addChild(congirl)
        dataControl.congirl = congirl
        self.changeBtnsStatu("play")
        return true
    },
    initScene: function() {
        var self = this
        var dataControl = self.dataControl
        var btnlist = [
            "btn_play",
            "btn_pause",
            "btn_stop",
            "btn_restart",
        ]
        var node = loadNode(res.gswfl_see_json, btnlist)
        node.setPosition(320, 50)
        dataControl.btns = node
        self.addChild(node)
        self.initButtons()
    },
    initPeople: function() {
        // this.nodebs = addPeople({
        //     id: "boshi",
        //     pos: cc.p(1000, 130)
        // })
        // this.loadUI.addChild(this.nodebs)
    },
})