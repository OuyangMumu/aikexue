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
          imgs:[
              [res.xue1_1],
              [res.xue2_1,res.xue2_2,res.xue2_3,res.xue2_4,res.xue2_5,res.xue2_6],
          ],
          pavedata:[
              {offsetx: 80, offsety:60},
              {offsetx: 100, offsety:60}
          ],
          btns:[
              [res.xue1btn_nor,res.xue1btn_sel,res.xue1btn_dis],             
              [res.xue2btn_nor,res.xue2btn_sel,res.xue2btn_dis]
          ],
          btnpos:[
              cc.p(400,593),
              cc.p(722,593),
          ]
        })
        return true
    }
})