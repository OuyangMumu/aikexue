var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        var self = this
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        var uiList = ["qiqiuR","qiqiuG","maojin","dian1_1","dian1_2",
                    "dian2_1","dian2_2","line1","henggan","tip1","do2Click","tip3"]
        var node = loadNode(res.jdxx_doExp2_json,uiList)
        self.inside_node.addChild(node)

        self.nodebs.show()

        var label = new cc.LabelTTF("1.点击挂起气球，将气球挂在铁架上\n2.用毛巾分别摩擦气球\n3.观察气球的现象", "", 22)
        label.setPosition(800,560)
        self.inside_node.addChild(label,1)

        var judgeTip = [false,false,false]
        var jiantouFun = function(item,pos1,pos2){
            item.runAction(cc.repeatForever(cc.sequence(
                cc.delayTime(0.1),
                cc.moveTo(0.4,pos2),
                cc.delayTime(0.1),
                cc.moveTo(0.4,pos1)
            )))
        }
        jiantouFun(node.tip1.getChildren()[0], cc.p(130,70), cc.p(115,50))
        //jiantouFun(node.tip1.getChildren()[1], cc.p(190,60), cc.p(200,80))
        var createSp = function(res,pos,father){
            var sp = new cc.Sprite(res)
            sp.setPosition(pos)
            father.addChild(sp)
            sp.setVisible(false)
            return sp
        }
        var qiqiuG = node.qiqiuG
        qiqiuG.h1 = createSp(res.handup, cc.p(0,50), qiqiuG)
        qiqiuG.h1.setLocalZOrder(-1)
        qiqiuG.h2 = createSp(res.handdown, cc.p(5,45), qiqiuG)
        var qiqiuR = node.qiqiuR
        qiqiuR.h1 = createSp(res.handup, cc.p(140,60), qiqiuR)
        qiqiuR.h1.setLocalZOrder(-1)
        qiqiuR.h1.setScaleX(-1)
        qiqiuR.h2 = createSp(res.handdown, cc.p(136,52), qiqiuR)
        qiqiuR.h2.setScaleX(-1)


        node.maojin.rub1 = false //判断是否可摩擦
        node.maojin.rub2 = false
        var line1_qiqiu = false //判断线上是否有气球
        node.dian1_2.canRoto = true  //判断是否可旋转
        var line2_qiqiu = false 
        node.dian2_2.canRoto = true
        var potList = [node.dian1_1,node.dian1_2,node.dian2_1,node.dian2_2]

        createTouchEvent({
            item:node.do2Click,
            begin:function(data){
                var item = data.item 
                if(!item.isVisible())
                    return false
                item.setVisible(false)
                //绑第一个气球
                safeAdd(potList[0], node.qiqiuG)
                node.qiqiuG.setPosition(8,20)
                safeAdd(potList[1], potList[0])
                potList[0].setPosition(-140, 105)

                //绑第二个气球
                safeAdd(potList[2], node.qiqiuR)
                node.qiqiuR.setPosition(8,20)
                safeAdd(potList[3], potList[2])
                potList[2].setPosition(-138, 104)

                //第一个绑架子
                potList[1].setPosition(300,490)
                potList[1].setRotation(-120)

                //第二个绑架子
                potList[3].setPosition(450,490)
                potList[3].setRotation(-120)
                node.maojin.rub1 = true
                node.maojin.rub2 = true

                node.tip1.getChildren()[0].stopAllActions()
                node.tip1.setVisible(false)

                node.judgeTipFun()
                return true
            }
        })

        

        var midPos = cc.p(0,0)
        var lineDis = 50
        var changePos = function(pot1,pot2){
            lineDis = Math.sqrt(Math.pow((pot1.x-pot2.x),2) + Math.pow(pot1.y-pot2.y,2))
            midPos.x = Math.abs(pot1.x - pot2.x) / 2
            midPos.y = Math.abs(pot1.y - pot2.y) / 2
            if(pot1.y > pot2.y){
                if(pot1.x < pot2.x){//上左半部分
                    if(pot2.x - pot1.x < 20 || pot1.y - pot2.y < 20){
                        //drawSeg(pot1, pot2)
                        drawFun(pot1.getPosition(),cc.p(pot2.x-midPos.x-20 ,pot2.y-midPos.y-10),pot2.getPosition())
                    }else{
                        cc.log(pot.y-2*(100-lineDis))
                        drawFun(pot1.getPosition(),cc.p(pot1.x +2/3*(pot2.x-pot1.x),pot.y-2*(100-lineDis)),pot2.getPosition())
                    }
                }else{//上右半部分
                    if(pot1.x - pot2.x < 20 || pot1.y - pot2.y < 20){
                        //drawSeg(pot1, pot2)
                        cc.log("111111111111")
                        drawFun(pot1.getPosition(),cc.p(pot2.x+midPos.x+20,pot2.y-midPos.y+10),pot2.getPosition())
                    }else{
                        drawFun(pot1.getPosition(),cc.p(pot2.x+midPos.x,pot2.y-midPos.y),pot2.getPosition())
                    }
                }
            }else{
                //下面部分，直线
                drawSeg(pot1, pot2)    
            }
        }

        // for(var i = 0 ; i < 4 ; i++){
        //     var pot = potList[i]
        //     pot.index = i
        //     createTouchEvent({
        //         item:pot,
        //         begin:function(data){
        //             return true 
        //         },
        //         move:function(data){
        //             var item = data.item 
        //             var delta = data.delta
        //             var index = item.index
        //             item.x += delta.x 
        //             item.y += delta.y

        //             //绳子
        //             // if(index == 0){
        //             //     changePos(item,potList[1])
        //             // }

        //             //var stop = function(){
        //                 switch(index){
        //                     case 0://绑第一个气球
        //                     autoMoveFun(potList[1], delta)
        //                     if(!line1_qiqiu && checkdistans(item,node.qiqiuG,30)){
        //                         line1_qiqiu = true
        //                         safeAdd(item, node.qiqiuG)
        //                         node.qiqiuG.setPosition(8,20)
        //                         safeAdd(potList[1], item)
        //                         item.setPosition(-140, 105)
        //                         item.removeListen()
        //                         judgeTipFun()
        //                     }
        //                     break
        //                     case 1://绑第一个架子
        //                     if(line1_qiqiu){
        //                         if(rectIntersectsRect(item, node.henggan)){
        //                             item.setPosition(300,490)
        //                             item.setRotation(-120)
        //                             item.removeListen()
        //                             node.maojin.rub1 = true
        //                             judgeTipFun()
        //                         }
        //                         item.myRota = item.getRotationX() - 1
        //                         if(delta.y > 0 && item.canRoto){
        //                             item.setRotation(item.myRota)
        //                             if(item.getRotation() <= -120){
        //                                 item.canRoto = false
        //                                 item.setRotation(-120)
        //                             }
        //                         }
        //                     }else{
        //                         autoMoveFun(potList[0], delta)
        //                     }
        //                     break
        //                     case 2://绑第二个气球
        //                     autoMoveFun(potList[3], delta)
        //                     if(!line2_qiqiu && checkdistans(item,node.qiqiuR,30)){
        //                         line2_qiqiu = true
        //                         safeAdd(item, node.qiqiuR)
        //                         node.qiqiuR.setPosition(8,20)
        //                         safeAdd(potList[3], item)
        //                         item.setPosition(-138, 104)
        //                         item.removeListen()
        //                         node.maojin.rub2 = true
        //                         judgeTipFun()
        //                     }
        //                     break
        //                     case 3://绑第二个架子
        //                     if(line2_qiqiu){
        //                         item.myRota = item.getRotationX() - 1
        //                         if(delta.y > 0 && item.canRoto){
        //                             item.setRotation(item.myRota)
        //                             if(item.getRotation() <= -120){
        //                                 item.canRoto = false
        //                                 item.setRotation(-120)
        //                             }
        //                         }
        //                         if(rectIntersectsRect(item, node.henggan)){
        //                             item.setPosition(450,490)
        //                             item.setRotation(-120)
        //                             item.removeListen()
        //                             judgeTipFun()
        //                         }
        //                     }else{
        //                         autoMoveFun(potList[2], delta)
        //                     }
        //                     break
        //                 }
        //             //}
        //         },
        //         end:function(data){
        //         }
        //     })
        // }

        node.judgeTipFun = function(){
            // if(line1_qiqiu && line2_qiqiu && !judgeTip[1]){
            //     cc.log("111111111111")
            //     judgeTip[1] = true
            //     node.tip1.setPositionY(-300)
            // }else if((line1_qiqiu || line2_qiqiu) && !judgeTip[0]){
            //     cc.log("0000000000000")
            //     judgeTip[0] = true
            //     jiantouFun(node.tip2.getChildren()[0], cc.p(80,60), cc.p(70,80))
            //     node.tip2.setVisible(true)
            //     self.nodebs.say({key:"do2_tip2",force:true})
            // }else if(node.maojin.rub1 && node.maojin.rub2 && !judgeTip[2]){
            //     cc.log("22222222222")
                //judgeTip[2] = true
                self.nodebs.say({key:"do2_tip3",force:true})
                //node.tip2.setPositionY(-300)
                node.tip3.setVisible(true)
                jiantouFun(node.tip3.getChildren()[0], cc.p(60,-20), cc.p(40,-30))
                jiantouFun(node.tip3.getChildren()[1], cc.p(210,-20), cc.p(210,-40))
            //}
        }

        var maojin = node.maojin
        maojin.count1 = 0
        maojin.count2 = 0
        node.maojin.change = false 
        createTouchEvent({
            item:node.maojin,
            begin:function(data){
                return true
            },
            move:function(data){
                var item = data.item 
                var delta = data.delta 
                item.x += delta.x 
                item.y += delta.y
                if(!item.rub1 || !item.rub2)
                    return 
                if(checkdistans(item,cc.p(240,230),100)){
                    item.change = true
                    item.setTexture(res.maojin2)
                    qiqiuG.h1.setVisible(true)
                    qiqiuG.h2.setVisible(true)
                    qiqiuR.h1.setVisible(false)
                    qiqiuR.h2.setVisible(false)
                    node.dian1_2.setRotation(-110)
                    node.dian2_2.setRotation(-120)
                    item.count1+= Math.abs(delta.y)
                }else if(checkdistans(item,cc.p(500,230),100)){
                    item.setTexture(res.maojin2)
                    item.setScaleX(-1)
                    qiqiuR.h1.setVisible(true)
                    qiqiuR.h2.setVisible(true)
                    qiqiuG.h1.setVisible(false)
                    qiqiuG.h2.setVisible(false)
                    node.dian2_2.setRotation(-130)
                    node.dian1_2.setRotation(-120)
                    item.count2+= Math.abs(delta.y)
                }else{
                    item.change = false 
                    item.setScaleX(1)
                    item.setTexture(res.maojin)
                }
            },
            end:function(data){
                var item = data.item 
                item.setPosition(760,260)
                if(!item.rub1 || !item.rub2)
                    return 
                item.setTexture(res.maojin)
                qiqiuFun()
                if(item.count1 > 400 && item.count2 > 400){
                    item.removeListen()
                    node.tip3.setPositionY(-300)
                    node.dian1_2.runAction(cc.rotateTo(0.1,-110))
                    node.dian2_2.runAction(cc.rotateTo(0.1,-130))
                }
            }
        })

        var qiqiuFun = function(){
            qiqiuG.h1.setVisible(false)
            qiqiuG.h2.setVisible(false)
            qiqiuR.h1.setVisible(false)
            qiqiuR.h2.setVisible(false)
            node.dian1_2.setRotation(-120)
            node.dian2_2.setRotation(-120)
        }

        var autoMoveFun = function(sp,delta){
            sp.x += delta.x 
            sp.y += delta.y
        }

        var checkdistans = function(ra,rb,dis){
            var dx =  ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis){
                return true
            }else
                return false
        }

        var rectIntersectsRect = function (ra, rb) {
            var maxax = ra.x + ra.width,
                maxay = ra.y + ra.height,
                maxbx = rb.x + rb.width/2,
                maxby = rb.y + rb.height/2;
            return !(maxax < rb.x-rb.width/2 || maxbx < ra.x || maxay < rb.y-rb.height/2 || maxby < ra.y);
        }



        // var vertices = this._cacheArray;
        // vertices.length =0;

        // var t = 0.0;
        // for (var i = 0; i < segments; i++) {
        //     var x = Math.pow(1 - t, 2) * origin.x + 2.0 * (1 - t) * t * control.x + t * t * destination.x;
        //     var y = Math.pow(1 - t, 2) * origin.y + 2.0 * (1 - t) * t * control.y + t * t * destination.y;
        //     vertices.push(cc.p(x, y));
        //     t += 1.0 / segments;
        // }
        // vertices.push(cc.p(destination.x, destination.y));

        // this.drawPoly(vertices, segments + 1, false, false);

        // var draw1 = new cc.DrawNode()
        // self.addChild(draw1)
        // draw1.drawQuadBezier(node.dian1_1.getPosition(),cc.p(610,50),node.dian1_2.getPosition(),
        //     60,2,cc.color(255,251,245,255))
        // var drawFun = function(pot1,pot2,pot3){
        //     if(draw1)
        //         draw1.removeFromParent(true)
        //     draw1 = new cc.DrawNode()
        //     self.addChild(draw1)
        //     draw1.drawQuadBezier(pot1,pot2,pot3,60,2,cc.color(255,251,245,255))
        // }
        // var drawSeg = function(pot1,pot2){
        //     if(draw1)
        //         draw1.removeFromParent(true)
        //     draw1 = new cc.DrawNode()
        //     self.addChild(draw1)
        //     draw1.drawSegment(pot1.getPosition(), pot2.getPosition(), 2, cc.color(255,251,245,255))
        // }

    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1030, 120)
        })
        this.addChild(this.nodebs,99)
        
        var addList = [
            //{key:"do2_tip1",sound:res.do2_sound1},
            //{key:"do2_tip2",sound:res.do2_sound2},
            {key:"do2_tip3",sound:res.do2_sound3},
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                sound: addList[i].sound,
            })
        }
    },
})