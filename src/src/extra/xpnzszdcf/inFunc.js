var initScene = function(data) {
    loadPlist("dotool")
    var self = data.layer
    var disFdj = data.disFdj || false
    var list = data.list
    var deco = data.deco
    var judgePos = data.judgePos
    var itemList = data.itemList
    var layKey = data.layKey
    var finalList = data.finalList || []
    var donwFun = data.donwFun

    var createSB = function() {
        var uilist = [
            "water",
            "back",
            "crash",
            "down",
        ]
        var sb = loadNode(res.dojson, uilist, "sb")
        sb.water.setLocalZOrder(-3)
        sb.back.setLocalZOrder(-3)
        sb.down.setLocalZOrder(-1)

        sb.water.rootPos = sb.water.getPosition()
        sb.water.final = 274
        reAdd(sb.down)
        reAdd(sb.water)
        reAdd(sb.back)
        sb.crash.setVisible(false)
        sb.setScale(0.5)
        sb.setPosition(420, 272)
        return sb
    }
    var fdj = createFDJ({
        father: self,
        hidebtn: true,
    })
    fdj.createNew({
        key: "sb",
        fun: createSB
    })
    if (!disFdj) {
        fdj.see[0].setVisible(true)
    }
    fdj.setGet(cc.p(431, 272))
    fdj.see[0].setPosition(0, 0)
        // fdj.get[0].setVisible(true)
        // fdj.actMove()
    var btnList = []

    var createXPN = function(index) {
        var key = itemList[index]
        var xp = new cc.Sprite(sprintf("#xpn_%02d.png", key))
        xp.setPosition(736, 131)
        xp.index = index
        xp.final = finalList[index]
        return xp
    }

    var resetWater = function() {
        fdj.runData({
            key: "sb",
            fun: function(data) {
                var item = data.item
                var water = item.water
                var down = item.down
                water.setPositionY(water.rootPos.y)
                down.setPositionY(water.rootPos.y)
            }
        })
    }
    for (var i = 0; i < list.length; i += 2) {
        var btn = createJudgeBtn({
            normal: sprintf("xpn_%02d.png", list[i]),
            select: sprintf("xpn_%02d.png", list[i + 1]),
            pos: cc.p(judgePos.x + i * 50, judgePos.y),
            frame: true,
            onlyTrue: true,
            fun: function(item) {
                if (btnList) {
                    for (var i = 0; i < btnList.length; i++) {
                        var inItem = btnList[i]
                        if (item != inItem) {
                            inItem.change(false, false)
                        }
                    }
                }
                resetWater()
                fdj.deleteKey("xpn")
                fdj.createNew({
                    key: "xpn",
                    fun: createXPN,
                    buf: item.index,
                    father: "sb",
                    infun: function(item) {
                        var inSb = fdj.getIn("sb")
                        item.setLocalZOrder(-2)
                    },
                    outfun: function(item) {
                        var outSb = fdj.getOut("sb")
                        item.setLocalZOrder(-2)
                        var outFinal = item.final
                        item.update = function(dt) {
                            var item = this
                            if (item.canDrop) {
                                if (item.y < 300) {
                                    var dis = 300 - item.y
                                    fdj.runData({
                                        key: "sb",
                                        fun: function(data) {
                                            var item = data.item
                                            var water = item.water
                                            var final = water.rootPos.y + dis
                                            var inFinal = outFinal || water.final
                                            if (final > inFinal) {
                                                final = inFinal
                                            }
                                            water.setPositionY(final)
                                            var down = item.down
                                            down.setPositionY(final)
                                        }
                                    })
                                } else {
                                    resetWater()
                                }
                            }
                        }
                        item.scheduleUpdate()
                        createTouchEvent({
                            item: item,
                            begin: function(data) {
                                fdj.runData({
                                    key: "xpn",
                                    fun: function(data) {
                                        var item = data.item
                                        item.stopAllActions()
                                    }
                                })
                                return true
                            },
                            move: function(data) {
                                var item = data.item
                                var outSb = fdj.getOut("sb")
                                switch (layKey) {
                                    case 1:
                                        var modify1 = 0
                                        var modify2 = 0
                                        var modify3 = 0
                                        switch (item.index) {
                                            case 1:
                                                modify1 = -35
                                                modify2 = 25
                                                modify3 = -25
                                                break
                                            case 2:
                                                modify1 = -15
                                                modify2 = 15
                                                modify3 = -15
                                                break
                                            case 3:
                                                break
                                        }
                                        var leftJudge = 596 + modify1
                                        var right = 400 + modify2
                                        var left = 186 + modify3
                                        if (item.y > 550) {
                                            data.left = 186
                                            data.right = null
                                        } else {
                                            if (item.x <= leftJudge - 1) {
                                                data.right = right
                                                data.left = left
                                                data.bottom = 131
                                            } else {
                                                data.left = leftJudge
                                                data.bottom = 112
                                            }
                                        }
                                        item.canDrop = (item.x <= right)
                                        item.down = 131
                                        break
                                    case 2:
                                        var modify1 = 0
                                        var modify2 = 0
                                        var modify3 = 0
                                        switch (item.index) {
                                            case 0:
                                                modify3 = 10
                                                item.down = 247
                                                break
                                            case 1:
                                                modify1 = 5
                                                modify2 = 0
                                                modify3 = 5
                                                item.down = 260
                                                break
                                            case 2:
                                                modify1 = -15
                                                modify2 = 15
                                                modify3 = -15
                                                item.down = 260
                                                break
                                            case 3:
                                                modify1 = -15
                                                modify2 = 15
                                                modify3 = -15
                                                item.down = 260
                                                break
                                        }
                                        var leftJudge = 596 + modify1
                                        var right = 400 + modify2
                                        var left = 186 + modify3
                                        if (item.y > 550) {
                                            data.left = 186
                                            data.right = null
                                        } else {
                                            if (item.x <= leftJudge - 1) {
                                                data.right = right
                                                data.left = left
                                                data.bottom = item.down
                                            } else {
                                                data.left = leftJudge
                                                data.bottom = 112
                                            }
                                        }
                                        item.canDrop = (item.x <= right)
                                        break
                                    case 3:
                                        var modify1 = 0
                                        var modify2 = 0
                                        var modify3 = 0
                                        switch (item.index) {
                                            case 0:
                                                modify1 = -10
                                                modify2 = 10
                                                modify3 = -10
                                                item.down = 131
                                                break
                                            case 1:
                                                modify1 = -10
                                                modify2 = 10
                                                modify3 = -10
                                                item.down = 131
                                                break
                                            case 2:
                                                modify1 = 0
                                                modify2 = 0
                                                modify3 = 0
                                                item.down = 250
                                                break
                                            case 3:
                                                modify1 = 5
                                                modify2 = 0
                                                modify3 = 0
                                                item.down = 250
                                                break
                                            case 4:
                                                modify1 = 0
                                                modify2 = 0
                                                modify3 = 0
                                                item.down = 250
                                                break
                                        }
                                        var leftJudge = 596 + modify1
                                        var right = 400 + modify2
                                        var left = 186 + modify3
                                        if (item.y > 550) {
                                            data.left = 186
                                            data.right = null
                                        } else {
                                            if (item.x <= leftJudge - 1) {
                                                data.right = right
                                                data.left = left
                                                data.bottom = item.down
                                            } else {
                                                data.left = leftJudge
                                                data.bottom = 112
                                            }
                                        }
                                        item.canDrop = (item.x <= right)
                                        break
                                }
                                //data.show = true
                                judgeMove(data)
                                item.linkFun(function(data) {
                                    var inItem = data.item
                                    inItem.x = item.x
                                    inItem.y = item.y
                                })
                            },
                            end: function(data) {
                                var item = data.item
                                if (item.canDrop) {
                                    var down = item.down
                                    fdj.runData({
                                        key: "xpn",
                                        fun: function(data) {
                                            var item = data.item
                                            var dis = item.y - down
                                            var time = dis / 700
                                            addShowType({
                                                item: item,
                                                show: "moveTo",
                                                buf: cc.p(item.x, down),
                                                time: time,
                                                fun: function() {
                                                    if (donwFun) {
                                                        donwFun()
                                                    }
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }
        })
        btn.index = btnList.length
        btnList[btnList.length] = btn
        safeAdd(self, btn)
    }
    btnList[0].change(true, true)
    var decoImg = new cc.Sprite(deco)
    decoImg.setPosition(583, 548)
    safeAdd(self, decoImg)
}