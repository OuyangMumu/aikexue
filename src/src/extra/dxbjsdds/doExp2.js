var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp2", 
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
        loadPlist("do2_plist")

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        self.nodebs.show(function(){
            self.nodebs.say({key:"do2_tip1"})
        })
        var btn_result = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
        btn_result.setPosition(1000,400)
        self.addChild(btn_result)
        btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"result"})
        })

        var title = "用大杯子量水的多少"
        var title2 = new cc.LabelTTF(title,"",32)
        self.addChild(title2)
        title2.setPosition(180,480)

        var cupList = []
        cupList[0] = createSp("#do2_smallsb.png",cc.p(390,150),self)
        cupList[1] = createSp("#do2_smallsb.png",cc.p(580,150),self)
        // cupList[0].water = createSp("#do2_water.png",cc.p(85,12),cupList[0])
        // cupList[0].water.setScale(0.7)
        // cupList[1].water = createSp("#do2_water.png",cc.p(85,12),cupList[1])
        // cupList[1].water.setScale(0.7)
        var shaobei = createSp("#do2_shaobei.png",cc.p(200,150),self)
        var zhuixing = createSp("#do2_zhuixing.png",cc.p(800,190),self)
        var list = [shaobei,zhuixing]

        for(var i = 0 ; i < 2 ; i++){
            var sp = list[i]
            cupList[i].judge = true
            sp.noMove = false
            sp.index = i
            createTouchEvent({
                item:sp,
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
                    for(var i = 0 ; i < 2 ; i++){
                        var cup = cupList[i]
                        if(cup.judge && !item.noMove && rectIntersectsRect(item,cup)){
                            cup.judge = false 
                            item.noMove = true
                            if(item.index == 0){
                                var str = "烧杯中的水"
                                cup.str = new cc.LabelTTF(str,"",25)
                                cup.addChild(cup.str)
                                cup.str.setPosition(85,-30)
                                item.setPosition(cup.x+100,cup.y+130)
                                cup.runAction(cc.sequence(
                                    cc.delayTime(1),
                                    cc.callFunc(function(){
                                        cup.water = createSp("#do2_water.png",cc.p(85,12),cup)
                                        cup.water.setScale(0.7)
                                        cup.water.runAction(cc.moveTo(1.5,85,65))
                                    })
                                ))
                                item.runAction(cc.sequence(
                                    ani("do2_shaobei%02d.png",1,14,0.2),
                                    cc.callFunc(function(){
                                        item.setPositionY(-500)
                                    })
                                ))
                            }else{
                                var str = "锥形瓶中的水"
                                cup.str = new cc.LabelTTF(str,"",25)
                                cup.addChild(cup.str)
                                cup.str.setPosition(85,-30)
                                item.setPosition(cup.x+150,cup.y+200)
                                cup.runAction(cc.sequence(
                                    cc.delayTime(1),
                                    cc.callFunc(function(){
                                        cup.water = createSp("#do2_water.png",cc.p(85,12),cup)
                                        cup.water.setScale(0.7)
                                        cup.water.runAction(cc.moveTo(1.5,85,90))
                                    })
                                ))
                                item.runAction(cc.sequence(
                                    ani("do2_zhuixing%02d.png",1,14,0.2),
                                    cc.callFunc(function(){
                                        item.setPositionY(-500)
                                    })
                                ))
                            }
                            break
                        }
                    }
                    
                }
            })
        }

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
            key: "do2_tip1",
            img: res.do_tip2,
            sound: res.do_sound2,
        })
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.do_tip5,
            sound: res.do_sound5,
            id: "result"
        })
    },
})