/**
 * Created by Administrator on 2016/7/4.
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
            btn: [res.learn_btn2_normal, res.learn_btn2_select,res.learn_btn2_act],
            modify: cc.p(50, 3),
            scales:[0.9,0.95,0.95,0.95],
            pics: [res.study_0,res.study_1,res.study_2, res.study_3, res.study_4],
        }, {
            btn: [res.learn_btn1_normal, res.learn_btn1_select,res.learn_btn1_act],
            modify: cc.p(-50, 3),
            pics: [res.study_5],
        }])
        return true
    },
    dataControl: {},
})