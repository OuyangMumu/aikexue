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
            btn: [res.cldrx_learn_btn2_normal, res.cldrx_learn_btn2_select, res.cldrx_learn_btn2_act],
            modify: cc.p(0, 3),
            pics: [res.cldrx_learn1_img1],
        }, {
            btn: [res.cldrx_learn_btn1_normal, res.cldrx_learn_btn1_select, res.cldrx_learn_btn1_act],
            modify: cc.p(0, 3),
            pics: [
                res.cldrx_learn2_img1,
                res.cldrx_learn2_img2,
                res.cldrx_learn2_img3,
                res.cldrx_learn2_img4,
                res.cldrx_learn2_img5,
                res.cldrx_learn2_img6,
                res.cldrx_learn2_img7,
                res.cldrx_learn2_img8,
            ],
        }])
        return true
    },
    dataControl: {},
})