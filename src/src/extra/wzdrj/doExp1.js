/**
 * Created by Administrator on 2016/7/14.
 */
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor({
            vis: false,
            setZ:99,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun:function(){
                    if(!self.biaoge){
                        var bg = createBiaoge({
                            json: res.wzdrj_table1_json,
                            scale:0.9,
                            downData: {
                                nums: 15,
                                bufs: [
                                    [null, res.ok, res.no],[null, res.yes, res.no],
                                    [null, res.yes, res.no],[null, res.ok, res.no],
                                    [null, res.yes, res.no],[null, res.ok, res.no],
                                    [null, res.yes, res.no],[null, res.yes, res.no],
                                    [null, res.ok, res.no],[null, res.yes, res.no],
                                    [null, res.ok, res.no],[null, res.yes, res.no],
                                    [null, res.yes, res.no],[null, res.ok, res.no],
                                    [null, res.yes, res.no],
                                ],
                                keys: [
                                    2, 1, 2, 2, 1,  1, 2, 1, 1, 2  , 1,2,1,1,2
                                ]
                            },
                        })
                        self.biaoge = bg
                        safeAdd(self, bg)
                    }
                    self.biaoge.show()
                },
            }
        })
        this.initPeople()
        this.initUI()
        return true;
    },

    dataBag : {},
 
    initUI: function () {
    	var self = this
        loadPlist("shiyanPlist")
        loadPlist("mianfenPlist")
        loadPlist("nituPlist")
        loadPlist("matter_sb")
        loadPlist("jiaobanPlist")
        loadPlist("matter_jbz")
        loadPlist("waterRise")
        loadPlist("filter_mianfen")
        loadPlist("filter_nitu")
        loadPlist("filter_shiyan")
        loadPlist("fpPlist")
        loadPlist("fpOpen")
    	var uiList = [
            "shiyan", "nitu", "mianfen","btn_stri" ,"sign_mianfen" , "sign_nitu",
            "sign_shiyan", "btn_filter_1", "btn_filter_2", "btn_filter_3",
            "shaobei_sy", "shaobei_nt", "shaobei_mf",
            "hob" , "shaobei", "waterRise" , "fp", "bolibang","tiequan",
            "fdj" , "zongjie"
    	]
     	var node = loadNode(res.wzdrj_do1_json,uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function() {
            self.nodebs.say({key:"do1_tip1"})
        })

        var judgeOver = [false,false,false]
        var dataBag = self.dataBag
        dataBag.shiyan = node.shiyan
        dataBag.nitu = node.nitu
        dataBag.mianfen = node.mianfen
        node.shiyan.onece = true //用来限制触摸后只调用一次
        node.nitu.onece = true
        node.mianfen.onece = true
        dataBag.shiyan.sy = true
        dataBag.nitu.nt = true
        dataBag.mianfen.mf = true
        var beginPos = 0
        for(var i = 0 ; i < 3 ; i++){
            node[uiList[i]].index = i
            createTouchEvent({
                item:node[uiList[i]],
                rect:cc.rect(node[uiList[i]].width/2, 50, node[uiList[i]].width/2, node[uiList[i]].height/2),
                begin:function(data){
                    var item = data.item
                    beginPos = item.getPosition()
                    if(item.onece){
                        item.onece = false
                        item.over = false
                        item.begin = true
                        switch (item.index){
                            case 0:
                                item.frame = "shiyan%02d.png"
                                item.img = "shiyan05.png"
                                break
                            case 1:
                                item.frame = "nitu%02d.png"
                                item.img = "nitu05.png"
                                break
                            case 2:
                                item.frame = "mianfen%02d.png"
                                item.img = "mianfen05.png"
                                break
                        }
                        item.runAction(anipaper(item,1,5,item.frame,item.img))
                    }
                    return true
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta
                    if(item.over)   return
                    item.x += delta.x
                    item.y += delta.y
                    checkShaobei(item)
                },
                end:function(data){
                    var item = data.item
                    checkShaobei(item)
                    if(item && !item.over){
                        item.setPosition(beginPos)
                        item.stopAllActions()
                        item.onece = true
                        if(item.sy){
                            item.setSpriteFrame("shiyan01.png")
                        }else if(item.nt){
                            item.setSpriteFrame("nitu01.png")
                        }else if(item.mf){
                            item.setSpriteFrame("mianfen01.png")
                        }
                    }
                },
            })
        }
        var checkShaobei = function(item){
            if(!item.over && !item.begin){
                switch (item.index){
                    case 0:
                        item.shaobei = node.shaobei_sy
                        item.matter = "shiyan_sb%02d.png"
                        item.endNum = 8
                        break
                    case 1:
                        item.shaobei = node.shaobei_nt
                        item.matter = "nitu_sb%02d.png"
                        item.endNum = 13
                        break
                    case 2:
                        item.shaobei = node.shaobei_mf
                        item.matter = "mianfen_sb%02d.png"
                        item.endNum = 12
                        break
                }
                if(checkDistance(item,item.shaobei)){
                    item.over = true
                    item.setPosition(item.shaobei.x-120,item.shaobei.y+100)
                    item.runAction(anipaper(item,6,17,item.frame))
                    var solve = item.shaobei.getChildByName("sb")
                    solve.runAction(anishaobei(item.endNum,item.matter))
                    if(item.index == 2)   //第三个位置有偏差
                        item.setPositionX(item.x-10)
                }
            }
        }
        var anipaper = function(item,start,end,frame,img) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time: 0.1
            }), cc.callFunc(function() {
                if(end == 5){
                    item.begin = false
                    item.setSpriteFrame(img)
                }else{
                    item.stopAllActions()
                    item.removeFromParent(true)
                    judgeOver[item.index] = true
                }
            }))
        }
        var anishaobei = function(end,frame) {
            return cc.sequence(createAnimation({
                frame: frame,
                end: end,
                time: 0.15
            }), cc.callFunc(function() {
                judgeBtnVis()
            }))
        }
        var anijiaoban = function(start,end,item) {
            return cc.sequence(createAnimation({
                frame: "jiaoban%02d.png",
                start: start,
                end: end,
                time: 0.15
            }), cc.callFunc(function() {
                item.stopAllActions()
                if(start == 1){
                    item.runAction(anirepeat())
                }else{
                    item.removeFromParent(true)
                }
        
            }))
        }
        var anirepeat = function(){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:"jiaoban%02d.png",
                start: 9,
                end: 16,
                time: 0.1
            })))
        }
        var judgeBtnVis = function(){
            var judge = false
            for(var i = 0 ; i < judgeOver.length ; i++){
                if(!judgeOver[i])
                    judge = true
            }
            if(!judge){
                node.btn_stri.setVisible(true)
                self.nodebs.say({key:"do1_tip2",force:true})
            }
        }
        var checkDistance = function(item1,item2){
            var dx = (item1.x + item1.width/4) - item2.x
            var dy = (item1.y + 50) - (item2.y + item2.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 100)
                return true
            else
                return false
        }
        var animatter_jbz = function(end,frame) {
            return cc.sequence(createAnimation({
                frame: frame,
                end: end,
                time: 0.4
            }), cc.callFunc(function() {
            }))
        }

        var btn_filter_shiyan = new ccui.Button(res.btn_filter_shiyan,res.btn_filter_shiyan2)
        btn_filter_shiyan.setPosition(100,320)
        self.addChild(btn_filter_shiyan)
        var btn_filter_nitu = new ccui.Button(res.btn_filter_nitu,res.btn_filter_nitu2)
        btn_filter_nitu.setPosition(100,250)
        self.addChild(btn_filter_nitu)
        var btn_filter_mianfen = new ccui.Button(res.btn_filter_mianfen,res.btn_filter_mianfen2)
        btn_filter_mianfen.setPosition(100,180)
        self.addChild(btn_filter_mianfen)

        var filterBtnList = [btn_filter_shiyan,btn_filter_nitu,btn_filter_mianfen]
        for (var i = filterBtnList.length - 1; i >= 0; i--) {
            filterBtnList[i].setVisible(false)
        }
        node.btn_stri.addClickEventListener(function(){
            if(node.btn_stri.isVisible()){
                node.btn_stri.setVisible(false)
                var jbani = function(jb){
                    jb.scheduleOnce(function(){
                        jb.stopAllActions()
                        jb.runAction(anijiaoban(17,24,jb))
                    },5)
                }
                //搅拌的时候烧杯中的物质开始变化
                self.scheduleOnce(function(){
                    for(var i = 10 ; i < 13 ; i++){
                        var jb = node[uiList[i]].getChildByName("jb")
                        jb.runAction(anijiaoban(1,8,jb))
                        jbani(jb)
                        var jbz = node[uiList[i]].getChildByName("sb")
                        if(i == 10){
                            jbz.runAction(animatter_jbz(4,"shiyan_jbz%02d.png"))
                        }else if(i == 11){
                            jbz.runAction(animatter_jbz(9,"nitu_jbz%02d.png"))
                        }else if(i == 12){
                            jbz.runAction(animatter_jbz(9,"mianfen_jbz%02d.png"))
                        }
                    }
                },0.6)

                self.scheduleOnce(function(){
                    self.nodebs.say({key:"do1_tip3"})
                    for (var i = 7 ; i < 10 ; i++) {
                        node[uiList[i]].setVisible(true)
                    }
                },9.5)
            }
        })
        
        node.btn_filter_1.addClickEventListener(function(){
            filter(1)
        })
        node.btn_filter_2.addClickEventListener(function(){
            filter(2)
        })
        node.btn_filter_3.addClickEventListener(function(){
            filter(3)
        })
        var shaobei = node.shaobei
        var filter = function(index){
            if(!node.btn_filter_1.isVisible())  return  //设置当三个按钮可以出现后可点
            for (var i = filterBtnList.length - 1; i >= 0; i--) {
                filterBtnList[i].setVisible(true)
            }
            for (var i = 4; i < 13; i++) {
                node[uiList[i]].setPositionY(-500)
                node[uiList[i]].removeFromParent(true)
            }

            // for(var i = 0 ; i < 3;i++){
            //     if(node[uiList[i]])
            //         node[uiList[i]].setPositionY(-500)
            // }

            //设置第二个实验出现入口
            node.hob.setPosition(470,270)
            curNum = index - 1
            secondOperate(curNum)
        }
        var sbData = [{
            hand:"hand_shiyan.png",
            full:"full_shiyan.png",
            normal:res.btn_filter_shiyan,
            select:res.btn_filter_shiyan2,
            frame:"filter_shiyan%02d.png",
            fp:"fp_shiyan%02d.png",
            lastfp:"last_shiyan.png",
            fdjPaper:res.fdj_shiyan,
            zongjie:res.shiyan_wenzi,
            tip:"do1_tip4",
            sound:"sound8"
            },{
            hand:"hand_nitu.png",
            full:"full_nitu.png",
            normal:res.btn_filter_nitu,
            select:res.btn_filter_nitu2,
            frame:"filter_nitu%02d.png",
            fp:"fp_nitu%02d.png",
            lastfp:"last_nitu.png",
            fdjPaper:res.fdj_nitu,
            zongjie:res.nitu_wenzi,
            tip:"do1_tip5",
            sound:"sound9"
            },{
            hand:"hand_mianfen.png",
            full:"full_mianfen.png",
            normal:res.btn_filter_mianfen,
            select:res.btn_filter_mianfen2,
            frame:"filter_mianfen%02d.png",
            fp:"fp_mianfen%02d.png",
            lastfp:"last_mianfen.png",
            fdjPaper:res.fdj_mianfen,
            zongjie:res.mianfen_wenzi,
            tip:"do1_tip6",
            sound:"sound10"
            }
        ]
        var hob = node.hob
        var fp = node.fp
        var fdj = node.fdj
        var curNum = 0
        btn_filter_shiyan.addClickEventListener(function(){
            secondOperate(0)
        })
        btn_filter_nitu.addClickEventListener(function(){
            secondOperate(1)
        })
        btn_filter_mianfen.addClickEventListener(function(){
            secondOperate(2)
        })
        var fdjBig = function(){
            var fdj_sp = new cc.Sprite(res.fdjjm)
            var bigfdj = new cc.ClippingNode(fdj_sp)
            bigfdj.setLocalZOrder(99)
            bigfdj.setPosition(780,-600)
            bigfdj.setAlphaThreshold(0)
            var fdjBg = new cc.Sprite(res.fdjBg)
            bigfdj.addChild(fdjBg)
            fdjBg.setPosition(0,0)
            fdjBg.setScale(1.2)
            bigfdj.fdj_matter = new cc.Sprite(res.fdj_shiyan)
            bigfdj.fdj_matter.setPosition(-200,-200)
            bigfdj.addChild(bigfdj.fdj_matter)
            self.addChild(bigfdj)
            bigfdj.fdj = new cc.Sprite(res.fdjjm)
            bigfdj.fdj.setPosition(780,-600)
            self.addChild(bigfdj.fdj)
            bigfdj.fdj.setScale(1.02)
            dataBag.bigfdj = bigfdj
        }
        fdjBig()  //放大镜设置一些属性值
        var sbNoMove = false
        var secondOperate = function(index){
            var index = index
            curNum = index
            sbNoMove = false    //此处单击每一个按钮，重置所有的参数值
            shaobei.stopAllActions()
            node.fp.stopAllActions()
            node.waterRise.stopAllActions()
            shaobei.setPosition(740,250)
            shaobei.setSpriteFrame(sbData[index].full)
            safeAdd(hob,fp)
            fp.setPosition(115,330)
            safeAdd(hob,node.tiequan)
            node.waterRise.setSpriteFrame("waterRise01.png")
            node.fp.setSpriteFrame("fp_shiyan01.png")
            node.bolibang.setVisible(true)
            dataBag.bigfdj.setPositionY(-600)
            dataBag.bigfdj.fdj.setPositionY(-600)
            fdj.setPositionY(-600)
            node.zongjie.setVisible(false)
            self.nodebs.say({key:sbData[index].tip,force:true})

            createTouchEvent({
                item:shaobei,
                begin:function(data){
                    var item = data.item
                    if(!sbNoMove)
                        item.setSpriteFrame(sbData[index].hand)
                    return true
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta
                    if(sbNoMove)       return
                    item.x += delta.x
                    item.y += delta.y
                    sbAction(item,index)

                },
                end:function(data){
                    var item = data.item
                    if(!sbNoMove){
                        item.setSpriteFrame(sbData[index].full)
                        sbAction(item,index)
                    }
                }
            })
            for(var i = 0 ; i < 3 ; i++){
                if(i == index){
                    shaobei.setSpriteFrame(sbData[index].full)
                    filterBtnList[i].loadTextures(sbData[i].select,sbData[i].normal)
                }else {
                    filterBtnList[i].loadTextures(sbData[i].normal,sbData[i].select)
                }
            }
            var sbAction = function (item,index) {
                if(checkDistance2(item,hob)){
                    sbNoMove = true
                    item.setPosition(hob.x+100,hob.y+223)
                    item.runAction(animatter_dr(sbData[index].frame,item))
                    node.waterRise.runAction(aniall(19,"waterRise%02d.png"))
                    node.fp.runAction(aniall(5,sbData[index].fp))
                }
            }
            var checkDistance2 = function(item1,item2){
                var dx = (item1.x - item1.width/2) - item2.x
                var dy = (item1.y + item1.height/2) - (item2.y + 150)
                var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
                if(distance <= 130)
                    return true
                else
                    return false
            }
            var animatter_dr = function(frame,item) {
                return cc.sequence(createAnimation({
                    frame: frame,
                    end: 16,
                    time: 0.2
                }), cc.callFunc(function() {
                    item.setPositionY(-300)
                    node.bolibang.setVisible(false)
                    fpAction()  //滤纸开始播动画
                }))
            }
            var fpAction = function () {
                fp.scheduleOnce(function () {
                    safeAdd(self,fp)
                    safeAdd(self,fdj)
                    fp.setPosition(hob.x+10,hob.y+80)
                    fp.runAction(cc.sequence(
                        cc.moveTo(0.1,cc.p(fp.x,fp.y+150)),
                        cc.callFunc(function(){
                            fp.runAction(cc.moveTo(0.3,cc.p(fp.x+300,fp.y)))
                        }),
                        cc.callFunc(function () {
                            fp.runAction(anifp())
                        })
                    ))
                },0.5)
            }
            var anifp = function() {
                return cc.sequence(createAnimation({
                    frame: "fpOpen%02d.png",
                    end: 11,
                    time: 0.15
                }), cc.callFunc(function() {
                    self.nodebs.say({key:"do1_tip7",force:true})
                    fp.setSpriteFrame(sbData[curNum].lastfp)
                    fdj.setPosition(950,450)
                    dataBag.bigfdj.fdj_matter.setTexture(sbData[curNum].fdjPaper)  //放大镜中的滤纸进行换图，
                }))
            }
            var aniall = function(end,frame) {
                return cc.sequence(createAnimation({
                    frame: frame,
                    end: end,
                    time: 0.2
                }), cc.callFunc(function() {
                }))
            }
            
            var fdjfunc = function () {
                createTouchEvent({
                    item:fdj,
                    begin:function(data){
                        return true
                    },
                    move:function(data){
                        var item = data.item
                        var delta = data.delta
                        item.x += delta.x
                        item.y += delta.y
                        if(rectContainsPoint(fp,item)){
                            item.disX = fp.x - item.x
                            item.disY = fp.y - item.y
                            dataBag.bigfdj.fdj_matter.setPosition(item.disX*3.5,item.disY*3.5)
                            if(!dataBag.bigfdj.isVisible()){
                                dataBag.bigfdj.setPosition(780,200)
                                dataBag.bigfdj.fdj.setPosition(780,200)
                                dataBag.bigfdj.setVisible(true)
                                dataBag.bigfdj.fdj.setVisible(true)
                                dataBag.bigfdj.fdj.setLocalZOrder(dataBag.bigfdj.getLocalZOrder()+1)
                                node.zongjie.first = true
                            }
                        }else {
                            if(dataBag.bigfdj.isVisible()){
                                dataBag.bigfdj.setVisible(false)
                                dataBag.bigfdj.fdj.setVisible(false)
                                dataBag.bigfdj.setPositionY(-600)
                                dataBag.bigfdj.fdj.setPositionY(-600)
                                if(!node.zongjie.isVisible() && node.zongjie.first){  //总结文字的出现
                                    node.zongjie.first = false
                                    self.nodebs.say({key:sbData[curNum].sound,force:true})
                                    node.zongjie.setVisible(true)
                                    node.zongjie.setTexture(sbData[curNum].zongjie)
                                }
                            }
                        }
                    }
                })
                var rectContainsPoint = function (rect, point) {
                    var x = rect.x - rect.width/2
                    var y = rect.y - rect.height/2
                    return (point.x >= x && point.x <= (x + rect.width) &&
                    point.y >= y && point.y <= (y + rect.height))
                }
            }
            fdjfunc()

        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do1_tip1",img:res.do1_tip1,sound:res.do1_sound1},
            {key:"do1_tip2",img:res.do1_tip2,sound:res.do1_sound2},
            {key:"do1_tip3",img:res.do1_tip3,sound:res.do1_sound3},
            {key:"do1_tip4",img:res.do1_tip4,sound:res.do1_sound4},
            {key:"do1_tip5",img:res.do1_tip5,sound:res.do1_sound5},
            {key:"do1_tip6",img:res.do1_tip6,sound:res.do1_sound6},
            {key:"do1_tip7",img:res.do1_tip7,sound:res.do1_sound7},
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
        addContent({
            people: this.nodebs,
            key: "sound8",
            sound: res.do1_sound8,
        })
        addContent({
            people: this.nodebs,
            key: "sound9",
            sound: res.do1_sound9,
        })
        addContent({
            people: this.nodebs,
            key: "sound10",
            sound: res.do1_sound10,
        })

    },
})