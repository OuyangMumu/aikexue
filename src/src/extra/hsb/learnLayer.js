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
        var node = self.initPages({
            imgs: [
                res.study_3,
                res.study_4
            ],
            titles: [
                res.study_1,
                res.study_2
            ],
            imgScale: [0.9,0.9],
            // titleModify: cc.p(0, 7),
            // mix: 50,
            // modify: cc.p(0, -30),
        })
        self.loadUI.addChild(node)
        return true
    },
})