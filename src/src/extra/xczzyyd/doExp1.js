var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super()
        var self = this
        this.expCtor({
            setZ:999,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    if(!self.bgg) {
                        var bg = createBiaoge({
                            json: res.xczzyyd_tableNode_json,
                            scale: 0.9,
                            inputNum:38,
                        })
                        self.addChild(bg)
                        self.bgg = bg
                    }
                    var bg = self.bgg
                    bg.show()
                }
            }
        })
        //this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("do_plist")
        var uiList = [
            "gouma1","gouma2","gouma3","handUp","handDown","line_fama","line_gouma",
            "box_fama","box_gouma","niezi","car","car2","gouzi","zhuozi_1","miaobiao",
            "btn_pause","btn_begin"
        ]
        var wenzi = new cc.LabelTTF("用镊子将砝码放在小车上面，\n拖动勾码到挂钩上，\n点击手使得小车运动，\n使用秒表计时，将数据填入表格。","",26)
        self.inside_node.addChild(wenzi)
        wenzi.setPosition(550,80)

        var node = loadNode(res.xczzyyd_doExp1_json,uiList)
        self.inside_node.addChild(node)

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var famaPos = [
            cc.p(210,330),cc.p(250,330),cc.p(288,330),
            cc.p(220,350),cc.p(260,350),cc.p(298,350)
        ]
        //砝码
        var famaList = []
        for(var i = 0 ; i < 6 ; i++){
            var sp = createSp("#boxFama.png",famaPos[i],node)
            famaList.push(sp)
        }

        node.car2.setLocalZOrder(10)
        node.car.famaList = [null,null,null,null,null,null]
        node.car.famaPos = [
            cc.p(40,25),cc.p(75,25),cc.p(110,25),
            cc.p(30,10),cc.p(65,10),cc.p(100,10)
        ]

        node.gouzi.count = 0
        node.gouzi.goumaList = [null,null,null]

        //点击取出秒表
        node.btn_miaobiao = createSp("#miao_open.png",cc.p(1030,300),node)
        node.btn_miaobiao.out = false
        createTouchEvent({
            item:node.btn_miaobiao,
            begin:function(data){
                var item = data.item
                if(!item.out){
                    item.setSpriteFrame("miao_close.png")
                    item.out = true
                    node.miaobiao.setPosition(650,200)
                }else{
                    item.setSpriteFrame("miao_open.png")
                    item.out = false
                    node.miaobiao.setPositionY(-600)
                }
                return true
            }
        })
        //秒表可以移动
        createTouchEvent({
            item:node.miaobiao,
            begin:function(data){
                var item = data.item
                var pos = data.pos
                if(judgeOpInPos({item:item,pos:pos}))
                    return true
                return false
            },
            autoMove:true,
        })
        node.btn_begin.setLocalZOrder(-1)
        node.btn_pause.setLocalZOrder(-1)
        node.miaobiao.judge = false
        node.miaobiao.label_miao = new cc.LabelTTF("00:00","",26)
        node.miaobiao.addChild(node.miaobiao.label_miao)
        node.miaobiao.label_miao.setPosition(82,105)
        node.miaobiao.label_miao.setColor(cc.color(0, 0, 0))
        node.miaobiao.time = 0
        //重置归零
        node.btn_begin.addClickEventListener(function(){
            node.miaobiao.judge = false
            node.miaobiao.stopAllActions()
            node.miaobiao.time = 0
            node.miaobiao.label_miao.setString(sprintf("00:%02d",node.miaobiao.time))
        })
        //暂停开始
        node.btn_pause.addClickEventListener(function(){
            if(!node.miaobiao.judge){//开启秒表
                node.miaobiao.call()
            }else{//暂停秒表
                node.miaobiao.judge = false
                node.miaobiao.stopAllActions()
            }
        })

        node.miaobiao.call = function(){
            node.miaobiao.judge = true
            node.miaobiao.runAction(cc.repeatForever(cc.sequence(
                cc.delayTime(0.7),
                cc.callFunc(function(){
                    node.miaobiao.time++
                    if(node.miaobiao.time >= 60){
                        node.miaobiao.time = 0
                        node.miaobiao.judge = false
                        node.miaobiao.stopAllActions()
                    }
                    node.miaobiao.label_miao.setString(sprintf("00:%02d",node.miaobiao.time))
                })
            )))
        }
        //手
        node.handUp.out = false
        node.car.judge = false //判断小车是否在运动
        node.car.in = true //判断小车是否已经回到最初位置
        node.car.setLocalZOrder(2)
        node.handDown.setLocalZOrder(4)
        node.handUp.setLocalZOrder(1)
        createTouchEvent({
            item:node.handUp,
            begin:function(data){
                var item = data.item
                if(!item.out){//点击拿开手，小车开始运动
                    //条件不满足，弹出提示框
                    if(!node.btn_miaobiao.out){
                       node.AddDialog(res.do_tip4)
                       return false
                    }else if(node.miaobiao.time != 0){
                        node.AddDialog(res.do_tip3)
                        return false
                    }

                    //如果车子在中间，则继续往后移动
                    if(item.x > 355)
                        return true

                    node.handUp.setSpriteFrame("handUp2.png")
                    node.handDown.setSpriteFrame("handDown2.png")
                    node.handUp.setLocalZOrder(3)
                    item.out = true

                    //判断小车运动的时间
                    if(node.gouzi.count == 0){//没有勾码的情况下，不运动
                        node.car.judge = true
                        return true
                    }//勾码坐标 945,295
                    //小车开始运动
                    node.time = 1
                    node.car.count = 0
                    for(var i = 0; i < 6 ; i ++){
                        if(node.car.famaList[i] != 0)
                            node.car.count++
                    }

                    //秒表开始计时
                    node.miaobiao.call()

                    if(node.car.count >= node.gouzi.count * 2)
                        node.time = 1.2
                    else if(node.car.count >= node.gouzi.count * 3)
                        node.time = 1.5
                    else if(node.car.count >= node.gouzi.count * 4)
                        node.time = 1.7
                    else if(node.car.count >= node.gouzi.count * 5)
                        node.time = 1.9
                    else if(node.car.count >= node.gouzi.count * 6)
                        node.time = 2

                    node.car.in = false
                    node.car.runAction(cc.sequence(
                        cc.moveTo(node.time,700,500),
                        cc.callFunc(function(){
                            node.car.judge = true
                        })
                    ))
                    node.line_fama.runAction(cc.scaleTo(node.time,0.35,1))
                    node.gouzi.runAction(cc.moveTo(node.time,945,160))
                    node.line_gouma.runAction(cc.scaleTo(node.time,0.8,1))
                }else{//将手，移动到车子边上，把车子拖走
                    if(node.car.judge && checkdistans(node.car,item,100)){
                        node.handUp.setPosition(node.car.x - 95,node.car.y - 20)
                        node.handDown.setPosition(node.car.x - 100,node.car.y - 45)
                        node.handUp.setSpriteFrame("handUp1.png")
                        node.handDown.setSpriteFrame("handDown1.png")
                        node.handUp.setLocalZOrder(1)
                        
                        item.out = false
                    }
                }
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(item.out){
                    item.x += delta.x 
                    item.y += delta.y
                    node.handDown.x += delta.x 
                    node.handDown.y += delta.y 
                }else{
                    if(item.x + delta.x > 350 && delta.x < 0){
                        item.x += delta.x 
                        node.handDown.x += delta.x 
                        node.car.x += delta.x
                        node.gouzi.y -= delta.x
                        //1 -0.35   0.8 - 0.1
                        //小车距离从440-700
                        node.line_fama.myScalex = 0.35 + (700 - node.car.x)/400
                        node.line_fama.setScaleX(node.line_fama.myScalex)

                        node.line_gouma.myScalex = 0.1 + (430 - node.gouzi.y)/385
                        node.line_gouma.setScaleX(node.line_gouma.myScalex)
                        if(node.line_fama.myScalex > 0.95){
                            node.car.in = true
                        }
                    }
                }
            }
        })

        //勾码
        for(var i = 0 ; i < 3 ; i++){
            var gouma = node[uiList[i]]
            gouma.index = i
            gouma.out = false
            gouma.pos = gouma.getPosition()
            createTouchEvent({
                item:gouma,
                begin:function(data){
                    var item = data.item
                    var pos = data.pos
                    //提示手应该拿着,提示车子应该移动到最初位置
                    if(!node.car.in){
                        node.AddDialog(res.do_tip1)
                        return false
                    }else if(node.handUp.out){
                        node.AddDialog(res.do_tip2)
                        return false
                    }
                    if(!item.out){//在盒子中
                        item.setPosition(pos)
                        item.setSpriteFrame("gouma.png")
                    }else{//在挂着中
                        if(node.gouzi.count >= item.num){
                            for(var i = item.num ; i < node.gouzi.count ; i++){
                                var gouma = node.gouzi.goumaList[i]
                                changeFather({father:node,item:gouma})
                            }
                        }
                    }
                    return true 
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta
                    if(item.out){
                        if(node.gouzi.count > item.num){
                            for(var i = item.num+1 ; i < node.gouzi.count ; i++){
                                node.gouzi.goumaList[i].x += delta.x
                                node.gouzi.goumaList[i].y += delta.y
                            }
                        }
                    }
                    
                    item.x += delta.x 
                    item.y += delta.y
                },
                end:function(data){
                    var item = data.item
                    //从勾码中拖出了多个，再将多个放回到挂钩处
                    if(item.out){
                        if(checkdistans(item,cc.p(node.gouzi.x,node.gouzi.y-13-item.num*45),50)){
                            if(node.gouzi.count >= item.num){
                                for(var i = item.num ; i < node.gouzi.count ; i++){
                                    var gouma = node.gouzi.goumaList[i]
                                    changeFather({item:gouma,father:node.gouzi})
                                    gouma.setPosition(-3,-20 - i*45)
                                }
                            }
                            return true
                        }
                    }    

                    //检测和和挂钩的距离，可以悬挂
                    if(!item.out){
                        if(checkdistans(item,cc.p(node.gouzi.x,node.gouzi.y-13-node.gouzi.count*45),50)){
                            changeFather({item:item,father:node.gouzi})
                            item.setPosition(-3,-20 - node.gouzi.count*45)
                            item.out = true
                            for(var i = 0 ; i < 3 ; i++){
                                if(node.gouzi.goumaList[i] == null){
                                    node.gouzi.goumaList[i] = item
                                    item.num = i
                                    node.gouzi.count++
                                    break
                                }
                            }
                        }else{
                            item.setPosition(item.pos)
                            item.setSpriteFrame("boxGouma.png")
                            item.out = false
                        }
                    }else{
                        //回到盒子中
                        //if(item.out){
                            //将其他勾码放回原处
                            if(node.gouzi.count >= item.num){//将其他几个也回到盒子中
                                for(var i = item.num ; i < node.gouzi.count ; i++){
                                    node.gouzi.goumaList[i].out = false
                                    node.gouzi.goumaList[i].setSpriteFrame("boxGouma.png")
                                    node.gouzi.goumaList[i].setPosition(node.gouzi.goumaList[i].pos)
                                    node.gouzi.goumaList[i] = null
                                }
                            }
                            node.gouzi.count = 0
                            for(var i = 0 ; i < 3 ; i++){
                                if(node.gouzi.goumaList[i] != null)
                                    node.gouzi.count++
                            }
                        //}
                    }
                }
            })
        }
        
        //镊子
        node.niezi.out = false
        node.niezi.pos = node.niezi.getPosition()
        node.niezi.haveFama = false
        node.niezi.setLocalZOrder(10)
        createTouchEvent({
            item:node.niezi,
            begin:function(data){
                var item = data.item
                var pos = data.pos
                if(!item.out){
                    item.setSpriteFrame("niezi2.png")
                    item.setPosition(pos)
                    item.out = true
                }else{//镊子在外面
                    if(!item.haveFama){
                        //镊子夹起砝码,从砝码盒子里面取出砝码
                        if(checkdistans(node.box_fama,cc.p(cc.p(item.x-53,item.y)),50)){
                            for(var i = 0 ; i < 6 ; i++){
                                if(famaList[i].isVisible() && checkdistans(famaList[i].getPosition(),cc.p(item.x-53,item.y),20)){
                                    famaList[i].setVisible(false)
                                    item.setSpriteFrame("niezi3.png")
                                    item.fama = createSp("#fama.png",cc.p(7,0),item)
                                    item.fama.index = i
                                    item.haveFama = true
                                    break
                                }
                            }
                        }else{
                            //从小车中，取出砝码
                            if(checkdistans(node.car,cc.p(item.x-53,item.y),50)){
                                for(var i = 0 ; i < node.car.famaList.length ; i++){
                                    if(node.car.famaList[i]){
                                        var pos = node.car.convertToNodeSpace(cc.p(item.x-53,item.y))
                                        var fama = node.car.famaList[i]
                                        if(checkdistans(cc.p(fama.x,fama.y+20),pos,20)){
                                            item.fama = node.car.famaList[i]
                                            changeFather({father:item,item:item.fama})
                                            item.fama.setPosition(7,0)
                                            item.setSpriteFrame("niezi3.png")
                                            node.car.famaList[i] = null
                                            item.haveFama = true
                                            break
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
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
                if(!item.haveFama){
                    if(checkdistans(cc.p(item.x,item.y+20),item.pos,40)){
                        //回到镊子最初位置
                        nieziTodo()
                    }
                }else{//有砝码
                    //将砝码放到小车上面
                    if(checkdistans(node.car,cc.p(item.x-53,item.y),50)){
                        changeFather({father:node.car,item:item.fama})
                        for(var i = 0 ; i < 6 ; i++){
                            if(node.car.famaList[i] == null){
                                node.car.famaList[i] = item.fama
                                item.fama.setPosition(node.car.famaPos[i])
                                item.fama.setLocalZOrder(i)
                                nieziTodo()
                                break
                            }
                        }
                    }else if(checkdistans(node.box_fama,cc.p(item.x-53,item.y),60)){
                    //将砝码放回到盒子中
                        for(var i = 0 ; i < 6 ; i++){
                            famaList[item.fama.index].setVisible(true)
                            item.removeAllChildren()
                            nieziTodo()
                            break
                        }
                    }
                }
            }
        })

        var nieziTodo = function(){
            node.niezi.setSpriteFrame("niezi1.png")
            node.niezi.setPosition(node.niezi.pos)
            node.niezi.out = false
            node.niezi.haveFama = false
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

        node.AddDialog = function(img){
            AddDialog("Tips", {
                res: img,
                face: 2,
                confirmBtn:true,
            })
        }

        node.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(function(){
                if(!self.bgg) {
                    var bg = createBiaoge({
                        json: res.xczzyyd_tableNode_json,
                        scale: 0.9,
                        inputNum:38,
                    })
                    self.addChild(bg)
                    bg.setPositionY(-1000)
                    self.bgg = bg
                }
            })
        ))
    }
})