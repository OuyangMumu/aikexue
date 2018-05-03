var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
            loadPlist("dan")
        });
        this.needSet = false
        this.expCtor({
            btnOff: cc.p(50, 8)
        });
        this.initUI()
        this.initData()
        this.initPeople()

        return true;
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key:"wenzi1"
                })
            })
        }
    },
    initUI:function(){
        var self = this;
        var uinamelist = [
          "itemlistbg","commitbtn",
          "daanbtn","againbtn","discoverbtn","camerbtn"
        ]
        var node = loadNode(res.see1, uinamelist);
        this.allnode = node
        self.inside_node.addChild(node)
        node.itemlistbg.setVisible(false)

        node.camerbtn.setVisible(false)

         node.commitbtn.addClickEventListener(function(){
              self.guannode.getJielun()
         })
         node.daanbtn.addClickEventListener(function(){
             self.guannode.showdaan(res.dantip)
         })
         node.againbtn.addClickEventListener(function(){
            self.guannode.initagain()
            self.guannode.removeFromParent()
            self.guannode=null
            self.initData()
         })
         node.discoverbtn.addClickEventListener(function(){
                self.nodebs.say({
                    key:"jielun1"
                })
         })
    },
    initData: function() {
        var self = this
        this.guannode = func.createGuancha({
            size: cc.size(self.allnode.itemlistbg.width, self.allnode.itemlistbg.height),
            imglist: [
                ["#dan1.png", "#bigdan1.png", 0],
                ["#dan2.png", "#bigdan2.png", 1],
                ["#dan3.png", "#bigdan3.png", 2],
                ["#dan4.png", "#bigdan4.png", 3],
                ["#dan5.png", "#bigdan5.png", 4],
                ["#dan6.png", "#bigdan6.png", 5],
                ["#dan7.png", "#bigdan7.png", 6],
                ["#dan8.png", "#bigdan8.png", 7]
            ],
            rectlist: [
                cc.rect(327, 361, 168, 95),
                cc.rect(650, 360, 168, 95),
                cc.rect(327, 256, 168, 95),
                cc.rect(650, 256, 168, 95),
                cc.rect(327, 151, 168, 95),
                cc.rect(650, 151, 168, 95),
                cc.rect(327, 54, 168, 95),
                cc.rect(650, 54, 168, 95)
            ],
            rectNum:1,
            scale:0.75,
            father: self.allnode,
            listPos:cc.p(857, 44),
            databtnoffset: 30,
        })
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1020, 130)
        })
        this.addChild(this.nodebs,500);

        addContent({
            people: this.nodebs,
            key: "wenzi1",
            sound: res.zimp1,
        })

        addContent({
          people: this.nodebs,
          key: "jielun1",
          img:res.jielun1,
          id:"result",
          sound: res.jielunmp1,
          offset: cc.p(30, 30),
          offbg: cc.p(50,50),
        })
    }
})

