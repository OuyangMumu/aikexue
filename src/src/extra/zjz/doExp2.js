var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super()
        var self = this
        this.expCtor()
        this.initUI()
        return true
    },
    initUI:function(){
        var self = this
        self.curLayer = null
        var m_cha_btn = new ccui.Button(res.expbtn3_nor,res.expbtn3_sel,res.expbtn3_sel)
        m_cha_btn.setPosition(100,400)
        this.addChild(m_cha_btn)
        var setBtnVis = function(btn,judg){
            btn.setEnabled(judg)
            btn.setBright(judg)
            if(self.setting){
                self.setting.removeFromParent()
                self.setting = null
            }
            if(self.curLayer){
                self.curLayer.nodebs.stopSay()
                self.curLayer.removeFromParent()
                self.curLayer = null
            }
        }
        var m_shao_btn = new ccui.Button(res.expbtn4_nor,res.expbtn4_sel,res.expbtn4_sel)
        m_shao_btn.setPosition(100,270)
        this.addChild(m_shao_btn)

        m_cha_btn.addClickEventListener(function(){
            setBtnVis(m_cha_btn,false)
            setBtnVis(m_shao_btn,true)
            if(self.curLayer){
                self.curLayer.removeFromParent()
                self.curLayer = null
            }
            self.curLayer = new mydoExp1()
            self.addChild(self.curLayer,10)
        })

        m_shao_btn.addClickEventListener(function(){
            setBtnVis(m_cha_btn,true)
            setBtnVis(m_shao_btn,false)
            if(self.curLayer){
                self.curLayer.removeFromParent()
                self.curLayer = null
            }
            self.curLayer = new mydoExp2()
            self.addChild(self.curLayer,10)
        })

        setBtnVis(m_cha_btn,false)
        self.curLayer = new mydoExp1()
        self.addChild(self.curLayer)
    },
    preExit:function(){
        var toFadeOut = function(node){
            if(node){
                for(var i in node.getChildren()){
                    var cur = node.getChildren()[i]
                    cur.runAction(cc.fadeOut(0.2))
                    toFadeOut(cur)
                }
            }
        }
        if(this.curLayer){
            toFadeOut(this.curLayer)  
        }
    }
})

var mydoExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "mydoExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
            loadPlist("zjzNums")
            loadPlist("renums")
            loadPlist("bs")
            loadPlist("bbs")
        })
        this._super()
        var self = this
        this.initUI()
        this.initSet()
        this.initPeople()
        this.expMyEnter()
        return true
    },
    initSet:function(){
        var self = this
        var setting = createSetting({
            pos: cc.p(1080,580),
            biaogeFun:function(){
                if (!self.bgs){
                    var bgg = createBiaoge({
                      json: res.biao2,
                      scale: 0.9,
                      inputNum:2
                    })
                    var list = [
                            "ht_btn","img_dui","img_cuo",
                            "bg_x","bg_select1","bg_select2",
                            "bg_select3","bg_select4",
                            "bg_tip1","img_bg","bxx1_1",
                            "bxx1_2","none","zs","zs1","zs2",
                            "dz","dz1","dz2"
                            ]
                    loadList(bgg, list)
                    self.addChild(bgg)
                    self.bgs = bgg
                    bgg.bxx1_2.curIndex = 1
                    bgg.bxx1_2.curItem = null
                    bgg.bxx1_2.rightNum = {r:1,w:1}
                    bgg.bxx1_2.curNum = {r:1,w:1}
                    for (var i = 0; i < 4; i++) {
                        var item = bgg[sprintf("bg_select%d",i+1)]
                        item.index = i+1
                        item.initPos = item.getPosition()
                        createTouchEvent({
                            item:item,
                            begin:function(){
                                return true
                            },
                            autoMove:true,
                            end:function(data){
                                var item = data.item
                                if(judgeItemCrash({item1:item,item2:bgg.bxx1_2}))
                                {
                                    item.setVisible(false)
                                    item.disListen(true)
                                    bgg.bxx1_2.setVisible(true)
                                    if(bgg.bxx1_2.curItem){
                                        var pos = bgg.bxx1_2.curItem.initPos
                                        bgg.bxx1_2.curItem.setPosition(pos)
                                        bgg.bxx1_2.curItem.setVisible(true)
                                        bgg.bxx1_2.curItem.disListen(false)
                                        bgg.bxx1_2.curItem = null
                                    }
                                    var num = bgg.bxx1_2.curIndex
                                    var str2 = "bxxx"+num+"_"+item.index+".png"
                                    bgg.bxx1_2.setSpriteFrame(str2)
                                    bgg.bxx1_2.curNum = {r:num,w:item.index}
                                    bgg.bxx1_2.curItem = item
                                    bgg.none.setVisible(false)
                                    bgg.bxx1_2.setVisible(true)
                                    bgg.img_dui.setVisible(false)
                                    bgg.img_cuo.setVisible(false)
                                }else{
                                    item.setPosition(item.initPos)
                                    if(bgg.bxx1_2.curItem){
                                        var pos = bgg.bxx1_2.curItem.initPos
                                        bgg.bxx1_2.curItem.setPosition(pos)
                                        bgg.bxx1_2.curItem = null
                                    }
                                }
                            }
                        })
                    }
                    bgg.img_bg.inputStr = function(str1,str2){
                        if(!this.input1){
                           this.input1 = this.getChildByName("input1")
                           this.input2 = this.getChildByName("input2") 
                        }
                        this.input1.setStr(str1)
                        this.input2.setStr(str2)
                    }
                    bgg.img_bg.getInputStr = function(){
                        var data = {}
                        data.hour = this.input1.getStr()
                        data.mins = this.input2.getStr()
                        return data
                    }
                    bgg.img_bg.inputStr("","")
                    var hiddenSome = function(judg){
                        for (var i = 0; i < 4; i++) {
                            bgg[sprintf("bg_select%d",i+1)].setVisible(judg)
                            bgg[sprintf("bg_select%d",i+1)].disListen(!judg)
                        }
                        bgg.bg_x.setVisible(judg)
                        bgg.bxx1_1.setVisible(judg)
                        bgg.bxx1_2.setVisible(judg)
                        bgg.dz.setVisible(false)
                        bgg.dz1.setVisible(false)
                        bgg.dz2.setVisible(false)
                        bgg.zs.setVisible(false)
                        bgg.zs1.setVisible(false)
                        bgg.zs2.setVisible(false)
                    }
                    var changeZs = function(time){
                        var h = time.h
                        var m = time.m
                        bgg.changeT = function(node,h,m){
                            var zhens = node.getChildByName("zhens")
                            var hs = zhens.getChildByName("s")
                            var ms = zhens.getChildByName("m")
                            hs.setRotation(h*30)
                            ms.setRotation(m*30)
                        }
                        bgg.changeT(bgg.zs,h,m)
                        bgg.changeT(bgg.zs1,h,m)
                        bgg.changeT(bgg.zs2,h,m)
                        bgg.zs1.time = {h:h,m:m}
                    }
                    var changeDs = function(time){
                        var h = time.h
                        var m = time.m
                        bgg.changeT1 = function(node,h,m,scale,pos){
                            if(!node.lab){
                                node.lab = new cc.LabelTTF("","",24)
                                node.lab.setPosition(node.width/2+pos.x,node.height/2+pos.y)
                                node.addChild(node.lab)
                                node.lab.setColor(cc.color(0,0,0))
                                node.lab.setScale(scale.x,scale.y)
                            }
                            var hours = h+""
                            var miu = m+""
                            if(hours.length==1) hours = "0" + hours
                            if(miu.length==1) miu = "0" + miu
                            node.lab.setString(hours+":"+miu)
                        }
                        bgg.changeT1(bgg.dz,h,m,cc.p(-1,1),cc.p(0,0))
                        bgg.changeT1(bgg.dz1,h,m,cc.p(1,1),cc.p(10,0))
                        bgg.changeT1(bgg.dz2,h,m,cc.p(1,1),cc.p(10,0))
                        bgg.dz1.time = {h:h,m:m}
                    }
                    var hiddenTypeZ = function(status){
                        switch(status){
                            case "sz":
                                bgg.zs.setVisible(false)
                                bgg.zs1.setVisible(false)
                                bgg.zs2.setVisible(false)
                                bgg.img_cuo.setVisible(false)
                                bgg.dz.setVisible(true)
                                bgg.dz2.setVisible(true)

                            break
                            case "dz":
                                bgg.dz.setVisible(false)
                                bgg.dz1.setVisible(false)
                                bgg.dz2.setVisible(false)
                                bgg.img_cuo.setVisible(false) 
                                bgg.zs.setVisible(true)
                                bgg.zs2.setVisible(true)
                            break
                        }
                    }
                    var tochange = function(){
                        var num = Math.ceil(Math.random()*5)
                        var num1 = Math.ceil(Math.random()*4)
                        bgg.bxx1_2.rightNum = {r:num,w:num1}
                        if(num<=3){
                            hiddenSome(true)
                            var str = "bg_x"+num+"_"+num1+".png"
                            bgg.bg_x.setSpriteFrame(str)
                            bgg.bg_tip1.setTexture(res.bg_tip1)
                            for (var i = 0; i < 4; i++) {
                                var toi = i+1
                                var str1 = "bgx"+num+"_"+toi+".png"

                                bgg[sprintf("bg_select%d",i+1)].setSpriteFrame(str1)
                            }
                            var str2 = "bxx"+num+"_"+num1+".png"
                            bgg.bxx1_1.setSpriteFrame(str2)
                            bgg.img_dui.setVisible(false)
                            bgg.img_cuo.setVisible(false)
                            bgg.bxx1_2.curIndex = num
                            bgg.none.setVisible(true)
                            bgg.bxx1_2.setVisible(false)
                            bgg.img_bg.setVisible(false)
                            if(bgg.bxx1_2.curItem){
                                var pos = bgg.bxx1_2.curItem.initPos
                                bgg.bxx1_2.curItem.setVisible(true)
                                bgg.bxx1_2.curItem.disListen(false)
                                bgg.bxx1_2.curItem.setPosition(pos)
                                bgg.bxx1_2.curItem = null
                            }
                        }else if(num==4){
                            bgg.bg_tip1.setTexture(res.bg_tip2)
                            hiddenSome(false)
                            hiddenTypeZ("dz")
                            var temp1 = Math.floor(Math.random()*13)
                            var temp2 = Math.floor(Math.random()*13)
                            changeZs({h:temp1,m:temp2})
                            bgg.img_bg.inputStr("","")
                            bgg.img_bg.setVisible(true)
                        }else if(num==5){
                            bgg.bg_tip1.setTexture(res.bg_tip3)
                            hiddenSome(false)
                            hiddenTypeZ("sz")
                            var temp3 = Math.floor(Math.random()*25)
                            var temp4 = Math.floor(Math.random()*61)
                            changeDs({h:temp3,m:temp4})
                            bgg.img_bg.inputStr("","")
                            bgg.img_bg.setVisible(true)
                        }
                    }
                    
                    bgg.ht_btn.addClickEventListener(function(){
                        tochange()
                    })
                    bgg.upLoadFun = function(){
                        cc.log(bgg.bxx1_2.rightNum.r)
                        if(bgg.bxx1_2.rightNum.r<=3){
                            if(bgg.bxx1_2.curItem){
                                if((bgg.bxx1_2.rightNum.r == bgg.bxx1_2.curNum.r)&&(
                                    bgg.bxx1_2.rightNum.w == bgg.bxx1_2.curNum.w)){
                                    bgg.img_dui.setVisible(true)
                                    bgg.img_cuo.setVisible(false)
                                }else{
                                    bgg.img_cuo.setVisible(true)
                                    bgg.img_dui.setVisible(false)
                                }
                            } else{
                                bgg.img_cuo.setVisible(true)
                                bgg.img_dui.setVisible(false)
                            }
                        }else if(bgg.bxx1_2.rightNum.r==4){
                            bgg.none.setVisible(false)
                            bgg.zs1.setVisible(true)
                            var data = bgg.img_bg.getInputStr()
                            if(bgg.changeT) bgg.changeT(bgg.zs1,data.hour,data.mins)
                            if(data.hour==bgg.zs1.time.h && data.mins==bgg.zs1.time.m)
                            {
                                bgg.img_cuo.setVisible(false)
                               bgg.img_dui.setVisible(true) 
                            }else{
                               bgg.img_cuo.setVisible(true)
                               bgg.img_dui.setVisible(false) 
                            }
                        }else if(bgg.bxx1_2.rightNum.r==5){
                            bgg.none.setVisible(false)
                            bgg.dz1.setVisible(true)
                            var data = bgg.img_bg.getInputStr()
                            if(bgg.changeT1) bgg.changeT1(bgg.dz1,data.hour,data.mins)
                            if(data.hour==bgg.dz1.time.h && data.mins==bgg.dz1.time.m)
                            {
                                bgg.img_cuo.setVisible(false)
                               bgg.img_dui.setVisible(true) 
                            }else{
                               bgg.img_cuo.setVisible(true)
                               bgg.img_dui.setVisible(false) 
                            }
                        }
                    }
                    bgg.linkAnswer = function(){
                        var nums = bgg.bxx1_2.rightNum
                        cc.log(nums.r)
                        if(nums.r<=3){
                            var str2 = "bxxx"+nums.r+"_"+nums.w+".png"
                            bgg.bxx1_2.curNum = bgg.bxx1_2.rightNum
                            bgg.bxx1_2.setSpriteFrame(str2)
                            bgg.none.setVisible(false)
                            bgg.img_cuo.setVisible(false)
                            bgg.bxx1_2.setVisible(true)
                            if(bgg.bxx1_2.curItem){
                                var pos = bgg.bxx1_2.curItem.initPos
                                bgg.bxx1_2.curItem.setVisible(true)
                                bgg.bxx1_2.curItem.disListen(false)
                                bgg.bxx1_2.curItem.setPosition(pos)
                                bgg.bxx1_2.curItem = null
                            }
                        }else if(nums.r==4){
                            bgg.zs1.setVisible(true)
                            var hours = bgg.zs1.time.h
                            var miu = bgg.zs1.time.m
                            if(hours.length==1) hours = "0" + hours
                            if(miu.length==1) miu = "0" + miu
                            bgg.img_bg.inputStr(hours,miu)
                        }else if(nums.r==5){
                            bgg.dz1.setVisible(true)
                            var hours = bgg.dz1.time.h
                            var miu = bgg.dz1.time.m
                            if(hours.length==1) hours = "0" + hours
                            if(miu.length==1) miu = "0" + miu
                            bgg.img_bg.inputStr(hours,miu)
                        }
                    }
                }
                var bgg = self.bgs
                bgg.show()
            }
        })
        self.addChild(setting)
    },
    initUI:function(){
        var self = this
        var tus = []
        var UINames = ["upnum","renum","num","boy","lbg2","kzi1","kzi2"]
        var node = loadNode(res.doJson1,UINames)
        node.setScale(0.9)
        node.setPosition(100,60)
        self.addChild(node)
        node.lbg2.setVisible(false)

        node.renum.sp = new cc.Sprite("#renum1.png")
        node.renum.sp.setScale(-1,1)
        node.renum.addChild(node.renum.sp)
        node.renum.sp.setVisible(false)

        node.upnum.sp = new cc.Sprite("#beimg1.png")
        node.upnum.addChild(node.upnum.sp)

        node.boy.sp = new cc.Sprite("#zjz_boy1.png")
        node.boy.addChild(node.boy.sp)
        node.boy.sp.isRun = false
        node.boy.sp.Dire = false
        node.boy.sp.playAc = function(){
            var sp = this
            if(!sp.isRun){
                sp.isRun = true
                var ac = createAnimation({
                  frame:"zjz_boy%d.png",
                  start:1,
                  rever:sp.Dire,
                  end: 5,
                  time: 0.05,
                  fun:function(){
                      sp.isRun = false
                      sp.Dire = !sp.Dire
                      node.lbg2.setVisible(sp.Dire)
                      var dis = sp.Dire ? -1:1
                      node.upnum.sp.setScale(dis,1)
                      node.kzi1.setVisible(!sp.Dire)
                      node.kzi2.setVisible(sp.Dire)
                  }
                })
                sp.runAction(ac)
            }
        }

        var numk = new cc.Sprite("#numk.png")
        numk.setPosition(0,-500)
        numk.setScale(1.05)
        self.addChild(numk,100)

        createTouchEvent({
            item:node.boy.sp,
            begin:function(data){
                var item = data.item
                item.playAc()
                return false
            }
        })

        for (var i = 0; i < 14; i++) {
          tus[i] = sprintf("#num%d.png",i+1)
        }
        var showTu = function(Index){
            cc.log(index)
            node.num.setSpriteFrame(sprintf("renum%d.png",Index+1))
            if(!node.renum.sp.isVisible())
                node.renum.sp.setVisible(true)
            node.renum.sp.setSpriteFrame(sprintf("renum%d.png",Index+1))
            node.upnum.sp.setSpriteFrame(sprintf("beimg%d.png",Index+2))
        }
        var curImg = null
        var curIndex = null
        var list = createList({
                list:tus,
                num:5,
                arrow:"yellow",
                type:"H",
                ifPage:false,
                ifnoMove:true,
                size:cc.size(690,170),
                clickFun:function(data){
                    curImg = data.item
                    curIndex = data.index
                    curImg.setScale(1.1)
                    return true
                },
                endFun:function(data){
                    if(curImg) {
                       curImg.setScale(1)
                       numk.setPosition(getWorldPos(curImg)) 
                    }
                    if(curIndex!=null) showTu(curIndex)       
                }
              })
        list.setScale(0.9)
        list.setPosition(540,85)
        self.addChild(list)
    },
    speakeBykey:function(key){
       this.nodebs.say({
                    key: key,
                    force: true
                })
    },
    expMyEnter: function() {
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.speakeBykey("wenzi6")
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
            key: "wenzi6",
            img:res.wenzi6,
            sound: res.zimp6
        })
    }  
})

var mydoExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "mydoExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
            loadPlist("goods")
            loadPlist("zjzNums")
        })
        this._super()
        var self = this
        this.initUI()
        this.initSet()
        this.initPeople()
        this.expMyEnter()
        return true
    },
    initSet:function(){
        var self = this
        var setting = createSetting({
            pos: cc.p(1080, 580)
        })
        self.addChild(setting)
    },
    initUI:function(){
        var self = this

        var desk = new cc.Sprite("#exp2bg.png")
        desk.setPosition(580,395)
        self.addChild(desk)

        var goods1 = new cc.Sprite("#goods1.png")
        goods1.setPosition(337,139)
        desk.addChild(goods1)

        var tus = []
        for (var i = 6; i < 10; i++) {
          tus[i-6] = sprintf("#goods%d.png",i)
        }
        var showTu = function(index){
            if(!self.wenzi){
                self.wenzi = true
                self.speakeBykey("wenzi8")
            }
            goods1.setSpriteFrame(sprintf("goods%d.png",index+2))
            if (index == 0) {
                if (!goods1.pencil) {
                    goods1.pencil = new cc.Sprite("#pencil.png")
                    goods1.pencil.setAnchorPoint(0.23,0)
                    goods1.pencil.setPosition(284,114)
                    goods1.addChild(goods1.pencil)

                    goods1.pencil1 = new cc.Sprite("#pencil.png")
                    goods1.pencil1.setAnchorPoint(0.23,0)
                    goods1.pencil1.setScale(-1,1)
                    goods1.pencil1.setPosition(338,128)
                    goods1.addChild(goods1.pencil1)
                }
                goods1.pencil.setVisible(true)
                goods1.pencil1.setVisible(true)
            }else{
                if(goods1.pencil) {
                   goods1.pencil.setVisible(false)
                   goods1.pencil1.setVisible(false)
                }
            }
        }
        var numk = new cc.Sprite("#numk.png")
        numk.setPosition(0,-500)
        numk.setScale(1.05)
        self.addChild(numk,100)
        var curImg = null
        var curIndex = null
        var list = createList({
                list:tus,
                num:4,
                arrow:"yellow",
                type:"H",
                ifPage:false,
                ifnoMove:true,
                size:cc.size(600,170),
                clickFun:function(data){
                    curImg = data.item
                    curIndex = data.index
                    curImg.setScale(1.1)
                    return true
                },
                endFun:function(data){
                    if(curImg) {
                       curImg.setScale(1)
                       numk.setPosition(getWorldPos(curImg)) 
                    }
                    if(curIndex!=null) showTu(curIndex) 
                }
              })
        list.setScale(0.9)
        list.setPosition(540,85)
        self.addChild(list)
    },
    speakeBykey:function(key,status){
        var self = this
        if(!status){
            if(!self[key]){
                self[key] = true
                this.nodebs.say({
                    key: key,
                    force: true
                })  
            } 
        }else{
            dialogControl.AddDialog("Tips", {
                        res: res[key],
                        face: 1,
                        confirmBtn: true,
                        father: self
                  })
        }       
    },
    expMyEnter: function() {
        if (this.nodebs) {
            var self = this
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
            key: "wenzi8",
            img:res.wenzi8,
            sound: res.zimp7,
            offset: cc.p(40,20),
            //btnoffset:cc.p(0,-20)
        })
    }  
})