var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() {
        var self = this
        this._super()
        this.expCtor({
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    loadPlist("tableDraw_plist")
                    if (!self.bgg) {
                        var bg = createBiaoge({
                            json: res.gcxc_tableNode_json,
                            downData: {
                                nums: 7,
                                bufs: [
                                    [null,"#wenzi1.png","#wenzi2.png","#wenzi3.png","#wenzi4.png"],
                                    [null,"#wenzi1.png","#wenzi2.png","#wenzi3.png","#wenzi4.png"],
                                    [null,"#wenzi1.png","#wenzi2.png","#wenzi3.png","#wenzi4.png"],
                                    [null,"#wenzi1.png","#wenzi2.png","#wenzi3.png","#wenzi4.png"],
                                    [null,"#wenzi1.png","#wenzi2.png","#wenzi3.png","#wenzi4.png"],
                                    [null,"#wenzi1.png","#wenzi2.png","#wenzi3.png","#wenzi4.png"],
                                    [null,"#wenzi1.png","#wenzi2.png","#wenzi3.png","#wenzi4.png"],  
                                ],
                                scale:1.5,
                                keys: [2, 2, 2, 2, 2, 2, 2]
                            }
                        })
                        bg.biao1_bg = bg.getChildByName("biao1_bg")
                        bg.biao2_bg = bg.getChildByName("biao2_bg")
                        bg.biao3_bg = bg.getChildByName("biao3_bg")
                        bg.biao4_bg = bg.getChildByName("biao4_bg")
                        bg.btn_biao1 = bg.getChildByName("btn_biao1")
                        bg.btn_biao2 = bg.getChildByName("btn_biao2")
                        bg.btn_biao3 = bg.getChildByName("btn_biao3")
                        bg.btn_biao4 = bg.getChildByName("btn_biao4")
                        bg.btn_answer = bg.getChildByName("btn_answer")
                        bg.btn_up = bg.getChildByName("btn_up")
                        //四个表
                        var biaoList = [bg.biao1_bg,bg.biao2_bg,bg.biao3_bg,bg.biao4_bg]
                        
                        bg.bgMove1 = self.createBgMoveSp({
                            father:bg.biao1_bg,
                            imglist:[
                                ["#biao1_1.png",7],["#biao1_2.png",7],
                                ["#biao1_3.png",3],["#biao1_4.png",7],
                                ["#biao1_5.png",7],["#biao1_6.png",1],
                                ["#biao1_7.png",7],["#biao1_8.png",7],
                                ["#biao1_9.png",0],["#biao1_10.png",7],
                                ["#biao1_11.png",7],["#biao1_12.png",2]
                            ],
                            listPos:cc.p(100,-90),
                            dis:50,
                            itemScale:0.7,
                            resultfather:self,
                            result: res.biao1_result,
                            rectlist:[
                               cc.rect(20,10,100,125),cc.rect(310,10,100,125),
                               cc.rect(460,10,100,125),cc.rect(600,10,100,125),
                            ]
                        })
                        bg.bgMove2 = self.createBgMoveSp({
                            father:bg.biao2_bg,
                            result: res.biao2_result,
                            imglist:[
                                ["#biao2_1.png",7],["#biao2_2.png",7],
                                ["#biao2_3.png",1],["#biao2_4.png",7],
                                ["#biao2_5.png",7],["#biao2_6.png",3],
                                ["#biao2_7.png",7],["#biao2_8.png",7],
                                ["#biao2_9.png",4],["#biao2_10.png",7],
                                ["#biao2_11.png",2],["#biao2_12.png",0]
                            ],
                            listPos:cc.p(100,-90),
                            dis:50,
                            itemScale:0.7,
                            resultfather:self,
                            rectlist:[
                               cc.rect(5,5,100,125),cc.rect(220,5,100,125),
                               cc.rect(330,5,100,125),cc.rect(550,5,100,125),
                               cc.rect(660,5,100,125),
                            ]
                        })
                        bg.bgMove3 = self.createBgMoveSp({
                            father:bg.biao3_bg,
                            result: res.biao3_result,
                            imglist:[
                                ["#biao3_1.png",7],["#biao3_2.png",3],
                                ["#biao3_3.png",0],["#biao3_4.png",7],
                                ["#biao3_5.png",7],["#biao3_6.png",4],
                                ["#biao3_7.png",7],["#biao3_8.png",7],
                                ["#biao3_9.png",1],["#biao3_10.png",7],
                                ["#biao3_11.png",7],["#biao3_12.png",2]
                            ],
                            listPos:cc.p(100,-90),
                            dis:50,
                            itemScale:0.7,
                            resultfather:self,
                            rectlist:[
                               cc.rect(5,5,100,125),cc.rect(220,5,100,125),
                               cc.rect(330,5,100,125),cc.rect(550,5,100,125),
                               cc.rect(660,5,100,125),
                            ]
                        })
                        bg.bgMove4 = self.createBgMoveSp({
                            father:bg.biao4_bg,
                            result: res.biao4_result,
                            imglist:[
                                ["#biao4_1.png",7],["#biao4_2.png",7],
                                ["#biao4_3.png",2],["#biao4_4.png",7],
                                ["#biao4_5.png",7],["#biao4_6.png",3],
                                ["#biao4_7.png",7],["#biao4_8.png",7],
                                ["#biao4_9.png",1],["#biao4_10.png",7],
                                ["#biao4_11.png",7],["#biao4_12.png",0]
                            ],
                            listPos:cc.p(100,-90),
                            dis:50,
                            itemScale:0.7,
                            resultfather:self,
                            rectlist:[
                               cc.rect(12,10,100,125),cc.rect(250,10,100,125),
                               cc.rect(370,10,100,125),cc.rect(610,10,100,125),
                            ]
                        })
                        var bgMoveList = [bg.bgMove1,bg.bgMove2,bg.bgMove3,bg.bgMove4]
                        var btn_biaoList = [bg.btn_biao1,bg.btn_biao2,bg.btn_biao3,bg.btn_biao4]
                        
                        bg.curIndex = 1
                        bg.btn_biao1.addClickEventListener(function(){
                            bg.biaoCall(1)
                        })
                        bg.btn_biao2.addClickEventListener(function(){
                            bg.biaoCall(2)
                        })
                        bg.btn_biao3.addClickEventListener(function(){
                            bg.biaoCall(3)
                        })
                        bg.btn_biao4.addClickEventListener(function(){
                            bg.biaoCall(4)
                        })
                        bg.biaoCall = function(index){
                            for(var i = 0 ; i < 4 ; i++){
                                biaoList[i].setVisible(false)
                                biaoList[i].setPositionY(-1000)
                                btn_biaoList[i].setBright(true)
                                btn_biaoList[i].setTouchEnabled(true)
                            }
                            btn_biaoList[index-1].setBright(false)
                            btn_biaoList[index-1].setTouchEnabled(false)
                            biaoList[index-1].setVisible(true)
                            biaoList[index-1].setPositionY(450)
                            bg.curIndex = index
                        }
                        bg.biaoCall(1)
                        // bg.upLoadFun = function(){
                        //     bgMoveList[bg.curIndex-1].upResult()
                        // }
                        bg.ClearFun = function(){
                            bgMoveList[bg.curIndex-1].clearData()
                        }
                        bg.btn_answer.addClickEventListener(function(){
                            if(biaoList[bg.curIndex-1].final.close) {
                                biaoList[bg.curIndex-1].final.showIn()
                            } else {
                                biaoList[bg.curIndex-1].final.showOut()
                            }
                        })
                        bg.btn_up.addClickEventListener(function(){
                            var downList = []
                            var flag = true
                            switch(bg.curIndex){
                                case 1:
                                    downList = [bg.down1]
                                break
                                case 2:
                                    downList = [bg.down2,bg.down3]
                                break
                                case 3:
                                    downList = [bg.down4,bg.down5]
                                break
                                case 4:
                                    downList = [bg.down6,bg.down7]
                                break
                            }
                            for (var i = 0; i < downList.length; i++) {
                                var item = downList[i]
                                var down = item.down
                                if (item && item.key != null && down.key != null && item.key == down.key) {
                                    if (down.setAnswer) {
                                        down.setAnswer(true)
                                        //flag = true
                                    }
                                } else {
                                    if (down.setAnswer && down.key != null && down.key != 0) {
                                        down.setAnswer(false)
                                        flag = false
                                    }
                                }
                            }

                            bgMoveList[bg.curIndex-1].upResult(flag)
                        })

                        self.addChild(bg)
                        self.bgg = bg
                    }
                   self.bgg.show()
                }
            }
        })
        this.initPeople()
        this.initUI()
        return true
    },

    createBgMoveSp:function(data){
        var size = data.size
        var imglists = data.imglist
        var rectlist = data.rectlist
        var scale = data.scale || 1
        var father = data.father
        var direction = data.direction || "horizontal"
        var listPos = data.listPos || cc.p(863, 50)
        var rectNum = data.rectNum || 1
        var fromExp = data.fromExp || "do"
        var resultfather = data.resultfather || father

        //创建对应的答案图片
        var result = data.result


        // 每个rect对应一个存放精灵的数组
        var rectarray = []
        for (var i = 0; i < rectlist.length; i++) {
            var tmparray = []
            rectarray.push(tmparray)
        }
        var node = new cc.Node()
        var lay = createLayout({
            pos: cc.p(-53,-53),
            size: cc.size(650,145),
            op: 0,
            clip:true,
        })
        node.lay = lay
        node.addChild(lay)
        node.setLocalZOrder(1)

        var imgnode = new cc.Node()
        lay.addChild(imgnode)
        var splist = []
        var imglist = mixArray(imglists)
        var curOrder = 100
        for (var i = 0; i < imglist.length; i++) {
            var sp = new cc.Sprite(imglist[i][0])
            sp.tureImg = imglist[i][0]
            sp.setPosition(65+105*i,60) 
            sp.setScale(0.8)
            imgnode.addChild(sp)
            sp.index = i
            sp.trueNum = imglist[i][1]
            sp.gray = false
            splist.push(sp)
            createTouchEvent({
                item:sp,
                begin:function(data){
                    var item = data.item
                    var sp = new cc.Sprite(item.tureImg)
                    var pos = item.getParent().convertToWorldSpace(item.getPosition())
                    sp.setPosition(father.convertToNodeSpace(pos))
                    safeAdd(father, sp)
                    sp.setLocalZOrder(100)
                    item.child = sp
                    sp.fatherSp = item
                    sp.trueNum = item.trueNum
                    item.setOpacity(120)
                    item.disListen(true)
                    sp.setScale(scale)
                    createTouchEvent({
                        item: sp,
                        begin: function(data) {
                        var item = data.item
                        item.startpos = item.getPosition()
                        item.delitem = rectarray[item.arrayindex].splice(item.listindex, 1)
                        item.setLocalZOrder(220)
                        safeAdd(item.getParent(),item)
                        return true
                    },
                    move: function(data) {
                        data.item.x += data.delta.x
                        data.item.y += data.delta.y
                    },
                    end: function(data) {
                        var item = data.item
                        var tmp = item.delitem

                        for (var i in rectlist)
                            if (cc.rectContainsPoint(rectlist[i], item.getPosition())) {
                                item.arrayindex = i
                                node.addItem(i, tmp[0])
                                return
                            }
                        item.fatherSp.setOpacity(255)
                        item.fatherSp.disListen(false)
                        item.removeFromParent()
                    }
                })
                return true
            },
            move:function(data){
                var delta = data.delta
                var item = data.item
                item.child.x += delta.x
                item.child.y += delta.y
            },
            end:function(data){
                var item = data.item
                var pos = item.child.getPosition()
                for (var i in rectlist) {
                    if (cc.rectContainsPoint(rectlist[i], pos)) {
                        item.gray = true
                        item.child.arrayindex = i
                        node.addItem(i, item.child)
                        return
                    }
                }
                item.setOpacity(255)
                item.child.removeFromParent()
                item.disListen(false)
            }
        })
        }
        node.addItem = function(num, newitem) {
            var i = num
            var item = newitem
            var tempDis = null
            var tempFun = function(key) {
                  for (var k = 0; k < rectarray[i].length; k++) {
                        if (k == 0 || k == rectarray[i].length - 1) {
                              if (tempDis <= rectarray[i][0][key]) {
                                    rectarray[i].splice(0, 0, item)
                                    item.lisindex = 0
                                    break;
                              }
                              if (tempDis >= rectarray[i][rectarray[i].length - 1][key]) {
                                    rectarray[i].splice(rectarray[i].length, 0, item)
                                    item.lisindex = rectarray[i].length - 1
                                    break;
                              }
                        }
                        if (k >= 1) {
                              if (tempDis >= rectarray[i][k - 1][key] && tempDis <= rectarray[i][k][key]) {
                                    rectarray[i].splice(k, 0, item)
                                    item.lisindex = k
                                    break
                              }
                        }
                  }
                  if (!rectarray[i].length) {
                        rectarray[i].push(item)
                        item.lisindex = 0
                  }
            }
            switch (direction) {
                  case "horizontal":
                        tempDis = item.x
                        tempFun("x")
                        break
                  case "vertical":
                        tempDis = item.y
                        tempFun("y")
                        break
            }

            node.paixu(i, item)
        }

        node.paixu = function(num, newitem) {
            var i = num
            //排序之前的处理
            if (newitem) {
                  var getlist = []
                  var removelist = []
                  if (rectNum < rectarray[i].length) {

                        if (newitem.lisindex == rectNum) {
                              var temp = rectarray[i][rectNum]
                              rectarray[i][rectNum] = rectarray[i][rectNum - 1]
                              rectarray[i][rectNum - 1] = temp
                        }

                        for (var j = 0; j < rectNum; j++) {
                              getlist[j] = rectarray[i][j]
                        }

                        for (var k = rectNum; k < rectarray[i].length; k++) {
                              removelist[k] = rectarray[i][k]
                              removelist[k].setVisible(false)
                              removelist[k].fatherSp.setOpacity(255)
                              removelist[k].fatherSp.disListen(false)
                              removelist[k].fatherSp.gray = false
                              removelist[k].removeFromParent(true)
                        }

                        rectarray[i] = []
                        for (var m = 0; m < getlist.length; m++)
                              rectarray[i][m] = getlist[m]
                  }
            }

            var tempFun = function(key) {
                  var otherkey = (key == "x") ? "y" : "x"
                  var templen = (key == "x") ? "width" : "height"
                  var templenTo = (key == "x") ? "height" : "width"
                  for (var k = 0; k < rectarray[i].length; k++) {
                        if (1 == rectarray[i].length)
                              rectarray[i][k][key] = rectlist[i][key] + rectlist[i][templen] / 2
                        else
                              rectarray[i][k][key] = rectlist[i][key] + (k + 1) * rectlist[i][templen] / (rectarray[i].length + 1)

                        rectarray[i][k][otherkey] = rectlist[i][otherkey] + rectlist[i][templenTo] / 2
                        rectarray[i][k].setLocalZOrder(1)
                        rectarray[i][k].listindex = k
                  }
            }

            switch (direction) {
                  case "horizontal":
                        tempFun("x")
                        break
                  case "vertical":
                        tempFun("y")
                        break
            }
        }
      
        node.openListen = function(num){
            for(var i = 0; i<imglist.length; i++){
             if(!splist[i].gray)
                splist[i].disListen(false)
             if((num-6)<=i && i< num){
                splist[i].disListen(true)
             }
            }
        }
        node.openListen(12)

        node.upResult = function(flag) {
            var count = 0
            var lenflag = false

            for (var i in rectarray){
                for (var k in rectarray[i]){
                    if (rectarray[i][k]) {
                        lenflag = true
                        if(rectarray[i][k].trueNum != i)
                          count++
                    }
                }
            }
            var fault_mp
            var right_mp
            fromExp = "do"

            if(!flag)
                lenflag = false

            switch (fromExp) {
                case "see":
                    {
                        fault_mp = res.sound_fault_bs
                        right_mp = res.sound_right_bs
                    }
                    break
                case "do":
                    {
                        fault_mp = res.sound_fault
                        right_mp = res.sound_right
                    }
                    break
            }

            if(flag && count == 0){
                dialogControl.AddDialog("Tips", {
                    res: res.img_correct,
                    face: 1,
                    sound: right_mp,
                    confirmBtn: true,
                    father: resultfather
                })
                return true
            }
            if (count == 0 && lenflag){
                dialogControl.AddDialog("Tips", {
                    res: res.img_correct,
                    face: 1,
                    sound: right_mp,
                    confirmBtn: true,
                    father: resultfather
                })
            }else{
                dialogControl.AddDialog("Tips", {
                    res: res.img_fault,
                    modify: cc.p(30, 0),
                    face: 2,
                    sound: fault_mp,
                    confirmBtn: true,
                    father: resultfather
                })
            }
        }

        node.clearData = function() {
            for (var i in rectarray)
                for (var k in rectarray[i]){
                    var curItem = rectarray[i][k]
                    curItem.fatherSp.setOpacity(255)
                    curItem.fatherSp.disListen(false)
                    curItem.fatherSp.gray = false
                    rectarray[i]=[]
                    curItem.lisindex = null
                    curItem.removeFromParent()
                }           
        }


        var actionWithBtn = function(btn){
            btn.runAction(cc.repeatForever(
               cc.sequence(
                   cc.moveBy(0.5,cc.p(5,0)),
                   cc.moveBy(0.5,cc.p(-5,0))
                )))
        }
        var leftbtn = new ccui.Button(res.btn_arrow_normal,res.btn_arrow_select)
        var rightbtn = new ccui.Button(res.btn_arrow_normal,res.btn_arrow_select)

        node.addChild(rightbtn)
        node.addChild(leftbtn)
        leftbtn.setPosition(610,0)
        leftbtn.setRotation(180)
        actionWithBtn(leftbtn)
        leftbtn.addClickEventListener(function(){
            imgnode.stopAllActions()
            this.setVisible(false)
            node.openListen(6)
            rightbtn.setVisible(true)
            imgnode.runAction(cc.moveBy(0.2,cc.p(-650,0)))
        })

        rightbtn.setPosition(-100,0)
        actionWithBtn(rightbtn)
        rightbtn.setVisible(false)
        rightbtn.addClickEventListener(function(){
            imgnode.stopAllActions()
            this.setVisible(false)
            node.openListen(12)
            leftbtn.setVisible(true)
            imgnode.runAction(cc.moveBy(0.2,cc.p(650,0)))
        })
        node.setPosition(listPos)
        father.addChild(node, 100)
        var showOut = function() {
            var temp = this
            temp.runAction(cc.scaleTo(0.2,0))
            temp.close = true
        }
        var showIn = function() {
            var temp = this
            temp.runAction(cc.scaleTo(0.2,1))
            temp.close = false
            
        }
        father.final = new cc.Sprite(res.biao5_result)
        father.final.setPosition(380,60)
        father.addChild(father.final)
        father.final.result = new cc.Sprite(result)
        father.final.result.setPosition(380,180)
        father.final.addChild(father.final.result)
        father.final.btn_close = new ccui.Button(res.btn_answerclose_normal,res.btn_answerclose_select)
        father.final.btn_close.setPosition(730,320)
        father.final.addChild(father.final.btn_close)
        father.final.showIn = showIn
        father.final.showOut = showOut
        father.final.setScale(0)
        father.final.rootpos = father.final.getPosition()
        father.final.close = true
        father.final.rootScale = 1
        father.final.setLocalZOrder(500)
        father.final.btn_close.addClickEventListener(function(){
            if(!father.final.close)
                father.final.showOut()
        })
        createTouchEvent({
            item:father.final,
            begin:function(data){
                return true
            },
            autoMove:true,
        })
        return node
    },

    initUI:function(){
        loadPlist("bigImg_plist")
        var self = this
        var uiList = ["tools_1","tools_2","tools_3","tools_4"]
        var node = loadNode(res.gcxc_doExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })

        var createSp = function(res,pos,father){
            var sp = new cc.Sprite(res)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var curTool = null
        var curPlant = node.tools_1
        var plantList = [node.tools_1,node.tools_2,node.tools_3,node.tools_4]
        for(var i = 0 ; i < 4 ; i++){
            plantList[i].index = i
        }
        var toolbtn = createTool({
            pos: cc.p(290, 550),
            nums: 4,
            scale:0.7,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -7),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [1, 1, 1, 1],
            swallow: [true, true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3,res.do_tools4],
            gets: [res.do_tools1,res.do_tools2,res.do_tools3,res.do_tools4],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                var pos = data.pos
                item.nopos = true
                //item.setVisible(false)
                if(curTool){
                    curTool.forceBack()
                }
                curTool = item
                curPlant.setPositionY(-400)
                curPlant = plantList[index]
                curPlant.setPosition(pos)
                item.setPositionY(-300)
                curPlant.setPosition(340,200)
                curPlant.index = index
                return item
            },
            clickfun: function(data){
                var index = data.index
                var item = data.sp
                var pos = data.pos

                return true 
            },
            movefun: function(data){
                var index = data.index
                var item = data.sp
                var delta = data.delta
                
                //if(!item.noMove){
                    // curPlant.x += delta.x
                    // curPlant.y += delta.y
                //}
            },
            outfun: function(data){
                var index = data.index
                var item = data.sp
                
            },
            backfun:function(data){
                return false
            }
        })

        self.inside_node.addChild(toolbtn,1)
        self.toolbtn = toolbtn
        toolbtn.show()

        var fdj_node = new cc.Node()
        fdj_node.setPosition(750,250)
        self.addChild(fdj_node)
        fdj_node.setVisible(false)

        var fdj_sp = new cc.Sprite("#fdjbg.png")
        var bigfdj = new cc.ClippingNode(fdj_sp)
        bigfdj.setAlphaThreshold(0)
        bigfdj.setPosition(0,0)
        fdj_node.addChild(bigfdj)

        var fdj_item = new cc.Sprite("#bigImg1_1.png")
        fdj_item.setPosition(0,0)
        bigfdj.addChild(fdj_item)

        var bigfdj2 = new cc.Sprite("#fdjbg2.png")
        bigfdj2.setPosition(0,0)
        fdj_node.addChild(bigfdj2)


        var count = 10
        var curCount = 10  //用于切换图片
        var fdj = createSp(res.fdj,cc.p(900,350),self)
        fdj.setAnchorPoint(0.5,0.7)
        fdj.index = 10
        createTouchEvent({
            item:fdj,
            begin:function(data){
                var item = data.item
                var pos = data.pos
                //item.setPosition(pos)
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                item.x += delta.x 
                item.y += delta.y
                if(contains2(curPlant,item)){
                    if(!fdj_node.isVisible())
                        fdj_node.setVisible(true)

                    for(var i = 0 ; i < curPlant.getChildren().length ; i++){
                        var part = curPlant.getChildren()[i]
                        if(contains(part) && fdj.index != i){
                            fdj.index = i
                            count = i
                            break
                        }
                    }
                    switch(curPlant.index){
                        case 0:
                            if(contains(getPart(1)) && contains(getPart(2))){
                                count = 1
                            }
                        break
                        case 1:
                            if(contains(getPart(0)) && contains(getPart(1)) && contains(getPart(4))){
                                count = 0
                            }else if(contains(getPart(1)) && contains(getPart(4))){
                                count = 1
                            }else if(contains(getPart(2)) && contains(getPart(4))){
                                count = 2
                            }
                        break
                        case 2:
                            if(contains(getPart(1)) && contains(getPart(4))){
                                count = 1
                            }else if(contains(getPart(2)) && contains(getPart(4))){
                                count = 2
                            }else if(contains(getPart(3)) && contains(getPart(4))){
                                count = 3
                            }
                        break
                        case 3:
                            if(contains(getPart(0)) && contains(getPart(3))){
                                count = 0
                            }else if(contains(getPart(1)) && contains(getPart(3))){
                                count = 1
                            }else if(contains(getPart(2)) && contains(getPart(3))){
                                count = 2
                            }
                        break
                    }
                    if(curCount != count){
                        curCount = count
                        fdj_item.setSpriteFrame(sprintf("bigImg%d_%d.png",curPlant.index+1,curCount+1))
                    }
                }else{
                    if(fdj_node.isVisible())
                        fdj_node.setVisible(false)
                }
            }
        })

        var getPart = function(index){//得到对象的一个child
             return curPlant.getChildren()[index]
        }

        var contains = function (rect) {
            var ret = false;
            var point = curPlant.convertToNodeSpace(fdj.getPosition())
            if (point.x >= rect.x - rect.width/2 && point.x <= rect.x + rect.width/2 &&
                point.y >= rect.y - rect.height/2 && point.y <= rect.y + rect.height/2) {
                ret = true
            }
            return ret;
        }

        var contains2 = function (rect,point) {
            var ret = false;
            //var point = curPlant.convertToNodeSpace(fdj.getPosition())
            if (point.x >= rect.x - rect.width/2 && point.x <= rect.x + rect.width/2 &&
                point.y >= rect.y - rect.height/2 && point.y <= rect.y + rect.height/2) {
                ret = true
            }
            return ret;
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do_tip1",img:res.do_tools5,sound:res.do_sound1},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
    },
})