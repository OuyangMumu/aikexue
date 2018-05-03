//@author mu @14/5/10
/*
  创建一个简单的杠杆
*/
var createLever = function(data){
   var beginFun = data.beginFun
   var endFun = data.endFun
   var anchor_pos = data.anchor_pos
   var rightFn_Img = data.rightFn_Img
   var rightFn_pos = data.rightFn_pos
   var leftFn_Img = data.leftFn_Img
   var leftFn_pos = data.leftFn_pos
   var setMax = data.setMax || 120
   loadPlist("jianTou")

   var lever = new cc.Node()
   var gunNode = new cc.Node()
   gunNode.setPosition(0,-42)
   lever.addChild(gunNode)
   lever.gunNode = gunNode

   lever.gun = new cc.Sprite(res.lever_item2)
   lever.gun.setPosition(0,42)
   lever.gun.setAnchorPoint(anchor_pos)
   gunNode.addChild(lever.gun)

   lever.top = new cc.Sprite(res.lever_item1)
   lever.top.setPosition(0,-63)
   lever.addChild(lever.top)

   lever.tip = new cc.Sprite(res.lever_item3)
   lever.tip.setPosition(10,-32)
   lever.addChild(lever.tip)

   lever.leftFn = new cc.Sprite(leftFn_Img)
   lever.leftFn.setPosition(leftFn_pos)
   lever.addChild(lever.leftFn)

   lever.rightFn = new cc.Sprite(rightFn_Img)
   lever.rightFn.setPosition(rightFn_pos)
   lever.addChild(lever.rightFn)

   lever.drawBlue = new cc.DrawNode()
   lever.addChild(lever.drawBlue)

   lever.drawBlue1 = new cc.DrawNode()
   lever.addChild(lever.drawBlue1)

   lever.left_lab = new cc.LabelTTF("1.5m","",26)
   lever.left_lab.setPosition((-lever.gun.width*lever.gun.anchorX+70)/2,-20)
   lever.left_lab.setColor(cc.color(0,0,0))
   lever.addChild(lever.left_lab)

   lever.right_lab = new cc.LabelTTF("1.5m","",26)
   lever.right_lab.setPosition((lever.gun.width*(1-lever.gun.anchorX)+30)/2,-20)
   lever.right_lab.setColor(cc.color(0,0,0))
   lever.addChild(lever.right_lab)

   lever.drawXuline = function(data){
        var lever = this
        var pos1 = data.pos1
        var pos2 = data.pos2
        var seg = data.seg || 11
        var lineWidth = 1.5
        var color = cc.color(0,0,255)
  
        var list1 = []
        var list2 = []
        for(var i=0; i<=seg; i++){
            var lamb = i/seg
            var temp = cc.p(pos1.x+lamb*(pos2.x-pos1.x),pos1.y+lamb*(pos2.y-pos1.y))
            list1[i] = temp
        }
        for(var k = list1.length-1; k>=0; k -= 2){
          if(k-1>=0){
            lever.drawBlue1.drawSegment(list1[k],list1[k-1],lineWidth,color)
          }
        }
   }
 
   lever.drawPlay = function(data){
      var lever = this
      var left_world = lever.convertToNodeSpace(getWorldPos(lever.left_point))
      var right_world = lever.convertToNodeSpace(getWorldPos(lever.right_point))
      var began = cc.p(left_world.x,-40)
      var end = cc.p(right_world.x,-40)
      lever.drawBlue1.clear()
      lever.drawBlue1.drawSegment(began,end,2,cc.color(0,0,255))
      lever.drawBlue1.drawSegment(cc.p(began.x,began.y+5),cc.p(began.x,began.y-5),2,cc.color(0,0,255))
      lever.drawBlue1.drawSegment(cc.p(end.x,end.y+5),cc.p(end.x,end.y-5),2,cc.color(0,0,255))
      
      lever.drawXuline({
        pos1:left_world,
        pos2:began,
      })
      lever.drawXuline({
        pos1:right_world,
        pos2:end,
      })
      //lever.drawBlue1.drawSegment(left_world,began,2,cc.color(0,0,255))
      //lever.drawBlue1.drawSegment(right_world,end,2,cc.color(0,0,255))
        
      lever.left_lab.x = left_world.x/2
      lever.right_lab.x = right_world.x/2
      lever.left_lab.setString(parseFloat(Math.abs(left_world.x/144) + "m").toFixed(2))
      lever.right_lab.setString(parseFloat(Math.abs(right_world.x/144) + "m").toFixed(2))

      if(!lever.drawBlue.haveInit){
          lever.drawBlue.haveInit = true
          lever.drawBlue.drawSegment(cc.p(0,-32.1),cc.p(0,-51.5),2,cc.color(0,0,255))
      }
   }
  

   lever.hand = new cc.Sprite(res.lever_item6)
  
   lever.hand.setPosition(-lever.gun.width*lever.gun.anchorX+62,0)
   lever.addChild(lever.hand)
   lever.hand.initPos = lever.hand.getPosition()
   lever.hand.father = gunNode
   lever.hand.setOpacity(0)
   lever.hand.allOffset = 0
   lever.hand.Max = setMax
   lever.hand.Min = -setMax

   lever.left_point = new cc.Node()
   lever.gun.addChild(lever.left_point)
   lever.left_point.setPosition(81,0)

   lever.right_point = new cc.Node()
   lever.gun.addChild(lever.right_point)
   lever.right_point.setPosition(lever.gun.width-27,0)


   lever.tipac = new cc.Sprite("#jiantou00.png")
   lever.tipac.setPosition(110,60)
   lever.tipac.setRotation(-70)
   lever.tipac.setScale(1.1,1.2)
   lever.hand.addChild(lever.tipac)
   var spAction = createAnimation({
                      frame:"jiantou%02d.png",
                      start:0,
                      end: 6,
                      time: 0.06
                  })
   lever.tipac.runAction(cc.repeatForever(spAction))
  
   lever.drawPlay()
   createTouchEvent({
     item:lever.hand,
     begin:function(data){
        if(beginFun){
          beginFun()
        }
        lever.tip.setVisible(false)
        if(lever.tipac){
          lever.tipac.removeFromParent()
          lever.tipac = null
        }
        
       return true
     },
     move:function(data){
        var item = data.item
        var delta = data.delta
        var tempFinal = item.allOffset + delta.y
        if(tempFinal > item.Max){
          delta.y = item.Max - item.allOffset
        }else if(tempFinal < item.Min){
          delta.y = item.Min - item.allOffset
        }
        item.allOffset =  item.allOffset + delta.y
        item.y = item.y + delta.y
        var topos = item.getPosition()
        var angel = 90 + Math.atan2(topos.x,topos.y)/Math.PI * 180
        item.father.setRotation(angel)
        item.setRotation(angel)
        lever.drawPlay()
     },
     end:function(){
       if(endFun){
          endFun()
       }
     }
   })
   lever.myInit = function(){
     var lever = this
     lever.hand.setPosition(lever.hand.initPos)
     lever.hand.allOffset = 0
     lever.gunNode.setRotation(0)
     lever.tip.setVisible(true)
     lever.drawPlay()
   }
   return lever
}
var learnLayer = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  load: function() {
    loadPlist("learn_nums")
    loadPlist("pic")
  },
  ctor: function() {
    this._super()
    this.learnCtor()
    var self = this

    self.addLever = function(data){
        var self = this
        var father = data.father
        var anchor_pos = data.anchor_pos
        var pos = data.pos
        var fun1 = data.fun1
        var fun2 = data.fun2
        var rightFn_Img = data.rightFn_Img
        var rightFn_pos = data.rightFn_pos
        var leftFn_Img = data.leftFn_Img
        var leftFn_pos = data.leftFn_pos
        var lever = createLever({
          anchor_pos:anchor_pos,
          beginFun:fun1,
          endFun:fun2,
          rightFn_Img:rightFn_Img,
          rightFn_pos:rightFn_pos,
          leftFn_Img:leftFn_Img,
          leftFn_pos:leftFn_pos
        })
        lever.setPosition(pos)
        father.addChild(lever)
        return lever
    } 
    var xue1_1 = new cc.Sprite(res.xue1_1)
    self.lever1 = self.addLever({
                    father:xue1_1,
                    anchor_pos:cc.p(0.684,0.5),
                    pos:cc.p(xue1_1.width/2-20,xue1_1.height/2+110),
                    rightFn_Img:res.lever_item4,
                    rightFn_pos:cc.p(-390,-20),
                    leftFn_Img:res.lever_item5,
                    leftFn_pos:cc.p(220,-20),
                    fun1:function(){
                      if(self.touch1){
                        self.touch1.noneMove = true
                      }
                    },
                    fun2:function(){
                      if(self.touch1){
                        self.touch1.noneMove = false
                      }
                    }
                  })
    
    var xue2_1 = new cc.Sprite(res.xue2_1)
    self.lever2 = self.addLever({
                    father:xue2_1,
                    anchor_pos:cc.p(0.416,0.5),
                    pos:cc.p(xue2_1.width/2-90,xue2_1.height/2+220),
                    touch:self.touch2,
                    rightFn_Img:res.lever_item7,
                    rightFn_pos:cc.p(-290,-30),
                    leftFn_Img:res.lever_item5,
                    leftFn_pos:cc.p(380,-30),
                    setMax:105,
                    fun1:function(){
                      if(self.touch2){
                        self.touch2.noneMove = true
                      }
                    },
                    fun2:function(){
                      if(self.touch2){
                        self.touch2.noneMove = false
                      }
                    }
                  })

    var xue3_1 = new cc.Sprite(res.xue3_1)
    self.lever3 = self.addLever({
                    father:xue3_1,
                    anchor_pos:cc.p(0.55,0.5),
                    pos:cc.p(xue3_1.width/2-20,xue3_1.height/2+80),
                    touch:self.touch3,
                    rightFn_Img:res.lever_item5,
                    rightFn_pos:cc.p(-340,-30),
                    leftFn_Img:res.lever_item5,
                    leftFn_pos:cc.p(300,-30),
                    fun1:function(){
                      if(self.touch3){
                        self.touch3.noneMove = true
                      }
                    },
                    fun2:function(){
                      if(self.touch3){
                        self.touch3.noneMove = false
                      }
                    }
                  })
    self.initSome = function(){
      var self = this
      self.lever1.myInit()
      self.lever2.myInit()
      self.lever3.myInit()
    }
    
    self.infos = []
    self.posList = []
    var trueNumlist = [3,2,2,2,2,1,2,1,1,3,1,1]
    for(var i=0; i<12; i++)
    {
       var info = {
        img:sprintf("#pic%d.png",i+1),
        img_zi:sprintf("#pic%d_zi.png",i+1),
        trueNum:trueNumlist[i],
      }
      self.infos[i] = info
      if(i<9){
        self.posList[i] = cc.p(i%3 * 130,130*Math.floor(i/3))
      } 
    }
    var xue3_3 = new cc.Sprite(res.xue3_3)
    self.lay1 = createLayout({
          pos: cc.p(165,215),
          size: cc.size(450,80),
          op: 0,
    })
    self.lay1.trueNum = 1
    xue3_3.addChild(self.lay1)
    self.lay2 = createLayout({
          pos: cc.p(165,127),
          size: cc.size(450,80),
          op: 0,
    })
    self.lay2.trueNum = 2
    xue3_3.addChild(self.lay2)
    self.lay3 = createLayout({
          pos: cc.p(165,40),
          size: cc.size(450,80),
          op: 0,
    })
    self.lay3.trueNum = 3
    xue3_3.addChild(self.lay3)
    self.xue3_3 = xue3_3
    self.createAChose()
    
    var anginBtn = new ccui.Button(res.rebuil_nor,res.rebuil_sel)
    anginBtn.setPosition(520,-16)
    xue3_3.addChild(anginBtn)
    anginBtn.addClickEventListener(function(){
       self.createAChose()
    })
    
    var pageList = self.initPagegsr({
                      imgs:[
                        [xue1_1,res.xue1_2],
                        [xue2_1],
                        [xue3_1,res.xue3_2],
                        [xue3_3]
                      ],
                      pavedata:[
                        {offsetx: 110, offsety:40,nodeX:568,nodeY:230},
                        {nodeX:575,nodeY:110},
                        {offsetx: 190, offsety:50,nodeX:568,nodeY:270},
                        {nodeX: 545, nodeY:270},
                      ],
                      btns:[
                        [res.xue1btn_nor,res.xue1btn_sel,res.xue1btn_dis],             
                        [res.xue2btn_nor,res.xue2btn_sel,res.xue2btn_dis],
                        [res.xue3btn_nor,res.xue3btn_sel,res.xue3btn_dis],
                        [res.xue4btn_nor,res.xue4btn_sel,res.xue4btn_dis]
                      ],
                      btnpos:[
                        cc.p(280,594),
                        cc.p(463,594),
                        cc.p(645,594),
                        cc.p(835,594),
                      ],
                      btnSkipbackFun:function(tag){
                        if(tag!=3)
                        {
                          self.initSome()
                          self.img_page.setVisible(true)
                        }else{
                          self.createAChose()
                          self.img_page.setVisible(false)
                        }
                      }
                    })
    self.touch1 = pageList[0].getListnerlayer()
    self.touch2 = pageList[1].getListnerlayer()
    self.touch3 = pageList[2].getListnerlayer()
    self.touch4 = pageList[3].getListnerlayer()
    self.touch4.noneMove = true 
    return true
  },
  createAChose:function(){
    var self = this
    if(self.xue3_node){
      self.xue3_node.removeFromParent()
      self.xue3_node = null
    }
    var lays = [self.lay1,self.lay2,self.lay3]
    for(var i in lays)
    {
      lays[i].removeAllChildren()
    }
    self.xue3_node = self.createBgMoveSp({
                        father:self.xue3_3,
                        infos:self.infos,
                        pos:cc.p(730,40),
                        posList:self.posList,
                        colloSp:[self.lay1,self.lay2,self.lay3]
                      })
  },
  createBgMoveSp:function(data){
    var infos = data.infos
    var father = data.father
    var posList = data.posList
    var lenset = data.lenset || 9
    var pos = data.pos || cc.p(0,0)
    var colloSp = data.colloSp || []
    var node = new cc.Node()
    
    cc.log(infos.length)
    cc.log(posList.length)
    var infoData = mixArray(infos)
    var infoPos = mixArray(posList)
    for(var i=0; i<lenset; i++)
    {
      var sp = new cc.Sprite(infoData[i].img)
      sp.initPos = infoPos[i]
      sp.setPosition(sp.initPos)
      node.addChild(sp)
      sp.trueNum = infoData[i].trueNum

      var zi = new cc.Sprite(infoData[i].img_zi)
      zi.setPosition(sp.width/2,-23)
      sp.addChild(zi)
      sp.zi = zi

      createTouchEvent({
        item:sp,
        begin:function(data){
          var item = data.item
          item.zi.setVisible(false)
          return true
        },
        autoMove:true,
        end:function(data){
          var item = data.item
          for(var i=0; i<colloSp.length; i++){
            if(judgeItemCrash({
              item1:colloSp[i],
              item2:item
            }) && colloSp[i].trueNum == item.trueNum){
               safeAdd(colloSp[i],item)
               var count = colloSp[i].getChildrenCount()
               item.setPosition(45+80*(count-1),40)
               item.out = true
               item.removeListen()
               break
            }
          }
          if(!item.out)
          {
            item.setPosition(item.initPos)
            item.zi.setVisible(true)
          }
        }
      })
    }

    node.setPosition(pos)
    father.addChild(node)
    return node
  },
})