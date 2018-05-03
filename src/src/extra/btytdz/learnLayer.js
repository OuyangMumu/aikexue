/**
 * Created by Administrator on 2016/5/31.
 */
var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    load: function() {
        loadPlist("learn_nums")
    },
    dataControl:{},
    ctor:function () {
        this._super();
        this.learnCtor();
        var self = this;
        var node = self.initPages({
            imgs: [
                res.btytdz_study_1,
                res.btytdz_study_2,
                res.btytdz_study_3,
                res.btytdz_study_4,
                res.btytdz_study_5,
                res.btytdz_study_6,
            ],
            titles: [
                res.btytdz_study_title,
                res.btytdz_study_title,
                res.btytdz_study_title,
                res.btytdz_study_title,
                res.btytdz_study_title,
                res.btytdz_study_title,
            ],
            titleModify: cc.p(0, 7),
            mix: 50,
        })
        self.loadUI.addChild(node)
        return true
    },

    reEnter:function(){
        this.pageReEnter()
    }
})