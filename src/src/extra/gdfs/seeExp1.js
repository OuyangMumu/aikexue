var curMusic = null
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super()
        this.expCtor() 
        this.initUI() 
        this.initPeople()
        return true
    },
    initUI:function(){
      var self = this
      var uiName = ["l_tjt","dt_btn","light","tip","ban4","ban2","ban1",
      "jiaDown","jia1","jiaUp","ban3","checkbox","resultBtn"]
      var node = loadNode(res.see1,uiName)
      self.addChild(node)

      safeAdd(self,node.l_tjt)
      node.l_tjt.setLocalZOrder(100)

      self.drawLightRoad = new cc.DrawNode()
      self.addChild(self.drawLightRoad,50)
      self.drawLightRoad.Pt = new cc.Sprite(res.piontTo)
      self.drawLightRoad.addChild(self.drawLightRoad.Pt)
      self.drawLightRoad.Pt.offset = cc.p(-0.8,0)

      self.drawLightRoad1 = new cc.DrawNode()
      self.addChild(self.drawLightRoad1,50)
      self.drawLightRoad1.Pt = new cc.Sprite(res.piontTo)
      self.drawLightRoad1.addChild(self.drawLightRoad1.Pt)
      self.drawLightRoad1.Pt.offset = cc.p(0.9,-0.2)

      self.drawLightRoad2 = new cc.DrawNode()
      self.addChild(self.drawLightRoad2,50)
      self.drawLightRoad2.Pt = new cc.Sprite(res.piontTo)
      self.drawLightRoad2.addChild(self.drawLightRoad2.Pt)
      self.drawLightRoad2.Pt.offset = cc.p(-0.8,0)

      self.drawXuxian = new cc.DrawNode()
      self.addChild(self.drawXuxian,50)

      self.drawXuxian.drawThreeDots = function(data){
           var drawXuxian = this
           var pos1 = data.pos1
           var pos2 = data.pos2
           var pos3 = data.pos3
           var seg = data.seg || 8
           var lineWidth = 1.5
           var color = cc.color(255,0,0)
           drawXuxian.clear()
           var list1 = []
           var list2 = []
           for(var i=0; i<=seg; i++){
              var lamb = i/seg
              var temp = cc.p(pos1.x+lamb*(pos2.x-pos1.x),pos1.y+lamb*(pos2.y-pos1.y))
              list1[i] = temp
              var temp1 = cc.p(pos3.x-lamb*(pos3.x-pos2.x),pos3.y-lamb*(pos3.y-pos2.y))
              list2[i] = temp1
           }
           for(var k = list1.length-1; k>=0; k -= 2){
            if(k-1>=0){
              drawXuxian.drawSegment(list1[k],list1[k-1],lineWidth,color)
              drawXuxian.drawSegment(list2[k],list2[k-1],lineWidth,color)
            }
           }
      }

      self.showOrHideDraw = function(vis){
         this.drawLightRoad.setVisible(vis)
         this.drawLightRoad1.setVisible(vis)
         this.drawLightRoad2.setVisible(vis)
         this.drawXuxian.setVisible(vis)
      }
      self.showOrHideDraw(false)

      node.resultBtn.addClickEventListener(function(){
        self.nodebs.say({
          key:"wenzi9",
        })
      })

      var addTocuh = function(data) {
        var item = data.item
        var rect = data.rect
        var fun = data.fun
        item.ok = true
        createTouchEvent({
          item: item,
          rect: rect,
          begin: function() {
            return true
          },
          end: function(data) {
            var item = data.item
            if (!item.ok) {
              item.ok = true
              item.setTexture(res.checkbox1)
            } else {
              item.ok = false
              item.setTexture(res.checkbox2)
            }
            if (fun) {
              fun(item.ok)
            }
          }
        })
      }
      var boxRect = cc.rect(-20,-20,40,40)
      if(!cc.sys.isNative){
          boxRect = cc.rect(0,0,20,20)
      }else{
          boxRect = cc.rect(-20,-20,60,60)
      }
      addTocuh({
        item: node.checkbox,
        rect: boxRect,
        fun: function(jude) {
          var isLight = self.lights.isVisible()
          self.showOrHideDraw(!jude && isLight)
        }
      })

      var initP = cc.p(550/Math.tan(52*Math.PI/180),70)
      self.lights = createClip({
                           toShowimg:res.lightPoint,
                           ShowimgPos:initP,
                           toSencilimg:res.ban4,
                           sencilPos:initP,
                           father:self,
                           scale:cc.p(1,1)
                       })
      self.lights.setVisible(false)

      var drawLight = function(toDisY,formDisY,roto){
        //直线 y = tan(52)*x + b
        var Rate = Math.tan(52*Math.PI/180)
        var b = 620
        var formDisY = formDisY || 290
        var toDisY = toDisY || 0
        var roto = roto || 0

        var from = cc.p((b - formDisY)/Rate,formDisY)
        var to = cc.p((b - toDisY)/Rate,toDisY)
        var lineWidth = 1.5
        var color = cc.color(255,0,0)
        self.drawLightRoad.clear()
        self.drawLightRoad.drawSegment(from,to, lineWidth, color)
        var offset = self.drawLightRoad.Pt.offset
        self.drawLightRoad.Pt.setPosition((from.x+to.x)/2+offset.x,(from.y+to.y)/2+offset.y)
      }
      drawLight(70,290)

      node.dt_btn.nor = res.dt_btnnor
      node.dt_btn.sel = res.dt_btnsel
      var btnRect = cc.rect(-20,-20,40,40)
      if(!cc.sys.isNative){
          btnRect = cc.rect(-20,-20,40,40)
      }else{
          btnRect = cc.rect(-30,-30,80,80)
      }
      createTouchEvent({
        item:node.dt_btn,
        rect:btnRect,
        begin:function(data){
           var item = data.item
           node.ban1.disListen(false)
           self.speakeBykey("wenzi2")
           if(!item.ok){
              item.ok = true
              item.setTexture(item.sel)
              node.light.setVisible(true)
              node.tip.setVisible(false)
              if(self.lights){
                self.lights.setVisible(true)
                self.showOrHideDraw(!node.checkbox.ok)
              }
           }else{
              item.ok = false
              item.setTexture(item.nor)
              node.light.setVisible(false)
              if(self.lights){
                self.lights.setVisible(false)
                self.showOrHideDraw(false)
              }
           }
        },
      })

      var checkAndDraw = function(item){
        var disY = item.y - 70
        var Rate = Math.tan(52*Math.PI/180)
        var comY = 135
        var comX = item.x
        var to = cc.p(485/Rate,135)
        if(disY-135<=23){
          if(comX<500){
           var offset = cc.p(0,disY-45)
           self.lights.changePosWithsecil(to,90,offset)
          }
        }else{
           self.lights.changePosWithsecil(cc.p(300,-100),0,cc.p(0,0))
        }
        if(disY>135){
           drawLight(0,290)
        }else{
          if(comX<500){
           drawLight(135,290)
          }
        } 
      }
      var banMove = function(data){
          var item = data.item
          var delta = data.delta || cc.p(0,0)
          var tempy = item.y + delta.y
          var tempx = item.x + delta.x
          if(tempy<=170){
            tempy = 170
          }
          if(tempy>=450){
            tempy = 450
          }
          if(tempy>350){
            if(tempx<= item.initPos.x){
              tempx = item.initPos.x
            }
            if(tempx>=620){
              tempx = 620
            }
            item.x = tempx
          }
          if(tempx >= item.initPos.x+30 && tempx <= 590){
             if(tempy<=350){
                tempy = 350
             }
          }
          if(tempx <= item.initPos.x+30){
             if(tempy<=350){
               tempx = item.initPos.x
             }
             item.x = tempx
          }
          if(tempx >= 580){
             if(tempy<=350){
               tempx = 605
             }
             item.x = tempx
          }
          item.y = tempy
          checkAndDraw(item)    
      }
      var moveAll = function(disX){
         node.jiaDown.x = disX + 39.3
         node.jiaUp.x = disX - 46.5
         node.jia1.x = disX + 40.5
      }

      var checkJia = function(){
            var resutl = judgeItemCrash({
                          item1:node.ban4,
                          item2:node.jiaDown
                        })
            if(resutl){
              node.ban4.isIn = true
              node.ban2.disListen(false)
              node.ban3.disListen(false)
              node.ban4.setPosition(605,170)
              self.speakeBykey("wenzi4")
            }
      }
      node.ban4.initPos = node.ban4.getPosition()
      createTouchEvent({
        item:node.ban4,
        begin:function(data){
          return true
        },
        move:function(data){
          var item = data.item
          if(!item.isIn){
            banMove(data)
          }else{
            if(item.canMove){
              var delta = data.delta
              var tempx = item.x + delta.x
              if(tempx<=605){
                 tempx = 605
              }
              if(tempx>=720){
                 tempx = 720
              }
              item.x = tempx
              moveAll(item.x)
              checkAndDraw1(node.ban2)
            }
          }       
        },
        end:function(data){
           var item = data.item
           if(!item.isIn){
              checkJia()
           }else{

           }  
        }
      })
      node.ban4.disListen(true)
      createTouchEvent({
        item:node.ban1,
        begin:function(data){
          var item = data.item
          item.setVisible(false)
          node.ban4.setVisible(true)
          return true
        },
        move:function(data){
           banMove({
             item:node.ban4,
             delta:data.delta
           })
        },
        end:function(data){
          var item = data.item
          banMove({
            item:node.ban4
          })
          node.ban4.disListen(false)
          checkJia()
          item.removeListen()
          item.removeFromParent()
        }
      })
      node.ban1.disListen(true)
      
      var drawLight1 = function(from,to,drawN,roto,vis){
        //直线 y = tan(52)*x + b
        var lineWidth = 1.5
        var drawN = drawN || self.drawLightRoad1
        var roto = roto || 0
        if(vis==null){
          vis = true
        }
        var color = cc.color(255,0,0)
        drawN.clear()
        drawN.drawSegment(from,to, lineWidth, color)
        var offset = drawN.Pt.offset
        drawN.Pt.setPosition(from.x+(to.x - from.x)/3+offset.x,from.y+(to.y - from.y)/3+offset.y)
        drawN.Pt.setRotation(roto)
        drawN.Pt.setVisible(vis)
      }
      
      var checkAndDraw2 = function(item){
        var disY = node.ban2.y
        var Rate = Math.tan(52*Math.PI/180)
        var to = cc.p((620 - disY)/Rate,disY)
        var dy = item.y - to.y + 10
        var dx = dy/Rate
        var setPos = cc.p(to.x+dx,to.y+dy)
        if(!item.canDraw && node.ban4.canMove){
          if(Math.abs(setPos.x - item.x)<=55){
            //左点定点
            var l_pos_y = item.y - to.y - 41
            var l_pos_x = l_pos_y/Rate
            var l_pos = cc.p(to.x+l_pos_x,to.y+l_pos_y)
            drawLight1(to,l_pos,null,-100)

            //右点定点
            var r_pos_y = 49
            var r_pos_x = 49/Rate
            var r_pos = cc.p(setPos.x+r_pos_x,setPos.y-r_pos_y)

            //画虚线
            self.drawXuxian.drawThreeDots({
              pos1:l_pos,
              pos2:setPos,
              pos3:r_pos
            })

            var cha_dis = node.ban3.y - node.ban2.y
            var dis = cha_dis - 290
            var qiuy = (880 + dis - setPos.x)*Rate
            var qiuPos = cc.p(880 + dis,setPos.y-qiuy)
            self.qiu.setPosition(qiuPos)

            if(cha_dis<=328 && cha_dis>=290){
              node.resultBtn.setVisible(true)
              var cury = (890 + dis - setPos.x)*Rate
              var curpos = cc.p(890 + dis,setPos.y-cury)
              drawLight1(r_pos,curpos,self.drawLightRoad2)
            }else{
              var cury = (1200 - setPos.x)*Rate
              var curpos = cc.p(1200,setPos.y-cury)
              drawLight1(r_pos,curpos,self.drawLightRoad2)
              //self.qiu.setPosition(curpos)
            }
          }else{
            var dyy = 640 - to.y
            var dxx = dyy/Rate
            var endpos = cc.p(to.x+dxx,to.y+dyy)
            drawLight1(to,endpos,null,-100)
            self.drawLightRoad2.clear()
            self.drawLightRoad2.Pt.setVisible(false)
            self.drawXuxian.clear()
            self.qiu.setPosition(cc.p(1200,0))
          }
        }
      }
      var checkAndDraw1 = function(item){
        var disY = item.y
        var Rate = Math.tan(52*Math.PI/180)
        var to = cc.p((620 - disY)/Rate,disY)
        var dy = 640 - to.y
        var dx = dy/Math.tan(52*Math.PI/180)
        var setPos = cc.p(to.x+dx,to.y+dy)
        var linX = node.ban4.x - 25
        var linY = (linX-to.x)*Rate + to.y
        var jiaoDian = cc.p(linX,linY)
        var itemTo = item.convertToNodeSpace(to)
        var item4To = node.ban4.convertToNodeSpace(jiaoDian)
        if(node.ban4.canMove){
           node.ban4.light.setPosition(item4To)
        }
        if(disY>=178){
          drawLight(0,290)
          self.drawLightRoad1.clear()
          self.drawLightRoad1.Pt.setVisible(false)
          self.drawLightRoad2.clear()
          self.drawLightRoad2.Pt.setVisible(false)
          self.drawXuxian.clear()
          node.ban4.canMove = false
        }else{
          node.ban4.canMove = true
          drawLight(disY,290)
          self.speakeBykey("wenzi3")
          if(linY<=297){
            node.ban3.canDraw = true
            var endP = cc.p(linX,linY)
            drawLight1(to,endP,null,-100)
            self.drawLightRoad2.clear()
             self.drawLightRoad2.Pt.setVisible(false)
            self.drawXuxian.clear()
          }else{
            node.ban3.canDraw = false
            checkAndDraw2(node.ban3)
          }
        }
        item.light.setPosition(itemTo)
      }
      node.ban2.light = createClip({
                         toShowimg:res.lightPoint,
                         ShowimgPos:cc.p(-50,50),
                         toSencilimg:res.ban2,
                         sencilPos:cc.p(113,44),
                         father:node.ban2,
                         scale:cc.p(1,1)
                       })
      node.ban4.light = createClip({
                         toShowimg:res.lightPoint,
                         ShowimgPos:cc.p(55,300),
                         toSencilimg:res.ban4,
                         sencilPos:cc.p(55,150),
                         father:node.ban4,
                         scale:cc.p(1,1),
                         roto:90
                       })
      self.qiu = createClip({
                     toShowimg:res.qiu2,
                     ShowimgPos:cc.p(1000,73.90),
                     toSencilimg:res.qiu1,
                     sencilPos:cc.p(919.5,73.88),
                     father:node,
                     scale:cc.p(1,1)
                   })
      createTouchEvent({
        item:node.ban2,
        begin:function(data){
          return true
        },
        move:function(data){
          var item = data.item
          var delta = data.delta
          var tempy = item.y + delta.y
          if(tempy>=560){
             tempy = 560
          }
          if(tempy<=60){
            tempy = 60
          }
          item.y = tempy
          checkAndDraw1(item)
        },
        end:function(data){
          var item = data.item
          checkAndDraw1(item)
        }
      })
      node.ban2.disListen(true)
      createTouchEvent({
        item:node.ban3,
        begin:function(data){
          return true
        },
        move:function(data){
          var item = data.item
          var delta = data.delta
          var tempy = item.y + delta.y
          if(tempy>= 560){
             tempy = 560
          }
          if(tempy<= 368){
             tempy = 368
          }
          item.y = tempy
          checkAndDraw2(item) 
        },
        end:function(data){
           var item = data.item
        }
      })
      node.ban3.disListen(true)


    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
               self.speakeBykey("wenzi1")
            })
        }
    },
    speakeBykey:function(key){
      if(!this[key]){
        this[key] = true
        this.nodebs.say({
          key: key,
          force:true 
        })
      }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500)

        addContent({
          people: this.nodebs,
          key: "wenzi1",
          img: res.wenzi1,
          sound: res.zimp1
        })
        addContent({
          people: this.nodebs,
          key: "wenzi2",
          img: res.wenzi2,
          sound: res.zimp2
        })
        addContent({
          people: this.nodebs,
          key: "wenzi3",
          img: res.wenzi3,
          sound: res.zimp3
        })
        addContent({
          people: this.nodebs,
          key: "wenzi4",
          img: res.wenzi4,
          sound: res.zimp4
        })
        addContent({
           people: this.nodebs,
           key: "wenzi9",
           img:res.wenzi9,
           id:"result",
           sound: res.zimp9,
           offset: cc.p(25, 20),
           offbg: cc.p(30,30),
           btnModify:cc.p(0,0)
       })
    }
})