var seeExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "seeExp3",
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
            "box_biao","box_gui","item_biao","item_gui","node_wenzi"
        ]
        var self = this
        var node = loadNode(res.zgtyz_seeExp3_json,uiList)
        self.inside_node.addChild(node)
        var addContens = function() {
            for (var i = 0 ; i < 3; i++) {
                addContent({
                    people: self.nodebs,
                    key: uiList[i],
                    sound: res[sprintf("see3_sound%d", i)]
                })
            }
        }
        addContens()
        self.nodebs.show(function() {
            self.nodebs.say({key:uiList[0]})
        })
        
        for (var i = 0; i < 2 ; i++) {
        	var name = "wz_" + (i+2)
            node.node_wenzi.getChildByName(name).setVisible(false)
            node[uiList[i]].setVisible(false)
        }
        
        node.addTouch = function(){
            for (var i = 2; i < 4; i++) {
                var item = node[uiList[i]]
                if (item) {
                    var judge = item.getChildByName("normal")
                    judge.index = i-2
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

        node.spriteAddTouch = function(){
            for (var i = 0; i < 2; i++) {
                var box = node[uiList[i]]
                box.index = i
                createTouchEvent({
                    item: box,
                    begin: function (data) {
                        var item = data.item
                        node.showIndex(item.index)
                        return true
                    }
                })
            }
        }
        node.spriteAddTouch()
        var beforeIndex = 20
        node.showIndex = function(index) {
            if(index == beforeIndex)  return false
            beforeIndex = index
            for (var i = 0; i < 2; i++) {
                var judge = node[uiList[i+2]]
                var box = node[uiList[i]]
                if (index == i) {
                    self.nodebs.say({key: uiList[index+1],force: true,})
                    if (judge){
                        judge.getChildByName("select").setVisible(true)
                        judge.getChildByName("normal").setVisible(false)
                        var name = "wz_" + (i+2)
                        node.node_wenzi.getChildByName(name).setVisible(true)
                    }
                    if(box){
                        box.setVisible(true)
                    }
                } else {
                    if (judge) {
                        judge.getChildByName("select").setVisible(false)
                        judge.getChildByName("normal").setVisible(true)
                        var name = "wz_" + (i+2)
                        node.node_wenzi.getChildByName(name).setVisible(false)
                    }
                    if(box){
                        box.setVisible(false)
                    }
                }
            }
            node.node_wenzi.getChildByName("wz_1").setVisible(false)
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