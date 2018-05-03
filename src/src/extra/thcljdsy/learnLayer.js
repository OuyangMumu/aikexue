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
    self.initPagegsr({
              imgs: [
                [res.xue1_1,res.xue1_2,res.xue1_3,res.xue1_4,
                res.xue1_5,res.xue1_6,res.xue1_7,res.xue1_8],
              ],
              pavedata: [{
                offsetx: 90,
                offsety: 20,
                jdtpos:cc.p(230,75)
              }],
              titlepng:res.studytip,
              titlepos:cc.p(0,10)
            })
    
    return true
  }
})