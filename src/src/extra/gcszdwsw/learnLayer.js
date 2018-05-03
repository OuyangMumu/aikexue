var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        var self = this
        var node = self.initPages({
            imgs: [
                res.study_1,
                res.study_2,
                res.study_3,
                res.study_4,
                res.study_5,
                res.study_6,
                res.study_7,
            ],
            titles: [
                res.study_title_1,
                res.study_title_2,
                res.study_title_2,
                res.study_title_2,
                res.study_title_3,
                res.study_title_4,
                res.study_title_5,
            ],
            titleModify: cc.p(0, 7),
            mix: 50,
            imgScale: [1,1,1,1,1,0.85,0.9],
            //modify:cc.p(0, -15),//-25
        })
        self.loadUI.addChild(node)
        return true
    },
})