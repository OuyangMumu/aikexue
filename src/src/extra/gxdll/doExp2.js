//@author mu @16/5/11
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
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
                for (var i = 0; i < 13; i++) {
                  colors[i] = cc.color(180,0,180)
                  changes[i] = false
                  if(i==12){
                    changes[i] = true
                  }
                }
                var bgg = createBiaoge({
                  json: res.biao2,
                  scale: 0.9,
                  inputNum:13,
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
        this.datacontrol = {
            maxFn:0.36,
            allFw:[
                [
                   {fn1:0,fn2:0.09,e:5,changeY:303},
                   {fn1:0.09,fn2:100,e:6,changeY:250}
                ],

                [
                   {fn1:0,fn2:0.07,e:4,changeY:327},
                   {fn1:0.07,fn2:0.14,e:5,changeY:303},
                   {fn1:0.14,fn2:100,e:6,changeY:250}
                ],

                [
                   {fn1:0,fn2:0.07,e:3,changeY:375},
                   {fn1:0.07,fn2:0.14,e:4,changeY:327},
                   {fn1:0.14,fn2:0.2,e:5,changeY:303},
                   {fn1:0.2,fn2:100,e:6,changeY:250}
                ],
                [
                   {fn1:0,fn2:0.07,e:2,changeY:385},
                   {fn1:0.07,fn2:0.14,e:3,changeY:375},
                   {fn1:0.14,fn2:0.2,e:4,changeY:327},
                   {fn1:0.2,fn2:0.26,e:5,changeY:303},
                   {fn1:0.32,fn2:100,e:6,changeY:250}
                ],
                [
                   {fn1:0,fn2:0.06,e:1,changeY:392},
                   {fn1:0.06,fn2:0.12,e:2,changeY:385},
                   {fn1:0.12,fn2:0.18,e:3,changeY:375},
                   {fn1:0.18,fn2:0.24,e:4,changeY:327},
                   {fn1:0.24,fn2:0.3,e:5,changeY:303},
                   {fn1:0.3,fn2:100,e:6,changeY:250}
                ],
                [
                   {fn1:0,fn2:0.06,e:1,changeY:392},
                   {fn1:0.06,fn2:0.12,e:2,changeY:385},
                   {fn1:0.12,fn2:0.18,e:3,changeY:375},
                   {fn1:0.18,fn2:0.24,e:4,changeY:327},
                   {fn1:0.24,fn2:0.3,e:5,changeY:303},
                   {fn1:0.3,fn2:0.36,e:5,changeY:303},
                   {fn1:0.36,fn2:100,e:6,changeY:250}
                ],
            ],
            lastY:392,
            changeY:200
          }
          
        self.quanList = []
    },
    initUI:function(){
        var self = this

        var wood1 = new cc.Sprite(res.shuben1)
        wood1.setPosition(354,175)
        self.addChild(wood1,1)
        self.wood1 = wood1

        var wood2 = new cc.Sprite(res.shuben1)
        wood2.setPosition(856,175)
        self.addChild(wood2,1)
        wood2.setScale(-1,1)
        self.wood2 = wood2

        self.bookTou1 = new cc.Sprite(res.shuben1)
        self.bookTou1.setPosition(354,175)
        self.addChild(self.bookTou1,1)
        self.bookTou1.setVisible(false)
        self.clockBook = true
        createTouchEvent({
            item:self.bookTou1,
            begin:function(data){
                var pos = data.pos
                var item = data.item
                if(self.clockBook){
                    cc.log("remove book1")
                    self.clockBook = false
                    var items = self.toolbtn.getindex(0)
                    if(self.curBook){
                          self.curBook.forceBack()
                          self.curBook = null
                          item.needMove = null
                        }
                    if(item.needMove&& item.needMove!=items[self.bookNum-1]){
                        item.needMove.forceBack()
                        item.needMove = null
                    }
                    if(items[self.bookNum-1]){
                        items[self.bookNum-1].setPosition(pos)
                        item.needMove = items[self.bookNum-1]
                        self.curBook = item.needMove
                    }
                    if(self.curPage){
                        self.clearQuanList()
                        self.curPage.forceBack()
                        self.curPage = null
                    }
                    self.removeBook()
                }
                return true
            },
            move:function(data){
                var pos = data.pos
                var item = data.item
                if(item.needMove){
                    item.needMove.setPosition(pos)
                }
            },
            end:function(){
                self.clockBook = true
            }
        })
        self.bookTou1.disListen(true)

        self.bookTou2 = new cc.Sprite(res.shuben1)
        self.bookTou2.setPosition(856,175)
        self.bookTou2.setVisible(false)
        self.addChild(self.bookTou2,1)
        self.bookTou2.setScale(-1,1)
        createTouchEvent({
            item:self.bookTou2,
            begin:function(data){
                var pos = data.pos
                var item = data.item
                if(self.clockBook){
                    self.clockBook = false
                    cc.log("remove book2")
                    self.clockBook = false
                    var items = self.toolbtn.getindex(0)
                    if(self.curBook){
                          self.curBook.forceBack()
                          self.curBook = null
                          item.needMove = null
                        }
                    if(item.needMove && item.needMove!=items[self.bookNum-1]){

                        item.needMove.forceBack()
                        item.needMove = null
                    }
                    if(items[self.bookNum-1]){
                        items[self.bookNum-1].setPosition(pos)
                        item.needMove = items[self.bookNum-1]
                        self.curBook = item.needMove
                    }
                    if(self.curPage){
                        self.clearQuanList()
                        self.curPage.forceBack()
                        self.curPage = null
                    }
                    self.removeBook()
                }
                return true
            },
            move:function(data){
                var pos = data.pos
                var item = data.item
                if(item.needMove){
                    item.needMove.setPosition(pos)
                }
            },
            end:function(data){
                var pos = data.pos
                var item = data.item
                self.clockBook = true
                if(item.needMove){
                    
                }
            }
        })
        self.bookTou2.disListen(true)


        self.curPage = null
        self.testRect = cc.rect(500,60,240,510)
        self.bookNum = 0 

        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
 
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
                if(index==0){
                    if(self.curBook){
                        self.curBook.forceBack()
                        self.curBook = null
                    }
                    self.curBook = item
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
                  if(
                   judgeItemCrash({item1:item,item2:self.bookTou1}) ||
                   judgeItemCrash({item1:item,item2:self.bookTou2}))
                  {
                    self.addBook()
                    item.setPosition(560,-500)
                    self.curBook = null
                    if(self.curPage){
                        self.clearQuanList()
                        self.curPage.forceBack()
                        self.curPage = null
                    }
                  }
              }else if(index==1){
                  item.setPosition(602,242)
                  if(self.curPage){
                    var info = self.datacontrol
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
                if(index==0){
                    self.curBook = null
                    if(self.bookTou1.needMove){
                        self.bookTou1.needMove = null
                    }
                    if(self.bookTou2.needMove){
                        self.bookTou2.needMove = null
                    }
                }else if(index==2){
                   if(self.curCoin){
                      self.curCoin = null
                   }
                }
                return true
            },
            counts:[5,1,999],
            father:toolnode,
            files:[res.item4,res.item2,res.item3],
            gets:[res.shuben,res.wz1,res.coin]
        })
        this.addChild(this.toolbtn,3)
    },
    removeBook:function(){
        var self = this
        var index = self.bookNum-1
        for (var i in self.wood1.getChildren()) {
            var child = self.wood1.getChildren()[i]
            if(child.index == index)
            {
               child.removeFromParent()
            }
        }
        for (var i in self.wood2.getChildren()) {
            var child = self.wood2.getChildren()[i]
            if(child.index == index)
            {
               child.removeFromParent()
            }
        }
        self.bookNum--
        self.changeHigh()
    },
    addBook:function(){
        var self = this
        self.bookNum++
        var book1 = new cc.Sprite(res.shuben1)
        book1.setPosition(137,97+self.bookNum*26)
        book1.index = self.bookNum-1
        self.wood1.addChild(book1)

        var book2 = new cc.Sprite(res.shuben1)
        book2.setPosition(137,97+self.bookNum*26)
        book2.index = self.bookNum-1
        self.wood2.addChild(book2)
        self.changeHigh()
        if(self.bookTou1.needMove){
            self.bookTou1.needMove = null
        }
        if(self.bookTou2.needMove){
            self.bookTou2.needMove = null
        }
    },
    changeHigh:function(){
        var self = this
        var judge = self.bookNum >= 1 ? false : true
        self.bookTou1.disListen(judge)
        self.bookTou2.disListen(judge)
        self.bookTou1.y = 175 + self.bookNum*26
        self.bookTou2.y = 175 + self.bookNum*26
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
          var fw = info.allFw[self.bookNum]
          cc.log(fw)
          for (var i = 0; i < fw.length; i++) {
              var details = fw[i]
              if(details.fn1< Fn && details.fn2>=Fn){
                var ac = createAnimation({
                          ifFile:true,
                          frame:"wz%d",
                          start:startFrame,
                          end:details.e,
                          time: 0.03,
                        })
                self.curPage.runAction(ac)
                self.curPage.startFrame = details.e
                var dis = details.changeY - self.curPage.lastY
                self.moveQuanList(dis)
                self.curPage.lastY = details.changeY
                break
              }
          }
          if(self.curPage.startFrame>=6){
            self.speakeBykey("wenzi3")
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
                self.speakeBykey("wenzi2")
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
            key: "wenzi2",
            img:res.wenzi2,
            sound: res.zimp2
        })

        addContent({
            people: this.nodebs,
            key: "wenzi3",
            img:res.wenzi3,
            sound: res.zimp3
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