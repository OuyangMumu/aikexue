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
  
        this.initPagegsr({
          imgs:[
              [res.xue1_1,res.xue1_2,res.xue1_3,res.xue1_4],
              [res.xue2_1],
          ],
          pavedata:[
              {offsetx: 100, offsety:35},
              {offsetx: 100, offsety:40}
          ],
          btns:[
              [res.xue1btn_nor,res.xue1btn_sel,res.xue1btn_dis],
              [res.xue2btn_nor,res.xue2btn_sel,res.xue2btn_dis]
          ],
          btnpos:[
              cc.p(380,593),
              cc.p(690,593)
          ]
        })

        return true
    }
})

