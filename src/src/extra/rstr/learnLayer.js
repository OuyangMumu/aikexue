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
            //modify: cc.p(50, 3),
            pics: [res.study_1],
        }, {
            btn: [res.learn_btn2_normal, res.learn_btn2_select,res.learn_btn2_act],
            scales:[0.92,0.92,0.92,0.92],
            pics: [res.study_2_1,res.study_2_2,res.study_2_3,res.study_2_4],
        }, {
            btn: [res.learn_btn3_normal, res.learn_btn3_select,res.learn_btn3_act],
            //modify: cc.p(-50, 3),
            pics: [res.study_3_1,res.study_3_2],
        }])
        return true
    },
})