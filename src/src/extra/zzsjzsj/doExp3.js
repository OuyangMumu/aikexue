//@author mu @16/5/11
var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp3",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
          loadPlist("hands")
        })
        this._super()
        var self = this
        this.expCtor({
            vis: false,
            setZ:800,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                   if(!self.bggg) {
                       var bgg = createBiaoge({
                           json:res.bg_biao2,
                           scale: 0.9,
                           downData: {
                               nums: 12,
                               bufs:[
                                 [null, res.chose1, res.chose2,res.chose3],
                                 [null, res.chose1, res.chose2,res.chose3],
                                 [null, res.chose1, res.chose2,res.chose3],

                                 [null, res.chose4, res.chose5,res.chose6],
                                 [null, res.chose4, res.chose5,res.chose6],
                                 [null, res.chose4, res.chose5,res.chose6],

                                 [null, res.chose1, res.chose2,res.chose3],
                                 [null, res.chose1, res.chose2,res.chose3],
                                 [null, res.chose1, res.chose2,res.chose3],

                                 [null, res.chose4, res.chose5,res.chose6],
                                 [null, res.chose4, res.chose5,res.chose6],
                                 [null, res.chose4, res.chose5,res.chose6],

                               ],
                               keys: [
                                  2,2,3,1,1,3,3,1,1,3,2,2
                               ]
                           }
                       })
                       self.addChild(bgg)
                       self.bggg = bgg
                   }

                    var bgg = self.bggg
                    bgg.show()
                },
            }
        }) 
        this.initFunlist()
        this.initUI()
        this.initPeople()
        return true
    },
    initFunlist:function(){
      var self = this
      //模板文字显示逻辑
      self.clockList = [false,false,false,false,false,false,false,false]
      //self.imglist = ["wenzi6","wenzi3","wenzi1","wenzi1",]

      //测试红色框
      //self.myDraw = testForDrawNode(self)
      //self.myDraw.drawRectbyRect()
      //self.myDraw.drawDotbyPoint()

      var start2 = function(){
         if(!this.first){
            this.first = true
            this.water = new cc.Sprite("#diwater00.png")
            this.water.setPosition(16.5,-71)
            this.addChild(this.water)
            this.playPush = function(fun){
                var spAction = createAnimation({
                                    frame:"diwater%02d.png",
                                    start:0,
                                    end: 7,
                                    time: 0.06,
                                    fun:function(){
                                        if(fun){
                                         fun()
                                        }
                                    }
                                })
                this.water.runAction(spAction)
            }
            this.playPull = function(fun){
               var spAction = createAnimation({
                                    frame:"diwater%02d.png",
                                    start:8,
                                    end: 37,
                                    time: 0.06,
                                    fun:function(){
                                      if(fun){
                                        fun()
                                      }
                                    }
                                })
               this.water.runAction(spAction)
            }
         }
      }
      self.startFunlist = [
          null,
          start2,
          null,
          null,
          null,
          null,
          null,
          null
      ]

      var move2 = function(){
        var inself = this
        var delta = this.data.delta
        var tempx = this.x + delta.x
        var tempy = this.y + delta.y
        var item1 = self.toolbtn.getindex(0)
        if(tempx>=200 && tempx<=300 && item1){
          if(tempy<=400){
             tempx = 250
             if(tempy<320){
               tempy = 320
               if(!this.haveZgl){
                  this.IsMove = true
                  this.playPush(function(){
                    inself.IsMove = false
                    inself.haveZgl = true
                  })
               }
             }else{

             }
          } 
        }else{
            if(tempy<=440){
             tempy = 440
            } 
        }  
        this.x = tempx
        this.y = tempy
        if(this.haveZgl){
            var pos = cc.p(this.x-35,this.y-this.height+40)
            for(var i=2;i<=7;i++){
              var comSp = self.toolbtn.getindex(i)
              if(comSp && !comSp.haveSe){
                 var comRect = cc.rect(comSp.x-comSp.width/2-5,comSp.y+comSp.height/2-5,50,50)
                 if(cc.rectContainsPoint(comRect,pos)){
                    this.IsMove = true
                    this.setPosition(comSp.x+35,comSp.y+307)
                    self.Ban = true
                    this.playPull(function(){
                        comSp.haveSe = true
                        inself.IsMove = false
                        inself.haveZgl = false
                        comSp.playAc({
                          colorA:comSp.colorData.A,
                          colorB:comSp.colorData.B,
                          colorC:comSp.colorData.C,
                          img:comSp.Tures,
                          lastfun:function(){
                            self.Ban = false
                          }     
                        })
                    })
                    break
                 }
              }
            }
        }
      }
      self.moveFunList = [
           null,
           move2,
           null,
           null,
           null,
           null,
           null,
           null
      ]
      var end1 = function(){
        this.setPosition(200,150)
        this.removeListen()

        var zglx = new cc.Sprite(res.zglx)
        zglx.setPosition(217,163)
        self.cupnode.addChild(zglx)

        var pos = this.convertToWorldSpace(this.cup1.initPos)
        safeAdd(self.cupnode,this.cup1)
        this.cup1.setScale(0.9)
        this.cup1.setPosition(pos)
      }
      var end = function(){
        this.setPosition(650,140)
        this.removeListen()
      }
      self.endFunList = [
           end1,
           null,
           end,
           end,
           end,
           end,
           end,
           end
      ]
      self.checkFun = function(){
          if (this.clock) {
            var curimg = 0
            for (var k = 0; k < self.clockList.length; k++) {           
                if (!self.clockList[k]){
                  curimg = k
                }else{
                  break
                }
                   
            }
            if(self.curChosenum){
               curimg = self.curChosenum
            }
            self.speakeBykey(self.imglist[curimg])
            return false
          }else{
            if(this.excstartFun)
              this.excstartFun()
              this.excEndFun = self.endFunList[this.index]
              this.excMoveFun = self.moveFunList[this.index]
            return this
          }
      }  
    },
    initUI:function(){
        var self = this
        var dotitle = new cc.Sprite(res.dotitle3)
        dotitle.setPosition(getMiddle(0,285))
        self.addChild(dotitle)

        self.seList = [null,null,
          {
            imgs:res.biao3,
            colorData:{A:255,B:0,C:0}
          },
          {
            imgs:res.biao4,
            colorData:{A:255,B:0,C:0}
          },
          {
            imgs:res.biao5,
            colorData:{A:0,B:250,C:0}
          },
          {
            imgs:res.biao6,
            colorData:{A:0,B:250,C:0}
          },
          {
            imgs:res.biao7,
            colorData:{A:200,B:0,C:200}
          },
          {
            imgs:res.biao8,
            colorData:{A:200,B:0,C:200}
          }
        ]
        self.curShiguan = null
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
        this.toolbtn = createTool({
            pos:cc.p(260, 500),
            nums:4,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.3, 1.3),
            itempos:[cc.p(1, -16),cc.p(1, -12),cc.p(1, -8),cc.p(1, -8),
            cc.p(1, -8),cc.p(1, -8),cc.p(1, -8),cc.p(1, -8)],
            circlepos:cc.p(0,18),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                if(index==0){
                   item = self.createZglCup()
                }else if(index==1){
                   item = new cc.Sprite("#hand00.png")
                   item.setAnchorPoint(0.3,0.8)
                }else{
                   if(self.Ban){
                    return false
                   }
                   if(self.curShiguan){
                     self.curShiguan.forceBack()
                   }
                   item = self.createShiguan({
                      imgs: self.seList[index].imgs,
                      colorData:self.seList[index].colorData
                   })
                   self.curShiguan = item
                }
                item.index = index
                item.clock  = self.clockList[index]
                if(self.startFunlist)
                  item.excstartFun = self.startFunlist[index]
                item.checkFun = self.checkFun
                item.setLocalZOrder(LOCAL_ORDER++)

                return item.checkFun()
            },
            clickfun:function(data){
                var item = data.sp
                item.data = data
                data.item = item
                if(item.IsMove){
                  return false
                }
                item.setLocalZOrder(LOCAL_ORDER++)
                if(item.clickFun)
                   item.clickFun()
                return true
            },
            movefun:function(data){
               var item = data.sp
               var delta = data.delta
               var index = data.index
               item.data = data
               if(!item.IsMove){
                  if(index!=1){
                   var temppos = cc.p(item.x + delta.x,item.y + delta.y)
                   item.setPosition(temppos)
                  }
                  if(item.excMoveFun)
                    item.excMoveFun()
               }   
            },
            outfun:function(data){
               var item = data.sp
               item.data = data
               data.item = item
               if(item.excEndFun)
                 item.excEndFun()
               return true
            },
            backfun:function(data){
              var item = data.sp
              if(item.excEndFun)
                 item.excEndFun()
              return false
            },
            father:toolnode,
            files:[res.item5,res.item6,res.item9,res.item10,
            res.item11,res.item12,res.item13,res.item14],
            gets:[null,null,null,null,null,null,null,null]
        })
        this.addChild(this.toolbtn,3)

        this.cupnode = new cc.Node()
        this.addChild(this.cupnode,10)
    },
    createShiguan:function(data){
      var data = data || {}
      var imgres = data.imgs
      var colorData = data.colorData
      var ksg = new cc.Sprite(res.ksg)
      var biao = new cc.Sprite(imgres)
      biao.setPosition(19,213)
      biao.setScale(0.8)
      ksg.addChild(biao)
      ksg.biao = biao
      ksg.Tures = imgres
      ksg.colorData = colorData

      var seWater = new cc.Sprite(res.seWater00)
      seWater.setPosition(21.5,26.5)
      seWater.setScale(0.7,0.75)
      ksg.addChild(seWater)
      ksg.seWater = seWater

      ksg.playAc = function(data){
         var data = data||{}
         var colorA = data.colorA || 0
         var colorB = data.colorB || 0
         var colorC = data.colorC || 0
         var img = data.img
         var lastfun = data.lastfun
         var inself = this
         inself.setVisible(false)
         ksg.seWater.runAction(cc.tintTo(0.1,colorA,colorB,colorC))
         var acnode = ccs.load(res.changeColor).node
         var ac = ccs.load(res.changeColor).action
         acnode.getChildByName("biao").setTexture(img)
         var seWater = acnode.getChildByName("seWater")
         seWater.runAction(cc.tintTo(0.5,colorA,colorB,colorC))
         ac.gotoFrameAndPlay(0,40,false)
         ac.setLastFrameCallFunc(function(){
            acnode.stopAllActions()
            acnode.removeFromParent()
            inself.setVisible(true)
            if(lastfun){
              lastfun()
            }
            ac.clearLastFrameCallFunc()
         })
         if(inself.getParent()){
           acnode.setPosition(inself.x+60,inself.y+50)
           inself.getParent().addChild(acnode)
           acnode.runAction(ac)
         }
      }
      return ksg
    },
    createZglCup:function(){
      var cup = new cc.Sprite(res.zglcup)

      var zgl = new cc.Sprite(res.zgl1)
      zgl.setPosition(105,80)
      zgl.setScale(1.1,1.18)
      cup.addChild(zgl)

      var cup1 = new cc.Sprite(res.zglcup1)
      cup1.initPos = cc.p(107.7,106.7)
      cup1.setPosition(cup1.initPos)
      cup.addChild(cup1)
      cup.cup1 = cup1
      cup.setScale(0.9)

      return cup
    },
    speakeBykey:function(key){
       this.nodebs.say({
                    key: key,
                    force: true
                })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.toolbtn.show()
            self.nodebs.show(function() {
               self.speakeBykey("wenzi5")
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
            key: "wenzi5",
            img:res.wenzi5,
            sound: res.zimp5
        })
    }  
})