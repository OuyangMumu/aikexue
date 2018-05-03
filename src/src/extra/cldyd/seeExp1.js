
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
          loadPlist("jinshu")
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
          "itemlistbg",
          "commitbtn",
          "daanbtn",
          "againbtn",
          "camerbtn",
          "discaverbtn"
        ]

        var node = loadNode(res.see1,uinamelist);
        this.allnode = node
        node.camerbtn.setVisible(false)
        node.commitbtn.x = node.commitbtn.x - 110
        node.againbtn.x = node.againbtn.x - 110
        node.daanbtn.x = node.daanbtn.x - 110
        self.inside_node.addChild(node)

         node.discaverbtn.addClickEventListener(function(){
             if(!self.result){
                 self.result = createResult({
                     img:res.wenzi6,
                     offset: cc.p(25, 20),
                     offbg: cc.p(50,50),
                     btnfun:function(){
                         if(self.result){
                             addShowType({
                                 item: self.result,
                                 show: "zoom",
                                 time: 0.3
                             })
                             stopMusic()
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
                 playMusic(res.zi6mp)
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
                     playMusic(res.zi6mp)
                     self.result.setLocalZOrder(LOCAL_ORDER++)
                     addMoving(self.result)
                 }else{
                     addShowType({
                         item: self.result,
                         show: "zoom",
                         time: 0.3
                     })
                     stopMusic()
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
         node.againbtn.addClickEventListener(function(){
            self.guannode.initagain()
            self.guannode.removeFromParent()
            self.guannode=null
            self.initData()
         })
    },
    initData:function(){
        var self = this
        this.guannode = func.createGuancha({
            size:cc.size(self.allnode.itemlistbg.width,self.allnode.itemlistbg.height),
            imglist:[
                ["#extra/cldyd/seeres/chui.png",null,4],
                ["#extra/cldyd/seeres/jb.png",null,0],
                ["#extra/cldyd/seeres/jz.png",null,0],
                ["#extra/cldyd/seeres/lg.png",null,3],
                ["#extra/cldyd/seeres/lu.png",null,3],
                ["#extra/cldyd/seeres/tb.png",null,2],
                ["#extra/cldyd/seeres/td.png",null,4],
                ["#extra/cldyd/seeres/tg.png",null,4],
                ["#extra/cldyd/seeres/tx.png",null,2],
                ["#extra/cldyd/seeres/wan.png",null,0],
                ["#extra/cldyd/seeres/yk.png",null,1],
                ["#extra/cldyd/seeres/ys.png",null,1],
            ],
            direction:"vertical",
            fromExp:"see",
            father:self.allnode,
            scale:0.85,
            listPos:cc.p(863,50),
            rectlist:[
                cc.rect(275,62,100,393),
                cc.rect(390,62,100,393),
                cc.rect(507,62,100,393),
                cc.rect(625,62,100,393),
                cc.rect(745,62,100,393)
            ]
        })
    },
    myEnter: function() {
        this._super()
    }
})

