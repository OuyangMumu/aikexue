var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp3", 
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
        loadPlist("do3_plist")

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        self.nodebs.show(function(){
            self.nodebs.say({key:"do3_tip1"})
        })

        createSp(res.zhuozi,cc.p(568,140),self)

        var water = createSp("#suanjia01.png",cc.p(317,180),self)
        water.setScale(1.7)
        var shaobei = createSp("#do3_shaobei.png",cc.p(300,250),self)
        shaobei.setScale(1.7)
        var gai = createSp("#do3_gai.png",cc.p(550,275),self)
        var cup = createSp("#do3_cup.png",cc.p(550,200),self)
        var shaozi = createSp("#do3_shaozi.png",cc.p(740,200),self)

        cup.over = false
        createTouchEvent({
            item:shaozi,
            begin:function(data){
                return true 
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(!item.noMove){
                    item.x += delta.x 
                    item.y += delta.y

                    if(cup.judge){
                        if(!cup.over && rectIntersectsRect(item,cup)){
                            cup.over = true//判断不能再去勺高锰酸钾
                            cup.judge = false 
                            item.noMove = true 
                            cup.runAction(cc.sequence(
                                cc.rotateTo(0.3,45),
                                cc.callFunc(function(){
                                    shaozi.runAction(cc.sequence(
                                        cc.moveTo(0.3,700,300),
                                        cc.moveTo(0.4,630,260),
                                        cc.callFunc(function(){
                                            shaozi.setSpriteFrame("do3_shaozi2.png")
                                        }),
                                        cc.delayTime(0.2),
                                        cc.moveTo(0.3,700,300),
                                        cc.callFunc(function(){
                                            item.noMove = false
                                            cup.runAction(cc.rotateTo(0.3,0))
                                        })
                                    ))
                                })
                            ))
                        }
                    }else{
                        if(!item.noMove && !item.over && rectIntersectsRect(item,shaobei)){
                            item.noMove = true
                            item.setPosition(400,400)
                            item.setSpriteFrame("do3_shaozi.png")
                            shaobei.gao = createSp("#do3_pot.png",cc.p(80,130),shaobei)
                            shaobei.gao.setScale(1.3)
                            shaobei.gao.runAction(cc.sequence(
                                cc.moveTo(0.8,80,80),
                                cc.callFunc(function(){
                                    item.noMove = false
                                    item.over = true 
                                    shaobei.gao.setPositionY(-1000)
                                    water.runAction(ani("suanjia%02d.png",2,19,0.2))
                                })
                            ))
                        }
                    }
                    
                }
            }
        })
        cup.judge = false
        gai.judge = true
        createTouchEvent({
            item:gai,
            begin:function(data){
                var item = data.item
                if(!item.judge)
                    return false
                item.judge = false
                if(item.getRotation() == 180){
                    item.runAction(cc.sequence(
                        cc.rotateTo(0.3,0),
                        cc.moveTo(0.5,550,310),
                        cc.moveTo(0.3,550,275),
                        cc.callFunc(function(){
                            item.judge = true  
                            cup.judge = false
                        })
                    ))
                }else{
                    item.runAction(cc.sequence(
                        cc.moveTo(0.3,550,310),
                        cc.moveTo(0.5,650,140),
                        cc.rotateTo(0.3,180),
                        cc.callFunc(function(){
                            item.judge = true
                            cup.judge = true
                        })
                    ))
                }
                
                return true
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

        var addList = [
            {key:"do3_tip1",img: res.do3_tip1,sound:res.do3_sound1},
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
    },
})