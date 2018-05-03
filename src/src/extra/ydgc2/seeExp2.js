var seeExp2 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp2",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
           loadPlist("infoIntro")
           loadPlist("infopic")
        })
        var self = this
        this.expCtor({
          vis: false,
          setZ:800,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
              if (!self.bgg) {
                var bg = createBiaoge({
                  json: res.ydgc2_bg,
                  isShowResult: false,
                  scale: 0.9
                })
                self.bgnode.addChild(bg)
                self.bgg = bg
                self.bgg.slider = bg.getChildByName("slider").getChildByName("sliderI")
                self.bgg.slider.setVisible(true)
                self.bgg.intro = bg.getChildByName("clip").getChildByName("differ_intro")
                self.bgg.intro.initY = self.bgg.intro.y
              }
              var bg = self.bgg
              bg.setShowEndFun({
                in:function(){
                    createTouchEvent({
                        item:self.bgg.slider,
                        begin:function(){
                          return true
                        },
                        move:function(data){
                            var item = data.item
                            var delta = data.delta
                            var tempY = item.y + delta.y
                            if(tempY>=455){
                               tempY = 455
                            }else if(tempY<=95){
                               tempY = 95
                            }
                            item.y = tempY
                            self.bgg.intro.y = self.bgg.intro.initY + 4.42*(455 - item.y)
                        }
                    })
                },
                out:function(){
                  if(self.bgg.slider.removeListen)
                      self.bgg.slider.removeListen()
                }
              })
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
       self.bgnode = new cc.Node()
       self.addChild(self.bgnode,800)

       var uiname = ["inforightbtn","infoleftbtn",
           "infoNode","discriBg","tanjiuBtn"
       ]
       self.node = loadNode(res.see2,uiname)
       self.addChild(self.node)
       var node = self.node
       self.pnglist = [4,3,1,2,6,3,2,5,2,2]
       self.curCount = 1
       var closeMusic = function(){
          node.infomusicbtn.loadTextureNormal(res.music_nor)
          node.infomusicbtn.loadTexturePressed(res.music_sel)
          node.infomusicbtn.isOn = false
          self.nodebs.stopSay()
       }
       node.inforightbtn.addClickEventListener(function(){
          self.curCount++
          node.infoleftbtn.setVisible(true)
          if(self.curCount>=10){
             self.curCount = 10
             node.inforightbtn.setVisible(false)
          }
          self.createInfo(self.curCount)
          closeMusic()
       })
       node.infoleftbtn.addClickEventListener(function(){
          self.curCount--
          node.inforightbtn.setVisible(true)
          if(self.curCount<=1){
             self.curCount = 1
             node.infoleftbtn.setVisible(false)
          }
          self.createInfo(self.curCount)
          closeMusic()
       })
       node.infoleftbtn.setVisible(false)
       
       var infomusicbtn = new ccui.Button(res.music_nor,res.music_sel)
       infomusicbtn.setPosition(302,343)
       node.discriBg.addChild(infomusicbtn)
       node.infomusicbtn = infomusicbtn
       infomusicbtn.addClickEventListener(function(sender,type){
          var nor = res.music_nor
          var sel = res.music_sel
          if(!sender.isOn){
              sender.isOn = true
              nor = res.music_sel
              sel = res.music_nor
              self.nodebs.say({
                  key: sprintf("music%d",self.curCount),
                  force: true
              })
          }else{
             sender.isOn = false
             self.nodebs.stopSay()
          }
          sender.loadTextureNormal(nor)
          sender.loadTexturePressed(sel)
       })
       node.tanjiuBtn.addClickEventListener(function(){
            self.nodebs.say({
                key: "jielun2",
            })
       })
       self.createInfo(self.curCount)
    },
    createInfo:function(index){
       var self = this
       var node = self.node
       node.infoNode.removeAllChildren()
       node.infoNode.btnlist = []
       var title = new cc.Sprite(sprintf("#intro_t%d.png",index))
       title.setPosition(320,380)
       node.infoNode.addChild(title)
       
       var neirong = new cc.Sprite(sprintf("#intro%d.png",index))
       neirong.setPosition(465,190)
       neirong.setScale(1.05)
       node.infoNode.addChild(neirong)
       
       var pngnode = new cc.Node()
       pngnode.setPosition(20,290)
       node.infoNode.addChild(pngnode)

       var onepng = new cc.Sprite(sprintf("#infopic%d_1.png",index))
       onepng.setAnchorPoint(cc.p(0,1))
       pngnode.addChild(onepng)
       var btnlen = self.pnglist[index-1]
       pngnode.fuNum = index
       if(btnlen>1){
            for(var i = 0; i<btnlen; i++){
               var btn = new ccui.Button(res[sprintf("pngbtn%d_nor",i+1)],
               res[sprintf("pngbtn%d_sel",i+1)])
               btn.index = i
               btn.nor = res[sprintf("pngbtn%d_nor",i+1)]
               btn.sel = res[sprintf("pngbtn%d_sel",i+1)]
               btn.setPosition(46+35*i,316)
               node.infoNode.addChild(btn)
               node.infoNode.btnlist.push(btn)
               btn.addClickEventListener(function(sender,type){
                   pngnode.removeAllChildren()
                   var curimgnum = sender.index+1
                   for(var i=0; i<node.infoNode.btnlist.length; i++){
                      node.infoNode.btnlist[i].loadTextureNormal(node.infoNode.btnlist[i].nor)
                      node.infoNode.btnlist[i].loadTexturePressed(node.infoNode.btnlist[i].sel)
                   }
                   sender.loadTextureNormal(sender.sel)
                   sender.loadTexturePressed(sender.nor)
                   var resZi = "#infopic"+pngnode.fuNum+"_"+curimgnum+".png"
                   var onepng = new cc.Sprite(resZi)
                   onepng.setAnchorPoint(cc.p(0,1))
                   if(sender.y>320){
                      for(var k=0; k<node.infoNode.btnlist.length; k++){
                         node.infoNode.btnlist[k].y = 310
                      }
                   }
                   var curSize = getSize(resZi)
                   if(curSize.height>=290){
                     onepng.setPosition(0,15)
                      for(var k=0; k<node.infoNode.btnlist.length; k++){
                         node.infoNode.btnlist[k].y = 325
                      }
                   }
                   pngnode.addChild(onepng)
               })
            }
       }
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500)
       
        for(var i=1; i<=10; i++){
          var musicStr = sprintf("music%d",i)
          addContent({
              people: this.nodebs,
              key: musicStr,
              sound: res[musicStr],
          })
        }
        addContent({
           people: this.nodebs,
           key: "jielun2",
           img:res.jielun2,
           id:"result",
           sound: res.jielunmp2,
           offset: cc.p(40, 30),
           offbg: cc.p(40,50),
        })
    }
})