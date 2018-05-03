var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
    
        });
        this.expCtor()
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this
        
        var road = new cc.Sprite(res.road1)
        road.setPosition(getMiddle(-50,0))
        self.addChild(road)

        var light = new cc.Sprite(res.light)
        light.setPosition(525,493)
        self.addChild(light)

        var Elec = createElectricityDirection({
                            pos:cc.p(518,165),
                            img:res.redDir,
                            fireTime:0.4,
                            num:6,
                            scale:0.8,
                            buf:[
                                    {pos:cc.p(720,165),roto:-90,time:0.3,prepos:cc.p(-40,0)},
                                    {pos:cc.p(720,434),roto:-180,time:0.6,prepos:cc.p(0,-40)},
                                    {pos:cc.p(311,434),roto:-270,time:0.6,prepos:cc.p(40,0)},
                                    {pos:cc.p(311,165),roto:-360,time:0.6,prepos:cc.p(0,40)},
                                    {pos:cc.p(518,165),roto:0,time:0.3,prepos:cc.p(0,0)}
                               ]
                        })
        self.addChild(Elec)
        Elec.playAll(1)

        var showLight = new ccui.Button(res.showLight_nor,res.showLight_sel)
        showLight.setPosition(1010,450)
        self.addChild(showLight)
        showLight.nor = res.showLight_nor
        showLight.sel = res.showLight_sel
        showLight.addClickEventListener(function(sender){
            var nor = sender.nor
            var sel = sender.sel
            if(!sender.ok){
             sender.ok = true
             nor = sender.sel
             sel = sender.nor
             Elec.stopAll()
            }else{
             sender.ok = false
             Elec.playAll()
            }
            sender.loadTextureNormal(nor)
            sender.loadTexturePressed(sel)
        })

        var seeBtn = new ccui.Button(res.btn_get_normal,res.btn_get_select)
        seeBtn.setPosition(1010,370)
        self.addChild(seeBtn)
        seeBtn.addClickEventListener(function(){
            self.nodebs.say({
                    key: "jl1"
                })
        })  
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
                self.nodebs.say({
                    key: "wenzi1",
                    force: true
                })
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
            key:"wenzi1",
            img:res.wenzi1,
            sound:res.zimp1
          })

        addContent({
           people: this.nodebs,
           key: "jl1",
           img:res.jl1,
           id:"result",
           sound: res.jlmp1,
           offset: cc.p(35, 15),
           offbg: cc.p(20,20),
        })
    }
})