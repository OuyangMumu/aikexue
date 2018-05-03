//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
          loadPlist("spcolor")
          loadPlist("lanhehui")
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
    
        self.dotip = new cc.Sprite(res.dotip)
        self.dotip.setPosition(getMiddle(0,180))
        self.addChild(self.dotip)

        self.parentNode = new cc.Node()
        self.addChild(self.parentNode)

        var fdj = createFDJ({
                    father: self.parentNode,
                    rootScale: 0.3,
                    type:[3],
                    hidebtn:true,
                    perscale: 0.5,
                    max: 0.4,
                    min: 0.1,
                    seePos: [cc.p(-600, -400)],
                    getPos: [cc.p(-600, -600)],
                  })
        self.fdj = fdj
        fdj.get[0].setVisible(false)
        fdj.see[0].setVisible(true)
        fdj.see[0].setScale(0.53)

        fdj.createNew({
          key: "desk",
          fun: function(){
             var desk = new cc.Sprite(res.desk)
             desk.setPosition(getMiddle(-50,-250))
             return desk
          }
        })
        fdj.createNew({
          key: "dianfen",
          fun: function(){
             var dianfen = new cc.Sprite(res.dianfen)
             dianfen.setPosition(getMiddle(-250,-70))
             dianfen.setScale(0.3)
             return dianfen
          }
        })
        fdj.createNew({
          key: "huashifen",
          fun: function(){
             var huashifen = new cc.Sprite(res.huashifen)
             huashifen.setPosition(getMiddle(20,-70))
             huashifen.setScale(0.3)
             return huashifen
          }
        })
        //fdj.actMove()

        var disp1 = new cc.Sprite(res.sdianfen)
        disp1.setPosition(getMiddle(-250,-70))
        self.parentNode.addChild(disp1)
        disp1.setVisible(false)

        var disp2 = new cc.Sprite(res.sdianfen)
        disp2.setPosition(getMiddle(20,-70))
        self.parentNode.addChild(disp2)
        disp2.setVisible(false)

        self.count = 0
        disp1.key = "dianfen"
        disp2.key = "huashifen"
        var diguan = createIWater({
                       father:self.parentNode,
                       sp:[disp1,disp2],
                       nodescale:1,
                       pullTime:0.07,
                       showDraw:false,
                       pos:cc.p(800,280),
                       pullMidFun:function(data){
                          var index = data.index
                          var item = data.item
                          var spAction = null
                          switch(index){
                            case 0:
                                spAction = createAnimation({
                                    frame: "bluese%02d.png",
                                    start: 0,
                                    end: 8,
                                    time: 0.15
                                })
                            break
                            case 1:
                                spAction = createAnimation({
                                    frame: "gray%02d.png",
                                    start: 0,
                                    end: 8,
                                    time: 0.15
                                })
                            break
                          }
                          fdj.runData({
                            key:item.key,
                            fun:function(data){
                              var item = data.item
                              var sp = new cc.Sprite()
                              var spAction = null
                              switch(index){
                                case 0:
                                    spAction = createAnimation({
                                        frame: "lansebig%02d.png",
                                        start: 0,
                                        end: 8,
                                        time: 0.15
                                    })
                                break
                                case 1:
                                    spAction = createAnimation({
                                        frame: "huisebig%02d.png",
                                        start: 0,
                                        end: 8,
                                        time: 0.15
                                    })
                                break
                              }
                              sp.setPosition(item.width/2-5,item.height-15)
                              item.addChild(sp)
                              sp.runAction(spAction)
                            }
                          })
                          self.count++
                       },
                       pullback:function(data){
                          if(self.count==2){
                            var lab = addTimerLabel({
                               str:"       淀粉和滑石粉均为白色粉末状的物质，其中淀粉遇碘变蓝。\n如果把"+
                                   "淀粉和滑石混在一起，再滴加碘酒，会有颜色变化吗？",
                               strPos:getMiddle(-400,220),
                               lastFun:function(){
                                  var checkExpbtn = new ccui.Button(res.checkExp_nor,res.checkExp_sel)
                                  checkExpbtn.setPosition(getMiddle(340,130))
                                  self.parentNode.addChild(checkExpbtn)
                                  checkExpbtn.addClickEventListener(function(){
                                      self.parentNode.removeFromParent()
                                      self.addTwoBlock()
                                  })
                               },
                               startFun:function(){
                                      self.nodebs.say({
                                        key: "jielun1",
                                        force: true
                                      })
                                 }     
                            })
                            self.dotip.removeFromParent()
                            self.parentNode.addChild(lab)    
                          }
                       }
                   })

    
        self.bigfdj = new cc.Sprite(res.bigfdj)
        self.bigfdj.setPosition(-600,-600)
        self.parentNode.addChild(self.bigfdj)
        createTouchEvent({
          item:self.bigfdj,
          begin:function(){
             return true
          },
          move:function(data){
            var item = data.item
            var delta = data.delta
            var tempx = item.x + delta.x
            var tempy = item.y + delta.y
            if(tempx>730 || tempx<240 || tempy>550 || tempy<30){
               return 
            }
            item.x = tempx
            item.y = tempy
            self.fdj.move(delta)
            self.fdj.see[0].setPosition(item.x-84,item.y-26)
          },
          end:function(data){
            var item = data.item
            self.fdj.see[0].setPosition(item.x-84,item.y-26)
          }
        })

        var fdjbtn = new ccui.Button(res.dfdzj_fdj1,res.dfdzj_fdj2)
        self.parentNode.addChild(fdjbtn)
        fdjbtn.setPosition(150,400)
        fdjbtn.addClickEventListener(function(sender,type){
            if(!sender.show){
               self.bigfdj.setPosition(400,300)
               self.fdj.setGet(cc.p(self.bigfdj.x-22,self.bigfdj.y+34))
               self.fdj.see[0].setPosition(self.bigfdj.x-84,self.bigfdj.y-26)
               sender.show = true
            }else{
               self.bigfdj.setPosition(-600,-600)
               self.fdj.setGet(cc.p(self.bigfdj.x-22,self.bigfdj.y+34))
               self.fdj.see[0].setPosition(self.bigfdj.x-84,self.bigfdj.y-26)
               sender.show = false
            }
        })

    },
    addTimerLabel:function(){
        var self = this
        var sbstr = "淀粉和滑石粉均为白色粉末状的物质，其中淀粉遇碘变蓝。\n如果把"+
        "淀粉和滑石混在一起，再滴加碘酒，会有颜色变化吗？"
        var lab = new cc.LabelTTF("","",30)
        lab.setColor(cc.color(255,255,255))
        lab.setPosition(getMiddle(-400,220))
        lab.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT)
        lab.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP)
        lab.setAnchorPoint(0,1)
        lab.time = 0
        lab.runAction(cc.repeatForever(cc.sequence(
          cc.delayTime(0.1),
          cc.callFunc(function(){
              lab.time++
              var changestr = sbstr.substring(0,lab.time)
              if(lab.getString()==changestr){
                lab.stopAllActions()
                var checkExpbtn = new ccui.Button(res.checkExp_nor,res.checkExp_sel)
                checkExpbtn.setPosition(getMiddle(340,130))
                self.parentNode.addChild(checkExpbtn)
                checkExpbtn.addClickEventListener(function(){
                    self.parentNode.removeFromParent()
                    self.addTwoBlock()
                })
              }
              lab.setString(changestr)
          })
        )))
        self.parentNode.addChild(lab) 
    },
    addTwoBlock:function(){
        var self = this

        var desk = new cc.Sprite(res.desk)
        desk.setPosition(getMiddle(-50,-250))
        self.addChild(desk)

        var dianfen1 = new cc.Sprite(res.dianfen1)
        dianfen1.setPosition(getMiddle(-100,-60))
        self.addChild(dianfen1)
        self.dianfen1 = dianfen1

        var tips = new cc.Sprite(res.tips2)
        tips.setPosition(getMiddle(0,150)) 
        self.addChild(tips)
        self.dicount = [false,false,false]

        var diguan1 = createIWater({
                       father:self,
                       sp:[dianfen1],
                       nodescale:1,
                       pullTime:0.06,
                       showDraw:false,
                       pos:cc.p(800,280),
                       pullMidFun:function(data){
                          var index = data.index
                          var item = data.item
                          var sp = new cc.Sprite()
                          sp.setPosition(item.width/2-20,item.height-14)
                          item.addChild(sp)
                          item.cursp = sp
                          var curColornum = self.slider.getNumtxt()
                          if(curColornum<=30){
                             self.dicount[0] = true
                          }else if(curColornum>30 && curColornum<=60){
                             self.dicount[1] = true
                          }else{
                             self.dicount[2] = true
                          }
                          sp.setColor(cc.color(155-curColornum,155-curColornum,155+curColornum))
                          var spAction = createAnimation({
                              frame: "grayse%02d.png",
                              start: 0,
                              end: 9,
                              time: 0.1
                          })        
                          sp.runAction(spAction) 
                       },
                       pullback:function(data){
                          if(self.dicount[0]&&self.dicount[1]&&self.dicount[2]){
                              tips.removeFromParent()
                              var lab = addTimerLabel({
                                 str:"混合物中含有的淀粉越多，滴加碘酒后所产生的颜色越蓝。",
                                 strPos:getMiddle(-320,200),
                                 strSize:27,
                                 startFun:function(){
                                      self.nodebs.say({
                                        key: "jielun2",
                                        force: true
                                      })
                                 }   
                              })
                              self.addChild(lab)  
                          }                                     
                       }
                   })

        var createSlider = function(){
             var sliderLine = new cc.Sprite(res.sliderLine)

             var sliderItem = new cc.Sprite(res.sliderItem)
             sliderItem.setPosition(0,sliderLine.height/2)
             sliderLine.addChild(sliderItem)
             sliderLine._numTxt = 0

             var sliderTip = new cc.Sprite(res.sliderTip)
             sliderTip.setPosition(sliderLine.width/2-40,-50)
             sliderLine.addChild(sliderTip)

             var sliderTxt = new cc.LabelTTF("0 %","",34)
             sliderTxt.setColor(cc.color(255,255,255))
             sliderTxt.setPosition(sliderLine.width/2+85,-52)
             sliderLine.addChild(sliderTxt)

             sliderLine.addChange = function(func){
                  if(func)
                    sliderLine._addChange = func
             }
             sliderLine.getNumtxt = function(){
                return sliderLine._numTxt
             }

             createTouchEvent({
                item:sliderItem,
                rect:cc.rect(sliderItem.x-15,
                  sliderItem.y-15,sliderItem.width+30,sliderItem.height+30),
                begin:function(data){
                  return true
                },
                move:function(data){
                  var item = data.item
                  var delta = data.delta
                  var tempx = 0
                  tempx = item.x + delta.x
                  if(tempx <= 0){
                      tempx = 0
                  }else if(tempx >= sliderLine.width){
                      tempx = sliderLine.width
                  }
                  item.x = tempx
                  var exitItem = parseFloat(item.x/sliderLine.width).toFixed(2)
                  var exitItem1 = parseInt(100*exitItem)
                  sliderLine._numTxt = exitItem1
                  sliderTxt.setString(exitItem1+" %")
                  if(sliderLine._addChange)
                     sliderLine._addChange()
                },
                end:function(){

                }
             })
          
             return sliderLine
        }
        self.slider = createSlider()
        self.slider.setPosition(getMiddle(-100,-160))
        self.addChild(self.slider)
        self.slider.addChange(function(){
            if(self.dianfen1.cursp){
               self.dianfen1.cursp.removeFromParent()
               self.dianfen1.cursp = null
               self.dianfen1.haveWater = false
            }
        })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                // self.nodebs.say({
                //     key: "wenzi4",
                //     force: true
                // })
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
            key: "jielun1",
            sound: res.jielunmp1
        })
        addContent({
            people: this.nodebs,
            key: "jielun2",
            sound: res.jielunmp2
        })
    }  
})