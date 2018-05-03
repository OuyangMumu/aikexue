var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        loadPlist("judge_plist")
        var uiList = [
            "box1","box2","box3","box4","box5",
            "box6","box7","box8","box9","box10",
        ]
        var node = loadNode(res.fl_doExp2_json, uiList)
        self.inside_node.addChild(node)

        var rand = getRand(10)
        var judgeList = []
        self.nodebs.show(function(){
            self.nodebs.say({key:"do2_tip1"})
        })

        var btn_result = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
        btn_result.setPosition(1040,420)
        node.addChild(btn_result)
        btn_result.addClickEventListener(function(){
            if(btn_result.isVisible())
                self.nodebs.say({key:"result"})
        })
        btn_result.setVisible(false)
        
        for(var i = 0 ; i < 10 ; i++){
            var img = sprintf("#do2_judge%02d.png", rand[i])
            var judge = new cc.Sprite(img)
            judge.setPosition(150,500 - 50 * i)
            node.addChild(judge)
            judgeList.push(judge)
            judge.posBegin = judge.getPosition()
            judge.index = rand[i]
            node[uiList[i]].index = i
            judge.over = false
            createTouchEvent({
                item:judge,
                begin:function(data){
                    return true
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta 
                    item.x += delta.x 
                    item.y += delta.y
                },
                end:function(data){
                    var item = data.item
                    var index = item.index
                    var pos = data.pos 
                    item.setPosition(item.posBegin)
                    item.over = false
                    for(var i = 0 ; i < uiList.length ; i++){
                        if(judgeInside({item:node[uiList[i]],pos:pos})){
                            if(item.index == node[uiList[i]].index){
                                item.setPosition(node[uiList[i]].x+5,node[uiList[i]].y)
                                item.over = true
                                judgeOver()
                            }else{
                                playMusic(res.zswd_wrong)
                            }
                        }  
                    }
                }
            })
        }

        var judgeOver = function(){
            var over = true 
            for(var j = 0 ; j < uiList.length ; j++){
                if(!judgeList[j].over){
                    over = false
                }
            }
            if(over){
                btn_result.setVisible(true)
                self.nodebs.say({
                    key: "right",
                    force: true,
                })
                AddDialog("Judge", {
                    judge: "right",
                    fun:function(){
                        if(judgeMusic()){
                            stopMusic()
                        }
                    }
                 })
            }
        }

    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs)
        
        addContent({
            people: this.nodebs,
            key: "do2_tip1",
            img: res.do2_tip1,
            sound: res.do2_sound1,
        })
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.do2_tip2,
            sound: res.do2_sound2,
            id: "result",
        })
        
        addContent({
            people: this.nodebs,
            key: "right",
            sound: res.sound_right,
        })
    },
})