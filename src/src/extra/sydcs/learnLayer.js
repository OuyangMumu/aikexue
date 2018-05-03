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
            btn: [res.btn_learn1_normal, res.btn_learn1_act, res.btn_learn1_select],
            pics: [res.img_learn1],
            scales: [0.9],
        }, {
            btn: [res.btn_learn2_normal, res.btn_learn2_act, res.btn_learn2_select],
            modify: cc.p(0, 3),
            pics: [
                res.img_learn2_1,
                res.img_learn2_2,
                res.img_learn2_3,
                res.img_learn2_4,
                res.img_learn2_5,
                res.img_learn2_6,
                res.img_learn2_7,
                res.img_learn2_8,
                res.img_learn2_9,
            ],
        }])
        return true
    },
    dataControl: {},
})