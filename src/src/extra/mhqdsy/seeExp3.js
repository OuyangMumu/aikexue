
var seeExp3 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp3",
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
              {sp:self.mz1,rect:cc.rect()},
              {sp:self.bs,rect:cc.rect()}
              ],
              visi:[self.mz2,self.bs],
              sound:"see6"
            },
             {
               tousp:[
               {sp:self.mz3,rect:cc.rect()},
               {sp:self.zz,rect:cc.rect()},
               ],
               visi:[self.mz4,self.zz],
               sound:"see7"
             },
            {
                tousp:[
                    {sp:self.mz5,rect:cc.rect()},
                    {sp:self.pjq,rect:cc.rect()},
                ],
                visi:[self.mz6,self.pjq],
                sound:"see8"
            },
            
            {
                tousp:[
                    {sp:self.mz7,rect:cc.rect()},
                    {sp:self.pd,rect:cc.rect()},
                ],
                visi:[self.mz8,self.pd],
                sound:"see9"
            },
            {
                tousp:[
                    {sp:self.mz9,rect:cc.rect()},
                    {sp:self.pz,rect:cc.rect()},
                ],
                visi:[self.mz10,self.pz],
                sound:"see10"
            },
            {
                tousp:[
                    {sp:self.mz11,rect:cc.rect()},
                    {sp:self.dq,rect:cc.rect()},
                ],
                visi:[self.mz12,self.dq],
                sound:"see11"
            },
            {
                tousp:[
                    {sp:self.mz13,rect:cc.rect()},
                    {sp:self.pg,rect:cc.rect()},
                ],
                visi:[self.mz14,self.pg],
                sound:"see12"
            },
             {
                tousp:[
                    {sp:self.mz15,rect:cc.rect()},
                    {sp:self.ts,rect:cc.rect()},
                ],
                visi:[self.mz16,self.ts],
                sound:"see13"
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
        var resnode = ccs.load(res.see3).node
        var uinamelist = []
        for(var i in resnode.getChildren()){
            var namestr = resnode.getChildren()[i].getName()
            uinamelist.push(namestr)
        }
        
        loadUI(this, res.see3, uinamelist)
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
            sound: res.paomotip,
        })
       
        var soundlist = [res.seemp6,res.seemp7,res.seemp8,res.seemp9,
                        res.seemp10,res.seemp11,res.seemp12,res.seemp13]
        for(var i=1;i<=8;i++)
            addContent({
            people: this.nodebs,
            key: "see"+(i+5),
            sound: soundlist[i-1],
          })
    }
})

