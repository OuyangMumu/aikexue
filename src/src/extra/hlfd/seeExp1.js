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
        loadPlist("fadian1_plist")
        loadPlist("fadian2_plist")
        var uiList = [
            "judge_1","judge_2","judge_3","judge_4","judge_5",
            "judge_6","judge_7","judge_8","judge_9","judge_10",
            "judge_11","judge_12","judge_13","judge_14",
            //14
            "item_1","item_2","item_3","item_4","item_5",
            "item_6","item_7","item_8","item_9","item_10",
            "item_11","item_12","item_13","item_14",
            //28
            // "normal_1","normal_2","normal_3","normal_4","normal_5",
            // "normal_6","normal_7","normal_8","normal_9","normal_10",
            // "normal_11","normal_12","normal_13","normal_14",
            //28
            "select_1","select_2","select_3","select_4","select_5",
            "select_6","select_7","select_8","select_9","select_10",
            "select_11","select_12","select_13","select_14",
            //42
            // "wenzi_1","wenzi_2","wenzi_3","wenzi_4","wenzi_5",
            // "wenzi_6","wenzi_7","wenzi_8","wenzi_9","wenzi_10",
            // "wenzi_11","wenzi_12","wenzi_13","wenzi_14",

            "wenzi_0","seeBg"
        ]
        var node = loadNode(res.hlfd_seeExp1_json, uiList)
        self.inside_node.addChild(node)
        var createSp = function(res,pos,father){
            var sp = new cc.Sprite(res)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        loadPlist("wenzi_plist")
        var normalList = []
        var wenziList = []
        for(var i = 0 ; i < 14 ; i++){
            wenziList[i] = null
            var name = sprintf("#normal_%d.png", i+1)
            //changeFather({item:node[uiList[28+i]],father:self})
            var pos = node[uiList[28+i]].getPosition()
            normalList[i] = createSp(name,pos,node.seeBg)
        }
        //changeFather({item:node.wenzi_0,father:self})

        var btn_play = new ccui.Button(res.btn_play_select,res.btn_stop_select)
        self.addChild(btn_play)
        btn_play.setPosition(70,450)
        btn_play.setScale(0.7)
        var play = false
        btn_play.addClickEventListener(function(){
            if(!play){
                btn_play.loadTextures(res.btn_stop_select, res.btn_play_select)
                play = true
                if(!self.palyImg){
                    self.playImg = new cc.Sprite("#fadian01.png")
                    self.addChild(self.playImg)
                }
                node.seeBg.setPositionY(-1000)
                self.playImg.setPosition(540,385)
                self.playImg.runAction(aniRepeat())
            }else{
                btn_play.loadTextures(res.btn_play_select,res.btn_stop_select)
                play = false
                self.playImg.setPositionY(-1000)
                node.seeBg.setPositionY(310)
                self.playImg.stopAllActions()
                self.playImg.setSpriteFrame("fadian01.png")
            }
        })

        var aniRepeat = function(){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame: "fadian%02d.png",
                start:1,
                end: 12,
                time: 0.15,
            })))
        }

        self.nodebs.show(function(){
            self.nodebs.say({
                key:"see1_tip0",
                fun:function(){
                    self.nodebs.say({key:"see1_tip15"})
                }
            })
        })
        node.curIndex = 20
        for(var i = 0 ; i < 14 ; i++){
            var item = node[uiList[14+i]]
            item.index = i
            createTouchEvent({
                item:item,
                begin:function(data){
                    var result = judgeOpInPos(data)//使用像素判定，使得更加精准
                    if(result){
                        var index = data.item.index
                        node.callFun(index)
                    }
                    return result
                },
            })

            var normal = normalList[i]//node[uiList[28+i]]
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

        node.callFun = function(index){
            if(node.curIndex === index)     return 
            node.curIndex = index
            if(node.wenzi_0.isVisible())
                node.wenzi_0.setVisible(false)
            for(var i = 0 ; i < 14 ; i++){
                var normal = normalList[i]
                var select = node[uiList[28+i]]
                var wenzi = wenziList[i]
                var show = node[uiList[i]]
                if(index == i){
                    normal.setVisible(false)
                    select.setVisible(true)
                    show.setVisible(true)
                    if(!wenzi){
                        var name = sprintf("#wenzi_%d.png", i+1)
                        wenziList[i] = createSp(name,node.wenzi_0.getPosition(),node.seeBg)
                    }
                    wenziList[i].setVisible(true)
                    self.nodebs.say({key:self.sayKey[i],force:true})
                }else{
                    normal.setVisible(true)
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