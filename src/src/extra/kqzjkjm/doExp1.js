var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super()
        var self = this
        this.expCtor({
            vis: false,
            setZ:99,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun:function(){
                    if(!self.biaoge){
                        var bg = createBiaoge({
                            json: res.kqzjkjm_tableNode_json,
                            scale:0.9,
                            inputNum:6,
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
        return true
    },

    initUI:function(){
        var self = this
        var uiList = [
            "zsq1","zsq2","shaobei","shaobei2","water","bigfdk1","bigfdk2",
            "bigbg1","bigbg2"
        ]
        var node = loadNode(res.kqzjkjm_doExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })

        var zsqList = [node.zsq1,node.zsq2]

        var sb = node.shaobei 
        sb.sbq = node.shaobei2
        sb.water = node.water

        var judgeAir = false //判断当前已经有空气了
        var judgeWater = false //判断当前已经有水了
        var air = null
        var water = null
        var dialog = true

        //注射器
        for(var i = 0 ; i < 2 ; i++){
            var zsq = zsqList[i]
            //读取注射器的一些部分对象
            zsq.lg = zsq.getChildByName("lg")
            zsq.hand_la = zsq.lg.getChildByName("hand_la")
            zsq.yingyin = zsq.getChildByName("yingyin")
            zsq.btn_du = zsq.getChildByName("btn_du")
            zsq.btn_la = zsq.getChildByName("btn_la")
            zsq.btn_ya = zsq.getChildByName("btn_ya")
            zsq.btn_fang = zsq.getChildByName("btn_fang")
            zsq.hand_du = zsq.getChildByName("hand_du")
            zsq.fdk = zsq.getChildByName("fdk")
            zsq.hand_du.setLocalZOrder(-2)
            zsq.lg.setLocalZOrder(-1)

            zsq.index = i
            zsq.noMove = false
            zsq.in = false
            zsq.judge = true  //控制移入和移除烧杯
            zsq.du = false
            var judgeSay = [false,false]
            createTouchEvent({
                item:zsq,
                begin:function(data){
                    var item = data.item
                    if(!item.judge)     return false
                    if(item.noMove && item.in){
                        item.judge = false
                        //item.in = false
                        sb.ok = false
                        item.runAction(cc.sequence(
                            cc.moveTo(0.5,sb.x+10,sb.y+sb.height/2+20),
                            cc.callFunc(function(){
                                item.noMove = false
                                item.judge = true
                                changeFather({item:sb.sbq,father:sb})
                            })
                        ))
                    }
                    if(!item.in && item.du)
                        item.btn_du.setVisible(false)
                    return true 
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta
                    var posX = item.x + delta.x 
                    var posY = item.y + delta.y

                    if(!item.noMove){
                        item.x += delta.x 
                        item.y += delta.y
                    }

                    if(!sb.ok && !item.in && checkdistans(item,cc.p(sb.x,sb.y+sb.height/2-20),30)){
                        if(sb.curZsq != null){
                            if(sb.curZsq != item.index){
                                //提示已有一只注射器抽过水，不能抽了
                                createDialog(res.dialog_3)
                                return false
                            }
                        }
                        if(item.lg.air){
                            //请先排完空气，才能放入
                            createDialog(res.dialog_1)
                            return false
                        }
                        cc.log("ok ok ok ok")
                        item.judge = false
                        item.in = true
                        item.noMove = true
                        sb.ok = true
                        item.runAction(cc.sequence(
                            cc.moveTo(0.5,sb.x+10,sb.y - 70),
                            cc.callFunc(function(){
                                changeFather({item:sb.sbq,father:self})
                                item.judge = true
                            })
                        ))
                    }
                    
                },
                end:function(data){
                    var item = data.item
                    dialog = true
                    if(item.in && !sb.ok){
                        item.in = false
                        cc.log("out out out")
                    }
                    if(!item.in && item.du)
                        item.btn_du.setVisible(true)
                }
            })

            //设置按钮属性功能
            zsqList[i].btn_du.addClickEventListener(function(selector,type){
                var zsq = selector.getParent()
                if(zsq.btn_du.isVisible()){
                    changeFather({item:sb.sbq,father:sb})
                    sb.setPositionY(-1000)
                    zsq.hand_du.setVisible(true)
                    zsq.btn_du.setVisible(false)
                    zsq.btn_la.setVisible(true)
                    zsq.btn_ya.setVisible(true)
                    zsq.du = false
                    zsq.lg.over = true
                }
            })
            zsqList[i].btn_la.addClickEventListener(function(selector,type){
                var zsq = selector.getParent()
                if(zsq.btn_la.isVisible()){
                    zsq.btn_la.setVisible(false)
                    zsq.btn_ya.setVisible(false)
                    //拉杆开始拉动
                    var count = zsq.lg.y
                    var count2 = zsq.fdk.bigzsq.y
                    zsq.fdk.bigzsq.count = zsq.fdk.bigzsq.y
                    zsq.hand_la.setVisible(true)
                    if(zsq.lg.air){
                        count = count * 1.2
                        count2 = count2 * 1.2
                    }
                    zsq.lg.runAction(cc.sequence(
                        cc.moveTo(1,zsq.lg.x,count),
                        cc.callFunc(function(){
                            zsq.btn_fang.setVisible(true)
                            zsq.hand_la.setVisible(false)
                        })
                    ))
                    zsq.fdk.runAction(cc.moveTo(1,zsq.lg.x,count))
                    zsq.fdk.bigzsq.runAction(cc.moveTo(1,zsq.fdk.bigzsq.x,count2))
                }
            })
            zsqList[i].btn_ya.addClickEventListener(function(selector,type){
                var zsq = selector.getParent()
                if(zsq.btn_ya.isVisible()){
                    zsq.btn_ya.setVisible(false)
                    zsq.btn_la.setVisible(false)
                    //压杆开始拉动
                    var count = zsq.lg.y
                    var count2 = zsq.fdk.bigzsq.y
                    zsq.fdk.bigzsq.count = zsq.fdk.bigzsq.y
                    zsq.hand_la.setVisible(true)
                    if(zsq.lg.air){
                        count = count * 0.9
                        count2 = count2 * 0.9
                    }
                    zsq.lg.runAction(cc.sequence(
                        cc.moveTo(1,zsq.lg.x,count),
                        cc.callFunc(function(){
                            zsq.btn_fang.setVisible(true)
                            zsq.hand_la.setVisible(false)
                            judgeSay[zsq.index] = true
                            if(judgeSay[0] && judgeSay[1]){
                                self.nodebs.say({key:"do_tip3",force:true})
                                judgeSay[1] = false
                                judgeSay[0] = false
                            }
                        })
                    ))
                    zsq.fdk.runAction(cc.moveTo(1,zsq.lg.x,count))
                    zsq.fdk.bigzsq.runAction(cc.moveTo(1,zsq.fdk.bigzsq.x,count2))
                }
            })
            zsqList[i].btn_fang.addClickEventListener(function(selector,type){
                var zsq = selector.getParent()
                if(zsq.btn_fang.isVisible()){
                    zsq.btn_fang.setVisible(false)
                    zsq.hand_la.setVisible(false)
                    if(zsq.lg.air){
                        zsq.fdk.runAction(cc.moveTo(1,zsq.lg.x,zsq.lg.num * 142 / 20 + 34))
                        zsq.fdk.bigzsq.runAction(cc.moveTo(1,zsq.fdk.bigzsq.x,zsq.fdk.bigzsq.count))
                        
                        zsq.lg.runAction(cc.sequence(
                            cc.moveTo(1,zsq.lg.x,zsq.lg.num * 142 / 20 + 34),
                            cc.callFunc(function(){
                                zsq.btn_ya.setVisible(true)
                                zsq.btn_la.setVisible(true)
                            })
                        ))
                    }else{
                        zsq.btn_ya.setVisible(true)
                        zsq.btn_la.setVisible(true)
                    }
                }
            })
        }
        //拉杆
        for(var i = 0 ; i < 2 ; i++){
            var lg = zsqList[i].lg
            lg.index = i
            lg.num = 0
            lg.water = false
            lg.haveWater = false
            lg.air = false
            lg.over = false
            createTouchEvent({
                item:lg,
                begin: function(data){
                    var item = data.item
                    if(item.over)   return false
                    if(!item.getParent().judge)     return false
                    if(!item.getParent().in){
                        dialog = true
                        if (item.water) {
                            //抽过水，不可以再抽空气
                            createDialog(res.dialog_4)
                            return false
                        }else if (item.haveWater){
                            //只能在水中排水
                            createDialog(res.dialog_2)
                            return false
                        }else if(judgeAir && !item.air){
                            //提示已有一只吸了空气，不能再吸空气
                            createDialog(res.dialog_5)
                            return false
                        }
                    }
                    
                    item.getParent().hand_la.setVisible(true)
                    return true 
                },
                move: function(data){
                    var item = data.item
                    var delta = data.delta
                    if(item.y + delta.y > 33 && item.y + delta.y < 177){
                        item.y += delta.y
                        item.getParent().fdk.y += delta.y
                        item.getParent().fdk.bigzsq.y -= delta.y * 2.7
                        
                        if(item.getParent().in){
                            //烧杯中的水上升下降
                            sb.water.setPositionY(140 - (item.y - 34) / 14)
                            item.getParent().yingyin.setScaleY( (item.y - 34) / 140 )
                        }
                    }
                },
                end:function(data){
                    var item = data.item
                    item.getParent().hand_la.setVisible(false)
                    
                    item.num = ((item.y - 34) / 142) * 20
                    cc.log(item.num)
                    //判断注射器放入水中
                    if(item.getParent().in){
                        if(item.num > 0.3){
                            item.haveWater = true
                            item.water = false
                            judgeWater = true
                            water = item.getParent()
                            if(sb.curZsq == null)
                                sb.curZsq = item.index
                        }else{
                            item.water = true
                            item.haveWater = false
                            judgeWater = false
                        }
                    }else{
                        if(item.num > 0.3){//在空气中抽了空气
                            item.air = true
                            judgeAir = true
                            air = item.getParent()
                        }else{
                            item.air = false
                            judgeAir = false
                        }
                    }

                    //终极判断,判断是否相等，是否可以操作了
                    if(judgeAir && judgeWater){
                        var count = Math.floor(air.lg.num - water.lg.num)
                        cc.log(count)
                        
                        //只进入一次，提示进入一次
                        //if(count < 2 && count > -2){
                            
                            
                        //}else{
                            if(!self.judgeOver && (count > 2 || count < -2)){
                                self.judgeOver = true
                                //提示请抽取一样值的
                                createDialog(res.dialog_6)
                                dialog = true
                            }else{
                                //值一样，显示堵住管口按钮，说话提示点击堵住管口
                                if(air.in){
                                    duFun(air)
                                }else if(water.in){
                                    duFun(water)
                                }
                                air.btn_du.setVisible(true)
                                water.btn_du.setVisible(true)
                                air.du = true
                                water.du = true
                                self.nodebs.say({key:"do_tip2",force:true})
                            }
                            
                        //}
                    }
                }
            })
        }

        self.judgeOver = false

        //放大框
        for(var i = 0 ; i < 2 ; i++){
            var fdk = zsqList[i].fdk
            fdk.index = i
            fdk.bigfdk = node[uiList[5+i]]
            fdk.biglg = fdk.bigfdk.getChildByName("biglg")
            fdk.bigzsq = fdk.biglg.getChildren()[0]
            createTouchEvent({
                item:fdk,
                begin:function(data){
                    return true
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta 
                    if(item.y + delta.y < 250 && item.y + delta.y > 32){
                        item.y += delta.y
                        item.biglg.y -= delta.y * (3 + (bigbgList[item.index].curScale - 1) * 2)
                        //cc.log((3 + (bigbgList[item.index].curScale - 1) * 2))
                    }
                },
                end:function(data){
                    var item = data.item
                    item.setPositionY(item.getParent().lg.y)
                    item.biglg.setPositionY(121)
                    if(!item.bigfdk.isVisible()){
                        item.bigfdk.setVisible(true)
                        bigbgList[item.index].setVisible(true)
                        item.bigfdk.setPosition(600+item.index*200,350)
                        bigbgList[item.index].setPosition(600+item.index*200,350)
                    }
                    
                }
            })
        }

        //移动放大镜
        var bigbgList = [node.bigbg1,node.bigbg2]
        for(var i = 0 ; i < 2 ; i++){
            var bigbg = bigbgList[i]
            bigbg.index = i
            bigbg.fdk = zsqList[i].fdk
            bigbg.bigfdk = node[uiList[5+i]]
            bigbg.btn_close = bigbg.getChildByName("btn_close")
            bigbg.btn_big = bigbg.getChildByName("btn_big")
            bigbg.btn_small = bigbg.getChildByName("btn_small")
            bigbg.curScale = zsqList[bigbg.index].fdk.biglg.getScale()
            createTouchEvent({
                item:bigbg,
                begin:function(data){
                    var item = data.item
                    if(!item.isVisible())
                        return false
                    return true 
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta
                    item.x += delta.x 
                    item.y += delta.y
                    item.bigfdk.x += delta.x 
                    item.bigfdk.y += delta.y
                }
            })

            bigbg.btn_close.addClickEventListener(function(selector,type){
                var bigbg = selector.getParent()
                bigbg.setVisible(false)
                bigbg.bigfdk.setVisible(false)
            })
            bigbg.btn_big.addClickEventListener(function(selector,type){
                var bigbg = selector.getParent()
                if(bigbg.curScale < 1.4){
                    bigbg.curScale = bigbg.curScale + 0.15
                    cc.log(bigbg.curScale)
                    bigbg.fdk.biglg.setScale(bigbg.curScale)
                    var curScale = bigbg.fdk.getScale() - 0.07
                    bigbg.fdk.setScale(curScale)
                }
            })
            bigbg.btn_small.addClickEventListener(function(selector,type){
                var bigbg = selector.getParent()
                if(bigbg.curScale > 0.6){
                    bigbg.curScale = bigbg.curScale - 0.15
                    cc.log(bigbg.curScale)
                    bigbg.fdk.biglg.setScale(bigbg.curScale)
                    var curScale = bigbg.fdk.getScale() + 0.07
                    bigbg.fdk.setScale(curScale)
                }
            })
        }

        var duFun = function(item){
            item.setPosition(sb.x+10,sb.y+sb.height/2+20)
            item.in = false
            item.noMove = false
            sb.ok = false
        }

        var checkdistans = function(ra,rb,dis){
            var dx =  ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis){
                return true
            }else
                return false
        }

        var createDialog = function(img){
            if(dialog){
                AddDialog("Tips", {
                    res: img,
                    face: 2,
                    confirmBtn:true,
                })
                dialog = false
            }
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
            {key:"do_tip3",img:res.do_tip3,sound:res.do_sound3},
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