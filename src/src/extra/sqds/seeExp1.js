var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "seeExp1", 
    preLayer: "seeLayer", 
    ctor: function() { 
        this._super();
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("see1_plist")
        self.nodebs.show()

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        createSp(res.zhuozi,cc.p(568,140),self)

        var wenzi1 = createSp("#see1_wenzi1.png",cc.p(250,350),self)
        wenzi1.setOpacity(0)
        wenzi1.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(function(){
                wenzi1.runAction(cc.moveTo(0.5,250,200))
            }),
            cc.fadeIn(0.5),
            cc.callFunc(function(){
                //说话
                judge = true
                self.nodebs.say({key:"see_tip1"})
            })
        ))

        var coin = createSp("#coin.png",cc.p(630,120),self)
        var hand1 = createSp("#see1_hand3.png",cc.p(670,440),self)
        var diguan = createSp("#diguan01.png",cc.p(630,300),self)
        var digai = createSp("#digai.png",cc.p(631,430),self)
        var hand = createSp("#see1_hand1.png",cc.p(697,434),self)
        var shuidi = createSp("#shuidi01.png",cc.p(630,230),self)
        shuidi.setScale(2)
        var judge = false
        digai.setVisible(false)
        var water = null
        var count = 0
        createTouchEvent({
            item:hand,
            begin:function(data){
                if(!judge)
                    return false
                return true
            },
            end:function(data){
                var item = data.item
                count++
                hand.runAction(cc.sequence(
                    cc.callFunc(function(){
                        hand.setSpriteFrame("see1_hand2.png")
                        digai.setVisible(true)
                        judge = false
                        shuidi.runAction(ani("shuidi%02d.png",1,5,0.02))
                    }),
                    cc.delayTime(0.1),
                    cc.callFunc(function(){
                        hand.setSpriteFrame("see1_hand1.png")
                        digai.setVisible(false)
                        diguan.setSpriteFrame(sprintf("diguan%02d.png",count+1))
                        if(!water){
                            water = createSp("#diaoshui01.png",cc.p(630,115),self)
                        }
                        //水的变化
                        water.runAction(cc.sequence(
                            cc.callFunc(function(){
                                water.setSpriteFrame(sprintf("diaoshui%02d.png",count))
                                water.setScale(1.05)
                            }),
                            cc.scaleTo(0.1,1)
                        ))
                        judge = true
                        if(count == 18){
                            judge = false
                            var loushui = createSp("#loushui01.png",cc.p(765,75),self)
                            loushui.setScale(3)
                            loushui.runAction(ani("loushui%02d.png",1,5,0.15))
                            //说话
                            var wenzi2 = createSp("#see1_wenzi2.png",cc.p(250,550),self)
                            wenzi2.setOpacity(0)
                            wenzi2.runAction(cc.moveTo(0.5,250,400))
                            wenzi2.runAction(cc.sequence(
                                cc.fadeIn(0.5),
                                cc.callFunc(function(){
                                    //说话
                                    self.nodebs.say({key:"see_tip2",force:true})
                                })
                            ))
                        }
                    })
                ))


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
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"see_tip1",sound:res.see_sound1},
            {key:"see_tip2",sound:res.see_sound2}
        ]
        this.addList = addList
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                sound: addList[i].sound,
            })
        }
    },
})