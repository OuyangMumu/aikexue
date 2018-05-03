var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super()
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("do1_plist")
        loadPlist("do1_shaobei_plist")
        loadPlist("do1_zhuixing_plist")
        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
        })
        var btn_result = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
        btn_result.setPosition(1000,400)
        self.addChild(btn_result)
        btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"result"})
        })

        var title = "用小杯子量水的多少"
        var title2 = new cc.LabelTTF(title,"",32)
        self.addChild(title2)
        title2.setPosition(180,480)

        var str = "锥形瓶倒水次数：\n烧杯倒水次数："
        var label = new cc.LabelTTF(str,"",30)
        self.addChild(label)
        label.setPosition(150,350)

        label.sb = new cc.LabelTTF("0","",30)
        self.addChild(label.sb)
        label.sb.setPosition(280,330)

        label.zx = new cc.LabelTTF("0","",30)
        self.addChild(label.zx)
        label.zx.setPosition(280,365)
        label.sbNum = 0
        label.zxNum = 0

        var tank = createSp("#boligang.png",cc.p(400,150),self)
        tank.water = createSp("#shuimian.png",cc.p(150,30),tank)
        tank.water.setVisible(false)
        var cup = createSp("#do1_smallSb.png",cc.p(700,120),self)
        cup.setScale(0.9)
        cup.water = createSp("#do1_water.png",cc.p(74,12),cup)
        cup.water.setVisible(false)
        cup.judge = true
        var toolbtn = createTool({
            pos: cc.p(360, 550),
            nums: 2,
            scale:0.8,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -15),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [1, 1],
            swallow: [true, true],
            files: [res.do_tools1, res.do_tools2],
            gets: ["#do1_shaobei.png","#do1_zhuiping.png"],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                var index = data.index
                if(index == 0){
                    item.water = createSp("#do1_water.png",cc.p(87,43),item)
                    item.water.setScaleX(1.2)
                }else{
                    item.water = createSp("#do1_water.png",cc.p(75,40),item)
                    item.water.setScaleX(1.4)
                }
                return item
            },
            clickfun: function(data){
                var index = data.index
                var item = data.sp
                var pos = data.pos

                return true 
            },
            movefun: function(data){
                var index = data.index
                var item = data.sp
                var delta = data.delta
                
                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                }
            },
            outfun: function(data){
                var index = data.index
                var item = data.sp
                if(item.over)
                    return false
                if(index == 0){
                    if(cup.judge && !cup.noMove && rectIntersectsRect(cup,item)){
                        cup.judge = false
                        cup.noMove = true 
                        item.noMove = true
                        item.water.setVisible(false)
                        item.setPosition(cup.x+100,cup.y+120)
                        if(label.sbNum == 0){
                            item.frame = "shaobei1_%02d.png"
                        }else{
                            item.frame = "shaobei2_%02d.png"
                        }
                        cup.water.runAction(cc.sequence(
                            cc.delayTime(1.5),
                            cc.callFunc(function(){
                                cup.water.setVisible(true)
                            }),
                            cc.moveTo(1,74,57)
                        ))
                        item.runAction(cc.sequence(
                            ani(item.frame,1,12,0.2),
                            cc.callFunc(function(){
                                item.noMove = false 
                                cup.noMove = false
                                item.setSpriteFrame("do1_shaobei.png")
                                if(label.sbNum == 0){
                                    item.water.setVisible(true)
                                    item.water.setPositionY(30)
                                }else
                                    item.over = true
                                label.sbNum++  
                            })
                        ))
                    }
                }else{
                    if(cup.judge && !cup.noMove && rectIntersectsRect(cup,item)){
                        cup.judge = false
                        cup.noMove = true 
                        item.noMove = true
                        item.water.setVisible(false)
                        item.setPosition(cup.x+100,cup.y+120)
                        if(label.zxNum == 0){
                            item.frame = "zhuixing1_%02d.png"
                        }else if(label.zxNum == 1){
                            item.frame = "zhuixing2_%02d.png"
                        }else{
                            item.frame = "zhuixing3_%02d.png"
                        }
                        item.setScale(1.4)
                        cup.water.runAction(cc.sequence(
                            cc.delayTime(1.5),
                            cc.callFunc(function(){
                                cup.water.setVisible(true)
                            }),
                            cc.moveTo(1,74,57)
                        ))
                        item.runAction(cc.sequence(
                            ani(item.frame,1,10,0.25),
                            cc.callFunc(function(){
                                item.noMove = false 
                                cup.noMove = false
                                item.setScale(1)
                                item.setPositionX(item.x + 50)
                                item.setSpriteFrame("do1_zhuiping.png")
                                if(label.zxNum == 0){
                                    item.water.setVisible(true)
                                    item.water.setPositionY(30)
                                }else if(label.zxNum == 1){
                                    item.water.setVisible(true)
                                    item.water.setPositionY(20)
                                }else
                                    item.over = true
                                label.zxNum++  
                            })
                        ))
                    }
                }
            },
            backfun:function(data){
                return false
            }
        })

        self.inside_node.addChild(toolbtn,1)
        self.toolbtn = toolbtn
        toolbtn.show()

        createTouchEvent({
            item: cup,
            begin:function(data){
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
                if(!item.judge && rectIntersectsRect(item,tank)){
                    item.noMove = true
                    item.judge = true
                    item.runAction(cc.sequence(
                        cc.moveTo(0.3,565,255),
                        cc.callFunc(function(){
                            item.setScale(1.45)
                            item.water.setVisible(false)
                            item.water.setPositionY(12)
                            tank.water.runAction(cc.sequence(
                                cc.delayTime(1),
                                cc.callFunc(function(){
                                    tank.water.setVisible(true)
                                }),
                                cc.moveTo(1,150,tank.water.y+10)
                            ))
                        }),
                        ani("cup%02d.png",1,13,0.2),
                        cc.moveTo(0.5,700,120),
                        cc.callFunc(function(){
                            label.sb.setString(label.sbNum)
                            label.zx.setString(label.zxNum)
                            item.setScale(0.9)
                            item.noMove = false
                            item.setSpriteFrame("do1_smallSb.png")
                        })
                    ))
                }
            }
        })

        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time
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
    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        
        addContent({
            people: this.nodebs,
            key: "do1_tip1",
            img: res.do_tip1,
            sound: res.do_sound1,
        })
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.do_tip4,
            sound: res.do_sound4,
            id: "result"
        })
    },
})