var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp3", 
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
        var uiList = [
            "gan","cup1","water1","cup2","water2","jiantou","wenzi","shaobei","zhuixing"
        ]
        var node = loadNode(res.dxbjsdds_doExp3_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"do3_tip1"})
        })

        var btn_result = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
        btn_result.setPosition(1000,400)
        self.addChild(btn_result)
        btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"result"})
        })

        var title = "用简易天平“量”水的多少"
        var title2 = new cc.LabelTTF(title,"",32)
        self.addChild(title2)
        title2.setPosition(200,490)

        node.cup1.setLocalZOrder(-1)
        node.cup2.setLocalZOrder(-1)
        node.cup1.water = node.water2 
        node.cup2.water = node.water1 
        var cupList = [node.cup1,node.cup2]

        var judge = true
        var list = [node.shaobei,node.zhuixing]
        for(var i = 0 ; i< 2 ; i++){
            var sp = list[i]
            sp.noMove = false  
            sp.index = i
            sp.num = 60 + 20 * i
            cupList[i].judge = true
            cupList[i].index = i
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
                    if(!judge)      return false
                    for(var i = 0 ; i < 2 ; i++){
                        var cup = cupList[i]
                        if(cup.judge && !item.noMove && rectIntersectsRect(item,cup)){
                            judge = false
                            cup.judge = false 
                            item.noMove = true
                            cup.pos = cup.convertToWorldSpace(cup.getParent().getPosition())
                            cup.water.runAction(cc.sequence(
                                cc.delayTime(1),
                                cc.callFunc(function(){
                                    cup.water.setVisible(true)
                                    cup.water.runAction(cc.scaleTo(1,1.1,1))
                                    //判断倾斜方向
                                    if(item.index == 1){
                                        if(cup.index == 1){
                                            node.gan.setRotation(-10)
                                        }else{
                                            node.gan.setRotation(10)
                                        }
                                    }else{
                                        if(cup.index == 0 && cupList[1].judge){
                                            node.gan.setRotation(10)
                                        }else if(cup.index == 1 && cupList[0].judge){
                                            node.gan.setRotation(-10)
                                        }
                                    }
                                }),
                                cc.moveTo(1,cup.water.x,item.num)
                            ))
                            if(item.index == 0){
                                item.setPosition(cup.pos.x+100,cup.pos.y+70)
                                item.runAction(cc.sequence(
                                    ani("do2_shaobei%02d.png",1,14,0.2),
                                    cc.callFunc(function(){
                                        item.setPositionY(-500)
                                        judge = true
                                    })
                                ))
                            }else{
                                item.setPosition(cup.pos.x+140,cup.pos.y+120)
                                item.runAction(cc.sequence(
                                    ani("do2_zhuixing%02d.png",1,14,0.2),
                                    cc.callFunc(function(){
                                        item.setPositionY(-500)
                                        judge = true
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
            rb.pos = rb.convertToWorldSpace(rb.getParent().getPosition())
            var maxax = ra.x + ra.width/2,
                maxay = ra.y + ra.height/2,
                maxbx = rb.pos.x + rb.width/2,
                maxby = rb.pos.y + rb.height/2;
            return !(maxax < rb.pos.x - rb.width/2 || 
                maxbx < ra.x - ra.width/2 || 
                maxay < rb.pos.y - rb.height/2 ||
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
            key: "do3_tip1",
            img: res.do_tip3,
            sound: res.do_sound3,
        })
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.do_tip6,
            sound: res.do_sound6,
            id: "result"
        })
    },
})