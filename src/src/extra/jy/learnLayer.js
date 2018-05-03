/**
 * Created by Administrator on 2016/6/28.
 */

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
            modify: cc.p(50, 0),
            pics: [res.study_1, res.study_2, res.study_3, res.study_4, res.study_5],
            posOff: [cc.p(0, 10),cc.p(0, 10),cc.p(0, 10),cc.p(0, 10),cc.p(0, 10)],
        }, {
            btn: [res.learn_btn2_normal, res.learn_btn2_select, res.learn_btn2_act],
            modify: cc.p(-40, 0),
            pics: [res.study_6, res.study_7, res.study_8, res.study_9],
            posOff: [cc.p(0, 10),cc.p(0, 10),cc.p(0, 10),cc.p(0, 10)],
        }])
        return true
    },
})