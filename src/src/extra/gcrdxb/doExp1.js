//@author mu @16/5/11
var doExp1 = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  layerName: "doExp1",
  preLayer: "doLayer",
  ctor: function() { //创建时调用 未删除不会重复调用
    this.load(function(){
       loadPlist("imgs")
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
                  json: res.biao1,
                  isShowResult: false,
                  scale: 0.9
              })
              var that = bg.getBg()
              createBgMoveSp({
                father:that,
                imgs:[
                    ["#img1.png",0],
                    ["#img2.png",1],
                    ["#img3.png",2],
                    ["#img4.png",3],
                    ["#img5.png",4],
                    ["#img6.png",5]
                ],
                pos:cc.p(40,-70),
                dis:120,
                itemScale:0.9,
                resultfather:self,
                rectlist:[
                   cc.rect(11,227,203,125),
                   cc.rect(229,227,203,125),
                   cc.rect(446,227,203,125),
                   cc.rect(11,9,203,125),
                   cc.rect(229,9,203,125),
                   cc.rect(446,9,203,125)
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
  initUI:function(){
      var self = this
      self.curPing = 0
      var toolnode = new cc.Node()
      this.addChild(toolnode,5)
      this.toolnode = toolnode
      this.toolbtn = createTool({
          pos:cc.p(105, 500),
          nums:2,
          tri:"down",
          modify:cc.p(1, 1.2),
          devide:cc.p(1.5, 1.2),
          itempos:cc.p(1, -14),
          circlepos:cc.p(0, 15),
          showTime:0.3,
          moveTime:0.2,
          scale:0.8,
          itemScale:1,
          ifcircle: true,
          firstClick: function(data) {
              var item = data.sp
              var index = data.index
              if(index==0){
                return self.createXwj()
              }
              return true
          },
          clickfun:function(data){
              var item = data.sp
              item.data = data
              data.item = item
    
              return true
          },
          movefun:function(data){
             var item = data.sp
             var delta = data.delta
             var index = data.index
             item.x += delta.x
             item.y += delta.y
          },
          outfun:function(data){
             var item = data.sp
             var index = data.index
             var xwj = self.toolbtn.getindex(0)
             switch(index){
               case 0:
                  item.setPosition(730,280)
                  item.removeListen()
                  item.showHand(false)
                  var see = xwj.getSee({
                              ifMove: false,
                              pos: getMiddle(-170, 30),
                              scale: 0.5,
                          })
                  safeAdd(self, see)
                  self.speakeBykey("wenzi2")
               break
               case 1:
                  var result = false
                  if(self.canIn){
                      result = xwj.addItem({
                                  item:item,
                                  pos:cc.p(25,28)  
                               })
                  }
                  if(result){
                    item.removeListen()
                    var tex = res.ten1
                    switch(xwj.curZhq){
                      case "db":
                        tex = res.ten1
                      break
                      case "gb":
                        tex = res.ten2                          
                      break
                    }
                    xwj.setFile({
                                tex:tex,
                                scale:0.5,
                            })
                    self.inBo = true
                  }else{
                    item.setPosition(450,110)
                    self.speakeBykey("wenzi2")
                  }
               break
             }
             return true
          },
          father:toolnode,
          files:[res.item1,res.item2],
          gets:[null,res.biaoben]
      })
      this.addChild(this.toolbtn,3)
  },
  createXwj:function(){
      var self = this
      var xwj = createXwj({
                        zhqFun:function(name){
                          if(self.inBo){
                            switch(name){
                              case "db":
                                xwj.setFile({
                                  tex:res.ten1,
                                  scale: 0.5,
                                })
                              break
                              case "gb":
                                xwj.setFile({
                                  tex:res.ten2,
                                  scale: 0.5,
                                })                            
                              break
                            }
                          }
                        },
                        fgjFun:function(){
                          self.speakeBykey("wenzi3")
                          self.canIn = true
                        }

                    })
      return xwj
  },
  speakeBykey:function(key){
    this.nodebs.say({
      key: key,
      force:true 
    })
  },
  myEnter: function() {
    this._super()
    var self = this
    if (this.nodebs) {
        var self = this
        self.toolbtn.show()
        self.nodebs.show(function(){
            self.speakeBykey("wenzi1")
        })     
    }
  },
  initPeople: function() {
    this.nodebs = addPeople({
      id:"student",
      pos: cc.p(1030, 120)
    })
    this.addChild(this.nodebs, 900)
  
    for(var i = 1;i<=5;i++){
        keyname = "wenzi"+i
        music = "zimp"+i
        addContent({
            people: this.nodebs,
            key: keyname,
            img:res[keyname],
            sound:res[music]
        })
    }
  }
})