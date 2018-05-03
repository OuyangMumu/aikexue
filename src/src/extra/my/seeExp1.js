/**
 * Created by Administrator on 2016/6/21.
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
            "zui","tou","xiong","fu","chu","yan","zu",
            "item_zui","item_tou","item_xiong","item_fu",
            "item_chu","item_yan","item_zu","showNode","node_line"
        ]
        var mapping = [
            "wenzi1", "wenzi2", "wenzi3", "wenzi4",
            "wenzi5", "wenzi6", "wenzi7","wenzi8"
        ]
        var judgeList = [
            null,"item_zui","item_tou","item_xiong",
            "item_fu", "item_chu","item_yan","item_zu"
        ]
        var link = [
            null,"linezui","linetou","linexiong",
            "linefu","linechu","lineyan","linezu"
        ]
        var self = this
        var node = loadNode(res.my_see1_json, uilist)
        self.inside_node.addChild(node)
        var linewenziFalse = function(){
            for(var i=0;i<7;i++){
                node.node_line.getChildByName(link[i+1]).setVisible(false)
                node[judgeList[i+1]].getChildByName("select").setVisible(false)
            }
        }
        linewenziFalse()
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
            for (var i = 0; i < judgeList.length; i++) {
                var item = node[judgeList[i]]
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
            for (var i = 0; i < 7; i++) {
                var judge = node[uilist[i]]
                judge.index = i+1
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
        var beforeIndex = 10
        node.showIndex = function(index) {
            var show = node.showNode
            var line = node.node_line
            if(index == beforeIndex)  return false
            beforeIndex = index
            for (var i = 0; i < mapping.length; i++) {
                var child = show.getChildByName(mapping[i])
                //var lineChild = node[line[i]]
                if(link[i])
                    var lineChild = line.getChildByName(link[i])
                var judge = node[judgeList[i]]
                show.getChildByName("wenzi1").setVisible(false)
                if(lineChild){
                    if (index == i) {
                        self.nodebs.say({
                            key: mapping[index],
                            force: true,
                        })
                        child.setVisible(true)
                        if(lineChild)
                            lineChild.setVisible(true)
                        if (judge) {
                            judge.getChildByName("select").setVisible(true)
                            judge.getChildByName("normal").setVisible(false)
                        }
                    } else {
                        child.setVisible(false)
                        if(lineChild)
                            lineChild.setVisible(false)
                        if (judge) {
                            judge.getChildByName("select").setVisible(false)
                            judge.getChildByName("normal").setVisible(true)
                        }
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
        this.addChild(this.nodebs);
    },
})