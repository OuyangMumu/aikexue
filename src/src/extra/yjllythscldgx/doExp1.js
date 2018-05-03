//@author mu @16/5/11

//用于创建一个弹簧
var createSpring = function(data){
    var data = data || {}
    var num = data.num || 10
    var scale = data.scale || 0.4
    var behandimg1 = data.behandimg1
    var behandimg2 = data.behandimg2
    var thTouch_endFun = data.endFun
    var thTouch_beginFun = data.beginFun
    var thTouch_moveFun = data.moveFun
    var xishu = data.xishu

    var preforimg1 = data.preforimg1 
    var preforimg2 = data.preforimg2 

    var spring = new cc.Node()
    spring.xishu = xishu
    spring.prefor = []
    spring.behand = []

    var GG = new cc.Sprite(res.tangou1)
    GG.setPosition(-40,31)
    spring.addChild(GG,1)
    GG.initPos = GG.getPosition()
    spring.GG = GG

    var hideGou = new cc.Sprite(res.guaGou3)
    hideGou.setPosition(4.1,67.16)
    GG.addChild(hideGou)
    hideGou.setVisible(false)
    spring.hideGou = hideGou

    var startBeh = new cc.Sprite(behandimg1)
    startBeh.setPosition(-48,1)
    startBeh.setAnchorPoint(0,0.75)
    spring.addChild(startBeh,3)

    for (var i = 0; i < num; i++) {
        var beh = new cc.Sprite(behandimg2)
        beh.setAnchorPoint(0,1)
        beh.initPos = cc.p(-95,-20 * i - 4)
        beh.setPosition(beh.initPos)
        spring.addChild(beh,3)
        beh.setScale(0.95,1)
        spring.behand[i] = beh

        var pre = new cc.Sprite(preforimg2)
        pre.setAnchorPoint(1,1)
        pre.initPos = cc.p(0,-20 * i)
        pre.setPosition(pre.initPos)
        spring.addChild(pre,5)
        spring.prefor[i] = pre
    }

    var endPre = new cc.Sprite(preforimg1)
    endPre.setAnchorPoint(1,1)
    endPre.initPos = cc.p(0,-20 * num)
    endPre.setPosition(endPre.initPos)
    spring.addChild(endPre,5)

    var downGou = new cc.Sprite(res.tangou2)
    downGou.setAnchorPoint(0.8,1)
    downGou.initPos = cc.p(-50,endPre.y-6)
    downGou.setPosition(downGou.initPos)
    spring.addChild(downGou,2)

    var gua = new cc.Sprite(res.tangou3)
    gua.setPosition(113,30)
    downGou.addChild(gua)
    gua.setScale(0.77)
    gua.initPos = gua.getPosition()
    gua.setVisible(false)
    spring.gua = gua

    var guaFather = new cc.Node()
    guaFather.setPosition(115,0)
    downGou.addChild(guaFather)
    guaFather.setScale(2.5)
    spring.guaFather = guaFather
    guaFather.childCount = 0
    guaFather.endSp = null

    var famaGouHide = new cc.Sprite(res.guaGou3)
    famaGouHide.setPosition(101.2,12.06)
    downGou.addChild(famaGouHide)
    famaGouHide.setScale(0.6458)

    //触摸
    var thTouch = new cc.Sprite(preforimg2)
    thTouch.setAnchorPoint(1,1)
    thTouch.setPosition(0,65)
    spring.addChild(thTouch,5)
    spring.thTouch = thTouch
    thTouch.curFather = spring
    thTouch.setScaleY(20)
    thTouch.setVisible(false)

    createTouchEvent({
        item:thTouch,
        begin:function(data){
            var pos = data.pos
            var item = data.item
            if(item.curFather)
            {
                item.curFather.setPosition(pos.x+17,pos.y+20)
            }
            if(thTouch_beginFun){
                thTouch_beginFun(item.curFather)
            }
            return true
        },
        move:function(data){
            var pos = data.pos
            var item = data.item
            if(thTouch_moveFun){
                thTouch_moveFun({item:item.curFather,pos:pos})
            }else{
                item.curFather.setPosition(pos.x+17,pos.y+20)
            }
        },
        end:function(data){
            var item = data.item
            if(thTouch_endFun){
                thTouch_endFun(item.curFather)
            }
        }
    })


    //力和系数
    spring.FntoChange = function(Fn,cv){
        var cv = cv || 20
        var angle = Fn / cv

        startBeh.setRotation(angle)
        for (var i = 0; i < spring.prefor.length; i++) {
            spring.prefor[i].setRotation(-angle) 
            spring.behand[i].setRotation(angle)
            if(i>=1){
                spring.prefor[i].y = spring.prefor[i-1].y - 20-angle/5*14
                spring.behand[i].y = spring.behand[i-1].y - 20-angle/5*14
                spring.behand[i].x = spring.behand[i-1].x
            }else{
                spring.prefor[i].y = spring.prefor[i].initPos.y - angle
                spring.behand[i].y = -4 - angle*1.4 - angle
                spring.behand[i].x = spring.behand[i].initPos.x + Math.pow(2,angle/5)
            }
        }
        endPre.setRotation(-angle)
        endPre.y = spring.prefor[spring.prefor.length-1].y - 20-angle/5*14
        downGou.y = endPre.y - 6 - angle*0.9
        thTouch.setScaleY(20 + 1.8*angle)
    }
    spring.changeTH = function(){
        gua.y = gua.initPos.y - 162 * guaFather.childCount
        spring.FntoChange(guaFather.childCount*50,spring.xishu)
    }
    spring.CountLoop = function(node,num){
        if(node){
            guaFather.childCount += num
            if(num>0){
                guaFather.endSp = node
                node.grandFather = spring
            }else{
                node.grandFather = null
            }
            for(var i in node.getChildren()){
                var curNode = node.getChildren()[i]
                if(curNode.getName()!="guaTest" && curNode.getName()!="guahide")
                {
                    spring.CountLoop(curNode,num)
                }
            }
        }
    }
    guaFather.AddFama = function(item){
        item.grandFather = spring
        if(this.childCount==0){
            safeAdd(this,item)
            item.setPosition(0,-27)
            spring.CountLoop(item,1)
        }else{
            safeAdd(this.endSp,item)
            item.setLocalZOrder(5)
            item.setPosition(15,-30)
            spring.CountLoop(item,1)
        }
        spring.changeTH() 
    }
    spring.removeOne = function(item){
        guaFather.endSp = item.getParent()
        spring.CountLoop(item,-1)
        spring.changeTH()
    }
    spring.deleAll = function(){
        guaFather.removeAllChildren()
        guaFather.childCount = 0
        spring.FntoChange(0,spring.xishu)
        gua.setPosition(gua.initPos)
    }
    spring.setScale(scale)
    return spring
}

var CurNum = 0
var famaCount = 0
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           
        })
        this._super()
        var self = this
        this.expCtor({
          vis: false,
          setZ: 800,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
              if (!self.bggg) {
                var bglist = ["bg1", "bg2", "bg3","btn_bg1", "btn_bg2","btn_bg3"]
                var colors = []
                for (var i = 0; i < 36; i++) {
                  colors[i] = cc.color(0,0,0)
                }
                var bgg = createBiaoge({
                  json: res.biao1,
                  scale: 0.85,
                  inputSize:23,
                  inputNum:36,
                  rootColor:colors,
                  overClear:true
                })
                var setBtnEnable = function(btn,vis){
                  btn.setEnabled(vis)
                  btn.setBright(vis)
                }
                var hideDaan = function(){
                  bgg.table1.setVisible(false)
                  bgg.table2.setVisible(false)
                }
             
                loadList(bgg, bglist)
                setBtnEnable(bgg.btn_bg1,false)
                bgg.btn_bg1.addClickEventListener(function() {
                  bgg.bg1.setVisible(true)
                  bgg.bg2.setVisible(false)
                  bgg.bg3.setVisible(false)
                  setBtnEnable(bgg.btn_bg1,false)
                  setBtnEnable(bgg.btn_bg2,true)
                  setBtnEnable(bgg.btn_bg3,true)
                })
                bgg.btn_bg2.addClickEventListener(function() {
                  bgg.bg1.setVisible(false)
                  bgg.bg2.setVisible(true)
                  bgg.bg3.setVisible(false)
                  setBtnEnable(bgg.btn_bg1,true)
                  setBtnEnable(bgg.btn_bg2,false)
                  setBtnEnable(bgg.btn_bg3,true)
                })
                bgg.btn_bg3.addClickEventListener(function() {
                  bgg.bg1.setVisible(false)
                  bgg.bg2.setVisible(false)
                  bgg.bg3.setVisible(true)
                  setBtnEnable(bgg.btn_bg1,true)
                  setBtnEnable(bgg.btn_bg2,true)
                  setBtnEnable(bgg.btn_bg3,false)
                })
                bgg.ClearFun = function(){
                    var start = 1
                    if(bgg.bg1.isVisible()){
                        start = 1
                    }
                    if(bgg.bg2.isVisible()){
                        start = 13
                    }
                    if(bgg.bg3.isVisible()){
                        start = 25
                    }
                    for (var i = start; i < start+12; i++) {
                        var temp = bgg[sprintf("input%d", i)]
                        temp.clear()
                    }
                }
                self.addChild(bgg)
                self.bggg = bgg
              }
              var bgg = self.bggg
              bgg.show()
            },
          }
        })
        this.initPeople()
        this.initUI()    
        return true
    },
    initUI:function(){
        var self = this
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode

        var dotitle = new cc.Sprite(res.dotitle)
        dotitle.setPosition(940,450)
        self.addChild(dotitle)
        dotitle.runAction(cc.fadeOut(6))

        self.otherUI()
        var fdj = self.fdj
        var getRuler = function() {
            var ruler = createRuler({
                max:18,
                devide: 28,
                seg: 0.65,
                add: 1,
                height: 80,
                lineModify: cc.p(0, 3),
                fontModify: cc.p(0, 5),
                rotate:90,
            })
            return ruler
        }
        var springInfo = [
            {beh1:res.tanbeh2,beh2:res.tanbeh1,pre1:res.tanpre2,pre2:res.tanpre1,xishu:45},
            {beh1:res.tanbeh4,beh2:res.tanbeh3,pre1:res.tanpre4,pre2:res.tanpre3,xishu:35},
            {beh1:res.tanbeh6,beh2:res.tanbeh5,pre1:res.tanpre6,pre2:res.tanpre5,xishu:25},
        ]
        this.toolbtn = createTool({
            pos:cc.p(105, 500),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.4, 1.2),
            itempos:[cc.p(3, -8),cc.p(3, -8),cc.p(3, -8),cc.p(3, -12),cc.p(3, -15)],
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.8,
            ifcircle: true,
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                var pos = data.pos
                if(index<=2){
                    var keyName = sprintf("spring%d",CurNum++)
                    fdj.createNew({
                        key:keyName,
                        fun: function() {
                            var spring = createSpring({
                                            behandimg1:springInfo[index].beh1,
                                            behandimg2:springInfo[index].beh2,
                                            preforimg1:springInfo[index].pre1,
                                            preforimg2:springInfo[index].pre2,
                                            xishu:springInfo[index].xishu,
                                            beginFun:function(node){
                                                if(node.curGou){
                                                    node.curGou.haveTH = false
                                                    node.curGou.curTh = null
                                                    node.curGou = null
                                                    fdj.runData({
                                                        key:node.keyName,
                                                        fun:function(data){
                                                            var item = data.item
                                                            item.hideGou.setVisible(false)                                                  
                                                            item.deleAll()
                                                        }
                                                    })
                                                    // node.hideGou.setVisible(false)                                                  
                                                    // node.deleAll()
                                                }
                                                node.setLocalZOrder(LOCAL_ORDER++)
                                            },
                                            moveFun:function(data){
                                                var item = data.item
                                                var pos = data.pos
                                                fdj.runData({
                                                    key:item.keyName,
                                                    fun:function(data){
                                                        var item = data.item
                                                        item.setPosition(pos.x+17,pos.y+20)
                                                    }
                                                })
                                            },
                                            endFun:function(node){
                                                if(node){
                                                    self.checkGuagou(node)
                                                    if (node.x < 170 && self.toolbtn.getStatus()) {
                                                        node.forceBack()
                                                        var inTh = fdj.getIn(node.keyName)
                                                        inTh.removeFromParent()
                                                    }
                                                }
                                            }
                                         })
                            spring.setPosition(pos)
                            return spring
                        }
                    })
                    var spring = fdj.getOut(keyName)
                    spring.keyName = keyName
                    return spring
                }else if(index==3){
                    var keyName = sprintf("fama%d",famaCount++)
                    fdj.createNew({
                        key: keyName,
                        fun: function() {
                            var item = new cc.Sprite(res.fama)
                            var gua = new cc.Sprite(res.tangou3)
                            gua.setPosition(15,60)
                            gua.setScale(0.3)
                            gua.setVisible(false)
                            item.addChild(gua)
                            gua.setName("guaTest")
                            item.gua = gua

                            var guahide = new cc.Sprite(res.famap)
                            guahide.setPosition(10.86,4.05)
                            item.addChild(guahide,10)
                            guahide.setName("guahide")
                            return item
                        }
                    })
                    var fama = fdj.getOut(keyName)
                    fama.keyName = keyName
                    return fama
                }else if(index==4){
                    fdj.createNew({
                        key: "ruler",
                        fun: function() {
                            var ruler = getRuler()
                            ruler.setPosition(pos)
                            ruler.setLocalZOrder(100000)
                            return ruler
                        }
                    })
                    var ruler = fdj.getOut("ruler")
                    ruler.nopos = true
                    fdj.see[0].setPosition(830, 260)
                    return ruler
                }
                return true
            },
            clickfun:function(data){
                var item = data.sp
                var index = data.index
                var pos = data.pos
                if(index==3){
                    if(item.inTh){
                        var outfama = fdj.getOut(item.keyName)
                        var infama = fdj.getIn(item.keyName)             
                        if(item.grandFather)
                        {
                            // item.grandFather.removeOne(item)
                            // item.inTh = false
                            // safeAdd(toolnode,item)
                            // item.setPosition(pos)
                            fdj.runData({
                                key:item.keyName,
                                fun:function(data){
                                    var item = data.item
                                    item.grandFather.removeOne(item)
                                    safeAdd(item.preNode,item)
                                    item.setPosition(pos)
                                }
                            })
                            item.inTh = false
                        }
                    }
                }else{
                    item.setLocalZOrder(LOCAL_ORDER++)
                }
                
                return true
            },
            movefun:function(data){
                var item = data.sp
                var pos = data.pos
                var index = data.index
                var delta = data.delta
                if(index<=2){
                    fdj.runData({
                        key:item.keyName,
                        fun:function(data){
                            var item = data.item
                            item.setPosition(pos.x+17,pos.y+20)
                        }
                    })
                }else if(index==3){
                    fdj.runData({
                        key:item.keyName,
                        fun:function(data){
                            var item = data.item
                            item.setPosition(pos.x,pos.y)
                        }
                    })
                }else if(index==4){
                    fdj.runData({
                        key:"ruler",
                        fun:function(data){
                            var item = data.item
                            item.x += delta.x
                            item.y += delta.y
                        }
                    })
                    fdj.setGet(item.getPosition())
                }
            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
                if(index<=2)
                {
                    self.checkGuagou(item)
                    item.removeListen()
                }else if(index==3){
                    self.AddFama(item)
                }else if(index==4){
                    fdj.setGet(item.getPosition())
                }            
            },
            backfun:function(data){
                var item = data.sp
                var index = data.index
                if(index<=3){
                    fdj.getIn(item.keyName).removeFromParent()
                }else if(index==4){
                    fdj.getIn("ruler").removeFromParent()
                    fdj.see[0].setPosition(500, 900)
                    fdj.setGet(cc.p(300,900))
                }
                return true
            },
            counts:[999,999,999,999,1],
            father:toolnode,
            files:[res.item1,res.item2,res.item3,res.item4,res.item5],
            gets:[null,null,null,null,null]
        })
        this.addChild(this.toolbtn,3)
    },
    AddFama:function(item){
        var self = this
        var fdj = self.fdj
        var list = self.guaGouList
        for (var i = 0; i < list.length; i++) 
        {   
            if(list[i].curTh &&judgeItemCrash({item1:item.gua,item2:list[i].curTh.gua}))
            {
                //list[i].curTh.guaFather.AddFama(item)
                var outfama = fdj.getOut(item.keyName)
                var infama = fdj.getIn(item.keyName)
                var outth = fdj.getOut(list[i].curTh.keyName)
                var inth = fdj.getIn(list[i].curTh.keyName)
                outfama.preNode = outfama.getParent()
                infama.preNode = infama.getParent()
                outth.guaFather.AddFama(outfama)
                inth.guaFather.AddFama(infama)
                // fdj.runData({
                //     key:item.keyName,
                //     fun:function(data){
                //         var item = data.item
                //         list[i].curTh.guaFather.AddFama(item)
                //     }
                // })
                // fdj.runData({
                //     key:list[i].curTh.keyName,
                //     fun:function(data){
                //         var item = data.item
                //         item.guaFather.AddFama(fama)
                //     }
                // })
                item.inTh = true
                break
            }
        }
    },
    checkGuagou:function(item){
        var self = this
        var fdj = self.fdj
        var list = self.guaGouList
        if(item.GG)
        {
            for (var i = 0; i < list.length; i++) 
            {
                if(!list[i].haveTH && judgeItemCrash({item1:item.GG,item2:list[i]}))
                {
                    // item.setPosition(list[i].stayPos)
                    // item.hideGou.setVisible(true)
                    list[i].haveTH = true
                    list[i].curTh = item
                    item.curGou = list[i]
                    fdj.runData({
                        key:item.keyName,
                        fun:function(data){
                            var item = data.item
                            item.setPosition(list[i].stayPos)
                            item.hideGou.setVisible(true)
                        }
                    })
                    break
                }
            }
        }
    },
    otherUI:function(){
        var self = this
        var fdjnode = new cc.Node()
        this.addChild(fdjnode,10)
        this.fdjnode = fdjnode

        var fdj = createFDJ({
          father: fdjnode,
          rootScale: 0.2,
          perscale: 0.1,
          max: 0.4,
          min: 0.1,
          seePos: [cc.p(560, 900)],
          getPos: [cc.p(300, 900)],
          // seePos: [cc.p(560, 300)],
          // getPos: [cc.p(300, 200)],
        })
        self.fdj = fdj
        fdj.see[0].setVisible(true)
        fdj.get[0].setVisible(true)
        fdj.see[0].setScale(0.8)
        fdj.actMove({
          judgeGet: function(data) {
            var index = data.index
            var item = data.item
            var delta = data.delta
            var pos = data.pos
            var ruler = fdj.getOut("ruler")
            var tempPos = item.getParent().convertToWorldSpace(item.getPosition())
            tempPos.x += delta.x
            tempPos.y += delta.y
            var judge = judgeInside({
              item: ruler,
              pos: tempPos,
            })
            if (!judge) {
              var backPos = getBackPos({
                item: ruler,
                pos: tempPos,
              })
              delta.x += backPos.y
              delta.y -= backPos.x
            }
            return delta
          }
        })

        fdj.createNew({
            key: "double_tjt",
            fun: function() {
                var double_tjt = new cc.Sprite(res.double_tjt)
                double_tjt.setPosition(getMiddle())
                return double_tjt
            }
        })

        fdj.createNew({
            key: "gua1",
            fun: function() {
                var gua1 = self.createGuagou()
                gua1.setPosition(437,550)
                gua1.haveTH = false
                gua1.stayPos = cc.p(454.75,510.21)
                return gua1
            }
        })
        fdj.createNew({
            key: "gua2",
            fun: function() {
                var gua2 = self.createGuagou()
                gua2.setPosition(572,550)
                gua2.haveTH = false
                gua2.stayPos = cc.p(589.75,510.21)
                return gua2
            }
        })
        fdj.createNew({
            key: "gua3",
            fun: function() {
                var gua3 = self.createGuagou()
                gua3.setPosition(707,550)
                gua3.haveTH = false
                gua3.stayPos = cc.p(724.75,510.21)
                return gua3
            }
        })
        self.guaGouList = [fdj.getOut("gua1"),fdj.getOut("gua2"),fdj.getOut("gua3")]

        // var gua1 = self.createGuagou()
        // gua1.setPosition(437,550)
        // self.addChild(gua1)
        // gua1.haveTH = false
        // gua1.stayPos = cc.p(454.75,510.21)

        // var gua2 = self.createGuagou()
        // gua2.setPosition(572,550)
        // self.addChild(gua2)
        // gua2.haveTH = false
        // gua2.stayPos = cc.p(589.75,510.21)

        // var gua3 = self.createGuagou()
        // gua3.setPosition(707,550)
        // self.addChild(gua3)
        // gua3.haveTH = false
        // gua3.stayPos = cc.p(724.75,510.21)

        // self.guaGouList = [gua1,gua2,gua3]

        // var getRuler = function() {
        //     var ruler = createRuler({
        //         max:18,
        //         devide: 28,
        //         seg: 0.65,
        //         add: 1,
        //         height: 80,
        //         lineModify: cc.p(0, 3),
        //         fontModify: cc.p(0, 5),
        //         rotate:90,
        //     })
        //     return ruler
        // }
        // fdj.createNew({
        //     key: "ruler",
        //     fun: function() {
        //         var ruler = getRuler()
        //         ruler.setPosition(300,200)
        //         return ruler
        //     }
        // })
        // createTouchEvent({
        //     item:fdj.getOut("ruler"),
        //     begin:function(){
        //         return true
        //     },
        //     move:function(data){
        //         var delta = data.delta
        //         var pos = data.pos
        //         fdj.runData({
        //             key:"ruler",
        //             fun:function(data){
        //                 var item = data.item
        //                 item.x += delta.x
        //                 item.y += delta.y
        //             }
        //         })
        //         fdj.setGet(pos)
        //     }
        // })
    },
    createGuagou:function(){
        var guaGou = new cc.Sprite(res.guaGou1)
        var gua = new cc.Sprite(res.guaGou2)
        gua.setPosition(45,150)
        guaGou.addChild(gua)

        guaGou.setScale(0.3842)
        return guaGou
    },
    speakeBykey:function(key){
        var self = this
        self.nodebs.say({
                    key: key,
                    force: true,
                    fun:function(){
                        self.key = null
                    }
                })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.toolbtn.show()
            self.nodebs.show(function() {
               
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,900);
        
        addContent({
            people: this.nodebs,
            key: "wenzi1",
            img:res.wenzi1,
            sound: res.zimp1
        })

        addContent({
            people: this.nodebs,
            key: "wenzi2",
            img:res.wenzi2,
            sound: res.zimp2
        })

        addContent({
            people: this.nodebs,
            key: "wenzi3",
            img:res.wenzi3,
            sound: res.zimp3
        })
    }  
})