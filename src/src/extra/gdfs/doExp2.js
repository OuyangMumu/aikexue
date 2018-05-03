//@author mu @16/5/11
var doExp2 = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  layerName: "doExp2",
  preLayer: "doLayer",
  ctor: function() { //创建时调用 未删除不会重复调用
    this._super()
    var self = this
    this.expCtor({
        vis: false,
        setZ:800,
        settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
              if(!self.bggg) {
                var colors = []
                for(var i=0; i<3; i++){
                  colors[i] = cc.color(200,5,160)
                }
                var bgg = createBiaoge({
                  json:res.biao1,
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
      var uiName = ["tie","re","ge","shows1",
      "shows2","showimg","dt_btn","light","tip"]
      var node = loadNode(res.do2,uiName)
      self.addChild(node)
      
      node.shows = createClip({
                          toShowimg:res.tie2,
                          ShowimgPos:cc.p(755,160),//cc.p(760,173),
                          toSencilimg:res.shows2,
                          sencilPos:cc.p(755,160),
                          father:node,
                       })
      node.sp = new cc.Sprite(res.shows1)
      node.sp.setPosition(755,167)
      node.sp.setScale(1.015)
      node.addChild(node.sp)
      node.showimgT = new cc.Sprite(res.showimgT1)
      node.showimgT.setPosition(48,50)
      node.sp.addChild(node.showimgT)

      node.showOrhideSome = function(jude){
         node.ge.setVisible(jude)
         node.shows1.setVisible(jude)
         node.sp.setVisible(jude)
         node.showimg.setVisible(jude)
         node.shows.setVisible(jude)
         node.re.setVisible(jude)
      }
      node.showOrhideSome(false)
      node.tie.setVisible(false)
      
      node.dt_btn.nor = res.dt_btnnor
      node.dt_btn.sel = res.dt_btnsel
      var btnRect = cc.rect(-20,-20,40,40)
      if(!cc.sys.isNative){
          btnRect = cc.rect(-20,-20,40,40)
      }else{
          btnRect = cc.rect(-30,-30,80,80)
      }
      createTouchEvent({
        item:node.dt_btn,
        rect:btnRect,
        begin:function(data){
           var item = data.item
           if(!item.ok){
              item.ok = true
              item.setTexture(item.sel)
              node.light.setVisible(true)
              self.wenzi8 = true
              node.tip.setVisible(false)
              node.showOrhideSome(true)
           }else{
              item.ok = false
              item.setTexture(item.nor)
              node.light.setVisible(false)
              node.showOrhideSome(false)
           }
        },
      })

      var resultbtn = new ccui.Button(res.btn_result_normal,
      res.btn_result_select)
      resultbtn.setPosition(1000,450)
      this.addChild(resultbtn)
      this.resultbtn = resultbtn
      resultbtn.addClickEventListener(function(){
          self.nodebs.say({
              key: "wenzi10"
            })
      })
      resultbtn.setVisible(false)
      var check = function(item,index){
         var result = judgeItemCrash({
                         item1:item,
                         item2:node.re
                      })
         if(result){
            if(node.dt_btn.ok){
              node.showOrhideSome(true)
            }else{
              node.showOrhideSome(false)
            }
            self.resultbtn.setVisible(true)
            self.speakeBykey("wenzi8")
            node.tie.setVisible(true)
            node.tie.setTexture(item.getTexture())
            node.re.setTexture(res[sprintf("re%d",index+1)])
            node.ge.setTexture(res[sprintf("ge%d",index+1)])
            node.shows.setTexture(item.getTexture())
            node.showimg.setTexture(res[sprintf("showimg%d",index+1)])
            item.setVisible(false)
            item.setPosition(-1500,0)
            if(index==2){
               node.showimg.setVisible(false)
               node.ge.setVisible(false)
            }
         }
      }
      var toolnode = new cc.Node()
      this.addChild(toolnode,5)
      this.toolnode = toolnode
      this.toolbtn = createTool({
          pos:cc.p(360, 550),
          nums:3,
          tri:"right",
          modify:cc.p(1, 1.2),
          devide:cc.p(1.3, 1.2),
          itempos:cc.p(0, -8),
          circlepos:cc.p(0,15),
          showTime:0.3,
          moveTime:0.2,
          scale:0.9,
          itemScale:0.95,
          ifcircle: true,
          firstClick: function(data) {
              var item = data.sp
              var index = data.index
              var firdtItem = self.toolnode.getChildren()[0]
              if(firdtItem){
                firdtItem.forceBack()
              }
              return true
          },
          clickfun:function(data){
              var item = data.sp
              item.data = data
              data.item = item
              if(item.IsMove){
                return false
              }
              item.setLocalZOrder(LOCAL_ORDER++)
              if(item.clickFun)
                 item.clickFun()
              return true
          },
          movefun:function(data){
             var item = data.sp
             var delta = data.delta
             var index = data.index
             if(!item.IsMove){
                 var temppos = cc.p(item.x + delta.x,item.y + delta.y)
                 item.setPosition(temppos)
                 if(item.excMoveFun)
                 item.excMoveFun()
             }   
          },
          outfun:function(data){
             var item = data.sp
             var index = data.index
             check(item,index)
          },
          backfun:function(data){
            return true
          },
          father:toolnode,
          files:[res.item1,res.item2,res.item3,res.item4,res.item5,res.item6],
          gets:[res.tie1,res.tie2,res.tie3,res.tie4,res.tie5,res.tie6]
      })
      this.addChild(this.toolbtn,3)
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
      self.toolbtn.show()
      self.nodebs.show(function() {
        self.speakeBykey("wenzi7")
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
      key: "wenzi7",
      img: res.wenzi7,
      sound: res.zimp7
    })
    addContent({
      people: this.nodebs,
      key: "wenzi8",
      img: res.wenzi8,
      sound: res.zimp8
    })
    addContent({
         people: this.nodebs,
         key: "wenzi10",
         img:res.wenzi10,
         id:"result",
         sound: res.zimp10,
         offset: cc.p(25, 20),
         offbg: cc.p(5,10),
         btnModify:cc.p(0,0)
     })
  }
})