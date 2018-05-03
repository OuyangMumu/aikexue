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
            btn: [res.px_learn1_normal, res.px_learn1_act, res.px_learn1_select],
            createFun: function() {
                var uilist = [
                    "show",
                    "web",
                    "native",
                    "deco",
                ]
                var bg = loadNode(res.learn1Bg, uilist, "bg")
                bg.setPosition(getMiddle(0, -40))
                bg.native.setVisible(cc.sys.isNative)
                bg.web.setVisible(!cc.sys.isNative)
                bg.deco.setPosition(-182, 398)
                bg.deco.setScale(0.8)
                var list = [
                    23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 2, 4, 1, 3, 21, 22,
                ]
                var finalList = [
                    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 9, 10
                ]
                var start = bg.show.getPosition()
                var r = 225
                var touchList = []
                for (var i = 0; i < 12; i++) {
                    var rote = -i * 30 / 180 * Math.PI
                    var mix = Math.cos(rote) * r
                    var miy = Math.sin(rote) * r
                    var final = cc.p(start.x + mix, start.y + miy)
                    var sp = new cc.Sprite(sprintf("#px_learn_%02d.png", list[i * 2]))
                    sp.index = i
                    sp.setPosition(final)
                    safeAdd(bg, sp)
                    if (cc.sys.isNative) {
                        createTouchEvent({
                            item: sp,
                            begin: function(data) {
                                var item = data.item
                                bg.showIndex(item.index)
                                return true
                            },
                        })
                    } else {
                        addMouseHover({
                            item: sp,
                            infun: function(item) {
                                bg.showIndex(item.index)
                            },
                            outfun: function(item) {
                                item.setSpriteFrame(sprintf("px_learn_%02d.png", list[item.index * 2]))
                            },
                            disOp: true,
                        })
                    }
                    touchList[i] = sp
                }
                var center = new cc.Sprite()
                center.setPosition(cc.p(start.x + 5, start.y))
                safeAdd(bg, center)
                var show = bg.show
                bg.showIndex = function(index) {
                    var bg = this
                    if (bg.pastIndex != null) {
                        var item = touchList[bg.pastIndex]
                        item.setSpriteFrame(sprintf("px_learn_%02d.png", list[item.index * 2]))
                    }
                    if (index != null) {
                        show.setVisible(false)
                        center.setVisible(true)
                        center.setSpriteFrame(sprintf("px_learn_%02d.png", finalList[index]))
                        var item = touchList[index]
                        item.setSpriteFrame(sprintf("px_learn_%02d.png", list[item.index * 2 + 1]))
                    } else {
                        center.setVisible(false)
                        show.setVisible(true)
                    }
                    bg.pastIndex = index
                }
                return bg
            }
        }, {
            btn: [res.px_learn2_normal, res.px_learn2_act, res.px_learn2_select],
            pics: [
                res.px_learn2_img1,
                res.px_learn2_img2,
            ],
            scales: [0.9, 0.9],
        }])
        return true
    },
    dataControl: {},
})