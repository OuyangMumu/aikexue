var curMusic = null
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    big_tg:888,
    small_tg:882,
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
        })
        this.expCtor() 
        this.initUI() 
        this.initPeople()
        return true
    },
    initUI:function(){
       var self = this
       self.xijunFather = new cc.Node()
       self.addChild(self.xijunFather)

       var xi = new cc.Sprite(res.fen5)
       xi.setScale(0.5)
       xi.setPosition(getMiddle())
       self.xijunFather.addChild(xi)

        var resultbtn = new ccui.Button(res.btn_get_normal,
        res.btn_get_select)
        resultbtn.setPosition(90,400)
        this.addChild(resultbtn)
        resultbtn.setVisible(false)
        resultbtn.addClickEventListener(function(){
            self.nodebs.say({
                key: "jielun1"
              })
        })
       
       var sortBtn = new ccui.Button(res.fen3,res.fen4)
       sortBtn.setPosition(160,380)
       self.addChild(sortBtn)
       sortBtn.setVisible(false)

       var sortSprite = function(){
           var list = self.xijunFather.getChildren()
           for(var i=0; i<list.length; i++){
              var l = Math.floor(i/8)
              var r = i%8
              list[i].setRotation(0)
              list[i].setScale(0.6)
             // list[i].setPosition(200+100*r,400-100*l)
              list[i].runAction(cc.moveTo(0.2,cc.p(200+100*r,400-100*l)))
           }
       }
       sortBtn.addClickEventListener(function(){
          sortBtn.setVisible(false)
          self.timeClock.removeTimer()
          sortSprite()
          resultbtn.setVisible(true)
       })

       var fenBtn = new ccui.Button(res.fen1,res.fen2)
       fenBtn.setPosition(160,380)
       self.addChild(fenBtn)
       fenBtn.addClickEventListener(function(){
           fenBtn.setVisible(false)
           self.timeClock.addOneTimer(function(){
              sortBtn.setVisible(true)
           })
           self.xijunFather.removeAllChildren()
           var xijun = self.createXiJun()
           xijun.setPosition(getMiddle())
           self.xijunFather.addChild(xijun)
       })

       
       var timeClock = new cc.Sprite(res.fen6)
       timeClock.setPosition(560,550)
       self.addChild(timeClock)
       timeClock.Time = 0
       self.timeClock = timeClock
       timeClock.label = new cc.LabelTTF("0","",30)
       timeClock.label.setColor(cc.color(200,15,220))
       timeClock.label.setPosition(timeClock.width-15,timeClock.height/2)
       timeClock.addChild(timeClock.label)

       var danwei = new cc.Sprite(res.fen7)
       danwei.setPosition(timeClock.width+30,timeClock.height/2)
       timeClock.addChild(danwei)

       timeClock.addOneTimer = function(fun){
          var timeClock = this
          timeClock.runAction(cc.repeatForever(cc.sequence(
             cc.delayTime(0.5),
             cc.callFunc(function(){
                timeClock.Time++
                timeClock.label.setString(timeClock.Time)
                if(timeClock.Time>=100){
                   if(fun){
                      fun()
                   }
                   timeClock.removeTimer()
                   var list = self.xijunFather.getChildren()
                   for(var i in list){
                      list[i].stopAllActions()
                   }
                }
             })
          )))
       }
       timeClock.removeTimer = function(){
         var timeClock = this
         timeClock.stopAllActions()
         timeClock.Time = 0
       }
    },
    createXiJun:function(){
      var self = this
      var xijun = new cc.Sprite(res.fen5)
      xijun.setScale(0.5)
      xijun.bigTosmall = cc.sequence(
         cc.spawn(
                  cc.fadeIn(2),
                  cc.scaleTo(5,1,1)
                  ),
         cc.spawn(
                  cc.scaleTo(2,0.7,0.7),
                  cc.fadeTo(2,150)
                  )
      )
      xijun.bigTosmall.tag = self.big_tg
      xijun.runAction(xijun.bigTosmall)
      xijun.runAction(cc.sequence(
         cc.delayTime(9),
         cc.callFunc(function(){
              if(xijun){
                 var xi1 = self.createXiJun()
                 xi1.setOpacity(0)
                 xi1.setPosition(51,142)
                 xijun.addChild(xi1)
                 xijun.up = xi1
                 xi1.runAction(cc.fadeIn(2))
                 xi1.stopActionByTag(self.big_tg)

                 var xi2 = self.createXiJun()
                 xi2.setOpacity(0)
                 xi2.setPosition(87,59)
                 xijun.addChild(xi2)
                 xijun.down = xi2
                 xi2.runAction(cc.fadeIn(2))
                 xi2.stopActionByTag(self.big_tg)
              }
         }),
         cc.callFunc(function(){
            xijun.runAction(cc.sequence(
               cc.fadeOut(2),
               cc.callFunc(function(){
                     if(xijun.up){
                        var pos1 = xijun.convertToWorldSpace(xijun.up.getPosition())         
                        safeAdd(self.xijunFather,xijun.up)
                        xijun.up.setScale(0.35)
                        xijun.up.runAction(cc.sequence(
                           cc.spawn(
                                    cc.fadeIn(2),
                                    cc.scaleTo(5,1,1)
                                    ),
                           cc.spawn(
                                    cc.scaleTo(2,0.7,0.7),
                                    cc.fadeTo(2,150)
                                    )
                        ))
                        xijun.up.setRotation(xijun.getRotationX())
                        xijun.up.setPosition(pos1)
                     }
                     if(xijun.down){          
                        var pos2 = xijun.convertToWorldSpace(xijun.down.getPosition())
                        safeAdd(self.xijunFather,xijun.down)
                        xijun.down.setScale(0.35)
                        xijun.down.runAction(cc.sequence(
                           cc.spawn(
                                    cc.fadeIn(2),
                                    cc.scaleTo(5,1,1)
                                    ),
                           cc.spawn(
                                    cc.scaleTo(2,0.7,0.7),
                                    cc.fadeTo(2,150)
                                    )
                        ))
                        xijun.down.setRotation(xijun.getRotationX())
                        xijun.down.setPosition(pos2)
                     }
                     xijun.setVisible(false)
                     xijun.removeFromParent(true)
                     xijun = null
               })
            ))
         })
      ))
      xijun.runAction(cc.repeatForever(cc.sequence(
         cc.delayTime(1),
         cc.callFunc(function(){
             var disx =  Math.random()*80 - 40
             var disy = Math.random()*60 - 30
             var toX = xijun.x + disx
             var toY = xijun.y + disy
             if(toX<=900 && toX>=220 && toY>=80 && toY<=430){
                xijun.runAction(cc.moveTo(0.98,cc.p(toX,toY)))
             }
             var rox = xijun.getRotationX()
             var rota = Math.random()*40 -20
             xijun.runAction(cc.rotateTo(0.98,rox+rota))      
         })
      )))
      return xijun
    },
    speakeBykey:function(key){
        var self = this
        self.nodebs.say({
                    key:key,
                    force: true
                })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
               self.speakeBykey("wenzi4")
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500)
        addContent({
            people: this.nodebs,
            key: "wenzi4",
            sound: res.zimp4,
            img:res.wenzi4
        })
        addContent({
          people: this.nodebs,
          key: "jielun1",
          img:res.jielun1,
          id:"result",
          sound: res.jielunmp1,
          offset: cc.p(30, 20),
          offbg: cc.p(70,40),
        })
    }
})