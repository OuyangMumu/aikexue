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
            "item_1","item_2","item_3","item_4",
        ]
        var node = loadNode(res.ydq_seeExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"see_tip1"})
        })

        var curIndex = 5
        for(var i = 0 ; i < 4 ; i++){
            var judge = node[uiList[i]]
            judge.index = i 
            createTouchEvent({
                item:judge,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    var pos = data.pos
                    var result = judgeOpInPos({item:item,pos:pos})
                    if(result && curIndex != index){
                        fun(index)
                    }
                    return result
                }
            })

            var select = node[uiList[i+4]].getChildByName("normal")
            select.index = i 
            createTouchEvent({
                item:select,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    var pos = data.pos
                    if(curIndex != index){
                        fun(index)
                    }
                    return true
                }
            })
        }

        var fun = function(index){
            cc.log(index)
            curIndex = index
            for(var i = 0 ; i < 4 ; i++){
                if(index == i){
                    self.nodebs.say({key:self.sayKey[i+1],force:true})
                    node[uiList[i+4]].getChildByName("select").setVisible(true)
                    node[uiList[i+4]].getChildByName("normal").setVisible(false)
                }else{
                    node[uiList[i+4]].getChildByName("select").setVisible(false)
                    node[uiList[i+4]].getChildByName("normal").setVisible(true)
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
                       "see_tip5",
                    ]
        var addList = [{sound:res.see_sound0},
            {sound:res.see_sound1},{sound:res.see_sound2},
            {sound:res.see_sound3},{sound:res.see_sound4},
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