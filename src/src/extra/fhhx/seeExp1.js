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
            "item_1","item_2","item_3","item_4",
            "item_5","item_6",

            "judge_1","judge_2","judge_3","judge_4",
            "judge_5","judge_6",

            "wenzi_1","wenzi_2","wenzi_3","wenzi_4",
            "wenzi_5","wenzi_6",

            "item_node1","item_node2","item_node3","item_node4",
            "item_node5","item_node6",

            "change_node1","change_node2","change_node3","change_node4",

            "see_wenzi","body1","body2","fei","qiti",
            "show_xi","show_hu"
            ]
        addKey("1")
        var node = loadNode(res.fhhx_seeExp1_json, uiList)
        self.inside_node.addChild(node)
        addKey("2")

        loadPlist("qiti_plist")
        loadPlist("fei_plist")

        for(var i = 0 ; i < 4 ; i++){
            var change = node[uiList[i+24]].getChildByName("normal")
            change.index = i
            createTouchEvent({
                item:change,
                begin:function(data){
                    var result = judgeOpInPos(data)//使用像素判定，使得更加精准
                    if(result){
                        var index = data.item.index
                        node.feiFun(index)
                    }
                    return result
                },
            })
        }

        node.feiFun = function(index){
            for(var i = 0 ; i < 4 ; i++){
                var normal = node[uiList[i+24]].getChildByName("normal")
                var select = node[uiList[i+24]].getChildByName("select")
                if(index == i){
                    normal.setVisible(false)
                    select.setVisible(true)
                }else{
                    normal.setVisible(true)
                    select.setVisible(false)
                }
            }
            self.nodebs.stopSay()
            node.qiti.stopAllActions()
            node.fei.stopAllActions()
            node.body2.setPosition(550,350)
            node.body1.setPosition(550,-600)
            switch(index){
                case 0:
                node.body1.setPosition(550,350)
                node.body2.setPosition(550,-600)
                break
                case 1:
                node.fei.runAction(ani("fei%02d.png",1,16,0.08))
                node.qiti.runAction(ani("qiti%02d.png",1,18,0.08))
                node.show_xi.setVisible(true)
                node.show_hu.setVisible(false)
                break
                case 2:
                node.fei.runAction(aniRever())
                node.qiti.runAction(ani("qiti%02d.png",19,35,0.08))
                node.show_xi.setVisible(false)
                node.show_hu.setVisible(true)
                break
                case 3:
                node.show_xi.setVisible(true)
                node.show_hu.setVisible(true)
                node.qiti.runAction(cc.repeatForever(cc.sequence(
                    ani("qiti%02d.png",1,18,0.08),
                    ani("qiti%02d.png",19,35,0.08)
                )))
                node.fei.runAction(cc.repeatForever(cc.sequence(
                    ani("fei%02d.png",1,16,0.08),
                    aniRever()
                )))
                break
            }
        }

        self.nodebs.show(function(){
            self.nodebs.say({key:self.sayKey[0]})
        })
        node.curIndex = 10
        for(var i = 0 ; i < 6 ; i++){
            var item = node[uiList[i]]
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

            var normal = node[uiList[18+i]].getChildByName("normal")
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
            if(node.see_wenzi.isVisible())
                node.see_wenzi.setVisible(false)
            for(var i = 0 ; i < 6 ; i++){
                var normal = node[uiList[18+i]].getChildByName("normal")
                var select = node[uiList[18+i]].getChildByName("select")
                var line = node[uiList[6+i]]
                var tip = node[uiList[i+12]]
                if(index == i){
                    normal.setVisible(false)
                    select.setVisible(true)
                    line.setVisible(true)
                    tip.setVisible(true)
                    self.nodebs.say({key:self.sayKey[i+1],force:true})
                }else{
                    normal.setVisible(true)
                    select.setVisible(false)
                    line.setVisible(false)
                    tip.setVisible(false)
                }
            }
        }

        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time
            }))
        }

        var aniRever = function() {
            return cc.sequence(createAnimation({
                frame: "fei%02d.png",
                //start: start,
                end: 16,
                time:0.08,
                rever:true
            }))
        }

        var aniRepeat = function(){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:frame,
                end: 31,
                time: 0.15
            })))
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
            "see_tip0","see_tip1","see_tip2","see_tip3","see_tip4","see_tip5","see_tip6",
        ]
        var addList = [
            {sound:res.see_sound0},
            {sound:res.see_sound1},
            {sound:res.see_sound2},
            {sound:res.see_sound3},
            {sound:res.see_sound4},
            {sound:res.see_sound5},
            {sound:res.see_sound6},
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