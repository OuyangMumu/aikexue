var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "seeExp1", 
    preLayer: "seeLayer", 
    ctor: function() { 
        this._super()
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("seeItem_plist")
        loadPlist("judge_plist")
        //wenzi 870,370,title 470,520
        var uiList = [
            "normal_1","normal_2","normal_3","normal_4",
            "normal_5","normal_6","normal_7","normal_8",
            "show_1","show_2","show_3","show_4",
            "show_5","show_6","show_7","show_8",
        ]
        var node = loadNode(res.wn_seeExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show()

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        createSp("#wenzi_0.png",cc.p(470,520),self)

        var judgeList = []
        var selectList = []
        var wenziList = []
        for(var i = 0 ; i < 8 ; i++){
            var img = sprintf("#judge_%d.png",i+1)
            judgeList[i] = createSp(img,node[uiList[8+i]].getPosition(),self)
            judgeList[i].setVisible(false)
            if(i == 2)
                judgeList[i].setLocalZOrder(5)
        }

        var bigImg = createSp("#bigImg_2.png",cc.p(0,-500),self)
        bigImg.setLocalZOrder(10)
        node.curIndex = 10
        for(var i = 0 ; i < 8 ; i++){
            var judge = judgeList[i]
            judge.index = i
            createTouchEvent({
                item:judge,
                begin:function(data){
                    var index = data.item.index
                    var item = data.item
                    var pos = data.pos
                    if(judgeOpInPos({item:item,pos:pos})){
                        node.callFun(index)
                        return true
                    }
                    return false
                },
            })

            var normal = node[uiList[i]]
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

        var posList = [cc.p(203,295),cc.p(300,205),cc.p(255,305),cc.p(215,365),cc.p(465,310)]
        node.callFun = function(index){
            if(node.curIndex === index)     return false
            node.curIndex = index

            var img = null
            var pos = null
            switch(index+1){
                case 2:
                    img = "bigImg_2.png"
                    pos = posList[0]
                break
                case 3:
                    img = "bigImg_3.png"
                    pos = posList[1]
                break
                case 4:
                    img = "bigImg_4.png"
                    pos = posList[2]
                break
                case 5:
                    img = "bigImg_5.png"
                    pos = posList[3]
                break
                case 7:
                    img = "bigImg_7.png"
                    pos = posList[4]
                break
            }
            if(img){
                bigImg.setPosition(pos)
                bigImg.setSpriteFrame(img)
            }else{
                bigImg.setPositionY(-500)
            }
            for(var i = 0 ; i < 8 ; i++){
                var normal = node[uiList[i]]
                var select = selectList[i]
                var wenzi = wenziList[i]
                var show = node[uiList[8+i]]
                if(index == i){
                    normal.setVisible(false)
                    show.setVisible(true)
                    if(!select){
                        var img = sprintf("#select_%d.png",i+1)
                        selectList[i] = createSp(img,node[uiList[i]].getPosition(),self)
                    }
                    selectList[i].setVisible(true)
                    if(!wenzi){
                        var img = sprintf("#wenzi_%d.png",i+1)
                        wenziList[i] = createSp(img,cc.p(870,340),self)
                    }
                    wenziList[i].setVisible(true)
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
            "see1_tip6","see1_tip7","see1_tip8"
        ]
        var addList = [
            {sound:res.see_sound1},{sound:res.see_sound2},{sound:res.see_sound3},
            {sound:res.see_sound4},{sound:res.see_sound5},{sound:res.see_sound6},
            {sound:res.see_sound7},{sound:res.see_sound8}
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