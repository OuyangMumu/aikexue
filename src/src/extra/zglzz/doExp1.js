//@author mu @16/5/11
var doExp1 = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  layerName: "doExp1",
  preLayer: "doLayer",
  ctor: function() { //创建时调用 未删除不会重复调用
    this.load(function() {

    });
    var self = this
    this._super()
    this.expCtor({
      vis: false,
      setZ:800,
      settingData: {
        pos: cc.p(1080, 580),
        biaogeFun: function() {
          if (!self.bgg) {
            var colors = []
            for (var k = 0; k <= 10; k++)
              colors.push(cc.color(255, 0, 0))
            var bg = createBiaoge({
              json: res.zglzz_biaoge,
              inputNum: 11,
              isShowResult: true,
              scale: 0.9,
              rootColor: colors
            })
            cc.log("1111111111")
            self.addChild(bg)
            self.bgg = bg
         }
           var bg = self.bgg
           bg.show()
        },
        ifCount: true,
      }
    })
    this.initUI()
    this.initPeople()

    return true
  },
  initUI: function() {
    var self = this;

    var fdj = createFDJ({
      father: self,
      rootScale: 0.2,
      perscale: 0.1,
      max: 0.4,
      min: 0.1,
      seePos: [cc.p(100, 20)],
      getPos: [cc.p(489, 313)],
    })

    self.fdj = fdj
    fdj.get[0].setVisible(true)
    fdj.see[0].setVisible(true)
    fdj.see[0].setScale(0.8)
    fdj.actMove({
      judgeGet: function(data) {
        var index = data.index
        var item = data.item
        var delta = data.delta
        var pos = data.pos
        var ruler = fdj.getOut("ruler")
        var tempPos = item.getParent().convertToWorldSpace(item.getPosition())
        tempPos.x += delta.x
        tempPos.y += delta.y
        var judge = judgeInside({
          item: ruler,
          pos: tempPos,
        })
        if (!judge) {
          var backPos = getBackPos({
            item: ruler,
            pos: tempPos,
          })
          delta.x += backPos.y
          delta.y -= backPos.x
        }
        return delta
      }
    })

    var getRuler = function(index) {
      var ruler = createRuler({
        max: index == 0 ? 30 : 20,
        devide: 28,
        seg: 0.65,
        add: 1,
        height: 80,
        lineModify: cc.p(0, 3),
        fontModify: cc.p(0, 5),
        rotate: index == 0 ? 0 : 90,
      })
      ruler.setLocalZOrder(3)
      return ruler
    }

    var createDonode = function() {
      var uiname = [
        "bb", "biao", "fen", "shi", "miao", "dlazhu",
        "ximie_btn", "dianran_btn", "dianrannode",
        "hcg", "denghuo", "dengxin", "xpc", "drawlist"
      ]
      var donode = loadNode(res.zglzz_do1, uiname)
      return donode
    }
    fdj.createNew({
      key: "donode",
      fun: createDonode
    })

    var createMyRuler = function() {
      var ruler = getRuler(1)
      ruler.setPosition(cc.p(489, 313))
      return ruler
    }
    fdj.createNew({
      key: "ruler",
      fun: createMyRuler
    })


    this.otherUI()
    this.uiMove()
  },
  uiMove: function() {

    var self = this
    var fdj = self.fdj
    var node = fdj.getOut("donode")
    var showWarnig = function(data) {
      var data = data || {}
      var keys = data.keys
      var datainfo = data.datainfo
      var beginfun = data.beginfun

      if (node.denghuo.isVisible()) {
        self.nodebs.say({
          key: keys,
          force: true
        })
        return false
      } else {
        if (beginfun)
          beginfun(datainfo)
        return true
      }
    }


    createTouchEvent({
      item: node.bb,
      begin: function(data) {
        if (node.denghuo.isVisible()) {
          self.nodebs.say({
            key: "zi7",
            force: true
          })
          return false
        } else {
          var tempnode = null
          fdj.runData({
            key: "donode",
            fun: function(data) {
              var item = data.item
              if (item.bb.canDraw) {
                var draw = new cc.DrawNode()
                item.drawlist.addChild(draw)
                item.drawlist.list.push(draw)
                item.bb.nowDraw = draw
                draw.endflag = true
                draw.isrun = false
                var pos = cc.p(item.bb.x - item.bb.width / 2, item.bb.y - item.bb.height / 2)
                var nodepos = item.drawlist.convertToNodeSpace(pos)
                if (!tempnode) {
                  tempnode = nodepos
                }
                draw.startY = tempnode.y
                item.bb.nowBeginpos = tempnode
                  if(!draw.begin){
                    draw.begin = cc.p(tempnode.x, tempnode.y)
                  }
                  if(!draw.end){
                    draw.end = cc.p(tempnode.x, tempnode.y)
                  }
                draw.drawSegment(draw.begin, draw.end, 1.5, cc.color(0, 0, 0))
              }
            }
          })
          return true
        }
      },
      move: function(data) {
        var delta = data.delta
        var item = data.item
        var fucknode = null
        fdj.runData({
          key: "donode",
          fun: function(data) {
            var item = data.item
            if (item.bb.canDraw) {
              var nowDraw = item.bb.nowDraw
              item.bb.x += delta.x
              var tempx = item.bb.x + delta.x
              var pos = cc.p(tempx - item.bb.width / 2, item.bb.y - item.bb.height / 2)
              var nodepos1 = item.drawlist.convertToNodeSpace(pos)
              if (!fucknode) {
                fucknode = nodepos1
              }
              var temprect = cc.rect(1, 0, item.drawlist.width - 4, item.drawlist.height)
              if (cc.rectContainsPoint(temprect, fucknode)) {
                  nowDraw.drawSegment(item.bb.nowBeginpos, fucknode, 1.5, cc.color(0, 0, 0))

                  if(!nowDraw.begin){
                    nowDraw.begin = cc.p(fucknode.x, fucknode.y)
                  }
                  if(!nowDraw.end){
                    nowDraw.end = cc.p(fucknode.x, fucknode.y)
                  }
                  if (nowDraw.begin.x >= fucknode.x) {
                    nowDraw.begin.x = fucknode.x
                  } else if (nowDraw.end.x <= fucknode.x) {
                    nowDraw.end.x = fucknode.x
                  }
              }
                  
              item.bb.x = tempx
            } else {
              item.bb.x += delta.x
              item.bb.y += delta.y
            }
          }
        })
      },
      end: function(data) {
        var item = data.item
        var temppos = get4Pos(item, cc.p(0, 0))
        var final = cc.p(temppos.left, temppos.bottom)
        var result = judgeInside({
          pos: final,
          item: node.dlazhu
        })
        fdj.runData({
          key: "donode",
          fun: function(data) {
            var item = data.item
              //线段分割成无数的小线段or点
            var nowDraw = item.bb.nowDraw
            if (nowDraw) {
              cc.log(nowDraw.endflag)
              if (nowDraw.endflag) {
                nowDraw.clear()
                nowDraw.endflag = false
                nowDraw.crow = self.createLines({
                    startpos: nowDraw.begin, //cc.p(0,300),
                    endpos: nowDraw.end, //cc.p(36,300),
                    lineW: 1,
                    father: nowDraw,
                    nums: 51,
                    color: cc.color(0, 0, 0)
                  })
              }
            }
            if (result) {
              item.bb.canDraw = true
              return
            }
            item.bb.canDraw = false
            item.bb.setPosition(item.bb.initPos)
          }
        })
      }
    })

     self.zi4flag = true
    createTouchEvent({
      item: fdj.getOut("ruler"),
      begin: function() {
        return showWarnig({
          keys: "zi4",
          beginfun: function() {

          }
        })
      },
      move: function(data) {
        var delta = data.delta
        fdj.runData({
          key: "ruler",
          fun: function(data) {
            var item = data.item
            item.x += delta.x
            item.y += delta.y
          }
        })
        fdj.move(delta)
      },
      end:function(){
         if(self.zi4flag&&self.getDistantFlag(55)){
             self.nodebs.say({
               key: "zi2",
               force: true
             })
             self.zi4flag = false
         }
      }
    })

    createTouchEvent({
      item: node.xpc,
      begin: function(data) {
        return showWarnig({
          keys: "zi8",
          datainfo: data,
          beginfun: function(data) {
            var item = data.item
            var temppos = cc.p(item.x - item.width / 2, item.y - item.height / 2)
            var localpos = node.drawlist.convertToNodeSpace(temppos)
            cc.log("kkkk", node.drawlist.list.length)
            for (var i = 0; i < node.drawlist.list.length; i++) {
              var nowDraw = node.drawlist.list[i]
              var dis = nowDraw.startY
              if(temppos.y<=node.denghuo.y-5)
                if ((dis -localpos.y)>= 0 && (dis -localpos.y)<=20) {
                  nowDraw.clear()
                  nowDraw.drawSegment(nowDraw.begin, nowDraw.end, 1.5, cc.color(250, 0, 0))
                  nowDraw.removeAllChildren()
                  nowDraw.cachu = false
                }
            }

          }
        })
      },
      move: function(data) {
        var delta = data.delta
        fdj.runData({
          key: "donode",
          fun: function(data) {
            var item = data.item
            item.xpc.x += delta.x
            item.xpc.y += delta.y
          }
        })
      },
      end: function(data) {
        var item = data.item
        var temppos = cc.p(item.x - item.width / 2, item.y - item.height / 2)
        var localpos = node.drawlist.convertToNodeSpace(temppos)
        var temprect = cc.rect(0, 0, node.drawlist.width, node.drawlist.height)
        var result = cc.rectContainsPoint(temprect, localpos)

        for (var i = 0; i < node.drawlist.list.length; i++) {
              var nowDraw = node.drawlist.list[i]
              if(nowDraw.cachu!=null){
                nowDraw.setVisible(false)
              }
            }
        fdj.runData({
          key: "donode",
          fun: function(data) {
            var item = data.item
            if (result) {

              return
            }
            item.xpc.setPosition(item.xpc.initPos)
          }
        })
      }
    })
  },
 createLines:function(data) {
    var data = data || {}
    var startpos = data.startpos || cc.p(0,0)
    var endpos = data.endpos || cc.p(0,0)
    var lineW = data.lineW
    var color = data.color
    var nums = data.nums
    var father = data.father
    var linelist = []
    var otherlist = []
    var perdis = (endpos.x - startpos.x) / nums
    for (var i = 0; i < nums; i++) {
      var draw = new cc.DrawNode()
      var draw1 = new cc.DrawNode()
      father.addChild(draw)
      father.addChild(draw1)
      draw.posX = perdis * i
      draw1.posX = perdis * i
      draw1.runs = true
      if(i==(nums-2)){
         draw.drawSegment(cc.p(startpos.x+perdis * i, startpos.y+0.5), cc.p(endpos.x+0.7, startpos.y+0.5), lineW, color)
         draw1.drawSegment(cc.p(startpos.x+perdis * i, startpos.y - 0.5), cc.p(endpos.x+0.7, startpos.y - 0.5), lineW, color)
      }else{
         draw.drawSegment(cc.p(startpos.x-0.3+perdis * i, startpos.y+0.5), cc.p(startpos.x+perdis * (i + 1), startpos.y+0.5), lineW, color)
         draw1.drawSegment(cc.p(startpos.x-0.3+perdis * i, startpos.y - 0.5), cc.p(startpos.x+perdis * (i + 1), startpos.y - 0.5), lineW, color)
      }
      draw.run = function(firepos) {
        var delay = Math.abs(firepos.x - this.posX-5) * 0.13
        var inself = this
        this.runAction(cc.sequence(
          cc.delayTime(delay),
          cc.fadeOut(1),
          cc.callFunc(function() {
            inself.removeFromParent()
            inself = null
          })
        ))
      }
      draw.myStop = function(){
        this.stopAllActions()
      }
      draw1.run = function(firepos) {
        var delay = Math.abs(firepos.x - this.posX-5) * 0.2
        var inself = this
        this.runAction(cc.sequence(
          cc.delayTime(delay),
          cc.fadeOut(0.5),
          cc.callFunc(function() {
            inself.runs = false
            if (!otherlist[0].runs && !otherlist[nums - 1].runs)
              father.fades = false
            inself.removeFromParent()
            inself = null
          })
        ))
      }
      draw1.myStop = function(){
        this.stopAllActions()
      }
      father.fades = true
      linelist.push(draw)
      otherlist.push(draw1)
    }
    var crow = {
        one:linelist,
        two:otherlist
    }
    return crow
  },
  otherUI: function() {
    var self = this
    var fdj = self.fdj
    fdj.runData({
      key: "donode",
      fun: function(data) {
        var node = data.item
          //var all = data.all
        var outNode = node
        node.hcg.setVisible(false)
        node.denghuo.setVisible(false)

        node.bb.initPos = node.bb.getPosition()
        node.xpc.initPos = node.xpc.getPosition()
        node.bb.canDraw = false
        node.drawlist.list = []

        var huoAc = ccs.load(res.zglzz_huoxin).action
        huoAc.gotoFrameAndPlay(0, 38)
        node.denghuo.runAction(huoAc)

        node.dianrannode.playDianran = function() {
          var inself = this
          var hcg = this.getChildByName("hcg")
          hcg.setVisible(true)
          this.setPosition(node.denghuo.x + 45, node.denghuo.y - 1)
          hcg.runAction(cc.sequence(
            cc.moveBy(0.3, cc.p(-53, 0)),
            cc.delayTime(0.2),
            cc.callFunc(function() {
              node.denghuo.setVisible(true)
              inself.addTimer()
            }),
            cc.moveBy(0.3, cc.p(53, 0)),
            cc.callFunc(function() {
              hcg.setVisible(false)
            })
          ))
        }

        node.dianrannode.xiMie = function() {
          var hcg = this.getChildByName("hcg")
          hcg.setVisible(false)

          for (var i = 0; i < node.drawlist.list.length; i++) {
            var nowDraw = node.drawlist.list[i]
            if (nowDraw.isrun) {
                var lineList = nowDraw.crow.one
                for (var k = 0; k < lineList.length; k++) {
                  if(lineList[k])
                  lineList[k].myStop()
                }

                var otherlist = nowDraw.crow.two
                for (var m = 0; m < otherlist.length; m++) {
                  if(lineList[m])
                   otherlist[m].myStop()
                }
                nowDraw.isrun = false
            }
          }

          this.setPosition(node.denghuo.x + 45, node.denghuo.y - 1)
          var ximeAc = ccs.load(res.zglzz_chuimie).action
          ximeAc.setCurrentFrame(0)
          ximeAc.gotoFrameAndPlay(0, 25, false)
          ximeAc.setLastFrameCallFunc(function() {
            ximeAc.clearLastFrameCallFunc()
            node.denghuo.setVisible(false)
          })
          this.unscheduleAllCallbacks()
          this.runAction(ximeAc)
        }

        node.dianrannode.disappearLine = function() {
          var localpos1 = node.drawlist.convertToNodeSpace(node.dengxin)
          var localpos = cc.p(localpos1.x + 1, localpos1.y)
          for (var i = 0; i < node.drawlist.list.length; i++) {
            var nowDraw = node.drawlist.list[i]
            var dis = nowDraw.startY

            if (Math.abs(localpos.y - dis) <= 10|| nowDraw.forceIn) {
              if(outNode.linkFun){
                  outNode.linkFun(function(data){
                    var item = data.item
                    if (item.drawlist.list[i]) {
                      item.drawlist.list[i].forceIn = true
                      item.drawlist.list[i].forcePos = localpos
                    }
                  })
              }
              localpos = nowDraw.forcePos || localpos
                if (!nowDraw.isrun) {

                    var lineList = nowDraw.crow.one
                    for (var k = 0; k < lineList.length; k++) {
                      if(lineList[k])
                      lineList[k].run(localpos)
                    }

                    var otherlist = nowDraw.crow.two
                    for (var m = 0; m < otherlist.length; m++) {
                      if(otherlist[m])
                      otherlist[m].run(localpos)
                    }
                 
                    nowDraw.isrun = true
                }
              nowDraw.forceIn = false
            }

            if (!nowDraw.fades) {
              nowDraw.clear()
             // node.drawlist.list.splice(nowDraw.index, 1)
             // nowDraw.removeFromParent()
              nowDraw = null
            }
          }

        }
        node.dianrannode.addTimer = function() {
          var inself = this
          inself.schedule(function() {
            var lazhuscale = node.dlazhu.getScaleY()
            node.dlazhu.setScaleY(lazhuscale - 0.0001736)
            node.denghuo.y = node.denghuo.y - 0.061
            node.dengxin.y = node.dengxin.y - 0.06
            inself.disappearLine()
            if (node.dlazhu.getScaleY() <= 0.06) {
              inself.unscheduleAllCallbacks()
              node.denghuo.runAction(cc.scaleTo(1, 0))
              node.setBtnEnable(node.ximie_btn, false)
              node.setBtnEnable(node.dianran_btn, false)
            }
          })
        }

        node.setBtnEnable = function(btn, btnbool) {
          btn.setEnabled(btnbool)
          btn.setBright(btnbool)
        }

        node.setBtnEnable(node.ximie_btn, false)

        node.biao.runSelf = function(data) {
          var miao = data.miao
          var fen = data.fen
          var shi = data.shi
          var fun = data.fun
          this.setVisible(true)
          this.schedule(function() {
            miao.setRotation(miao.getRotationX() + 0.5)
            fen.setRotation(fen.getRotationX() + 1 / 120)
            shi.setRotation(shi.getRotationX() + 1 / 720)
            if (fen.getRotationX() >= 18)
              if (fun)
                fun()
          }, 1 / 80);
        }
        node.biao.stopSelf = function() {
          this.unscheduleAllCallbacks()
          this.removeFromParent()
        }

        node.biao.runSelf({
          miao: node.miao,
          fen: node.fen,
          shi: node.shi
        })
      }
    })

    var node = fdj.getOut("donode")
    node.dianrannode.isFirst = true

    node.dianran_btn.addClickEventListener(function() {
      if (self.getDistantFlag(90)) {
        self.nodebs.say({
          key: "zi3",
          force: true
        })
      } else {
        fdj.runData({
          key: "donode",
          fun: function(data) {
            var item = data.item
            item.setBtnEnable(item.dianran_btn, false)
            item.setBtnEnable(item.ximie_btn, true)
            item.dianrannode.playDianran()
          }
        })
      }
    })
    node.ximie_btn.addClickEventListener(function() {
      fdj.runData({
        key: "donode",
        fun: function(data) {
          var item = data.item
          item.setBtnEnable(item.ximie_btn, false)
          item.setBtnEnable(item.dianran_btn, true)
          item.dianrannode.xiMie()
        }
      })
    })
  },
  getDistantFlag: function(dis) {
    var self = this
    var fdj = this.fdj
    var node = fdj.getOut("donode")
    var distant = Math.abs(node.dlazhu.x - fdj.getOut("ruler").x)
    if (dis > 0 && distant < dis)
      return true
    else
      return false
  },
  myEnter: function() {
    this._super()
    var self = this
    self.nodebs.show(function() {
      self.nodebs.say({
        key: "zi1",
        force: true
      })
    })
  },
  initPeople: function() {
    this.nodebs = addPeople({
      id:"student",
      pos: cc.p(1010, 120)
    })
    this.addChild(this.nodebs, 900);

    addContent({
      people: this.nodebs,
      key: "zi1",
      sound: res.zi1mp,
      img: res.wenzi1,
    })
    addContent({
      people: this.nodebs,
      key: "zi2",
      sound: res.zi2mp,
      img: res.wenzi2,
    })
    addContent({
      people: this.nodebs,
      key: "zi3",
      sound: res.zi3mp,
      img: res.wenzi3,
    })
    addContent({
      people: this.nodebs,
      key: "zi4",
      sound: res.zi4mp,
      img: res.wenzi4,
    })
    addContent({
      people: this.nodebs,
      key: "zi7",
      sound: res.zi7mp,
      img: res.wenzi7,
    })
    addContent({
      people: this.nodebs,
      key: "zi8",
      sound: res.zi8mp,
      img: res.wenzi8,
    })
  }
})