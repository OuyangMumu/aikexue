var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super();
        var self = this
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("do_plist")

        var btn_again = new ccui.Button(res.btn_again_1,res.btn_again_2)
        btn_again.setPosition(150,250)
        self.addChild(btn_again)
        btn_again.setVisible(false)
        btn_again.addClickEventListener(function(){
            if(btn_again.isVisible())
                self.refreshCall()
        })

        self.nodebs.show()

        var btn_result = new ccui.Button(res.btn_exptip_normal,res.btn_exptip_select)
        btn_result.setPosition(100,420)
        self.addChild(btn_result)
        btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"result"})
        })

        var createSp = function(res,pos,father){
            var sp = new cc.Sprite(res)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        // var wz = createSp(res.do_tip4,cc.p(200,260),self)
        // wz.setScale(0.8)

        var cup1 = null 
        var cup2 = null 
        var lazhu1 = null 
        var lazhu2 = null
        var gai1 = null 
        var gai2 = null

        var toolbtn = createTool({
            pos: cc.p(210, 520),
            nums: 6,
            scale:0.7,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -15),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            //arrow:true,
            father: self,
            counts: [2, 2, 2, 2, 1, 1],
            swallow: [true, true, true, true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3, 
                    res.do_tools4, res.do_tools5, res.do_tools6],
            gets: ["#tools_1.png","#tools_2.png","#tools_3.png",
                    "#tools_4.png","#tools_5.png","#tools_6.png"],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                var counts = data.counts
                //self.toolbtn.inItem(1) 用于显示不可点击
                item.nopos = true
                item.noMove = true
                item.index = index

                switch(index){
                    case 0:
                        item.setPosition(700,220)
                        item.setAnchorPoint(0.5,0)
                        inItem([4,5])//点击短杯子后，盖子不可点击
                    break
                    case 1:
                        item.setPosition(700,220)
                        item.setAnchorPoint(0.5,0)
                    break
                    case 2:
                        fireFun(cc.p(19,45),item)
                        item.noEvent = true
                        item.setPosition(700, 50)
                        inItem([4,5])//点击短蜡烛后，盖子不可点击
                    break
                    case 3:
                        fireFun(cc.p(19,65),item)
                        item.noEvent = true
                        item.setPosition(700, 65)
                    break
                }
                judgeItem(index,item)
                return item
            },
            clickfun: function(data){
                var index = data.index
                var item = data.sp
                var pos = data.pos 

                if(index == 0 || index == 1){
                    if(judgeOver){    
                        if(curIndex == 5 && (!gai1 || !gai2)){
                            return false //判断有无盖子
                        }
                        //cc.log("Ok Ok Ok ")
                        return true
                    }else if(!item.noEvent){
                        createDialog()
                        return true
                    }
                }
                if(item.noMove)
                    return false
                return true
            },
            movefun: function(data){
                var index = data.index
                var item = data.sp
                var delta = data.delta
                if(judgeOver){
                    if(index == 0 || index == 1){
                        if(cup1.y + delta.y <= 260 && cup1.y + delta.y >= 15){
                            cup1.y += delta.y
                            cup2.y += delta.y
                            if(curIndex == 5 && cup1.y < 55){
                                judgeOver = false
                                stopFun(item)
                                if(gai1.index == 4)
                                    cup1.setPositionY(30)
                                else
                                    cup2.setPositionY(30)
                            }
                            if(cup1.y < 22){
                                cc.log("begintime")
                                judgeOver = false
                                //开始计算蜡烛的燃烧时间
                                stopFun(item)
                            }
                        }
                        
                    }
                }
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

        var createDialog = function(){
            AddDialog("Tips", {
                res: res.do_tip5,
                face: 2,
                confirmBtn:true,
            })
        }

        var stopFun = function(item){//蜡烛熄灭
            cup1.noEvent = true 
            cup2.noEvent = true
            item.runAction(cc.sequence(
                cc.delayTime(5),
                cc.callFunc(function(){
                    //cc.log("curIndex:",curIndex)
                    switch(curIndex){
                        case 1:
                            if(lazhu1.index == 2){//短蜡烛，后熄灭
                                lazhuFun(lazhu1,lazhu2,2,0.2)
                            }else{
                                lazhuFun(lazhu1,lazhu2,0.2,2)
                            }
                        break
                        case 2:
                            if(lazhu1.index == 2){
                                lazhuFun(lazhu1,lazhu2,4,2)
                            }else{
                                lazhuFun(lazhu1,lazhu2,2,4)
                            }
                        break
                        case 3:
                            if(cup1.index == 0){
                                lazhuFun(lazhu1,lazhu2,0.2,2)
                            }else{
                                lazhuFun(lazhu1,lazhu2,2,0.2)
                            }
                        break
                        case 4:
                            if(cup1.index == 0){
                                lazhuFun(lazhu1,lazhu2,2,4)
                            }else{
                                lazhuFun(lazhu1,lazhu2,4,2)
                            }
                        break
                        case 5:
                            if(gai1.index == 4){
                                lazhuFun(lazhu1,lazhu2,7,15)
                            }else{
                                lazhuFun(lazhu1,lazhu2,15,7)
                            }
                        break
                    }
                })
            ))
            
        }

        //tip1 大小不同玻璃杯 tip2 大小一样玻璃杯
        var tipList = [res.do_tip2,res.do_tip2,res.do_tip1,res.do_tip1,res.do_tip3]
        var keyList = ["do_tip2","do_tip2","do_tip1","do_tip1","do_tip3",]
        var lazhuFun = function(la1,la2,time1,time2){
            var call1 = null
            var call2 = null
            var call = function(){
                createSp(tipList[curIndex-1],cc.p(610,430),self)
                self.nodebs.say({
                    key:keyList[curIndex-1],
                    fun:function(){
                        btn_again.setVisible(true)
                    }
                })
            }
            if(time1 > time2)
                call1 = call
            else
                call2 = call
            la1.getChildren()[0].stopAllActions()
            la2.getChildren()[0].stopAllActions()
            la1.getChildren()[0].runAction(cc.sequence(
                cc.delayTime(time1),
                cc.scaleTo(0.5,0),
                cc.callFunc(function(){
                    if(call1)
                        call1()
                })
            ))
            la2.getChildren()[0].runAction(cc.sequence(
                cc.delayTime(time2),
                cc.scaleTo(0.5,0),
                cc.callFunc(function(){
                    if(call2)
                        call2()
                })
            ))
        }

        var judgeItem = function(index,item){
            switch(index){
                case 0:
                    item.setLocalZOrder(10)
                    if(!cup1){//控制好杯子1的拖动
                        cup1 = item
                        item.setPosition(400,220)
                        if(lazhu1 && lazhu2){
                            if(lazhu1.index == lazhu2.index){
                                inItem([0,1])
                            }else{
                                inItem([1,1])
                            }
                        }
                    }else{
                        if(cup1.index == 1){//判断第一个杯子是1
                            cup2 = item

                            if(lazhu1 && !lazhu2){//移除蜡烛
                                if(lazhu1.index == 2)
                                    inItem([3,3])
                                else
                                    inItem([2,2])
                            }

                            inItem([0,1])
                        }else{
                            cup2 = item
                            //inItem([2,3])
                            inItem([1,1])
                        }
                    }
                break
                case 1:
                    item.setLocalZOrder(10)
                    if(!cup1){//控制好杯子2的拖动
                        cup1 = item
                        item.setPosition(400,220)
                        if(lazhu1 && lazhu2){
                            if(lazhu1.index == lazhu2.index){
                                if(lazhu1.index == 3){
                                    inItem([0])
                                    return true
                                }
                                inItem([0,1])
                            }else{
                                inItem([0,0])
                            }
                        }
                    }else{
                        if(cup1.index == 0){//判断第一个杯子是0
                            cup2 = item
                            if(lazhu1 && !lazhu2){//移除蜡烛
                                if(lazhu1.index == 2)
                                    inItem([3,3])
                                else
                                    inItem([2,2])
                            }
                            inItem([0,1])
                        }else{//第一个杯子是自己
                            cup2 = item
                            //inItem([2,3])
                            inItem([0,0])
                        }
                    }
                break
                case 2:
                    item.setLocalZOrder(5)
                    if(!lazhu1){//控制好蜡烛1的拖动
                        lazhu1 = item
                        item.setPosition(400, 50)
                        if(cup1 && cup2){
                            if(cup1.index == cup2.index){
                                inItem([2,3])
                            }else{
                                inItem([3,3])
                            }
                        }
                    }else{
                        if(lazhu1.index == 3){//判断第一个蜡烛是3
                            if(cup1 && !cup2){//移除蜡烛
                                if(cup1.index == 0)
                                    inItem([1,1])
                                else
                                    inItem([0,0])
                            }
                            lazhu2 = item
                            inItem([2,3])
                        }else{
                            lazhu2 = item
                            inItem([3,3])
                        }
                    }
                break
                case 3:
                    item.setLocalZOrder(5)
                    if(!lazhu1){//控制好蜡烛2的拖动
                        lazhu1 = item
                        item.setPosition(400, 65)
                        if(cup1 && cup2){
                            if(cup1.index == cup2.index){
                                if(cup1.index == 1){
                                    inItem([2])
                                    return true 
                                }
                                inItem([2,3])
                            }else{
                                inItem([2,2])
                            }
                        }
                    }else{
                        if(lazhu1.index == 2){//判断第一个蜡烛是2
                            if(cup1 && !cup2){//移除蜡烛
                                if(cup1.index == 0)
                                    inItem([1,1])
                                else
                                    inItem([0,0])
                            }
                            lazhu2 = item
                            inItem([2,3])
                        }else{
                            lazhu2 = item
                            inItem([2,2])
                            //inItem([0,1])
                        }
                    }
                break
                case 4:
                    item.setPosition(700,50)
                    if(!gai1){
                        inItem([0,0,2,2])
                        gai1 = item
                        item.setPosition(400,50)
                        if(lazhu1)
                            lazhu1.setLocalZOrder(5)             
                    }else{
                        gai2 = item
                    }
                break
                case 5:
                    item.setPosition(700,60)
                    if(!gai1){
                        inItem([0,0,2,2])
                        gai1 = item
                        item.setPosition(400,60)
                        if(lazhu1)
                            lazhu1.setLocalZOrder(5)     
                    }else{
                        gai2 = item
                    }
                break
            }
            if(cup1 && cup2 && lazhu1 && lazhu2)
                judgeTime()
        }

        var judgeOver = false
        var curIndex = null

        var judgeTime = function(){
            //cc.log(cup1.index,cup2.index,lazhu1.index,lazhu2.index)
            for(var i = 0 ; i < info.length ; i++){
                if(((cup1.index == info[i].cup1 && cup2.index == info[i].cup2) || (cup1.index == info[i].cup2 && cup2.index == info[i].cup1)) && 
                    ((lazhu1.index == info[i].la1 && lazhu2.index == info[i].la2) || (lazhu2.index == info[i].la1 && lazhu1.index == info[i].la2))
                ){
                    //cc.log("=============================",i)
                    curIndex = i+1
                    judgeOver = true
                    cup1.noMove = false 
                    cup2.noMove = false
                    cc.log(curIndex)
                    break
                }
            }
        }
        
        var info = [//5种独立的情况
            {cup1:0,cup2:0,la1:2,la2:3},
            {cup1:1,cup2:1,la1:2,la2:3},
            {cup1:0,cup2:1,la1:2,la2:2},
            {cup1:0,cup2:1,la1:3,la2:3},
            {cup1:1,cup2:1,la1:3,la2:3},
        ]

        var inItem = function(index){
            for(var i = 0 ; i < index.length ; i++){
                self.toolbtn.inItem(index[i])
                if(self.toolbtn.counts[index[i]] < 0)
                    self.toolbtn.counts[index[i]] = 0
                //cc.log("--curIndex",index[i],"==curCount",self.toolbtn.counts[index[i]])
            }
        }

        var fireFun = function(pos,item){
            var fire = createSp("#fire.png",pos,item)
            fire.setAnchorPoint(0.5,0)
            fire.runAction(cc.repeatForever(cc.sequence(
                cc.scaleTo(0.2,1,1.05),
                cc.delayTime(0.5),
                cc.scaleTo(0.2,1,1),
                cc.delayTime(0.5)
            )))
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do_tip1",sound:res.do_sound1},
            {key:"do_tip2",sound:res.do_sound2},
            {key:"do_tip3",sound:res.do_sound3},
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                sound: addList[i].sound,
            })
        }

        addContent({
            people: this.nodebs,
            key: "result",
            img: res.do_tip4,
            id:"result"
        })
    },
})