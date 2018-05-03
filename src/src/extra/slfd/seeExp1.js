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
        loadPlist("liushui_plist")
        var uiList = [
            "judge_1","judge_2","judge_3","judge_4",
            "judge_5","judge_6","judge_7","judge_8",
            //8
            "item_1","item_2","item_3","item_4",
            "item_5","item_6","item_7","item_8",
            //16
            "normal_1","normal_2","normal_3","normal_4",
            "normal_5","normal_6","normal_7","normal_8",
            //24
            "select_1","select_2","select_3","select_4",
            "select_5","select_6","select_7","select_8",
            
            "liushui1","liushui2","fadian"
        ]
        var node = loadNode(res.slfd_seeExp1_json, uiList)
        self.inside_node.addChild(node)

        var createSp = function(res,pos,father){
            var sp = new cc.Sprite(res)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var btn_play = new ccui.Button(res.btn_play_select,res.btn_stop_select)
        self.addChild(btn_play)
        btn_play.setPosition(70,50)
        btn_play.setScale(0.7)
        var play = false
        var first = true
        var seeWz = null
        var shanguang = null

        btn_play.addClickEventListener(function(){
            if(!play){
                btn_play.loadTextures(res.btn_stop_select, res.btn_play_select)
                play = true
                node.liushui1.resume()
                node.liushui2.resume()
                if(first){
                    seeWz = createSp("#seeWz.png",cc.p(490,47),self)
                    
                    first = false
                    node.liushui1.runAction(cc.sequence(
                        ani("liushui1_%02d.png",2,14),
                        cc.callFunc(function(){
                            shanguang = createSp("#shanguang01.png",cc.p(560,306),self)
                            shanguang.runAction(aniRepeat("shanguang%02d.png",8))
                            node.liushui2.runAction(cc.sequence(
                                ani("liushui2_%02d.png",2,12),
                                cc.callFunc(function(){
                                    createSp("#liushui2_wenzi.png",cc.p(790,350),self)
                                })
                            ))
                        })
                    ))
                }
                seeWz.setVisible(true)
                if(shanguang)
                    shanguang.setVisible(true)
                node.fadian.runAction(aniRepeat("fadian%02d.png",2))
                self.nodebs.say({key:self.sayKey[8],force:true})
            }else{
                btn_play.loadTextures(res.btn_play_select,res.btn_stop_select)
                play = false
                node.liushui1.pause()
                node.liushui2.pause()
                seeWz.setVisible(false)
                node.fadian.stopAllActions()
                self.nodebs.stopSay()
                if(shanguang){
                    shanguang.setVisible(false)
                }
            }
        })

        var ani = function(frame,start,end){
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time: 0.2,
            }))
        }
        var aniRepeat = function(frame,end){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame: frame,
                start: 1,
                end: end,
                time: 0.1,
            })))
        }

        self.nodebs.show()
        node.curIndex = 20
        for(var i = 0 ; i < 8 ; i++){
            var item = node[uiList[i]]
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

            var normal = node[uiList[16+i]]
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
            for(var i = 0 ; i < 8 ; i++){
                var normal = node[uiList[16+i]]
                var select = node[uiList[24+i]]
                var show = node[uiList[8+i]]
                if(index == i){
                    normal.setVisible(false)
                    select.setVisible(true)
                    show.setVisible(true)
                    self.nodebs.say({key:self.sayKey[i],force:true})
                }else{
                    normal.setVisible(true)
                    select.setVisible(false)
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
            "see1_tip6","see1_tip7","see1_tip8","see1_tip9",
        ]
        var addList = [
            {sound:res.see_sound1},{sound:res.see_sound2},{sound:res.see_sound3},
            {sound:res.see_sound4},{sound:res.see_sound5},{sound:res.see_sound6},
            {sound:res.see_sound7},{sound:res.see_sound8},{sound:res.see_sound9},
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