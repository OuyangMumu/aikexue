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
                res.study_1
            ],
            titles: [
                res.learn_title,
            ],
            titleModify: cc.p(0, 7),
            mix: 50,
            imgScale: [0.9],
            modify:cc.p(0, -15),//-25
        })
        self.loadUI.addChild(node)
        return true
    },
})