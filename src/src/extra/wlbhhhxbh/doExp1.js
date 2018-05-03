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
      var sanjj8 = new cc.Sprite(res.sanjj8)
      this.addChild(sanjj8)
      sanjj8.setPosition(getMiddle(0,250))

      var sanjj = new cc.Sprite(res.sanjj1)
      this.addChild(sanjj)
      sanjj.setPosition(getMiddle(-100,-30))
      sanjj.checkRect = cc.rect(sanjj.x-80,sanjj.y+60,150,80)

      var createAc = function(data){
        var data = data ||{}
        var offset = data.offset || cc.p(10,100)
        var fun = data.fun
        var seq =  cc.sequence(
                      cc.moveTo(0.1,cc.p(sanjj.x+offset.x,sanjj.y+offset.y)),
                      cc.callFunc(function(){
                         if(fun){
                           fun()
                         }
                      })
                    )
        return seq
      }

      var jjd = createJJD({
                  father:sanjj,
                  pos:cc.p(350,100),
                  staticDg:true
                })
      jjd.setScale(1.2)
      jjd.setCanClick(false)
      jjd.setCallBack({
        up:function(){
          cc.log("upupup")
        },
        down:function(){
          if(jjd.haveF){
             jjd.setCanClick(false)
             jjd.haveF = false
             self.taoCi.taoCiS.runAction(cc.sequence(
               cc.fadeIn(6),
               cc.callFunc(function(){
                  self.jitlunbtn.setVisible(true)
               })
             ))
          }
        },
        fire:function(){
          cc.log("22222222")
         
        },
      })
      createTouchEvent({
        item:jjd,
        begin:function(data){
          var item = data.item
          if(!sanjj.haveS){
            self.speakeBykey(res.tip1,true)
            return false
          }
          if(!sanjj.haveC){
            self.speakeBykey(res.tip2,true)
            return false
          }
          if(item.isFire){
             if(!jjd.haveF){
                item.setPosition(100,40)
                jjd.setCanClick(false)
                item.disListen(true)
                self.taoCi.fireAndPlay(jjd)
             }else{
                jjd.setPosition(350,100)
                jjd.setCanClick(true)
                item.removeListen()
             }
          }
          return true
        }
      })

      var sanjj1 = new cc.Sprite(res.sanjj2)
      sanjj1.setPosition(102.4,77)
      sanjj.addChild(sanjj1)

      var smw = new cc.Sprite(res.sanjj7)
      smw.setPosition(getMiddle(-250,-250))
      this.addChild(smw)
      smw.initPos = smw.getPosition()
      createTouchEvent({
        item:smw,
        begin:function(data){
          return true
        },
        autoMove:true,
        end:function(data){
          var item = data.item
          if(cc.rectContainsPoint(sanjj.checkRect,item)){
            item.removeListen()
            sanjj.haveS = true
            item.runAction(createAc({
               fun:function(){
                self.speakeBykey("wenzi2")
               }
            }))
          }else{
            item.setPosition(item.initPos)
          }
        }
      })

      
      var taoCi = new cc.Sprite(res.sanjj3)
      this.addChild(taoCi)
      this.taoCi = taoCi
      taoCi.setPosition(getMiddle(150,-200))
      taoCi.initPos = taoCi.getPosition()
      createTouchEvent({
        item:taoCi,
        rect:cc.rect(0,-20,taoCi.width,taoCi.height+30),
        begin:function(data){
          if(!sanjj.haveS){
            self.speakeBykey(res.tip1,true)
            return false
          }
          return true
        },
        autoMove:true,
        end:function(data){
          var item = data.item
          var pos = cc.p(item.x,item.y - 60)
          if(cc.rectContainsPoint(sanjj.checkRect,pos)){
            item.removeListen()
            sanjj.haveC = true
            item.runAction(createAc({
              offset:cc.p(5,155),
              fun:function(){
                 self.speakeBykey("wenzi3")
                 jjd.setCanClick(true)
              }
            }))
          }else{
            item.setPosition(item.initPos)
          }
        }
      })

      taoCi.fireAndPlay = function(jjd){
          var taoCi = this
          taoCi.runAction(cc.sequence(
            cc.delayTime(5),
            cc.callFunc(function(){
               taoCi.taoCiS.runAction(cc.scaleTo(8,1))
               taoCi.taoCiZ.runAction(cc.sequence(
                 cc.scaleTo(9,1,0),
                 cc.callFunc(function(){
                    self.speakeBykey("wenzi4")
                    jjd.haveF = true
                    jjd.disListen(false)
                    jjd.runAction(cc.sequence(
                       cc.delayTime(8),
                       cc.callFunc(function(){
                          jjd.stopAllActions()
                          jjd.setCanClick(false)
                          jjd.removeListen()
                          jjd.runAction(cc.sequence(
                              cc.moveTo(0.2,cc.p(350,100)),
                              cc.callFunc(function(){
                                  if(jjd.haveF){
                                    jjd.exeDown()
                                  }
                              })
                          ))
                       })
                    ))
                 })
               ))
            })
          ))
      }

      var taoCiS = new cc.Sprite(res.sanjj6)
      taoCi.addChild(taoCiS)
      taoCiS.setAnchorPoint(0.5,0)
      taoCiS.setPosition(99,-7)
      taoCiS.setScale(0.2)
      taoCiS.setOpacity(80)
      taoCi.taoCiS = taoCiS

      var taoCiZ = new cc.Sprite(res.sanjj5)
      taoCi.addChild(taoCiZ)
      taoCiZ.setAnchorPoint(0.5,0)
      taoCiZ.setPosition(99,-5)
      taoCi.taoCiZ = taoCiZ

      var taoCiQ = new cc.Sprite(res.sanjj4)
      taoCi.addChild(taoCiQ)
      taoCiQ.setPosition(104,11.5)

      var jitlunbtn = new ccui.Button(res.btn_result_normal,res.btn_result_select)
      jitlunbtn.setPosition(1030,420)
      self.addChild(jitlunbtn)
      jitlunbtn.addClickEventListener(function(){
         self.nodebs.say({
                    key: "jielun"
                })
      })
      self.jitlunbtn = jitlunbtn
      jitlunbtn.setVisible(false)
    },
    speakeBykey:function(key,boolTip){
      if(boolTip){
        dialogControl.AddDialog("Tips", {
              res:key,
              face: 1,
              father:this
            })
      }else{
        this.nodebs.say({
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
              self.speakeBykey("wenzi1")
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
            key: "wenzi1",
            img:res.wenzi1,
            sound: res.zimp1,
            offset:cc.p(-10,0)
        })
        addContent({
            people: this.nodebs,
            key: "wenzi2",
            img:res.wenzi2,
            sound: res.zimp2,
            offset:cc.p(-5,0)
        })

        addContent({
            people: this.nodebs,
            key: "wenzi3",
            img:res.wenzi3,
            sound: res.zimp3,
            offset:cc.p(-5,0)
        })

        addContent({
            people: this.nodebs,
            key: "wenzi4",
            img:res.wenzi4,
            sound: res.zimp4
        })

        addContent({
            people: this.nodebs,
            key: "jielun",
            img:res.jielun1,
            id:"result",
            sound:res.jielunmp1,
            offset: cc.p(30, 30),
            offbg: cc.p(20,50),
        })
    }  
})