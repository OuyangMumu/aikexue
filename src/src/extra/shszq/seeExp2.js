
var seeExp2 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp2",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super()
        this.expCtor()
        this.initUI()
        this.initPeople()


        return true;
    },
    initUI:function(){
        var seeexperitwo = ccs.load(res.see2).node;
        this.addChild(seeexperitwo);
        var tmpthis = this;

        var xianxiangbtn = seeexperitwo.getChildByName("xianxiangbtn");

        var shuiwu = ccs.load(res.shuiwuac).node;
        var shuiwuac = ccs.load(res.shuiwuac).action;
        shuiwu.x = 300;shuiwu.y = 288;
        seeexperitwo.addChild(shuiwu);
        shuiwuac.gotoFrameAndPlay(0, 600, false);
        shuiwu.runAction(shuiwuac);
        var isShowtip = false;
        shuiwu.scheduleOnce(function(){
            isShowtip = true;
        },5);
        xianxiangbtn.addClickEventListener(function(){
                tmpthis.nodebs.say({
                    key: "jielun2"
                })
        });
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "wenzi4",
                    force:true
                })
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1000, 130)
        })
        this.addChild(this.nodebs);

        addContent({
            people: this.nodebs,
            key: "wenzi4",
            sound: res.zi4mp,
            img: res.wenzi4
        })
        addContent({
            people: this.nodebs,
            key: "jielun2",
            img: res.jielun2,
            id: "result",
            sound: res.jielunmp2,
            offset: cc.p(40, 40),
            offbg: cc.p(10, 50),
        })
    }
})

