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
            btn: [res.swl_btn1_normal, res.swl_btn1_act, res.swl_btn1_select],
            //modify: cc.p(-20, 0),
            pics: [res.swl_learn_img1, res.swl_learn_img2, res.swl_learn_img3],
            scales: [0.9, 0.85, 0.9],
        }, {
            btn: [res.swl_btn2_normal, res.swl_btn2_act, res.swl_btn2_select],
            //modify: cc.p(-50, 0),
            pics: [res.swl_learn_img4, res.swl_learn_img5, res.swl_learn_img6],
            scales: [0.9, 0.9, 0.9],
        }])
        return true
    },
    dataControl: {},
})