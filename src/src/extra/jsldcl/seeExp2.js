var seeExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "seeExp2",
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
        var uiList = ["see2_1","btn_tip","see2_2"]
        var node = loadNode(res.jsldcl_seeExp2_json,uiList)
        self.inside_node.addChild(node)
        self.nodebs.show() //95 480  410

        
        var btn_jianjie = new ccui.Button(res.btn_jianjie_select,res.btn_jianjie_normal)
        btn_jianjie.setPosition(95,480)
        self.addChild(btn_jianjie,10)
        var btn_jiegou = new ccui.Button(res.btn_jiegou_normal,res.btn_jiegou_select)
        btn_jiegou.setPosition(95,410)
        self.addChild(btn_jiegou)
        node.btn_tip.addClickEventListener(function(){
            self.nodebs.say({key:"see2_tip"})
        })
        btn_jianjie.addClickEventListener(function(){
            btn_jianjie.loadTextures(res.btn_jianjie_select, res.btn_jianjie_normal)
            btn_jiegou.loadTextures(res.btn_jiegou_normal,res.btn_jiegou_select)
            node.see2_1.setPosition(568,255)
            node.see2_2.setPositionY(-800)
        })
        btn_jiegou.addClickEventListener(function(){
            btn_jiegou.loadTextures(res.btn_jiegou_select, res.btn_jiegou_normal)
            btn_jianjie.loadTextures(res.btn_jianjie_normal,res.btn_jianjie_select)
            node.see2_2.setPosition(568,255)
            node.see2_1.setPositionY(-800)
            self.nodebs.stopSay()
        })

    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs)
        addContent({
            people: this.nodebs,
            key: "see2_tip",
            img: res.see2_tip,
            sound: res.see2_sound,
            id: "result"
        })
    },
})