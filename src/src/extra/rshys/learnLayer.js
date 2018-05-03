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
        var bg = new cc.Sprite(res.rshys_bg)
        bg.setPosition(getMiddle())
        safeAdd(this.inside_node, bg)
        this.img_grass.setVisible(false)
        var self = this
        self.initPageBtns([{
            btn: [res.btn_learn1_normal, res.btn_learn1_act, res.btn_learn1_select],
            tabs: [{
                normal: res.btn_tab1_normal,
                select: res.btn_tab1_select,
                pos: cc.p(120, 500),
                pics: [
                    res.img_tab1,
                ],
                scales: [
                    0.9
                ],
                posOff: [
                    cc.p(0, -35),
                ],
            }, {
                normal: res.btn_tab2_normal,
                select: res.btn_tab2_select,
                pos: cc.p(120, 430),
                pics: [
                    res.img_tab2,
                ],
                scales: [
                    0.9
                ],
                posOff: [
                    cc.p(0, -35),
                ],
            }, {
                normal: res.btn_tab3_normal,
                select: res.btn_tab3_select,
                pos: cc.p(120, 360),
                pics: [
                    res.img_tab3,
                ],
                scales: [
                    0.9
                ],
                posOff: [
                    cc.p(0, -35),
                ],
            }, ]
        }, {
            btn: [res.btn_learn2_normal, res.btn_learn2_act, res.btn_learn2_select],
            createFun: function() {
                var node = new cc.Node()
                var img = new cc.Sprite(res.img_learn2)
                img.setScale(0.9)
                img.setPosition(getMiddle(0, -150))
                safeAdd(node, img)
                var moon = new cc.Sprite()
                var ani = cc.repeatForever(createAnimation({
                    ifFile: true,
                    frame: "rshys_ys_%03d",
                    end: 85,
                    time: 1 / 12,
                }))
                moon.runAction(ani)
                moon.setPosition(getMiddle(0, 100))
                safeAdd(node, moon)
                return node
            }
        }])
        return true
    },
    dataControl: {},
})