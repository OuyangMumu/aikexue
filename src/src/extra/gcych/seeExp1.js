var curMusic = null
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
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
        var donode = ccs.load(res.see1).node
        for(var i in donode.getChildren())
            uiname.push(donode.getChildren()[i].getName())

        self.donode = loadNode(res.see1, uiname)
        self.addChild(self.donode) 
    },
    initData:function(){
        var self = this
        var node = self.donode
        this.dataInfo = [

            {
               tousp:[
                {sp:node.lis1,rect:cc.rect()},
                {sp:node.hua1,rect:cc.rect()},
               ],
               visi:[node.hua_sel,node.hua1,node.huazi],
               sound:"see1"
            },
            {
              tousp:[
               {sp:node.lis2,rect:cc.rect()},
               {sp:node.zi1,rect:cc.rect()},
              ],
              visi:[node.zi_sel,node.zi1,node.zizi],
              sound:"see2"
            },
            {
              tousp:[
               {sp:node.lis3,rect:cc.rect()},
               {sp:node.jing1,rect:cc.rect()},
              ],
              visi:[node.jing_sel,node.jing1,node.jingzi],
              sound:"see3"
            },
            {
              tousp:[
               {sp:node.lis4,rect:cc.rect()},
               {sp:node.ye1,rect:cc.rect()},
              ],
              visi:[node.ye_sel,node.ye1,node.yezi],
              sound:"see4"
            },
            {
              tousp:[
               {sp:node.lis5,rect:cc.rect()},
               {sp:node.gen1,rect:cc.rect()},
              ],
              visi:[node.gen_sel,node.gen1,node.genzi],
              sound:"see5"
            },
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

        var soundlist = [res.smp1,res.smp2,res.smp3,res.smp4,res.smp5]
        for(var i = 1;i<=5;i++){
            keyname = "see"+i
            addContent({
                people: this.nodebs,
                key: keyname,
                sound:soundlist[i-1]
            })
        }
    }
})