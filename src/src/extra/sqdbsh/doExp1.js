var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        this._super()
        this.expCtor({setZ:20})
        this.initPeople();
        this.initUI();
        return true;
    },
    
    initUI:function(){
    	this.createTool()
    },

    createTool:function(){
    	loadPlist("paper_jy_Plist")
    	loadPlist("paper_jh_Plist")
        loadPlist("see_Plist")
        loadPlist("bs_plist")
        loadPlist("pgls_plist")
        var self = this
        var curNum = 0
        var curLocal = 20
        var cbei2 = null
        var sbei2 = null
        var mbIsOver = [false,false]  //用于判断毛笔已经可以移除
        var judgeDialog = [true,false,false,false] //出现提示框
        var btn_phe = null
        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })
        var toolbtn = createTool({
            pos: cc.p(250, 510),
            nums: 4,
            scale:0.9,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.2, 1.5),
            itempos: cc.p(0, -15),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [2, 1, 1, 1, 1, 1,1],
            swallow: [true, true, true, true, true, true,true],
            files: [res.do1_tools1, res.do1_tools2, res.do1_tools3, res.do1_tools4, res.do1_tools5, res.do1_tools6,res.do1_tools7],
            gets: [res.paper, res.jiandao,res.tiesi,"#bei.png","#bei.png",res.maobi,"#pgls01.png"],
            firstClick: function(data) {
                var index = data.index
                var pos = data.pos
                var item = data.sp

                if(index != 0 && index != 1 && judgeDialog[0]){
                    createDialog(res.dialog1)
                    return false
                }else if(index != 2 && judgeDialog[1]){
                    createDialog(res.dialog2)
                    return false
                }else if(index != 2 && judgeDialog[2]){
                    createDialog(res.dialog3)
                    return false
                }else if(index == 6 && judgeDialog[3]){
                    createDialog(res.dialog6)
                    return false
                }

                if(index == 0){
                	item.curNum = curNum
                	curNum++
                	item.jian = false
                }else if(index == 1){
                	item.setScale(0.7)
                	item.setRotation(45)
                }else if(index == 2){
                	var hand1 = new cc.Sprite(res.hand1)
                	hand1.setPosition(-30,47)
                	hand1.setLocalZOrder(-1)
                	item.addChild(hand1)
                	var hand2 = new cc.Sprite(res.hand2)
                	hand2.setPosition(-39,12)
                	item.addChild(hand2)
                }else if(index == 3){
                    createBei(index,item)
                }else if(index == 4){
                    createBei(index,item)
                }else if(index == 5){
                    item.bc = false   //判断毛笔是否有白醋
                    item.shs = false    //判断毛笔是否有石灰水
                }else if(index == 6){
                    item.canRun = true //表示可以喷甘蓝水
                }
                item.setLocalZOrder(curLocal)
                return item
            },
            clickfun : function(data){
                var item = data.sp
                if(!item.noMove){
                	item.setLocalZOrder(curLocal)
                	curLocal++
                }
                return true
            },
            movefun:function(data){
                var item = data.sp
                var index = data.index
                var delta = data.delta
                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                }
                //剪刀和纸碰到后的动画
                if(index == 1){
                	if(toolbtn.getindex(0)){
                		for(var i = 0 ; i < toolbtn.getindex(0).length ; i++){
                			var paper = toolbtn.getindex(0)[i]
                			if(!item.noMove && !paper.jian && cc.rectIntersectsRect(item,paper)){
	                			item.disMove(true)
	                			item.setVisible(false)
	                			paper.disMove(true)
	                			paper.jian = true
	                			item.setPosition(paper.x+100,paper.y)
	                			if(paper.curNum == 0){
	                				paper.runAction(anijd("paper_jh%02d.png",paper,item))
	                				paper.setPosition(paper.x+44,paper.y-5)
	                			}else{
	                				paper.runAction(anijd("paper_jy%02d.png",paper,item))
	                				paper.setPosition(paper.x+11,paper.y-6)
	                			}
	                				
                			}
                		}
                	}
                }
                //纸和铁线碰到后的动画
                if(index == 0){
                	if(toolbtn.getindex(2)){
                		if(!item.inTie && cc.rectIntersectsRect(item,toolbtn.getindex(2))){
                			var tie = toolbtn.getindex(2)
                            if(!toolbtn.getindex(0)[1].noMove && item.curNum == 0){
                                createDialog(res.dialog2)
                                return false
                            }
                            item.disMove(true)
                            item.inTie = true
                			if(item.curNum == 1){
                				item.runAction(cc.sequence(
                					cc.moveTo(0.2,tie.x,tie.y+110),
                                    cc.delayTime(0.2),
                					cc.callFunc(function(){
                                        item.setTexture(res.ye2)
                						createHand(item,152,15,161,-20)
                					}),
                                    cc.delayTime(0.2),
                					cc.moveTo(0.5,tie.x,tie.y),
                                    cc.callFunc(function(){
                                        item.removeAllChildren()
                                        judgeDialog[1] = false
                                        judgeDialog[2] = true
                                        //提示进行下一步
                                        tipNextFun() 
                                    })
                				))
                			}else{
                                item.runAction(cc.sequence(
                                    cc.moveTo(0.2,tie.x,tie.y+110),
                                    cc.delayTime(0.2),
                                    cc.callFunc(function(){
                                        item.setTexture(res.do_hua2)
                                        createHand(item,137,26,146,-9)
                                    }),
                                    cc.delayTime(0.2),
                                    cc.moveTo(1,tie.x,tie.y+100),
                                    cc.callFunc(function(){
                                        item.removeAllChildren()
                                        //提示进行下一步
                                        tipNextFun()
                                    })
                                ))
                            }
                		}
                	}
                }
                //毛笔和杯子碰到的动画
                if(index == 5){
                    //毛笔沾白醋
                    if(toolbtn.getindex(3)){
                        if(!item.bc && checkDistance_mb(item,toolbtn.getindex(3))){
                            var cu = toolbtn.getindex(3)
                            if(item.shs){
                                createDialog(res.dialog5)
                                return false
                            }
                            item.disMove(true)
                            item.bc = true
                            //毛笔进入杯子沾水
                            getWater(item,cu,cbei2)
						}
                    }
                    //毛笔沾石灰水
                    if(toolbtn.getindex(4)){
                        if(!item.shs && checkDistance_mb(item,toolbtn.getindex(4))){
                            var shs = toolbtn.getindex(4)
                            if(item.bc){
                                createDialog(res.dialog4)
                                return false
                            }
                            item.disMove(true)
                            item.shs = true
                            //毛笔进入杯子沾水
                            getWater(item,shs,sbei2)
                        }
                    }

                    //白醋滴在花上面上面
                    if(item.bc && checkDistance_mz(item,toolbtn.getindex(0)[0])){
                        var hua = toolbtn.getindex(0)[0]
                        item.bc = false
                        mbIsOver[0] = true
                        hua.runAction(anibs("hbs%02d.png",1,10))
                        getWaterInPaper(item,hua)
                    }
                    //石灰水滴在叶子上面上面
                    if(item.shs && checkDistance_mz(item,toolbtn.getindex(0)[1])){
                        var yezi = toolbtn.getindex(0)[1]
                        item.shs = false
                        mbIsOver[1] = true
                        item.disMove(true)
                        yezi.runAction(anibs("ybs%02d.png",1,10))
                        getWaterInPaper(item,yezi)
                    } 
                }

                //喷甘蓝水
                if(index == 6){
                    if(item.canRun && cc.rectIntersectsRect(item,toolbtn.getindex(0)[0])){
                        var hua = toolbtn.getindex(0)[0]
                        var ye = toolbtn.getindex(0)[1]
                        item.canRun = false
                        item.disMove(true)
                        item.setPosition(hua.x+120,hua.y-60)
                        item.runAction(cc.sequence(
                            anipgls(),
                            cc.moveTo(0.2,hua.x+60,hua.y-60),
                            anipgls(),
                            cc.callFunc(function(){
                                hua.runAction(anibs("hbs%02d.png",11,18))
                            }),
                            cc.moveTo(0.2,ye.x+120,ye.y-60),
                            anipgls(),
                            cc.moveTo(0.2,ye.x+60,ye.y-60),
                            anipgls(),
                            cc.callFunc(function(){
                                ye.runAction(anibs("ybs%02d.png",11,18))
                                item.setPositionY(-600)
                                item.removeFromParent(true)
                                createPhe()
                            })
                        ))
                    }
                }
            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
                if(index == 2){
                	item.disMove(true)
                	item.setPosition(300,150)
                }else if(index == 3){
                    item.disMove(true)
                    item.setPosition(650,120)
                }else if(index == 4){
                    item.disMove(true)
                    item.setPosition(850,120)
                }
            },
            backfun:function(data){
            	var item = data.sp
            	var index = data.index
            	if(item.noMove)
            		return false
            	if(index == 0){
            		return false
            	}
            	return true
            }
        })
        this.addChild(toolbtn)
        toolbtn.show()

        var tipNextFun = function(){
            //已经将两个纸都串导铁丝上面
            if(toolbtn.getindex(0)[0].noMove && toolbtn.getindex(0)[1].noMove){
                judgeDialog[3] = true
                judgeDialog[2] = false
                self.nodebs.say({key:"do_tip3",force:true})
            }
        }

        var createBei = function(index,item){
            if(index == 3){
                cbei2 = new cc.Sprite("#bei2.png")
                cbei2.setPosition(73,65)
                item.addChild(cbei2)
                cbei2.cu = new cc.Sprite("#cu.png")
                cbei2.cu.setPosition(74,77)
                cbei2.addChild(cbei2.cu)
            }else{
                sbei2 = new cc.Sprite("#bei2.png")
                sbei2.setPosition(73,65)
                item.addChild(sbei2)
                sbei2.shs = new cc.Sprite("#shs.png")
                sbei2.shs.setPosition(74,77)
                sbei2.addChild(sbei2.shs)
            } 
        }

        var anipgls = function() {
            return cc.sequence(createAnimation({
                frame: "pgls%02d.png",
                end: 11,
                time: 0.15
            }))
        }
        var ani = function(frame,end,item) {
            return cc.sequence(createAnimation({
                frame: frame,
                end: end,
                time: 0.2
            }), cc.callFunc(function() {
                //判断是否为毛笔
                if(end == 10){
                    if(mbIsOver[0] && mbIsOver[1]){
                        item.setPositionY(-600)
                        item.removeFromParent(true)
                        self.nodebs.say({key:"do_tip4",force:true})
                        judgeDialog[3] = false
                    }else{
                        item.forceBack()
                    } 
                }
            }))
        }

        var anibs = function(frame,start,end) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time: 0.2
            }), cc.callFunc(function() {
            }))
        }

        var anijd = function(frame,paper,jiandao) {
	        return cc.sequence(createAnimation({
	            frame: frame,
	            end: 49,
	            time: 0.15
	        }), cc.callFunc(function() {
	            jiandao.setVisible(true)
	            jiandao.disMove(false)
	            paper.disMove(false)
	            paper.inTie = false
	            if(paper.curNum == 0){
	            	paper.setPosition(paper.x-41,paper.y+5)
	            	paper.setSpriteFrame("do_hua.png")
	            	
	            }else{
	            	paper.setPosition(paper.x-10,paper.y+6)
	            	paper.setSpriteFrame("ye.png")
	            }
	            judgeTwoPaper(jiandao)
	        }))
	    }

	    //判断是否已经剪了两朵了
	    var judgeTwoPaper = function(jiandao){
	    	if(toolbtn.getindex(0).length == 2){
				if(toolbtn.getindex(0)[0].jian && toolbtn.getindex(0)[1].jian){
                    jiandao.setPositionY(-600)
					jiandao.removeFromParent(true)
                    self.nodebs.say({key:"do_tip2",force:true})
                    judgeDialog[0] = false
                    judgeDialog[1] = true
				}
	    	}
	    }

	    var createHand = function(item,x1,y1,x2,y2){
	    	var hand1 = new cc.Sprite(res.hand1)
        	hand1.setPosition(x1,y1)
        	hand1.setLocalZOrder(-1)
        	hand1.setScaleX(-1)
        	item.addChild(hand1)
        	var hand2 = new cc.Sprite(res.hand2)
        	hand2.setPosition(x2,y2)
        	hand2.setScaleX(-1)
        	item.addChild(hand2)
	    }

        var checkDistance_mb = function(r1,r2){
            var dx = r1.x - r2.x
            var dy = (r1.y - r1.height/2) - (r2.y + r2.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 50)
                return true
            else
                return false
        }

        var checkDistance_mz = function(r1,r2){
            var dx = r1.x - r2.x
            var dy = (r1.y - r1.height/2) - r2.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 50)
                return true
            else
                return false
        }

        //将毛笔沾到花和叶子上
        var getWaterInPaper = function(item,sp){
            item.disMove(true)
            item.setPosition(item.x+8,item.y+22)
            item.setPosition(sp.x+30,sp.y+150)
            item.setRotation(0)
            item.runAction(ani("mbds%02d.png",10,item))
        }
        //得到白醋和石灰水
        var getWater = function(item,sp,bei2){
            item.setPosition(sp.x,sp.y+200)
            item.runAction(cc.sequence(
                cc.callFunc(function(){
                    safeAdd(self,bei2)
                    bei2.setPosition(sp.x,sp.y-27)
                    bei2.setLocalZOrder(item.getLocalZOrder()+1)
                }),
                cc.moveTo(0.2,sp.x,sp.y+100),
                cc.delayTime(0.5),
                cc.callFunc(function(){
                    item.setTexture(res.maobi2)
                }),
                cc.moveTo(0.8,sp.x,sp.y+200),
                cc.delayTime(0.5),
                cc.callFunc(function(){
                    item.setRotation(15)
                    sp.setPositionY(-600)
                    //sp.removeFromParent(true)
                    bei2.removeFromParent(true)
                    item.disMove(false)
                })
            ))
        }

        //创建提示框
        var createDialog = function(img){
            AddDialog("Tips", {
                res: img,
                face: 2,
                confirmBtn:true,
            })
        }
        //创建现象
        var createPhe = function(){
            btn_phe = new ccui.Button("res/btn/btn_xianxiang_normal.png","res/btn/btn_xianxiang_select.png")
            btn_phe.setPosition(1050,450)
            self.addChild(btn_phe)
            btn_phe.addClickEventListener(function(){
                self.nodebs.say({key:"do1_xianxiang"})
            })
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do_tip1",img:res.do1_tip1,sound:res.do1_sound1},
            {key:"do_tip2",img:res.do1_tip2,sound:res.do1_sound2},
            {key:"do_tip3",img:res.do1_tip3,sound:res.do1_sound3},
            {key:"do_tip4",img:res.do1_tip4,sound:res.do1_sound4},
        ]
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
            key: "do1_xianxiang",
            img: res.do1_xianxiang,
            sound: res.do1_xianxiang_sound,
            id:"result"
        })
    },
})