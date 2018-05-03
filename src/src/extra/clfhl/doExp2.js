//@author mu @16/5/11
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
          loadPlist("persons")
          loadPlist("qipao")
        })
        this._super()
        var self = this
        this.expCtor({
            vis: false,
            setZ:800,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun:function(){
                    if(!self.biaoge){
                        var bg = createBiaoge({
                            json: res.bg_biao1,
                            scale:0.9,
                            inputNum: 16,
                        })
                        self.biaoge = bg
                        safeAdd(self, bg)
                    }
                    self.biaoge.show()
                },
                ifCount:true,
            }
        })
        this.initData()
        this.initUI()
        this.otherUI()
        this.initPeople()
        return true
    },
    initData:function(){
      this.dataAll = {
        people1:{
                 img_nor:null,
                 img_sel:res.pe1_sel,
                 index:1,
                 imgInfo:{
                   imgFrame:"pe1_%d.png",
                   pos:cc.p(-46,108),
                   startpos:cc.p(100,138),
                   posFrom:cc.p(120,142),
                   posTo:cc.p(87,130),
                   mls:[2100,2100,2180],
                   disL:[575,575,560],
                 }
               },
        people2:{
                 img_nor:null,
                 img_sel:res.pe2_sel,
                 index:2,
                 imgInfo:{
                   imgFrame:"pe2_%d.png",
                   pos:cc.p(-40,96),
                   startpos:cc.p(77,133),
                   posFrom:cc.p(96,141),
                   posTo:cc.p(67,127),
                   mls:[1900,1920,1860],
                   disL:[633,628,640],
                 }
               },
        people3:{
                 img_nor:null,
                 img_sel:res.pe3_sel,
                 index:3,
                 imgInfo:{
                   imgFrame:"pe3_%d.png",
                   pos:cc.p(-35,109),
                   startpos:cc.p(92,125),
                   posFrom:cc.p(108,132),
                   posTo:cc.p(83,120),
                   mls:[1930,2010,2010],
                   disL:[625,600,600],
                 }
               },
        people4:{
                 img_nor:null,
                 img_sel:res.pe4_sel,
                 index:4,
                 imgInfo:{
                   imgFrame:"pe4_%d.png",
                   pos:cc.p(-50,109),
                   startpos:cc.p(89,120),
                   posFrom:cc.p(102,125),
                   posTo:cc.p(74,114),
                   mls:[1820,1850,1850],
                   disL:[650,643,643],
                 }
               }
      }
    },
    initUI:function(){
         //界面初始化
      var self = this
      var bindParent = function(node){
          var len = node.getChildrenCount()
          var children = node.getChildren()
          for(var i=0; i<len; i++){
              var childname = children[i].getName()
              node[childname] = children[i]
              bindParent(children[i])
          }
      } 

      this.node = ccs.load(res.do2).node
      bindParent(this.node)
      this.addChild(this.node)
      var node = this.node

      var dotitle = new cc.Sprite(res.dotitle2)
      dotitle.setPosition(getMiddle(100,280))
      self.addChild(dotitle)

      node.chosebg.initFun = function(){
          var chosebg = this
          for(var i=1; i<=4; i++){
             var circle = chosebg[sprintf("itemCircle%d",i)]
             chosebg[sprintf("pe%d",i)] = circle[sprintf("pe%d",i)]
          }
          chosebg.resetPeople = function(index){
             var chosebg = this
             chosebg.curIndex = index
             for(var i=1; i<=4; i++){
                var people = chosebg[sprintf("pe%d",i)]
                var info = people.info
                if(index!=info.index){
                  people.setTexture(info.img_nor)
                  people.disListen(false)
                }
             } 
          }
          chosebg.controlTouch = function(judge){
            var chosebg = this
            var index = chosebg.curIndex
            for(var i=1; i<=4; i++){
                var people = chosebg[sprintf("pe%d",i)]
                if(index!=i){
                  people.disListen(judge)
                }
            }
          }
          chosebg.initPeople = function(){
              var chosebg = this
              for(var i=1; i<=4; i++){
                 var people = chosebg[sprintf("pe%d",i)]
                 people.info = self.dataAll[sprintf("people%d",i)]
                 people.info.img_nor = people.getTexture()
                 createTouchEvent({
                    item:people,
                    rect:cc.rect(-20,-20,people.width+25,people.height+20),
                    begin:function(data){
                       var item = data.item
                       var info = item.info
                       item.setTexture(info.img_sel)
                       chosebg.resetPeople(info.index)
                       node.peopleNode.show(info.imgInfo)
                       self.fdj.runData({
                                        key: "waterG",
                                        fun:function(data){
                                           var item = data.item
                                           item.setXiguanVisble(true)
                                        }
                                      })
                       item.disListen(true)
                       return false
                    }
                 })
              }
          }
          chosebg.initPeople()
      }
      node.chosebg.initFun()

      node.peopleNode.initFun = function(){
         var peopleNode = this
         peopleNode.count = 0
         peopleNode.countBtn1.setVisible(false)
         peopleNode.show = function(imgInfo){
           if(!this.peopleOne){
             this.peopleOne = new cc.Sprite()
             this.peopleOne.setPosition(-20,115)
             this.addChild(this.peopleOne)
             this.kouqi = new cc.Sprite("#kouqi.png")
             this.peopleOne.addChild(this.kouqi)
             this.kouqi.setVisible(false)
             this.kouqi.init = function(imgInfo){
                this.setVisible(false)
                this.setPosition(imgInfo.startpos)
                this.setOpacity(255)
                this.setScale(1)
             }
           }
           peopleNode.count = 0
           peopleNode.countBtn1.setVisible(true)
           peopleNode.countBtn2.setVisible(false)
           this.peopleOne.imgInfo = imgInfo
           cc.log("ffff::",imgInfo.pos)
           this.peopleOne.setPosition(imgInfo.pos)
           this.peopleOne.setSpriteFrame(sprintf(imgInfo.imgFrame,1))
           this.kouqi.setPosition(imgInfo.startpos)
         }
         peopleNode.huXiAc = function(){
            var peopleNode = this
            if(!peopleNode.peopleOne){
             return 
            }
            var imgInfo = peopleNode.peopleOne.imgInfo
            var imgFrame = imgInfo.imgFrame
            var posTo = imgInfo.posTo
            var posFrom = imgInfo.posFrom
            var disL = imgInfo.disL
            var mls = imgInfo.mls
            peopleNode.kouqi.init(imgInfo)
            node.chosebg.controlTouch(true)
            if(self.dushu){
              self.dushu.removeFromParent()
              self.dushu = null
            }
            self.fdj.runData({
                key: "waterG",
                fun:function(data){
                   var item = data.item
                   item.init()
                }
            })
            peopleNode.peopleOne.runAction(cc.sequence(
               cc.delayTime(0.2),
               cc.callFunc(function(){
                  peopleNode.peopleOne.setSpriteFrame(sprintf(imgFrame,2))
               }),
               cc.delayTime(0.1),
               cc.callFunc(function(){
                  peopleNode.peopleOne.setSpriteFrame(sprintf(imgFrame,3))
                  peopleNode.kouqi.setPosition(posFrom)
                  peopleNode.kouqi.setVisible(true)
               }),
               cc.delayTime(0.5),
               cc.callFunc(function(){
                  peopleNode.peopleOne.setSpriteFrame(sprintf(imgFrame,4))
                  peopleNode.kouqi.setPosition(posTo)
               }),
               cc.delayTime(0.1),
               cc.callFunc(function(){
                  peopleNode.peopleOne.setSpriteFrame(sprintf(imgFrame,5))
               }),
               cc.delayTime(0.1),
               cc.callFunc(function(){
                 peopleNode.peopleOne.setSpriteFrame(sprintf(imgFrame,6))
                 self.fdj.runData({
                      key: "waterG",
                      fun:function(data){
                         var item = data.item
                         item.changeLevel(disL[peopleNode.count])
                      }
                  })
                 peopleNode.kouqi.runAction(cc.sequence(
                    cc.scaleTo(3,0),
                    cc.spawn(
                       cc.fadeOut(1.5),
                       cc.scaleTo(2,0)
                    ),
                    cc.callFunc(function(){
                          var spAction = createAnimation({
                                    frame:imgFrame,
                                    start:7,
                                    end: 10,
                                    time: 0.1,
                                    fun:function(){
                                      self.createDushu(mls[peopleNode.count])
                                      peopleNode.count++ 
                                      node.chosebg.controlTouch(false)
                                      if(peopleNode.count<3){
                                         peopleNode.countBtn2.setVisible(true)
                                      }else{
                                         self.fdj.runData({
                                              key: "waterG",
                                              fun:function(data){
                                                 var item = data.item
                                                 item.setXiguanVisble(false)
                                              }
                                         })
                                      }
                                    }
                                })
                          peopleNode.peopleOne.runAction(spAction)
                    })
                 ))
               })
            ))
         }

         peopleNode.countBtn1.addClickEventListener(function(){
             peopleNode.huXiAc()
             peopleNode.countBtn1.setVisible(false)
         })
         peopleNode.countBtn2.addClickEventListener(function(){
             peopleNode.huXiAc()
             peopleNode.countBtn2.setVisible(false)
         })
      }
      node.peopleNode.initFun()
    },
    otherUI:function(){
            var self = this
            var fdj = createFDJ({
              father: self,
              rootScale: 0.2,
              perscale: 0.1,
              max: 0.4,
              min: 0.1,
              seePos: [cc.p(100, 80)],
              getPos: [cc.p(200, 200)],
            })

            self.fdj = fdj
            fdj.get[0].setVisible(false)
            fdj.see[0].setVisible(false)
            fdj.actMove({
              judgeGet: function(data) {
                var index = data.index
                var item = data.item
                var delta = data.delta
                var pos = data.pos
                var ruler = fdj.getOut("ruler")
                var tempPos = item.getParent().convertToWorldSpace(item.getPosition())
                tempPos.x += delta.x
                tempPos.y += delta.y
                var judge = judgeInside({
                  item: ruler,
                  pos: tempPos,
                })
                if (!judge) {
                  var backPos = getBackPos({
                    item: ruler,
                    pos: tempPos,
                  })
                  delta.x += backPos.y
                  delta.y -= backPos.x
                }
                return delta
              }
            })
            //创建水罐
            fdj.createNew({
              key:"waterG",
              fun:function(){
                 var waterG = self.createWaterG()
                 waterG.setPosition(500,170)
                 return waterG
              }
            }) 
    },
    createDushu:function(dushu){
       var self = this
       if(self.dushu){
         return
       }
       self.dushu = new cc.Sprite(res.waterG8)
       self.dushu.setPosition(40,-20)
       self.fdj.see[0].addChild(self.dushu)
       createTouchEvent({
         item:self.dushu,
         begin:function(data){
           var item = data.item
           item.setOpacity(0)
           item.setCascadeOpacityEnabled(false)
           var label = new cc.LabelTTF("读数："+dushu+"ml","",25)
           label.setColor(cc.color(250,0,0))
           label.setAnchorPoint(0,0)
           item.addChild(label)
           item.removeListen()
           return true
         }
       })
    },
    createWaterG:function(){
      var waterG = new cc.Sprite(res.waterG1)

      var qipao = new cc.Sprite()
      qipao.setPosition(455,695)

      var secil = new cc.Sprite(res.waterG7)
      var  gsrclip = new cc.ClippingNode(secil)
      gsrclip.setAlphaThreshold(0)
      waterG.addChild(gsrclip)
      gsrclip.addChild(qipao)
      secil.setPosition(506,790)
      waterG.qipao = qipao
      waterG.secil = secil
      waterG.gsrclip = gsrclip

      var waterLevel = new cc.Sprite(res.waterG5)
      waterLevel.setPosition(507,1145)
      waterG.addChild(waterLevel)
      waterLevel.setVisible(false)
      waterG.waterLevel = waterLevel

      var cup = new cc.Sprite(res.waterG3)
      cup.setPosition(500,716)
      waterG.addChild(cup)

      var xiguan = new cc.Sprite(res.waterG4)
      xiguan.setPosition(730,452)
      waterG.addChild(xiguan)
      waterG.xiguan = xiguan

      var waterGpre = new cc.Sprite(res.waterG2)
      waterGpre.setPosition(510,274)
      waterG.addChild(waterGpre)

      var waterLine = new cc.Sprite(res.waterG6)
      waterLine.setPosition(507,800)
      waterG.addChild(waterLine)
      waterLine.setVisible(false)
      waterG.waterLine = waterLine
      
      waterG.init = function(){
         var waterLevel = this.waterLevel
         var waterLine = this.waterLine
         var gsrclip = this.gsrclip
         var qipao = this.qipao
         waterLevel.setPosition(507,1145)
         waterLevel.setVisible(false)
         waterLine.setPosition(507,800)
         waterLine.setVisible(false)
         gsrclip.setPosition(0,0)
         qipao.setPosition(455,695)
         this.setXiguanVisble(true)
      }
      waterG.changeLevel = function(dis){
         var waterLevel = this.waterLevel
         var waterLine = this.waterLine
         var qipao = this.qipao
         var gsrclip = this.gsrclip
         var layMovedis = 1145-dis
         waterLevel.setVisible(true)
         waterLevel.runAction(cc.sequence(
            cc.moveTo(5,cc.p(507,dis)),
            cc.callFunc(function(){
                waterLine.setVisible(true)
                waterLine.setPositionY(dis-10)
                waterLine.runAction(cc.blink(1,4))
            })
         ))
         gsrclip.runAction(cc.sequence(
           cc.moveBy(5,cc.p(0,-layMovedis)),
           cc.callFunc(function(){
              qipao.setVisible(false)
           })
         ))
         var spAction = createAnimation({
                                    frame:"qipao%02d.png",
                                    start:1,
                                    end: 16,
                                    time: 0.08,
                                })
         qipao.setVisible(true)
         qipao.runAction(cc.spawn(
            cc.repeat(spAction,4),
            cc.moveBy(5,cc.p(0,layMovedis))
         ))
      }
      waterG.setXiguanVisble = function(judge){
         this.xiguan.setVisible(judge)
      }
      waterG.setScale(0.5)

      return waterG
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
         //创建尺子
        var fdj = self.fdj
        fdj.createNew({
          key: "ruler",
          fun: function(){
                var ruler = createRuler({
                  max:20,
                  devide:19,
                  seg: 0.5,
                  add: 1,
                  height: 70,
                  lineModify: cc.p(0, 3),
                  fontModify: cc.p(0, 5),
                  rotate:90,
                })
                ruler.setPosition(200, 230)

                return ruler
          }
        })
        createTouchEvent({
            item: fdj.getOut("ruler"),
            begin: function() {
              return true
            },
            move: function(data) {
              var delta = data.delta
              fdj.runData({
                key: "ruler",
                fun: function(data) {
                  var item = data.item
                  item.x += delta.x
                  item.y += delta.y
                }
              })
              fdj.move(delta)
            },
            end:function(data){
              var item = data.item
              if(item.x>=430 && item.x<=480){
                  fdj.runData({
                    key: "ruler",
                    fun: function(data) {
                      var item = data.item
                      item.x = 453
                    }
                  })
                fdj.get[0].setVisible(true)
              }  
            }
        }) 
        if (this.nodebs) {
            self.nodebs.show(function() {
                self.speakeBykey("wenzi3")
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
            key: "wenzi3",
            img:res.wenzi3,
            sound: res.zimp3
        })
    }  
})