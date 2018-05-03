//@author mu @16/5/11
var tag_Move = 888
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
      setZ: 800,
      settingData: {
        pos: cc.p(1080, 580),
        biaogeFun: function() {
          if (!self.bggg) {
            var bglist = ["bg1", "bg2","bg3", "btn_bg1", "btn_bg2","btn_bg3","table1","table2","table3"]
            var colors = []
            var inputLineChange = []
            for (var i = 0; i < 30; i++) {
              colors[i] = cc.color(0,0,0)
              inputLineChange[i] = false
              if(i==9 || i==19 ||i==29){
                inputLineChange[i] = true
              }
            }
            var bgg = createBiaoge({
              json: res.biao2,
              scale: 0.9,
              inputSize:26,
              inputNum:30,
              rootColor:colors,
              inputLineChange:inputLineChange
            })
            var setBtnEnable = function(btn,vis){
              btn.setEnabled(vis)
              btn.setBright(vis)
            }
            var hideDaan = function(){
              bgg.table1.setVisible(false)
              bgg.table2.setVisible(false)
              bgg.table3.setVisible(false)
            }
         
            loadList(bgg, bglist)
            setBtnEnable(bgg.btn_bg1,false)
            bgg.btn_bg1.addClickEventListener(function() {
              bgg.bg1.setVisible(true)
              bgg.bg2.setVisible(false)
              bgg.bg3.setVisible(false)
              setBtnEnable(bgg.btn_bg1,false)
              setBtnEnable(bgg.btn_bg2,true)
              setBtnEnable(bgg.btn_bg3,true)
              hideDaan()
            })
            bgg.btn_bg2.addClickEventListener(function() {
              bgg.bg2.setVisible(true)
              bgg.bg1.setVisible(false)
              bgg.bg3.setVisible(false)
              setBtnEnable(bgg.btn_bg2,false)
              setBtnEnable(bgg.btn_bg1,true)
              setBtnEnable(bgg.btn_bg3,true)
              hideDaan()
            })
            bgg.btn_bg3.addClickEventListener(function() {
              bgg.bg3.setVisible(true)
              bgg.bg1.setVisible(false)
              bgg.bg2.setVisible(false)
              setBtnEnable(bgg.btn_bg3,false)
              setBtnEnable(bgg.btn_bg1,true)
              setBtnEnable(bgg.btn_bg2,true)
              hideDaan()
            })
            bgg.linkAnswer = function(){
               hideDaan()
               bgg.table1.setVisible(bgg.bg1.isVisible())
               bgg.table2.setVisible(bgg.bg2.isVisible())
               bgg.table3.setVisible(bgg.bg3.isVisible())
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
  initUI:function(){
    var  self = this
    var db_box = new cc.Sprite(res.db_box)
    db_box.setPosition(getMiddle(0,-80))
    db_box.setScale(1.4,1.1)
    self.addChild(db_box)

    var clockTimeBtn = new ccui.Button(res.miaobiao_nor,res.miaobiao_sel)
    clockTimeBtn.nor = res.miaobiao_nor
    clockTimeBtn.sel = res.miaobiao_sel
    clockTimeBtn.setPosition(80,400)
    self.addChild(clockTimeBtn)
    
    var tipStr = "1.摆锤可自由拖拽和释放\n2.螺母可添加在静止的单摆上(最多3个)\n3.单摆静止时,摆线可以上下拉伸改变摆长"
    var labTip = new cc.LabelTTF(tipStr,"",24)
    //labTip.setColor(cc.color(250,0,0))
    labTip.setPosition(getMiddle(40,40))
    self.addChild(labTip)

    self.clockTime = createWatch()
    self.clockTime.setScale(0.5)
    self.clockTime.setPosition(-500,-300)
    self.addChild(self.clockTime,100)
    addOpMoving({
      item:self.clockTime
    })
    self.clockTime.showOrhideself = function (jude) {
      this.setVisible(jude)
      var pos = jude ? cc.p(240,260):cc.p(-500,-300)
      this.setPosition(pos)
    }
    clockTimeBtn.addClickEventListener(function(sender,type){
      var nor = sender.nor
      var sel = sender.sel
      if(!sender.open){
        sender.open = true
        nor = sender.sel
        sel = sender.nor
      }else{
        sender.open = false
      }
      self.clockTime.showOrhideself(sender.open)
      sender.loadTextureNormal(nor)
      sender.loadTexturePressed(sel)
    })

    self.addDanBai()
  },
  addDanBai:function(){
    var self = this
    var pullItem = function(item){
      item.setVisible(true)
      item.notMove = false
    }
    var  Pendulum1 = createSimplePendulum({
                        lineImg:res.line1,
                        itemImg:res.lm1,
                        stopImg:res.vr_stop,
                        xuXianImg:res.xuline,
                        pullBtnImg:res.pullbtn,
                        txtImg:res.txt,
                        btnImgnor:res.addbtn_nor,
                        btnImgsel:res.addbtn_sel,
                        itemoffset:cc.p(-5,0),
                        maxAngel:20,
                        pullBtnFun:pullItem,
                        showChangeAngel:true,
                        ifLable:true
                      })
    Pendulum1.setPosition(385,496)
    self.addChild(Pendulum1)
    var bc1 = Pendulum1.getBaiChui()

    var  Pendulum2 = createSimplePendulum({
                        lineImg:res.line1,
                        itemImg:res.lm1,
                        stopImg:res.vr_stop,
                        xuXianImg:res.xuline,
                        pullBtnImg:res.pullbtn,
                        txtImg:res.txt,
                        btnImgnor:res.addbtn_nor,
                        btnImgsel:res.addbtn_sel,
                        itemoffset:cc.p(-5,0),
                        maxAngel:20,
                        pullBtnFun:pullItem,
                        showChangeAngel:true,
                        ifLable:true
                      })
    Pendulum2.setPosition(577,496)
    self.addChild(Pendulum2)
    var bc2 = Pendulum2.getBaiChui()

    var  Pendulum3 = createSimplePendulum({
                        lineImg:res.line1,
                        itemImg:res.lm1,
                        stopImg:res.vr_stop,
                        xuXianImg:res.xuline,
                        pullBtnImg:res.pullbtn,
                        txtImg:res.txt,
                        btnImgnor:res.addbtn_nor,
                        btnImgsel:res.addbtn_sel,
                        itemoffset:cc.p(-5,0),
                        maxAngel:20,
                        pullBtnFun:pullItem,
                        showChangeAngel:true,
                        ifLable:true
                      })
    Pendulum3.setPosition(770,496)
    self.addChild(Pendulum3)
    var bc3 = Pendulum3.getBaiChui()
    
    var baiChuiList = [bc1,bc2,bc3]
    for(var i = 0; i < 6; i++){
      self.createLuoMu({
        father:self,
        pos:cc.p(290 + i*112,65),
        fun:function(item){
          for(var i in baiChuiList){
              if(judgeItemCrash({
                item1:item,
                item2:baiChuiList[i]
              }) && !baiChuiList[i].ifRun){
                var result = baiChuiList[i].addItem(item)
                if(result){
                  item.notMove = true
                  item.setVisible(false)
                }
                break
              }
          }
        }
      })
    }
  },
  createLuoMu:function(data){
    var pos = data.pos
    var fun = data.fun
    var father = data.father
    var luoMu = new cc.Sprite(res.lm4)
    luoMu.endPos = pos
    createTouchEvent({
      item:luoMu,
      begin:function(data){
       var item = data.item
       return !item.notMove
      },
      move:function(data){
        var item = data.item
        var delta = data.delta
        if(!item.notMove){
          item.x += delta.x 
          item.y += delta.y 
        }
      },
      end:function(data){
        var item = data.item
        if(fun){
          fun(item)
        }
        item.setPosition(item.endPos)
      }
    })
    luoMu.setPosition(pos)
    father.addChild(luoMu)
    return luoMu
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
        //self.speakeBykey("wenzi1")
      })
    }
  },
  initPeople: function() {
    this.nodebs = addPeople({
      id: "student",
      pos: cc.p(1030, 130)
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