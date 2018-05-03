var curpageIndex = 0
var TICKTIME = 15 //倒计时15秒
var gameNodes = {}
views.answerLayer = views.ILayer.extend({
	ctor:function () {
        this._super()
        gameNodes.judgeStart = true
        return true
    },
    onEnter:function(){
        cc.log("onEnter")
    	this._super()
        this.initUI()
      
    },
    onEnterTransitionDidFinish:function(){
        this._super()
        cc.log("onEnterTransitionDidFinish")
    },
    sendData:function(index){
        cc.log("sendData")
        //得到本关的题目数据
        var self = this
        gameNodes.sendData = this.sendData
        self.curpage = Subject[baseData.curSubject]
        curpageIndex = index
    },
    onExit:function(){
    	this._super()
        //提交数据
        HTTP.saveData()
        playMyMusic(res.sound_select,true)
    },
    KeyBack:function(){
        this._super()
        gameNodes.exitGame()
        layerControl.showLayer("passLayer")
    },
    initUI:function(){
        var self = this
        createSp({img:res.answer_bg,  pos:cc.p(568,320),  father:self})
        //暂停按钮
        var btn_pause = createSp({
            img:res.answer_pause,  
            pos:cc.p(60,590),  
            father:self
        })
        scaleButtonFun({
            item:btn_pause,
            fun:function () {
                gameNodes.pauseDialog(self)
            }
        })
        //黑板
        var blackboard = createSp({
            img:res.answer_blackboard,  
            pos:cc.p(560,420),  
            father:self
        })
        //显示金币
        var coin = createCoinFun(self,cc.p(1050,605))
        gameNodes.coin = coin
        gameNodes.coinNum = coin.coinNum
        //答题个数
        var lockBg = createSp({
            img:res.coin_bg,  
            pos:cc.p(900,605),
            father:self
        })
        baseData.gainCoin = baseData.coinNum //刚进此界面的金币数量
        baseData.correctNum = 0 //本关答对题目个数
        gameNodes.lockNum = 0//当前完成到第几题
        gameNodes.lockAll = 10//总共题数

        gameNodes.lockLabel = createLabel({
            text:"0 / 10",
            pos:cc.p(23,0),
            father:lockBg,
        })

        //准备开始按钮
        gameNodes.btn_start = createSp({
            img:res.answer_start,
            pos:cc.p(568,150),
            father:self
        })
        createTouchEvent({
            item:gameNodes.btn_start,
            begin:function(data){
                var item = data.item
                if(!item.isVisible())
                    return false
                if(!self.curpage)
                    self.curpage = Subject[baseData.curSubject]
                var titleUrl = gameData_url+TOKEN+"&name="+self.curpage+"&level="+curpageIndex
                HTTP.sendData({
                    url:titleUrl,
                    successBack:function(data){
                        var jsonData = data.jsonData
                        gameNodes.titleInfolist = jsonData.data.questions
                        //从此处开始答题
                        item.setVisible(false)
                        if(gameNodes.judgeStart){
                            gameNodes.startAnswer(self)
                            gameNodes.judgeStart = false
                        }
                    },
                    failBack:function(){
                        
                    },
                    errorBack:function(){
                        if(!self.Error){
                            self.Error = HTTP.showError({
                                            text:"网络连不上，请检查一下！",
                                            fontSize:30,
                                            color:cc.color(0,0,0),
                                            disup:1
                                        })
                            self.Error.setPosition(400,198)
                            self.addChild(self.Error)
                        }
                        self.Error.show()
                    }
                })  
                return true
            }
        })

        //金币的父类node,管理金币
        var coinFather = new cc.Node()
        //coinFather.setLocalZOrder(999)
        self.addChild(coinFather)
        coinManger.father = coinFather
        coinManger.newCoinAndAdd(1)
    }
})

gameNodes.exitGame = function(){
    if(gameNodes.stopLayer) //判断是否还存在停止界面
        gameNodes.stopLayer.remove()
    if(gameNodes.pauseLayer)
        gameNodes.pauseLayer.remove()
    gameNodes.gameSatrt = false
    gameNodes.progressBg = null
    coinManger.father = null
    coinManger.coinList = []
    gameNodes.judgeStart = true

    Person.coinNum -= baseData.tempCoin  //意外退出金币复原，不再给玩家
    baseData.tempCoin = 0
}
//开始答题
gameNodes.startAnswer = function(self){
    var self = self
    playMyMusic(res.sound_answer,true)
    gameNodes.title = createLabel({
        father:self,
        pos:cc.p(290,550),
        Anchors:cc.p(0,1),
        fontSize:25,
        //color:cc.color(255,165,0)
    })

    gameNodes.optionList = []
    gameNodes.optionsFlag = ["A.","B.","C.","D."]
    for(var i = 0 ; i < 4 ; i++){
        gameNodes.optionList[i] = createLabel({
            father:self,
            fontSize:25,
            pos:cc.p(320,470 - 40*i),
            Anchors:cc.p(0,1)
        })
        gameNodes.optionList[i].setVisible(false)
    }
    //进度条
    var progress = gameNodes.createProgeress({
        father:self,
        startTime:TICKTIME,
    })
    gameNodes.progressBg = progress
    //创建地鼠
    gameNodes.mouseFunc = createMouseFun({father:self})
    progress.startFun()
    gameNodes.gameSatrt = true
}
//改变题目
gameNodes.changeTitle = function(){
    var data = {}
    if(gameNodes.titleInfolist){
        data.info = gameNodes.titleInfolist[gameNodes.lockNum]
        //改变地鼠位置，改变答案功能，在cartoon.js文件中
        gameNodes.mouseFunc.reset(data.info.answer[0],data.info.options.length)
        //先判断题目的总字数长度
        gameNodes.setLockNum()
        data.titleContent = gameNodes.lockNum+"."+data.info.text
        data.titleContent = "     " +string_Trim(data.titleContent)
        if(getStrLength(data.titleContent)>=115){
            data.titleContent = exp_subCHString(data.titleContent,0, 115) + "......";
        }

        gameNodes.title.setString(autoCreatRow(data.titleContent,22,5))
        for(var i = 0 ; i < gameNodes.optionList.length ; i++){
            gameNodes.optionList[i].setVisible(false)
            var len = data.info.options.length
            if(len==1){
                gameNodes.optionList[i].y = 440
            }else if(len==2){
                gameNodes.optionList[i].y = 440 - i*30
            }else if(len==3){
                gameNodes.optionList[i].y = 440 - i*30
            }else if(len==4){
                gameNodes.optionList[i].y = 440 - i*30
            }
        }
        for(var i = 0 ; i < data.info.options.length ; i++){
            gameNodes.optionList[i].setVisible(true)
            gameNodes.optionList[i].setString(gameNodes.optionsFlag[i]+data.info.options[i])
        }
    }
}

//改变当前题数
gameNodes.setLockNum = function(){
    gameNodes.lockNum++
    gameNodes.tempNum = sprintf(("%d / %d"),gameNodes.lockNum,gameNodes.lockAll)
    gameNodes.lockLabel.setString(gameNodes.tempNum)
}
//创建进度条
gameNodes.createProgeress = function(data){
    var pos = data.pos ||cc.p(111,445)
    var father = data.father
    var fun = data.fun
    var startTime = data.startTime || 5
    var disTime = data.disTime || 1
    var progressBg = data.progressBg || res.jindutiao
    var proTime = data.proTime || res.jindutiao1

    var progressBg = new cc.Sprite(progressBg)
    progressBg.setPosition(pos)
    father.addChild(progressBg)

    var proTime = new cc.ProgressTimer(new cc.Sprite(proTime))
    proTime.setPercentage(100)
    proTime.setPosition(progressBg.width/2,progressBg.height/2)
    progressBg.addChild(proTime)
    progressBg.setScale(-1,1)
    progressBg.proTime = proTime

    var lab = new ccui.Text(startTime+"","",32)
    lab.setPosition(progressBg.width/2,progressBg.height/2)
    lab.setColor(cc.color(255,0,0))
    progressBg.addChild(lab)
    lab.setScale(-1,1)
    lab.timenum = 0
    progressBg.lab = lab

    progressBg.startFun = function(){
        progressBg.stop()
        if(gameNodes.lockNum >= 10){//达到最大题数
            //计算界面弹出
            gameNodes.stopDialog(father)
            return false
        }
        gameNodes.changeTitle()
        lab.setString(startTime)
        proTime.runAction(cc.progressTo(startTime,0))
        lab.runAction(cc.repeatForever(cc.sequence(
            cc.delayTime(disTime),
            cc.callFunc(function(){
                //判断是否可自动切换到下一题
                if(gameNodes.mouseFunc.judgeNext){
                    progressBg.startFun()
                }

                lab.timenum++
                if(lab.timenum >= startTime)
                    lab.setString(0)
                else
                    lab.setString(startTime-lab.timenum)

                if(lab.timenum >= startTime){
                    progressBg.startFun()
                }
            })
        )))
    }
    progressBg.pauseSelf = function(){
        if(progressBg.proTime) progressBg.proTime.pause()
        if(progressBg.lab) progressBg.lab.pause()
    }
    progressBg.resumeSelf = function(){
        if(progressBg.proTime) progressBg.proTime.resume()
        if(progressBg.lab) progressBg.lab.resume()
    }

    progressBg.stop = function(){
        if(lab && proTime){
            lab.stopAllActions()
            proTime.stopAllActions()
            lab.timenum = 0
            proTime.setPercentage(100)
        } 
    }

    return progressBg
}

//再一次重新开始游戏
gameNodes.againGame = function(index){

    gameNodes.sendData(index)
    

    var self=this

    var name=Subject[baseData.curSubject]
    var titleUrl = gameData_url+TOKEN+"&name="+name+"&level="+curpageIndex
    HTTP.sendData({
        url:titleUrl,
        successBack:function(data){
            var jsonData = data.jsonData

            gameNodes.lockNum = 0 //恢复到第一题
            baseData.correctNum = 0
            baseData.tempCoin = 0
            gameNodes.stopLayer.remove()//移除本层

            gameNodes.titleInfolist = jsonData.data.questions
            //从此处开始答题
            // gameNodes.startAnswer(self)
    
            //开始出现题目
            gameNodes.progressBg.startFun()
        },
        failBack:function(){
            
        },
        errorBack:function(){
            if(!self.Error){
                self.Error = HTTP.showError({
                                text:"网络连不上，请检查一下！",
                                fontSize:30,
                                color:cc.color(0,0,0),
                                disup:1
                            })
                self.Error.setPosition(400,198)
                self.addChild(self.Error)
            }
            self.Error.show()
        }
    })  




}

//结算层
gameNodes.stopDialog = function(self){
    var self = self
    var stopLayer = new cc.LayerColor()
    stopLayer.setColor(cc.color(0,0,0))
    self.addChild(stopLayer)
    stopLayer.setLocalZOrder(100)
    stopLayer.setOpacity(130)
    gameNodes.stopLayer = stopLayer
    stopLayer.success = false //判断是否闯关成功
    baseData.tempCoin = 0 //出现结算功能，临时金币数量复原为0

    if(baseData.correctNum >= 8){
        //答题成功，解锁本关
        if(curpageIndex == Person.censorship[baseData.curSubject]){
            if(curpageIndex < passIconPos.length){
                Person.censorship[baseData.curSubject]++
            }
        }
    }

    stopLayer.bg = createSp({
        img:res.answer_stopBg,
        pos:cc.p(568,320),
        father: stopLayer,
    })

    //重新再来按钮
    stopLayer.again = createSp({
        img:res.answer_btn_again,
        pos:cc.p(200,60),
        father: stopLayer.bg,
    })
    
    //选择关卡按钮  -原取消按钮
    stopLayer.cancel = createSp({
        img:res.answer_btn_cancel,
        pos:cc.p(550,60),
        father: stopLayer.bg,
    })

    //重新开始
    scaleButtonFun({
        item:stopLayer.again,
        fun:function(){
            gameNodes.againGame()
        }
    })

    stopLayer.remove = function(){
        if(gameNodes.stopLayer){
            gameNodes.stopLayer.removeAllChildren(true)
            gameNodes.stopLayer.removeFromParent(true)
            gameNodes.stopLayer = null
        }   
    }
    //选关，进入选着关卡界面
    scaleButtonFun({
        item:stopLayer.cancel,
        fun:function(){
            gameNodes.exitGame()
            layerControl.showLayer("passLayer")
        }
    })

    var disCoin = baseData.correctNum * 1
    if(baseData.correctNum == 0){//此种写法是避免在手机上面，不显示数字0
        baseData.correctNum = "0"
        disCoin = "0"
    }
    //答对题数
    createLabel({
        text:baseData.correctNum,
        pos:cc.p(200,110),
        fontSize:34,
        father:stopLayer.bg,
        color:cc.color(120,80,40)
    })
    //所获得金币奖励
    createLabel({
        text: disCoin,
        pos:cc.p(540,110),
        fontSize:34,
        father:stopLayer.bg,
        color:cc.color(120,80,40)
    })

    //1/判断是否成功，显示图片标签,答对超过8题，是过关, 2/要是已经解锁下一关的话，是可以出现下一关按钮的
    if(baseData.correctNum >= 8 || Person.censorship[baseData.curSubject] > curpageIndex){
        if(baseData.correctNum >= 8){
            stopLayer.judgeLogo = res.answer_success
            stopLayer.success = true
            playEffect(res.sound_win)
        }else{
            stopLayer.judgeLogo = res.answer_unsuccess
        }

        //判断是否是最后一关，最后一关则提示玩家前往其他科目答题
        if(curpageIndex == passIconPos.length){
            createLabel({
                text: "您已解锁最后一关，\n请前往其他科目!",
                pos:cc.p(270,100),
                fontSize:25,
                father:stopLayer.bg,
                color:cc.color(250,80,40)
            })
        }else{
            //下一关按钮
            stopLayer.next = createSp({
                img:res.answer_btn_next,
                pos:cc.p(375,60),
                father: stopLayer.bg,
            })

            //下一关
            scaleButtonFun({
                item:stopLayer.next,
                fun:function(){
                    //得到数据，将当前关跳到下一关
                    cc.log("得到数据，将当前关跳到下一关")
                    curpageIndex++
                    cc.log("page:"+curpageIndex)
                    HTTP.saveData()
                    gameNodes.againGame(curpageIndex)
                }
            })
        }
    }else{
        stopLayer.judgeLogo = res.answer_unsuccess
    }

    //重新开始
    scaleButtonFun({
        item:stopLayer.again,
        fun:function(){
            console.log("reset game")   
           
            //判断当前是否解锁下一关，要是已解锁，从新开始，则
            gameNodes.againGame(curpageIndex)
        }
    })

    createSp({
        img:stopLayer.judgeLogo,
        pos:cc.p(375,270),
        father:stopLayer.bg,
    })

    createTouchEvent({
        item:stopLayer,
        begin:function(){
            return true
        }
    })

    //默认屏蔽掉黑板的监听事件
    gameNodes.mouseFunc.banDislisten()
}

//退出层
gameNodes.gameSatrt = false
gameNodes.pauseDialog = function(self){
    var self = self
    var pauseLayer = new cc.LayerColor()
    pauseLayer.setColor(cc.color(0,0,0))
    self.addChild(pauseLayer)
    pauseLayer.setLocalZOrder(100)
    pauseLayer.setOpacity(130)
    gameNodes.pauseLayer = pauseLayer

    pauseLayer.bg = createSp({
        img:res.answer_pauseBg,
        pos:cc.p(568,320),
        father: pauseLayer,
    })

    pauseLayer.home = createSp({
        img:res.pause_home,
        pos:cc.p(200,80),
        father: pauseLayer.bg,
    })
    pauseLayer.back = createSp({
        img:res.pause_back,
        pos:cc.p(380,80),
        father: pauseLayer.bg,
    })
    pauseLayer.cancel = createSp({
        img:res.pause_cancel,
        pos:cc.p(560,80),
        father: pauseLayer.bg,
    })
    if(gameNodes.gameSatrt){
        gameNodes.progressBg.pauseSelf()
    }

    pauseLayer.remove = function(){
        if(gameNodes.pauseLayer){
            gameNodes.pauseLayer.removeAllChildren(true)
            gameNodes.pauseLayer.removeFromParent(true)
            gameNodes.pauseLayer = null
        }
    }

    //继续游戏
    scaleButtonFun({
        item:pauseLayer.cancel,
        fun:function(){
            if(gameNodes.gameSatrt){
                gameNodes.progressBg.resumeSelf()
            }
            gameNodes.pauseLayer.remove()
        }
    })
    //重新开始
    scaleButtonFun({
        item:pauseLayer.back,
        fun:function(){
            gameNodes.exitGame()
            layerControl.showLayer("answerLayer")
        }
    })
    //返回主页
    scaleButtonFun({
        item:pauseLayer.home,
        fun:function(){
            gameNodes.exitGame()
            layerControl.showLayer("selectLayer")
        }
    })

    createTouchEvent({
        item:pauseLayer,
        begin:function(){
            return true
        }
    })
}

