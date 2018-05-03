//@author mu @14/4/27

var steps = {
    BALANCE: 0,
    CHECKSG: 1,
    DIANRAN: 2,
    YICHU: 3,
}

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    load: function() {
        loadPlist("hcfire")
        loadPlist("dgtq")
        loadPlist("jjhy")
        loadPlist("jsg")
        loadPlist("ysg")
        loadPlist("jrsg")
        loadPlist("sgts")
        loadPlist("sglq")
    },
    myExit: function() {
        this.nodebs.stopSay()
    },
    myDelete: function() {
        removeTimer("DO1JUDGE")
    },
    anihcfire: function() {
        return cc.repeatForever(createAnimation({
            frame: "hcfire%02d.png",
            end: 10
        }))
    },
    anijjhy: function() {
        return cc.repeatForever(createAnimation({
            frame: "jjhy%02d.png",
            end: 10
        }))
    },
    anidgtq: function(fun, rever) {
        return cc.sequence(createAnimation({
            frame: "dgtq%02d.png",
            end: 13,
            time: 0.05,
            rever: rever,
        }), cc.callFunc(function() {
            if (fun) {
                fun()
            }
        }))
    },
    anijsg: function() {
        return createAnimation({
            frame: "jsg%02d.png",
            end: 21,
            time: 0.1,
        })
    },
    aniysg: function(fun) {
        return cc.sequence(createAnimation({
            frame: "ysg%02d.png",
            end: 17,
            time: 0.1,
        }), cc.callFunc(function() {
            if (fun) {
                fun()
            }
        }))
    },
    anisgjr: function(fun) {
        return cc.sequence(createAnimation({
            frame: "jrsg%02d.png",
            end: 30,
            time: 0.15,
        }), cc.callFunc(function() {
            if (fun) {
                fun()
            }
        }))
    },
    anisgjrloop: function() {
        return cc.repeatForever(createAnimation({
            frame: "jrsg%02d.png",
            start: 31,
            end: 33,
            time: 0.15,
        }))
    },
    anisgts: function(fun) {
        return cc.sequence(createAnimation({
            frame: "sgts%02d.png",
            end: 17,
            time: 0.1,
        }), cc.callFunc(function() {
            if (fun) {
                fun()
            }
        }))
    },
    anisglq: function(fun) {
        return cc.repeatForever(createAnimation({
            frame: "sglq%02d.png",
            end: 16,
            time: 0.1,
        }))
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({
                    key: "Show",
                    force: true,
                })
            })
        }
        this.createTools()
    },
    showTips: function() {
        var dataControl = this.dataControl
        if (dataControl.curStep == steps.BALANCE) {
            return false
        }
        return true
    },
    dataControl: {},
    createTools: function() {
        var self = this
        var dataControl = self.dataControl
        var toolbtn = createTool({
            pos: cc.p(70, 500),
            nums: 3,
            tri: "down",
            modify: cc.p(1, 1),
            devide: cc.p(1.6, 1.5),
            itempos: cc.p(3, -15),
            circlepos: cc.p(0, 15),
            showTime: 0.3,
            moveTime: 0.2,
            scale: 0.9,
            ifcircle: true,
            father: self.loadUI,
            files: [res.do1_tool1_normal, res.do1_tool2_normal, res.do1_tool3_normal],
            gets: [res.img_sgs, res.img_sgj, res.img_jjd],
            grays: [res.do1_tool1_gray, res.do1_tool2_gray, res.do1_tool3_gray],
            judge: function(index) {
                if (dataControl.curStep == steps.BALANCE) {
                    AddDialog("Tips", {
                        res: res.do1_tip_1,
                        face: 2,
                    })
                    return false
                }
                if (dataControl.curStep == steps.CHECKSG && index != 0) {
                    AddDialog("Tips", {
                        res: res.do1_tip_2,
                        face: 2,
                    })
                    return false
                }
                return true
            },
            firstClick: function(data) {
                var sp = data.sp
                var index = data.index
                if (index == 2) {
                    var dg = new ccui.ImageView(res.img_dg)
                    var size = sp.getContentSize()
                    dg.setPosition(size.width * 0.52, size.height * 0.85)
                    dg.rootPos = cc.p(size.width * 0.52, size.height * 0.85)
                    sp.addChild(dg)
                    dg.state = "DOWN"
                    var TAG_HC = 520
                    var TAG_JJHY = 521
                    createTouchEvent({
                        item: dg,
                        begin: function(data) {
                            var target = data.item
                            var node = new cc.Sprite()
                            node.setAnchorPoint(0, 0)
                            node.setPositionX(-6)
                            target.setOpacity(0)
                            switch (target.state) {
                                case "DOWN":
                                    node.runAction(self.anidgtq(function() {
                                        node.removeFromParent(true)
                                        target.setOpacity(255)
                                        target.setPosition(200, 50)
                                        target.state = "UP"
                                        var hc = new ccui.ImageView(res.img_hc)
                                        hc.setPosition(200, 145)
                                        var tnode = new cc.Sprite()
                                        tnode.runAction(self.anihcfire())
                                        tnode.setPosition(8, 19)
                                        hc.setTag(TAG_HC)
                                        hc.addChild(tnode)
                                        sp.addChild(hc)
                                        createTouchEvent({
                                            item: hc,
                                            begin: function(data) {
                                                var target = data.item
                                                addShowType({
                                                    item: target,
                                                    show: "moveTo",
                                                    time: 0.6,
                                                    fun: function(item) {
                                                        var tfire = new cc.Sprite()
                                                        tfire.runAction(self.anijjhy())
                                                        tfire.setTag(TAG_JJHY)
                                                        tfire.setPosition(65, 150)
                                                        dataControl.dianran = true
                                                        sp.addChild(tfire)
                                                        item.removeFromParent(true)
                                                    },
                                                    buf: cc.p(95, 145)
                                                })
                                                return true
                                            }
                                        })
                                    }))
                                    target.addChild(node)
                                    break
                                case "UP":
                                    dataControl.dianran = false
                                    if (sp.getChildByTag(TAG_HC)) {
                                        sp.removeChildByTag(TAG_HC)
                                    }
                                    if (sp.getChildByTag(TAG_JJHY)) {
                                        sp.removeChildByTag(TAG_JJHY)
                                    }
                                    target.setPosition(target.rootPos)
                                    node.runAction(self.anidgtq(function() {
                                        node.removeFromParent(true)
                                        target.setOpacity(255)
                                        target.state = "DOWN"
                                    }, true))
                                    target.addChild(node)
                                    break
                            }
                            return true
                        }
                    })
                }
                if (index == 1) {
                    if (dataControl.sgnc) {
                        AddDialog("Tips", {
                            res: res.do1_tip_5,
                            face: 2,
                        })
                        return false
                    }
                }
                return true
            },
            clickfun: function(data) {
                var sp = data.sp
                var index = data.index
                var pos = data.pos
                if (index == 0) {
                    if (!dataControl.jiashiguan) {
                        if (!dataControl.sgjr) {
                            sp.setOpacity(255)
                            sp.setTexture(res.img_sgs)
                            sp.stopAllActions()
                        } else {
                            sp.setTexture(res.pzsg)
                            sp.setOpacity(0)
                            if (!sp.nodeani) {
                                sp.nodeani = new cc.Sprite()
                                sp.addChild(sp.nodeani)
                                sp.nodeani.setPosition(106, -27)
                                sp.nodeani.runAction(self.anisglq())
                            }
                        }
                        if (dataControl.followleft) {
                            var sprite = dataControl.followleft
                            sprite.retain()
                            sprite.setPosition(sprite.pastParent.convertToNodeSpace(sprite.getParent().convertToWorldSpace(cc.p(90, 60))))
                            sprite.removeFromParent(false)
                            sprite.pastParent.addChild(sprite)
                            sprite.release()
                            dataControl.followleft = null
                            self.addWeight(-dataControl.sgzl, null)
                            self.UpdateBalance()
                        }
                    } else {
                        return false
                    }
                }
                if (index == 1) {
                    if (dataControl.sgjring) {
                        AddDialog("Tips", {
                            res: res.do1_tip_5,
                            face: 2,
                        })
                        return false
                    } else if (dataControl.sgjr) {
                        sp.nodeani.stopAllActions()
                        sp.nodeani.runAction(self.anisgts(function() {
                            var tempitem = dataControl.itemsg
                            tempitem.setOpacity(0)
                            tempitem.setTexture(res.pzsg)
                            var temppos = sp.getPosition()

                            tempitem.retain()
                            tempitem.setPosition(tempitem.pastParent.convertToNodeSpace(tempitem.getParent().convertToWorldSpace(cc.p(temppos.x - 342, temppos.y - 242))))
                            tempitem.removeFromParent(false)
                            tempitem.pastParent.addChild(tempitem)
                            tempitem.release()
                            if (!tempitem.nodeani) {
                                tempitem.nodeani = new cc.Sprite()
                                tempitem.addChild(tempitem.nodeani)
                                tempitem.nodeani.setPosition(106, -27)
                                tempitem.nodeani.runAction(self.anisglq())
                            }
                            dataControl.jiashiguan = false
                            sp.forceBack()
                        }))
                    }
                }
                if (index == 2) {
                    if (dataControl.dianran) {
                        return false
                    }
                    //如果需要熄灭酒精灯放在这
                }
                return true
            },
            backfun: function(data) {
                var sprite = data.sp
                var index = data.index
                var pos = data.pos
                if (index == 0 && dataControl.curStep == steps.DIANRAN) {
                    AddDialog("Tips", {
                        res: res.do1_tip_5,
                        face: 2,
                    })
                    return false
                }
                if (index == 2) {
                    dataControl.dianran = false
                }
                if (index == 1) {
                    if (dataControl.curStep == steps.DIANRAN) {
                        return false
                    }
                }
                return true
            },
            outfun: function(data) {
                var sprite = data.sp
                var index = data.index
                var pos = data.pos
                var posx = pos.x

                var pos2 = sprite.getPosition()
                if (index == 0) {
                    if (judgeIn(dataControl.tpleft, pos, cc.p(0, 4.5))) {
                        if (!dataControl.sgjr) {
                            sprite.setTexture(res.img_hsg1)
                        } else {
                            sprite.setTexture(res.img_hsg2)
                            sprite.setOpacity(255)
                            if (sprite.nodeani) {
                                var tempani = sprite.nodeani
                                tempani.stopAllActions()
                                tempani.removeFromParent(true)
                                sprite.nodeani = null
                            }
                        }
                        sprite.retain()
                        sprite.pastParent = sprite.getParent()
                        sprite.removeFromParent(false)
                        dataControl.tpleft.addChild(sprite)
                        sprite.release()
                        sprite.setPosition(90, 60)
                        dataControl.followleft = sprite
                        self.addWeight(dataControl.sgzl, null)
                        self.UpdateBalance()
                    } else if (judgeIn(dataControl.tpright, pos, cc.p(0, 4.5))) {
                        AddDialog("Tips", {
                            res: res.do1_tip_6,
                            face: 2,
                        })
                    } else if (!dataControl.jiashiguan && dataControl.dianran && posx >= 240 && posx <= 280 && pos.y >= 0 && pos.y <= 320) {
                        AddDialog("Tips", {
                            res: res.do1_tip_4,
                            face: 2,
                        })
                    }
                }
                if (index == 2) {
                    sprite.setPosition(270, 80)
                }
                if (index == 1) {
                    dataControl.sgnc = true
                    if (!dataControl.jiashiguan) {
                        if (dataControl.itemsg) {
                            dataControl.jiashiguan = true
                            var node = new cc.Sprite()
                            node.setPosition(70, 30)
                            node.runAction(self.anijsg())
                            sprite.nodeani = node
                            sprite.addChild(node)
                            sprite.setOpacity(0)
                            dataControl.itemsg.setOpacity(0)
                            self.addWeight(-dataControl.sgzl, null)
                            dataControl.followleft = null
                            self.UpdateBalance()
                        }
                    } else {
                        if (!dataControl.sgjr && dataControl.dianran && pos2.x >= 475 && pos2.x <= 550 && pos2.y >= 200 && pos2.y <= 300) {
                            if (sprite.nodeani) {
                                dataControl.sgjring = true
                                dataControl.sgjr = true
                                sprite.setPosition(514, 252)
                                sprite.nodeani.runAction(self.aniysg(function() {
                                    sprite.nodeani.runAction(self.anisgjr(function() {
                                        sprite.nodeani.runAction(self.anisgjrloop())
                                        dataControl.sgjring = false
                                        dataControl.afterjr = true
                                    }))
                                }))
                            }
                        }
                    }
                }
            }
        })
        this.loadUI.addChild(toolbtn)
        toolbtn.show()
    },
    ctor: function() {
        this._super();
        this.load()
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.expCtor({
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    self.createBg()
                }
            }
        })
        this.btn_result.setVisible(false)
        self.initScene()
        self.initPeople()
        return true
    },
    tpChange: function(left, right) {
        var self = this
        var dataControl = self.dataControl
        var disleft = null,
            disright = null
        if (left) {
            disleft = left
            disright = -left
        } else {
            disleft = -right
            disright = right
        }
        dataControl.nodeleft.y += disleft
        dataControl.noderight.y += disright
    },
    createBg: function() {
        var dataControl = this.dataControl
        if (!dataControl.biaoge) {
            var uilist = [
                    "bg",
                    "bg_final",
                    "input_1",
                    "input_2",
                    "btn_close",
                    "btn_upload",
                    "btn_answer",
                    "btn_clear",
                    "btn_result",
                    "img_result",
                    "label_1",
                    "label_2",
                    "judge_1",
                    "judge_2",
                    "img_correct1",
                    "img_fault1",
                    "img_correct2",
                    "img_fault2",
                    "btn_final_close"
                ]
                //cc.log(dataControl.sgzl)
            var biaoge = loadNode(res.nodebg, uilist)
            biaoge.label_1.setString(dataControl.sgzl)
            biaoge.label_2.setString(dataControl.sgzl)
            biaoge.img_correct1.setVisible(false)
            biaoge.img_fault1.setVisible(false)
            biaoge.img_correct2.setVisible(false)
            biaoge.img_fault2.setVisible(false)
            biaoge.setPosition(getMiddle())
            biaoge.btn_result.addClickEventListener(function() {
                biaoge.img_result.setVisible(!biaoge.img_result.isVisible())
            })
            biaoge.btn_upload.addClickEventListener(function() {
                var answer1 = 1
                if (biaoge.input_1.input) {
                    answer1 = parseFloat(biaoge.input_1.input.getString())
                }
                var answer2 = 1
                if (biaoge.input_2.input) {
                    answer2 = parseFloat(biaoge.input_2.input.getString())
                }
                var correct1 = false
                var correct2 = false
                var mix = 0.2
                if (answer1) {
                    var judge = Math.abs(answer1 - dataControl.sgzl)
                    correct1 = judge <= mix
                } else {
                    correct1 = false
                }
                if (answer2) {
                    var judge = Math.abs(answer2 - dataControl.sgzl)
                    correct2 = judge <= mix
                } else {
                    correct2 = false
                }
                //cc.log(dataControl.sgzl)
                biaoge.img_correct1.setVisible(correct1)
                biaoge.img_fault1.setVisible(!correct1)
                biaoge.img_correct2.setVisible(correct2)
                biaoge.img_fault2.setVisible(!correct2)
            })
            biaoge.btn_answer.addClickEventListener(function() {
                if (biaoge.bg_final.close) {
                    biaoge.bg_final.showIn()
                } else {
                    biaoge.bg_final.showOut()
                }
            })
            biaoge.btn_final_close.addClickEventListener(function() {
                if (!biaoge.bg_final.close) {
                    biaoge.bg_final.showOut()
                }
            })
            biaoge.btn_clear.addClickEventListener(function() {
                biaoge.img_result.setVisible(false)
                if (biaoge.input_1.input) {
                    biaoge.input_1.input.setString("")
                }
                if (biaoge.input_2.input) {
                    biaoge.input_2.input.setString("")
                }
                biaoge.img_correct1.setVisible(false)
                biaoge.img_fault1.setVisible(false)
                biaoge.img_correct2.setVisible(false)
                biaoge.img_fault2.setVisible(false)
            })
            biaoge.showOut = function() {
                if (!biaoge.closing) {
                    biaoge.closing = true
                    addShowType({
                        item: biaoge,
                        show: "moveBy",
                        buf: cc.p(0, 60),
                        time: 0.3
                    })
                    addShowType({
                        item: biaoge,
                        show: "fadeOut",
                        time: 0.3,
                        fun: function() {
                            biaoge.closing = false
                            biaoge.bg.setScale(0)
                            removeMoving(biaoge.bg)
                            biaoge.close = true
                        }
                    })
                }
            }
            biaoge.bg_final.showOut = function() {
                if (!biaoge.bg_final.closing) {
                    biaoge.bg_final.closing = true
                    addShowType({
                        item: biaoge.bg_final,
                        show: "moveBy",
                        buf: cc.p(0, 60),
                        time: 0.3
                    })
                    addShowType({
                        item: biaoge.bg_final,
                        show: "fadeOut",
                        time: 0.3,
                        fun: function() {
                            biaoge.bg_final.closing = false
                            biaoge.bg_final.setScale(0)
                            removeMoving(biaoge.bg_final)
                            biaoge.bg_final.close = true
                            biaoge.bg_final.setVisible(false)
                        }
                    })
                }
            }
            biaoge.bg_final.showIn = function() {
                if ((biaoge.bg_final.close == null || biaoge.bg_final.close) && !biaoge.bg_final.showing) {
                    biaoge.bg_final.close = false
                    biaoge.bg_final.showing = true
                    biaoge.bg_final.setPosition(biaoge.bg_final.rootpos)
                    biaoge.bg_final.setScale(1)
                    biaoge.bg_final.setVisible(true)
                    addShowType({
                        item: biaoge.bg_final,
                        show: "moveBy",
                        buf: cc.p(0, 60),
                        time: 0.3
                    })
                    addShowType({
                        item: biaoge.bg_final,
                        show: "fadeIn",
                        time: 0.3,
                        fun: function() {
                            biaoge.bg_final.showing = false
                            addMoving(biaoge.bg_final)
                        }
                    })
                }
            }
            biaoge.showIn = function() {
                if ((biaoge.close == null || biaoge.close) && !biaoge.showing) {
                    biaoge.close = false
                    biaoge.showing = true
                    biaoge.setPosition(getMiddle(0, -60))
                    biaoge.bg.setPosition(0, 0)
                    biaoge.bg.setScale(1)
                    addShowType({
                        item: biaoge,
                        show: "moveBy",
                        buf: cc.p(0, 60),
                        time: 0.3
                    })
                    addShowType({
                        item: biaoge,
                        show: "fadeIn",
                        time: 0.3,
                        fun: function() {
                            biaoge.showing = false
                            addMoving(biaoge.bg)
                        }
                    })
                }
            }
            biaoge.btn_close.addClickEventListener(biaoge.showOut)

            addInput({
                item: biaoge.input_1,
            })
            addInput({
                item: biaoge.input_2,
            })
            biaoge.bg_final.setVisible(false)
            biaoge.img_result.setVisible(false)
            this.dataControl.biaoge = biaoge
            this.loadUI.addChild(biaoge)
            biaoge.bg_final.setScale(0)
            biaoge.bg_final.rootpos = biaoge.bg_final.getPosition()
            biaoge.bg_final.close = true
            biaoge.showIn()
        } else {
            var biaoge = dataControl.biaoge
            if (!biaoge.close) {
                biaoge.showOut()
            } else {
                biaoge.showIn()
            }
        }
    },
    randomInit: function() {
        //随机初始化天平
        var self = this
        var dataControl = self.dataControl
        var max = dataControl.lmmaxmove / dataControl.lmpermove
        self.moveLm({
            lm: "left",
            count: Math.floor(Math.random() * max)
        })
        self.moveLm({
            lm: "right",
            count: Math.floor(Math.random() * max)
        })
        dataControl.sgzl = Math.floor(Math.random() * 70) / 10 + 18 //随机试管质量
        self.moveYm(Math.random() * 230)
        self.UpdateBalance()
            //cc.log(dataControl.weights)
    },
    moveYm: function(dis) {
        var self = this
        var dataControl = self.dataControl
        var temp = dataControl.youma.getPositionX() + dis
            // if(dataControl.curStep == steps.DIANRAN){//mrak
            //     return false
            // }
        if (temp >= dataControl.youmaMin && temp <= dataControl.youmaMax) {
            //可以移动
            dataControl.youma.setPositionX(temp)
            self.addWeight(null, dis * dataControl.youmaPer)
            return true
        } else if (temp < dataControl.youmaMin) {
            dis = dataControl.youmaMin - dataControl.youma.getPositionX()
            dataControl.youma.setPositionX(dataControl.youmaMin)
            self.addWeight(null, dis * dataControl.youmaPer)
            return true
        }
    },
    moveLm: function(data) {
        var lm = data.lm
        var count = data.count
        var self = this
        var dataControl = self.dataControl
        var par = null
        var item = null
        switch (lm) {
            case "left":
                item = dataControl.lmleft
                par = 1
                break
            case "right":
                item = dataControl.lmright
                par = -1
                break
        }
        var temp = item.count + count
        var max = dataControl.lmmaxmove / dataControl.lmpermove
        if (temp >= 0 && temp <= max) {
            //可以移动
            item.count = temp
        } else if (temp < 0) {
            count = item.count
            item.count = 0
        } else if (temp > max) {
            count = max - item.count
            item.count = max
        }
        item.x += (count * dataControl.lmpermove * par)
        if (par == 1) {
            self.addWeight(null, count * dataControl.perlm)
        } else {
            self.addWeight(count * dataControl.perlm, null)
        }
    },
    UpdateBalance: function() {
        var self = this
        var dataControl = self.dataControl
        var dix = dataControl.weights.right - dataControl.weights.left
        var par = dix > 0 ? 1 : -1
        var per = 1
        var act = true
        var mix = 0
        var result = {}
        dix = Math.abs(dix)
        if (!(dix >= dataControl.startRotate)) {
            per = dix / dataControl.startRotate
        }
        dataControl.rotate.stopAllActions()
        dataControl.nodeleft.stopAllActions()
        dataControl.noderight.stopAllActions()
        var shakes = [{
            per: 0.1,
            time: 0.1
        }, {
            per: -0.1,
            time: 0.1
        }, {
            per: 0.05,
            time: 0.05
        }, {
            per: -0.05,
            time: 0.05
        }, {
            per: 0,
            time: 0.03
        }, ]
        if (dataControl.rotate.getRotation() == dataControl.maxRotate * par * per) {
            act = false
        } else {
            mix = (dataControl.rotate.getRotation() - dataControl.maxRotate * par * per) / 10
        }
        // result.left = dataControl.maxDis * par * per + dataControl.rooty - dataControl.nodeleft.getPositionY()
        // result.right = dataControl.maxDis * par * -1 * per + dataControl.rooty - dataControl.noderight.getPositionY()
        //var time = 0.05

        dataControl.rotate.current = 0
        dataControl.nodeleft.current = 0
        dataControl.noderight.current = 0
        var runloop = function(item, index) {
            var show = (index == 0) ? "rotateTo" : "moveBy"
            var time = shakes[item.current].time
            var buf = null
            switch (index) {
                case 0:
                    buf = dataControl.maxRotate * par * (per + mix * shakes[item.current].per)
                    break
                case 1:
                    buf = cc.p(0, dataControl.maxDis * par * (per + mix * shakes[item.current].per) + dataControl.rooty - item.getPositionY())
                    break
                case 2:
                    buf = cc.p(0, dataControl.maxDis * par * -1 * (per + mix * shakes[item.current].per) + dataControl.rooty - item.getPositionY())
                    break
            }
            addShowType({
                item: item,
                show: show,
                time: time,
                buf: buf,
                fun: function(item) {
                    item.current++
                        if (shakes[item.current]) {
                            runloop(item, index)
                        } else {
                            dataControl.Updating = false
                        }
                }
            })
        }
        if (act) {
            dataControl.Updating = true
            runloop(dataControl.rotate, 0)
            runloop(dataControl.nodeleft, 1)
            runloop(dataControl.noderight, 2)
        }
    },
    addWeight: function(left, right) {
        var self = this
        var dataControl = self.dataControl
        if (left != null) {
            dataControl.weights.left += left
        }
        if (right != null) {
            dataControl.weights.right += right
        }
    },
    initControl: function() {
        var self = this
        var dataControl = self.dataControl
        var lmCallBack = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                if (dataControl.curStep == steps.BALANCE) {
                    var target = event.getCurrentTarget()
                    var locationInNode = target.convertToNodeSpace(touch.getLocation())
                    var s = target.getContentSize() //触发区域九倍
                    var rectdown = cc.rect(-s.width, -s.height, s.width * 3, s.height * 1.5)
                    var recttop = cc.rect(-s.width, s.height / 2, s.width * 3, s.height * 1.5)
                    if (cc.rectContainsPoint(rectdown, locationInNode)) {
                        target.touch = "down"
                        if (!target.down) {
                            target.down = new cc.Sprite(res.img_arrow)
                            target.down.setAnchorPoint(0.5, 0.5)
                            target.down.setScale(0.4)
                            switch (target.name) {
                                case "left":
                                    target.down.setPosition(5, 0)
                                    break
                                case "right":
                                    target.down.setPosition(35, 0)
                                    break
                            }
                            target.addChild(target.down)
                        } else {
                            target.down.setVisible(true)
                        }
                        return true;
                    }
                    if (cc.rectContainsPoint(recttop, locationInNode)) {
                        target.touch = "top"
                        if (!target.top) {
                            target.top = new cc.Sprite(res.img_arrow)
                            target.top.setAnchorPoint(0.5, 0.5)
                            target.top.setScale(0.4)
                            target.top.setFlippedX(true)
                            target.addChild(target.top)
                            switch (target.name) {
                                case "left":
                                    target.top.setPosition(5, 30)
                                    break
                                case "right":
                                    target.top.setPosition(35, 30)
                                    break
                            }
                        } else {
                            target.top.setVisible(true)
                        }
                        return true;
                    }
                }
                return false;
            },
            onTouchEnded: function(touch, event) {
                var target = event.getCurrentTarget()
                var count = 1
                if (target.name == "left") {
                    if (target.touch == "down") {
                        target.down.setVisible(false)
                        count = 1
                    } else {
                        target.top.setVisible(false)
                        count = -1
                    }
                } else {
                    if (target.touch == "down") {
                        target.down.setVisible(false)
                        count = -1
                    } else {
                        target.top.setVisible(false)
                        count = 1
                    }
                }
                self.moveLm({
                    lm: target.name,
                    count: count,
                })
                self.UpdateBalance()
            }
        })
        var ymCallBack = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize()
                var rect = cc.rect(-s.width, -s.height / 2, s.width * 3, s.height * 2)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    //if(dataControl.curStep < steps.DIANRAN){
                    return true;
                    //}
                }
                return false;
            },
            onTouchMoved: function(touch, event) {
                var target = event.getCurrentTarget()
                var delta = touch.getDelta()
                if (self.moveYm(delta.x)) {
                    self.UpdateBalance()
                }
            },
            onTouchEnded: function(touch, event) {
                //var target = event.getCurrentTarget()
            }
        })

        createTouchEvent({
            item: dataControl.niezi,
            begin: function(data) {
                var item = data.item
                var pos = data.pos
                if (dataControl.curStep != steps.BALANCE) {
                    if (item.isVisible()) {
                        item.setVisible(false)
                        if (!item.gray) {
                            var gray = new cc.Sprite(res.img_niezi_gray)
                            gray.setAnchorPoint(0.7, 0.7)
                            self.loadUI.addChild(gray)
                            item.gray = gray
                        }
                        var gray = item.gray
                        gray.setPosition(pos)
                        gray.setVisible(true)
                        return true;
                    } else {
                        return false
                    }
                } else {
                    if (dataControl.curStep == steps.BALANCE) {
                        AddDialog("Tips", {
                            res: res.do1_tip_1,
                            face: 2,
                        })
                    }
                    return false
                }
            },
            move: function(data) {
                var item = data.item
                var pos = data.pos
                var delta = data.delta
                item.gray.x += delta.x
                item.gray.y += delta.y
            },
            end: function(data) {
                var item = data.item
                var pos = data.pos
                var finalpos = getAnchor({
                    item: item.gray,
                    pos: pos,
                    anchor: cc.p(0.1, 0.2),
                })
                var target = judgeFama(finalpos)
                if (!target) {
                    item.gray.setVisible(false)
                    item.setVisible(true)
                } else {
                    var weight = target.weight
                    switch (target.type) {
                        case "in":
                            var fama = new cc.Sprite(res[sprintf("img_fama_%d", weight)])
                            fama.setPosition(finalpos)
                            self.loadUI.addChild(fama)
                            fama.link = target
                            target.link = fama
                            fama.type = "in"
                            fama.weight = weight
                            target.setVisible(false)
                            item.setVisible(false)
                            item.gray.setVisible(false)
                            if (dataControl.niezijia.getParent()) {
                                dataControl.niezijia.removeFromParent(false)
                            }
                            dataControl.niezijia.setPosition(fama.getContentSize().width / 4, fama.getContentSize().height / 2)
                            fama.addChild(dataControl.niezijia)
                            break
                        case "out":
                            if (dataControl.niezijia.getParent()) {
                                dataControl.niezijia.removeFromParent(false)
                            }
                            target.retain()
                            var final = target.getParent().convertToWorldSpace(target.getPosition())
                            target.removeFromParent(false)
                            self.loadUI.addChild(target)
                            target.setPosition(final)
                            target.release()
                            dataControl.niezijia.setPosition(target.getContentSize().width / 4, target.getContentSize().height / 2)
                            target.addChild(dataControl.niezijia)
                            item.gray.setVisible(false)
                            item.setVisible(false)
                            self.addWeight(null, -target.weight)
                            dataControl.followRight[target.key] = null
                            self.UpdateBalance()
                            break
                    }
                }
            }
        })
        createTouchEvent({
            item: dataControl.niezijia,
            begin: function(data) {
                var item = data.item
                var pos = data.pos
                if (item.isVisible()) {
                    return true
                } else {
                    return false
                }
            },
            move: function(data) {
                var item = data.item
                var delta = data.delta
                var par = item.getParent()
                if (par) {
                    par.x += delta.x
                    par.y += delta.y
                }
            },
            end: function(data) {
                var item = data.item
                var pos = data.pos
                var par = item.getParent()
                pos = par.getPosition()
                var back = function() {
                    par.link.setVisible(true)
                    dataControl.niezijia.removeFromParent(false)
                    par.removeFromParent(true)
                    dataControl.niezi.setVisible(true)

                }
                var success = function() {
                    dataControl.niezijia.removeFromParent(false)
                    dataControl.niezi.setVisible(true)
                }
                if (judgeIn(dataControl.tpleft, pos, cc.p(0, 1.2))) {
                    AddDialog("Tips", {
                        res: res.do1_tip_3,
                        face: 2,
                    })
                    back()
                } else if (judgeIn(dataControl.tpright, pos, cc.p(0, 1.2))) {
                    var target = par.link
                    if (!dataControl.followRight[target.key]) {
                        var temp = par
                        dataControl.followRight[target.key] = temp
                        temp.retain()
                        temp.setPosition(target.rootPos)
                        temp.rootPos = target.rootPos
                        temp.setLocalZOrder(target.order)
                        temp.removeFromParent(false)
                        temp.link = target
                        temp.key = target.key
                        temp.weight = target.weight
                        dataControl.tpright.addChild(temp)
                        temp.release()
                        self.addWeight(null, target.weight)
                        self.UpdateBalance()
                        success()
                    }
                } else {
                    back()
                }
            }
        })

        var judgeFama = function(pos) {
            for (var i = 0; i < dataControl.famalist.length; i++) {
                var item = dataControl.famalist[i]
                item.item.weight = item.weight
                item.item.key = item.key
                item.item.rootPos = item.root
                item.item.order = item.order
                var target = item.item
                target.type = "in"
                var s = target.getContentSize()
                var local = target.convertToNodeSpace(pos)
                var rect = cc.rect(-s.width * 0.1, -s.height * 0.1, s.width * 1.2, s.height * 1.2)
                if (target.isVisible() && cc.rectContainsPoint(rect, local)) {
                    return target
                }
            }
            for (var key in dataControl.followRight) {
                var item = dataControl.followRight[key]
                if (item) {
                    var s = item.getContentSize()
                    var local = item.convertToNodeSpace(pos)
                    var rect = cc.rect(0, 0, s.width, s.height)
                    item.type = "out"
                    if (cc.rectContainsPoint(rect, local)) {
                        return item
                    }
                }
            }
        }

        var famaCallBack = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize()
                var rect = cc.rect(0, 0, s.width, s.height)
                if (target.isVisible() && cc.rectContainsPoint(rect, locationInNode)) {
                    if (dataControl.curStep != steps.BALANCE) {} else {
                        if (dataControl.curStep == steps.BALANCE) {
                            AddDialog("Tips", {
                                res: res.do1_tip_1,
                                face: 2,
                            })
                        }
                    }
                }
                return false;
            },
            onTouchEnded: function(touch, event) {
                dataControl.niezijia.removeFromParent(false)
                dataControl.niezi.setVisible(true)
                var target = event.getCurrentTarget()
                var pos = touch.getLocation()
                if (judgeIn(dataControl.tpleft, pos, cc.p(0, 1.2))) {} else if (judgeIn(dataControl.tpright, pos, cc.p(0, 1.2))) {
                    if (!dataControl.followRight[target.key]) {
                        var temp = target.link
                        dataControl.followRight[target.key] = temp
                        temp.retain()
                        temp.setPosition(target.rootPos)
                        temp.rootPos = target.rootPos
                        temp.setLocalZOrder(target.order)
                        temp.removeFromParent(false)
                        temp.link = target
                        temp.key = target.key
                        temp.weight = target.weight
                        dataControl.tpright.addChild(target.link)
                        temp.release()
                        self.addWeight(null, target.weight)
                        self.UpdateBalance()
                        var famalisten = cc.EventListener.create({
                            event: cc.EventListener.TOUCH_ONE_BY_ONE,
                            swallowTouches: true,
                            onTouchBegan: function(touch, event) {
                                var target = event.getCurrentTarget()
                                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                                var s = target.getContentSize()
                                var rect = cc.rect(0, 0, s.width, s.height)
                                if (cc.rectContainsPoint(rect, locationInNode)) {
                                    dataControl.niezi.setVisible(false)
                                    dataControl.niezijia.setPosition(target.getContentSize().width / 4, target.getContentSize().height / 2)
                                    target.addChild(dataControl.niezijia)
                                    self.addWeight(null, -target.weight)
                                    self.UpdateBalance()
                                    return true;
                                }
                                return false;
                            },
                            onTouchMoved: function(touch, event) {
                                var target = event.getCurrentTarget()
                                var delta = touch.getDelta()
                                target.x += delta.x
                                target.y += delta.y
                            },
                            onTouchEnded: function(touch, event) {
                                dataControl.niezi.setVisible(true)
                                dataControl.niezijia.removeFromParent(false)
                                var target = event.getCurrentTarget()
                                var pos = touch.getLocation()
                                if (judgeIn(dataControl.tpleft, pos, cc.p(0, 1.2))) {
                                    AddDialog("Tips", {
                                        res: res.do1_tip_3,
                                        face: 2,
                                    })
                                    target.link.setVisible(true)
                                    dataControl.followRight[target.key] = null
                                    target.removeFromParent(true)
                                } else if (judgeIn(dataControl.tpright, pos, cc.p(0, 1.2))) {
                                    self.addWeight(null, target.weight)
                                    target.setPosition(target.rootPos)
                                    self.UpdateBalance()
                                } else {
                                    target.link.setVisible(true)
                                    dataControl.followRight[target.key] = null
                                    target.removeFromParent(true)
                                }
                            },
                        })
                        cc.eventManager.addListener(famalisten, temp);

                    }
                } else {
                    target.setVisible(true)
                    target.link.removeFromParent(true)
                }
            }
        })
        cc.eventManager.addListener(lmCallBack, dataControl.lmleft)
        cc.eventManager.addListener(lmCallBack.clone(), dataControl.lmright)
        cc.eventManager.addListener(ymCallBack, dataControl.youma)
    },
    initScene: function() {
        var tp = loadNode(res.nodetp)
        tp.setPosition(440, 150)
        var self = this
        var dataControl = self.dataControl
        dataControl.ym = seekWidgetByName(tp, "img_ym")
        dataControl.rotate = seekWidgetByName(tp, "img_rotate")
        dataControl.lmleft = seekWidgetByName(tp, "img_lm_left")
        dataControl.lmleft.count = 0
        dataControl.lmleft.name = "left"
        dataControl.lmright = seekWidgetByName(tp, "img_lm_right")
        dataControl.lmright.count = 0
        dataControl.lmright.name = "right"
        dataControl.nodeleft = seekWidgetByName(tp, "node_left")
        dataControl.noderight = seekWidgetByName(tp, "node_right")
        dataControl.maxRotate = 7 //最大旋转角度
        dataControl.maxDis = 20 //最大垂直位移
        dataControl.startRotate = 0.5 //开始偏移的差值
        dataControl.perlm = 0.05 //每次移动螺母造成的重量差
        dataControl.rooty = dataControl.nodeleft.getPositionY()
        dataControl.lmleftmin = dataControl.lmleft.getPositionX()
        dataControl.lmrightmax = dataControl.lmright.getPositionX()
        dataControl.youma = seekWidgetByName(tp, "img_ym")
        dataControl.youmaMin = dataControl.youma.getPositionX() //游码最小位置
        dataControl.youmaMax = dataControl.youmaMin + 230 //最大位置
        dataControl.youmaPer = 5 / 230 //每个位置代表质量
        dataControl.lmmaxmove = 36 //螺母最大偏移
        dataControl.lmpermove = 3 //螺母每次移动偏移
        dataControl.tpleft = seekWidgetByName(tp, "img_tp_left")
        dataControl.tpright = seekWidgetByName(tp, "img_tp_right")
        dataControl.img_balance = seekWidgetByName(tp, "img_balance")
        dataControl.img_balance_shu = seekWidgetByName(tp, "img_balance_shu")
        dataControl.img_balance.setVisible(false)
        dataControl.img_balance_shu.setVisible(false)
        dataControl.curStep = steps.BALANCE
        dataControl.followRight = {}
        dataControl.weights = {
            left: 0.0,
            right: 0.0,
        }

        var redList = [
            "dizuo_red",
            "fdp_red",
            "hl_red",
            "bc_red",
            "lmr_red",
            "lml_red",
            "zz_red",
            "tpl_red",
            "tpr_red",
            "ym_red",
        ]
        loadList(tp, redList)
        for (var i = 0; i < redList.length; i++) {
            tp[redList[i]].setVisible(false)
        }

        var fama = loadNode(res.nodefm)
        dataControl.niezi = seekWidgetByName(fama, "img_nz")
        dataControl.niezijia = new cc.Sprite(res.img_niezi_jia)
        dataControl.niezijia.retain()
        dataControl.niezijia.setAnchorPoint(0, 0)
        dataControl.famalist = [{
            weight: 5,
            item: seekWidgetByName(fama, "img_5g"),
            key: "5g",
            root: cc.p(80, 30),
            order: 6
        }, {
            weight: 10,
            item: seekWidgetByName(fama, "img_10g"),
            key: "10g",
            root: cc.p(110, 40),
            order: 5
        }, {
            weight: 20,
            item: seekWidgetByName(fama, "img_20g_1"),
            key: "20g1",
            root: cc.p(140, 50),
            order: 4
        }, {
            weight: 20,
            item: seekWidgetByName(fama, "img_20g_2"),
            key: "20g2",
            root: cc.p(60, 50),
            order: 3
        }, {
            weight: 50,
            item: seekWidgetByName(fama, "img_50g"),
            key: "50g",
            root: cc.p(90, 60),
            order: 2
        }, {
            weight: 100,
            item: seekWidgetByName(fama, "img_100g"),
            key: "100g",
            root: cc.p(120, 70),
            order: 1
        }, ]
        fama.setPosition(800, 150)
        self.loadUI.addChild(fama)
        self.loadUI.addChild(tp)
        self.randomInit()
        self.initControl()
        addTimer({
                fun: function() {
                    if (dataControl.curStep == steps.BALANCE) {
                        //天平平衡步骤
                        if (dataControl.youma.getPositionX() <= dataControl.youmaMin + 0.01) { //允许的误差值
                            var mix = Math.abs(dataControl.weights.left - dataControl.weights.right)
                            if (mix <= 0.03) {
                                dataControl.img_balance.setVisible(true)
                                dataControl.curStep = steps.CHECKSG
                                self.nodebs.say({
                                    key: "Second",
                                    force: true,
                                })
                            }
                        }
                    }
                    if (dataControl.curStep == steps.CHECKSG) {
                        var mix = Math.abs(dataControl.weights.left - dataControl.weights.right)
                        if (!dataControl.Updating && dataControl.followleft && mix <= 0.03 && dataControl.weights.right >= 18 && dataControl.weights.left >= 18) {
                            dataControl.itemsg = dataControl.followleft
                            dataControl.curStep = steps.DIANRAN
                            self.nodebs.say({
                                key: "Third",
                                force: true,
                            })
                        }
                    }
                    if (dataControl.curStep == steps.DIANRAN) {
                        if (dataControl.afterjr) {
                            dataControl.curStep = steps.YICHU
                            self.nodebs.say({
                                key: "Forth",
                                force: true,
                            })
                        }
                    }
                },
                time: 0.05,
                repeat: cc.REPEAT_FOREVER,
                key: "DO1JUDGE",
            })
            //dataControl.rotate.setRotation(-7)
            //self.tpChange(null, 20)
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.loadUI.addChild(this.nodebs)
        addContent({
            people: this.nodebs,
            key: "Show",
            img: res.do1_content_1,
            sound: res.do1_content_1_sound
        })
        addContent({
            people: this.nodebs,
            key: "Second",
            img: res.do1_content_2,
            sound: res.do1_content_2_sound,
        })
        addContent({
            people: this.nodebs,
            key: "Third",
            img: res.do1_content_3,
            sound: res.do1_content_3_sound,
        })
        addContent({
            people: this.nodebs,
            key: "Forth",
            img: res.do1_content_4,
            sound: res.do1_content_4_sound,
        })
    }
})