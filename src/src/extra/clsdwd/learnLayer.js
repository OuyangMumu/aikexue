//@author mu @14/5/10

var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        var self = this
        
        self.initPagegsr({
          imgs:[
              [res.xue1_1,res.xue1_2],
          ],
          pavedata:[
              {offsetx: 90, offsety:35},
          ],
          btnpos:[
              cc.p(380,593),
          ]
        })

        var studytip = new cc.Sprite(res.studytip)
        studytip.setPosition(this.img_title.getPositionX(),this.img_title.getPositionY()+5)
        this.img_title.getParent().addChild(studytip)

        return true
    },
    reEnter:function(){

        for(var i in this.alllay.getChildren()){
            this.alllay.getChildren()[i].setOpacity(255)
        }
        this.img_page.getChildren()[0].setOpacity(255)
    }
})

