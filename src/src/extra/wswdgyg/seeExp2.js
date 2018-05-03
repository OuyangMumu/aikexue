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
          loadPlist("seeChose")
        })
        this.needSet = false
        this.expCtor({
            btnOff: cc.p(130, 8)
        })
        this.initUI()
        return true
    },
    myEnter: function() {
        this._super()
    },
    initUI: function() {
        var self = this
        var uinamelist = [
            "commitbtn",
            "daanbtn",
            "xiaoziBtn"
        ]
        var node = loadNode(res.see2, uinamelist);
        this.allnode = node
        node.setPosition(getMiddle(0,25))
        self.inside_node.addChild(node)

        self.initData()

        node.commitbtn.addClickEventListener(function() {
            self.guannode.getJielun()
        })
        node.daanbtn.addClickEventListener(function() {
            self.guannode.showdaan(res.daantip)
        })
        node.xiaoziBtn.addClickEventListener(function(){
           if(!self.xiaozi){
              self.xiaozi = createShowImg({
                img:res.jielun2
              })
              self.addChild(self.xiaozi)
           }
           self.xiaozi.show()
        })
    },
    initData: function() {
        var self = this
        this.guannode = func.createGuancha({
            size: cc.size(171,502),
            imglist: [
                ["#a1.png", "#a1.png", 0],
                ["#a2.png", "#a2.png", 0],
                ["#a3.png", "#a3.png", 0],
                ["#a4.png", "#a4.png", 1],
                ["#a5.png", "#a5.png", 1],
                ["#a6.png", "#a6.png", 1],
                ["#a7.png", "#a7.png", 2],
                ["#a8.png", "#a8.png", 2],
            ],
            father: self,
            listPos:cc.p(866,44),
            fromExp: "see",
            itemNum:4,
            imgScale:0.45,
            getImgScale:0.45,
            scale:0.45,
            addBtnScale:1.5,
            addBtnPos:cc.p(240,30),
            rectlist: [
              cc.rect(280, 350, 570, 130),
              cc.rect(280, 205, 570, 130),
              cc.rect(280, 62, 570, 130),
            ]
        })
    }
})