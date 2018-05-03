var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "seeExp1", 
    preLayer: "seeLayer", 
    ctor: function() { 
        this._super();
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("seewz_plist")
        var uiList = [
            "qian_1","qian_2","qian_3","qian_4",
            "qian_5","qian_6","qian_7","qian_8",
            "qian_9","qian_10","qian_11","qian_12",
            "qian_13",null,null,"qian_16","qian_17",

            "hou_1","hou_2",null,null,
            null,"hou_6","hou_7","hou_8",
            "hou_9",null,"hou_11",null,"hou_13",
            "hou_14","hou_15","hou_16","hou_17",

            "item_node1","item_node2","item_node3","item_node4",
            "item_node5","item_node6","item_node7","item_node8",
            "item_node9","item_node10","item_node11","item_node12",
            "item_node13","item_node14","item_node15","item_node16","item_node17",

            "wenzi_node"
        ]
        //addKey("1")
        var node = loadNode(res.rtdjr_seeExp1_json, uiList)
        //addKey("2")
        self.inside_node.addChild(node)

        self.nodebs.show()

        var lineList = [
            "lineqian_1","lineqian_2","lineqian_3","lineqian_4",
            "lineqian_5","lineqian_6","lineqian_7","lineqian_8",
            "lineqian_9","lineqian_10","lineqian_11","lineqian_12",
            "lineqian_13",null,null,"lineqian_16","lineqian_17",

            "linehou_1","linehou_2",null,null,
            null,"linehou_6","linehou_7","linehou_8",
            "linehou_9",null,"linehou_11",null,"linehou_13",
            "linehou_14","linehou_15","linehou_16","linehou_17"
        ]

        var normalList = []
        var selectList = []
        for(var i = 1 ; i < 18 ; i++){
            var name = sprintf("#normal_%d.png", i)
            var normal = new cc.Sprite(name)
            node[uiList[33+i]].addChild(normal)
            normalList.push(normal)
            selectList[i-1] = null
        }

        node.curIndex = 20
        for(var i = 0 ; i < 17 ; i++){
            if(uiList[i]){
                var qian = node[uiList[i]]
                qian.index = i
                createTouchEvent({
                    item:qian,
                    begin:function(data){
                        var result = judgeOpInPos(data)//使用像素判定，使得更加精准
                        if(result){
                            var index = data.item.index
                            node.callFun(index)
                        }
                        return result
                    },
                })
            }

            if(uiList[i+17]){
                var hou = node[uiList[17+i]]
                hou.index = i
                createTouchEvent({
                    item:hou,
                    begin:function(data){
                        var result = judgeOpInPos(data)//使用像素判定，使得更加精准
                        if(result){
                            var index = data.item.index
                            node.callFun(index)
                        }
                        return result
                    },
                })
            }
            
            var normal = normalList[i]
            normal.index = i
            createTouchEvent({
                item:normal,
                begin:function(data){
                    var index = data.item.index
                    node.callFun(index)
                    return true
                }
            })
        }

        node.lastWenzi = node[uiList[34]]
        node.qian = node[uiList[0]]
        node.hou = node[uiList[17]]
        node.callFun = function(index){
            if(node.curIndex === index)     return 
            node.curIndex = index
            if(selectList[index] == null){
                var name = sprintf("#select_%d.png", index+1)
                var select = new cc.Sprite(name)
                select.setScale(1.2)
                node[uiList[34+index]].addChild(select)
                selectList[index] = select
            }
            var name = sprintf("#wenzi_%d.png", index+1)
            var wenzi = new cc.Sprite(name)
            node.wenzi_node.removeAllChildren(true)
            node.wenzi_node.addChild(wenzi)

            for(var i = 0 ; i < 17 ; i++){
                var normal = normalList[i]
                var select = selectList[i]
                //var tip = node.wenzi_node.getChildByName(wenziList[i])
                node[uiList[i+34]].stopAllActions()

                if(index == i){
                    //tip.setVisible(true)
                    node.lastWenzi = node[uiList[34+i]]
                    node.qian.stopAllActions()
                    node.hou.stopAllActions()
                    node.shandong(node[uiList[34+i]],i)
                    self.nodebs.say({key:self.sayKey[i],force:true})
                }else{
                    if(select)
                        select.setVisible(false)
                    normal.setVisible(true)
                    //tip.setVisible(false)
                    if(lineList[i]){
                        node.getChildByName(lineList[i]).setVisible(false)  
                    }
                    if(lineList[i+17]){
                        node.getChildByName(lineList[i+17]).setVisible(false)   
                    }
                }
            }
        }

        node.shandong = function(wenzi_node,i){
            wenzi_node.runAction(cc.repeatForever(cc.sequence(
                cc.callFunc(function(){
                    wenzi_node.getChildren()[1].setVisible(true)
                    wenzi_node.getChildren()[0].setVisible(false)
                }),
                cc.delayTime(0.4),
                cc.callFunc(function(){
                    wenzi_node.getChildren()[1].setVisible(false)
                    wenzi_node.getChildren()[0].setVisible(true)
                }),
                cc.delayTime(0.4)
            )))

            if(lineList[i]){
                var qian = node.getChildByName(lineList[i])
                node.qian = qian
                qian.runAction(cc.repeatForever(cc.sequence(
                    cc.callFunc(function(){
                        qian.setVisible(true)
                    }),
                    cc.delayTime(0.4),
                    cc.callFunc(function(){
                        qian.setVisible(false)
                    }),
                    cc.delayTime(0.4)
                )))
            }

            if(lineList[i+17]){
                var hou = node.getChildByName(lineList[i+17])
                node.hou = hou
                hou.runAction(cc.repeatForever(cc.sequence(
                    cc.callFunc(function(){
                        hou.setVisible(true)
                    }),
                    cc.delayTime(0.4),
                    cc.callFunc(function(){
                        hou.setVisible(false)
                    }),
                    cc.delayTime(0.4)
                )))
            }    
            
        }
       //addKey("3")
    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs)
        var self = this
        this.sayKey = ["see_tip1","see_tip2","see_tip3","see_tip4",
                       "see_tip5","see_tip6","see_tip7","see_tip8",
                       "see_tip9","see_tip10","see_tip11","see_tip12",
                       "see_tip13","see_tip14","see_tip15","see_tip16",
                       "see_tip17",
                    ]
        var addList = [
            {sound:res.see_sound1},{sound:res.see_sound2},
            {sound:res.see_sound3},{sound:res.see_sound4},
            {sound:res.see_sound5},{sound:res.see_sound6},
            {sound:res.see_sound7},{sound:res.see_sound8},
            {sound:res.see_sound9},{sound:res.see_sound10},
            {sound:res.see_sound11},{sound:res.see_sound12},
            {sound:res.see_sound13},{sound:res.see_sound14},
            {sound:res.see_sound15},{sound:res.see_sound16},
            {sound:res.see_sound17},
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: self.sayKey[i],
                sound: addList[i].sound,
            })
        }
    }
})