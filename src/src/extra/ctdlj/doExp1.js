//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           
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

        var beiji = new cc.Sprite(res.beiji)
        beiji.setPosition(215,430)
        self.addChild(beiji)

        var fushi = new cc.Sprite(res.fushi)
        fushi.setPosition(550,560)
        self.addChild(fushi)

        var waterCao = new cc.Sprite(res.waterCao)
        waterCao.setPosition(550,280)
        self.addChild(waterCao)

        var waterBo = new cc.Sprite(res.bowen1)
        waterBo.setPosition(waterCao.width/2,waterCao.height/2)
        waterCao.addChild(waterBo)
        waterBo.setScale(0)

        var waterMian = new cc.Sprite(res.waterMian)
        waterMian.setPosition(waterCao.width/2,waterCao.height/2)
        waterCao.addChild(waterMian)

        var citiebtn = new ccui.Button(res.citie_nor,res.citie_sel)
        citiebtn.setPosition(830,470)
        self.addChild(citiebtn)
        citiebtn.addClickEventListener(function(){
            var angel = Math.random()*180-90
            citiebtn.setVisible(false)
            waterMian.setRotation(angel)
            waterBo.runAction(cc.sequence(
                cc.spawn(cc.scaleTo(2,1.4),cc.fadeOut(2)),
                cc.callFunc(function(){
                    waterBo.setScale(0)
                    waterBo.setOpacity(255)
                })
            ))
            waterMian.runAction(cc.sequence(
                cc.rotateTo(5,0),
                cc.callFunc(function(){
                    citiebtn.setVisible(true)
                })
            ))
        })

        var fabtn = new ccui.Button(res.btn_get_normal,res.btn_get_select)
        fabtn.setPosition(1040,400)
        self.addChild(fabtn)
        fabtn.addClickEventListener(function(){
            self.nodebs.say({
                    key: "jl1",
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
                //self.speakeBykey("wenzi6")
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
            key: "wenzi6",
            img:res.wenzi6,
            sound: res.zimp6
        })

        addContent({
           people: this.nodebs,
           key: "jl1",
           img:res.jl1,
           id:"result",
           sound: res.jlmp1,
           offset: cc.p(40, 30),
           offbg: cc.p(50,50),
       })
    }  
})