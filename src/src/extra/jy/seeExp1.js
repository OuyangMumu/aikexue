/**
 * Created by Administrator on 2016/6/29.
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
            "weiqi","beiqi","linpian","saigai","yanjing","kou","wei",
            "tunqi","gangmen","qugan","fuqi", "xiongqi", "tou",
            "item_weiqi","item_beiqi","item_linpian","item_saigai","item_yanjing",
            "item_kou","item_wei", "item_tunqi","item_gangmen","item_qugan","item_fuqi",
            "item_xiongqi", "item_tou", "lineNode", "showNode"
        ]
        var mapping = [
            "wenzi1", "wenzi2", "wenzi3", "wenzi4","wenzi5", "wenzi6",
            "wenzi7", "wenzi8","wenzi9","wenzi10", "wenzi11", "wenzi12",
            "wenzi13" ,"wenzi14"
        ]
        var judgeList = [
            "item_weiqi","item_beiqi","item_linpian","item_saigai","item_yanjing",
            "item_kou","item_wei", "item_tunqi","item_gangmen","item_qugan","item_fuqi",
            "item_xiongqi", "item_tou"
        ]
        var link = [
            "line1","line2","line3","line4","line5","line6",
            "line7","line8","line9","line10","line11","line12","line13"
        ]
        var self = this
        var node = loadNode(res.jy_see1_json, uilist)
        self.inside_node.addChild(node)
        var addContens = function() {
            for (var i = 0; i < mapping.length; i++) {
                addContent({
                    people: self.nodebs,
                    key: mapping[i],
                    sound: res[sprintf("see_sound%d", i+1)]
                })
            }
        }
        addContens()
        self.nodebs.show(function() {
            self.nodebs.say({
                key: "start",
                force:true,
                fun:function(){
                    self.nodebs.say({
                        key:mapping[0],
                        force:true,
                    })
                }
            })
        })
        node.addTouch = function(){
            for (var i = 0; i < judgeList.length; i++) {
                var item = node[judgeList[i]]
                if (item) {
                    var judge = item.getChildByName("normal")
                    judge.setScale(0.8)
                    item.getChildByName("select").setScale(0.8)
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
            for (var i = 0; i < 13; i++) {
                var judge = node[uilist[i]]
                judge.setVisible(false)
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
        for(var i=0;i<13;i++){
            node.lineNode.getChildByName(link[i]).setVisible(false)
        }
        var beforeIndex = 20
        node.showIndex = function(index) {
            var show = node.showNode
            var line = node.lineNode
            if(index == beforeIndex)  return false
            beforeIndex = index
            for (var i = 0; i < 13; i++) {
                var child = show.getChildByName(mapping[i+1])
                var box = node.getChildByName(uilist[i])
                if(link[i])
                    var lineChild = line.getChildByName(link[i])
                var judge = node[judgeList[i]]
                show.getChildByName("wenzi1").setVisible(false)
                if(lineChild){
                    if (index == i) {
                        self.nodebs.say({
                            key: mapping[index+1],
                            force: true,
                        })
                        box.setVisible(true)
                        child.setVisible(true)
                        if(lineChild)
                            lineChild.setVisible(true)

                        if (judge) {
                            judge.getChildByName("select").setVisible(true)
                            judge.getChildByName("normal").setVisible(false)
                        }
                    } else {
                        box.setVisible(false)
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
        addContent({
            people: this.nodebs,
            key: "start",
            sound: res.see_sound0
        })
    },
})