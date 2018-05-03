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
            modify: cc.p(50, 5),
            pics: [res.study_1_1, res.study_1_2, res.study_1_3, res.study_1_4, 
                res.study_1_5,res.study_1_6,res.study_1_7],
            scales:[0.9,0.88,0.95,1,1,1,0.9] 
        }, {
            btn: [res.learn_btn2_normal, res.learn_btn2_select, res.learn_btn2_act],
            modify: cc.p(-40, 5),
            pics: [res.study_2_1, res.study_2_2, res.study_2_3, res.study_2_4, 
                res.study_2_5,res.study_2_6,res.study_2_7],
        }])
        return true
    },
})