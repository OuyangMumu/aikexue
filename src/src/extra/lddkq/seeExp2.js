var curMusic = null
var seeExp2 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp2",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this.load(function(){

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
                      json: res.biao1,
                      scale: 0.9,
                      downNums:3,
                      inputNum:1,
                      inputLineChange:[true],
                      downData:{
                        nums:3,
                        scale:1.3,
                        bufs:[
                          [null,res.bg_cs1,res.bg_cs2],
                          [null,res.bg_cs1,res.bg_cs2],
                          [null,res.bg_cs1,res.bg_cs2]
                        ],
                        keys:[
                           1,1,1
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
        var uiName = ["xlazhu","xfire","hand1","hand2","hand3","tg","zb1","zb2","test1","test2"]
        var node = loadNode(res.seeJson2,uiName)
        self.addChild(node)
        
        node.zb1.energy = 0
        node.zb2.energy = 0

        var openAction = function(){
            var zb = this
            if(!zb.isPlaying){
               zb.isPlaying = true
               zb.stopActionByTag(444)
               zb.stopActionByTag(555)
               var seq = cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
                   if(zb.energy<50){
                        if(!node.hand3.dingZhu){
                           zb.stopActionByTag(444)
                           zb.isPlaying = false
                        }else{
                           zb.energy++
                        }
                   }else{
                       zb.stopActionByTag(444)
                   }                 
               }))
               var  rep =  cc.repeatForever(seq)
               rep.tag = 444
               zb.runAction(rep)
            }
        }

        var closeAction = function(){
            var zb = this
            if(zb.isPlaying){
               zb.isPlaying = false
               zb.stopActionByTag(555)
               zb.stopActionByTag(444)
               var seq = cc.sequence(cc.delayTime(2),cc.callFunc(function(){
                   if(zb.energy>0){
                    zb.energy = zb.energy - 1
                    if(!node.hand3.dingZhu){
                      node.tg.playAngel()
                    }
                    
                   }else{
                       zb.stopActionByTag(555) 
                   }                 
               }))

               var re = cc.repeatForever(seq)
               re.tag = 555
               zb.runAction(re)
            }
        }
        node.zb1.openAction = openAction
        node.zb2.openAction = openAction

        node.zb1.closeAction = closeAction
        node.zb2.closeAction = closeAction

        node.tg.resetZero = function(){
            node.tg.stopActionByTag(111)
            node.zb1.stopActionByTag(222)
            node.zb2.stopActionByTag(333)
            node.tg.setRotation(0)
            node.zb1.setRotation(0)
            node.zb2.setRotation(0)
        }
        node.tg.playAngel = function(){
          
            var zb1energy = node.zb1.energy
            var zb2energy = node.zb2.energy
            var angel = zb2energy - zb1energy

            node.tg.stopActionByTag(111)
            node.zb1.stopActionByTag(222)
            node.zb2.stopActionByTag(333)

            var time = 0.2*Math.abs(angel)

            node.tg.roac = cc.rotateTo(time,angel)
            node.tg.roac.tag = 111

            node.zb1.roac = cc.rotateTo(time,-angel)
            node.zb1.roac.tag = 222

            node.zb2.roac = cc.rotateTo(time,-angel)
            node.zb2.roac.tag = 333

            node.tg.runAction(node.tg.roac)
            node.zb1.runAction(node.zb1.roac)
            node.zb2.runAction(node.zb2.roac)
        }
        node.hand3.show = function(judge,change){
            var item = this
            if(judge){
               item.dingZhu = change
            }
            if(!item.dingZhu){
               item.dingZhu = true
               item.setVisible(false)
               item.setPosition(578.16,563)
               item.setRotation(-32)
               node.hand1.setVisible(true)
               node.hand2.setVisible(true)
               node.tg.resetZero()
            }else{
               item.dingZhu = false
               item.setVisible(true)
               node.hand1.setVisible(false)
               node.hand2.setVisible(false)
               item.setPosition(955,400)
               item.setRotation(0)
               node.tg.playAngel()
               node.zb1.closeAction()
               node.zb2.closeAction()
            }
        }

        createTouchEvent({
            item:node.hand3,
            begin:function(data){
               var item = data.item
               var result = judgeOpInPos(data)
               if(result){
                   node.xlazhu.setPosition(550,96)
                   item.show()
               }
               return false
            }
        })
        
        var seq = cc.sequence(cc.scaleTo(0.2,0.9,0.8),cc.scaleTo(0.2,1,1))
        node.xfire.runAction(cc.repeatForever(seq))
        var minDis = -240
        var maxDis = 600
        createTouchEvent({
            item:node.xlazhu,
            begin:function(){
                node.hand3.show(true,false)
                return true
            },
            move:function(data){
               var item = data.item
               var delta = data.delta
               var tempx = item.x + delta.x
               if(tempx>=maxDis){
                   tempx = maxDis
               }else if(tempx<=minDis){
                   tempx = minDis
               }
               item.x = tempx

                if(judgeItemCrash({item1:item,item2:node.test1})){
                    node.zb1.openAction()
                }else{
                    node.zb1.closeAction()
                }

                if(judgeItemCrash({item1:item,item2:node.test2})){
                    node.zb2.openAction()
                }else{
                    node.zb2.closeAction()
                }
            },
            end:function(data){
                var item = data.item
            }
        })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
                self.speakeBykey("wenzi2")
            })
        }
    },
    speakeBykey:function(key,status){
        var self = this
        if(!status){
            this.nodebs.say({
                key: key,
                force: true
            })  
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
            id:"boshi",
            pos:cc.p(1010, 110)
        })
        this.addChild(this.nodebs,500)
        
        addContent({
            people: this.nodebs,
            key:"wenzi2",
            img:res.wenzi2,
            sound:res.zimp2
          })
    }
})