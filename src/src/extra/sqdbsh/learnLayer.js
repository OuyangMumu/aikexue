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
            ],
            titles: [
                res.study_title_1,
                res.study_title_2,
                res.study_title_2,
                res.study_title_3,
                res.study_title_3,
            ],
            //titleModify: cc.p(0, 7),
            //mix: 50,
            imgScale: [0.9,1.1,1.1,1,1],
            //modify:cc.p(0, -15),//-25
        })
        self.loadUI.addChild(node)
        return true
    },
    dataControl: {},
})