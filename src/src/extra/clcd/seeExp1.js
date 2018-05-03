var curMusic = null
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this.load(function(){
           loadPlist("clz")
        })
        this._super()
        this.expCtor() 
        this.initUI() 
        this.initPeople()
        return true
    },
    initUI:function(){
      var self = this
      var wordBg = new cc.Sprite(res.wordBg)
      wordBg.setPosition(150,280)
      self.addChild(wordBg)
      var wordList = [
         "1.  桨叶",
         "2.  轮毂(gǔ)",
         "3.  桨距调节",
         "4.  制动器",
         "5.  低速轴",
         "6.  齿轮箱",
         "7.  发电机",
         "8.  控制器",
         "9.  风速计",
         "10. 风向标",
         "11. 吊舱",
         "12. 高速轴",
         "13. 偏航驱动器",
         "14. 偏航电机",
         "15. 塔架"
      ]
      
      self.allWord = []
      for(var i = 0; i < wordList.length; i++)
      {
        var word = createLayout({
                      size:cc.size(200,31),
                      color:cc.color(255,255,255),
                      op:0
                    })
        word.setPosition(0,(wordList.length-1 - i)*33)
        wordBg.addChild(word)
        self.allWord[i] = word
        word.index = i

        var lb = new cc.LabelTTF(wordList[i],"",26)
        lb.setColor(cc.color(0,0,0))
        word.addChild(lb)
        lb.setAnchorPoint(0,0.5)
        lb.setPosition(15,word.height/2)
        word.lb = lb

        createTouchEvent({
          item:word,
          begin:function(){
            return true
          },
          end:function(data){
            var item = data.item
            if(!item.ok){
              self.hideAll()
              item.ok = true
              self.showIndex(item.index)
            }else{
              item.ok = false
              item.lb.setColor(cc.color(0,0,0))
            }
          }
        })
      }
   
      var uiName = []
      for (var i = 1; i <= 15; i++) {
        uiName[i-1] = sprintf("a%d",i)
      };
      uiName.push("pd")
      uiName.push("jielunBtn")
      var node = loadNode(res.seeJson,uiName)
      self.addChild(node)
      self.node = node
      
      
      for (var i = 0; i < 15; i++) {
        var curSp = node[uiName[i]]
        curSp.nor = sprintf("a%d_nor.png",i+1)
        curSp.sel = sprintf("a%d_sel.png",i+1)
        curSp.index = i
        var touchRect = null
        if(!cc.sys.isNative){
          touchRect = cc.rect(-5,-5,curSp.width+10,curSp.height+10)
          cc.log("111111111")
        }
        createTouchEvent({
          item:curSp,
          rect:touchRect,
          begin:function(){
            return true
          },
          end:function(data){
            var item = data.item
            if(item.index==5){
              self.createTip()
            }
            if(!item.ok){
              self.hideAll()
              item.ok = true
              self.showIndex(item.index)
              //item.setTexture(item.sel)
            }else{
              item.ok = false
              item.setSpriteFrame(item.nor)
            }
          }
        })
      };

      var pto = new cc.Sprite(res.pto)
      pto.setPosition(10,0)
      node.pd.addChild(pto)
      node.pto = pto
      var seq = cc.sequence(cc.moveTo(0.5,cc.p(10,0)),cc.moveTo(0.5,cc.p(0,-20)))
      pto.runAction(cc.repeatForever(seq))

      node.jielunBtn.addClickEventListener(function(){
          self.nodebs.say({
            key:"wenzi6",
          })
      })
    },
    createTip:function(){
        var self = this 
        var node = this.node
        var pd = node.pd
        if(node.pto.isVisible()){
          node.pto.setVisible(false)
        }
        if(!pd.haveTip){
          var pdTip = new cc.Sprite(res.pdTip)
          pd.addChild(pdTip)
          pdTip.setAnchorPoint(0.1,0)
          pdTip.setPosition(10,-40)
          pd.haveTip = pdTip

          var pdMac = new cc.Sprite("#clz00.png")
          pdMac.setPosition(120,115)
          pdTip.addChild(pdMac)
          pdTip.pdMac = pdMac
          pdMac.playAc = function(){
            var pdMac = this
            this.stopAllActions()
            var ac = createAnimation({
                          frame:"clz%02d.png",
                          start:0,
                          end: 11,
                          time: 0.2,
                      })
            pdMac.runAction(cc.repeatForever(ac))
          }
          pdMac.stopPlayAc = function(){
            this.stopAllActions()
          }

          var zdl1 = new cc.Sprite(res.zdl1_nor)
          zdl1.setPosition(82,142)
          pdTip.addChild(zdl1)
          zdl1.nor = res.zdl1_nor
          zdl1.sel = res.zdl1_sel

          var zdl2 = new cc.Sprite(res.zdl2_nor)
          zdl2.setPosition(157,58)
          pdTip.addChild(zdl2)
          zdl2.nor = res.zdl2_nor
          zdl2.sel = res.zdl2_sel

          pdTip.ziNode = new cc.Node()
          pdTip.addChild(pdTip.ziNode)

          var zi1 = new cc.Sprite(res.zdl1)
          zi1.setPosition(100,-338)
          pdTip.ziNode.addChild(zi1)
          zi1.setVisible(false)

          var zi2= new cc.Sprite(res.zdl2)
          zi2.setPosition(100,-338)
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
              self.speakeBykey("wenzi1")
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
              self.speakeBykey("wenzi2")
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
    },
    hideAll:function(){
      var self = this
      for(var i=0; i<self.allWord.length; i++)
      {
        self.allWord[i].lb.setColor(cc.color(0,0,0))
        self.allWord[i].ok = false
        var curSp = self.node[sprintf("a%d",i+1)]
        if(curSp){
          curSp.ok = false
          curSp.setSpriteFrame(curSp.nor)
        }
      }
    },
    showIndex:function(index){
      var self = this
      var word = self.allWord[index]
      word.lb.setColor(cc.color(250,0,0))
      word.ok = true
      var curSp = self.node[sprintf("a%d",index+1)]
      if(curSp){
        curSp.ok = true
        curSp.setSpriteFrame(curSp.sel)
      }
      self.speakeBykey(sprintf("jg_tip%d",index))
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
                self.speakeBykey("wenzi5")    
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
            pos:cc.p(1010, 110)
        })
        this.addChild(this.nodebs,500)

        
        for(var i = 0; i<15; i++)
        {
          addContent({
            people: this.nodebs,
            key:sprintf("jg_tip%d",i),
            sound:res[sprintf("tipmp%d",i+1)]
          })
        }

        addContent({
            people: this.nodebs,
            key:"wenzi1",
            sound:res.zimp6
          })

        addContent({
            people: this.nodebs,
            key:"wenzi2",
            sound:res.zimp7
          })

        addContent({
            people: this.nodebs,
            key:"wenzi5",
            img:res.wenzi5,
            sound:res.zimp5
          })

        addContent({
          people: this.nodebs,
          key: "wenzi6",
          img:res.wenzi6,
          id:"result",
          sound: res.zimp8,
          offset: cc.p(30, 30),
          offbg: cc.p(40,40),
        })
    }
})