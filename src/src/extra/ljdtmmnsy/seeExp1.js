
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
          loadPlist("allimg")
        });
        this.needSet = false
        this.expCtor({
                btnOff: cc.p(130, 8)
            })
        this.initUI()
        this.initData()

        return true;
    },
    initUI: function(){
        var self = this;
        var uinamelist = [
          "commitbtn",
          "daanbtn",
          "feileibtn"
        ]

        var node = loadNode(res.see1,uinamelist);
        this.allnode = node
        node.setPosition(getMiddle(-3,28))
        self.inside_node.addChild(node)

        self.faNode = new cc.Node()
        self.addChild(self.faNode)

         node.feileibtn.addClickEventListener(function(){
             if(!self.result){
                 self.result = createResult({
                     img:res.fenleipng,
                     offset: cc.p(44, 30),
                     offbg: cc.p(26,18),
                     btnfun:function(){
                         if(self.result){
                             addShowType({
                                 item: self.result,
                                 show: "zoom",
                                 time: 0.3
                             })
                             removeMoving(self.result)
                         }
                     }
                 })
                 self.result.changeSelfLocalZero = function(){
                       this.setLocalZOrder(LOCAL_ORDER++)
                 }
                 addShowType({
                     item: self.result,
                     show: "scale",
                     time: 0.3
                 })
                 addMoving(self.result)
                 self.result.setPosition(getMiddle())
                 self.addChild(self.result,LOCAL_ORDER)
             }else{
                 if(self.result.getScale()==0){
                     addShowType({
                         item: self.result,
                         show: "scale",
                         time: 0.3
                     })
                     self.result.setPosition(getMiddle())
                     self.result.setLocalZOrder(LOCAL_ORDER++)
                     addMoving(self.result)
                 }else{
                     addShowType({
                         item: self.result,
                         show: "zoom",
                         time: 0.3
                     })
                     removeMoving(self.result)
                 }
             }
         })
         node.commitbtn.addClickEventListener(function(){
              self.guannode.getJielun()
         })
         node.daanbtn.addClickEventListener(function(){
             self.guannode.showdaan(res.daantip)
         })
    },
    initData:function(){
        var self = this
        this.guannode = func.createGuancha({
            size:cc.size(171,502),
            imglist:[
                ["#img10000",null,1],
                ["#img20000",null,0],
                ["#img30000",null,0],
                ["#img40000",null,0],

                ["#img50000",null,3],
                ["#img60000",null,2],
                ["#img70000",null,1],
                ["#img80000",null,0],

                ["#img90000",null,2],
                ["#img100000",null,1],
                ["#img110000",null,1],
                ["#img120000",null,2],

                ["#img130000",null,2],
                ["#img140000",null,0],
                ["#img150000",null,3],
                ["#img160000",null,3]
            ],
            fromExp:"see",
            father:self.faNode,
            scale:0.85,
            listPos:cc.p(863,47),
            rectlist:[
                cc.rect(325,428,500,120),
                cc.rect(325,305,500,120),
                cc.rect(325,180,500,120),
                cc.rect(325,50,500,120)
            ]
        })
    },
    myEnter: function() {
        this._super()
    }
})