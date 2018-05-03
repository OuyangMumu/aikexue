var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "seeExp1", 
    preLayer: "seeLayer", 
    ctor: function() { 
        this._super();
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
         var uiList = ["item_1","item_2","item_3","img_jianjie","img_jiegou",
                    "img_anzhuang","img_arrow","btn_zhishi_1","btn_zhishi_2",
                    "btn_jiazi","tip1","tip2","tip3","btn_close1","btn_close2",
                    "btn_close3","img_click",
                    "biao_1","biao_2","biao_3","biao_4","biao_5",
                    "wdj_1","wdj_2","wdj_3","wdj_4","cup","wdj_s1","wdj_s2","wdj_s3","wdj_s4","cup_s"
                    ]
        var node = loadNode(res.qwdcl_seeExp1_json,uiList)
        self.inside_node.addChild(node)

        self.nodebs.show()
        var threeBtnList = ["btn_zhishi_1","btn_zhishi_2","btn_jiazi","tip1","tip2","tip3"]
        var threeImgList = ["img_jianjie","img_jiegou","img_anzhuang"]
        var closeList = ["btn_close1","btn_close2","btn_close3"]
        var biaoList = ["biao_1","biao_2","biao_3","biao_4","biao_5"]
        var wdjList = ["wdj_1","wdj_2","wdj_3","wdj_4","cup","wdj_s1","wdj_s2","wdj_s3","wdj_s4","cup_s"]
        var keyList = ["see1_sound1","see1_sound2","see1_sound3","see1_sound4","see1_sound5",]
        var curBtn = 0
        var curLocal = 10
        var curTip = 10  //判断当前提示框是哪一个
        //三个按钮
        for(var i = 0 ; i < 3 ; i++){
            var btn_normal = node[uiList[i]].getChildByName("normal")
            btn_normal.index = i 
            createTouchEvent({
                item:btn_normal,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    if(index == curBtn)   
                        return false
                    for(var j = 0 ; j < 3 ; j++){
                        if(index == j){
                            curBtn = j
                            node[uiList[j]].getChildByName("normal").setVisible(false)
                            node[uiList[j]].getChildByName("select").setVisible(true)
                            node[threeImgList[j]].setPositionY(320)
                            if(j == 1){
                                node[threeImgList[j]].setPositionY(280)
                                node.img_arrow.stopAllActions()
                                node.img_click.setVisible(true)
                                node.img_arrow.setVisible(true)
                                node.img_arrow.runAction(cc.repeatForever(cc.sequence(
                                    cc.moveTo(0.3, 610, 430),
                                    cc.moveTo(0.3, 620, 440)
                                )))
                            }
                            closeFun()
                        }else{
                            node[uiList[j]].getChildByName("normal").setVisible(true)
                            node[uiList[j]].getChildByName("select").setVisible(false)
                            node[threeImgList[j]].setPositionY(-600)
                        }
                    }
                    return true
                }
            })
        }

        var closeFun = function(){
            for(var i = 0 ; i < 3 ; i++){
                showOut(node[threeBtnList[i+3]])
                node[threeBtnList[i]].flag = true
            }
        }
        //结构中的三个介绍按钮
        for(var i = 0 ; i < 3 ; i++){
            node[threeBtnList[i]].index = i
            node[closeList[i]].index = i
            node[threeBtnList[i+3]].index = i
            createTouchEvent({
                item:node[threeBtnList[i+3]],
                begin:function(data){
                    var item = data.item 
                    item.setLocalZOrder(curLocal++)
                    return true
                },
                move:function(data){
                    var item = data.item 
                    var delta = data.delta 
                    item.x += delta.x 
                    item.y += delta.y
                }
            })

            node[threeBtnList[i]].flag = true
            node[threeBtnList[i]].addClickEventListener(function(selector, target){
                if(selector.flag){
                    curTip = selector.index
                    selector.flag = false
                    showIn(node[threeBtnList[selector.index+3]])
                    if(selector.index == 2){
                        node.img_click.setVisible(false)
                        node.img_arrow.setVisible(false)
                        setAllVis()
                    }
                }else{
                    selector.flag = true
                    showOut(node[threeBtnList[selector.index+3]])
                }
            })

            node[closeList[i]].addClickEventListener(function(selector, target){
                node[threeBtnList[selector.index]].flag = true
                showOut(node[threeBtnList[selector.index+3]])
            })
        }
        //百叶箱内的介绍
        var curWdj = 10
        for(var i = 0 ; i < 5 ; i++){
            var normal = node[biaoList[i]].getChildByName("normal")
            normal.index = i
            createTouchEvent({
                item:normal,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    setIndexVis(index)
                    return true 
                },
            })

            
            var wdj = node.tip3.getChildByName(wdjList[i])
            wdj.index = i
            createTouchEvent({
                item:wdj,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    setIndexVis(index)
                    return true 
                },
            })
        }

        var setIndexVis = function(index){
            if(curWdj == index) 
                return false
            for(var i = 0 ; i < 5 ; i++){
                if(i == index){
                    curWdj = index
                    node[biaoList[i]].getChildByName("select").setVisible(true)  
                    node[biaoList[i]].getChildByName("normal").setVisible(false)
                    node[wdjList[i+5]].setVisible(true)
                    self.nodebs.say({key:keyList[i],force:true})
                }else{
                    node[biaoList[i]].getChildByName("select").setVisible(false)  
                    node[biaoList[i]].getChildByName("normal").setVisible(true)
                    node[wdjList[i+5]].setVisible(false)
                }
            }
        }

        var setAllVis = function(){
            curWdj = 10
            for(var i = 0 ; i < 5 ; i++){
                node[biaoList[i]].getChildByName("normal").setVisible(true)
                node[biaoList[i]].getChildByName("select").setVisible(false)
                node[wdjList[i+5]].setVisible(false)
            }
        }

        var boshiSay = function(index){
            if(index == 0){
                self.nodebs.say({key:"see1_tip1",force:true})
            }else if(index == 1){
                self.nodebs.say({key:"see1_tip2",force:true})
            }
        }

        var showOut = function(item){
            if(curTip == item.index)
                self.nodebs.stopSay()
            addShowType({item:item,show:"fadeOut",time:0.5,fun:function(){item.setPositionY(-600)}})
        }
        var showIn = function(item){
            item.setPosition(568,320)
            item.setLocalZOrder(curLocal++)
            addShowType({item:item,show:"fadeIn",time:0.5,fun:function(){
                boshiSay(item.index)
            }})
        }

    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)

        var addList = [
            {key:"see1_tip1",sound:res.see1_sound1},
            {key:"see1_tip2",sound:res.see1_sound2},
            {key:"see1_sound1",sound:res.see1_sound3},
            {key:"see1_sound2",sound:res.see1_sound4},
            {key:"see1_sound3",sound:res.see1_sound5},
            {key:"see1_sound4",sound:res.see1_sound6},
            {key:"see1_sound5",sound:res.see1_sound7},
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                sound: addList[i].sound,
            })
        }
    }
})