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
                res.study_8,
                res.study_9,
                res.study_9,
                res.study_9,
                res.study_9,
                res.study_9,
                res.study_9,
                res.study_9,
            ],
            //imgScale: [0.9,0.85,0.85,0.9,0.95,0.85],
        })
        self.loadUI.addChild(node)
        return true
    },
})