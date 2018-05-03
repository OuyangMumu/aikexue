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
                res.study_2,
                res.study_3,
                res.study_4,
                res.study_1,
            ],
            titles: [
                res.studyTitle_1,
                res.studyTitle_2,
                res.studyTitle_3,
                res.studyTitle_4,
            ],
            titleModify: cc.p(0, 7),
            mix: 50,
            imgScale: [0.95,0.9,1,0.93],
            modify:cc.p(0, -15),
        })
        self.loadUI.addChild(node)
        return true
    },
})