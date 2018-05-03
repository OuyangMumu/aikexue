var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true;
    },
    reEnter:function(){
        if(this.snowNode)
            this.snowNode.setVisible(true)
    },
    preExit:function(){
        this._super()
        if(this.snowNode)
            this.snowNode.setVisible(false)
    },
 
    initUI: function () {
    	var self = this
        var uiList = ["item_spring","item_summer","item_autumn","item_winter",
        "sun","sky","land","backBg","fen","shi","btn_next","node_spring","node_summer",
        "node_autumn","node_winter","snowNode","resultBg","resultImg","btn_close",
        "btn_result","wz_1","wz_2","wz_3","wz_4","wzBg","gan","hand","btn_again"
        ]
        var node = loadNode(res.qwdcl_doExp1_json,uiList)
        self.inside_node.addChild(node)
        this.snowNode = node.snowNode

        node.hand.runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(0.3, 28 , 28),
            cc.moveTo(0.3, 45, 45)
        )))
        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
        })
        //创建春夏秋冬的四个按钮事件
        for(var i = 0 ; i < 4 ; i++){
            var normal = node[uiList[i]].getChildByName("normal")
            normal.index = i
            createTouchEvent({
                item:normal,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    seasonFun(index)
                    return true
                }
            })
        }

        var fdj_sp = new cc.Sprite(res.jm)
        var bigfdj = new cc.ClippingNode(fdj_sp)
        bigfdj.setPosition(568,450)
        bigfdj.setAlphaThreshold(0)
        self.addChild(bigfdj)

        var wdj = new cc.Sprite(res.wdj)
        wdj.setPosition(0,207)
        bigfdj.addChild(wdj)

        var kdLine = new cc.Sprite(res.kdLine)
        kdLine.setPosition(-3,-158)
        bigfdj.addChild(kdLine)
        kdLine.setScaleX(1.4)

        var fdjjm = new cc.Sprite(res.jm)
        fdjjm.setPosition(568,450)
        fdjjm.setScale(1.02)
        self.addChild(fdjjm)

        safeAdd(self, node.gan)

        var curSeason = 0//判断当前是哪一个季节
        var seasonNodeList = ["node_spring","node_summer","node_autumn","node_winter"]
        var seasonImgList = [res.land_spring,res.land_summer,res.land_autumn,res.land_winter,
                            res.sky_spring,res.sky_summer,res.sky_autumn,res.sky_winter,]
        //四个季节的温度
        var spring_tempList = [11,13,15,16,20,24,24,22,19,16,14,13]
        var summer_tempList = [20,21,20,23,32,37,38,35,29,27,27,24]
        var autumn_tempList = [9,12,14,16,20,24,25,22,19,16,14,11]
        var winter_tempList = [-10,-9,-8,-5,-5,-3,-3,-4,-6,-6,-8,-10]
        var spring_bigTemp = [115,76,37,18,-58,-137,-137,-98,-39,18,56,76]
        var summer_bigTemp = [-58,-79,-58,-116,-290,-389,-409,-348,-232,-194,-194,-136]
        var autumn_bigTemp = [154,96,58,19,-59,-135,-154,-97,-39,19,57,116]
        var winter_bigTemp = [520,502,482,424,424,385,385,404,442,442,483,520]
        var opacityList = [200,200,100,0,0,0,0,0,0,100,200,200]
        var sunRotate = [0,0,0,30,60,90,120,150,180,360,0,0]
        var shiList = [60,120,180,240,300,360,420,480,540,600,660,720]
        var curTimeList = [0,0,0,0]
        node.curTemp = spring_tempList  //当前画线温度
        node.curBigTemp = spring_bigTemp //当前放大镜中的温度
        wdj.setPositionY(115-120)



        //四个季节所对应的事件
        var seasonFun = function(index){
            if(curSeason == index)  return false
            for(var i = 0 ; i < 4 ; i++){
                if(i == index){
                    curSeason = i
                    node.snowNode.removeAllChildren(true)
                    node.land.setTexture(seasonImgList[i])
                    node.sky.setTexture(seasonImgList[i+4])
                    node[uiList[i]].getChildByName("normal").setVisible(false)
                    node[uiList[i]].getChildByName("select").setVisible(true)

                    node[seasonNodeList[i]].setVisible(true)
                    node.sun.setRotation(sunRotate[curTimeList[curSeason]])
                    if(curSeason == 3){
                        createSnow()
                        node.sun.setRotation(0)
                    }
                    node.backBg.setOpacity(opacityList[curTimeList[curSeason]])
                    node.shi.stopAllActions()
                    node.fen.stopAllActions()
                    node.fen.setRotation(0)
                    node.shi.setRotation(shiList[curTimeList[curSeason]])
                    judgeCurTemp()
                    wdj.setPositionY(node.curBigTemp[curTimeList[curSeason]]-120)
                    judgeBtn()//切换的时候判断应该是显示哪一个按钮
                    if(curTimeList[curSeason] == 0){
                        drawLineFun()
                    }
                }else{
                    node[seasonNodeList[i]].setVisible(false)
                    node[uiList[i]].getChildByName("normal").setVisible(true)
                    node[uiList[i]].getChildByName("select").setVisible(false)
                }
            }
        }
        //单击下一个时刻所调用方法
        var nextFun = function(){
            curTimeList[curSeason]+=1
            node.backBg.runAction(cc.fadeTo(2,opacityList[curTimeList[curSeason]]))
            node.shi.runAction(cc.sequence(
                cc.callFunc(function(){
                    node.fen.runAction(cc.repeatForever(cc.sequence(
                        cc.rotateTo(1,720)
                    )))
                }),
                cc.rotateTo(2,shiList[curTimeList[curSeason]]),
                cc.callFunc(function(){
                    node.fen.stopAllActions()
                    node.fen.setRotation(0)
                    if(curTimeList[curSeason] == 11){
                        node.btn_next.setPositionY(-300)
                        node.btn_again.setPosition(100,80)
                    }
                })
            ))

            if(curSeason != 3)
                node.sun.runAction(cc.rotateTo(2,sunRotate[curTimeList[curSeason]]))

            drawLineFun()
            if(node.hand.isVisible()){
                node.hand.setVisible(false)
                node.hand.stopAllActions()
            }
        }

        var judgeBtn = function(){
            if(curTimeList[curSeason] == 11){
                node.btn_next.setPositionY(-300)
                node.btn_again.setPosition(100,80)
            }else{
                node.btn_again.setPositionY(-300)
                node.btn_next.setPosition(100,80)
            }
        }
        node.btn_next.addClickEventListener(function(){
            nextFun()
        })

        //单击重新开始
        node.btn_again.addClickEventListener(function(){
            curTimeList[curSeason] = -1
            node[seasonNodeList[curSeason]].removeAllChildren(true)
            node.shi.setRotation(0)
            node.btn_next.setPosition(100,80)
            node.btn_again.setPositionY(-300)
            nextFun()
        })


        //画线函数
        var drawLineFun = function(){
            node.btn_next.setEnabled(false)
            node.btn_next.setOpacity(150)
            wdj.stopAllActions()
            wdj.runAction(cc.moveTo(2,wdj.x,node.curBigTemp[curTimeList[curSeason]]-120))
            var curDraw = new cc.DrawNode()
            node[seasonNodeList[curSeason]].addChild(curDraw)
            
            var getPointList = function(dest){
                var list = []
                for(var i = 0 ; i < dest ; i++){
                    list.push(i)
                    i = i+1
                }
                return list
            }
            var pointlist = getPointList(node.curTemp[curTimeList[curSeason]] * 3.5 +45)
            var time = 2 / pointlist.length
            pointlist.key = sprintf("key%d", curSeason)
            var _curTimeList = curTimeList[curSeason]
            var _curTemp = node.curTemp
            var _season = node[seasonNodeList[curSeason]]
            var count = 0
            addTimer({
                time:time,
                fun:function(data){
                    if(count < pointlist.length-1){
                        curDraw.drawSegment(cc.p(_curTimeList * 37,pointlist[count]),cc.p(_curTimeList * 37,
                            pointlist[count+1]),1,cc.color(255, 0, 0, 255))
                        count++
                    }else{
                        removeTimer(pointlist.key)
                        node.btn_next.setEnabled(true)
                        node.btn_next.setOpacity(250)
                        node.fen.stopAllActions()
                        node.fen.setRotation(0)
                        //此处开始画蓝色的线
                        if(_curTimeList > 0){
                            var lastDraw = new cc.DrawNode()
                            _season.addChild(lastDraw)

                            lastDraw.drawSegment(cc.p((_curTimeList-1) * 37,
                                _curTemp[_curTimeList-1] * 3.5 +45),cc.p(_curTimeList * 37,
                                _curTemp[_curTimeList] * 3.5 +45),1,cc.color(0, 0, 255, 255))
                        }
                    }
                },
                repeat:cc.REPEAT_FOREVER,
                key:sprintf("key%d", curSeason),
                buf:count
            })

        }
        drawLineFun()

        var judgeCurTemp = function(){
            switch(curSeason){
                case 0:
                node.curTemp = spring_tempList  
                node.curBigTemp = spring_bigTemp 
                break
                case 1:
                node.curTemp = summer_tempList  
                node.curBigTemp = summer_bigTemp 
                break
                case 2:
                node.curTemp = autumn_tempList  
                node.curBigTemp = autumn_bigTemp 
                break
                case 3:
                node.curTemp = winter_tempList  
                node.curBigTemp = winter_bigTemp 
                break
            }
        }

        node.resultBg.setScale(0)
        safeAdd(self, node.resultBg)
        createTouchEvent({
            item:node.resultBg,
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
        var wzList = ["wz_1","wz_2","wz_3","wz_4"]
        var wzPosList = [cc.p(61,83),cc.p(320,116),cc.p(211,18),cc.p(390,50)]
        var posX = [64,160,274,412]
        for(var i = 0 ; i < 4 ; i++){
            node[wzList[i]].index = i
            node[wzList[i]].nodeMove = false
            createTouchEvent({
                item:node[wzList[i]],
                begin:function(data){
                    var pos = data.pos
                    var item = data.item
                    if(item.noMove)
                        return false
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
                    if(checkDistance(item,wzPosList[item.index])){
                        item.setPosition(wzPosList[item.index])
                        item.noMove = true
                        if(node.wz_1.noMove && node.wz_2.noMove && node.wz_3.noMove && node.wz_4.noMove){
                            node.wzBg.setVisible(false)
                            node.resultImg.setVisible(true)
                            self.nodebs.say({key:"do1_tip2",force:true})
                        }
                    }else{
                        item.setPosition(posX[index],-45)
                    }
                }
            })
        }
        
        var closeFun = function(){
            self.nodebs.stopSay()
            node.resultBg.runAction(cc.sequence(
                    cc.scaleTo(0.2,0),
                    cc.callFunc(function(){
                        node.resultBg.setPositionY(-600)
                    })
                ))
        }
        node.btn_result.addClickEventListener(function(){
            if(node.resultImg.isVisible())
                self.nodebs.say({key:"do1_tip2",force:true})
            if(node.resultBg.getScale() == 0){
                node.resultBg.runAction(cc.sequence(
                    cc.callFunc(function(){
                        node.resultBg.setPosition(568,320)
                    }),
                    cc.scaleTo(0.2,1)
                ))
            }else{
                closeFun()
            }
        })
        node.btn_close.addClickEventListener(function(){
            closeFun()
        })

        var checkDistance = function(r1,r2){
            var dx = r1.x - r2.x
            var dy = r1.y - r2.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 30)
                return true
            else
                return false
        }

        //创建雪花粒子效果
        var createSnow = function(){
            var snowPar = new cc.ParticleSnow();
            snowPar.setScale(0.8)
            node.snowNode.addChild(snowPar);
            snowPar.setPosVar(cc.p(1136, 0));
            snowPar.life = 8;
            snowPar.lifeVar = 1;
            snowPar.gravity = cc.p(0, -2);
            snowPar.speed = 60;
            snowPar.speedVar = 30;
            snowPar.setStartColor(cc.color(255, 255, 255, 255));
            snowPar.setEndColor(cc.color(255, 255, 255, 255));

            snowPar.emissionRate = snowPar.totalParticles / snowPar.life;

            snowPar.texture = cc.textureCache.addImage(res.snow);
            snowPar.shapeType = cc.ParticleSystem.STAR_SHAPE;
        }
        
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1030, 120)
        })
        this.addChild(this.nodebs,99)
        
        addContent({
            people: this.nodebs,
            key: "do1_tip1",
            img: res.do1_tip1,
            sound: res.do1_sound1,
        })
        addContent({
            people: this.nodebs,
            key: "do1_tip2",
            sound: res.do1_sound2,
        })
    },

})