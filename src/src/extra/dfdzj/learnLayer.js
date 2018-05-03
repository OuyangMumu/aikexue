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
        this.learnnode = loadNodeWithAllchild(res.learn_csb)
        self.initPagegsr({
          imgs:[
              [this.learnnode],
              [res.xue2_1]
          ],
          pavedata:[
              {offsetx: 20, offsety:30,jdtpos:cc.p(190, 90)},
              {offsetx: 70, offsety:30,jdtpos:cc.p(150, 90)}
          ],
          btns:[
              [res.xue1btn_nor,res.xue1btn_sel,res.xue1btn_dis],             
              [res.xue2btn_nor,res.xue2btn_sel,res.xue2btn_dis] 
          ],
          btnpos:[
              cc.p(420,593),
              cc.p(720,593)
          ]
        })

        this.nodeTodo()

        return true
    },
    nodeTodo:function(){
        var node =  this.learnnode
        var list =[
            {
                touchSp:node.btn1_nor,
                vis:[node.btn1_sel,node.xue1_1] 
            },
            {
                touchSp:node.btn2_nor,
                vis:[node.btn2_sel,node.xue1_2] 
            },
            {
                touchSp:node.btn3_nor,
                vis:[node.btn3_sel,node.xue1_3] 
            },
            {
                touchSp:node.btn4_nor,
                vis:[node.btn4_sel,node.xue1_4] 
            }
        ]
        for (var i = 0; i < 4; i++) {
            var item = list[i].touchSp
            item.index = i
            createTouchEvent({
                item:item,
                begin:function(data){
                   var item = data.item
                   for(var m in list){
                      var vislist = list[m].vis
                      for(var n in vislist)
                         vislist[n].setVisible(false)
                   }
                   for(var k in list[item.index].vis)
                     list[item.index].vis[k].setVisible(true)       
                }
            })
        }
    }
})

