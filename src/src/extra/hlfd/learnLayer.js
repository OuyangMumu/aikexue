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
            ],
            titles: [
                res.study_3,
                res.study_3,
            ],
        })
        self.loadUI.addChild(node)
        return true
    },
})