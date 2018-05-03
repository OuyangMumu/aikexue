var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "seeExp1",
    preLayer: "seeLayer",
    ctor: function () {
        this._super();
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var uiList = [
            "node_item1" ,"node_item2" ,"node_item3" ,"node_item4" ,
            "node_item5" ,"node_item6" ,
            "img_pendi" ,"img_pingyuan" ,"img_qiuling" ,"img_xiagu" ,
            "img_gaoyuan" ,"img_shandi" ,
            "dialogBg" ,"dialog" ,"btn_close" ,"btn_result"
        ]
        var imgList = ["img_pendi" ,"img_pingyuan" ,"img_qiuling" ,"img_xiagu" ,
            "img_gaoyuan" ,"img_shandi"]
        var dialogList = [res.dialog_pendi ,res.dialog_pingyuan  ,res.dialog_qiuling ,
            res.dialog_xiagu ,res.dialog_gaoyuan ,res.dialog_shandi]
        var keyList = ["see_sound1" ,"see_sound2" ,"see_sound3" ,"see_sound4" ,
            "see_sound5" ,"see_sound6"]
        var self = this
        var node = loadNode(res.dqbmddx_seeExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show()

        node.btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"result"})
        })

        node.curIndex = 10
        node.curImg = null
        node.createTouch_item = function(){
            for(var i = 0 ; i < 6 ; i++){
                var normal = node[uiList[i]].getChildByName("normal")
                normal.index = i 
                createTouchEvent({
                    item:normal,
                    begin:function(data){
                        var item = data.item 
                        var index = item.index
                        node.callBackFun(index)
                        return true
                    }
                })
            }
        }
        node.createTouch_item()

        node.callBackFun = function(index){
            if(node.curIndex == index)     return
            node.curIndex = index
            for(var i = 0 ; i < 6 ; i++){
                var normal = node[uiList[i]].getChildByName("normal")
                var select = node[uiList[i]].getChildByName("select")
                var img = node[imgList[i]]
                if(index == i){
                    node.curImg = img
                    normal.setVisible(false)
                    select.setVisible(true)
                    img.setVisible(true)
                    node.setItemVisible(img)
                    node.dialog.setTexture(dialogList[i])
                    dialogSetVisible()
                }else{
                    select.setVisible(false)
                    normal.setVisible(true)
                    img.stopAllActions()
                    img.setVisible(false)
                }
            }
        }

        node.btn_close.addClickEventListener(function(){
            dialogSetVisible()
            node[uiList[node.curIndex]].getChildByName("normal").setVisible(true)
            node[uiList[node.curIndex]].getChildByName("select").setVisible(false)
            node.curIndex = 10
            node.curImg.setVisible(false)
        })
        //设置图片的闪动
        node.setItemVisible = function(img){
            var img = img
            var time = 0.3
            img.runAction(cc.sequence(
                cc.delayTime(time),
                cc.callFunc(function(){
                    img.setVisible(false)
                }),
                cc.delayTime(time),
                cc.callFunc(function(){
                    img.setVisible(true)
                }),
                cc.delayTime(time),
                cc.callFunc(function(){
                    img.setVisible(false)
                }),
                cc.callFunc(function(){
                    img.setVisible(true)
                }),
                cc.delayTime(time),
                cc.callFunc(function(){
                    img.setVisible(false)
                }),
                cc.delayTime(time),
                cc.callFunc(function(){
                    img.setVisible(true)
                    node.dialogBg.stopAllActions()
                    node.dialogBg.setPosition(500, 470)
                    node.dialogBg.setOpacity(0)
                    node.dialogBg.runAction(cc.sequence(
                        cc.delayTime(0.2),
                        cc.fadeIn(0.3),
                        cc.callFunc(function(){
                            self.nodebs.say({key:keyList[node.curIndex],force:true})
                        })
                    ))
                })
            ))
        }

        var dialogSetVisible = function(){
            self.nodebs.stopSay()
            node.dialogBg.runAction(cc.sequence(
                cc.fadeOut(0.3),
                cc.callFunc(function(){
                    node.dialogBg.setPositionY(-500)
                })
            ))
        }
        createTouchEvent({
            item:node.dialogBg,
            begin:function(data){
                return true 
            },
            move:function(data){
                var delta = data.delta 
                var item = data.item 
                item.x += delta.x 
                item.y += delta.y
            }
        })

    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)

        var addList = [
            {key:"see_sound1",sound:res.see_sound1},
            {key:"see_sound2",sound:res.see_sound2},
            {key:"see_sound3",sound:res.see_sound3},
            {key:"see_sound4",sound:res.see_sound4},
            {key:"see_sound5",sound:res.see_sound5},
            {key:"see_sound6",sound:res.see_sound6},
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                sound: addList[i].sound,
            })
        }
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.see_result,
            sound: res.see_sound_result,
            id: "result"
        })
    }
})