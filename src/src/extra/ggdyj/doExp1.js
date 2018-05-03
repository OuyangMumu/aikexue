//@author mu @16/5/11
var createCurLever = function(data){
  var data = data || {}
  var banlanceFun = data.banlanceFun
  var pos = data.pos || getMiddle()
  var famaPos = data.famaPos || cc.p(320,-120)
  var all = new cc.Node()
  if(banlanceFun){
    all.banlanceFun = banlanceFun
  }
  var famaBox = new cc.Sprite(res.famaBox)
  famaBox.setPosition(famaPos)
  all.addChild(famaBox)

  loadPlist("jianTou")
  var lever = new cc.Sprite(res.tjt)
  all.addChild(lever)

  var famaBoxMv = new cc.Sprite(res.famaBox)
  famaBoxMv.setPosition(famaPos)
  all.addChild(famaBoxMv)
  famaBoxMv.setOpacity(0)

  var gan = new cc.Sprite(res.gan_mc)
  gan.setPosition(135,448)
  lever.addChild(gan)
  all.gan = gan
  gan.isBanlance = false
  gan.curAngel = 0
  gan.isClock = false
  gan.leftWei = 0
  gan.rightWei = 0
  gan.leftList = []
  gan.rightList = []
  gan.rightItem_pos = cc.p(0,0)
  gan.left_fnLen = 0
  gan.right_fnLen = 0
  gan.left_itemList = []
  gan.leftItem_pos = cc.p(0,0)
  gan.right_item = null
  gan.left_item = null
  gan.itemList = []

  gan.famaNode = new cc.Node()
  gan.famaNode.setPosition(gan.width/2,gan.height/2)
  gan.addChild(gan.famaNode)

  for(var i=0; i<4; i++){
    var zlmNode = new cc.Node()
    zlmNode.setPosition(247 - i*63.5,9)
    gan.addChild(zlmNode)
    gan.itemList.push(zlmNode)

    var sp = new cc.Sprite(res.zlm)
    sp.setPosition(0,-5)
    sp.setVisible(false)
    sp.index = i+1
    gan.leftList[i] = sp 
    zlmNode.addChild(sp)
   
    
    var ylmNode = new cc.Node()
    ylmNode.setPosition(374 + i*63.5,9)
    gan.addChild(ylmNode)
    gan.itemList.push(ylmNode)

    var sp1 = new cc.Sprite(res.zlm)
    sp1.setPosition(0,-5)
    sp1.setVisible(false)
    sp1.index = i+1
    gan.rightList[i] = sp1
    ylmNode.addChild(sp1)
  }

  gan.countNode = function(node,node1,canBand){
      var gan = this
      if(node){
        node1.count++
        node1.curSp = node
        if(canBand == null || canBand == true){
          node.grandFather = node1
        }
        for(var i in node.getChildren())
        { 
          gan.countNode(node.getChildren()[i],node1)
        }
      }
  }
  gan.addItem = function(fama,fama_gou,status){
    var gan = this
    var offset = cc.p(7,13)
    var discha = 45
    var gou_father = fama_gou.getParent()
    var pos = fama_gou.getPosition()
    var len = fama_gou.index
    switch(status){
      case "right":
        if(!gan.right_item){
          gan.right_item = gou_father
          gan.right_item.gou = fama_gou
          gan.right_item.curSp = null
          gan.right_item.count = 0
          gan.right_item.len = len

          safeAdd(gan.right_item,fama)
          fama.setPosition(7,0)
        }else{
          safeAdd(gan.right_item.curSp,fama)
          var size = fama.getContentSize()
          fama.setPosition(size.width-9,5)
        }
        fama.setAnchorPoint(0.5,1)
        gan.countNode(fama,gan.right_item)
        fama.ip = gan.right_item.count
        fama.grandFather = gan.right_item
        fama.grandFather.curname = status
        gan.right_item.gou.y = - gan.right_item.count *56
      break
      case "left":
        if(!gan.left_item){
          gan.left_item = gou_father
          gan.left_item.gou = fama_gou
          gan.left_item.curSp = null
          gan.left_item.count = 0
          gan.left_item.len = len

          safeAdd(gan.left_item,fama)
          fama.setPosition(7,0)
        }else{
          safeAdd(gan.left_item.curSp,fama)
          var size = fama.getContentSize()
          fama.setPosition(size.width-9,5)
        }
        fama.setAnchorPoint(0.5,1)
        //gan.left_item.curSp = fama
        //gan.left_item.count++
        gan.countNode(fama,gan.left_item)
        fama.ip = gan.left_item.count
        fama.grandFather = gan.left_item
        fama.grandFather.curname = status
        gan.left_item.gou.y = - gan.left_item.count *56
      break
    }
    gan.countFn()
  }
  gan.playAngel = function(angel){
    var gan = this
    gan.curAngel = angel
    var time = 1
    if(gan.curAngel<=-90)
    {
      gan.curAngel = -90
    }else if(gan.curAngel >= 90)
    {
      gan.curAngel = 90
    }
    if(!gan.isClock){
        gan.stopAllActions()
        gan.runAction(cc.rotateTo(time,gan.curAngel))
        for(var i=0; i<gan.itemList.length; i++){
          gan.itemList[i].stopAllActions()
          gan.itemList[i].runAction(cc.rotateTo(time,-gan.curAngel))
        }
    }
  }

  gan.countFn = function(){
    var gan = this
    var grand = gan.left_item
    var grand1 = gan.right_item
    var left_Fn = 0 
    var right_Fn = 0
    if(grand)
    {
      var fn =  50 * grand.count
      left_Fn = grand.len * fn
    }
    if(grand1)
    {
      var fn1 =  50 * grand1.count
      right_Fn = grand1.len * fn1
    }
    var angel = right_Fn - left_Fn
    gan.playAngel(angel)
  }
  gan.removeWeight = function(fama)
  {
    if(fama)
    { 
      var grand = fama.grandFather
      fama.count = 0
      gan.countNode(fama,fama,false)
      grand.count =  grand.count - fama.count
      grand.count = 0 <= grand.count ? grand.count:0
      
      grand.gou.y = - grand.count *56
      grand.curSp = fama.preFather
      //grand.curSp.setVisible(false)
      if(grand.count == 0)
      {
        switch(grand.curname)
        {
          case "right":
            gan.right_item = null
          break
          case "left":
            gan.left_item = null
          break
        }
      }
      gan.countFn()
    }
  }
  gan.allSetZero = function()
  {
    gan.stopAllActions()
    gan.setRotation(0)
    for(var i=0; i<gan.itemList.length; i++){
      gan.itemList[i].stopAllActions()
      gan.itemList[i].setRotation(0)
    }
  }

  all.tip = new cc.LabelTTF("请先调节杠杆，使其平衡","",24)
  all.tip.setPosition(-80,320)
  all.tip.setAnchorPoint(0,0.5)
  all.tip.setColor(cc.color(255,255,255))
  all.addChild(all.tip)
  all.tip.playBlink = function()
  {
     this.stopAllActions()
     this.runAction(cc.blink(1,3))
  }

  all.compareWeight = function(){
     var all = this
     var gan = this.gan
     var zlm = this.zlm
     var ylm = this.ylm

     var zlm_cha = zlm.max - zlm.curPos
     var ylm_cha = ylm.curPos - ylm.min
     var cha = ylm_cha - zlm_cha
     gan.curAngel = cha * 0.7
     gan.isBanlance = false
     if(Math.abs(gan.curAngel)<=1){
        if(this.banlanceFun)
        {
          this.banlanceFun()
        }
        gan.curAngel = 0
        gan.isBanlance = true
        all.zlm.zjt.setVisible(false)
        all.zlm.yjt.setVisible(false)
        all.ylm.zjt.setVisible(false)
        all.ylm.yjt.setVisible(false)
        all.zlm.removeListen()
        all.ylm.removeListen()
        all.tip.setString("杠杆已平衡。\n点击手，可固定或放开杠杆尺")
     }
     gan.setRotation(gan.curAngel)
  }
  
  var addTouch = function(node){
      createTouchEvent({
        item:node,
        rect:cc.rect(-5,-10,node.width+10,node.height+40),
        begin:function(data){
          var item = data.item
          var pos = data.pos
          var nodepos = item.convertToNodeSpace(pos)
          if(nodepos.y<=item.y){
            item.yjt.playAc()
            item.type = "down"
          }else{
            item.zjt.playAc()
            item.type = "up" 
          }
          item.in = true
          return true 
        },
        // move:function(data){
        //   var item = data.item
        //   var pos = data.pos
        //   if(!judgeInside(data)){
        //      switch(item.type){
        //        case "down":
        //          item.yjt.stopSelf()
        //        break
        //        case "up":
        //          item.zjt.stopSelf()
        //        break
        //      }
        //      item.in = false
        //   }
        // },
        end:function(data){
          var item = data.item
          if(item.in){
            switch(item.type){
             case "down":
               item.yjt.stopSelf()
               item.moveself(-3)
             break
             case "up":
               item.zjt.stopSelf()
               item.moveself(3)
             break
            }
          }  
        }
      })
  }
  var moveself = function(dis){
     var zlm = this
     var temp = zlm.curPos + dis
     if(temp < zlm.min){
       dis = zlm.min - zlm.curPos
     }else if(temp > zlm.max){
       dis = zlm.max - zlm.curPos
     }
     zlm.curPos += dis
     zlm.setPositionX(zlm.curPos)

     all.compareWeight()
  }
  all.addJian = function(node){
      var playAc = function(){
          this.setVisible(true)
          this.stopAllActions()
          var ac = createAnimation({
                                    frame:"jiantou%02d.png",
                                    start:7,
                                    end: 15,
                                    time: 0.05,
                                })
          this.runAction(cc.repeatForever(ac))
      }
      var stopSelf = function(){
          this.setVisible(false)
          this.stopAllActions()
      }
      var zjt = new cc.Sprite("#jiantou07.png")
      zjt.setPosition(34,64)
      node.addChild(zjt)
      node.zjt = zjt
      //zjt.setVisible(false)
      zjt.playAc = playAc
      zjt.stopSelf = stopSelf
      zjt.playAc()

      var yjt = new cc.Sprite("#jiantou07.png")
      yjt.setPosition(-10,-4)
      yjt.setRotation(-180)
      node.addChild(yjt)
      node.yjt = yjt
      //yjt.setVisible(false)
      yjt.playAc = playAc
      yjt.stopSelf = stopSelf
      yjt.playAc()
  }
  var zlmList = [17,20,23,26,29,32,35,38,41,44,47]
  var ylmList = [573,576,579,582,585,588,591,594,597,600,603]
  var zlmListMix = mixArray(zlmList)
  var ylmListMix = mixArray(ylmList)
  var zlm = new cc.Sprite(res.zlm)
  zlm.setPosition(zlmListMix[3],23)
  zlm.setScale(1.1)
  gan.addChild(zlm)
  all.zlm = zlm
  zlm.max = 48
  zlm.min = 17
  zlm.curPos = zlmListMix[3]
  zlm.moveself = moveself
  all.addJian(zlm)
  addTouch(zlm)

  var ylm = new cc.Sprite(res.zlm)
  ylm.setPosition(ylmListMix[3],23)
  ylm.setScale(1.1)
  gan.addChild(ylm)
  all.ylm = ylm
  ylm.max = 604
  ylm.min = 573
  ylm.curPos = ylmListMix[3]
  ylm.moveself = moveself
  all.addJian(ylm)
  addTouch(ylm)
  all.compareWeight()
  
  var zhuahand = new cc.Sprite(res.zhuahand1)
  zhuahand.setPosition(-358,205)
  all.addChild(zhuahand)
  createTouchEvent({
    item:zhuahand,
    begin:function(data){
      if(gan.isBanlance){
        return true
      }else{
        all.tip.playBlink()
        return false
      } 
    },
    end:function(data){
      var item = data.item
      if(!item.zhua){
        item.zhua = true
        item.setTexture(res.zhuahand2)
        gan.isClock = true
        gan.allSetZero()  
      }else{
        item.zhua = false
        item.setTexture(res.zhuahand1)
        gan.isClock = false
        gan.playAngel(gan.curAngel)
      }
    }
  })

  var setInitPos = function(item){
    safeAdd(famaBox,item)
    item.setAnchorPoint(0.5,0.5)
    item.setPosition(item.initPos)
    item.setLocalZOrder(2)
    item.setTexture(res.fama_nor)
    item.change = false
    for(var i in item.getChildren()){
      if(item.getChildren()[i]){
         setInitPos(item.getChildren()[i])
      }
    }
  }

  for(var i=0; i<8; i++){
    var fama = new cc.Sprite(res.fama_nor)
    var dis = i<=3 ? 60:96
    fama.initPos = cc.p(dis + i%4 * 47,110 - Math.floor(i/4)*33)
    fama.setPosition(fama.initPos)
    fama.setScale(-1,1)
    fama.weight = 50
    fama.setLocalZOrder(2)
    famaBox.addChild(fama)
    createTouchEvent({
      item:fama,
      begin:function(data){
        if(!gan.isBanlance)
        {
          all.tip.playBlink()
          return false
        }
        var item = data.item
        var pos = data.pos
        item.setTexture(res.fama_sel)
        item.setLocalZOrder(200)
        if(item.change){
          //gan.removeWeight(item)
          item.preFather = item.getParent()
          //var pos = famaBox.convertToNodeSpace(getWorldPos(item))
          var pos_box = famaBox.convertToNodeSpace(pos)
          safeAdd(famaBoxMv,item)
          item.setAnchorPoint(0.5,0.5)
          item.setPosition(pos_box)
          item.change = false
          gan.removeWeight(item)
        }else{
          safeAdd(famaBoxMv,item)
        }
        return true
      },
      autoMove:true,
      end:function(data){
        var item = data.item
        var litem =null
        for (var i = 0; i < gan.leftList.length; i++) {
            litem = gan.leftList[i]
            if(judgeItemCrash({
                item1: litem,
                item2:item,
            })){
              gan.addItem(item,litem,"left")
              item.change = true
              break
            }
        }
        if(!item.change){
          var ritem =null
          for (var i = 0; i < gan.rightList.length; i++) {
              ritem = gan.rightList[i]
              if(judgeItemCrash({
                  item1: ritem,
                  item2:item,
              })){
                gan.addItem(item,ritem,"right")
                item.change = true
                break
              }
          }
        }
        if(!item.change){
          setInitPos(item)
        }
      }
    })
  }
  
  all.setPosition(pos)
  all.setScale(1.1)
  return all
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
          var bgg = self.bggg
          if(bgg){
             bgg.show()
          }
        },
      }
    })
    this.initUI()
    this.initPeople()
    return true
  },
  initUI:function(){
    var self = this
    var lever = createCurLever({
      pos:getMiddle(-100,-70)
    })
    self.addChild(lever)

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
      self.nodebs.show(function() {
           self.nodebs.runAction(cc.sequence(cc.delayTime(0.3),cc.callFunc(function(){
                if (!self.bggg) {
                  var bglist = ["bg1", "bg2","btn_bg1", "btn_bg2","redTip"]
                  var buf = {}
                  var checkBoxName1 = "chose%d_%d"
                  var checkBoxName2 = "check%d_%d"
                  for (var i = 1; i <= 4; i++) {
                    for (var j = 1; j <= 2; j++) {
                      bglist.push(sprintf(checkBoxName1,i,j))
                    }
                  }
                  for (var i = 1; i <= 8; i++) {
                    for (var j = 1; j <= 2; j++) {
                      bglist.push(sprintf(checkBoxName2,i,j))
                    }
                  }
                  var bgg = createBiaoge({
                    json: res.biao1,
                    scale: 0.9,
                    inputNum:32,
                    strlen:2,
                    inputSize:26
                  })
                  self.addChild(bgg)
                  self.bggg = bgg
                  bgg.setScale(0)
                  bgg.setPosition(-1000,0)
                  var setBtnEnable = function(btn,vis){
                    btn.setEnabled(vis)
                    btn.setBright(vis)
                  }  
                  loadList(bgg, bglist)
                  //单选框
                  bgg.checkList = []
                  bgg.checkAnswer = []
                  for (var i = 1; i <= 4; i++) {
                    var tempList = []
                    for (var j = 1; j <= 2; j++) {
                      var checkName = sprintf(checkBoxName1,i,j)
                      tempList[j-1] = bgg[checkName]
                      bgg[checkName].preIndex = i-1
                      bgg[checkName].behIndex = j-1
                      createTouchEvent({
                           item:bgg[checkName],
                           begin:function(data){
                              var item = data.item
                              var preIndex = item.preIndex
                              var behIndex = item.behIndex
                              if(!item.haveChild){
                                var sp = new cc.Sprite(res.checkbox_sel)
                              sp.setPosition(item.width/2,item.height/2)
                              item.addChild(sp)
                              item.haveChild = true
                              var childs = bgg.checkList[preIndex]
                              for (var i = childs.length - 1; i >= 0; i--) {
                                if(i　!= behIndex &&　childs[i].haveChild){
                                  childs[i].removeAllChildren()
                                  childs[i].haveChild = false 
                                }
                              }
                              bgg.checkAnswer[preIndex] = behIndex
                              }else{
                                item.removeAllChildren()
                                item.haveChild = false
                                bgg.checkAnswer[preIndex] = null
                              }
                           },
                      })
                    }
                    bgg.checkList[i-1] = tempList
                    bgg.checkAnswer[i-1] = null
                  }

                  //单选框1
                  bgg.checkList1 = []
                  bgg.checkAnswer1 = []
                  for (var i = 1; i <= 8; i++) {
                    var tempList = []
                    for (var j = 1; j <= 2; j++) {
                      var checkName = sprintf(checkBoxName2,i,j)
                      tempList[j-1] = bgg[checkName]
                      bgg[checkName].preIndex = i-1
                      bgg[checkName].behIndex = j-1
                      createTouchEvent({
                           item:bgg[checkName],
                           begin:function(data){
                              var item = data.item
                              var preIndex = item.preIndex
                              var behIndex = item.behIndex

                              for(var k = 1; k<=4; k++){
                                if(bgg.getKey(4*preIndex+k)==""){
                                  self.speakeBykey("wenzi3")
                                  return false
                                }
                              }

                              if(!item.haveChild){
                                bgg.redTip.setVisible(false)
                                var sp = new cc.Sprite(res.checkbox_sel)
                                sp.setPosition(item.width/2-10,item.height/2)
                                item.addChild(sp)
                                item.haveChild = true
                                var childs = bgg.checkList1[preIndex]
                                for (var i = childs.length - 1; i >= 0; i--) {
                                  if(i　!= behIndex &&　childs[i].haveChild){
                                    childs[i].removeAllChildren()
                                    childs[i].haveChild = false 
                                  }
                                }
                                bgg.checkAnswer1[preIndex] = behIndex
                                return true
                              }else{
                                item.removeAllChildren()
                                item.haveChild = false
                                bgg.checkAnswer1[preIndex] = null
                                return true
                              }
                           },
                      })
                    }
                    bgg.checkList1[i-1] = tempList
                    bgg.checkAnswer1[i-1] = null
                  }

                  bgg.bg1.initPos = bgg.bg1.getPosition()
                  bgg.bg2.initPos = bgg.bg2.getPosition()
                  bgg.bg2.setPosition(0,-1000)

                  var clearsCheckList1 = function(){
                     if(bgg.checkList){
                       for (var i = bgg.checkList.length - 1; i >= 0; i--) {
                         var tempList = bgg.checkList[i]
                         for (var j = tempList.length - 1; j >= 0; j--) {
                            tempList[j].removeAllChildren()
                         };
                         bgg.checkAnswer[i] = null
                       };
                     }  
                  }
                  var clearsCheckList2 = function(){
                     if(bgg.checkList1){
                       for (var i = bgg.checkList1.length - 1; i >= 0; i--) {
                         var tempList1 = bgg.checkList1[i]
                         for (var j = tempList1.length - 1; j >= 0; j--) {
                            tempList1[j].removeAllChildren()
                         };
                         bgg.checkAnswer1[i] = null
                       };
                     }  
                  }

                  setBtnEnable(bgg.btn_bg1,false)
                  bgg.btn_bg1.addClickEventListener(function() {
                    bgg.bg1.setVisible(true)
                    bgg.bg2.setVisible(false)
                    bgg.bg1.setPosition(bgg.bg1.initPos)
                    bgg.bg2.setPosition(0,-1000)
                    bgg.redTip.setVisible(false)
                    setBtnEnable(bgg.btn_bg1,false)
                    setBtnEnable(bgg.btn_bg2,true)
                    clearsCheckList2()
                  })
                  bgg.btn_bg2.addClickEventListener(function() {
                    bgg.bg2.setVisible(true)
                    bgg.bg1.setVisible(false)
                    bgg.bg2.setPosition(bgg.bg2.initPos)
                    bgg.bg1.setPosition(0,-1000)
                    setBtnEnable(bgg.btn_bg2,false)
                    setBtnEnable(bgg.btn_bg1,true)
                    clearsCheckList1()
                  })
                  bgg.setUpLoad(function(){
                     if(bgg.bg1.isVisible()){
                          var tempCheck = null
                          var checkcount = 0
                          var checkAnswers = [1,0,1,1]
                          for (var i = 0; i< 4; i++){
                            tempCheck = "T"
                            if(bgg.checkAnswer[i] == null){
                              checkcount++
                            }
                            if(bgg.checkAnswer[i] != null && bgg.checkAnswer[i] != checkAnswers[i]){
                              tempCheck = "F"
                              break
                            }
                          }
                          if(checkcount == 4){
                            tempCheck = "AF"
                          }
                          if(tempCheck!=null){
                              switch(tempCheck){
                                 case "T":
                                   self.speakeBykey("wenzi2")
                                 break
                                 case "F":
                                   self.speakeBykey("wenzi1")
                                 break
                                 case "AF":
                                   self.speakeBykey("wenzi3")
                                 break 
                               }
                          }
                     }else{
                        var count = 0
                        for (var i = 0; i< 8; i++){
                          if(bgg.checkAnswer1[i]==null){
                            count++
                          }
                        }
                        if(count==8){
                          self.speakeBykey("wenzi3")
                        }else{
                          var getNumJudge = function(curKey){
                              var ge1 = Number(bgg.getKey(4*curKey+1)) * Number(bgg.getKey(4*curKey+2))
                              var ge2 = Number(bgg.getKey(4*curKey+3)) * Number(bgg.getKey(4*curKey+4))
                              cc.log("ge1",ge1)
                              cc.log("ge2",ge2)
                              if(ge1 != ge2)
                              {
                                return 1
                              }
                              return 0
                          }
                          var judgeTF = true
                          var havezero = false
                          for(var i = 0; i< 8; i++){
                            var curKey = bgg.checkAnswer1[i]
                            if(curKey!=null){
                              if(getNumJudge(i) != curKey){
                                judgeTF = false
                                break
                              }
                              if(curKey==0){
                                havezero = true
                              }
                            }
                          }
                          if(judgeTF){
                            self.speakeBykey("wenzi2")
                            if(havezero){
                              bgg.redTip.setVisible(true)
                            }
                          }else{
                            self.speakeBykey("wenzi1")
                          }
                        }
                     }
                  })
                  bgg.setClear(function(){
                    if(bgg.bg1.isVisible()){
                      clearsCheckList1()
                    }else{
                      clearsCheckList2()
                      bgg.redTip.setVisible(false)
                    }
                  })
                }
           })))
      })
    }
  },
  initPeople: function() {
    this.nodebs = addPeople({
      id: "student",
      pos: cc.p(1030, 130)
    })
    this.addChild(this.nodebs, 900)

    addContent({
      people: this.nodebs,
      key: "wenzi1",
      img: res.wenzi1,
      sound: res.zimp1,
      offset: cc.p(25, 20),
      offbg: cc.p(5,10),
      buttonoffset:cc.p(0,-15),
    })
    addContent({
      people: this.nodebs,
      key: "wenzi2",
      img: res.wenzi2,
      sound: res.zimp2,
      offset: cc.p(25, 20),
      offbg: cc.p(5,10),
      buttonoffset:cc.p(0,-15),
    })
    addContent({
      people: this.nodebs,
      key: "wenzi3",
      img: res.wenzi3,
      sound: res.zimp3,
      offset: cc.p(25, 20),
      offbg: cc.p(5,10),
      buttonoffset:cc.p(0,-15),
    })
  }
})