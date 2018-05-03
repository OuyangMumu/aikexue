//@author mu @16/5/11
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           loadPlist("QiQiu")
        })
        this._super()
        var self = this
        this.expCtor()
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this
        var tjt_desk = new cc.Sprite(res.tjt_desk)
        tjt_desk.setPosition(450.3,310)
        self.addChild(tjt_desk,20)

         var tjt_di = new cc.Sprite(res.tjt_di)
        tjt_di.setPosition(460,62)
        self.addChild(tjt_di,2)

        var qiqiu = new cc.Sprite("#Qiqiu00.png")
        qiqiu.setPosition(152.7,437.5)
        tjt_desk.addChild(qiqiu)
        qiqiu.countImg = 0

        qiqiu.playAc = function(offset){
            var qiqiu = this
            var ac = cc.repeatForever(cc.sequence(
                cc.delayTime(0.1),
                cc.callFunc(function(){
                    qiqiu.countImg = qiqiu.countImg + offset
                    if(qiqiu.countImg>=0 && qiqiu.countImg<=85){
                        qiqiu.setSpriteFrame(sprintf("Qiqiu%02d.png",qiqiu.countImg))
                    }else{
                        qiqiu.stopAllActions()
                        if(qiqiu.countImg<0){
                            qiqiu.countImg = 0
                        }else if(qiqiu.countImg>85){
                            qiqiu.countImg = 85
                            self.speakeBykey("wenzi6")
                        }
                    }
                })
            ))
            qiqiu.stopAllActions()
            qiqiu.runAction(ac)
        }
        
        var jjd = createJJD({
                    pos:cc.p(500,119),
                    father:self
                })
        jjd.setLocalZOrder(5)
        jjd.setCallBack({
            fire:function(){
                qiqiu.playAc(1)
            },
            down:function(){
                qiqiu.playAc(-1)
            }
        })

        var fabtn = new ccui.Button(res.btn_result_normal,res.btn_result_select)
        fabtn.setPosition(1040,400)
        self.addChild(fabtn)
        fabtn.addClickEventListener(function(){
            self.nodebs.say({
                    key: "jl2",
                })
        })
    },
    speakeBykey:function(key){
       this.nodebs.say({
                    key: key,
                    force: true
                })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.speakeBykey("wenzi5")
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
            key: "wenzi5",
            img:res.wenzi5,
            sound: res.zimp5
        })
        addContent({
            people: this.nodebs,
            key: "wenzi6",
            img:res.wenzi6,
            sound: res.zimp6
        })

        addContent({
           people: this.nodebs,
           key: "jl2",
           img:res.jl2,
           id:"result",
           sound: res.jlmp2,
           offset: cc.p(40, 30),
           offbg: cc.p(40,50),
       })
    }  
})