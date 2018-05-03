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
        var uiList = [
            "judge_1","judge_2","judge_3","judge_4","judge_5",
            "judge_6","judge_7","judge_8","judge_9","judge_10",
            "judge_11","judge_12","judge_13","judge_14","judge_15",
            //14
            "show_1","show_2","show_3","show_4","show_5",
            "show_6","show_7","show_8","show_9","show_10",
            "show_11","show_12","show_13","show_14","show_15",

            "wenzi_0","seebg"
        ]
        var node = loadNode(res.hc_seeExp1_json, uiList)
        self.inside_node.addChild(node)

        loadPlist("wenzi_plist")
        var createSp = function(res,pos,father){
            var sp = new cc.Sprite(res)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var posList = [cc.p(-15,310),cc.p(100,250),cc.p(205,245),cc.p(325,255),cc.p(437,258),
                    cc.p(550,210),cc.p(-75,208),cc.p(-72,124),cc.p(-71,56),cc.p(-14,-15),
                    cc.p(115,-62),cc.p(225,-60),cc.p(390,-55),cc.p(500,-11),cc.p(565,62),
        ]

        var normalList = []
        var selectList = []
        var wenziList = []
        for(var i = 0 ; i < 15 ; i++){
            wenziList[i] = null
            var name = sprintf("#normal_%d.png", i+1)
            normalList[i] = createSp(name,posList[i],node.seebg)
            wenziList[i] = null
        }

        var bigImg = createSp("#bigImg_1.png",cc.p(0,-600),node.seebg)
        bigImg.setAnchorPoint(0,0.12)
        self.nodebs.show(function(){
            self.nodebs.say({
                key:"see1_tip0",
            })
        })
        node.curIndex = 20
        for(var i = 0 ; i < 15 ; i++){
            var judge = node[uiList[i]]
            judge.index = i
            createTouchEvent({
                item:judge,
                begin:function(data){
                    var result = judgeOpInPos(data)//使用像素判定，使得更加精准
                    if(result){
                        var index = data.item.index
                        node.callFun(index)
                    }
                    return result
                },
            })

            var normal = normalList[i]
            normal.index = i
            createTouchEvent({
                item:normal,
                begin:function(data){
                    var index = data.item.index
                    node.callFun(index)
                    return true
                }
            })
        }

        var wenziPos = node.wenzi_0.getPosition()
        node.callFun = function(index){
            if(node.curIndex === index)     return 
            node.curIndex = index
            if(node.wenzi_0.isVisible())
                node.wenzi_0.setVisible(false)
            for(var i = 0 ; i < 15 ; i++){
                var normal = normalList[i]
                var select = selectList[i]
                var wenzi = wenziList[i]
                var show = node[uiList[15+i]]
                if(index == i){
                    normal.setVisible(false)
                    if(!select){
                        var name = sprintf("#select_%d.png", i+1)
                        selectList[i] = createSp(name,normalList[i],node.seebg)
                    }
                    show.setVisible(true)
                    selectList[i].setVisible(true)
                    if(!wenzi){
                        var name = sprintf("#wenzi_%d.png", i+1)
                        wenziList[i] = createSp(name,wenziPos,node.seebg)
                    }
                    wenziList[i].setVisible(true)
                    bigImg.setPositionY(-600)
                    switch(i){
                        case 7: 
                            bigImg.setAnchorPoint(0,0.12) 
                            bigImg.setSpriteFrame("bigImg_1.png")
                            bigImg.setPosition(node[uiList[i]].getPosition())
                        break
                        case 8:  
                            bigImg.setAnchorPoint(0,0.87)
                            bigImg.setSpriteFrame("bigImg_2.png")
                            bigImg.setPosition(node[uiList[i]].getPosition())
                        break
                        case 9:  
                            bigImg.setAnchorPoint(0,0.12)
                            bigImg.setSpriteFrame("bigImg_3.png")
                            bigImg.setPosition(node[uiList[i]].getPosition())
                        break
                    }
                    self.nodebs.say({key:self.sayKey[i],force:true})
                }else{
                    normal.setVisible(true)
                    if(select)
                        select.setVisible(false)
                    if(wenzi)
                        wenzi.setVisible(false)
                    show.setVisible(false)
                }
            }
        }
    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs)
        var self = this
        this.sayKey = [
            "see1_tip1","see1_tip2","see1_tip3","see1_tip4","see1_tip5",
            "see1_tip6","see1_tip7","see1_tip8","see1_tip9","see1_tip10",
            "see1_tip11","see1_tip12","see1_tip13","see1_tip14","see1_tip15","see1_tip0"
        ]
        var addList = [
            {sound:res.see_sound1},{sound:res.see_sound2},{sound:res.see_sound3},
            {sound:res.see_sound4},{sound:res.see_sound5},{sound:res.see_sound6},
            {sound:res.see_sound7},{sound:res.see_sound8},{sound:res.see_sound9},
            {sound:res.see_sound10},{sound:res.see_sound11},{sound:res.see_sound12},
            {sound:res.see_sound13},{sound:res.see_sound14},{sound:res.see_sound15},{sound:res.see_sound0},
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: self.sayKey[i],
                sound: addList[i].sound,
            })
        }
    }
})