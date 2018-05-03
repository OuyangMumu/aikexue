var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp3",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {

        })
        var self = this
        this._super()
        this.expCtor({
          vis: false,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               if (!self.bgg) {
                  var bg = createBiaoge({
                      json: res.see3_bg,
                      isShowResult: false,
                      scale: 0.9
                  })
                  var that = bg.getBg()
                  createBgMoveSp({
                    father:that,
                    imgs:[
                        [res.paper1,0],
                        [res.paper2,1],
                        [res.paper3,2],
                        [res.paper4,3]
                    ],
                    pos:cc.p(200,60),
                    dis:110,
                    resultfather:self,
                    rectlist:[
                       cc.rect(215,250,237,87),
                       cc.rect(482,250,237,87),
                       cc.rect(215,137,237,87),
                       cc.rect(482,137,237,87)
                    ]
                  })
             
                  bg.upLoadFun = function(){
                      that.upResult()
                  }
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
        this.initUI()
        this.initPeople()

        return true
    },
    initUI: function(){

          var self = this

          var fdj = createFDJ({
                      father: self,
                      rootScale: 0.3,
                      type:3,
                      hidebtn:true,
                      perscale: 0.5,
                      max: 0.4,
                      min: 0.1,
                      seePos: [cc.p(100, 110)],
                      getPos: [cc.p(750, 130)],
                    })
          self.fdj = fdj

          fdj.get[0].setVisible(true)
          fdj.see[0].setVisible(true)
  
          fdj.createNew({
            key: "paper1",
            fun:function(){
               var spp = new cc.Sprite(res.caozhi)
               spp.setScale(0.655)
               spp.setPosition(580,350)
               return spp
            }
          })
      
         var spp = new cc.Sprite(res.caozhi1)
         spp.setPosition(580,350)
         this.addChild(spp)
         fdj.actMove()
         spp.onrect = cc.rect(spp.x-spp.width/2,spp.y-spp.height/2,spp.width,spp.height)
         spp.num = 0

         spp.runAction(cc.repeatForever(cc.sequence(
                        cc.delayTime(1),
                        cc.callFunc(function(){
                            if (cc.rectContainsPoint(spp.onrect, fdj.get[0].getPosition())) {
                              spp.num++
                              if (spp.num >= 3) {
                                self.nodebs.say({
                                  key: "wenzi5",
                                  force: true
                                })
                            
                                spp.stopAllActions()
                              }
                            } else {
                              spp.num = 0
                            }
                        })
                    )))

         safeAdd(self,fdj.get[0])
         safeAdd(self,fdj.see[0])
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "wenzi4",
                    force: true
                })
            })
        }
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs);

        addContent({
            people: this.nodebs,
            key: "wenzi4",
            sound: res.zimp4,
            img: res.wenzi4,
        })
        addContent({
            people: this.nodebs,
            key: "wenzi5",
            sound: res.zimp5,
            img: res.wenzi5,
        })
    }
})