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
            "item_ps","item_jq","item_pk","item_dz",
            "item_wp","item_np","item_dyc","item_wg",
            "ps_box","jq_box","pk_box","dz_box",
            "wp_box","np_box","dyc_box","wg_box",
        ]
        var self = this
        var node = loadNode(res.bwb_see1_json, uilist)
        self.inside_node.addChild(node)
        var addContens = function() {
            for (var i = 0 ; i < 9; i++) {
                addContent({
                    people: self.nodebs,
                    key: uilist[i],
                    sound: res[sprintf("see1_sound%d", i)]
                })
            }
        }
        addContens()
        self.nodebs.say({key: uilist[0],force: true,})
        
        for (var i = 8; i < uilist.length ; i++) {
            node[uilist[i]].setVisible(false)
        }
        
        node.addTouch = function(){
            for (var i = 0; i < 8; i++) {
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
            for (var i = 8; i < uilist.length; i++) {
                var judge = node[uilist[i]]
                judge.setVisible(false)
                judge.index = i - 8
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
            for (var i = 0; i < 8; i++) {
                var box = node[uilist[i+8]]
                var judge = node[uilist[i]]
                if (index == i) {
                    self.nodebs.say({key: uilist[index+1],force: true,})
                    if(box)
                        box.setVisible(true)
                    if (judge) {
                        judge.getChildByName("select").setVisible(true)
                        judge.getChildByName("normal").setVisible(false)
                    }
                } else {
                    if(box)
                        box.setVisible(false)
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