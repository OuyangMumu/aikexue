var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super()
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("do_plist")
        var uiList = [
            "select_1","select_2","select_3","select_4","select_5",
            "showLight","light","pian1","pian2","lightLine_1","lightLine_2",
            "lightLine_3","pot1","pot2","lightfx","guangping","rotaBg2"
        ]

        var node = loadNode(res.pzg_doExp1_json,uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })

        var btn_result = new ccui.Button(res.btn_result_normal,res.btn_result_select)
        btn_result.setPosition(1050,460)
        self.addChild(btn_result)

        btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"result"})
        })

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        //四个箭头
        var arrowList = []
        arrowList[0] = createSp("#jiantou01.png",cc.p(90,15),node.lightLine_2)
        arrowList[1] = createSp("#jiantou01.png",cc.p(185,30),node.lightLine_2)
        arrowList[2] = createSp("#jiantou01.png",cc.p(90,15),node.lightLine_3)
        arrowList[3] = createSp("#jiantou01.png",cc.p(196,32),node.lightLine_3)
        //对点的旋转旋转旋转
        var potList = [node.pot1,node.pot2]
        for(var i = 0 ; i < 2 ; i++){
            var sp = potList[i]
            sp.index = i
            createTouchEvent({
                item:sp,
                begin:function(data){
                    var item = data.item
                    var pos = data.pos
                    //item.curSp = 1
                    if(!item.getParent().isVisible())   return false
                    return true
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta
                    var posx = item.x + delta.x
                    var index = item.index
                    if(posx >= 10 && posx <= 150){
                        item.x = posx
                        item.curSp = Math.floor((item.x-6)/4)
                        //cc.log(item.curSp)
                        if(item.x >= 78)
                            item.curSp = Math.floor((item.x - 68 -6)/4)
                        switch(index){
                            case 0:
                                node.pian1.setSpriteFrame(sprintf("pian%02d.png",item.curSp))
                                for(var j = 0 ; j < arrowList.length ; j++){
                                    arrowList[j].setSpriteFrame(sprintf("jiantou%02d.png",item.curSp))
                                    //改变大小
                                    if(j > 1){
                                        item.num = item.curSp
                                        if(item.curSp > 9 && item.curSp <= 18)
                                            item.num = 18 - item.curSp
                                        item.num = -1/8 * item.num + 9/8
                                        //cc.log(item.num)
                                        if(item.num > 1)
                                            item.num = 1
                                        arrowList[j].setScale(item.num)
                                        if(node.judge){
                                            if(j == 3){
                                                node.light.curOp = item.num * 255
                                                node.light.curScal = item.num
                                                node.light.setOpacity(node.light.curOp)
                                                node.light.setScale(node.light.curScal)
                                            }
                                        }
                                    }
                                }
                            break
                            case 1:
                                node.pian2.setSpriteFrame(sprintf("pian%02d.png",item.curSp))
                                for(var j = 2 ; j < arrowList.length ; j++){
                                    //改变大小
                                    if(j > 1){
                                        item.num = item.curSp
                                        if(item.curSp > 9 && item.curSp <= 18)
                                            item.num = 18 - item.curSp
                                        item.num = -1/8 * item.num + 9/8
                                        //cc.log(item.num)
                                        if(item.num > 1)
                                            item.num = 1
                                        arrowList[j].setScale(item.num)
                                        if(j == 3){
                                            node.light.curOp = item.num * 255
                                            node.light.curScal = item.num
                                            node.light.setOpacity(node.light.curOp)
                                            node.light.setScale(node.light.curScal)
                                        }
                                    }
                                }
                            break
                        }
                    }
                }
            })
        }
        
        var wenziList = []
        var normalList = []
        var selectList = []
        var judgeList = [node.showLight,node.pian1,null,node.pian2,node.guangping]
        for(var i = 0 ; i < 5 ; i++){
            wenziList[i] = createSp(sprintf("#wenzi_%d.png",i+1),cc.p(500,50),self)
            wenziList[i].setVisible(false)
            var img = sprintf("#normal_%d.png",i+1)
            var sp = createSp(img,node[uiList[i]].getPosition(),self)
            normalList[i] = sp 
            selectList[i] = node[uiList[i]]
            sp.index = i 

            createTouchEvent({
                item:sp,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    if(!node.judge && index == 3)  return false
                    for(var j = 0 ; j < 5 ; j++){
                        if(index == j){
                            self.nodebs.say({key:self.addList[j].key,force:true})
                            selectList[j].setVisible(true)
                            normalList[j].setVisible(false)
                            wenziList[j].setVisible(true)
                        }else{
                            selectList[j].setVisible(false)
                            normalList[j].setVisible(true)
                            wenziList[j].setVisible(false)
                            //对于第三个特殊处理
                            if(!node.judge && j == 3)
                                normalList[j].setVisible(false)
                        }
                    }
                    return true
                }
            })
            //点击物体触发事件
            var judge = judgeList[i]
            if(judge){
                judge.index = i
                createTouchEvent({
                    item:judge,
                    begin:function(data){
                        var item = data.item
                        var index = item.index
                        if(judgeOpInPos(data)){
                            if(!node.judge && index == 3)  return false
                            for(var j = 0 ; j < 5 ; j++){
                                if(index == j && item){
                                    self.nodebs.say({key:self.addList[j].key,force:true})
                                    selectList[j].setVisible(true)
                                    normalList[j].setVisible(false)
                                    wenziList[j].setVisible(true)
                                }else{
                                    selectList[j].setVisible(false)
                                    normalList[j].setVisible(true)
                                    wenziList[j].setVisible(false)
                                    //对于第三个特殊处理
                                    if(!node.judge && j == 3)
                                        normalList[j].setVisible(false)
                                }
                            }
                            return true
                        }
                        return false
                    }
                })
            }
        }

        normalList[3].setVisible(false)

        //点击切换
        var touchList = []
        for(var i = 0 ; i < 2 ; i++){
            var img = sprintf("#touch_%d.png",2*i+1)
            var sp = createSp(img,cc.p(150*i+100,480),self)
            sp.index = i
            touchList[i] = sp
            var img2 = sprintf("#touch_%d.png",2*i+2)
            touchList[2+i] = createSp(img2,cc.p(150*i+100,480),self)
            touchList[2+i].setVisible(false)
            createTouchEvent({
                item:sp,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    for(var j = 0 ; j < 2 ; j++){
                        if(index == j){
                            touchList[2+j].setVisible(true)
                            touchList[j].setVisible(false)
                            if(index == 0)
                                twoFun(false)
                            else{
                                twoFun(true)
                                if(!node.say2){
                                    node.say2 = true
                                    self.nodebs.say({key:"do_tip2",force:true})
                                }
                            }
                        }else{
                            touchList[2+j].setVisible(false)
                            touchList[j].setVisible(true)
                        }
                    }
                    return true
                }
            })
        }
        touchList[2].setVisible(true)
        touchList[0].setVisible(false)

        var lightList = [node.lightLine_1,node.lightLine_2,node.lightLine_3,node.lightfx]
        //判断显示光路
        var judgeShow = createSp("#judgeShow.png",cc.p(100,400),self)
        judgeShow.gou = createSp("#img_gou.png",cc.p(10,20),judgeShow)
        judgeShow.gou.setVisible(false)
        createTouchEvent({
            item:judgeShow,
            begin:function(data){
                var item = data.item
                if(item.gou.isVisible()){
                    item.gou.setVisible(false)
                    for(var i = 0 ; i < lightList.length ; i++){
                        lightList[i].setVisible(false)
                    }
                }else{
                    item.gou.setVisible(true)
                    for(var i = 0 ; i < lightList.length ; i++){
                        lightList[i].setVisible(true)
                    }
                }
            }
        })

        node.judge = false//用于判断处于一个还是两个偏正片
        node.light.curScal = 0.7
        node.light.curOp = 200
        var twoFun = function(flag){
            node.judge = flag
            normalList[3].setVisible(flag)
            selectList[3].setVisible(false)
            selectList[2].getChildren()[1].setVisible(flag)
            node.rotaBg2.setVisible(flag)
            node.pian2.setVisible(flag)
            if(flag){
                node.light.setScale(node.light.curScal)
                node.light.setOpacity(node.light.curOp)
            }else{
                node.light.setScale(1)
                node.light.setOpacity(255)
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
            {key:"do_tip4",sound:res.do_sound4},
            {key:"do_tip5",sound:res.do_sound5},
            {key:"do_tip6",sound:res.do_sound6},
            {key:"do_tip7",sound:res.do_sound7},
            {key:"do_tip8",sound:res.do_sound8},
        ]
        this.addList = addList
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                sound: addList[i].sound,
            })
        }


        var addList2 = [
            {key:"do_tip1",img: res.do_tip1,sound:res.do_sound1},
            {key:"do_tip2",img: res.do_tip2,sound:res.do_sound2},
        ]
        this.addList = addList
        for (var i = 0 ; i < addList2.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList2[i].key,
                img: addList2[i].img,
                sound: addList2[i].sound,
            })
        }
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.do_tip3,
            sound: res.do_sound3,
            id: "result"
        })
    },
})