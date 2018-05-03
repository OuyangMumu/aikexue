//var LOCAL_ORDER = 100
var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "seeExp1",
    preLayer: "seeLayer",
    ctor: function () {
        this._super();
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        self.nodebs.show(function(){
            self.nodebs.say({key:"see_tip1"})
        })
        loadPlist("see_Plist")
        var btn_data = new ccui.Button("res/btn/btn_tips_normal.png","res/btn/btn_tips_select.png")
        btn_data.setPosition(100,450)
        self.addChild(btn_data)
        var btn_phe = new ccui.Button("res/btn/btn_result_normal.png","res/btn/btn_result_select.png")
        btn_phe.setPosition(100,350)
        self.addChild(btn_phe)
        btn_phe.setVisible(false)

        
        btn_phe.addClickEventListener(function(){
            if(btn_phe.isVisible())
                self.nodebs.say({key:"see_phe"})
        })

        var timeTip = new cc.Sprite("#30fen.png")
        timeTip.setPosition(550,350)
        self.addChild(timeTip)
        timeTip.setOpacity(0)
        //醋的杯子
        var cbei = new cc.Sprite("#bei.png")
        cbei.setPosition(300,120)
        self.addChild(cbei)
        //石灰水的杯子
        var sbei = new cc.Sprite("#bei.png")
        sbei.setPosition(780,120)
        self.addChild(sbei)
        //花
        var gan = new cc.Sprite("#huagan.png")
        gan.setPosition(540,100)
        self.addChild(gan)
        gan.setAnchorPoint(0.5,0)

        var cbei2 = new cc.Sprite("#bei2.png")
        cbei2.setPosition(73,65)
        cbei.addChild(cbei2)
        cbei2.cu = new cc.Sprite("#cu.png")
        cbei2.cu.setPosition(74,77)
        cbei2.addChild(cbei2.cu)
        
        var sbei2 = new cc.Sprite("#bei2.png")
        sbei2.setPosition(73,65)
        sbei.addChild(sbei2)
        sbei2.shs = new cc.Sprite("#shs.png")
        sbei2.shs.setPosition(74,77)
        sbei2.addChild(sbei2.shs)
        
        var hua = new cc.Sprite("#hua.png")
        hua.setPosition(35,300)
        gan.addChild(hua)
        var hua2 = new cc.Sprite("#hua.png")
        hua2.setPosition(35,300)
        gan.addChild(hua2)
        hua2.setOpacity(0)

        var huaList = [gan,hua]
        var canMove = true
        cbei.canBei = true  //能放入杯子中
        sbei.canBei = true
        hua2.change = true
        gan.isOver = false
        gan.once = true
        var pos = 0
        var curCount = 0 //判断放入了几次进杯子中
        for (var i = 0 ; i < 2 ; i++) {
            huaList[i].index = i
            createTouchEvent({
                item:huaList[i],
                begin:function(){
                    return true
                },
                move:function(data){
                    var item = data.item
                    var index = item.index
                    var delta = data.delta

                    //可以从被子中取出来
                    if(gan.isOver){
                        gan.isOver = false
                        gan.runAction(cc.sequence(
                            cc.moveTo(0.4,73,180),
                            cc.callFunc(function(){
                                canMove = true
                                pos = gan.getParent().convertToWorldSpace(gan.getPosition())
                                safeAdd(self,gan)
                                gan.setPosition(pos)
                                gan.once = true
                            })
                        ))
                    }

                    if(!cbei.canBei && gan.once && checkDistance(gan,cbei)){
                        canMove = false
                        gan.once = false
                        safeAdd(cbei,gan)
                        safeAdd(cbei,cbei2)
                        gan.setPosition(73,150)
                        gan.runAction(cc.sequence(
                            cc.moveTo(0.4,73,15),
                            cc.delayTime(0.5),
                            cc.callFunc(function(){
                                gan.isOver = true
                            })
                        ))
                    }

                    if(!sbei.canBei && gan.once && checkDistance(gan,sbei)){
                        canMove = false
                        gan.once = false
                        safeAdd(sbei,gan)
                        safeAdd(sbei,sbei2)
                        gan.setPosition(73,150)
                        gan.runAction(cc.sequence(
                            cc.moveTo(0.4,73,15),
                            cc.delayTime(0.5),
                            cc.callFunc(function(){
                                gan.isOver = true
                            })
                        ))
                    }

                    if(cbei.canBei && checkDistance(gan,cbei)){
                        canMove = false
                        cbei.canBei = false
                        sbei.canBei = true
                        safeAdd(cbei,gan)
                        safeAdd(cbei,cbei2)
                        gan.setPosition(73,150)
                        gan.runAction(cc.sequence(
                            cc.moveTo(0.4,73,15),
                            cc.callFunc(function(){
                                if(hua2.change){
                                    hua2.setSpriteFrame("hong.png")
                                    hua2.runAction(cc.fadeIn(5))
                                    hua.runAction(cc.fadeOut(5))
                                    hua2.change = false
                                }else{
                                    hua.setSpriteFrame("hong.png")
                                    hua.runAction(cc.fadeIn(5))
                                    hua2.runAction(cc.fadeOut(5))
                                    hua2.change = true
                                }
                                timeTip.setSpriteFrame("30fen.png")
                                timeTip.runAction(cc.sequence(
                                    cc.delayTime(1.5),
                                    cc.fadeIn(0.2),
                                    cc.delayTime(3),
                                    cc.fadeOut(1)
                                ))
                            }),
                            cc.delayTime(5.2),
                            //cc.moveTo(0.4,73,160),
                            cc.callFunc(function(){
                                //canMove = true
                                // pos = gan.getParent().convertToWorldSpace(gan.getPosition())
                                // safeAdd(self,gan)
                                // gan.setPosition(pos)
                                gan.isOver = true
                                judgeCount()
                            })
                        ))
                    }

                    if(sbei.canBei && checkDistance(gan,sbei)){
                        canMove = false
                        sbei.canBei = false
                        cbei.canBei = true
                        safeAdd(sbei,gan)
                        safeAdd(sbei,sbei2)
                        gan.setPosition(73,150)
                        gan.runAction(cc.sequence(
                            cc.moveTo(0.4,73,15),
                            cc.callFunc(function(){
                                if(hua2.change){
                                    hua2.setSpriteFrame("lan.png")
                                    hua2.runAction(cc.fadeIn(6))
                                    hua.runAction(cc.fadeOut(6))
                                    hua2.change = false
                                }else{
                                    hua.setSpriteFrame("lan.png")
                                    hua.runAction(cc.fadeIn(6))
                                    hua2.runAction(cc.fadeOut(6))
                                    hua2.change = true
                                }
                                timeTip.setSpriteFrame("40fen.png")
                                timeTip.runAction(cc.sequence(
                                    cc.delayTime(1.5),
                                    cc.fadeIn(0.2),
                                    cc.delayTime(4),
                                    cc.fadeOut(1)
                                )) 
                            }),
                            cc.delayTime(6.2),
                            //cc.moveTo(0.4,73,160),
                            cc.callFunc(function(){
                                gan.isOver = true
                                //canMove = true
                                // pos = gan.getParent().convertToWorldSpace(gan.getPosition())
                                // safeAdd(self,gan)
                                // gan.setPosition(pos)
                                judgeCount()
                            })
                        ))
                    }

                    if(canMove){
                        if(index == 1){
                            gan.x += delta.x
                            gan.y += delta.y
                        }else{
                            item.x += delta.x
                            item.y += delta.y
                        }
                    }
                },
                end:function(data){
                    var item = data.item
                    var index = item.index
                }
            })
        }

        var judgeCount = function(){
            curCount++
            if(curCount == 1){
                self.nodebs.say({key:"see_tip2",force:true})
            }else if(curCount == 2){
                btn_phe.setVisible(true)
            }
        }

        var checkDistance = function(r1,r2){
            var dx = r1.x - r2.x
            var dy = r1.y - r2.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 40)
                return true
            else
                return false
        }

        btn_data.addClickEventListener(function(){
            var tmpthis = self
            if(!tmpthis.tip1){
                var tip1 = createResult({
                    img:res.see_data,
                    offbg:cc.p(10,30),
                    offset:cc.p(20,20),
                    btnfun:function(){
                        addShowType({
                            item: tmpthis.tip1,
                            show: "zoom",
                            time: 0.3,
                            fun: function() {
                                tmpthis.tip1.setPosition(getMiddle())
                                removeMoving(tmpthis.tip1)
                            }
                        })
                    }
                })
                tip1.setScale(0)
                tip1.setPosition(getMiddle())
                tip1.setLocalZOrder(LOCAL_ORDER++)
                tip1.changeSelfLocalZero = function(){
                    this.setLocalZOrder(LOCAL_ORDER++)
                }
                tmpthis.tip1 = tip1
                tmpthis.addChild(tmpthis.tip1)
            }
            if(tmpthis.tip1.getScale()==1){
                addShowType({
                    item:tmpthis.tip1,
                    show:"zoom",
                    time:0.3,
                    fun:function(){
                        tmpthis.tip1.setPosition(getMiddle())
                        removeMoving(tmpthis.tip1)
                        //tmpthis.nodebs.stopSay()
                    }
                })
                
            }else{
                tmpthis.tip1.stopAllActions()
                addShowType({
                    item:tmpthis.tip1,
                    show:"scale",
                    time:0.3,
                    fun:function(){
                        tmpthis.tip1.setLocalZOrder(LOCAL_ORDER++)
                        addMoving(tmpthis.tip1)
                        //tmpthis.nodebs.stopSay()
                    }
                })
                
            }
        })
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"see_tip1",img:res.see_tip1,sound:res.see_sound1},
            {key:"see_tip2",img:res.see_tip2,sound:res.see_sound2},
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
        addContent({
            people: this.nodebs,
            key: "see_phe",
            img: res.see_phe,
            sound: res.see_phe_sound,
            id:"result"
        })
    },

    buyongde:function(){
        // hua.canMove = true
        // hua.haveCu = false
        // hua.haveShs = false
        // hua.canEnd = true //用来控制可进入杯子
        // var canMove = true
        // cbei.h = cbei.height/2
        // cbei.w = cbei.width/2
        // cbei.endY = 40  //最低移到底部的位置
                    //         var temp = cc.p(gan.x + delta.x, gan.y + delta.y)
                    // //在上部，可以任意移动
                    // if(temp.y > cbei.y+cbei.h && temp.x > cbei.x-cbei.w){
                    //     canMove = true
                    // }
                    // //大于左边 小于右边 在中部
                    // else if(temp.x > cbei.x-cbei.w && temp.x < cbei.x+cbei.w-5 && temp.y > cbei.endY && temp.y < cbei.y+cbei.h){
                    //     canMove = true //在左边杯子，不能往下移动
                        
                    //     cc.log("33333333333333")
                    // }else if(temp.x > cbei.x+cbei.w+5 && temp.x+gan.width/2 < sbei.x-cbei.w && temp.y > cbei.endY && temp.y < cbei.y+cbei.h){
                    //     canMove = true //在两个杯子的中间
                    //     cc.log("4444444444444")
                    // }else{
                    //     canMove = false
                    //     cc.log("55555555555555555")
                    //     return
                    // }
                    // if(canMove){
                    //     cc.log("666666666666666666")
                    //     if(hua.canMove){
                    //         if(index == 1){
                    //             gan.x = temp.x
                    //             gan.y = temp.y
                    //         }else{
                    //             item.x = temp.x
                    //             item.y = temp.y
                    //         }
                    //     }
                    // }
    }
})