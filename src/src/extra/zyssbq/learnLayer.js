//@author mu @14/5/10
var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
        loadPlist("study")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        var self = this
        self.initPagegsr({
          imgs:[
            ["#xue1_10000","#xue1_20000","#xue1_30000","#xue1_40000",
            "#xue1_50000","#xue1_60000","#xue1_70000","#xue1_80000"],
          ],
          pavedata:[
              {
               offsetx: 90,
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

        var liubtn = new ccui.Button(res.liubtn_nor,res.liubtn_sel)
        liubtn.setPosition(850,593)
        self.addChild(liubtn)
        liubtn.addClickEventListener(function(){
             if(!self.tip1){
                        var tip1 = createResult({
                            img:res.xuetip,
                            offbg:cc.p(10,30),
                            offset:cc.p(20,20),
                            btnfun:function(){
                                addShowType({
                                    item: self.tip1,
                                    show: "zoom",
                                    time: 0.3,
                                    fun: function() {
                                        self.tip1.setPosition(getMiddle())
                                        removeMoving(self.tip1)
                                    }
                                })
                            }
                        })
                        tip1.setScale(0)
                        tip1.setPosition(getMiddle())
                        tip1.setLocalZOrder(LOCAL_ORDER++)
                        tip1.changeSelfLocalZero = function(){
                            this.setLocalZOrder(LOCAL_ORDER++)
                        }
                        self.tip1 = tip1
                        self.addChild(self.tip1)
                    }
                    if(self.tip1.getScale()==1){
                        addShowType({
                            item:self.tip1,
                            show:"zoom",
                            time:0.3,
                            fun:function(){
                               self.tip1.setPosition(getMiddle())
                               removeMoving(self.tip1)
                            }
                        })          
                    }else{
                        self.tip1.stopAllActions()
                        addShowType({
                            item:self.tip1,
                            show:"scale",
                            time:0.3,
                            fun:function(){
                                self.tip1.setLocalZOrder(LOCAL_ORDER++)
                               addMoving(self.tip1)
                            }
                        })                       
                    }
        })

        return true
    }
})