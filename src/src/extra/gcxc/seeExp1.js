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
            //4
            "show_1","show_2","show_3","show_4",
            //8
            "normal_1","normal_2","normal_3","normal_4",
            //12
            "select_1","select_2","select_3","select_4",
            //16
            "wenzi_1","wenzi_2","wenzi_3","wenzi_4",

            "bigImg",
        ]
        var node = loadNode(res.gcxc_seeExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show()

        node.curIndex = 20
        for(var i = 0 ; i < 4 ; i++){
            var judge = node[uiList[i+4]]
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

            var normal = node[uiList[i+8]]
            normal.index = i
            createTouchEvent({
                item:normal,
                begin:function(data){
                    var index = data.item.index
                    node.callFun(index)
                    return true
                }
            })
            node[uiList[i+12]].setVisible(false)
            node[uiList[i+16]].setVisible(false)
            node[uiList[i]].setVisible(false)
        }

        node.callFun = function(index){
            if(node.curIndex === index)     return 
            node.curIndex = index
            for(var i = 0 ; i < 4 ; i++){
                var normal = node[uiList[i+8]]
                var select = node[uiList[i+12]]
                var wenzi = node[uiList[i+16]]
                var show = node[uiList[i]]
                if(index == i){
                    normal.setVisible(false)
                    show.setVisible(true)
                    select.setVisible(true)
                    wenzi.setVisible(true)
                    if(i == 0)
                        node.bigImg.setVisible(true)
                    else
                        node.bigImg.setVisible(false)
                    self.nodebs.say({key:self.sayKey[i],force:true})
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
            "see1_tip1","see1_tip2","see1_tip3","see1_tip4",]
        var addList = [
            {sound:res.see1_sound1},{sound:res.see1_sound2},
            {sound:res.see1_sound3},{sound:res.see1_sound4},
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