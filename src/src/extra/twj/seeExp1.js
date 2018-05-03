var curMusic = null
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
            loadPlist("twjs")
        });
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
                            key: "see8",
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
            for(var k in childrens.getChildren()){
                uiname.push(childrens.getChildren()[k].getName())
            }
        }
            

        var node = loadNode(res.seeJson, uiname)
        self.addChild(node)
        var allCount = 0
        var changeTwj = function(num){
            allCount = allCount + num
            var count = allCount%31
            if(count<0){
                count = 32 + count
            }
            if(count==0){
                if(!node.detail.isVisible()){
                    node.detail.setVisible(true)
                    node.detail.setPosition(0,0)
                }
            }else{
                if(node.detail.isVisible()){
                    node.detail.setVisible(false)
                    node.detail.setPosition(-1136,0)
                }
            }
            self.nodebs.stopSay()
            node.twj.setSpriteFrame(sprintf("twj%02d.png",count))
        }
        node.upbtn.addClickEventListener(function(){
            changeTwj(-1)
        })
        node.downbtn.addClickEventListener(function(){
            changeTwj(1)
        })

        var dataInfo = [
            {
                tousp:[
                   {sp:node.sk}
                ],
                visi:[node.sk1,node.skzi,node.sk_sel],
                sound:"see1"
            },
            {
                tousp:[
                   {sp:node.kd}
                ],
                visi:[node.kd1,node.kdzi,node.kd_sel],
                sound:"see2"
            },
            {
                tousp:[
                   {sp:node.fh}
                ],
                visi:[node.fh1,node.fhzi,node.fh_sel],
                sound:"see3"
            },
            {
                tousp:[
                   {sp:node.blp}
                ],
                visi:[node.blp1,node.blpzi,node.blp_sel],
                sound:"see4"
            },
            {
                tousp:[
                   {sp:node.yt}
                ],
                visi:[node.yt1,node.ytzi,node.yt_sel],
                sound:"see5"
            },
            {
                tousp:[
                   {sp:node.xg}
                ],
                visi:[node.xg1,node.xgzi,node.xg_sel],
                sound:"see6"
            },
            {
                tousp:[
                   {sp:node.wk}
                ],
                visi:[node.wk1,node.wkzi,node.wk_sel],
                sound:"see7"
            },
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
                            for(var k=0;k<dataInfo.length;k++)
                                if(k != data.item.num){
                                    var visiall = dataInfo[k].visi
                                    for(var d in visiall)
                                        visiall[d].setVisible(false)
                                }
                            if(node.twjzi.isVisible()){
                                node.twjzi.setVisible(false)
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
            addContent({
                people: this.nodebs,
                key: keyname,
                sound:res[sprintf("seemp%d",i)]
            })
        }
    }
})