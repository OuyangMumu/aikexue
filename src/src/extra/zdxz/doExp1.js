//@author mu @16/5/11
var doExp1 = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  layerName: "doExp1",
  preLayer: "doLayer",
  ctor: function() { //创建时调用 未删除不会重复调用
    this.load(function() {

    });
    var self = this
    this._super()
    this.expCtor()
    this.initUI()
    this.initPeople()

    return true
  },
  initUI:function(){
      var self = this
      var uiname = ["mug","dotip1","tips2"]
      for(var i=1;i<7;i++){
         var str = "btn"+i
         var str1 = "btn"+(10*i)
         uiname.push(str)
         uiname.push(str1)
       }
      this.node = loadNode(res.do1,uiname)
      this.addChild(this.node)
      this.imgslist = [res.s5,res.s1,res.s4,res.s3,res.s2]
      this.jsonlist = [res.dbz,res.dyz,res.dnz,res.dtz,res.dxz]
      this.scaleList = [0.8,0.6,0.5,0.3,0.2]
      this.playFun = function(index,count){
         var acnode = ccs.load(self.jsonlist[index]).node
         acnode.getChildByName("sepian").setScaleY(0)
         var ac = ccs.load(self.jsonlist[index]).action
         ac.gotoFrameAndPlay(0,38,false)
         ac.setLastFrameCallFunc(function(){
            if(count>=4){
               self.node.mug.disListen(false)
            }
            ac.clearLastFrameCallFunc()
         })
         acnode.setPosition(90+40*count,42)
         acnode.index = index
         self.node.mug.addChild(acnode)
         acnode.runAction(ac)
      }
      this.count = 0

      for(var i=1;i<6;i++){
         var str = "btn"+i
         var item = this.node[str]
         item.index = i
         createTouchEvent({
            item:item,
            begin:function(data){
              var item = data.item
              var index = item.index
              var dstr = "btn"+(10*index)
              item.setVisible(false)
              self.node[dstr].setVisible(true)

              if(!item.touchSp){
                item.touchSp = new cc.Sprite(self.imgslist[index-1])
                item.touchSp.index = index
                item.touchSp.father = item
                item.touchSp.father1 = self.node[dstr]
                item.touchSp.palyfun = self.playFun
                item.touchSp.setPosition(850,300)
                self.addChild(item.touchSp)
                createTouchEvent({
                  item:item.touchSp,
                  begin:function(){
                    return true
                  },
                  move:function(data){
                    var item = data.item
                    var delta = data.delta
                    var tempx = item.x + delta.x
                    var tempy = item.y + delta.y
                    if(tempy>=530 && tempx>=200 && tempx<=650){
                      item.palyfun(item.index-1,self.count)
                      self.count++
                      item.removeListen()
                      item.father.removeListen()
                      item.father.setVisible(true)
                      item.father.setOpacity(80)
                      item.father1.setVisible(false)
                      item.setVisible(false)
                      item.y = 1000
                      return
                    }
                    item.setPosition(tempx,tempy)
                  }
                })
              }
                       
              for(var k=1;k<6;k++){
                  if(k!=index){
                    var btnstr = "btn"+(10*k)
                    var btnstr1 = "btn"+ k
                    self.node[btnstr].setVisible(false)
                    if(self.node[btnstr1].touchSp){
                      self.node[btnstr1].touchSp.removeFromParent()
                      self.node[btnstr1].touchSp = null
                    }
                    self.node[btnstr1].setVisible(true)
                  }
              }
              return true
            }
         })
      }


      self.node.mug.startFun = function(){
        for(var i in this.getChildren()){
          var sepian = this.getChildren()[i].getChildByName("sepian")
          var index = this.getChildren()[i].index
          cc.log(self.scaleList[index])
          sepian.runAction(cc.sequence(
               cc.scaleTo(2,0.36,self.scaleList[index]),
               cc.callFunc(function(){
                  self.node.dotip1.setVisible(true)
                  self.node.tips2.setVisible(false)
                  self.nodebs.say({
                    key: "xishui",
                    sameStop:true
                  })
               })
            ))
        }
      }

      createTouchEvent({
        item:self.node.mug,
        begin:function(data){
           return true
        },
        move:function(data){
              var item = data.item
              var delta = data.delta
              var tempx = item.x
              var tempy = item.y + delta.y
              if(tempy<=395){       
                item.removeListen()
                self.node.mug.startFun()  
                return
              }
              item.setPosition(tempx,tempy)
        }
      })
      self.node.mug.disListen(true)
  },
  myEnter: function() {
    this._super()
    var self = this
    this._super()
    if (this.nodebs) {
        var self = this
        self.nodebs.show(function(){
            
        })     
    }
  },
  initPeople: function() {
    this.nodebs = addPeople({
      id:"student",
      pos: cc.p(1010, 120)
    })
    this.addChild(this.nodebs, 900);

    addContent({
        people: this.nodebs,
        key: "xishui",
        sound: res.zimp1,
    })

  }
})