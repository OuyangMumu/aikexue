/**
 * Created by Administrator on 2016/7/21.
 */
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
            modify: cc.p(50, 0),
             scales:[0.9,0.85],
            pics: [res.study_1_1,res.study_1_2],
        }, {
            btn: [res.learn_btn2_normal, res.learn_btn2_select,res.learn_btn2_act],
            modify: cc.p(-30, 0),
            pics: [res.study_2_1,res.study_2_2,res.study_2_3,res.study_2_4,
                res.study_2_5,res.study_2_6,res.study_2_7],
        }])
        return true
    },
})