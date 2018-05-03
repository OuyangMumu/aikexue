//@author mu @14/5/10

var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        var self = this
        var node = self.initPages({
            btns: {
                left: {
                    normal: res.btn_left_normal,
                    select: res.btn_left_select,
                },
                right: {
                    normal: res.btn_right_normal,
                    select: res.btn_right_select,
                }
            },
            btnScale: 0.3,
            imgs: [
                res.gswfl_learn1,
                res.gswfl_learn2,
                res.gswfl_learn3,
            ],
            imgScale: 0.35,
            titles: [
                res.gswfl_learn1_title,
                res.gswfl_learn2_title,
                res.gswfl_learn3_title,
            ],
            titleScale: 0.4,
            titleModify: cc.p(0, 7),
            mix: 50,
        })
        self.loadUI.addChild(node)
        return true
    },
    reEnter:function(){
        this.pageReEnter()
    },
    dataControl: {},
})