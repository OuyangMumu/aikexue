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
              [res.xue1],
              [res.xue2],
              [res.xue3]
          ],
          pavedata:[
              {offsetx: 10, offsety:-30},
              {offsetx: 10, offsety:-30},
              {offsetx: 120, offsety:-15},
          ],
          btns:[
              [res.xue1btn_sel,res.xue1btn_nor,res.xue1btn_dis],
              [res.xue2btn_sel,res.xue2btn_nor,res.xue2btn_dis],
              [res.xue3btn_sel,res.xue3btn_nor,res.xue3btn_dis]
          ],
          btnpos:[
              cc.p(380,593),
              cc.p(630,593),
              cc.p(850,593)
          ]
        })

        return true
    },
    reEnter:function(){

        for(var i in this.alllay.getChildren()){
            this.alllay.getChildren()[i].setOpacity(255)
        }
        this.img_page.getChildren()[0].setOpacity(255)
    }
})

