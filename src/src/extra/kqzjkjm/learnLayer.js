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
            titles: [
                res.study_1,
                res.study_1,
                res.study_1,
                res.study_1,
                res.study_1,
                res.study_1
            ],
            imgs: [
                res.study_2,
                res.study_3,
                res.study_4,
                res.study_5,
                res.study_6,
                res.study_7
            ],
            titleModify: cc.p(0, 7),
            mix: 50,
        })
        self.loadUI.addChild(node)
        return true
    }
})