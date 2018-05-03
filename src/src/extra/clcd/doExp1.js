//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
            loadPlist("ding")
        })
        this._super()
        var self = this
        this.expCtor({
          vis: false,
          setZ: 800,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
                self.bggg.show()
            },
          }
        })
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this
        self.dingCount = 0
        var doPlay = function(data){
            var item1 = data.item1
            var item2 = data.item2
            if(item1&&judgeItemCrash({
　　　　　　　　　　　　item1:item1.testSp,
                        item2:item2
            })){
                item2.stopAllActions()
                item1.IsMove = true
                item1.haveDing = true
                item2.IsMove = true
                safeAdd(item1,item2)
                item2.ding = item1
                item2.setPosition(item1.width/2,item1.height/2-3.5)
                self.dingCount++
                if(self.dingCount==2){
                   self.curKey = "wenzi3"
                }
                self.speakeBykey(self.curKey)
                var ac = createAnimation({
                  frame:"ding%d.png",
                  start:0,
                  end: 7,
                  time: 0.1,
                  fun:function(){
                    item2.removeListen()
                  }
                })
                item2.runAction(ac)
            }
        }
        var getMygel = function(node,pos){
            var nodepos = node.convertToNodeSpace(pos)
            var topos = cc.p(nodepos.x - node.width/2,nodepos.y - node.height/2)
            var tempAngel = Math.atan2(topos.y,topos.x) * 180/Math.PI - node.getRotationX()
            return tempAngel
        }

        var getMygel1 = function(node,pos){
            var nodepos = node.convertToNodeSpace(pos)
            var topos = cc.p(nodepos.x - node.width/2,nodepos.y - node.height/2)
            var tempAngel = 180*(1+Math.atan2(topos.x,topos.y)/Math.PI)
            return tempAngel
        }
        self.imgCount = 12 
        var allPlay = function(item,angel,ones){
            var ones = ones || null
            if(item && item.spList){
                for (var i = 0; i < item.spList.length; i++) {
                    var temp = item.spList[i]
                    if(temp != ones){
                        var speed = item.lunCount/temp.lunCount
                        var curangel = -angel*speed
                        temp.setRotation(temp.getRotationX()+curangel)
                        var direction = curangel>=0 ? 1:-1
                        temp.tipSp.direction = direction
                        if(temp.tipSp && !temp.tipSp.isVisible()){
                            temp.tipSp.setVisible(true)
                            temp.tipSp.setPosition(temp.x,temp.y + 1*temp.height/4)
                            temp.tipSp.imgNum = self.imgCount
                            temp.tipSp.setTexture(res[sprintf("item%d",self.imgCount++)]) 
                        }
                        allPlay(temp,curangel,item)
                    }
                }
            }  
        }
        var addItemTolist = function(desItem,srcItem){
            var result = true
            if(desItem.spList)
            {
                for (var i = 0; i < desItem.spList.length; i++) {
                    var cur = desItem.spList[i]
                    if(srcItem == cur){
                       result = false
                    }
                }

                if(result)
                {
                   desItem.spList.push(srcItem)
                }
            }
        }
        var deleteItem = function(item){
            if(item.spList)
            {
                for (var i = 0; i < item.spList.length; i++) {
                    var cur = item.spList[i]
                    for(var i = 0; i < cur.spList.length; i++){
                        var sp = cur.spList[i]
                        if(sp == item){
                            cur.spList.splice(i,1)
                        }
                    }
                }
                item.spList = []
            }
        }
        var checkCrash = function(data){
            var item = data.item
            var item1 = self.toolbtn.getindex(0)
            var item2 = self.toolbtn.getindex(1)
            var item3 = self.toolbtn.getindex(2)
            var list = [item1,item2,item3]
            deleteItem(item)
            var tempCount = 0
            var tempList = []
            for (var i = 0; i < list.length; i++)
            {   
                if(item && list[i])
                {
                   if(item != list[i])
                   {
                       if(judgeItemCrash({item1:item,item2:list[i]}))
                       {
                          tempList[tempCount] = list[i]
                          tempCount++
                       }
                   }
                }
            }
            if(tempCount==1){
                var curSP = tempList[0]
                var temp_angel = getMygel(curSP,getWorldPos(item))
                var allCount = item.lunCount + curSP.lunCount
                var allDis = allCount * 5.8
                if(allCount==48){
                   allDis = allCount * 5.1
                }
                if(allCount==40){
                   allDis = allCount * 5.3
                }
                
                item.setRotation(0)
                curSP.setRotation(0)
                item.setRotation(curSP.getRotationX())
                if(item.lunCount>curSP.lunCount){
                    var disAn = 360/curSP.lunCount/2
                    var n = Math.floor(temp_angel/disAn)
                    temp_angel = n*disAn
                    var rate = item.lunCount/curSP.lunCount
                    item.setRotation((Math.abs(n)%2+1)*(disAn)/rate)
                }else{
                    var disAn = 360/curSP.lunCount
                    var n = Math.floor(temp_angel/disAn)
                    temp_angel = n*disAn
                    item.setRotation((Math.abs(n)%2+1)*disAn) 
                }
                dx = allDis * Math.cos(temp_angel*Math.PI/180)
                dy = allDis * Math.sin(temp_angel*Math.PI/180)
                var pos = cc.p(curSP.x + dx,curSP.y + dy)
                item.setPosition(pos)
                self.curKey = "wenzi3"
                addItemTolist(item,curSP)
                addItemTolist(curSP,item)
            }else if(tempCount==2){
                var duanSp = tempList[0]
                var chanSp = tempList[1]
                if(getDis(item,tempList[0])<=getDis(item,tempList[1]))
                {
                    duanSp = tempList[0]
                    chanSp = tempList[1]
                }else{
                    duanSp = tempList[1]
                    chanSp = tempList[0]
                }
                
                var curSP = duanSp
                var nodepos = duanSp.convertToNodeSpace(getWorldPos(chanSp))
                var chan_angel = getMygel(duanSp,getWorldPos(chanSp))
                
                var temp_angel =  chan_angel + 180
                var allCount = item.lunCount + curSP.lunCount
                var allDis = allCount * 5.8
                if(allCount==48){
                   allDis = allCount * 5.1
                }
                if(allCount==40){
                   allDis = allCount * 5.3
                }

                item.setRotation(0)
                if(curSP.spList)
                {
                    for (var i = 0; i < curSP.spList.length; i++) {
                        if(curSP.spList[i]){
                            var sp = curSP.spList[i]
                            var spl = getMygel(curSP,getWorldPos(sp))
                            sp.setRotation(0)
                            if(curSP.lunCount>sp.lunCount){
                                var disAn = 360/sp.lunCount/2
                                var n = Math.floor(spl/disAn)
                                var rate = sp.lunCount/curSP.lunCount
                                curSP.setRotation((Math.abs(n)%2+1)*(disAn)/rate)
                            }else{
                                var disAn = 360/sp.lunCount
                                var n = Math.floor(spl/disAn)
                                curSP.setRotation((Math.abs(n)%2+1)*disAn)
                            }
                        }
                    }
                }
                curSP.setRotation(0)
                if(item.lunCount>curSP.lunCount){
                    var disAn = 360/curSP.lunCount/2
                    var n = Math.floor(temp_angel/disAn)
                    temp_angel = n*disAn
                    var rate = item.lunCount/curSP.lunCount
                    item.setRotation((Math.abs(n)%2+1)*disAn/rate)
                }else{
                    var disAn = 360/curSP.lunCount
                    var n = Math.floor(temp_angel/disAn)
                    temp_angel = n*disAn
                    item.setRotation((Math.abs(n)%2+1)*disAn)
                }
                dx = allDis * Math.cos(temp_angel*Math.PI/180)
                dy = allDis * Math.sin(temp_angel*Math.PI/180)
                var pos = cc.p(curSP.x + dx,curSP.y + dy)
                item.setPosition(pos)
                self.curKey = "wenzi3"
                addItemTolist(item,curSP)
                addItemTolist(curSP,item)
            }
        }

        var checkZhuan = function(item){
            var result = true
            if(item.spList)
            {
                for (var i = 0; i < item.spList.length; i++) {
                    var sp = item.spList[i]
                    if(item!=sp){
                        if(!sp.haveDing){
                            result = false
                            break
                        }
                        for (var j = 0; j < sp.spList.length; j++){
                            var spp = sp.spList[j]
                            if(item!=spp && spp !=sp){
                                if(!spp.haveDing){
                                    result = false
                                    break
                                }
                            }
                        }
                    }
                }
            }
            return result
        }

        var somePlay = function(data){
            var item1 = data.item1
            var item2 = data.item2
            var item3 = data.item3
            var fun = data.fun
            var color = data.color || null
            var ii = 0
        
            var drawT = new cc.DrawNode()
            item1.drawSp.addChild(drawT)
            drawT.drawOne = function(data){
                var d = this
                var spos = data.spos
                var epos = data.epos
                var color = data.color || cc.color(250,0,0)
                this.clear()
                d.drawSegment(spos,epos,2,color)
            }

            var drawT1 = new cc.DrawNode()
            item2.drawSp.addChild(drawT1)
            drawT1.drawOne = function(data){
                var d = this
                var spos = data.spos
                var epos = data.epos
                var color = data.color || cc.color(250,0,0)
                this.clear()
                d.drawSegment(spos,epos,2,color)
            }

            var spos1 = drawT.convertToNodeSpace(getWorldPos(item1))
            var spos2 = drawT1.convertToNodeSpace(getWorldPos(item1))

            item3.runAction(cc.repeatForever(cc.sequence(
                cc.delayTime(0.1),
                cc.callFunc(function(){
                    var pi = cc.p(ii/10*item2.x+(10-ii)/10*item1.x,ii/10*item2.y+(10-ii)/10*item1.y)
                    ii++
                    item3.setPosition(pi)
                    var epos1 = item1.drawSp.convertToNodeSpace(getWorldPos(item3))
                    drawT.drawOne({
                        spos:spos1,
                        epos:epos1,
                        color:color
                    })

                    var epos2 = item2.drawSp.convertToNodeSpace(getWorldPos(item3))
                    drawT1.drawOne({
                        spos:spos2,
                        epos:epos2,
                        color:color
                    })
                    if(ii>10){
                        item3.stopAllActions()
                        item3.IsMove = false
                        item1.haveXian = true
                        if(fun){
                            fun()
                        }
                    }
                })
            )))
        }

        var drawXian = function(item){
            var item1 = self.toolbtn.getindex(0)
            var item2 = self.toolbtn.getindex(1)
            var item3 = self.toolbtn.getindex(2)
            self.cls = [item1,item2,item3]
            for (var i = 0; i < self.cls.length; i++) {
                if(self.cls[i]){
                    if(judgeInside({item:self.cls[i],pos:item.getPosition()})){
                       var cls = self.cls
                       if(cls[0]){
                           if(cls[1] && !cls[2]){
                                if(!cls[1].haveXian){
                                    item.IsMove = true
                                    item.setPosition(cls[1].getPosition())
                                    item.setAnchorPoint(0,0)
                                    somePlay({
                                        item1:cls[1],
                                        item2:cls[0],
                                        item3:item,
                                        fun:function(){
                                        }
                                    })
                                }
                            break  
                           }else if(!cls[1] && cls[2]){
                                if(!cls[2].haveXian){
                                    item.IsMove = true
                                    item.setPosition(cls[2].getPosition())
                                    item.setAnchorPoint(0,0)
                                    somePlay({
                                        item1:cls[2],
                                        item2:cls[0],
                                        item3:item,
                                        fun:function(){
                                        }
                                    })
                                }
                            break
                           }else if(cls[1] && cls[2]){
                                var type = "both"
                                if(!cls[1].haveXian && !cls[2].haveXian){
                                    type = "both"
                                }else if(!cls[1].haveXian && cls[2].haveXian){
                                    type = "one"
                                }else if(cls[1].haveXian && !cls[2].haveXian){
                                    type = "two"
                                }

                                switch(type){
                                    case "both":
                                        if(!cls[1].haveXian){
                                            item.IsMove = true
                                            item.setPosition(cls[1].getPosition())
                                            item.setAnchorPoint(0,0)
                                            somePlay({
                                                item1:cls[1],
                                                item2:cls[0],
                                                item3:item,
                                                fun:function(){
                                                    if(!cls[2].haveXian){
                                                        item.IsMove = true
                                                        item.setPosition(cls[2].getPosition())
                                                        item.setAnchorPoint(0,0)
                                                        somePlay({
                                                            item1:cls[2],
                                                            item2:cls[0],
                                                            item3:item,
                                                            color:cc.color(0,0,255),
                                                            fun:function(){
                                                            }
                                                        })
                                                    }
                                                }
                                            })
                                        }
                                    break
                                    case "one":
                                        if(!cls[1].haveXian){
                                            item.IsMove = true
                                            item.setPosition(cls[1].getPosition())
                                            item.setAnchorPoint(0,0)
                                            somePlay({
                                                item1:cls[1],
                                                item2:cls[0],
                                                item3:item,
                                                color:cc.color(0,0,255),
                                                fun:function(){
                                                }
                                            })
                                        }
                                    break
                                    case "two":
                                        if(!cls[2].haveXian){
                                            item.IsMove = true
                                            item.setPosition(cls[2].getPosition())
                                            item.setAnchorPoint(0,0)
                                            somePlay({
                                                item1:cls[2],
                                                item2:cls[0],
                                                item3:item,
                                                color:cc.color(0,0,255),
                                                fun:function(){
                                                }
                                            })
                                        }
                                    break
                                }
                            break
                           }
                       }
                    } 
                }  
            }

        }
        var getOk = function(){
            var isOk = true
            var item1 = self.toolbtn.getindex(0)
            var item2 = self.toolbtn.getindex(1)
            var item3 = self.toolbtn.getindex(2)
            if(item1 && !item1.haveDing){
                isOk = false
            }
            if(item2 && !item2.haveDing){
                isOk = false
            }
            if(item3 && !item3.haveDing){
                isOk = false
            }
            if(!isOk){
                self.speakeBykey("tip1",1)
            }
            return isOk
        }
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode

        var zinode = new cc.Node()
        this.addChild(zinode,100)
        this.zinode = zinode

        this.toolbtn = createTool({
            pos:cc.p(300, 540),
            nums:5,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.2, 1.2),
            itempos:[cc.p(1, -10),cc.p(1, -10),cc.p(1, -10),cc.p(1, -14),cc.p(1, -11)],
            circlepos:cc.p(0,20),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                item.index = index
                item.setLocalZOrder(LOCAL_ORDER++)
                if(index==4){
                    var isOk = getOk()
                    return isOk
                }
                return true
            },
            clickfun:function(data){
                var item = data.sp
                var pos = data.pos
                var index = data.index
                var result = true
                item.startAngel = getMygel1(item,pos)
                if(index<=2){
                    item.setLocalZOrder(10)
                }else{
                    item.setLocalZOrder(LOCAL_ORDER++)
                }  
                if(item.haveDing){
                   result = checkZhuan(item)
                   if(!result){
                       self.speakeBykey("tip1",1)
                   }
                }
                var item1 = self.toolbtn.getindex(0)
                var item2 = self.toolbtn.getindex(1)
                var item3 = self.toolbtn.getindex(2)
                var list = [item1,item2,item3]
                for (var i = 0; i < list.length; i++) {
                    if(list[i] && list[i].tipSp){
                        list[i].tipSp.setVisible(false)
                        list[i].tipSp.imgNum = 15
                    }
                }
                self.imgCount = 12
                
                if(index==3)
                { 
                    if(item.IsMove)
                    {   
                        item.stopAllActions()
                        var ac = createAnimation({
                          frame:"ding%d.png",
                          start:0,
                          end: 7,
                          rever:true,
                          time: 0.1,
                          fun:function(){
                              item.IsMove = false
                              var father = item.getParent()
                              father.haveDing = false
                              father.IsMove = false
                              var wopos = toolnode.convertToWorldSpace(getWorldPos(item))
                              safeAdd(toolnode,item)
                              item.setPosition(wopos) 
                          }
                        })
                        item.runAction(ac)
                    }
                }
                if(index==4){
                    result = getOk()
                }
                return result
            },
            movefun:function(data){
                var item = data.sp
                var delta = data.delta
                var pos = data.pos
                var index = data.index
                if(!item.IsMove){
                    var temppos = cc.p(item.x + delta.x,item.y + delta.y)
                    item.setPosition(temppos)
                    if(index==4){
                        drawXian(item)
                    }
                }
                if(index<=2){
                    if(item.haveDing){
                        var angel = getMygel1(item,pos)
                        var cha_angel = angel - item.startAngel
                        item.setRotation(item.getRotationX() + cha_angel)
                        if(item.tipSp && !item.tipSp.isVisible()){
                            item.tipSp.setPosition(item.x,item.y + 1*item.height/4)
                            item.tipSp.setVisible(true)
                            item.tipSp.setTexture(res.item11)
                            item.tipSp.imgNum = 11
                            item.tipSp.direction = cha_angel >= 0 ? 1:-1
                        }
                        allPlay(item,cha_angel)
                    }
                }
            },
            outfun:function(data){
                var item = data.sp
                var index = item.index
                if(index<=2){
                    var item1 = self.toolbtn.getindex(0)
                    var item2 = self.toolbtn.getindex(1)
                    var item3 = self.toolbtn.getindex(2)
                    if(!item.haveDing)
                    {
                        if(!item.testSp){
                          item.testSp = new cc.Sprite(res.testImg)
                          item.testSp.setPosition(item.width/2,item.height/2)
                          item.testSp.setOpacity(0)
                          item.addChild(item.testSp)
                          item.lunCount = 4<<(index+1)

                          item.tipSp = new cc.Sprite(res.item11)
                          item.tipSp.setPosition(item.width/2,3*item.height/4)
                          zinode.addChild(item.tipSp)
                          item.tipSp.setVisible(false)
                          if(index==0){
                            item.tipSp.setScale(0.7)
                          }
                          item.spList=[]
                          item.drawSp = createClip({
                               toShowimg:res.testImg,
                               ShowimgPos:cc.p(item.width/2,item.height/2),
                               toSencilimg:item.getTexture(),
                               sencilPos:cc.p(item.width/2,item.height/2),
                               father:item,
                           })
                          item.drawSp.setOpacity(0)
                        }
                        if(index==0){
                            if(item2){
                               addItemTolist(item,item2)
                               addItemTolist(item2,item)
                            }
                            if(item3){
                               addItemTolist(item,item3)
                               addItemTolist(item3,item)
                            }
                            item.setPosition(465,325)  
                        }else if(index==1){
                            if(item1){
                               addItemTolist(item,item1)
                               addItemTolist(item1,item)
                            }
                            item.setPosition(322,307) 
                        }else if(index==2){
                            if(item1){
                               addItemTolist(item,item1)
                               addItemTolist(item1,item)
                            }
                            item.setPosition(624,188) 
                        }  
                    }else{
                        self.upList= [4,3,4,3,4,3]
                        self.inputKeys = [null,null]
                        var list = [item1,item2,item3]
                        var zdl1 = null
                        var zdl2 = null
                        var zdl3 = null
                        for (var i = 0; i < list.length; i++) {
                            if(list[i] && list[i].tipSp){
                                var id = 0
                                if(list[i].lunCount==8){
                                   id = 1
                                }else if(list[i].lunCount==16){
                                   id = 2
                                }else if(list[i].lunCount==32){
                                   id = 3
                                }
                                var tipSp = list[i].tipSp
                                var de = tipSp.direction == 1? 1:2
                                if(tipSp.imgNum == 11){
                                    self.upList[0] = id
                                    self.upList[1] = de
                                    zdl1 = list[i]
                                }else if(tipSp.imgNum == 12){
                                    self.upList[2] = id
                                    self.upList[3] = de
                                    zdl2 = list[i]
                                }else if(tipSp.imgNum == 13){
                                    self.upList[4] = id
                                    self.upList[5] = de
                                    zdl3 = list[i]
                                }
                                if(zdl1 && zdl2){
                                    self.inputKeys[0] = 4*zdl1.lunCount/zdl2.lunCount
                                }
                                if(zdl1 && zdl3){
                                    self.inputKeys[1] = 4*zdl1.lunCount/zdl3.lunCount
                                }
                            }
                        }
                        self.bggg.resetItemKey(self.upList)
                        self.bggg.resetInputKey(self.inputKeys)
                    }
                    item.setLocalZOrder(1)         
                }else if(index==3){
                    var item1 = self.toolbtn.getindex(0)
                    var item2 = self.toolbtn.getindex(1)
                    var item3 = self.toolbtn.getindex(2)
                    doPlay({
                        item1:item1,
                        item2:item
                    })
                    doPlay({
                        item1:item2,
                        item2:item
                    })
                    doPlay({
                        item1:item3,
                        item2:item
                    })   
                }
            },
            backfun:function(){
               return false
            },
            counts:[1,1,1,3,1],
            father:toolnode,
            files:[res.item1,res.item2,res.item3,res.item4,res.item5],
            gets:[res.item6,res.item7,res.item8,res.item9,res.item10]
        })
        this.addChild(this.toolbtn,3)
    },
    speakeBykey:function(key,status){
        var self = this
        if(!status){
            if(!self[key]){
                self[key] = true
                self.curKey = key
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
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.toolbtn.show()
            self.nodebs.show(function() {
                self.speakeBykey("wenzi1")
                self.curKey = "wenzi2"
                self.upList= [4,3,4,3,4,3]
                self.inputKeys = [null,null]
                if (!self.bggg) {
                    var bgg = createBiaoge({
                      json:res.biao1,
                      scale: 0.9,
                      inputNum:2,
                      inputKeys:self.inputKeys,
                      downData:{
                        nums:6,
                        bufs:[
                            [null,res.ece1,res.ece2,res.ece3],
                            [null,res.ece4,res.ece5],
                            [null,res.ece1,res.ece2,res.ece3],
                            [null,res.ece4,res.ece5],
                            [null,res.ece1,res.ece2,res.ece3],
                            [null,res.ece4,res.ece5]
                        ],
                        keys:self.upList,
                      }
                    })
                    self.addChild(bgg)
                    bgg.setPosition(0,-1000)
                    self.bggg = bgg
                }
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

        addContent({
            people: this.nodebs,
            key: "wenzi4",
            img:res.wenzi4,
            sound: res.zimp4
        })
    }  
})