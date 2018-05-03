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
        var self = this
        self.initPageBtns([{
            btn: [res.tsyq_learn_btn1_normal, res.tsyq_learn_btn1_select, res.tsyq_learn_btn1_act],
            //btnScale: 0.8,
            modify: cc.p(0, 3),
            pics: [res.tsyq_learn1_img1],
            //scales: [0.9],
            //posOff: [cc.p(0, 0)],
        }, {
            btn: [res.tsyq_learn_btn2_normal, res.tsyq_learn_btn2_select, res.tsyq_learn_btn2_act],
            //btnScale: 0.8,
            modify: cc.p(-10, 3),
            pics: [res.tsyq_learn2_img1, res.tsyq_learn2_img2, res.tsyq_learn2_img3],
            //scales: [0.7],
            //posOff: [cc.p(20, 0)],
        }, {
            btn: [res.tsyq_learn_btn3_normal, res.tsyq_learn_btn3_select, res.tsyq_learn_btn3_act],
            //btnScale: 0.8,
            modify: cc.p(0, 3),
            pics: [res.tsyq_learn3_img1, res.tsyq_learn3_img2, res.tsyq_learn3_img3],
            //scales: [0.65],
            //posOff: [cc.p(0, -30)],
        }])
        return true
    },
    dataControl: {},
})