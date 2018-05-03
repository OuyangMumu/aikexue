//@author mu @16/5/11
var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp3",
    preLayer: "doLayer",

    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function(){
          loadPlist("imgs")
        })
        this._super()
        var self = this
        this.needSet = false
        this.expCtor({
            btnOff: cc.p(160, 9)
        })
        this.initUI()
        return true
    },
    initUI:function(){
        var self = this
        var uinamelist = [
          "itemlistbg",
          "commitbtn",
          "daanbtn",
        ]
        var node = loadNode(res.learncsb, uinamelist);
        this.allnode = node
        self.inside_node.addChild(node)

        self.initData()

        node.commitbtn.addClickEventListener(function() {
          self.guannode.getJielun()
        })
        node.daanbtn.addClickEventListener(function() {
          self.guannode.showdaan(res.daantip)
        })
    },
    initData: function() {
        var self = this
        this.guannode = func.createGuancha({
            size: cc.size(self.allnode.itemlistbg.width, self.allnode.itemlistbg.height),
            imglist: [
                ["#img1.png", "#daimg1.png", 1],
                ["#img2.png", "#daimg2.png", 0],
                ["#img3.png", "#daimg3.png", 1],
                ["#img4.png", "#daimg4.png", 1],
                ["#img5.png", "#daimg5.png", 0],
                ["#img6.png", "#daimg6.png", 1],
                ["#img7.png", "#daimg7.png", 0]
            ],
            father: self.allnode,
            listPos:cc.p(864.5, 47),
            imgScale:0.95,
            addBtnPos:cc.p(125,20),
            fromExp: "do",
            rectlist: [
                cc.rect(265, 310, 550, 210),
                cc.rect(265, 70, 550, 210),
            ]
        })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
            })
        }
    } 
})