//@author mu @14/5/10
var learnLayer = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  load: function() {
    loadPlist("learn_nums")
    loadPlist("tus")
  },
  ctor: function() {
    this._super();
    this.learnCtor()
    var self = this
    self.img_title.setVisible(true)
    self.img_title.loadTexture(res.studytip)
    self.img_title.setContentSize(getSize(res.studytip))
    self.img_title.setPosition(self.img_title.x, self.img_title.y + 8)
    self.img_page.setVisible(false)
    
    var tus = []
    for (var i = 0; i < 6; i++) {
      tus[i] = sprintf("#xtu%d.png",i+1)
    }
    var sps = []
    for (var i = 0; i < 6; i++) {
      sps[i] = new cc.Sprite(sprintf("#datu%d.png",i+1))
      sps[i].setPosition(400,300)
      self.addChild(sps[i])
      sps[i].setVisible(false)
      if(i==0){
        sps[i].setVisible(true)
      }
    }
    var list = createList({
                list:tus,
                num:3,
                arrow:"yellow",
                bgOp:0,
                ifPage:false,
                size:cc.size(220,440),
                clickFun:function(data){
                  var index = data.index
                  var item = data.item
                  showImg(index)
                  return false
                }
              })
    list.setScale(0.9)
    list.setPosition(800,300)
    self.addChild(list)
    
    var showImg = function(index){
        for (var i = 0; i < sps.length; i++){
          sps[i].setVisible(false)
          list.lay.list[i].setOpacity(255)
        }
        sps[index].setVisible(true)
        list.lay.list[index].setOpacity(180)
    }
    return true
  }
})