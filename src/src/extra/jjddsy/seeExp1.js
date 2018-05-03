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

            "normal_1","normal_2","normal_3","normal_4",

            "select_1","select_2","select_3","select_4",
            ]
        var node = loadNode(res.jjddsy_seeExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"see1_tip0"})
        })
        node.curIndex = 10
        for(var i = 0 ; i < 4 ; i++){
            var item = node[uiList[4+i]]
            item.index = i
            createTouchEvent({
                item:item,
                begin:function(data){
                    var result = judgeOpInPos(data)//使用像素判定，使得更加精准
                    if(result){
                        var index = data.item.index
                        node.callFun(index)
                    }
                    return result
                },
            })

            var normal = node[uiList[8+i]]
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
            for(var i = 0 ; i < 4 ; i++){
                var normal = node[uiList[8+i]]
                var select = node[uiList[12+i]]
                var show = node[uiList[i]]
                if(index == i){
                    normal.setVisible(false)
                    select.setVisible(true)
                    show.setVisible(true)
                    self.nodebs.say({key:self.sayKey[i],force:true})
                }else{
                    normal.setVisible(true)
                    select.setVisible(false)
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
        this.sayKey = ["see1_tip1","see1_tip2","see1_tip3","see1_tip4","see1_tip0"
                    ]
        var addList = [
            {sound:res.see1_sound1},
            {sound:res.see1_sound2},
            {sound:res.see1_sound3},
            {sound:res.see1_sound4},
            {sound:res.see1_sound0},
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