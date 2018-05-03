//@author mu @14/5/10
var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
    },
    ctor:function(){
      this._super()
      this.learnCtor()
      var self = this
      var xue1 = new cc.Sprite(res.xue1)
      xue1.setPosition(getMiddle(-10,195))
      self.addChild(xue1)
      
      var xue2 = new cc.Sprite(res.xue2)
      xue2.setPosition(getMiddle(-30,195))
      self.addChild(xue2)
      xue2.setVisible(false)

      self.initPagegsr({
        imgs:[
            [res.xue1_1,res.xue1_2,res.xue1_3,res.xue1_4,res.xue1_5],
            [res.xue2_1,res.xue2_2,res.xue2_3]
        ],
        pavedata:[
            {offsetx:60, offsety:25,jdtpos:cc.p(230, 75)},
            {offsetx:40, offsety:35}
        ],
        btns:[
            [res.xue1btn_nor,res.xue1btn_sel,res.xue1btn_dis],             
            [res.xue2btn_nor,res.xue2btn_sel,res.xue2btn_dis] 
        ],
        btnpos:[
            cc.p(420,593),
            cc.p(720,593)
        ],
        btnSkipbackFun:function(index){
          if(index==0){
            xue1.setVisible(true)
            xue2.setVisible(false)
          }else if(index==1){
            xue1.setVisible(false)
            xue2.setVisible(true)
          }
        }
      })

      return true
    }
})

