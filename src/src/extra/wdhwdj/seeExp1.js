var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "seeExp1", 
    preLayer: "seeLayer", 
    ctor: function() { 
        this._super()
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("see_plist")
        loadPlist("reqi_plist")
        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp 
        }

        self.nodebs.show(function(){
            self.nodebs.say({key:"see1_tip1"})
        })

        createSp("#seeZhuozi.png",cc.p(568,100),self)
        
        //小瓶子
        var cup = createSp("#seeCup1.png",cc.p(600,260),self)
        cup.shui1 = createSp("#shuimian.png",cc.p(75,130),cup)
        cup.shui1.setScaleY(-1)
        cup.shui2 = createSp("#shuimian.png",cc.p(75,118.2),cup)
        cup.shui1.setOpacity(200)
        cup.shui2.setOpacity(200)
        cup.cup = createSp("#seeCup2.png",cc.p(75,103),cup)
        var bottle = createSp("#seebottle.png",cc.p(300,200),self)
        bottle.gai = createSp("#gaizi.png",cc.p(21,137),bottle)
        bottle.yeti = createSp("#yeti.png",cc.p(21,9),bottle)
        bottle.yeti.setAnchorPoint(0.5,0)
        bottle.yeti.setScaleX(0.58)
        bottle.yeti.setScaleY(0.4)
        bottle.yeti.setOpacity(0)
        var xiguan = createSp("#xiguan.png",cc.p(500,80),self)
        xiguan.setRotation(80)

        var ani = function(start,end) {
            return cc.sequence(createAnimation({
                frame: "reqi%02d.png",
                start: start,
                end: end,
                time:0.1
            }))
        }
        var aniRever = function(start,end) {
            return cc.sequence(createAnimation({
                frame: "reqi%02d.png",
                start: start,
                end: end,
                time:0.1,
                rever:true,
            }))
        }

        //热气
        for(var i = 0 ; i < 3 ; i++){
            var hot = createSp("#reqi01.png",cc.p(560+i*40,390),self)
            hot.setScale(3,1.5)
            hot.runAction(cc.repeatForever(cc.sequence(
                ani(1+i*2,15-i*2),
                aniRever(1+i*2,15-i*2)
            )))
        }

        //大瓶子
        var layout = createLayout({
            pos:cc.p(850,200),
            size:cc.size(103,297),
            clip: true,
        })
        self.addChild(layout)
        var bigBottle = createSp("#bigBottle.png",cc.p(51,200),layout)
        var big = bigBottle
        big.setAnchorPoint(0.5,1)
        big.xiguan = createSp("#bigXiguan.png",cc.p(68,1020),big)
        big.yeti = createSp("#bigYeti.png",cc.p(68,28),big)
        big.gai = createSp("#bigGaizi.png",cc.p(68,446),big)
        big.yeti.setAnchorPoint(0.5,0)
        big.yeti.setScale(0.73,0.62)
        big.yeti.setOpacity(0)
        big.xiguan.setScale(1.3,1.2)
        big.gai = createSp("#seeKuang.png",cc.p(846,195),self)
        big.gai.setAnchorPoint(0,0)
        big.gai.setScale(1.05)

        //第一次放入瓶子判断
        bottle.first = true 
        //第二次
        bottle.second = false
        //可以从杯子中拿出
        bottle.canOut = false
        createTouchEvent({
            item:bottle,
            begin:function(data){
                var item = data.item
                if(!xiguan.over)    return false 

                //第一次从杯子中取出瓶子
                if(item.canOut){
                    item.canOut = false
                    item.runAction(cc.sequence(
                        cc.delayTime(0.3),
                        cc.callFunc(function(){
                            //液体下降
                            item.yeti.runAction(cc.sequence(
                                cc.scaleTo(3,0.58,0.43),
                                cc.delayTime(0.2),
                                cc.callFunc(function(){
                                    //回到桌面
                                    changeFather({item:item, father:self})
                                    item.setPosition(300,200)
                                    item.noMove = false
                                    //出现很多黑线，第一次调用,第二次不调用
                                    if(!item.second){
                                        item.runAction(cc.sequence(
                                            cc.delayTime(0.3),
                                            cc.callFunc(function(){
                                                for(var i = 1 ; i < 9 ; i++){
                                                    var posy = 145 + i * 16.5
                                                    var posy2 = 475 + i * 38.3
                                                    potFun(posy,posy2)
                                                }
                                            }),
                                            cc.delayTime(1),
                                            cc.callFunc(function(){
                                                //出现结论按钮，可继续拖动
                                                item.second = true
                                                var btn_result = new ccui.Button(res.btn_result_normal,res.btn_result_select)
                                                btn_result.setPosition(80,400)
                                                self.addChild(btn_result)
                                                btn_result.addClickEventListener(function(){
                                                    self.nodebs.say({key:"result"})
                                                })
                                            })
                                        ))
                                    }
                                })
                            ))
                            //大瓶子上升
                            big.runAction(cc.moveTo(3,51,200))
                            big.yeti.runAction(cc.scaleTo(3,0.73,0.62))

                            //水面下降
                            waterFun("down")
                        }),
                        cc.moveTo(1,74,260)
                    ))
                }

                return true 
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(!item.noMove){
                    item.x += delta.x 
                    item.y += delta.y
                    
                    if(checkdistans(cc.p(item.x,item.y-72), cc.p(cup.x,cup.y+100),80)){
                        item.noMove = true
                        changeFather({item:item, father:cup})
                        item.setPosition(74,260)   //cup.x,cup.y+180
                        safeAdd(cup, cup.shui2)
                        safeAdd(cup, cup.cup)
                        item.runAction(cc.sequence(
                            cc.delayTime(0.3),
                            cc.moveTo(1,74,100)
                        ))
                        //液体上升
                        bottle.yeti.runAction(cc.sequence(
                            cc.delayTime(0.6),
                            cc.callFunc(function(){
                                //水面上升
                                waterFun("up")
                                //大瓶子上升
                                big.runAction(cc.moveTo(1.3,51,-180))
                                big.yeti.runAction(cc.scaleTo(1.3,0.73,1.1))//475, 820
                            }),
                            cc.delayTime(0.4),
                            cc.scaleTo(1,0.58,0.9),
                            cc.callFunc(function(){
                                //创建黑点
                                if(item.first)
                                    potFun(294,820)
                            }),
                            cc.callFunc(function(){
                                //提示拿出瓶子
                                bottle.canOut = true
                                if(item.first){
                                    self.nodebs.say({key:"see1_tip3",force:true})
                                    item.first = false 
                                }
                            })
                        ))
                        
                    }
                }           
            },
            end:function(data){
                var item = data.item
                if(!item.noMove){
                    item.setPosition(300,200)
                }
            }
        })

        xiguan.over = false 
        createTouchEvent({
            item:xiguan,
            begin:function(data){
                var item = data.item
                var pos = data.pos
                if(item.over)
                    return false 
                item.setPosition(pos)
                item.setRotation(0)
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta 
                
                if(!item.over){
                    item.x += delta.x 
                    item.y += delta.y
                    if(checkdistans(cc.p(bottle.x,bottle.y+70),cc.p(item.x,item.y-100),50)){
                        item.over = true
                        item.removeListen()
                        changeFather({item:item,father:bottle})
                        item.setPosition(21,305)
                        safeAdd(bottle, bottle.yeti)
                        safeAdd(bottle, bottle.gai)
                        bottle.yeti.runAction(cc.fadeIn(0.8))
                        item.runAction(cc.sequence(
                            cc.delayTime(0.4),
                            cc.moveTo(0.7,21,170),
                            cc.callFunc(function(){
                                bottle.yeti.setScaleY(0.43)
                                //创建黑点
                                potFun(145,475)
                            }),
                            cc.delayTime(0.5),
                            cc.callFunc(function(){
                                //提示拖动瓶子到杯子中去
                                self.nodebs.say({key:"see1_tip2",force:true})
                            })
                        ))
                        //大瓶子
                        big.runAction(cc.sequence(
                            cc.delayTime(0.4),
                            cc.callFunc(function(){
                                big.yeti.runAction(cc.fadeIn(0.6))
                                big.xiguan.runAction(cc.moveTo(0.7,68,465))
                            }),
                            cc.moveTo(0.5,51,150)
                        ))
                    }
                }
            },
            end:function(data){
                var item = data.item
                if(!item.over){
                    item.setRotation(80)
                    item.setPosition(500,80)
                }
            }
        })

        //创建黑点
        var potFun = function(posy,posy2){
            var pot = createSp("#pot.png",cc.p(17.5,posy),bottle)
            pot.setAnchorPoint(0,0.5)
            pot.setScaleX(0)
            pot.runAction(cc.scaleTo(1,1,1))
            //bottle.potList.push(pot)

            var bigPot = createSp("#bigPot.png",cc.p(57,posy2),big)
            bigPot.setAnchorPoint(0,0.5)
            bigPot.setScale(0,1.2)
            bigPot.runAction(cc.scaleTo(1,1.25,1.2))
        }
        //杯中水面变化
        var waterFun = function(key){
            //130,118  145,133
            switch(key){
                case "up":
                    cup.shui1.runAction(cc.moveTo(0.4,75,145))
                    cup.shui2.runAction(cc.moveTo(0.38,75,133.3))
                break
                case "down":
                    cup.shui1.runAction(cc.moveTo(0.4,75,130))
                    cup.shui2.runAction(cc.moveTo(0.43,75,118.2))
                break
            }
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
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"see1_tip1",img:res.see1_tip1, sound:res.see1_sound1},
            {key:"see1_tip2",img:res.see1_tip2, sound:res.see1_sound2},
            {key:"see1_tip3",img:res.see1_tip3, sound:res.see1_sound3}
        ]
        this.addList = addList
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
            key: "result",
            sound: res.see1_sound4,
            img: res.see1_tip4,
            id:"result"
        })
    },
})