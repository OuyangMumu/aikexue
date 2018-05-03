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
        var uinamelist = [
           "xue2_1","zhuhuo",
           "xue3_1","denghuo"
        ]
        var node1 = loadNode(res.zglzz_xue,uinamelist);
        var huoxinac = ccs.load(res.zglzz_huoxin).action
        huoxinac.gotoFrameAndPlay(0,38,true)
        node1.zhuhuo.runAction(huoxinac)


        var node2 = loadNode(res.zglzz_xue,uinamelist);
        node2.xue2_1.setVisible(false)
        node2.xue3_1.setVisible(true)
        var huoxinac1 = ccs.load(res.zglzz_huoxin).action
        huoxinac1.gotoFrameAndPlay(0,38,true)
        node2.runAction(huoxinac1)
        
        this.initPagegsr({
          imgs:[
              [node1],
              [res.xue2_1],
              [node2]
          ],
          pavedata:[
              {offsetx: 100, offsety:20},
              {offsetx: 100, offsety:25},
              {offsetx: 120, offsety:5}
          ],
          btns:[
              [res.xue1btn_nor,res.xue1btn_sel,res.xue1btn_dis],
              [res.xue2btn_nor,res.xue2btn_sel,res.xue2btn_dis],
              [res.xue3btn_nor,res.xue3btn_sel,res.xue3btn_dis]
          ],
          btnpos:[
              cc.p(320,593),
              cc.p(565,593),
              cc.p(790,593)
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

