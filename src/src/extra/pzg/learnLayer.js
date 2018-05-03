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
            titles: [
                res.study_1,
                res.study_2,
                res.study_3,
                res.study_4,
                res.study_5,
            ],
            imgs: [
                res.study_6,
                res.study_7,
                res.study_8,
                res.study_9,
                res.study_10,
            ],
            imgScale: [0.95,1,0.9,1,1],
        })
        self.loadUI.addChild(node)
        return true
    },
})