//@author mu @14/5/10
var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super()
        this.learnCtor()
        var self = this
        self.img_title.loadTexture(res.studytip)
        self.img_title.setContentSize(getSize(res.studytip))
        self.img_page.setVisible(false)

        var uiName = []
        for (var i = 0; i < 10; i++) {
            if(i<=4){
                uiName[i] = sprintf("touch%d",i+1) 
            }else{
                uiName[i] = sprintf("word%d",i-4)
            }
        }
        var node = loadNode(res.learnJson,uiName)
        node.setPosition(getMiddle(120,-20))
        self.inside_node.addChild(node)

        var touch = true
        for (var i = 0; i < 5; i++) {
            node[uiName[i]].word = node[uiName[i+5]]
            createTouchEvent({
                item:node[uiName[i]],
                begin:function(data){
                    var item = data.item
                    if(touch){
                        touch = false
                        item.setVisible(true)
                        for (var i = 5; i < 10; i++) {
                            node[uiName[i]].setVisible(false)
                        }
                        item.word.setVisible(true)

                    }
                    return true
                },
                end:function(data){
                    var item = data.item
                    touch = true
                    item.setVisible(false)
                }
           }) 
        }
       
        return true
    }
})

