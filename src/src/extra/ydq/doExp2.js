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
        loadPlist("moca_plist")
        loadPlist("lvbo_plist")
        var uiList = [
            "glass","silk","cup","tiesi","lvbo","sai",
            "tip1","tip2","tip3","tip4","tip5"
        ]
        var node = loadNode(res.ydq_doExp2_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:self.addList[0].key})
        })

        var list = [node.lvbo,node.sai,node.tiesi,node.silk,node.glass]
        node.glass.isTouch = false
        for(var i = 0 ; i < list.length ; i++){
            var judge = list[i]
            judge.index = i
            judge.over = false
            if(i != 0)
                judge.noMove = true
            createTouchEvent({
                item:judge,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    var pos = data.pos
                    if(item.noMove) return false
                    if(item.over)   return false
                    switch(index){
                        case 0:
                            item.beginPos = item.getPosition()
                        break
                        case 1:
                        if(!item.over){
                            item.setRotation(90)
                            item.beginPos = item.getPosition()
                        }else{
                            item.noMove = false
                        }
                        break
                        case 2:
                            item.setRotation(90)
                            item.beginPos = item.getPosition()
                            item.setPosition(pos)
                        break
                        case 3:
                            item.setTexture(res.silk2)
                        break
                        case 4:
                        if(judgeOpInPos({item:item,pos:pos})){
                            return true
                        }else{
                            return false
                        }
                        break
                    }
                    return true
                },
                move:function(data){
                    var item = data.item
                    var index = item.index
                    var delta = data.delta
                    if(!item.noMove){
                        item.x += delta.x 
                        item.y += delta.y
                    }
                    switch(index){
                        case 0:
                            if(!item.over && checkdistans(item,node.tiesi,120)){
                                item.noMove = true
                                item.over = true
                                safeAdd(node.tiesi,item)
                                item.setPosition(400,10)
                                item.runAction(cc.sequence(
                                    cc.moveTo(0.3,300,10),
                                    cc.callFunc(function(){
                                        tipStop(node.tip1)
                                        tipFun(node.tip2,1)
                                        node.sai.noMove = false
                                    })
                                ))
                            }
                        break
                        case 1:
                            if(!item.over && checkdistans(item,node.tiesi,150)){
                                item.noMove = true
                                item.over = true
                                safeAdd(node.tiesi,item)
                                item.setPosition(-20,14)
                                item.runAction(cc.sequence(
                                    cc.moveTo(0.5,160,14),
                                    cc.callFunc(function(){
                                        tipStop(node.tip2)
                                        tipFun(node.tip3,2)
                                        node.lvbo.noMove = false
                                        node.tiesi.noMove = false
                                    })
                                ))
                            }
                        break
                        case 2:
                            if(!item.over && checkdistans(item,node.cup,150)){
                                item.noMove = true
                                item.over = true
                                safeAdd(node.cup.getParent(), node.cup)
                                item.runAction(cc.sequence(
                                    cc.moveTo(0.4,840,540),
                                    cc.delayTime(0.2),
                                    cc.moveTo(0.5,840,360),
                                    cc.callFunc(function(){
                                        tipStop(node.tip3)
                                        tipFun(node.tip4,3)
                                        node.silk.noMove = false
                                        node.glass.noMove = false
                                    })
                                ))
                            }
                        break
                        case 3:
                            if(checkdistans3(node.glass,item,120)){
                                item.setPositionY(-200)
                                item.removeListen()
                                var moca = new cc.Sprite("#moca01.png")
                                node.glass.setVisible(false)
                                moca.setPosition(300,380)
                                self.addChild(moca)
                                moca.runAction(cc.sequence(
                                    cc.delayTime(0.2),
                                    ani(),
                                    aniRever(),
                                    ani(),
                                    aniRever(),
                                    ani(),
                                    aniRever(),
                                    ani(),
                                    aniRever(),
                                    ani(),
                                    aniRever(),
                                    cc.callFunc(function(){
                                        moca.setPositionY(-300)
                                        node.glass.setVisible(true)
                                        node.glass.setPosition(300,380)
                                        node.glass.isTouch = true
                                        tipStop(node.tip4)
                                        tipFun(node.tip5,4)
                                    })
                                ))
                            }
                        break
                        case 4:
                            if(item.isTouch && checkdistans2(item,node.tiesi,130)){
                                item.isTouch = false
                                node.lvbo.runAction(lvboani())
                                tipStop(node.tip5)
                            }
                        break
                    }
                },
                end:function(data){
                    var item = data.item 
                    var index = item.index
                    switch(index){
                        case 0:
                            if(!item.over)
                                item.setPosition(item.beginPos)
                        break
                        case 1:
                            if(!item.over){
                                item.setRotation(0)
                                item.setPosition(item.beginPos)
                            }
                        break
                        case 2:
                            if(!item.over){
                                item.setRotation(0)
                                item.setPosition(item.beginPos)
                            } 
                        break
                        case 3:
                            item.setTexture(res.silk2)
                        break
                    }
                }
            })
        }

        var lvboani = function() {
            return cc.sequence(createAnimation({
                frame: "lvbo%02d.png",
                start: 1,
                end: 8,
                time:0.15,
            }))
        }

        var ani = function() {
            return cc.sequence(createAnimation({
                frame: "moca%02d.png",
                start: 1,
                end: 4,
                time:0.1,
            }))
        }

        var aniRever = function() {
            return cc.sequence(createAnimation({
                frame: "moca%02d.png",
                start: 1,
                end: 4,
                time:0.1,
                rever:true,
            }))
        }

        var checkdistans3 = function(ra,rb,dis){
            var dx = ra.x + 100 - (rb.x - rb.width/2)
            var dy = ra.y + 150 - (rb.y + rb.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            cc.log(distance)
            if(distance <= dis)
                return true
            else
                return false
        }

        var checkdistans2 = function(ra,rb,dis){
            var dx = ra.x + 150 - (rb.x + 50)
            var dy = ra.y + 150 - (rb.y + 150)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            cc.log(distance)
            if(distance <= dis)
                return true
            else
                return false
        }

        var checkdistans = function(ra,rb,dis){
            var dx =  ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            cc.log(distance)
            if(distance <= dis)
                return true
            else
                return false
        }

        var inf = [
            {x1:-10,y1:10,x2:-10,y2:-10},
            {x1:10,y1:10,x2:10,y2:-10},
            {x1:10,y1:-10,x2:-10,y2:-10},
            {x1:-10,y1:10,x2:-10,y2:-10},
            {x1:-10,y1:10,x2:10,y2:-10},
        ]

        var tipStop = function(tip){
            tip.setVisible(false)
            tip.getChildByName("arrow1").stopAllActions()
            tip.getChildByName("arrow2").stopAllActions()
        }
        var tipFun = function(tip,index){
            if(index != 0)
                self.nodebs.say({key:self.addList[index].key,force:true})
            tip.setVisible(true)
            var arrow1 = tip.getChildByName("arrow1")
            var arrow2 = tip.getChildByName("arrow2")
            arrow1.runAction(cc.repeatForever(cc.sequence(
                cc.moveTo(0.3,arrow1.x+inf[index].x1,arrow1.y+inf[index].y1),
                cc.delayTime(0.1),
                cc.moveTo(0.3,arrow1.x,arrow1.y),
                cc.delayTime(0.1)
            )))
            arrow2.runAction(cc.repeatForever(cc.sequence(
                cc.moveTo(0.3,arrow2.x+inf[index].x2,arrow2.y+inf[index].y2),
                cc.delayTime(0.1),
                cc.moveTo(0.3,arrow2.x,arrow2.y),
                cc.delayTime(0.1)
            )))
        }
        tipFun(node.tip1,0)
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do2_tip1",sound:res.do2_sound1},
            {key:"do2_tip2",sound:res.do2_sound2},
            {key:"do2_tip3",sound:res.do2_sound3},
            {key:"do2_tip4",sound:res.do2_sound4},
            {key:"do2_tip5",sound:res.do2_sound5},
        ]
        this.addList = addList
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