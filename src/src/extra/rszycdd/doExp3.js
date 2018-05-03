var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp3",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        var self = this
        this.expCtor({
            setZ:999
        });
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        var uiList = ["line","ban","judgeOver","btn_result"]
        var node = loadNode(res.rszycdd_doExp3_json,uiList)
        self.inside_node.addChild(node)
        self.nodebs.show(function(){
            self.nodebs.say({key:"do3_tip1"})
        })

        node.btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"do3_result"})
        })
        //创建放大镜
        var fdj_sp = new cc.Sprite(res.big_fdj)
        var bigfdj = new cc.ClippingNode(fdj_sp)
        bigfdj.setPosition(800,450)
        bigfdj.setAlphaThreshold(0)
        var bigBiao = new cc.Sprite(res.bigBiao)
        bigfdj.addChild(bigBiao)
        bigBiao.setPosition(0,-120)
        bigBiao.line = new cc.Sprite(res.bigLine)
        bigBiao.line.setAnchorPoint(0.5,0)
        bigBiao.line.setPosition(70,273)
        bigBiao.addChild(bigBiao.line)
        bigBiao.guan = new cc.Sprite(res.bigGuan)
        bigBiao.guan.setPosition(70.6,266)
        bigBiao.addChild(bigBiao.guan)
        self.addChild(bigfdj)
        bigBiao.judgeOver = new cc.Sprite(res.big_judgeOver)
        bigBiao.judgeOver.setPosition(70,400)
        bigBiao.addChild(bigBiao.judgeOver)
        bigBiao.judgeOver.setVisible(false)
        var big_fdj = new cc.Sprite(res.big_fdj)
        self.addChild(big_fdj)
        big_fdj.setScale(1.02)
        big_fdj.setPosition(800,450)

        var jjd = createJJD({
            father:node,
            scale:1,
            dgFlag:true,
            dgPos:cc.p(150, 70),
            pos:cc.p(730,110),
        })
        jjd.judgeFire = false  //判断酒精灯是否点燃
        var curDistance = 30  //当前酒精灯和温度表的距离
        var curTime = 0   //当前时间
        var curTemp = 20  //当前温度
        var changeTemp = 20 //正在改变中的温度值
        var judgeOver = false  //判断温度计是否损坏，损坏将不能继续操作

        jjd.setCallBack({
            fire:function(){
                cc.log("jjd fire")
                jjd.judgeFire = true
                tempUp()
            },
            cutFire:function(){
                cc.log("jjd cut fire")
                jjd.judgeFire = false
                tempDown()
            }
        })

        createTouchEvent({
            item:jjd,
            begin:function(data){
                var item = data.item 
                return true 
            },
            move:function(data){
                var item = data.item 
                var delta = data.delta 
                //直线关系 y = -1/4x + 385   x区间[300,500] y区间[100,250]
                if(item.x +delta.x > 628 && item.x +delta.x < 732 &&
                    item.y + delta.y > 108 && item.y + delta.y < 212){
                    item.x += delta.x
                    item.y = (-1) * item.x + 840
                    judgeCurDis(item)
                }
            },
            end:function(data){
                var item = data.item 
            }
        })

        node.ban.big = true 
        node.ban.small = true 
        createTouchEvent({
            item:node.ban,
            begin:function(data){
                var item = data.item 
                item.setTexture(res.ban2)
                return true 
            },
            move:function(data){
                var item = data.item 
                var delta = data.delta 
                //直线关系 y = 4/3x - 300   x区间[300,500] y区间[100,250]
                if(item.x +delta.x > 298 && item.x +delta.x < 502 &&
                    item.y + delta.y > 98 && item.y + delta.y < 252){
                    item.x += delta.x
                    item.y = 3/4 * item.x - 125

                    if(item.x > 350 && item.big){
                        item.big = false 
                        item.samll = true
                        tempDown()
                    }else if(item.x <= 350 && item.samll){
                        item.big = true
                        item.samll = false
                        tempUp()
                    }
                }
            },
            end:function(data){
                var item = data.item 
                if(item.x < 350){
                    item.setPosition(300, 100)
                    item.setTexture(res.ban)
                    //tempUp()
                }else{
                    item.setPosition(500, 250)
                    //tempDown()
                    //item.setTexture(res.ban2)
                }
            }
        })

        
        var tempUp = function(){
            if(!jjd.judgeFire || judgeOver)
                return
            curTime = 0
            curTemp = changeTemp
            removeTimer("tempDown")
            addTimer({
                fun:function(){
                    curTime++
                    changeTemp = 125 + (curTemp - 125) * (Math.pow(curDistance/30,curTime))
                    cc.log("changeTemp:",changeTemp)
                    setTemperature(changeTemp)
                },
                time:3,
                repeat:1000,
                key:"tempUp"
            })
        }

        var tempDown = function(){
            if(!jjd.judgeFire || judgeOver)
                return
            curTime = 0
            curTemp = changeTemp
            removeTimer("tempUp")
            addTimer({
                fun:function(){
                    curTime++
                    changeTemp = -36 + (curTemp + 36) * (Math.pow(101/105,curTime))
                    setTemperature(changeTemp)
                    cc.log("changeTemp:",changeTemp)
                },
                time:3,
                repeat:1000,
                key:"tempDown"
            })
        }

        var judgeSay = [true,true]
        var setTemperature = function(value){
            var v = (value-20)/10 * 3 * 0.025 + 1.25
            var big_v = (value-20)/10 * 3 * 0.06 + 1
            bigBiao.line.stopAllActions()
            node.line.stopAllActions()
            node.line.runAction(cc.scaleTo(4, 0.8, v))
            bigBiao.line.runAction(cc.scaleTo(4, 1, big_v))
            if(bigBiao.line.getScaleY() < 1){  //温度计达到最低，停止调度
                removeTimer("tempDown")
                bigBiao.line.setScaleY(1)
                node.line.setScaleY(1.25)
            }else if(value > 124){  // 温度计达到这个温度已经损坏
                removeTimer("tempUp")
                judgeOver = true 
                bigBiao.judgeOver.setVisible(true)
                node.judgeOver.setVisible(true)
            }
            //判断提示语音
            if(value > 90 && judgeSay[0]){  //40°的时候
                judgeSay[0] = false 
                //提示该放木板
                self.nodebs.say({key:"do3_tip2",force:true})
            }else if(value > 118 && judgeSay[1]){   //48°的时候
                judgeSay[1] = false 
                //提示该熄灭酒精灯
                self.nodebs.say({key:"do3_tip3",force:true})
            }
        }

        var judgeCurDis = function(){
            var dx = 510-jjd.x 
            var dy = 280-jjd.y 
            var dis = Math.sqrt(Math.pow(dx,2),Math.pow(dy,2))
            curDistance = 1/6*(dis/10) + 26
            cc.log("=======",curDistance)
        }

    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do3_tip1",img:res.do3_tip1,sound:res.do3_sound1},
            {key:"do3_tip2",img:res.do3_tip2,sound:res.do3_sound2},
            {key:"do3_tip3",img:res.do3_tip3,sound:res.do3_sound3},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
        addContent({
            people: this.nodebs,
            key: "do3_result",
            img: res.do3_result,
            sound: res.do3_sound_result,
            id: "result",
        })
    },
})