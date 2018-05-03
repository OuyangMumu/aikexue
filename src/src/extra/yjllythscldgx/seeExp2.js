var curMusic = null
var seeExp2 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp2",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
        
        })
        this.expCtor()
        this.initUI()
        this.initPeople()
        return true
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
                self.speakeBykey("wenzi1")
            })
        }
    },
    speakeBykey:function(key){
        var self = this
        self.nodebs.say({
                    key: key,
                    force: true,
                    fun:function(){
                    }
                })
    },
    initUI:function(){
        var self = this
        self.holes = []
        var seet2 = new cc.Sprite(res.seet2)
        seet2.setPosition(getMiddle(0,220))
        self.addChild(seet2)

        var lboy = new cc.Sprite(res.lboy)
        lboy.setPosition(getMiddle(-180,-15))
        self.addChild(lboy)

        var lbo = new cc.Sprite(res.lbo)
        lbo.setPosition(getMiddle(-150,0))
        self.addChild(lbo)

        self.holeNode = new cc.Node()
        self.addChild(self.holeNode)

        var lbo1 = new cc.Sprite(res.lbo1)
        lbo1.setPosition(500,286)
        lbo1.setScale(0.88,0.74)
        lbo1.setRotation(20)
        self.addChild(lbo1)
        lbo1.setVisible(false)

        var tip = self.createTip({
                        angle:135,
                        des:cc.p(-10,-10),
                        imgpos:cc.p(28,28),
                        img:res.xpn
                    })
        tip.setPosition(getMiddle(-100,90))
        self.addChild(tip)

        var sr1 = new cc.Sprite(res.sr1)
        sr1.setPosition(getMiddle(-20,-220))
        self.addChild(sr1)
        sr1.setOpacity(0)
        self.jl = sr1

        var chuo = new cc.Sprite(res.chuo)
        chuo.setPosition(getMiddle(230,50))
        self.addChild(chuo)
        
        chuo.playAc = function(fun){
            chuo.stopAllActions()
            chuo.doing = true
            var start = chuo.getPosition()
            chuo.runAction(cc.sequence(
                cc.moveTo(0.1,cc.p(start.x+33,start.y+18)),
                cc.moveTo(0.5,cc.p(start.x,start.y)),
                cc.callFunc(function(){
                  if(fun) fun()
                }),
                cc.moveTo(0.5,cc.p(start.x-15,start.y+2)),
                cc.delayTime(0.2),
                cc.moveTo(0.5,cc.p(start.x+30,start.y+18)),
                cc.callFunc(function(){
                    chuo.doing = false
                })
            ))
        }

        createTouchEvent({
            item:chuo,
            begin:function(data){
                var item = data.item
                if(chuo.doing){
                    return false
                }
                var result = judgeOpInPos(data)
                return result
            },
            autoMove:true,
            end:function(data){
                var item = data.item
                var chuoPos = cc.p(item.x-item.width/2 + 5,item.y-35)
                if(judgeInside({item:lbo1,pos:chuoPos}))
                {
                    if(judgeOpInPos({item:lbo1,pos:chuoPos}))
                    {   
                        var canAddHole = true
                        for (var i = 0; i < self.holes.length; i++) {
                            if(getDis(self.holes[i],chuoPos)<=55){
                                canAddHole = false
                                break
                            }
                        }
                        if(canAddHole){
                            item.playAc(function(){
                                self.AddHole(chuoPos)
                            })
                        }
                    }
                }
            }
        })
    },
    AddHole:function(pos){
        var self = this
        var keng = new cc.Sprite(res.keng)
        keng.setPosition(pos)
        keng.setScale(0)
        self.holeNode.addChild(keng)
        self.holes[self.holes.length] = keng
        keng.runAction(cc.scaleTo(0.4,1))

        if(self.holes.length==1){
            self.jl.runAction(cc.sequence(
                cc.delayTime(5),
                cc.fadeIn(1),
                cc.callFunc(function(){
                    self.speakeBykey("wenzi2")
                })
            ))
        }
    },
    createTip:function(data){
        var angle = data.angle || 0
        var src = data.src || cc.p(0,0)
        var des = data.des || cc.p(10,0)
        var img = data.img
        var imgpos = data.imgpos || cc.p(0,0)
        var node = new cc.Node()
        var yellow = new cc.Sprite(res.yellow)
        yellow.setRotation(angle)
        node.addChild(yellow)
        yellow.setScale(0.7)
        var seq = cc.sequence(cc.moveTo(0.4,src),cc.moveTo(0.4,des))
        yellow.runAction(cc.repeatForever(seq))

        var sp = new cc.Sprite(img)
        sp.setPosition(imgpos)
        node.addChild(sp)
        return node
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500)

        addContent({
                    people: this.nodebs,
                    key: "wenzi1",
                    sound:res.zimp1
                })
        addContent({
                    people: this.nodebs,
                    key: "wenzi2",
                    sound:res.zimp3
                })
    }
})