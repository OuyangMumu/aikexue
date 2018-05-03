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
        var imgs = []
        for(var i = 1; i<9; i++){
           imgs[i-1] = res[sprintf("xue1_%d",i)]
        }
        self.initPagegsr({
          imgs:[
            imgs
          ],
          pavedata:[
              {offsetx: 80, offsety:60},
          ],
          titlepng:res.studytip,
          titlepos:cc.p(-5,4)
        })
        return true
    }
})

