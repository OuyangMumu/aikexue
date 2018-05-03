//@author mu @14/5/10

var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    ctor: function() {
        this._super();
        this.learnCtor()
        var self = this
        var node = self.initPages({
            imgs: [
                res.xm_learn1,
                res.xm_learn2,
                res.xm_learn3,
            ],
            imgScale: 1.4,
            titles: [
                res.xm_learn_title,
                res.xm_learn_title,
                res.xm_learn_title,
            ],
            titleScale: 1.1,
            titleModify: cc.p(0, 10),
            mix: 50,
        })
        self.loadUI.addChild(node)
        return true
    },
    dataControl: {},
})