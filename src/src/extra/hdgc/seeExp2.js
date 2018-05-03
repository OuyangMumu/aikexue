/**
 * Created by Administrator on 2016/6/1.
 */
var seeExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp2",
    preLayer: "seeLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load(function() {
            loadPlist("hua")
        });
        this.needSet = false
        this.expCtor({
            btnOff: cc.p(80, 8)
        });
        this.initUI();

        return true;
    },
    myEnter: function() {
        this._super()
    },
    initUI: function() {
        var self = this;
        var uinamelist = [
            "itemlistbg",
            "commitbtn",
            "daanbtn",
            "againbtn"

        ]
        var node = loadNode(res.hdgc_see2, uinamelist);
        this.allnode = node
        self.inside_node.addChild(node)
        node.itemlistbg.setVisible(false)

        self.initData()

        node.commitbtn.addClickEventListener(function() {
            self.guannode.getJielun()
        })
        node.daanbtn.addClickEventListener(function() {

            self.guannode.showdaan(res.daantip)
        })
        node.againbtn.addClickEventListener(function() {
            var daansp = self.getChildByName("daan")
            if (daansp) {
                daansp.runAction(cc.sequence(
                    cc.scaleTo(0.2, 0),
                    cc.callFunc(function() {
                        daansp.removeFromParent()
                    })
                ))
            }
            self.guannode.initagain()
            self.guannode.removeFromParent()
            self.guannode = null
            self.initData()
        })
    },
    initData: function() {
        var self = this
        this.guannode = func.createGuancha({
            size: cc.size(self.allnode.itemlistbg.width, self.allnode.itemlistbg.height),
            imglist: [
                ["#extra/hdgc/hua/bhh.png", "#extra/hdgc/hua/bhhd.png", 1],
                ["#extra/hdgc/hua/lh.png", "#extra/hdgc/hua/hchd.png", 1],
                ["#extra/hdgc/hua/hgh.png", "#extra/hdgc/hua/hghd.png", 0],
                ["#extra/hdgc/hua/ngh.png", "#extra/hdgc/hua/nghd.png", 0],
                ["#extra/hdgc/hua/th.png", "#extra/hdgc/hua/thd.png", 1],
                ["#extra/hdgc/hua/tsh.png", "#extra/hdgc/hua/tshd.png", 0],
                ["#extra/hdgc/hua/ych.png", "#extra/hdgc/hua/ychd.png", 1],
                ["#extra/hdgc/hua/ymh.png", "#extra/hdgc/hua/ymhd.png", 0]
            ],
            father: self.allnode,
            listPos:cc.p(863, 48),
            fromExp: "see",
            rectlist: [
                cc.rect(288, 300, 547, 210),
                cc.rect(290, 80, 547, 210),
            ]
        })
    }
})