var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "seeExp1",
    preLayer: "seeLayer",
    ctor: function () {
        this._super();
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        loadPlist("jiashui_plist")
        loadPlist("jiayou1_plist")
        loadPlist("jiayou2_plist")

        self.nodebs.show(function(){
            self.nodebs.say({key:"see1_tip1"})
        })
        var tip1 = new cc.Sprite("#see1_tip1.png")
        tip1.setPosition(500,450)
        self.addChild(tip1)
        tip1.setOpacity(0)

        var soil = new cc.Sprite("#jiayou01.png")
        soil.setPosition(400,330)
        self.addChild(soil)

        var water = new cc.Sprite("#jiashui01.png")
        water.setPosition(800,345)
        self.addChild(water)
        //创建精灵，并渐出
        var tipFun = function(img,pos){
            var newTip = new cc.Sprite(img)
            newTip.setPosition(pos)
            self.addChild(newTip)
            showFun(newTip)
        }
        //水杯动画
        var waterAni = function(){
            water.runAction(cc.sequence(
                ani("jiashui%02d.png",37),
                cc.callFunc(function(){
                    tipFun("#see1_tip3.png", cc.p(700,30))
                    tipFun("#see1_tip4.png", cc.p(500,450))
                }),
                cc.delayTime(1),
                cc.callFunc(function(){
                    self.nodebs.say({key:"see1_tip2",force:true})
                })
            ))
        }
        //油杯动画
        var soilAni = function(){
            soil.runAction(cc.sequence(
                ani("jiayou%02d.png",59),
                cc.callFunc(function(){
                    tipFun("#see1_tip2.png", cc.p(290,30))
                }),
                cc.delayTime(0.5),
                cc.callFunc(function(){
                    waterAni()
                })
            ))
        }
        //第一次调用，人物说话
        var say = function(){
            self.runAction(cc.sequence(
                cc.delayTime(15),
                cc.callFunc(function(){
                    soilAni()
                    showOut(tip1)
                })
            ))  
        }
        addShowType({
            item:tip1,
            show:"fadeIn",
            time:1,
            fun:function(){
            }
        })
        addShowType({
            item:tip1,
            show:"moveBy",
            time:1,
            buf:cc.p(0, 30),
            fun:function(){
                say()
            }
        })

        var showFun = function(item){
            addShowType({item:item,show:"fadeIn",time:1,fun:function(){}})
            addShowType({item:item,show:"moveBy",time:1,buf:cc.p(0,30),fun:function(){}})
        }

        var showOut = function(item){
            addShowType({item:item,show:"fadeOut",time:1,fun:function(){}})
            addShowType({item:item,show:"moveBy",time:1,buf:cc.p(0,30),fun:function(){}})
        }
        
        var ani = function(frame,end) {
            return cc.sequence(createAnimation({
                frame:frame,
                end: end,
                time:0.2
            }))
        }

    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        
        addContent({
            people: this.nodebs,
            key: "see1_tip1",
            sound: res.see1_sound1,
        })
        addContent({
            people: this.nodebs,
            key: "see1_tip2",
            sound: res.see1_sound2,
        })
    },
})