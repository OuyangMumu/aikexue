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
            "visible_1","visible_2","visible_3","visible_4",
            "node_item1","node_item2","node_item3","node_item4",
            "wenzi1","wenzi2","wenzi3","wenzi4"
        ]
        var node = loadNode(res.gczwxb_seeExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show()
        node.curIndex = 10
        for(var i = 0 ; i < 4 ; i++){
            var touch = node[uiList[i]]
            touch.index = i
            createTouchEvent({
                item:touch,
                begin:function(data){
                    var result = judgeOpInPos(data)//使用像素判定，使得更加精准
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
            for(var i = 0 ; i < 4 ; i++){
                var normal = node[uiList[8+i]].getChildByName("normal")
                var select = node[uiList[8+i]].getChildByName("select")
                var tip = node[uiList[12+i]]
                var visible = node[uiList[4+i]]
                if(index == i){
                    normal.setVisible(false)
                    select.setVisible(true)
                    tip.setVisible(true)
                    visible.setVisible(true)
                    self.nodebs.say({key:self.sayKey[i],force:true})
                }else{
                    normal.setVisible(true)
                    select.setVisible(false)
                    tip.setVisible(false)
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
        this.sayKey = ["see_tip1","see_tip2","see_tip3","see_tip4"]
        var addList = [
            {sound:res.see1_sound1},
            {sound:res.see1_sound2},
            {sound:res.see1_sound3},
            {sound:res.see1_sound4},
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