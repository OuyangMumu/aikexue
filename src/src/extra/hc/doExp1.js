var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor({
            vis: false,
            setZ:99,
            settingData: {
                ifCount: true,
                pos: cc.p(1080, 580),
                biaogeFun:function(){
                    if(!self.biaoge){
                        var bg = createBiaoge({
                            json: res.hc_tableNode_json,
                            scale:0.9,
                            inputNum:8,
                        })
                        self.biaoge = bg
                        safeAdd(self, bg)
                    }
                    self.biaoge.show()
                },
            }
        })
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        var uiList = ["body","wing","line_1","line_2","ruler"]
        var node = loadNode(res.hc_doExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })

        var change = function(){
            changeFather({item:node.line_1,father:node.body})
            changeFather({item:node.line_2,father:node.wing})
            var rand = 64 + Math.floor(Math.random() * 16)
            cc.log(rand)
            var myScale = rand / 100
            node.body.setScale(myScale)
            node.wing.setScale(myScale)
            changeFather({item:node.line_1,father:node})
            changeFather({item:node.line_2,father:node})
            node.line_1.setPositionY(340)
            node.line_2.setPositionY(340)
            node.line_1.setScale(1)
            node.line_2.setScale(1)
            safeAdd(node, node.ruler)
        }
        change()

        createTouchEvent({
            item:node.ruler,
            begin:function(data){
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                item.x += delta.x
                item.y += delta.y
            }
        })
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do_tip1",img: res.do_tip1,sound:res.do_sound1},
        ]
        this.addList = addList
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
    },
})