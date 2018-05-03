//@author mu @16/5/11
var doExp1 = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  layerName: "doExp1",
  preLayer: "doLayer",
  needSet:false,
  ctor: function() { //创建时调用 未删除不会重复调用
    this.load(function() {
       loadPlist("imglist")
    })
    var self = this
    this._super()
    this.expCtor({
      btnOff: cc.p(90, 6)
    })
    this.initUI()
    this.initData()
    this.initPeople()
    return true
  },
  initUI:function(){
        var self = this
        self.pictureVector = []
        self.wordVector = []
        var uinamelist = [
          "sliderI","commitbtn","daanbtn",
          "againbtn","chose","bg_result",
          "daan","sliderI1","daanbg","quitBtn"
        ]
        for(var i=1; i<=7; i++){
          var itemstr = sprintf("item%d",i)
          var wordstr = sprintf("word%d",i)
          uinamelist.push(itemstr)
          uinamelist.push(wordstr)
          self.pictureVector[i-1] = itemstr
          self.wordVector[i-1] = wordstr
        }
        var node = loadNode(res.gcnode, uinamelist)
        self.allnode = node
        node.setPosition(getMiddle(-40,20))
        self.inside_node.addChild(node)

        node.commitbtn.addClickEventListener(function(){
            self.getJielun()
        })
        node.daanbtn.addClickEventListener(function(){
             node.bg_result.OutandIN()
        })
        node.againbtn.addClickEventListener(function(){
              var curPage = self
              var restartPage = self.layerName
              if (curPage && restartPage) {
                  if (curPage.myExit) {
                      curPage.myExit()
                  }
                  if (curPage.myDelete) {
                      curPage.myDelete()
                  }
                  deleteLayer(curPage)
                  var temp = getLayer(restartPage)
                  myAddLayer(temp)
                  if (temp.myCtor) {
                      temp.myCtor()
                  }
                  if (temp.myEnter) {
                      temp.myEnter()
                      temp.alreadyEnter = true
                  }
              }
        })

        node.chose.initY = node.chose.y
        createTouchEvent({
            item:node.sliderI,
            begin:function(){
              return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                var tempY = item.y + delta.y
                if(tempY>=460){
                   tempY = 460
                }else if(tempY<=95){
                   tempY = 95
                }
                item.y = tempY
                node.chose.y = node.chose.initY + 1.66*(460 - item.y)
            }
        })

        //答案的创建
        node.bg_result.setLocalZOrder(500)
        node.daan.initY = node.daan.y 
        node.bg_result.addMyEvent = function(){
            addMoving(this)
            createTouchEvent({
              item:node.sliderI1,
              begin:function(){
                return true
              },
              move:function(data){
                  var item = data.item
                  var delta = data.delta
                  var loopscale = getLoopScale(item)
                  var tempY = item.y + (delta.y/loopscale)
                  if(tempY>=455){
                     tempY = 455
                  }else if(tempY<=96){
                     tempY = 96
                  }
                  item.y = tempY
                  node.daan.y = node.daan.initY + 1.5*(455 - item.y)
              }
            })
            if(!this.btn){
              this.btn = true
              this.changeSelfLocalZero = function(){
                node.bg_result.setLocalZOrder(LOCAL_ORDER++)
              }
              node.quitBtn.addClickEventListener(function(){
                node.bg_result.OutandIN()
              })
            }
        }
        node.bg_result.removeMyEvent = function(){
            removeMoving(this)
            if(node.sliderI1.removeListen)
              node.sliderI1.removeListen()
        }
        node.bg_result.OutandIN = function(){
            if(node.bg_result.isVisible()){
                addShowType({
                    item: node.bg_result,
                    show: "zoom",
                    time: 0.3,
                    fun: function() {
                       node.bg_result.setVisible(false)
                       node.bg_result.removeMyEvent()
                    }   
                })
            }else{
                node.bg_result.setVisible(true)
                safeAdd(self,node.bg_result)
                if(node.bg_result.changeSelfLocalZero)
                   node.bg_result.changeSelfLocalZero()
                node.bg_result.setPosition(getMiddle())
                addShowType({
                    item: node.bg_result,
                    show: "scale",
                    scale:1.2,
                    time: 0.3,
                    fun: function() {
                       node.bg_result.addMyEvent()
                    }   
                })
            }
        }
  },
  getJielun:function(){
    var self = this
    var getMybool = function(myVector){
      var allCurSp = 0
      var count = 0
      for(var i=0; i<myVector.length; i++){
          var curSp = self.allnode[myVector[i]]
         if(curSp.haveSp){
           allCurSp++
           cc.log("curSp.haveSp.tureNum",curSp.haveSp.tureNum)
           if(i == curSp.haveSp.tureNum){
               count++
           }
         }
      }
      if(allCurSp == count && allCurSp!=0){
         return true
      }else{
         return false
      }
    }
    var getHaveLen = function(myVector){
      var allCurSp = 0
      for(var i=0; i<myVector.length; i++){
          var curSp = self.allnode[myVector[i]]
         if(curSp.haveSp){
           allCurSp++
         }
      }
      return allCurSp
    }
    var curZiyuan = res.img_fault
    var curMp = res.sound_fault
    cc.log("yyyyyy::",getHaveLen(self.pictureVector))
    if(!getHaveLen(self.pictureVector)){
       if(getMybool(self.wordVector)){
         curZiyuan = res.img_correct
         curMp = res.sound_right
       } 
    }else{
        cc.log("333333333333333")
        cc.log("kkkkk:",getHaveLen(self.wordVector))
        if(!getHaveLen(self.wordVector)){
          cc.log("uuuuuuuu::",getMybool(self.pictureVector))
          if(getMybool(self.pictureVector)){
             curZiyuan = res.img_correct
             curMp = res.sound_right
          }
        }else{
           if(getMybool(self.wordVector) &&　getMybool(self.pictureVector)){
             curZiyuan = res.img_correct
             curMp = res.sound_right
           }
        }
    }


    dialogControl.AddDialog("Tips", {
                        res: curZiyuan,
                        face: 1,
                        confirmBtn: true,
                        sound: curMp,
                        father: self
                  })
  },
  initData: function() {
      var self = this
      var pnglist = [
        ["#img1.png","#daimg1.png",0],
        ["#img2.png","#daimg2.png",1],
        ["#img3.png","#daimg3.png",2],
        ["#img4.png","#daimg4.png",3],
        ["#img5.png","#daimg5.png",4],
        ["#img6.png","#daimg6.png",5],
        ["#img7.png","#daimg7.png",6]
      ]
      var MIXpnglist = mixArray(pnglist)
      var onepnglist = []
      for(var i=0; i<pnglist.length; i++){
         onepnglist.push(MIXpnglist[i][0])
      }
      
      var checkAndRest = function(index,item,Myvector,fatherNode,list){
          if(item.y>= 530 || item.y<= 43){
            return false
          }
          for(var k=0;k<Myvector.length; k++){
             var curSp = self.allnode[Myvector[k]]
             var result = judgeItemCrash({
                            item1:curSp,
                            item2:item
                          })
             if(result){
                safeAdd(curSp.getParent(),item)
                item.setLocalZOrder(120)
                item.setPosition(curSp.getPosition())
                if(curSp.haveSp){
                  var curindex = curSp.haveSp.index
                  if(curindex!=index){
                    fatherNode.judgeIndex(curindex, false)
                    curSp.haveSp.removeFromParent()
                    curSp.haveSp = null
                  }
                }
                if(list){
                    var showimg = new cc.Sprite(list[index][1])
                    showimg.setScale(1.1)
                    showimg.setPosition(60,40)
                    curSp.addChild(showimg)
                    item.setOpacity(0)
                }
                curSp.haveSp = item
                item.cursp = curSp
                return true
             }
          }
          return false
      }
      var guannode = self.addList({
                        pnglist:onepnglist,
                        getFun:function(data){
                          var index = data.index
                          var pos = data.pos
                          var tex = data.tex
                          var sp = new cc.Sprite(tex)
                          sp.setPosition(self.convertToNodeSpace(pos))
                          sp.setLocalZOrder(100)
                          safeAdd(self,sp)
                          sp.index = index
                          sp.setScale(1.1)
                          sp.tureNum = MIXpnglist[index][2]
                          self.addTipPng(MIXpnglist,sp)
                          return sp
                        },
                        outFun:function(data){
                          var item = data.item
                          var pos = data.pos
                          var index = data.index
                          item.setScale(1)
                          if(!checkAndRest(index,item,self.pictureVector,guannode)){
                              guannode.judgeIndex(index, false)
                              item.removeFromParent(true)
                          }else{
                              createTouchEvent({
                                item:item,
                                begin: function(data) {
                                    var item = data.item
                                    var pos = data.pos
                                    if(item.cursp){
                                      item.cursp.haveSp=null
                                    }
                                    safeAdd(self,item)
                                    item.setScale(1.1)
                                    item.setPosition(self.convertToNodeSpace(pos))
                                    return true
                                },
                                move: function(data) {
                                      data.item.x += data.delta.x
                                      data.item.y += data.delta.y
                                },
                                end: function(data) {
                                    var item = data.item
                                    var index = item.index
                                    item.setScale(1)
                                    if(!checkAndRest(index,item,self.pictureVector,guannode)){
                                       guannode.judgeIndex(index, false)
                                       item.removeFromParent(true)
                                    } 
                                }
                              })
                          }
                        }
                      })
      self.addChild(guannode,10)
      guannode.initPos = guannode.getPosition()
      
      var pnglist1 = [
        ["#wordimg1.png","#nowordimg1.png",0],
        ["#wordimg2.png","#nowordimg2.png",1],
        ["#wordimg3.png","#nowordimg3.png",2],
        ["#wordimg4.png","#nowordimg4.png",3],
        ["#wordimg5.png","#nowordimg5.png",4],
        ["#wordimg6.png","#nowordimg6.png",5],
        ["#wordimg7.png","#nowordimg7.png",6]
      ]
      var MIXpnglist1 = mixArray(pnglist1)
      var onepnglist1 = []
      for(var i=0; i<pnglist1.length; i++){
         onepnglist1.push(MIXpnglist1[i][0])
      }
      var guannode1 = self.addList({
                        pnglist:onepnglist1,
                        getFun:function(data){
                          var index = data.index
                          var pos = data.pos
                          var tex = data.tex
                          var sp = new cc.Sprite(tex)
                          sp.setPosition(self.convertToNodeSpace(pos))
                          sp.setLocalZOrder(100)
                          safeAdd(self,sp)
                          sp.index = index
                          sp.tureNum = MIXpnglist1[index][2]
                          sp.setScale(1.1)
                          return sp
                        },
                        outFun:function(data){
                          var item = data.item
                          var pos = data.pos
                          var index = data.index
                          item.setScale(1)
                          if(!checkAndRest(index,item,self.wordVector,guannode1,MIXpnglist1)){
                              guannode1.judgeIndex(index, false)
                              item.removeFromParent(true)
                          }else{
                              createTouchEvent({
                                item:item,
                                begin: function(data) {
                                    var item = data.item
                                    var pos = data.pos
                                    if(item.cursp){
                                      item.cursp.haveSp=null
                                      item.cursp.removeAllChildren()
                                    }
                                    safeAdd(self,item)
                                    item.setScale(1.1)
                                    item.setOpacity(255)
                                    item.setPosition(self.convertToNodeSpace(pos))
                                    return true
                                },
                                move: function(data) {
                                      data.item.x += data.delta.x
                                      data.item.y += data.delta.y
                                },
                                end: function(data) {
                                    var item = data.item
                                    var index = item.index
                                    item.setScale(1)
                                    if(!checkAndRest(index,item,self.wordVector,guannode1,MIXpnglist1)){
                                       guannode1.judgeIndex(index, false)
                                       item.removeFromParent(true)
                                    } 
                                }
                              })
                          }
                        }
                      })
      self.addChild(guannode1,10)
      guannode1.initPos = guannode1.getPosition()

      var hide = function(node){
         node.setVisible(false)
         node.y = -100
      }
      var show = function(node){
         node.setVisible(true)
         node.setPosition(node.initPos)
      }
      hide(guannode1)
      var picT = new ccui.Button(res.picT_sel,res.picT_nor)
      picT.setPosition(1070,495)
      self.addChild(picT,1)
      picT.addClickEventListener(function(){
          hide(guannode1)
          show(guannode)
          wordT.loadTextureNormal(res.wordT_nor)
          picT.loadTextureNormal(res.picT_sel)
      })

      var wordT = new ccui.Button(res.wordT_nor,res.wordT_sel)
      wordT.setPosition(1070,445)
      self.addChild(wordT,1)
      wordT.addClickEventListener(function(){
          hide(guannode)
          show(guannode1)
          picT.loadTextureNormal(res.picT_nor)
          wordT.loadTextureNormal(res.wordT_sel)
      })
  },
  addTipPng:function(imglist,item) {
      var self = this 
      if(!self.imgsnode){
        self.imgsnode = new cc.Node()
        self.imgsnode.setName("imgsnode")
        self.imgsnode.setPosition(getMiddle())
        self.addChild(self.imgsnode, 500)
      }
      if (imglist[item.index][1] && imglist[item.index][1] != "") {
            var addbn = new ccui.Button(res.btn_add_normal, res.btn_add_select)
            addbn.setPosition(20, 20)
            addbn.setScale(1)
            item.addChild(addbn)
            addbn.index = item.index
            addbn.addClickEventListener(function(sender, type) {
                  var scaleimg = new cc.Sprite(imglist[sender.index][1])
                  scaleimg.setPosition(25 * self.imgsnode.getChildrenCount(), 0)
                  scaleimg.index = sender.index
                  createTouchEvent({
                        item: scaleimg,
                        begin: function(data) {
                              data.item.setLocalZOrder(IMG_ZERO++)
                              return true
                        },
                        move: function(data) {
                              data.item.x += data.delta.x
                              data.item.y += data.delta.y
                        }
                  })
                  scaleimg.setOpacity(150)
                  scaleimg.runAction(cc.sequence(cc.moveBy(0.1, 0, 10),
                        cc.callFunc(function() {
                              scaleimg.setOpacity(255);
                        })
                  ))
                  var closebtn = new ccui.Button(res.btn_tipclose_select, res.btn_tipclose_normal)
                  closebtn.setPosition(scaleimg.width-40, scaleimg.height-40)
                  closebtn.setScale(0.9)
                  scaleimg.addChild(closebtn)
                  closebtn.addClickEventListener(function() {
                        this.getParent().removeFromParent(true)
                  })
                  for (var i in self.imgsnode.getChildren()) {
                    if (self.imgsnode.getChildren()[i].index == sender.index){
                       self.imgsnode.getChildren()[i].removeFromParent(true)
                       scaleimg.x = scaleimg.x-25
                    }
                  }
                  self.imgsnode.addChild(scaleimg)
                  scaleimg.setLocalZOrder(1)
            })
      }
  },
  addList:function(data){
      var pnglist = data.pnglist
      var getFun = data.getFun
      var outFun = data.outFun

      var showList = createList({
            scale: 1,
            list: pnglist,
            pos: cc.p(171 / 2, 502 / 2),
            num: 4,
            size: cc.size(171, 502),
            mix: 20,
            arrow: "white",
            color: "yellow",
            imgScale: 1,
            modify: cc.p(0, -30),
            arrOff: cc.p(20, -20),
            ifPage: true,
            getFun:getFun,
            outFun:outFun
      })
      showList.setPosition(912,292)
      return showList
  },
  myEnter: function() {
    this._super()
    var self = this
    if (this.nodebs) {
        var self = this
        self.nodebs.show(function(){
           self.nodebs.say({
                key: "wenzi1",
            })     
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
          key: "wenzi1",
          img:res.wenzi00,
          sound:res.zimp1,
    })
  }
})