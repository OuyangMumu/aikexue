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
        self.initPageBtns([{
            btn: [res.btn_normal1, res.btn_act1, res.btn_select1],
            modify: cc.p(70, 5),
            createFun: function() {
                var uilist = [
                    "rect",
                    "showfont",
                    "imgfont",
                    "sun",
                    "light",
                ]
                var bg = loadNode(res.learn1, uilist)
                var sun = bg.sun
                var light = new ccui.ImageView(res.gszycbd_light)
                light.setPosition(134, 135)
                light.setLocalZOrder(-1)
                sun.addChild(light)
                addShowType({
                    item: light,
                    show: "scaleLoop",
                    buf: {
                        from: 0.7,
                        to: 0.8,
                    },
                    time: 1.0,
                    repeat: cc.REPEAT_FOREVER / 2,
                })
                var rect = bg.rect
                var light = bg.light
                rect.setVisible(false)
                rect.maxHeight = rect.height
                var devide = 10
                var count = 0
                var imgfont = bg.imgfont
                var showfont = bg.showfont
                imgfont.setOpacity(0)
                showfont.setOpacity(0)
                addTimer({
                    fun: function(key) {
                        rect.setVisible(true)
                        light.setVisible(false)
                        changeFather({
                            item: light,
                            father: bg,
                        })
                        count += devide
                        rect.height = count
                        changeFather({
                            item: light,
                            father: rect,
                        })
                        light.setVisible(true)
                        if (count >= rect.maxHeight) {
                            removeTimer(key)
                            addShowType({
                                item: imgfont,
                                show: "fadeIn",
                                time: 5 / 24,
                                fun: function() {
                                    addShowType({
                                        item: showfont,
                                        show: "fadeIn",
                                        time: 5 / 24,
                                    })
                                }
                            })
                        }
                    },
                    time: 1 / 48,
                    repeat: cc.REPEAT_FOREVER,
                    father: bg,
                })
                return bg
            }
        }, {
            btn: [res.btn_normal2, res.btn_act2, res.btn_select2],
            modify: cc.p(20, 5),
            tabs: [{
                normal: res.learn2_deco_09,
                select: res.learn2_deco_10,
                pos: cc.p(100, 450),
                pics: [
                    function() {
                        var list = [
                            cc.p(-199, 146),
                            cc.p(-180, -140),
                            cc.p(103, 23),
                            cc.p(247, -240),
                        ]
                        var node = new cc.Node()
                        for (var i = 0; i < 4; i++) {
                            var sp = new cc.Sprite(res[sprintf("learn2_deco_%02d", i + 1)])
                            sp.setPosition(list[i])
                            if (i == 2) {
                                sp.setLocalZOrder(1)
                            }
                            safeAdd(node, sp)
                        }
                        return node
                    }
                ],
            }, {
                normal: res.learn2_deco_12,
                select: res.learn2_deco_13,
                pos: cc.p(100, 380),
                pics: [
                    res.learn2_deco_05,
                    res.learn2_deco_06,
                ],
            }, {
                normal: res.learn2_deco_07,
                select: res.learn2_deco_08,
                pos: cc.p(100, 310),
                pics: [
                    res.learn2_deco_11,
                ],
            }]
        }, {
            btn: [res.btn_normal3, res.btn_act3, res.btn_select3],
            modify: cc.p(-30, 5),
            pics: [
                res.learn3_img1,
                res.learn3_img2,
                res.learn3_img3,
            ],
            scales: [
                0.9, 0.9, 0.9
            ]
        }, ])
        return true
    },
    dataControl: {},
})