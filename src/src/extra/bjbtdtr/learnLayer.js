/**
 * Created by Administrator on 2016/7/22.
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
            modify: cc.p(30, 3),
            pics: [res.study_1_1,res.study_1_2,res.study_1_3],
        }, {
            btn: [res.learn_btn2_normal, res.learn_btn2_select,res.learn_btn2_act],
            modify: cc.p(20, 3),
            pics: [res.study_2],
        }, {
            btn: [res.learn_btn3_normal, res.learn_btn3_select,res.learn_btn3_act],
            modify: cc.p(-30, 3),
            scales:[0.95,0.92,0.92,0.95],
            pics: [res.study_3_1,res.study_3_2,res.study_3_3],
        }])
        return true
    },
})