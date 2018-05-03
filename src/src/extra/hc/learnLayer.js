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
            btn: [res.learn_btn1_normal, res.learn_btn1_select,res.learn_btn1_act],
            pics: [res.study_1,res.study_2,res.study_3,res.study_4,res.study_5],
            scales: [0.9,0.9,0.9,0.9,0.9]
        },{
            btn: [res.learn_btn2_normal, res.learn_btn2_select,res.learn_btn2_act],
            pics: [res.study_6,res.study_7,res.study_8],
            scales: [0.9,0.9,0.9]
        }
        ])
        return true
    },
})