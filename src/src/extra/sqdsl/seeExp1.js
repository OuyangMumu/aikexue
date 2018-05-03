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
        loadPlist("see_plist")
        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        self.nodebs.show()
        var normal = []
        var select = []
        var curIndex = 1
        var curExp = 0
        for(var i = 0 ; i < 2 ; i++){
            var img = sprintf("#see_touch_%d.png",2*i+1)
            var sp = createSp(img,cc.p(100,400-100*i),self)
            normal[i] = sp
            var img2 = sprintf("#see_touch_%d.png",2*i+2)
            select[i] = createSp(img2,cc.p(100,400-100*i),self)
            select[i].setVisible(false)

            var img3 = sprintf("#see_exp_%d.png",2*i+1)
            var sp2 = createSp(img3,cc.p(1050,450-100*i),self)
            normal[i+2] = sp2
            var img4 = sprintf("#see_exp_%d.png",2*i+2)
            select[i+2] = createSp(img4,cc.p(1050,450-100*i),self)
            select[i+2].setVisible(false)

            //吹气不吹气
            sp.index = i
            createTouchEvent({
                item:sp,
                begin:function(data){
                    var index = data.item.index
                    if(index == curIndex)   return false
                    curIndex = index
                    if(index == 0){
                        normal[0].setVisible(false)
                        select[0].setVisible(true)
                        normal[1].setVisible(true)
                        select[1].setVisible(false)
                        call()
                    }else{
                        call_not()
                        normal[1].setVisible(false)
                        select[1].setVisible(true)
                        normal[0].setVisible(true)
                        select[0].setVisible(false)
                    }
                    return true 
                }
            })

            //实验一实验二
            sp2.index = i 
            createTouchEvent({
                item:sp2,
                begin:function(data){
                    var index = data.item.index
                    if(index == curExp)   return false
                    call_not()
                    curExp = index
                    loudou.setVisible(false)
                    zhitiao.setVisible(false)
                    //每次重置
                    curIndex = 1
                    normal[0].setVisible(true)
                    select[0].setVisible(false)
                    normal[1].setVisible(false)
                    select[1].setVisible(true)
                    if(index == 0){
                        normal[0+2].setVisible(false)
                        select[0+2].setVisible(true)
                        normal[1+2].setVisible(true)
                        select[1+2].setVisible(false)
                        child.setPosition(530,510)
                        zhitiao.setVisible(true)
                    }else{
                        normal[1+2].setVisible(false)
                        select[1+2].setVisible(true)
                        normal[0+2].setVisible(true)
                        select[0+2].setVisible(false)
                        loudou.setVisible(true)
                    }
                    return true 
                }
            })
        }
        var call_not = function(){
            label.setString("")
            self.nodebs.stopSay()
            switch(curExp){
                case 0:
                    child.stopAllActions()
                    child.setSpriteFrame("child01.png")
                    zhitiao.stopAllActions()
                    zhitiao.setSpriteFrame("zhitiao01.png")
                break
                case 1:
                    loudou.stopAllActions()
                    for(var i = 0 ; i < 4 ; i++){
                        loudou.getChildren()[i].stopAllActions()
                    }
                    hand1.setPosition(75,-8)
                    hand2.setPosition(80,-5)
                    qiu.setSpriteFrame("qiu01.png")
                    qiliu.setVisible(false)
                break
            }
        }
        var call = function(){
            self.nodebs.say({key:self.addList[curExp].key,force:true})
            switch(curExp){
                case 0:
                    child.runAction(cc.repeatForever(cc.sequence(
                        ani("child%02d.png",1,2,0.15),
                        cc.callFunc(function(){
                            zhitiao.runAction(ani("zhitiao%02d.png",1,16,0.08))
                        }),
                        ani("child%02d.png",3,4,0.15),
                        cc.delayTime(1)
                    )))
                    label.setString(str1)
                break
                case 1:
                    loudou.runAction(cc.sequence(
                        cc.callFunc(function(){
                            hand1.runAction(cc.moveTo(0.3,195,-48))
                            hand2.runAction(cc.moveTo(0.3,200,-45))
                            qiu.runAction(cc.sequence(
                                ani("qiu%02d.png",1,6,0.1),
                                cc.callFunc(function(){
                                    qiu.runAction(aniRepeat("qiu%02d.png",7,8,0.05))
                                })
                            ))
                            qiliu.runAction(cc.repeatForever(cc.sequence(
                                cc.callFunc(function(){
                                    qiliu.setVisible(true)
                                }),
                                cc.delayTime(0.2),
                                cc.callFunc(function(){
                                    qiliu.setVisible(false)
                                }),
                                cc.delayTime(0.2)
                            )))
                        })
                    ))
                    label.setString(str2)
                break
            }
        }

        select[1].setVisible(true)
        select[2].setVisible(true)
        normal[1].setVisible(false)
        normal[2].setVisible(false)

        var label = new cc.LabelTTF("","",28)
        self.addChild(label)
        label.setPosition(850,300)

        var str1 = "        吹气时，纸条内\n侧空气流动快，纸条\n外侧空气流动慢，两\n纸条被吸到了一起。"
        var str2 = "        吹气时，漏斗上\n方空气流动快，乒乓\n球下方气体流动慢，\n小球被吸上去了。"
        var loudou = createSp("#loudou.png",cc.p(560,280),self)
        var qiliu = createSp("#qiliu.png",cc.p(63,80),loudou)
        var hand1 = createSp("#hand1.png",cc.p(75,-8),loudou)
        var qiu = createSp("#qiu01.png",cc.p(68,40),loudou)
        var hand2 = createSp("#hand2.png",cc.p(80,-5),loudou)
        loudou.setScale(1.3)
        qiliu.setVisible(false)
        for(var i = 0 ; i < 4 ; i++){
            loudou.getChildren()[i].setLocalZOrder(-1)
        }

        loudou.setVisible(false)

        var zhitiao = createSp("#zhitiao01.png",cc.p(570,220),self)
        var child = createSp("#child01.png",cc.p(530,510),self)


        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
            }))
        }
        var aniRepeat = function(frame,start,end,time){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:frame,
                start:start,
                end: end,
                time: time
            })))
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
            {key:"see_tip2",sound:res.see_sound2},
        ]
        this.addList = addList
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                sound: addList[i].sound,
            })
        }
    }
})