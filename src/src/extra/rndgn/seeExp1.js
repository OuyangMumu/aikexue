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
        var uiList = ["line_piceng","line_danao","line_pingdi","line_qiunao",
                    "line_xiaonao","line_jisui","line_naogan","line_naochui",

                    "item_node1","item_node2","item_node3","item_node4",
                    "item_node5","item_node6","item_node7","item_node8",

                    "judge_piceng","judge_danao","judge_pingdi","judge_qiunao",
                    "judge_xiaonao","judge_jisui","judge_naogan","judge_naochui",

                    "tip_node"
                    ]
        var node = loadNode(res.rndgn_seeExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show()
        node.curIndex = 10
        for(var i = 0 ; i < 8 ; i++){
            var line = node[uiList[i+16]]
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
                }
            })

            var normal = node[uiList[8+i]].getChildByName("normal")
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
            for(var i = 0 ; i < 8 ; i++){
                var normal = node[uiList[8+i]].getChildByName("normal")
                var select = node[uiList[8+i]].getChildByName("select")
                var line = node[uiList[i]]
                var tip = node.tip_node.getChildByName(self.sayKey[i])
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
            pos: cc.p(1030, 130)
        })
        this.addChild(this.nodebs)
        var self = this
        this.sayKey = ["see_tip1","see_tip2","see_tip3","see_tip4",
                       "see_tip5","see_tip6","see_tip7","see_tip8"
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