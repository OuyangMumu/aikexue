//@author mu @16/5/11
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
            loadPlist("huoyan")
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
                      scale: 0.9,
                      downNums:2,
                      downData:{
                        nums:2,
                        bufs:[
                          [null,res.bg_cs3,res.bg_cs4],
                          [null,res.bg_cs3,res.bg_cs4]
                        ],
                        keys:[
                           1,2
                        ]
                      }
                  })
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
    initUI:function(){
        var self = this
        uiName = ["lazhu1","lazhu2","water1","water2","boli"]
        var node = loadNode(res.doJson2,uiName)
        self.addChild(node)
        var nodeAddHuo = function(){
          var lazhu = this
          if(!lazhu.huo){
             var huo = new cc.Sprite("#huoyan00.png")
             huo.setPosition(15,120)
             huo.setAnchorPoint(0.5,0)
             lazhu.addChild(huo)
             lazhu.huo = huo
             huo.addYan = function(){
                var huo = this
                if(huo.yan){
                   huo.yan.stopAllActions()
                   huo.yan.removeFromParent()
                   huo.yan = null
                }
                var lazhuAir = createWaterAir({
                                total: 10,
                                width: 10,
                                height: 5,
                                canOp:true
                              })
                lazhuAir.setScale(0.3,0.7)
                lazhuAir.setPosition(13,130)
                lazhu.addChild(lazhuAir)
                lazhuAir.setOpacity(200)
                huo.yan = lazhuAir
                huo.yan.runAction(cc.sequence(
                   cc.delayTime(4),
                   cc.fadeOut(5),
                   cc.callFunc(function(){
                        cc.log("remove yan")
                        if(huo.yan){
                           huo.yan.stopAllActions()
                           //huo.yan.removeFromParent()
                           huo.yan = null
                        }
                   })
                ))
             }
             huo.playAc1 = function(){
                  var huo = this
                  var ac = createAnimation({
                    frame:"huoyan%02d.png",
                    start:0,
                    end:19,
                    time: 0.1,
                  })
                  huo.stopAllActions()
                  huo.runAction(cc.repeatForever(ac))
             }
             huo.playAc2 = function(){
                var huo = this
                huo.setVisible(true)
                var ac = cc.sequence(
                    cc.scaleTo(2,0),
                    cc.callFunc(function(){
                       huo.setVisible(false)
                       huo.addYan()
                    })
                )
                var seq = cc.sequence(
                  cc.delayTime(3.5),
                  ac
                )
                
                huo.runAction(seq)
             }
             huo.playAc1()
          }
        }
        node.lazhu1.addHuo = nodeAddHuo
        node.lazhu1.addHuo()

        node.lazhu2.addHuo = nodeAddHuo
        node.lazhu2.addHuo()
        
        node.boli.initPos = node.boli.getPosition()
        node.water1.fatherLz = node.lazhu1
        node.water2.fatherLz = node.lazhu2
        node.waterList = [node.water1,node.water2]
        createTouchEvent({
            item:node.boli,
            begin:function(data){
               var result = judgeOpInPos(data)
               return result
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(!item.noMove){
                   item.x += delta.x
                   item.y += delta.y
                   for (var i = 0; i < node.waterList.length; i++) {
                       var cursp = node.waterList[i]
                       if(judgeItemCrash({item1:item,item2:cursp})){
                           item.noMove = true
                           var wopos = getWorldPos(cursp)
                           wopos = cc.p(wopos.x-20,wopos.y-10)
                           item.setPosition(wopos)
                           item.disListen(false)
                           var lz = cursp.fatherLz
                           lz.huo.playAc2()
                           break  
                       }
                   }
                }
            },
            end:function(data){
                var item = data.item
                if(!item.noMove){
                    item.setPosition(item.initPos)
                }
            }
        })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            //self.toolbtn.show()
            self.nodebs.show(function() {
                self.speakeBykey("wenzi3")
            })
        }
    },
    speakeBykey:function(key,status){
    var self = this
    if(!status){
        if(!self[key]){
            self[key] = true
            this.nodebs.say({
                key: key,
                force: true
            })  
        } 
    }else{
        dialogControl.AddDialog("Tips", {
                    res: res[key],
                    face: 1,
                    confirmBtn: true,
                    father: self
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
            sound: res.zimp6
        })
    }  
})