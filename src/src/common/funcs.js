//all common funcs codes here
//主要的常用函数

var changeTime = 0.2
var func = {
      myInit: false,
}
var keyGen = 1
var CAN_BACK = true
var TAG_POSMOVE = 101

var delayFun = function(time, fun) { //延迟调用指定回调函数
      var node = new cc.Node()
      safeAdd(CC_CURRENT_LAYER, node)
      node.runAction(cc.sequence(
            cc.delayTime(time),
            cc.callFunc(function() {
                  fun && fun();
                  node.removeFromParent(true)
            })
      ))
}

var getLoopVis = function(item) { //回溯判定item是否世界范围内可见
      if (item && !item.isVisible()) {
            return false
      } else {
            if (item.getParent()) {
                  return getLoopVis(item.getParent())
            } else {
                  return true
            }
      }
}

var scaleMove = function(data) { //限制区域进行精确移动 目前用于放大镜居多
      var item = data.item
      var delta = data.delta
      var xmin = data.xmin
      var xmax = data.xmax
      var ymin = data.ymin
      var ymax = data.ymax
      var loopscale = getLoopScale(item, true)
      if (xmin != null || xmax != null || ymin != null || ymax != null) {
            var tempx = item.x + (delta.x / loopscale.x)
            var tempy = item.y + (delta.y / loopscale.y)
            if (xmin != null) {
                  if (tempx < xmin) {
                        tempx = xmin
                  }
            }
            if (ymin != null) {
                  if (tempy < ymin) {
                        tempy = ymin
                  }
            }
            if (xmax != null) {
                  if (tempx > xmax) {
                        tempx = xmax
                  }
            }
            if (ymax != null) {
                  if (tempy > ymax) {
                        tempy = ymax
                  }
            }
            item.x = tempx
            item.y = tempy
      } else {
            item.x += (delta.x / loopscale.x)
            item.y += (delta.y / loopscale.y)
      }
}

var judgeList = function(data) { //对数组进行二次初始化
      var src = data.src //需要初始化的数组
      var dest = data.dest //配置参数
      var nums = data.nums //需要初始化的长度
      if (src == null) {
            src = []
            for (var i = 0; i < nums; i++) {
                  src[i] = dest
            }
      } else {
            if (src[0] == null) {
                  var temp = []
                  for (var i = 0; i < nums; i++) {
                        temp[i] = src
                  }
                  src = temp
            }
      }
      return src
}

var createJudgeBtn = function(data) { //创建类似checkbox的btn
      var normal = data.normal
      var select = data.select
      var act = data.act //可不传 为点击时候的图
      var fun = data.fun //按下回调
      var back = data.back //回弹回调
      var pos = data.pos || getMiddle()
      var father = data.father
      var sp = null
      var failFun = data.failFun //点击到外部的回调
      var failBack = data.failBack || false //点击到外部是否回弹的判定
      var frame = data.frame || false //是否为帧图片
      var swallow = data.swallow //吞噬
      var scale = data.scale || 1
      var onlyTrue = data.onlyTrue || false
      var judge = data.judge
      if (swallow == null) {
            swallow = true
      }
      if (frame) {
            sp = new cc.Sprite(sprintf("#%s", normal))
      } else {
            sp = new ccui.ImageView(normal)
      }
      sp.setScale(scale)
      sp.canTouch = true
      sp.setCanTouch = function(judge) {
            var sp = this
            sp.canTouch = judge
      }
      createTouchEvent({
            item: sp,
            swallow: swallow,
            begin: function(data) {
                  var item = data.item
                  if (judge) {
                        if (!judge(item)) {
                              return false
                        }
                  }
                  if (item.canTouch) {
                        if (act) {
                              if (frame) {
                                    item.setSpriteFrame(act)
                              } else {
                                    item.loadTexture(act)
                              }
                        }
                  }
                  return item.canTouch
            },
            beginfail: function(data) {
                  var item = data.item
                  if (failBack) {
                        item.change(false, false)
                  }
                  if (failFun) {
                        failFun(item)
                  }
                  return false
            },
            end: function(data) {
                  var item = data.item
                  if (onlyTrue) {
                        item.acting = true
                  }
                  if (item.acting) {
                        if (frame) {
                              item.setSpriteFrame(select)
                        } else {
                              item.loadTexture(select)
                        }
                        if (fun) {
                              fun(item)
                        }
                  } else {
                        if (frame) {
                              item.setSpriteFrame(normal)
                        } else {
                              item.loadTexture(normal)
                        }
                        if (back) {
                              back(item)
                        }
                  }
                  item.acting = !item.acting
            }
      })
      sp.change = function(ifact, iffun) { //切换状态。可供外部调用
            var sp = this
            if (ifact) {
                  if (frame) {
                        sp.setSpriteFrame(select)
                  } else {
                        sp.loadTexture(select)
                  }
                  if (iffun) {
                        if (fun) {
                              fun(sp)
                        }
                  }
            } else {
                  if (frame) {
                        sp.setSpriteFrame(normal)
                  } else {
                        sp.loadTexture(normal)
                  }
                  if (iffun) {
                        if (back) {
                              back(sp)
                        }
                  }
            }
            sp.acting = !ifact
      }
      sp.setPosition(pos)
      sp.acting = true
      if (father) {
            safeAdd(father, sp)
      }
      return sp
}

var setOff = function(item, off) { //对任意对象设置坐标偏移
      if (item.setPosition) {
            var temp = item.getPosition()
            temp = cc.p(temp.x + off.x, temp.y + off.y)
            item.setPosition(temp)
      }
}

var initBg = function(data) { //创建一个可拖动的弹出框
      var item = data.item
      var move = data.move
      var init = data.init || false //初始化是否显示
      item.act = function() {
            var item = this
            var judge = !item.isOut
            var result = judge ? "scale" : "zoom"
            if (!item.showing) {
                  item.showing = true
                  item.isOut = !item.isOut
                  addShowType({
                        item: item,
                        show: result,
                        time: 0.3,
                        fun: function(item) {
                              item.showing = false
                              if (item.isOut) {
                                    addMoving(item)
                              } else {
                                    removeMoving(item)
                              }
                        }
                  })
            }
      }
      item.in = item.act
      item.out = item.act
      item.showing = false
      item.isOut = init
      item.setScale(init ? 1 : 0)
}

var safeAdd = function(father, child) { //安全添加子节点函数
      //安全添加子节点函数 只要彼此存在会先解除错误的父子关系再正确添加 保留位置信息（相对位置可能会被修改）
      try {
            if (child && child.getParent && child.getParent()) {
                  child.retain()
                  child.removeFromParent(false)
                  father.addChild(child)
                  child.release()
            } else {
                  father.addChild(child)
            }
      } catch (e) {
            cc.log(e.message);
            // cc.log(e.description) 
            // cc.log(e.number) 
            cc.log(e.name)
            return false
      }
      return true
}

var reAdd = function(item) { //将对象重新添加到它的父节点上.规避某些时候zorder不会修改的情况
      //重添加函数 某些情况下修改了节点却渲染错误就需要调用重添加让渲染正确
      if (item.getParent && item.getParent()) {
            safeAdd(item.getParent(), item)
      }
}

var listOrder = function(list, judge) { //对数组进行排序 judge为顺序逆序的判定
      for (var i = 0; i < list.length; i++) {
            for (var j = i; j < list.length; j++) {
                  if (judge) {
                        if (list[i] < list[j]) {
                              var temp = list[i]
                              list[i] = list[j]
                              list[j] = temp
                        }
                  } else {
                        if (list[i] > list[j]) {
                              var temp = list[i]
                              list[i] = list[j]
                              list[j] = temp
                        }
                  }
            }
      }
      return list
}

var judgeInside = function(data) { //判定pos是否在item内部的点击检测
      var item = data.item
      var pos = data.pos
      var mix = data.mix || cc.p(1, 1) //item的尺寸倍数
      var off = data.off || cc.p(0, 0) //item的判定偏移
      var target = item
      var locationInNode = target.convertToNodeSpace(pos)
      var size = item.getContentSize()
      var width = size.width * mix.x
      var height = size.height * mix.y
      var startx = size.width / 2 - width / 2 + size.width * off.x
      var starty = size.height / 2 - height / 2 + size.height * off.y
      var s = target.getContentSize()
      var inrect = cc.rect(startx, starty, width, height)
      if (cc.rectContainsPoint(inrect, locationInNode)) {
            return true
      }
      return false
}

var getBackPos = function(data) { //区域限制函数 一旦位置移出item限定的位置 则返回回到item位置的最小偏移
      var item = data.item
      var pos = data.pos
      pos = item.convertToNodeSpace(pos)
      var size = item.getContentSize()
      var delta = cc.p(0, 0)
      if (pos.x < 0) {
            delta.x = -pos.x
      }
      if (pos.x > size.width) {
            delta.x = -(pos.x - size.width)
      }
      if (pos.y < 0) {
            delta.y = -pos.y
      }
      if (pos.y > size.height) {
            delta.y = -(pos.y - size.height)
      }
      return delta
}

var createMoveRotate = function(data) { //角度移动和选取的初始化 用于列表和工具箱

      var lay = data.item
      var mix = data.mix || 20
      var sel = data.sel || 140 //选择的方向大小
      var tri = data.tri || 90 //移动的方向大小
      var dis = 360 - tri * 2 - sel
      var judgeTime = data.judgeTime || 0.2
      var aim = data.aim

      lay.judgeList = [{
            name: "up",
            buf: [90 - dis / 2 + aim, 90 + dis / 2 + aim],
      }, {
            name: "left",
            buf: [90 + dis / 2 + aim, 90 + dis / 2 + tri + aim],
      }, {
            name: "down",
            buf: [90 + dis / 2 + tri + aim, 90 + dis / 2 + tri + sel + aim],
      }, {
            name: "right",
            buf: [90 + dis / 2 + tri + sel + aim, 90 + dis / 2 + tri + sel + 90 + aim],
      }, ]
      for (var i = 0; i < lay.judgeList.length; i++) {
            var buf = lay.judgeList[i].buf
            for (var j = 0; j < buf.length; j++) {
                  if (buf[j] > 360) {
                        buf[j] -= 360
                  }
                  if (buf[j] < 0) {
                        buf[j] += 360
                  }
            }
      }

      lay.listenRotate = function(pos) { //提供开始监听旋转的函数 外部调用
            var item = this
            item.startPos = pos
            item.judge = false
            item.tri = null
            item.select = null
            item.stopAllActions()
            item.runAction(cc.sequence(
                  cc.delayTime(judgeTime),
                  cc.callFunc(function() {
                        item.judge = true
                  })))
      }

      lay.getAngle = function(pos) { //获取当前的角度方位
            var lay = this
            var angle = getAngle(lay.startPos, pos)
            for (var i = 0; i < lay.judgeList.length; i++) {
                  var buf = lay.judgeList[i]
                  var name = buf.name
                  var data = buf.buf
                  if (data[0] < data[1]) {
                        if (angle >= data[0] && angle < data[1]) {
                              return name
                        }
                  } else {
                        if ((angle >= 0 && angle <= data[1]) || (angle >= data[0] && angle <= 360)) {
                              return name
                        }
                  }
            }
            return null
      }

      lay.getDis = function(pos) { //获取当前的坐标偏移
            var item = this
            return getDis(item.startPos, pos)
      }

}

var createList = function(data) { //创建选择列表
      data = data || {}
      var type = data.type || "S" //横竖方向
      var color = data.color || "blue" //对应背景图 blue orange yellow op
      var bgOp = data.bgOp
      var arrow = data.arrow || "blue" //对应箭头图 
      var num = data.num || 4
      var size = data.size || cc.size(170, 700) //背景大小 会自动适配
      var pos = data.pos || getMiddle()
      var scale = data.scale || 1
      var list = data.list || []
      var offset = data.offset || cc.p(0, 0) //监听区域的偏移值
      var modify = data.modify || cc.p(0, 0) //监听区域的大小修正
      var ifPage = data.ifPage || false //是否显示页码
      var pageOff = data.pageOff || cc.p(size.width * 0.1, size.height * 0.94) //页码的位置偏移
      var pageScale = data.pageScale || 0.5
      var pageColor = data.pageColor || cc.color(255, 255, 0, 255)
      var arrOff = data.arrOff || cc.p(0, 0)
      var noBg = data.noBg || false
      var disTri = data.disTri || false
      var initFun = data.initFun //对显示对象进行初始化 传入tex路径
      var swallow = data.swallow
      var btnScale = data.btnScale || 1 //按钮缩放
      var canUp = data.canUp || false
      var clickFun = data.clickFun
      var endFun = data.endFun
      var ifnoMove = data.ifnoMove || false
      var ifOpenMouse = data.ifOpenMouse || false //是否开始鼠标监听
      var mouseMoveFun = data.mouseMoveFun
      var mouseAway = data.mouseAway
      var addBtnPos = data.addBtnPos || cc.p(-20, 20)
      var addBtnScale = data.addBtnScale || 0.8
      var ifShowInfo = data.ifShowInfo || false
      var addBtnClickfun = data.addBtnClickfun
      var upDistance = data.upDistance || size.height * 0.87
      var moveTime = data.moveTime || 0.1 //移动时间
      var upInfo = data.upInfo || {}
      if (swallow == null) {
            swallow = true
      }

      var mix = data.mix || 20
      var sel = data.sel || 140 //选择的方向大小
      var tri = data.tri || 90 //移动的方向大小
      var dis = 360 - tri * 2 - sel
      var aim = data.aim

      var judgeTime = data.judgeTime || 0.2
      var imgScale = data.imgScale || 1
      var listRect = {
            blue: [cc.rect(0, 0, 78, 76), cc.rect(20, 20, 20, 20)],
            yellow: [cc.rect(0, 0, 91, 89), cc.rect(20, 40, 20, 5)],
            orange: [cc.rect(0, 0, 127, 127), cc.rect(20, 20, 20, 20)],
            op: [cc.rect(0, 0, 103, 136), cc.rect(20, 20, 20, 20)],
      }
      var bg = null
      if (!noBg) {
            bg = new cc.Scale9Sprite(res[sprintf("bg_biaoge_%s", color)], listRect[color][0], listRect[color][1])
            bg.width = size.width
            bg.height = size.height
      } else {
            bg = createLayout({
                  size: size,
                  op: 0,
            })
      }
      var getFun = data.getFun
      var outFun = data.outFun
      var counts = data.counts
      var mix = data.mix || 40
      var init = data.init
      if (!counts) {
            counts = []
            for (var i = 0; i < list.length; i++) {
                  counts[i] = 1
            }
      }
      var devide = null
      var beginx = null
      var beginy = null

      bg.setScale(scale)
      if(bgOp==null) bgOp = 255
      bg.setOpacity(bgOp)
      if(!bgOp){
         bg.setCascadeOpacityEnabled(false)   
      }
      bg.setPosition(pos)
      bg.setAnchorPoint(0.5, 0.5)
      var laySize = cc.size(size.width + modify.x * 2, size.height + modify.y * 2)
      var lay = createLayout({
            pos: cc.p(-modify.x, -modify.y),
            size: laySize,
            op: 0,
      })
      bg.lay = lay
      lay.counts = counts
      lay.noArrow = data.noArrow || false
      lay.noAuto = data.noAuro || false
      lay.getIndex = function(pos) { //获取指定的位置的index 内部调用
            var lay = this
            for (var i = 0; i < lay.list.length; i++) {
                  if (judgeInside({
                              item: lay.list[i],
                              pos: pos,
                        })) {
                        return i
                  }
            }
            return null
      }
      bg.reInit = function(data) { //重新初始化 用于重新开始等情况
            var bg = this
            list = data.list
            var counts = data.counts
            if (!counts) {
                  counts = []
                  for (var i = 0; i < list.length; i++) {
                        counts[i] = 1
                  }
            }
            var lay = bg.lay
            lay.counts = counts
            lay.maxPage = (((list.length % num) > 0) ? 1 : 0) + Math.floor(list.length / num) - 1
            var node = lay.moveNode
            node.removeAllChildren(true)
            lay.list = []
            for (var i = 0; i < list.length; i++) {
                  var img = new cc.Sprite(list[i])
                  img.setScale(imgScale)
                  switch (type) {
                        case "S":
                              img.setPosition(cc.p(beginx, beginy - i * devide))
                              break
                        default:
                              img.setPosition(cc.p(beginx + i * devide, beginy))
                              break
                  }
                  img.index = i
                  node.addChild(img)
                  lay.list.push(img)
            }
            node.setPosition(0, 0)
            lay.page = 0
            lay.changePage()
            lay.judgeArrow()
      }
      lay.init = function() {
            var lay = this
            lay.setClippingEnabled(true)
            lay.list = []
            lay.page = 0
            lay.maxPage = (((list.length % num) > 0) ? 1 : 0) + Math.floor(list.length / num) - 1
            if (ifPage) {
                  var page = new cc.LabelBMFont("", res.listNum)
                  page.setAnchorPoint(0, 0)
                  page.setScale(pageScale)
                  page.setString(sprintf("%d/%d", lay.page + 1, lay.maxPage + 1))
                  page.setPosition(pageOff)
                  page.color = pageColor
                  bg.addChild(page)
                  lay.pageNode = page
            }
            if (!lay.noArrow) {
                  var left = new cc.Sprite(res[sprintf("btn_arrow_%s", arrow)])
                  var right = new cc.Sprite(res[sprintf("btn_arrow_%s", arrow)])
                  left.setScale(1 / scale * btnScale)
                  right.setScale(1 / scale * btnScale)
                  left.setAnchorPoint(0.5, 0.5)
                  right.setAnchorPoint(0.5, 0.5)
                  if (lay.type == "S") {
                        left.setRotation(180)
                        left.setPosition(size.width / 2 + arrOff.x, size.height + mix + arrOff.y)
                        right.setPosition(size.width / 2 + arrOff.x, -mix - arrOff.y)
                  } else {
                        left.setRotation(90)
                        right.setRotation(-90)
                        right.setPosition(size.width + mix - arrOff.x, size.height / 2 + arrOff.y)
                        left.setPosition(-mix + arrOff.x, size.height / 2 + arrOff.y)
                  }
                  createTouchEvent({
                        item: left,
                        swallow: swallow,
                        begin: function(data) {
                              return getLoopVis(data.item)
                        },
                        end: function() {
                              if (bg.isVisible()) {
                                    lay.move(false)
                              }
                        }
                  })
                  createTouchEvent({
                        item: right,
                        swallow: swallow,
                        begin: function(data) {
                              return getLoopVis(data.item)
                        },
                        end: function() {
                              if (bg.isVisible()) {
                                    lay.move(true)
                              }
                        }
                  })
                  bg.addChild(left)
                  bg.addChild(right)
                  lay.leftArrow = left
                  lay.rightArrow = right
                  if (!lay.noAuto) {
                        if (lay.type == "S") {
                              addShowType({
                                    item: left,
                                    show: "shakeF",
                                    time: 0.3,
                                    buf: cc.p(0, 10)
                              })
                              addShowType({
                                    item: right,
                                    show: "shakeF",
                                    time: 0.3,
                                    buf: cc.p(0, -10)
                              })
                        } else {
                              addShowType({
                                    item: left,
                                    show: "shakeF",
                                    time: 0.3,
                                    buf: cc.p(10, 0)
                              })
                              addShowType({
                                    item: right,
                                    show: "shakeF",
                                    time: 0.3,
                                    buf: cc.p(-10, 0)
                              })
                        }
                  }
            }
            if (canUp) {
                  var upBtn = createJudgeBtn({
                        normal: upInfo.normal || res.btn_toolup_normal,
                        select: upInfo.select || res.btn_toolup_select,
                        judge: function(item) {
                              return getLoopVis(item)
                        },
                        fun: function() {
                              if (!bg.uping) {
                                    bg.uping = true
                                    upBtn.setCanTouch(false)
                                    addShowType({
                                          item: bg,
                                          show: "moveBy",
                                          buf: cc.p(0, upDistance),
                                          time: 0.3,
                                          fun: function() {
                                                bg.uping = false
                                                upBtn.setCanTouch(true)
                                          }
                                    })
                              }
                        },
                        back: function() {
                              if (!bg.uping) {
                                    bg.uping = true
                                    upBtn.setCanTouch(false)
                                    addShowType({
                                          item: bg,
                                          show: "moveBy",
                                          buf: cc.p(0, -upDistance),
                                          time: 0.3,
                                          fun: function() {
                                                bg.uping = false
                                                upBtn.setCanTouch(true)
                                          }
                                    })
                              }
                        },
                  })
                  upBtn.setAnchorPoint(0.5, 0.6)
                  upBtn.setPosition(size.width / 2, 0)
                  safeAdd(bg, upBtn)
            }
            if (!aim) {
                  if (lay.type == "S") {
                        aim = -90
                  } else {
                        aim = 0
                  }
            }

            createMoveRotate({
                  item: lay,
                  aim: aim,
            })

            var node = new cc.Node()
            lay.addChild(node)
            lay.moveNode = node
            for (var i = 0; i < list.length; i++) {
                  var img = null
                  if (initFun) {
                        img = initFun(list[i])
                  } else {
                        img = new cc.Sprite(list[i])
                  }
                  img.setScale(imgScale)
                  switch (type) {
                        case "S":
                              img.setPosition(cc.p(beginx, beginy - i * devide))
                              break
                        default:
                              img.setPosition(cc.p(beginx + i * devide, beginy))
                              break
                  }
                  img.index = i
                  node.addChild(img)
                  lay.list.push(img)
                  if (ifShowInfo) {
                        var addbn = new ccui.Button(res.btn_add_normal, res.btn_add_select)
                        addbn.setPosition(img.width + addBtnPos.x, addBtnPos.y)
                        addbn.setScale(addBtnScale)
                        img.addChild(addbn)
                        img.addbn = addbn
                        addbn.index = img.index
                        addbn.addClickEventListener(function(sender, type) {
                              if (addBtnClickfun) {
                                    addBtnClickfun({
                                          index: sender.index
                                    })
                              }
                        })
                  }
            }
            lay.judgeArrow()
            var getSp = function(data) {
                  var sp = data.sp
                  var start = data.start
                  var final = data.final
                  var item = data.item
                  var index = item.getIndex(start)
                  if (index < list.length && index >= 0) {
                        if (!lay.judgeIndex(index, true)) {
                              return null
                        }
                        if (getFun) {
                              sp = getFun({
                                    index: index,
                                    pos: final,
                                    tex: list[index],
                              })
                        }
                        if (!sp) {
                              sp = new cc.Sprite(list[index])
                              sp.setPosition(bg.convertToNodeSpace(final))
                              bg.addChild(sp)
                        }
                        sp.index = index
                        if (init) {
                              init({
                                    item: sp,
                                    index: index,
                                    pos: final,
                              })
                        }
                        return sp
                  }
                  return null
            }
            createTouchEvent({
                  item: lay,
                  swallow: swallow,
                  begin: function(data) {
                        var item = data.item
                        var pos = data.pos
                        if (!getLoopVis(item)) {
                              return false
                        }
                        if (disTri) {
                              var sp = null
                              sp = getSp({
                                    sp: sp,
                                    start: pos,
                                    final: pos,
                                    item: item,
                              })
                              item.startPos = pos
                              item.select = sp
                              item.judge = true
                        } else {
                              item.listenRotate(pos)
                              if (clickFun) {
                                    var index = item.getIndex(pos)
                                    if (index != null) {
                                          var result = item.counts[index] > 0
                                          if (result) {
                                                return clickFun({
                                                            index: index,
                                                            item: lay.list[index]
                                                      })
                                          }
                                    }
                              }
                        }
                        return true
                  },
                  move: function(data) {
                        var item = data.item
                        var pos = data.pos
                        var delta = data.delta
                        var tri = null
                        var dis = null
                        if (!ifnoMove) {
                              if (!disTri) {
                                    tri = item.getAngle(pos)
                                    dis = item.getDis(pos)
                              }
                              var sp = null
                              if (item.select) {
                                    item.select.x += delta.x / getLoopScale(item.select, true).x
                                    item.select.y += delta.y / getLoopScale(item.select, true).y
                              }

                              if (!item.judge) {
                                    if (dis >= mix && (tri == "down" || tri == "up")) {
                                          item.judge = true
                                          if (!item.select) {
                                                sp = getSp({
                                                      sp: sp,
                                                      start: item.startPos,
                                                      final: pos,
                                                      item: item,
                                                })
                                                item.select = sp
                                          }
                                    }
                                    if (dis >= mix && (tri == "left" || tri == "right")) {
                                          item.judge = true
                                          item.tri = tri
                                    }
                              } else {
                                    if (!item.select && !item.tri) {
                                          sp = getSp({
                                                sp: sp,
                                                start: item.startPos,
                                                final: pos,
                                                item: item,
                                          })
                                          item.select = sp
                                    }
                              }
                        }
                  },
                  end: function(data) {
                        var item = data.item
                        var pos = data.pos
                        if (!ifnoMove) {
                              if (item.select) {
                                    if (outFun) {
                                          item.select.retain()
                                          item.select.removeFromParent(false)
                                          outFun({
                                                item: item.select,
                                                pos: pos,
                                                index: item.select.index,
                                          })
                                          item.select.release()
                                          item.select = null
                                    } else {
                                          item.select.removeFromParent(true)
                                          lay.judgeIndex(item.select.index, false)
                                          item.select = null
                                    }
                              } else {
                                    switch (item.tri) {
                                          case "left":
                                                item.move(true)
                                                break
                                          case "right":
                                                item.move(false)
                                                break
                                          default:
                                                break
                                    }
                                    if (endFun) {
                                          endFun()
                                    }
                              }
                        }
                        if (endFun) {
                              endFun(data)
                        }
                  }
            })
            if (ifOpenMouse) {
                  cc.eventManager.addListener({
                        event: cc.EventListener.MOUSE,
                        swallow: false,
                        onMouseMove: function(event) {
                              var pos = event.getLocation()
                              if (judgeInside({
                                          item: lay,
                                          pos: pos,
                                    })) {
                                    var index = lay.getIndex(event.getLocation())
                                    if (index != null) {
                                          var result = lay.counts[index] > 0
                                          if (result) {
                                                mouseMoveFun({
                                                      index: index,
                                                })
                                          }
                                    } else {
                                          if (mouseAway) {
                                                mouseAway()
                                          }
                                    }
                              } else {
                                    if (mouseAway) {
                                          mouseAway()
                                    }
                              }
                        }
                  }, lay)
            }
      }
      lay.judgeIndex = function(index, out) { //对指定index进行获取或者归还操作 内部调用
            var lay = this
            if (index >= 0 && index < lay.list.length) {
                  if (out) {
                        if (lay.counts[index] > 0) {
                              lay.counts[index]--
                                    if (lay.counts[index] == 0) {
                                          lay.list[index].setOpacity(127)
                                          if (lay.list[index].addbn) {
                                                lay.list[index].addbn.setVisible(false)
                                          }
                                    }
                              return true
                        }
                        return false
                  } else {
                        lay.counts[index]++
                              lay.list[index].setOpacity(255)
                        if (lay.list[index].addbn) {
                              lay.list[index].addbn.setVisible(true)
                        }
                        return true
                  }
            }
      }
      bg.judgeIndex = function(index, out) { //外部调用
            lay.judgeIndex(index, out)
      }
      lay.judgeBack = function(data) { //内部调用 判定返回
            var lay = this
            var index = data.index
            var pos = data.pos
            if (judgeInside(lay, pos)) {
                  lay.judgeIndex(index, false)
                  lay.list[index].setOpacity(255)
                  return true
            }
            return false
      }
      if (type == "S") {
            devide = (laySize.height - offset.y * 2) / num
            beginx = laySize.width / 2 + offset.x
            beginy = laySize.height - (devide / 2 + offset.y)
            lay.type = "S"
      } else {
            devide = (laySize.width - offset.x * 2) / num
            beginx = devide / 2 + offset.x
            beginy = laySize.height / 2 + offset.y
            lay.type = "H"
      }

      lay.move = function(forward) {
            var lay = this
            var buf = null
            if (forward) {
                  if (lay.page < lay.maxPage) {
                        if (lay.type == "S") {
                              buf = cc.p(0, laySize.height)
                        } else {
                              buf = cc.p(-laySize.width, 0)
                        }
                        lay.page++
                  }
            } else {
                  if (lay.page > 0) {
                        if (lay.type == "S") {
                              buf = cc.p(0, -laySize.height)
                        } else {
                              buf = cc.p(laySize.width, 0)
                        }
                        lay.page--
                  }
            }
            if (buf) {
                  if (lay.changePage) {
                        lay.changePage()
                  }
                  addShowType({
                        item: lay.moveNode,
                        show: "moveBy",
                        buf: buf,
                        time: moveTime,
                        fun: function() {
                              lay.judgeArrow()
                        }
                  })
            }
      }
      lay.changePage = function() {
            var lay = this
            if (lay.pageNode) {
                  lay.pageNode.setString(sprintf("%d/%d", lay.page + 1, lay.maxPage + 1))
            }
      }
      lay.judgeArrow = function() {
            if (!lay.noArrow) {
                  var judgeleft = false
                  var judgeright = false
                  if (lay.page > 0) {
                        judgeleft = true
                  }
                  if (lay.page < lay.maxPage) {
                        judgeright = true
                  }
                  lay.leftArrow.setVisible(judgeleft)
                  lay.rightArrow.setVisible(judgeright)
            }
      }
      bg.addChild(lay)
      lay.init()
      return bg
}

var getRandKey = function() { //获取随机键值 timecontrol用
      return sprintf("RANDOMKEY%d", keyGen++)
}

var getEllipsePoint = function(data) { //获取椭圆坐标点列表
      var a = data.a
      var b = data.b
      var devide = data.devide || 0.1 //取点间隔
      var ifRotate = data.ifRotate || false
      var result = []
      var startx = a
      var useWeight = data.useWeight || false
      var getMyRotate = data.getMyRotate // 传入参数，获取角度
      if (ifRotate) {
            var temp = null
            var weightCount = 0
            for (var i = 0; i < 360;) {
                  var k = Math.tan(i / 180 * Math.PI)
                  var x = Math.sqrt(a * a * b * b / (b * b + a * a * k * k))
                  if (!((i >= 0 && i <= 90) || (i > 270 && i <= 360))) {
                        x = -x
                  }
                  var y = k * x
                  result.push(cc.p(x, y))
                  if (i == 0) {
                        temp = cc.p(x, y)
                  }
                  if (!useWeight) {
                        i += devide
                  } else {
                        weightCount = i
                        weightCount = weightCount % 180
                        if (weightCount > 90) {
                              weightCount = 180 - weightCount
                        }
                        i += (devide * (weightCount + 45) / 90)
                        if (getMyRotate) {
                              getMyRotate.push(i)
                        }
                  }
            }
            result.push(temp)
      } else {
            while (startx >= -a) {
                  result.push(cc.p(startx, Math.sqrt(1 - startx * startx / a / a) * b))
                  startx -= devide
            }
            startx += devide
            result.push(cc.p(-a, Math.sqrt(1 - a * a / a / a) * b))
            while (startx <= a) {
                  result.push(cc.p(startx, -Math.sqrt(1 - startx * startx / a / a) * b))
                  startx += devide
            }
      }
      return result
}

var goWithEll = function(data) { //跟随椭圆移动
      var item = data.item
      var init = data.init
      item.time = data.time
      item.curX = data.startx
      item.delay = data.delay || 0
      item.offset = data.offset || cc.p(0, 0)
      item.curJudge = true
      item.a = data.a
      item.b = data.b
      item.mix = data.mix
      item.focus = data.focus || "LEFT" //"RIGHT"
      switch (item.focus) {
            case "RIGHT":
                  item.focus = cc.p(Math.sqrt(item.a * item.a - item.b * item.b), 0)
                  break
            default:
                  item.focus = cc.p(-Math.sqrt(item.a * item.a - item.b * item.b), 0)
                  break
      }
      item.getDis = function() {
            var item = this
            var dis = getDis(cc.p(item.curX, item.curY), item.focus)
            return dis
      }
      item.getY = function() {
            var item = this
            var result = Math.sqrt(1 - item.curX * item.curX / item.a / item.a) * item.b

            if (item.curJudge) {
                  return result
            } else {
                  return -result
            }
      }
      item.getMix = function() {
            var result = Math.atan(Math.abs(-item.b * item.b * item.curX / (item.a * item.a * item.curY))) / Math.PI * 180
            return result
      }
      item.change = function() {
            var item = this
            item.curY = item.getY()
            item.curMix = item.getMix()
            item.setPosition(item.curX + item.offset.x, item.curY + item.offset.y) //wrong!!!!
            var dis = 1 / item.getDis() / item.curMix * item.mix
            if (item.curJudge) {
                  item.curX -= dis
                  if (item.curX < -item.a) {
                        item.curX = -item.a
                        item.curJudge = false
                  }
            } else {
                  item.curX += dis
                  if (item.curX > item.a) {
                        item.curX = item.a
                        item.curJudge = true
                  }
            }
      }
      if (init) {
            item.change()
      }
      item.key = getRandKey()
      addTimer({
            fun: function() {
                  item.change()
            },
            delay: item.delay,
            time: item.time,
            repeat: cc.REPEAT_FOREVER,
            key: item.key,
      })
}

var goWithPos = function(data) { //跟随坐标移动
      var item = data.item
      var posList = data.posList
      var time = data.time
      var repeat = data.repeat
      var delay = data.delay
      var init = data.init
      var rootPos = data.rootPos || cc.p(0, 0)
      var fun = data.fun

      item.rootPos = rootPos
      item.current = 0
      item.loop = 0
      item.posList = posList
      item.repeatMax = repeat
      item.key = getRandKey()
      item.backFun = data.backFun
      item.changePos = function() {
            var item = this
            var next = item.posList[item.current]
            item.stopActionByTag(TAG_POSMOVE)
                  //item.stopAllActions()
            addShowType({
                  item: item,
                  show: "moveTo",
                  time: time,
                  tag: TAG_POSMOVE,
                  buf: cc.p(item.rootPos.x + next.x, item.rootPos.y + next.y),
                  fun: function(item) {
                        item.current = item.current + 1
                        if (fun) {
                              fun(item.current)
                        }
                        var next = true
                        if (item.target != null && item.current == item.target) {
                              next = false
                              if (item.targetFun) {
                                    item.targetFun()
                                    item.targetFun = null
                              }
                              item.target = null
                              item.stop = true
                        }
                        if (item.current >= item.posList.length) {
                              item.loop = item.loop + 1
                              item.current = 1
                              if (item.loop >= item.repeatMax) {
                                    removeTimer(item.key)
                                    if (item.backFun) {
                                          item.backFun()
                                    }
                                    return
                              }
                        }
                        if (next) {
                              item.changePos()
                        }
                  }
            })
      }
      item.stopAct = function() { //外部调用 停止移动
            var item = this
                  //item.stopAllActions()
            item.stopActionByTag(TAG_POSMOVE)
            removeTimer(item.key)
      }
      item.changeAct = function() {
            if (!item.stop) {
                  item.stopAct()
                  item.stop = true
            } else {
                  item.changePos()
                  item.stop = false
            }
      }
      item.goTo = function(data) {
            var index = data.index
            var fun = data.fun
            item.target = index
            item.targetFun = fun
            item.changePos()
            item.stop = false
      }
      if (init) {
            var next = item.posList[item.current]
            item.setPosition(item.rootPos.x + next.x, item.rootPos.y + next.y)
            item.current++
      }
      item.changePos()
}

var goWithPos2 = function(data) {
      var item = data.item
      var posList = data.posList
      var time = data.time
      var repeat = data.repeat
      var delay = data.delay
      var init = data.init
      var rootPos = data.rootPos || cc.p(0, 0)
      var current = 0
      if (init) {
            item.setPosition(rootPos.x + posList[0].x, rootPos.y + posList[0].y)
      }
      var count = 0
      var key = getRandKey()
      addTimer({
            fun: function(key) {
                  current++
                  if (current == posList.length) {
                        current = 0
                        count++
                        if (count >= repeat) {
                              removeTimer(key)
                        }
                  }
                  //item.runAction(cc.moveTo(time, cc.p()))
                  item.setPosition(rootPos.x + posList[current].x, rootPos.y + posList[current].y)
            },
            time: time,
            repeat: cc.REPEAT_FOREVER,
            delay: delay,
            key: key,
      })
      item.stopAct = function() {
            removeTimer(key)
      }
}

var drawEllipse = function(data) { //绘制椭圆
      var father = data.father || new cc.DrawNode()
      var buf = data.buf
      var color = data.color || cc.color(255, 0, 0, 255)
      var seg = data.seg || 2
      var ifPoint = data.ifPoint || false
      for (var i = 0; i < buf.length - 1; i++) {
            father.drawSegment(buf[i], buf[i + 1], seg, color)
            if (ifPoint) {
                  father.drawDot(buf[i], 1, cc.color(255, 0, 0, 255))
            }
      }
      return father
}

var drawLines = function(data) { //根据传入点列表绘制线段
      var father = data.father || new cc.DrawNode()
      var buf = data.buf
      var offset = data.offset || cc.p(0, 0)
      var color = data.color || cc.color(255, 0, 0, 255)
      var seg = data.seg || 2
      for (var i = 0; i < buf.length - 1; i++) {
            father.drawSegment(cc.p(buf[i].x + offset.x, buf[i].y + offset.y), cc.p(buf[i + 1].x + offset.x, buf[i + 1].y + offset.y), seg, color)
      }
      return father
}

var blink = function(data) { //制作图片切换效果
      var item = data.item
      var normal = data.normal || "normal"
      var select = data.select || "select"
      var current = data.current || false
      var time = data.time || 0.1
      var count = data.count || cc.REPEAT_FOREVER
      var after = data.after
      if (item) {
            if (item.getChildByName) {
                  item.normal = normal
                  item.select = select
            }
            item.judge = current
            item.time = time
            item.key = getRandKey()
            item.show = function() {
                  var item = this
                  var tnormal = null
                  var tselect = null
                  if (item.getChildByName) {
                        tnormal = item.getChildByName(item.normal)
                        tselect = item.getChildByName(item.select)
                  } else {
                        tnormal = item.normal
                        tselect = item.select
                  }
                  tnormal.setVisible(item.judge)
                  tselect.setVisible(!item.judge)
                  item.judge = !item.judge
            }
            addTimer({
                  fun: function() {
                        item.show()
                  },
                  time: item.time,
                  key: item.key,
                  repeat: count,
                  after: function() {
                        if (after) {
                              after()
                        }
                  }
            })
            item.show()
      }
}

var disTimer = function(item) { //关闭item绑定的key对应的timercontrol
      if (item.key) {
            removeTimer(item.key)
      }
}

var createPages = function(data) { //创建学一学的页面
      var father = data.father
      var pics = data.pics
      var posOff = data.posOff
      var scales = data.scales
      var numsModify = data.numsModify || cc.p(6, 12)
      var layer = data.layer
      var mixLimit = 100
      var borderLimit = 120
      var jdtHeight = 90
      var mix = 20
      var time = 0.1
      var moveFun = data.moveFun

      var tempShow = createLayout({
            pos: cc.p(0, 0),
            size: cc.director.getWinSize(),
            op: 0,
      })
      tempShow.curIndex = 0
      tempShow.maxIndex = pics.length
      tempShow.setLocalZOrder(0)

      tempShow.setClippingEnabled(true)
      tempShow.setCascadeOpacityEnabled(true)

      father.addChild(tempShow)
      tempShow.list = []
      var winsize = cc.director.getWinSize()
      for (var k = 0; k < pics.length; k++) {
            var pic = pics[k]
            var img = null
            switch (typeof(pic)) {
                  case "function":
                  case "Function":
                        img = pic()
                        break
                  default:
                        img = new ccui.ImageView(pic)
                        break
            }
            var off = cc.p(0, 0)
            if (posOff && posOff[k] != null) {
                  off = posOff[k]
            }
            img.setPosition(getMiddle(k * winsize.width + off.x, off.y))
            tempShow.addChild(img)
            tempShow.list.push(img)
            if (k == 0) {
                  tempShow.minPos = img.getPosition()
            }
            if (scales && scales[k] != null) {
                  img.setScale(scales[k])
            }
      }

      if (pics.length > 1) {
            if (!tempShow.jdt) {
                  var jdt = new cc.Scale9Sprite(res.img_jdt, cc.rect(0, 0, 13, 13), cc.rect(4, 0, 5, 0))
                  jdt.setAnchorPoint(0, 0.5)
                  jdt.height = 13
                  var screenW = cc.director.getWinSize().width
                  jdt.width = (screenW - borderLimit * 2 - mixLimit) / pics.length
                  tempShow.addChild(jdt)
                  tempShow.jdt = jdt
                  jdt.devide = (screenW - borderLimit * 2) / pics.length
                  jdt.setPosition(cc.p(borderLimit, jdtHeight))
                  jdt.rootX = jdt.getPositionX()
                  jdt.judge = (screenW - borderLimit * 2)
            }
      }

      tempShow.Move = function() {
            this.changePage()
            var item = this
            var dis = item.minPos.x - item.list[item.curIndex].x
            var count = 0
            item.Moving = true
            for (var i = 0; i < item.list.length; i++) {
                  var img = item.list[i]
                  count++
                  addShowType({
                        item: img,
                        show: "moveBy",
                        time: time,
                        buf: cc.p(dis, 0),
                        fun: function() {
                              count--
                              if (count == 0) {
                                    item.Moving = false
                              }
                        }
                  })
            }
            if (moveFun) {
                  moveFun()
            }
      }

      tempShow.changePage = function() {
            var node = this
            if (!layer.pageNum) {
                  var img = layer.img_page
                  var temp = new cc.LabelBMFont("", res.nums)
                  temp.setAnchorPoint(0.5, 0.5)
                  var size = img.getContentSize()
                  temp.setPosition(size.width / 2 + numsModify.x, size.height / 2 + numsModify.y)
                  img.addChild(temp)
                  layer.pageNum = temp
            }
            var num = layer.pageNum
            num.setString(sprintf("%d/%d", node.curIndex + 1, node.maxIndex))
            if (node.jdt) {
                  var jdt = node.jdt
                  jdt.stopAllActions()
                  var target = jdt.rootX + node.curIndex * jdt.devide
                  addShowType({
                        item: jdt,
                        show: "moveTo",
                        buf: cc.p(target, jdtHeight),
                        time: time,
                  })
            }
      }
      if (pics.length >= 1) {
            tempShow.isShowPage = true
            createTouchEvent({
                  item: tempShow,
                  swallow: false,
                  begin: function(data) {
                        var item = data.item
                        var pos = data.pos
                        if (!item.Moving && item.isVisible() && item.getParent().isVisible()) {
                              item.startPos = pos
                              return true
                        } else {
                              return false
                        }
                  },
                  move: function(data) {
                        var item = data.item
                        var pos = data.pos
                        var delta = data.delta
                        for (var i = 0; i < item.list.length; i++) {
                              var img = item.list[i]
                              img.x += delta.x
                        }
                        if (item.jdt) {
                              var jdt = item.jdt
                              var judgex = delta.x * (jdt.devide / jdt.judge)
                              jdt.x -= judgex
                        }
                  },
                  end: function(data) {
                        var item = data.item
                        var pos = data.pos
                        var dis = pos.x - item.startPos.x
                        var judge = dis > 0 ? -1 : 1
                        var abs = Math.abs(dis)
                        if (abs > mix) {
                              if (item.list[item.curIndex + judge]) {
                                    item.curIndex += judge
                                    item.Move()
                              } else {
                                    item.Move()
                              }
                        } else {
                              item.Move()
                        }
                  },
            })
      } else {
            tempShow.isShowPage = true
      }
      return tempShow
}

var getAngleTri = function(src, dest) { //获取两点间方位
      var angle = getAngle(src, dest)
      if ((angle >= 0 && angle <= 45) || (angle >= 315 && angle <= 360)) {
            return "left"
      }
      if ((angle >= 45 && angle <= 135)) {
            return "up"
      }
      if ((angle >= 135 && angle <= 225)) {
            return "right"
      }
      if ((angle >= 225 && angle <= 315)) {
            return "down"
      }
}

var getAngle = function(src, dest) { //计算两点之间的角度
      var xdis = dest.x - src.x
      var ydis = dest.y - src.y
      var dis = getDis(src, dest)
      var judge = false
      if (ydis < 0) {
            judge = true
      }
      if (dis == 0) {
            return 0
      }
      var result = Math.acos(xdis / dis) / Math.PI * 180
      if (judge) {
            result = (180 - result) + 180
      }
      return result
}

var getDis = function(src, dest) { //两点间距
      var xdis = dest.x - src.x
      var ydis = dest.y - src.y
      var dis = Math.sqrt(xdis * xdis + ydis * ydis)
      return dis
}

var getMax = function(list) { //获取最大值
      var result = null
      if (list[0] != null) {
            result = list[0]
            for (var i = 1; i < list.length; i++) {
                  if (result < list[i]) {
                        result = list[i]
                  }
            }
      }
      return result
}

var getMin = function(list) { //获取最小值
      var result = null
      if (list[0] != null) {
            result = list[0]
            for (var i = 1; i < list.length; i++) {
                  if (result > list[i]) {
                        result = list[i]
                  }
            }
      }
      return result
}

var setSize = function(data) { //通过修改缩放来达到尺寸变化
      var item = data.item
      var width = data.width
      var height = data.height
      var src = item.getContentSize()
      if (width) {
            item.setScaleX(width / src.width)
      }
      if (height) {
            item.setScaleY(height / src.height)
      }
}

var getSizeScale = function(data) { //获取尺寸比例
      var item = data.item
      var width = data.width
      var height = data.height
      var src = item.getContentSize()
      var x = 1
      var y = 1
      if (width) {
            x = width / src.width
      }
      if (height) {
            y = height / src.height
      }
      return {
            x: x,
            y: y,
      }
}

// var _lightControl = {
//       addNode: function(node) {
//             var lights = this
//             if (!lights.nodes) {
//                   lights.nodes = []
//             }
//             var nodes = lights.nodes
//             nodes[nodes.length] = node
//       },
//       clearAll: function() {
//             var lights = this
//             var nodes = lights.nodes
//             if (nodes) {
//                   for (var i = 0; i < nodes.length; i++) {
//                         var node = nodes[i]
//                         if (node) {
//                               var light = node.light
//                               if (light) {
//                                     light.stopAllActions()
//                                     light.setVisible(false)
//                               }
//                         }
//                   }
//             }
//       }
// }
var _Input_pastTarget = null
var _Input_Acts = {
      CLEAR_ALL: 0,
      CLEAR_SELF: 1,
      DIS_CLEAR: 2,
}
var addInput = function(data) { //在传入对象上创建输入框 并封装对应的函数
      var item = data.item
      var color = data.color || cc.color(0, 0, 0, 255)
      var holder = data.holder || ""
      var fontsize = data.size || 36
      var str = data.str || ""
      var strlen = data.strlen
      var fontType = data.fontType || "mid" // "left" "right"
      var backFun = data.backFun
      var touchFun = data.touchFun
      var size = item.getContentSize()
      var answerModify = data.answerModify || cc.p(0, 0)
      var control = data.control
      var lineChange = data.lineChange || false
      var lineNums = data.lineNums || -1
            //cc.log("lineChange", lineChange)
      if (control && !control.init) {
            control.addNode = function(node) {
                  var lights = this
                  if (!lights.nodes) {
                        lights.nodes = []
                  }
                  var nodes = lights.nodes
                  nodes[nodes.length] = node
                        //cc.log("add")
            }
            control.clearAll = function() {
                  var lights = this
                  var nodes = lights.nodes
                  if (nodes) {
                        for (var i = 0; i < nodes.length; i++) {
                              var node = nodes[i]
                              if (node) {
                                    var light = node.light
                                    if (light) {
                                          light.stopAllActions()
                                          light.setVisible(false)
                                    }
                              }
                        }
                  }
                  cc.log("clear")
            }
            control.init = true
      }
      var layOut = createLayout({
            pos: cc.p(0, 0),
            size: size,
            op: 0
      })
      item.addChild(layOut)
      item.layOut = layOut
      layOut.setClippingEnabled(true)
            //before
      if (!item.input) {
            var size = item.getContentSize()
            item.input = new ccui.TextField()

            item.inshow = new cc.LabelTTF()

            var node = item.input
            node.lineChange = lineChange
            if (lineNums > 0) {
                  node.maxJudge = lineNums
            } else {
                  node.maxJudge = Math.floor(size.width / (fontsize * 0.7))
            }
            //cc.log(node.maxJudge)
            var inshow = item.inshow
            node.inshow = inshow
            node.setPosition(size.width / 2, size.height / 2)
            inshow.setPosition(size.width / 2, size.height / 2)
            switch (CUR_WEB_TYPE) {
                  case WEB_TYPE.FIREFOX:
                        node.setPosition(size.width / 2, size.height / 2 - fontsize / 3)
                        inshow.setPosition(size.width / 2, size.height / 2 - fontsize / 3)
                        break
            }
            node.setString(str)
            inshow.setString(str)
            switch (fontType) {
                  case "left":
                        node.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT)
                        inshow.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT)
                        break
                  case "right":
                        node.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT)
                        inshow.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT)
                        break
            }
            //node.setTouchSize(size)
            //
            node.setTouchEnabled(false)
            node.setFontSize(fontsize)
            node.setVisible(false)
            inshow.setFontSize(fontsize)
            var tempFont = new cc.LabelTTF()
            inshow.tempFont = tempFont
            tempFont.setVisible(false)
            tempFont.setFontSize(fontsize)
            safeAdd(inshow, tempFont)
            node.maxLen = strlen
            node.setPlaceHolder(holder)
            inshow.holder = holder
            if (!str) {
                  inshow.setString(holder)
            }
            //node.setTextColor(cc.color(0, 0, 0, 0))
            node.setTextColor(color)
            inshow.setColor(color)
            item.layOut.addChild(node)
            item.layOut.addChild(inshow)

            node.backFun = function() {
                  var target = node
                  switch (target.curAct) {
                        case _Input_Acts.CLEAR_ALL:
                              if (backFun) {
                                    backFun(item)
                              }
                              if (item.myCallBack) {
                                    item.myCallBack(item)
                              }
                              if (control) {
                                    control.clearAll()
                              } else {
                                    if (node.light) {
                                          node.light.stopAllActions()
                                          node.light.setVisible(false)
                                    }
                              }
                              node.judgeLimit()
                              break
                        case _Input_Acts.CLEAR_SELF:
                              if (backFun) {
                                    backFun(item)
                              }
                              if (item.myCallBack) {
                                    item.myCallBack(item)
                              }
                              node.judgeLimit()
                              if (node.light) {
                                    node.light.stopAllActions()
                                    node.light.setVisible(false)
                              }
                              break
                        case _Input_Acts.DIS_CLEAR:
                              break
                  }
                  target.curAct = null
            }

            node.addEventListener(function(target, event) {
                  if (event == ccui.TextField.EVENT_DETACH_WITH_IME) { //结束触发
                        target.backFun && target.backFun()
                  }
                  if (event == ccui.TextField.EVENT_ATTACH_WITH_IME) { //开始触发
                        // if (node.light) {
                        //       node.light.stopAllActions()
                        //       node.light.setVisible(false)
                        //       node.light.removeFromParent(true)
                        //       node.light = null
                        // }
                        //node.attachWithIME()
                        if (touchFun) {
                              touchFun(item)
                        }
                        if (control) {
                              control.clearAll()
                        }
                        if (!node.light) {
                              var light = new cc.Sprite(res.img_input_light)
                              light.setColor(color)
                              node.light = light
                              setSize({
                                    item: light,
                                    width: fontsize / 10,
                                    height: fontsize,
                              })
                              item.addChild(light)
                              if (control) {
                                    control.addNode(node)
                              }
                        }
                        //node.judgeLimit()
                        if (node.light) {
                              var light = node.light
                              light.stopAllActions()
                              addShowType({
                                    item: light,
                                    show: "blink",
                                    repeat: cc.REPEAT_FOREVER,
                                    time: 0.8,
                              })
                              light.setVisible(true)
                              node.judgeLight()
                        }
                  }
                  if (event == ccui.TextField.EVENT_INSERT_TEXT || event == ccui.TextField.EVENT_DELETE_BACKWARD) {
                        target.curAct = _Input_Acts.CLEAR_ALL
                        node.judgeLimit()
                        node.judgeLight()
                  }
            })
            node.judgeLimit = function() {
                  var node = this
                  var inshow = node.inshow
                  if (node.maxLen != null) {
                        var str = node.getString()
                        if (str.length > node.maxLen) {
                              node.setString(str.substr(0, node.maxLen))
                        }
                  }
                  if (node.lineChange) {
                        var str = node.getString()
                        str = str.split("\n")
                        str = str.join("")

                        if (str.length > 0) {
                              var final = strSplit({
                                    str: str,
                                    judge: node.maxJudge
                              })
                              inshow.setString(final)
                              var temp = final.split("\n")
                              inshow.judgeFinal = temp[temp.length - 1]
                        } else {
                              inshow.setString(inshow.holder)
                              inshow.judgeFinal = ""
                        }
                  } else {
                        inshow.judgeFinal = ""
                        inshow.setString(node.getString())
                  }
            }
            node.judgeBefore = function() { //前置初始化 删除换行符
                  var node = this
                        // if (node.lineChange) {
                        //       var str = node.getString()
                        //       str = str.split("\n")
                        //       str = str.join("")
                        //       node.setString(str)
                        // }
                        //cc.log("before2", str)
            }
            node.judgeLight = function() { //光标的位置限定
                  var node = this
                  var inshow = node.inshow
                  var tempFont = inshow.tempFont
                  if (node.light) {
                        var light = node.light
                        if (node.width != 0) {
                              light.setAnchorPoint(0, 0.35)

                              var mix = 0
                              if (tempFont && inshow.judgeFinal) {
                                    tempFont.setString(inshow.judgeFinal)
                                    mix = inshow.width - tempFont.width
                              }
                              if (mix < 0) {
                                    mix = 0
                              }
                              light.setPosition(inshow.width - mix, fontsize / 2)
                                    // if (CUR_WEB_TYPE) {
                                    //       light.setPosition(node.width, fontsize / 2 + fontsize / 3)
                                    // }
                              safeAdd(inshow, node.light)
                        } else {
                              light.setAnchorPoint(0, 0.5)
                              light.setPosition(size.width / 2, size.height / 2)
                              safeAdd(item, light)
                        }
                  }
            }
      }
      item.getStr = function() {
            var item = this
            if (item.input) {
                  return item.input.getString()
            }
            return null
      }
      item.setStr = function(str) {
            var item = this
            if (item.input) {
                  item.input.setString(str)
            }
            if (item.inshow) {
                  item.inshow.setString(str)
            }
      }
      item.setAnswer = function(judge) { //设置正确和错误
            var item = this
            var size = item.getContentSize()
            if (!item.img_correct) {
                  var sp = new cc.Sprite("#img_correct.png")
                  sp.setAnchorPoint(1, 0)
                  sp.setPosition(size.width + answerModify.x, 0 + answerModify.y)
                  safeAdd(item, sp)
                  item.img_correct = sp
            }
            if (!item.img_fault) {
                  var sp = new cc.Sprite("#img_fault.png")
                  sp.setAnchorPoint(1, 0)
                  sp.setPosition(size.width + answerModify.x, 0 + answerModify.y)
                  safeAdd(item, sp)
                  item.img_fault = sp
            }
            item.img_correct.setVisible(judge)
            item.img_fault.setVisible(!judge)
      }
      item.clear = function(str) { //清空答案
            var item = this
            str = str || ""
            if (item.img_correct) {
                  item.img_correct.setVisible(false)
            }
            if (item.img_fault) {
                  item.img_fault.setVisible(false)
            }
            if (item.input) {
                  item.input.setString(str)
            }
            if (item.inshow) {
                  item.inshow.setString(str)
            }
            if (node.light) {
                  node.light.stopAllActions()
                  node.light.setVisible(false)
                  node.light.removeFromParent(true)
                  node.light = null
            }
      }

      if (item.setTouchEnabled) {
            item.setTouchEnabled(false)
      }
      createTouchEvent({
            item: item,
            begin: function(data) {
                  var item = data.item
                  if (!getLoopVis(item)) {
                        return false
                  }
                  return true
            },
            beginfail: function(data) {
                  var item = data.item.input
                  if (item && item == _Input_pastTarget) {
                        item.curAct = _Input_Acts.CLEAR_ALL
                        item.backFun && item.backFun()
                        _Input_pastTarget = null
                              //item.closeIME()
                        item.getVirtualRenderer().detachWithIME()
                              //item.onExit && item.onExit();
                              //cc.log("fuck here")
                  }
                  return false
            },
            end: function(data) {
                  var item = data.item.input
                  if (_Input_pastTarget != null) {
                        if (_Input_pastTarget != item) {
                              _Input_pastTarget.curAct = _Input_Acts.CLEAR_SELF
                              item.curAct = _Input_Acts.CLEAR_ALL
                        }
                        if (_Input_pastTarget == item) {
                              item.curAct = _Input_Acts.DIS_CLEAR
                        }
                  } else {
                        item.curAct = _Input_Acts.CLEAR_ALL
                  }
                  _Input_pastTarget = item
                  if (item.judgeBefore) {
                        item.judgeBefore()
                  }
                  item.attachWithIME()
            }
      })
}

var strSplit = function(data) {
      var str = data.str
      var judge = data.judge
      var list = str.split("")
            //cc.log(list)
      var sizeList = []
      for (var i = 0; i < list.length; i++) {
            sizeList[i] = getStrLength(list[i])
      }
      //cc.log(sizeList)
      var finalList = []
      var count = 0
      var index = 0
      for (var i = 0; i < list.length; i++) {
            count += sizeList[i];
            if (count > judge) {
                  finalList[index] = "\n"
                  index++;
                  finalList[index] = list[i]
                  index++;
                  count = sizeList[i]
            } else if (count == judge) {
                  finalList[index] = list[i]
                  index++;
                  if (i != list.length - 1) {
                        finalList[index] = "\n"
                        index++;
                  }
                  count = 0
            } else {
                  finalList[index] = list[i]
                  index++;
            }
      }
      return finalList.join("")
}

var judgeNum = function(str) { //判断字符是否为数字字符
      if (str.length == 1) {
            var tempNum = str.charCodeAt(0)
            return tempNum >= 48 && tempNum <= 57 //ascii 0-9 
      }
      return false
}

var judgeContain = function(src, dst) { //判断src列表是否包含dst
      for (var i = 0; i < src.length; i++) {
            if (src[i] == dst) {
                  return true
            }
      }
      return false
}

var getRand = function(nums) { //获取(0, nums-1)的随机不重复数组
      var result = []
      var temp = []
      for (var i = 0; i < nums; i++) {
            temp[i] = i
      }
      for (var i = nums, j = 0; i > 0; i--, j++) {
            var judge = Math.floor(Math.random() * i)
            result[j] = temp[judge]
            temp.splice(judge, 1)
      }
      return result
}

var mixArray = function(array) { //打乱传入数组
      var result = []
      var temp = []
      var nums = array.length
      var final = []
      for (var i = 0; i < nums; i++) {
            temp[i] = i
      }
      for (var i = nums, j = 0; i > 0; i--, j++) {
            var judge = Math.floor(Math.random() * i)
            result[j] = temp[judge]
            temp.splice(judge, 1)
      }

      for (var i = 0; i < result.length; i++) {
            final[i] = array[result[i]]
      }
      return final
}

var createSetting = function(data) { //创建设置按钮
      var pos = data.pos //参数为世界坐标位置
      var sound = data.sound //是否包含声音开关
      if (sound == null) {
            sound = true
      }
      var biaogeFun = data.biaogeFun //设置中如果有表格 则需要传入表格创建函数
      var tubiaoData = data.tubiaoData //设置中如果有图表 需要传入图表的初始化参数
      var tubiaoFun = data.tubiaoFun //设置中如果有自定义图表 需要传入自定义图标函数
      var ifCount = data.ifCount //是否包含计算器
      var nums = 0
      var perwidth = 110
      var height = 110
      var bound = 20
      var mix = 30
      var showtime = 0.3
      var father = data.father || CC_CURRENT_LAYER
      if (biaogeFun) {
            nums++
      }
      if (tubiaoData) {
            nums++
      }
      if (ifCount) {
            nums++
      }
      if (sound) {
            nums++
      }
      var size = cc.size(perwidth * nums + bound * 2, height)
      var rootpos = cc.p(size.width + mix, 0)
      var result = new ccui.ImageView(res.btn_set_normal)
      result.showIn = function() { //进场
            var self = this
            if (!self.show && !self.showing) {
                  self.loadTexture(res.btn_set_select)
                  if (!self.lay) {
                        self.lay = new ccui.Layout()
                        var lay = self.lay
                        lay.setContentSize(size)
                              //lay.setBackGroundColor(cc.color(255, 0, 0, 255))
                              //lay.setBackGroundColorOpacity(255)
                              //lay.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID)
                        lay.setClippingEnabled(true)
                        lay.setAnchorPoint(0, 0.5)
                        lay.setPosition(-size.width + mix, self.getContentSize().height / 2)
                        lay.setLocalZOrder(-1)
                        self.addChild(lay)
                        self.dialog = new cc.Scale9Sprite(res.img_box, cc.rect(0, 0, 82, 91), cc.rect(30, 20, 20, 50))
                        var dialog = self.dialog
                        dialog.width = size.width
                        dialog.height = size.height
                        dialog.setAnchorPoint(0, 0)
                        dialog.setPosition(rootpos)
                        lay.addChild(dialog)

                        var list = []

                        if (biaogeFun) {
                              list[list.length] = {
                                    normal: res.btn_biaoge_normal,
                                    select: res.btn_biaoge_select,
                                    fun: biaogeFun
                              }
                        }

                        if (tubiaoData) { //图表相关函数
                              list[list.length] = {
                                    normal: res.btn_tubiao_normal,
                                    select: res.btn_tubiao_select,
                                    fun: function() {
                                          var father = tubiaoData.father
                                          if (!father) {
                                                return
                                          }
                                          if (!father._tubiao) {
                                                father._tubiao = createTubiao(tubiaoData)
                                          }
                                          var node = father._tubiao
                                          if (!node.showing) {
                                                if (!node.show) {
                                                      node.in()
                                                } else {
                                                      node.out()
                                                }
                                          }
                                    }
                              }
                        }

                        if (tubiaoFun) {
                              list[list.length] = {
                                    normal: res.btn_tubiao_normal,
                                    select: res.btn_tubiao_select,
                                    fun: function() {
                                          if (tubiaoFun) {
                                                tubiaoFun()
                                          }
                                    }
                              }
                        }

                        if (ifCount) { //计算器相关
                              list[list.length] = {
                                    normal: res.btn_cal_normal,
                                    select: res.btn_cal_select,
                                    fun: function() {
                                          if (!father.COUNTER) {
                                                father.COUNTER = createCounter()
                                                father.addChild(father.COUNTER)
                                          }
                                          var node = father.COUNTER
                                          if (!node.act) {
                                                node.show()
                                          } else {
                                                node.close()
                                          }
                                    }
                              }
                        }

                        // list[list.length] = {
                        //       normal: res.btn_camare_normal,
                        //       select: res.btn_camare_select,
                        //       fun: null, //后续添加
                        // }
                        if (sound) { //声音开关
                              list[list.length] = {
                                    normal: res.btn_sound_on,
                                    select: res.btn_sound_off,
                                    fun: function(judge) {
                                          if (!judge) {
                                                if (MUSIC_VOL == null) {
                                                      MUSIC_VOL = cc.audioEngine.getMusicVolume()
                                                }
                                                if (EFFECT_VOL == null) {
                                                      EFFECT_VOL = cc.audioEngine.getEffectsVolume()
                                                }
                                          }
                                          IF_SOUND_ON = judge
                                          cc.audioEngine.setMusicVolume(IF_SOUND_ON ? MUSIC_VOL : 0)
                                          cc.audioEngine.setEffectsVolume(IF_SOUND_ON ? EFFECT_VOL : 0)
                                    }, //后续添加
                                    type: "check",
                                    init: !IF_SOUND_ON,
                                    scale: 0.8,
                              }
                        }

                        for (var i = 0; i < list.length; i++) {
                              var temp = list[i]
                              temp.type = temp.type || "btn"
                              var tempItem = null
                              var needfun = true
                              switch (temp.type) {
                                    case "btn":
                                          tempItem = new ccui.Button(temp.normal, temp.select)
                                          break
                                    case "check":
                                          needfun = false
                                          tempItem = createJudgeBtn({
                                                normal: temp.normal,
                                                select: temp.select,
                                                fun: function(item) {
                                                      if (item.fun) {
                                                            item.fun(false)
                                                      }
                                                },
                                                back: function(item) {
                                                      if (item.fun) {
                                                            item.fun(true)
                                                      }
                                                },
                                          })
                                          temp.init = temp.init
                                          if (temp.init == null) {
                                                temp.init = true
                                          }
                                          tempItem.change(temp.init, false)
                                          break
                              }
                              tempItem.setScale(temp.scale || 1)
                              tempItem.setAnchorPoint(0.5, 0.5)
                              tempItem.setPosition(bound + perwidth / 2 + perwidth * i, height / 2)
                              tempItem.fun = temp.fun
                              if (needfun) {
                                    tempItem.addClickEventListener(function(sender) {
                                          if (sender.fun) {
                                                sender.fun()
                                          }
                                    })
                              }
                              dialog.addChild(tempItem)
                        }
                  }
                  self.showing = true
                  addShowType({
                        item: self.dialog,
                        show: "moveTo",
                        time: showtime,
                        buf: cc.p(0, 0),
                        fun: function() {
                              self.showing = false
                        }
                  })
                  self.show = true
            }
      }
      result.showOut = function() { //退场
            var self = this
            if (self.dialog && self.show && !self.showing) {
                  self.loadTexture(res.btn_set_normal)
                  self.showing = true
                  self.show = false
                  addShowType({
                        item: self.dialog,
                        show: "moveTo",
                        time: showtime,
                        buf: rootpos,
                        fun: function() {
                              self.showing = false
                        }
                  })
            }
      }
      if (pos) {
            result.setPosition(pos)
      }
      createTouchEvent({
            item: result,
            end: function(data) {
                  var self = data.item
                  if (!self.showing) {
                        if (!self.show) {
                              self.showIn()
                        } else {
                              self.showOut()
                        }
                  }
            }
      })
      return result
}

var judgeIn = function(item, pos, modify) { //判定pos是否在经过modify之后的item中 pos为世界坐标
      modify = modify || cc.p(1, 1) //item的区域缩放
      if (modify.x < 1) {
            modify.x = 1
      }
      if (modify.y < 1) {
            modify.y = 1
      }
      pos = item.convertToNodeSpace(pos)
      var s = item.getContentSize()
      var rect = cc.rect((1 - modify.x) / 2 * s.width, (1 - modify.y) / 2 * s.height, s.width * modify.x, s.height * modify.y)
      return cc.rectContainsPoint(rect, pos)
}

var createTouchEvent = function(data) { //创建触摸监听函数
      var begin = data.begin //开始 移动 结束的监听 可以不传入 如果传入了begin需要在begin函数中进行返回 true可继续监听 false停止当次监听
      var move = data.move //三个监听函数的data中都包含 item pos 分别是触摸的对象和触摸的世界坐标 移动函数会传入delta 表示移动参数
      var end = data.end
      var beginfail = data.beginfail //开始失败的回调
      var item = data.item
      var rect = data.rect
      var force = data.force || false
      var touchX = data.touchX || 0
      var touchY = data.touchY || cc.winSize.height
      var autoMove = data.autoMove || false //true则不需要move函数亦可移动
      var swallow = data.swallow //是否吞噬触摸
      if (swallow != false) {
            swallow = true
      }
      if (item.removeListen) {
            item.removeListen()
            item.removeListen = null
      }
      if (item.setTouchEnabled) {
            item.setTouchEnabled(false)
      }
      var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: swallow,
            onTouchBegan: function(touch, event) {
                  var target = event.getCurrentTarget()
                  var touchpos = touch.getLocation()
                  if (touchpos.y < touchX || touchpos.y > touchY)
                        return false

                  var locationInNode = target.convertToNodeSpace(touchpos)
                  var s = target.getContentSize()
                  var inrect = rect || cc.rect(0, 0, s.width, s.height)
                  if (target.disLis) {
                        return false
                  }
                  if (cc.rectContainsPoint(inrect, locationInNode) || force) {
                        if (begin) {
                              var result = begin({
                                    item: target,
                                    pos: touch.getLocation()
                              })
                              if (result == null) {
                                    result = false
                              }
                              return result
                        }
                        return true;
                  } else {
                        if (beginfail) {
                              var result = beginfail({
                                    item: target,
                                    pos: touch.getLocation()
                              })
                              if (result == null) {
                                    result = false
                              }
                              return result
                        }

                        return false;
                  }

            },
            onTouchMoved: function(touch, event) {
                  var target = event.getCurrentTarget()
                  var delta = touch.getDelta()
                  if (move) {
                        move({
                              item: target,
                              pos: touch.getLocation(),
                              delta: delta,
                        })
                  } else {
                        if (autoMove) {
                              target.x += (delta.x / getLoopScale(target, true).x)
                              target.y += (delta.y / getLoopScale(target, true).y)
                        }
                  }
            },
            onTouchEnded: function(touch, event) {
                  var target = event.getCurrentTarget()
                  if (end) {
                        end({
                              item: target,
                              pos: touch.getLocation(),
                        })
                  }
            }
      })
      item.listener = listener
      item.disListen = function(judge) { //是否忽视监听
            if (judge == null) {
                  judge = true
            }
            var item = this
            item.disLis = judge
      }
      item.removeListen = function() { //取消监听 可外部调用
            if (this.listener) {
                  cc.eventManager.removeListener(this.listener)
                  this.listener = null
            }
      }
      cc.eventManager.addListener(listener, item)
}

var copyEvent = function(src, dest) { //复制src的监听到dest上
      if (src.listener) {
            cc.eventManager.addListener(src.listener.clone(), dest)
            if (!dest.removeListen && src.removeListen) {
                  dest.removeListen = src.removeListen
            }
      }
}

var getLoopScale = function(item, devide) { //回溯获取相对于窗口的最终缩放
      var scaleX = 1
      var scaleY = 1
      var temp = item
      devide = devide || false
      while (temp.getParent && temp.getParent()) {
            scaleX *= temp.getParent().getScaleX()
            scaleY *= temp.getParent().getScaleY()
            temp = temp.getParent()
      }
      if (devide) {
            return {
                  x: scaleX,
                  y: scaleY,
            }
      } else {
            if (scaleX != scaleY) {
                  cc.log("find scalex != scaley, if something wrong, please check")
            }
            return scaleX
      }
}

var addRotate = function(data) { //对指定item进行旋转测试 不应该出现在正式实验代码中
      var item = data.item
      var devide = data.devide || 1
      var time = data.time || 0.05
      createTouchEvent({
            item: item,
            begin: function(data) {
                  var item = data.item
                  item.key = getRandKey()
                  addTimer({
                        fun: function() {
                              item.setRotation(item.getRotationX() + devide)
                                    //cc.log(item.getRotationX())
                        },
                        time: time,
                        repeat: cc.REPEAT_FOREVER,
                        key: item.key,
                  })
                  return true
            },
            end: function(data) {
                  var item = data.item
                  removeTimer(item.key)
            }
      })
}

var addMoving = function(item, swallow, testflag) { //对目标对象添加触摸移动 testflag为true会不停打印坐标信息
      if (swallow == null) {
            swallow = true
      }
      var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: swallow,
            onTouchBegan: function(touch, event) {
                  var target = event.getCurrentTarget()
                  var locationInNode = target.convertToNodeSpace(touch.getLocation())
                  var s = target.getContentSize()
                  var rect = cc.rect(0, 0, s.width, s.height)
                  if (cc.rectContainsPoint(rect, locationInNode)) {
                        target.judgeScale = getLoopScale(target) || 1
                        if (item.changeSelfLocalZero)
                              item.changeSelfLocalZero()
                        return true;
                  }
                  return false;
            },
            onTouchMoved: function(touch, event) {
                  var target = event.getCurrentTarget()
                  var delta = touch.getDelta()
                  target.x += (delta.x / target.judgeScale)
                  target.y += (delta.y / target.judgeScale)
                  if (testflag) {
                        cc.log("x:", target.x, "y:", target.y)
                  }
            },
      })
      item.listener = listener1
      cc.eventManager.addListener(listener1, item);
}

var removeMoving = function(item) { //删除目标对象的触摸移动
      if (item.listener) {
            cc.eventManager.removeListener(item.listener)
            item.listener = null
      }
}

var createControlAni = function(data) { //创建可控action 目前提供暂停 前进 以及回退
      var frame = data.frame //frame字符串 类似 xxxx%02d.png
      var start = data.start || 1 //起始帧
      var end = data.end //结束帧
      var time = data.time //帧间隔
      var key = data.key || getRandKey() //对应的计时器标签
      var item = data.item || new cc.Sprite() //修改贴图的对象 传入new cc.Sprite()即可
      var index = data.beginIndex || 1 //创建后展示的第一帧
      var noframe = data.noframe || false
      var father = data.father
      var files = []
      for (var i = start; i <= end; i++) {
            if (!noframe) {
                  files[i] = sprintf(frame, i)
            } else {
                  files[i] = res[sprintf(frame, i)]
            }
      }
      var control = {
            item: item,
            tri: "stop",
            cur: index,
            start: start,
            targetIndex: null,
            end: end,
            fun: null,
      }
      control.changeSpeed = function(time) {
            removeTimer(key)
            control.act(time)
      }
      control.moveTo = function(index, fun) {
            control.tri = "moveTo"
            control.targetIndex = index
            control.fun = fun
      }
      control.changeStatus = function(statu, fun) {
            //statu包括back forward stop以及对应的到达起始帧或者最后一帧需要调用的函数 暂停不提供函数调用
            control.tri = statu
            control.fun = fun
      }
      control.show = function() {
            if (control.cur >= control.start) {
                  if (!noframe) {
                        item.setSpriteFrame(files[control.cur])
                  } else {
                        item.setTexture(files[control.cur])
                  }
            }
      }
      control.act = function(time) {
            addTimer({
                  fun: function() {
                        switch (control.tri) {
                              case "forward":
                                    if (control.cur <= control.end) {
                                          if (control.cur < control.start) {
                                                control.cur = control.start
                                          }
                                          if (files[control.cur]) {
                                                if (!noframe) {
                                                      item.setSpriteFrame(files[control.cur])
                                                } else {
                                                      item.setTexture(files[control.cur])
                                                }
                                          }
                                          control.cur++
                                    } else {
                                          if (control.fun) {
                                                control.fun()
                                                control.fun = null
                                          }
                                    }
                                    break
                              case "back":
                                    if (control.cur >= control.start) {
                                          if (control.cur > control.end) {
                                                control.cur = control.end
                                          }
                                          if (!noframe) {
                                                item.setSpriteFrame(files[control.cur])
                                          } else {
                                                item.setTexture(files[control.cur])
                                          }
                                          control.cur--
                                    } else {
                                          if (control.fun) {
                                                control.fun()
                                                control.fun = null
                                          }
                                    }
                                    break
                              case "stop":
                                    break
                              case "moveTo":
                                    if (!noframe) {
                                          item.setSpriteFrame(files[control.cur])
                                    } else {
                                          item.setTexture(files[control.cur])
                                    }
                                    if (control.cur > control.targetIndex) {
                                          control.cur--
                                    } else if (control.cur < control.targetIndex) {
                                          control.cur++
                                    } else {
                                          if (control.fun) {
                                                var tempFun = control.fun
                                                control.fun = null
                                                tempFun()
                                          }
                                    }
                                    break
                        }
                  },
                  delay: 0,
                  time: time,
                  repeat: cc.REPEAT_FOREVER,
                  key: key,
                  father: father,
            })
      }
      control.remove = function() {
            removeTimer(key)
      }
      control.act(time)
      return control
}

var getWorldPos = function(item) { //获取指定对象的世界坐标
      if (item.getParent) {
            var par = item.getParent()
            if (par) {
                  return par.convertToWorldSpace(item.getPosition())
            } else {
                  return item.getPosition()
            }
      } else {
            return item.getPosition()
      }
}

var judgeItemCrash = function(data) {
      var item1 = data.item1
      var item2 = data.item2
      var showTest = data.showTest || false
      var pos1 = get4Pos(item1)
      var pos2 = get4Pos(item2)
      if (showTest) {
            var layer = CC_CURRENT_LAYER
            if (layer) {
                  if (layer._drawTestNode) {
                        //layer._drawTestNode.clear()
                  } else {
                        var testNode = new cc.DrawNode()
                        testNode.setPosition(0, 0)
                        safeAdd(layer, testNode)
                        layer._drawTestNode = testNode
                  }
                  var testNode = layer._drawTestNode
                  testNode.drawRect(cc.p(pos1.left, pos1.bottom), cc.p(pos1.right, pos1.top), cc.color(0, 0, 0, 0), 1, cc.color(255, 0, 0, 255))
                  testNode.drawRect(cc.p(pos2.left, pos2.bottom), cc.p(pos2.right, pos2.top), cc.color(0, 0, 0, 0), 1, cc.color(0, 255, 0, 255))
            }
      }
      return judgeCrash(pos1, pos2, true)
}

var get4Pos = function(item, modify) { //获取指定对象的左上 左下 右上 右下的坐标。并偏移modify位置
      var result = {}
      modify = modify || cc.p(0, 0)
      var anchor = null
      if (item.getAnchorPoint) {
            anchor = item.getAnchorPoint()
      } else {
            anchor = cc.p(0.5, 0.5)
      }
      var size = item.getContentSize()
      var pos = getWorldPos(item)
      var scale1 = getLoopScale(item, true)
      var scale2 = {
            x: item.getScaleX(),
            y: item.getScaleY()
      }
      var scale = {
            x: scale1.x * scale2.x,
            y: scale1.y * scale2.y
      }
      var tl = pos.x - size.width * scale.x * anchor.x + modify.x
      var tr = pos.x + size.width * scale.x * (1 - anchor.x) + modify.x
      var tt = pos.y + size.height * scale.y * (1 - anchor.y) + modify.y
      var tb = pos.y - size.height * scale.y * anchor.y + modify.y
      result.left = tl < tr ? tl : tr
      result.right = tl < tr ? tr : tl
      result.bottom = tb < tt ? tb : tt
      result.top = tb < tt ? tt : tb
      return result
}

var judgeTouch = function(data) { //限制判定item是否在box区域内 出外会强制返回
      var box = data.box
      var item = data.item
      var pos = data.pos
      var judgex = false
      var judgey = false
      for (var i = 0; i < box.boxs.length; i++) {
            var cur = box.boxs[i]
            if (!judgex) {
                  var current = get4Pos(item, cc.p(pos.x, 0))
                  if (judgeCrash(current, cur, true)) {
                        judgex = true
                  }
            }
            if (!judgey) {
                  var current = get4Pos(item, cc.p(0, pos.y))
                  if (judgeCrash(current, cur, true)) {
                        judgey = true
                  }
            }
      }
      if (!judgex) {
            item.x += pos.x
      }
      if (!judgey) {
            item.y += pos.y
      }
      return judgey || judgex
}

var judgeCrash = function(src, dest, need) { //判定两个矩阵是否碰撞 need为是否回溯判定
      var maxax = src.right
      var maxay = src.top
      var minax = src.left
      var minay = src.bottom
      var maxbx = dest.right
      var maxby = dest.top
      var minbx = dest.left
      var minby = dest.bottom

      var result = !(maxax < minbx || maxbx < minax || maxay < minby || maxby < minay)
            //if(result){
            //cc.log(maxax, minbx, maxbx, minax, maxay, minby, maxby, minay)
            //}
      return result;


      need = need || false
      if (src.left > dest.left && src.left < dest.right) {
            if (src.bottom > dest.bottom && src.bottom < dest.top) {
                  return true
            }
            if (src.top > dest.bottom && src.top < dest.top) {
                  return true
            }
            if (src.top > dest.top && src.bottom < dest.bottom) {
                  return true
            }
      }
      if (src.right > dest.left && src.right < dest.right) {
            if (src.bottom > dest.bottom && src.bottom < dest.top) {
                  return true
            }
            if (src.top > dest.bottom && src.top < dest.top) {
                  return true
            }
            if (src.top > dest.top && src.bottom < dest.bottom) {
                  return true
            }
      }
      if (need) {
            return judgeCrash(dest, src)
      }
      return false
}

var createBoxs = function(data) { //根据传入矩阵 创建若干限制区域
      var boxs = data.boxs
      var op = data.op
      var node = new cc.Node()
      node.setPosition(0, 0)
      node.setAnchorPoint(0, 0)
      node.boxs = []
      for (var i = 0; i < boxs.length; i++) {
            var rect = boxs[i]
            var lay = createLayout({
                  pos: rect.pos,
                  size: rect.size,
                  op: op
            })
            lay.left = rect.pos.x
            lay.right = rect.pos.x + rect.size.width
            lay.top = rect.pos.y + rect.size.height
            lay.bottom = rect.pos.y
            node.boxs[i] = lay
            node.addChild(lay)
      }
      return node
}

var createLayout = function(data) { //根据参数创建指定layout
      var pos = data.pos || cc.p(0, 0)
      var size = data.size
      var op = data.op || 0
      var clip = data.clip || false
      var color = data.color || cc.color(255, 0, 0, 255)
      var lay = new ccui.Layout()
      lay.setBackGroundColor(color)
      lay.setBackGroundColorOpacity(op)
      lay.setContentSize(size) //resize
      lay.setPosition(pos)
      lay.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID)
            //lay.setTouchEnabled(true)
            //lay.setSwallowTouches(false)
      lay.setClippingEnabled(clip)
            //lay.setAnchorPoint(layoutAnchor)
      return lay
}

var createPageView = function(data) { //创建翻页效果
      data = data || {}
      var pix = data.pix || 10
      var files = data.files
      var fun = data.fun
      var devide = data.devide || 100
      var node = new cc.Node()
      var time = data.time || 0.1
      var names = data.names
      node.items = []
      node.setPosition(getMiddle())
      node.Stop = function() {
            for (var i = 0; i < this.items.length; i++) {
                  var item = this.items[i]
                  item.stopAllActions()
            }
      }
      node.Move = function(data) {
            var page = data.page
            var pox = data.pox
            var intime = data.time
            var self = this
            if (pox != null) {
                  for (var i = 0; i < self.items.length; i++) {
                        var item = self.items[i]
                        if (intime) {
                              addShowType({
                                    item: item,
                                    show: "moveBy",
                                    time: intime,
                                    buf: cc.p(pox, 0),
                                    fun: function() {
                                          self.changeOP()
                                          if (page != null) {
                                                self.curIndex = page
                                          }
                                    }
                              })
                        } else {
                              item.x += pox
                        }
                  }
            } else if (page != null) {
                  if (page < 0) {
                        page = 0
                  }
                  if (page >= self.items.length) {
                        page = self.items.length - 1
                  }
                  var item = self.items[page]
                  var dis = 0 - item.x
                  self.Move({
                        pox: dis,
                        time: time,
                        page: page
                  })
            }
      }
      node.getPage = function() {
            return this.curIndex
      }
      node.changeOP = function() {
            for (var i = 0; i < this.items.length; i++) {
                  var item = this.items[i]
                  if (i == this.curIndex) {
                        item.setOpacity(255)
                  } else {
                        item.setOpacity(127)
                  }
            }
      }
      node.curIndex = 0
      for (var i = 0; i < files.length; i++) {
            var back = new ccui.ImageView(res.img_exp_kuang)
            var item = new ccui.ImageView(files[i])
            var exp = new ccui.ImageView(res[sprintf("img_exp%d", i + 1)])
            exp.setPosition(50, 360)
            item.setAnchorPoint(cc.p(-0.1, -0.08))
            item.setLocalZOrder(-1)
            back.addChild(item)
            back.addChild(exp)
            back.setPosition(cc.p((back.getContentSize().width + devide) * i, 0))
            node.addChild(back)
            node.items[i] = back
            back.index = i
            back.setCascadeOpacityEnabled(true)
            if (names && names[i]) {
                  var lab = new cc.LabelTTF(names[i], "", 28)
                  lab.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER)
                  lab.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
                  lab.setColor(cc.color(0, 0, 0))
                  lab.setPosition(257, 360)
                  safeAdd(back, lab)
            }
      }
      var winSize = cc.director.getWinSize()
      var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                  var target = event.getCurrentTarget()
                  var rect = cc.rect(-winSize.width / 2, -200, winSize.width, 400)
                  var locationInNode = target.convertToNodeSpace(touch.getLocation())
                  if (cc.rectContainsPoint(rect, locationInNode)) {
                        node.Stop()
                        target.beginPox = touch.getLocation().x
                        return true
                  }
                  return false
            },
            onTouchMoved: function(touch, event) {
                  var target = event.getCurrentTarget()
                  var delta = touch.getDelta()
                  node.Move({
                        pox: delta.x //可能要自动修正 移出屏幕的情况
                  })
            },
            onTouchEnded: function(touch, event) {
                  var target = event.getCurrentTarget()
                  var temp = touch.getLocation().x
                  if (temp - target.beginPox > pix) {
                        node.Move({
                              page: node.curIndex - 1
                        })
                  } else if (target.beginPox - temp > pix) {
                        node.Move({
                              page: node.curIndex + 1
                        })
                  } else {
                        for (var i = 0; i < node.items.length; i++) {
                              var current = node.items[i]
                              var locationInNode = current.convertToNodeSpace(touch.getLocation())
                              var s = current.getContentSize()
                              var rect = cc.rect(0, 0, s.width, s.height)
                              if (cc.rectContainsPoint(rect, locationInNode)) {
                                    if (node.curIndex == current.index) {
                                          if (fun) {
                                                fun(current.index)
                                          }
                                    } else {
                                          node.Move({
                                                page: current.index
                                          })
                                    }
                              }
                        }
                  }
            }
      })
      cc.eventManager.addListener(listener1, node)
      node.setCascadeOpacityEnabled(true)
      node.changeOP()
      return node
}


var createChoseExp = function(data) { //创建实验窗口排布
      var files = data.files || []
      var fun = data.fun
      var devide = data.devide || 100
      var winX = cc.winSize.width
      var winY = cc.winSize.height
      var itemLen = winX - 2 * devide
      var names = data.names

      var node = new cc.Node()
      node.items = []
      var datainfo = [{
            scale: 1,
            posList: [cc.p(0, -40)]
      }, {
            scale: 0.8,
            posList: [cc.p(-220, -40), cc.p(252, -40)]
      }, {
            scale: 0.72,
            posList: [cc.p(-348, -30), cc.p(10, -30), cc.p(360, -30)]
      }, {
            scale: 0.6,
            posList: [cc.p(-204, 96), cc.p(197, 80),
                  cc.p(-204, -178), cc.p(197, -178)
            ]
      }, {
            scale: 0.6,
            posList: [cc.p(-272, 80), cc.p(272, 80),
                  cc.p(-272, -180), cc.p(272, -180), cc.p(1, -58)
            ]
      }, {
            scale: 0.6,
            posList: [cc.p(-333, 123), cc.p(4, 123), cc.p(342, 123),
                  cc.p(-333, -152), cc.p(4, -152), cc.p(342, -152)
            ]
      }]

      for (var i = 0; i < files.length; i++) {
            var back = new ccui.ImageView(res.img_exp_kuang)
            var item = new ccui.ImageView(files[i])
            var iteminfo = datainfo[files.length - 1]
            var exp = new ccui.ImageView(res[sprintf("img_exp%d", i + 1)])
            exp.setPosition(50, 360)
            item.setAnchorPoint(cc.p(-0.1, -0.08))
            item.setLocalZOrder(-1)
            back.addChild(item)
            back.addChild(exp)
            back.index = i
            back.setScale(iteminfo.scale)
            back.setPosition(winX / 2 + iteminfo.posList[i].x, winY / 2 + iteminfo.posList[i].y)
            createTouchEvent({
                  item: back,
                  begin: function(data) {
                        if (fun) {
                              fun(data.item.index)
                              return true
                        }
                        return false
                  }
            })
            node.addChild(back)
            node.items[i] = back
            back.setCascadeOpacityEnabled(true)
            if (names && names[i]) {
                  var lab = new cc.LabelTTF(names[i], "", 28)
                  lab.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER)
                  lab.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
                  lab.setColor(cc.color(0, 0, 0))
                  lab.setPosition(257, 360)
                  safeAdd(back, lab)
            }
      }
      node.setCascadeOpacityEnabled(true)
      return node
}

var getZq = function(data) { //创建蒸汽
      var pos = data.pos
      var father = data.father
      var devide = data.devide || 30
      var scale = data.scale || 1
      var node = new cc.Node()
      var data = [{
            name: "left",
            end: 11,
            pos: cc.p(-devide, 0)
      }, {
            name: "middle",
            end: 11,
            pos: cc.p(0, -10)
      }, {
            name: "right",
            end: 11,
            pos: cc.p(devide, 0)
      }, ]
      loadPlist("zq")
      for (var i = 0; i < data.length; i++) {
            var item = data[i]
            var sp = new cc.Sprite(sprintf("#zq_%s01.png", item.name))
            var ani = cc.repeatForever(createAnimation({
                  frame: sprintf("zq_%s%%02d.png", item.name),
                  end: item.end,
                  time: 0.15,
            }))
            sp.runAction(ani)
            sp.setPosition(item.pos)
            node.addChild(sp)
      }
      if (pos) {
            node.setPosition(pos)
      }
      if (father) {
            father.addChild(node)
      }
      node.setScale(scale)
      return node
}

var createTool = function(data) { //创建工具箱
      var files = data.files //图片列表
      var ifFrame = data.ifFrame || false //是否是plist里面的图片
      var imgType = ifFrame ? ccui.Widget.PLIST_TEXTURE : ccui.Widget.LOCAL_TEXTURE
      var pos = data.pos
      var tri = data.tri //方向
      var showTime = data.showTime || 0.3
      var moveTime = data.moveTime || 0.1
      var gets = data.gets || data.files
      var fileAnchor = data.fileAnchor || cc.p(0.5, 0.5)
      fileAnchor = judgeList({
            src: fileAnchor,
            dest: cc.p(0.5, 0.5),
            nums: files.length,
      })
      var grays = data.grays || data.files
      var nums = data.nums //弹出个数
      var arrow = data.arrow || false //是否有箭头
      var modify = data.modify || cc.p(1, 1) //工具大小修正
      var itempos = data.itempos //工具位置修正
      itempos = judgeList({
            src: itempos,
            dest: cc.p(0, 0),
            nums: files.length,
      })
      var circlepos = data.circlepos || cc.p(0, 0)
      circlepos = judgeList({
            src: circlepos,
            dest: cc.p(0, 0),
            nums: files.length,
      })
      var devide = data.devide || cc.p(1, 1) //工具间距
      var scale = data.scale || 1 //整体缩放
      var swallow = data.swallow || []
      var allItemTouch = data.allItemTouch || []
      var father = data.father //图片拖出来后的父节点
      var outfun = data.outfun //释放操作
      var clickfun = data.clickfun //拖出后的点击操作
      var firstClick = data.firstClick //第一次点击后操作
      var judgefun = data.judge //第一次点击前判断
      var backfun = data.backfun //拖回工具箱的判定操作
      var reTouch = data.reTouch //当已经取出并且没次数的时候重新点击的判定
      var beginfail = data.beginfail //失败回调
      var movefun = data.movefun //自定义移动
      var ifcircle = data.ifcircle || false
      var counts = data.counts //代表每个item能被取出的次数
      var myrect = data.myrect //触摸区域
      var rectList = data.rectList || []
      var afterClick = data.afterClick
      var circleScale = data.circleScale || 1
      var itemScale = data.itemScale
      var fileSort = []
      for (var i = 0; i < files.length; i++) {
            fileSort[i] = i
      }
      itemScale = judgeList({
            src: itemScale,
            dest: 1,
            nums: files.length,
      })
      allItemTouch = judgeList({
            src: allItemTouch,
            dest: true,
            nums: files.length,
      })
      if (!counts) {
            counts = []
            for (var i = 0; i < files.length; i++) {
                  counts[i] = 1
            }
      }
      if (myrect) {
            for (var i = 0; i < files.length; i++) {
                  rectList[i] = myrect
            }
      }
      if (rectList.length <= 0) {
            for (var i = 0; i < files.length; i++) {
                  rectList[i] = null
            }
      }
      var judgeCounts = counts
      var btn = new ccui.ImageView(res.btn_gjx_normal)
      var btnsize = btn.getContentSize()
      btn.dataControl = {}
      btn.fileSort = fileSort
      var dataControl = btn.dataControl
      btn.setPosition(pos)
      btn.counts = counts
      if (nums < files.length) {
            arrow = true
      }
      var length = files.length
      var maxPage = Math.floor(length / nums) - (length % nums == 0 ? 1 : 0)
      dataControl.nums = nums
      dataControl.moveIndex = 0
      btn.changeSort = function(sort) {
            if (sort == null) {
                  var temp = []
                  for (var i = 0; i < files.length; i++) {
                        temp[i] = i
                  }
                  btn.fileSort = temp
            } else {
                  btn.fileSort = sort
            }
            var listview = dataControl.listview
            if (listview) {
                  var itemArr = listview.itemArr
                  if (itemArr) {
                        var result = dataControl.getPos()
                        for (var i = 0; i < btn.fileSort.length; i++) {
                              var index = btn.fileSort[i]
                              var item = itemArr[index].item
                              var circle = itemArr[index].circle
                              var info = result[i]

                              item.setPosition(info.itemPos)
                              circle.setPosition(info.circlePos)
                        }
                  }
                  listview.curPage = 0
                  dataControl.moveIndex = 0
                  listview.judgeArrow()
            }
      }
      btn.inItem = function(index, item) {
            counts[index]--
                  var dataControl = this.dataControl
            if (!dataControl[sprintf("getItem%d", index)]) {
                  dataControl[sprintf("getItem%d", index)] = []
            }
            var list = dataControl[sprintf("getItem%d", index)]
            list[list.length] = item
            if (counts[index] == 0) {
                  if (btn.listview) {
                        btn.listview.changeView(index, true)
                  }
            }
      }
      btn.setViewOp = function(index){
            swallow[index] = true
            allItemTouch[index] = false
            if (btn.listview) {
                  btn.listview.changeView(index, true)
            }
      }
      btn.outItem = function(index, item) {
            var dataControl = this.dataControl
            var list = dataControl[sprintf("getItem%d", index)]
            if (!list) {
                  cc.log("some thing wrong, please check!!")
            } else {
                  for (var i = 0; i < list.length; i++) {
                        if (item == list[i]) {
                              list.splice(i, 1)
                              counts[index]++
                                    break
                        }
                  }
                  if (list.length == 0) {
                        dataControl[sprintf("getItem%d", index)] = null
                  }
            }
            
      }
      btn.judgeItem = function(index, item) {
            var dataControl = this.dataControl
            var list = dataControl[sprintf("getItem%d", index)]
            if (!list) {
                  return false
            } else {
                  for (var i = 0; i < list.length; i++) {
                        if (item == list[i]) {
                              return true
                        }
                  }
            }
            return false
      }
      btn.getindex = function(index) {
            var itemlist = dataControl[sprintf("getItem%d", index)]
            if (itemlist && counts[index] == 0) {
                  if (itemlist.length == 1) {
                        return itemlist[0]
                  }
            }
            return itemlist
      }
      btn.setAllUse = function(judge) {
            var btn = this
            judge = judge || false
            var listview = btn.listview
            if (listview && listview.changeAll) {
                  listview.changeAll(judge)
            }
      }
      var touchEvent = function(sender) {
            if (!dataControl.layout) {
                  var btn_size = sender.getContentSize()
                  var sp_arrow = new ccui.Button(res.btn_arrow_normal, res.btn_arrow_select)
                  var arrow_size = sp_arrow.getContentSize()
                  if (!arrow) {
                        arrow_size = cc.size(0, 0)
                  }
                  var circle = new cc.Sprite(res.img_circle_normal)
                  var circle_size = circle.getContentSize()
                  var width = (circle_size.width * devide.x * nums + arrow_size.width * 2) * modify.x
                  var height = (circle_size.height * devide.y) * modify.y
                  var beginwidth = circle_size.width * devide.x / 2
                  var beginheight = height / 2
                  var op = 0
                  var color = cc.color(255, 0, 0, 255)
                  var layout = new ccui.Layout()
                  if (scale) {
                        layout.setScale(scale)
                  }
                  var finalsize = null
                  var posmodify = null
                  var distance = null
                  var distanpar = 1.1
                  var layoutAnchor = null
                  var arrowModify = null
                  var circleStartPos = null
                  var circleMoveDis = null
                  var innerSize = null
                  var listPos = null
                  var judgeRect = null
                  var judgeTri = null
                  var aim = null
                  switch (tri) {
                        case "up":
                              finalsize = cc.size(height, width)
                              posmodify = cc.p(-finalsize.width * scale / 2 + btnsize.width / 2, btn_size.height)
                              distance = cc.p(0, -width * distanpar)
                              layoutAnchor = cc.p(0, 0)
                              arrowModify = {
                                    angle: [-90, 90], //下 上
                                    pos: [cc.p(0.5 * height, arrow_size.width / 2), cc.p(0.5 * height, width - arrow_size.width / 2)]
                              }
                              circleStartPos = cc.p(beginheight, beginwidth)
                              circleMoveDis = cc.p(0, circle_size.width * devide.x)
                              innerSize = cc.size(circle_size.width * devide.y * modify.y, nums * circle_size.height * devide.x * modify.x)
                              judgeRect = cc.size(innerSize.width, innerSize.height / nums)
                              listPos = cc.p(0, arrow_size.width)
                              judgeTri = "H"
                              aim = 90
                              break
                        case "down":
                              finalsize = cc.size(height, width)
                              posmodify = cc.p(-finalsize.width * scale / 2 + btnsize.width / 2, 0)
                              distance = cc.p(0, width * distanpar)
                              layoutAnchor = cc.p(0, 1)
                              arrowModify = {
                                    angle: [-90, 90], //下 上
                                    pos: [cc.p(0.5 * height, arrow_size.width / 2), cc.p(0.5 * height, width - arrow_size.width / 2)]
                              }
                              circleStartPos = cc.p(beginheight, beginwidth + (nums - 1) * circle_size.width * devide.x)
                              circleMoveDis = cc.p(0, -circle_size.width * devide.x)
                              innerSize = cc.size(circle_size.width * devide.y * modify.y, nums * circle_size.height * devide.x * modify.x)
                              listPos = cc.p(0, arrow_size.width)
                              judgeRect = cc.size(innerSize.width, innerSize.height / nums)
                              judgeTri = "H"
                              aim = 90
                              break
                        case "left":
                              finalsize = cc.size(width, height)
                              posmodify = cc.p(0, -finalsize.height * scale / 2 + btnsize.height / 2)
                              distance = cc.p(width * distanpar, 0)
                              layoutAnchor = cc.p(1, 0)
                              arrowModify = {
                                    angle: [0, 180], //左 右
                                    pos: [cc.p(arrow_size.width / 2, 0.5 * height), cc.p(width - arrow_size.width / 2, 0.5 * height)]
                              }
                              innerSize = cc.size(nums * circle_size.width * devide.x * modify.x, circle_size.height * devide.y * modify.y)
                              circleStartPos = cc.p(beginwidth + (nums - 1) * circle_size.width * devide.x, beginheight)
                              circleMoveDis = cc.p(-circle_size.width * devide.x, 0)
                              listPos = cc.p(arrow_size.width, 0)
                              judgeRect = cc.size(innerSize.width / nums, innerSize.height)
                              judgeTri = "W"
                              aim = 0
                              break
                        case "right":
                              finalsize = cc.size(width, height)
                              posmodify = cc.p(btn_size.width, -finalsize.height * scale / 2 + btnsize.height / 2)
                              distance = cc.p(-width * distanpar, 0)
                              layoutAnchor = cc.p(0, 0)
                              arrowModify = {
                                    angle: [0, 180], //左 右
                                    pos: [cc.p(arrow_size.width / 2, 0.5 * height), cc.p(width - arrow_size.width / 2, 0.5 * height)]
                              }
                              circleStartPos = cc.p(beginwidth, beginheight)
                              circleMoveDis = cc.p(circle_size.width * devide.x, 0)
                              innerSize = cc.size(nums * circle_size.width * devide.x * modify.x, circle_size.height * devide.y * modify.y)
                              listPos = cc.p(arrow_size.width, 0)
                              judgeRect = cc.size(innerSize.width / nums, innerSize.height)
                              judgeTri = "W"
                              aim = 0
                              break
                        default:
                              cc.log("Error! no tri in data")
                              break
                  }
                  dataControl.circleMoveDis = circleMoveDis
                  layout.setBackGroundColor(color)
                  layout.setBackGroundColorOpacity(op)
                  layout.setContentSize(finalsize) //resize
                  layout.setPosition(posmodify)
                  layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID)
                  layout.setTouchEnabled(true)
                  layout.setSwallowTouches(false)
                  layout.setClippingEnabled(true)
                  layout.setAnchorPoint(layoutAnchor)

                  dataControl.toolbg = new ccui.Scale9Sprite(res.bg_gjx, cc.rect(0, 0, 93, 80), cc.rect(20, 60, 60, 10))
                  var bg = dataControl.toolbg
                  btn.bg = bg

                  bg.setContentSize(finalsize)
                  bg.setAnchorPoint(cc.p(0, 0))

                  bg.setPosition(distance) //recode
                  dataControl.moveModify = distance



                  if (arrowModify && arrow) {
                        for (var i = 0; i < 2; i++) {
                              var sp_arrow = new ccui.Button(res.btn_arrow_normal, res.btn_arrow_select)
                              sp_arrow.setRotation(arrowModify.angle[i])
                              sp_arrow.setPosition(arrowModify.pos[i])
                              switch (tri) {
                                    case "up":
                                    case "down":
                                          sp_arrow.tri = i == 0 ? -1 : 1
                                          break
                                    case "right":
                                    case "left":
                                          sp_arrow.tri = i == 0 ? 1 : -1
                                          break
                              }

                              if (!dataControl.arrow) {
                                    dataControl.arrow = []
                              }
                              dataControl.arrow[i] = sp_arrow
                              bg.addChild(sp_arrow)

                              sp_arrow.addClickEventListener(function() {
                                    var arrow = this
                                    if (dataControl.listview) {
                                          dataControl.listview.move(arrow.tri)
                                    }
                              })
                        }
                  }
                  dataControl.getPos = function() {
                        var fileSort = btn.fileSort
                        var nums = files.length
                        var result = []
                        var startPos = circleStartPos
                        var moveDis = circleMoveDis
                        for (var i = 0; i < nums; i++) {
                              var temp = {}
                              var judge = fileSort[i]
                              var tempPos = itempos[judge] || cc.p(0, 0)
                              var tempCircle = circlepos[judge] || cc.p(0, 0)
                              var itemPos = cc.p(startPos.x + tempPos.x, startPos.y + tempPos.y)
                              var circlePos = cc.p(startPos.x + tempCircle.x, startPos.y + tempCircle.y)
                              startPos = cc.p(startPos.x + moveDis.x, startPos.y + moveDis.y)
                              temp.itemPos = itemPos
                              temp.circlePos = circlePos
                              result[i] = temp
                        }
                        //cc.log(result)
                        return result
                  }
                  if (!dataControl.listview) {
                        dataControl.listview = createLayout({
                              pos: listPos,
                              size: innerSize,
                              op: 0,
                        })
                        var listview = dataControl.listview
                        listview.setClippingEnabled(true)
                        listview.judgeTri = judgeTri
                        var inPosList = dataControl.getPos()
                        for (var i = 0; i < files.length; i++) {
                              var item = new ccui.ImageView(files[i], imgType)
                              var circle = new ccui.ImageView(res.img_circle_normal)
                              var info = inPosList[i]

                              item.setPosition(info.itemPos)
                              item.setAnchorPoint(fileAnchor[i])
                              circle.setPosition(info.circlePos)
                              listview.addChild(circle)
                              listview.addChild(item)
                              circle.setScale(circleScale)
                              var tempScale = itemScale[i] || 1
                              item.setScale(tempScale)
                              if (!ifcircle) {
                                    circle.setVisible(false)
                              }
                              if (!listview.itemArr) {
                                    listview.itemArr = []
                              }
                              listview.itemArr[i] = {
                                    item: item,
                                    circle: circle,
                              }
                        }
                        listview.move = function(tri) {
                              var listview = this
                              var judge = listview.curPage - tri
                              if (!dataControl.Arrowing && listview.itemArr && arrow && judge >= 0 && judge <= maxPage) {
                                    listview.curPage = judge
                                    dataControl.Arrowing = true
                                    var arr = listview.itemArr
                                    var movecount = 0
                                    for (var i = 0; i < arr.length; i++) {
                                          var item = arr[i]
                                          var movepos = cc.p(dataControl.circleMoveDis.x * dataControl.nums * tri,
                                                dataControl.circleMoveDis.y * dataControl.nums * tri)
                                          movecount = movecount + 1
                                          var fun = function() {
                                                movecount = movecount - 1
                                                if (movecount == 0) {
                                                      dataControl.listview.judgeArrow(function() {
                                                            addTimer({
                                                                  fun: function() {
                                                                        dataControl.moveIndex = dataControl.moveIndex - dataControl.nums * tri
                                                                        dataControl.Arrowing = false
                                                                        removeTimer("ARROWING")
                                                                  },
                                                                  time: 0.05,
                                                                  key: "ARROWING",
                                                                  delay: 0.05,
                                                            })
                                                      })
                                                }
                                          }
                                          addShowType({
                                                item: item.item,
                                                show: "moveBy",
                                                time: moveTime,
                                                buf: movepos,
                                                fun: fun
                                          })
                                          addShowType({
                                                item: item.circle,
                                                show: "moveBy",
                                                time: moveTime,
                                                buf: movepos,
                                                fun: fun
                                          })
                                    }
                              }
                        }
                        listview.judgeArrow = function(fun) {
                              var first = false
                              var second = false
                              if (arrowModify && arrow) {
                                    if (this.itemArr) {
                                          var itembegin = this.itemArr[0].item
                                          var itemend = this.itemArr[this.itemArr.length - 1].item
                                          switch (tri) {
                                                case "up":
                                                case "down":
                                                      first = listview.curPage == 0
                                                      second = listview.curPage == maxPage
                                                      break
                                                case "right":
                                                case "left":
                                                      second = listview.curPage == 0
                                                      first = listview.curPage == maxPage
                                                      break
                                          }
                                    }
                              } else {
                                    first = false
                                    second = false
                              }
                              if (dataControl.arrow) {
                                    dataControl.arrow[0].setVisible(!second)
                                    dataControl.arrow[1].setVisible(!first)
                              }
                              if (fun) {
                                    fun()
                              }
                        }
                        listview.changeAll = function(judge) {
                              var view = this
                              judge = judge || false
                              view.disTouch = !judge
                              for (var i = 0; i < view.itemArr.length; i++) {
                                    if (counts[i] == 0) {
                                          listview.changeView(i, true)
                                    } else {
                                          if (!judge) {
                                                listview.changeView(i, true)
                                          } else {
                                                listview.changeView(i, false)
                                          }
                                    }
                              }
                        }
                        listview.changeView = function(index, ifgray) {
                              if (this.itemArr) {
                                    if (this.itemArr[index]) {
                                          var item = this.itemArr[index]
                                          var color = null
                                          if (!ifgray) {
                                                allItemTouch[index] = true
                                                item.circle.setOpacity(255) 
                                                item.item.setOpacity(255)
                                                
                                          } else {
                                                item.circle.setOpacity(80)
                                                item.item.setOpacity(80)
                                          }
                                    }
                              }
                        }
                        listview.curPage = 0
                        listview.judgeArrow()
                        var judgeBack = function(touch, item) {
                              var locationInNode = listview.convertToNodeSpace(touch)
                              var s = listview.getContentSize()
                              var rect = cc.rect(0, 0, s.width, s.height)
                              if (cc.rectContainsPoint(rect, locationInNode) && dataControl.showing) {
                                    if (!(btn.judgeItem(item.index, item))) {
                                          cc.log("something wrong......please check")
                                    } else {
                                          if (backfun) {
                                                var temp_judge = backfun({
                                                      sp: item,
                                                      index: item.index,
                                                      pos: touch
                                                })
                                                if (temp_judge == "back") {
                                                      item.forceBack(false)
                                                      return
                                                }
                                                if (!temp_judge) {
                                                      return
                                                }
                                          }
                                          btn.outItem(item.index, item)
                                          listview.changeView(item.index, false)
                                          item.removeFromParent(true)
                                    }
                              } else {
                                    if (outfun) {
                                          outfun({
                                                sp: item,
                                                index: item.index,
                                                pos: touch
                                          })
                                    }
                              }
                        }
                        btn.judgeBack = judgeBack
                        createMoveRotate({
                              item: listview,
                              aim: aim,
                        })
                        var getSp = function(data) {
                              var pos = data.pos
                              var final = data.final || pos
                              var locationInNode = listview.convertToNodeSpace(pos)
                              var s = listview.getContentSize()
                              var rect = cc.rect(0, 0, s.width, s.height)
                              var targetIndex = null
                              if (cc.rectContainsPoint(rect, locationInNode)) {
                                    switch (tri) {
                                          case "up":
                                                targetIndex = Math.floor(locationInNode.y / judgeRect.height) + dataControl.moveIndex
                                                break
                                          case "down":
                                                targetIndex = (nums - 1 - Math.floor(locationInNode.y / judgeRect.height) + dataControl.moveIndex)
                                                break
                                          case "right":
                                                targetIndex = Math.floor(locationInNode.x / judgeRect.width) + dataControl.moveIndex
                                                break
                                          case "left":
                                                targetIndex = nums - 1 - Math.floor(locationInNode.x / judgeRect.width) + dataControl.moveIndex
                                                break
                                    }
                                    targetIndex = btn.fileSort[targetIndex]
                                    if (judgefun) {
                                          if (!judgefun(targetIndex)) {
                                                return false
                                          }
                                    }
                                    if (father) {
                                          //cc.log(counts, targetIndex)
                                          if (counts[targetIndex] > 0 && allItemTouch[targetIndex]) { //此处获取图片
                                                var temp = null
                                                var noget = false
                                                if (!gets[targetIndex]) {
                                                      if (firstClick) {
                                                            noget = true
                                                            temp = firstClick({
                                                                  index: targetIndex,
                                                                  pos: pos,
                                                                  sp: null,
                                                            })
                                                      }
                                                } else {
                                                      if (gets[targetIndex] == files[targetIndex]) {
                                                            temp = new ccui.ImageView(gets[targetIndex], imgType)
                                                      } else {
                                                            temp = new cc.Sprite(gets[targetIndex])
                                                      }
                                                }
                                                if (!temp) {
                                                      return false
                                                }
                                                temp.forceBack = function(judge) {
                                                      listview.changeView(this.index, false)
                                                      if(judge != "delay"){
                                                            btn.outItem(this.index, this)
                                                            if (judge != null) {
                                                                  this.setVisible(judge)
                                                            } else {
                                                                  this.removeFromParent(true)
                                                            }   
                                                      }else{
                                                            cc.log("in delay")
                                                            this.setVisible(false)
                                                            this.setPosition(-1000,0)
                                                            // var inself = this
                                                            // this.runAction(cc.sequence(
                                                            //     cc.delayTime(1),
                                                            //     cc.callFunc(function(){
                                                            //       cc.log("remove node")
                                                            //       inself.removeFromParent(true)                                                                  
                                                            //     })
                                                            // )) 
                                                      }
                                                }
                                                temp.disMove = function(judge) {
                                                            this.noMove = judge
                                                      }
                                                      //temp.disMove(false)
                                                temp.index = targetIndex
                                                if (firstClick && !noget) {
                                                      if (!firstClick({
                                                                  sp: temp,
                                                                  index: temp.index,
                                                                  pos: pos
                                                            })) {
                                                            return false
                                                      }
                                                }
                                                if (!temp.nopos) { //自定义创建位置
                                                      temp.setPosition(father.convertToNodeSpace(final))
                                                }
                                                if (!temp.getParent()) {
                                                      father.addChild(temp)
                                                }
                                                if (afterClick) {
                                                      afterClick({
                                                            sp: temp,
                                                            index: temp.index
                                                      })
                                                }
                                                btn.inItem(targetIndex, temp)
                                                dataControl.canItemMove = true
                                                dataControl.curMoveItem = temp
                                                      //turn gray
                                                if (counts[targetIndex] == 0) {
                                                      listview.changeView(targetIndex, true)
                                                }
                                                var tempSwallow = true
                                                if (swallow[targetIndex] != null) {
                                                      tempSwallow = swallow[targetIndex]
                                                }
                                                if (!temp.noEvent) {
                                                      createTouchEvent({
                                                            item: temp,
                                                            swallow: tempSwallow,
                                                            rect: rectList[targetIndex],
                                                            beginfail: function(data) {
                                                                  if (beginfail) {
                                                                        return beginfail({
                                                                              sp: data.item,
                                                                              pos: data.pos,
                                                                              index: data.item.index,
                                                                        })
                                                                  }
                                                                  return false
                                                            },
                                                            begin: function(data) {
                                                                  var target = data.item
                                                                  var pos = data.pos
                                                                  if (target.opJudge) {
                                                                        //像素判定参数
                                                                        var result = judgeOpInPos(data)
                                                                        if (!result) {
                                                                              return false
                                                                        }
                                                                  }
                                                                  if (clickfun) {
                                                                        return clickfun({
                                                                              sp: target,
                                                                              index: target.index,
                                                                              pos: pos,
                                                                        })
                                                                  } else {
                                                                        return true
                                                                  }
                                                            },
                                                            move: function(data) {
                                                                  var target = data.item
                                                                  var pos = data.pos
                                                                  var delta = data.delta
                                                                  if (!target.noMove) {
                                                                        if (movefun) {
                                                                              movefun({
                                                                                    sp: target,
                                                                                    pos: pos,
                                                                                    delta: delta,
                                                                                    index: target.index,
                                                                              })
                                                                        } else {
                                                                              target.x += delta.x
                                                                              target.y += delta.y
                                                                        }
                                                                  }
                                                            },
                                                            end: function(data) {
                                                                  var item = data.item
                                                                  var pos = data.pos
                                                                  judgeBack(pos, item)
                                                            }
                                                      })
                                                }
                                          } else {
                                                if (reTouch) {
                                                      dataControl.curMoveItem = reTouch({
                                                            pos: pos,
                                                            index: targetIndex,
                                                            sp: btn.getindex(targetIndex),
                                                      })
                                                } else {
                                                      dataControl.canItemMove = false
                                                }
                                          }
                                    } else {
                                          dataControl.canItemMove = false
                                    }
                                    return dataControl.curMoveItem
                              }
                              return null
                        }
                        createTouchEvent({
                              item: listview,
                              begin: function(data) {
                                    var item = data.item
                                    var pos = data.pos
                                    if (listview.disTouch) {
                                          return false
                                    }
                                    item.finishAct = false
                                    if (!dataControl.Arrowing && !dataControl.Moving && dataControl.showing) {
                                          item.listenRotate(pos)
                                          if (!arrow) {
                                                var sp = getSp({
                                                      pos: item.startPos,
                                                      final: pos,
                                                })
                                                item.select = sp
                                                item.finishAct = true
                                          }
                                          return true
                                    }
                                    return false
                              },
                              move: function(data) {
                                    var target = data.item
                                    var pos = data.pos
                                    var delta = data.delta
                                    var tri = target.getAngle(pos)
                                    var dis = target.getDis(pos)
                                    var mix = 20
                                    if (dataControl.canItemMove && dataControl.curMoveItem && target.select) {
                                          var item = target.select
                                          if (!item.noMove) {
                                                if (movefun) {
                                                      movefun({
                                                            sp: item,
                                                            pos: pos,
                                                            delta: delta,
                                                            index: item.index,
                                                      })
                                                } else {
                                                      item.x += delta.x / getLoopScale(item)
                                                      item.y += delta.y / getLoopScale(item)
                                                }
                                          }
                                    }

                                    if (!target.judge) {
                                          if (dis >= mix && (tri == "down" || tri == "up")) {
                                                target.judge = true
                                                if (!target.select && !target.finishAct) {
                                                      sp = getSp({
                                                            pos: target.startPos,
                                                            final: pos,
                                                      })
                                                      target.select = sp
                                                      target.finishAct = true
                                                }
                                          }
                                          if (dis >= mix && (tri == "left" || tri == "right")) {
                                                target.judge = true
                                                target.tri = tri
                                          }
                                    } else {
                                          if (!target.select && !target.tri && !target.finishAct) {
                                                sp = getSp({
                                                      pos: target.startPos,
                                                      final: pos,
                                                })
                                                target.select = sp
                                                target.finishAct = true
                                          }
                                    }
                              },
                              end: function(data) {
                                    var pos = data.pos
                                    var item = data.item
                                    if (item.select && dataControl.canItemMove && dataControl.curMoveItem) {
                                          judgeBack(pos, dataControl.curMoveItem)
                                          item.select = null
                                    } else {
                                          var tempJudge = 1
                                          if (tri == "down" || tri == "up") {
                                                tempJudge = -1
                                          }
                                          switch (item.tri) {
                                                case "left":
                                                      item.move(-1 * tempJudge)
                                                      break
                                                case "right":
                                                      item.move(1 * tempJudge)
                                                      break
                                          }
                                    }
                              }
                        })
                        bg.addChild(listview)
                        btn.listview = listview
                        listview.curPage = 0
                  }

                  layout.addChild(bg)
                  sender.addChild(layout)
                  dataControl.layout = layout
            }
            if (!dataControl.Moving) {
                  dataControl.Moving = true
                  if (!dataControl.showing) {
                        btn.loadTexture(res.btn_gjx_select)
                        addShowType({
                              item: dataControl.toolbg,
                              show: "moveTo",
                              time: showTime,
                              buf: cc.p(0, 0),
                              fun: function() {
                                    dataControl.Moving = false
                                    dataControl.showing = true
                              }
                        })
                  } else {
                        btn.loadTexture(res.btn_gjx_normal)
                        addShowType({
                              item: dataControl.toolbg,
                              show: "moveTo",
                              time: showTime,
                              buf: dataControl.moveModify,
                              fun: function() {
                                    dataControl.Moving = false
                                    dataControl.showing = false
                              }
                        })
                  }
            }
      }
      btn.show = function() {
            touchEvent(this)
      }
      btn.judgeAct = function(data) {
            var act = data.act
            var item = data.item
            var pos = data.pos
            var index = data.index
            switch (act) {
                  case "end":
                        btn.judgeBack(pos, item)
                        break
            }
      }
      btn.getStatus = function() {
            return this.dataControl.showing
      }
      createTouchEvent({
                  item: btn,
                  end: function(data) {
                        var item = data.item
                        touchEvent(item)
                  }
            })
            //btn.setSelected(true)
      return btn
}

var pauseMusic = function() {
      cc.audioEngine.pauseMusic()
      cc.audioEngine.isPaused = true
}

var resumeMusic = function() {
      cc.audioEngine.resumeMusic()
      cc.audioEngine.isPaused = false
}

var pauseEffect = function() {
      cc.audioEngine.pauseAllEffects()
}

var resumeEffect = function() {
      cc.audioEngine.resumeAllEffects()
}

var playMusic = function(file, loop) {
      var audio = cc.audioEngine
      audio.isPaused = false
      loop = loop || false
      if (file) {
            finishTimer("SAYING") //先这么处理吧
            audio.stopMusic()
            audio.playMusic(file, loop)
            audio.setFile(file)
      }
}

var preLoadMusic = function(list) {
      if (cc.sys.isNative) {
            for (var i = 0; i < list.length; i++) {
                  cc.audioEngine.preloadMusic(list[i])
            }
      }
}

var playMusicLoopCall = function(data) { //播放指定次数指定音频并执行回调
      var music = data.music
      var times = data.times || 1
      var fun = data.fun
      var count = 0
      var calling = function() {
            playMusic(music)
            addTimer({
                  time: 0.1,
                  fun: function(key) {
                        if (judgeMusic(music)) {
                              count++
                              if (count >= times) {
                                    removeTimer(key)
                                    if (fun) {
                                          fun()
                                    }
                              } else {
                                    playMusic(music)
                              }
                        }
                  },
                  father: CC_CURRENT_LAYER,
                  repeat: cc.REPEAT_FOREVER,
            })
      }
      calling()
}

var playEffect = function(file, loop) {
      loop = loop || false
      if (file) {
            cc.audioEngine.playEffect(file, loop)
      }
}

var stopEffect = function() {
      cc.audioEngine.stopAllEffects()
}


var judgeMusic = function(file) { //判断音乐是否停止
      return cc.audioEngine.musicEnd(file)
}

var stopMusic = function(file) {
      cc.audioEngine.isPaused = false
      cc.log("STOP MUSIC")
      if (file) {
            if (cc.audioEngine.getFile() == file) {
                  cc.audioEngine.stopMusic()
            }
      } else {
            cc.audioEngine.stopMusic()
      }
}

var createTouchRect = function(data) //创建监听判定区域
      {
            var size = data.size || cc.size(0, 0)
            var pos = data.pos || cc.p(0, 0)
            var op = data.op || 0
            var color = data.color || cc.color(255, 0, 0, 255)
            var touchNode = new ccui.Layout()
            touchNode.setBackGroundColor(color)
            touchNode.setContentSize(size)
            touchNode.setPosition(pos)
            touchNode.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID)
            touchNode.setBackGroundColorOpacity(op)
            touchNode.setTouchEnabled(true)
            touchNode.setSwallowTouches(false)
            return touchNode
      }

var createResult = function(data) { //创建结论框
      var img = data.img
      var anchor = cc.p(0.5, 0.5)
      var size = cc.size(587, 377)
      var offset = data.offset || cc.p(15, 10)
      var offx = 0.1
      var offy = 0.1
      var offbg = data.offbg || cc.p(0, 0)
      var btnfun = data.btnfun
      var result = new cc.Scale9Sprite(res.bg_result,
            cc.rect(0, 0, size.width, size.height),
            cc.rect(offx * size.width, offy * size.height,
                  (1 - offx) * size.width, (1 - offy) * size.height))
      if (img) {
            if (!result.content) {
                  result.content = new cc.Sprite(img)
                  result.content.setAnchorPoint(0, 0)
                  result.content.setPosition(offset)
                  result.addChild(result.content)
            }
            result.width = result.content.getContentSize().width * 1.1 + offbg.x
            result.height = result.content.getContentSize().height * 1.1 + offbg.y
            if (!result.closeBtn) {
                  result.closeBtn = new ccui.Button(res.btn_result_quit_normal, res.btn_result_quit_select)
                  result.closeBtn.setAnchorPoint(1, 0)
                  result.addChild(result.closeBtn)
                  result.closeBtn.addClickEventListener(function() {
                        if (result.people && result.people.stopSay) {
                              result.people.stopSay()
                        }
                        if (btnfun)
                              btnfun()
                  })
            }
            var btnModify = data.btnModify || cc.p(-10, -10)
            result.closeBtn.setScale(data.btnScale || 1.0)
            result.closeBtn.setPosition(result.width + btnModify.x, result.height - result.closeBtn.getContentSize().height + btnModify.y)
      }
      result.setAnchorPoint(anchor)
      return result
}

var createDialog = function(data) { //创建对话框
      var size = data.size || cc.size(1, 1)
      var pos = data.pos
      var key = data.key
      var img = data.img
      var btnoffset = data.btnoffset || cc.p(0, 0)
      var scale = data.scale || 1
      var anchor = data.anchor
      var offset = data.offset || cc.p(0, 0)
      var scaleBg = data.scaleBg || cc.p(1.12, 1.1)
      var backType = data.backType || 1
      var result = new cc.Scale9Sprite(res.img_dialog, cc.rect(0, 0, 200, 95), cc.rect(50, 20, 100, 10))
      var fun = data.fun
      result.modify = function(data) {
            var img = data.img
            var scale = data.scale || 1
            var scaleBg = data.scaleBg || cc.p(1.12, 1.1)
            var buttonoffset = data.buttonoffset || cc.p(0, 0)
            var offset = data.offset || cc.p(0, 0)
            var fun = data.fun
            if (this.content) {
                  this.content.removeFromParent(true)
                  this.content = null
            }
            this.content = new cc.Sprite(img)
            this.content.setAnchorPoint(-0.03, -0.05)
            this.content.setScale(scale)
            result.addChild(this.content)
            result.width = this.content.getContentSize().width * scaleBg.x * this.content.getScaleX()
            result.height = this.content.getContentSize().height * scaleBg.y * this.content.getScaleY()
            if (result.height < 95) {
                  result.height = 95
            }
            this.content.setPosition(offset)
            if (!this.closeBtn) {
                  this.closeBtn = new ccui.Button(res.btn_tipclose_normal, res.btn_tipclose_select)
                  this.closeBtn.setAnchorPoint(0, 0)
                  this.closeBtn.setScale(0.8)
                  result.addChild(this.closeBtn)
                  this.closeBtn.addClickEventListener(function() {
                        if (result.getParent().stopSay) {
                              result.getParent().stopSay({
                                    fun: fun,
                              })
                        } else {
                              if (fun) {
                                    fun()
                              }
                        }
                  })
            }
            var btnModify = 0
            this.closeBtn.setPosition(btnModify + 12 + buttonoffset.x, result.height - this.closeBtn.getContentSize().height - btnModify + 5 + buttonoffset.y)
      }
      if (img) {
            result.modify(data)
      } else {
            result.width = size.width
            result.height = size.height
      }
      if (pos) {
            result.setPosition(pos)
      }
      if (anchor) {
            result.setAnchorPoint(anchor)
      }

      return result
}

func.init = function() { //初始化
      loadPlist("boshisay")
      loadPlist("boshishow")
      loadPlist("studentsay")
      loadPlist("studentshow")
      func.aniData = {
            boshisay: {
                  start: 1,
                  end: 8,
                  frame: "boshisay%02d.png",
                  time: 0.05,
                  origin: true
            },
            boshishow: {
                  start: 1,
                  end: 35,
                  frame: "boshishow%02d.png",
                  time: 0.05
            },
            studentsay: {
                  start: 1,
                  end: 10,
                  frame: "studentsay%02d.png",
                  time: 0.05,
                  origin: true
            },
            studentshow: {
                  start: 1,
                  end: 48,
                  frame: "studentshow%02d.png",
                  time: 0.05
            },
      }
      func.myInit = true
}

var addPeople = function(data) //添加博士或者学生
      {
            var id = data.id //boshi  student
            var pos = data.pos || cc.p(0, 0) //创建的位置
            var result = null
            var frame = null
            var say = null
            var show = null
            if (!func.myInit) {
                  func.init()
            }
            switch (id) {
                  case "boshi":
                        frame = "boshisay01.png"
                        say = "boshisay"
                        show = "boshishow"
                        break
                  case "student":
                        frame = "studentshow15.png"
                        say = "studentsay"
                        show = "studentshow"
                        break
                  default:
                        cc.log("wrong id was call in addPeople", data)
                        break
            }
            if (frame) {
                  result = new cc.Sprite()
                  result.retain()
                  result.ending = false
                  result.originFrame = frame
                  result.aniSay = function() {
                        return createAnimation(func.aniData[say])
                  }
                  result.aniShow = function() {
                        return createAnimation(func.aniData[show])
                  }
                  result.show = function(fun) {
                        result.runAction(cc.sequence(result.aniShow(), cc.callFunc(function() {
                              result.stopAllActions()
                              result.setSpriteFrame(result.originFrame)
                              if (fun) {
                                    fun()
                              }
                        })))
                  }
                  result.finish = function() {
                        result.ending = true
                  }
                  result.callPause = function() {
                        pauseMusic()
                        result.stopAllActions()
                        result.setSpriteFrame(result.originFrame)
                  }
                  result.callResume = function() {
                        resumeMusic()
                        if (result.saying) {
                              result.runAction(cc.repeatForever(result.aniSay()))
                        }
                  }
                  result.stopSay = function(data) {
                        data = data || {}
                        var immediate = data.im || false
                        var key = data.key
                        var fun = data.fun
                        if (key && key != result.curdata.key) {
                              return
                        }
                        result.saying = false
                        stopMusic()
                              //pauseMusic()
                        removeTimer("SAYING")
                        result.stopAllActions()
                        result.setSpriteFrame(result.originFrame)
                        var removelisten = false

                        if (result.curdata) {
                              var dialog = null
                              switch (result.dialogList[result.curdata.key].id) {
                                    case "normal":
                                          dialog = result.DialogImg
                                          break
                                    case "result":
                                          dialog = result.ResultDialog
                                          removelisten = true
                                          break
                              }
                              if (removelisten) {
                                    if (dialog.removeListen) {
                                          dialog.removeListen()
                                    }
                                    if (dialog.listener) {
                                          cc.eventManager.removeListener(dialog.listener)
                                          dialog.listener = null
                                    }
                              }
                              if (immediate) {
                                    dialog.setVisible(false)
                                    dialog.setScale(0)
                                    dialog.setVisible(true)
                                    if (fun) {
                                          fun()
                                    }
                              } else {
                                    addShowType({
                                          item: dialog,
                                          show: "zoom",
                                          time: 0.3,
                                          fun: function() {
                                                if (fun) {
                                                      fun()
                                                }
                                          }
                                    })
                              }
                        }
                  }
                  result.say = function(saydata) {
                        var key = saydata.key
                        var fun = saydata.fun
                        var sameStop = saydata.sameStop
                        var indata = result.dialogList[key]
                        cc.log("key::",key)
                        if(fun){
                          indata.fun = fun    
                        }
                        if (indata.id != "result" && sameStop == null) {
                              sameStop = true
                        }
                        var force = saydata.force || false
                        if (result.saying) {
                              if (result.pastKey == key && sameStop) {
                                    return
                              }
                              if (!force) {
                                    if (result.pastId != "result" && result.dialogList[key].id == "result") {
                                          result.stopSay({
                                                im: true,
                                                fun: fun,
                                          })
                                    } else {
                                          result.stopSay({
                                                im: false,
                                                fun: fun,
                                          })
                                          return
                                    }
                              } else {
                                    result.stopSay({
                                          im: true,
                                          fun: fun,
                                    })
                              }
                              // var indata = result.dialogList[key]
                              // if (indata && indata.id == "result") {
                              //       return
                              // }
                        } else {
                              // if (indata && indata.id == "result") {
                              //       result.stopAllActions()
                              // }
                        }
                        if (result.dialogList[key]) {
                              var needstop = true
                              switch (indata.id) {
                                    case "normal":
                                          if (result.ResultDialog) {
                                                result.ResultDialog.setVisible(false)
                                          }
                                          if (!result.DialogImg) {
                                                indata.anchor = cc.p(1.0, 0.5)
                                                result.DialogImg = createDialog(indata)
                                                result.DialogImg.setVisible(false)
                                                var tempSp = new cc.Sprite("#" + result.originFrame)
                                                result.DialogImg.setPosition(cc.p(tempSp.getContentSize().width / 2 - 20, tempSp.getContentSize().height / 2))
                                                result.addChild(result.DialogImg)
                                          }
                                          if (indata.img) {
                                                result.DialogImg.modify(indata)
                                                result.DialogImg.setScale(0)
                                                result.DialogImg.stopAllActions()
                                                addShowType({
                                                      item: result.DialogImg,
                                                      show: "scale",
                                                      time: 0.3,
                                                      offset: indata.offset,
                                                })
                                                result.DialogImg.setVisible(true)
                                          } else {
                                                result.DialogImg.setVisible(false)
                                          }
                                          break
                                    case "result":
                                          if (result.DialogImg) {
                                                result.DialogImg.setVisible(false)
                                          }
                                          var par = indata.father || result.getParent()

                                          if (!result.ResultDialog) {
                                                result.ResultDialog = createResult(indata)
                                                result.ResultDialog.setVisible(false)
                                                result.ResultDialog.people = result
                                                result.ResultDialog.setLocalZOrder(LOCAL_ORDER++)
                                                safeAdd(par, result.ResultDialog)
                                                result.ResultDialog.setScale(0)
                                          }
                                          var location = par.convertToNodeSpace(cc.p(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2))
                                          result.ResultDialog.setPosition(location)
                                          result.ResultDialog.setVisible(true)
                                                //给对话框单击移动是设置层级关系 -todo gsr
                                                //全局变量LOCAL_ORDER
                                          result.ResultDialog.changeSelfLocalZero = function() {
                                                this.setLocalZOrder(LOCAL_ORDER++)
                                                safeAdd(this.getParent(), this)
                                          }
                                          result.ResultDialog.setLocalZOrder(LOCAL_ORDER++)
                                          safeAdd(result.ResultDialog.getParent(), result.ResultDialog)
                                          createTouchEvent({
                                                item: result.ResultDialog,
                                                autoMove: true,
                                                begin: function(data) {
                                                      var item = data.item
                                                      item.setLocalZOrder(LOCAL_ORDER++)
                                                      safeAdd(item.getParent(), item)
                                                      return true
                                                },
                                          })
                                          result.ResultDialog.setScale(0)
                                          result.ResultDialog.stopAllActions()
                                          addShowType({
                                                item: result.ResultDialog,
                                                show: "scale",
                                                time: 0.3
                                          })
                                          needstop = false
                                          break
                              }
                              result.pastId = indata.id
                              result.pastKey = saydata.key
                              result.stopAllActions()
                              if (indata.sound) {
                                    result.runAction(cc.repeatForever(result.aniSay()))
                                    playMusic(indata.sound)
                                    indata.currentLayer = CC_CURRENT_LAYER
                                    cc.log("playmusic", indata.sound)
                                    addTimer({
                                          time: 0.1,
                                          repeat: cc.REPEAT_FOREVER,
                                          fun: function() {
                                                if (judgeMusic(indata.sound)) {
                                                      if (needstop) {
                                                            result.stopSay({
                                                                  fun: function() {
                                                                        if (indata.currentLayer && indata.currentLayer == CC_CURRENT_LAYER) {
                                                                              if (fun) {
                                                                                    fun()
                                                                              }
                                                                        }
                                                                  }
                                                            })
                                                      } else {
                                                            result.saying = false
                                                            stopMusic()
                                                            removeTimer("SAYING")
                                                            result.stopAllActions()
                                                            result.setSpriteFrame(result.originFrame)
                                                      }
                                                }
                                          },
                                          finish: function() {
                                                if (needstop) {
                                                      result.stopSay({
                                                            fun: function() {
                                                                  if (indata.currentLayer && indata.currentLayer == CC_CURRENT_LAYER) {
                                                                        if (fun) {
                                                                              fun()
                                                                        }
                                                                  }
                                                            }
                                                      })
                                                } else {
                                                      result.saying = false
                                                      stopMusic()
                                                      result.stopAllActions()
                                                      result.setSpriteFrame(result.originFrame)
                                                }
                                          },
                                          key: "SAYING",
                                    })
                              }
                              result.saying = true
                              result.curdata = saydata
                        }
                  }

                  var listener1 = cc.EventListener.create({
                              event: cc.EventListener.TOUCH_ONE_BY_ONE,
                              swallowTouches: true,
                              onTouchBegan: function(touch, event) {
                                    var locationInNode = result.convertToNodeSpace(touch.getLocation())
                                    var s = result.getContentSize()
                                    var rect = cc.rect(s.width / 3, 0, s.width / 2, s.height)
                                    if (cc.rectContainsPoint(rect, locationInNode)) {
                                          return true;
                                    }
                                    return false;
                              },
                              onTouchEnded: function(touch, event) {
                                    if (result.ending) {
                                          return
                                    }
                                    if (!result.saying) {
                                          if (result.curdata) {
                                                result.say(result.curdata)
                                          }
                                    }
                              }
                        })
                        //cc.eventManager.addListener(listener1, result)//小孩说话开关
                  result.setPosition(pos)
            }
            return result
      }

var addContent = function(data) //添加对话
      {
            if (!func.myInit) {
                  func.init()
            }
            // var img = data.img //对话文字图片
            // var sound = data.sound //对话声音文件
            var key = data.key //对话标签 自定义
            var people = data.people //对话人物  传入上文创建的人物
            var scale = data.scale || 1 //对话文字图片缩放值
            var offbg = data.offbg || cc.p(0, 0) //结论框修正
            var id = data.id || "normal" //对话ID 普通为normal 现象结论为result
            var backType = data.backType || 1
                  // var offset = data.offset
                  // var btnoffset = data.btnoffset
                  // var scaleBg = data.scaleBg
                  // var father = data.father
                  // var btnScale = data.btnScale
                  // var btnModify = data.btnModify
            if (!people.dialogList) {
                  people.dialogList = {}
            }
            data.scale = scale
            data.offbg = offbg
            data.id = id
            data.backType = backType
            people.dialogList[key] = data
      }
      //通用函数
var loadPlist = function(name, imgname)
      //加载plist 未传入图片上时只能加载csv中定义为plist类型的文件
      {
            imgname = imgname || name + 'img'
            var png = res[imgname]
            var plist = res[name]
            cc.spriteFrameCache.addSpriteFrames(plist, png)
      }

var createAnimation = function(data) { //创建动画 
      var frame = data.frame //序列帧字符串
            //cc.log(frame)
      var start = data.start
      var ifFile = data.ifFile || false
      if (start == null) {
            start = 1 //起始帧
      }
      var end = data.end //结束帧
      var time = data.time || 0.1 //帧间隔
      var devide = data.devide || 1 //取帧间隔 默认为1
      var origin = data.origin //播放后是否保留最后一帧？ 似乎没什么用
      var rever = data.rever || false //是否反向
      var callList = data.callList //创建多段回调序列帧
      var animation = new cc.Animation()
      var fun = data.fun
      var list = data.list
      var delay = data.delay

      if (callList) {
            var aniList = []
            data.callList = null
            for (var i = 0; i < callList.length; i++) {
                  data.start = callList[i].start
                  data.end = callList[i].end
                  data.fun = callList[i].fun
                  var ani = createAnimation(data)
                  aniList[i] = ani
            }
            return cc.sequence(aniList)
      }
      if (!list) {
            if (rever) {
                  for (var i = end; i >= start; i -= devide) {
                        if (!ifFile) {
                              var frameName = sprintf(frame, i)
                              animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(frameName))
                        } else {
                              var frameName = res[sprintf(frame, i)]
                              animation.addSpriteFrameWithFile(frameName)
                        }
                  }
            } else {
                  for (var i = start; i <= end; i += devide) {
                        if (!ifFile) {
                              var frameName = sprintf(frame, i)
                              animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(frameName))
                        } else {
                              var frameName = res[sprintf(frame, i)]
                              animation.addSpriteFrameWithFile(frameName)
                        }
                  }
            }
      } else {
            for (var i = 0; i < list.length; i++) {
                  if (!ifFile) {
                        var frameName = sprintf(frame, list[i])
                        animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(frameName))
                  } else {
                        var frameName = res[sprintf(frame, list[i])]
                        animation.addSpriteFrameWithFile(frameName)
                  }
            }
      }

      animation.setDelayPerUnit(time);
      if (origin) {
            animation.setRestoreOriginalFrame(true)
      }
      var action = new cc.Animate(animation)
      if (fun) {
            action = cc.sequence(action, cc.callFunc(fun))
      }
      if (delay) {
            action = cc.sequence(cc.delayTime(delay), action)
      }
      //action.retain()
      //action.doretain = true
      return action
}

var TAG_COVER = 998

var addCover = function() { //创建遮罩层 页面切换用
      //添加屏蔽层
      var temp = createLayout({
            pos: cc.p(0, 0),
            size: cc.director.getWinSize(),
            op: 0,
            color: cc.color(0, 0, 0, 255),
      })
      temp.setTouchEnabled(true)
      temp.setSwallowTouches(true)
      temp.setTag(TAG_COVER)
      var scene = cc.director.getRunningScene()
      if (scene.getChildByTag(TAG_COVER)) {
            scene.removeChildByTag(TAG_COVER)
      }
      scene.addChild(temp, 999)
}

var removeCover = function() {
      //删除屏蔽层
      var scene = cc.director.getRunningScene()
      if (scene.getChildByTag(TAG_COVER)) {
            scene.removeChildByTag(TAG_COVER)
      }
}

func.changeLayer = function(data) { //场景切换
      CAN_BACK = false
      var outLayer = data.out
      var inLayer = data.in
      if (!(inLayer && outLayer)) {
            cc.log("null layer was call")
            return
      }
      var past = data.back
      var fun = data.fun
      var notChange = data.notChange || false
      var forceDelete = data.forceD
      addCover()
      var time = changeTime
      if (notChange) {
            time = 0.001
      }
      var scene = cc.director.getRunningScene()
      if (inLayer.myCtor) {
            inLayer.myCtor()
      }
      if (inLayer.alreadyEnter && inLayer.reEnter) {
            inLayer.reEnter()
      }
      if (outLayer.preExit) {
            outLayer.preExit()
      }
      if (inLayer.myPausing) {
            // cc.log("RESUMING", inLayer.layerName)
            // inLayer.resume()
            // inLayer.myPausing = false
      }
      outLayer.setLocalZOrder(2)
      safeAdd(scene, outLayer)
      getLoopOp(outLayer)
      var outCount = 0
      var afterFun = function(item) {
            outCount--
            if (outCount == 0) {
                  item.setPosition(-cc.director.getWinSize().width, 0)
                  item.setLocalZOrder(-1)
                  safeAdd(scene, outLayer)
                  removeCover()
                  var del = false
                  if (outLayer.myExit) {
                        outLayer.myExit()
                  }
                  if (outLayer.afterExit) {
                        outLayer.afterExit()
                  }
                  if (forceDelete != null) {
                        del = forceDelete

                  } else {
                        del = outLayer.changeDelete
                  }
                  if (del) {
                        clearByLayer(outLayer)
                        if (outLayer.myDelete) {
                              outLayer.myDelete()
                        }
                        layerControl.deleteLayer(outLayer)
                  } else {}
                  if (inLayer.myEnter && !inLayer.alreadyEnter) {
                        inLayer.myEnter()
                        inLayer.alreadyEnter = true
                  } else {
                        CC_CURRENT_LAYER = inLayer
                  }
                  if (fun) {
                        fun()
                  }
                  CAN_BACK = true
            }
      }
      addShowType({
            item: outLayer,
            show: "fadeOut",
            time:time,
            fun: function(item) {
                  afterFun(item)
            }
      })
      outCount++
      outLayer.setPosition(cc.p(0, 0))
      inLayer.setPosition(cc.p(0, 0))
      addShowType({
            item: outLayer,
            show: "moveTo",
            time:time,
            buf: cc.p(-cc.director.getWinSize().width, 0),
            fun: function(item) {
                  afterFun(item)
            }
      })
      outCount++
      setLoopOp(inLayer)
      myAddLayer(inLayer)
      inLayer.setOpacity(255)
      inLayer.setVisible(true)
      if (past) {
            inLayer.pastLayer = past
      }
}
changeLayer = func.changeLayer

var myAddLayer = function(inLayer) {
      var scene = cc.director.getRunningScene()
      safeAdd(scene, inLayer)
}

//设置node的isCascadeOpacityEnabled
var setCascadeOp = function(node,Isreset){
    if(!node)
        return true
    var childrens = node.getChildren()
    if(childrens.length>0){
        for (var i = 0; i < childrens.length; i++) {
            if(!childrens[i].CascadeOp)
            {
                //childrens[i].CascadeOp = childrens[i].isCascadeOpacityEnabled()
                cc.log("isCascadeOpacityEnabled:",childrens[i].getName(),"OP:",childrens[i].isCascadeOpacityEnabled())
            }
            if(Isreset){
                  //cc.log("childrensName:",childrens[i].getName(),"OP:",childrens[i].CascadeOp)
                  if(childrens[i].CascadeOp)
                        childrens[i].setCascadeOpacityEnabled(childrens[i].CascadeOp)
            }else{
                  cc.log("childrensName:",childrens[i].getName(),"trueIIIIII")
                childrens[i].setCascadeOpacityEnabled(true)
            }
            setCascadeOp(childrens[i],Isreset)
        }
    }
}

var seekWidgetByName = function(rootNode, name) { //查找指定node下对应名称的UI
      if (!rootNode) {
            return null;
      }
      if (rootNode.getName() === name)
            return rootNode;
      var arrayrootNodeChildren = rootNode.getChildren();
      var length = arrayrootNodeChildren.length;
      for (var i = 0; i < length; i++) {
            var child = arrayrootNodeChildren[i];
            var res = seekWidgetByName(child, name);
            if (res !== null) {
                  return res;
            }
      }
      return null;
}

var loadUI = function(src, json, uilist) { //加载指定json中的所有资源并把uilist中定义的资源捆绑到src上
      src.loadUI = ccs.load(json).node
      src.addChild(src.loadUI)
            //cc.log(src.loadUI)
      for (var i = 0; i < uilist.length; i++) {
            src[uilist[i]] = seekWidgetByName(src.loadUI, uilist[i])
      }
}

var loadList = function(item, list) { //捆绑list上所有的对象到item上
      for (var i = 0; i < list.length; i++) {
            var temp = seekWidgetByName(item, list[i])
            if (temp) {
                  item[list[i]] = temp
            }
      }
}

var isAncestor = function(src, dest) { //判定src是否是dest的祖先
      if (src == dest) {
            return true
      }
      if (dest.getParent && dest.getParent()) {
            if (dest.getParent() == src) {
                  return true
            } else {
                  return isAncestor(src, dest.getParent())
            }
      } else {
            return false
      }
}

var loadNode = function(json, uilist, father, noLoop) { //加载json中所有资源并返回 如果传入uilist则会捆绑对应list中所有资源可直接命名访问
      noLoop = noLoop || false
      if (uilist) {
            var node = ccs.load(json).node
            var fat = null
            if (father) {
                  fat = seekWidgetByName(node, father)
            }
            for (var i = 0; i < uilist.length; i++) {
                  if (fat) {
                        fat[uilist[i]] = seekWidgetByName(fat, uilist[i])
                        if (!fat[uilist[i]]) {
                              fat[uilist[i]] = seekWidgetByName(node, uilist[i])
                              if (!fat[uilist[i]]) {
                                    cc.log("wrong id", uilist[i])
                              } else {
                                    if (!noLoop) {
                                          if (!isAncestor(fat, fat[uilist[i]])) {
                                                changeFather({
                                                      father: fat,
                                                      item: fat[uilist[i]]
                                                })
                                          }
                                    }
                              }
                        } else {
                              if (!noLoop) {
                                    if (!isAncestor(fat, fat[uilist[i]])) {
                                          changeFather({
                                                father: fat,
                                                item: fat[uilist[i]]
                                          })
                                    }
                              }
                        }
                  } else {
                        node[uilist[i]] = seekWidgetByName(node, uilist[i])
                  }
            }
            if (fat) {
                  fat.removeFromParent(false)
                  return fat
            } else {
                  return node
            }
      } else {
            return ccs.load(json).node
      }
}

var loadNodeWithAllchild = function(json) {
      var node = ccs.load(json).node
      var childlist = node.getChildren()
      for (var i in childlist) {
            var childname = childlist[i].getName()
            node[childname] = childlist[i]
      }
      return node
}

var showType = { //特效类型
      scale: "scale", //放大 缩小 淡入 淡出 移动
      zoom: "zoom",
      fadeIn: "fadeIn",
      fadeOut: "fadeOut",
      fadeTo: "fadeTo",
      moveTo: "moveTo",
      moveBy: "moveBy",
      circle: "circle",
      tintTo: "tintTo",
      rotateTo: "rotateTo",
      rotateBy: "rotateBy",
      shakeF: "shakeF",
      scaleTo: "scaleTo",
      scaleLoop: "scaleLoop",
      moveBackForever: "moveBackForever",
      blink: "blink",
      scaleSize: "scaleSize",
      jumpBy: "jumpBy",
      rotateLoop: "rotateLoop",
      moveBackLoop: "moveBackLoop",
}

var addShowType = function(data) { //添加特效
      var item = data.item //特效执行对象
      var inShowType = data.show //特效类型
      var time = data.time || 0.3 //特效时间
      var fun = data.fun //特效结束调用函数
      var buf = data.buf //执行参数
      var action = null
      var infun = data.infun //循环特效每次执行函数
      var ifforever = false
      var needop = false
      var delay = data.delay
      var scale = data.scale || 1
      var repeat = data.repeat || 1
      var count = data.count || 1
      var disInit = data.disInit || false
      if (repeat == cc.REPEAT_FOREVER) {
            repeat = cc.REPEAT_FOREVER / 2
      }
      var init = null
      var tag = data.tag || null
      time = time || 0.1
      var preFun = data.preFun //前置函数
      switch (inShowType) {
            case showType.scaleSize:
                  var tscale = getSizeScale({
                        item: item,
                        width: buf.width,
                        height: buf.height,
                  })
                  action = cc.scaleTo(time, tscale.x, tscale.y)
                  break
            case showType.blink:
                  action = cc.blink(time, count)
                  break
            case showType.moveBackForever:
                  ifforever = true
                  action = cc.repeatForever(cc.sequence(cc.moveBy(time, buf), cc.moveBy(time, cc.p(-buf.x, -buf.y)),
                        cc.callFunc(function() {
                              if (infun) {
                                    infun()
                              }
                        })))
                  break
            case showType.moveBackLoop:
                  action = cc.repeat(cc.sequence(cc.moveBy(time, buf), cc.moveBy(time, cc.p(-buf.x, -buf.y)),
                        cc.callFunc(function() {
                              if (infun) {
                                    infun()
                              }
                        })), count)
                  break
            case showType.rotateLoop:
                  ifforever = true
                  action = cc.repeatForever(cc.sequence(cc.rotateBy(time, buf), cc.rotateBy(time, -buf),
                        cc.rotateBy(time, -buf), cc.rotateBy(time, buf),
                        cc.callFunc(function() {
                              if (infun) {
                                    infun()
                              }
                        })))
                  break
            case showType.scale:
                  action = cc.sequence(cc.callFunc(
                        function() {
                              if (!disInit) {
                                    item.setScale(0)
                              }
                        }), cc.scaleTo(time, scale))
                  break
            case showType.zoom:
                  action = cc.sequence(cc.callFunc(
                        function() {
                              //item.setScale(1)
                        }), cc.scaleTo(time, 0))
                  break
            case showType.scaleTo:
                  var tx = buf.x
                  if (tx == null) {
                        tx = buf
                  }
                  var ty = buf.y
                  if (ty == null) {
                        ty = buf
                  }
                  action = cc.scaleTo(time, tx, ty)
                  break
            case showType.scaleLoop:
                  var from = buf.from
                  var to = buf.to
                  init = function(item) {
                        item.setScale(from)
                  }
                  action = cc.sequence(cc.scaleTo(time, to), cc.scaleTo(time, from))
                  break
            case showType.fadeIn:
                  needop = true
                  action = cc.sequence(cc.callFunc(
                        function() {
                              if (!disInit) {
                                    item.setOpacity(0)
                              }
                        }), cc.fadeIn(time))
                  break
            case showType.fadeTo:
                  needop = true
                  action = cc.fadeTo(time, buf)
                  break
            case showType.fadeOut:
                  needop = true
                  action = cc.sequence(cc.callFunc(
                        function() {
                              if (!disInit) {
                                    item.setOpacity(255)
                              }
                        }), cc.fadeOut(time))
                  break
            case showType.moveTo:
                  action = cc.moveTo(time, buf)
                  break
            case showType.moveBy:
                  action = cc.moveBy(time, buf)
                  break
            case showType.jumpBy:
                  action = cc.jumpBy(time, cc.p(0, 0), buf.y, 1)
                  break
            case showType.circle:
                  ifforever = true
                  action = cc.repeatForever(cc.sequence(cc.rotateBy(time, 360),
                        cc.callFunc(function() {
                              if (infun) {
                                    infun()
                              }
                        })))
                  break
            case showType.tintTo:
                  action = cc.tintTo(time, buf.r, buf.g, buf.b)
                  break
            case showType.rotateTo:
                  action = cc.rotateTo(time, buf)
                  break
            case showType.rotateBy:
                  action = cc.rotateBy(time, buf)
                  break
            case showType.shakeF:
                  ifforever = true
                  action = cc.repeatForever(cc.sequence(cc.moveBy(time, buf), cc.moveBy(time, cc.p(-buf.x, -buf.y))))
                  break
      }
      if (preFun && !ifforever) {
            action = cc.sequence(cc.callFunc(function() {
                  if (preFun) {
                        preFun(item)
                  }
            }), action)
      }
      if (delay) {
            action = cc.sequence(cc.delayTime(delay), action)
      }
      if (infun && !ifforever) {
            action = cc.sequence(action, cc.callFunc(function() {
                  if (infun) {
                        if (item) {
                              infun(item)
                        } else {
                              infun()
                        }
                  }
            }))
      }
      if (repeat != 1 && !ifforever) {
            action = cc.repeat(action, repeat)
      }
      if (action && item) {
            if (init) {
                  init(item)
            }
            if (needop) {
                  if (item.setCascadeOpacityEnabled) {
                        item.setCascadeOpacityEnabled(true)
                  }
            }
            if (ifforever) {
                  if (tag) {
                        action.tag = tag
                  }
                  item.runAction(action)
                  if (fun) {
                        cc.log("this is forever action, can not callback")
                  }
            } else {
                  var inAction = cc.sequence(action, cc.callFunc(function() {
                        if (fun) {
                              fun(item)
                        }
                  }))
                  if (tag) {
                        inAction.tag = tag
                  }
                  item.runAction(inAction)
            }
      } else {
            cc.log("err", item, action)
      }
}

var getSize = function(res, scale) { //指定res的size
      scale = scale || 1
      var img = new cc.Sprite(res)
      var result = cc.size(img.getContentSize().width * scale, img.getContentSize().height * scale)
            //img.release()
      return result
}

var getMiddle = function(x, y) { //获取中心点相对xy偏移的坐标
      x = x || 0
      y = y || 0
      return cc.p(cc.director.getWinSize().width / 2 + x, cc.director.getWinSize().height / 2 + y)
}

/*获得字符串实际长度，中文2，英文1
 * str获得长度的字符串
 * */
//截取字符串（从start字节到end字节）
var exp_subCHString = function(desstr,start,length){
    var len = 0;
    var end = start + length
    var str = "";
    var chars = new Array();
    var flag = null
    for (var i = 0; i < desstr.length; i++){
            if (desstr.charCodeAt(i) > 255 || desstr.charCodeAt(i) < 0) 
                  flag = true;
            else
                  flag = false;
            chars[i] = [desstr.substr(i, 1), flag];
    }
    for (var i = 0; i < desstr.length; i++) {
        if(chars[i][1])
            len += 2;
        else
            len++;
        if (end < len)
            return str;
        else if (start < len)
            str += chars[i][0];
    }
    return str;
}
var getStrLength = function(str) {
      var len = 0;
      for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255 || str.charCodeAt(i) < 0) len += 2; else len ++;
      }
      return len;
}
//去除空格
var string_Trim = function(str){
    str = str.replace(/^(\s|\u00A0)+/,'')
    for(var i=str.length-1; i>=0; i--){
        if(/\S/.test(str.charAt(i))){   
            str = str.substring(0, i+1)  
            break 
        }
    }
    return str  
}

var autoCreatRow = function(srcstr, desnum,offset) {
      var desstr = "";
      var chars = desnum * 2
      var len = getStrLength(srcstr)
      var curnum = Math.ceil(len / chars)
      var mod = len%chars
      var curindex = 0
      if (curnum >= 2) {
            for (var i = 0; i < curnum; i++) {
                  var str = ""
                  if (i == 0) {
                        //第一行空格
                        str = exp_subCHString(srcstr,chars * i, chars) + "\n";
                        curindex = chars
                  } else if(i==curnum - 1){
                        //最后行
                        str = exp_subCHString(srcstr,curindex, len-curindex)
                        if(getStrLength(str)>=chars-6){
                            str = exp_subCHString(srcstr,curindex, chars-6) + "\n"
                            curindex += (chars-6)
                            str = str + exp_subCHString(srcstr,curindex,len-curindex)
                        }
                  } else{
                        //其他
                        str = exp_subCHString(srcstr,curindex, chars-offset) + "\n"
                        curindex += (chars-offset)
                  }
                  desstr = desstr + str;
            }
      }else{
            desstr = srcstr
      }
      return desstr
}

var getAnchor = function(data) { //获取指定anchor对应的pos值
      var item = data.item
      var pos = data.pos
      var anchor = data.anchor
      var srcAnchor = item.getAnchorPoint()
      var size = item.getContentSize()
      var offAnchor = cc.p(srcAnchor.x - anchor.x, srcAnchor.y - anchor.y)
      var offPos = cc.p(pos.x - size.width * offAnchor.x, pos.y - size.height * offAnchor.y)
      return offPos
}

var setLoopOp = function(rootNode, op) { //遍历设置透明度
      if (!rootNode) {
            return null;
      }
      var judge = op != null ? op : rootNode.rootOp
      if (judge == null) {
            judge = 255
      }
      rootNode.setOpacity(judge)
      var arrayrootNodeChildren = rootNode.getChildren();
      var length = arrayrootNodeChildren.length;
      for (var i = 0; i < length; i++) {
            var child = arrayrootNodeChildren[i]
            setLoopOp(child, op)
      }
}
var limteAngel90 = function(data){
      var item = data.item
      var delta = data.delta
      var pos = data.pos

      var Tempx = item.x + delta.x
      var Tempy = item.y + delta.y

      if(Tempy<pos.y && !item.limte){
            if(Tempx>=pos.x){
               Tempx = pos.x 
            }
      }
      if(Tempx>pos.x){
            item.limte = true
            if(Tempy<=pos.y){
                Tempy = pos.y
            }
      }else{
            item.limte = false
      }
      item.x = Tempx
      item.y = Tempy
}

var getLoopOp = function(rootNode, log) { //遍历获取透明度
      if (!rootNode) {
            return null;
      }
      rootNode.rootOp = rootNode.getOpacity()
      if (log) {
            cc.log(rootNode.rootOp)
      }
      var arrayrootNodeChildren = rootNode.getChildren();
      var length = arrayrootNodeChildren.length;
      for (var i = 0; i < length; i++) {
            var child = arrayrootNodeChildren[i]
            getLoopOp(child, log)
      }
}

var IMG_ZERO = 0
var TouchSeq = true
func.createGuancha = function(data) {

      var size = data.size
      var imglists = data.imglist
      var rectlist = data.rectlist
      var nodeInrect = data.nodeInrect || []
      var startoffset = data.startoffset || 20
      var midoffset = data.midoffset || 15
      var endoffset = data.endoffset || 75
      var direction = data.direction || "horizontal" //"vertical"
      var scale = data.scale || 1
      var fromExp = data.fromExp || "see"
      var father = data.father
      var btnoffset = data.btnoffset || 25
      var rectNum = data.rectNum || 1000
      var listPos = data.listPos || cc.p(863, 50)
      var itemNum = data.itemNum || 3
      var imgScale = data.imgScale || 1
      var getImgScale = data.getImgScale
      var addBtnScale = data.addBtnScale || 1
      var addBtnPos = data.addBtnPos || cc.p(20, 20)

      // 每个rect对应一个存放精灵的数组
      var rectarray = []
      for (var i = 0; i < rectlist.length; i++) {
            var tmparray = []
            rectarray.push(tmparray)
      }

      var node = new cc.Node()
      var imgsnode = new cc.Node()
      imgsnode.setName("imgsnode")
      imgsnode.x = cc.winSize.width / 2;
      imgsnode.y = cc.winSize.height / 2
      father.addChild(imgsnode, 500)
      var imglist = mixArray(imglists)
      var pnglist = []
      for (var i = 0; i < imglist.length; i++) {
            pnglist[i] = imglist[i][0]
      }

      var showList = createList({
            scale: 1,
            list: pnglist,
            pos: cc.p(size.width / 2, size.height / 2),
            num: itemNum,
            size: cc.size(171, 502),
            mix: 20,
            arrow: "white",
            color: "yellow",
            imgScale: imgScale,
            modify: cc.p(0, -30),
            arrOff: cc.p(20, -20),
            ifPage: true,
            getFun: function(data) {
                  if(!TouchSeq){
                      TouchSeq = false
                  }
                  var index = data.index
                  var pos = data.pos
                  var tex = data.tex
                  var sp = new cc.Sprite(tex)
                  sp.setPosition(node.convertToNodeSpace(pos))
                  safeAdd(node, sp)
                  if (getImgScale) {
                        sp.setScale(getImgScale)
                  }
                  sp.index = index
                  sp.teamnum = imglist[index][2]
                  node.addTipPng(sp)
                  createTouchEvent({
                        item: sp,
                        begin: function(data) {
                              if(!TouchSeq){
                                  TouchSeq = false
                              }
                              var item = data.item
                              item.setLocalZOrder(100)
                              item.setScale(1)
                              if (getImgScale) {
                                    item.setScale(getImgScale)
                              }
                              item.startpos = item.getPosition()
                              item.delitem = rectarray[item.arrayindex].splice(item.listindex, 1)
                                    //排序
                              node.paixu(item.arrayindex)

                              return true
                        },
                        move: function(data) {
                              data.item.x += data.delta.x
                              data.item.y += data.delta.y
                        },
                        end: function(data) {
                              var item = data.item
                              var tmp = item.delitem
                              TouchSeq = true

                              for (var i in rectlist)
                                    if (cc.rectContainsPoint(rectlist[i], item.getPosition())) {
                                          item.arrayindex = i
                                          node.addItem(i, tmp[0])
                                          for (var m = 0; m < rectarray.length; m++)
                                                if (rectarray[m].length == 0) {
                                                      if (nodeInrect[m])
                                                            nodeInrect[m].setVisible(true)
                                                } else {
                                                      if (nodeInrect[m])
                                                            nodeInrect[m].setVisible(false)
                                                }
                                          return
                                    }
                              node.showList.judgeIndex(item.index, false)
                              item.removeFromParent(true)

                              for (var m = 0; m < rectarray.length; m++) {
                                    if (rectarray[m].length == 0) {
                                          if (nodeInrect[m])
                                                nodeInrect[m].setVisible(true)
                                    }
                              }
                        }
                  })

                  return sp
            },
            outFun: function(data) {
                  var item = data.item
                  var pos = data.pos
                  var index = data.index
                  TouchSeq = true
                  item.setPosition(pos)
                  safeAdd(father, item)
                  for (var i in rectlist) {
                        if (cc.rectContainsPoint(rectlist[i], pos)) {
                              item.arrayindex = i
                              node.addItem(i, item)
                              return
                        }
                  }
                  node.showList.judgeIndex(index, false)
                  item.removeFromParent(true)
            }
      })
      node.addChild(showList)
      node.showList = showList

      node.addTipPng = function(item) {

            if (imglist[item.index][1] && imglist[item.index][1] != "") {
                  var addbn = new ccui.Button(res.btn_add_normal, res.btn_add_select)
                  addbn.setPosition(addBtnPos)
                  addbn.setScale(addBtnScale)
                  item.addChild(addbn)
                  addbn.index = item.index
                  addbn.addClickEventListener(function(sender, type) {
                        var scaleimg = new cc.Sprite(imglist[sender.index][1])
                        scaleimg.setPosition(25 * imgsnode.getChildrenCount(), 0)
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
                        closebtn.setPosition(scaleimg.width - btnoffset, scaleimg.height - btnoffset)
                        closebtn.setScale(0.9)
                        scaleimg.addChild(closebtn)
                        closebtn.addClickEventListener(function() {
                              this.getParent().removeFromParent(true)
                        })
                        for (var i in imgsnode.getChildren()) {
                              if (imgsnode.getChildren()[i].index == sender.index) {
                                    imgsnode.getChildren()[i].removeFromParent(true)
                                    scaleimg.x = scaleimg.x - 25
                              }
                        }

                        imgsnode.addChild(scaleimg)
                        scaleimg.setLocalZOrder(1)
                  })
            }
      }

      node.addItem = function(num, newitem) {
            var i = num
            var item = newitem
            var tempDis = null
            var tempFun = function(key) {
                  for (var k = 0; k < rectarray[i].length; k++) {
                        if (k == 0 || k == rectarray[i].length - 1) {
                              if (tempDis <= rectarray[i][0][key]) {
                                    rectarray[i].splice(0, 0, item)
                                    item.lisindex = 0
                                    break;
                              }
                              if (tempDis >= rectarray[i][rectarray[i].length - 1][key]) {
                                    rectarray[i].splice(rectarray[i].length, 0, item)
                                    item.lisindex = rectarray[i].length - 1
                                    break;
                              }
                        }
                        if (k >= 1) {
                              if (tempDis >= rectarray[i][k - 1][key] && tempDis <= rectarray[i][k][key]) {
                                    rectarray[i].splice(k, 0, item)
                                    item.lisindex = k
                                    break
                              }
                        }
                  }
                  if (!rectarray[i].length) {
                        if (nodeInrect[i])
                              nodeInrect[i].setVisible(false)
                        rectarray[i].push(item)
                        item.lisindex = 0
                  }
            }
            switch (direction) {
                  case "horizontal":
                        tempDis = item.x
                        tempFun("x")
                        break
                  case "vertical":
                        tempDis = item.y
                        tempFun("y")
                        break
            }

            node.paixu(i, item)
      }

      node.paixu = function(num, newitem) {

            var i = num

            //排序之前的处理
            if (newitem) {
                  var getlist = []
                  var removelist = []
                  if (rectNum < rectarray[i].length) {

                        if (newitem.lisindex == rectNum) {
                              var temp = rectarray[i][rectNum]
                              rectarray[i][rectNum] = rectarray[i][rectNum - 1]
                              rectarray[i][rectNum - 1] = temp
                        }

                        for (var j = 0; j < rectNum; j++) {
                              getlist[j] = rectarray[i][j]
                        }

                        for (var k = rectNum; k < rectarray[i].length; k++) {
                              removelist[k] = rectarray[i][k]
                              removelist[k].setVisible(false)
                              node.showList.judgeIndex(removelist[k].index, false)
                              removelist[k].removeFromParent(true)
                        }

                        rectarray[i] = []
                        for (var m = 0; m < getlist.length; m++)
                              rectarray[i][m] = getlist[m]
                  }
            }

            var tempFun = function(key) {
                  var otherkey = (key == "x") ? "y" : "x"
                  var templen = (key == "x") ? "width" : "height"
                  var templenTo = (key == "x") ? "height" : "width"
                  for (var k = 0; k < rectarray[i].length; k++) {
                        cc.log(rectarray[i].length)
                        if (1 == rectarray[i].length)
                              rectarray[i][k][key] = rectlist[i][key] + rectlist[i][templen] / 2
                        else
                              rectarray[i][k][key] = rectlist[i][key] + (k + 1) * rectlist[i][templen] / (rectarray[i].length + 1)

                        rectarray[i][k][otherkey] = rectlist[i][otherkey] + rectlist[i][templenTo] / 2
                        rectarray[i][k].setLocalZOrder(k)
                        rectarray[i][k].listindex = k
                        rectarray[i][k].setScale(scale)
                  }
            }

            switch (direction) {
                  case "horizontal":
                        tempFun("x")
                        break
                  case "vertical":
                        tempFun("y")
                        break
            }
      }

      node.getRectarray = function() {
            return rectarray
      }

      node.getJielun = function() {
            var count = 0
            var lenflag = false
            for (var i = 0; i < rectarray.length; i++) {
                  for (var n = 0; n < rectarray[i].length; n++) {
                        lenflag = true
                        if (rectarray[i][n].teamnum != i)
                              count++;
                  }
            }

            var fault_mp
            var right_mp

            switch (fromExp) {
                  case "see":
                        {
                              fault_mp = res.sound_fault_bs
                              right_mp = res.sound_right_bs
                        }
                        break
                  case "do":
                        {
                              fault_mp = res.sound_fault
                              right_mp = res.sound_right
                        }
                        break
            }


            if (count == 0 && lenflag)
                  dialogControl.AddDialog("Tips", {
                        res: res.img_correct,
                        face: 1,
                        confirmBtn: true,
                        sound: right_mp,
                        father: father
                  });
            else
                  dialogControl.AddDialog("Tips", {
                        res: res.img_fault,
                        modify: cc.p(30, 0),
                        face: 2,
                        confirmBtn: true,
                        sound: fault_mp,
                        father: father
                  });
      }

      node.showdaan = function(res_img) {
            var daansp = father.getChildByName("daan")
            if (daansp) {
                  daansp.runAction(cc.sequence(
                        cc.scaleTo(0.2, 0),
                        cc.callFunc(function() {
                              daansp.removeFromParent()
                        })
                  ))
            } else {
                  var daanbg = new cc.Sprite(res_img)
                  daanbg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2)
                  daanbg.setName("daan")
                  father.addChild(daanbg)
                  daanbg.setScale(0)
                  daanbg.setLocalZOrder(LOCAL_ORDER++)
                  safeAdd(daanbg.getParent(), daanbg)
                  daanbg.runAction(cc.scaleTo(0.2, 1))
                  createTouchEvent({
                        item: daanbg,
                        begin: function(data) {
                              var item = data.item
                              item.setLocalZOrder(LOCAL_ORDER++)
                              safeAdd(item.getParent(), item)
                              return true
                        },
                        autoMove: true,
                  })
                  var closebtn = new ccui.Button(res.btn_result_quit_normal, res.btn_result_quit_select)
                  closebtn.setPosition(daanbg.width - 30, daanbg.height - 30)
                  closebtn.addClickEventListener(function(sender, type) {
                        this.getParent().runAction(cc.sequence(
                              cc.scaleTo(0.2, 0),
                              cc.callFunc(function() {
                                    if (sender.getParent().removeListen) {
                                          sender.getParent().removeListen()
                                    }
                                    sender.getParent().removeFromParent()
                              })
                        ))
                  })
                  daanbg.addChild(closebtn)
            }
      }

      node.clearAllspInRect = function() {
            for (var i in rectarray)
                  for (var k in rectarray[i])
                        rectarray[i][k].removeFromParent()
      }
      node.clearImgsnode = function() {
            imgsnode.removeAllChildren()
      }
      node.initagain = function() {
            this.clearAllspInRect()
            this.clearImgsnode()
            var daansp = father.getChildByName("daan")
            if (daansp)
                  daansp.runAction(cc.sequence(
                        cc.scaleTo(0.2, 0),
                        cc.callFunc(function() {
                              daansp.removeFromParent()
                        })
                  ))

            var dialog = dialogControl["Tips"]
            if (dialog)
                  dialog.onOut()
      }
      node.setPosition(listPos)
      father.addChild(node, 100)

      return node
}
createGuancha = func.createGuancha

var createLink = function(data) { //创建图片方法映射
      var touchs = data.touchs
      var links = data.links
      var normal = data.normal || "normal"
      var select = data.select || "select"
      var init = data.init || 0
      var move = data.moveNode
      if (touchs && links && touchs.length == links.length) {
            var showIndex = function(index) {
                  if (move) {
                        var buf = null
                        var count = 0
                        for (var i = 0; i < touchs.length; i++) {
                              if (index == i) {
                                    buf = cc.p(move.list[i].rootX - move.list[i].getPositionX(), 0)
                              }
                        }
                        for (var i = 0; i < touchs.length; i++) {
                              var temp = move.list[i]
                              count++
                              addShowType({
                                    item: temp,
                                    show: "moveBy",
                                    time: 0.1,
                                    buf: buf,
                                    fun: function() {
                                          count--
                                          if (count == 0) {
                                                move.canMove = true
                                          }
                                    }
                              })
                        }
                  }
                  for (var i = 0; i < touchs.length; i++) {
                        var child = touchs[i]
                        if (index == i) {
                              child[normal].setVisible(false)
                              child[select].setVisible(true)
                              child.link.setVisible(true)
                        } else {
                              child[normal].setVisible(true)
                              child[select].setVisible(false)
                              if (!move) {
                                    child.link.setVisible(false)
                              }
                        }
                  }
            }
            for (var i = 0; i < touchs.length; i++) {
                  var judge = touchs[i]
                  judge[normal] = judge.getChildByName(normal)
                  judge[select] = judge.getChildByName(select)
                  var nor = judge[normal]
                  nor.link = judge[select]
                  nor.judge = i
                  judge.link = links[i]
                  if (move) {
                        if (!move.list) {
                              move.list = []
                        }
                        move.list.push(links[i])
                        links[i].rootX = links[i].getPositionX()
                        links[i].setPositionX(links[i].getPositionX() + i * move.getContentSize().width)
                        move.maxPage = i
                  }
                  createTouchEvent({
                        item: nor,
                        end: function(data) {
                              var item = data.item
                              if (nor.isVisible() || nor.link.isVisible()) {
                                    showIndex(item.judge)
                              }
                        }
                  })
            }
            if (move) {
                  move.page = 0
                  move.canMove = true
                  createTouchEvent({
                        item: move,
                        begin: function(data) {
                              var item = data.item
                              var pos = data.pos
                              item.startPos = pos
                              if (item.canMove) {
                                    item.canMove = false
                                    return true
                              } else {
                                    return false
                              }
                        },
                        move: function(data) {
                              var item = data.item
                              var pos = data.pos
                              var delta = data.delta
                              for (var i = 0; i < item.list.length; i++) {
                                    item.list[i].x += delta.x
                              }
                        },
                        end: function(data) {
                              var item = data.item
                              var pos = data.pos
                              var result = item.page
                              if (Math.abs(pos.x - item.startPos.x) > 20) {
                                    result += ((pos.x - item.startPos.x) > 0 ? -1 : 1)
                                    if (result > item.maxPage) {
                                          result = item.maxPage
                                    }
                                    if (result < 0) {
                                          result = 0
                                    }
                              }
                              item.page = result
                              showIndex(result)
                        }
                  })
            }
            showIndex(init)
      }
}

//创建水蒸气
/*
createWaterAir({
            total: 40,
            width: 30,
            height: 10,
            res: res.yan,
        })*/

var createWaterAir = function(data) {
      data = data || {}
      var total = data.total || 40
      var width = data.width || 30
      var height = data.height || 10
      var tex = data.res || res.img_air
      var canOp = data.canOp 

      var size = data.size || cc.size(60, 20)
      var finalsize = data.finalsize || cc.size(130, 40)
      var sizevar = data.sizevar || cc.size(40, 10)

      var rotate = data.rotate || -15
      var rotatevar = data.rotatevar || 30
      var dis = data.dis || 150
      var disvar = data.disvar || 50
      var time = data.time || 1.5
      var timevar = data.timevar || 0.2

      var node = new cc.SpriteBatchNode(tex)
      node.list = []

      var reinit = function(temp, ifdelay) {
            ifdelay = ifdelay || false
            temp.setPosition(width * Math.random(), height * Math.random())
            var randsize = cc.size(size.width + Math.random() * sizevar.width, size.height + Math.random() * sizevar.height)
            var endSize = cc.size(finalsize.width + Math.random() * sizevar.width, finalsize.height + Math.random() * sizevar.height)
            setSize({
                  item: temp,
                  width: randsize.width,
                  height: randsize.height,
            })
            var randdis = dis + Math.random() * disvar
            var randRotate = rotate + Math.random() * rotatevar
            var buf = cc.p(randdis * Math.sin(randRotate / 180 * Math.PI), randdis * Math.cos(randRotate / 180 * Math.PI))
            var delay = ifdelay ? Math.random() * time : 0
            var finalTime = time + Math.random() * timevar
            temp.count = 0
            temp.stopAllActions()
            temp.setOpacity(0)
            addShowType({
                  item: temp,
                  show: "scaleSize",
                  time: finalTime,
                  buf: endSize,
                  delay: delay,
                  fun: function(item) {
                        item.count--
                              if (item.count <= 0) {
                                    reinit(item)
                              }
                  }
            })
            temp.count++
                  addShowType({
                        item: temp,
                        show: "moveTo",
                        time: finalTime,
                        buf: buf,
                        delay: delay,
                        fun: function(item) {
                              item.count--
                                    if (item.count <= 0) {
                                          reinit(item)
                                    }
                        }
                  })
            temp.count++
                  addShowType({
                        item: temp,
                        show: "fadeOut",
                        time: finalTime,
                        delay: delay,
                        fun: function(item) {
                              item.count--
                                    if (item.count <= 0) {
                                          reinit(item)
                                    }
                        }
                  })
            temp.count++
      }

      for (var i = 0; i < total; i++) {
            var temp = new cc.Sprite(tex)
            reinit(temp, true)
            node.list[i] = temp
            node.addChild(temp)
            if(canOp){
                node.setCascadeOpacityEnabled(canOp)
            }
      }

      return node
}

var createBgMoveSp = function(data) {
      var father = data.father
      var imgs = data.imgs
      var pos = data.pos
      var dis = data.dis || 0
      var disy = data.disy || 0
      var itemScale = data.itemScale || 1
      var vrimg = data.vrimg || false
      var resultfather = data.resultfather || father
      var rectlist = data.rectlist
      var fromExp = data.fromExp || "do"
      var openTrue = data.openTrue
      var itempos = data.itempos || []

      if (openTrue == null) {
            openTrue = false
      }

      var rectsplist = []
      for (var i = 0; i < rectlist.length; i++)
            rectsplist.push(null)

      var imglist = mixArray(imgs)
      for (var i = 0; i < imglist.length; i++) {
            var item = new cc.Sprite(imglist[i][0])
            item.index = i
            item.teamnum = imglist[i][1]
            if (imglist[i][2])
                  item.staticfun = imglist[i][2]
            item.setLocalZOrder(1)
            if (!itempos[i]) {
                  itempos[i] = cc.p(pos.x + dis * i, pos.y + disy * i)
            }
            item.setPosition(itempos[i])
            item.initpos = item.getPosition()
            father.addChild(item)

            var vr_item = new cc.Sprite(imglist[i][0])
            vr_item.setPosition(item.initpos)
            vr_item.setOpacity(100)
            vr_item.setLocalZOrder(0)
            father.addChild(vr_item)

            createTouchEvent({
                  item: item,
                  begin: function(data) {
                        var item = data.item
                        item.setScale(1)
                        safeAdd(item.getParent(), item)
                        if (item.listindex) {
                              rectsplist[item.listindex] = null
                              item.listindex = null
                        }
                        if (item.clearlab)
                              item.clearlab.removeFromParent()
                        return true
                  },
                  autoMove: true,
                  end: function(data) {
                        var item = data.item
                        for (var i in rectlist) {
                              if (cc.rectContainsPoint(rectlist[i], item.getPosition())) {

                                    if (openTrue && i != item.teamnum) {
                                          break
                                    }
                                    if (rectsplist[i]) {
                                          var itemb = rectsplist[i]
                                          itemb.setScale(1)
                                          itemb.setPosition(itemb.initpos)
                                          itemb.setLocalZOrder(1)
                                          rectsplist[itemb.listindex] = null
                                          itemb.listindex = null
                                    }
                                    item.setPosition(rectlist[i].x + rectlist[i].width / 2,
                                          rectlist[i].y + rectlist[i].height / 2)
                                    rectsplist[i] = item
                                    item.listindex = i
                                    if (item.staticfun)
                                          item.staticfun()
                                    item.setLocalZOrder(1)
                                    item.setScale(itemScale)
                                    return
                              }
                        }
                        item.setPosition(item.initpos)
                        item.setLocalZOrder(1)
                        item.setScale(1)
                        if (item.listindex)
                              rectsplist[item.listindex] = null
                        item.listindex = null
                  }
            })
      }

      father.upResult = function(fun) {
            var count = 0
            var lenflag = false
            for (var i = 0; i < rectsplist.length; i++) {
                  if (rectsplist[i]) {
                        lenflag = true
                        if (rectsplist[i].teamnum != i)
                              count++
                  }
            }

            var fault_mp
            var right_mp
            fromExp = "do"

            switch (fromExp) {
                  case "see":
                        {
                              fault_mp = res.sound_fault_bs
                              right_mp = res.sound_right_bs
                        }
                        break
                  case "do":
                        {
                              fault_mp = res.sound_fault
                              right_mp = res.sound_right
                        }
                        break
            }

            var modify = true
            if (fun) {
                  modify = fun()
            }


            if (count == 0 && lenflag && modify)
                  dialogControl.AddDialog("Tips", {
                        res: res.img_correct,
                        face: 1,
                        sound: right_mp,
                        confirmBtn: true,
                        father: resultfather
                  })
            else
                  dialogControl.AddDialog("Tips", {
                        res: res.img_fault,
                        modify: cc.p(30, 0),
                        face: 2,
                        sound: fault_mp,
                        confirmBtn: true,
                        father: resultfather
                  })
      }
      father.upResult1 = function(num, fun) {
            var count = 0
            var lenflag = false
            for (var i = 0; i < rectsplist.length; i++) {
                  if (rectsplist[i]) {
                        lenflag = true
                        if (rectsplist[i].teamnum != Math.floor(i / num))
                              count++
                  }
            }

            var fault_mp
            var right_mp
            fromExp = "do"

            switch (fromExp) {
                  case "see":
                        {
                              fault_mp = res.sound_fault_bs
                              right_mp = res.sound_right_bs
                        }
                        break
                  case "do":
                        {
                              fault_mp = res.sound_fault
                              right_mp = res.sound_right
                        }
                        break
            }

            var modify = true
            if (fun) {
                  modify = fun()
            }


            if (count == 0 && lenflag && modify)
                  dialogControl.AddDialog("Tips", {
                        res: res.img_correct,
                        face: 1,
                        sound: right_mp,
                        confirmBtn: true,
                        father: resultfather
                  })
            else
                  dialogControl.AddDialog("Tips", {
                        res: res.img_fault,
                        modify: cc.p(30, 0),
                        face: 2,
                        sound: fault_mp,
                        confirmBtn: true,
                        father: resultfather
                  })
      }

      father.clearData = function() {
            for (var i = 0; i < rectsplist.length; i++) {
                  if (rectsplist[i]) {
                        var sp = rectsplist[i]
                        sp.setPosition(rectsplist[i].initpos)
                        sp.setScale(1)
                        sp.listindex = null
                        rectsplist[i] = null
                  }
            }
      }
}
var addTimerLabel = function(data) {
      var str = data.str
      var strSize = data.strSize || 30
      var startFun = data.startFun
      var strColor = data.strColor || cc.color(255, 255, 255)
      var strSpeed = data.strSpeed || 0.1
      var startDelay = data.startDelay 
      var strPos = data.strPos || getMiddle()
      var lastFun = data.lastFun
      var lab = new cc.LabelTTF("", "", strSize)
      if(startDelay==null){
            startDelay = false
      }
      lab.setColor(strColor)
      lab.setPosition(strPos)
      lab.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT)
      lab.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP)
      lab.setAnchorPoint(0, 1)
      lab.time = 0
      if(!startDelay){
            lab.runAction(cc.repeatForever(cc.sequence(
                  cc.delayTime(strSpeed),
                  cc.callFunc(function() {
                        lab.time++
                              var changestr = str.substring(0, lab.time)
                        if (lab.getString() == changestr) {
                              lab.stopAllActions()
                              if (lastFun)
                                    lastFun()
                        }
                        if (lab.time == 1) {
                              if (startFun)
                                    startFun()
                        }
                        lab.setString(changestr)
                  })
            )))
      }else{
            lab.runAction(cc.repeatForever(cc.sequence(
                  cc.callFunc(function() {
                        lab.time++
                              var changestr = str.substring(0, lab.time)
                        if (lab.getString() == changestr) {
                              lab.stopAllActions()
                              if (lastFun)
                                    lastFun()
                        }
                        if (lab.time == 1) {
                              if (startFun)
                                    startFun()
                        }
                        lab.setString(changestr)
                  }),
                  cc.delayTime(strSpeed)
            )))
      }
      
      return lab
}

var testForDrawNode = function(parent) {
      var myDraw = new cc.DrawNode()
      parent.addChild(myDraw)
      myDraw.setLocalZOrder(1000)

      myDraw.drawRectbyRect = function(rect) {
            this.drawRect(cc.p(rect.x, rect.y),
                  cc.p(rect.x + rect.width, rect.y + rect.height),
                  null, 2, cc.color(250, 0, 0))
      }
      myDraw.drawDotbyPoint = function(point) {
            this.drawDot(cc.p(point.x, point.y), 4, cc.color(250, 0, 0))
      }
      return myDraw
}

var createClip = function(data) { //裁剪操作
      var toShowimg = data.toShowimg
      var toSencilimg = data.toSencilimg
      var ShowimgPos = data.ShowimgPos
      var sencilPos = data.sencilPos
      var father = data.father
      var scale = data.scale || cc.p(1, 1)
      var sencilScale = data.sencilScale || scale
      var roto = data.roto || 0
      var secil_roto = data.secil_roto || 0
      var ifclip = data.ifclip || 0

      var secil = new cc.Sprite(toSencilimg)
      var clip = new cc.ClippingNode(secil)
      secil.setPosition(sencilPos)
      clip.setAlphaThreshold(ifclip)
      secil.setRotation(secil_roto)
      secil.setScale(sencilScale.x, sencilScale.y)

      var showSp = new cc.Sprite(toShowimg)
      showSp.setPosition(ShowimgPos)
      clip.addChild(showSp)
      showSp.setRotation(roto)
      showSp.setScale(scale.x, scale.y)
      clip.showSp = showSp
      showSp.initPos = showSp.getPosition()
      showSp.secil = secil

      showSp.setMUspPos = function(showPos, secilPos) {
            secil.setPosition(secilPos)
            showSp.setPosition(showPos)
      }
      showSp.changePosWithsecil = function(pos, roto, offset, secilIsroto) {
            var pos = pos || cc.p(0, 0)
            var roto = roto || 0
            var offset = offset || cc.p(0, 0)
            var secilIsroto = secilIsroto || false
            secil.setPosition(pos.x + offset.x, pos.y + offset.y)
            showSp.setPosition(pos)
            showSp.setRotation(roto)
            if (secilIsroto) {
                  secil.setRotation(roto)
            }
      }
      showSp.moveSecil = function(action1, action2) {
            if (!action1) {
                  action1 = cc.callFunc(function() {})
            }
            if (!action2) {
                  action2 = cc.callFunc(function() {})
            }
            secil.runAction(cc.sequence(action1, action2))
      }
      if (father) {
            clip.setPosition(0, 0)
            father.addChild(clip)
      }
      clip.initPos = clip.getPosition()
      return showSp
}