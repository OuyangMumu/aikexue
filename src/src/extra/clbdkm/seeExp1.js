var curMusic = null
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super()
        this.expCtor() 
        this.initUI() 
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this
        var uiName = ["jielunBtn","bz_h","bz_m","bz_s","bz_bai","baiClock"]
        var node = loadNode(res.see1,uiName)
        this.inside_node.addChild(node)
       
        node.jielunBtn.addClickEventListener(function(){
            self.nodebs.say({
              key: "jielun1"
            })
        })
        node.baiClock.runSelf = function(data) {
            var miao = data.miao
            var fen = data.fen
            var shi = data.shi
            miao.count = 0
            this.runAction(cc.repeatForever(cc.sequence(
                cc.delayTime(1),
                cc.callFunc(function(){
                    miao.setRotation(miao.getRotationX()+6)
                    fen.setRotation(fen.getRotationX() + 1 / 10)
                    shi.setRotation(shi.getRotationX() + 1 / 600)
                })
            )))
        }
        node.baiClock.stopSelf = function() {
            this.stopAllActions()
            this.removeFromParent(true)
        }

        node.startPlay = function(){
           var seq = cc.sequence(
              cc.rotateTo(0.5,-10).easing(cc.easeInOut(1.5)),
              cc.rotateTo(0.5,10).easing(cc.easeInOut(1.5))
            )
           this.bz_bai.runAction(cc.repeatForever(seq))
           this.baiClock.runSelf({
             miao:this.bz_s,
             fen:this.bz_m,
             shi:this.bz_h
           })
        }

       node.startPlay() 
       
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
                //self.node.sartAc()
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500)

        addContent({
         people: this.nodebs,
         key: "jielun1",
         img:res.jielun1,
         id:"result",
         sound: res.jielunmp1,
         offset: cc.p(20, 25),
         offbg: cc.p(25,50),
         btnModify:cc.p(4,2)
        })
    }
})