var seeExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "seeExp3", 
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
            "show_1","show_2","show_3","show_4","show_5",
            "show_6","show_7",
            "normal_1","normal_2","normal_3","normal_4","normal_5",
            "normal_6","normal_7"
        ]
        var node = loadNode(res.kc_seeExp3_json, uiList)
        self.inside_node.addChild(node)

        loadPlist("see3_plist")
        var createSp = function(res,pos,father){
            var sp = new cc.Sprite(res)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var selectList = []
        var judgeList = []
        var wenziList = []
        var local = [6,7,8,4,3,3,4]
        for(var i = 0 ; i < 7 ; i++){
            wenziList[i] = null
            var name = sprintf("#see3_judge_%d.png", i+1)
            judgeList[i] = createSp(name,node[uiList[i]].getPosition(),self)
            wenziList[i] = null
            selectList[i] = null
            judgeList[i].setVisible(false)
            judgeList[i].setLocalZOrder(local[i])
        }
        var btn_result = new ccui.Button(res.btn_get_normal,res.btn_get_select)
        btn_result.setPosition(800,100)
        self.addChild(btn_result)
        btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"result"})
        })
        createSp("#see3_title.png",cc.p(600,590),self)
        var bigImg = createSp("#see3_bigImg.png",cc.p(450,450),self)
        bigImg.setLocalZOrder(10)
        bigImg.setVisible(false)
        self.nodebs.show()
        node.curIndex = 10
        for(var i = 0 ; i < 7 ; i++){
            var judge = judgeList[i]
            judge.index = i
            createTouchEvent({
                item:judge,
                begin:function(data){
                    var result = judgeOpInPos(data)
                    if(result){
                        var index = data.item.index
                        node.callFun(index)
                    }
                    return result
                },
            })

            var normal = node[uiList[i+7]]
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
            for(var i = 0 ; i < 7 ; i++){
                var normal = node[uiList[i+7]]
                var select = selectList[i]
                var wenzi = wenziList[i]
                var show = node[uiList[i]]

                if(index == i){
                    //设置之前的不显示
                    if(node.wenzi){
                        node.wenzi.setVisible(false)
                        node.select.setVisible(false)
                        node.show.setVisible(false)
                        node.normal.setVisible(true)
                    }
                    bigImg.setVisible(false)
                    if(index == 1)
                        bigImg.setVisible(true)
                    if(!select){
                        var name = sprintf("#see3_select_%d.png", i+1)
                        selectList[i] = createSp(name,node[uiList[7+i]].getPosition(),self)
                    }
                    if(!wenzi){
                        var name = sprintf("#see3_wenzi_%d.png", i+1)
                        wenziList[i] = createSp(name,cc.p(880,370),self)
                    }
                    normal.setVisible(false)
                    selectList[i].setVisible(true)
                    wenziList[i].setVisible(true)
                    show.setVisible(true)
                    //将目前的设置为下一个
                    node.wenzi = wenziList[i]
                    node.select = selectList[i]
                    node.show = show
                    node.normal = normal
                    self.nodebs.say({key:self.sayKey[i],force:true})
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
            "see1_tip6","see1_tip7"
            ]
        var addList = [
            {sound:res.see1_sound1},{sound:res.see3_sound3},{sound:res.see3_sound2},
            {sound:res.see1_sound7},{sound:res.see1_sound5},{sound:res.see3_sound1},
            {sound:res.see3_sound4}
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: self.sayKey[i],
                sound: addList[i].sound,
            })
        }
        addContent({
            people: this.nodebs,
            key: "result",
            sound: res.see1_sound8,
            img: res.see_result,
            id: "result"
        })
    }
})