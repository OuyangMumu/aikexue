
var seeExp2 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp2",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super()
        this.expCtor()
        this.initUI()
        this.initData()
        this.initPeople()

        return true;
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "start",
                })
            })
        }
    },
    initData:function(){
        var self = this
        this.dataInfo = [
            {
              tousp:[
              {sp:self.zi9,rect:cc.rect()},
              {sp:self.qt2,rect:cc.rect()}
              ],
              visi:[self.zi10,self.qt2],
              sound:"see1"
            },
             {
               tousp:[
               {sp:self.zi1,rect:cc.rect()},
               {sp:self.pt2,rect:cc.rect()},
               ],
               visi:[self.zi2,self.pt2],
               sound:"see2"
             },
            {
                tousp:[
                    {sp:self.zi3,rect:cc.rect()},
                    {sp:self.bx,rect:cc.rect()},
                ],
                visi:[self.zi4,self.bx],
                sound:"see3"
            },
            
            {
                tousp:[
                    {sp:self.zi7,rect:cc.rect()},
                    {sp:self.hx2,rect:cc.rect()},
                ],
                visi:[self.zi8,self.hx2],
                sound:"see5"
            },
            {
                tousp:[
                    {sp:self.zi5,rect:cc.rect()},
                    {sp:self.tt2,rect:cc.rect()},
                ],
                visi:[self.zi6,self.tt2],
                sound:"see4"
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
                        self.nodebs.say({
                            key: value,
                            force:true
                        })
                    }
                })
            }
        }
    },
    initUI:function(){
           var self = this
        var resnode = ccs.load(res.see2).node
        var uinamelist = []
        for(var i in resnode.getChildren()){
            var namestr = resnode.getChildren()[i].getName()
            uinamelist.push(namestr)
        }
        
        loadUI(this, res.see2, uinamelist)
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1000, 130)
        })
        this.addChild(this.nodebs);

        addContent({
            people: this.nodebs,
            key: "start",
            sound: res.co2tipp,
        })
        
       var soundlist = [res.seemp1,res.seemp2,res.seemp3,res.seemp4,
                        res.seemp5]
        for(var i=1;i<=5;i++)
            addContent({
            people: this.nodebs,
            key: "see"+i,
            sound: soundlist[i-1],
          })
    }
})

