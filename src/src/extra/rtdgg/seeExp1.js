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
        var uiList = [
            "item_jian","item_gong","item_rao","item_chi",
            "item_shou","item_bin","item_jing","item_zu",
            "item_lu","item_lei","item_xiong","item_jizhui",
            "item_kuan","item_gu","item_fei",

            "wenzi_1","wenzi_2","wenzi_3","wenzi_4",
            "wenzi_5","wenzi_6","wenzi_7","wenzi_8",
            "wenzi_9","wenzi_10","wenzi_11","wenzi_12",
            "wenzi_13","wenzi_14","wenzi_15",

            "item_node1","item_node2","item_node3","item_node4",
            "item_node5","item_node6","item_node7","item_node8",
            "item_node9","item_node10","item_node11","item_node12",
            "item_node13","item_node14","item_node15",
            ]
        var node = loadNode(res.rtdgg_seeExp1_json, uiList)
        self.inside_node.addChild(node)


        for(var i = 0 ; i < 15 ; i++){
            node[uiList[i]].setVisible(false)
            node[uiList[i+15]].setVisible(false)
        }
        self.nodebs.show()
        node.curIndex = 20
        for(var i = 0 ; i < 15 ; i++){
            var line = node[uiList[i]]
            line.index = i
            createTouchEvent({
                item:line,
                begin:function(data){
                    var result = judgeOpInPos(data)//使用像素判定，使得更加精准
                    if(result){
                        var index = data.item.index
                        node.callFun(index)
                    }
                    return result
                },
            })

            var normal = node[uiList[30+i]].getChildByName("normal")
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

        node.callFun = function(index){
            if(node.curIndex === index)     return 
            node.curIndex = index
            for(var i = 0 ; i < 15 ; i++){
                var normal = node[uiList[30+i]].getChildByName("normal")
                var select = node[uiList[30+i]].getChildByName("select")
                var line = node[uiList[i]]
                var tip = node[uiList[i+15]]
                if(index == i){
                    normal.setVisible(false)
                    select.setVisible(true)
                    line.setVisible(true)
                    tip.setVisible(true)
                    self.nodebs.say({key:self.sayKey[i],force:true})
                }else{
                    normal.setVisible(true)
                    select.setVisible(false)
                    line.setVisible(false)
                    tip.setVisible(false)
                }
            }
        }

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
                       "see_tip13","see_tip14","see_tip15",
                    ]
        var addList = [
            {sound:res.see_sound1},
            {sound:res.see_sound2},
            {sound:res.see_sound3},
            {sound:res.see_sound4},
            {sound:res.see_sound5},
            {sound:res.see_sound6},
            {sound:res.see_sound7},
            {sound:res.see_sound8},
            {sound:res.see_sound9},
            {sound:res.see_sound10},
            {sound:res.see_sound11},
            {sound:res.see_sound12},
            {sound:res.see_sound13},
            {sound:res.see_sound14},
            {sound:res.see_sound15},
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