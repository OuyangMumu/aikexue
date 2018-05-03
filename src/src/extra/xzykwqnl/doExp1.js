//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
          loadPlist("paper_bei")
        })
        this._super()
        var self = this
        this.expCtor({
          vis: false,
          setZ: 800,
          settingData: {
            pos: cc.p(1080, 580),
            tubiaoData: {
              xname: "宽度/倍",
              yname: "垫圈/个",
              father: self,
              xmax:5,
              ymax:5,
              autoData: function() {
                  var result = []
                  if (self.bggg) {
                      var bg = self.bggg
                      var getlistA = [
                          [1, 1],
                          [2, 2],
                          [3, 3],
                          [4, 4],
                      ]
                      var getlistB = [
                          [1, 5],
                          [2, 6],
                          [3, 7],
                          [4, 8]
                      ]
                      var tempA = {
                          colorPoint: cc.color(255, 0, 0, 255),
                          pointSize:3,
                          colorLine: cc.color(255, 100, 0, 255),
                          colorRleation: cc.color(255, 100, 100, 255),
                          colorCurve: cc.color(255, 0, 100, 255),
                          points: [],
                      }
                      var tempB = {
                          colorPoint: cc.color(0, 0, 255, 255),
                          pointSize:3,
                          colorLine: cc.color(0, 150, 255, 255),
                          colorRleation: cc.color(200, 150, 255, 255),
                          colorCurve: cc.color(140, 230, 255, 255),
                          points: [],
                      }
                      var judgePoint = function(xindex, yindex) {
                          var x = xindex 
                          var y = bg.getKey(yindex)
                          if (x != "" && y != "") {
                              x = parseFloat(x).toFixed(2)
                              y = parseFloat(y).toFixed(2)
                              if (x != "NaN" && y != "NaN") {
                                  return {
                                      x: parseFloat(x),
                                      y: parseFloat(y)
                                  }
                              }
                          }
                          return null
                      }
                      for (var i = 0; i < getlistA.length; i++) {
                          var point = judgePoint(getlistA[i][0], getlistA[i][1])
                          if (point) {
                              tempA.points.push(point)
                          }
                      }
                      for (var i = 0; i < getlistB.length; i++) {
                          var point = judgePoint(getlistB[i][0], getlistB[i][1])
                          if (point) {
                              tempB.points.push(point)
                          }
                      }
                      result.push(tempA)
                      result.push(tempB)
                  }
                  return result
              }
            },
            biaogeFun: function() {
              if (!self.bggg) {
                var colors = []
                var inputLineChange = []
                for (var i = 0; i < 9; i++) {
                  colors[i] = cc.color(240,28,240)
                  inputLineChange[i] = false
                  if(i == 8){
                    inputLineChange[i] = true
                  }
                }
                var bgg = createBiaoge({
                  json: res.biao1,
                  scale: 0.9,
                  inputNum:9,
                  rootColor:colors,
                  inputLineChange:inputLineChange
                })
                self.addChild(bgg)
                self.bggg = bgg
                bgg.setBack(function() {
                    if (self.tubiao) {
                        self.tubiao.judgeAuto()
                    }
                })
              }
              var bgg = self.bggg
              bgg.show()
            },
          }
        })
        this.initData()
        this.initUI()
        this.initPeople()
        return true
    },
    initData:function(){
        var self = this
        this.datacontrol = [
            {
                fw:[
                    [0,0.04,"one_bei3.png",160],
                    [0.04,100,"one_bei5.png",125],
                ],
                allFN:0.04
            },
            {
                fw:[
                    [0,0.04,"two_bei1.png",178],
                    [0.04,0.06,"two_bei3.png",165],
                    [0.06,10,"two_bei5.png",117],
                ],
                allFN:0.06
            },
            {
                fw:[
                    [0,0.02,"three_bei0.png",190],
                    [0.02,0.04,"three_bei1.png",185],
                    [0.04,0.06,"three_bei3.png",160],
                    [0.06,0.08,"three_bei4.png",145],
                    [0.08,10,"three_bei5.png",110],
                ],
                allFN:0.08
            },
            {
                fw:[
                    [0,0.02,"four_bei0.png",170],
                    [0.02,0.04,"four_bei1.png",153],
                    [0.04,0.06,"four_bei2.png",138],
                    [0.06,0.08,"four_bei3.png",130],
                    [0.08,0.1,"four_bei4.png",105],
                    [0.1,10,"four_bei5.png",90],
                ],
                allFN:0.1
            },
        ]
        self.testRect = cc.rect(480,100,160,360)
        self.quanList = []
        self.curPaper = null
    },
    initUI:function(){
        var self = this

        var desk = new cc.Sprite(res.desk)
        desk.setPosition(getMiddle(0,-200))
        self.addChild(desk)
        self.curPaper = null
        self.curCoin = null
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
        this.toolbtn = createTool({
            pos:cc.p(350, 550),
            nums:5,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.3, 1.5),
            itempos:[cc.p(1,-24.5),cc.p(1,-18),cc.p(1,-18),cc.p(1,-18),cc.p(1,-18)],
            circlepos:cc.p(0,24),
            showTime:0.3,
            moveTime:0.2,
            scale:0.73,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                item.index = index
                if(index){
                  if(self.curPaper){
                    self.clearQuanList()
                    self.curPaper.forceBack()
                    self.curPaper = null
                  }
                  self.curPage = item
                }else{
                  if(toolnode.getChildrenCount()==0){
                    self.speakeBykey("wenzi2")
                    return false
                  }else{
                    if(self.curPaper && self.curPaper.notcanAdd){
                      self.speakeBykey("wenzi3")
                      return false
                    }else{
                      if(self.curCoin && !self.curCoin.haveAdd){
                         self.curCoin.forceBack()
                         self.curCoin = null
                      }
                      self.curCoin = item
                    }
                  } 
                }
                item.setLocalZOrder(LOCAL_ORDER++)
                return true
            },
            clickfun:function(data){
              var item = data.sp
              item.setLocalZOrder(LOCAL_ORDER++)
              return true
            },
            movefun:function(data){
              var item = data.sp
              var pos = data.pos
              var delta = data.delta
              var index = data.index
               item.x += delta.x
               item.y += delta.y
              if(index==0){
                if(cc.rectContainsPoint(self.testRect,pos)){
                  item.haveIn = true
                  item.x = 568
                  if(self.curPaper){
                    var max = self.curPaper.lastY + self.quanList.length*8
                    if(pos.y < max && pos.y > max-100){
                      item.y = max
                    }
                  }
                }else{
                  if(item.haveIn){
                    item.haveIn = false
                    item.setPosition(pos)
                  }
                }
              }
            },
            outfun:function(data){
              var item = data.sp
              if(item.index){
                item.setPosition(getMiddle(0,-165))
                item.removeListen()
                self.curPaper = item
                if(item.index==5){
                  self.curPaper.lastY = 170
                }else{
                  self.curPaper.lastY = 190
                }
              }else{
                if(item.haveIn){
                  self.curCoin.haveAdd = true
                  self.curCoin = null
                  self.addItem(item)
                }
              }
            },
            backfun:function(data){
              var index = data.index
              if(index==0){
                self.curCoin = null
              }else{
                self.curPage = null
              }
              return true
            },
            counts:[999,999,999,999,999],
            father:toolnode,
            files:[res.item1,res.item2,res.item3,res.item4,res.item5],
            gets:[res.dianquan,res.one_bei0,res.two_bei0,res.three_bei0,res.four_bei0]
        })
        this.addChild(this.toolbtn,3)
    },
    addItem:function(item){
      var self = this
      item.haveSet = true
      item.removeListen()
      self.quanList[self.quanList.length] = item
      var out_pos = item.getPosition()
      var lastY = self.curPaper.lastY
      var to_pos = cc.p(out_pos.x,lastY+(self.quanList.length-1)*8)
      var high = out_pos.y - to_pos.y
      var Fn = self.getWeight(high)
      item.runAction(cc.sequence(
        cc.moveTo(high/900,to_pos),
        cc.callFunc(function(){
           self.changeSome(Fn)
        })
      ))
    },
    changeSome:function(Fn){
        var self = this
        if(self.curPaper)
        {
          var allfw = self.datacontrol[self.curPaper.index-1].fw
          for(var i in allfw)
          {
            if(allfw[i][0]<=Fn && allfw[i][1]>Fn)
            {
              self.curPaper.setSpriteFrame(allfw[i][2])
              var dis = allfw[i][3] - self.curPaper.lastY
              self.moveQuanList(dis)
              self.curPaper.lastY = allfw[i][3]
            }
          }
          if(self.datacontrol[self.curPaper.index-1].allFN <= Fn)
          {
            self.curPaper.notcanAdd = true
          }
        }   
    },
    getWeight:function(high){
      var self = this
      var count = self.quanList.length
      if(high>=0){
        var tmpfn = 0.002 * Math.sqrt(19.6 * high/1000) / 0.06 + 0.02*count
        return tmpfn
      }else{
        return null
      }
    },
    moveQuanList:function(offset){
      var self = this
      for(var i = 0; i < self.quanList.length; i++){
        self.quanList[i].y = self.quanList[i].y + offset
      }
    },
    clearQuanList:function(){
      var self = this
      for(var i = 0; i < self.quanList.length; i++){
        self.quanList[i].forceBack()
      }
      self.quanList = [] 
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
                self.speakeBykey("wenzi1")
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
            key: "wenzi1",
            img:res.wenzi1,
            sound: res.zimp1
        })

        addContent({
            people: this.nodebs,
            key: "wenzi2",
            img:res.wenzi2,
            sound: res.zimp2
        })

        addContent({
            people: this.nodebs,
            key: "wenzi3",
            img:res.wenzi3,
            sound: res.zimp3,
            offset:cc.p(50,20),
            buttonoffset:cc.p(0,-15)
        })
    }  
})