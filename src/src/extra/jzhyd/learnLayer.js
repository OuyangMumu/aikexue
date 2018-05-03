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
    var learnTitle = new cc.Sprite(res.xue1_5)
    learnTitle.setPosition(getMiddle(0,195))
    self.addChild(learnTitle)

    self.initPagegsr({
      imgs:[
          [res.xue1_1,res.xue1_2,res.xue1_3,res.xue1_4],
      ],
      pavedata:[
          {offsetx: 130, offsety:45},
      ],
      titlepng:res.studytip,
      titlepos:cc.p(0,10)
    })
    return true
  }
})