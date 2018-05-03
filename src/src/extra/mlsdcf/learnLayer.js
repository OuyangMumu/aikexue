//@author mu @16/5/19
var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
        loadPlist("learnPlist")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        this.load()
        var self = this
        var node = loadNode(res.learn_json)
        node.setPosition(getMiddle())
        safeAdd(self.inside_node, node)
        self.img_grass.setVisible(false)
        self.img_page.setVisible(false)
        self.img_title.loadTexture("learn_title.png", ccui.Widget.PLIST_TEXTURE)
        self.img_title.setContentSize(getSize("#learn_title.png"))
        setOff(self.img_title, cc.p(0, 7))
        return true
    },
    dataControl: {},
})