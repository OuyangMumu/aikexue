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
        var img1List = []
        for (var i = 0; i < 8; i++) {
            img1List[i] = res[sprintf("img1_%d", i + 1)]
        }
        var img2List = []
        for (var i = 0; i < 5; i++) {
            img2List[i] = res[sprintf("img2_%d", i + 1)]
        }
        self.initPageBtns([{
            btn: [res.btn1_normal, res.btn1_act, res.btn1_select],
            pics: img1List,
        }, {
            btn: [res.btn2_normal, res.btn2_act, res.btn2_select],
            pics: img2List,
        }])
        return true
    },
    dataControl: {},
})