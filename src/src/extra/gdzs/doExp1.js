//@author mu @16/5/11
var tag_Move = 888
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
            var bglist = ["bg1", "bg2", "btn_bg1", "btn_bg2","table1","table2"]
            var colors = []
            for (var i = 0; i < 9; i++) {
              colors[i] = cc.color(0,0,0)
            }
            var bgg = createBiaoge({
              json: res.biao1,
              scale: 0.9,
              inputSize:23,
              inputNum:10,
              rootColor:colors
            })
            var setBtnEnable = function(btn,vis){
              btn.setEnabled(vis)
              btn.setBright(vis)
            }
            var hideDaan = function(){
              bgg.table1.setVisible(false)
              bgg.table2.setVisible(false)
            }
         
            loadList(bgg, bglist)
            setBtnEnable(bgg.btn_bg1,false)
            bgg.btn_bg1.addClickEventListener(function() {
              bgg.bg1.setVisible(true)
              bgg.bg2.setVisible(false)
              setBtnEnable(bgg.btn_bg1,false)
              setBtnEnable(bgg.btn_bg2,true)
              hideDaan()
            })
            bgg.btn_bg2.addClickEventListener(function() {
              bgg.bg1.setVisible(false)
              bgg.bg2.setVisible(true)
              setBtnEnable(bgg.btn_bg1,true)
              setBtnEnable(bgg.btn_bg2,false)
              hideDaan()
            })
            bgg.linkAnswer = function(){
               hideDaan()
               bgg.table1.setVisible(bgg.bg1.isVisible())
               bgg.table2.setVisible(bgg.bg2.isVisible())
            }
            bgg.ClearFun = function(){
               hideDaan()
            }
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
  initUI: function() {
    var self = this
    var uiName = [
      "faLine", "box1", "box2", "box3",
      "jgpan", "circle","water","boli","warn"
    ]
    var node = loadNode(res.do1, uiName)
    this.addChild(node)

    self.R = 1.38
    self.RR = 7/5

    self.ruLine = new cc.DrawNode()
    self.addChild(self.ruLine)
    self.ruLineJiao = new cc.DrawNode()
    self.addChild(self.ruLineJiao,20)
  
    self.fanLine = new cc.DrawNode()
    self.addChild(self.fanLine)
    self.fanLineJiao = new cc.DrawNode()
    self.addChild(self.fanLineJiao,20)

    self.zheLine = new cc.DrawNode()
    node.water.addChild(self.zheLine)
    self.zheLineJiao = new cc.DrawNode()
    self.addChild(self.zheLineJiao,20)

    node.warn.playAc = function(){
      var warn = this
      warn.setVisible(true)
      warn.runAction(cc.sequence(
         cc.blink(3,8),
         cc.callFunc(function(){
            warn.setVisible(false)
         })
      ))
    }
    node.warn.playAc()
    var addTocuh = function(data) {
      var item = data.item
      var rect = data.rect
      var fun = data.fun
      item.ok = true
      createTouchEvent({
        item: item,
        rect: rect,
        begin: function() {
          return true
        },
        end: function(data) {
          var item = data.item
          if (!item.ok) {
            item.ok = true
            item.setTexture(res.box1)
          } else {
            item.ok = false
            item.setTexture(res.box2)
          }
          if (fun) {
            fun(item.ok)
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
      fun: function(jude) {
        node.faLine.setVisible(jude)
      }
    })
    addTocuh({
      item: node.box2,
      rect: boxRect,
      fun: function(jude) {
        self.fanLine.setVisible(jude)
        self.fanLineJiao.setVisible(jude) 
      }
    })
    addTocuh({
      item: node.box3,
      rect: boxRect,
      fun: function(jude) {
        self.zheLine.setVisible(jude)
        self.zheLineJiao.setVisible(jude)
      }
    })
    

    var drawLineBylight = function(data){
      var data = data || {}
      var lineNode = data.lineNode
      var from = data.from
      var to = data.to
      var num = data.num
      var roto = data.roto || 0
      var op = data.op || 255
      var tpos = data.tpos || cc.p(1,1)
      var rate = 1/num
      var xiname = data.xiname
      var drawJiao = data.drawJiao
      var lineWidth = data.lineWidth || 1
      var change = data.change
      var needTo = data.needTo || null
      var color = data.color || cc.color(250, 0, 0)
      lineNode.clear()
      lineNode.drawSegment(from, to, lineWidth, color)
  
      var frompi = cc.p(rate*from.x+(1-rate)*to.x,rate*from.y+(1-rate)*to.y)
      var rate = 2*rate
      var pi = cc.p(rate*from.x+(1-rate)*to.x,rate*from.y+(1-rate)*to.y)
      if(!drawJiao.xiname){
          var xiname = new cc.Sprite(xiname)
          drawJiao.addChild(xiname)
          drawJiao.xiname = xiname
      }
      if(change){
         pi = cc.p(pi.x+change.x,pi.y+change.y)
      }
      if(needTo){
         pi = node.circle.convertToWorldSpace(pi)
      }
      drawJiao.xiname.setPosition(pi)
      drawJiao.xiname.setRotation(roto)
      if(!lineNode.biao){
         var biao = new cc.Sprite(res.light7)
         lineNode.addChild(biao)
         //biao.setScale(0.3)
         biao.setOpacity(op)
         lineNode.biao = biao
      }
      lineNode.biao.setPosition(frompi)
      lineNode.biao.setRotation(roto)
    }
    var drawRuBylight = function(data){
        var roto = data.roto
        var oneDraw = data.oneDraw
        var hi = data.hi || 20
        var ti = data.ti || null
        var statue = data.statue || null
        var hhi = data.hhi || 70
        var zhebig = data.zhebig || null
        var jiaoPos1 = cc.p(hi*Math.sin(roto*Math.PI/180),hi*Math.cos(roto*Math.PI/180))
        var jiaoPos1_to = cc.p(jiaoPos1.x+node.circle.width/2,jiaoPos1.y+node.circle.height/2)
        var wjiaoPos1 = node.circle.convertToWorldSpace(jiaoPos1_to)

        var jiaoPos2 = cc.p(node.circle.width/2,node.circle.height/2 + hi)
        var wjiaoPos2 = node.circle.convertToWorldSpace(jiaoPos2)
        
        var dis = jiaoPos1.x
        var seg = dis/50
        var points = []
        for(var i = 0;i<50;i++){
           var curx = seg*i
           var cury = jiaoPos1.y/Math.abs(jiaoPos1.y)*Math.sqrt(Math.pow(hi,2)-Math.pow(curx,2))
           if(statue == "zhe"){
               curx = -1*curx
               cury = -1*cury
           }
           points[i] = node.circle.convertToWorldSpace(cc.p(curx+node.circle.width/2,cury+node.circle.height/2))    
        }
        if(!oneDraw.ti){
          var ti = new cc.Sprite(ti)
          oneDraw.addChild(ti)
          oneDraw.ti = ti
        }

        var tiPos1 = cc.p(hhi*Math.sin(roto*Math.PI/180),hhi*Math.cos(roto*Math.PI/180))
        var dx = tiPos1.x/2
        var dy = tiPos1.y/Math.abs(tiPos1.y)*Math.sqrt(Math.pow(hhi,2)-Math.pow(dx,2))
        if(statue == "zhe"){
           dx = -1*dx
           dy = -1*dy
        }

        var pp = node.circle.convertToWorldSpace(cc.p(dx+node.circle.width/2,dy+node.circle.height/2))
        oneDraw.ti.setPosition(pp)
        cc.log("pp",pp)
        var curRoto = roto < 0 ? 90+roto : 90-roto
        if(zhebig=="big"){
          curRoto = 90+roto
        }
        oneDraw.ti.setRotation(curRoto)
        oneDraw.setVisible(true)
        oneDraw.clear()
        oneDraw.drawCardinalSpline(points,0.5,100,2,cc.color(255,0,0))
    }
    
    safeAdd(self,node.boli)
    node.boli.setLocalZOrder(9)
    safeAdd(self,node.jgpan)
    node.jgpan.setLocalZOrder(10)
    node.jgpan.statue = "up"
    createTouchEvent({
      item: node.jgpan,
      rect: cc.rect(0, -10, 90, 40),
      begin: function() {
        self.ruLineJiao.setVisible(false)
        self.fanLineJiao.setVisible(false)
        self.zheLineJiao.setVisible(false)
        self.speakeBykey("wenzi2")
        return true
      },
      move: function(data) {
        var item = data.item
        var delta = data.delta
        var pos = data.pos
        var tempx = item.x + delta.x
        var tempy = item.y + delta.y
        if(pos.y<250){
           item.noMove = false
           item.statue = "down"
        }else{
           item.statue = "up"
        }
        var pos = null
        var tpos = null
        var Atan = 0
        var Btan = 0

        switch(item.statue){
           case "up":
              if(!item.noMove){
                item.x = tempx
                item.y = tempy
              }
              var dy = -0.186*item.x+432
              if(tempy< dy){
                item.y = dy
                item.noMove = true
              }else{
                item.noMove = false 
              }
              if(self.fanLine.notself){
                 safeAdd(self,self.fanLine)
                 self.fanLine.notself = false
              }
              pos = node.circle.convertToNodeSpace(getWorldPos(item))
              tpos = cc.p(pos.x-node.circle.width/2,pos.y-node.circle.height/2)
              Atan = Math.atan2(tpos.x,tpos.y)/(Math.PI/180)
              Btan = Atan/self.R

              var Apos = cc.p(301*node.circle.width/2 - 300*pos.x,300*pos.y - 299*node.circle.height/2)
              var opp = node.circle.convertToWorldSpace(Apos)
              drawLineBylight({
                lineNode:self.fanLine,
                from: opp,
                to: node.circle.getPosition(),
                num:1200,
                op:120,
                color:cc.color(255,0,0,80),
                xiname:res.light4,
                drawJiao:self.fanLineJiao,
                roto:-90-Atan
              })
              
              if(!self.zheLine.notself){
                safeAdd(node.water,self.zheLine)
                self.zheLine.notself = true
              }
              var Dy = node.circle.height/2 - pos.y
              var Dx = Dy * Math.tan(Btan*Math.PI/180)
              var Bpos = cc.p(200*Dx+node.circle.width/2,200*Dy+node.circle.height/2)
              var opp1 = node.circle.convertToWorldSpace(Bpos)
              var from = node.water.convertToNodeSpace(getWorldPos(node.circle))
              var opp2 = node.water.convertToNodeSpace(opp1)
              drawLineBylight({
                lineNode:self.zheLine,
                from: opp2,
                to: from,
                num:500,
                color:cc.color(255,0,0,120),
                xiname:res.light5,
                op:150,
                drawJiao:self.zheLineJiao,
                needTo:true,
                roto:90+Btan
              })
           break
           case "down":
              if(!item.noMove){
                item.x = tempx
                if(tempx<465){
                  item.x = 465
                }else if(tempx>748){
                  item.x = 748
                }
                item.y = 75
              }
              if(!self.fanLine.notself){
                safeAdd(node.water,self.fanLine)
                self.fanLine.notself = true
              }
              pos = node.circle.convertToNodeSpace(getWorldPos(item))
              tpos = cc.p(pos.x-node.circle.width/2,pos.y-node.circle.height/2)
              Atan = Math.atan2(tpos.x,tpos.y)/(Math.PI/180)
              Btan = (-1*Atan/Math.abs(Atan)*180+Atan)*self.RR

              var Apos = cc.p(301*node.circle.width/2 - 300*pos.x,300*pos.y - 299*node.circle.height/2)
              var opp = node.circle.convertToWorldSpace(Apos)
              var froms = node.water.convertToNodeSpace(getWorldPos(node.circle))
              var opps = node.water.convertToNodeSpace(opp)
              drawLineBylight({
                lineNode:self.fanLine,
                from: opps,
                to: froms,
                num:1200,
                color:cc.color(255,0,0,80),
                xiname:res.light4,
                op:120,
                drawJiao:self.fanLineJiao,
                roto:-90-Atan,
                needTo:true
              })

              if(self.zheLine.notself){
                safeAdd(self,self.zheLine)
                self.zheLine.notself = false
              }
              if(Math.abs(Atan)>=177 && Math.abs(Atan)<=180){
                self.zheLine.setVisible(false)
              }else{
                self.zheLine.setVisible(true)
              }
              var Dy = node.circle.height/2 - pos.y
              var Dx = Dy * Math.tan(Btan*Math.PI/180)
              var Bpos = cc.p(200*Dx+node.circle.width/2,200*Dy+node.circle.height/2)
              var from = node.circle.getPosition()
              var opp2 = node.circle.convertToNodeSpace(Bpos)
              cc.log("dddd:",Btan)
              drawLineBylight({
                lineNode:self.zheLine,
                from: opp2,
                to: from,
                num:500,
                op:120,
                color:cc.color(255,0,0,80),
                xiname:res.light5,
                drawJiao:self.zheLineJiao,
                roto:Btan-90
              })
           break
        }
        var toRo = 90 + Atan
        item.setRotation(toRo)
        drawLineBylight({
          lineNode:self.ruLine,
          from: item.getPosition(),
          to: node.circle.getPosition(),
          num:3,
          roto:toRo,
          tpos:tpos,
          xiname:res.light6,
          drawJiao:self.ruLineJiao,
          change:cc.p(10,10)
        })
      },
      end: function(data) {
        var item = data.item
        var pos = node.circle.convertToNodeSpace(getWorldPos(item))
        var tpos = cc.p(pos.x-node.circle.width/2,pos.y-node.circle.height/2)
        var Atan = Math.atan2(tpos.x,tpos.y)/(Math.PI/180)
        var Btan = Atan/self.R
        var zhebig = null
        switch(item.statue){
          case "up":
            Btan = Atan/self.R
            zhebig = "samll"
          break
          case "down":
            Btan = (-1*Atan/Math.abs(Atan)*180+Atan)*self.RR + 180
            zhebig = "big"
          break
        } 
        drawRuBylight({
          roto:Atan,
          oneDraw:self.ruLineJiao,
          ti:res.light1
        })
        drawRuBylight({
          roto:-1*Atan,
          hi:40,
          oneDraw:self.fanLineJiao,
          ti:res.light2
        })
        drawRuBylight({
          roto:Btan,
          hi:30,
          oneDraw:self.zheLineJiao,
          statue:"zhe",
          ti:res.light3,
          zhebig:zhebig
        })
        self.fanLineJiao.setVisible(node.box2.ok)
        self.zheLineJiao.setVisible(node.box3.ok)
        self.speakeBykey("wenzi3")
      }
    })
  },
  speakeBykey: function(key) {
    var self = this
    if (!self[key]) {
      self[key] = true
      self.nodebs.say({
        key: key,
        force: true
      })
    }

  },
  myEnter: function() {
    this._super()
    if (this.nodebs) {
      var self = this
        //self.toolbtn.show()
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
    this.addChild(this.nodebs, 900)

    addContent({
      people: this.nodebs,
      key: "wenzi1",
      img: res.wenzi1,
      sound: res.zimp3
    })
    addContent({
      people: this.nodebs,
      key: "wenzi2",
      img: res.wenzi2,
      sound: res.zimp5,
      offset:cc.p(35,0)
    })
    addContent({
      people: this.nodebs,
      key: "wenzi3",
      img: res.wenzi3,
      sound: res.zimp4
    })
  }
})