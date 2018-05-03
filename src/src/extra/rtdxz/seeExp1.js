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
        addKey("1")
        var self = this
        loadPlist("wenzi_plist")
        var uiList = [
            "zheng_item1","zheng_item2","zheng_item3","zheng_item4",
            "zheng_item5","zheng_item6","zheng_item7","zheng_item8","zheng_item9",
            "zheng_line1","zheng_line2","zheng_line3","zheng_line4",
            "zheng_line5","zheng_line6","zheng_line7","zheng_line8","zheng_line9",

            "zhengmian",
        ]
        var uiList2 = [
            "bei_item1","bei_item2","bei_item3","bei_item4",
            "bei_item5","bei_item6","bei_item7","bei_item8","bei_item9",
            "bei_line1","bei_line2","bei_line3","bei_line4",
            "bei_line5","bei_line6","bei_line7","bei_line8","bei_line9",

            "beimian"
        ]
        var node_zheng = loadNode(res.rtdxz_seeExp1_json, uiList)
        self.inside_node.addChild(node_zheng)
        //node_zheng.setPosition(80,30)
        node_zheng.zhengmian.setScale(0.85)

        var node_bei = null
        var see1_title = new cc.Sprite(res.see1_title)
        see1_title.setPosition(100,520)
        self.addChild(see1_title)

        var wenzi_1 = new cc.Sprite("#see_wenzi1.png")
        wenzi_1.setPosition(570,600)

        var wenzi_1 = new cc.Sprite("#see_wenzi1.png")
        wenzi_1.setPosition(570,600)
        wenzi_1.setScale(0.8)
        self.addChild(wenzi_1)
        var wenzi_node = new cc.Node()
        wenzi_node.setPosition(510,65)
        self.addChild(wenzi_node)
        wenzi_node.setScale(0.9)

        var itemNodeList = [
            "item_node1","item_node2","item_node3","item_node4",
            "item_node5","item_node6","item_node7","item_node8",
            "item_node9",
        ]
        self.nodebs.show(function(){
            self.nodebs.say({
                key:self.sayKey[9],
                fun:function(){
                    self.nodebs.say({key:self.sayKey[10]})
                }
            })
        })
        addKey("2")
        var normal_zhengList = [] //正面及背面
        var select_zhengList = []
        var normal_beiList = []
        var select_beiList = []
        var beinormal = [2,6,8,9,1,7,3,5,4]
        for(var i = 0 ; i < 9 ; i++){
            var name = sprintf("#normal_%d.png", i+1)
            var normal = new cc.Sprite(name)
            node_zheng.zhengmian.getChildByName(itemNodeList[i]).addChild(normal)
            normal_zhengList.push(normal)
            select_zhengList[i] = null
        }

        var wenzi = new cc.Sprite("#see_wenzi2.png")
        wenzi_node.addChild(wenzi)
        addKey("3")
        
        for(var i = 0 ; i < 9 ; i++){
            var zhengItem = node_zheng[uiList[i]]
            zhengItem.index = i
            createTouchEvent({
                item:zhengItem,
                begin:function(data){
                    var result = judgeOpInPos(data)//使用像素判定，使得更加精准
                    if(result){
                        var index = data.item.index
                        callFun(index)
                    }
                    return result
                },
            })
            
            var normal = normal_zhengList[i]
            normal.index = i
            createTouchEvent({
                item:normal,
                begin:function(data){
                    var index = data.item.index
                    callFun(index)
                    return true
                }
            })
        }

        var btn_zheng = new ccui.Button(res.btn_zheng_select,res.btn_zheng_normal)
        btn_zheng.setPosition(90,400)
        self.addChild(btn_zheng)
        var btn_bei = new ccui.Button(res.btn_bei_normal,res.btn_bei_select)
        btn_bei.setPosition(90,300)
        self.addChild(btn_bei)

        var curCount = 0
        btn_zheng.addClickEventListener(function(){
            if(curCount == 0)
                return 
            curCount = 0
            btn_zheng.loadTextures(res.btn_zheng_select, res.btn_zheng_normal)
            btn_bei.loadTextures(res.btn_bei_normal,res.btn_bei_select)
            node_zheng.setPositionY(0)
            node_bei.setPosition(0,-600)
            againFun(0)
        })
        btn_bei.addClickEventListener(function(){
            if(curCount == 1)
                return 
            curCount = 1
            btn_zheng.loadTextures(res.btn_zheng_normal, res.btn_zheng_select)
            btn_bei.loadTextures(res.btn_bei_select,res.btn_bei_normal)
            if(node_bei == null) //首次加载，可能会比较慢
                beiFun()
            node_bei.setPositionY(0)
            node_zheng.setPosition(0,-600)
            againFun(1)
        })

        var beiFun = function(){
            node_bei = loadNode(res.rtdxz_seeExp1_2_json, uiList2)
            self.inside_node.addChild(node_bei)
            //node_zheng.setPosition(40,30)

            for(var i = 0 ; i < 9 ; i++){
                var normal_index = beinormal[i]
                var name = sprintf("#normal_%d.png", normal_index)
                var normal = new cc.Sprite(name)
                node_bei.beimian.getChildByName(itemNodeList[i]).addChild(normal)
                normal_beiList.push(normal)
                select_beiList[i] = null
            }

            for(var i = 0 ; i < 9 ; i++){
                var beiItem = node_bei[uiList2[i]]
                beiItem.index = i
                createTouchEvent({
                    item:beiItem,
                    begin:function(data){
                        var result = judgeOpInPos(data)
                        if(result){
                            var index = data.item.index
                            callFun2(index)
                        }
                        return result
                    },
                })
                
                
                var normal = normal_beiList[i]
                normal.index = i
                createTouchEvent({
                    item:normal,
                    begin:function(data){
                        var index = data.item.index
                        callFun2(index)
                        return true
                    }
                })
            }
        }

        var curIndex = 10
        var callFun = function(index){
            if(curIndex === index)     return 
            curIndex = index

            if(select_zhengList[index] == null){
                var name = sprintf("#select_%d.png", index+1)
                var select = new cc.Sprite(name)
                node_zheng.zhengmian.getChildByName(itemNodeList[index]).addChild(select)
                select_zhengList[index] = select
            }
            var name = sprintf("#wenzi%d.png", index+1)
            var wenzi = new cc.Sprite(name)
            wenzi_node.removeAllChildren(true)
            wenzi_node.addChild(wenzi)

            for(var i = 0 ; i < 9 ; i++){
                var normal = normal_zhengList[i]
                var select = select_zhengList[i]
                var itemLine = node_zheng[uiList[i+9]]
                var line = node_zheng.zhengmian.getChildByName(itemNodeList[i]).getChildByName("line1")
                if(index == i){
                    select.setVisible(true)
                    normal.setVisible(false)
                    line.setVisible(true)
                    itemLine.setVisible(true)
                    self.nodebs.say({key:self.sayKey[i],force:true})
                }else{
                    if(select)
                        select.setVisible(false)
                    normal.setVisible(true)
                    line.setVisible(false)
                    itemLine.setVisible(false)
                }
            }
        }
        var bei_curIndex = 10
        var callFun2 = function(index){
            if(bei_curIndex === index)     return 
            bei_curIndex = index
        
            if(select_beiList[index] == null){
                var name = sprintf("#select_%d.png", beinormal[index])
                var select = new cc.Sprite(name)
                node_bei.beimian.getChildByName(itemNodeList[index]).addChild(select)
                select_beiList[index] = select
            }
            var name = sprintf("#wenzi%d.png", beinormal[index])
            var wenzi = new cc.Sprite(name)
            wenzi_node.removeAllChildren(true)
            wenzi_node.addChild(wenzi)

            for(var i = 0 ; i < 9 ; i++){
                var normal = normal_beiList[i]
                var select = select_beiList[i]
                var itemLine = node_bei[uiList2[i+9]]
                var line = node_bei.beimian.getChildByName(itemNodeList[i]).getChildByName("line1")
                if(index == i){
                    select.setVisible(true)
                    normal.setVisible(false)
                    line.setVisible(true)
                    itemLine.setVisible(true)
                    self.nodebs.say({key:self.sayKey[beinormal[i]-1],force:true})
                }else{
                    if(select)
                        select.setVisible(false)
                    normal.setVisible(true)
                    line.setVisible(false)
                    itemLine.setVisible(false)
                }
            }
        }

        //判断复原
        var againFun = function(index){
            curIndex = 10
            bei_curIndex = 10
            wenzi_node.removeAllChildren(true)
            var wenzi = new cc.Sprite("#see_wenzi2.png")
            wenzi_node.addChild(wenzi)

            for(var i = 0 ; i < 9 ; i++){
                var line1 = node_zheng.zhengmian.getChildByName(itemNodeList[i]).getChildByName("line1")
                if(select_zhengList[i])
                    select_zhengList[i].setVisible(false)
                normal_zhengList[i].setVisible(true)
                line1.setVisible(false)
                node_zheng[uiList[i+9]].setVisible(false)

                var line2 = node_bei.beimian.getChildByName(itemNodeList[i]).getChildByName("line1")
                if(select_beiList[i])
                    select_beiList[i].setVisible(false)
                normal_beiList[i].setVisible(true)
                line2.setVisible(false)
                node_bei[uiList2[i+9]].setVisible(false)
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
                       "see_tip9","see_wzSound_1","see_wzSound_2"
                    ]
        var addList = [
            {sound:res.see_sound1},{sound:res.see_sound2},
            {sound:res.see_sound3},{sound:res.see_sound4},
            {sound:res.see_sound5},{sound:res.see_sound6},
            {sound:res.see_sound7},{sound:res.see_sound8},
            {sound:res.see_sound9},{sound:res.see_wzSound_1},
            {sound:res.see_wzSound_2}
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