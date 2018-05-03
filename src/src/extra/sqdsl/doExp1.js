var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super()
        var self = this
        this.expCtor({
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    if (!self.bgg) {
                        var bg = createBiaoge({
                            json: res.sqdsl_tableNode_json,
                            scale: 0.9,
                            inputNum: 6,
                        })

                        //获取各个对象
                        var uiList = ["img_judge_1","img_judge_2","img_judge_3",
                                    "img_judge_4","img_judge_5","img_judge_6",
                                    "img_judge_7","img_judge_8","img_judge_9",
                                    "img_gou_1","img_gou_2","img_gou_3"
                        ]
                        for (var i = 0; i < uiList.length; i++) {
                            bg[uiList[i]] = seekWidgetByName(bg, uiList[i])
                        }

                        for(var i = 0 ; i < 9 ; i++){
                            var sp = bg[uiList[i]]
                            sp.index = i
                            createTouchEvent({
                                item:sp,
                                begin:function(data){
                                    var item = data.item
                                    var index = item.index
                                    var pos = item.getPosition()
                                    if(index < 3){
                                        bg.img_gou_1.setVisible(true)
                                        bg.img_gou_1.setPosition(pos)
                                    }else if(index > 5){
                                        bg.img_gou_3.setVisible(true)
                                        bg.img_gou_3.setPosition(pos)
                                    }else{
                                        bg.img_gou_2.setVisible(true)
                                        bg.img_gou_2.setPosition(pos)
                                    }
                                    return true
                                }
                            })
                        }
                        bg.ClearFun = function(){
                            for(var i = 0 ; i < 3 ; i++){
                                bg[uiList[i+9]].setVisible(false)
                            }
                        }

                        self.addChild(bg)
                        self.bgg = bg
                   }
                   var bg = self.bgg
                   bg.show()
                }
            }
        })
        //this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("do_plist")
        var uiList = [
            "kaiguan","btn_big","btn_small","zhishi","paper","kedu",
            "bigKedu","light","wind","zhishi_2","light_2","kaiguan_2"
        ]

        var node = loadNode(res.sqdsl_doExp1_json, uiList)
        self.inside_node.addChild(node)

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var str = "1.读取三种模型下弹簧测力计的示数，\n     将其填入表格\n2.打开吹风机，再次读取示数，观察\n     三种模型的运动情况\n3.调节风速，读取不同风速下测力计\n    的示数，并填入表格"
        var label = new cc.LabelTTF(str,"Arial",22)
        label.setPosition(950,100)
        self.addChild(label)
        label.setColor(cc.color(255,255,0))

        node.paper.setLocalZOrder(-1)
        var rotaList = [-85,-50,0,40,90,130,175]  //0-6
        var curNum = 2
        for(var i = 0 ; i < 3 ; i++){
            var sp = node[uiList[i]]
            sp.index = i
            sp.judge = true
            createTouchEvent({
                item:sp,
                begin:function(data){
                    var index = data.item.index
                    var item = data.item
                    switch(index){
                        case 0:
                            if(item.judge){//打开
                                item.judge = false 
                                item.setSpriteFrame("btn_open.png")
                                node.light.setSpriteFrame("light2.png")
                                node.kaiguan_2.setSpriteFrame("btn_open.png")
                                node.light_2.setSpriteFrame("light2.png")
                                node.wind.setVisible(true)
                                node.paper.runAction(cc.repeatForever(cc.sequence(
                                    cc.moveTo(0.1,7,-5.5),
                                    cc.moveTo(0.1,7,-7)
                                )))
                                windFun()
                            }else{//关闭
                                item.judge = true
                                item.setSpriteFrame("btn_close.png")
                                node.light.setSpriteFrame("light1.png")
                                node.kaiguan_2.setSpriteFrame("btn_close.png")
                                node.light_2.setSpriteFrame("light1.png")
                                node.wind.stopAllActions()
                                node.wind.setVisible(false)
                                node.paper.stopAllActions()
                                change(2)//刻度回复到原始值
                            }
                        break
                        case 1:
                            if(curNum > 0 && curNum <= 6){
                                cc.audioEngine.playMusic(res.do_sound)
                                curNum--
                                node.zhishi.setRotation(rotaList[curNum])
                                node.zhishi_2.setRotation(rotaList[curNum])
                                windFun()
                            }
                        break
                        case 2:
                            if(curNum >= 0 && curNum < 6){
                                cc.audioEngine.playMusic(res.do_sound)
                                curNum++
                                node.zhishi.setRotation(rotaList[curNum])
                                node.zhishi_2.setRotation(rotaList[curNum])
                                windFun()
                            }
                        break
                    }
                    return true 
                },
            })
        }

        var normal = []
        var select = []
        var curIndex = 0

        for(var i = 0 ; i < 3 ; i++){
            var img = sprintf("#model_%d.png",2*i+1)
            var sp = createSp(img,cc.p(1010,450-100*i),self)
            sp.index = i 
            normal[i] = sp 
            var img2 = sprintf("#model_%d.png",2*i+2,self)
            select[i] = createSp(img2,cc.p(1010,450-100*i),self)
            if(i != 0)
                select[i].setVisible(false)

            createTouchEvent({
                item:sp,
                begin:function(data){
                    var index = data.item.index
                    if(curIndex == index)   return false
                    curIndex = index
                    if(!node.kaiguan.judge)
                        judgeKedu()
                    for(var j = 0 ; j < 3 ; j++){
                        if(index == j){
                            select[j].setVisible(true)
                            node.paper.setSpriteFrame(sprintf("paper%d.png",j+1))
                        }else{
                            select[j].setVisible(false)
                        }
                    }
                    return true
                }
            })
        }
        
        var judgeKedu = function(){
            var n = 0
            switch(curIndex){
                case 0:
                    n = 0.6 + curNum * 0.2
                break
                case 1:
                    n = 2
                break
                case 2:
                    n = 3.5 - curNum * 0.2
                break
            }

            //传递刻度示数
            change(n)
        }

        var change = function(n){
            var posy = -36 * n + 135
            node.bigKedu.stopAllActions()
            node.bigKedu.runAction(cc.moveTo(0.2,111,posy))
            var posy2 = -7.5 * n + 308
            node.kedu.stopAllActions()
            node.kedu.runAction(cc.moveTo(0.2,562,posy2))
        }

        var windFun = function(){
            if(!node.wind.isVisible())      return false
            node.wind.stopAllActions()
            node.wind.runAction(aniRepeat("wind%02d.png",1,7,0.05+0.04*curNum))
            judgeKedu()
        }
        var aniRepeat = function(frame,start,end,time){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:frame,
                start: start,
                end: end,
                time: time
            })))
        }

        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time
            }))
        }
    }
})