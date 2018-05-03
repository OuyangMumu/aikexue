//@author mu @14/5/10
var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
        loadPlist("study")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
   
        this.initPagegsr({
          imgs:[
              ["#xue1_1.png","#xue1_2.png"],
              ["#xue2_1.png","#xue2_2.png","#xue2_3.png","#xue2_4.png","#xue2_5.png"],
              ["#xue3_1.png","#xue3_2.png"]
          ],
          pavedata:[
              {offsetx: 70, offsety:15},
              {offsetx: 100, offsety:-40},
              {offsetx: 70, offsety:-35}
          ],
          btns:[
              [res.xue1btn_nor,res.xue1btn_sel,res.xue1btn_dis],
              [res.xue2btn_nor,res.xue2btn_sel,res.xue2btn_dis],
              [res.xue3btn_nor,res.xue3btn_sel,res.xue3btn_dis]
          ],
          btnpos:[
              cc.p(250,593),
              cc.p(470,593),
              cc.p(780,593)
          ]
        })
        return true
    },
})

