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
        loadPlist("luosi_plist")
        var self = this
        var uiList = [
                    "luosi","node1","node2","btn_result","btn_rotate",
                    "judge1","judge2","judge3","judge4",//5
                    "item1","item2","item3","item4", //9
                    "line1","line2","line3","line4"  //13
        ]
        var node = loadNode(res.lzdmm_seeExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show()
        var judge = true
        var curIndex = 0
        for(var i = 0 ; i < 4 ; i++){
            var judge = node[uiList[i+5]]
            judge.index = i
            createTouchEvent({
                item:judge,
                begin:function(data){
                    var item = data.item 
                    var index = item.index
                    var result = judgeOpInPos(data)
                    if(!result)  return false
                    callFun(index)
                    return result
                }
            })
            var normal = node[uiList[13+i]].getChildByName("normal")
            normal.index = i
            createTouchEvent({
                item:normal,
                begin:function(data){
                    var item = data.item 
                    var index = item.index
                    var result = judgeOpInPos(data)
                    if(!result)  return false
                    callFun(index)
                    return result
                }
            })
        }

        var callFun = function(index){
            if(!judge)  return false
            if(index < 2 && curIndex == 0){
                for(var i = 0 ; i < 2 ; i++){
                    node[uiList[9+i]].setVisible(false)
                    node[uiList[13+i]].getChildByName("normal").setVisible(true)
                    node[uiList[13+i]].getChildByName("select").setVisible(false)
                }
                node[uiList[9+index]].setVisible(true)
                node[uiList[13+index]].getChildByName("select").setVisible(true)
                node[uiList[13+index]].getChildByName("normal").setVisible(false)
                self.nodebs.say({key:self.sayKey[index],force:true})
            }
            if(index > 1 && curIndex == 1){
                for(var i = 2 ; i < 4 ; i++){
                    node[uiList[9+i]].setVisible(false)
                    node[uiList[13+i]].getChildByName("normal").setVisible(true)
                    node[uiList[13+i]].getChildByName("select").setVisible(false)
                }
                node[uiList[9+index]].setVisible(true)
                node[uiList[13+index]].getChildByName("select").setVisible(true)
                node[uiList[13+index]].getChildByName("normal").setVisible(false)
                self.nodebs.say({key:self.sayKey[index],force:true})
            }
            
        }

        node.btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"result"})
        })

        node.btn_rotate.addClickEventListener(function(){
            if(node.btn_rotate.isVisible()){
                node.node1.setVisible(false)
                node.node2.setVisible(false)
                node.btn_rotate.setVisible(false)
                self.nodebs.stopSay()
                judge = false
                if(curIndex == 0){
                    curIndex = 1
                    node.luosi.runAction(cc.sequence(
                        ani(),
                        cc.callFunc(function(){
                            node.btn_rotate.setVisible(true)
                            node.node2.setVisible(true)
                            judge = true
                        })
                    ))
                }else{
                    curIndex = 0
                    node.luosi.runAction(cc.sequence(
                        aniRever(),
                        cc.callFunc(function(){
                            node.btn_rotate.setVisible(true)
                            node.node1.setVisible(true)
                            judge = true
                        })
                    ))
                }
            }
        })

        var ani = function() {
            return cc.sequence(createAnimation({
                frame: "luosi%02d.png",
                start: 1,
                end: 13,
                time: 0.2,
            }))
        }
        var aniRever = function() {
            return cc.sequence(createAnimation({
                frame: "luosi%02d.png",
                start: 1,
                end: 13,
                time: 0.2,
                rever:true
            }))
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
                    ]
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
        addContent({
            people: this.nodebs,
            key: "result",
            sound: res.see1_sound5,
            img: res.see1_result,
            id:"result"
        })
    }
})