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
            "normal_1","normal_2","normal_3","normal_4","normal_5",
            "select_1","select_2","select_3","select_4","select_5",
            "show_1","show_2","show_3","show_4","show_5",
            "wenzi_1","wenzi_2","wenzi_3","wenzi_4","wenzi_5","wenzi_6",
        ]
        var node = loadNode(res.hsb_seeExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({
                key:"see1_tip1",
                fun: function(){
                    self.nodebs.say({key:"see1_tip2"})
                }
            })
        })
        node.curIndex = 10
        for(var i = 0 ; i < 5 ; i++){
            var judge = node[uiList[10+i]]
            judge.index = i
            createTouchEvent({
                item:judge,
                begin:function(data){
                    var index = data.item.index
                    node.callFun(index)
                    return true
                },
            })

            var normal = node[uiList[i]]
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
            if(node.curIndex === index)     return false
            node.curIndex = index
            if(node.wenzi_1.isVisible())
                node.wenzi_1.setVisible(false)
            for(var i = 0 ; i < 5 ; i++){
                var normal = node[uiList[i]]
                var select = node[uiList[i+5]]
                var wenzi = node[uiList[16+i]]
                var show = node[uiList[10+i]]
                if(index == i){
                    normal.setVisible(false)
                    show.setVisible(true)
                    select.setVisible(true)
                    wenzi.setVisible(true)
                    self.nodebs.say({key:self.sayKey[2+i],force:true})
                }else{
                    normal.setVisible(true)
                    select.setVisible(false)
                    wenzi.setVisible(false)
                    show.setVisible(false)
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
        this.sayKey = [
            "see1_tip1","see1_tip2","see1_tip3","see1_tip4","see1_tip5",
            "see1_tip6","see1_tip7",
        ]
        var addList = [
            {sound:res.see_sound1},{sound:res.see_sound2},{sound:res.see_sound3},
            {sound:res.see_sound4},{sound:res.see_sound5},{sound:res.see_sound6},
            {sound:res.see_sound7}
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