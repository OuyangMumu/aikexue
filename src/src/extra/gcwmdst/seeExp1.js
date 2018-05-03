
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
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
    initData:function(){
        var self = this
        this.dataInfo = [
            {
              tousp:[
              {sp:self.datou,rect:cc.rect()},
              {sp:self.datou_zinor,rect:cc.rect()}
              ],
              visi:[self.datou_zi,self.datou_zisel,self.datoul],
              sound:"touav"
            },
             {
               tousp:[
               {sp:self.jing,rect:cc.rect()},
               {sp:self.jing_zinor,rect:cc.rect()},
               ],
               visi:[self.jing_zi,self.jing_zisel,self.jingl],
               sound:"jingav"

             },
            {
                tousp:[
                    {sp:self.qugan,rect:cc.rect()},
                    {sp:self.qugan_zinor,rect:cc.rect()},
                ],
                visi:[self.qugan_zi,self.qugan_zisel,self.quganl],
                sound:"quganav"

            },
            {
                tousp:[
                    {sp:self.tuir,rect:cc.rect()},
                    {sp:self.tuil,rect:cc.rect()},
                    {sp:self.shour,rect:cc.rect()},
                    {sp:self.shoul,rect:cc.rect()},
                    {sp:self.sizhi_zinor,rect:cc.rect()}
                ],
                visi:[self.sizhi_zi,self.sizhi_zisel,self.sizhi],
                sound:"sizhiav"
            },
        ]


        for(var k=0;k<this.dataInfo.length;k++){
            var tousp = this.dataInfo[k].tousp
            for(var n in tousp){
                tousp[n].sp.num = k
                createTouchEvent({
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
                        return true
                    }
                })
            }
        }
    },

    initUI:function(){
        var self = this
        var resnode = ccs.load(res.gcst_see1).node
        var uinamelist = []
        for(var i in resnode.getChildren()){
            var namestr = resnode.getChildren()[i].getName()
            uinamelist.push(namestr)
        }
        loadUI(this, res.gcst_see1, uinamelist)

        var drawline = new cc.DrawNode()
        this.addChild(drawline)
        self.discover.setVisible(false)

        this.hxbtn.addClickEventListener(function(){
            this.removeFromParent()
            self.bibi.setVisible(true)
            self.bibi.runAction(cc.sequence(
                cc.moveTo(2,cc.p(303,30)),
                cc.moveTo(0.1,cc.p(400,100)),
                cc.callFunc(function(){
                    self.bibi.removeFromParent()
                    self.discover.setVisible(true)
                })
            ))
            self.bibi.schedule(function(dt){
                if(self.bibi.x==303){
                    drawline.clear()
                    drawline.drawSegment(cc.p(303,538),self.bibi.getPosition(),1,cc.color(255,0,0))
                }
            })
        })



        this.discover.addClickEventListener(function(){
            self.nodebs.say({
                            key: "jielun1"
                        })
        })

    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "huaxian",
                    force:true
                })
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1000, 130)
        })
        this.addChild(this.nodebs);

        addContent({
            people: this.nodebs,
            key: "touav",
            sound: res.touav
        })
        addContent({
            people: this.nodebs,
            key: "sizhiav",
            sound: res.sizhiav
        })
        addContent({
            people: this.nodebs,
            key: "quganav",
            sound: res.quganav
        })
        addContent({
            people: this.nodebs,
            key: "jingav",
            sound: res.jingav
        })
        addContent({
            people: this.nodebs,
            key: "huaxian",
            sound: res.huaxian,
            img:res.wenzi
        })

        addContent({
            people: this.nodebs,
            key: "jielun1",
            img:res.jieluntip1,
            id:"result",
            sound: res.jielun1,
            offset: cc.p(30, 40),
            offbg: cc.p(30,80),
        })

    }
})

