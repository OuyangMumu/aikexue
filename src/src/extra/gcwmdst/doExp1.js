//@author mu @16/5/11

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
            loadPlist("sbrt")
        });
        this.needSet = false
        this._super()
        this.expCtor({
            btnOff: cc.p(130, 8)
        })
        this.initUI()
        this.initData()

        return true
    },
    initUI: function() {
        var self = this;
        var uinamelist = [
            "itemlistbg",
            "commitbtn",
            "daanbtn",
            "againbtn",
            "txt1", "txt2", "txt3",
            "tibg", "qiguanbtn", "gugebtn", "jiroubtn", "ticolse",
            "ti1", "ti2", "ti3"
        ]

        var node = loadNode(res.gcst_do1, uinamelist);
        this.allnode = node
        self.inside_node.addChild(node)

        node.commitbtn.addClickEventListener(function() {
            self.guannode.getJielun()
        })
        node.daanbtn.addClickEventListener(function() {
            self.guannode.showdaan(res.daantip)
        })


        var tiinfo = [{
            btn: node.jiroubtn,
            ti: node.ti1
        }, {
            btn: node.gugebtn,
            ti: node.ti2
        }, {
            btn: node.qiguanbtn,
            ti: node.ti3
        }, ]
        for (var i in tiinfo) {
            tiinfo[i].btn.index = i
            tiinfo[i].btn.addClickEventListener(function(sender, type) {
                for (var k in tiinfo) {
                    tiinfo[k].ti.setVisible(false)
                    tiinfo[k].btn.setBright(true)
                    tiinfo[k].btn.setEnabled(true)
                }

                tiinfo[sender.index].ti.setVisible(true)
                tiinfo[sender.index].btn.setBright(false)
                tiinfo[sender.index].btn.setEnabled(false)
            })
        }



        node.againbtn.setVisible(false)
        node.tibg.retain()
        node.tibg.removeFromParent(false)
        node.tibg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2)
        self.addChild(node.tibg, 99)
        node.tibg.release()
        node.tibg.setScale(0)

        var cankaobtn = new ccui.Button(res.ck_normal, res.ck_select);
        cankaobtn.setPosition(923, 596)
        node.addChild(cankaobtn);

        var outInfun = function() {
            if (node.tibg.getScale()) {
                removeMoving(node.tibg)
                node.tibg.runAction(cc.scaleTo(0.2, 0))
            } else {
                addMoving(node.tibg)
                node.tibg.runAction(cc.scaleTo(0.2, 1))
            }
        }
        node.tibg.changeSelfLocalZero = function() {
            this.setLocalZOrder(LOCAL_ORDER++)
        }
        cankaobtn.addClickEventListener(outInfun)
        node.ticolse.addClickEventListener(outInfun)
    },
    initData: function() {
        var self = this
        self.allnode.txt1.setVisible(true)
        self.allnode.txt2.setVisible(true)
        self.allnode.txt3.setVisible(true)

        this.guannode = func.createGuancha({
            size: cc.size(self.allnode.itemlistbg.width, self.allnode.itemlistbg.height),
            imglist: [
                ["#extra/gcwmdst/sbrt/dtjr.png", "#extra/gcwmdst/sbrt/dtjrd.png", 0],
                ["#extra/gcwmdst/sbrt/fbjr.png", "#extra/gcwmdst/sbrt/fbjrd.png", 0],
                ["#extra/gcwmdst/sbrt/fei.png", "#extra/gcwmdst/sbrt/feid.png", 2],
                ["#extra/gcwmdst/sbrt/kg.png", "#extra/gcwmdst/sbrt/kgd.png", 1],
                ["#extra/gcwmdst/sbrt/lg.png", "#extra/gcwmdst/sbrt/lgd.png", 1],
                ["#extra/gcwmdst/sbrt/qgg.png", "#extra/gcwmdst/sbrt/qggd.png", 1],
                ["#extra/gcwmdst/sbrt/sbjr.png", "#extra/gcwmdst/sbrt/sbjrd.png", 0],
                ["#extra/gcwmdst/sbrt/sg.png", "#extra/gcwmdst/sbrt/sgd.png", 1],
                ["#extra/gcwmdst/sbrt/wei.png", "#extra/gcwmdst/sbrt/weid.png", 2],
                ["#extra/gcwmdst/sbrt/xc.png", "#extra/gcwmdst/sbrt/xcd.png", 2],
                ["#extra/gcwmdst/sbrt/xtjr.png", "#extra/gcwmdst/sbrt/xtjrd.png", 0],
                ["#extra/gcwmdst/sbrt/xz.png", "#extra/gcwmdst/sbrt/xzd.png", 2]
            ],
            rectlist: [
                cc.rect(342, 355, 480, 130),
                cc.rect(342, 211, 480, 130),
                cc.rect(342, 68, 480, 130)
            ],
            fromExp: "do",
            father: self.allnode,
            listPos:cc.p(863, 50),
            databtnoffset: 30,
            nodeInrect: [
                self.allnode.txt1,
                self.allnode.txt2,
                self.allnode.txt3,
            ]

        })
    },
    myEnter: function() {
        this._super()
    }

})