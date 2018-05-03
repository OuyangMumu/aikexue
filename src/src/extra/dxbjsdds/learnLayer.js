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
            pics: [res.study_1],
        }, {
            btn: [res.learn_btn2_normal, res.learn_btn2_select, res.learn_btn2_act],
            pics: [res.study_2],
            //scales: [1,0.95]
        },{
            btn: [res.learn_btn3_normal, res.learn_btn3_select, res.learn_btn3_act],
            pics: [res.study_3,res.study_4],
        }])
        return true
    },
})