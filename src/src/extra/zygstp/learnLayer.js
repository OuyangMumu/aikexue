var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        this.load()
        var self = this
        this.img_title.setVisible(false)
        this.img_page.setVisible(false)
        var uiList = ["study_1","study_2","study_3","btn_extend_1","btn_extend_2","learn_title"]
        var node = loadNode(res.zygstp_learnLayer_json,uiList)
        node.setPosition(0,0)
        self.inside_node.addChild(node)
        safeAdd(self, node.learn_title)
        node.btn_extend_1.addClickEventListener(function(){
            node.study_1.setPositionY(-600)
            node.study_2.setPosition(570,300)
            node.study_3.setPositionY(-600)
        })
        node.btn_extend_2.addClickEventListener(function(){
            node.study_1.setPositionY(-600)
            node.study_2.setPositionY(-600)
            node.study_3.setPosition(570,300)
        })
        node.study_2.getChildren()[0].addClickEventListener(function(){
            node.study_1.setPosition(570,300)
            node.study_2.setPositionY(-600)
            cc.log(node.study_1.getPosition(),node.getPosition())
        })
        node.study_3.getChildren()[0].addClickEventListener(function(){
            node.study_1.setPosition(570,300)
            node.study_3.setPositionY(-600)
        })

        return true
    },
})