//@author mu @14/5/10
var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
        loadPlist("cars")
        loadPlist("huisheng")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        var self = this

        var xue1 = self.createXue1()
        var xue2 = self.createXue2()
        var xue3 = new cc.Sprite(res.xue1_3)
        xue3.nopos = true
        xue3.setPosition(2840,200)

        var xue4 = new cc.Sprite(res.xue1_4)
        xue4.nopos = true
        xue4.setScale(0.92)
        xue4.setPosition(3980,200)

        self.initPagegsr({
          imgs:[
              [xue1,xue2,xue3,xue4]
          ],
          pavedata:[
              {nodeX:568,nodeY:290,jdtpos:cc.p(190, 80)}
          ],
          titlepng:res.studytip,
          func:function(data){
              cc.log(data.num)
              if(data.num==1){
                xue2.initSome()
              }else if(data.num==2){
                xue1.initSome()
              }else if(data.num==3){
                xue2.initSome()
              }
          }
        })
        return true
    },
    createXue1:function(){
        var xue = new cc.Sprite(res.xue1_1)

        var startBtn = new ccui.Button(res.startbtn,res.startbtn1)
        var stopBtn = new ccui.Button(res.stopbtn,res.stopbtn1)
        startBtn.setPosition(340,-30)
        xue.addChild(startBtn)
        startBtn.addClickEventListener(function(){
            xue.playAc()
            startBtn.setVisible(false)
            stopBtn.setVisible(true)
        })

        //var stopBtn = new ccui.Button(res.stopbtn,res.stopbtn1)
        stopBtn.setPosition(340,-30)
        xue.addChild(stopBtn)
        stopBtn.setVisible(false)
        stopBtn.addClickEventListener(function(){
            xue.stopAc()
            stopBtn.setVisible(false)
            startBtn.setVisible(true)
        })

        var resetBtn = new ccui.Button(res.resetbtn,res.resetbtn1)
        resetBtn.setPosition(470,-30)
        xue.addChild(resetBtn)
        resetBtn.addClickEventListener(function(){
            xue.initSome()
        })

        var red = createLayout({
          size:cc.size(528,30),
          pos:cc.p(801,103),
          clip:true
        })
        red.initPos = red.getPosition()
        xue.addChild(red)

        var redimg = new cc.Sprite(res.hx1)
        redimg.setPosition(-264,15)
        redimg.initPos = redimg.getPosition()
        red.addChild(redimg)

        var yellow = createLayout({
          size:cc.size(528,30),
          pos:cc.p(-255,97),
          clip:true
        })
        yellow.initPos = yellow.getPosition()
        xue.addChild(yellow)

        var yellowimg = new cc.Sprite(res.hx2)
        yellowimg.setPosition(1055,15)
        yellowimg.initPos = yellowimg.getPosition()
        yellowimg.setAnchorPoint(1,0.5)
        yellow.addChild(yellowimg)

        var boy = new cc.Sprite(res.sheboy)
        boy.setPosition(833,121)
        xue.addChild(boy)

        var car = new cc.Sprite("#cars0.png")
        car.setPosition(141,109)
        car.initPos = car.getPosition()
        xue.addChild(car)
        car.playAc = function(){
            var ac = createAnimation({
                                frame:"cars%d.png",
                                start:0,
                                end:8,
                                time: 0.08
                            })
            car.runAction(cc.repeatForever(ac))
            car.runAction(cc.sequence(
              cc.moveTo(2,cc.p(400,109)),
              cc.callFunc(function(){
                  car.stopAllActions()
                  xue.end = true
              })
            ))
        }
        xue.initSome = function(){
            red.stopAllActions()
            redimg.stopAllActions()
            yellow.stopAllActions()
            yellowimg.stopAllActions()
            car.stopAllActions()
            red.setPosition(red.initPos)
            redimg.setPosition(redimg.initPos)
            yellow.setPosition(yellow.initPos)
            yellowimg.setPosition(yellowimg.initPos)
            yellowimg.setScale(1)
            car.setPosition(car.initPos)
            xue.doing = false
            xue.end = false
            stopBtn.setVisible(false)
            startBtn.setVisible(true)
        }
        xue.doing = false
        xue.playAc = function(){
            if(!xue.doing){
                xue.initSome()
                xue.doing = true
                red.runAction(cc.sequence(
                cc.moveTo(2,cc.p(273,103)),
                cc.callFunc(function(){
                      yellow.runAction(cc.sequence(
                        cc.moveTo(2,cc.p(273,97)),
                        cc.callFunc(function(){
                            car.playAc()
                            yellowimg.runAction(cc.scaleTo(2,0.51,1))
                        })
                      ))
                      yellowimg.runAction(cc.moveTo(2,cc.p(528,15)))
                  })
                ))
                redimg.runAction(cc.moveTo(2,cc.p(264,15)))
            }else{
              red.resume()
              redimg.resume()
              yellow.resume()
              yellowimg.resume()
              car.resume()
            } 
        }
        xue.stopAc = function(){
            if(!xue.end){
              red.pause()
              redimg.pause()
              yellow.pause()
              yellowimg.pause()
              car.pause()
            }else{
              xue.doing = false
            }
        }

        return xue
    },
    createXue2:function(){
      var xue = new cc.Sprite(res.xue1_2)
      xue.nopos = true
      xue.setPosition(1704,198)

      var carTing = new cc.Sprite(res.carting)
      carTing.setPosition(200,110)
      carTing.initPos = carTing.getPosition()
      xue.addChild(carTing)

      var carTingHui = new cc.Sprite("#huisheng00.png")
      carTingHui.setPosition(265,24)
      carTing.addChild(carTingHui)

      var hui = new cc.Sprite("#huisheng29.png")
      hui.setPosition(670,110)
      xue.addChild(hui)
      hui.playAc = function(){
          var ac = createAnimation({
                              frame:"huisheng%02d.png",
                              start:29,
                              end:57,
                              time: 0.03
                          })
          hui.runAction(cc.repeatForever(ac))
      }
      hui.playAc()

      var startBtn = new ccui.Button(res.startbtn,res.startbtn1)
      var resetBtn = new ccui.Button(res.resetbtn,res.resetbtn1)
      var stopBtn = new ccui.Button(res.stopbtn,res.stopbtn1)
      startBtn.setPosition(75,32)
      xue.addChild(startBtn)
      startBtn.addClickEventListener(function(){
          xue.playAc()
          startBtn.setVisible(false)
          resetBtn.setVisible(true)
      })
      
      resetBtn.setPosition(75,32)
      xue.addChild(resetBtn)
      resetBtn.setVisible(false)
      resetBtn.addClickEventListener(function(){
          xue.initSome()
      })
      xue.initSome = function(){
          carTingHui.stopAllActions()
          carTing.stopAllActions()
          carTingHui.setSpriteFrame("huisheng00.png")
          carTing.setPosition(carTing.initPos)
          startBtn.setVisible(true)
          resetBtn.setVisible(false)
      }
      xue.playAc = function(){
          var ac = createAnimation({
                              frame:"huisheng%02d.png",
                              start:0,
                              end:29,
                              time: 0.02
                          })
          carTingHui.runAction(cc.repeatForever(ac))
          carTing.runAction(cc.moveTo(3,cc.p(468,110)))
      }

      return xue
    }
})