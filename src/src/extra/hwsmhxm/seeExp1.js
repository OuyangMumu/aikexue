var curMusic = null
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this.load(function(){
          loadPlist("cq")
          loadPlist("huoyan")
        })
        this._super()
        this.expCtor() 
        this.initUI() 
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this
        uiName = ["lazhu","lzbtn","lz_angin_btn","lz_word","jielunBtn",
                  "wenXiang","wxbtn","wx_angin_btn","wx_word","shaoPiont"]
        var node = loadNode(res.seeJson,uiName)
        self.addChild(node)

        node.myInit = function(){
          var node = this
          this.lz_angin_btn.setVisible(false)
          this.wx_angin_btn.setVisible(false)
        }
        node.myInit()

        node.shaoPiont.playAc = function(){
          var shaoPiont = this
          shaoPiont.stopAllActions()
          shaoPiont.runAction(cc.sequence(
            cc.delayTime(1.5),
            cc.fadeIn(1),
            cc.fadeOut(1)
          ))
        }

        var checkShowJielun = function(key){
          if(node.wx_angin_btn.isVisible() &&　
            node.lz_angin_btn.isVisible())
          {
             node.jielunBtn.setVisible(true)
          }
          self.speakeBykey(key)
        }

        node.lazhu.addHuo = function(){
          var lazhu = this
          if(!lazhu.huo){
             var huo = new cc.Sprite("#huoyan00.png")
             huo.setPosition(15,120)
             huo.setAnchorPoint(0.5,0)
             lazhu.addChild(huo)
             lazhu.huo = huo
             //huo.setVisible(false)
             huo.addYan = function(){
                var huo = this
                if(huo.yan){
                   huo.yan.stopAllActions()
                   huo.yan.removeFromParent()
                   huo.yan = null
                }
                var lazhuAir = createWaterAir({
                                total: 10,
                                width: 10,
                                height: 10,
                                canOp:true
                              })
                lazhuAir.setScale(0.3,1)
                lazhuAir.setPosition(13,130)
                lazhu.addChild(lazhuAir)
                huo.yan = lazhuAir
                huo.yan.runAction(cc.sequence(
                   cc.delayTime(3),
                   //cc.spawn(
                   cc.fadeOut(4),
                      //cc.scaleTo(2,0.1)
                    //),
                   cc.callFunc(function(){
                        cc.log("remove yan")
                        if(huo.yan){
                           huo.yan.stopAllActions()
                           huo.yan.removeFromParent()
                           huo.yan = null
                        }
                   })
                ))

             }
             huo.playAc1 = function(){
                  var huo = this
                  var ac = createAnimation({
                    frame:"huoyan%02d.png",
                    start:0,
                    end:19,
                    time: 0.1,
                  })
                  huo.stopAllActions()
                  huo.runAction(cc.repeatForever(ac))
             }
             huo.playAc2 = function(){
                var huo = this
                huo.setVisible(true)
                var ac = cc.spawn(
                  cc.rotateTo(1,-55),
                  cc.sequence(
                    cc.scaleTo(1,0.55,0.9),
                    cc.callFunc(function(){
                       huo.setVisible(false)
                       huo.setRotation(0)
                       huo.setScale(1)
                       huo.addYan()
                    })
                  )
                )
                var seq = cc.sequence(
                  cc.delayTime(0.6),
                  ac
                )
                
                huo.runAction(seq)
             }
             huo.playAc1()
          }
        }
        node.lazhu.addHuo()
  
        node.wenXiang.addYan = function(){
              var wenXiang = this
              wenXiang.addAir = function(){
                  if(!wenXiang.yan){
                      var wenAir = createWaterAir({
                                total: 20,
                                width: 5,
                                height: 10,
                                canOp:true
                              })
                      wenAir.setScale(0.2,1)
                      wenAir.setPosition(18,30)
                      wenXiang.addChild(wenAir)
                      wenXiang.yan = wenAir
                  }
              }
              wenXiang.addAir()

              wenXiang.playYao = function(){
                var wenXiang = this
                if(wenXiang.yan){
                  wenXiang.yan.stopAllActions()
                  wenXiang.yan.runAction(cc.sequence(
                     cc.delayTime(0.4),
                     cc.rotateTo(1,-50),
                     cc.spawn(
                        cc.moveTo(3,cc.p(-50,80)),
                        cc.fadeOut(3),
                        cc.callFunc(function(){
                            wenXiang.yan = null
                            wenXiang.addAir()
                        })
                     )
                  ))
                }
              }
        }
        node.wenXiang.addYan()

        node.cqFun = function(pos,fun){
            if(!this.cq){
              this.cq = new cc.Sprite("#cq00.png")
              this.addChild(this.cq)

              this.cq.playSelf = function(fun){
                  var cq = this
                  cq.setVisible(true)
                  var ac = createAnimation({
                    frame:"cq%02d.png",
                    start:0,
                    end: 23,
                    time: 0.08,
                    fun:function(){
                        cq.setVisible(false)
                        if(fun){
                           fun()
                        }
                    }
                  })
                  cq.stopAllActions()
                  cq.runAction(ac)
              }
            }
            this.cq.setPosition(pos)
            this.cq.playSelf(fun)
        }
        
        self.btnAc = true
        node.lzbtn.addClickEventListener(function(){
            if(self.btnAc){
                node.lzbtn.setVisible(false)
                self.btnAc = false
                node.lazhu.huo.playAc2()
                node.cqFun(cc.p(690,550),function(){
                    node.lz_angin_btn.setVisible(true)
                    node.lz_word.setVisible(true)
                    self.btnAc = true
                    checkShowJielun("wenzi1")
                })
            }else{
                self.speakeBykey("tip1",1)
            }   
        })
        node.wxbtn.addClickEventListener(function(){
            if(self.btnAc){
                node.wxbtn.setVisible(false)
                self.btnAc = false
                node.wenXiang.playYao()
                node.shaoPiont.playAc()
                node.cqFun(cc.p(700,245),function(){
                    node.wx_angin_btn.setVisible(true)
                    node.wx_word.setVisible(true)
                    self.btnAc = true
                    checkShowJielun("wenzi2")
                })
            }else{
                self.speakeBykey("tip1",1)
            }
        })
        node.wx_angin_btn.addClickEventListener(function(){
            if(self.btnAc){
                node.wx_angin_btn.setVisible(false)
                node.wx_word.setVisible(false)
                self.btnAc = false
                node.wenXiang.playYao()
                node.shaoPiont.playAc()
                node.cqFun(cc.p(700,245),function(){
                    node.wx_angin_btn.setVisible(true)
                    node.wx_word.setVisible(true)
                    self.btnAc = true
                    checkShowJielun("wenzi2")
                })
            }else{
                self.speakeBykey("tip1",1)
            }
        })
        node.lz_angin_btn.addClickEventListener(function(){
            if(self.btnAc){
                node.lz_angin_btn.setVisible(false)
                node.lz_word.setVisible(false)
                self.btnAc = false
                node.lazhu.huo.playAc2()
                node.cqFun(cc.p(690,550),function(){
                    node.lz_angin_btn.setVisible(true)
                    node.lz_word.setVisible(true)
                    self.btnAc = true
                    checkShowJielun("wenzi1")
                })
            }else{
                self.speakeBykey("tip1",1)
            }
        })

        node.jielunBtn.addClickEventListener(function(){
              self.nodebs.say({
                    key: "jielun1",
                })  
        })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
                
            })
        }
    },
    speakeBykey:function(key,status){
        var self = this
        if(!status){
            this.nodebs.say({
                key: key,
                force: true
            })  
        }else{
            dialogControl.AddDialog("Tips", {
                        res: res[key],
                        face: 1,
                        confirmBtn: true,
                        father: self
                  })
        }       
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 110)
        })
        this.addChild(this.nodebs,500)

        addContent({
            people: this.nodebs,
            key:"wenzi1",
            sound:res.zimp1
          })

        addContent({
            people: this.nodebs,
            key:"wenzi2",
            sound:res.zimp2
          })

        addContent({
          people: this.nodebs,
          key: "jielun1",
          img:res.jielunTip1,
          id:"result",
          sound: res.zimp3,
          offset: cc.p(20, 20),
          offbg: cc.p(30,30),
        })
    }
})