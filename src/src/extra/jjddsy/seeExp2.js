var seeExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "seeExp2", 
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
        loadPlist("huoyan_plist")
        var uiList = [
            "judge_1","judge_2","judge_3",

            "normal_1","normal_2","normal_3",

            "select_1","select_2","select_3",
            ]
        var node = loadNode(res.jjddsy_seeExp2_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"see2_tip0"})
        })

        var ani = function(frame) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: 1,
                end: 12,
                time:0.1,
            }))
        }
        var aniRever = function(frame) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: 1,
                end: 12,
                time:0.1,
                rever:true
            }))
        }

        node[uiList[0]].runAction(cc.repeatForever(cc.sequence(
            ani("waiyan%02d.png"),
            aniRever("waiyan%02d.png")
        )))
        node[uiList[1]].runAction(cc.repeatForever(cc.sequence(
            ani("neiyan%02d.png"),
            aniRever("neiyan%02d.png")
        )))
        node[uiList[2]].runAction(cc.repeatForever(cc.sequence(
            ani("yanxin%02d.png"),
            aniRever("yanxin%02d.png")
        )))
        node.curIndex = 10
        for(var i = 0 ; i < 3 ; i++){
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

            var normal = node[uiList[3+i]]
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
            for(var i = 0 ; i < 3 ; i++){
                var normal = node[uiList[3+i]]
                var select = node[uiList[6+i]]
                //var show = node[uiList[i]]
                if(index == i){
                    normal.setVisible(false)
                    select.setVisible(true)
                    //show.setVisible(true)
                    self.nodebs.say({key:self.sayKey[i],force:true})
                }else{
                    normal.setVisible(true)
                    select.setVisible(false)
                    //show.setVisible(false)
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
        this.sayKey = ["see2_tip1","see2_tip2","see2_tip3",
                       "see2_tip0",
                    ]
        var addList = [
            {sound:res.see2_sound1},
            {sound:res.see2_sound2},
            {sound:res.see2_sound3},
            {sound:res.see2_sound0},
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