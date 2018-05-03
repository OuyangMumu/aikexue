//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
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
                var changes = []
                for (var i = 0; i < 9; i++) {
                  colors[i] = cc.color(180,0,180)
                  changes[i] = false
                  if(i==8){
                    changes[i] = true
                  }
                }
                var bgg = createBiaoge({
                  json: res.biao1,
                  scale: 0.9,
                  inputNum:9,
                  inputLineChange:changes,
                  rootColor:colors
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
            maxFn:0.02,
            fw:[
               {
                fn1:0,
                fn2:100,
                frames:{
                    name:"pz%d",
                    e:4
                },
                changeY:180
               },
            ],
            prepos:cc.p(568,140),
            lastY:275,
          },
          {
            maxFn:0.36,
            fw:[
               {
                fn1:0,
                fn2:0.06,
                frames:{
                    name:"wz%d",
                    e:1
                },
                changeY:392
               },
                {
                fn1:0.06,
                fn2:0.12,
                frames:{
                    name:"wz%d",
                    e:2
                },
                changeY:385
               },
                {
                fn1:0.12,
                fn2:0.18,
                frames:{
                    name:"wz%d",
                    e:3
                },
                changeY:375
               },
                {
                fn1:0.18,
                fn2:0.24,
                frames:{
                    name:"wz%d",
                    e:4
                },
                changeY:327
               },
                {
                fn1:0.24,
                fn2:0.3,
                frames:{
                    name:"wz%d",
                    e:5
                },
                changeY:303
               },
                {
                fn1:0.3,
                fn2:0.36,
                frames:{
                    name:"wz%d",
                    e:5
                },
                changeY:303
               },
                {
                fn1:0.36,
                fn2:100,
                frames:{
                    name:"wz%d",
                    e:6
                },
                changeY:250
               },
            ],
            prepos:cc.p(568,142),
            lastY:392,
            changeY:200
          }
        ]
        self.quanList = []
    },
    initUI:function(){
        var self = this

        var wood1 = new cc.Sprite(res.wood)
        wood1.setPosition(405.11,203.83)
        self.addChild(wood1,1)
        wood1.setScale(0.83)

        var wood2 = new cc.Sprite(res.wood)
        wood2.setPosition(797.11,203.83)
        self.addChild(wood2,1)
        wood2.setScale(-0.83,0.83)

        self.curPage = null
        self.testRect = cc.rect(500,60,240,510)

        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
        self.curCoin = null
 
        this.toolbtn = createTool({
            pos:cc.p(110, 480),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.41, 1.2),
            itempos:[cc.p(1,-23),cc.p(1,-20),cc.p(1,-28)],
            circlepos:cc.p(0,10),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                item.index = index
                item.setLocalZOrder(LOCAL_ORDER++)
                if(index==0 || index==1){
                    if(self.curPage){
                        self.clearQuanList()
                        self.curPage.forceBack()
                        self.curPage = null
                    }
                }
                if(index==0){
                    item.setAnchorPoint(0.5,0.7)
                    self.curPage = item
                }else if(index==1){
                    self.curPage = item
                }else if(index==2){
                    if(self.curPage && self.curPage.notcanAdd){
                       self.speakeBykey("wenzi5")
                       return false
                    }else{
                      if(self.curCoin && !self.curCoin.haveAdd){
                         self.curCoin.forceBack()
                         self.curCoin = null
                      }
                      self.curCoin = item
                    }
                }
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
              if(index==2 && self.curPage){
                if(cc.rectContainsPoint(self.testRect,pos)){
                  item.haveIn = true
                  item.x = 610
                  if(self.curPage){
                    var lastY =  self.curPage.lastY
                    var max = lastY + self.quanList.length*5.5
                    if(pos.y < max && pos.y > 60){
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
              var index = data.index
              if(index==0){
                  item.setPosition(600,272)
                  if(self.curPage){
                    var info = self.datacontrol[index]
                    self.curPage.info = info
                    self.curPage.lastY = info.lastY
                    self.curPage.startFrame = 1
                  }
                  item.removeListen()
              }else if(index==1){
                  item.setPosition(602,242)
                  if(self.curPage){
                    var info = self.datacontrol[index]
                    self.curPage.info = info
                    self.curPage.lastY = info.lastY
                    self.curPage.startFrame = 1
                  }
                  item.removeListen()
              }else if(index==2){
                  if(item.haveIn){
                    self.curCoin.haveAdd = true
                    self.curCoin = null
                    self.addItem(item)
                  }
              }
            },
            backfun:function(data){
                var index = data.index
                if(index==0 || index==1)
                {
                  if(self.curPage){
                    self.curPage = null
                  }
                }else if(index==2){
                   if(self.curCoin){
                      self.curCoin = null
                   }
                }
                return true
            },
            counts:[1,1,999],
            father:toolnode,
            files:[res.item1,res.item2,res.item3],
            gets:[res.pz1,res.wz1,res.coin]
        })
        this.addChild(this.toolbtn,3)
    },
    addItem:function(item){
      var self = this
      item.haveSet = true
      item.removeListen()
      self.quanList[self.quanList.length] = item
      var out_pos = item.getPosition()
      var lastY = self.curPage.lastY
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
        cc.log("fn:::",Fn)
        if(self.curPage)
        {
          var info = self.curPage.info
          var startFrame = self.curPage.startFrame
          var fw = info.fw
          for (var i = 0; i < fw.length; i++) {
              var details = fw[i]
              if(details.fn1< Fn && details.fn2>=Fn){
                var curFrame = details.frames
                var ac = createAnimation({
                          ifFile:true,
                          frame:curFrame.name,
                          start:startFrame,
                          end:curFrame.e,
                          time: 0.03,
                        })
                self.curPage.runAction(ac)
                self.curPage.startFrame = curFrame.e

                var dis = details.changeY - self.curPage.lastY
                self.moveQuanList(dis)
                self.curPage.lastY = details.changeY
                break
              }
          }
          if(info.maxFn<Fn){
            self.curPage.notcanAdd = true
          }
        }   
    },
    getWeight:function(high){
      var self = this
      if(!self.quanList){
        self.quanList = []
      }
      var count = self.quanList.length
       cc.log("high:",high)
      if(high>=0){
        var tmpfn = 0.006 * Math.sqrt(19.6 * high/1000) / 0.06 + 0.06*count
        cc.log("tmpfn:",tmpfn)
        return tmpfn
      }else{
        return null
      }

    },
    moveQuanList:function(offset){
      var self = this
      for(var i = 0; i < self.quanList.length; i++){
        self.quanList[i].y = self.quanList[i].y + offset
        //self.quanList[i].runAction(cc.moveBy(0.03,cc.p(0,offset)))
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
            key: "wenzi5",
            img:res.wenzi5,
            sound: res.zimp7,
            offset:cc.p(50,20),
            buttonoffset:cc.p(0,-15)
        })
    }  
})