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
            [res.xue1_1,res.xue1_2,res.xue1_3,res.xue1_4,res.xue1_5],
          ],
          pavedata:[
              {offsetx: 90, offsety:50},
          ],
          btnpos:[
              cc.p(380,593),
          ],
          titlepng:res.studytip,
          titlepos:cc.p(-20,5)
        })

        return true
    }
})