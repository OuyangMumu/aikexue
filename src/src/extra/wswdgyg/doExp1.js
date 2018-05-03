/**
 * Created by Administrator on 2016/6/1.
 */
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
           loadPlist("doChose")
        })
        this.needSet = false
        this.expCtor({
            btnOff: cc.p(130, 8)
        })
        this.initUI()
        this.initPeople()
        return true
    },
    myEnter: function() {
        this._super()
        var self = this
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
                self.nodebs.say({
                  key:"wenzi5",
                  force: true
                })  
            })     
        }
    },
    initUI: function() {
        var self = this
        var uinamelist = [
            "commitbtn",
            "daanbtn",
            "jielunBtn"
        ]
        for(var i = 1; i<=8; i++){
          uinamelist.push(sprintf("show%d",i))
        }
        var node = loadNode(res.do1, uinamelist);
        this.allnode = node
        node.setPosition(getMiddle(-40,25))
        self.inside_node.addChild(node)

        self.initData()

        node.jielunBtn.addClickEventListener(function(){
            self.nodebs.say({
              key:"jielun2"
            }) 
        })
    },
    initData: function() {
        var self = this
        var pnglist = [
          ["#b1.png", "#bb1.png","zuo","#c1.png"],
          ["#b2.png", "#bb2.png","zuo","#c2.png"],
          ["#b3.png", "#bb3.png","zuo","#c3.png"],
          ["#b4.png", "#bb4.png","zuo","#c4.png"],
          ["#b5.png", "#bb5.png","you","#c5.png"],
          ["#b6.png", "#bb6.png","you","#c6.png"],
          ["#b7.png", "#bb7.png","you","#c7.png"],
          ["#b8.png", "#bb8.png","you","#c8.png"],
        ]
      var MIXpnglist = mixArray(pnglist)
      var onepnglist = []
      for(var i=0; i<pnglist.length; i++){
         onepnglist.push(MIXpnglist[i][0])
      }
      
      var checkAndRest = function(index,item,list){
          for(var k=0;k<8; k++){
             var curSp = self.allnode[sprintf("show%d",k+1)]
             curSp.curType = k < 4 ? "zuo":"you"
             var result = judgeItemCrash({
                            item1:curSp,
                            item2:item
                          })
             if(result){
              if(curSp.curType == item.curType){
                 if(!curSp.have){
                    if(list){
                      var showimg = new cc.Sprite(list[index][1])
                      showimg.setPosition(130,50)
                      curSp.addChild(showimg)
                      item.removeFromParent()
                      curSp.have = showimg
                    }
                    return true
                 }else{
                    return false
                 }
              }
             }
          }
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
                          sp.curType = MIXpnglist[index][2]
                          return sp
                        },
                        outFun:function(data){
                          var item = data.item
                          var pos = data.pos
                          var index = data.index
                          if(!checkAndRest(index,item,MIXpnglist)){
                              guannode.judgeIndex(index, false)
                              item.removeFromParent(true)
                          }
                        },
                        mouseMoveFun:function(data){
                          var index = data.index
                          if(self.curindex != index){
                            if(self.showTi){
                              self.showTi.removeFromParent()
                              self.showTi = null
                            }
                          }
                          if(!self.showTi && index!=null){
                             self.curindex = index
                             self.showTi = new cc.Sprite(MIXpnglist[index][3])
                             self.showTi.setPosition(getMiddle(-80,0))
                             self.addChild(self.showTi,100)
                             self.showTi.setOpacity(0)
                             self.showTi.runAction(cc.spawn(
                                cc.fadeIn(0.1),
                                cc.moveBy(0.2,cc.p(0,20))
                             ))
                          }
                        },
                        mouseAway:function(){
                          if(self.showTi){
                            self.showTi.removeFromParent()
                            self.showTi = null
                          }
                        },
                        addBtnClickfun:function(data){
                          var index = data.index
                          if(self.curindex != index){
                            if(self.showTi){
                              self.showTi.removeFromParent()
                              self.showTi = null
                            }
                          }
                          if(!self.showTi){
                              self.curindex = index
                              self.showTi = new cc.Sprite(MIXpnglist[index][3])
                              self.showTi.setPosition(getMiddle(-80,0))
                              self.addChild(self.showTi,1000)
                              self.showTi.setOpacity(0)
                              self.showTi.runAction(cc.spawn(
                                cc.fadeIn(0.1),
                                cc.moveBy(0.2,cc.p(0,20))
                              ))
                              addMoving(self.showTi)
                              var closebtn = new ccui.Button(res.btn_chacha_nor, res.btn_chacha_sel)
                              closebtn.setPosition(self.showTi.width-16, self.showTi.height-20)
                              closebtn.setScale(0.9)
                              self.showTi.addChild(closebtn)
                              closebtn.addClickEventListener(function() {
                                  self.showTi.removeFromParent()
                                  self.showTi = null
                              })
                          }
                        }
                      })
      self.addChild(guannode)
    },
    addList:function(data){
      var pnglist = data.pnglist
      var getFun = data.getFun
      var outFun = data.outFun
      var mouseMoveFun = data.mouseMoveFun
      var mouseAway = data.mouseAway
      var addBtnClickfun = data.addBtnClickfun
      var ifOpenMouse = false
      var ifShowInfo = false
      if(!cc.sys.isNative){
         ifOpenMouse = true
      }else{
         ifShowInfo = true
      }

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
            outFun:outFun,
            mouseMoveFun:mouseMoveFun,
            mouseAway:mouseAway,
            ifOpenMouse:ifOpenMouse,
            ifShowInfo:ifShowInfo,
            addBtnClickfun:addBtnClickfun
      })
      showList.setPosition(912,295)

      return showList
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"student",
            pos:cc.p(1030, 130)
        })
        this.addChild(this.nodebs,500)

        addContent({
            people: this.nodebs,
            key: "wenzi5",
            img:res.jielun4,
            sound: res.zimp5
        })
        addContent({
          people: this.nodebs,
          key: "jielun2",
          img:res.jielun3,
          id:"result",
          sound: res.jielunmp2,
          offset: cc.p(30, 20),
          offbg: cc.p(40,30),
        })
    }
})