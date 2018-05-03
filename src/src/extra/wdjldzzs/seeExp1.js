var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
           loadPlist("zz")
        });
        this.needSet = false
        this.expCtor({
            btnOff: cc.p(130, 5)
        }) 
        this.initUI()
        this.initData()
      
        return true;
    },
    getRand: function() {
        var self = this
        var imglist = [
            "#a.png",
            "#b.png",
            "#g.png",
            "#h.png",
            "#c.png",
            "#d.png",
            "#i.png",
            "#j.png",
            "#e.png",
            "#f.png",
            "#k.png",
            "#l.png"
        ]
        var list = mixArray(imglist)
        cc.log(list)
        return list
    },
    initUI1:function(){
        var self = this
        var uilist = [
        
        ]
        var bg = loadNode(res.see1, uilist)
        bg.setPosition(0,0)
        safeAdd(self.inside_node, bg)
        var showList = createList({
            scale: 1,
            list: self.getRand(),
            pos: getMiddle(380, -20),
            num: 3,
            size: cc.size(171, 502),
            mix: 20,
            arrow: "white",
            color: "yellow",
            imgScale: 1,
            modify: cc.p(0, -30),
            arrOff: cc.p(20, -20),
            ifPage: true,
            getFun: function(data) {
            },
            outFun: function(data) {
                var item = data.item
                var pos = data.pos
                var index = data.index
                item.setPosition(pos)

                self.showList.judgeIndex(index, false)
                item.removeFromParent(true)
            }
        })
        self.showList = showList
        bg.addChild(showList)
    },
    initUI:function(){
        var self = this;
        var uinamelist = [
          "itemlistbg","commitbtn",
          "daanbtn","againbtn","discoverbtn"
        ]
        var node = loadNode(res.see1, uinamelist);
        this.allnode = node
        self.inside_node.addChild(node)

         node.commitbtn.addClickEventListener(function(){
              self.guannode.getJielun()
         })
         node.daanbtn.addClickEventListener(function(){
             self.guannode.showdaan(res.daantip)
         })
    },
    initData: function() {
        var self = this
        this.guannode = func.createGuancha({
            size: cc.size(171, 502),
            listPos:cc.p(863, 50),
            imglist: [
                ["#a.png", "#aa.png", 0],
                ["#b.png", "#bb.png", 1],
                ["#g.png", "#gg.png", 2],
                ["#h.png", "#hh.png", 3],
                ["#c.png", "#cc.png", 4],
                ["#d.png", "#dd.png", 5],
                ["#i.png", "#ii.png", 6],
                ["#j.png", "#jj.png", 7],
                ["#e.png", "#ee.png", 8],
                ["#f.png", "#ff.png", 9],
                ["#k.png", "#kk.png", 10],
                ["#l.png", "#ll.png", 11]
            ],
            rectlist: [
                cc.rect(255, 335, 132, 135),
                cc.rect(390, 335, 128, 135),
                cc.rect(589, 335, 132, 135),
                cc.rect(724, 335, 128, 135),
                cc.rect(255, 185, 132, 135),
                cc.rect(390, 185, 128, 135),
                cc.rect(589, 185, 132, 135),
                cc.rect(724, 185, 128, 135),
                cc.rect(255, 57, 132, 135),
                cc.rect(390, 57, 128, 135),
                cc.rect(589, 57, 132, 135),
                cc.rect(724, 57, 128, 135),
            ],
            rectNum:1,
            scale:0.75,
            father: self,
            databtnoffset: 30,
        })
    }
})