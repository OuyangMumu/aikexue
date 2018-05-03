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
        var uiList = [
            "left","right","waterLeft","waterRight","zhuan"
        ]
        var node = loadNode(res.cxfd_seeExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show()

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var wenzi = createSp("#see_wenzi1.png",cc.p(570,530),self)
        var wenzi2 = createSp("#see_wenzi7.png",cc.p(175,90),self)
        wenzi2.setVisible(false)
        createSp("#see_wenzi3.png",cc.p(250,400),self)
        createSp("#see_wenzi4.png",cc.p(750,400),self)
        createSp("#see_wenzi5.png",cc.p(440,210),self)
        createSp("#see_wenzi6.png",cc.p(440,90),self)
        //680   680
        var btn_play = new ccui.Button(res.btn_play_select,res.btn_play_normal)
        btn_play.setPosition(100,150)
        self.addChild(btn_play)
        btn_play.setScale(0.8)
        var jiantou1 = createSp("#jiantou1.png",cc.p(560,150),self)
        jiantou1.setVisible(false)
        jiantou1.setScaleY(2)
        var jiantou2 = createSp("#jiantou2.png",cc.p(200,180),self)
        jiantou2.setVisible(false)

        var list = [node.right,node.waterRight,node.left,node.waterLeft,node.zhuan,jiantou1,jiantou2]
        var judgePaly = function(index){
            if(index == 0){
                for(var i = 0 ; i < list.length ; i++){
                    list[i].pause()
                }
            }else{
                for(var i = 0 ; i < list.length ; i++){
                    list[i].resume()
                }
            }
        }

        var stop = function(){
            flag = true
            flag2 = true
            btn_play.loadTextures(res.btn_restart_select,res.btn_restart_normal)
            flag3 = true
            jiantou1.stopAllActions()
            jiantou1.setVisible(false)
            node.zhuan.stopAllActions()
        }

        var judgePaly2 = function(){
            if(!flag2)  return false
                flag2 = false
            wenzi2.setVisible(true)
            node.zhuan.runAction(aniRepeat())
            if(curIndex == 0){
                self.nodebs.say({key:"see_tip1",force:true})
                node.zhuan.setScaleY(-1)
                node.right.runAction(cc.sequence(
                    aniRever("right%02d.png",0.15),
                    cc.callFunc(function(){
                        stop()
                    })
                ))
                node.waterRight.runAction(cc.scaleTo(7.5,node.waterRight.getScaleX(),7))
                node.left.runAction(cc.sequence(
                    aniRever("left%02d.png",0.1),
                    cc.callFunc(function(){
                        jiantou2.stopAllActions()
                        jiantou2.setVisible(false)
                    })
                ))
                node.waterLeft.runAction(cc.scaleTo(5,node.waterLeft.getScaleX(),7))
                jiantou1.setScaleX(-2)
                jiantou1.runAction(cc.repeatForever(cc.sequence(
                    cc.callFunc(function(){
                        jiantou1.setPositionX(380)
                        jiantou1.setVisible(true)
                    }),
                    cc.moveTo(0.5,560,150),
                    cc.callFunc(function(){
                        jiantou1.setVisible(false)
                    }),
                    cc.delayTime(0.4)
                )))
                jiantou2.setScaleY(1)
                jiantou2.runAction(cc.repeatForever(cc.sequence(
                    cc.callFunc(function(){
                        jiantou2.setPositionY(180)
                        jiantou2.setVisible(true)
                    }),
                    cc.moveTo(0.5,200,260),
                    cc.callFunc(function(){
                        jiantou2.setVisible(false)
                    }),
                    cc.delayTime(0.4)
                )))
            }else{
                self.nodebs.say({key:"see_tip2",force:true})
                node.zhuan.setScaleY(1)
                node.left.runAction(cc.sequence(
                    ani("left%02d.png",0.1),
                    cc.callFunc(function(){
                        jiantou2.stopAllActions()
                        jiantou2.setVisible(false)
                    })
                ))
                node.waterLeft.runAction(cc.scaleTo(5,node.waterLeft.getScaleX(),3.05))
                node.right.runAction(cc.sequence(
                    ani("right%02d.png",0.15),
                    cc.callFunc(function(){
                        stop()
                    })
                ))
                node.waterRight.runAction(cc.scaleTo(7.5,node.waterRight.getScaleX(),3.05))
                jiantou1.setScaleX(2)
                jiantou1.runAction(cc.repeatForever(cc.sequence(
                    cc.callFunc(function(){
                        jiantou1.setPositionX(560)
                        jiantou1.setVisible(true)
                    }),
                    cc.moveTo(0.5,380,150),
                    cc.callFunc(function(){
                        jiantou1.setVisible(false)
                    }),
                    cc.delayTime(0.4)
                )))
                jiantou2.setScaleY(-1)
                jiantou2.runAction(cc.repeatForever(cc.sequence(
                    cc.callFunc(function(){
                        jiantou2.setPositionY(260)
                        jiantou2.setVisible(true)
                    }),
                    cc.moveTo(0.5,200,180),
                    cc.callFunc(function(){
                        jiantou2.setVisible(false)
                    }),
                    cc.delayTime(0.4)
                )))
            }
        }
        var flag = true
        var flag2 = true
        var flag3 = false
        btn_play.addClickEventListener(function(){
            if(flag){
                if(flag3){//重新播放
                    flag3 = false
                    if(curIndex == 0){
                        //self.nodebs.say({key:"see_tip1",force:true})
                        node.waterRight.setScaleY(3.05)
                        node.right.setSpriteFrame("right50.png")
                        node.waterLeft.setScaleY(3.05)
                        node.left.setSpriteFrame("left50.png")
                    }else{
                        //self.nodebs.say({key:"see_tip2",force:true})
                        node.waterRight.setScaleY(7)
                        node.right.setSpriteFrame("right01.png")
                        node.waterLeft.setScaleY(7)
                        node.left.setSpriteFrame("left01.png")
                    }
                }
                //播放
                flag = false
                btn_play.loadTextures(res.btn_pause_select,res.btn_pause_normal)
                judgePaly(1)
                judgePaly2()
            }else{
                //暂停
                flag = true
                btn_play.loadTextures(res.btn_play_select,res.btn_play_normal)
                judgePaly(0)
                //self.nodebs.stopSay()
            }
        })

        

        var curIndex = 0
        var normal = []
        var select = []
        normal[0] = createSp("#touch1_1.png",cc.p(100,500),self)
        normal[1] = createSp("#touch2_1.png",cc.p(100,430),self)
        select[0] = createSp("#touch1_2.png",cc.p(100,500),self)
        select[1] = createSp("#touch2_2.png",cc.p(100,430),self)
        select[1].setVisible(false)
        normal[0].setVisible(false)
        for(var i = 0 ; i < 2 ; i++){
            var sp = normal[i]
            sp.index = i
            createTouchEvent({
                item:sp,
                begin:function(data){
                    var item = data.item
                    curIndex = item.index
                    node.waterRight.stopAllActions()
                    node.right.stopAllActions()
                    node.waterLeft.stopAllActions()
                    node.left.stopAllActions()
                    node.zhuan.stopAllActions()
                    jiantou1.stopAllActions()
                    jiantou1.setVisible(false)
                    jiantou2.stopAllActions()
                    jiantou2.setVisible(false)
                    flag = true
                    btn_play.loadTextures(res.btn_play_select,res.btn_play_normal)
                    flag2 = true
                    flag3 = false
                    wenzi2.setVisible(false)
                    self.nodebs.stopSay()
                    if(item.index == 0){
                        wenzi.setSpriteFrame("see_wenzi1.png")
                        wenzi2.setSpriteFrame("see_wenzi7.png")
                        node.waterRight.setScaleY(3.05)
                        node.right.setSpriteFrame("right50.png")
                        node.waterLeft.setScaleY(3.05)
                        node.left.setSpriteFrame("left50.png")
                        normal[0].setVisible(false)
                        normal[1].setVisible(true)
                        select[0].setVisible(true)
                        select[1].setVisible(false)
                    }else{
                        wenzi.setSpriteFrame("see_wenzi2.png")
                        wenzi2.setSpriteFrame("see_wenzi8.png")
                        node.waterRight.setScaleY(7)
                        node.right.setSpriteFrame("right01.png")
                        node.waterLeft.setScaleY(7)
                        node.left.setSpriteFrame("left01.png")

                        wenzi.setSpriteFrame("see_wenzi2.png")
                        wenzi2.setSpriteFrame("see_wenzi8.png")
                        normal[0].setVisible(true)
                        normal[1].setVisible(false)
                        select[0].setVisible(false)
                        select[1].setVisible(true)
                    }
                    return true
                }
            })
        }

        var aniRepeat = function(){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:"zhuan%02d.png",
                end: 6,
                time: 0.1
            })))
        }

        var ani = function(frame,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: 1,
                end: 50,
                time:time,
            }))
        }
        
        var aniRever = function(frame,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: 1,
                end: 50,
                time:time,
                rever: true,
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