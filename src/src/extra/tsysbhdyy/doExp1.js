//@author mu @16/5/11
var doExp1 = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  layerName: "doExp1",
  preLayer: "doLayer",
  ctor: function() { //创建时调用 未删除不会重复调用
    this.load(function() {
       loadPlist("yanwu")
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
      self.testRect = cc.rect(550,85,35,32)
      self.huoRect = cc.rect(755,170,60,70)
      self.waterRect = cc.rect(72,78,350,180)
      self.paperRect = cc.rect(465,22,190,140)
      var fdj = createFDJ({
                      father: self,
                      rootScale: 0.2,
                      type:[3],
                      hidebtn:true,
                      perscale: 0.5,
                      max: 0.4,
                      min: 0.1,
                      seePos: [cc.p(450, 300)],
                      getPos: [cc.p(-500, 200)],
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
         key:"jjd",
         fun:function(){
            var jjd = createJJD({
                        pos:cc.p(780,120)
                      })
            return jjd
         }
      })

      fdj.getOut("jjd").setCallBack({
          fire:function(){
            self.speakeBykey("wenzi2")
            fdj.getOut("jjd").setCanClick(false)
          }
      }) 

      fdj.createNew({
         key:"cup",
         fun:function(){
            var cup = self.createCup({
                  pos:cc.p(300,175),
                  scale:0.9
                })
            return cup
         }
      })

      fdj.createNew({
         key:"paper",
         fun:function(){
          var paper = new cc.Sprite(res.paper)
          paper.setScale(0.4)
          paper.setPosition(568,100)
          return paper
         }
      })

      fdj.createNew({
         key:"tq",
         fun:function(){
          var tq = new cc.Sprite(res.tq1)
          tq.setPosition(568,100)
          tq.setScale(0.22)
          return tq
         }
      })

      fdj.createNew({
         key:"nie",
         fun:function(){
          var nie = self.createNieZi()
          nie.setPosition(840,500)
          return nie
         }
      })
      self.nieMove = true
      createTouchEvent({
        item:fdj.getOut("nie"),
        begin:function(data){
          var item = data.item
          if(!fdj.getOut("jjd").isFire){
             cc.log(!fdj.getOut("jjd").isFire)
             self.wenzi1 = false
             self.speakeBykey("wenzi1")
             return false
          }
          if(!item.haveQiu && item.needGuan){
            self.speakeBykey(res.fdjtip,1)
            return false
          }
          return true
        },
        move:function(data){
          var delta = data.delta
          var item = data.item
          var pos = cc.p(item.x-155,item.y-160)
          ////检测铁球碰撞
          if(cc.rectContainsPoint(self.testRect,pos) 
            && !item.haveQiu){
              self.nieMove = false
              item.haveQiu = true
              fdj.runData({
                key:"nie",
                fun:function(data){
                  var item = data.item
                  item.setPosition(721,255)
                  item.showTieqiu()
                }
              })
              fdj.runData({
                 key:"tq",
                 fun:function(data){
                   var item = data.item
                   item.setVisible(false)
                 }
              })
          }
          //检测火焰碰撞
          if(cc.rectContainsPoint(self.huoRect,pos)
          && item.haveQiu && !item.haveShao && !item.shao){
             self.nieMove = false
             if(!item.needGuan){
                  item.shao = true
                  fdj.runData({
                    key:"nie",
                    fun:function(data){
                      var item = data.item
                      item.setPosition(935,374)
                      item.showTieHong(function(){
                        item.haveShao = true
                        item.shao = false
                        self.nieMove = true
                        self.speakeBykey("wenzi3")
                      })
                    }
                  })
             }else{
                self.wenzi4 = false
                self.speakeBykey("wenzi4")
                fdj.runData({
                  key:"nie",
                  fun:function(data){
                    var item = data.item
                    item.setPosition(835,400)
                  }
                }) 
             }
          }
          //检测水罐碰撞
          if(cc.rectContainsPoint(self.waterRect,pos) 
            && item.haveShao && !item.ruwater){
              self.nieMove = false
              item.ruwater = true
              fdj.runData({
                key:"nie",
                fun:function(data){
                  var item = data.item
                  item.setPosition(540,420)
                  item.setVisible(false)
                }
              })
              fdj.runData({
                key:"cup",
                fun:function(data){
                  var item = data.item
                  item.playAc(function(){
                      var type = item.getNieType()
                      if(type=="tq3"){
                        self.speakeBykey("wenzi6")
                        fdj.getOut("jjd").setCanClick(true)
                      }
                      fdj.runData({
                        key:"nie",
                        fun:function(data){
                          var item = data.item
                          item.setPosition(540,420)
                          item.changeTieqiu(type)
                          item.setVisible(true)
                          item.ruwater = false
                          item.haveShao = false
                          self.nieMove = true
                          self.speakeBykey("wenzi4")
                          item.needGuan = true
                        }
                      })
                  })
                }
              })
          }
          fdj.runData({
            key:"nie",
            fun:function(data){
              var item = data.item
              if(self.nieMove){
                item.x = item.x + delta.x
                item.y = item.y + delta.y
              } 
            }
          })
        },
        end:function(data){
          var item = data.item
          if(item.shao){
            return 
          }
          if(item.ruwater){
            return 
          }
          self.nieMove = true
            //检测纸张碰撞
          var pos = cc.p(item.x-155,item.y-160)
          if(cc.rectContainsPoint(self.paperRect,pos) 
              && item.needGuan){
              item.haveQiu = false
              var curTure = item.getTieqiuTure()
              fdj.runData({
                 key:"nie",
                 fun:function(data){
                   var item = data.item
                   item.hideTieqiu()
                   item.setPosition(840,500)
                 }
              })
              fdj.runData({
                 key:"tq",
                 fun:function(data){
                   var item = data.item
                   item.setVisible(true)
                   item.setTexture(curTure)
                 }
              })
          }
        }
      })
      self.createFdjBtn()
  },
  createFdjBtn:function(){
    var self = this
    var fdj = self.fdj
    fdj.moveWithEvent = function(item){
      fdj.see[0].setVisible(false)
      if(cc.rectContainsPoint(self.paperRect,item.getPosition())){
        fdj.see[0].setVisible(true)
        if(fdj.getOut("nie").needGuan){
           var type = fdj.getOut("cup").getNieType()
           if(type != "tq3"){
             fdj.getOut("nie").needGuan = false
             self.speakeBykey("wenzi5")
           }else{
              fdj.getOut("nie").needGuan = false
              fdj.getOut("nie").removeListen()
              var dotitle = new cc.Sprite(res.dotitle1)
              dotitle.setPosition(getMiddle(40,240))
              self.addChild(dotitle)
              self.speakeBykey("tip1")
           } 
        }
      }
    }

    var tl = new cc.Sprite(res.title1)
    tl.setPosition(getMiddle(0,285))
    self.addChild(tl)

    var fdjbtn = new ccui.Button(res.fdjbtn_nor,res.fdjbtn_sel)
    fdjbtn.setPosition(100,430)
    this.addChild(fdjbtn)
    fdjbtn.nor = res.fdjbtn_nor
    fdjbtn.sel = res.fdjbtn_sel
    fdjbtn.addClickEventListener(function(){
        var nor = fdjbtn.nor
        var sel = fdjbtn.sel
        if(!fdjbtn.ok){
           nor = fdjbtn.sel
           sel = fdjbtn.nor
           fdj.setGet(cc.p(580,250))
           fdjbtn.ok = true
        }else{
           fdj.setGet(cc.p(-500,200))
           fdjbtn.ok = false
        }
        fdjbtn.loadTextureNormal(nor)
        fdjbtn.loadTexturePressed(sel)
    })

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
  createCup:function(data){
    var self = this
    var pos = data.pos
    var father = data.father
    var scale = data.scale
    var cup = new cc.Sprite(res.cup1)
    var cup1 = new cc.Sprite(res.cup2)
    cup1.setPosition(98.6,26.25)
    cup.addChild(cup1,10)

    var nie = self.createNieZi()
    nie.setPosition(380,300)
    cup.addChild(nie,3)
    nie.setScale(0.3)
    cup.nie = nie
    nie.type = "tq1"
    nie.showTieqiu()
    nie.setVisible(false)
    
    cup.setPosition(pos)
    cup.setScale(scale)
    if(father){
       father.addChild(cup)
    }
    cup.playAc = function(fun){
      var cup = this
      cup.nie.setVisible(true)
      cup.nie.tiehong.setOpacity(255)
      cup.nie.runAction(cc.sequence(
        cc.moveTo(1.5,cc.p(270,170)),
        cc.callFunc(function(){
            var yanwu = new cc.Sprite()
            var spAction = createAnimation({
                                    frame:"yanwu%02d.png",
                                    start:0,
                                    end: 32,
                                    time: 0.1,
                                    fun:function(){
                                      yanwu.removeFromParent()
                                    }
                                })
            yanwu.setPosition(100,10)
            cup.addChild(yanwu,6)
            yanwu.runAction(spAction)
            
            cup.nie.tiehong.runAction(cc.fadeOut(1))
            var qipao = new cc.Sprite()
            var spAction1 = createAnimation({
                                    frame:"qipao%02d.png",
                                    start:0,
                                    end: 32,
                                    time: 0.1,
                                    fun:function(){
                                      qipao.removeFromParent()
                                    }
                                })
            qipao.setPosition(100,-10)
            cup.addChild(qipao,8)
            playMusic(res.zimp12)
            qipao.runAction(spAction1)
            cup.runAction(cc.sequence(
               cc.delayTime(0.8),
               cc.callFunc(function(){
                  switch(cup.nie.type){
                    case "tq1":
                      cup.nie.changeTieqiu("tq2")
                      cup.nie.type = "tq2"
                    break
                    case "tq2":
                      cup.nie.changeTieqiu("tq3")
                      cup.nie.type = "tq3"
                    break
                  }
               })
            ))
        }),
        cc.delayTime(3.5),
        cc.moveTo(1,cc.p(380,300)),
        cc.callFunc(function(){
           cup.nie.setVisible(false)
           if(fun){
             fun()
           }
        })
      ))
    }
    cup.getNieType = function(){
      return this.nie.type
    }

    return cup
  },
  createNieZi:function(){
    var niezi = new cc.Sprite(res.nie1)
    niezi.setAnchorPoint(1,1)

    var tieqiu = new cc.Sprite(res.tq1)
    tieqiu.setPosition(25,-10)
    tieqiu.setScale(0.8)
    niezi.addChild(tieqiu)
    niezi.tieqiu = tieqiu
    tieqiu.setVisible(false)

    var tiehong = new cc.Sprite(res.tiehong)
    tiehong.setPosition(59,56)
    tiehong.setOpacity(0)
    tiehong.op = false
    tieqiu.addChild(tiehong)
    niezi.tiehong = tiehong


    var nie = new cc.Sprite(res.nie2)
    nie.setAnchorPoint(1,1)
    nie.setPosition(555,552)
    niezi.addChild(nie)
    niezi.setScale(0.28)
    niezi.nie = nie
    
    niezi.showTieqiu = function(){
      this.tieqiu.setVisible(true)
      this.nie.setRotation(-1)
      this.setRotation(1)
    }
    niezi.getTieqiuTure = function(){
      return this.tieqiu.getTexture()
    }
    niezi.hideTieqiu = function(){
      this.tieqiu.setVisible(false)
      this.nie.setRotation(0)
      this.setRotation(0)
    }
    niezi.changeTieqiu = function(type){
      cc.log("fuckkkk::",type)
      var img = res.tq1
      switch(type){
        case "tq1":
           img = res.tq1
        break
        case "tq2":
           img = res.tq2
        break
        case "tq3":
           img = res.tq3
        break
      }
      this.tiehong.setOpacity(0)
      this.tieqiu.setTexture(img)
    }

    niezi.showTieHong = function(fun){
        var niezi = this
        niezi.tiehong.runAction(cc.sequence(
           cc.fadeIn(3),
           cc.callFunc(function(){
             niezi.tiehong.op = true
             if(fun){
                fun()
             }
           })
        ))
    }
    return niezi
  },
  myEnter: function() {
    this._super()
    var self = this
    if (this.nodebs) {
        var self = this
        self.nodebs.show(function(){
           self.speakeBykey("wenzi1")
        })     
    }
  },
  speakeBykey:function(key,status,closeback){
     var self = this
     if(status!=null){
        dialogControl.AddDialog("Tips", {
          res: key,
          face: 1,
          confirmBtn: true,
          father: self,
          closeBack:closeback
        })
     }else{
       if(!self[key]){
          self[key] = true
          self.nodebs.say({
                  key: key,
                  force: true
              })
       }
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
      key:"wenzi1",
      img:res.wenzi1,
      sound:res.zimp1,
      btnoffset:cc.p(0,-15),
      offset:cc.p(50,20)
    })
    addContent({
      people: this.nodebs,
      key:"wenzi2",
      img:res.wenzi2,
      sound:res.zimp2,
      btnoffset:cc.p(0,0),
      offset:cc.p(0,0),
      offbg:cc.p(0,0),
    })
    addContent({
      people: this.nodebs,
      key:"wenzi3",
      img:res.wenzi3,
      sound:res.zimp3,
      btnoffset:cc.p(0,0),
      offset:cc.p(0,0),
      offbg:cc.p(0,0),
    })
    addContent({
      people: this.nodebs,
      key:"wenzi4",
      img:res.wenzi4,
      sound:res.zimp4,
      btnoffset:cc.p(0,0),
      offset:cc.p(0,0),
      offbg:cc.p(0,0),
    })
    addContent({
      people: this.nodebs,
      key:"wenzi5",
      img:res.wenzi5,
      sound:res.zimp5,
      btnoffset:cc.p(0,0),
      offset:cc.p(0,0),
      offbg:cc.p(0,0),
    })
    addContent({
      people: this.nodebs,
      key:"wenzi6",
      img:res.wenzi6,
      sound:res.zimp6,
      btnoffset:cc.p(0,0),
      offset:cc.p(0,0),
      offbg:cc.p(0,0),
    })

    addContent({
      people: this.nodebs,
      key:"tip1",
      sound:res.tipmp1,
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