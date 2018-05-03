/**
 * Created by Administrator on 2016/7/5.
 */
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
        var uilist = [
            "item_one", "item_two", "item_three", "item_four", "item_five", "showNode"
        ]
        var mapping = [
            "show1", "show2", "show3", "show4", "show5", "show6"
        ]
        var self = this
        var node = loadNode(res.zydpsw_see1_json, uilist)
        self.inside_node.addChild(node)

        var addContens = function() {
            for (var i = 0; i < mapping.length; i++) {
                addContent({
                    people: self.nodebs,
                    key: mapping[i],
                    sound: res[sprintf("see_sound%d", i + 1)]
                })
            }
        }
        addContens()
        self.nodebs.show(function() {
            self.nodebs.say({
                key: mapping[0],
                force:true
            })
        })
        node.addTouch = function(){
            for (var i = 0; i < 5; i++) {
                var item = node[uilist[i]]
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
        var beforeIndex = 10
        node.showIndex = function(index) {
            var show = node.showNode
            if(index == beforeIndex)  return false
            beforeIndex = index
            for (var i = 0; i < 5; i++) {
                var child = show.getChildByName(mapping[i+1])
                var judge = node[uilist[i]]
                if(child){
                    if (index == i) {
                        self.nodebs.say({
                            key: mapping[index+1],
                            force: true,
                        })
                        child.setVisible(true)
                        if (judge) {
                            judge.getChildByName("select").setVisible(true)
                            judge.getChildByName("normal").setVisible(false)
                        }
                    } else {
                        child.setVisible(false)
                        if (judge) {
                            judge.getChildByName("select").setVisible(false)
                            judge.getChildByName("normal").setVisible(true)
                        }
                    }
                }
            }
            if(show.getChildByName(mapping[0]).isVisible())
                show.getChildByName(mapping[0]).setVisible(false)
        }
        node.addTouch()
    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1030, 130)
        })
        this.addChild(this.nodebs);
    },
})