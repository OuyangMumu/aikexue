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
            btn: [res.learn1_btn_normal, res.learn1_btn_act, res.learn1_btn_select],
            pics: [res.learn1_img1],
            posOff: [cc.p(-20, -50)],
        }, {
            btn: [res.learn2_btn_normal, res.learn2_btn_act, res.learn2_btn_select],
            pics: [res.learn2_img1, res.learn2_img2],
            posOff: [cc.p(0, -30), cc.p(0, -50), ],
            scales: [0.9, 1.0]
        }, {
            btn: [res.learn3_btn_normal, res.learn3_btn_act, res.learn3_btn_select, ],
            pics: [res.learn3_img1],
            posOff: [cc.p(0, -50)]
        }, ])
        return true
    },
    dataControl: {},
})