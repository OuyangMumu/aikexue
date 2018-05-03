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
        var list = self.initPagegsr({
			          imgs:[
			              [res.xue1_1],
			              [res.xue2_1],
			              [res.xue3_1]
			          ],
			          pavedata:[
			              {offsetx: 100,offsety:40,jdtpos:cc.p(190, 80)},
			              {offsetx: 100,offsety:40,jdtpos:cc.p(150, 80)},
			              {offsetx: 100,offsety:40,jdtpos:cc.p(150, 80)}
			          ],
			          btns:[              
			              [res.xue1btn_nor,res.xue1btn_sel,res.xue1btn_dis],
			              [res.xue2btn_nor,res.xue2btn_sel,res.xue2btn_dis],
			              [res.xue3btn_nor,res.xue3btn_sel,res.xue3btn_dis]
			          ],
			          btnpos:[
			             cc.p(340,593),
			             cc.p(585,593),
			             cc.p(800,593)
			          ]
			        })
        return true
    }
})

