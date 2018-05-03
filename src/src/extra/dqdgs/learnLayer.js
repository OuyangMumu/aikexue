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
            btn: [res.learn_btn1_normal, res.learn_btn1_act, res.learn_btn1_select],
            //modify: cc.p(0, 3),
            pics: [res.learn1_img1],
        }, {
            btn: [res.learn_btn2_normal, res.learn_btn2_act, res.learn_btn2_select],
            modify: cc.p(-20, 0),
            pics: [res.learn2_img1],
        }, {
            btn: [res.learn_btn3_normal, res.learn_btn3_act, res.learn_btn3_select],
            //modify: cc.p(0, 3),
            pics: [res.learn3_img1, res.learn3_img2, res.learn3_img3, res.learn3_img4],
        }])
        return true
    },
    dataControl: {},
})