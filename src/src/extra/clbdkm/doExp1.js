//@author mu @16/5/11
var tag_Move = 888
/*
  创建一个单摆类
  参数摆线资源、摆锤资源、偏差坐标等
*/
var createSimplePendulum = function(data){
    var lineImg = data.lineImg
    var itemImg = data.itemImg
    var stopImg = data.stopImg
    var baifuImg = data.baifuImg
    var baiLineImg = data.baiLineImg
    var baiChuiImg = data.baiChuiImg
    var baiXianImg = data.baiXianImg
    var pullBtnImg = data.pullBtnImg
    var pullBtnFun = data.pullBtnFun
    var xuXianImg = data.xuXianImg
    var showLayout = data.showLayout
    if(showLayout == null){
      showLayout = true
    }
    var pullBtnpos = data.pullBtnpos || cc.p(0,-350)
    var stopTagPos = data.stopTagPos || cc.p(0,-355)
    var lineoffset = data.lineoffset || cc.p(0,0)
    var itemoffset = data.itemoffset || cc.p(0,0)
    var pos = data.pos || cc.p(568,320)
    var ifTeach = data.ifTeach || false
    var ifLable = data.ifLable || false
    var maxAngel = data.maxAngel || 30
    var clickFun = data.clickFun
    var moveFun = data.moveFun
    var endFun = data.endFun
    var stopTagFun = data.stopTagFun
    var showChangeAngel = data.showChangeAngel || false
    var angelNode_txtImg = data.txtImg
    var angelNode_btnImgnor = data.btnImgnor
    var angelNode_btnImgsel = data.btnImgsel
    var ifShowCount = data.ifShowCount
    if(ifShowCount == null){
      ifShowCount = true
    }

    var Pendulum = new cc.Node()
    Pendulum.maxAngel = maxAngel
    Pendulum.ifTeach = ifTeach
    Pendulum.stopTagFun = stopTagFun
    Pendulum.teachInit = function(data){
        var Pendulum = this
        var line2 = new cc.Sprite(lineImg)
        line2.setAnchorPoint(0.5,1)
        line2.setPosition(lineoffset.x,lineoffset.y)
        Pendulum.addChild(line2,1)
        Pendulum.line2 = line2
        line2.setVisible(false)
        line2.setOpacity(90)
        line2.setCascadeOpacityEnabled(true)
        var item2 = new cc.Sprite(itemImg)
        item2.setPosition(line2.width/2 + itemoffset.x,-item2.height/2+itemoffset.y)
        line2.addChild(item2)
        if(baifuImg){
          var baifu = new cc.Sprite(baifuImg)
          baifu.setAnchorPoint(0,0)
          baifu.setPosition(0,-70)
          Pendulum.addChild(baifu,15)
          baifu.setVisible(false)
          Pendulum.baifu = baifu
          Pendulum.baifu.initpos = baifu.getPosition()
        }
        if(baiLineImg){
          var baiLine = new cc.Sprite(baiLineImg)
          Pendulum.line.addChild(baiLine)
          baiLine.setPosition(-14,90)
          baiLine.setScale(0.8)
          baiLine.setVisible(false)
          Pendulum.baiLine = baiLine
        }
        if(baiXianImg){
          var baiXian = new cc.Sprite(baiXianImg)
          Pendulum.line.addChild(baiXian)
          baiXian.setPosition(142.4,103.2)
          baiXian.setVisible(false)
          Pendulum.baiXian = baiXian
        }
        if(baiChuiImg){
          var baiChui = new cc.Sprite(baiChuiImg)
          Pendulum.line.addChild(baiChui,10)
          baiChui.setPosition(142.4,-62.5)
          baiChui.setVisible(false)
          Pendulum.baiChui = baiChui
        }
        
        Pendulum.drawJiao = new cc.DrawNode()
        Pendulum.addChild(Pendulum.drawJiao)
        //Pendulum.drawJiao.setVisible(false)
        Pendulum.drawJiao.jiao = -70
    }
    Pendulum.showOrhideTeach = function(jude){
        var Pendulum = this
        if(Pendulum.ifTeach){
          Pendulum.line2.setVisible(jude)
          Pendulum.baifu.setVisible(jude)
          Pendulum.baifu.setPosition(Pendulum.baifu.initpos)
          Pendulum.baiLine.setVisible(jude)
          Pendulum.baiChui.setVisible(jude)
          Pendulum.baiXian.setVisible(jude)
        }
        if(Pendulum.xuline){
          Pendulum.xuline.setVisible(jude)
        }
        if(Pendulum.drawJiao){
          Pendulum.drawJiao.clear()
        }
        if(Pendulum.lab){
          Pendulum.lab.setVisible(jude)
        }
    }
    Pendulum.drawShow = function(angel){
        var Pendulum = this
        if(Pendulum.drawJiao){
            var distance = Pendulum.drawJiao.jiao
            var r1 = angel*Math.PI/180
            var r2  = 0
            if(angel>=90){
               r2 = (180 + angel/2)*Math.PI/180
            }else{
               r2 = angel/2*Math.PI/180
            }
            var end = cc.p(distance*Math.sin(r1),distance*Math.cos(r1))
            var mid = cc.p(distance*Math.sin(r2),distance*Math.cos(r2))
            var points = [cc.p(0,distance),mid,end]
            if(!Pendulum.drawJiao.notOther){
              Pendulum.baifu.setPosition(mid)
            }
            Pendulum.drawJiao.clear()
            Pendulum.drawJiao.drawCardinalSpline(points,0.5,10,2,cc.color(255,0,0)) 
        } 
    }
    if(xuXianImg){
      var xuline = new cc.Sprite(xuXianImg)
      xuline.setAnchorPoint(0.5,1)
      xuline.setPosition(lineoffset.x,lineoffset.y)
      Pendulum.addChild(xuline)
      xuline.setVisible(false)
      Pendulum.xuline = xuline

      Pendulum.drawJiao = new cc.DrawNode()
      Pendulum.addChild(Pendulum.drawJiao)
      Pendulum.drawJiao.notOther = true
      Pendulum.drawJiao.jiao = -50
    }

    var lay = createLayout({
      size:cc.size(600,360),
      op:0,
      clip:showLayout
    })
    lay.setAnchorPoint(0.5,1)
    Pendulum.addChild(lay)
    
    var lineNode = new cc.Node()
    lineNode.setPosition(lay.width/2+lineoffset.x,lay.height+lineoffset.y)
    lay.addChild(lineNode)
    Pendulum.lineNode = lineNode

    var line = new cc.Sprite(lineImg)
    line.setAnchorPoint(0.5,1)
    line.initpos = cc.p(0,0)
    line.setPosition(line.initpos)
    lineNode.addChild(line,10)
    Pendulum.line = line
    line.time = 0.6
    line.lineLength = 3
    if(ifTeach){
       Pendulum.teachInit()
    }
    if(ifShowCount){
      var countlab = new cc.LabelTTF("已摆动0次","",22)
      countlab.setColor(cc.color(200,200,18))
      countlab.setPosition(-80,-30)
      countlab.setVisible(false)
      Pendulum.addChild(countlab,20)
      Pendulum.countlab = countlab
      Pendulum.countlab.count = 0
    }

    if(ifLable){
      var lab = new cc.LabelTTF("0°","",20)
      lab.setColor(cc.color(250,0,0))
      lab.setPosition(-10,-25)
      lab.setVisible(false)
      Pendulum.addChild(lab,20)
      Pendulum.lab = lab
    }
   
    Pendulum.changeAngeltoLable = function(Angel,labnotVis){
      var Pendulum = this
      if(Pendulum.lab){
        if(Angel>90){
          Angel = Angel - 360
        }
        if(!Pendulum.lab.isVisible()){
          Pendulum.lab.setVisible(true)
        }
        var str = parseFloat(-1*Angel).toFixed(1)
        Pendulum.lab.setString(str+"°")
        if(labnotVis == true){
          Pendulum.lab.setVisible(false)
        }
      } 
    }

    var item = new cc.Sprite(itemImg)
    item.setPosition(line.width/2 + itemoffset.x,-item.height/2+itemoffset.y)
    line.addChild(item,5)
    item.father = line
    item.grandFather = Pendulum
    Pendulum.item = item
    item.typeList = [res.lm1,res.lm2,res.lm3]
    item.curType = 0
    item.itemList = [null]
    item.ifRun = false
    item.addItem = function(sp){
      var item = this
      item.curType++
      if(item.curType<=2){
        item.setTexture(item.typeList[item.curType])
        item.itemList[item.curType] = sp
        Pendulum.changeTag()
        return true 
      }else{
        item.curType = 2
        return false
      }
    }
    item.pullItem = function(){
      var item = this
      if(item.curType>0){
        var temp = item.itemList[item.curType]
        item.curType--
        item.setTexture(item.typeList[item.curType])
        return temp
      }else{
        return null
      }
    }
    Pendulum.getBaiChui = function(){
      return this.item
    }
    Pendulum.pullItem = function(){
      return this.item.pullItem()
    }

    var stopTag = new ccui.Button(stopImg,stopImg)
    stopTag.setPosition(stopTagPos)
    Pendulum.addChild(stopTag)
    Pendulum.stopTag = stopTag
    stopTag.setVisible(false)
    stopTag.addClickEventListener(function(sender,tye){
       Pendulum.resetAll()
       if(Pendulum.stopTagFun){
        Pendulum.stopTagFun()
       }
    })
    if(pullBtnImg){
      var pullBtn = new ccui.Button(pullBtnImg,pullBtnImg)
      pullBtn.setPosition(pullBtnpos)
      Pendulum.addChild(pullBtn)
      Pendulum.pullBtn = pullBtn
      pullBtn.setVisible(false)
      pullBtn.addClickEventListener(function(sender,tye){
        var temp = Pendulum.pullItem()
        Pendulum.changeTag()
        if(temp){
           if(pullBtnFun){
              pullBtnFun(temp)
           }
        }
      })
    }
    Pendulum.changeTag = function(){
      var Pendulum = this
      var item = Pendulum.item
      var jude = item.curType>0 ? true:false
      if(Pendulum.pullBtn){
         Pendulum.pullBtn.setVisible(jude)
      }
    }
    Pendulum.resetAll = function(){
      var Pendulum = this
      Pendulum.stopTag.setVisible(false)
      Pendulum.item.ifRun = false
      Pendulum.stopSelf()
      Pendulum.changeTag()
    }
    Pendulum.playAc = function(angel){
        var Pendulum = this
        //var line = Pendulum.line
        var lineNode = Pendulum.lineNode
        lineNode.stopAllActions()
        if(angel>90){
           angel = angel - 360
        }
        line.changeAngel = angel
        var seq = cc.sequence(
          cc.rotateTo(line.time,-angel).easing(cc.easeInOut(2)),
          cc.rotateTo(line.time,angel).easing(cc.easeInOut(2)),
          cc.callFunc(function(){
             if(Pendulum.countlab){
              Pendulum.countlab.setVisible(true)
              Pendulum.countlab.count++
              Pendulum.countlab.setString(sprintf("已摆动%d次",Pendulum.countlab.count))
             }
             
             lineNode.stopAllActions()
             if(Math.abs(line.changeAngel)>0.05){
               line.changeAngel = line.changeAngel*0.98
               line.time = line.time * 0.998
               Pendulum.playAc(line.changeAngel)
             }else{
               Pendulum.resetAll()
             }
    
          })
        )
        lineNode.runAction(seq)
    }
    Pendulum.stopSelf = function(){
      var Pendulum = this
      //var line = Pendulum.line
      var lineNode = Pendulum.lineNode
      Pendulum.lineNode.stopAllActions()
     // Pendulum.line.stopAllActions()
      //Pendulum.line.setRotation(0)
      lineNode.setRotation(0)
      Pendulum.item.disListen(false)
    }
    Pendulum.setLineAngel = function(angel){
      var Pendulum = this
      Pendulum.resetAll()
      var lineNode = Pendulum.lineNode
      var item = Pendulum.item
      lineNode.setRotation(angel)
      item.curAngel = angel
      Pendulum.changeAngeltoLable(item.curAngel,true)
    }
    item.curAngel = 0
    createTouchEvent({
      item:item,
      begin:function(data){
        var item = data.item
        var pos = data.pos
        var result = judgeOpInPos(data)
        if(result){
          Pendulum.showOrhideTeach(true)
          if(Pendulum.countlab){
            Pendulum.countlab.setVisible(false)
            Pendulum.countlab.count = 0
          }
          var MovPos = item.grandFather.convertToNodeSpace(pos)
          item.curAngel = 180*(1+Math.atan2(MovPos.x,MovPos.y)/Math.PI)
          if(Pendulum.pullBtn){
            Pendulum.pullBtn.setVisible(false)
          }
          if(clickFun){
            clickFun(data)
          } 
        }
        return result
      },
      move:function(data){
        var item = data.item
        var delta = data.delta
        var pos = data.pos
        var MovPos = item.grandFather.convertToNodeSpace(pos)
        var Angel = 180*(1+Math.atan2(MovPos.x,MovPos.y)/Math.PI)
        cc.log("Angel",Angel)
        if(Math.abs(Angel) <= Pendulum.maxAngel || Math.abs(360 - Angel) <= Pendulum.maxAngel){
          item.curAngel = Angel
        }else{
          if(Angel>90){
            item.curAngel = -Pendulum.maxAngel
          }else{
            item.curAngel = Pendulum.maxAngel
          }
        }
        Pendulum.setLineAngel(item.curAngel)
        Pendulum.changeAngeltoLable(item.curAngel)
        Pendulum.drawShow(item.curAngel)
        if(moveFun){
          moveFun(data)
        }
      },
      end:function(data){
        var item = data.item
        item.disListen(true)
        Pendulum.showOrhideTeach(false)
        Pendulum.stopTag.setVisible(true)
        item.ifRun = true
        Pendulum.line.time = Pendulum.line.lineLength * 0.25
        Pendulum.playAc(item.curAngel)
        if(endFun){
          endFun(data)
        }
      }
    })
    if(showLayout){
        var lineMove = new cc.Sprite(lineImg)
        lineMove.setPosition(line.width/2,line.height/2)
        line.addChild(lineMove)
        lineMove.fathers = line
        lineMove.curCount = 0

        lineNode.tip = new cc.LabelTTF(" 3 倍摆长","",26)
        lineNode.tip.setPosition(-5,-30)
        lineNode.tip.setColor(cc.color(240,7,160))
        lineNode.addChild(lineNode.tip)
        lineNode.tip.setVisible(false)

        lineNode.setTipStr = function(str){
          var lineNode = this
          var num = Number(str)
          if(num == 3){
            rate = 3
          }else if(num == 2){
            rate = 2
          }else if(num == 1){
            rate = 1
          }
          lineNode.tip.setString(num + " 倍摆长")
          Pendulum.line.lineLength = num
        }

        createTouchEvent({
          item:lineMove,
          rect:cc.rect(-15,0,line.width+30,line.height),
          begin:function(data){
            if(Pendulum.item.ifRun){
              return false
            }
            var item = data.item
            lineNode.tip.setVisible(true)
            item.fathers.endp = item.fathers.y
            return true
          },
          move:function(data){
            var item = data.item
            var delta = data.delta
            var finalMax = 180
            var finalMin = 0
            var tempFinal = item.curCount + delta.y
            if(tempFinal > finalMax){
              delta.y = finalMax - item.curCount
            }else if(tempFinal < finalMin){
              delta.y = finalMin - item.curCount
            }
            item.curCount =  item.curCount + delta.y
            var rate = parseFloat((finalMax - item.curCount)/90 + 1).toFixed(2)
            lineNode.setTipStr(rate)
            item.fathers.y += delta.y       
          },
          end:function(data){
            var item = data.item
            var dx = item.fathers.endp - item.fathers.y
            var anY = item.fathers.getAnchorPoint().y + 1/item.fathers.height * dx
            item.fathers.setAnchorPoint(0.5,anY)
            item.fathers.setPosition(item.fathers.initpos)
            lineNode.tip.setVisible(false)
          }
        })
    }

    if(showChangeAngel){
      var  angelNode = new cc.Node()
      Pendulum.addChild(angelNode)
      Pendulum.angelNode = angelNode
      angelNode.setPosition(10,50)
      angelNode.setScale(0.6)
      angelNode.offset = 5
      angelNode.Max = 20
      angelNode.Min = -20
      
      angelNode.tip = new cc.LabelTTF("设定角度:","",28)
      angelNode.tip.setPosition(-132,0)
      angelNode.addChild(angelNode.tip)

      angelNode.txt = new cc.Sprite(angelNode_txtImg)
      angelNode.addChild(angelNode.txt)
      angelNode.txt_txt = new cc.LabelTTF(0,"",32)
      angelNode.txt_txt.setPosition(angelNode.txt.width/2-20,angelNode.txt.height/2)
      angelNode.txt_txt.setColor(cc.color(0,0,0))
      angelNode.txt.addChild(angelNode.txt_txt)
      angelNode.txt_txt.num = 0
      angelNode.txt_txt.setString(angelNode.txt_txt.num)

      angelNode.upBtn = new ccui.Button(angelNode_btnImgnor,angelNode_btnImgsel)
      angelNode.upBtn.setPosition(61,26.5)
      angelNode.addChild(angelNode.upBtn)
      angelNode.upBtn.addClickEventListener(function(){
         angelNode.changeTxt(1)
      })

      angelNode.downBtn = new ccui.Button(angelNode_btnImgnor,angelNode_btnImgsel)
      angelNode.downBtn.setPosition(61,-18)
      angelNode.downBtn.setRotation(180)
      angelNode.addChild(angelNode.downBtn)
      angelNode.downBtn.addClickEventListener(function(){
         angelNode.changeTxt(-1)
      })

      angelNode.changeTxt = function(num){
        var angelNode  = this
        var str = angelNode.txt_txt.getString()
        var value = Number(str) + num * angelNode.offset
        if(value >= angelNode.Max){
          value = angelNode.Max
        }else if(value <= angelNode.Min){
          value = angelNode.Min
        }
        angelNode.txt_txt.setString(value)
        var endVale = value < 0 ? (-value) : (360 - value)
        Pendulum.setLineAngel(endVale)
      }
    }
    return Pendulum
}
var doExp1 = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  layerName: "doExp1",
  preLayer: "doLayer",
  ctor: function() { //创建时调用 未删除不会重复调用
    this._super()
    var self = this
    this.expCtor({
      vis: false,
      setZ: 800,
      settingData: {
        pos: cc.p(1080, 580),
        biaogeFun: function() {
          if (!self.bggg) {
            var colors = []
            var fontTypeList = []
            var inputLineChange = []
            for (var i = 0; i < 7; i++) {
              colors[i] = cc.color(0,0,0)
              fontTypeList[i] = "left"
              inputLineChange[i] = false
              if(i == 6){
                inputLineChange[i] = true
              }
            }
            var bgg = createBiaoge({
              json: res.biao1,
              scale: 0.9,
              inputNum:7,
              rootColor:colors,
              inputLineChange:inputLineChange
            })
            self.addChild(bgg)
            self.bggg = bgg
          }
          var bgg = self.bggg
          bgg.show()
        },
      }
    })
    this.initUI()
    this.initPeople()
    return true
  },
  initUI:function(){
      var self = this
      var tjt = new cc.Sprite(res.tjt)
      tjt.setPosition(500,260)
      self.addChild(tjt)

      self.baiTip = new cc.Sprite(res.baitip)
      self.baiTip.setPosition(805,280)
      self.addChild(self.baiTip)
      self.baiTip.setVisible(false)

      var  Pendulum = createSimplePendulum({
                        lineImg:res.line1,
                        itemImg:res.lm1,
                        baifuImg:res.db_bf,
                        baiLineImg:res.db_line,
                        baiChuiImg:res.db_bc,
                        baiXianImg:res.db_bx,
                        itemoffset:cc.p(-5,0),
                        stopImg:res.vr_stop,
                        ifTeach:true,
                        ifShowCount:false,
                        showLayout:false,
                        clickFun:function(){
                            if(self.label){
                              self.label.removeFromParent()
                              self.label = null
                            }
                            self.label = addTimerLabel({
                                          str:"摆长：从悬挂点到悬挂物的重心的\n直线距离。\n\n摆幅：摆线与竖直方向之间的夹角",
                                          strSize:25,
                                          strSpeed:0.01,
                                          strPos:getMiddle(50,160)
                                        })
                            self.addChild(self.label)
                            self.baiTip.setVisible(false)
                        },
                        endFun:function(){
                            self.baiTip.setVisible(true)
                            self.speakeBykey("wenzi2")
                        },
                        stopTagFun:function(){
                            if(self.label){
                              self.label.removeFromParent()
                              self.label = null
                            }
                        }
                      })
      Pendulum.setPosition(92,414.5)
      tjt.addChild(Pendulum)

      var clockTimeBtn = new ccui.Button(res.miaobiao_nor,res.miaobiao_sel)
      clockTimeBtn.nor = res.miaobiao_nor
      clockTimeBtn.sel = res.miaobiao_sel
      clockTimeBtn.setPosition(80,400)
      self.addChild(clockTimeBtn)

      self.clockTime = createWatch()
      self.clockTime.setScale(0.5)
      self.clockTime.setPosition(-500,-300)
      self.addChild(self.clockTime,100)
      addOpMoving({
        item:self.clockTime
      })
      self.clockTime.showOrhideself = function (jude) {
        this.setVisible(jude)
        var pos = jude ? cc.p(240,260):cc.p(-500,-300)
        this.setPosition(pos)
      }
      clockTimeBtn.addClickEventListener(function(sender,type){
        var nor = sender.nor
        var sel = sender.sel
        if(!sender.open){
          sender.open = true
          nor = sender.sel
          sel = sender.nor
        }else{
          sender.open = false
        }
        self.clockTime.showOrhideself(sender.open)
        sender.loadTextureNormal(nor)
        sender.loadTexturePressed(sel)
      })
  },
  speakeBykey: function(key) {
    var self = this
    self.nodebs.say({
      key: key,
      force: true
    })
  },
  myEnter: function() {
    this._super()
    if (this.nodebs) {
      var self = this
        //self.toolbtn.show()
      self.nodebs.show(function() {
        self.speakeBykey("wenzi1")
      })
    }
  },
  initPeople: function() {
    this.nodebs = addPeople({
      id: "student",
      pos: cc.p(1000, 130)
    })
    this.addChild(this.nodebs, 900)

    addContent({
      people: this.nodebs,
      key: "wenzi1",
      img: res.wenzi1,
      sound: res.zimp1
    })
    addContent({
      people: this.nodebs,
      key: "wenzi2",
      sound: res.zimp2,
    })
  }
})