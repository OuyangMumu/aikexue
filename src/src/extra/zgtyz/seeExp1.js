var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "seeExp1",
    preLayer: "seeLayer",
    ctor: function () {
        this._super();
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var uiList = [
            "item_1","item_2","item_3","item_4","item_5","item_6",
            "item_7","item_8","item_9","item_10","item_11","item_12",
            "node_wenzi"
        ]
        var self = this
        var node = loadNode(res.zgtyz_seeExp1_json,uiList)
        self.inside_node.addChild(node)
        var addContens = function() {
            for (var i = 0 ; i < uiList.length; i++) {
                addContent({
                    people: self.nodebs,
                    key: uiList[i],
                    sound: res[sprintf("see1_sound%d", i)]
                })
            }
        }
        addContens()
        self.nodebs.show(function() {
            self.nodebs.say({key:uiList[0]})
        })
        
        for (var i = 1; i < 12 ; i++) {
        	var name = "wz_" + (i+1)
            node.node_wenzi.getChildByName(name).setVisible(false)
            node[uiList[i]].getChildByName("select").setVisible(false)
        }
        
        node.addTouch = function(){
            for (var i = 0; i < 12; i++) {
                var item = node[uiList[i]]
                if (item) {
                    var judge = item.getChildByName("normal")
                    judge.index = i
                    createTouchEvent({
                        item: judge,
                        begin: function (data) {
                            var item = data.item
                            node.showIndex(item.index)
                            return true
                        }
                    })
                }
            }
        }
        
        var beforeIndex = 20
        node.showIndex = function(index) {
            if(index == beforeIndex)  return false
            beforeIndex = index
            for (var i = 0; i < 12; i++) {
                var judge = node[uiList[i]]
                if (index == i) {
                    self.nodebs.say({key: uiList[index+1],force: true,})
                    if (judge){
                        judge.getChildByName("select").setVisible(true)
                        judge.getChildByName("normal").setVisible(false)
                        var name = "wz_" + (i+1)
                        node.node_wenzi.getChildByName(name).setVisible(true)
                    }
                } else {
                    if (judge) {
                        judge.getChildByName("select").setVisible(false)
                        judge.getChildByName("normal").setVisible(true)
                        var name = "wz_" + (i+1)
                        node.node_wenzi.getChildByName(name).setVisible(false)
                    }
                }
            }
        }

        node.addTouch()
    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs)
    },
})