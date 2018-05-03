views.selectLayer = views.ILayer.extend({
    ctor: function  ()  {
        this._super();
        this.control = {}
        this.configInf()
        this.initUI()
        return true
    },
    onEnter: function () {
        this._super();
    },
    onEnterTransitionDidFinish: function () {
        this._super();
    },
    onExit: function () {
        this._super();
    },
    KeyBack: function () {
        this._super()
        layerControl.showLayer("mainLayer")
    },
    initUI: function () {
        var self = this
        var control = this.control
        createSp({
            img: res.select_bg,
            pos: cc.p(568, 320),
            father: self
        })

        var node_cartoon = new cc.Node()
        node_cartoon.setPosition(560, 90)
        self.addChild(node_cartoon)

        //添加人物
        var addCartoonFun = function (index) {
            node_cartoon.removeAllChildren(true)
            addCartoon({
                id: index,
                pos: cc.p(0, 0),
                father: node_cartoon,
                layer: "select"
            })
        }
        addCartoonFun(0)

        //配置头像信息
        var headinfo = {
            stu_name: "我是: " + Person.name,
            stu_level: "等级: " + Person.level,
        }
        self.showHead(headinfo)

        //活动按钮
        var activity = createSp({
            // img: res.select_activity,
            pos: cc.p(890, 600),
            father: self
        })
        var activityDir = createSp({
            // img: res.select_activityDir,
            pos: cc.p(890, 600),
            father: self
        })
        //活动弹框
        scaleButtonFun({
            item: activity,
            fun: function () {
                self.activityDialog()
            }
        })

        activityDir.runAction(cc.repeatForever(cc.sequence(
            cc.callFunc(function () {
                activityDir.setVisible(false)
            }),
            cc.delayTime(0.3),
            cc.callFunc(function () {
                activityDir.setVisible(true)
            }),
            cc.delayTime(0.3)
        )))

        //四个科目按钮
        var iconList = []
        for (var i = 0; i < 4; i++) {
            var icon = createSp({
                img: control.subjectInf[i].icon,
                pos: control.subjectInf[i].pos,
                father: self
            })
            iconList[i] = icon
            icon.index = i
            createTouchEvent({
                item: icon,
                begin: function (data) {
                    var item = data.item
                    var index = item.index
                    baseData.curSubject = index
                    layerControl.showLayer("passLayer")
                    return true
                }
            })
        }

        //切换按钮动作，人物变换动作
        var nextItem = null
        var changeActionFun = function (curIndex) {
            var index = curIndex
            if (nextItem)
                nextItem.stopAllActions()
            var item = iconList[index]
            nextItem = item

            repForActionFun({
                item: item,
                toScale: 1.07,
            })

            addCartoonFun(index)
            if (!control.dialog) {
                control.dialog = createSp({
                    img: res.select_dialog,
                    pos: cc.p(568, 320),
                    father: self,
                })
                control.dialog.setAnchorPoint(0.5, 0)
                control.dialog.setScale(0)

                control.wenzi = createLabel({
                    father: control.dialog,
                    pos: cc.p(20, 100),
                    color: cc.color(120, 80, 40),
                    fontSize: 22,
                    Anchors: cc.p(0, 1)
                })
            }
            control.dialog.stopAllActions()
            control.dialog.setScale(0)
            control.wenzi.setString(self.control.subjectInf[index].wenzi)
            control.dialog.runAction(cc.sequence(
                cc.scaleTo(0.5, 1.1)
            ))
        }

        //循环轮播四个人物
        var judgeIndex = 0
        node_cartoon.runAction(cc.repeatForever(cc.sequence(
            cc.callFunc(function () {
                if (judgeIndex == 4)
                    judgeIndex = 0
                changeActionFun(judgeIndex)
                judgeIndex++
            }),
            cc.delayTime(2.5)
        )))

        //金币显示
        self.cCoin = createCoinFun(self,cc.p(890,600))

        var btn_exit = createSp({
            img: res.select_exit,
            pos: cc.p(1050, 600),
            father: self
        })
        btn_exit.setScale(0.9)
        scaleButtonFun({
            item: btn_exit,
            scale: 0.8,
            fun: function () {
                self.exitDialog()
            }
        })
    },
    //创建头像
    showHead: function (data) {
        var data = data || {}
        var stu_name = data.stu_name || "我是昵称"
        var stu_level = data.stu_level || "等级:0"
        var self = this

        //头像标签
        var headBg = createSp({
            img: res.select_headBg,
            pos: cc.p(155, 590),
            father: self
        })
        self.headBg = headBg
        headBg.handIcon = createSp({
            img: res.head_icon,
            pos: cc.p(55, 590),
            father: self
        })

        //等级
        createLabel({
            text: stu_level,
            fontSize: 25,
            father: self,
            pos: cc.p(110, 565),
            Anchors: cc.p(0, 0.5),
            color: cc.color(250, 250, 0)
        })

        //昵称
        createLabel({
            text: stu_name,
            fontSize: 25,
            father: self,
            pos: cc.p(110, 590),
            Anchors: cc.p(0, 0.5),
            color: cc.color(250, 250, 0)
        })
    },

    //活动层
    activityDialog: function () {
        var self = this
        var activityLayer = new cc.LayerColor()
        activityLayer.setColor(cc.color(0, 0, 0))
        self.addChild(activityLayer)
        activityLayer.setOpacity(130)

        activityLayer.bg = createSp({
            img: res.select_activityBg,
            pos: cc.p(568, 320),
            father: activityLayer,
        })

        activityLayer.exchange = createSp({
            img: res.select_exchange,
            pos: cc.p(590, 105),
            father: activityLayer.bg,
        })
        activityLayer.close = createSp({
            img: res.select_close,
            pos: cc.p(700, 400),
            father: activityLayer.bg,
        })

        //兑换按钮
        scaleButtonFun({
            item: activityLayer.exchange,
            fun: function () {
                exchangeFun()
            }
        })

        //关闭活动界面
        scaleButtonFun({
            item: activityLayer.close,
            fun: function () {
                self.cCoin.freshCoin() //关闭界面，刷新场景金币数量
                activityLayer.removeAllChildren(true)
                activityLayer.removeFromParent(true)
                activityLayer = null
            }
        })

        createTouchEvent({
            item: activityLayer,
            begin: function () {
                return true
            }
        })

        var bg = activityLayer.bg
        bg.txt = {
            a: "您今日不可再次兑换哦！",
            b: "您的金币数量不足，\n继续加油哦！",
            c: "已成功兑换优惠券",
            d: "亲！网络不行啊，快去\n检查一下，稍后再试！"
        }

        bg.curCoin = createLabel({
            text: Person.coinNum,
            pos: cc.p(600, 180),
            father: bg,
            color: cc.color(120, 80, 40),
        })
        //兑换优惠券方法
        var exchangeFun = function () {
            if (!bg.tip) {
                bg.tip = createLabel({
                    pos: cc.p(220, 100),
                    father: bg,
                    fontSize: 23,
                    color: cc.color(120, 80, 40),
                })
                bg.tip.setAnchorPoint(0, 0.5)
            }
            if (Person.coinNum < 100) {
                bg.tip.setString(bg.txt.b)
            } else {
                HTTP.sendData({
                    url: activity_url + TOKEN + "&coin=100",
                    successBack: function (data) {
                        var jsonData = data.jsonData
                        var request = data.request
                        if (jsonData.code == 0) {
                            Person.exchangeCount = jsonData.data.remain
                            if (Person.exchangeCount == -1) {
                                cc.log("兑换失败！")
                                bg.tip.setString(bg.txt.a)
                            } else if (Person.exchangeCount == 0) {
                                cc.log("兑换成功,剩余0次机会")
                                var myquan = jsonData.data.coupon
                                bg.tip.setString(sprintf("%s:%s\n%s", bg.txt.c, myquan,"请前往通知中心领取"))
                                Person.coinNum = Person.coinNum - 100
                                bg.curCoin.setString(Person.coinNum)
                                self.cCoin.freshCoin()
                            } else {
                                cc.log("兑换成功,剩余n次机会")
                            }
                        } else {
                            cc.log("兑换返回失败")
                        }
                    },
                    failBack: function () {
                        cc.log("网络有问题")
                    },
                    errorBack: function () {
                        bg.tip.setString(bg.txt.d)
                    }
                })
            }
        }
    },

    //退出层
    exitDialog: function () {
        var self = this
        var exitLayer = new cc.LayerColor()
        exitLayer.setColor(cc.color(0, 0, 0))
        self.addChild(exitLayer)
        exitLayer.setOpacity(130)

        exitLayer.bg = createSp({
            img: res.select_exitBg,
            pos: cc.p(568, 320),
            father: exitLayer,
        })

        exitLayer.confirm = createSp({
            img: res.select_exit_1,
            pos: cc.p(217, 46),
            father: exitLayer.bg,
        })
        exitLayer.cancel = createSp({
            img: res.select_exit_2,
            pos: cc.p(554, 46),
            father: exitLayer.bg,
        })

        var CC_CURRENT_LAYER = self
        //继续游戏
        scaleButtonFun({
            item: exitLayer.cancel,
            fun: function () {
                exitLayer.removeAllChildren(true)
                exitLayer.removeFromParent(true)
                exitLayer = null
            }
        })
        //退出游戏
        scaleButtonFun({
            item: exitLayer.confirm,
            fun: function () {
                exitLayer.confirm.disListen()
                self.exitAllGame()
            }
        })


        createTouchEvent({
            item: exitLayer,
            begin: function () {
                return true
            }
        })
    },

    //配置信息
    configInf: function () {
        this.control.subjectInf = [{
            icon: res.select_icon_1,
            pos: cc.p(250, 430),
            wenzi: "我是科学小能手，\n跟我一起探索吧！"
        }, {
            icon: res.select_icon_2,
            pos: cc.p(250, 250),
            wenzi: "生活小百科，成就\n轻松生活。"
        }, {
            icon: res.select_icon_3,
            pos: cc.p(880, 430),
            wenzi: "跟着我一起上知天\n文，下知地理。"
        }, {
            icon: res.select_icon_4,
            pos: cc.p(880, 250),

            wenzi: "如何避免生活中无\n处不在的危险。"
        }, ]
    }
})