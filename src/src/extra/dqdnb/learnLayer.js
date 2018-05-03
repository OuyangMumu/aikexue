//@author mu @16/5/19

var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        this.load()
        var self = this
        self.initPageBtns([{
            btn: [res.learn1_normal, res.learn1_act, res.learn1_select],
            //modify: cc.p(0, 3),
            pics: [res.learn1_img1, res.learn1_img2, res.learn1_img3, res.learn1_img4],
        }, {
            btn: [res.learn2_normal, res.learn2_act, res.learn2_select],
            //modify: cc.p(-20, 0),
            pics: [res.learn2_img1, res.learn2_img2, res.learn2_img3, res.learn2_img4],
        }])
        return true
    },
    dataControl: {},
})