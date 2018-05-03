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

    var part1 = new cc.Sprite(res.part1)
    part1.setPosition(getMiddle(-20,-20))
    this.addChild(part1)
    self.part1 = part1
    if(!cc.sys.isNative){
        addMouseHover({
           item:part1,
           infun:function(){
             part1.setTexture(res.part2)
           },
           outfun:function(){
             part1.setTexture(res.part1) 
           }
        })
    }

    var part3 = new cc.Sprite(res.part3)
    part3.setPosition(getMiddle(10,10))
    this.addChild(part3)
    self.part3 = part3
    if(!cc.sys.isNative){
        addMouseHover({
           item:part3,
           infun:function(){
             part3.setTexture(res.part4)
           },
           outfun:function(){
             part3.setTexture(res.part3) 
           }
        })
    }
    
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
           this.part1.setPosition(this.part1.initPos)
           this.part3.setPosition(this.part3.initPos)
        }else{
           this.part1.setPosition(600,-600)
           this.part3.setPosition(600,-600)
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
            item.setTexture(res.part2)
            self.showOrHide(false)
            self.showByindex(item.index)
            return true
          }
        },
        end:function(data){
          var item = data.item
          item.setTexture(res.part1)
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
            item.setTexture(res.part4)
            self.showOrHide(false)
            self.showByindex(item.index)
            return true
          } 
        },
        end:function(data){
          var item = data.item
          item.setTexture(res.part3)
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
                [res.xue1_1,res.xue1_2],
                [res.xue2_1,res.xue2_2]
              ],
              pavedata: [{
                offsetx: 180,
                offsety: 40
              }, {
                offsetx: 190,
                offsety: 50
              }],
              btns: [
                [res.xue1btn_nor, res.xue1btn_sel, res.xue1btn_dis],
                [res.xue2btn_nor, res.xue2btn_sel, res.xue2btn_dis]
              ],
              btnpos: [
                cc.p(480, 595),
                cc.p(752, 595)
              ],
              father:self.listNode
            })
        break
        case 2:
            self.initPagegsr({
              imgs: [
                [res.xue3_1,res.xue3_2,res.xue3_3],
                [res.xue4_1,res.xue4_2],
                [res.xue5_1]
              ],
              pavedata: [{
                offsetx: 190,
                offsety: 10
              }, {
                offsetx: 190,
                offsety: 10
              },{
                offsetx: 0,
                offsety: 50
              }],
              btns: [
                [res.xue3btn_nor, res.xue3btn_sel, res.xue3btn_dis],
                [res.xue4btn_nor, res.xue4btn_sel, res.xue4btn_dis],
                [res.xue5btn_nor, res.xue5btn_sel, res.xue5btn_dis]
              ],
              btnpos: [
                cc.p(420, 595),
                cc.p(600, 595),
                cc.p(780, 595),
              ],
              father:self.listNode
            })
        break
    }
    self.gsrback.setVisible(true)
    self.img_page.setVisible(true)
  }
})