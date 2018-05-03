/**
 * Created by Administrator on 2016/5/27.
 */
var learnLayer = myLayer.extend({
    sprite:null,
    changeDelete:true,
    dataControl:{},
    load: function() {
        loadPlist("learn_nums")
    },
    ctor:function () {
        this._super();
        this.learnCtor();
        var self = this;
        this.img_title.setVisible(false);

        self.initPageBtns([{
                btn: [res.hhyz_hengxingbtn_dis, res.hhyz_hengxingbtn_sel,res.hhyz_hengxingbtn_nor],
               // btnScale: 0.8,
                modify: cc.p(0, 3),
                pics: [res.hhyz_studyone1],
                scales: [0.9],
                posOff: [cc.p(0, -20)],
            }, {
                btn: [res.hhyz_gudaibtn_dis, res.hhyz_gudaibtn_sel, res.hhyz_gudaibtn_nor],
                //btnScale: 0.8,
                modify: cc.p(0, 3),
                pics: [res.hhyz_studytwo1,res.hhyz_studytwo2],
               // scales: [0.7],
                posOff: [cc.p(20, -20)],
            }, {
                btn: [res.hhyz_wangyuanbtn_dis, res.hhyz_wangyuanbtn_sel, res.hhyz_wangyuanbtn_nor],
               // btnScale: 0.8,
                modify: cc.p(0, 3),
                pics: [res.hhyz_studythree1,res.hhyz_studythree2,res.hhyz_studythree3,res.hhyz_studythree4,],
                //scales: [0.65],
                posOff: [cc.p(0, -30)],
            }, ])
            return true
    }
})