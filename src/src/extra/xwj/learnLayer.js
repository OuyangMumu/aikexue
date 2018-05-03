//@author mu @14/5/10

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
            imgs: [
                res.img_learn1,
                res.img_learn2,
                res.img_learn3,
                res.img_learn4,
                res.img_learn5,
                res.img_learn6,
            ],
            titles: [
                res.img_title,
                res.img_title,
                res.img_title,
                res.img_title,
                res.img_title,
                res.img_title,
            ],
            imgScale: 0.8,
            titleModify: cc.p(0, 7),
            mix: 50,
            modify: cc.p(0, -30),
        })
        var deco = new cc.Sprite(res.img_deco)
        deco.setScale(0.8)
        deco.setPosition(getMiddle(0, 180))
        safeAdd(self, deco)
        self.loadUI.addChild(node)
        return true
    },
    dataControl: {},
})