/**
 * Created by Administrator on 2016/6/21.
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
            btn: [res.habit_dis, res.habit_sel,res.habit_nor ],
            modify: cc.p(50, 3),
            pics: [res.study_1,res.study_2, res.study_3, res.study_4, res.study_5],
        }, {
            btn: [res.variety_dis, res.variety_sel, res.variety_nor],
            modify: cc.p(-50, 3),
            pics: [res.study_6,res.study_7, res.study_8, res.study_9, res.study_10, res.study_11],
        }])
        return true
    },
    dataControl: {},
})