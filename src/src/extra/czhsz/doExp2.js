var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp2", 
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
                            json: res.czhsz_tableNode2_json,
                            scale: 0.9,
                            //judgeScale: 0.7,
                            downData: {
                                nums: 8,
                                scale: 1.5,
                                bufs: [
                                    [null,res.table_1,res.table_2,res.table_3],
                                    [null,res.table_1,res.table_2,res.table_3],
                                    [null,res.table_1,res.table_2,res.table_3],
                                    [null,res.table_1,res.table_2,res.table_3],
                                    [null,res.table_4,res.table_5,res.table_6],
                                    [null,res.table_4,res.table_5,res.table_6],
                                    [null,res.table_4,res.table_5,res.table_6],
                                    [null,res.table_4,res.table_5,res.table_6]
                                ]
                            },
                        })
                        self.addChild(bg)
                        self.bgg = bg
                   }
                   var bg = self.bgg
                   bg.show()
                }
            }
        })
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("do2_plist")
        //最初1，2 坐标（235,725  460,1400）   
        
        var uiList = ["wall1","wall2","wall3","wall4","btn_up","btn_pause","btn_down",
                    "g","n","line","child","zhizhen","zhizhen2","g_touch","n_touch",
                    "zhixiang_up","zhixiang_down"
            ]
        var node = loadNode(res.czhsz_doExp2_json,uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip4"})
        })
        var btn_result = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
        btn_result.setPosition(100,200)
        self.addChild(btn_result)
        btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"result"})
        })


        var list = [node.g_touch,node.n_touch]
        for(var i = 0 ; i < 2 ; i++){
            var sp = list[i]
            sp.index = i
            createTouchEvent({
                item:sp,
                begin:function(data){
                    var item = data.item
                    if(item.index == 0){
                        if(node.g.isVisible())
                            node.g.setVisible(false)
                        else
                            node.g.setVisible(true)
                    }else{
                        if(node.n.isVisible())
                            node.n.setVisible(false)
                        else
                            node.n.setVisible(true)
                    }
                    return true
                }
            })
        }

        var btnList = [node.btn_up,node.btn_pause,node.btn_down]
        var curIndex = null
        btnList[1].setTouchEnabled(false)
        for(var i = 0 ; i < 3 ; i++){
            btnList[i].index = i
            btnList[i].addClickEventListener(function(selector,type){
                if(!node.judgetouch)    return false
                var btn = selector
                btnList[btn.index].setTouchEnabled(false)
                switch(btn.index){
                    case 0:
                        curIndex = -1
                        wallMove()
                        // btnList[1].setTouchEnabled(true)
                        btnList[2].setTouchEnabled(false)
                        node.zhixiang_up.runAction(aniRepeat())
                        lineFun(6,10)
                        label.setString(inf[0].tip1)
                    break
                    case 1:
                        wallStop()
                        // btnList[0].setTouchEnabled(true)
                        // btnList[2].setTouchEnabled(true)
                        node.judgeStop = true
                        if(curIndex == -1){
                            label.setString(inf[2].tip1)
                            lineFun(1,5)
                        }else{
                            label.setString(inf[2].tip2)
                            lineFun(6,10)
                        }
                    break
                    case 2:
                        curIndex = 1
                        wallMove()
                        //btnList[1].setTouchEnabled(true)
                        btnList[0].setTouchEnabled(false)
                        node.zhixiang_down.runAction(aniRepeat())
                        lineFun(1,5)
                        label.setString(inf[1].tip1)
                    break
                }

                lin_fun(btn.index)
            })
        }

        var lineFun = function(i,j){
            node.line.runAction(cc.sequence(
                ani("nLine%02d.png",i,j,0.06),
                cc.delayTime(0.4),
                aniRever("nLine%02d.png",i,j,0.06)
            ))
        }

        node.judgetouch = true
        node.judgeStop = false
        var lin_fun = function(index){
            node.judgetouch = false
            if(node.judgeStop){
                node.zhizhen.setScaleX(-curIndex)
                node.zhizhen2.setScaleX(-curIndex)
            }else{
                node.zhizhen.setScaleX(curIndex)
                node.zhizhen2.setScaleX(curIndex)
            }
            node.judgeStop = false
            node.child.runAction(ani("do2_child%02d.png",1,4,0.15))
            zhizhenFun(index)
        }

        var label = new cc.LabelTTF("","",25)
        self.addChild(label)
        label.setPosition(110,350)
        var zhizhenFun = function(index){
            node.zhizhen.runAction(cc.sequence(
                ani("do2_zhizhen%02d.png",1,5,0.07),
                cc.delayTime(0.4),
                aniRever("do2_zhizhen%02d.png",1,5,0.07),
                cc.delayTime(0.2),
                cc.callFunc(function(){
                    node.judgetouch = true
                    switch(index){
                        case 0:
                            label.setString(inf[0].tip2)
                            btnList[1].setTouchEnabled(true)
                        break
                        case 1:
                            label.setString("")
                            btnList[0].setTouchEnabled(true)
                            btnList[2].setTouchEnabled(true)
                            if(curIndex == -1){
                                node.zhixiang_up.stopAllActions()
                                node.zhixiang_up.setSpriteFrame("zhixiang01.png")
                            }else{
                                node.zhixiang_down.stopAllActions()
                                node.zhixiang_down.setSpriteFrame("zhixiang01.png")
                            }
                        break
                        case 2:
                            label.setString(inf[1].tip2)
                            btnList[1].setTouchEnabled(true)
                        break
                    }
                })
            ))
            node.zhizhen2.runAction(cc.sequence(
                ani("do2_zhizhen%02d.png",1,5,0.07),
                cc.delayTime(0.4),
                aniRever("do2_zhizhen%02d.png",1,5,0.07)
            ))
        }

        var aniRepeat = function(){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:"zhixiang%02d.png",
                end: 32,
                time: 0.02
            })))
        }

        var ani = function(frame,start,end,time){
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
            }))
        }

        var aniRever = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
                rever:true
            }))
        }

        var wallMove = function(){
            removeTimer("key")
            addTimer({
                fun:function(){
                    wallJudge()
                },
                time: 0.001,
                repeat: 999999999999999,
                key: "key"
            })
        }

        var wallStop = function(){
            removeTimer("key")
            addTimer({
                fun:function(){
                    wallJudge()
                },
                time: 0.008,
                repeat: 130,
                key: "key"
            })
        }

        var wallJudge = function(){
            node.wall1.y += 0.5 * curIndex
            node.wall2.y += 0.5 * curIndex
            node.wall3.y += 0.5 * curIndex
            node.wall4.y += 0.5 * curIndex
            if(curIndex == 1){
                if(node.wall1.y > 1400){
                    node.wall1.y = -468
                    node.wall3.y = -468
                }else if(node.wall2.y > 1400){
                    node.wall2.y = -468
                    node.wall4.y = -468
                }
            }else{
                if(node.wall1.y < -468){
                    node.wall1.y = 1400
                    node.wall3.y = 1400
                }else if(node.wall2.y < -468){
                    node.wall2.y = 1400
                    node.wall4.y = 1400
                }
            }         
        }

        var inf = [
            {
                tip1:"      加速上升，\n支持力大于重力。",
                tip2:"      匀速上升，\n支持力等于重力。"
            },{
                tip1:"      加速下降，\n支持力小于重力。",
                tip2:"      匀速下降，\n支持力等于重力。"
            },{
                tip1:"      减速上升，\n支持力小于重力。",
                tip2:"      减速下降，\n支持力大于重力。"
            }
        ] 
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do_tip4",img:res.do_tip2,sound:res.do_sound4},
        ]
        this.addList = addList
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
        addContent({
                people: this.nodebs,
                key: "result",
                img: res.do_tip3,
                sound: res.do_sound5,
                id: "result"
            })
    },
})