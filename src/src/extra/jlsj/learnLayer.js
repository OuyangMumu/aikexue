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
        var self = this
        var node = self.initPages({
            btns: {
                left: {
                    normal: res.btn_left_normal,
                    select: res.gswfl_btn_left_select,
                },
                right: {
                    normal: res.btn_right_normal,
                    select: res.btn_right_select,
                }
            },
            btnScale: 0.3,
            imgs: [
                res.jlsj_learn1,
                res.jlsj_learn2,
            ],
            titles: [
                res.jlsj_learntitle,
                res.jlsj_learntitle,
            ],
            titleModify: cc.p(0, 7),
            mix: 50,
            imgScale:0.9,
        })
        self.loadUI.addChild(node)
        return true
    },
    reEnter:function(){
        this.pageReEnter()
    },
    dataControl: {},
})