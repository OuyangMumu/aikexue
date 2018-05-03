var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
           
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
                      json: res.bg_biao,
                      scale: 0.9
                  })
                  var that = bg.getBg()
                  var itemlist = []
                  var numlist = [0,3,1,2,4,5]
                  for (var i = 1; i < 7; i++) {
                      var item = that.getChildByName("zibg"+i)
                      item.teamnum = numlist[i-1]
                      itemlist.push(item)
                  }
                  self.createBgMoveSp({
                    father:that,
                    imgs:itemlist,
                    rectlist:[
                       cc.rect(258,134,245,60),
                       cc.rect(508,134,245,60),
                       cc.rect(258,70,245,60),
                       cc.rect(508,70,245,40),
                       cc.rect(258,6,245,60),
                       cc.rect(508,6,245,40)
                    ]
                  })
                  bg.setClear(function(){
                    for (var i = 1; i < 7; i++) {
                      var item = bg.getBg().getChildByName("zibg"+i)
                      item.setPosition(item.initpos)
                      item.setOpacity(255)
                      item.getChildren()[0].setVisible(false)
                      item.disListen(false)
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
       var seetitle = new cc.Sprite(res.seetitle)
       seetitle.setPosition(getMiddle(0,240))
       self.addChild(seetitle)

       var seeimg1 = new cc.Sprite(res.seeimg1)
       seeimg1.setPosition(getMiddle(-220,40))
       self.addChild(seeimg1)

       var seeimg2 = new cc.Sprite(res.seeimg2)
       seeimg2.setPosition(getMiddle(220,40))
       self.addChild(seeimg2)

       self.createSliderNode({
         father:self,
         pos:cc.p(200,30)
       })
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
                      //safeAdd(item.getParent(), item)
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
                                  child.setVisible(true)
                                  item.setCascadeOpacityEnabled(false)
                                  item.setOpacity(0)
                                  item.setPosition(rectlist[i].x + rectlist[i].width / 2,
                                  rectlist[i].y + rectlist[i].height / 2)
                                  rectsplist[i] = item
                                  item.disListen()
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
    createSliderNode:function(data){
      loadPlist("tieChose")
      var father = data.father
      var pos = data.pos
      
      var btnAc = function(btn){
        var seq = cc.sequence(
           cc.moveBy(0.3,cc.p(5,0)),
           cc.moveBy(0.3,cc.p(-5,0))
        )
        btn.runAction(cc.repeatForever(seq))
      }

      var parentNode = new cc.Node()
      parentNode.setPosition(pos)
      father.addChild(parentNode)

      parentNode.leftbtn = new ccui.Button(res.btn_arrow_normal,res.btn_arrow_select)
      parentNode.leftbtn.setPosition(-50,80)
      parentNode.addChild(parentNode.leftbtn)
      btnAc(parentNode.leftbtn)
      parentNode.leftbtn.addClickEventListener(function(){
          this.setVisible(false)
          parentNode.rightbtn.setVisible(true)
          parentNode.sliderNode.stopAllActions()
          parentNode.sliderNode.runAction(cc.moveBy(0.3,cc.p(635,0)))
          parentNode.hideSp(2)
      })
      parentNode.leftbtn.setVisible(false)
      
      parentNode.rightbtn = new ccui.Button(res.btn_arrow_normal,res.btn_arrow_select)
      parentNode.rightbtn.setPosition(680,80)
      parentNode.rightbtn.setRotation(180)
      parentNode.addChild(parentNode.rightbtn)
      btnAc(parentNode.rightbtn)
      parentNode.rightbtn.addClickEventListener(function(){
          this.setVisible(false)
          parentNode.leftbtn.setVisible(true)
          parentNode.sliderNode.stopAllActions()
          parentNode.sliderNode.runAction(cc.moveBy(0.3,cc.p(-635,0)))
          parentNode.hideSp(1)
      })
      
      parentNode.hideSp = function(status){
        var pandun = true
        for(var i=0; i<8; i++){
          if(status==1){
            pandun = i<4? true:false
            parentNode.splist[i].disListen(pandun)
          }else{
            pandun = i<4? false:true
            parentNode.splist[i].disListen(pandun)
          }
        }
      }
      
      parentNode.showBigsp = function(index){
          var btnoffset = cc.p(32,29)
          parentNode.imgsnode.removeAllChildren()
          var scaleimg = new cc.Sprite(res[parentNode.bgList[index]])
          scaleimg.setPosition(350,320)
          scaleimg.index = index
          if(index==0){
            btnoffset = cc.p(32,38)
          }
          scaleimg.setOpacity(150)
          scaleimg.runAction(cc.sequence(cc.moveBy(0.1, 0, 10),
                cc.callFunc(function() {
                      scaleimg.setOpacity(255);
                })
          ))
          var closebtn = new ccui.Button(res.btn_chacha_nor, res.btn_chacha_sel)
          closebtn.setPosition(scaleimg.width-btnoffset.x,scaleimg.height-btnoffset.y)
          closebtn.setScale(1)
          scaleimg.addChild(closebtn)
          closebtn.addClickEventListener(function() {
                this.getParent().removeFromParent(true)
          })
          parentNode.imgsnode.addChild(scaleimg)
      }
      
      var lay = createLayout({
          size:cc.size(630,140),
          op : 0,
          clip : true
      })
      parentNode.addChild(lay)
      var sliderNode = new cc.Node()
      lay.addChild(sliderNode)
      parentNode.sliderNode = sliderNode

      parentNode.imgsnode = new cc.Node()
      parentNode.addChild(parentNode.imgsnode,100)
      
      var imglist = []
      parentNode.bgList = []
      for(var k=1; k<=8; k++){
        imglist.push(sprintf("#tie%d0000",k))
        parentNode.bgList[k-1] = sprintf("btie%d",k)
      }
      parentNode.splist = []
      for(var i=0; i<imglist.length; i++){
         var sp = new cc.Sprite(imglist[i])
         sliderNode.addChild(sp)
         sp.setPosition(77+i*160,70)
         sp.index = i
         parentNode.splist[i] = sp
         createTouchEvent({
           item:sp,
           begin:function(data){
            var item = data.item
            parentNode.showBigsp(item.index)
            return true
           }
         })
      }
      parentNode.hideSp(4,8)
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
            self.nodebs.show(function() {
                self.speakeBykey("wenzi1")
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
            img:res.wenzi1,
            sound: res.zimp1
        })
    }
})