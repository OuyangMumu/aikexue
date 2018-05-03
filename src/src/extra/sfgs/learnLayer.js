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
          imgs:[[res.xue1_1]],
          pavedata:[
              {offsetx:130,offsety:20,jdtpos:cc.p(190, 80)}
          ]
        })
        return true
    }
})

