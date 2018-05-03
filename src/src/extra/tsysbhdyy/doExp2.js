//@author mu @16/5/11
var doExp2 = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  layerName: "doExp2",
  preLayer: "doLayer",
  ctor: function() { //创建时调用 未删除不会重复调用
    this.load(function() {
       loadPlist("shigao1")
       loadPlist("shigao2")
       loadPlist("shigao3")
       loadPlist("shigao4")
       loadPlist("shigao5")
       loadPlist("lieheng")
       loadPlist("miao")
    })
    var self = this
    this._super()
    this.expCtor()
    this.initUI()
    this.initPeople()
    return true
  },
  initUI:function(){

     var self = this
     self.panRect = cc.rect(100,80,280,170)

     var fdj = createFDJ({
                      father: self,
                      rootScale: 0.2,
                      type:[3],
                      hidebtn:true,
                      perscale: 0.5,
                      max: 0.4,
                      min: 0.1,
                      seePos: [cc.p(450, 300)],
                      getPos: [cc.p(-500,200)],
                    })
      self.fdj = fdj
      fdj.get[0].setVisible(true)
      fdj.see[0].setVisible(false)
      fdj.actMove()
      fdj.createNew({
         key:"desk",
         fun:function(){
          var desk = new cc.Sprite(res.desk)
          desk.setPosition(510,70)
          return desk
         }
      })
      fdj.createNew({
         key:"panzi",
         fun:function(){
          var panzi = self.createPanzi()
          panzi.setPosition(240,140)
          return panzi
         }
      })

     var cup = new cc.Sprite("#daoShigao00.png")
     cup.setPosition(752,340)
     self.addChild(cup)
     var zi2 = new cc.Sprite(res.zi2)
     zi2.setPosition(105,-22)
     zi2.setScale(0.4)
     cup.addChild(zi2)
     cup.zi = zi2
     cup.collRect = cc.rect(cup.x-cup.width/2+40,cup.y-cup.height/2,120,200)
     cup.collRectWan = cc.rect(cup.x-cup.width/2+40,cup.y-cup.height/2+170,120,60)
     cup.startMv = function(data){
        var status = data.status
        var fun1 = data.fun1
        var fun2 = data.fun2
        var fun3 = data.fun3
        var cup = this
        switch(status){
          case "one":
            this.setSpriteFrame("daoShigao01.png")
          break
          case "dao1":
              var spAction = createAnimation({
                                    frame:"daoShigao%02d.png",
                                    start:2,
                                    end: 18,
                                    time: 0.15,
                                    fun:fun1
                                })
              this.runAction(spAction)
          break
          case "dao2":
            this.setSpriteFrame("daoShigao19.png")
          break
          case "dao3":
            var spAction1 = createAnimation({
                                    frame:"daoShigao%02d.png",
                                    start:19,
                                    end: 36,
                                    time: 0.1,
                                    fun:function(){
                                       cup.setSpriteFrame("daoShigao77.png")
                                       if(fun2){
                                         fun2()
                                       }
                                    }
                                })
            var spAction2 = createAnimation({
                                    frame:"daoShigao%02d.png",
                                    start:37,
                                    end: 77,
                                    time: 0.15,
                                    fun:function(){
                                       if(fun3){
                                         fun3()
                                       }
                                    }
                                })
            this.runAction(cc.sequence(
              spAction1,
              cc.delayTime(2),
              spAction2
            ))
          break
        }
     }

     var cup1 = new cc.Sprite(res.jie02)
     cup1.setPosition(593,153.5)
     self.addChild(cup1)
     cup1.setVisible(false)
     cup1.playAc = function(fun){
          var spAction = createAnimation({
                                    ifFile:true,
                                    frame:"jie%02d",
                                    start:3,
                                    end: 18,
                                    time: 0.1,
                                    fun:fun
                                })
          this.runAction(spAction)
     }
     createTouchEvent({
       item:cup1,
       begin:function(data){
         var item = data.item
         var result = judgeOpInPos(data)
         if(item.IsMove){
           result = false
         }
         if(result){
            if(cup){
              cup.zi.setVisible(false)
              cup.removeFromParent()
              cup = null
              item.setVisible(true)
            }
            item.setTexture(res.jie02)  
         }
         return result
       },
       move:function(data){
         var item = data.item
         var delta = data.delta
         var temp = cc.rect(item.x-50,item.y-50,100,100)
         if(cc.rectIntersectsRect(self.panRect,temp) && !item.dao){
            item.IsMove = true
            item.dao = true
            item.setPosition(350,300)
         }
         if(!item.IsMove){
           item.x = item.x + delta.x 
           item.y = item.y + delta.y
         }
       },
       end:function(data){
          var item = data.item
          item.setTexture(res.jie01)
          if(item.dao){
             item.removeListen()
             item.playAc(function(){
                item.removeFromParent()
                self.showBackCount()
                fdj.runData({
                  key:"panzi",
                  fun:function(data){
                    var item = data.item
                    item.setShiVisible(true)
                    item.playZhang()
                  }
                })
             })
          }
       }
     })
     cup1.disListen(true)
   
     var wandou = new cc.Sprite(res.shigaos3)
     wandou.setPosition(450,90)
     self.addChild(wandou)
     var zi3 = new cc.Sprite(res.zi3)
     zi3.setPosition(14,-21)
     zi3.setScale(0.4)
     wandou.addChild(zi3)
     wandou.zi = zi3
     createTouchEvent({
       item:wandou,
       begin:function(data){
         var item = data.item
         if(item.IsMove){
           return false
         }
         item.zi.setVisible(false)
         return true
       },
       move:function(data){
         var item = data.item
         var delta = data.delta
         var temp = item.getPosition()
         if(cc.rectContainsPoint(cup.collRectWan,temp) && !item.come){
           item.IsMove = true
           item.come = true
           item.setVisible(false)
           cup.startMv({
              status:"dao2"
           })
         }
         if(!item.IsMove){
           item.x = item.x + delta.x 
           item.y = item.y + delta.y
         }
       },
       end:function(data){
          var item = data.item
          if(item.come){
            item.removeFromParent()
            cup.startMv({
              status:"dao3",
              fun2:function(){
                self.speakeBykey("wenzi10")
              },
              fun3:function(){
                cup1.disListen(false) 
              }
            })
          }
       }
     })
     wandou.disListen(true)


     var shigaoCup = new cc.Sprite(res.shigaos1)
     shigaoCup.setPosition(885,240)
     self.addChild(shigaoCup)
     var zi1 = new cc.Sprite(res.zi1)
     zi1.setPosition(82,-22)
     zi1.setScale(0.4)
     shigaoCup.addChild(zi1)
     shigaoCup.zi = zi1
     createTouchEvent({
       item:shigaoCup,
       begin:function(data){
         var item = data.item
         var result = judgeOpInPos(data)
         if(item.IsMove){
           result = false 
         }
         if(result){
           item.zi.setVisible(false)
           item.setTexture(res.shigaos2)
         }
         return result
       },
       move:function(data){
         var item = data.item
         var delta = data.delta
         var temp = cc.rect(item.x-item.width/2,item.y-item.height/2,150,250)
         if(cc.rectIntersectsRect(cup.collRect,temp) && !cup.dao){
            item.IsMove = true
            cup.dao = true
            item.setVisible(false)
            cup.startMv({
                      status:"one"  
                    })
         }
         if(!item.IsMove){
           item.x = item.x + delta.x 
           item.y = item.y + delta.y
         }
       },
       end:function(data){
          var item = data.item
          item.setTexture(res.shigaos1)
          if(cup.dao){
            item.removeFromParent()
            cup.startMv({
                      status:"dao1",
                      fun1:function(){
                         self.speakeBykey("wenzi8")
                         wandou.disListen(false)
                      }
                    })
          }
       }
     })

     self.createBtn()

  },
  createBtn:function(){
    var self = this

    var tl = new cc.Sprite(res.title2)
    tl.setPosition(getMiddle(0,285))
    self.addChild(tl)

    var resultbtn = new ccui.Button(res.btn_jielun_normal,
    res.btn_jielun_select)
    resultbtn.setPosition(1000,450)
    this.addChild(resultbtn)
    resultbtn.addClickEventListener(function(){
        self.nodebs.say({
            key: "jielun"
          })
    })

    var fenbtn = new ccui.Button(res.fenbtn_nor,res.fenbtn_sel)
    fenbtn.setPosition(1000,350)
    fenbtn.setScale(0.9)
    this.addChild(fenbtn)
    var jielun2 = createShowImg({
                        img:res.jielun2    
                      })
    self.addChild(jielun2)
    fenbtn.addClickEventListener(function(){
       jielun2.show()
    })
  },
  createPanzi:function(){
    var panzi = new cc.Sprite(res.pan1)

    var shigao = new cc.Sprite(res.pan3)
    shigao.setPosition(350,115)
    panzi.addChild(shigao)
    panzi.shigao = shigao
    shigao.setScale(0.9)
    shigao.setVisible(false)

    var lieheng = new cc.Sprite()
    lieheng.setPosition(163,157)
    shigao.addChild(lieheng)
    panzi.lieheng = lieheng

    var miao = new cc.Sprite()
    miao.setPosition(171,466)
    shigao.addChild(miao)
    panzi.miao = miao

    var panzi1 = new cc.Sprite(res.pan2)
    panzi1.setPosition(350.4,-17)
    panzi.addChild(panzi1)

    var zi = new cc.Sprite(res.zi4)
    zi.setPosition(340,-130)
    panzi.addChild(zi)
    panzi.setScale(0.4)

    panzi.setShiVisible = function(judge){
      this.shigao.setVisible(judge)
    }
    panzi.playZhang = function(){
        var panzi = this
        panzi.runAction(cc.sequence(
          cc.delayTime(1.5),
          cc.callFunc(function(){
             var spAction1 = createAnimation({
                                    frame:"miao%02d.png",
                                    start:0,
                                    end: 19,
                                    time:0.5
                                })
             var spAction2 = createAnimation({
                                    frame:"lh%02d.png",
                                    start:0,
                                    end: 19,
                                    time: 0.5
                                })
             panzi.miao.runAction(spAction1)
             panzi.lieheng.runAction(spAction2)
          })
        ))
    }
    return panzi
  },
  showBackCount:function(){
    var self = this
    self.showTitle = true
    var shows = new cc.Sprite(res.zi5)
    shows.setPosition(getMiddle(40,-40))
    this.addChild(shows)
    shows.setOpacity(0)

    var fdj = self.fdj
    fdj.moveWithEvent = function(item){
      fdj.see[0].setVisible(false)
      if(cc.rectContainsPoint(self.panRect,item.getPosition())){
        fdj.see[0].setVisible(true)
        if(self.showTitle){
          var dotitle = new cc.Sprite(res.dotitle2)
          dotitle.setPosition(getMiddle(40,240))
          self.addChild(dotitle)
          self.speakeBykey("tip2")
          self.showTitle = false
        }
      }
    }  

    var fdjbtn = new ccui.Button(res.fdjbtn_nor,res.fdjbtn_sel)
    fdjbtn.setPosition(100,400)
    this.addChild(fdjbtn)
    fdjbtn.nor = res.fdjbtn_nor
    fdjbtn.sel = res.fdjbtn_sel
    fdjbtn.addClickEventListener(function(){
        var nor = fdjbtn.nor
        var sel = fdjbtn.sel
        if(!fdjbtn.ok){
           nor = fdjbtn.sel
           sel = fdjbtn.nor
           fdj.setGet(cc.p(230,430))
           fdjbtn.ok = true
        }else{
           fdj.setGet(cc.p(-500,200))
           fdjbtn.ok = false
        }
        fdjbtn.loadTextureNormal(nor)
        fdjbtn.loadTexturePressed(sel)
    })

    shows.runAction(cc.sequence(
      cc.delayTime(2),
      cc.fadeIn(0.3),
      cc.delayTime(1.5),
      cc.fadeOut(0.3),
      cc.callFunc(function(){
         shows.setTexture(res.zi6)
      }),
      cc.fadeIn(0.3),
      cc.delayTime(1.5),
      cc.fadeOut(0.3),
      cc.callFunc(function(){
         shows.setTexture(res.zi7)
      }),
      cc.fadeIn(0.3),
      cc.delayTime(1.5),
      cc.fadeOut(0.3),
      cc.callFunc(function(){
         shows.setTexture(res.zi8)
      }),
      cc.fadeIn(0.3),
      cc.delayTime(4),
      cc.fadeOut(0.3),
      cc.callFunc(function(){
         shows.removeFromParent()
      })
    ))
  },
  speakeBykey:function(key){
     this.nodebs.say({
                  key: key,
                  force: true
              })
  },
  myEnter: function() {
    this._super()
    var self = this
    if (this.nodebs) {
        var self = this
        self.nodebs.show(function(){
           self.speakeBykey("wenzi7")
        })     
    }
  },
  initPeople: function() {
    this.nodebs = addPeople({
      id:"student",
      pos: cc.p(1040, 120)
    })
    this.addChild(this.nodebs, 900)

    addContent({
      people: this.nodebs,
      key:"wenzi7",
      img:res.wenzi7,
      sound:res.zimp7,
      btnoffset:cc.p(0,-15),
      offset:cc.p(38,20)
    })
    addContent({
      people: this.nodebs,
      key:"wenzi8",
      img:res.wenzi8,
      sound:res.zimp8,
    })
    addContent({
      people: this.nodebs,
      key:"wenzi10",
      img:res.wenzi10,
      sound:res.zimp10,
    })
    addContent({
      people: this.nodebs,
      key:"tip2",
      sound:res.tipmp2,
    })
    addContent({
      people: this.nodebs,
      key: "jielun",
      img:res.jielun,
      id:"result",
      sound: res.jielunmp,
      offset: cc.p(30, 30),
      offbg: cc.p(20,40),
    })
  }
})