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

        var xue2_2sp = new cc.Sprite(res.xue2_2)
        xue2_2sp.setPosition(cc.winSize.width/2-100,cc.winSize.height/2-50)
        xue2_2sp.setBlendFunc(cc.ONE,cc.ONE_MINUS_SRC_COLOR)
        var node = new cc.Node()
        node.addChild(xue2_2sp)
       
        self.initPagegsr({
          imgs:[
              [res.xue1_1,res.xue1_2],
              [res.xue2_1,node]
          ],
          pavedata:[
              {offsetx: 80, offsety:40},
              {offsetx: 80, offsety:35},
          ],
          btns:[
              [res.xue1btn_nor,res.xue1btn_sel,res.xue1btn_dis],
              [res.xue2btn_nor,res.xue2btn_sel,res.xue2btn_dis]
          ],
          btnpos:[
              cc.p(420,593),
              cc.p(685,593),
          ]
        })

        return true
    }
})

