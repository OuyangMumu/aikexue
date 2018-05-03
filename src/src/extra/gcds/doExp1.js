var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super()
        var self = this
        this.expCtor({
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    self.table()
                    var bg = self.bgg
                    bg.show()
                }
            }
        })
        //this.initPeople()
        this.initUI()
        return true
    },

    table:function(){
        var self = this
        if(!self.bgg) {
            loadPlist("tableDraw_plist")
            var bg = createBiaoge({
                json: res.gcds_tableNode_json,
                scale: 0.9,
                inputNum:3,
                inputKeys:[81,47,26],
            })
            self.addChild(bg)
            self.bgg = bg
            bg.setPositionY(-1000)

            bg.drawNode = bg.getChildByName("panel").getChildByName("drawNode")
            bg.arrow1 = bg.getChildByName("jiantou1")
            bg.arrow2 = bg.getChildByName("jiantou2")

            var createSp = function(img,pos,father){
                var sp = new cc.Sprite(img)
                sp.setPosition(pos)
                father.addChild(sp)
                return sp
            }

            //表格中的几个框
            var downList = []
            for(var i = 0 ; i < 11 ; i ++){
                var down = bg.getChildByName(sprintf("down%d",i+1))
                down.index = i
                downList.push(down)
                if(i >= 8)
                    down.list = []
            }

    
            var imgList = []
            var list = []
            for(var i = 0 ; i < 18 ; i++){
                var draw = createSp(sprintf("#drawImg_%02d.png",i),cc.p(93 * i + 50,50),bg.drawNode)
                draw.index = i
                draw.over = false
                list.push(draw)
                createTouchEvent({
                    item:draw,
                    begin:function(data){
                        var item = data.item
                        var pos = data.pos
                        if(item.over)   return false
                        pos = bg.convertToNodeSpace(pos)
                        item.beginPos = item.getPosition()
                        changeFather({item:item,father:bg})
                        safeAdd(bg, item)
                        item.setPosition(pos)
                        return true
                    },
                    move:function(data){
                        var item = data.item 
                        var delta = data.delta 
                        item.x += delta.x 
                        item.y += delta.y 
                    },
                    end:function(data){
                        var item = data.item
                        var pos = data.pos 
                        pos = bg.convertToNodeSpace(pos)
                        //判断与框接触
                        for(var j = 0 ; j < 11 ; j ++){
                            var down = downList[j]
                            if(rectContainsPoint(down,pos) && !item.over){
                                if(item.index < 8){
                                    if(down.index == item.index){
                                        item.setPosition(down.getPosition())
                                        item.over = true
                                        break
                                    }
                                }else{
                                    if(j == 8 && item.index > 7 && item.index < 14){
                                        item.over = true
                                    }else if(j == 9 && item.index > 13 && item.index < 16){
                                        item.over = true
                                    }else if(j == 10 && item.index > 15){
                                        item.over = true
                                    }
                                    if(item.over){
                                        item.setPosition(down.getPosition())
                                        down.list.push(item)
                                        var inf = [
                                            {
                                                num: 1,
                                                dis: 70
                                            },{
                                                num: 2,
                                                dis: 60,
                                            },{
                                                num: 3,
                                                dis: 50,
                                            },{
                                                num: 4,
                                                dis: 40,
                                            },{
                                                num: 5,
                                                dis: 30,
                                            },{
                                                num: 6,
                                                dis: 25,
                                            }
                                            
                                        ]
                                        for(var a = 0 ; a < inf.length ; a++){
                                            if(down.list.length == inf[a].num)
                                                down.dis = inf[a].dis
                                        }
                                        for(var k = 0 ; k < down.list.length ; k++){
                                            down.list[k].setPosition(down.x - down.width/2+40 + down.dis * k,down.y)
                                        }
                                        break
                                    }
                                }
                                
                            }
                        }
                        
                        if(!item.over){
                            changeFather({item:item,father:bg.drawNode})
                            item.setPosition(item.beginPos)
                        }
                    }
                })
            }
            //将位置打乱
            var rand = getRand(18)
            for (var i = 0; i < 18; i++) {
                list[rand[i]].setPosition(93 * i + 50,50)
                imgList.push(list[rand[i]])

                imgList[i].base = createSp(sprintf("#drawImg_%02d.png",imgList[i].index),cc.p(93 * i + 50,50),bg.drawNode)
                safeAdd(bg.drawNode,imgList[i])
                imgList[i].base.setOpacity(100)
            }

            bg.ClearFun = function(){
                for(var i = 0 ; i < 18 ; i++){
                    var item = imgList[i]
                    var sp = item
                    if(item.over){
                        changeFather({father:bg.drawNode,item:sp})
                        item.setPosition(item.base.getPosition())
                        item.over = false
                        downList[8].list = []
                        downList[9].list = []
                        downList[10].list = []
                    }
                }
            }

            bg.drawNode.pos = [-1120,-560,0]
            bg.drawNode.count = 2
            //箭头功能
            var arrowList = [bg.arrow1,bg.arrow2]
            for(var i = 0 ; i < 2 ; i++){
                var arrow = arrowList[i]
                if(i == 0)
                    arrow.runAction(cc.repeatForever(cc.sequence(
                        cc.moveTo(0.4,arrow.x-10,arrow.y),
                        cc.delayTime(0.1),
                        cc.moveTo(0.4,arrow.x,arrow.y),
                        cc.delayTime(0.1)
                    )))
                else
                    arrow.runAction(cc.repeatForever(cc.sequence(
                        cc.moveTo(0.4,arrow.x+10,arrow.y),
                        cc.delayTime(0.1),
                        cc.moveTo(0.4,arrow.x,arrow.y),
                        cc.delayTime(0.1)
                    )))
                arrowList[i].index = i 
                createTouchEvent({
                    item:arrow,
                    begin:function(data){
                        var item = data.item
                        var index = item.index
                        if(bg.arrowJudge)      return false
                        if(index == 0){
                            if(bg.drawNode.count > 0){
                                bg.arrowJudge = true
                                bg.drawNode.count--
                                if(bg.drawNode.count == 0){
                                    bg.arrow1.setVisible(false)
                                }
                                bg.arrow2.setVisible(true)
                                bg.openListen(bg.drawNode.count)
                                bg.drawNode.runAction(cc.sequence(
                                    cc.moveTo(0.4,bg.drawNode.pos[bg.drawNode.count],bg.drawNode.y),
                                    cc.callFunc(function(){
                                        bg.arrowJudge = false
                                    })
                                ))
                            }
                        }else{
                            if(bg.drawNode.count < 2){
                                bg.arrowJudge = true
                                bg.drawNode.count++
                                if(bg.drawNode.count == 2){
                                    bg.arrow2.setVisible(false)
                                }
                                bg.arrow1.setVisible(true)
                                bg.openListen(bg.drawNode.count)
                                bg.drawNode.runAction(cc.sequence(
                                    cc.moveTo(0.4,bg.drawNode.pos[bg.drawNode.count],bg.drawNode.y),
                                    cc.callFunc(function(){
                                        bg.arrowJudge = false
                                    })
                                ))
                            }
                        }
                        return true
                    }
                })
            }

            bg.arrow2.setVisible(false)

            //将其余的移除监听
            bg.openListen = function(posx){
                if(posx == 0){
                    for(var i = 0 ; i < 18 ; i++){
                        if(i >= 12)
                            imgList[i].disListen(false)
                        else
                            imgList[i].disListen(true)
                    }
                }else if(posx == 1){
                    for(var i = 0 ; i < 18 ; i++){
                        if(i < 12 && i > 5)
                            imgList[i].disListen(false)
                        else
                            imgList[i].disListen(true)
                    }
                }else{
                    for(var i = 0 ; i < 18 ; i++){
                        if(i < 6)
                            imgList[i].disListen(false)
                        else
                            imgList[i].disListen(true)
                    }
                }
            }
            bg.openListen(2)

            var rectContainsPoint = function (rect, point) {
                return (point.x >= rect.x - rect.width/2 && 
                        point.x <= rect.x + rect.width/2 &&
                        point.y >= rect.y - rect.height/2 && 
                        point.y <= rect.y + rect.height/2)
            }
        }     
    },

    initUI:function(){
        var self = this
        loadPlist("do_plist")
        loadPlist("doRuler_plist")
        loadPlist("doDraw_plist")
        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var uiList = [
            "fa_liu","song_liu","liu_song","fa_song","liu_fa","song_fa",
            //6
            "liu_gan","liu_ye1","liu_ye2","liu_cao","liu_cao2","liu_he",
            //12
            "song_cao1","song_cao2","song_shu",
            //15
            "fa_niao","fa_tree","fa_chong","fa_dong","fa_ye","fa_cao",
            "fa_hua1","fa_hua2","fa_hua3","fa_hua4","fa_hua5","fa_hua6",

            "judge_bg","judge_1","judge_2","judge_3","judge_4","judge_jiantou",
            "tree_liu","liu_gan","liu_he","liu_ye1","liu_ye2","liu_cao","liu_cao2",

            "tree_song","tree_fa","tree_liu",

            "dir_liu1","dir_song1","dir_fa1","dir_liu2","dir_song2","dir_fa2",         
        ]
        var node = loadNode(res.gcds_doExp1_json,uiList)
        self.inside_node.addChild(node)

        var fdj = createSp("#tool_1.png",cc.p(200,-200),node)
        var paper = createSp("#paper.png",cc.p(200,-200),node)
        var pen = createSp("#tool_2.png",cc.p(200,-200),node)
        var ruler = createSp("#tool_4.png",cc.p(200,-200),node)
        fdj.setAnchorPoint(0.6,0.65)
        pen.setLocalZOrder(30)


        //点击工具箱中，各个部件功能
        var toolList = [node.judge_1,node.judge_2,node.judge_3,node.judge_4]
        var toolsList = [fdj,pen,paper,ruler]

        //创建大的放大镜显示
        var fdj_node = new cc.Node()
        fdj_node.setPosition(750,-400)
        self.addChild(fdj_node)
        var fdj_sp = new cc.Sprite("#bigFdj.png")
        var bigfdj = new cc.ClippingNode(fdj_sp)
        bigfdj.setAlphaThreshold(0)
        fdj_node.addChild(bigfdj)

        var fdj_item = new cc.Sprite("#liu_ye.png")
        bigfdj.addChild(fdj_item)
        fdj_item.setScale(1.1)

        var fdjjm = new cc.Sprite("#bigFdj.png")
        fdjjm.setScale(1.02)
        fdj_node.addChild(fdjjm)

        //创建一片叶子，用于点击树叶显示,共用一片叶子，换图显示
        var leaf = createSp("#leaf_liu.png",cc.p(100,-400),node)

        for(var i = 0 ; i < 4 ; i++){
            var judge = toolList[i]
            judge.index = i
            createTouchEvent({
                item:judge,
                begin:function(data){
                    var index = data.item.index
                    var pos = data.pos
                    
                    //将四个物体的位置复原到最初
                    if(index == 0 || index == 3){
                        fun_toBegin()
                    }else{
                        fdj.setPositionY(-400)
                        fdj_node.setPositionY(-400)
                        ruler.setPositionY(-400)
                        leaf.setPositionY(-400)
                        if(index == 2)
                            designFdj_node.setPositionY(-400)
                    }


                    switch(index){
                        case 1:
                            if(pen.over)    return false
                        break
                        case 2:
                            toolsList[index].setSpriteFrame("paper.png")
                            paper.setScale(1)
                            leaf.over = false
                            pen.over = false
                            paper.noMove = false
                            paper.removeAllChildren()
                        break
                        case 3:
                            toolsList[index].noMove = false 
                            toolsList[index].setSpriteFrame("tool_4.png")
                            fdj_node.setVisible(false)
                        break
                    }
                    toolsList[index].setPosition(pos)
                    return true
                },
                move:function(data){
                    var index = data.item.index
                    var delta = data.delta
                    judgeMove(toolsList[index],delta)
                },
                end:function(data){
                    var index = data.item.index
                    if(index == 2)
                        paper.setSpriteFrame("tool_3.png")
                }
            })

            var tool = toolsList[i]
            tool.index = i 
            createTouchEvent({
                item:tool,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    if(index == 2){
                        if(item.noMove)     return false
                        item.setSpriteFrame("paper.png")
                    }
                    return true
                },
                move:function(data){
                    var item = data.item 
                    var index = item.index
                    var delta = data.delta
                    judgeMove(item,delta)
                },
                end:function(data){
                    var item = data.item
                    judgeEnd(item)
                }
            })
        }

        var judgeEnd = function(item){
            switch(item.index){
                case 0://放大镜
                    fun_fdj(item)
                break
                case 1:
                break
                case 2:
                    if(!paper.noMove)
                        paper.setSpriteFrame("tool_3.png")
                break
                case 3://卷尺
                    //fun_ruler(item)
                break
            }   
        }

        var fun_ruler = function(item){
            if(!item.noMove && rectContainsPoint(item,inf[curScene].ruler[3])){
                item.noMove = true
                item.setPosition(inf[curScene].ruler[2])
                item.runAction(cc.sequence(
                    ani(inf[curScene].ruler[0],8),
                    cc.callFunc(function(){
                        fdj_node.setVisible(true)
                        fdj_node.setPosition(700,300)
                        fdj_item.setSpriteFrame(inf[curScene].ruler[1])
                    })
                ))
            }
        }

        //放大镜方法及其功能
        var fun_fdj = function(item){
            var pos = cc.p(item.x,item.y)
            var vis = false
            switch(curScene){
                case 0://柳树
                    for(var i = 0 ; i < 6 ; i++){
                        var judge = node[uiList[6+i]]
                        pos = node.tree_liu.convertToNodeSpace(pos)
                        if(rectContainsPoint(judge,pos)){
                            fdj_item.setSpriteFrame(inf[curScene].frame[i])
                            vis = true
                            break
                        }
                    }
                break
                case 1://松树
                    for(var i = 0 ; i < 3 ; i++){
                        var judge = node[uiList[12+i]]
                        pos = node.tree_song.convertToNodeSpace(pos)
                        if(rectContainsPoint(judge,pos)){
                            if(i == 2){
                                pos = judge.convertToNodeSpace(pos)
                                var color = readPixelInRect({item:judge,pos:pos})
                                if(color.g > 0){
                                    if(color.g > 100){
                                        fdj_item.setSpriteFrame(inf[curScene].frame[4])
                                    }else if(color.g > 50 && color.g < 100){
                                        fdj_item.setSpriteFrame(inf[curScene].frame[3])
                                    }else{
                                        fdj_item.setSpriteFrame(inf[curScene].frame[2])
                                    }
                                    vis = true
                                }
                            }else{
                                fdj_item.setSpriteFrame(inf[curScene].frame[i])
                                vis = true
                            }
                            break
                        }
                    }
                break
                case 2://法桐树
                    for(var i = 0 ; i < 12 ; i++){
                        var judge = node[uiList[15+i]]
                        pos = cc.p(item.x + 40,item.y + 10)
                        if(rectContainsPoint(judge,pos)){
                            if(i > 5){
                                fdj_item.setSpriteFrame(inf[curScene].frame[6])
                            }else{
                                fdj_item.setSpriteFrame(inf[curScene].frame[i])
                            }
                            vis = true
                            break
                        }
                    }
                break
            }

            fdj_node.setVisible(vis)
            if(vis){
                if(item.x < 568){
                    if(item.y <= 320)
                        fdj_node.setPosition(item.x+100,item.y+150)
                    else
                        fdj_node.setPosition(item.x+120,item.y-120)
                }else{
                    if(item.y <= 320)
                        fdj_node.setPosition(item.x-150,item.y+150)
                    else
                        fdj_node.setPosition(item.x-150,item.y-100)
                }
            }
        }

        var inf = [
            {
                frame:["liu_gan.png","liu_ye.png","liu_ye.png",
                "liu_cao.png","liu_cao.png","liu_he.png"],
                ruler:["ruler_liu%02d.png","big_liu.png",cc.p(440,210),cc.p(440,200)],
                leaf:["#bigLeaf_liu.png",cc.p(122,186),"#draw_liu01.png","draw_liu%02d.png",14],
                design:["design_liu.png"],
            },{
                frame:["song_cao.png","song_hua.png","song_gan.png",
                "song_guo.png","song_ye.png"],
                ruler:["ruler_song%02d.png","big_song.png",cc.p(570,68),cc.p(560,130)],
                leaf:["#bigLeaf_song.png",cc.p(123,177),"#draw_song01.png","draw_song%02d.png",18],
                design:["design_song.png"],
            },{
                frame:["fa_niao.png","fa_tree.png","fa_chong.png",
                "fa_dong.png","fa_ye.png","fa_cao.png","fa_hua.png"],
                ruler:["ruler_fa%02d.png","big_fa.png",cc.p(430,100),cc.p(430,150)],
                leaf:["#bigLeaf_fa.png",cc.p(122,193),"#draw_fa01.png","draw_fa%02d.png",18],
                design:["design_fa.png"],
            }
        ]

        var rectContainsPoint = function (rect, point) {
            return (point.x >= rect.x - rect.width/2 && 
                    point.x <= rect.x + rect.width/2 &&
                    point.y  >= rect.y - rect.height/2 && 
                    point.y <= rect.y + rect.height/2)
        }

        var judgeMove = function(item,delta){
            if(!item.noMove){
                item.x += delta.x 
                item.y += delta.y
            }

            switch(item.index){
                case 0:
                break
                case 1:
                    //笔移动判断功能
                    fun_pen()
                break
                case 2:
                    //纸移动功能
                    fun_paper()
                break
                case 3:
                    //移动卷尺功能
                    fun_ruler(item)
                break
            }
        }
        //纸移动到树底下时，显示用于刮显图案
        var fun_paper = function(){
            if(!paper.noMove && checkdistans(paper,inf[curScene].ruler[3],100)){
                paper.noMove = true
                pen.judge = true
                paper.setPosition(inf[curScene].ruler[3],100)
                designFdj_node.setPosition(600,250)
                designFdj_node.item.setSpriteFrame(inf[curScene].design[0])
                
                //重新将被刮的纸张替换
                //node.guaBg.removeFromParent(true)
                node.guaBg = null
                node.guaBg = new cc.Sprite("#designBg.png")
                node.guaBg.setPosition(294/2,349/2)
                pRTex.begin()
                node.guaBg.visit()
                pRTex.end()
            }
        }

        //点击树叶，显示叶子功能
        var leafList = [node.liu_ye1,node.song_shu,node.fa_tree]
        for(var i = 0 ; i < 3 ; i++){
            var judge = leafList[i]
            judge.index = i 
            createTouchEvent({
                item:judge,
                begin:function(data){
                    var index = data.item.index
                    var pos = data.pos
                    var item = data.item
                    if(leaf.over)
                        return false
                    item.judge = false
                    switch(curScene){
                        case 0:
                            if(judgeOpInPos({item:item,pos:pos})){
                                leaf.setSpriteFrame("leaf_liu.png")
                                leaf.setPosition(pos)
                                item.judge = true
                            }
                        break
                        case 1:
                            if(judgeOpInPos({item:item,pos:pos})){
                                leaf.setSpriteFrame("leaf_song.png")
                                leaf.setPosition(pos)
                                item.judge = true
                            }
                        break
                        case 2:
                            if(rectContainsPoint(item,pos)){
                                leaf.setSpriteFrame("leaf_fa.png")
                                leaf.setPosition(pos)
                                item.judge = true
                            }
                        break
                    }
                    return true
                },
                move:function(data){
                    var delta = data.delta
                    var item = data.item
                    if(item.judge){
                        leaf.x += delta.x 
                        leaf.y += delta.y 
                    }
                    //移动树叶的同时，判断是否与纸相接处
                    if(!leaf.over && rectContainsPoint(paper,leaf)){
                        leaf.over = true
                        pen.judge = false
                        leaf.setPositionY(-100)
                        paper.setScale(0.5)
                        paper.noMove = true
                        paper.setSpriteFrame("big_paper.png")
                        paper.leaf = createSp(inf[curScene].leaf[0],cc.p(125,170),paper)
                        paper.runAction(cc.scaleTo(0.2,1))
                    }
                }
            })
        }

        //将四个操作物复原，属性位置设置到最初
        var fun_toBegin = function(){
            //将一些物件放入到最低下去
            fdj.setPositionY(-400)
            fdj_node.setPositionY(-400)
            ruler.setPositionY(-400)
            leaf.setPositionY(-400)
            paper.setPositionY(-400)
            pen.setPositionY(-400)

            designFdj_node.setPositionY(-400)

            //将一些操作属性复原
            leaf.over = false
            pen.over = false
            paper.noMove = false
            pen.noMove = false
        }

        //三个场景切换功能
        var treeList = [node.tree_liu,node.tree_song,node.tree_fa]
        var treeListPos = [cc.p(568,320),cc.p(570,320),cc.p(550,320)]
        var curTree = node.tree_liu
        var curScene = 0
        var sceneList = [0,0,1,1,2,2]
        for(var i = 0 ; i < 6 ; i ++){
            var change = node[uiList[i]]
            change.index = i
            createTouchEvent({
                item:change,
                begin:function(data){
                    var index = data.item.index
                    curTree.setPositionY(-600)
                    curScene = sceneList[index]
                    treeList[curScene].setPosition(treeListPos[curScene])
                    curTree = treeList[curScene]

                    fun_toBegin()
                    return true
                }
            })
        }

        //工具箱三角形功能
        createTouchEvent({
            item:node.judge_jiantou,
            begin:function(data){
                var item = data.item
                var myScale = item.getScaleY()
                node.judge_bg.stopAllActions()
                if(myScale == -1){
                    item.setScaleY(1)
                    node.judge_bg.runAction(cc.moveTo(0.2,568,675))
                }else{
                    item.setScaleY(-1)
                    node.judge_bg.runAction(cc.moveTo(0.2,568,610))
                }
                return true
            }
        })

        //蜻蜓功能
        var qing = [cc.p(600,150),cc.p(1000,100),cc.p(100,50),-45,90,60,
        cc.p(500,200),cc.p(1040,300),cc.p(100,200)]
        var aniRepeat = function(frame,end){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:frame,
                end: end,
                time: 0.1
            })))
        }

        for(var i = 0 ; i < 3 ; i ++){
            var qingting = createSp("#qingting01.png",qing[i],node.tree_liu)
            qingting.runAction(aniRepeat("qingting%02d.png",4))
            qingting.setRotation(qing[i+3])
            qingting.runAction(cc.repeatForever(cc.sequence(
                cc.moveTo(2,qing[i+6]),
                cc.delayTime(3+i*0.5),
                cc.moveTo(2.5+i*0.5,qing[i].x-30,qing[i].y-30),
                cc.moveTo(0.5,qing[i]),
                cc.delayTime(1.5)
            )))
        }

        var ani = function(frame,end) {
            return cc.sequence(createAnimation({
                frame: frame,
                end: end,
                time:0.15,
            }))
        }

        var checkdistans = function(ra,rb,dis){
            var dx = ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis)
                return true
            else
                return false
        }

        var hongqi = createSp("#hongqi01.png",cc.p(1019,592),node.tree_fa)
        hongqi.runAction(aniRepeat("hongqi%02d.png",6))

        //用于刮出大树图案的放大镜
        var designFdj_node = null
        var call = function(){
            designFdj_node = new cc.Node()
            designFdj_node.setPosition(750,-500)
            node.addChild(designFdj_node)

            var fdj_sp = new cc.Sprite("#design_fdj.png")
            var bigfdj = new cc.ClippingNode(fdj_sp)
            bigfdj.setAlphaThreshold(0)
            designFdj_node.addChild(bigfdj)
            designFdj_node.bigfdj = bigfdj

            designFdj_node.fdjbg = new cc.Sprite("#design_fdjBg.png")
            bigfdj.addChild(designFdj_node.fdjbg)
            designFdj_node.fdjbg.setScale(1.1)

            designFdj_node.item = new cc.Sprite("#design_liu.png")
            bigfdj.addChild(designFdj_node.item)

            //designFdj_node.designBg = new cc.Sprite("#designBg.png")
            //bigfdj.addChild(designFdj_node.designBg)

            var fdjjm = new cc.Sprite("#design_fdj.png")
            fdjjm.setScale(1.02)
            designFdj_node.addChild(fdjjm)
        }
        call()

        //通过pRTex实现橡皮擦
        var pRTex = new cc.RenderTexture(294,349)
        //pRTex.setPosition(600,250)
        pRTex.setPosition(0,0)
        designFdj_node.bigfdj.addChild(pRTex)
        //橡皮擦
        var guaPen = new cc.DrawNode()
        guaPen.drawDot(cc.p(0, 0), 20, cc.color(255,0, 0))
        guaPen.retain()
        node.addChild(guaPen)
        guaPen.setLocalZOrder(-1)

        //等待被擦除的图片
        //将被擦除的图片和原本图案相结合
        node.guaBg = new cc.Sprite("#designBg.png")
        node.guaBg.setPosition(294/2,349/2)
        
        pRTex.begin()
        node.guaBg.visit()
        pRTex.end()

        node.guaBg2 = new cc.Sprite("#designBg.png")
        node.guaBg2.setPosition(600,250)
        node.addChild(node.guaBg2)
        node.guaBg2.setVisible(false)
        

        var rectIntersectsRect = function(ra,rb){
            var maxax = ra.x + ra.width/2,
                maxay = ra.y + ra.height/2,
                maxbx = rb.x + rb.width/2,
                maxby = rb.y + rb.height/2;
            return !(maxax < rb.x-rb.width/2 || maxbx < ra.x-ra.width/2 || maxay < rb.y-rb.height/2 || maxby < ra.y-ra.height/2);
        }  

        //笔移动判断
        var fun_pen = function(){
            //再放大镜上面刮显示图案
            if(pen.judge){
                if(rectIntersectsRect(pen,node.guaBg2)){
                    pen.pos = cc.p(pen.x-pen.width/2,pen.y-pen.height/2)
                    var pos = node.guaBg2.convertToNodeSpace(pen.pos)
                    guaPen.pos = node.convertToWorldSpace(pos)
                    //此处应做判断,在手机上面，和在网页上面，运行的效果不一样，更改坐标位置
                    if (cc.sys.isNative) {
                        guaPen.pos2 = guaPen.pos
                    }else{
                        guaPen.pos2 = cc.p(guaPen.pos.x * 1136/294,guaPen.pos.y * 640/349)
                    }
                    guaPen.setPosition(guaPen.pos2)
                    guaPen.setBlendFunc(cc.GL_ONE_MINUS_SRC_ALPHA, cc.ZERO)
                    pRTex.begin()
                    guaPen.visit()
                    pRTex.end()
                }
            //在纸上面画 
            }else if(paper.noMove && !pen.over && rectContainsPoint(paper,pen)){
                pen.over = true
                pen.setPositionY(-1000)
                paper.pen = createSp(inf[curScene].leaf[2],inf[curScene].leaf[1],paper)
                paper.pen.setScale(1.47)
                paper.pen.runAction(cc.sequence(
                    ani(inf[curScene].leaf[3],inf[curScene].leaf[4]),
                    cc.callFunc(function(){
                        //可以移动纸上面的叶子，然后移除掉
                        createTouchEvent({
                            item:paper.leaf,
                            begin:function(data){
                                safeAdd(paper, paper.leaf)
                                return true
                            },
                            move:function(data){
                                var item = data.item
                                var delta = data.delta
                                item.x += delta.x 
                                item.y += delta.y 
                            },
                            end:function(data){
                                var item = data.item
                                item.setPositionY(-400)
                            }
                        })
                    })
                ))
            }
        }

        //读取表格
        node.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(function(){
                self.table()
            }),
            cc.delayTime(0.2),
            cc.callFunc(function(){
                //箭头动
                var name = [node.dir_liu1,node.dir_song1,node.dir_fa1,node.dir_liu2,node.dir_song2,node.dir_fa2]
                for(var i = 0 ; i < 3 ; i++){
                    var dir1 = name[i]
                    dir1.runAction(cc.repeatForever(cc.sequence(
                        cc.moveTo(0.4,dir1.x-20,dir1.y),
                        cc.delayTime(0.1),
                        cc.moveTo(0.4,dir1.x,dir1.y),
                        cc.delayTime(0.1)
                    )))
                    var dir2 = name[i+3]
                    dir2.runAction(cc.repeatForever(cc.sequence(
                        cc.moveTo(0.4,dir2.x+20,dir2.y),
                        cc.delayTime(0.1),
                        cc.moveTo(0.4,dir2.x,dir2.y),
                        cc.delayTime(0.1)
                    )))
                }
            }),
            cc.delayTime(0.2),
            cc.callFunc(function(){
                var btn = new ccui.Button(res.btn_tips_normal,res.btn_tips_select)
                btn.setPosition(1040,450)
                node.addChild(btn)
                btn.addClickEventListener(function(){
                    if(!self.tip){
                        self.initPeople()
                        self.nodebs.show()
                        self.tip = true
                    }

                    self.nodebs.say({key:"result"})
                })
            })
        ))
    },

    initPeople : function(){
        var self = this
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        this.nodebs.setVisible(false)

        addContent({
            people: this.nodebs,
            key: "result",
            img: res.tip,
            id:"result"
        })
    }
})