//@author mu @14/5/10
var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")

        loadPlist("waterOut")
        loadPlist("waterDi")
        loadPlist("juan")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        var self = this
        var xue1_1 = new cc.Sprite(res.xue1_1)
        xue1_1.setAnchorPoint(0,0)

        var waterOut = new cc.Sprite("#waterOut00.png")
        waterOut.setPosition(256,225)
        xue1_1.addChild(waterOut)
        waterOut.runAction(cc.repeatForever(
           createAnimation({
                              frame:"waterOut%02d.png",
                              start:0,
                              end: 39,
                              time: 0.1
                          })
        ))

        var waterDi = new cc.Sprite("#waterDi00.png")
        waterDi.setPosition(218,429.5)
        xue1_1.addChild(waterDi)
        waterDi.runAction(cc.repeatForever(
           createAnimation({
                              frame:"waterDi%02d.png",
                              start:0,
                              end: 11,
                              time: 0.1
                          })
        ))


        var createSprite = function(data){
            var imgs = data.img
            var pos = data.pos
            var showimg = data.showimg
            var posTwo = data.posTwo
            var imgBG = new cc.Sprite(res.xuebg)
            imgBG.setAnchorPoint(0,0)

            var img = new cc.Sprite(imgs)
            img.setPosition(pos)
            imgBG.addChild(img)

            var shows = new cc.Sprite(showimg)
            shows.setPosition(posTwo)
            imgBG.addChild(shows)

            return imgBG
        }
        var nodelist = self.initPagegsr({
                          imgs:[
                              [xue1_1],
                              [
                                createSprite({
                                  img:res.xue2_1,
                                  pos:cc.p(728,221),
                                  showimg:res.img_1,
                                  posTwo:cc.p(199,214)
                                }),
                                createSprite({
                                  img:res.xue2_2,
                                  pos:cc.p(730,240),
                                  showimg:res.img_2,
                                  posTwo:cc.p(193,215)
                                }),
                                createSprite({
                                  img:res.xue2_3,
                                  pos:cc.p(733,235),
                                  showimg:res.img_3,
                                  posTwo:cc.p(189,220)
                                }),
                                createSprite({
                                  img:res.xue2_4,
                                  pos:cc.p(732,218),
                                  showimg:res.img_4,
                                  posTwo:cc.p(195,221)
                                }),
                                createSprite({
                                  img:res.xue2_5,
                                  pos:cc.p(740,220),
                                  showimg:res.img_5,
                                  posTwo:cc.p(225,227)
                                }),
                              ],
                          ],
                          pavedata:[
                              {nodeX: 40, nodeY:-20},
                              {nodeX: 40, nodeY:50},
                          ],
                          btns:[
                              [res.xue1btn_nor,res.xue1btn_sel,res.xue1btn_dis],             
                              [res.xue2btn_nor,res.xue2btn_sel,res.xue2btn_dis]
                          ],
                          btnpos:[
                              cc.p(430,593),
                              cc.p(700,593)
                          ],
                          btnSkipbackFun:function(index){
                             if(index==1){
                                if(!self.xue6){
                                  self.createOnePaper()
                                }
                                self.xue6.resetAndShow()
                                self.showOrHideTwo(false,index)
                             }else{
                                self.img_page.setVisible(true)
                                self.xue6.stopAndHide()
                             }
                          }
                      })
        self.nodelist = nodelist
        return true
    },
    showOrHideTwo:function(vis,index){
        var self = this
        var nodelist = self.nodelist
        if(vis){
          nodelist[index].changepaveViewPos(0, 120)    
        }else{
          nodelist[index].getPageViewNode().y = -600
          nodelist[index].getPageViewNode().jdt.y = -600 
        } 
        self.img_page.setVisible(vis)
        self.btnright.setVisible(vis)  
    },
    createOnePaper:function(){
       var self = this
       self.xue6 = new cc.Sprite(res.xue2_6)
       self.xue6.setPosition(getMiddle(0,100))
       self.addChild(self.xue6)

       var juanUp = new cc.Sprite(res.juanUp)
       juanUp.setPosition(400,-100)
       self.xue6.addChild(juanUp)

       var juanDown = new cc.Sprite(res.juanDown)
       juanDown.setPosition(400,-150)
       self.xue6.addChild(juanDown)

       var juan = new cc.Sprite("#juan00.png")
       juan.setPosition(378,-100)
       self.xue6.addChild(juan)
       self.xue6.juan = juan

       var jt = new cc.Sprite(res.img_6)
       jt.setPosition(470,-50)
       self.xue6.addChild(jt)
       jt.setScale(0.7)
       jt.setRotation(40)
       var lb = new cc.LabelTTF("解开查看","",30)
       lb.setPosition(50,120)
       lb.setColor(cc.color(200,0,0))
       jt.addChild(lb)
       lb.setRotation(-40)

       self.xue6.palyAC = function(fun){
          var juan = this.juan
          juan.stopAllActions()
          var ac = createAnimation({
                            frame:"juan%02d.png",
                            start:0,
                            end: 19,
                            time: 0.08,
                            fun:function(){
                              self.xue6.setVisible(false)
                              if(fun){
                                 fun()
                              }
                            }
                          })
          juan.runAction(ac)
       }
       self.xue6.stopAndHide = function(){
          var juan = this.juan
          this.setVisible(false)
          juan.stopAllActions()
       }
       self.xue6.resetAndShow = function(){
         var juan = this.juan
         juan.stopAllActions()
         juan.setSpriteFrame("juan00.png")
         juan.disListen(false)
         this.setVisible(true)
       }
   
       createTouchEvent({
          item:juan,
          begin:function(data){
            self.xue6.palyAC(function(){
                self.showOrHideTwo(true,1)
            })
            juan.disListen(true)
            return false
          }
       })
    }
})

