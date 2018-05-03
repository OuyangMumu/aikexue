//@author mu @16/5/11
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
        })
        this._super()
        var self = this
        this.expCtor({
          vis: false,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               if (!self.bgg) {
                  var bg = createBiaoge({
                      json: res.mfydf_bg,
                      scale: 0.9
                  })
                  var that = bg.getBg()
                  var itemlist = []
                  var numlist = [1,7,6,4,8,10,3,2,11,0,5,9]
                  for (var i = 1; i < 13; i++) {
                      var item = that.getChildByName("zibg"+i)
                      item.teamnum = numlist[i-1]
                      itemlist.push(item)
                  }
                  self.createBgMoveSp({
                    father:that,
                    imgs:itemlist,
                    rectlist:[
                       cc.rect(220,235,270,40),
                       cc.rect(490,235,270,40),
                       cc.rect(220,195,270,40),
                       cc.rect(490,195,270,40),
                       cc.rect(220,157,270,40),
                       cc.rect(490,157,270,40),
                       cc.rect(220,120,270,40),
                       cc.rect(490,120,270,40),
                       cc.rect(220,80,270,40),
                       cc.rect(490,80,270,40),
                       cc.rect(220,45,270,40),
                       cc.rect(490,45,270,40),
                    ]
                  })
                  self.biaogenode.addChild(bg)
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
          self.biaogenode = new cc.Node()
          self.addChild(self.biaogenode,1000)

          var tishi = new cc.Sprite(res.tishi2)
          tishi.setPosition(getMiddle(0,150))
          this.addChild(tishi)

          var rlist =[
            cc.rect(350,100,170,130),
            cc.rect(610,100,200,130)
          ]
          var fdjbtn = new cc.Sprite(res.img_fdj4)
          fdjbtn.setPosition(100,410)
          fdjbtn.setScale(0.3)
          this.addChild(fdjbtn)
          var fdjbtn1 = new cc.Sprite(res.fdj_hand)
          fdjbtn1.setPosition(fdjbtn.width+30,-20)
          fdjbtn1.setScale(3)
          fdjbtn.addChild(fdjbtn1)

          var fdjbtnTouch = new cc.Sprite(res.img_fdj4)
          fdjbtnTouch.setPosition(120,390)
          fdjbtnTouch.setOpacity(0)
          fdjbtnTouch.setScale(0.5)
          this.addChild(fdjbtnTouch)
         
          var fdj = createFDJ({
                      father: self,
                      rootScale: 0.2,
                      type:[3],
                      hidebtn:true,
                      perscale: 0.5,
                      max: 0.4,
                      min: 0.1,
                      seePos: [cc.p(450, 320)],
                      getPos: [cc.p(-100, 410)],
                    })
          self.fdj = fdj
          fdj.get[0].setVisible(false)
          fdj.see[0].setVisible(false)
          fdj.createNew({
            key: "donode",
            fun: function(){
               var desk = new cc.Sprite(res.desk)
               desk.setPosition(getMiddle(0,-300))
              
               var mifan = new cc.Sprite(res.mifan2)
               mifan.setPosition(desk.width/4+40,desk.height-50)
               mifan.setScale(0.3)
               desk.addChild(mifan)

               var midui = new cc.Sprite(res.midui)
               midui.setScale(0.3)
               midui.setPosition(3*desk.width/4-40,desk.height-60)
               desk.addChild(midui)

               return desk
            }
          })
          
          fdj.actMove({
                      isHideGet:true,
                    })

          createTouchEvent({
            item:fdjbtnTouch,
            begin:function(data){
               var pos = data.pos
               fdjbtn.setScale(0.35)
               self.fdj.get[0].setVisible(true)
               self.fdj.setGet(pos)
               tishi.setVisible(false)
               return true
            },
            move:function(data){       
              var delta = data.delta
              self.fdj.move(delta,0)
            },
            end:function(){
               fdjbtn.setScale(0.3)
            }
          })
          self.fdj.endfun = function(data){
              var item = data.item
              cc.log(item.getPosition())
              var temprect = cc.rect(fdjbtnTouch.x-fdjbtnTouch.width/2,
                fdjbtnTouch.y-fdjbtnTouch.height/2,fdjbtnTouch.width,fdjbtnTouch.height)
              if(cc.rectContainsPoint(temprect,item.getPosition())){
                 self.fdj.get[0].setVisible(false)
                 self.fdj.setGet(cc.p(-100,400))
              }
          }
          self.fdj.moveWithEvent = function(item){
                fdj.see[0].setVisible(false)
                for (var i = 0; i < rlist.length; i++) {
                  if (cc.rectContainsPoint(rlist[i], item.getPosition())) {
                    fdj.see[0].setVisible(true)
                  }
                }
          }        
    },
    createBgMoveSp:function(data){
      var father = data.father
      var imgs = data.imgs
      var rectlist = data.rectlist || []
      var rectsplist = []
      for (var i = 0; i < rectlist.length; i++)
            rectsplist.push(null)

      for (var i = 0; i < imgs.length; i++) {
            var item = imgs[i]
            item.index = i
            item.setLocalZOrder(1)
            item.initpos = item.getPosition()
            createTouchEvent({
                  item: item,
                  begin: function(data) {
                        var item = data.item
                        safeAdd(item.getParent(), item)
                        if (item.listindex) {
                              rectsplist[item.listindex] = null
                              item.listindex = null
                        }
                        return true
                  },
                  move: function(data) {
                        var item = data.item
                        var delta = data.delta
                        item.x += delta.x
                        item.y += delta.y
                  },
                  end: function(data) {
                        var item = data.item
                        for (var i in rectlist) {
                              if (cc.rectContainsPoint(rectlist[i], item.getPosition())){

                                    if(i != item.teamnum){
                                       break
                                    }                                       
                                    if (rectsplist[i]) {
                                          var itemb = rectsplist[i]
                                          itemb.setPosition(itemb.initpos)
                                          itemb.setLocalZOrder(1)
                                          rectsplist[itemb.listindex] = null
                                          itemb.listindex = null
                                    }
                                    var child = item.getChildren()[0]
                                    safeAdd(item.getParent(),child)
                                    child.setScale(1)
                                    child.setPosition(rectlist[i].x + rectlist[i].width / 2,
                                          rectlist[i].y + rectlist[i].height / 2)
                                    rectsplist[i] = item
                                    item.removeListen()
                                    item.setVisible(false)
                                    item.listindex = i
                                    item.setLocalZOrder(1)
                                    return
                              }
                        }
                        item.setPosition(item.initpos)
                        item.setLocalZOrder(1)
                        if (item.listindex)
                              rectsplist[item.listindex] = null
                        item.listindex = null
                  }
            })
      }
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                // self.nodebs.say({
                //     key: "wenzi4",
                //     force: true
                // })
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
            key: "wenzi4",
            sound: res.zimp4,
            img: "#wenzi40000",
        })
    }  
})