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
        var imgList = []
        for (var i = 0; i < 15; i++) {
            imgList[i] = res[sprintf("learn2_img%d", i + 1)]
        }

        self.initPageBtns([{
            btn: [res.btn1_normal, res.btn1_act, res.btn1_select],
            modify: cc.p(0, 3),
            pics: [res.learn1_img1],
        }, {
            btn: [res.btn2_normal, res.btn2_act, res.btn2_select],
            modify: cc.p(0, 3),
            pics: imgList,
        }])
        return true
    },
    dataControl: {},
})