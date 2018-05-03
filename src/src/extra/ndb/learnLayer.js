//@author mu @14/5/10
var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
        loadPlist("nb")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        var self = this
        
        var xue1 = new cc.Sprite(res.xue1_1)
        xue1.setScale(0.9)

        var tie = new cc.Sprite("#nb00.png")
        tie.setPosition(370,355)
        xue1.addChild(tie)
        var tiek = new cc.Sprite(res.tk)
        tiek.setPosition(369,355)
        tiek.setScale(0.99,1)
        xue1.addChild(tiek)
        var ac = createAnimation({
                                frame:"nb%02d.png",
                                start:0,
                                end:16,
                                time: 0.08
                            })
        tie.runAction(cc.repeatForever(ac))

        var xue2 = new cc.Sprite(res.xue1_2)
        xue2.setScale(0.9)
        var xue3 = new cc.Sprite(res.xue1_3)
        xue3.setScale(0.9)
        self.initPagegsr({
          imgs:[
              [xue1,xue2,xue3]
          ],
          pavedata:[
              {nodeX:500,nodeY:250,jdtpos:cc.p(190, 80)}
          ],
          titlepng:res.studytip,
          titlepos:cc.p(0,10),
          func:function(data){
              if(data.num==3){
                self.img_title.setVisible(true)
              }else{
                self.img_title.setVisible(false)
              }
          }
        })
        self.img_title.setVisible(false)
        return true
    }
})