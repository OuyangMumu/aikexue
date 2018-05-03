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
            btn: [res.tyx_learn1_normal, res.tyx_learn1_select, res.tyx_learn1_act],
            btnScale: 0.8,
            modify: cc.p(0, 3),
            pics: [res.tyx_learn_2],
            scales: [0.9],
            posOff: [cc.p(0, 0)],
        }, {
            btn: [res.tyx_learn2_normal, res.tyx_learn2_select, res.tyx_learn2_act],
            btnScale: 0.8,
            modify: cc.p(0, 3),
            pics: [res.tyx_learn_3],
            //scales: [0.7],
            posOff: [cc.p(20, 0)],
        }, {
            btn: [res.tyx_learn3_normal, res.tyx_learn3_select, res.tyx_learn3_act],
            btnScale: 0.8,
            modify: cc.p(0, 3),
            pics: [res.tyx_learn_1],
            //scales: [0.65],
            posOff: [cc.p(0, -30)],
        }, {
            btn: [res.tyx_learn4_normal, res.tyx_learn4_select, res.tyx_learn4_act],
            btnScale: 0.8,
            modify: cc.p(0, 3),
            pics: [res.tyx_learn_4, res.tyx_learn_5],
            //scales: [0.6, 0.6],
            posOff: [cc.p(0, -10), cc.p(0, 0)],
        }, ])
        return true
    },
    dataControl: {},
})