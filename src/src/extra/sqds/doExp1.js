var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super();
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }
        loadPlist("do1_plist")
        loadPlist("do1_daoshui_plist")
        loadPlist("liushui1_plist")
        loadPlist("liushui2_plist")
        createSp(res.zhuozi,cc.p(568,140),self)

        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
        })

        var cup = createSp("#do1_cup.png",cc.p(280,270),self)
        cup.kou1 = createSp("#kou.png",cc.p(78,172),cup)
        cup.kou2 = createSp("#kou.png",cc.p(78,111),cup)
        cup.kou3 = createSp("#kou.png",cc.p(78,50),cup)
        cup.kou1.setVisible(false)
        cup.kou2.setVisible(false)
        cup.kou3.setVisible(false)
        cup.kouList = [cup.kou1,cup.kou2,cup.kou3]

        var cao = createSp("#do1_cao.png",cc.p(520,120),self)
        var hand1 = createSp("#do1_hand1.png",cc.p(450,280),self)
        hand1.setScale(1.3)

        var shaobei = createSp("#do1_shaobei.png",cc.p(730,250),self)

        var tietiao = null

        //烧杯倒水
        shaobei.noMove = true
        createTouchEvent({
            item:shaobei,
            begin:function(data){
                var item = data.item
                var pos = data.pos
                if(item.noMove)
                    return false
                if(judgeOpInPos({item:item,pos:pos}))
                    return true
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(!item.noMove){
                    item.x += delta.x 
                    item.y += delta.y
                }

                if(rectIntersectsRect(item,cup) && !item.noMove){
                    item.noMove = true
                    item.runAction(cc.sequence(
                        cc.moveTo(0.2,390,450),
                        cc.callFunc(function(){
                            cup.water = createSp("#do1_shuimian.png",cc.p(40,15),cup)
                            cup.water.setScaleY(0.5)
                            cup.water.setVisible(false)
                            cup.water.runAction(cc.sequence(
                                cc.delayTime(0.8),
                                cc.callFunc(function(){
                                    cup.water.setVisible(true)
                                }),
                                cc.moveTo(1.2,40,206)
                            ))
                        }),
                        ani("do1_daoshui%02d.png",1,12,0.2),
                        cc.callFunc(function(){
                            item.setPosition(730,250)
                            //设置可撕开贴条
                            tietiao.hand1.setVisible(true)
                            tietiao.hand1.setPosition(160,80)
                            tietiao.hand1.setRotation(0)
                            tietiao.hand1.setScaleX(1)
                            tietiao.hand1.noMove = false
                            changeFather({father:self,item:tietiao.hand1})
                            //提示说话
                            self.nodebs.say({key:"do1_tip3",force:true})
                        })
                    ))
                }
            }
        })
        
        //钉子移动
        var count = 0
        var judge = false
        createTouchEvent({
            item:hand1,
            begin:function(){
                hand1.noMove = false
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta

                if(!item.noMove && item.x + delta.x < 490 && item.x + delta.x > 390){
                    item.x += delta.x
                    if(item.x < 396){
                        judge = true
                        if(count < 3)
                            cup.kouList[count].setVisible(true)
                    }
                    if(judge && item.x > 405){
                        count++
                        judge = false
                        if(count == 1){
                            item.y = 220
                        }else if(count == 2){
                            item.y = 159
                        }else{
                            item.noMove = true
                            item.y = -300

                            //开始贴纸
                            tietiao = createSp("#tietiao.png",cc.p(450,250),self)
                            tietiao.hand1 = createSp("#do1_hand2.png",cc.p(-9,200),tietiao)
                            tietiao.hand1.setScaleX(-1)
                            tietiao.hand1.setRotation(107)
                            tietiao.hand2 = createSp("#do1_hand2.png",cc.p(-9,-40),tietiao)
                            tietiao.hand2.setRotation(72)

                            //用于撕开贴条的手 方法
                            item.noMove = true
                            createTouchEvent({
                                item:tietiao.hand1,
                                begin:function(data){
                                    var item = data.item
                                    if(item.noMove)
                                        return false
                                    return true
                                },
                                move:function(data){
                                    var item = data.item
                                    var delta = data.delta
                                    item.x += delta.x 
                                    item.y += delta.y
                                    if(rectIntersectsRect(item,tietiao) && !item.noMove){
                                        item.noMove = true
                                        item.setPositionY(-300)
                                        tietiao.setPositionY(-400)
                                        cup.setPositionY(-500)
                                        var liushui = createSp("#liushui01.png",cc.p(375,284),self)
                                        liushui.setScale(1.25)
                                        liushui.runAction(ani("liushui%02d.png",1,76,0.2))

                                        //两个结论显示,最终
                                        var btn_result1 = new ccui.Button(res.btn_result1,res.result2)
                                        btn_result1.setPosition(1000,460)
                                        self.addChild(btn_result1)
                                        var btn_result2 = new ccui.Button(res.btn_result3,res.result4)
                                        btn_result2.setPosition(1000,350)
                                        self.addChild(btn_result2)
                                        btn_result1.addClickEventListener(function(){
                                            self.nodebs.say({key:"result"})
                                        })
                                        btn_result2.addClickEventListener(function(){
                                            self.nodebs.say({key:"do1_tip5",force:true})
                                            self.answerImg.show()
                                        })
                                    }
                                }
                            })
                            tietiao.runAction(cc.sequence(
                                cc.moveTo(0.5,317,250),
                                cc.delayTime(0.2),
                                cc.callFunc(function(){
                                    tietiao.hand1.setVisible(false)
                                    tietiao.hand2.setVisible(false)
                                    //提示倒水
                                    shaobei.noMove = false
                                    shaobei.setSpriteFrame("do1_daoshui01.png")
                                    self.nodebs.say({key:"do1_tip2",force:true})
                                })
                            ))
                        }
                    }
                }
            }
        })


        var  rectIntersectsRect = function (ra, rb) {
            var maxax = ra.x + ra.width/2,
                maxay = ra.y + ra.height/2,
                maxbx = rb.x + rb.width/2,
                maxby = rb.y + rb.height/2;
            return !(maxax < rb.x - rb.width/2 || 
                maxbx < ra.x - ra.width/2 || 
                maxay < rb.y - rb.height/2 ||
                maxby < ra.y - ra.height/2/2);
        }

        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time
            }))
        }
    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)

        var addList = [
            {key:"do1_tip1",img: res.do1_tip1,sound:res.do1_sound1},
            {key:"do1_tip2",img: res.do1_tip2,sound:res.do1_sound2},
            {key:"do1_tip3",img: res.do1_tip3,sound:res.do1_sound3},
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
            key: "do1_tip5",
            sound: res.do1_sound5,
        })
        
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.do1_tip4,
            sound: res.do1_sound4,
            id: "result",
        })
        this.answerImg = createShowImg({
            img:res.do1_tip5,
        })
        safeAdd(this, this.answerImg)
    },
})