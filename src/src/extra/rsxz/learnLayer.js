//@author mu @14/5/10

var learnLayer = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    dataControl:{},
    ctor:function () {
        this._super();
        this.learnCtor();
        var self = this;
        this.load(function(){
            loadPlist("rsxz_xingzuos")
        });
      
        this.xingzuonode = this.createXingzuonode();
         self.initPagegsr({
          imgs:[
              [res.rsxz_studyone1,res.rsxz_studyone2,res.rsxz_studyone3,res.rsxz_studyone4,self.xingzuonode],
              [res.rsxz_studytwo1,res.rsxz_studytwo2,res.rsxz_studytwo3,res.rsxz_studytwo4],
          ],
          pavedata:[
              {offsetx: 100, offsety:10},
              {offsetx: 100, offsety:45},
          ],
          btns:[
              [res.rsxz_meilibtn_nor,res.rsxz_meilibtn_sel,res.rsxz_meilibtn_dis],
              [res.rsxz_xzrenleibtn_nor,res.rsxz_xzrenleibtn_sel,res.rsxz_xzrenleibtn_dis],
          ],
          btnpos:[
              cc.p(400,593),
              cc.p(700,593),
          ]
        })

        return true
    },
    createXingzuonode:function(){
        var xingzuonode = loadNode(res.allxingzuo)
        for(var i in xingzuonode.getChildren()){
           if(xingzuonode.getChildren()[i].getName() !="extra_rsxz_xingzuo" &&
               xingzuonode.getChildren()[i].getName() !="xingzuotip"){
               xingzuonode.getChildren()[i].setLocalZOrder(1);
               createTouchEvent({
                   item:xingzuonode.getChildren()[i],
                   beginfail:function(){
                       for(var i in xingzuonode.getChildren()){
                           var child = xingzuonode.getChildren()[i]
                           if(child.getChildren()[0])
                               child.getChildren()[0].setVisible(false)
                       }

                       return false
                   },
                   begin:function(data){
                       for(var i in xingzuonode.getChildren()){
                           var child = xingzuonode.getChildren()[i]
                           if(child.getChildren()[0])
                               child.getChildren()[0].setVisible(false)
                       }
                       data.item.setScale(1.3);
                       data.item.setLocalZOrder(2);
                       for(var i in data.item.getChildren())
                           data.item.getChildren()[i].setVisible(true);

                       return true
                   },
                   end:function(data){
                       data.item.setScale(1);
                       data.item.setLocalZOrder(1);
                   }
               })
           }
        }

        return xingzuonode;
    },
})

