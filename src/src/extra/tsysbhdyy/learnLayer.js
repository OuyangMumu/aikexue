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
            [res.xue1_1,res.xue1_2]
          ],
          pavedata:[
              {offsetx: 50, offsety:35},
          ],
          titlepng:res.studytip,
          titlepos:cc.p(-5,4)
        })
        return true
    }
})

