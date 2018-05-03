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
            })
        }
    },
    initUI:function(){
        var self = this
        var uiname = []

        var donode = ccs.load(res.seeJson).node
        var eyeall = donode.getChildByName("eyeall")
        for(var i in eyeall.getChildren()){
            var childrens = eyeall.getChildren()[i]
            uiname.push(childrens.getName())
        }
        var node = loadNode(res.seeJson, uiname)
        self.addChild(node)


        var dataInfo = [
            {
                tousp:[
                   {sp:node.jm_nor},
                   {sp:node.jm}
                ],
                visi:[node.jm1,node.jm_sel],
                sound:"see1"
            },
            {
                tousp:[
                   {sp:node.tk_nor},
                   {sp:node.tk}
                ],
                visi:[node.tk1,node.tk_sel],
                sound:"see2"
            },
            {
                tousp:[
                   {sp:node.hm_nor},
                   {sp:node.hm}
                ],
                visi:[node.hm1,node.hm_sel],
                sound:"see3"
            },
            {
                tousp:[
                   {sp:node.jmt_nor},
                   {sp:node.jmt}
                ],
                visi:[node.jmt1,node.jmt_sel],
                sound:"see4"
            },
            {
                tousp:[
                   {sp:node.jzt_nor},
                   {sp:node.jzt}
                ],
                visi:[node.jzt1,node.jzt_sel],
                sound:"see5"
            },
            {
                tousp:[
                   {sp:node.swm_nor},
                   {sp:node.swm}
                ],
                visi:[node.swm1,node.swm_sel],
                sound:"see6"
            },
            {
                tousp:[
                   {sp:node.ssj_nor},
                   {sp:node.ssj}
                ],
                visi:[node.ssj1,node.ssj_sel],
                sound:"see7"
            },
            {
                tousp:[
                   {sp:node.blq_nor},
                   {sp:node.blqT}
                ],
                visi:[node.blq1,node.blq_sel],
                sound:"see8"
            }
        ]

        var touchs = true
        for(var k=0;k<dataInfo.length;k++){
            var tousp = dataInfo[k].tousp
            for(var n in tousp){
                cc.log(tousp[n].sp.getName())
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

        for(var i = 1;i<=8;i++){
            keyname = "see"+i
            if(i==7){
                addContent({
                    people: this.nodebs,
                    key: keyname,
                    img:res[sprintf("seeimg%d",i)],
                    sound:res[sprintf("seemp%d",i)],
                    offset:cc.p(35,15),
                    buttonoffset:cc.p(0,-20)
                })
            }else{
                addContent({
                    people: this.nodebs,
                    key: keyname,
                    img:res[sprintf("seeimg%d",i)],
                    sound:res[sprintf("seemp%d",i)]
                })
            }
        }
    }
})