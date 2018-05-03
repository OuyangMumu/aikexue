var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "seeExp1",
    preLayer: "seeLayer",
    ctor: function () {
        this._super();
        this.expCtor();
        //this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        var img = new cc.Sprite(res.see1_img)
        img.setPosition(610,285)
        self.addChild(img)
    }
})