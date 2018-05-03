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
            btn: [res.btn1_normal, res.btn1_act, res.btn1_select],
            modify: cc.p(-20, 0),
            pics: [res.learn_img_01, res.learn_img_02, res.learn_img_03],
        }, {
            btn: [res.btn2_normal, res.btn2_act, res.btn2_select],
            modify: cc.p(-50, 0),
            pics: [res.learn_img_04, res.learn_img_05, res.learn_img_06, res.learn_img_07, res.learn_img_08],
        }, {
            btn: [res.btn3_normal, res.btn3_act, res.btn3_select],
            modify: cc.p(-30, 0),
            pics: [res.learn_img_09, res.learn_img_10, res.learn_img_11],
        }, ])
        return true
    },
    dataControl: {},
})