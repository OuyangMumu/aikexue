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
        self.img_title.setVisible(false)
        self.initPageBtns([{
            createFun: function(){
                loadPlist("childRun_plist")
                var itemList = ["judgeNode1", "judgeNode2", "judgeNode3", "judgeNode4", "judgeNode5",
                                "item1_img1", "item1_img2", "item1_img3", "item1_img4", "item1_img5",
                                "judgeImgNode", "child_run"
                            ]
                var foodList = ["food_item1", "food_item2", "food_item3", "food_item4", "food_item5", 
                                "food_img1", "food_img2", "food_img3", "food_img4", "food_img5", 
                                "food_kuang"
                            ]
                var uiList = ["item_node","btn_node1","btn_node2","btn_back1","btn_back2",
                            "item_node1","item_node2",

                            "judgeNode1", "judgeNode2", "judgeNode3", "judgeNode4", "judgeNode5",
                            "judgeImgNode", 
                            "item1_img1", "item1_img2", "item1_img3", "item1_img4", "item1_img5",
                            "child_run",

                            "food_item1", "food_item2", "food_item3", "food_item4", "food_item5", 
                            "food_img1", "food_img2", "food_img3", "food_img4", "food_img5", 
                            "food_kuang"
                            ]
                var node = loadNode(res.rndgn_learnLayer_json,uiList)

                for(var i = 0 ; i < 5 ; i++){
                    var normal = node[itemList[i]].getChildByName("normal")
                    normal.index = i
                    createTouchEvent({
                        item:normal,
                        begin:function(data){
                            var item = data.item
                            var index = item.index
                            node1Fun(index)
                            return true 
                        }
                    })
                }

                for(var i = 0 ; i < 5 ; i++){
                    var normal = node[foodList[i]].getChildByName("normal")
                    normal.index = i
                    createTouchEvent({
                        item:normal,
                        begin:function(data){
                            var item = data.item
                            var index = item.index
                            node2Fun(index)
                            return true 
                        }
                    })
                }

                node.judgeCurIndex = 10
                var node1Fun = function(index){
                    if(node.judgeCurIndex == index)         return 
                    node.judgeCurIndex = index
                    for(var i = 0 ; i < 5 ; i++){
                        var normal = node[itemList[i]].getChildByName("normal")
                        var select = node[itemList[i]].getChildByName("select")
                        var img_item = node.judgeImgNode.getChildByName(itemList[i+5])
                        if(i == index){
                            normal.setVisible(false)
                            select.setVisible(true)
                            img_item.setVisible(true)
                            if(i == 2){
                                node.child_run.stopAllActions()
                                node.child_run.runAction(ani_run())
                            }
                        }else{
                            normal.setVisible(true)
                            select.setVisible(false)
                            img_item.setVisible(false)
                            if(i == 2)
                                node.child_run.stopAllActions()
                        }
                    }
                }
                var node2Fun = function(index){
                    for(var i = 0 ; i < 5 ; i++){
                        var normal = node[foodList[i]].getChildByName("normal")
                        var select = node[foodList[i]].getChildByName("select")
                        var img_item = node.food_kuang.getChildByName(foodList[i+5])
                        if(i == index){
                            normal.setVisible(false)
                            select.setVisible(true)
                            img_item.setVisible(true)
                        }else{
                            normal.setVisible(true)
                            select.setVisible(false)
                            img_item.setVisible(false)
                        }
                    }
                }
                
                var reNewFun1 = function(){
                    for(var i = 0 ; i < 5 ; i++){
                        node.judgeImgNode.getChildByName(itemList[i+5]).setVisible(false)
                        node[itemList[i]].getChildByName("normal").setVisible(true)
                        node[itemList[i]].getChildByName("select").setVisible(false)
                    }
                    node.judgeCurIndex = 10
                    node.judgeImgNode.getChildByName(itemList[5]).setVisible(true)
                    node[itemList[0]].getChildByName("normal").setVisible(false)
                    node[itemList[0]].getChildByName("select").setVisible(true)
                }
                var reNewFun2 = function(){
                    for(var i = 0 ; i < 5 ; i++){
                        node.food_kuang.getChildByName(foodList[i+5]).setVisible(false)
                        node[foodList[i]].getChildByName("normal").setVisible(true)
                        node[foodList[i]].getChildByName("select").setVisible(false)
                    }
                    node.food_kuang.getChildByName(foodList[5]).setVisible(true)
                    node[foodList[0]].getChildByName("normal").setVisible(false)
                    node[foodList[0]].getChildByName("select").setVisible(true)
                }
                reNewFun1()
                reNewFun2()

                var ani_run = function(){
                    return cc.repeatForever(createAnimation({
                        frame: "child_run%d.png",
                        end: 7,
                        time: 0.2
                    }))
                }


                node.btn_node1.addClickEventListener(function(){
                    node.item_node.setPositionY(-568)
                    node.item_node1.setPositionY(320)
                    reNewFun1()
                })
                node.btn_node2.addClickEventListener(function(){
                    node.item_node.setPositionY(-568)
                    node.item_node2.setPositionY(320)
                    reNewFun2()
                })
                node.btn_back1.addClickEventListener(function () {
                    node.item_node1.setPositionY(-568)
                    node.item_node.setPositionY(320)
                })
                node.btn_back2.addClickEventListener(function () {
                    node.item_node2.setPositionY(-568)
                    node.item_node.setPositionY(320)
                })

                return node
            }
        }])
        return true
    },
})