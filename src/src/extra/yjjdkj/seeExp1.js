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
        loadPlist("frame_plist")

        var createSp = function(res,pos,father){
            var sp = new cc.Sprite(res)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        self.nodebs.show(function(){
            self.nodebs.say({key:"see1_tip1"})
        })
        var btn_result = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
        btn_result.setPosition(1030,450)
        self.addChild(btn_result)
        btn_result.addClickEventListener(function(){
            if(btn_result.isVisible()){
                self.nodebs.say({key:"result"})
            }  
        })
        btn_result.setVisible(false)
        var judgeSay = [false,false]
        var judgeSayFun = function(){
            if(judgeSay[0] && judgeSay[1]){
                btn_result.setVisible(true)
            }
        }

        var frame1 = createSp("#frame1_01.png",cc.p(300,260),self)
        var frame2 = createSp("#frame2_01.png",cc.p(737,244),self)
        var hand = createSp("#hand.png",cc.p(450,350),self)
        hand.setAnchorPoint(0,0.15)
        frame1.setAnchorPoint(0.52,0.96)
        frame2.setAnchorPoint(0.62,0.94)
        hand.isTouch = false
        hand.isOk = false
        createTouchEvent({
            item:hand,
            begin:function(data){
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(!item.isTouch){
                    if(checkdistans(item,frame2)){
                        item.setPosition(737,244)
                        item.isTouch = true
                    }
                }else{
                    if(delta.y < 0){
                        if(item.x+delta.x > 680 && item.x+delta.x < 750){
                            item.x += delta.x
                            if(item.y+delta.y > 235)
                                item.y += delta.y/9
                            item.index = Math.floor((737 - item.x)/5)
                            change(item)
                        }
                    }else{
                        if(item.y+delta.y > 235){
                            if(!checkdistans(item,frame2) && item.y > 255){
                                item.isTouch = false
                                if(!judgeSay[1]){
                                    judgeSay[1] = true
                                    judgeSayFun()
                                }
                                frame2.setSpriteFrame(sprintf("frame2_%02d.png",1))//复原状态
                            }
                            item.y += delta.y
                        }
                    }
                    return false
                }

                if(!item.isOk){
                    if(checkdistans(item,frame1)){
                        item.setPosition(300,260)
                        item.isOk = true
                    }
                }else{
                    if(delta.y < 0){
                        if(item.y + delta.y > 250)
                            item.y += delta.y/10
                        if(!judgeSay[0]){
                            judgeSay[0] = true
                            judgeSayFun()
                        }
                        frame1.setSpriteFrame(sprintf("frame1_%02d.png",2))
                        return false
                    }else{
                        if(!checkdistans(item,frame1) && item.y+delta.y > 260){
                            item.isOk = false
                            frame1.setSpriteFrame(sprintf("frame1_%02d.png",1))
                        }
                    }
                }
                item.x += delta.x 
                item.y += delta.y
            },
            end:function(data){

            }
        })

        var change = function(item){
            if(item.index <= 0)   item.index = 1
            if(item.index > 10)    item.index == 11
            frame2.setSpriteFrame(sprintf("frame2_%02d.png",item.index))
        }

        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
            }))
        }
        var checkdistans = function(ra,rb){
            var dx = ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 40)
                return true
            else
                return false
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"see1_tip1",img:res.see1_tip1,sound:res.see1_sound1},
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
            img: res.see1_result,
            sound: res.see1_sound2,
            id: "result",
        })
    },
})