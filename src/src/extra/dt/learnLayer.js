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
        var img2List = []
        for (var i = 1; i <= 7; i++) {
            img2List[img2List.length] = res[sprintf("learn2_img%d", i)]
        }

        self.initPageBtns([{
            btn: [res.btn1_normal, res.btn1_act, res.btn1_select],
            createFun: function() {
                var node = new cc.Node()
                var img = new cc.Sprite(res.learn_deco)
                img.setScale(0.8)
                img.setPosition(getMiddle(0, -30))
                safeAdd(node, img)
                var imgList = []
                var getImg = function(index) {
                    if (!imgList[index]) {
                        var img = new cc.Sprite(res[sprintf("learn_loop%d", index + 1)])
                        var font = new cc.Sprite(res[sprintf("font%d", index + 1)])
                        font.setPosition(283, 500)
                        safeAdd(img, font)
                        imgList[index] = img
                        img.setPosition(702, 320)
                        img.setLocalZOrder(99 - index)
                        img.index = index
                        img.font = font
                        img.setCascadeOpacityEnabled(true)
                    }
                    return imgList[index]
                }
                var loop = getImg(0)
                var current1 = loop
                var current2 = null
                var currentIndex = null
                safeAdd(img, loop)
                var fontWorldPos = getWorldPos(loop.font)
                var showTime = 0.5
                var delayTime = 1.5
                var run = function() {
                    currentIndex = current1.index
                    current2 = getImg(currentIndex + 1)
                    current2.setOpacity(0)
                    safeAdd(img, current2)
                    current2.font.setPosition(fontWorldPos)
                    safeAdd(self, current2.font)
                    changeFather({
                        item: current2.font,
                        father: current2,
                    })
                    addShowType({
                        item: current1,
                        show: "fadeOut",
                        time: showTime,
                        delay: delayTime,
                        fun: function() {
                            current1 = current2
                            if (current1.index != 20) {
                                run()
                            } else {
                                self.btns.end()
                            }
                        }
                    })
                    addShowType({
                        item: current2,
                        show: "fadeIn",
                        time: showTime,
                        delay: delayTime,
                    })
                }
                var btns = createPlayBtns({
                    type: "H",
                    pos: cc.p(340, 60),
                    startFun: function() {
                        current1.setOpacity(0)
                        if (current2) {
                            current2.setOpacity(0)
                        }
                        current1 = loop
                        current1.setOpacity(255)
                        run()
                    },
                    pauseFun: function() {
                        current1.pause()
                        if (current2) {
                            current2.pause()
                        }
                    },
                    resumeFun: function() {
                        current1.resume()
                        if (current2) {
                            current2.resume()
                        }
                    },
                    stopFun: function() {
                        current1.setOpacity(0)
                        current1.stopAllActions()
                        if (current2) {
                            current2.setOpacity(0)
                            current2.stopAllActions()
                        }
                        current1 = loop
                        current1.setOpacity(255)
                    }
                })
                self.btns = btns
                btns.setScale(0.65)
                safeAdd(node, btns)
                return node
            }
        }, {
            btn: [res.btn2_normal, res.btn2_act, res.btn2_select],
            pics: img2List,
        }])
        return true
    },
})