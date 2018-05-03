var curMusic = null
var seeExp2 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp2",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
        });
        this.expCtor()
        this.initUI()
        this.initPeople()
        this.initData()

        return true;
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key:"wenzi2"
                })
            })
        }
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
               {sp:node.dankezi_nor,rect:cc.rect()},
               {sp:node.jidan,rect:cc.rect()},
               {sp:node.dk,rect:cc.rect()}
               ],
               visi:[node.dankezi_sel,node.x1,node.ti2,node.dkh,node.jdh],
               sound:"see1"
             },
            {
              tousp:[
              {sp:node.bai_nor,rect:cc.rect()},
              {sp:node.luanbai,rect:cc.rect()},
              {sp:node.dyh,rect:cc.rect()}
              ],
              visi:[node.bai_sel,node.x2,node.ti3,node.dyh,node.quan2,node.baih],
              sound:"see2"
            },
            {
              tousp:[
              {sp:node.huang_nor,rect:cc.rect()},
              {sp:node.luanyellow,rect:cc.rect()},
              {sp:node.dh,rect:cc.rect()}
              ],
              visi:[node.huang_sel,node.x3,node.ti4,node.quan2,node.dhh],
              sound:"see3"
            },
            {
              tousp:[
              {sp:node.shi_nor,rect:cc.rect()},
              {sp:node.qishi,rect:cc.rect()}
              ],
              visi:[node.shi_sel,node.x4,node.ti5,node.qsh],
              sound:"see4"
            },
            {
              tousp:[
              {sp:node.pei_nor,rect:cc.rect()},
              {sp:node.pt,rect:cc.rect()}
              ],
              visi:[node.pei_sel,node.x5,node.ti6,node.pth],
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
                    //额外的（非公有的部分）
                    node.ti1.setVisible(false)
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
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500);

        addContent({
            people: this.nodebs,
            key: "wenzi2",
            sound: res.zimp2
        })
        addContent({
            people: this.nodebs,
            key: "wenzi3",
            sound: res.zimp3
        })

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