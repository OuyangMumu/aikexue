var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super()
        this.learnCtor()
        this.load()
        var self = this
        self.initPageBtns([{
            btn: [res.learn_btn1_normal, res.learn_btn1_select, res.learn_btn1_act],
            //modify: cc.p(50, 5),
            pics: [res.study_1_1, res.study_1_2],
            //scales:[0.9,0.85] 
        },{
            btn: [res.learn_btn2_normal, res.learn_btn2_select, res.learn_btn2_act],
            //modify: cc.p(-40, 5),
            pics: [res.study_2_1],
        },{
            btn: [res.learn_btn3_normal, res.learn_btn3_select, res.learn_btn3_act],
            //modify: cc.p(-40, 5),
            pics: [res.study_3_1],
        },{
            btn: [res.learn_btn4_normal, res.learn_btn4_select, res.learn_btn4_act],
            //modify: cc.p(-40, 5),
            pics: [res.study_4_1],
        }])
        return true
    },
})