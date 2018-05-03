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
        
        var uiname = []
        for (var i = 1; i < 7; i++) {
              var btnstr = "btn"+i
              var imgstr = "img"+i
              uiname.push(btnstr)
              uiname.push(imgstr)
        }
        var learn_node = loadNode(res.mfydf_learn,uiname)
        learn_node.setScale(0.92)
        self.initPagegsr({
          imgs:[
            [learn_node],
          ],
          pavedata:[
              {
               offsetx: 150,
               offsety:50,
               jdtpos:cc.p(150,85)
             },
          ],
          btnpos:[
              cc.p(380,593),
          ],
          titlepng:res.studytip,
          titlepos:cc.p(-20,5)
        })

        for (var i = 1; i < 7; i++) {
            var btnstr = "btn"+i
            learn_node[btnstr].index = i  
            learn_node[btnstr].addClickEventListener(function(sender,type){
              cc.log(sender.index)
                 for (var i = 1; i < 7; i++) {
                     var imgstr = "img"+i
                     learn_node[imgstr].setVisible(false)
                     if(i == sender.index){
                      learn_node[imgstr].setVisible(true)
                     }
                 }
            })
        }


        return true
    },
})

