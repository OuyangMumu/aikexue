//@author mu @16/5/11

var createCupFireAir = function(data){
    var data = data || {}
    var fireRoto = data.fireRoto || 0
    var fireVis = data.fireVis
    var boliVis = data.boliVis
    var node  = new cc.Node()
    if(fireVis==null){
        fireVis = true
    }
    if(boliVis==null){
        boliVis = true
    }

    var fireAir = new cc.Sprite("#fire00.png")
    fireAir.setPosition(1,96)
    node.addChild(fireAir)
    fireAir.setRotation(fireRoto)
    node.fireAir = fireAir
    fireAir.setVisible(fireVis)

    var cupfire = new cc.Sprite(res.cupfire)
    cupfire.setPosition(1,7)
    node.addChild(cupfire)
    
    var handboli = new cc.Sprite(res.handboli)
    handboli.setPosition(48,62)
    node.addChild(handboli)
    node.handboli = handboli
    handboli.setVisible(boliVis)

    var cupfireup = new cc.Sprite(res.cupfire)
    cupfireup.setPosition(0,186)
    node.addChild(cupfireup)
    cupfireup.setRotation(180)
    node.cupfireup = cupfireup
    cupfireup.setVisible(false)

    node.moveBoli = function(fun){
        var spawn = cc.sequence(cc.moveBy(0.5,cc.p(120,0)),cc.fadeOut(0.3))
        handboli.runAction(cc.sequence(spawn,cc.callFunc(function(){
            cc.log("move boli end fun")
            if (fun) {
                fun()
            }
        })))
    }

    node.showFire = function(fun){
        var fireAc = createAnimation({
                            frame:"fire%02d.png",
                            start:0,
                            end:57,
                            time: 0.2,
                        })
        fireAir.runAction(cc.sequence(fireAc,cc.callFunc(function(){
            if(fun){
                fun()
            }
        })))
    }

    return node
}
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
            loadPlist("fireAir")
        })
        this._super()
        var self = this
        this.expCtor({
          vis: false,
          setZ:800,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               if (!self.bgg) {
                  var bg = createBiaoge({
                       json: res.biao2,
                       isShowResult: true,
                       scale: 0.9,
                       inputNum:1,
                       inputLineChange:[true]
                  })

                  var that = bg.getBg()
                  createBgMoveSp({
                    father:that,
                    imgs:[
                        [res.bg_cs3,0],
                        [res.bg_cs4,1],
                    ],
                    vrimg:true,
                    pos:cc.p(270,-100),
                    dis:220,
                    //itemScale:0.5,
                    rectlist:[
                       cc.rect(160,134,150,130),
                       cc.rect(160,9,150,130),
                    ]
                  })
                  bg.ClearFun = function(){
                      that.clearData()
                  }
                  self.addChild(bg)
                  self.bgg = bg
               }
               var bg = self.bgg
               bg.show()
            }
          }
        })
        this.initTool()
        this.initPeople()
        return true
    },
    initTool:function(){
        var self = this
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
        
        self.expItems1 = 0
        self.expItems2 = 0
        this.toolbtn = createTool({
            pos:cc.p(350, 540),
            nums:2,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.41, 1.2),
            itempos:[cc.p(1,-13),cc.p(1,-14)],
            circlepos:cc.p(0,10),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:0.9,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                if(index==0){
                   if(self.expItems1==0){
                      self.expItems1++
                      item = new cc.Sprite(res.handcup3)
                      item.curkey = 0
                      return item
                   }else if(self.expItems1==1){
                      item = new cc.Sprite(res.handcup4)
                      item.curkey = 1
                      return item
                   }
                }else if(index==1){
                   if(self.expItems2==0){
                      self.expItems2++
                      item = new cc.Sprite(res.handcup2)
                      item.curkey = 0
                      return item
                   }else if(self.expItems2==1){
                      item = new cc.Sprite(res.handcup1)
                      item.curkey = 1
                      return item
                   }
                }
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
            },
            outfun:function(data){
              var item = data.sp
              var index = data.index
              if(index==0){
                  if(item.curkey==0){
                    item.setPosition(0,620)
                    item.setVisible(false)
                    item.removeListen()

                    var exp1 = createCupFireAir()
                    exp1.setPosition(280,120)
                    self.addChild(exp1)
                    self.exp1 = exp1
                  }else if(item.curkey == 1){
                    if(self.exp2){
                        item.setPosition(0,-520)
                        item.setVisible(false)
                        item.removeListen()
                        self.exp2.cupfireup.setVisible(true)
                        self.exp2.fireAir.setVisible(true)
                        self.exp2.handboli.setVisible(true)
                        self.exp2.moveBoli()
                    }
                  }
              }else if(index==1){
                  if(item.curkey==0){
                    if(self.exp1){
                        item.setPosition(0,-520)
                        item.setVisible(false)
                        item.removeListen()
                        self.exp1.cupfireup.setVisible(true)
                        self.exp1.moveBoli(function(){
                            self.exp1.showFire(function(){
                                self.speakeBykey("wenzi4")
                            })
                        })
                    }
                  }else if(item.curkey == 1){
                    item.setPosition(0,-520)
                    item.setVisible(false)
                    item.removeListen()

                    var exp2 = createCupFireAir({
                                fireRoto:180,
                                fireVis:false,
                                boliVis:false
                              })
                    exp2.setPosition(680,120)
                    self.addChild(exp2)
                    self.exp2 = exp2
                  }
              }
            },
            backfun:function(data){
                return false
            },
            counts:[2,2],
            father:toolnode,
            files:[res.item1,res.item2],
            gets:[null,null]
        })
        this.addChild(this.toolbtn,3)
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
                self.speakeBykey("wenzi3")
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
            key: "wenzi3",
            img:res.wenzi3,
            sound: res.zimp3
        })
        addContent({
            people: this.nodebs,
            key: "wenzi4",
            img:res.wenzi4,
            sound: res.zimp4
        })
    }  
})