//@author mu @14/5/10
var learnLayer = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  load: function() {
    loadPlist("learn_nums")
  },
  ctor: function() {
    this._super();
    this.learnCtor()
    var self = this
    this.img_page.setVisible(false)
    this.img_title.setVisible(false)

    var mainNode = new cc.Node()
    self.addChild(mainNode)
    self.mainNode = mainNode

    var part1 = new cc.Sprite(res.part1)
    part1.setPosition(getMiddle(-220,40))
    mainNode.addChild(part1)
    self.part1 = part1
    if(!cc.sys.isNative){
        addMouseHover({
           item:part1,
           infun:function(){
            part1.setScale(1.05)
           },
           outfun:function(){
            part1.setScale(1)
           }
        })
    }

    var part2 = new cc.Sprite(res.part2)
    part2.setPosition(getMiddle(-220,-200))
    mainNode.addChild(part2)

    var part3 = new cc.Sprite(res.part3)
    part3.setPosition(getMiddle(220,40))
    mainNode.addChild(part3)
    self.part3 = part3
    if(!cc.sys.isNative){
        addMouseHover({
           item:part3,
           infun:function(){
            part3.setScale(1.05)
           },
           outfun:function(){
            part3.setScale(1)
           }
        })
    }

    var part4 = new cc.Sprite(res.part4)
    part4.setPosition(getMiddle(210,-200))
    mainNode.addChild(part4)
    
    self.addTocuhs()

    return true
  },
  addTocuhs:function(){
    var self = this
    self.part1.canTouch = true
    self.part3.canTouch = true
    self.part1.index = 1
    self.part3.index = 2
    self.part1.initPos = self.part1.getPosition()
    self.part3.initPos = self.part3.getPosition()

    self.listNode = new cc.Node()
    self.addChild(self.listNode)

    self.gsrback = new ccui.Button(res.gsrback_nor, res.gsrback_sel)
    self.gsrback.setPosition(300,593)
    self.addChild(self.gsrback)
    self.gsrback.setVisible(false)
    self.gsrback.addClickEventListener(function(){
        self.listNode.removeAllChildren()
        self.img_page.removeAllChildren()
        self.img_page.setVisible(false)
        self.showOrHide(true)
        self.gsrback.setVisible(false)
    })

    self.showOrHide = function(jude){
        if(jude){
          this.mainNode.setPosition(0,0)
        }else{
          this.mainNode.setPosition(0,3000)
        }
    }

  
    createTouchEvent({
        item:self.part1,
        swallow:false,
        begin:function(data){
          var item = data.item
          if(!item.canTouch){
            return false
          }
          if(judgeOpInPos(data) && judgeInside(data)){
            self.part3.canTouch = false
            item.setScale(1.05)
            return true
          }
        },
        end:function(data){
          var item = data.item
          item.setScale(1)
          self.showOrHide(false)
          self.showByindex(item.index)
          self.part3.canTouch = true
        }
    })

    createTouchEvent({
        item:self.part3,
        swallow:false,
        begin:function(data){
          var item = data.item 
          if(!item.canTouch){
            return false
          }
          if(judgeOpInPos(data) && judgeInside(data)){
            self.part1.canTouch = false
            item.setScale(1.05)
            return true
          } 
        },
        end:function(data){
          var item = data.item
          item.setScale(1)
          self.showOrHide(false)
          self.showByindex(item.index)
          self.part1.canTouch = true
        }
    })
  },
  showByindex:function(index){
    var self = this
    switch(index){
        case 1:
            self.initPagegsr({
              imgs: [
                [res.xue1_1,res.xue1_2]
              ],
              pavedata: [{
                offsetx: 130,
                offsety: 0
              }],
              father:self.listNode
            })
        break
        case 2:
            self.initPagegsr({
              imgs: [
                [res.xue2_1,res.xue2_2],
              ],
              pavedata: [{
                offsetx: 200,
                offsety: 40
              }],
              father:self.listNode
            })
        break
    }
    self.gsrback.setVisible(true)
    self.img_page.setVisible(true)
  }
})