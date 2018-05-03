//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           loadPlist("waterpull")
        })
        this._super()
        this.initUI()
        //this.initPeople()
        return true
    },
    initUI:function(){
      //界面初始化
      var bindParent = function(node){
          var len = node.getChildrenCount()
          var children = node.getChildren()
          for(var i=0; i<len; i++){
              var childname = children[i].getName()
              node[childname] = children[i]
              bindParent(children[i])
          }
      } 

      this.node = ccs.load(res.zzfy_do1).node
      bindParent(this.node)
      this.addChild(this.node)
      var node = this.node
      //水池
      node.bgwater.changeWater = function(frame){
          if(!this.first){
             loadPlist("waterAction")
             this.first = true
             var baoshui = new cc.Sprite()
             var repeatBaowater = createAnimation({
                                      frame:"baoshui%02d.png",
                                      start: 0,
                                      end: 17,
                                      time: 0.05
                                  })
             baoshui.setPosition(27,4)
             this.shuizhu.addChild(baoshui)
             baoshui.runAction(cc.repeatForever(repeatBaowater))

             var liushui = new cc.Sprite()
             var repeatLiuwater = createAnimation({
                                      frame:"liushui%02d.png",
                                      start: 0,
                                      end: 19,
                                      time: 0.05
                                  })
             liushui.setPosition(15,30)
             this.shuizhu.addChild(liushui)
             liushui.runAction(cc.repeatForever(repeatLiuwater))
          }
          var curRota = 100 - frame
          if(!this.shuizhu.isVisible())
              this.shuizhu.setVisible(true)
          this.shuizhu.setScaleX(frame/100)
          this.shuizhu.setRotation(curRota /10 - 8)
          var opacity = frame*10 >= 255 ? 255:frame*10
          this.waterM.setOpacity(opacity)
          this.waterM.y = 109 + frame*0.2
          this.shuizhu.x = 245 - frame*0.01
      }
      //温度计 
      node.wenduji.init = function(){
          if(!this.pao.labelTxt){
             var lab = new cc.LabelTTF("0","",22)
             lab.setColor(cc.color(0,0,0))
             lab.setPosition(25,22)
             this.pao.addChild(lab)
             this.pao.labelTxt = lab
             this.pao.initY = this.pao.y
          }
          this.pao.y = this.pao.initY
          this.pao.labelTxt.setString(0)
          this.wenduLine.setScaleY(0)
      }
      node.wenduji.changeWendu = function(tempture){
           this.wenduLine.setScaleY(tempture)
           this.pao.y = this.pao.initY + tempture*50
           if(this.pao.labelTxt){
             this.pao.labelTxt.setString(parseInt(tempture*100))
           }
      }
      //光照
      node.light.init = function(){
        node.light.setOpacity(0)
      }

      var btnBg = [node.infotip,node.tubiaotip,node.biaogetip,node.quxiantip]
      for (var i = 0; i< btnBg.length; i++) {
           btnBg[i].initHome = function(){
              this.setVisible(false)
              this.setPosition(this.startpos)
              this.setScale(0)
           }
           btnBg[i].out = function(){
                    if(!this.isVisible()){
                        this.setVisible(true)
                        addOpMoving({
                          item:this
                        })
                        this.setLocalZOrder(LOCAL_ORDER++)
                        reAdd(this)
                        var inself = this
                        this.runAction(cc.spawn(
                          cc.scaleTo(0.3,1),
                          cc.moveTo(0.3,inself.endpos)
                        ))
                        if(this.huaikuai){
                          this.sliderUpDown()
                        }
                    }
                  }
           btnBg[i].in = function(){
                      if(this.isVisible){
                        removeMoving(this)
                        var inself = this
                         if(this.huaikuai){
                          this.removeSliderListen()
                        }
                        this.runAction(cc.sequence(
                          cc.scaleTo(0.2,0),
                          cc.callFunc(function(){
                            inself.setVisible(false)
                            inself.setPosition(inself.startpos)
                          })
                        ))
                      }
                  }
           btnBg[i].close.addClickEventListener(function(sender,type){
               var tipBg = sender.getParent()
               tipBg.in()
           })
      }
      //表-信息
      node.infotip.init = function(){
          if(!this.txtList){
            this.txtList = []
            var initListpos = [cc.p(90,320),cc.p(160,255),cc.p(160,220),
                cc.p(160,185),cc.p(210,93),cc.p(210,60),cc.p(210,30)]
            for(var i=0; i<7; i++){
              var lab = new cc.LabelTTF("0","",22)
              lab.setColor(cc.color(0,0,0))
              if(i==0){
                 lab.setColor(cc.color(160,40,40))
                 lab.setFontSize(24)
              }
              lab.setAnchorPoint(cc.p(0,0.5))
              lab.setPosition(initListpos[i])
              this.addChild(lab)
              this.txtList[i] = lab
              lab.num = 0
            }
            this.addinfo()
          }
          this.txtList[5].setString(100)
          this.txtList[6].setString(0)
          this.startpos = cc.p(570,580)
          this.endpos = cc.p(328,280)
          if(!this.first){
             this.first = true
             this.initHome()
          }
      }
      node.infotip.addinfo = function(data){
         var data = data || {}
         var title = data.title || "模拟实验还没开始"
         var water = data.water || 0
         var light = data.light || "0"
         var tempture = data.tempture || 0
         var type = data.type || 0
         var success = data.success || 0
         var fail = data.fail || 100
         var typename= null
         switch(type){
              case 0:
              typename = "玉米"
              break
              case 1:
              typename = "花生"
              break
              case 2:
              typename = "葵瓜子"
              break
         }
         var templist = [title,water,light+"%",tempture+"°C",typename,fail,success]
         if(this.txtList){
            for(var i = 0; i<this.txtList.length; i++){
                this.txtList[i].setString(templist[i])
                this.txtList[i].num = templist[i]
            }
           this.txtList[2].num = light
           this.txtList[3].num = tempture
           this.txtList[4].num = type
         }
      }
      node.infotip.onlyInputOne = function(arg,index){
        this.txtList[index].num = arg
        if(index==2){
           arg = arg + "%"
        }else if(index==3) {
           arg = arg + "°C"
        }else if(index==4){
           switch(arg){
              case 0:
              arg = "玉米"
              break
              case 1:
              arg = "花生"
              break
              case 2:
              arg = "葵瓜子"
              break
           }
        }  
        if(this.txtList)
          this.txtList[index].setString(arg)
      }
      node.infotip.getOneItem = function(index){
         return this.txtList[index].num
      }
      //表-图表
      node.tubiaotip.init = function(){
          if(!this.draws){
             this.draws = new cc.DrawNode()
             this.addChild(this.draws)
          }
          this.addinfo()
          this.startpos = cc.p(700,580)
          this.endpos = cc.p(478,280)
          if(!this.first){
             this.first = true
             this.initHome()
          }
      }
      node.tubiaotip.addinfo = function(data){
         var data = data || {}
         var success = data.success || 0
         var all = data.all || 100
         var fail = all - success
         var max = data.max || 245 
         var successDis = 78 + success*max/all
         var failDis = 78 + fail*max/all
         var successColor = data.successColor || cc.color(0,250,0)
         var failColor = data.failColor || cc.color(0,0,250)
         if(this.draws){
            this.draws.clear()
            this.draws.drawRect(cc.p(80,78),cc.p(175,failDis),failColor,1,failColor)
            this.draws.drawRect(cc.p(210,78),cc.p(300,successDis),successColor,1,successColor)
         }
      }
      //表-表格
      node.biaogetip.init = function(){
        var dataList = this.Panel.dataList
        if(!this.timeList){
           this.timeList = []
           this.successList = []
           this.failList = []
           for (var i = 0; i < 100; i++) {
              var Tlab = new cc.LabelTTF("","",18)
              Tlab.setColor(cc.color(0,0,0))
              Tlab.setPosition(-115,-14-24*i)
              Tlab.setAnchorPoint(cc.p(0,0.5))
              dataList.addChild(Tlab)
              this.timeList[i] = Tlab

              var Flab = new cc.LabelTTF("","",18)
              Flab.setColor(cc.color(0,0,0))
              Flab.setPosition(0,-14-24*i)
              dataList.addChild(Flab)
              this.failList[i] = Flab

              var Slab = new cc.LabelTTF("","",18)
              Slab.setColor(cc.color(0,0,0))
              Slab.setPosition(100,-14-24*i)
              dataList.addChild(Slab)
              this.successList[i] = Slab
           }
           dataList.initY = 245
           dataList.y = dataList.initY
        }
        for(var i = 0; i < 100; i++)
          this.addinfo({index:i})
        this.startpos = cc.p(840,580)
        this.endpos = cc.p(628,280)
        if(!this.first){
           this.first = true
           this.initHome()
        }
      }
      node.biaogetip.addinfo = function(data){
        var data = data || {}
        var time = data.time != null? parseFloat(data.time).toFixed(2) : ""
        var success = data.success != null? data.success : ""
        var fail = data.fail != null? data.fail : ""
        var index = data.index || 0
        if(this.timeList[index]){
            this.timeList[index].setString(time)
            this.successList[index].setString(success)
            this.failList[index].setString(fail)
        }
      }
      node.biaogetip.sliderUpDown = function(){
          var datalistNode = this.Panel.dataList
          createTouchEvent({
            item:this.huaikuai,
            begin:function(){
              return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                var tempY = item.y + delta.y
                if(tempY>=304){
                   tempY = 304
                }else if(tempY<=50){
                   tempY = 50
                }
                item.y = tempY
                datalistNode.y = datalistNode.initY + 8.5*(304 - item.y)
            }
          })
      }
      node.biaogetip.removeSliderListen = function(){
        this.huaikuai.removeListen()
      }
      //表-曲线图
      node.quxiantip.init = function(){
          if(!this.draws){
             this.draws = new cc.DrawNode()
             this.addChild(this.draws)
          }
          this.draws.clear()
          this.initSucPos = cc.p(53,46)
          this.initFailPos = cc.p(53,296)
          this.startpos = cc.p(980,580)
          this.endpos = cc.p(778,280)
          if(!this.first){
           this.first = true
           this.initHome()
          }
      }
      node.quxiantip.addinfo = function(data){
         var data = data || {}
         var time = data.time
         var success = data.success 
         var fail = data.fail
         var index = data.index
         var dx = 53 + time*50
         var successY = 46+success*2.5
         var failY = 46+fail*2.5
         var tempSuc = cc.p(dx,successY)
         var tempFail = cc.p(dx,failY)
         if(this.draws){
            this.draws.drawSegment(this.initSucPos,tempSuc,2,cc.color(0,250,0))
            this.draws.drawSegment(this.initFailPos,tempFail,2,cc.color(0,0,250))
            this.initSucPos = tempSuc
            this.initFailPos = tempFail 
         }
      }
      //计时
      node.timeTip.init = function(){
        if(!this.timeLable){
          this.timeLable = new cc.LabelTTF("0","",40)
          this.timeLable.setColor(cc.color(230,230,200))
          this.timeLable.setPosition(77,95)
          this.addChild(this.timeLable)
        }
        this.disTime = 0
        this.bigDisTime = 0
        this.timeLable.setString(0)
        this.stopAllActions()
      }
      node.timeTip.runDom = function(curRate){
         var tempNum = curRate + 2 
         var other = 0
         var otherall = 0
         var timeList = []
         for(var i=0; i<100; i++){
           if(i<70){
             timeList.push(otherall)
           }else{
             other = Math.floor(Math.random()*tempNum*0.5)
             tempNum = tempNum - other
             otherall = other + otherall
             timeList.push(otherall)
           }
         }
         return timeList
      }
      node.timeTip.addTimer = function(curRate){
         this.stopAllActions()
         var inself = this 
         var timeList = node.timeTip.runDom(curRate)
         this.runAction(cc.repeatForever(cc.sequence(
              cc.delayTime(0.1),
              cc.callFunc(function(){
                inself.disTime = inself.disTime + 5
                var index = inself.disTime/5 - 1
                var vrTime = inself.disTime/100
                node.biaogetip.addinfo({
                  index:index,
                  time:vrTime,
                  success:timeList[index],
                  fail:100-timeList[index]
                })
                node.SeedsPanel.addinfo({
                  time:vrTime,
                  success:timeList[index],
                  fail:100-timeList[index]
                })
                node.quxiantip.addinfo({
                   time:vrTime,
                   success:timeList[index],
                   fail:100-timeList[index]
                })
                node.tubiaotip.addinfo({
                   success:timeList[index],
                   fail:100-timeList[index]
                })
                node.infotip.onlyInputOne(100-timeList[index],5)
                node.infotip.onlyInputOne(timeList[index],6)
                if(vrTime==4){
                   node.startFaya(curRate)
                }
                if(inself.disTime%100==0){
                  inself.bigDisTime++
                  inself.timeLable.setString(inself.bigDisTime)
                }               
                if(vrTime>=5){
                  inself.stopAllActions()
                  node.controlbg.setBtnVisible(node.controlbg.pausebtn,false)
                  inself.disTime = 500
                }
              })
          )))
      }
      node.timeTip.pauseTimer = function(){
         this.stopAllActions()
      }
      //选择种类
      node.SeedsPanel.init = function(index){
         index = index || 0
         if(!this.successLabel){
            this.failLabel = new cc.LabelTTF("100","",30)
            this.failLabel.setColor(cc.color(80,80,80))
            this.failLabel.setPosition(130,70)
            this.failLabel.setAnchorPoint(cc.p(0,0.5))
            this.addChild(this.failLabel)

            this.successLabel = new cc.LabelTTF("0","",30)
            this.successLabel.setColor(cc.color(80,80,80))
            this.successLabel.setPosition(300,70)
            this.successLabel.setAnchorPoint(cc.p(0,0.5))
            this.addChild(this.successLabel)
         }
         this.addinfo()
         this.index = index
         this.seedbg.x = 74 + index*110
         this.DaysProgressBar.setScaleX(0)
         this.MyClickEvent()
      }
      node.SeedsPanel.addinfo = function(data){
          var data = data || {}
          var time = data.time || 0
          var success = data.success || 0
          var fail = data.fail || 100
          var scaleX = (time*100)/500
          if(this.successLabel){
             this.successLabel.setString(success)
             this.failLabel.setString(fail)
             this.DaysProgressBar.setScaleX(scaleX)
          }
      }
      node.SeedsPanel.MyClickEvent = function(){
         if(!this.myEvent){
             this.myEvent = true
             var eventsp = [this.seeds1,this.seeds2,this.seeds3]
             var inself = this
             for (var i = 0; i <eventsp.length; i++) {
                eventsp[i].index = i
                eventsp[i].resetBool = false
                 createTouchEvent({
                    item:eventsp[i],
                    rect:cc.rect(-20,-20,eventsp[i].width+40,eventsp[i].height+40),
                    begin:function(data){
                      var item = data.item
                      if(!item.resetBool){
                          item.setScale(1)
                          eventsp[inself.index].setScale(0.9)
                          node.infotip.onlyInputOne(item.index,4)
                          inself.init(item.index)
                          node.seedVisible(item.index)
                      }else{
                         if(!node.clicktip.isVisible()){
                           node.clicktip.setVisible(true)
                           node.clicktip.setOpacity(0)
                           node.clicktip.runAction(cc.sequence(
                               cc.fadeIn(0.2),
                               cc.delayTime(2),
                               cc.callFunc(function(){
                                  node.clicktip.setVisible(false)
                               })
                            ))
                         }
                      }  
                      return true
                    }
                 })
             }
         }
      }
      node.SeedsPanel.noneEvent = function(juge){
          var eventsp = [this.seeds1,this.seeds2,this.seeds3]
          for(var i in eventsp)
              eventsp[i].resetBool = juge
      }
      //控制按钮
      node.controlbg.setBtnVisible = function(btn,btnBool){
          btn.setBright(btnBool)
          btn.setEnabled(btnBool)
      }
      node.controlbg.init = function(){
        var inself = this
        this.playbtn.addClickEventListener(function(sender,type){
           inself.setBtnVisible(sender,false)
           inself.setBtnVisible(inself.pausebtn,true)
           inself.setBtnVisible(inself.resetbtn,true)
           node.toolbar.enableSliderColor(true)
           node.infotip.onlyInputOne("模拟实验进行中",0)
           node.SeedsPanel.noneEvent(true)
           cc.log("water",node.infotip.getOneItem(1))
           cc.log("tempture",node.infotip.getOneItem(3))
           var curRate = node.countFayaNum({
              type: node.infotip.getOneItem(4),
              water:node.infotip.getOneItem(1),
              tempture:node.infotip.getOneItem(3)
           })
           node.timeTip.addTimer(curRate)
        })
        this.pausebtn.addClickEventListener(function(sender,type){
           inself.setBtnVisible(sender,false)
           inself.setBtnVisible(inself.playbtn,true)
           inself.setBtnVisible(inself.resetbtn,true)
           node.infotip.onlyInputOne("暂停模拟实验",0)
           node.SeedsPanel.noneEvent(true)
           node.timeTip.pauseTimer()
        })
        this.resetbtn.addClickEventListener(function(sender,type){
           inself.setBtnVisible(sender,false)
           inself.setBtnVisible(inself.playbtn,true)
           node.toolbar.enableSliderColor(false)
           node.SeedsPanel.noneEvent(false)
           node.infotip.onlyInputOne("模拟实验还没开始",0)
           node.init(node.SeedsPanel.index)
           node.seedBack(node.SeedsPanel.index)
        })
        this.setBtnVisible(this.pausebtn,false)
        this.setBtnVisible(this.resetbtn,false)
      }
      this.toolbarEvent()
      this.seedsEvnt()    
    },
    toolbarEvent:function(){
      var self = this
      var node =  this.node
      var waterSlider = this.createSlider({
                          sliderBgimg:res.waterSliderbg,
                          sliderimg:res.waterItembg,
                          sliderTxtpos:cc.p(245,8),
                          sliderTipimg:"水",
                          perStr:"滴/小时"
                         })
      waterSlider.setPosition(180,130)
      waterSlider.addChange(function(){
          var waterNum = waterSlider.getNumtxt()
          node.infotip.onlyInputOne(waterNum,1)
          node.bgwater.changeWater(waterNum)
      })
      node.toolbar.waterSlider = waterSlider
      node.toolbar.addChild(waterSlider)

      var lightSlider = this.createSlider({
                          sliderBgimg:res.lightSliderbg,
                          sliderimg:res.lightItembg,
                          sliderTipimg:"光照",
                          perStr:"%",
                         })
      lightSlider.setPosition(180,85)
      lightSlider.addChange(function(){
          var lightNum = lightSlider.getNumtxt()
          node.light.setOpacity(lightNum*2.55)
          node.infotip.onlyInputOne(lightNum,2)
      })
      node.toolbar.lightSlider = lightSlider
      node.toolbar.addChild(lightSlider)

      var wenduSlider = this.createSlider({
                          sliderBgimg:res.wenduSliderbg,
                          sliderimg:res.wenduItembg,
                          sliderTipimg:"温度",
                          perRate:0.50,
                          perStr:"°C"
                         })
      wenduSlider.setPosition(180,35)
      wenduSlider.addChange(function(){
          var scaleNum = wenduSlider.getNumtxt()
          node.wenduji.changeWendu(scaleNum/100)
          node.infotip.onlyInputOne(scaleNum,3)
      })
      node.toolbar.wenduSlider = wenduSlider
      node.toolbar.addChild(wenduSlider)

      node.toolbar.enableSliderColor = function(sliderBool){
        var color = sliderBool ? cc.color(180,180,180):cc.color(255,255,255)
        this.waterSlider.setEnabledMove(sliderBool,color)
        this.lightSlider.setEnabledMove(sliderBool,color)
        this.wenduSlider.setEnabledMove(sliderBool,color)
      }
  
      node.toolbar.infobtn.addClickEventListener(function(){
           node.infotip.out()
      })
      node.toolbar.tubiaobtn.addClickEventListener(function(){
           node.tubiaotip.out()
      })
      node.toolbar.biaogebtn.addClickEventListener(function(){
           node.biaogetip.out()
      })
      node.toolbar.quxianbtn.addClickEventListener(function(){
           node.quxiantip.out()
      })
      node.toolbar.quitbtn.addClickEventListener(function(){
          changeLayer({
              out: self,
              in : layerControl.getLayer("mainLayer")
          })
      })
      node.tipbtn.init = function(){
        this.runAction(cc.repeatForever(
            cc.sequence(
               cc.scaleTo(0.5,0.7),
               cc.scaleTo(0.5,1)
            )
          ))
        this.addClickEventListener(function(){
            if(!self.tip1){
                var tip1 = createResult({
                    img:res.tip1,
                    offbg:cc.p(10,30),
                    offset:cc.p(40,20),
                    btnfun:function(){
                        addShowType({
                            item: self.tip1,
                            show: "zoom",
                            time: 0.3,
                            fun: function() {
                              self.tip1.setPosition(getMiddle())
                              removeMoving(self.tip1)
                            }
                        })
                    }
                })
                tip1.setScale(0)
                tip1.setPosition(getMiddle())
                tip1.setLocalZOrder(LOCAL_ORDER++)
                tip1.changeSelfLocalZero = function(){
                    this.setLocalZOrder(LOCAL_ORDER++)
                }
                self.tip1 = tip1
                self.addChild(self.tip1)
            }
            if(self.tip1.getScale()==1){
                addShowType({
                    item:self.tip1,
                    show:"zoom",
                    time:0.3,
                    fun:function(){
                        self.tip1.setPosition(getMiddle())
                        removeMoving(self.tip1)
                    }
                })      
            }else{
                self.tip1.stopAllActions()
                addShowType({
                    item:self.tip1,
                    show:"scale",
                    time:0.3,
                    fun:function(){
                        self.tip1.setLocalZOrder(LOCAL_ORDER++)
                        addMoving(self.tip1) 
                    }
                })    
            }
        })
      }
      node.ziliaobtn.init = function(){
        this.runAction(cc.repeatForever(
            cc.sequence(
               cc.scaleTo(0.5,0.7),
               cc.scaleTo(0.5,1)
            )
          ))
        this.addClickEventListener(function(){
            if(!self.tip2){
                var tip1 = createResult({
                    img:res.tip2,
                    offbg:cc.p(10,30),
                    offset:cc.p(40,40),
                    btnfun:function(){
                        addShowType({
                            item: self.tip2,
                            show: "zoom",
                            time: 0.3,
                            fun: function() {
                              self.tip2.setPosition(getMiddle())
                              removeMoving(self.tip2)
                            }
                        })
                    }
                })
                tip1.setScale(0)
                tip1.setPosition(getMiddle())
                tip1.setLocalZOrder(LOCAL_ORDER++)
                tip1.changeSelfLocalZero = function(){
                    this.setLocalZOrder(LOCAL_ORDER++)
                }
                self.tip2 = tip1
                self.addChild(self.tip2)
            }
            if(self.tip2.getScale()==1){
                addShowType({
                    item:self.tip2,
                    show:"zoom",
                    time:0.3,
                    fun:function(){
                        self.tip2.setPosition(getMiddle())
                        removeMoving(self.tip2)
                    }
                })      
            }else{
                self.tip2.stopAllActions()
                addShowType({
                    item:self.tip2,
                    show:"scale",
                    time:0.3,
                    fun:function(){
                        self.tip2.setLocalZOrder(LOCAL_ORDER++)
                        addMoving(self.tip2) 
                    }
                })    
            }
        })
      }
      node.init = function(index){
         var index = index || 0
         this.infotip.init()
         this.tubiaotip.init()
         this.biaogetip.init()
         this.quxiantip.init()
         this.timeTip.init()
         this.SeedsPanel.init(index)
      }
      node.timeTip.init()
      node.wenduji.init()
      node.controlbg.init()
      node.SeedsPanel.init()
    },
    seedsEvnt:function(){
      var node = this.node
      node.seedInit = function(index){
        var index = index || 0
        if(!this.seedFirst){
           loadPlist("faya")
           this.seedFirst = true
           this.seedYa1.allSeed1 = []
           this.seedYa2.allSeed2 = []
           this.seedYa3.allSeed3 = []
           for(var i in this.seedYa1.getChildren()){
              var tempChild = this.seedYa1.getChildren()[i]
              this.seedYa1.allSeed1.push(tempChild)
              tempChild.setLocalZOrder(1)
              tempChild.initTure = res.seed1
              tempChild.playFaya = function(){
                 var spAction = createAnimation({
                                    frame: "ymseed%02d.png",
                                    start: 0,
                                    end: 4,
                                    time: 0.15
                                })
                 this.runAction(spAction)
                 this.setLocalZOrder(2)
              }
              tempChild.init = function(){
                this.setTexture(this.initTure)
                this.setLocalZOrder(1)
              }

              var seed2 = new cc.Sprite(res.seed2)
              seed2.setPosition(tempChild.x,tempChild.y-10)
              this.seedYa2.allSeed2.push(seed2)
              this.seedYa2.addChild(seed2)
              seed2.initTure = res.seed2
              seed2.setLocalZOrder(1)
              seed2.playFaya = function(){
                 var spAction = createAnimation({
                                    frame: "hsseed%02d.png",
                                    start: 0,
                                    end: 4,
                                    time: 0.15
                                })
                 this.runAction(spAction)
                 this.setLocalZOrder(2)
              }
              seed2.init = function(){
                this.setTexture(this.initTure)
                this.setLocalZOrder(1)
              }

              var seed3 = new cc.Sprite(res.seed3)
              seed3.setPosition(tempChild.x,tempChild.y-15)
              this.seedYa3.allSeed3.push(seed3)
              this.seedYa3.addChild(seed3)
              seed3.setLocalZOrder(1)
              seed3.initTure = res.seed3
              seed3.playFaya = function(){
                 var spAction = createAnimation({
                                    frame: "gzseed%02d.png",
                                    start: 0,
                                    end: 4,
                                    time: 0.15
                                })
                 this.runAction(spAction)
                 this.setLocalZOrder(2)
              }
              seed3.init = function(){
                this.setTexture(this.initTure)
                this.setLocalZOrder(1)
              }
           }
        }
        this.seedVisible(index) 
      }
      node.seedBack = function(index){
          var type = this.SeedsPanel.index + 1
          var list = this["seedYa"+type]["allSeed"+type]
          for(var k=0;k<list.length;k++){
             list[k].init()
          }
      } 
      node.seedVisible = function(type){
          var seedlist = [this.seedYa1,this.seedYa2,this.seedYa3]
          for(var i=0; i< seedlist.length; i++){
              seedlist[i].setVisible(false)
              if(type==i){
                 seedlist[i].setVisible(true)
              }
          }
      }
      node.countFayaNum = function(data){
          var data = data || {}
          var water = data.water || 0
          var tempture = data.tempture || 0
          var type = data.type || 0
          var count = 0
          var compareWater = function(num,arg1,arg2){
             var rate = 0
             if(0<= num && num<=arg1){
                 rate = num * (100/arg1)
             }else if(arg1<num && num<=arg2){
                 rate = 100
             }else if(arg2<num && num<100){
                 rate = 100 - ((100/(100-arg2)) * (num - arg2))
             }else if(num>=100){
                 rate = 0
             }
             return rate
          }
          var compareFaya1 = function(num){
              var curNum = 0
                if(num<6){
                  curNum = 0
                }else if(6<=num && num<=10){
                  curNum = (num-5) + Math.random()*3
                }else if(10<num && num<25){
                  curNum = (num-10)*5 + Math.random()*3
                }else if(25<=num && num<=30){
                  curNum = 86 - 4*Math.abs(num-28) + Math.random()*3
                }else if(30<num && num<=40){
                  curNum =  74 - (Math.random()*5+2)*(num-30)
                }
              return curNum
          }
          var compareFaya2 = function(num){
              var curNum = 0
              if(num<12){
                curNum = 0
              }else if(12<=num && num<23){
                curNum = (num-11)*6 + Math.random()*5
              }else if(23<=num && num<=35){
                curNum = 85 - 2*Math.abs(num-29) + Math.random()*2
              }else if(35<num && num<48){
                curNum = 80 - (Math.random()*3+3)*(num-35)
              }
               return curNum
          }
          var compareFaya3 = function(num){
            var curNum = 0
            if(num<25){
              curNum = 0
            }else if(25<=num && num<=30){
              curNum = (num-24)*7 - Math.random()*3
            }else if(31<=num && num<=37){
              curNum = 80 - 6*Math.abs(num-35) + Math.random()*3
            }else if(37<num && num<48){
              curNum = 60 - (Math.random()*4+2)*(num-37)
            }
             return curNum
          }
          switch(type){
            case 0:
               var curRate = compareWater(water,65,70)
               var curNum = compareFaya1(tempture)
               count = parseInt((curRate * curNum)/100)
            break
            case 1:
               var curRate = compareWater(water,75,80)
               var curNum = compareFaya2(tempture)
               count = parseInt((curRate * curNum)/100)
            break
            case 2:
               curRate = compareWater(water,80,84)
               var curNum = compareFaya3(tempture)
               count = parseInt((curRate * curNum)/100)
            break
          }
          cc.log("curNum=====",curNum)
               cc.log("count======",count)

          return count
      }
      node.startFaya = function(curRate){
          var type = this.SeedsPanel.index + 1
          var list = this["seedYa"+type]["allSeed"+type]
          var twoList = mixArray(list)
          for(var k=0;k<curRate;k++){
             twoList[k].playFaya()
          }
      }
    },
    myEnter:function(){
         this._super()
         var node = this.node
         node.infotip.init()
         node.tubiaotip.init()
         node.biaogetip.init()
         node.quxiantip.init()
         node.seedInit()
         node.tipbtn.init()
         node.ziliaobtn.init()
    },
    createSlider:function(data){
       var sliderBgimg = data.sliderBgimg
       var sliderimg = data.sliderimg
       var sliderTipimg = data.sliderTipimg
       var sliderTippos = data.sliderTippos
       var sliderTxtpos = data.sliderTxtpos
       var perStr = data.perStr || "%"
       var initnum = data.initnum || 3
       var perRate = data.perRate || 1

       var sliderLine = new cc.Sprite(sliderBgimg)
       var sliderItem = new cc.Sprite(sliderimg)
       sliderItem.setPosition(initnum,sliderLine.height/2)
       sliderLine.addChild(sliderItem)
       
       sliderTippos = sliderTippos || cc.p(-45,9)
       var sliderTip =  new cc.LabelTTF(sliderTipimg,"",22)
       sliderTip.setPosition(sliderTippos)
       sliderLine.addChild(sliderTip)

       sliderLine._numTxt = 0
       sliderTxtpos = sliderTxtpos || cc.p(sliderLine.width+70,8)
       var sliderTxt = new cc.LabelTTF("0","",22)
       sliderTxt.setColor(cc.color(255,255,255))
       sliderTxt.setPosition(sliderTxtpos)
       sliderTxt.setAnchorPoint(1,0.5)
       sliderLine.addChild(sliderTxt)

       var sliderPertxt = new cc.LabelTTF(perStr,"",22)
       sliderPertxt.setColor(cc.color(255,255,255))
       sliderPertxt.setPosition(sliderTxtpos.x+5,sliderTxtpos.y)
       sliderPertxt.setAnchorPoint(0,0.5)
       sliderLine.addChild(sliderPertxt)


       sliderLine.addChange = function(func){
            if(func)
              sliderLine._addChange = func
       }

       sliderLine.getNumtxt = function(){
          return Number(sliderLine._numTxt)
       }
       sliderLine.setEnabledMove = function(moveBool,color){
          sliderItem.disListen(moveBool)
          this.setColor(color)
          sliderItem.setColor(color)
       }
       sliderLine.init = function(){
           sliderLine._numTxt = 0
           sliderTxt.setString(sliderLine._numTxt)
           sliderItem.x = initnum
       }

       createTouchEvent({
          item:sliderItem,
          begin:function(data){
            return true
          },
          move:function(data){
            var item = data.item
            var delta = data.delta
            var tempx = initnum
            tempx = item.x + delta.x
            if(tempx <= initnum){
                tempx = initnum
            }else if(tempx >= sliderLine.width){
                tempx = sliderLine.width
            }
            item.x = tempx
            var exitItem = parseFloat((item.x-initnum)/(sliderLine.width-initnum)).toFixed(2)
            var exitItem1 = parseInt(100*exitItem*perRate)
            sliderLine._numTxt = exitItem1
            sliderTxt.setString(exitItem1)
            if(sliderLine._addChange)
               sliderLine._addChange()
          },
          end:function(){

          }
       })
       return sliderLine
    },
})