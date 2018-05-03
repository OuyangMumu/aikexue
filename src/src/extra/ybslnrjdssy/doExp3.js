//@author mu @16/5/11
var doExp3 = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  layerName: "doExp3",
  preLayer: "doLayer",
  ctor: function() { //创建时调用 未删除不会重复调用
    this.load(function() {
      loadPlist("wenzi")
      loadPlist("tieshao")
    })
    var self = this
    this._super()
    // if (!self.bgg) {
    //   var colors = [cc.color(255, 0, 0)]
    //   var keys = []
    //   for (var i = 1; i <= 30; i++) {
    //     keys[i] = null
    //   }
    //   keys[0] = 36
    //   var bg = createBiaoge({
    //     json: res.bg_biao2,
    //     isShowResult: true,
    //     scale: 0.9,
    //     inputNum: 31,
    //     gouNum: 10,
    //     answerModify: cc.p(50,5),
    //     scale: 0.9,
    //     rootColor: colors,
    //     inputKeys: [36]
    //   })
    //   self.addChild(bg)
    //   bg.setScale(0)
    //   self.bgg = bg
    // }
    this.expCtor({
      vis: false,
      setZ: 800,
      settingData: {
        pos: cc.p(1080, 580),
        biaogeFun: function() {
         if (!self.bgg) {
            var colors = [cc.color(255, 0, 0)]
            var bg = createBiaoge({
              json: res.bg_biao2,
              isShowResult: true,
              scale: 0.9,
              inputNum: 31,
              gouNum: 10,
              answerModify: cc.p(50,5),
              scale: 0.9,
              rootColor: colors,
              inputKeys: [36]
            })
            self.addChild(bg)
            self.bgg = bg
            cc.log(self.gouCount)
            for(var k=0; k<self.gouCount; k++){
              if(k!=(self.gouCountMax-1)){
                self.bgg.setGouState(k+1,true)
              }else{
                self.bgg.setGouState(k+1,false)
              }
            }
          }
          var bg = self.bgg
          bg.show()
        },
        ifCount: true,
      }
    })
    this.initUI()
    this.initPeople()
    this.initFunlist()

    return true
  },
  initFunlist: function() {
    var self = this
    self.clockList = [false, true, true, true, true,
      true
    ]
    self.imglist = ["wenzi19", "wenzi11", "wenzi20", "wenzi21", "wenzi1",
      "wenzi10", "wenzi13", "wenzi2", "wenzi15", "wenzi12", "wenzi11"
    ]
    //测试红色框
    self.myDraw = testForDrawNode(self)

    var start5 = function() {
      this.palyGet = function() {
        cc.log("play get yan ")
        var inself = this
        var spAction = createAnimation({
          frame: "tieshao%02d.png",
          start: 0,
          end: 12,
          time: 0.1,
          origin: true,
          fun: function() {
            inself.setTexture(res.tsz)
            inself.setPosition(inself.x, inself.y + 65)
            inself.haveSome = true
            inself.IsMove = false
          }
        })
        this.runAction(spAction)
      }
      this.addCount = 0
      this.palyLose = function(fun) {
        cc.log("play lose ")
        var inself = this
        var spAction = createAnimation({
          frame: "tieshao%02d.png",
          start: 13,
          end: 25,
          time: 0.13,
          origin: true,
          fun: function() {
            inself.setTexture(res.bigitem5)
            inself.setPosition(inself.x, inself.y + 65)
            inself.haveSome = false
            inself.IsMove = false
            if (fun) {
              fun()
            }
          }
        })
        this.runAction(spAction)
      }
    }

    self.startFunlist = [
      null,
      null,
      null,
      null,
      start5,
      null
    ]
    var move5 = function() {
      var item3 = self.toolbtn.getindex(3)
      if (item3) {
        var onerect = cc.rect(item3.x - item3.width / 2 + 60, item3.y,
          item3.width - 120, 40)

        var tworect = cc.rect(this.x - this.width / 2, this.y - this.height / 2,
          this.width / 2, 30)
        this.noend = true
        if (cc.rectIntersectsRect(onerect, tworect) && !this.haveSome) {
          var lt = self.toolbtn.getindex(1)
          var cups = self.toolbtn.getindex(2)
          this.IsMove = true
          this.noend = false
          this.temppos = cc.p(item3.x + 40, item3.y + 180)
          if (!cups || !lt) {
            self.speakeBykey("wenzi10")
            return false
          }
          if (cups) {
            if (!cups.haveWater) {
              self.speakeBykey("wenzi11")
              return false
            }
            if (cups.haveYan) {
              self.speakeBykey("wenzi12")
              return false
            }
          }
          this.setPosition(item3.x + 40, item3.y + 20)
          this.palyGet()
          this.noend = true
        }
      }
      var item2 = self.toolbtn.getindex(2)
      if (item2 && this.haveSome && !item2.cup.rongsp.noneLose) {
        var result1 = judgeItemCrash({
          item1: item2.cup,
          item2: this,
        })
        if (result1) {
          this.IsMove = true
          if (item2.cup.inTp) {
            this.noend = false
            var curkey = item2.haveYan ? "wenzi21" : "wenzi15"
            self.speakeBykey(curkey)
          } else {
            if (item2.haveYan) {
              self.speakeBykey("wenzi12")
            } else {
              item2.cup.IsMove = true
              item2.haveYan = true
              this.setPosition(item2.x + 70, item2.y + 140)
              this.palyLose(function() {
                var cups = self.toolbtn.getindex(2)
                var cup = cups.cup
                var cupclone = cups.cupclone
                cup.IsMove = false
                cup.weight = cup.weight + 4
                cup.count++
                  if (cup.count >= cup.max) {
                    cup.rongsp.noneLose = true
                  }
                if (!self.wenzi22) {
                  self.wenzi22 = true
                  self.speakeBykey("wenzi23")
                }
              })
              item2.cup.rongsp.playAc()
            }
          }
        }
      }
    }
    var move2 = function() {
      var item3 = self.toolbtn.getindex(2)
      if (item3) {
        var rect = cc.rect(this.x - this.width / 2, this.y - this.height / 2,
          this.width, this.height)
        var temppos = getWorldPos(item3.cup)
        if (cc.rectContainsPoint(rect,temppos)) {
          this.IsMove = true
          this.removeFromParent()
          item3.pushWater()
          item3.haveWater = true
        }
      }
    }
    var move6 = function() {
      var item6 = self.toolbtn.getindex(2)
      if (item6) {
        var panduan = judgeItemCrash({
          item1: item6.cup,
          item2: this
        })
        if (panduan && item6.haveYan) {
          this.IsMove = true
          if (item6.cup.inTp) {
            self.speakeBykey("wenzi21")
            this.x = 500
            return
          } else {
            var inself = this
            inself.setPosition(item6.x + 200, item6.y + 250)
            inself.setVisible(false)
            item6.actionWater(function() {
                inself.setVisible(true)
                inself.IsMove = false
                item6.haveYan = false
                self.gouCount = item6.cup.count
                if(self.bgg){
                  if (item6.cup.count == item6.cup.max) {
                    self.bgg.setGouState(item6.cup.count, false)
                  } else {
                    self.bgg.setGouState(item6.cup.count, true)
                  }
                }
            })
          }
        }
      }
    }
    self.moveFunList = [
      null,
      move2,
      null,
      null,
      move5,
      move6
    ]
    var end1 = function() {
      this.setPosition(850, 200)
      this.removeListen()
    }
    var end2 = function() {
      this.setPosition(380, 380)
    }
    var end3 = function() {
      this.setPosition(580, 120)
      this.removeListen()
      if (!this.first) {
        this.first = true
        var cup = this.getChildByName("cup1")
        var rongsp = cup.getChildByName("rongsp1")
        rongsp.playAc = function() {
          this.setVisible(true)
          this.setScale(0)
          this.runAction(cc.scaleTo(1.3, 1))
        }
        this.cup = cup
        cup.rongsp = rongsp
        cup.weight = 65
        cup.firstFather = this
        this.cup.count = 0
        this.cup.max = 10

        createTouchEvent({
          item:cup,
          begin: function(data) {
            var item = data.item
            data.noFather = true
            var dztp = self.toolbtn.getindex(0)
            if (dztp) {
              dztp.disWeight(data)
            }
            if (!item.IsMove) {
              return true
            } else {
              return false
            }
          },
          autoMove: true,
          end: function(data) {
            var item = data.item
            data.noFather = true
            data.needpos = cc.p(265,240)
            var dztp = self.toolbtn.getindex(0)
            if (dztp) {
              dztp.addItem(data)
            }
            if (!item.inTp) {
              item.setPosition(0, 0)
            }else{
              var item3 = self.toolbtn.getindex(2)
              if (!self.wenzi23 && item3.haveWater) {
                self.wenzi23 = true
                self.speakeBykey("wenzi22")
                self.clockList[3] = false
                self.clockList[4] = false
                self.clockList[5] = false
              }
            }
          }
        })

        this.pushWater = function() {
          this.stopAllActions()
          var ac = ccs.load(res.rongDo).action
          ac.gotoFrameAndPlay(0, 64, false)
          cc.log("ac",ac)
          var inself = this
          this.cup.IsMove = true
          ac.setLastFrameCallFunc(function() {
            inself.cup.IsMove = false
            var dztp = self.toolbtn.getindex(0)
            if(!inself.cup.inTp){
               inself.cup.weight += 100
               self.speakeBykey("wenzi20")
            }else{
              dztp.disWeight({
                item:inself.cup,
                noFather:true
              })
              inself.cup.weight = 165
              dztp.addItem({
                item:inself.cup,
                needpos:cc.p(265,240),
                noFather:true
              })
              if (!self.wenzi23) {
                self.wenzi23 = true
                self.speakeBykey("wenzi22")
                self.clockList[3] = false
                self.clockList[4] = false
                self.clockList[5] = false
              }
            }
            ac.clearLastFrameCallFunc()
          })
          this.runAction(ac)
        }

        this.actionWater = function(fun) {
          this.stopAllActions()
          var ac = ccs.load(res.rongDo).action
          ac.gotoFrameAndPlay(66, 121, false)
          var inself = this
          this.cup.IsMove = true
          if (!this.cup.rongsp.noneLose)
            this.cup.rongsp.setVisible(false)
          ac.setTimeSpeed(0.2)
          ac.setLastFrameCallFunc(function() {
            inself.cup.IsMove = false
            if (fun) {
              fun()
            }
          })
          this.runAction(ac)
        }
      }
    }
    var end4 = function() {
      this.setPosition(280, 80)
    }
    var end5 = function() {
      if (!this.noend && this.temppos) {
        this.setPosition(this.temppos)
        this.IsMove = false
      }
    }
    var end6 = function() {
      this.IsMove = false
    }
    self.endFunList = [
      end1,
      end2,
      end3,
      end4,
      end5,
      end6,
    ]
    self.checkFun = function() {
      if (this.clock) {
        var curimg = 0
        for (var k = 0; k < self.clockList.length; k++) {
          if (!self.clockList[k]) {
            curimg = k
          } else {
            break
          }

        }
        if (self.curChosenum) {
          curimg = self.curChosenum
        }
        self.speakeBykey(self.imglist[curimg])

        return false
      } else {
        if (this.excstartFun)
          this.excstartFun()
        this.excEndFun = self.endFunList[this.index]
        this.excMoveFun = self.moveFunList[this.index]
        return this
      }
    }
  },
  checkdistans: function(target1, target2, dis) {
    if (!(target1 && target2 && dis)) {
      cc.log("error call")
      return false
    }
    var dx = target1.x - target2.x
    var dy = target1.y - target2.y
    var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    if (distance <= dis) {
      return true
    } else
      return false
  },
  initUI: function() {
    var self = this
    self.curPing = 0
    self.gouCount = 0
    self.gouCountMax = 10

    var toolnode = new cc.Node()
    this.addChild(toolnode, 5)
    this.toolnode = toolnode
    this.toolbtn = createTool({
      pos: cc.p(105, 500),
      nums: 3,
      tri: "down",
      modify: cc.p(1, 1.2),
      devide: cc.p(1.5, 1.2),
      itempos: cc.p(1, -14),
      circlepos: cc.p(0, 15),
      showTime: 0.3,
      moveTime: 0.2,
      scale: 0.8,
      itemScale: 1,
      ifcircle: true,
      firstClick: function(data) {
        var item = data.sp
        var index = data.index
        if (index == 0) {
          item = createDZTP({
            itempos: cc.p(140, 278),
            qupibtnCallBack: function(ok) {
              if (!ok) {
                if (!self.wenzis1) {
                  self.speakeBykey("wenzis1")
                  self.wenzis1 = true
                }
              } else {
                if (!self.wenzi9) {
                  self.wenzi9 = true
                  self.speakeBykey("wenzi9")
                  self.clockList[1] = false
                  self.clockList[2] = false
                }
              }
            },
            onoffBtnCallBack: function() {

            }
          })
        }
        if (index == 2) {
          item = ccs.load(res.rongDo).node
        }
        if (index == 5) {
          item.setAnchorPoint(cc.p(0.5, 0.8))
          item.setScale(0.8)
        }
        item.index = index
        item.clock = self.clockList[index]
        if (self.startFunlist)
          item.excstartFun = self.startFunlist[index]
        item.checkFun = self.checkFun
        if (index != 0) {
          item.setLocalZOrder(LOCAL_ORDER++)
        }
        return item.checkFun()
      },
      clickfun: function(data) {
        var item = data.sp
        item.data = data
        data.item = item
        var index = data.index
        item.setLocalZOrder(LOCAL_ORDER++)
        if (item.clickFun)
          item.clickFun()
        return true
      },
      movefun: function(data) {
        var item = data.sp
        var delta = data.delta
        var index = data.index
        item.data = data
        if (!item.IsMove) {
          var temppos = cc.p(item.x + delta.x, item.y + delta.y)
          item.setPosition(temppos)
          if (item.excMoveFun)
            item.excMoveFun()
        }
      },
      outfun: function(data) {
        var item = data.sp
        data.item = item
        item.data = data
        if (item.excEndFun)
          item.excEndFun()
        return true
      },
      backfun:function(){
        return false
      },
      counts: [1, 1, 1, 1, 1, 1, 1],
      father: toolnode,
      files: [res.item1, res.item2, res.item3, res.item4,
        res.item5, res.item6
      ],
      gets: [null, res.bigitem2, null, res.bigitem4,
        res.bigitem5, res.hand
      ]
    })
    this.addChild(this.toolbtn, 3)
  },
  speakeBykey: function(key) {
    this.nodebs.say({
      key: key,
      force: true
    })
  },
  myEnter: function() {
    this._super()
    var self = this
    if (this.nodebs) {
      var self = this
      self.toolbtn.show()
      self.nodebs.show(function() {
        self.speakeBykey("wenzi19")
      })
    }
  },
  initPeople: function() {
    this.nodebs = addPeople({
      id: "student",
      pos: cc.p(1030, 120)
    })
    this.addChild(this.nodebs, 900);

    for (var i = 1; i < 24; i++) {
      addContent({
        people: this.nodebs,
        key: sprintf("wenzi%d", i),
        sound: res[sprintf("zimp%d", i)],
        img: sprintf("#wenzi%d0000", i),
        offset: cc.p(-10, 0)
      })
    }

    addContent({
      people: this.nodebs,
      key: "wenzis1",
      sound: res.zimp18,
      img: res.wenzis1,
      btnoffset: cc.p(-4, -20),
      offset: cc.p(-10, 26)
    })
  }
})