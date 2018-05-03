//@author mu @16/5/11
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           loadPlist("ZuQiu")
        })
        this._super()
        var self = this
        this.expCtor({
          vis: false,
          setZ:800,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               if (!self.bgg) {
                   var bg = createBiaoge({
                      json: res.biao2,
                      scale: 0.9,
                      inputNum:1,
                      inputLineChange:[true],
                      downData:{
                        nums:5,
                        scale:1.3,
                        bufs:[
                          [null,res.bg_cs1,res.bg_cs2],
                          [null,res.bg_cs1,res.bg_cs2],
                          [null,res.bg_cs1,res.bg_cs2],
                          [null,res.bg_cs1,res.bg_cs2],
                          [null,res.bg_cs1,res.bg_cs2]
                        ],
                        keys:[
                           1,1,1,1,1
                        ]
                      }
                  })
                  self.addChild(bg)
                  self.bgg = bg
               }
               var bg = self.bgg
               bg.show()
            }
          }
        })
        this.initPeople()
        this.initUI()    
        return true
    },
    initUI:function(){
        var self = this
        var tp = self.createTp({
               father: self,
               tppos:cc.p(660,100),
               noFama:true,
               balanceBcak:function(){
                   self.speakeBykey("wenzi4")
               },
               addFun: function(data) {
                   var item = data.item
                   item.setPosition(95,95)
                   item.inTp = true
               }
            })

        
        var qiqiu = self.createZuQiu(cc.p(120,370))
        self.addChild(qiqiu)

        var qiqiu1 = self.createZuQiu(cc.p(120,180))
        self.addChild(qiqiu1)

        var Qt = self.createDQT()
        Qt.setPosition(130,70)
        self.addChild(Qt,100)
        
        var Touches = true
        createTouchEvent({
           item: qiqiu,
           begin:function(data){
                if(Touches){
                   Touches = false
                   var item = data.item
                   var pos = data.pos
                   if(item.inTp){
                       item.inTp = false
                       tp.disWeight(item.GsrWeight,item.curSide)
                       item.setPosition(pos)
                       item.getParent().noneAdd = false
                       safeAdd(self, item)
                   }
                   return true
                }
           },
           autoMove:true,
           end: function(data) {
                if(!Touches){
                   var item = data.item
                   data.weight = item.GsrWeight
                   data.safeAddBack = function(node){
                       node.noneAdd = true
                   }
                   tp.addItem(data)
                   if(!item.inTp){
                        item.setPosition(120,370)
                        item.setLocalZOrder(10)
                   }
                }
                Touches = true
           }
        })
        createTouchEvent({
           item: qiqiu1,
           begin:function(data){
               if(Touches){
                   Touches = false
                   var item = data.item
                   var pos = data.pos
                   if(item.inTp){
                       item.inTp = false
                       tp.disWeight(item.GsrWeight,item.curSide)
                       item.setPosition(pos)
                       item.getParent().noneAdd = false
                       safeAdd(self, item)
                   }
                   return true
                }
           },
           autoMove:true,
           end: function(data) {
                if(!Touches){
                   var item = data.item
                   data.weight = item.GsrWeight
                   data.safeAddBack = function(node){
                       node.noneAdd = true
                   }
                   tp.addItem(data)
                   if(!item.inTp){
                        item.setPosition(120,180)
                        item.setLocalZOrder(10)
                   }
                }
                Touches = true
           }
        })

        createTouchEvent({
           item: Qt,
           begin:function(data){
                if(Touches){
                   Touches = false  
                   return true
                }
           },
           move:function(data){
                var item = data.item
                var delta = data.delta
                var pos = data.pos
                item.x += delta.x
                item.y += delta.y
                if(!item.is90){
                    item.is90 = true
                    item.setPosition(cc.p(pos.x-10,pos.y-10))
                    item.setRotation(-60)
                    qiqiu.playAC()
                    qiqiu1.playAC()
                }
           }, 
           end: function(data) {
                var item = data.item
                if(!Touches){
                    var topos = cc.p(item.x - item.width/2+42,item.y - item.height/2 - 48)
                    if(judgeInside({item:qiqiu.hqt,pos:topos}) && qiqiu1.curNum<=7){
                        if(!qiqiu.inTp){
                            item.setPosition(qiqiu.x+103.5,qiqiu.y+53)
                            item.curZuqiu = qiqiu
                        }else{
                            item.setRotation(0)
                            item.setPosition(130,70)
                            item.curZuqiu = null
                            self.speakeBykey(res.zutip,"tip")
                        } 
                    }else if(judgeInside({item:qiqiu1.hqt,pos:topos}) && qiqiu1.curNum<=7){
                        if(!qiqiu1.inTp){
                            item.setPosition(qiqiu1.x+103.5,qiqiu1.y+53)
                            item.curZuqiu = qiqiu1
                        }else{
                            item.setRotation(0)
                            item.setPosition(130,70)
                            item.curZuqiu = null
                            self.speakeBykey(res.zutip,"tip")
                        } 
                    }else{
                        item.setRotation(0)
                        item.setPosition(130,70)
                        item.curZuqiu = null
                    }
                }
                qiqiu.stopAc()
                qiqiu1.stopAc()
                Touches = true
                item.is90 = false
           }
        })

        createTouchEvent({
           item: Qt.qiba,
           begin:function(data){
                if(Touches){
                   Touches = false  
                   return true
                }
           },
           move:function(data){
                var item = data.item
                var delta = data.delta
                if(Qt.curZuqiu){
                    var tempx = item.x + delta.x
                    if(tempx>=200){
                        tempx = 200
                    }else if(tempx<=145){
                        tempx = 145
                    }
                    if(tempx>=190){
                        Qt.haveQi = true
                    }

                    if(tempx<=160){
                        if(Qt.haveQi && Qt.curZuqiu){
                            Qt.haveQi = false
                            Qt.curZuqiu.playChange(function(){
                                if(Qt.curZuqiu.curNum>=8){
                                  Qt.runAction(cc.sequence(
                                      cc.delayTime(1),
                                      cc.callFunc(function(){
                                          Qt.setRotation(0)
                                          Qt.setPosition(130,70)
                                          Qt.curZuqiu = null
                                          Qt.is90 = false
                                      })
                                  ))
                                } 
                            }) 
                        }
                    }
                    item.x = tempx
                }
           }, 
           end:function(data) {
                Touches = true
           }
        })
    },
    createZuQiu:function(pos){
        var qiqiu = new cc.Sprite("#zuqiu00.png")
        qiqiu.setPosition(pos)
        qiqiu.GsrWeight = 10
        qiqiu.curNum = 0

        qiqiu.hqt = new cc.Sprite(res.hjt)
        qiqiu.hqt.setPosition(146,63)
        qiqiu.addChild(qiqiu.hqt)
        qiqiu.hqt.setVisible(false)

        qiqiu.hqtAc = new cc.Sprite(res.hjt)
        qiqiu.hqtAc.setPosition(170,73)
        qiqiu.addChild(qiqiu.hqtAc)
        qiqiu.hqtAc.setRotation(110)
        qiqiu.hqtAc.setVisible(false)

        qiqiu.playAC = function(){
            var qiqiu = this
            if(qiqiu.curNum<=7){
                qiqiu.hqtAc.stopAllActions()
                qiqiu.hqtAc.runAction(cc.repeatForever(cc.sequence(
                    cc.delayTime(0.3),
                    cc.callFunc(function(){
                        qiqiu.hqtAc.setVisible(true)
                    }),
                    cc.delayTime(0.3),
                    cc.callFunc(function(){
                        qiqiu.hqtAc.setVisible(false)
                    })
                )))
            }
        }
        qiqiu.stopAc = function(){
            var qiqiu = this
            qiqiu.hqtAc.stopAllActions()
            qiqiu.hqtAc.setVisible(false)
        }
        qiqiu.playChange = function(func){
            var qiqiu = this
            if(qiqiu.curNum<=7){
                var ac = createAnimation({
                                frame:"zuqiu%02d.png",
                                start:qiqiu.curNum*5,
                                end:qiqiu.curNum*5+4,
                                time: 0.04,
                                fun:function(){
                                  if(func){
                                      func()
                                  }
                                }
                            })
                qiqiu.stopAllActions()
                qiqiu.runAction(ac)
                qiqiu.curNum++
                qiqiu.GsrWeight = qiqiu.GsrWeight + 5
            }
        }

        return qiqiu
    },
    createDQT:function(){
        var Qt = new cc.Sprite(res.qit2)
        
        var Qt1 = new cc.Sprite(res.qit1)
        Qt1.setPosition(200,11)
        Qt.addChild(Qt1)
        Qt.qiba = Qt1

        var Qt2 = new cc.Sprite(res.qit2)
        Qt2.setPosition(Qt.width/2,Qt.height/2)
        Qt.addChild(Qt2)

        return Qt
    },
    createTp:function(data){
            data = data || {}
            var noFama = data.noFama || false
            var addFun = data.addFun
            var teach = data.teach || false
            var teachFun = data.teachFun
            var teachFail = data.teachFail
            var balanceShu = data.balanceShu || false
            var balanceBcak = data.balanceBcak
            var uiList = [
                "img_ym",
                "img_rotate",
                "img_lm_left",
                "img_lm_right",
                "node_left",
                "node_right",
                "img_tp_left",
                "img_tp_right",
                "img_balance",
                "img_balance_shu"
            ]
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
                "ym_red"
            ]

            var nameList = [
                "dz",
                "fdp",
                "hl",
                "bc",
                "phlm",
                "phlm",
                "zz",
                "tp",
                "tp",
                "ym"
            ]

            var readLink = [
                "lmr_red",
                "lml_red",
                "tpl_red",
                "tpr_red",
            ]
            var tp = loadNode(res.nodetp, uiList)
            loadList(tp, redList)
            for (var i = 0; i < redList.length; i++) {
                tp[redList[i]].setVisible(false)
                tp[redList[i]].teachName = nameList[i]
            }
            for (var i = 0; i < readLink.length; i++) {
                if (i % 2 == 0) {
                    tp[readLink[i]].link = tp[readLink[i + 1]]
                } else {
                    tp[readLink[i]].link = tp[readLink[i - 1]]
                }
            }
            tp.initTeach = function() { //初始化红色线
                var actTeach = function() {
                    var item = this
                    for (var i = 0; i < redList.length; i++) {
                        tp[redList[i]].setVisible(false)
                    }
                    item.setVisible(true)
                    if (item.link) {
                        item.link.setVisible(true)
                    }
                    if (teachFun) {
                        teachFun(item.teachName)
                    }
                }
                for (var i = 0; i < redList.length; i++) {
                    tp[redList[i]].actTeach = actTeach
                    createTouchEvent({
                        item: tp[redList[i]],
                        begin: function(data) {
                            var item = data.item
                            item.actTeach()
                            return true
                        },
                        beginfail: function(data) {
                            var item = data.item
                            item.setVisible(false)
                            if (teachFail) {
                                teachFail(item.teachName)
                            }
                            return false
                        }
                    })
                }
                tp.showTeach = function(judge) {
                    for (var i = 0; i < redList.length; i++) {
                        if (judge == tp[redList[i]].teachName) {
                            tp[redList[i]].actTeach()
                            break
                        }
                    }
                }
            }

            var pos = data.tppos || cc.p(440, 150)
            var famapos = data.famapos || cc.p(800, 150)
            var father = data.father || CC_CURRENT_LAYER
            var blanceModify = data.blanceModify || cc.p(0, 0)
            var balancepos = data.balancepos || "up"
            tp.setPosition(pos)
            tp.initControl = function() { //初始化所有控制函数
                var tp = this
                var s = tp.lmleft.getContentSize()
                createTouchEvent({
                    item: tp.lmleft,
                    rect: cc.rect(-s.width, -s.height, s.width * 3, s.height * 3), //触发区域九倍
                    begin: function(data) {
                        var target = data.item
                        var pos = data.pos
                        var locationInNode = target.convertToNodeSpace(pos)
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
                        return false
                    },
                    end: function(data) {
                        var target = data.item
                        var pos = data.pos
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
                        tp.moveLm({
                            lm: target.name,
                            count: count,
                        })
                        tp.UpdateBalance()
                    },
                })
                copyEvent(tp.lmleft, tp.lmright)
                var sizeYm = tp.youma.getContentSize()
                createTouchEvent({
                    item: tp.youma,
                    rect: cc.rect(-sizeYm.width, -sizeYm.height / 2, sizeYm.width * 3, sizeYm.height * 2),
                    move: function(data) {
                        var target = data.item
                        var delta = data.delta
                        if (tp.moveYm(delta.x)) {
                            tp.UpdateBalance()
                        }
                    },
                })

                createTouchEvent({
                    item: tp.niezi,
                    begin: function(data) {
                        var item = data.item
                        var pos = data.pos
                        if (tp.BALANCE) {
                            if (item.isVisible()) {
                                item.setVisible(false)
                                if (!item.gray) {
                                    var gray = new cc.Sprite(res.img_niezi_gray)
                                    gray.setAnchorPoint(0.7, 0.7)
                                    father.addChild(gray)
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
                            tp.showAlarm(0)
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
                                    father.addChild(fama)
                                    fama.link = target
                                    target.link = fama
                                    fama.type = "in"
                                    fama.weight = weight
                                    target.setVisible(false)
                                    item.setVisible(false)
                                    item.gray.setVisible(false)
                                    tp.niezijia.setPosition(fama.getContentSize().width / 4, fama.getContentSize().height / 2)
                                    safeAdd(fama, tp.niezijia)
                                    break
                                case "out":
                                    target.retain()
                                    var final = target.getParent().convertToWorldSpace(target.getPosition())
                                    target.removeFromParent(false)
                                    father.addChild(target)
                                    target.setPosition(final)
                                    target.release()
                                    tp.niezijia.setPosition(target.getContentSize().width / 4, target.getContentSize().height / 2)
                                    safeAdd(target, tp.niezijia)
                                    item.gray.setVisible(false)
                                    item.setVisible(false)
                                    tp.addWeight(null, -target.weight)
                                    tp.followRight[target.key] = null
                                    tp.UpdateBalance()
                                    break
                            }
                        }
                    }
                })

                createTouchEvent({
                    item: tp.niezijia,
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
                            tp.niezijia.removeFromParent(false)
                            par.removeFromParent(true)
                            tp.niezi.setVisible(true)

                        }
                        var success = function() {
                            tp.niezijia.removeFromParent(false)
                            tp.niezi.setVisible(true)
                        }
                        if (judgeIn(tp.tpleft, pos, cc.p(0, 1.2))) {
                            tp.showAlarm(1)
                            back()
                        } else if (judgeIn(tp.tpright, pos, cc.p(0, 1.2))) {
                            var target = par.link
                            if (!tp.followRight[target.key]) {
                                var temp = par
                                tp.followRight[target.key] = temp
                                temp.retain()
                                temp.setPosition(target.rootPos)
                                temp.rootPos = target.rootPos
                                temp.setLocalZOrder(target.order)
                                temp.removeFromParent(false)
                                temp.link = target
                                temp.key = target.key
                                temp.weight = target.weight
                                tp.tpright.addChild(temp)
                                temp.release()
                                tp.addWeight(null, target.weight)
                                tp.UpdateBalance()
                                success()
                            }
                        } else {
                            back()
                        }
                    }
                })
                createTouchEvent({
                    item: tp.famahe,
                    begin: function() {
                        if (!tp.BALANCE) {
                            tp.showAlarm(0)
                        }
                    },
                })
            }
            tp.showAlarm = function(index) { //展示提示
                var dia = res[sprintf("tp_tip%d", index + 1)]
                AddDialog("Tips", {
                    res: dia,
                    face: 2,
                })
            }
            tp.randomInit = function() { //随机初始化
                //随机初始化天平
                var tp = this
                var max = tp.lmmaxmove / tp.lmpermove
                tp.moveLm({
                    lm: "left",
                    count: Math.floor(Math.random() * max)
                })
                tp.moveLm({
                    lm: "right",
                    count: Math.floor(Math.random() * max)
                })
                tp.moveYm(Math.random() * 230)
                tp.UpdateBalance()
            }
            tp.moveYm = function(dis) {
                var tp = this
                var temp = tp.youma.getPositionX() + dis
                if (temp >= tp.youmaMin && temp <= tp.youmaMax) {
                    tp.youma.setPositionX(temp)
                    tp.addWeight(null, dis * tp.youmaPer)
                    return true
                } else if (temp < tp.youmaMin) {
                    dis = tp.youmaMin - tp.youma.getPositionX()
                    tp.youma.setPositionX(tp.youmaMin)
                    tp.addWeight(null, dis * tp.youmaPer)
                    return true
                }
            }
            tp.moveLm = function(data) {
                var tp = this
                var lm = data.lm
                var count = data.count
                var par = null
                var item = null
                switch (lm) {
                    case "left":
                        item = tp.lmleft
                        par = 1
                        break
                    case "right":
                        item = tp.lmright
                        par = -1
                        break
                }
                var temp = item.count + count
                var max = tp.lmmaxmove / tp.lmpermove
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
                item.x += (count * tp.lmpermove * par)
                if (par == 1) {
                    tp.addWeight(null, count * tp.perlm)
                } else {
                    tp.addWeight(count * tp.perlm, null)
                }
            }
            tp.UpdateBalance = function() {
                var tp = this
                var dix = tp.weights.right - tp.weights.left
                var par = dix > 0 ? 1 : -1
                var per = 1
                var act = true
                var mix = 0
                var result = {}
                dix = Math.abs(dix)
                if (!(dix >= tp.startRotate)) {
                    per = dix / tp.startRotate
                }
                tp.rotate.stopAllActions()
                tp.nodeleft.stopAllActions()
                tp.noderight.stopAllActions()
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
                var balanceFun = function(call) {
                    if (call && (tp.BALANCE || tp.youma.getPositionX() <= tp.youmaMin + 0.01)) { //允许的误差值
                        var mix = Math.abs(tp.weights.left - tp.weights.right)
                        if (mix <= 0.03) {
                            tp.BALANCE = true
                            if (balanceShu) {
                                tp.img_balance_shu.setVisible(true)
                            } else {
                                tp.img_balance.setVisible(true)
                            }
                            if (balanceBcak) {
                                cc.log("天平已平衡 回调balanceBcak")
                                balanceBcak()
                            }
                        }
                    }
                }
                if (tp.rotate.getRotation() == tp.maxRotate * par * per) {
                    act = false
                } else {
                    mix = (tp.rotate.getRotation() - tp.maxRotate * par * per) / 10
                }
                tp.rotate.current = 0
                tp.nodeleft.current = 0
                tp.noderight.current = 0
                var runloop = function(item, index, call) {
                    call = call || false
                    var show = (index == 0) ? "rotateTo" : "moveBy"
                    var time = shakes[item.current].time
                    var buf = null
                    switch (index) {
                        case 0:
                            buf = tp.maxRotate * par * (per + mix * shakes[item.current].per)
                            break
                        case 1:
                            buf = cc.p(0, tp.maxDis * par * (per + mix * shakes[item.current].per) + tp.rooty - item.getPositionY())
                            break
                        case 2:
                            buf = cc.p(0, tp.maxDis * par * -1 * (per + mix * shakes[item.current].per) + tp.rooty - item.getPositionY())
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
                                    runloop(item, index, call)
                                } else {
                                    tp.Updating = false
                                    balanceFun(call)
                                }
                        }
                    })
                }
                if (act) {
                    tp.Updating = true
                    runloop(tp.rotate, 0, true)
                    runloop(tp.nodeleft, 1)
                    runloop(tp.noderight, 2)
                }
            }
            tp.addWeight = function(left, right) {
                var tp = this
                if (left != null) {
                    tp.weights.left += left
                }
                if (right != null) {
                    tp.weights.right += right
                }
            }
            tp.addItem = function(data) { //添加对象 外部调用
                var tp = this
                tp.tpleft.addItem(data)
                tp.tpright.addItem(data)
            }
            tp.disWeight = function(weight, tri) { //拿下重量 默认拿下左边的
                var tp = this
                tri = tri || "left"
                switch (tri) {
                    case "right":
                        tp.addWeight(null, -weight)
                        break
                    case "left":
                        tp.addWeight(-weight, null)
                        break
                }
                tp.UpdateBalance()
            }
            tp.init = function() {
                var tp = this
                tp.ym = tp.img_ym
                tp.rotate = tp.img_rotate
                tp.lmleft = tp.img_lm_left
                tp.lmright = tp.img_lm_right
                tp.nodeleft = tp.node_left
                tp.noderight = tp.node_right
                tp.tpleft = tp.img_tp_left
                tp.tpright = tp.img_tp_right
                tp.youma = tp.img_ym
                tp.addFun = addFun
                tp.lmleft.count = 0
                tp.lmleft.name = "left"
                tp.lmright.count = 0
                tp.lmright.name = "right"
                tp.maxRotate = 7 //最大旋转角度
                tp.maxDis = 20 //最大垂直位移
                tp.startRotate = 0.5 //开始偏移的差值
                tp.perlm = 0.05 //每次移动螺母造成的重量差
                tp.rooty = tp.node_left.getPositionY()
                tp.lmleftmin = tp.lmleft.getPositionX()
                tp.lmrightmax = tp.lmright.getPositionX()
                tp.youmaMin = tp.youma.getPositionX() //游码最小位置
                tp.youmaMax = tp.youmaMin + 230 //最大位置
                tp.youmaPer = 5 / 230 //每个位置代表质量
                tp.lmmaxmove = 36 //螺母最大偏移
                tp.lmpermove = 3 //螺母每次移动偏移
                tp.img_balance.setVisible(false)
                tp.img_balance_shu.setVisible(false)
                if (balancepos == "up") {
                    tp.img_balance.setPosition(25, 380)
                } else {
                    tp.img_balance.setPosition(cc.p(tp.img_balance.getPositionX() + blanceModify.x, tp.img_balance.getPositionY() + blanceModify.y))
                }
                tp.followRight = {}
                tp.followLeft = {}
                tp.weights = {
                    left: 0.0,
                    right: 0.0,
                }
                var addItem = function(data) {
                    var node = this
                    var weight = data.weight
                    var item = data.item
                    var type = data.type || "normal"
                    var pos = data.pos
                    var safeAddBack = data.safeAddBack
                    if (judgeIn(node, pos, cc.p(0, 4.5)) && !node.noneAdd) {
                        if (!tp.BALANCE) {
                            tp.showAlarm(0)
                            return
                        }
                        if (type != "both" && type != node.type) {
                            tp.showAlarm(node.alarm)
                        } else {
                            if (type != "fama") {
                                if (addFun) {
                                    addFun({
                                        item: item,
                                        pos: pos,
                                    })
                                }
                                item.curSide = node == tp.tpleft ? "left" : "right"
                            }
                            safeAdd(node, item)
                            if (safeAddBack) {
                                safeAddBack(node)
                            }
                            if (node == tp.tpleft) {
                                tp.addWeight(weight, null)
                            } else {
                                tp.addWeight(null, weight)
                            }
                            tp.UpdateBalance()
                        }
                    }
                }
                tp.tpleft.addItem = addItem
                tp.tpleft.type = "normal"
                tp.tpleft.alarm = 1
                tp.tpright.addItem = addItem
                tp.tpright.type = "normal"
                tp.tpright.alarm = 2
                if (!teach) {
                    tp.initControl()
                    tp.randomInit()
                } else {
                    tp.initTeach()
                }
            }
            var famalist = [
                "img_5g",
                "img_10g",
                "img_20g_1",
                "img_20g_2",
                "img_50g",
                "img_100g",
            ]
            tp.famalist = famalist
            famalist.push("img_nz")
            var fama = loadNode(res.nodefm, famalist, "bg")
            tp.niezi = fama.img_nz
            tp.niezijia = new cc.Sprite(res.img_niezi_jia)
            tp.niezijia.retain()
            tp.famahe = fama
            tp.niezijia.setAnchorPoint(0, 0)
            tp.famalist = [{
                weight: 5,
                item: fama.img_5g,
                key: "5g",
                root: cc.p(80, 30),
                order: 6
            }, {
                weight: 10,
                item: fama.img_10g,
                key: "10g",
                root: cc.p(110, 40),
                order: 5
            }, {
                weight: 20,
                item: fama.img_20g_1,
                key: "20g1",
                root: cc.p(140, 50),
                order: 4
            }, {
                weight: 20,
                item: fama.img_20g_2,
                key: "20g2",
                root: cc.p(60, 50),
                order: 3
            }, {
                weight: 50,
                item: fama.img_50g,
                key: "50g",
                root: cc.p(90, 60),
                order: 2
            }, {
                weight: 100,
                item: fama.img_100g,
                key: "100g",
                root: cc.p(120, 70),
                order: 1
            }, ]
            fama.setPosition(famapos)
            var judgeFama = function(pos) {
                for (var i = 0; i < tp.famalist.length; i++) {
                    var item = tp.famalist[i]
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
                for (var key in tp.followRight) {
                    var item = tp.followRight[key]
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
            tp.BALANCE = false
            tp.init()
            if (!noFama) {
                father.addChild(fama)
            }
            father.addChild(tp)
            return tp
    },
    speakeBykey:function(key,status){
        var self = this
        if(!status){
            if(!self[key]){
                self[key] = true
                self.nodebs.say({
                        key: key,
                        force: true
                    }) 
            }
        }else{
            dialogControl.AddDialog("Tips", {
                                res:key,
                                face: 1,
                                confirmBtn: true,
                                father: self
                            })
        }  
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
               self.speakeBykey("wenzi3")
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,900);
        
        addContent({
            people: this.nodebs,
            key: "wenzi3",
            img:res.wenzi3,
            sound: res.zimp3
        })

        addContent({
            people: this.nodebs,
            key: "wenzi4",
            img:res.wenzi4,
            sound: res.zimp4
        })

        addContent({
            people: this.nodebs,
            key: "wenzi5",
            img:res.wenzi5,
            sound: res.zimp5
        })
    }  
})