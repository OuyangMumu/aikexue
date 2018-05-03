//@author mu @16/5/11
var doExp1 = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  layerName: "doExp1",
  preLayer: "doLayer",
  ctor: function() { //创建时调用 未删除不会重复调用
    this.load(function() {})
    this._super()
    var self = this
    this.expCtor({
      vis: false,
      setZ: 800,
      settingData: {
        pos: cc.p(1080, 580),
        biaogeFun: function() {
          if (!self.bgg) {
            var bg = createBiaoge({
              json: res.bg_biao1,
              scale: 0.9
            })
            self.addChild(bg)
            self.bgg = bg

            var that = bg.getBg()
            createBgMoveSp({
              father: that,
              imgs: [
                [res.answer1, 0],
                [res.answer2, 1],
                [res.answer3, 2],
                [res.answer4, 3],
                [res.answer5, 4],
                [res.answer6, 5],
              ],
              rectlist: [
                cc.rect(372, 295, 370, 50),
                cc.rect(372, 240, 370, 50),
                cc.rect(372, 180, 370, 60),
                cc.rect(372, 125, 370, 55),
                cc.rect(372, 65, 370, 60),
                cc.rect(372, 5, 370, 60)
              ],
              itempos: [
                cc.p(134, -48), cc.p(367, -48), cc.p(600, -48),
                cc.p(134, -110), cc.p(367, -110), cc.p(600, -110)
              ],
              resultfather: self
            })
            bg.setUpLoad(function() {
              that.upResult()
            })
            bg.setClear(function() {
              that.clearData()
            })
          }
          var bg = self.bgg
          bg.show()
        }
      }
    })
    this.initFunlist()
    this.initUI()
    this.initPeople()
    return true
  },
  initFunlist: function() {
    var self = this
    self.clockList = [false, true, true, true, true]
    self.imglist = [res.tip1, res.tip2, res.tip2, res.tip3, res.tip3]

    //测试红色框
    self.myDraw = testForDrawNode(self)
      //self.myDraw.drawRectbyRect()
      //self.myDraw.drawDotbyPoint()
    var toDeal = function(data) {
      var item = data.item
      var toPos = data.toPos
      var fun = data.fun
      var testRect = data.testRect
      if (cc.rectIntersectsRect(self.waterCup.checkRect, testRect)) {
        item.IsMove = true
        item.runAction(cc.sequence(
          cc.moveTo(0.2, toPos),
          cc.callFunc(function() {
            item.removeFromParent()
            if (fun) {
              fun()
            }
          })
        ))
      }
    }
    var move1 = function() {
      toDeal({
        testRect: cc.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height),
        item: this,
        toPos: cc.p(480, 400),
        fun: function() {
          self.waterCup.DaoShiZi(function() {
            self.speakeBykey("wenzi2")
            self.clockList[1] = false
          })
        }
      })
    }
    var move2 = function() {
      toDeal({
        testRect: cc.rect(this.x - this.width / 2 + 20, this.y - this.height / 2, this.width - 20, this.height),
        item: this,
        toPos: cc.p(430, 390),
        fun: function() {
          self.waterCup.DaoWater(function() {
            self.speakeBykey("wenzi3")
            self.clockList[2] = false
            self.clockList[3] = false
          })
        }
      })
    }
    var move4 = function() {
      var pos = cc.p(this.x - this.width / 2, this.y - this.height / 2)
      if (cc.rectContainsPoint(self.waterCup.checkRect, pos) && this.flowSp) {
        this.IsMove = true
        var inself = this
        if (!this.second) {
          this.second = true
          this.runAction(cc.sequence(
            cc.moveTo(0.2, cc.p(330, 440)),
            cc.callFunc(function() {
              inself.setVisible(false)
              self.waterCup.JiaZhi(function() {
                inself.setVisible(true)
                safeAdd(self,inself.flowSp)
                inself.flowSp.setPosition(-1000,0)
                inself.flowSp = null
                inself.IsMove = false
              })
            })
          ))
        } else {
          this.runAction(cc.sequence(
            cc.moveTo(0.2, cc.p(300, 470)),
            cc.callFunc(function() {
              inself.removeFromParent()
              self.waterCup.JiaZhi(function() {
                self.speakeBykey("wenzi4")
                self.clockList[4] = false
              }, "two")
            })
          ))
        }
      }
    }
    var move5 = function() {
      toDeal({
        testRect: cc.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height),
        item: this,
        toPos: cc.p(530, 270),
        fun: function() {
          self.waterCup.SaWater(function() {
            var jitlunbtn = new ccui.Button(res.btn_result_normal, res.btn_result_select)
            jitlunbtn.setPosition(1030, 420)
            self.addChild(jitlunbtn)
            jitlunbtn.addClickEventListener(function() {
              self.nodebs.say({
                key: "jielun"
              })
            })
          })
        }
      })
    }
    self.moveFunList = [
      move1,
      move2,
      null,
      move4,
      move5
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
        dialogControl.AddDialog("Tips", {
            res: self.imglist[curimg],
            face: 1,
            confirmBtn: true,
            father: self
          })
          ///self.speakeBykey()
        return false
      } else {
        if (this.excstartFun)
          this.excstartFun()
        this.excMoveFun = self.moveFunList[this.index]
        return this
      }
    }
  },
  initUI: function() {
    var self = this
    var toolnode = new cc.Node()
    this.addChild(toolnode, 5)
    this.toolnode = toolnode
    self.curCount = null
    this.toolbtn = createTool({
      pos: cc.p(280, 530),
      nums: 5,
      tri: "right",
      modify: cc.p(1, 1.2),
      devide: cc.p(1.2, 1.2),
      itempos: [cc.p(1, -18), cc.p(4, -15), cc.p(1, -14), cc.p(1, -16), cc.p(1, -9)],
      circlepos: cc.p(0, 16),
      showTime: 0.3,
      moveTime: 0.2,
      scale: 0.9,
      itemScale: 1,
      ifcircle: true,
      firstClick: function(data) {
        var item = data.sp
        var index = data.index
        if (index == 3) {
          item = new cc.Sprite(res.bigitem6)
          var pre = new cc.Sprite(res.bigitem4)
          pre.setPosition(76, 84)
          item.addChild(pre, 10)
        }
        item.index = index
        item.clock = self.clockList[index]
        item.checkFun = self.checkFun
        item.setLocalZOrder(LOCAL_ORDER++)
        return item.checkFun()
      },
      clickfun: function(data) {
        var item = data.sp
        var index = data.index
        item.data = data
        data.item = item
        if (item.IsMove) {
          return false
        }
        if(index == 3) {
          var item2 = self.toolbtn.getindex(2)
          var pos = cc.p(item.x - item.width / 2, item.y - item.height / 2)
          if (item2) {
            if (!item.flowSp) {
              for (var i = 0; i < item2.length; i++) {
                if( self.curCount == i){
                  continue
                }
                var cursp = item2[i]
                var rect1 = cc.rect(cursp.x - cursp.width / 2 + 10, cursp.y - cursp.height / 2 + 10,
                  cursp.width - 20, cursp.height - 20)
                if (cc.rectContainsPoint(rect1, pos)) {
                  safeAdd(item, cursp)
                  cursp.setPosition(item.convertToNodeSpace(cursp.getPosition()))
                  cursp.setLocalZOrder(5)
                  item.flowSp = cursp
                  self.curCount = i
                  break
                }
              }
            } else {
              var curpos = item.convertToWorldSpace(item.flowSp.getPosition())
              safeAdd(toolnode, item.flowSp)
              item.flowSp.setPosition(curpos)
              item.flowSp = null
              self.curCount = null
            }
          }
        }
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
        item.data = data
        data.item = item
        if (item.excEndFun)
          item.excEndFun()
        return true
      },
      backfun: function() {
        return false
      },
      father: toolnode,
      counts: [1, 1, 2, 1, 1],
      files: [res.item1, res.item2, res.item3, res.item4, res.item5],
      gets: [res.bigitem1, res.bigitem2, res.bigitem3, null, res.bigitem5]
    })
    this.addChild(this.toolbtn,1)

    self.waterCup = self.createWaterCup()
    self.waterCup.setPosition(300, 160)
    self.addChild(self.waterCup, 2)
    self.waterCup.checkRect = cc.rect(180, 280, 230, 80)
  },
  createWaterCup: function() {
    var waterCup = new cc.Sprite(res.waterCup1)

    var waterCup1 = new cc.Sprite(res.waterCup2)
    waterCup1.setPosition(150.8, 143.7)
    waterCup.addChild(waterCup1, 20)

    waterCup.DaoShiZi = function(fun) {
      if (!this.plistShi) {
        loadPlist("shitou")
        loadPlist("shitou1")
        this.plistShi = true
      }
      var shitou = new cc.Sprite("#shizi00.png")
      shitou.setPosition(301, 273)
      this.addChild(shitou, 1)
      var inself = this
      var spAction = createAnimation({
        frame: "shizi%02d.png",
        start: 1,
        end: 26,
        time: 0.12,
        fun: function() {
          shitou.setPosition(151, 119)
          shitou.setSpriteFrame("shizi27.png")
          var panzi = new cc.Sprite("#panzi.png")
          panzi.setPosition(352, 374)
          panzi.setRotation(-35.5)
          inself.addChild(panzi)
          panzi.runAction(cc.sequence(
            cc.rotateTo(0.6, 0),
            cc.spawn(
              cc.sequence(
                cc.moveBy(0.6, cc.p(150, -150)),
                cc.callFunc(function() {
                  panzi.removeFromParent()
                  if (fun) {
                    fun()
                  }
                })),
              cc.fadeOut(0.6)
            )
          ))

        }
      })
      shitou.runAction(spAction)
    }
    waterCup.DaoWater = function(fun) {
      if (!this.daowater) {
        loadPlist("daoWater")
        loadPlist("waterLine")
        this.daowater = true
      }
      var water = new cc.Sprite("#daoshui00.png")
      water.setPosition(290, 350)
      this.addChild(water, 3)
      var spAction = createAnimation({
        frame: "daoshui%02d.png",
        start: 0,
        end: 22,
        time: 0.12,
        fun: function() {
          water.stopAllActions()
          water.runAction(cc.sequence(
            cc.rotateTo(0.5, 100),
            cc.spawn(
              cc.moveBy(0.5, cc.p(200, -100)),
              cc.sequence(cc.fadeOut(0.5),
                cc.callFunc(function() {
                  water.removeFromParent()
                }))
            )
          ))
        }
      })
      water.runAction(spAction)

      var waterLine = new cc.Sprite()
      waterLine.setAnchorPoint(0.5, 0)
      waterLine.setPosition(151, 3.5)
      this.addChild(waterLine, 6)
      this.waterLine = waterLine
      var spAction1 = createAnimation({
        frame: "waterLine%02d.png",
        start: 0,
        end: 14,
        time: 0.13,
        fun: function() {
          if (fun) {
            fun()
          }
        }
      })
      waterLine.runAction(cc.sequence(
        cc.delayTime(1),
        spAction1
      ))
    }
    waterCup.JiaZhi = function(fun, status) {
      if (!this.jiazi) {
        loadPlist("jiazhi")
        this.jiazi = new cc.Sprite()
        this.jiazi.setPosition(170, 320)
        this.addChild(this.jiazi, 5)
      }
      var startF = 0
      var endF = 21
      if (status == "two") {
        startF = 23
        endF = 42
      }
      var inself = this
      var spAction = createAnimation({
        frame: "jiazhi%02d.png",
        start: startF,
        end: endF,
        time: 0.16,
        fun: function() {
          inself.jiazi.setSpriteFrame(sprintf("jiazhi%02d.png", endF + 1))
          if (fun) {
            fun()
          }
        }
      })
      this.jiazi.runAction(spAction)
    }
    waterCup.SaWater = function(fun) {
      if (!this.Pen) {
        loadPlist("penWater")
        this.Pen = true
      }
      var Pzi = new cc.Sprite(res.pZi)
      Pzi.setPosition(470, 250)
      this.addChild(Pzi, 8)
      Pzi.setScale(0.9)

      var lay = createLayout({
        op: 0,
        size: cc.size(330, 330),
        clip: true
      })
      lay.setAnchorPoint(0.5, 0)
      lay.setPosition(60, 0)
      Pzi.addChild(lay)

      var pwater = new cc.Sprite(res.pWater)
      pwater.setAnchorPoint(0.5, 0)
      pwater.setPosition(161, 1)
      lay.addChild(pwater)

      var pen = new cc.Sprite("#penWater00.png")
      pen.setPosition(58, 335)
      pen.setAnchorPoint(0.5, 1)
      pen.setRotation(150)
      pen.setScale(0.7)
      Pzi.addChild(pen)
      pen.setVisible(false)
      pen.showWater = function() {
        this.setVisible(true)
        var spAction = createAnimation({
          frame: "penWater%02d.png",
          start: 0,
          end: 4,
          time: 0.05
        })
        this.runAction(cc.rotateTo(0.3, 180))
        this.runAction(cc.repeatForever(spAction))
      }
      pen.hideWater = function() {
        var inself = this
        this.runAction(cc.sequence(
          cc.rotateTo(0.3, 140),
          cc.callFunc(function() {
            inself.setVisible(false)
            lay.removeFromParent()
            var xieWater = new cc.Sprite(res.xieWater)
            xieWater.setPosition(30, 160)
            Pzi.addChild(xieWater)
            Pzi.xieWater = xieWater
          })
        ))
      }
      lay.runAction(cc.sequence(
        cc.delayTime(0.6),
        cc.moveBy(4, cc.p(0, 120))
      ))
      pwater.runAction(cc.sequence(
        cc.delayTime(0.6),
        cc.moveBy(4, cc.p(0, -120))
      ))
      if (this.waterLine) {
        this.waterLine.runAction(cc.sequence(
          cc.delayTime(0.6),
          cc.spawn(
            cc.scaleTo(4, 1, 2),
            cc.sequence(
              cc.delayTime(2.5),
              cc.tintTo(1.5, 0, 0, 0),
              cc.callFunc(function() {
                if (fun) {
                  fun()
                }
              })
            )
          )
        ))
      }

      Pzi.runAction(cc.spawn(
        cc.sequence(
          cc.rotateTo(0.3, -90),
          cc.callFunc(function() {
            pen.showWater()
          }),
          cc.rotateTo(0.3, -180)
        ),
        cc.sequence(
          cc.moveTo(0.6, cc.p(230, 450)),
          cc.callFunc(function() {
            Pzi.runAction(cc.sequence(
              cc.moveTo(2, cc.p(70, 450)),
              cc.moveTo(2, cc.p(230, 450)),
              cc.callFunc(function() {
                Pzi.stopAllActions()
                Pzi.runAction(cc.spawn(
                  cc.sequence(
                    cc.callFunc(function() {
                      pen.hideWater()
                    }),
                    cc.rotateTo(0.6, 0)
                  ),
                  cc.sequence(
                    cc.moveTo(0.6, cc.p(470, 250)),
                    cc.callFunc(function() {
                      Pzi.xieWater.setVisible(false)
                      var duanWater = new cc.Sprite(res.duanWater)
                      duanWater.setPosition(58, 41)
                      Pzi.addChild(duanWater)
                    }),
                    cc.delayTime(0.2),
                    cc.callFunc(function() {
                      Pzi.removeFromParent()
                    })
                  )
                ))
              })
            ))
          })
        )
      ))
    }

    return waterCup
  },
  speakeBykey: function(key) {
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
  initPeople: function() {
    this.nodebs = addPeople({
      id: "student",
      pos: cc.p(1000, 130)
    })
    this.addChild(this.nodebs, 900);

    addContent({
      people: this.nodebs,
      key: "wenzi1",
      img: res.wenzi1,
      sound: res.zimp1,
      offset: cc.p(-6, 0)
    })

    addContent({
      people: this.nodebs,
      key: "wenzi2",
      img: res.wenzi2,
      sound: res.zimp2
    })

    addContent({
      people: this.nodebs,
      key: "wenzi3",
      img: res.wenzi3,
      sound: res.zimp3
    })
    addContent({
      people: this.nodebs,
      key: "wenzi4",
      img: res.wenzi4,
      sound: res.zimp4
    })

    addContent({
      people: this.nodebs,
      key: "jielun",
      img: res.jielun,
      id: "result",
      sound: res.jielunmp,
      offset: cc.p(30, 30),
      offbg: cc.p(20, 50),
    })
  }
})