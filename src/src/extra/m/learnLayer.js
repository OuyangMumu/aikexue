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

    var xue2 = new cc.Sprite(res.xue2_1)
    xue2.setScale(0.8)

    var xue2_2 = new cc.Sprite(res.xue2_2)
    xue2_2.setPosition(-290,340)
    xue2.addChild(xue2_2)
    xue2_2.setScale(1.05)

    self.initPagegsr({
              imgs: [
                [res.xue1_1,res.xue1_2,res.xue1_3,res.xue1_4,res.xue1_5],
                [xue2]
              ],
              pavedata: [{
                offsetx: 180,
                offsety: 25,
                jdtpos:cc.p(230,75)
              }, {
                nodeX: 868,
                nodeY: 250,
                jdtpos:cc.p(230,80)
              }],
              btns: [
                [res.xue1btn_nor, res.xue1btn_sel, res.xue1btn_dis],
                [res.xue2btn_nor, res.xue2btn_sel, res.xue2btn_dis]
              ],
              btnpos: [
                cc.p(430, 595),
                cc.p(732, 595)
              ]
            })
    
    return true
  }
})