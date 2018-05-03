//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {

        })
        this._super()
        var self = this
        this.expCtor() 
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this
        var uiName = [
          "choseBtn","jielunBtn1","jielunBtn2","txc_btn","tbc_btn",
          "bigcar","car","car_xu","bigcar_xu","car_tool1","car_tool2",
          "car_tool3","car_tool4","car_tool5","car_tool6"
        ]
        var node = loadNode(res.do1,uiName)
        this.inside_node.addChild(node)
        this.node = node

        var setBtnVis = function(btn,vis){
           btn.setEnabled(vis)
           btn.setBright(vis)
           btn.canMoveCar = vis
        }
        

        var single1 = node.bigcar.getChildByName("single")
        single1.r_pos = cc.p(435,28)
        single1.l_pos = cc.p(-102,28)
        var single2 = node.car.getChildByName("single")
        single2.r_pos = cc.p(215,29)
        single2.l_pos = cc.p(-98,28)
        
        node.bigcar.speed = 150
        node.car.speed = 100
        node.bigcar.radius = 6
        node.car.radius = 8
        node.bigcar.carToolPlay = function(distan,jude,isMove){
          var speed = this.speed
          var time = distan / speed
          var radius = this.radius
          var cicle = speed / radius / Math.PI * 180
          var isMove = isMove || false

          var loop = [
            node.car_tool1,
            node.car_tool2,
            node.car_tool3,
            node.car_tool4
          ]
          for (var i = 0; i < loop.length; i++){
             loop[i].stopAllActions()
          }
          if(isMove){
            for (var i = 0; i < loop.length; i++) {
               loop[i].setRotation(loop[i].getRotationX() + cicle * jude)
            }
          }else{
            for (var i = 0; i < loop.length; i++) {
              loop[i].runAction(cc.rotateBy(time,cicle * jude).easing(cc.easeOut(1.8)))
            }
          }       
        }
        node.car.carToolPlay = function(distan,jude,isMove){
          var speed = this.speed
          var time = distan / speed
          var radius = this.radius
          var cicle = speed / radius / Math.PI * 180

          var loop = [
            node.car_tool5,
            node.car_tool6
          ]
          for (var i = 0; i < loop.length; i++){
            loop[i].stopAllActions()
          }
          if(isMove){
            for (var i = 0; i < loop.length; i++) {
               loop[i].setRotation(loop[i].getRotationX() + cicle * jude)
            }
          }else{
            for (var i = 0; i < loop.length; i++) {
              loop[i].runAction(cc.rotateBy(time,cicle * jude).easing(cc.easeOut(1.8)))
            }
          }
        }
        var carPlay = function(car){
            var car_name = car.getName()
            var single = car.getChildByName("single")
            switch(car_name){
              case "bigcar":
                node.bigcar_xu.setVisible(true)
                node.bigcar_xu.setPosition(car.x,car.y-7)
                var topos = null
                var jude = -1
                if(single.right){
                   topos = cc.p(353,284)
                   jude = -1
                }else{
                   topos = cc.p(734,284)
                   jude = 1
                }
                var disX = Math.abs(car.x - topos.x)
                var ac = cc.moveTo(disX/car.speed,topos)
                ac.easing(cc.easeOut(1.8))
                car.carToolPlay(disX,jude)
                car.runAction(cc.sequence(
                   ac,
                   cc.callFunc(function(){
                      setBtnVis(node.tbc_btn,true)
                      self.speakeBykey("wenzi3")
                      if(!node.txc_btn.isVisible()){
                        node.txc_btn.setVisible(true)
                      }
                      if(!node.jielunBtn1.isVisible()){
                        node.jielunBtn1.setVisible(true)
                      }
                   })
                )) 
              break
              case "car":
                node.car_xu.setVisible(true)
                node.car_xu.setPosition(car.x,car.y-1)
                var topos = null
                var jude = -1
                if(single.right){
                   topos = cc.p(73,66)
                   jude = -1
                }else{
                   topos = cc.p(255,66)
                   jude = 1
                }
                var disX = Math.abs(car.x - topos.x)
                var ac = cc.moveTo(disX/car.speed,topos)
                ac.easing(cc.easeOut(1.8))
                car.carToolPlay(disX,jude)
                car.runAction(cc.sequence(
                   ac,
                   cc.callFunc(function(){
                      setBtnVis(node.txc_btn,true)
                      self.speakeBykey("wenzi3")
                      if(!node.jielunBtn2.isVisible()){
                        node.jielunBtn2.setVisible(true)
                      }
                   })
                ))
              break
            }
        }
        var singlePlay = function(car){
           var single = car.getChildByName("single")
           var scaleX = single.getScaleX()
           single.stopAllActions()
           if(single.right){
              single.right = false
              single.setScaleX(-1*Math.abs(scaleX))
              single.setPosition(single.l_pos)
              single.runAction(cc.spawn(
                cc.fadeIn(0.2),
                cc.moveBy(0.5,cc.p(52,0)),
                cc.sequence(
                   cc.delayTime(0.5),
                   cc.fadeOut(0.1),
                   cc.callFunc(function(){
                      single.setPosition(single.r_pos)
                      carPlay(car)
                   })
                )
              ))
           }else{
              single.right = true
              single.setScaleX(Math.abs(scaleX))
              single.setPosition(single.r_pos)
              single.runAction(cc.spawn(
                cc.fadeIn(0.2),
                cc.moveBy(0.5,cc.p(-52,0)),
                cc.sequence(
                   cc.delayTime(0.5),
                   cc.fadeOut(0.1),
                   cc.callFunc(function(){
                      single.setPosition(single.l_pos)
                      carPlay(car)
                   })
                )
              ))
           }
        }

        node.choseBtn.addClickEventListener(function(){
             if(!self.choseTip){
                self.choseTip = createShowImg({
                                  img:res.tip1,
                                  bgInfo:{
                                    sizeScale:cc.p(1.1,1.3),
                                    posOff:cc.p(0,35)
                                  }
                                })
                self.addChild(self.choseTip)

                var btn1 = new ccui.Button(res.tipbtn1_nor,res.tipbtn1_sel,res.tipbtn1_dis)
                btn1.setPosition(160,40)
                self.choseTip.addChild(btn1)
                setBtnVis(btn1,false)

                var btn2 = new ccui.Button(res.tipbtn2_nor,res.tipbtn2_sel,res.tipbtn2_dis)
                btn2.setPosition(430,40)
                btn2.setScale(0.85)
                self.choseTip.addChild(btn2)

                btn1.addClickEventListener(function(){
                  setBtnVis(btn1,false)
                  setBtnVis(btn2,true)
                  self.choseTip.inImg.setTexture(res.tip1)
                })
                btn2.addClickEventListener(function(){
                  setBtnVis(btn2,false)
                  setBtnVis(btn1,true)
                  self.choseTip.inImg.setTexture(res.tip2)
                })
             }
             self.choseTip.show()
        })
        node.jielunBtn1.addClickEventListener(function(){
             if(!self.jielun1){
                self.jielun1 = createShowImg({
                                  img:res.jielun1,
                                  inFun:function(){
                                      self.nodebs.say({
                                        key:"wenzi4",
                                        force:true
                                      })
                                  },
                                  outFun:function(){
                                      self.nodebs.stopSay()
                                  }
                                })
                self.addChild(self.jielun1)
             }
             self.jielun1.show()
        })
        node.jielunBtn2.addClickEventListener(function(){
             if(!self.jielun2){
                self.jielun2 = createShowImg({
                                  img:res.jielun2,
                                  inFun:function(){
                                      self.nodebs.say({
                                        key:"wenzi5",
                                        force:true
                                      })
                                  },
                                  outFun:function(){
                                      self.nodebs.stopSay() 
                                  }
                                })
                self.addChild(self.jielun2)
             }
             self.jielun2.show()
        })
        
        node.tbc_btn.canMoveCar = true
        node.txc_btn.canMoveCar = true
        node.tbc_btn.addClickEventListener(function(){
          setBtnVis(node.tbc_btn,false)
          singlePlay(node.bigcar)
        })
        node.txc_btn.addClickEventListener(function(){
          setBtnVis(node.txc_btn,false)
          singlePlay(node.car)
        })
        

        var addTouch = function(data){
            var item = data.item
            var min = data.min
            var max = data.max
            var xuSp = data.xuSp
            createTouchEvent({
                item:item,
                begin:function(data){
                    var canMove = node.tbc_btn.canMoveCar && node.txc_btn.canMoveCar
                    var result = judgeOpInPos(data) && canMove
                    return result
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta
                    var tempx = item.x + delta.x
                    if(delta.x!=0){
                      item.carToolPlay(delta.x,-1*delta.x/Math.abs(delta.x),true)
                    }
                    if(tempx <= min){
                        tempx = min
                    }
                    if(tempx >= max){
                        tempx = max
                    }
                    item.x = tempx
                    xuSp.setVisible(false)
                },
                end:function(data){
                  var item = data.item
                  var single = item.getChildByName("single")
                  if(item.x <= min + 80){
                    single.right = true
                  }
                  if(item.x >= max - 80){
                    single.right = false
                  }
                }
            })
        }
        addTouch({
            item:node.bigcar,
            min:353,
            max:734,
            xuSp:node.bigcar_xu
        })
        addTouch({
            item:node.car,
            min:73,
            max:255,
            xuSp:node.car_xu
        })
        
    },
    speakeBykey:function(key){
      var self = this
      if(!self[key]){
        self[key] = true
        self.nodebs.say({
                    key: key,
                    force: true
                })
      }
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.speakeBykey("wenzi2")
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,900);
        
        addContent({
            people: this.nodebs,
            key: "wenzi2",
            img:res.wenzi2,
            sound: res.zimp2
        })

        addContent({
            people: this.nodebs,
            key: "wenzi3",
            img:res.wenzi3,
            sound: res.zimp3
        })

        addContent({
            people: this.nodebs,
            key: "wenzi4",
            sound: res.zimp4
        })
        addContent({
            people: this.nodebs,
            key: "wenzi5",
            sound: res.zimp5
        })
    }  
})