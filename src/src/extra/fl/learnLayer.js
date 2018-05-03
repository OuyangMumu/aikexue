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
                res.learn_img1,
                res.learn_img2,
                res.learn_img3,
                res.learn_img4,
                res.learn_img5,
                res.learn_img6,
            ],
            titles: [
                res.learn_title,
                res.learn_title,
                res.learn_title,
                res.learn_title,
                res.learn_title,
                res.learn_title,
            ],
            titleModify: cc.p(0, 7),
            mix: 50,
        })
        self.loadUI.addChild(node)
        return true
    },
    dataControl: {},
})