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
            "judge_1","judge_2","judge_3","judge_4",
            "judge_5","judge_6","judge_7","judge_8",

            "show_1","show_2","show_3","show_4",
            "show_5","show_6","show_7","show_8",

            "normal_1","normal_2","normal_3","normal_4",
            "normal_5","normal_6","normal_7","normal_8",

            "select_1","select_2","select_3","select_4",
            "select_5","select_6","select_7","select_8",

            "node_wenzi"
            ]
        var node = loadNode(res.fdj_seeExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"see_tip0"})
        })
        node.curIndex = 10
        for(var i = 0 ; i < 8 ; i++){
            var judge = node[uiList[i]]
            judge.index = i
            createTouchEvent({
                item:judge,
                begin:function(data){
                    var result = judgeOpInPos(data)//使用像素判定，使得更加精准
                    if(result){
                        var index = data.item.index
                        node.callFun(index)
                    }
                    return result
                },
            })

            var normal = node[uiList[16+i]]
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
                var normal = node[uiList[16+i]]
                var select = node[uiList[24+i]]
                var show = node[uiList[8+i]]
                var name = "wenzi_" + (i+1)
                var tip = node.node_wenzi.getChildByName(name)
                if(index == i){
                    normal.setVisible(false)
                    select.setVisible(true)
                    show.setVisible(true)
                    tip.setVisible(true)
                    self.nodebs.say({key:self.sayKey[i],force:true})
                }else{
                    normal.setVisible(true)
                    select.setVisible(false)
                    show.setVisible(false)
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
                       "see_tip0",
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
            {sound:res.see_sound0},
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