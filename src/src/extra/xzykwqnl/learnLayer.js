//@author mu @14/5/10
var learnLayer = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  load: function() {
    loadPlist("learn_nums")
  },
  ctor: function() {
    this._super()
    this.learnCtor()
    var self = this
    self.initPagegsr({
                      imgs:[
                        [res.xue1_1],
                        [res.xue2_1,res.xue2_2,res.xue2_3],
                        [res.xue3_1,res.xue3_2]
                      ],
                      pavedata:[
                        {offsetx: 130, offsety:40},
                        {offsetx: 150, offsety:10},
                        {offsetx: 150, offsety:50},
                      ],
                      btns:[
                        [res.xue1btn_nor,res.xue1btn_sel,res.xue1btn_dis],             
                        [res.xue2btn_nor,res.xue2btn_sel,res.xue2btn_dis],
                        [res.xue3btn_nor,res.xue3btn_sel,res.xue3btn_dis]
                      ],
                      btnpos:[
                        cc.p(320,594),
                        cc.p(523,594),
                        cc.p(740,594)
                      ]
                    })
    return true
  }
})