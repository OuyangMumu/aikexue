//@author mu @16/4/27

var indexList = {
    oneCar: 0,
    twoCar: 1,
    ruler: 2,
    watch: 3,
}

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {},
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        var self = this
        if (self.nodebs) {
            self.nodebs.show(function() {
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: "Show"
                })
            })
        }
        if (self.toolbtn) {
            self.toolbtn.show()
            self.toolbtn.setAllUse(true)
        }
    },
    reEnter: function() {
        var self = this
        if (self.COUNTER) {
            self.COUNTER.reEnter()
        }
        if (self.dataControl.lauch) {
            self.dataControl.lauch.setOpacity(255)
        }
        if (self.dataControl.fdj) {
            self.dataControl.fdj.get[0].setOpacity(255)
            self.dataControl.fdj.see[0].setOpacity(255)
        }
    },
    dataControl: {},
    initRandom: function() {
        var self = this
        var dataControl = self.dataControl
        var rand1 = Math.floor(Math.random() * 9) + 2
        var rand2 = Math.floor(Math.random() * 9) + 2
        if (rand2 == rand1) {
            rand2 = rand2 - 1
            if (rand2 == 2) {
                rand2 = 4
            }
        }
        dataControl.rand1 = rand1 / 2
        dataControl.rand2 = rand2 / 2
        dataControl.redSpeed = rand1 * dataControl.cm / 2
        dataControl.blueSpeed = rand2 * dataControl.cm / 2
    },
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
        var self = this
        this.expCtor({
                vis: false,
                settingData: {
                    pos: cc.p(1080, 580),
                    tubiaoData: {
                        xname: "时间/秒",
                        yname: "距离/厘米",
                        father: self,
                        autoData: function() {
                            var result = []
                            if (self.biaoge) {
                                var bg = self.biaoge
                                var getlistA = [
                                    [1, 2],
                                    [4, 5],
                                    [7, 8],
                                ]
                                var getlistB = [
                                    [11, 12],
                                    [14, 15],
                                    [17, 18]
                                ]
                                var tempA = {
                                    colorPoint: cc.color(9, 10, 153, 255),
                                    colorLine: cc.color(255, 50, 0, 255),
                                    colorRleation: cc.color(255, 32, 32, 255),
                                    colorCurve: cc.color(14, 249, 145, 255),
                                    points: [],
                                }
                                var tempB = {
                                    colorPoint: cc.color(2, 2, 154, 255),
                                    colorLine: cc.color(48, 173, 255, 255),
                                    colorRleation: cc.color(0, 0, 255, 255),
                                    colorCurve: cc.color(0, 102, 153, 255),
                                    points: [],
                                }
                                var judgePoint = function(xindex, yindex) {
                                    var x = bg.getKey(xindex)
                                    var y = bg.getKey(yindex)
                                    if (x != "" && y != "") {
                                        x = parseFloat(x).toFixed(2)
                                        y = parseFloat(y).toFixed(2)
                                        if (x != "NaN" && y != "NaN") {
                                            return {
                                                x: parseFloat(x),
                                                y: parseFloat(y)
                                            }
                                        }
                                    }
                                    return null
                                }
                                for (var i = 0; i < getlistA.length; i++) {
                                    var point = judgePoint(getlistA[i][1], getlistA[i][0])
                                    if (point) {
                                        tempA.points.push(point)
                                    }
                                }
                                for (var i = 0; i < getlistB.length; i++) {
                                    var point = judgePoint(getlistB[i][1], getlistB[i][0])
                                    if (point) {
                                        tempB.points.push(point)
                                    }
                                }
                                result.push(tempA)
                                result.push(tempB)
                            }
                            return result
                        }
                    },
                    biaogeFun: function() {
                        if (!self.biaoge) {
                            var bg = createBiaoge({
                                json: res.jlsj_biaoge,
                                inputNum: 20,
                                finalLabelNum: 2,
                                noUp: true,
                                rootData: [40, null, null, null, 8, null, null, null, null, null,
                                    40, null, null, null, 8, null, null, null, null, null
                                ],
                                rootColor: [cc.color(159, 19, 247, 255), null, null, null, cc.color(159, 19, 247, 255), null, null, null, null, null,
                                    cc.color(159, 19, 247, 255), null, null, null, cc.color(159, 19, 247, 255), null, null, null, null, null
                                ],
                                finalList: [dataControl.rand1, dataControl.rand2],
                            })
                            bg.setBack(function() {
                                if (self.tubiao) {
                                    self.tubiao.judgeAuto()
                                }
                            })
                            self.addChild(bg)
                            self.biaoge = bg
                        }
                        var bg = self.biaoge
                        bg.show()
                    },
                    ifCount: true,
                }
            }) //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initScene()
        self.initPeople() //创建人物
        self.initRandom()
        return true
    },
    createTool: function() {
        var self = this
        var dataControl = self.dataControl
        var getCar = function(type) {
            var car = createCar({
                type: type,
                tri: "right",
                judgeFun: function(item) {
                    if (item.getPositionX() > 1200) {
                        item.myStop()
                        item.setPosition(getMiddle(-140, -227))
                        dataControl.lauch.loadTexture(res.jlsj_lauch_normal)
                        dataControl.lauch.start = false
                        dataControl.lauch.setVisible(true)
                        item.isStart = false
                    }
                }
            })
            car.setPosition(getMiddle(-140, -227))
            car.setScale(car.getScale() * 2 / 3)
            return car
        }

        var getRuler = function() {
            var ruler = createRuler({
                max: 50,
                devide: dataControl.cm * 3 / 2,
            })
            ruler.setSkewX(18)
            return ruler
        }

        var judgeCar = function() {
            if (dataControl.car) {
                dataControl.car.myStop()
                dataControl.car.removeFromParent()
                dataControl.car = null
            }
            dataControl.fdj.createNew({
                key: "car",
                father: "mb",
                fun: function() {
                    return getCar(dataControl.curtype)
                }
            })
            dataControl.lauch.loadTexture(res.jlsj_lauch_normal)
            dataControl.lauch.start = false
            dataControl.lauch.setVisible(true)
        }

        var judgeRuler = function(pos) {
            if (dataControl.ruler) {
                dataControl.ruler.removeFromParent()
                dataControl.ruler = null
            }
            dataControl.fdj.createNew({
                key: "ruler",
                fun: function() {
                    var ruler = getRuler()
                    ruler.setPosition(pos)
                    return ruler
                }
            })
        }

        var toolbtn = createTool({
            pos: cc.p(70, 480),
            nums: 4,
            tri: "right",
            scale: 1.2,
            showTime: 0.3,
            moveTime: 0.2,
            father: self,
            counts: [999999, 999999, 1, 1],
            grays: [res.jlsj_tool_01, res.jlsj_tool_03, res.jlsj_tool_05, res.jlsj_tool_07],
            gets: [null, null, null, null],
            files: [res.jlsj_tool_02, res.jlsj_tool_04, res.jlsj_tool_06, res.jlsj_tool_08],
            firstClick: function(data) {
                var index = data.index
                var pos = data.pos
                switch (index) {
                    case indexList.oneCar:
                    case indexList.twoCar:
                        if (dataControl.car) {
                            dataControl.car.myStop()
                            dataControl.car.removeFromParent()
                            dataControl.car = null
                        }
                        var fdj = dataControl.fdj
                        if (fdj.getKey("car")) {
                            fdj.deleteKey("car")
                        }
                        var type = (index == indexList.oneCar ? "red" : "blue")
                        var car = createCar({
                            type: type,
                            tri: "right",
                        })
                        dataControl.curtype = type
                        dataControl.car = car
                        dataControl.lauch.setVisible(false)
                        return car
                        break
                    case indexList.ruler:
                        var fdj = dataControl.fdj
                        if (fdj.getKey("ruler")) {
                            fdj.deleteKey("ruler")
                        }
                        fdj.createNew({
                            key: "ruler",
                            fun: function() {
                                var ruler = getRuler()
                                ruler.setPosition(pos)
                                return ruler
                            }
                        })
                        var ruler = fdj.getOut("ruler")
                        fdj.setGet(cc.p(pos.x - ruler.getContentSize().width / 2 + 20, pos.y + 25))
                        var rulerSize = ruler.getContentSize()
                        fdj.see[0].setVisible(true)
                        addMoving(fdj.see[0])
                        fdj.get[0].setVisible(true)
                        if (fdj.get[0].removeListen) {
                            fdj.get[0].removeListen()
                        }
                        createTouchEvent({
                            item: fdj.get[0],
                            begin: function(data) {
                                var item = data.item

                                return item.isVisible()
                            },
                            move: function(data) {
                                var item = data.item
                                var pos = data.pos
                                var delta = data.delta
                                if (!fdj.see[0].isVisible()) {
                                    addMoving(fdj.see[0])
                                    fdj.see[0].setVisible(true)
                                }
                                delta = cc.p(delta.x, 0)
                                var temp = ruler.getPositionX() - (item.getPositionX() + delta.x)
                                if (temp > (-rulerSize.width / 2 + 20) && temp < rulerSize.width / 2) {
                                    fdj.move(delta)
                                }
                            }
                        })
                        ruler.tempPos = ruler.getPosition()
                        dataControl.ruler = ruler
                        return ruler
                        break
                    case indexList.watch:
                        dataControl.watch = createWatch()
                        dataControl.watch.setScale(0.7)
                        dataControl.watch.setPosition(self.convertToNodeSpace(pos))
                        return dataControl.watch
                        break
                }
            },
            clickfun: function(data) {
                var index = data.index
                var sp = data.sp
                var pos = data.pos
                switch (index) {
                    case indexList.oneCar:
                    case indexList.twoCar:
                        return false
                        break
                    case indexList.ruler:
                        sp.tempPos = sp.getPosition()
                        return true
                        break
                    case indexList.watch:
                        return true
                        break
                }
            },
            movefun: function(data) {
                var index = data.index
                var sp = data.sp
                var pos = data.pos
                var delta = data.delta
                switch (index) {
                    case indexList.oneCar:
                    case indexList.twoCar:
                    case indexList.watch:
                        sp.x += delta.x
                        sp.y += delta.y
                        break
                    case indexList.ruler:
                        var fdj = dataControl.fdj
                        var tempPos = sp.tempPos
                        tempPos.y += delta.y
                        tempPos.x += delta.x
                        if (tempPos.y < 200) {
                            sp.x = tempPos.x
                            sp.linkFun(function(data) {
                                var item = data.item
                                item.x = tempPos.x
                                item.y = 91
                            })
                            sp.canMove = false
                            sp.y = 91
                        } else {
                            sp.x = tempPos.x
                            sp.y = tempPos.y
                            sp.linkFun(function(data) {
                                var item = data.item
                                item.x = tempPos.x
                                item.y = tempPos.y
                            })
                            sp.canMove = true
                        }
                        delta.y = sp.getPositionY() - fdj.get[0].getPositionY() + 25
                        fdj.move(delta)
                        break
                }
            },
            outfun: function(data) {
                var index = data.index
                var sp = data.sp
                var pos = data.pos
                switch (index) {
                    case indexList.oneCar:
                    case indexList.twoCar:
                        judgeCar()
                        return false
                        break
                    case indexList.ruler:
                        // judgeRuler(pos)
                        // return false
                        break
                    case indexList.watch:
                        break
                }
            },
            backfun: function(data) {
                var index = data.index
                var sp = data.sp
                var pos = data.pos
                switch (index) {
                    case indexList.oneCar:
                    case indexList.twoCar:
                        judgeCar()
                        return false
                        break
                    case indexList.ruler:
                        var fdj = dataControl.fdj
                        if (fdj.getKey("ruler")) {
                            fdj.deleteInside("ruler")
                        }
                        fdj.get[0].setVisible(false)
                        fdj.see[0].setVisible(false)
                        if (fdj.get[0].removeListen) {
                            fdj.get[0].removeListen()
                        } else {
                            removeMoving(fdj.get[0])
                        }
                        if (fdj.see[0].removeListen) {
                            fdj.see[0].removeListen()
                        } else {
                            removeMoving(fdj.see[0])
                        }
                        break
                    case indexList.watch:
                        if (dataControl.watch) {
                            dataControl.watch = null
                        }
                        return true
                        break
                }
                return true
            }
        })
        this.toolbtn = toolbtn
        this.addChild(toolbtn)
    },
    initScene: function() {
        var self = this
        var dataControl = self.dataControl
        var fdj = createFDJ({
            father: self,
        })
        self.createTool()

        if (!self.biaoge) {
            var bg = createBiaoge({
                json: res.jlsj_biaoge,
                inputNum: 20,
                finalLabelNum: 2,
                noUp: true,
                rootData: [40, null, null, null, 8, null, null, null, null, null,
                    40, null, null, null, 8, null, null, null, null, null
                ],
                rootColor: [cc.color(159, 19, 247, 255), null, null, null, cc.color(159, 19, 247, 255), null, null, null, null, null,
                    cc.color(159, 19, 247, 255), null, null, null, cc.color(159, 19, 247, 255), null, null, null, null, null
                ],
                finalList: [dataControl.rand1, dataControl.rand2],
            })
            bg.setBack(function() {
                if (self.tubiao) {
                    self.tubiao.judgeAuto()
                }
            })
            bg.setPositionY(-1000)
            self.addChild(bg)
            self.biaoge = bg
        }

        var createMB = function() {
            var mb = new cc.Sprite(res.jlsj_mb)
            var mbscale = 1.5
            mb.setScale(mbscale)
            dataControl.mb = mb
            mb.setPosition(getMiddle(0, -220))

            var bz = new cc.Sprite(res.jlsj_white)
            bz.setAnchorPoint(0.5, 0.5)
            bz.setScale(1 / mbscale * 0.85)
            var size = mb.getContentSize()
            bz.setPosition(size.width / 2 - 10, size.height / 2 + 10)
            mb.setCascadeOpacityEnabled(true)
            mb.addChild(bz)
            mb.bz = bz
            bz.setSkewX(18)
            return mb
        }

        var createMark = function(type) {
            var tex = null
            var pos = null
            switch (type) {
                case "A":
                    tex = res.jlsj_markA
                    pos = cc.p(555, 125)
                    break
                case "B":
                    tex = res.jlsj_markB
                    pos = cc.p(1020, 125)
                    break
            }
            var mark = new cc.Sprite(tex)
            mark.setPosition(pos)
            mark.setScale(0.8 * 0.2)
            var size = mark.getContentSize()
            var line = new cc.Sprite(res.jlsj_line)
            line.setAnchorPoint(0, 1)
            line.setScale(0.58 / mark.getScale())
            line.setPosition(size.width / 2, -30)
            line.setSkewX(18)
            mark.addChild(line)
            return mark
        }

        var mark_init = function(data) {
            var item = data.item
                //item.judgeScale = getLoopScale(item) //* item.getScale()
                //cc.log(item.judgeScale)
            item.judgeScale = 1.5 //magic!
        }

        var mark_move = function(data) {
            var limit = [420, 1150]
            var item = data.item
            var delta = data.delta
            var temp = item.x + delta.x / item.judgeScale
            if (temp >= limit[0] && temp <= limit[1]) {
                item.x += (delta.x / item.judgeScale)
            }
        }
        dataControl.cm = 11.625

        fdj.createNew({
            key: "mb",
            fun: createMB
        })
        fdj.createNew({
            key: "markA",
            fun: function() {
                return createMark("A")
            },
            father: "mb",
            init: mark_init,
            move: mark_move,
        })
        fdj.createNew({
            key: "markB",
            fun: function() {
                return createMark("B")
            },
            father: "mb",
            init: mark_init,
            move: mark_move,
        })
        dataControl.fdj = fdj

        //var lauch = new ccui.Button(res.jlsj_lauch_normal, res.jlsj_lauch_select)
        var lauch = new ccui.ImageView(res.jlsj_lauch_normal)
        lauch.start = false
        lauch.setPosition(110, 270)
        self.addChild(lauch)
        lauch.setVisible(false)
        dataControl.lauch = lauch
        createTouchEvent({
            item: lauch,
            begin: function(data) {
                var item = data.item
                var tex = item.start ? res.jlsj_pause_select : res.jlsj_lauch_select
                item.loadTexture(tex)
                return true
            },
            end: function(data) {
                var item = data.item
                item.start = !item.start
                var tex = item.start ? res.jlsj_pause_normal : res.jlsj_lauch_normal
                item.loadTexture(tex)
                var judge = item.start
                if (dataControl.curtype) {
                    var fdj = dataControl.fdj
                    fdj.runData({
                            key: "car",
                            fun: function(data) {
                                var item = data.item
                                var speed = dataControl[dataControl.curtype + "Speed"]
                                var tfinal = 1210
                                var tdis = tfinal - item.getPositionX()
                                var ttime = tdis / speed
                                if (!item.isStart) {
                                    item.start({
                                        speed: tdis,
                                        time: ttime,
                                    })
                                    item.isStart = true
                                } else {
                                    if (!judge) {
                                        item.myPause()
                                    } else {
                                        item.myResume()
                                    }
                                }
                            }
                        })
                        //dataControl.lauch.setVisible(false)
                }
            }
        })
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs) //添加人物对话
        addContent({
            people: this.nodebs,
            key: "Show", //对话标签 之后让人物说话需要用到的参数
            img: res.jlsj_do_content, //图片和声音文件
            sound: res.jlsj_do_content_sound,
            scale: 0.75,
            offset: cc.p(0, -5)
        })
    }
})