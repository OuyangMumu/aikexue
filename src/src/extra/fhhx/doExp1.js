var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true;
    },

    initUI: function () {
        var self = this
        self.createTool()
    },

    createTool: function() {
        loadPlist("shouqi_plist")
        loadPlist("zhuangfang_plist")
        loadPlist("chuiqi_plist")
        var self = this
        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
        })
        var createSp = function (sprite,pos) {
            var sp = new cc.Sprite(sprite)
            sp.setPosition(pos)
            self.addChild(sp)
            return sp
        }
        var createSp2 = function(sprite,pos,father){
            var sp = new cc.Sprite(sprite)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }
        createSp(res.tip_do1title, cc.p(600,600))
        //水槽
        var shuicao = createSp(res.waterBox,cc.p(650,150))
        //水面
        var shuimian = createSp(res.shuimian,cc.p(650,230))
        shuimian.setScale(-1.2,2)
        //槽外框
        var caokuang = createSp(res.shuiwai, cc.p(652,147))
        var bottle_xi = true  
        var firstBottle = null //第一个瓶子和第二个瓶子
        var secondBottle = null
        var toolbtn = createTool({
            pos: cc.p(300, 510),
            nums: 5,
            scale:0.75,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.7),
            itempos: cc.p(0, -10),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:false,
            father: self,
            counts: [2, 2, 1, 1, 1],
            swallow: [true, true, true, true, true],
            files: [res.tools_1, res.tools_2, res.tools_3, res.tools_4, res.tools_5],
            gets: [res.bottle,res.glass,res.xiguan,res.label_xi,res.label_hu],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                if(index == 2){//提示对话框
                    if(!secondBottle){
                        createDialog(res.dialog_1)
                        return false
                    }else if(!secondBottle.xiguan){
                        createDialog(res.dialog_2)
                        return false
                    }
                    item.setRotation(45)
                }
                if(index == 0){
                    if(bottle_xi){
                        bottle_xi = false
                        item.shou = true
                        item.galss = false
                        item.xiguan = false
                        item.label = false
                        item.first = true
                        item.next = false
                        firstBottle = item
                    }else{
                        if(!firstBottle.next){
                            createDialog(res.dialog_1)
                            return false
                        }
                        item.shou = false //需要删掉，测试用
                        item.first = false
                        item.cao = true
                        item.glass = false
                        item.label = false
                        secondBottle = item
                        cc.log(secondBottle.glass)
                    }
                }
                return item
            },
            clickfun : function(data){
                var index = data.index
                var item = data.sp
                if(item.noMove)
                    return false
                return true
            },
            movefun:function(data){
                var item = data.sp 
                var index = data.index 
                var delta = data.delta
                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                }
                //玻璃片
                if(index == 1){
                    if(secondBottle){//第二个瓶子可以用玻璃片盖住
                        if(rectIntersectsRect(item, secondBottle) && secondBottle.glass){
                            item.noMove = true
                            secondBottle.glass = false 
                            item.setPosition(650,330)
                            var hand1 = createSp2(res.hand1,cc.p(-22,39),item)
                            var hand2 = createSp2(res.hand2,cc.p(-34,46),item)
                            hand1.setLocalZOrder(-1)
                            hand1.setScaleX(-1)
                            hand2.setScaleX(-1)
                            reAdd(caokuang)
                            item.runAction(cc.sequence(
                                cc.moveTo(0.8,650,120),
                                cc.delayTime(0.3),
                                cc.callFunc(function(){
                                    //item.setLocalZOrder(secondBottle.getLocalZOrder()-1)
                                    safeAdd(secondBottle, item)
                                    item.setPosition(65,5)
                                    secondBottle.runAction(cc.moveTo(0.8,670,380))
                                }),
                                cc.delayTime(0.3),
                                cc.callFunc(function(){
                                    secondBottle.runAction(cc.moveTo(0.5,650,220))
                                    secondBottle.runAction(cc.rotateTo(0.5,180))
                                }),
                                cc.delayTime(0.8),
                                cc.callFunc(function(){
                                    secondBottle.setTexture(res.bottle)
                                    secondBottle.setRotation(0)
                                    item.setPosition(70,170)
                                    item.removeAllChildren(true)
                                    secondBottle.noMove = false
                                    secondBottle.label = true
                                    shuicao.setPositionY(-600)
                                    shuimian.setPositionY(-600)
                                    caokuang.setPositionY(-600)
                                    //提示放标签
                                })
                            ))
                        }
                    }
                    if(firstBottle){
                        if(rectIntersectsRect(item,firstBottle) && firstBottle.glass){
                            var bottle = firstBottle
                            bottle.glass = false
                            item.noMove = true
                            item.setPosition(bottle.x+150,bottle.y+200)
                            createSp2(res.hand1,cc.p(180,36),item).setLocalZOrder(-1)
                            createSp2(res.hand2,cc.p(191,43),item)
                            item.runAction(cc.sequence(
                                cc.moveTo(0.8,bottle.x+14,bottle.y+80),
                                cc.delayTime(0.2),
                                cc.callFunc(function(){
                                    item.removeAllChildren(true)
                                    item.setPosition(70,170)
                                    safeAdd(bottle, item)
                                    bottle.label = true 
                                })
                            ))
                        }
                    }
                }
                //贴标签
                if(index == 3){
                    if(firstBottle){
                        if(rectIntersectsRect(item,firstBottle) && firstBottle.label){
                            var bottle = toolbtn.getindex(0)[0]
                            item.setPosition(35,80)
                            item.noMove = true
                            safeAdd(bottle, item)
                            firstBottle.next = true
                            self.nodebs.say({key:"do1_tip3",force:true})
                        }
                    }
                }
                //贴标签
                if(index == 4){
                    if(secondBottle){
                        if(rectIntersectsRect(item,secondBottle) && secondBottle.label){
                            secondBottle.label = false
                            item.setPosition(35,80)
                            item.noMove = true
                            safeAdd(secondBottle, item)
                            firstBottle.noMove = true
                            firstBottle.runAction(cc.moveTo(0.3,400,200))
                            secondBottle.noMove = true
                            secondBottle.runAction(cc.moveTo(0.3,600,200))
                            createSp(res.tip_over, cc.p(700,370))
                            //提示实验完成
                        }
                    }
                }
                //集气瓶放入水槽中
                if(index == 0 && !item.first){
                    if(rectIntersectsRect(item,shuicao) && item.cao){
                        item.cao = false 
                        item.noMove = true
                        item.setSpriteFrame("zhuangshui00.png")
                        item.setPosition(item.x-20,item.y-10)
                        item.setRotation(-60)
                        reAdd(caokuang)
                        item.runAction(cc.sequence(
                            cc.delayTime(0.3),
                            cc.callFunc(function(){
                                item.setPosition(600,360)
                                item.runAction(cc.rotateTo(0.6,0))
                            }),
                            cc.moveTo(0.8,600,140),
                            cc.callFunc(function(){
                                shuimian.runAction(cc.moveTo(2.5,650,200))
                            }),
                            ani_qiti("zhuangshui%02d.png",1,11,0.25),
                            cc.rotateTo(0.5, 120),
                            cc.callFunc(function(){
                                item.setRotation(0)
                                item.setSpriteFrame("fangshui01.png")
                            }),
                            cc.moveTo(0.3,670,200),
                            cc.callFunc(function(){
                                //提示说话放吸管
                                item.xiguan = true
                                self.nodebs.say({key:"do1_tip4",force:true})
                            })
                        ))
                    }
                }
                //吸管
                if(index == 2){
                    if(!item.noMove & rectIntersectsRect(item,secondBottle)){
                        item.noMove = true
                        item.setPosition(740,220)
                        var child = createSp("#chuiqi01.png",cc.p(934,342))
                        child.runAction(cc.sequence(
                            cc.delayTime(1),
                            cc.callFunc(function(){
                                secondBottle.runAction(cc.sequence(
                                    cc.delayTime(1),
                                    ani_qiti("fangshui%02d.png",1, 6, 0.2),
                                    cc.delayTime(2),
                                    ani_qiti("fangshui%02d.png",7, 15, 0.2),
                                    cc.delayTime(2),
                                    ani_qiti("fangshui%02d.png",16, 22, 0.2)
                                ))
                                shuimian.runAction(cc.sequence(
                                    cc.delayTime(1.3),
                                    cc.moveTo(1.5, 650, 210),
                                    cc.delayTime(2.3),
                                    cc.moveTo(1.5, 650, 230)
                                ))
                            }),
                            ani_qiti("chuiqi%02d.png", 1,10, 0.2),
                            cc.delayTime(1),
                            ani_qiti("chuiqi%02d.png", 1,10, 0.2),
                            cc.delayTime(1),
                            ani_qiti("chuiqi%02d.png", 1,10, 0.2),
                            cc.delayTime(1),
                            cc.callFunc(function(){
                                item.setPositionY(-600)
                                child.setPositionY(-600)
                                secondBottle.glass = true
                                //提示拖出玻璃片
                                self.nodebs.say({key:"do1_tip5",force:true})
                            })
                        ))
                    }
                }
            },
            outfun:function(data){
                var item = data.sp 
                var index = data.index 
                if(index == 0){
                    //判断是第一个瓶子还是第二个瓶子
                    if(item.first){
                        if(item.shou){
                            item.noMove = true
                            item.runAction(cc.sequence(
                                cc.moveTo(0.1,270,200),
                                cc.callFunc(function(){
                                    item.setPosition(item.x-96,item.y-18)
                                }),
                                ani_bottle("shouqi%02d.png",1,16,0.2),
                                cc.callFunc(function(){
                                    item.setPosition(item.x+96,item.y+18)
                                    item.shou = false
                                    item.glass = true
                                    item.noMove = false
                                    self.nodebs.say({key:"do1_tip2",force:true})
                                })
                            ))
                        }
                    }
                }
            },
            backfun:function(data){
                var item = data.sp
                var index = data.index
                if(index != 0 && !item.noMove)
                    return true
                return false
            }
        })
        self.inside_node.addChild(toolbtn,1)
        toolbtn.show()

        var ani_bottle = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
                origin:true,
            }))
        }
        var ani_qiti = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
            }))
        }

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

        var createDialog = function(img){
            AddDialog("Tips", {
                res: img,
                face: 2,
                confirmBtn:true,
            })
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,999)
        var addList = [
            {key:"do1_tip1",img:res.do1_tip1,sound:res.do1_sound1},
            {key:"do1_tip2",img:res.do1_tip2,sound:res.do1_sound2},
            {key:"do1_tip3",img:res.do1_tip3,sound:res.do1_sound3},
            {key:"do1_tip4",img:res.do1_tip4,sound:res.do1_sound4},
            {key:"do1_tip5",img:res.do1_tip5,sound:res.do1_sound5},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
    },
})