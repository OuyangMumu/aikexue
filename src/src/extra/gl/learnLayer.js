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
            ],
            titles: [
                res.study_wenzi,
                res.study_wenzi,
                res.study_wenzi,
                res.study_wenzi,
                res.study_wenzi,
                res.study_wenzi,
            ],
            titleModify: cc.p(0, 5),
            mix: 50,
            imgScale: [1,0.9,1,0.95,0.95,0.95],
            modify:cc.p(0, 15),//-25
        })
        self.loadUI.addChild(node)
        return true
    },
})