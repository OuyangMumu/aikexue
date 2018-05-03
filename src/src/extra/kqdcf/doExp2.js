var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp2", 
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
        loadPlist("bing_plist")
        loadPlist("daobing_plist")

        self.nodebs.show(function(){
            self.nodebs.say({key:"do2_tip1"})
        })

        var createSp = function(res,pos,father){
            var sp = new cc.Sprite(res)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var beizi = createSp("#beizi.png",cc.p(500,200),self)
        var bolipian = createSp("#bolipian.png",cc.p(250,120),self)
        var shaobei = createSp("#shaobei.png",cc.p(750,200),self)
        beizi.setLocalZOrder(2)

        var list = [shaobei,bolipian]
        beizi.judge = false
        for(var i in list){
            var sp = list[i]
            sp.index = i
            sp.noMove = false
            createTouchEvent({
                item: sp,
                begin: function(data){
                    var item = data.item
                    if(item.index == 1 && !beizi.judge){
                        createDialog(res.dialog4)
                        return false
                    }
                    return true 
                },
                move: function(data){
                    var item = data.item
                    var delta = data.delta
                    if(item.index == 0){
                        if(rectIntersectsRect(item,beizi) && !item.noMove){
                                item.noMove = true 
                                item.setPosition(642,333)
                                item.runAction(cc.sequence(
                                    ani("daobing%02d.png",1,16,0.2),
                                    cc.callFunc(function(){
                                        beizi.ice = createSp("#bingkuai01.png",cc.p(500,200),self)
                                        beizi.ice.setLocalZOrder(beizi.getLocalZOrder()-1)
                                        item.setPositionY(-600)
                                        beizi.judge = true
                                    })
                                ))
                            }
                    }else{
                        if(rectIntersectsRect(item,beizi) && !item.noMove){
                            item.noMove = true
                            item.runAction(cc.moveTo(0.4,500,295))
                            beizi.ice.runAction(cc.sequence(
                                ani("bingkuai%02d.png",1,19,0.15),
                                cc.callFunc(function(){
                                    //按钮出现
                                    var btn_result = new ccui.Button(res.btn_result_normal,res.btn_result_select)
                                    btn_result.setPosition(100,400)
                                    self.addChild(btn_result)

                                    btn_result.addClickEventListener(function(){
                                        self.nodebs.say({key:"result"})
                                    })
                                })
                            ))
                        }
                    }
                    
                    if(!item.noMove){
                        item.x += delta.x 
                        item.y += delta.y
                    }
                }
            })
        }

        var createDialog = function(img){
            AddDialog("Tips", {
                res: img,
                face: 2,
                confirmBtn:true,
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

        var rectIntersectsRect = function (ra, rb) {
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
            {key:"do2_tip1",img:res.do1_tip4,sound:res.do1_sound4},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
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
            img: res.do1_tip7,
            sound: res.do1_sound7,
            id: "result",
        })
        
    },
})