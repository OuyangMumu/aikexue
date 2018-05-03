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
        var list = self.initPagegsr({
			          imgs:[
			              [res.xue1_1,res.xue1_2],
			              [res.xue2_1,res.xue2_2,res.xue2_3,res.xue2_4,res.xue2_5,res.xue2_6,res.xue2_7]
			          ],
			          pavedata:[
			              {offsetx: 40,offsety:20,jdtpos:cc.p(190, 80)},
			              {offsetx: 40,offsety:20,jdtpos:cc.p(150, 80)}
			          
			          ],
			          btns:[              
			              [res.xue1btn_nor,res.xue1btn_sel,res.xue1btn_dis],
			              [res.xue2btn_nor,res.xue2btn_sel,res.xue2btn_dis]
			          ],
			          btnpos:[
			              cc.p(410,594),
			              cc.p(740,594)
			          ]
			        })
        return true
    }
})

