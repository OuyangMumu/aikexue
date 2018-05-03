//@author mu @16/5/11
var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp3",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {    
        })
        this._super()
        this.expCtor()
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this
        var tishi = new cc.Sprite(res.tishi3)
        tishi.setPosition(getMiddle(0,150))
        this.addChild(tishi)

        var mifan = new cc.Sprite(res.mifan)
        mifan.setPosition(getMiddle(-200,-180))
        mifan.setScale(1.6)
        this.addChild(mifan)
        
        var diguan = createIWater({
                       father:self,
                       sp:[mifan],
                       nodescale:1,
                       showDraw:false,
                       pos:cc.p(700,150),
                       pullMidFun:function(){
                          tishi.setVisible(false)
                          var bluesp = new cc.Sprite(res.bianlan)
                          bluesp.setPosition(mifan.width/2,mifan.height/2+15)
                          mifan.addChild(bluesp)
                          bluesp.setScale(0)
                          bluesp.runAction(cc.scaleTo(1.5,1))
                       },
                       pullback:function(){
                            var tipsp = new cc.Sprite(res.tips)
                            tipsp.setPosition(getMiddle(0,70))
                            self.addChild(tipsp)
                            self.nodebs.say({
                                key: "tip3",
                                force: true
                            })
                            diguan.setGaiClick(false)
                       }
                   })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                // self.nodebs.say({
                //     key: "wenzi4",
                //     force: true
                // })
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,900);
        
        addContent({
            people: this.nodebs,
            key: "tip3",
            sound: res.tipmp3,
        })
    }  
})