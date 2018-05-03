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
            "touch_1","touch_2","touch_3","touch_4",
            "touch_5","touch_6","touch_7","touch_8",
            "item_node1","item_node2","item_node3","item_node4",
            "item_node5","item_node6","item_node7","item_node8",
        ]
        var node = loadNode(res.gcszdwsw_seeExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show()
        node.curIndex = 10
        for(var i = 0 ; i < 8 ; i++){
            var touch = node[uiList[i]]
            touch.index = i
            createTouchEvent({
                item:touch,
                begin:function(data){
                    var result = judgeOpInPos(data)
                    if(result){
                        var index = data.item.index
                        node.callFun(index)
                    }
                    return result
                },
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
            if(node.curIndex === index)     
                return false
            node.curIndex = index
            for(var i = 0 ; i < 8 ; i++){
                var normal = node[uiList[8+i]].getChildByName("normal")
                var select = node[uiList[8+i]].getChildByName("select")
                var visible = node[uiList[i]]
                if(index == i){
                    normal.setVisible(false)
                    select.setVisible(true)
                    visible.setVisible(true)
                    self.nodebs.say({key:self.sayKey[i],force:true})
                }else{
                    normal.setVisible(true)
                    select.setVisible(false)
                    visible.setVisible(false)
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
        this.sayKey = ["see1_tip1","see1_tip2","see1_tip3","see1_tip4",
                    "see1_tip5","see1_tip6","see1_tip7","see1_tip8"
        ]
        var addList = [
            {sound:res.see1_sound1},{sound:res.see1_sound2},
            {sound:res.see1_sound3},{sound:res.see1_sound4},
            {sound:res.see1_sound5},{sound:res.see1_sound6},
            {sound:res.see1_sound7},{sound:res.see1_sound8},
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