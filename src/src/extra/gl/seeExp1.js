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
            "item_blb","item_tjt","item_lz","item_ld","item_sb",
            "box_blb","box_tjt","box_lz","box_ld","box_sb",
            "sp_blb","sp_tjt","sp_lz","sp_ld","sp_sb",
            "box_blb_0","box_tjt_0","box_lz_0","box_ld_0","box_sb_0",
            "showNode"
        ]
        var self = this
        var node = loadNode(res.gl_see1_json,uilist)
        self.inside_node.addChild(node)
        var boxList = ["box_blb","box_tjt","box_lz","box_ld","box_sb"]
        var spList = ["sp_blb","sp_tjt","sp_lz","sp_ld","sp_sb"]
        var wzList = ["wz1","wz2","wz3","wz4","wz5"]
        var box_0_list = ["box_blb_0","box_tjt_0","box_lz_0","box_ld_0","box_sb_0"]
        var addContens = function() {
            for (var i = 0 ; i < 5; i++) {
                addContent({
                    people: self.nodebs,
                    key: uilist[i],
                    sound: res[sprintf("see_sound%d", i+1)]
                })
            }
        }
        addContens()
        self.nodebs.show()
        
        for (var i = 0; i < boxList.length ; i++) {
            node[boxList[i]].setVisible(false)
            node.showNode.getChildByName(wzList[i]).setVisible(false)
            node[box_0_list[i]].setVisible(false)
        }
        
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
        node.spriteAddTouch = function(){
            for (var i = 0; i < box_0_list.length; i++) {
                var judge = node[box_0_list[i]]
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
        var beforeIndex = 20
        var curLocal = 20
        node.showIndex = function(index) {
            if(index == beforeIndex)  return false
            beforeIndex = index
            for (var i = 0; i < 5; i++) {
                var box = node[boxList[i]]
                var judge = node[uilist[i]]
                if (index == i) {
                    self.nodebs.say({key: uilist[index],force: true,})
                    if(box){
                        box.setVisible(true)
                        node[spList[i]].setLocalZOrder(curLocal)
                        box.setLocalZOrder(curLocal)
                        curLocal++
                    }   
                    node.showNode.getChildByName(wzList[i]).setVisible(true)
                    if (judge){
                        judge.getChildByName("select").setVisible(true)
                        judge.getChildByName("normal").setVisible(false)
                    }
                } else {
                    if(box)
                        box.setVisible(false)
                    node.showNode.getChildByName(wzList[i]).setVisible(false)
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