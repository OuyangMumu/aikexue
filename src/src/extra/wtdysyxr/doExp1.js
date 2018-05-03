var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor({
            setZ:999,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    if(!self.bgg) {
                        var bg = createBiaoge({
                            json: res.wtdysyxr_tableNode_json,
                            scale: 0.9,
                            inputNum:12,
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
        return true;
    },

    initUI: function () {
        var self = this
        loadPlist("do_plist")

        var createSp = function(sprite,pos,father){
            var sp = new cc.Sprite(sprite)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        createSp(res.zhuozi, cc.p(575,139), self)
        var deng = createSp("#deng.png", cc.p(550,330), self)
        var kaiguan = createSp("#switch1.png", cc.p(112,19), deng)
        var zhong = createSp("#zhong.png", cc.p(740,320), self)
        zhong.shi = createSp("#shi.png", cc.p(76,70), zhong)
        zhong.shi.setAnchorPoint(0.5,0)
        zhong.fen = createSp("#fen.png", cc.p(76,70), zhong)
        zhong.fen.setAnchorPoint(0.5,0)
        zhong.miao = createSp("#miao.png", cc.p(76,70), zhong)
        zhong.miao.setAnchorPoint(0.5,0)
        zhong.pot = createSp("#pot.png", cc.p(76,70), zhong)
        var jieshao = new cc.LabelTTF("1.从工具箱中拖出温度计和纸\n2.将纸包住温度计并放入台灯下\n3.打开开关后观察温度计的变化\n4.将数据填入表格中","",20)
        jieshao.setPosition(970,380)
        self.addChild(jieshao)

        var info = [{
                paper:["#hp1.png","#hp2.png","hp3.png","hp4.png","hp5.png"],
                pos: cc.p(300,540),
                wenzi: "黑色纸内温度计",
                dis: 14,
            },{
                paper:["#fp1.png","#fp2.png","fp3.png","fp4.png","fp5.png"],
                pos: cc.p(460,540),
                wenzi: "粉色纸内温度计",
                dis: 8,
            },{
                paper:["#lp1.png","#lp2.png","lp3.png","lp4.png","lp5.png"],
                pos: cc.p(620,540),
                wenzi: "铝箔纸内温度计",
                dis: 5,
            },{
                paper:["#bp1.png","#bp2.png","bp3.png","bp4.png","bp5.png"],
                pos: cc.p(780,540),
                wenzi: "白色纸内温度计",
                dis: 7,
            },{
                paper:["#hlp1.png","#hlp2.png","hlp3.png","hp4.png","hlp5.png"],
                pos: cc.p(940,540),
                wenzi: "黑色蜡纸内温度计",
                dis: 12,
        }]

        var lay = createLayout({
            pos:cc.p(250,50),
            size:cc.size(700,300),
            //op:200,
        })
        self.addChild(lay)

        var judgeList = [true,true,true,true,true]
        var judgePos = [550,630,710,470,390]
        var paperList = [null,null,null,null,null]
        var wdjList = [null,null,null,null,null]
        var curWdj = 0

        var rand = 1 + Math.floor(Math.random() * 10)
        cc.log(rand%2)
        if(rand % 2 == 0){
            rand = 1
        }else{
            rand = 1.07
        }
        //创建大的温度计
        var createFDJ = function(data){
            var pos = data.pos 
            var item = data.item
            var kuang = new cc.Sprite("#kuang.png")
            var bigfdj = new cc.ClippingNode(kuang)
            //bigfdj.setLocalZOrder(99)
            bigfdj.setPosition(pos)
            bigfdj.setAlphaThreshold(0)
            var bigwdj = new cc.Sprite("#bigwdj.png")
            bigfdj.addChild(bigwdj)
            bigwdj.setPosition(0,110)
            bigwdj.line = new cc.Sprite("#bigwdj_line.png")
            bigwdj.line.setPosition(23,73)
            bigwdj.addChild(bigwdj.line)
            bigwdj.line.setScaleY(rand)
            item.line = bigwdj.line
            bigwdj.line.setAnchorPoint(0.5,0)// 每次上升0.035个
            bigwdj.kd = new cc.Sprite("#bigwdj_kd.png")
            bigwdj.kd.setPosition(23,414)
            bigwdj.addChild(bigwdj.kd)
            self.addChild(bigfdj)
            bigfdj.fdj = new cc.Sprite("#kuang.png")
            bigfdj.fdj.setPosition(pos)
            self.addChild(bigfdj.fdj)
            bigfdj.fdj.setScale(1.03)
        }

        var expOver = false
        var expLoad  = false
        createTouchEvent({
            item:kaiguan,
            begin:function(data){
                var item = data.item
                var tip1 = false
                var tip2 = false 
                var tip3 = false
                if(expOver){
                    createDialog(5)
                    return false
                }else if(expLoad){
                    createDialog(4)
                    return false
                }
                for(var i = 0 ; i < 5 ; i++){
                    if(paperList[i]){
                        tip1 = true
                        var paper = paperList[i]
                        if(!paper.over)
                            tip2 = true
                        if(!paper.over || !paper.noMove)
                            tip3 = true
                        
                    }
                    if(wdjList[i]){
                        tip1 = true
                        var wdj = wdjList[i]
                        if(!wdj.over)
                            tip2 = true
                    }
                }
                if(!tip1){
                    createDialog(0)
                    return false
                }else if(tip2){
                    createDialog(1)
                    return false
                }else if(tip3){
                    createDialog(2)
                    return false
                }

                expLoad = true
                item.guang = createSp("#guang.png",cc.p(543,240),self)
                for(var i = 0 ; i < 5 ; i++){
                    if(paperList[i]){
                        var paper = paperList[i]
                        var myY = paper.getScaleY()+0.035*info[paper.curIndex].dis
                        paper.line.runAction(cc.scaleTo(2.7,1,myY))
                    }
                }
                zhong.miao.runAction(cc.repeatForever(cc.rotateBy(0.4,360)))
                zhong.shi.runAction(cc.rotateTo(3, 10))
                zhong.fen.runAction(cc.sequence(
                    cc.rotateTo(3, 90),
                    cc.callFunc(function(){
                        zhong.miao.stopAllActions()
                        zhong.miao.setRotation(0)
                        item.guang.removeFromParent()
                        createDialog(6)
                        expOver = true
                    })
                ))
                
                item.setSpriteFrame("switch2.png")
                return true
            },
            end:function(data){
                var item = data.item
                item.setSpriteFrame("switch1.png")
            }
        })

        var toolbtn = createTool({
            pos: cc.p(100, 510),
            nums: 3,
            scale:0.8,
            tri: "down",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -15),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [5, 1, 1, 1, 1, 1],
            swallow: [true, true, true, true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3, res.do_tools4, res.do_tools5, res.do_tools6],
            gets: ["#wdj.png",info[0].paper[1],info[1].paper[1],info[2].paper[1],info[3].paper[1],info[4].paper[1]],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                if(expOver){
                    createDialog(5)
                    return false
                }else if(expLoad){
                    createDialog(4)
                    return false
                }

                if(index == 0){
                    createFDJ({
                        item:item,
                        pos:info[curWdj].pos
                    })
                    wdjList[curWdj] = item
                    item.curIndex = curWdj
                    curWdj++
                    item.over = false
                }
                if(index > 0){
                    item.paper = createSp(info[index-1].paper[0],cc.p(53,77),item)
                    item.curIndex = index - 1
                    paperList[index-1] = item
                    item.over = false
                }
                return item 
            },
            clickfun: function(data){
                var index = data.index
                var item = data.sp
                if(item.noMove)
                    return false 
                return true 
            },
            movefun: function(data){
                var index = data.index
                var item = data.sp
                var delta = data.delta 
                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                }
                if(index == 0){//温度计
                    for(var i = 0 ; i < 5 ; i++){
                        if(paperList[i]){
                            var paper = paperList[i]
                            if(!paper.over && checkdistans(item,paper)){
                                paperFun(item, paper)
                            }
                        }
                    }  
                }
                if(index > 0){
                    if(!item.over){
                        for(var i = 0 ; i < 5 ; i++){
                            if(wdjList[i]){
                                var wdj = wdjList[i]
                                if(!item.over && !wdj.over && checkdistans(wdj,item)){
                                    paperFun(wdj, item)
                                }
                            }
                        }
                    }
                }
            },
            outfun: function(data){
                var index = data.index
                var item = data.sp
                var pos = data.pos
                if(index > 0 && item.over){
                    if(!item.noMove && judgeInside({item:lay,pos:pos})){//rectIntersectsRect(item,lay)
                        item.noMove = true
                        for(var i = 0 ; i < 5; i++){
                            if(judgeList[i]){
                                item.setPosition(judgePos[i],100)
                                var curIndex = item.wdj.curIndex
                                item.removeAllChildren(true)
                                wdjList[curIndex] = null
                                item.setSpriteFrame(info[item.curIndex].paper[4])
                                judgeList[i] = false
                                break
                            }
                        }   
                    }
                }
            },
            backfun: function(){
                return false 
            }
        })
        self.inside_node.addChild(toolbtn,1)
        self.toolbtn = toolbtn
        toolbtn.show()


        var paperFun = function(wdj,paper){
            paper.over = true
            wdj.over = true
            wdj.noMove = true
            paper.noMove = true
            paper.line = wdj.line
            paper.wdj = wdj
            safeAdd(paper,wdj)
            safeAdd(paper, paper.paper)
            wdj.setPosition(55,320)
            wdj.runAction(cc.sequence(
                cc.delayTime(0.2),
                cc.moveTo(0.5,55,190),
                cc.callFunc(function(){
                    paper.setSpriteFrame(info[paper.curIndex].paper[3])
                    paper.paper.setSpriteFrame(info[paper.curIndex].paper[2])
                    paper.paper.setPositionX(paper.paper.x-3)
                    paper.noMove = false
                    var wz = new cc.LabelTTF(info[paper.curIndex].wenzi,"",18)
                    wz.setPosition(wdj.line.getParent().getParent().x,450)
                    self.addChild(wz)
                    wz.setLocalZOrder(1)
                })
            ))
        }

        var  rectIntersectsRect = function (ra, rb) {
            var maxax = ra.x + ra.width/2,
                maxay = ra.y + ra.height/2,
                maxbx = rb.x + rb.width/2,
                maxby = rb.y + rb.height/2;
            return !(maxax < rb.x - rb.width/2 || 
                maxbx < ra.x - ra.width/2 || 
                maxay < rb.y - rb.height/2 ||
                maxby < ra.y - ra.height/2/2);
        }
        var imgList = [res.do1_tip1,res.do1_tip2,res.do1_tip3,res.do1_tip4,
            res.do1_tip5,res.do1_tip6,res.do1_tip7]
        var createDialog = function(index){
            AddDialog("Tips", {
                res: imgList[index],
                face: 2,
                confirmBtn:true,
            })
        }

        var checkdistans = function(ra,rb){
            var dx =  ra.x - rb.x
            var dy = (ra.y-ra.height/2) - (rb.y+rb.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 40)
                return true
            else
                return false
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
    },
})