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
            ],
            titles: [
                res.studyTitle,
                res.studyTitle,
                res.studyTitle,
                res.studyTitle,
            ],
            titleModify: cc.p(0, 7),
            mix: 50,
            //imgScale: [0.9,0.9,0.9,0.9,0.9],
            modify:cc.p(0, 10),
        })
        self.loadUI.addChild(node)
        return true
    },
})