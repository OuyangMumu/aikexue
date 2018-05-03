var curMusic = null
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this.load(function(){
          loadPlist("allpd")
          loadPlist("stones")
        })
        this._super()
        this.expCtor() 
        this.initUI() 
        this.initPeople()
        return true
    },
    initUI:function(){
      var self = this
      var uiName = ["stone","pd","seetip1"]
      var node = loadNode(res.seeJson,uiName)
      self.addChild(node)

      var stone = new cc.Sprite("#stone00.png")
      stone.setPosition(350,77)
      node.stone.addChild(stone)
      var ac = createAnimation({
                              frame:"stone%02d.png",
                              start:0,
                              end: 19,
                              time: 0.1,
                          })
      stone.runAction(cc.repeatForever(ac))

      var xpd = new cc.Sprite("#xpd00.png")
      xpd.setPosition(3.5,-8)
      node.pd.addChild(xpd)
      var ac1 = createAnimation({
                              frame:"xpd%02d.png",
                              start:0,
                              end: 17,
                              time: 0.1,
                          })
      xpd.runAction(cc.repeatForever(ac1))


      var seetip2 = new cc.Sprite(res.seetip2)
      seetip2.setPosition(78,83)
      node.pd.addChild(seetip2)

      var pto = new cc.Sprite(res.pto)
      pto.setPosition(10,-20)
      seetip2.addChild(pto)
      var seq = cc.sequence(cc.moveTo(0.5,cc.p(0,-30)),cc.moveTo(0.5,cc.p(10,-20)))
      pto.runAction(cc.repeatForever(seq))

      var createTip = function(){
          var pd = node.pd 
          if(!pd.haveTip){
            var pdTip = new cc.Sprite(res.pdTip)
            pd.addChild(pdTip)
            pdTip.setAnchorPoint(1,0.2)
            pdTip.setPosition(-24,45)
            pd.haveTip = pdTip

            var pdMac = new cc.Sprite("#dpd00.png")
            pdMac.setPosition(122,105)
            pdTip.addChild(pdMac)
            pdTip.pdMac = pdMac
            pdMac.playAc = function(){
              var pdMac = this
              this.stopAllActions()
              var ac = createAnimation({
                            frame:"dpd%02d.png",
                            start:0,
                            end: 4,
                            time: 0.2,
                        })
              pdMac.runAction(cc.repeatForever(ac))
            }
            pdMac.stopPlayAc = function(){
              this.stopAllActions()
            }

            var zdl1 = new cc.Sprite(res.zdl1_nor)
            zdl1.setPosition(175,178)
            pdTip.addChild(zdl1)
            zdl1.nor = res.zdl1_nor
            zdl1.sel = res.zdl1_sel

            var zdl2 = new cc.Sprite(res.zdl2_nor)
            zdl2.setPosition(90,26)
            pdTip.addChild(zdl2)
            zdl2.nor = res.zdl2_nor
            zdl2.sel = res.zdl2_sel

            pdTip.ziNode = new cc.Node()
            pdTip.addChild(pdTip.ziNode)

            var zi1 = new cc.Sprite(res.zdl1)
            zi1.setPosition(-150,10)
            pdTip.ziNode.addChild(zi1)
            zi1.setVisible(false)

            var zi2= new cc.Sprite(res.zdl2)
            zi2.setPosition(-150,10)
            pdTip.ziNode.addChild(zi2)
            zi2.setVisible(false)

            createTouchEvent({
              item:zdl1,
              begin:function(data){
                var item = data.item
                zdl2.setTexture(zdl2.nor)
                item.setTexture(item.sel)
                zi1.setVisible(true)
                zi2.setVisible(false)
                self.speakeBykey("wenzi2")
                return true
              }
            })
            createTouchEvent({
              item:zdl2,
              begin:function(data){
                var item = data.item
                zdl1.setTexture(zdl1.nor)
                item.setTexture(item.sel)
                zi1.setVisible(false)
                zi2.setVisible(true)
                self.speakeBykey("wenzi3")
                return true
              }
            })

          }
          if(!pd.haveTip.isShow){
            pd.haveTip.stopAllActions()
            addShowType({
               item:pd.haveTip,
               time:0.2,
               show:"scale",
               fun:function(){
                 pd.haveTip.isShow = true
                 pd.haveTip.pdMac.playAc()
               }
            })
          }else{
            pd.haveTip.stopAllActions()
            addShowType({
               item:pd.haveTip,
               time:0.2,
               show:"zoom",
               fun:function(){
                 pd.haveTip.isShow = false
                 pd.haveTip.pdMac.stopPlayAc()
               }
            })
          }
      }

      createTouchEvent({
        item:xpd,
        begin:function(data){
          var item = data.item
          if(seetip2){
            seetip2.removeFromParent()
            seetip2 = null
          }
          createTip()
          return true
        }
      })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
              self.nodebs.say({
                          key:"wenzi4",
                          force:true,
                          fun:function(){
                            self.speakeBykey("wenzi1")
                          }
                        })
            })
        }
    },
    speakeBykey:function(key){
      if(curMusic!=key){
        curMusic = key
        this.nodebs.say({
          key: key,
          force:true,
          fun:function(){
            curMusic = null
          }
        })
      }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500)

        addContent({
          people: this.nodebs,
          key: "wenzi1",
          sound: res.zimp5
        })
        addContent({
          people: this.nodebs,
          key: "wenzi2",
          sound: res.zimp6
        })
        addContent({
          people: this.nodebs,
          key: "wenzi3",
          sound: res.zimp7
        })
        addContent({
          people: this.nodebs,
          key: "wenzi4",
          img:res.wenzi4,
          sound: res.zimp4
        })
    }
})