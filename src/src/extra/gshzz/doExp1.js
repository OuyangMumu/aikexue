var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        loadPlist("tablewz_plist")
        this._super();
        this.expCtor({
            vis: false,
            setZ: 100,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                if (!self.bgg) {
                  var bg = createBiaoge({
                      json: res.gshzz_tableNode_json,
                      isShowResult: false,
                      scale: 0.9
                  })
                  var that = bg.getBg()
                  createBgMoveSp({
                    father:that,
                    imgs:[
                        ["#tablewz00.png",0],
                        ["#tablewz01.png",1],
                        ["#tablewz02.png",2],
                        ["#tablewz03.png",3],
                        ["#tablewz04.png",4],
                        ["#tablewz05.png",5],
                        ["#tablewz06.png",6],
                    ],
                    pos:cc.p(60,55),
                    dis:100,
                    itemScale:1,
                    resultfather:self,
                    fromExp:"do",
                    rectlist:[
                       cc.rect(37,344,100,60),
                       cc.rect(37,274,100,60),
                       cc.rect(37,204,100,60),
                       cc.rect(330,387,100,60),
                       cc.rect(330,307,100,60),
                       cc.rect(575,342,100,60),
                       cc.rect(575,227,100,60)
                    ]
                  })
                  bg.upLoadFun = function(){
                      that.upResult()
                  }
                  bg.ClearFun = function(){
                      that.clearData()
                  }
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
        return true;
    },

    initUI: function () {
    	var self = this
        self.createTool()
    },

    createTool:function(){
        var self = this
        loadPlist("bddh_plist")
        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
        })
        var douzi = new cc.Sprite(res.douzi)
        douzi.setPosition(100,-100)
        self.addChild(douzi,3)
        var fdj = new cc.Sprite(res.jingzi1)
        fdj.setPosition(100,-500)
        self.addChild(fdj,30)
        douzi.noMove = false
        douzi.qie = true
        douzi.first = true
        douzi.put = false  //当前是使用镊子去取豆子
        var curLocal = 10
        fdj.canSee = false
        createTouchEvent({
            item:fdj,
            begin:function(data){
                var item = data.item
                item.setLocalZOrder(curLocal++)
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                    item.x += delta.x
                    item.y += delta.y
            }
        })
        createTouchEvent({
            item:douzi,
            begin:function(data){
                var item = data.item
                if(item.noMove){
                    createDialog()
                    return false
                }
                item.setLocalZOrder(curLocal++)
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(!item.noMove){ 
                    item.x += delta.x
                    item.y += delta.y
                }
                
            }
        })
        var toolbtn = createTool({
            pos: cc.p(300, 510),
            nums: 3,
            scale:0.8,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -10),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [1, 1, 1],
            swallow: [true, true, true],
            files: [res.do1_tools1, res.do1_tools2, res.do1_tools3],
            gets: [res.do1_item1,res.do1_item2,res.do1_item3],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                if(index == 1){
                    var hand1 = new cc.Sprite(res.hand1)
                    hand1.setPosition(90,97)
                    item.addChild(hand1,-1)
                    var hand2 = new cc.Sprite(res.hand2)
                    hand2.setPosition(117,98)
                    item.addChild(hand2)
                }else if(index == 2){
                    if(douzi.noMove){
                        createDialog()
                        return false
                    }
                    item.setLocalZOrder(douzi.getLocalZOrder()+1)
                }
                return item
            },
            clickfun : function(data){
                var index = data.index
                var item = data.sp
                var pos = data.pos
                if(index != 0)
                    item.setLocalZOrder(curLocal++)
                if(index == 1){
                    if(getItem(0)){
                        if(rectContainsPoint(getItem(0), item)){
                            douzi.put = true
                            douzi.setLocalZOrder(item.getLocalZOrder()+1)
                            resumeDouzi()
                            if(!douzi.first)//这里是第二次进入
                                douzi.setPosition(item.x-66,item.y-87)
                            else
                                douzi.setPosition(item.x-67,item.y-87)
                        }
                    }
                    
                    for (var i = 1; i >= 0; i--) {
                        item.getChildren()[i].setVisible(true)
                    }
                }
                if(item.noMove)
                    return false
                return true
            },
            movefun:function(data){
                var item = data.sp
                var index = data.index
                var delta = data.delta
                if(index == 1 && !douzi.put){
                    if(douzi.qie && checkDistance(item,douzi)){
                        douzi.qie = false
                        douzi.noMove = true
                        item.setPositionY(-200)
                        douzi.setScale(1.02)
                        if(self.toolbtn.getindex(2)){
                            fdj.posY = self.toolbtn.getindex(2).y
                            self.toolbtn.getindex(2).setPositionY(-500)
                            fdj.setPositionY(-500)
                        }
                        if(!douzi.first){
                            douzi.setPosition(douzi.x+129,douzi.y+90.5)
                        }else{
                            douzi.first = false
                            douzi.setPosition(douzi.x+132,douzi.y+103.5)
                        }
                        douzi.runAction(cc.sequence(
                            anidouzi("bddh%02d.png",30,0.16),
                            cc.callFunc(function(){
                                if(!douzi.first)//这里是第二次进入
                                    douzi.setPosition(douzi.x-129,douzi.y-90.5)
                                else
                                    douzi.setPosition(douzi.x-131,douzi.y-92.5)
                                douzi.setTexture(res.douzi2)
                                douzi.noMove = false
                                douzi.setScale(1)
                                item.forceBack()
                                if(self.toolbtn.getindex(2)){
                                    self.toolbtn.getindex(2).setPositionY(fdj.posY)
                                }
                            })
                        ))
                    }
                }
                if(index == 2){
                    if(checkDistance2(item,douzi)){
                        if(!fdj.canSee){
                            if(!douzi.qie)
                                fdj.setTexture(res.jingzi2)
                            fdj.setPosition(550,250)
                            fdj.canSee = true
                        }
                    }else{
                        fdj.setPositionY(-500)
                        fdj.canSee = false
                    }
                }
                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                    if(douzi.put){
                        douzi.x += delta.x
                        douzi.y += delta.y
                    }
                 }
            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
                if(index == 0){
                    item.disMove(true)
                    item.setPosition(200,100)
                    // createTouchEvent({
                    //     item:item,
                    //     begin:function(data){
                    //         var pos = data.pos
                    //         if(douzi.noMove){
                    //             createDialog()
                    //             return false
                    //         }
                    //         fdj.setPositionY(-500)
                    //         if(!douzi.qie){
                    //             douzi.setScale(1)
                    //             douzi.qie = true
                    //             douzi.setTexture(res.douzi)
                    //             fdj.setTexture(res.jingzi1)
                    //         }
                    //         douzi.setPosition(pos)
                    //         return true
                    //     },
                    //     move:function(data){
                    //         var delta = data.delta
                    //         douzi.x += delta.x
                    //         douzi.y += delta.y
                    //     }
                    // })
                }
                if(index == 1){
                    if(douzi.put){//放手之后，豆子往下掉一点点
                       douzi.put = false
                       douzi.setPosition(douzi.x-30,douzi.y-30)
                    }
                    for (var i = 1; i >= 0; i--) {
                        item.getChildren()[i].setVisible(false)
                    }
                }
            }
        });
        this.addChild(toolbtn)
        toolbtn.show()
        self.toolbtn = toolbtn

        var resumeDouzi = function(){
            // if(douzi.noMove){
            //     createDialog()
            //     return false
            // }
            fdj.setPositionY(-500)
            if(!douzi.qie){
                douzi.setScale(1)
                douzi.qie = true
                douzi.setTexture(res.douzi)
                fdj.setTexture(res.jingzi1)
            }
        }
        var getItem = function(index){
            return self.toolbtn.getindex(index)
        }
        var rectContainsPoint = function (rect, point) {
            var ret = false;
            if (point.x-point.width/2 >= rect.x-rect.width/2 && point.x-point.width/2 <= rect.x+rect.width/2 &&
                point.y-point.height/2 >= rect.y-rect.height/2 && point.y-point.height/2 <= rect.y + rect.height/2) {
                ret = true;
            }
            return ret;
        }
        var createDialog = function(){
            AddDialog("Tips", {
                res: res.do2_dialog,
                face: 2,
                confirmBtn:true,
            })
        }

        var anidouzi = function(frame,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                end: end,
                time: time
            }))
        }
        var checkDistance = function(ra,rb){
            var dx = (ra.x-ra.width/2) - rb.x
            var dy = (ra.y-ra.height/2) - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < 40){
                return true
            }else{
                return false
            }
        }
        var checkDistance2 = function(ra,rb){
            var dx = (ra.x+7) - rb.x
            var dy = (ra.y+16) - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < 20){
                return true
            }else{
                return false
            }
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do1_tip1",img:res.do1_tip1,sound:res.do1_sound1}
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
    },
})