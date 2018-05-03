var curMusic = null
var seeExp2 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp2",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
           
        })
        this.expCtor() 
        this.initUI()
        this.initPeople()
        this.initData()
        
        return true

    },
    initUI:function(){
        var self = this

        var uiname = []
        var donode = ccs.load(res.see2).node
        for(var i in donode.getChildren())
            uiname.push(donode.getChildren()[i].getName())

        self.donode = loadNode(res.see2, uiname)
        self.addChild(self.donode)
        
    },
    initData:function(){
        var self = this
        var node = self.donode
        this.dataInfo = [

            {
               tousp:[
                {sp:node.rui_lis,rect:cc.rect()},
                {sp:node.ruizi,rect:cc.rect()},
               ],
               visi:[node.xrui_sel,node.ruizi1],
               sound:"see1"
            },
            {
              tousp:[
               {sp:node.xruizi,rect:cc.rect()},
               {sp:node.xrui_lis,rect:cc.rect()},
              ],
              visi:[node.rui_sel,node.xruizi1],
              sound:"see2"
            },
            {
              tousp:[
               {sp:node.hb,rect:cc.rect()},
               {sp:node.hua_lis,rect:cc.rect()},
               {sp:node.hua_lis1,rect:cc.rect()},
               {sp:node.hua_lis2,rect:cc.rect()},
              ],
              visi:[node.hhua_sel,node.hb1,node.qhua_sel],
              sound:"see3"
            },
            {
              tousp:[
               {sp:node.ep,rect:cc.rect()},
               {sp:node.e_lis,rect:cc.rect()},
               {sp:node.e_lis1,rect:cc.rect()},
              ],
              visi:[node.e_sel,node.ep1],
              sound:"see4"
            }
        ]

        for(var k=0;k<this.dataInfo.length;k++){
            var tousp = this.dataInfo[k].tousp
            for(var n in tousp){
                tousp[n].sp.num = k
                createTouchEvent({
                    swallow:true,
                    item:tousp[n].sp,
                    begin:function(data){
                     //其他看不见
                        for(var k=0;k<self.dataInfo.length;k++)
                            if(k != data.item.num){
                                var visiall = self.dataInfo[k].visi
                                for(var d in visiall)
                                    visiall[d].setVisible(false)
                            }
                    node.ti.setOpacity(120)
                    //被点击的看的见
                        var visi = self.dataInfo[data.item.num].visi
                        for(var m in visi)
                           visi[m].setVisible(true)
                        var value = self.dataInfo[data.item.num].sound
                          cc.log("curkey",curMusic)
                          cc.log("key",value)
                        if(curMusic != value){
                              curMusic = value
                              self.nodebs.say({
                                  key: value,
                                  force:true,
                                  fun:function(){
                                    curMusic = null
                                  }
                              })
                         }
                    }
                })
            }
        }
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                // self.nodebs.say({
                //     key:"wenzi2"
                // })
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500)

        var soundlist = [res.ssmp1,res.ssmp2,res.ssmp3,res.ssmp4]
        for(var i = 1;i<=4;i++){
            keyname = "see"+i
            addContent({
                people: this.nodebs,
                key: keyname,
                sound:soundlist[i-1]
            })
        }
    }
})