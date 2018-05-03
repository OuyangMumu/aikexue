//@author mu @16/5/19

var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        this.load()
        var self = this
        self.initPageBtns([{
            btn: [res.fzcl_learn_btn1_normal, res.fzcl_learn_btn1_select, res.fzcl_learn_btn1_act],
            modify: cc.p(0, 3),
            pics: [res.fzcl_learn_page1_1, res.fzcl_learn_page1_2, res.fzcl_learn_page1_3, res.fzcl_learn_page1_4, res.fzcl_learn_page1_5],
        }, {
            btn: [res.fzcl_learn_btn2_normal, res.fzcl_learn_btn2_select, res.fzcl_learn_btn2_act],
            modify: cc.p(0, 3),
            pics: [res.fzcl_learn_page2_1, res.fzcl_learn_page2_2],
        }])
        return true
    },
    dataControl: {},
})