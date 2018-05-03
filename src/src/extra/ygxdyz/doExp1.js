var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        var self = this
        this.expCtor({
            setZ:999,
            settingData: {
                pos: cc.p(1080, 580),
                tubiaoFun: function() {
                    if(!self.tubiao){
                        self.tubiaofun()
                    }else{
                        if(self.tubiao.getScale() != 0){
                            self.tubiao.runAction(cc.sequence(
                                cc.scaleTo(0.3,0),
                                cc.callFunc(function(){
                                    //self.tubiao.setScale(0)
                                    self.tubiao.setPositionY(-600)
                                })
                            ))
                        }else{
                            if(self.bgg){
                                self.tubiao.setLocalZOrder(self.bgg.getLocalZOrder()+1)
                            }
                            self.tubiao.runAction(cc.sequence(
                                cc.callFunc(function(){
                                    self.tubiao.setPosition(568,320)
                                }),
                                cc.scaleTo(0.3,0.9)
                            ))
                        }
                    }
                },
                biaogeFun: function() {
                    if(!self.bgg) {
                        var bg = createBiaoge({
                            json: res.ygxdyz_tableNode_json,
                            scale: 0.9,
                            inputNum:9,
                        })
                        self.addChild(bg)
                        self.bgg = bg
                    }
                    var bg = self.bgg
                    bg.show()
                }
            }
        });
        //this.initPeople();
        this.initUI();
        
        return true;
    },

    tubiaofun: function(){
        var self = this
        var uiList = ["btn_close","btn_cancel","btn_clear","zhou_x","zhou_y","pen"]
        var node = loadNode(res.ygxdyz_tubiaoNode_json, uiList, "bg")
        self.addChild(node)
        node.setPosition(568,320)
        self.tubiao = node
        node.setScale(0)
        if(self.bgg){
            self.tubiao.setLocalZOrder(self.bgg.getLocalZOrder()+1)
        }
        self.tubiao.runAction(cc.scaleTo(0.4,0.9))
        node.btn_close.addClickEventListener(function(){
            self.tubiao.runAction(cc.sequence(
                cc.scaleTo(0.3,0),
                cc.callFunc(function(){
                    self.tubiao.setPositionY(-600)
                })
            ))
        })
        node.pen.setLocalZOrder(50)
        node.pen.setScale(1.4)
        var zhouList = [node.zhou_x,node.zhou_y]
        var drawX = null 
        var drawY = null
        var drawLine = null
        node.pen.jdgx = true
        node.pen.jdgy = true
        var judgeDraw = []
        createTouchEvent({
            item:node.pen,
            begin:function(data){
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta 
                item.x += delta.x 
                item.y += delta.y
            },
            end:function(data){
                var item = data.item //x:110  270
                var pox = 37
                for(var i = 0 ; i < 2 ; i++){
                    if(rectIntersectsRect(item,zhouList[i])){
                        if(i == 0 && item.jdgx){
                            item.jdgx = false
                            item.setPositionY(283)
                            drawX = new cc.DrawNode()
                            safeAdd(node, drawX)
                            item.tempPosx = cc.p(item.x-pox,item.y-10-34)
                            drawX.drawDot(cc.p(item.x-pox,item.y-10-34), 4, cc.color(255,0,0,255))
                            judgeFun(drawX,0)
                            judgeDraw[judgeDraw.length] = drawX
                        }else if(i == 1 && item.jdgy){
                            item.jdgy = false
                            item.setPositionX(120)
                            drawY = new cc.DrawNode()
                            safeAdd(node, drawY)
                            item.tempPosy = cc.p(item.x-pox,item.y-10-34)
                            drawY.drawDot(cc.p(item.x-pox,item.y-10-34), 4, cc.color(255,0,0,255))
                            judgeFun(drawY,1)
                            judgeDraw[judgeDraw.length] = drawY
                        }
                        if(!item.jdgx && !item.jdgy){
                            item.jdgx = true
                            item.jdgy = true
                            drawLine = new cc.DrawNode()
                            safeAdd(node, drawLine)
                            drawLine.drawSegment(item.tempPosx, item.tempPosy, 2, cc.color(255,0,0,255))
                            judgeFun(drawLine,2)
                            judgeDraw[judgeDraw.length] = drawLine
                        }
                    }
                }
            }
        })

        var judgeFun = function(draw,index){
            draw.isx = false
            draw.isy = false
            if(index == 0){
                draw.isx = true
                draw.jx = true
            }
            else if(index == 1){
                draw.isy = true
                draw.jy = true
            }
        }

        node.btn_cancel.addClickEventListener(function(){
            var i = judgeDraw.length-1
            if(judgeDraw[i]){
                if(judgeDraw[i].isx)
                    node.pen.jdgx = true
                else if(judgeDraw[i].isy)
                    node.pen.jdgy = true
                else{
                    node.pen.jdgx = false
                    node.pen.jdgy = false
                    if(judgeDraw[i-1].jx)
                        node.pen.jdgx = true
                    else if(judgeDraw[i-1].jy)
                        node.pen.jdgy = true
                    judgeDraw[i].removeFromParent()
                    judgeDraw[i] = null
                    judgeDraw.splice(i,1)
                    judgeDraw[i-1].removeFromParent()
                    judgeDraw[i-1] = null
                    judgeDraw.splice(i-1,1)
                    return
                }
                judgeDraw[i].removeFromParent()
                judgeDraw[i] = null
                judgeDraw.splice(i,1)
            }
        })

        node.btn_clear.addClickEventListener(function(){
            node.pen.jdgx = true
            node.pen.jdgy = true
            for(var i = judgeDraw.length-1 ; i >= 0 ; i--){
                if(judgeDraw[i]){
                    judgeDraw[i].removeFromParent()
                    judgeDraw[i] = null
                    judgeDraw.splice(i,1)
                }
            }
        })

        var rectIntersectsRect = function (ra, rb) {
            var ax = ra.x - ra.width/2-10
                ay = ra.y - ra.height/2-10
            //maxax = ra.x + ra.width/2,
                //maxay = ra.y + ra.height/2,
                maxbx = rb.x + rb.width/2,
                maxby = rb.y + rb.height/2;
            return !(ax < rb.x - rb.width/2 || 
                ax > maxbx || 
                ay < rb.y - rb.height/2 ||
                ay > maxby);
        }

        createTouchEvent({
            item:node,
            begin:function(data){
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta 
                item.x += delta.x 
                item.y += delta.y
            }
        })
    },

    initUI:function(){
        var uiList = [
            "sun","fen","shi","line_duan","line_zhong","line_chang",
            "btn_next","btn_again","ruler","rulerWz",
            "huaduan","huazhong","huachang",
        ]
        var self = this
        loadPlist("shadowLine_plist")
        loadPlist("hua_plist")
        var node = loadNode(res.ygxdyz_doExp1_json,uiList)
        self.inside_node.addChild(node)

        node.label = new cc.LabelTTF("1.将卷尺放到不同长度的影子中进行测量\n2.观察测量后影子的长度记录表格中\n3.点击下一时刻按钮,测量不同时刻的影长","",20)
        node.label.setPosition(210,50)
        node.addChild(node.label)
        node.label.setColor(cc.color(0,0,0))
        node.label.setLocalZOrder(1)

        var rulerFun = function(){
            node.ruler.runAction(cc.repeatForever(cc.sequence(
                cc.moveTo(1,1020,180),
                cc.moveTo(1,1020,160)
            )))
        }
        rulerFun()
        var huaList = [node.huaduan,node.huazhong,node.huachang]
        var huaAniList = ["huaduan%02d.png","huazhong%02d.png","huachang%02d.png",]
        for(var i = 0 ; i < 3 ; i++){
            huaList[i].index = i
        }
        var curIndex = 0
        var curLength = [70,50,20]
        var curFdj = [null,null,null]
        createTouchEvent({
            item:node.ruler,
            begin:function(data){
                if(!node.ruler.isVisible())  return false
                node.rulerWz.setVisible(false)
                node.ruler.stopAllActions()
                node.ruler.noMove = false
                return true
            },
            move:function(data){
                var item = data.item 
                var delta = data.delta
                if(!item.noMove){
                    item.x += delta.x 
                    item.y += delta.y
                }
                
            },
            end:function(data){
                var item = data.item
                var pos = data.pos
                for(var i = 0 ; i < 3 ; i++){
                    var hua = huaList[i]
                    if(!hua.isVisible() && !item.noMove && judgeInside({item:hua,pos:pos})){
                        item.noMove = true
                        hua.setVisible(true)
                        var curPos = 250 * i + 300
                        var num = curLength[curIndex] * (i + 1)
                        var count = i
                        hua.runAction(cc.sequence(
                            ani(huaAniList[i],curIndex*7+1,curIndex*7+7,0.2),
                            cc.delayTime(0.2),
                            cc.callFunc(function(){//创建放大镜
                                var fdj = createFDJ({
                                    pos:cc.p(curPos,250),
                                    num:num,
                                })
                                curFdj[count] = fdj
                            })
                        ))
                        node.ruler.setPosition(1020,160)
                        rulerFun()
                        node.rulerWz.setVisible(true)
                    }
                }
                if(!node.ruler.noMove){
                    node.ruler.setPosition(1020,160)
                    rulerFun()
                    node.rulerWz.setVisible(true)
                }
                
            }
        })

        node.btn_again.addClickEventListener(function(){
            curIndex = 0
            stopFun()
            node.btn_next.setTouchEnabled(true)
            node.btn_next.setOpacity(255)
            node.ruler.setVisible(true)
            node.rulerWz.setVisible(true)
            node.sun.setRotation(-60)
            node.shi.setRotation(-120)
            node.fen.setRotation(180)
            node.line_duan.runAction(ani("duan%02d.png",1,1,0.1))
            node.line_zhong.runAction(ani("zhong%02d.png",1,1,0.1))
            node.line_chang.runAction(ani("chang%02d.png",1,1,0.1))
            for(var i = 0 ; i < 3 ; i++){
                huaList[i].stopAllActions()
                if(curFdj[i]){
                    curFdj[i].removeAllChildren(true)
                    curFdj[i] = null
                }
            }

        })
        
        node.btn_next.addClickEventListener(function(){
            if(curIndex == 0){
                node.sun.setRotation(-60)
                action(1,-90,180,-50)
                node.line_duan.runAction(ani("duan%02d.png",1,6,0.2))
                node.line_zhong.runAction(ani("zhong%02d.png",1,6,0.2))
                node.line_chang.runAction(ani("chang%02d.png",1,6,0.2))
            }else{
                node.btn_next.setTouchEnabled(false)
                node.btn_next.setOpacity(150)
                node.fen.setRotation(0)
                action(2,-30,720,-15)
                node.line_duan.runAction(ani("duan%02d.png",7,18,0.2))
                node.line_zhong.runAction(ani("zhong%02d.png",7,19,0.2))
                node.line_chang.runAction(ani("chang%02d.png",7,18,0.2))
            }
            curIndex++
            for(var i = 0 ; i < 3 ; i++){
                if(curFdj[i]){
                    curFdj[i].removeAllChildren(true)
                    curFdj[i] = null
                }
            }
        })

        var action = function(time,shi,fen,sun){
            stopFun()
            node.shi.runAction(cc.rotateTo(time,shi))
            node.fen.runAction(cc.rotateBy(time,fen))
            node.sun.runAction(cc.rotateTo(time,sun))
        }

        var stopFun = function(){
            node.shi.stopAllActions()
            node.fen.stopAllActions()
            node.line_duan.stopAllActions()
            node.line_zhong.stopAllActions()
            node.line_chang.stopAllActions()
            node.sun.stopAllActions()
            node.huaduan.setVisible(false)
            node.huazhong.setVisible(false)
            node.huachang.setVisible(false)
        }


        var createFDJ = function(data){
            var pos = data.pos //y:250  300  550  800
            var _num = data.num
            var num = _num + Math.floor(Math.random() * 9)
            var node = new cc.Node()
            node.setPosition(pos)
            self.addChild(node)
            var bg = new cc.Sprite(res.fdjbg)
            var fdj = new cc.ClippingNode(bg)
            fdj.setPosition(0,0)
            fdj.setAlphaThreshold(0)
            fdj.bg = new cc.Sprite(res.fdjbg)
            fdj.bg.setPosition(0,0)
            fdj.addChild(fdj.bg)
            fdj.cz = new cc.Sprite(res.fdjcz)
            fdj.cz.setPosition(30,0)
            fdj.addChild(fdj.cz)
            fdj.sb = new cc.Sprite(res.fdjsb)
            fdj.sb.setPosition(-60,0)//-170  -200
            fdj.addChild(fdj.sb)  //95  y:45  137                
            fdj.rand = -170 + Math.random() * (-30)
            fdj.sb.runAction(cc.moveTo(0.8,fdj.rand,0))

            fdj.label = new cc.LabelTTF(num,"",15)
            fdj.label.setPosition(95,45)
            fdj.cz.addChild(fdj.label)
            fdj.label2 = new cc.LabelTTF(num-1,"",15)
            fdj.label2.setPosition(137,45)
            fdj.cz.addChild(fdj.label2)
            fdj.label.setColor(cc.color(255,0,0))
            fdj.label2.setColor(cc.color(0,0,0))
            
            node.addChild(fdj)
            fdj.bbg = new cc.Sprite(res.fdjbbg)
            fdj.bbg.setPosition(0,0)
            node.addChild(fdj.bbg)
            fdj.bbg.setScale(1.03)
            
            return node
        }


        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
            }))
        }

    }
})