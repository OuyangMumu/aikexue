//@author mu @16/5/11
var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp3",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {

        })
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
                var inputLineChange = []
                for (var i = 0; i < 13; i++) {
                  colors[i] = cc.color(240,28,240)
                  inputLineChange[i] = false
                  if(i == 12){
                    inputLineChange[i] = true
                  }
                }
                var bgg = createBiaoge({
                  json: res.biao3,
                  scale: 0.9,
                  inputNum:13,
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
        this.initData()
        this.initUI()
        this.initPeople()
        return true
    },
    initData:function(){
        var self = this
        this.datacontrol = [
          {
            maxFn:0,
            prepos:cc.p(568,140),
            lastY:85
          },
          {
            maxFn:0.39,
            prepos:cc.p(568,142),
            lastY:48
          },
          {
            maxFn:0.93,
            prepos:cc.p(568,100),
            lastY:75
          },
          {
            maxFn:0.88,
            prepos:cc.p(565,106),
            lastY:20
          },
          {
            maxFn:0.45,
            prepos:cc.p(575,112),
            lastY:45
          },
          {
            maxFn:1,
            prepos:cc.p(568,140),
            lastY:50
          }
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

        var endListPos = [
          {
            pos:getMiddle(0,-140),
            lastY:190,
          },
          {
            pos:getMiddle(0,-100),
            lastY:190,
          },
          {
            pos:getMiddle(0,-140),
            lastY:195,
          },
          {
            pos:getMiddle(0,-102),
            lastY:205,
          },
          {
            pos:getMiddle(0,-135),
            lastY:249,
          },
          {
            pos:getMiddle(0,-125),
            lastY:253,
          }
        ]
       
        this.sq_pre = new cc.Sprite(res.change2)
        this.sq_pre.setPosition(568,142)
        this.addChild(this.sq_pre,10)
        this.sq_pre.setVisible(false)
        self.curPaper = null
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
        this.toolbtn = createTool({
            pos:cc.p(350, 550),
            nums:4,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.3, 1.5),
            itempos:[cc.p(1,-24),cc.p(1,-15),cc.p(1,-15),cc.p(1,-15),cc.p(1,-15),cc.p(1,-15),cc.p(1,-15)],
            circlepos:cc.p(0,24),
            showTime:0.3,
            moveTime:0.2,
            scale:0.73,
            itemScale:1.2,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                item.index = index
                if(index){
                    self.sq_pre.setVisible(false)
                    item.setAnchorPoint(0.5,0.7)
                    if(index==2){
                      item.sq_pre = new cc.Sprite(res.change2)
                      item.sq_pre.setPosition(256,105)
                      item.addChild(item.sq_pre)
                    }
                    if(self.curPaper){
                      self.clearQuanList()
                      self.curPaper.forceBack()
                      self.curPaper = null
                    }
                    self.curPaper = item
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
                    var max = self.curPaper.lastY + self.quanList.length*5.5
                    if(pos.y < max && pos.y > max-150){
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
                item.setPosition(endListPos[item.index-1].pos)
                item.removeListen()
                self.curPaper = item
                self.curPaper.lastY = endListPos[item.index-1].lastY
                if(item.index==2){
                  item.sq_pre.setVisible(false)
                  self.sq_pre.setTexture(res.change2)
                  self.sq_pre.setVisible(true)
                  self.sq_pre.setPosition(568,142)
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
                self.curPaper = null
              }
              return true
            },
            counts:[999,999,999,999,999,999,999],
            father:toolnode,
            files:[res.item10,res.item11,res.item12,res.item13,res.item14,res.item15,res.item16],
            gets:[res.coin,res.sq1,res.sq2,res.sq3,res.sq4,res.sq5,res.sq6]
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
      var to_pos = cc.p(out_pos.x,lastY+(self.quanList.length-1)*5.5)
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
          var tempIndex = self.curPaper.index
          if(self.datacontrol[tempIndex-1].maxFn <= Fn)
          {
            self.curPaper.notcanAdd = true
            var img_a = res[sprintf("change%d_a",tempIndex)]
            var img_b = res[sprintf("change%d_b",tempIndex)]
            if(img_a)
            {
              self.curPaper.setTexture(img_a)
            }
            if(img_b)
            {
              self.sq_pre.setTexture(img_b)
              self.sq_pre.setVisible(true)
              self.sq_pre.setPosition(self.datacontrol[tempIndex-1].prepos)
            }
            var tempLast = self.datacontrol[tempIndex-1].lastY
            var dis = tempLast - self.curPaper.lastY
            self.moveQuanList(dis)
            self.curPaper.lastY = tempLast
          }
        }   
    },
    getWeight:function(high){
      var self = this
      var count = self.quanList.length
      if(high>=0){
        var tmpfn = 0.006 * Math.sqrt(19.6 * high/1000) / 0.06 + 0.06*count
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