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
            "item_ersai","item_erguan","item_tingguan","item_zhentou",
            "ersai","erguan","tingguan","zhentou",
        ]
        var self = this
        var node = loadNode(res.clxt_seeExp1_json, uiList)
        self.inside_node.addChild(node)
        self.nodebs.show()
        node.addContens = function() {
            for (var i = 0 ; i < 4; i++) {
                addContent({
                    people: self.nodebs,
                    key: uiList[i],
                    sound: res[sprintf("see_sound%d", i+1)]
                })
            }
        }
        node.addContens()
        node.addTouch = function(){
            for (var i = 0; i < 4; i++) {
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
        node.spriteAddTouch = function(){
            for (var i = 4; i < uiList.length; i++) {
                var judge = node[uiList[i]]
                judge.index = i - 4
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
        var beforeIndex = 20
        node.showIndex = function(index) {
            if(index == beforeIndex)  return false
            beforeIndex = index
            for (var i = 0; i < 4; i++) {
                var judge = node[uiList[i]]
                if (index == i) {
                    self.nodebs.say({key: uiList[index],force: true})
                    if (judge) {
                        judge.getChildByName("select").setVisible(true)
                        judge.getChildByName("normal").setVisible(false)
                    }
                } else {
                    if (judge) {
                        judge.getChildByName("select").setVisible(false)
                        judge.getChildByName("normal").setVisible(true)
                    }
                }
            }
        }

        node.addTouch()
        node.spriteAddTouch()
    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs)
    },

})