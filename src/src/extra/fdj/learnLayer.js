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
                res.learnTitle_1,
                res.learnTitle_2,
                res.learnTitle_3,
                res.learnTitle_4,
                res.learnTitle_5,
                res.learnTitle_6,
                res.learnTitle_7,
                res.learnTitle_8,
            ],
            imgs: [
                res.study_1,
                res.study_2,
                res.study_3,
                res.study_4,
                res.study_5,
                res.study_6,
                res.study_7,
                res.study_8,
            ],
            titleModify: cc.p(0, 7),
            mix: 50,
        })
        self.loadUI.addChild(node)
        return true
    }
})