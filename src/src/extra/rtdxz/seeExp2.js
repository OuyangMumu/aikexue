var seeExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "seeExp2", 
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
        loadPlist("heart1_plist")
        loadPlist("heart2_plist")
        var self = this
        var uiList = [
            "item_node1", "item_node2", "item_node3", "item_node4", 
            "wenzi1", "wenzi2", "wenzi3", "wenzi4", 
            "heart","wenzi_node"
        ]
        var node = loadNode(res.rtdxz_seeExp2_json, uiList)
        self.inside_node.addChild(node)
        addKey("2")
        
        self.nodebs.show(function(){
            self.nodebs.say({key:self.sayKey[0]})
        })
        var wenziList = [
            "wenzi1","wenzi2","wenzi3","wenzi4",
        ]
        for(var i = 0 ; i < 4 ; i++){
            var normal = node[uiList[i]].getChildByName("normal")
            normal.index = i
            createTouchEvent({
                item:normal,
                begin:function(data){
                    var item = data.item 
                    var index = item.index
                    callFun(index)
                    return true
                }
            })
        }

        var curIndex = 0
        var callFun = function(index){
            if(0 == curIndex && index == 0)
                return 
            curIndex = index
            for(var i = 0 ; i < 4 ; i++){
                var normal = node[uiList[i]].getChildByName("normal")
                var select = node[uiList[i]].getChildByName("select")
                var wenzi = node.wenzi_node.getChildByName(wenziList[i])
                if(index == i){
                    self.nodebs.say({key:self.sayKey[i],force:true})
                    wenzi.setVisible(true)
                    normal.setVisible(false)
                    select.setVisible(true)
                    node.heart.stopAllActions()
                    switch(i){
                        case 0:
                            node.heart.runAction(aniRepeat())
                        break
                        case 1:
                            node.heart.runAction(ani(13,18))
                        break
                        case 2:
                            node.heart.runAction(ani(19,31))
                        break
                        case 3:
                            node.heart.runAction(ani(1,12))
                        break
                    }
                }else{
                    wenzi.setVisible(false)
                    select.setVisible(false)
                    normal.setVisible(true)
                }
            }
        }

        var ani = function(start,end) {
            return cc.sequence(createAnimation({
                frame: "heart%02d.png",
                start: start,
                end: end,
                time:0.15
            }))
        }

        var aniRepeat = function(){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:"heart%02d.png",
                end: 31,
                time: 0.15
            })))
        }

        node.heart.runAction(aniRepeat())

    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs)
        var self = this
        this.sayKey = ["see_tip1","see_tip2","see_tip3","see_tip4"
                    ]
        var addList = [
            {sound:res.see2_sound1},{sound:res.see2_sound2},
            {sound:res.see2_sound3},{sound:res.see2_sound4},
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