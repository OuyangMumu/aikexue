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
        self.initPageBtns([{
            btn: [res.learn_btn1_normal, res.learn_btn1_select,res.learn_btn1_act],
            modify: cc.p(20, 3),
            createFun: function(){
                var uiList = ["panel1","panel2","panel3","panel4","learn_1","learn_2"]
                var node = loadNode(res.wtdysyxr_learnLayer_json,uiList)
                node.curIndex = 1
                var curImg = null
                //cc.p(570,320) cc.p(565,313)
                for(var i = 0 ; i < 4 ; i++){
                    var panel = node[uiList[i]]
                    panel.index = i
                    createTouchEvent({
                        item:panel,
                        begin:function(data){
                            var item = data.item
                            var index = item.index
                            for(var i = 0 ; i < 4 ; i++){
                                if(index == i){
                                    node[uiList[i]].setVisible(true)
                                    createImg(index)
                                }else{
                                    node[uiList[i]].setVisible(false)
                                }
                            }
                            return true 
                        }
                    })
                }

                var btn = new ccui.Button(res.btn_next_normal,res.btn_next_select)
                btn.setPosition(820, 520)
                node.addChild(btn)
                btn.addClickEventListener(function(){
                    call()
                    if(node.curIndex == 1){
                        btn.loadTextures(res.btn_next_select, res.btn_next_normal)
                        node.curIndex = 2
                        node.learn_2.setPositionY(313)
                        node.learn_1.setPositionY(-320)
                    }else{
                        btn.loadTextures(res.btn_next_normal, res.btn_next_select)
                        node.curIndex = 1
                        node.learn_2.setPositionY(-313)
                        node.learn_1.setPositionY(320)
                    }
                    
                })
                
                var call = function(){
                    if(curImg){
                        curImg.removeFromParent()
                        curImg = null
                    }
                    for(var i = 0 ; i < 4 ; i++){
                        node[uiList[i]].setVisible(false)
                    }
                }
                var imgList = [res.learn_img_1,res.learn_img_2,res.learn_img_3,res.learn_img_4,
                            res.learn_img_5,res.learn_img_6,res.learn_img_7,res.learn_img_8]
                
                var createImg = function(id){
                    var index = id
                    if(node.curIndex == 2)
                        index = 4 + id
                    if(curImg){
                        curImg.removeFromParent()
                        curImg = null
                    }
                    curImg = new cc.Sprite(imgList[index])
                    curImg.setPosition(568,320)
                    node.addChild(curImg)
                    curImg.btn = new ccui.Button(res.learn_close1,res.learn_close2)
                    curImg.btn.setPosition(600,430)
                    curImg.addChild(curImg.btn)
                    curImg.setScale(0)
                    curImg.runAction(cc.scaleTo(0.4,1))
                    curImg.btn.addClickEventListener(function(){
                        curImg.removeFromParent()
                        curImg = null
                    })

                }

                return node
            }
        },{
            btn: [res.learn_btn2_normal, res.learn_btn2_select,res.learn_btn2_act],
            modify: cc.p(-10, 3),
            pics: [res.study_1,res.study_2,res.study_3],
            scales: [0.9,0.95,0.95]
        }])
        return true
    },
})