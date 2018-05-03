var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp2", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super()
        var self = this
        this.expCtor({
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    if (!self.bgg) {
                        var bg = createBiaoge({
                            json: res.sqds_tableNode_json,
                            scale: 0.9,
                            inputNum: 6,
                        })
                        self.addChild(bg)
                        self.bgg = bg
                   }
                   var bg = self.bgg
                   bg.show()
                }
            }
        })
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        var uiList = [
            "bigsb","bigsb2","shaobei","shaobei2","hand","pini","niezi",
            "fama1","fama2","fama3","fuli"
        ]
        var zhuozi = new cc.Sprite(res.zhuozi)
        zhuozi.setPosition(568,140)
        self.inside_node.addChild(zhuozi)

        var node = loadNode(res.sqds_doExp2_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"do2_tip1"})
        })

        var famaList = [node.fama1,node.fama2,node.fama3]

        loadPlist("fuli_plist")

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }
        //镊子
        node.niezi.noMove = true 
        node.niezi.num = 0
        createTouchEvent({
            item:node.niezi,
            begin:function(data){
                var item = data.item
                if(item.noMove)
                    return false
                if(!item.first){
                    item.first = true 
                    item.setSpriteFrame("niezi2.png")
                }
                safeAdd(self,item)
                item.judge = true
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta 
                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y

                    if(!item.judge && checkdistans2(node.bigsb,item,50)){
                        item.judge = true 
                        item.noMove = true
                        item.fama.judge = true 
                        item.setPosition(node.bigsb.x+100,node.bigsb.y+230)
                        if(item.num == 0){
                            item.posy = node.bigsb.y+75
                            item.sby = node.shaobei.y-15
                            item.start = 5
                        }else if(item.num == 1){
                            item.posy = node.bigsb.y+60
                            item.sby = node.shaobei.y-10
                            item.start = 8
                        }else{
                            item.posy = node.bigsb.y+50
                            item.sby = node.shaobei.y-5
                            item.start = 11
                        }
                        item.num++
                        item.runAction(cc.sequence(
                            cc.moveTo(0.8,node.bigsb.x+100,item.posy),
                            cc.callFunc(function(){
                                changeFather({father:node.shaobei,item:item.fama})
                                item.fama.setPositionX(item.fama.x - 20 + item.num * 15)
                                node.shaobei.runAction(cc.moveTo(0.3,node.shaobei.x,item.sby))
                                node.fuli.runAction(ani("fuli%02d.png",item.start,item.start+3,0.2))
                            }),
                            cc.moveTo(0.3,node.bigsb.x+110,node.bigsb.y+230),
                            cc.callFunc(function(){
                                if(item.num == 1){
                                    self.nodebs.say({key:"do2_tip3",force:true})
                                }else if(item.num == 2){
                                    self.nodebs.say({key:"do2_tip4",force:true})
                                }else if(item.num == 3){
                                    node.shaobei.runAction(cc.moveTo(0.4,node.shaobei.x,105))
                                    node.fuli.runAction(cc.sequence(
                                        ani("fuli%02d.png",13,22,0.15),
                                        cc.callFunc(function(){
                                            //说话
                                            self.nodebs.say({key:"do2_tip5",force:true})
                                            var wenzi = createSp("#do2_wenzi.png",cc.p(700,450),self)
                                        })
                                    ))
                                }
                                item.noMove = false
                            })
                        ))
                    }

                    for(var i = 0 ; i < 3 ; i++){
                       var fama = famaList[i]
                        if(item.judge && !fama.judge && checkdistans(fama,item,20)){
                            item.judge = false
                            item.famaPos = fama.getPosition() 
                            safeAdd(item,fama)
                            fama.setPosition(9,-10)
                            item.fama = fama
                            break
                        }
                    }
                }
            },
            end:function(data){
                var item = data.item
                if(!item.judge){
                    if(!item.fama.judge){
                        safeAdd(self,item.fama)
                        item.fama.setPosition(item.famaPos)
                        item.judge = true 
                        item.fama = null
                    }
                }
            }
        })
        //橡皮泥和手
        node.hand.noMove = false
        createTouchEvent({
            item:node.hand,
            begin:function(data){
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta 
                if(!item.noMove){
                    item.x += delta.x 
                    item.y += delta.y
                    if(rectIntersectsRect(item,node.shaobei) && !item.noMove){
                        item.noMove = true
                        item.setPosition(node.shaobei.x+10,node.shaobei.y+140)
                        changeFather({father:node.shaobei,item:item})
                        safeAdd(node.shaobei,node.shaobei2)
                        item.runAction(cc.sequence(
                            cc.moveTo(1,80,78),
                            cc.callFunc(function(){
                                changeFather({father:node.shaobei,item:node.pini})
                                node.pini.setSpriteFrame("pini2.png")
                            }),
                            cc.moveTo(1,80,230),
                            cc.callFunc(function(){
                                item.setPositionY(-1000)
                                //将小烧杯放入大烧杯中
                                node.shaobei.hand = createSp("#do2_hand2.png",cc.p(80,180),node.shaobei)
                                node.shaobei.runAction(cc.sequence(
                                    cc.delayTime(0.2),
                                    cc.moveTo(1,node.bigsb.x+10,node.bigsb.y+220),
                                    cc.delayTime(0.1),
                                    cc.moveTo(0.8,node.bigsb.x+10,node.bigsb.y+20),
                                    cc.callFunc(function(){
                                        node.fuli.runAction(ani("fuli%02d.png",1,5,0.1))
                                        changeFather({father:node.bigsb,item:node.shaobei})
                                        safeAdd(node.bigsb,node.bigsb2)
                                        node.shaobei.hand.runAction(cc.sequence(
                                            cc.moveTo(0.5,80,300),
                                            cc.callFunc(function(){
                                                node.shaobei.hand.setPositionY(-1000)
                                                //提示说话
                                                node.niezi.noMove = false
                                                self.nodebs.say({key:"do2_tip2",force:true})
                                            })
                                        ))
                                    })
                                ))
                            })
                        ))
                    }
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

        var checkdistans = function(ra,rb,dis){
            var dx =  ra.x - (rb.x-rb.width/2)
            var dy = ra.y - (rb.y-rb.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis)
                return true
            else
                return false
        }

        var checkdistans2 = function(ra,rb,dis){
            var dx =  ra.x - (rb.x-rb.width/2)
            var dy = (ra.y+ra.height/2) - (rb.y-rb.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis)
                return true
            else
                return false
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

        var addList = [
            {key:"do2_tip1",img: res.do2_tip1,sound:res.do2_sound1},
            {key:"do2_tip2",img: res.do2_tip2,sound:res.do2_sound2},
            {key:"do2_tip3",img: res.do2_tip3,sound:res.do2_sound3},
            {key:"do2_tip4",img: res.do2_tip4,sound:res.do2_sound4},
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
            key: "do2_tip5",
            sound: res.do2_sound5
        })
    },
})