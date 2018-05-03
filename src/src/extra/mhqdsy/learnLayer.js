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
              [res.xue1_1],
              [res.xue2_1,res.xue2_2,res.xue2_3,res.xue2_4]
          ],
          pavedata:[
              {offsetx: 150, offsety:30,jdtpos:cc.p(190, 90)},
              {offsetx: 100, offsety:10,jdtpos:cc.p(150, 90)}
          
          ],
          btns:[
              [res.xue1btn_nor,res.xue1btn_sel,res.xue1btn_dis],
              [res.xue2btn_nor,res.xue2btn_sel,res.xue2btn_dis]
          ],
          btnpos:[
              cc.p(460,593),
              cc.p(720,593)
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