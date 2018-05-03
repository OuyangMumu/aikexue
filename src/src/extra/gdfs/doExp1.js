//@author mu @16/5/11
var drawArcPonits = function(data){
    var began = data.began || cc.p(-30,40)
    var end = data.end || cc.p(30,40)
    var segments = data.segments || 50
    var allX = end.x - began.x
    var rateX = allX/50
    var points = []
    var hi = Math.sqrt(Math.pow(began.x,2) + Math.pow(began.y,2))

    for(var i = 0; i<segments; i++){
      var curx = began.x + rateX*i
      var fuhao = began.y/Math.abs(began.y)
      var cury = fuhao*Math.sqrt(Math.pow(hi,2)-Math.pow(curx,2))
      points[i] = cc.p(curx,cury)
    }

    return points
}
var doExp1 = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  layerName: "doExp1",
  preLayer: "doLayer",
  ctor: function() { //创建时调用 未删除不会重复调用
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
            for (var i = 0; i < 4; i++) {
              colors[i] = cc.color(0,0,0)
            }
            var bgg = createBiaoge({
              json: res.biao1,
              scale: 0.9,
              inputNum:3,
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
    this.initUI()
    this.initPeople()
    return true
  },
  initUI:function(){
    var self = this
    var uiName = ["jgpan","ruLine","faLine","fanLine","lightPoint","a",
    "lightPoint1","b","o","n","mid2","mid","i","r","pan","tip"]
    for(var i=1; i<=6; i++){
      var str1 = sprintf("box%d",i)
      var str2 = sprintf("boxtip%d",i)
      uiName.push(str1)
      uiName.push(str2)
    }
    var node = loadNode(res.do1,uiName)
    self.addChild(node)
    
    node.checkIsO = function(){
       if(!node.box6.ok && !node.box5.ok 
        && !node.box4.ok && !node.box3.ok){
          node.o.setVisible(false)
       }else{
          node.o.setVisible(true)
       }
    }
    node.ruLine.playShow = function(jude){
       node.lightPoint.setVisible(jude)
       node.a.setVisible(jude)
       node.o.setVisible(jude)
       node.a.stopAllActions()
       node.o.stopAllActions()
       if(jude){
         node.a.runAction(cc.blink(2,5))
         node.o.runAction(cc.blink(2,5))
       }else{
         node.checkIsO()
         node.a.setVisible(jude)
         node.o.setVisible(jude)
       }
    }
    node.fanLine.playShow = function(jude){
       node.lightPoint1.setVisible(jude)
       node.b.setVisible(jude)
       node.o.setVisible(jude)
       node.b.stopAllActions()
       node.o.stopAllActions()
       if(jude){
         node.b.runAction(cc.blink(2,5))
         node.o.runAction(cc.blink(2,5))
       }else{
         node.checkIsO()
         node.b.setVisible(jude)
         node.o.setVisible(jude)
       }
    }
    node.faLine.playShow = function(jude){
       node.faLine.setVisible(jude)
       node.n.setVisible(jude)
       node.o.setVisible(jude)
       node.n.stopAllActions()
       node.o.stopAllActions()
       if(jude){
         
         node.n.runAction(cc.blink(2,5))
         node.o.runAction(cc.blink(2,5))
       }else{
         node.checkIsO()
         node.n.setVisible(jude)
         node.o.setVisible(jude)
       }
    }
    node.o.playShow = function(jude){
      node.o.setVisible(jude)
      node.o.stopAllActions()
      if(jude){
         node.o.runAction(cc.blink(2,5))
      }else{
         node.checkIsO()
      }
    }
    node.changeJiao = function(Angel){
      if(Math.abs(Angel)>=15){
        Angel = Angel/2
      }else{
        Angel = Angel*2
      }
      var pos = cc.p(55*Math.sin(Angel*Math.PI/180),55*Math.cos(Angel*Math.PI/180))
      node.i.setPosition(pos)
      var pos1 = cc.p(55*Math.sin(-1*Angel*Math.PI/180),55*Math.cos(-1*Angel*Math.PI/180))
      node.r.setPosition(pos1)
    }
    var tempFun = function(data){
      var rujiao = this
      var began = data.began
      var end = data.end
      var points = drawArcPonits({
                       began:began,
                       end:end      
                    })
      rujiao.clear()
      rujiao.drawCardinalSpline(points,0.5,10,2,cc.color(255,0,0))
    }

    node.ruJiao = new cc.DrawNode()
    node.mid.addChild(node.ruJiao)
    node.ruJiao.drawSelf = tempFun
    node.ruJiao.setVisible(false)

    node.fanJiao = new cc.DrawNode()
    node.mid.addChild(node.fanJiao)
    node.fanJiao.drawSelf = tempFun
    node.fanJiao.setVisible(false)

    node.init = function(){
        var aAngel = 40
        var ddx = 35*Math.sin(aAngel*Math.PI/180)
        var ddy = 35*Math.cos(aAngel*Math.PI/180)
        node.ruJiao.drawSelf({
                              began:cc.p(ddx,ddy),
                              end:cc.p(0,30)
                            })
        var ddxx = 30*Math.sin(-1*aAngel*Math.PI/180)
        var ddyy = 30*Math.cos(-1*aAngel*Math.PI/180)
        node.fanJiao.drawSelf({
                              began:cc.p(ddxx,ddyy),
                              end:cc.p(0,30)
                            })
        node.changeJiao(aAngel)
    }
    node.init()

    var showTip = function(index){
      for(var i=1; i<=6; i++){
        var str = sprintf("boxtip%d",i)
        if(index == i){
          node[str].setVisible(true)
        }else{
          node[str].setVisible(false)
        }
      }
      self.speakeTip(index)
    }
    var hideByindex = function(index){
       var str = sprintf("boxtip%d",index)
       node[str].setVisible(false)
       self.nodebs.stopSay()
    }
    for(var i=1; i<=6; i++){
      var item = node[sprintf("box%d",i)]
      item.curindex = i
    } 
    var addTocuh = function(data) {
      var item = data.item
      var rect = data.rect
      var fun = data.fun
      item.ok = false
      createTouchEvent({
        item: item,
        rect: rect,
        begin: function() {
          if(!node.pan.ok){
            self.speakeBykey(null,true)
            return false
          }
          return true
        },
        end: function(data) {
          var item = data.item
          if (!item.ok) {
            item.ok = true
            item.setTexture(res.box1)
            showTip(item.curindex)
          } else {
            item.ok = false
            item.setTexture(res.box2)
            hideByindex(item.curindex)
          }
          if (fun) {
            fun({
              item:item,
              ok:item.ok
            })
          }
        }
      })
    }
    var boxRect = cc.rect(-20,-20,40,40)
    if(!cc.sys.isNative){
        boxRect = cc.rect(0,0,20,20)
    }else{
        boxRect = cc.rect(-10,-10,40,40)
    }
    addTocuh({
      item: node.box1,
      rect: boxRect,
      fun: function(data) {
        node.fanJiao.setVisible(data.ok)
        node.r.setVisible(data.ok)
        node.r.stopAllActions()
        if(data.ok){
           node.r.runAction(cc.blink(2,4))
        }
        if(!node.pan.ok){
          node.fanJiao.setVisible(false)
        }
      }
    })
    addTocuh({
      item: node.box2,
      rect: boxRect,
      fun: function(data) {
        node.ruJiao.setVisible(data.ok)
        node.i.setVisible(data.ok)
        node.i.stopAllActions()
        if(data.ok){
           node.i.runAction(cc.blink(2,4))
        }
        if(!node.pan.ok){
          node.ruJiao.setVisible(false)
        }
      }
    })
    addTocuh({
      item: node.box3,
      rect: boxRect,
      fun: function(data) {
        node.o.playShow(data.ok)
      }
    })
    addTocuh({
      item: node.box4,
      rect: boxRect,
      fun: function(data) {
        node.faLine.playShow(data.ok)
      }
    })
    addTocuh({
      item: node.box5,
      rect: boxRect,
      fun: function(data) {
        node.fanLine.playShow(data.ok)
      }
    })
    addTocuh({
      item: node.box6,
      rect: boxRect,
      fun: function(data) {
        node.ruLine.playShow(data.ok)
      }
    })


    node.pan.nor = res.pan_nor
    node.pan.sel = res.pan_sel
    var panRect = cc.rect(-20,-20,40,40)
    if(!cc.sys.isNative){
        panRect = cc.rect(0,0,20,20)
    }else{
        panRect = cc.rect(-20,-20,60,60)
    }
    createTouchEvent({
      item:node.pan,
      rect:panRect,
      begin:function(data){
         var item = data.item
         if(!item.notip){
            item.notip = true
            node.tip.setVisible(false)
            node.jgpan.disListen(false)
            self.speakeBykey("wenzi6")
         }
         if(!item.ok){
            item.ok = true
            item.setTexture(item.sel)
            node.mid2.setVisible(true)
            if(node.box1.ok){
              node.fanJiao.setVisible(true)
            }
            if(node.box2.ok){
              node.ruJiao.setVisible(true)
            }
         }else{
            item.ok = false
            item.setTexture(item.nor)
            node.mid2.setVisible(false)
            node.ruJiao.setVisible(false)
            node.fanJiao.setVisible(false)
         }
      },
    })
    
    var Radius = 295
    createTouchEvent({
       item:node.jgpan,
       begin:function(){
        return true
       },
       move:function(data){
          var item = data.item
          var delta = data.delta
          var pos = data.pos
          var MovPos = item.getParent().convertToNodeSpace(pos)
          if(MovPos.y>0){
             item.notMove = false
          }else{
             item.notMove = true
          }
          var Angel = Math.atan2(MovPos.x,MovPos.y)/(Math.PI/180)
          if(!item.notMove){
            item.setRotation(Angel)
            item.x = Radius * Math.sin(Angel*Math.PI/180)
            item.y = Radius * Math.cos(Angel*Math.PI/180)
            node.ruLine.setRotation(Angel)
            node.fanLine.setRotation(-1*Angel)
            var dx = 35*Math.sin(Angel*Math.PI/180)
            var dy = 35*Math.cos(Angel*Math.PI/180)
            node.ruJiao.drawSelf({
                                  began:cc.p(dx,dy),
                                  end:cc.p(0,30)
                                })
            var dxx = 30*Math.sin(-1*Angel*Math.PI/180)
            var dyy = 30*Math.cos(-1*Angel*Math.PI/180)
            node.fanJiao.drawSelf({
                                  began:cc.p(dxx,dyy),
                                  end:cc.p(0,30)
                                })
            node.changeJiao(Angel)
          }
       },
       end:function(data){
          var item = data.item
          item.notMove = false
       }
    })
    node.jgpan.disListen(true)
  },
  speakeBykey: function(key,status) {
    var self = this
    if(status){
        dialogControl.AddDialog("Tips", {
                            res: res.wenzi11,
                            face:2,
                            confirmBtn: true,
                            father:self
                      })
    }else{
        if (!self[key]) {
          self[key] = true
          self.nodebs.say({
            key: key,
            force: true
          })
        }
    } 
  },
  myEnter: function() {
    this._super()
    if (this.nodebs) {
      var self = this
      self.nodebs.show(function() {
        self.speakeBykey("wenzi5")
      })
    }
  },
  speakeTip:function(index){
    var self = this
    self.nodebs.say({
            key:sprintf("tip%d",index),
            force: true
          })
  },
  initPeople: function() {
    this.nodebs = addPeople({
      id: "student",
      pos: cc.p(1000, 130)
    })
    this.addChild(this.nodebs, 900)

    addContent({
      people: this.nodebs,
      key: "wenzi5",
      img: res.wenzi5,
      sound: res.zimp5
    })
    addContent({
      people: this.nodebs,
      key: "wenzi6",
      img: res.wenzi6,
      sound: res.zimp6
    })
    for(var i=1; i<=6; i++){
      addContent({
        people: this.nodebs,
        key:sprintf("tip%d",i),
        sound: res[sprintf("tip%d",i)]
      })
    }
  }
})