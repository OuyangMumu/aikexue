var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() {
        var self = this
        this._super();
        this.expCtor({
                vis: false,
                settingData: {
                    pos: cc.p(1080, 580),
                    biaogeFun: function() {
                        if (!self.biaoge) {
                            cc.log("22222222222")
                            var bg = createBiaoge({
                                json: res.lzdmm_tableNode_json,
                                inputNum: 14,
                                inputLineChange:[0,0,0,0,0,0,1,0,0,0,0,0,0,1],
                                rootData:[2,"",4,"",6,"","",3,"",6,"",9,"",""],
                                resultFun: function() {
                                    var bg = self.biaoge
                                    var index = bg._newIndex
                                    bg[sprintf("img_result%d", index)].setVisible(true)
                                }
                            })
                            var list = [
                                "img_result1",
                                "img_result2",
                                "img_bg1",
                                "img_bg2",
                                "btn_b1",
                                "btn_b2",
                            ]
                            loadList(bg, list)
                            bg.img_result2.setVisible(false)
                            bg.img_result1.setVisible(false)
                            bg.btn_b1.setVisible(false)
                            bg.btn_b2.setVisible(false)
                            var btn_b1 = new ccui.Button(res.btn_b1_select,res.btn_b1_normal)
                            btn_b1.setPosition(bg.btn_b1.getPosition())
                            bg.addChild(btn_b1)
                            var btn_b2 = new ccui.Button(res.btn_b2_normal,res.btn_b2_select)
                            btn_b2.setPosition(bg.btn_b2.getPosition())
                            bg.addChild(btn_b2)
                            bg._newShowBg = function(index) {
                                var bg = this
                                bg.img_bg1.setVisible(index == 1)
                                bg.img_bg2.setVisible(index == 2)
                                if (index == 1) {
                                    bg.img_result2.setVisible(false)
                                }
                                if (index == 2) {
                                    bg.img_result1.setVisible(false)
                                }
                                bg._newIndex = index
                            }
                            bg._newShowBg(1)
                            // bg.btn_b1.showImg = "#bg_new_02.png"
                            // bg.btn_b2.showImg = "#bg_new_06.png"

                            var showNew = function(judge) {
                                var btn = this
                                judge = judge || false
                                if (!btn.newImg) {
                                    var img = new cc.Sprite(btn.showImg)
                                    safeAdd(btn, img)
                                    var size = btn.getContentSize()
                                    img.setPosition(size.width / 2, size.height / 2)
                                    btn.newImg = img
                                }
                                var img = btn.newImg
                                img.setVisible(judge)
                            }
                            btn_b1.showNew = showNew
                            btn_b2.showNew = showNew

                            btn_b1.addClickEventListener(function() {
                                btn_b1.loadTextures(res.btn_b1_select,res.btn_b1_normal)
                                btn_b2.loadTextures(res.btn_b2_normal,res.btn_b2_select)
                                bg._newShowBg(1)
                                btn_b1.showNew(true)
                                btn_b2.showNew(false)
                            })
                            btn_b2.addClickEventListener(function() {
                                btn_b2.loadTextures(res.btn_b2_select,res.btn_b2_normal)
                                btn_b1.loadTextures(res.btn_b1_normal,res.btn_b1_select)
                                bg._newShowBg(2)
                                btn_b1.showNew(false)
                                btn_b2.showNew(true)
                            })
                            bg.ClearFun = function() {
                                bg.img_result2.setVisible(false)
                                bg.img_result1.setVisible(false)
                            }
                            btn_b1.showNew(true)
                            self.biaoge = bg
                            safeAdd(self, bg)
                        }
                        self.biaoge.show()
                    },
                }
            })
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        loadPlist("hand_plist")
        var self = this
        var uiList = [
            "lun1","lun2","zhou","btn_hook","handd","handu","banjing1","banjing2",
            "tiejia","line_l","line_r","line_lg","line_rg","gou_r","gou_l","tip"
        ]
        var node = loadNode(res.lzdmm_doExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })
        var line_l = node.line_l
        var line_r = node.line_r
        line_l.gou = node.gou_l
        line_r.gou = node.gou_r
        line_l.line_l = true
        line_r.line_r = true
        node.gou_l.line_l = true
        node.gou_r.line_r = true
        line_r.list = []
        line_l.list = []
        var lineList = [line_r,line_l]
        var line_g_list = [node.line_rg,node.line_lg]
        
        var curIndex = 0
        var btn_1 = new ccui.Button(res.btn_1_select,res.btn_1_normal)
        btn_1.setPosition(100,450)
        self.addChild(btn_1)
        var btn_2 = new ccui.Button(res.btn_2_normal,res.btn_2_select)
        btn_2.setPosition(100,350)
        self.addChild(btn_2)

        var first = true
        btn_1.addClickEventListener(function(){
            btn_1.loadTextures(res.btn_1_select,res.btn_1_normal)
            btn_2.loadTextures(res.btn_2_normal,res.btn_2_select)
            curIndex = 0
            call(435)
        })
        btn_2.addClickEventListener(function(){
            btn_1.loadTextures(res.btn_1_normal,res.btn_1_select)
            btn_2.loadTextures(res.btn_2_select,res.btn_2_normal)
            curIndex = 1
            call(405)
            if(first){
                first = false
                self.nodebs.say({key:"do_tip2",force:true})
            }
        })

        var curLun = node.lun1
        var call = function(posX){
            node.lun1.setVisible(false)
            node.lun2.setVisible(false)
            node.handu.setVisible(true)
            node.handd.setVisible(true)
            node.handu.setPositionX(posX)
            node.handd.setPositionX(posX)
            node.tip.setVisible(true)
            call2()
            for(var i = line_r.list.length-1 ; i >= 0 ; i--){
                line_r.list[i].removeFromParent(true)
                line_r.list.splice(i,1)
            }
            for(var i = line_l.list.length-1 ; i >= 0 ; i--){
                line_l.list[i].removeFromParent(true)
                line_l.list.splice(i,1)
            }
            if(curIndex == 0){
                node.banjing1.setVisible(true)
                node.banjing2.setVisible(false)
                node.lun1.setVisible(true)
                node.line_l.setPositionX(507)
                node.gou_l.setPositionX(507)
                curLun = node.lun1
            }else{
                node.banjing1.setVisible(false)
                node.banjing2.setVisible(true)
                node.lun2.setVisible(true)
                node.line_l.setPositionX(473)
                node.gou_l.setPositionX(473)
                curLun = node.lun2
            }
        }

        var createHook = function(pos){
            var hook = new cc.Sprite(res.hook)
            hook.setPosition(pos)
            node.addChild(hook)
            hook.setAnchorPoint(0.5,0.8)
            hook.setScale(0.6)
            return hook
        }

        var judgeVisible = function(){
            if(node.banjing1.isVisible() || node.banjing2.isVisible()){
                node.banjing1.setVisible(false)
                node.banjing2.setVisible(false)
            }
        }

        

        var ani = function(frame) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: 1,
                end: 5,
                time:0.12,
            }))
        }
        var judgeState = false
        var call2 = function(){
            node.handd.setSpriteFrame("handd01.png")
            node.handu.setSpriteFrame("handu01.png")
            judgeState = false
            line_l.setScaleY(2.5)
            line_r.setScaleY(2.5)
            line_r.gou.setPositionY(400)
            line_l.gou.setPositionY(400)
            line_l.stopAllActions()
            line_r.stopAllActions()
            line_l.gou.stopAllActions()
            line_r.gou.stopAllActions()
            curLun.stopAllActions()
            node.zhou.stopAllActions()
        }
        var over = true
        createTouchEvent({
            item:node.handd,
            begin:function(data){
                var item = data.item
                if(!over)  return false
                over = false
                if(!judgeState){
                    node.tip.setVisible(false)
                    node.handd.runAction(cc.sequence(
                        ani("handd%02d.png"),
                        cc.delayTime(0.1),
                        cc.callFunc(function(){
                            over = true
                        })
                    ))
                    node.handu.runAction(ani("handu%02d.png"))
                    judgeState = true
                }else{
                    call2()
                    over = true
                }
                return true
            },
            end:function(){
                if(line_r.list.length == line_l.list.length * (2+curIndex))
                    return false
                if(line_r.list.length > line_l.list.length * (2+curIndex)){
                    judgeMove(line_r)
                }else{
                    judgeMove(line_l)
                }
            }
        })

        var curHook = null
        createTouchEvent({
            item:node.btn_hook,
            begin:function(data){
                var pos = data.pos
                curHook = createHook(pos)
                addTouch(curHook)
                return true
            },
            move:function(data){
                var delta = data.delta
                curHook.x += delta.x
                curHook.y += delta.y
            },
            end:function(data){
                judgeDis(curHook)
            }
        })

        var judgeDis = function(curHook){
            var curDis = null
            var line = null
            var judge = false
            for(var i = 0 ; i < 2 ; i++){
                line = lineList[i]
                curDis = line_g_list[i].convertToWorldSpace(self)
                curDis.y = curDis.y - 17
                if(line.list.length){
                    curDis.y = curDis.y - line.list.length * 57
                }
                if(checkdistans(curHook,curDis)){//l 为 600,r为400
                    judgeVisible()//判断是否已经显示
                    judge = true
                    break
                }
            }

            if(judge){
                if(curHook.list){
                    for(var i = 0 ; i < curHook.list.length ; i++){
                        var hook = curHook.list[i]
                        curHook.list[i].index = line.list.length
                        line.list.push(curHook.list[i])
                        hook.setPosition(curDis.x,curDis.y - i * 57)
                        changeFather({item:hook,father:line.gou})
                    }
                }else{
                    curHook.index = line.list.length
                    line.list.push(curHook)
                    curHook.setPosition(curDis)
                    changeFather({item:curHook,father:line.gou})
                }
                judgeMove(line)
            }else{
                if(curHook.list){
                    for(var i = 0 ; i < curHook.list.length ; i++){
                        curHook.list[i].removeFromParent(true)
                    }
                }else{
                    curHook.removeFromParent(true)
                    curHook = null
                }
            }
        }

        var countList = [-1,-1]
        var rminList = [4,3,309,370]
        var lminList = [6,7,187,128]
        var judgeMove = function(line){
            if(!judgeState)  return false
            if(line_r.list.length == 0 && line_l.list.length == 0)
                return false
            line.stopAllActions()
            node.line_l.stopAllActions()
            line.gou.stopAllActions()
            node.line_l.gou.stopAllActions()
            node.lun1.stopAllActions()
            node.lun2.stopAllActions()
            var time = curIndex + 1   
            //最低处有点不一样
            if(line.line_r && line_r.list.length > line_l.list.length * (2+curIndex)){
                if(line.gou.y > 310){//旋转
                    node.zhou.runAction(cc.rotateBy(time,360))
                    curLun.runAction(cc.rotateBy(time,360))
                    countList[0] = line_l.list.length
                }
                line.runAction(cc.scaleTo(time,1,rminList[curIndex]))
                node.line_l.runAction(cc.scaleTo(time,1,0.6))
                line.gou.runAction(cc.moveTo(time,line.gou.x,rminList[curIndex+2]))
                node.line_l.gou.runAction(cc.moveTo(time,node.line_l.x,516))
            }else if(line.line_l && line_r.list.length <= line_l.list.length * (2+curIndex)){
                if(line.gou.y > 190){
                    node.zhou.runAction(cc.rotateBy(time,-360))
                    curLun.runAction(cc.rotateBy(time,-360))
                    countList[1] = line_r.list.length
                }
                line.runAction(cc.scaleTo(time,1,lminList[curIndex]))
                node.line_r.runAction(cc.scaleTo(time,1,0.6))
                line.gou.runAction(cc.moveTo(time,line.gou.x,lminList[curIndex+2]))
                node.line_r.gou.runAction(cc.moveTo(time,node.line_r.x,516))
            }
            
        }

        var addTouch = function(hook){
            var hook = hook
            createTouchEvent({
                item:hook,
                begin:function(data){
                    var item = data.item
                    var pos = data.pos
                    var gou = item.getParent()
                    item.list = []

                    if(gou.line_r){
                        for(var i = item.index ; i < line_r.list.length ; i++){
                            var gou = line_r.list[i]
                            item.list.push(gou)
                            changeFather({item:gou,father:node})
                        }
                        cc.log("aaaa",item.index,line_r.list.length)
                        line_r.list.splice(item.index,line_r.list.length)
                        judgeMove(line_l)
                    }else{
                        for(var i = item.index ; i < line_l.list.length ; i++){
                            var gou = line_l.list[i]
                            item.list.push(line_l.list[i])
                            changeFather({item:gou,father:node})
                        }
                        cc.log("bbbb",item.index,line_l.list.length)
                        line_l.list.splice(item.index,line_l.list.length)
                        judgeMove(line_r)
                    }
                    return true
                },
                move:function(data){
                    var item = data.item 
                    var delta = data.delta
                    for(var i = 0 ; i < item.list.length ; i++){
                        item.list[i].x += delta.x 
                        item.list[i].y += delta.y
                    }
                },
                end:function(data){
                    var item = data.item
                    judgeDis(item)
                }
            })
        }

        var checkdistans = function(ra,rb){
            var dx = ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 30)
                return true
            else
                return false
        }
        if (!self.biaoge) {
                            var bg = createBiaoge({
                                json: res.lzdmm_tableNode_json,
                                inputNum: 14,
                                inputLineChange:[0,0,0,0,0,0,1,0,0,0,0,0,0,1],
                                rootData:[2,"",4,"",6,"","",3,"",6,"",9,"",""],
                                resultFun: function() {
                                    var bg = self.biaoge
                                    var index = bg._newIndex
                                    bg[sprintf("img_result%d", index)].setVisible(true)
                                }
                            })
                            var list = [
                                "img_result1",
                                "img_result2",
                                "img_bg1",
                                "img_bg2",
                                "btn_b1",
                                "btn_b2",
                            ]
                            loadList(bg, list)
                            bg.img_result2.setVisible(false)
                            bg.img_result1.setVisible(false)
                            bg.btn_b1.setVisible(false)
                            bg.btn_b2.setVisible(false)
                            var btn_b1 = new ccui.Button(res.btn_b1_select,res.btn_b1_normal)
                            btn_b1.setPosition(bg.btn_b1.getPosition())
                            bg.addChild(btn_b1)
                            var btn_b2 = new ccui.Button(res.btn_b2_normal,res.btn_b2_select)
                            btn_b2.setPosition(bg.btn_b2.getPosition())
                            bg.addChild(btn_b2)
                            bg._newShowBg = function(index) {
                                var bg = this
                                bg.img_bg1.setVisible(index == 1)
                                bg.img_bg2.setVisible(index == 2)
                                if (index == 1) {
                                    bg.img_result2.setVisible(false)
                                }
                                if (index == 2) {
                                    bg.img_result1.setVisible(false)
                                }
                                bg._newIndex = index
                            }
                            bg._newShowBg(1)
                            // bg.btn_b1.showImg = "#bg_new_02.png"
                            // bg.btn_b2.showImg = "#bg_new_06.png"

                            var showNew = function(judge) {
                                var btn = this
                                judge = judge || false
                                if (!btn.newImg) {
                                    var img = new cc.Sprite(btn.showImg)
                                    safeAdd(btn, img)
                                    var size = btn.getContentSize()
                                    img.setPosition(size.width / 2, size.height / 2)
                                    btn.newImg = img
                                }
                                var img = btn.newImg
                                img.setVisible(judge)
                            }
                            btn_b1.showNew = showNew
                            btn_b2.showNew = showNew

                            btn_b1.addClickEventListener(function() {
                                btn_b1.loadTextures(res.btn_b1_select,res.btn_b1_normal)
                                btn_b2.loadTextures(res.btn_b2_normal,res.btn_b2_select)
                                bg._newShowBg(1)
                                btn_b1.showNew(true)
                                btn_b2.showNew(false)
                            })
                            btn_b2.addClickEventListener(function() {
                                btn_b2.loadTextures(res.btn_b2_select,res.btn_b2_normal)
                                btn_b1.loadTextures(res.btn_b1_normal,res.btn_b1_select)
                                bg._newShowBg(2)
                                btn_b1.showNew(false)
                                btn_b2.showNew(true)
                            })
                            bg.ClearFun = function() {
                                bg.img_result2.setVisible(false)
                                bg.img_result1.setVisible(false)
                            }
                            btn_b1.showNew(true)
                            self.biaoge = bg
                            safeAdd(self, bg)
                            bg.setPositionY(-1000)
                        }  
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do_tip1",img:res.do_tip1,sound:res.do_sound1},
            {key:"do_tip2",img:res.do_tip2,sound:res.do_sound2},
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