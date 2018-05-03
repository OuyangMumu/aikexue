var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() {
        var self = this
        this._super()
        this.expCtor({
            vis: false,
            setZ:99,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun:function(){
                    if(!self.biaoge){
                        var bg = createBiaoge({
                            json: res.hsb_tableNode_json,
                            scale:0.9,
                            inputNum:4,
                            inputKeys:[50,-30,1,self.curTemp],
                        })
                        var text = bg.bg_final.getChildByName("input5")
                        addInput({
                            item:text,
                            size:50,
                            color:cc.color(200,0,7,255),
                        })
                        bg.linkAnswer = function(){
                            text.setStr(self.curTemp)
                        }
                        self.biaoge = bg
                        safeAdd(self, bg)
                    }
                    self.biaoge.show()
                },
            }
        })
        //this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        var string = "注意：\n观察寒暑表的量程和分度值，\n以及寒暑表当前的气温值，\n并将数据填入表格。"
        var label = new cc.LabelTTF(string, "", 28)
        label.setPosition(250,200)
        self.inside_node.addChild(label)
        var uiList = [
            "btn_step1","btn_step2","btn_step3","btn_step4","btn_step5",
            "jieshao_1","jieshao_2","jieshao_3","jieshao_4","jieshao_5",
            "tushi_1","tushi_2","tushi_3","tushi_4","tushi_5",
            "line","dobg","btn_close","btn_use","tushi_line"
        ]
        var node = loadNode(res.hsb_doExp1_json, uiList)
        self.inside_node.addChild(node)

        var rand =  1 + Math.floor(Math.random() * 8) + Math.floor(Math.random() * 10) / 10
        cc.log(rand)
        //公式 y = 68/7*x - 243/7
        if(rand > 8)
            rand = 8.2
        self.curTemp = Math.floor(68 / 7 * rand - 243/7) + 1
        node.line.setScaleY(rand)
        cc.log(self.curTemp)

        node.dobg.setScale(0)
        node[uiList[0]].setBright(false)
        node[uiList[0]].setEnabled(false)
        for(var i = 0 ; i < 5 ; i++){
            var btn = node[uiList[i]]
            btn.index = i 
            btn.addClickEventListener(function(selector,type){
                var curBtn = selector
                for(var i = 0 ; i < 5 ; i ++){
                    if(curBtn.index == i){
                        node[uiList[i]].setBright(false)
                        node[uiList[i]].setEnabled(false)
                        node[uiList[5+i]].setVisible(true)
                        node[uiList[10+i]].setVisible(true)
                    }else{
                        node[uiList[i]].setBright(true)
                        node[uiList[i]].setEnabled(true)
                        node[uiList[5+i]].setVisible(false)
                        node[uiList[10+i]].setVisible(false)
                    }
                    if(curBtn.index == 3){
                        node.tushi_line.setScaleY(1.1)
                        node.tushi_line.stopAllActions()
                        node.tushi_line.runAction(cc.scaleTo(1.5,1,3))
                    }
                }
            })
        }

        createTouchEvent({
            item:node.dobg,
            begin:function(data){
                return true
            },
            move:function(data){
                var item = data.item 
                var delta = data.delta 
                item.x += delta.x 
                item.y += delta.y
            }
        })
        node.judge = true
        node.btn_use.addClickEventListener(function(){
            if(node.judge){
                node.judge = false
                node.dobg.setPosition(568,320)
                node.dobg.stopAllActions()
                node.dobg.runAction(cc.scaleTo(0.5,1))
            }else{
                node.judge = true
                node.dobg.stopAllActions()
                node.dobg.runAction(cc.sequence(
                    cc.scaleTo(0.5,0),
                    cc.callFunc(function(){
                        node.dobg.setPositionY(-1000)
                    })
                ))
            }
        })
        node.btn_close.addClickEventListener(function(){
            node.judge = true
            node.dobg.stopAllActions()
            node.dobg.runAction(cc.sequence(
                    cc.scaleTo(0.5,0),
                    cc.callFunc(function(){
                        node.dobg.setPositionY(-1000)
                    })
                ))
        })
    }
})