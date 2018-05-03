var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        this.load()
        var self = this
        self.initPageBtns([{
            btn: [res.learn_btn1_normal,res.learn_btn1_act, res.learn_btn1_select],
            //modify: cc.p(50, 3),
            pics: [res.study_1,res.study_2,res.study_3,res.study_4,res.study_5],
        }, {
            btn: [res.learn_btn2_normal,res.learn_btn2_act, res.learn_btn2_select],
            //scales:[0.92,0.92,0.92,0.92],
            pics: [res.study_6,res.study_7,res.study_8,res.study_9,
            res.study_10,res.study_11,res.study_12,res.study_13],
        }, {
            btn: [res.learn_btn3_normal,res.learn_btn3_act, res.learn_btn3_select],
            //modify: cc.p(-50, 3),
            pics: [res.study_14,res.study_15],
        }])
        return true
    },
})