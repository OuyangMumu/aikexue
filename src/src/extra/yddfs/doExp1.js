var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        loadPlist("draw_plist")
        this._super();
        this.expCtor({
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    if(!self.bgg) {
                        var bg = createBiaoge({
                            json: res.yddfs_tableNode_json,
                            inputNum:9,
                            scale: 0.9
                    })
                    var that = bg
                    createBgMoveSp({
                        father:that,
                        imgs:[
                            ["#draw_1.png",0],
                            ["#draw_2.png",1],
                            ["#draw_3.png",2],
                            ["#draw_4.png",3],
                            ["#draw_5.png",4],
                        ],
                        pos:cc.p(120,250),
                        dis:80,
                        //itemScale:0.9,
                        resultfather:self,
                        rectlist:[
                           cc.rect(90,450,70,90),
                           cc.rect(160,450,70,90),
                           cc.rect(233,450,70,90),
                           cc.rect(305,450,70,90),
                           cc.rect(375,450,70,90),
                        ]
                    })
                    // bg.upLoadFun = function(){
                    //     that.upResult()
                    // }
                    bg.ClearFun = function(){
                        that.clearData()
                    }
                    self.addChild(bg)
                    self.bgg = bg
                    }
                var bg = self.bgg
                bg.show()
                }
            }
        });
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        loadPlist("ziyuan_plist")
        loadPlist("tuo_plist")
        loadPlist("tool4_plist")
        loadPlist("ruler_plist")
        loadPlist("car_plist")
        var uiList = ["tool1","mukuai","tuo","drawPot","jiantou1",
                    "tool3","tool3_hand","lunzi","liushui","shuimian","caomian",
                    "tool5","baidong","baijian",
                    "tool6","ruler","tool6_hand","tool6_judge",
                    "tool7","item_hand","add","item_left","item_right","hand1","hand2","hand3","hand4",
                    "tool8","tool8_hand","tool8_guan","tool8_red",
                    "tool9","tool9_car","tool9_tuo","tool9_drawPot","tool9_jiantou1",
        ]
        var node = loadNode(res.yddfs_doExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip0"})
        })

        var tipList = [true,true,true,true,true,true,true,true,true]
        node.judgeTip = function(index){
            self.nodebs.stopSay()
            if(tipList[index]){
                tipList[index] = false
                self.nodebs.say({key:self.addList[index+1].key,force:true})
            }
        }

        var createSp = function(sprite,pos,father){
            var sp = new cc.Sprite(sprite)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }
        //乒乓球界面
        node.tool2 = createSp(res.tool2table,cc.p(-568,120),self)
        node.qiu = createSp("#do_getTool2.png",cc.p(500,100),node.tool2)
        node.qiu.handqian = createSp("#handqian.png",cc.p(-29,16),node.qiu)
        node.qiu.handhou = createSp("#handhou.png",cc.p(-24,55),node.qiu)
        node.xuxian = createSp("#xuxian.png",cc.p(500,-200),node.tool2)
        node.qiu.handhou.setLocalZOrder(-1)
        node.qiu.handqian.setVisible(false)
        node.qiu.handhou.setVisible(false)

        //水轮界面
        node.tool3_hand.setLocalZOrder(-1)
        node.shuimian.setLocalZOrder(-1)
        node.liushui.setLocalZOrder(-1)

        //青蛙界面
        node.qingwa = createSp("#qingwa.png",cc.p(350,-100),self)
        node.tool4_hand = createSp("#tool4_hand.png",cc.p(230,-170),self)
        node.tool4_hand.setVisible(false)
        node.qingwa.over = false
        node.qingwa.noMove = false
        node.tool7.setPositionY(-600)

        //钢尺界面
        var ruler = node.ruler
        //橡皮筋界面
        var item_hand = node.item_hand
        var limit = 150
        var lineWidth = 4
        node.hand3.setVisible(false)
        node.hand4.setVisible(false)
        item_hand.rootPos = item_hand.getPosition()
        var lineColor = cc.color(255, 204, 0, 255)
        var beforeIndex = null
        var toolbtn = createTool({
            pos: cc.p(350, 550),
            nums: 3,
            scale:0.7,
            itemScale:0.9,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.7),
            itempos: cc.p(0, -15),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            arrow:false,
            father: self,
            counts: [99, 99, 99, 99, 99, 99, 99, 99, 99],
            swallow: [true, true, true, true, true, true, true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3, res.do_tools4, res.do_tools5,
                    res.do_tools6, res.do_tools7, res.do_tools8, res.do_tools9],
            gets: ["#do_getTool1.png","#do_getTool2.png","#do_getTool3.png","#do_getTool4.png",
            "#do_getTool5.png","#do_getTool6.png","#do_getTool7.png","#do_getTool8.png","#do_getTool9.png"],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                cc.log(beforeIndex)
                if(beforeIndex != null)
                    node.judgeBefore(beforeIndex)
                beforeIndex = index
                node.judgeTip(index)
                return item
            },
            clickfun: function(data){
                var item = data.sp
                var index = data.index
            },
            movefun: function(data){
                var item = data.sp 
                var index = data.index
                var delta = data.delta
                item.x += delta.x 
                item.y += delta.y
            },
            outfun: function(data){
                var item = data.sp 
                var index = data.index
                item.forceBack()
                switch(index){
                    case 0:
                    node.tool1_clickFun()
                    node.jiantou1.setVisible(true)
                    node.jiantou1.runAction(cc.repeatForever(cc.sequence(
                        cc.moveTo(0.3,420,160),
                        cc.delayTime(0.1),
                        cc.moveTo(0.3,440,200),
                        cc.delayTime(0.1)
                    )))
                    node.tool1.setPosition(568,150)
                    break
                    case 1:
                    node.tool2.setPosition(568,120)
                    node.tool2_clickFun()
                    break
                    case 2:
                    node.tool3_clikFun()
                    break
                    case 3:
                    node.tool4_clickFun()
                    break
                    case 4:
                    node.tool5_clickFun()
                    node.tool5.setPosition(568,220)
                    break
                    case 5:
                    node.tool6_clickFun()
                    break
                    case 6:
                    node.tool7.setPosition(568,50)
                    node.tool7_clickFun()
                    break
                    case 7:
                    node.tool8.setPosition(568,150)
                    node.tool8_clickFun()
                    break
                    case 8:
                    node.tool9_clickFun()
                    node.tool9_jiantou1.setVisible(true)
                    node.tool9_jiantou1.runAction(cc.repeatForever(cc.sequence(
                        cc.moveTo(0.3,420,160),cc.delayTime(0.1),
                        cc.moveTo(0.3,440,200),cc.delayTime(0.1)
                    )))
                    node.tool9.setPosition(568,150)
                    break
                }
            }
        })
        self.inside_node.addChild(toolbtn,1)
        self.toolbtn = toolbtn
        toolbtn.show()

        node.judgeBefore = function(){
            switch(beforeIndex){
                case 0:
                node.tool1.setPositionY(-600)
                break
                case 1:
                node.tool2.setPositionY(-600)
                break
                case 2:
                node.tool3.setPositionY(-600)
                break
                case 3:
                node.qingwa.stopAllActions()
                node.tool4_hand.stopAllActions()
                node.tool4_hand.setPositionY(-200)
                node.qingwa.setPositionY(-200)
                break
                case 4:
                node.tool5.setPositionY(-600)
                break
                case 5:
                node.tool6.setPositionY(-600)
                break
                case 6:
                node.tool7.setPositionY(-600)
                break
                case 7:
                node.tool8.setPositionY(-600)
                break
                case 8:
                node.tool9.setPositionY(-600)
                break
            }
        }

        node.tool9_car.carCount = 1
        node.tool8_hand.judge = true

        //木块,球,水轮,青蛙,单摆,钢尺
        var toolList = [
            node.drawPot,node.qiu,node.tool3_hand,
            node.qingwa,node.baijian,node.tool6_hand,
            node.item_hand,node.tool8_hand,node.tool9_drawPot,
        ]
        for(var i = 0 ; i < toolList.length ; i++){
            var item = toolList[i]
            item.index = i
            createTouchEvent({
                item:item,
                begin:function(data){
                    var item = data.item 
                    var index = item.index
                    switch(index){
                        case 0:
                        item.delta = item.x //用于判断当前拖动点的位置
                        node.toolCommon(item,node.jiantou1,node.tuo)
                        break
                        case 1:
                        item.handqian.setVisible(true)
                        item.handhou.setVisible(true)
                        item.stopAllActions()
                        removeTimer("stop")
                        break
                        case 2:
                        if(!item.isVisible())   return false 
                        item.setVisible(false)
                        node.tool3Fun()
                        break
                        case 3:
                        if(item.noMove) return false
                        if(node.qingwa.over){
                            node.qingwaRenew()
                            return false
                        }
                        node.tool4Fun()
                        break
                        case 4:
                        removeTimer("stop")
                        break
                        case 6:
                        if (node.hand1.isVisible()) {
                            node.hand1.setVisible(false)
                            node.hand2.setVisible(false)
                            node.hand3.setVisible(true)
                            node.hand4.setVisible(true)
                            return true 
                        }
                        return false
                        break
                        case 7:
                        if(item.noMove)     return false
                        if(!item.judge){
                            node.tool8_clickFun()
                        }else{
                            node.tool8Fun(item)
                        }
                        break
                        case 8:  //小车
                        item.delta = item.x //用于判断当前拖动点的位置
                        node.toolCommon(item,node.tool9_jiantou1,node.tool9_tuo)
                        break
                    }
                    return true 
                },
                move:function(data){
                    var item = data.item
                    var index = item.index
                    var delta = data.delta
                    var pos = data.pos
                    switch(index){
                        case 0:
                        if(item.noMove)   return false
                        item.x += delta.x
                        if(delta.x > 0 && item.x >= item.delta && item.x < 790){
                            node.tuo.x += delta.x
                            node.mukuai.x += delta.x
                            item.delta = item.x
                        }
                        break
                        case 1:
                        if(item.y + delta.y >= 100){
                            item.y += delta.y
                        }
                        break
                        case 4:
                        var angle = Math.atan((item.x + delta.x -20)/(400-item.y+ delta.y))  / Math.PI * 180
                        if(angle > 30 || angle < -30)  return
                        item.x += delta.x
                        node.baidong.setRotation(-angle)
                        item.setRotation(-angle)
                        if(item.x > 20){
                            item.y = 1 / 3 * item.x + 103
                        }else{
                            item.y = -2 / 7 * item.x + 116
                        }
                        break
                        case 5:
                        item.x += delta.x
                        item.y += delta.y
                        node.tool6Fun(item)
                        break
                        case 6:
                        node.tool7Fun(item,delta)
                        break
                        case 8:
                        if(item.noMove)   return false
                        node.tool9Fun(item,delta)
                        break
                    }
                },
                end:function(data){
                    var item = data.item 
                    var index = item.index
                    switch(index){
                        case 0:
                        node.tool1_clickFun()
                        break
                        case 1:
                        node.tool2Fun(item)
                        break
                        case 4:
                        node.tool5Fun(item)
                        break
                        case 5:
                        if(item.isTouch){
                            item.setPosition(750,370)
                            item.setVisible(true)
                            item.isTouch = false
                            ruler.rever()
                        }
                        break
                        case 6:
                        node.hand3.setVisible(false)
                        node.hand4.setVisible(false)
                        item.back()
                        break
                        case 8:
                        node.tool9_clickFun()
                        break
                    }
                }
            })
        }

        var ani = function(frame,end,time){
            return cc.sequence(createAnimation({
                frame: frame,
                end: end,
                time: time
            }))
        }

        var checkDistance = function(r1,r2,dis){
            var dx = r1.x - (r2.x - r2.width/2)
            var dy = r1.y - (r2.y + r2.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis)
                return true
            else
                return false
        }

        //乒乓球
        node.tool2Fun = function(item){
            item.handqian.setVisible(false)
            item.handhou.setVisible(false)
            node.xuxian.setPosition(item.getPosition())
            var height = item.y - 100
            var time = 0.45
            item.runAction(cc.sequence(
                cc.moveTo(time/2,500,100),
                cc.callFunc(function(){
                    var call = function(){
                        //if(judge){
                            item.stopAllActions()
                            //time = height / 500
                            item.setPosition(cc.p(500,100))
                            item.runAction(//cc.sequence(
                                cc.jumpTo(time,cc.p(500,100),height,1)
                            )//)
                            if(height > 50)
                                height -= 15
                            else
                                height -= 5
                            if(height <= 0){
                                removeTimer("stop")
                                item.stopAllActions()
                                item.setPositionY(100)
                            }
                        //}
                    }
                    call()
                    addTimer({
                        fun: call,
                        time: 0.45,
                        repeat: cc.REPEAT_FOREVER,
                        key:"stop",
                    })
                })
            ))
        }
        node.tool2_clickFun = function(){
            removeTimer("stop")
            node.qiu.stopAllActions()
            node.qiu.setPosition(500,100)
            node.xuxian.setPositionY(-200)
        }

        //单摆
        node.tool5Fun = function(item){
            var item = item
            var curRota = node.baidong.getRotation()
            var judge = true
            var calculate = 0
            var call = function(){
                judge = true
                curRota = -curRota
                if(calculate > 100){
                    node.baidong.setRotation(0)
                    removeTimer("stop")
                }
            }
            var baidong_call = function(){
                var curPos = node.baidong.getChildren()[0].getPosition()
                var curPos2 = node.baidong.convertToWorldSpace(curPos)
                item.setPosition(curPos2.x-435,curPos2.y)
                item.setRotation(-curRota)
                if(judge){
                    judge = false
                    calculate++
                    if(curRota < 0){
                        node.baidong.runAction(cc.sequence(
                            cc.rotateTo(0.35,curRota),
                            cc.delayTime(0.01),
                            cc.callFunc(function(){
                                curRota += 0.5
                                call()
                            })
                        ))
                    }else{
                        node.baidong.runAction(cc.sequence(
                            cc.rotateTo(0.35,curRota),
                            cc.delayTime(0.01),
                            cc.callFunc(function(){
                                curRota -= 0.5
                                call()
                            })
                        ))
                    }
                }
            }
            //baidong_call()
            addTimer({
                fun: baidong_call,
                time: 1/24,
                repeat: cc.REPEAT_FOREVER,
                key:"stop",
            })
        }
        //单摆复原到最初
        node.tool5_clickFun = function(){
            removeTimer("stop")
            node.baidong.stopAllActions()
            node.baidong.setRotation(0)
            node.baijian.setPosition(20,110)
            node.baijian.stopAllActions()
            node.baijian.setRotation(0)
        }

        //易拉罐
        node.tool8_clickFun = function(){
            node.tool8_guan.stopAllActions()
            node.tool8_red.stopAllActions()
            node.tool8_hand.setPosition(50,240)
            node.tool8_hand.setRotation(0)
            node.tool8_guan.setPosition(250,90)
            node.tool8_red.setPosition(250,160)
            node.tool8_hand.judge = true
            node.tool8_hand.noMove = false
        }
        node.tool8Fun = function(item){
            item.noMove = true
            item.runAction(cc.moveTo(0.4,140,160))
            node.tool8_guan.runAction(cc.sequence(
                cc.delayTime(0.4),
                cc.callFunc(function(){
                    node.tool8_red.runAction(cc.moveTo(2,680,160))
                    node.tool8_guan.runAction(cc.moveTo(2,680,90))
                    node.tool8_guan.runAction(cc.rotateBy(2,450))
                }),
                cc.delayTime(2.5),
                cc.callFunc(function(){
                    item.noMove = false
                    item.judge = false
                })
            ))
        }

        //小车复原到最初
        node.tool9_clickFun = function(){
            node.tool9_jiantou1.stopAllActions()
            node.tool9_tuo.stopAllActions()
            node.tool9_tuo.setSpriteFrame("tuo01.png")
            node.tool9_car.setPosition(175,100)
            node.tool9_tuo.setPosition(430,130)
            node.tool9_drawPot.setPosition(380,100)
        }
        node.tool9Fun = function(item,delta){
            item.x += delta.x
            if(delta.x > 0 && item.x >= item.delta && item.x < 790){
                node.tool9_tuo.x += delta.x
                node.tool9_car.x += delta.x
                item.delta = item.x
                if(node.tool9_car.carCount == 5)
                    node.tool9_car.carCount = 1
                node.tool9_car.setSpriteFrame(sprintf("car%02d.png", node.tool9_car.carCount))
                node.tool9_car.carCount++
            }
        }

        //木块和小车共用
        node.toolCommon = function(item,jiantou,tuo){
            item.noMove = true
            jiantou.stopAllActions()
            jiantou.setVisible(false)
            tuo.runAction(cc.sequence(
                ani("tuo%02d.png",7,0.07),
                cc.callFunc(function(){
                    item.noMove = false
                })
            )) 
        }

        //橡皮筋
        node.tool7Fun = function(item,delta){
            if (item.y > item.rootPos.y + limit) {
                item.y = item.rootPos.y + limit
            }
            if (item.y < item.rootPos.y - limit) {
                item.y = item.rootPos.y - limit
            }
            item.y += delta.y
            item.draw()
        }
        //橡皮筋复原到最初
        node.tool7_clickFun = function(){
            var draw = item_hand.drawNode
            var drawDot = item_hand.drawDot
            draw.clear()
            drawDot.clear()
            var leftPoint = draw.convertToNodeSpace(getWorldPos(node.item_left))
            var rightPoint = draw.convertToNodeSpace(getWorldPos(node.item_right))
            item_hand.drawNode.drawSegment(leftPoint, cc.p(0, 0), lineWidth, lineColor)
            item_hand.drawNode.drawSegment(rightPoint, cc.p(0, 0), lineWidth, lineColor)
            removeTimer("stop")
            node.hand1.setVisible(true)
            node.hand2.setVisible(true)
            drawDot.drawDot(cc.p(0,0), 5, cc.color(255,0,0,255))
        }

        item_hand.draw = function() {
            var hand = this
            if (!hand.drawNode) {
                var draw = new cc.DrawNode()
                safeAdd(node.add, draw)
                hand.drawNode = draw
                var drawDot = new cc.DrawNode()
                safeAdd(node.add, drawDot)
                hand.drawDot = drawDot
            }
            var draw = hand.drawNode
            var drawDot = hand.drawDot
            draw.clear()
            var leftPoint = draw.convertToNodeSpace(getWorldPos(node.item_left))
            var rightPoint = draw.convertToNodeSpace(getWorldPos(node.item_right))
            draw.drawSegment(leftPoint, cc.p(0, 0), lineWidth, lineColor)
            draw.drawSegment(rightPoint, cc.p(0, 0), lineWidth, lineColor)
            drawDot.drawDot(cc.p(0,0), 5, cc.color(255,0,0,255))
        }
        item_hand.back = function() {
            var hand = this
            var draw = hand.drawNode
            var drawDot = hand.drawDot
            var dis = Math.abs(hand.getPositionY() - hand.rootPos.y)
            var minus = 2.5
            hand.setPosition(hand.rootPos)
            var leftPoint = draw.convertToNodeSpace(getWorldPos(node.item_left))
            var rightPoint = draw.convertToNodeSpace(getWorldPos(node.item_right))
            var count = 0
            if (dis >= minus) {
                draw.clear()
                playEffect(res.tool7_sound2)//播放音频
            }
            addTimer({
                fun: function(key) {
                    draw.clear()
                    drawDot.clear()
                    if (dis == 0) {
                        stopEffect()
                        node.tool7_clickFun()
                        return
                    } else {
                        if (cc.sys.isNative) {
                            for (var i = -lineWidth / 2; i < lineWidth / 2; i++) {
                                var y = Math.pow(1 - 0.5, 2) * leftPoint.y + 2.0 * (1 - 0.5) * 0.5 * cc.p(0, (count % 2 ? dis : -dis) + i).y + 0.5 * 0.5 * rightPoint.y;
                                drawDot.drawDot(cc.p(0, y),5,cc.color(255,0,0,255))
                                draw.drawQuadBezier(cc.p(leftPoint.x, leftPoint.y + i),
                                    cc.p(0, (count % 2 ? dis : -dis) + i), cc.p(rightPoint.x, rightPoint.y + i), 50, 1, lineColor)
                            }
                        } else {
                            draw.drawQuadBezier(leftPoint, cc.p(0, count % 2 ? dis : -dis), rightPoint, 50, lineWidth * 2, lineColor)
                            var y = Math.pow(1 - 0.5, 2) * leftPoint.y + 2.0 * (1 - 0.5) * 0.5 * cc.p(0, count % 2 ? dis : -dis).y + 0.5 * 0.5 * rightPoint.y;
                            drawDot.drawDot(cc.p(0, y),5,cc.color(255,0,0,255))
                        }
                    }
                    count++
                    dis -= 2
                    if (dis <= 0) {
                        dis = 0
                    }
                },
                time: 1 / 24,
                repeat: cc.REPEAT_FOREVER,
                key:"stop",
            })
        }
        item_hand.draw()

        //钢尺复原到最初
        node.tool6_clickFun = function(){
            node.tool6.setPosition(250,100)
            node.tool6_hand.setPosition(750,370)
            node.tool6_hand.setVisible(true)
            item.isTouch = false
            ruler.setSpriteFrame("ruler_pos_01.png")
            ruler.setPosition(380,330)
        }
        //钢尺方法
        node.tool6Fun = function(item){
            if (!item.isTouch) {
                if (checkDistance(node.tool6_judge,item,30)) {
                    item.isTouch = true
                    item.setVisible(false)
                }
            } else {
                var devide = node.tool6_judge.y - (item.y+item.height/2)
                ruler.showInDevide(devide)
            }
        }
        ruler.curDevide = 0
        var devideList = [7,8,3,10,7,10,13,8,7]
        for (var i = 1; i < devideList.length; i++) {
            devideList[i] = devideList[i] + devideList[i - 1]
        }

        node.ruler.showInDevide = function(devide) {
            ruler.curDevide = devide
            var curIndex = null
            for (var i = 0; i < devideList.length; i++) {
                if (ruler.curDevide < devideList[i]) {
                    curIndex = i
                    break
                }
            }
            if (curIndex == null) {
                curIndex = devideList.length
            }
            ruler.setSpriteFrame(sprintf("ruler_pos_%02d.png", curIndex + 2))
            ruler.curIndex = curIndex
        }
        node.ruler.rever = function() {
            var ruler = this
            ruler.curDevide = 0
            if(devideList.length - ruler.curIndex == 9){//没有按动尺子
                ruler.setSpriteFrame("ruler_pos_01.png")
                ruler.setPosition(380,330)
                return
            }
            playEffect(res.tool7_sound1)
            ruler.setPosition(309,421)
            ruler.runAction(createAnimation({
                frame: "ruler_shake_%02d.png",
                start: 1,
                end: 12 - (devideList.length - ruler.curIndex) - 2,
                rever: true,
                fun: function() {
                    ruler.setSpriteFrame("ruler_pos_01.png")
                    stopEffect()
                    ruler.setPosition(380,330)
                },
                time: 1 / 24,
            }))
        }

        //木块方法

        //木块复原到最初
        node.tool1_clickFun = function(){
            node.jiantou1.stopAllActions()
            node.tuo.stopAllActions()
            node.tuo.setSpriteFrame("tuo01.png")
            node.mukuai.setPosition(180,100)
            node.tuo.setPosition(430,130)
            node.drawPot.setPosition(380,100)
        }

        //水轮方法
        node.tool3Fun = function(){
            node.lunzi.runAction(cc.repeatForever(cc.rotateBy(1.8, 360)))
            node.liushui.runAction(cc.repeatForever(cc.sequence(
                cc.scaleTo(0.05,1,0.7),
                cc.delayTime(0.1),
                cc.scaleTo(0.05,1,1),
                cc.delayTime(0.1)
            )))
            node.shuimian.runAction(cc.sequence(
                cc.moveTo(15,50,360),
                cc.callFunc(function(){
                    node.shuimian.runAction(cc.scaleTo(3,0.4,1))
                }),
                cc.moveTo(5,50,300),
                cc.callFunc(function(){
                    node.lunzi.stopAllActions()
                    node.liushui.stopAllActions()
                    node.liushui.runAction(cc.scaleTo(0.2,0,1))
                })
            ))
            node.caomian.runAction(cc.moveTo(20,-6,40))
        }
        //水轮复原到最初
        node.tool3_clikFun = function(){
            node.tool3_hand.setVisible(true)
            node.lunzi.stopAllActions()
            node.liushui.stopAllActions()
            node.liushui.setScale(1,0)
            node.shuimian.stopAllActions()
            node.shuimian.setPosition(50,500)
            node.shuimian.setScale(1)
            node.caomian.stopAllActions()
            node.caomian.setPosition(-6,20)
            node.tool3.setPosition(700,300)
        }

        //青蛙方法
        node.tool4Fun = function(){
            node.qingwa.noMove = true
            node.tool4_hand.setVisible(true)
            node.tool4_hand.runAction(cc.sequence(
                cc.delayTime(0.2),
                cc.moveTo(0.3,220,120),
                cc.callFunc(function(){
                    node.qingwa.setPosition(510,155)
                    node.qingwa.runAction(cc.sequence(
                        ani("qingwa%02d.png",10,0.15),
                        cc.callFunc(function(){
                            node.qingwa.setPosition(680,110)
                            node.qingwa.over = true
                            node.qingwa.noMove = false
                            node.qingwa.setSpriteFrame("qingwa.png")
                        })
                    ))
                }),
                cc.delayTime(0.2),
                cc.moveTo(0.4,200,280)
            ))
        }
        //青蛙复原到最初
        node.tool4_clickFun = function(){
            node.qingwa.noMove = false
            node.qingwaRenew()
        }

        //点击手或者青蛙，调用恢复到原来的位置
        node.qingwaRenew = function(){
            node.qingwa.stopAllActions()
            node.qingwa.setSpriteFrame("qingwa.png")
            node.tool4_hand.stopAllActions()
            node.qingwa.over = false
            node.tool4_hand.setPosition(230,170)
            node.tool4_hand.setVisible(false)
            node.qingwa.setPosition(350,100)
        }
        //青蛙中，手的触摸事件
        createTouchEvent({
            item:node.tool4_hand,
            begin:function(data){
                var item = data.item
                if(item.isVisible() && node.qingwa.over)
                    node.qingwaRenew()
                return true
            }
        })
        //易拉罐中的触摸事件
        var guanList = [node.tool8_guan,node.tool8_red]
        for(var i = 0 ; i < guanList.length ; i++){
            var item = guanList[i]
            createTouchEvent({
                item:item,
                begin:function(data){
                    var item = data.item 
                    if(!node.tool8_hand.judge){
                        node.tool8_clickFun()
                        return true
                    }
                    return false
                }
            })
        }   
    },

    initPeople : function(){
        var self = this
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        this.addList = [
            {key:"do_tip0",img:res.do_tip0,sound:res.do_sound0},
            {key:"do_tip1",img:res.do_tip1,sound:res.do_sound1},
            {key:"do_tip2",img:res.do_tip2,sound:res.do_sound2},
            {key:"do_tip3",img:res.do_tip3,sound:res.do_sound3},
            {key:"do_tip4",img:res.do_tip4,sound:res.do_sound4},
            {key:"do_tip5",img:res.do_tip5,sound:res.do_sound5},
            {key:"do_tip6",img:res.do_tip6,sound:res.do_sound6},
            {key:"do_tip7",img:res.do_tip7,sound:res.do_sound7},
            {key:"do_tip8",img:res.do_tip8,sound:res.do_sound8},
            {key:"do_tip9",img:res.do_tip9,sound:res.do_sound9},
        ]
        for (var i = 0 ; i < self.addList.length ; i++) {
            addContent({
                people: this.nodebs,
                key: self.addList[i].key,
                img: self.addList[i].img,
                sound: self.addList[i].sound,
            })
        }
    },
})