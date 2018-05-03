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
        return true
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
                self.nodebs.say({
                            key: "see9",
                            force:true,
                            fun:function(){
                               curMusic = null
                            }
                        })
            })
        }
    },
    initUI:function(){
        var self = this
        var uiname = []

        var donode = ccs.load(res.seeJson).node
        for(var i in donode.getChildren()){
            var childrens = donode.getChildren()[i]
            uiname.push(childrens.getName())
        }
        var node = loadNode(res.seeJson, uiname)
        self.addChild(node)

        var dataInfo = [
            {
                tousp:[
                   {sp:node.tbt},
                   {sp:node.head}
                ],
                visi:[node.tb,node.tb_sel],
                sound:"see1"
            },
            {
                tousp:[
                   {sp:node.xbt},
                   {sp:node.BPT1}
                ],
                visi:[node.xb,node.xb_sel],
                sound:"see2"
            },
            {
                tousp:[
                   {sp:node.fbt},
                   {sp:node.BPT2}
                ],
                visi:[node.fb,node.fb_sel],
                sound:"see3"
            },
            {
                tousp:[
                   {sp:node.zt}
                ],
                visi:[node.z,node.z_sel],
                sound:"see4"
            },
            {
                tousp:[
                   {sp:node.cjt}
                ],
                visi:[node.cj,node.cj_sel],
                sound:"see5"
            },
            {
                tousp:[
                   {sp:node.yjt},
                   {sp:node.BPT4}
                ],
                visi:[node.yj,node.yj_sel],
                sound:"see6"
            },
            {
                tousp:[
                   {sp:node.cbt},
                   {sp:node.BPT6}
                ],
                visi:[node.cb,node.cb_sel],
                sound:"see7"
            },
            {
                tousp:[
                   {sp:node.zut},
                   {sp:node.BPT7}
                ],
                visi:[node.zu,node.zu_sel],
                sound:"see8"
            }
        ]

        var touchs = true
        for(var k=0;k<dataInfo.length;k++){
            var tousp = dataInfo[k].tousp
            for(var n in tousp){
                tousp[n].sp.num = k
                createTouchEvent({
                    swallow:true,
                    item:tousp[n].sp,
                    begin:function(data){
                        if(touchs){
                            touchs = false
                            //其他看不见
                            var result = judgeOpInPos(data)
                            if(result){
                                for(var k=0;k<dataInfo.length;k++)
                                    if(k != data.item.num){
                                        var visiall = dataInfo[k].visi
                                        for(var d in visiall)
                                            visiall[d].setVisible(false)
                                    }
                                if(node.maintip.isVisible()){
                                    node.maintip.setVisible(false) 
                                }
                                //被点击的看的见
                                var visi = dataInfo[data.item.num].visi
                                for(var m in visi)
                                   visi[m].setVisible(true)
                                var value = dataInfo[data.item.num].sound
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
                        }
                        return true
                    },
                    end:function(){
                        touchs = true
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
        this.addChild(this.nodebs,500)

        for(var i = 1;i<=9;i++){
            keyname = "see"+i
            addContent({
                people: this.nodebs,
                key: keyname,
                sound:res[sprintf("seemp%d",i)]
            })
        }
    }
})