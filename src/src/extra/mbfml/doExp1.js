/**
 * Created by Administrator on 2016/6/12.
 */
var tableFlag = true
var curIndex = 40
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    myDelete: function() {
        this.dataControl.bottle.release()
        //if (this.stopMusic) {
            stopMusic()
        //}
    },
    ctor: function () {
        var self = this
        var haveTable = false
        this._super()
        this.expCtor({
            settingData:{
                biaogeFun:function(){
                    if(!haveTable) {
                        haveTable = true
                        self.table()
                    }else{
                        if(tableFlag){
                            self.tableShowOut()
                            tableFlag = false
                        }else{
                            self.tableShowIn()
                            tableFlag = true
                        }
                    }
                },
                pos: cc.p(1080, 580),
            }
        })
        self.dataControl = {}
        this.initPeople()
        this.initUI()
        
        return true
    },
    //dataControl:{},
    changeZ:function(item, z){
        var par = item.getParent()
        item.retain()
        item.removeFromParent()
        item.setLocalZOrder(z)
        par.addChild(item)
        item.release()
        return item
    },
    initUI:function() {
        var self = this
        loadPlist("dgxs")
        loadPlist("back")
        loadPlist("mould")
        loadPlist("blowMould")
        loadPlist("mouldPiece")
        loadPlist("mouldBack")
        loadPlist("mouldTwo")
        loadPlist("iceBox")

        self.nodebs.show(function() {
            self.nodebs.say({key:"tip1"})
        })

        var dataControl = self.dataControl
        var bg = new cc.Sprite(res.doBg2)
        bg.setPosition(cc.p(568,321))
        self.inside_node.addChild(bg)
        var desk = new cc.Sprite(res.desk)
        desk.setPosition(cc.p(568,321))
        self.inside_node.addChild(desk)

        dataControl.bg = bg
        var haveBread = false
        dataControl.haveBread = haveBread

        var sewer = new cc.Sprite(res.sewer)//下水道
        sewer.setPosition(cc.p(910,350))
        self.addChild(sewer)
        sewer.setScale(1.2)
        dataControl.sewer = sewer
        dataControl.sewer.setVisible(false)

        var dg = new cc.Sprite("#dg01.png")
        dg.setPosition(cc.p(50,200))
        dg.setAnchorPoint(0.11,0.47)

        var bottle = new cc.Sprite(res.bottle)
        bottle.setPosition(cc.p(930,170))
        self.addChild(bottle,20)
        bottle.addChild(dg)
        var digai = new cc.Sprite(res.digai)
        digai.setPosition(dg.convertToWorldSpace(cc.p(20,180)))
        self.addChild(digai)

        dg.rootOrder = dg.getLocalZOrder()
        dg.setLocalZOrder(-1)

        var aniNode = new cc.Node()
        aniNode.setPosition(cc.p(810,100))
        self.addChild(aniNode,20)
        dataControl.aniNode = aniNode

        dataControl.dg = dg
        dataControl.digai = digai
        dataControl.bottle = bottle
        var haveWater = false
        dataControl.haveWater = haveWater
        var firstdigai = true
        dataControl.firstdigai = firstdigai
        dataControl.bottle.setVisible(false)
        dataControl.digai.setVisible(false)
        dataControl.bottle.retain()         //防止回收后不见了

        var canSewer = false  //面包能放入下水道中
        dataControl.canSewer = canSewer
        var canRemove_sewer = false     //面包能从下水道中移出，移除下水道图片
        dataControl.canRemove_sewer = canRemove_sewer
        var secondBread = false      //可以第二次拖面包
        dataControl.secondBread = secondBread
        var haveMould = false
        dataControl.haveMould = haveMould
        dataControl.boxLocal = 20

        //用于判断提示对话框
        dataControl.dialogTip = [true,false,false,false,false,false,false,false]

        //创建工具箱
        self.createTool()
    },
    createTool:function() {
        var self = this
        var dataControl = self.dataControl
        var partBread = 1   //拖动的第几个面包
        dataControl.partBread = partBread
        dataControl.curblow = false // 牙签正在刮霉，不能移动
        dataControl.canplay = true
        dataControl.counts = 0
        dataControl.canDrop = false
        dataControl.isClip = false  //判断面包是否被夹住了
        dataControl.curClipNum = 0
        dataControl.canDropBag = false  //袋子能存放起来
        dataControl.inSewer = false     //面包在下水道中
        dataControl.inWater = false   //滴管正在滴水不能移动
        dataControl.bagCount = 0    //判断四个袋子都已经放入四个位置中

        var judgeList = false
        var toolbtn = createTool({
            pos: cc.p(100, 500),
            nums: 2,
            tri: "down",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.6, 1.3),
            itempos: cc.p(0, -20),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            father: self,
            counts: [5, 1, 1, 4, 1],
            swallow: [true, true, true, true],
            files: [res.tool_1, res.tool_2, res.tool_3, res.tool_4, res.tool_5],
            gets: [res.bread, null, "#blowMould01.png", null, res.niezi],
            firstClick: function (data) {
                var index = data.index
                var pos = data.pos
                var item = data.sp

                if(index != 0 && index != 1 && dataControl.dialogTip[0]){
                    self.createDialog(1)
                    return  false
                }else if(dataControl.dialogTip[1]){
                    if(index != 1){
                        self.createDialog(11)
                        return  false
                    }
                }else if(dataControl.dialogTip[2]){
                    self.createDialog(2)
                    return  false
                }else if(dataControl.dialogTip[3]){
                    self.createDialog(3)
                    return  false
                }else if(dataControl.dialogTip[4]){
                    if(index != 0 && index != 1){
                        self.createDialog(4)
                        return  false
                    }
                }else if(dataControl.dialogTip[5]){
                    if(index == 3 || index == 4){
                        self.createDialog(5)
                        return  false
                    }
                }else if(dataControl.dialogTip[6]){
                    if(index == 3 || index == 4){
                        self.createDialog(6)
                        return  false
                    }
                }
                if (index == 1) {
                    dataControl.bottle.setVisible(true)
                    return dataControl.bottle
                } if(index == 0){
                     if(toolbtn.getindex(0)){
                         if(toolbtn.getindex(0).length>=1){
                             var mouldPiece = new cc.Sprite("#mouldPiece10.png")
                             mouldPiece.setPosition(cc.p(60,50))
                             item.addChild(mouldPiece)
                             if(!dataControl.judgeList){
                                judgeList = true
                                dataControl.judgeList = [1,1,1,1]
                             }
                             item.num = self.getBreadNum() + 1
                         }
                     }else
                        item.num = 0
                    item.noMove = false
                    item.flag = true        //判断面包是否有沾到霉块
                    item.canBack = true     //判断面包是否有沾到水变黑
                    item.back = true        //判断面包能否回收
                }else if(index == 2){
                    item.setLocalZOrder(21)
                }else if(index == 4){
                    item.setLocalZOrder(22)
                    item.setAnchorPoint(0.65,0.6)
                }else if(index == 3){
                    item = new cc.Sprite(res.bagAfter)
                    if(!dataControl.judgeBagList){
                        dataControl.judgeBagList = [1,1,1,1]
                    }
                    item.num = self.getBagNum()

                    var bagBefore = new cc.Sprite(res.bagBefore)
                    bagBefore.setPosition(cc.p(89,140))
                    item.addChild(bagBefore,2)
                    var num = new cc.Sprite(self.getBagPos(item.num,2))
                    num.setPosition(cc.p(120,200))
                    item.addChild(num,3)
                    item.outBag = true
                    item.isend = false                //该属性用于判断袋子已经不能动了
                    item.back = true
                }
                return item
            },
            clickfun: function (data) {
                var index = data.index
                var item = data.sp
                var pos = data.pos

                if(index == 0 && dataControl.dialogTip[3] && item.getScale() != 1){
                    self.createDialog(3)   //面包在下水道中，点击后提示对话框
                    return  false
                }

                if(index == 0 && dataControl.canRemove_sewer && item.getScale() != 1){
                    item.setScale(1)
                    self.fdjDisappear()
                }else if(index == 0){
                    if(dataControl.canDrop){
                        self.createDialog(7)
                        return  false
                    }
                    item.setLocalZOrder(10)
                }
                if(index == 2)
                    item.setPosition(pos)
                if(index == 4){
                    item.setPosition(pos)
                    self.clipBread(item)   //夹取面包
                }
                if(index == 3 && dataControl.dialogTip[7]){
                    self.createDialog(3)
                    return false
                }
                return true
            },
            movefun: function (data) {
                var delta = data.delta
                var index = data.index
                var item = data.sp
                var pos = data.pos
                if(index == 2){
                    if(dataControl.curblow)
                        return  false        //判断是否在播动画，在播动画的时候不能被移动
                    self.blowMould(item)   //面包在刮霉
                    if(dataControl.haveMould){
                      self.releaseMould(item)    //判断有霉，可以放到四个面包上
                    }
                }
                //面包放入下水道中，只调用一次
                if(index == 0){
                    if(dataControl.inSewer){
                        return false
                    }
                    if(dataControl.canSewer){
                        self.breadInSewer(item)
                    }
                    if(item.noMove)
                        return false
                }
                if(index == 4){
                    if(dataControl.isClip){  //判断面包被夹住，跟着镊子一起移动
                        self.pickBag(item)   //将面包放入袋子中
                    }
                }
                if(index == 3) {
                    if(item.isend)
                        return  false
                    if(dataControl.canDropBag)
                        self.bagPutIn(item)  //袋子放入四个地方
                }
                item.x += delta.x
                item.y += delta.y
            },
            outfun:function (data) {
                var delta = data.delta
                var item = data.sp
                var index = data.index

                if (index == 0 && item.getScale() == 1) {//拖出来的是面包
                    if(!dataControl.secondBread && !dataControl.canRemove_sewer){
                        item.setPosition(cc.p(810, 100))
                        dataControl.haveBread = true
                    }else{
                        item.setPosition(cc.p(self.getNewPos(item.num), 100))
                        if(self.getCurrent(0).length >= 4 && dataControl.dialogTip[5]){
                            dataControl.dialogTip[5] = false
                            dataControl.dialogTip[6] = true
                        }
                    }
                } else if (index == 1) {                                //拖出水
                    dataControl.bottle.setPosition(cc.p(930, 170))
                }

                if(index == 4){
                    if(dataControl.isClip){
                        var bread = self.getCurrent(0)[dataControl.curClipNum]
                        bread.setPosition(cc.p(self.getNewPos(dataControl.curClipNum),100))
                        dataControl.isClip = false
                        item.setTexture(res.niezi)
                    }
                }

                if(index == 3 && !item.isend){
                    item.setPosition(cc.p(self.getBagPos(item.num,1),310))
                }

                //判断是否已经拖出了面包用于提示应该滴水了
                if(self.getCurrent(0) && !dataControl.dialogTip[1] && dataControl.dialogTip[0]){
                    dataControl.dialogTip[1] = true
                    dataControl.dialogTip[0] = false
                }

            },
            backfun:function(data){
                var item = data.sp
                var index = data.index
                if(index == 2){
                    return false
                }
                if(index == 0 || index == 3){
                    if(!item.back)   return false
                }
                if(index == 0){
                    if(item.num >= 1){
                        dataControl.judgeList[item.num - 1] = 1
                    }
                }else if(index == 3){
                    //bagAgainNum[item.num] = false
                    if(item.num >= 0){
                        dataControl.judgeBagList[item.num] = 1
                    }
                }
                return true
            }
        })
        this.toolbtn = toolbtn
        this.addChild(toolbtn)
        toolbtn.show()

        createTouchEvent({
            item:dataControl.digai,
            begin:function(data){
                var item = data.item
                var location = data.pos
                var pos = item.convertToNodeSpace(location)
                if(!dataControl.bottle.isVisible())     return false

                if(dataControl.dialogTip[5]){
                    self.createDialog(5)
                    return false
                }else if(dataControl.dialogTip[6] && !dataControl.canDrop){
                    self.createDialog(6)
                    return false
                }
                dataControl.dg.runAction(anidgxs())
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta;
                var location = data.pos
                var pos = item.convertToNodeSpace(location)
                if(!dataControl.haveWater)
                    return false
                if(dataControl.inWater)
                    return false
                dataControl.dg.x = pos.x+30;
                dataControl.dg.y = pos.y+50;

                if(dataControl.haveBread && self.rectContainsPoint(self.getCurrent(0)[0],dataControl.dg)){
                    dataControl.dg.setVisible(false)
                    dataControl.aniNode.setLocalZOrder(dataControl.bottle.getLocalZOrder()+1)
                    self.playAni(dataControl.aniNode,res.dgdsAni,245,1)
                    self.playBackAni()
                    dataControl.haveBread = false
                    dataControl.canSewer = true
                    self.getCurrent(0)[0].back = false
                    self.getCurrent(0)[0].pause()
                }
                if(dataControl.canDrop){            //判断可以滴水到已经沾有霉块的面包上
                    self.releaseWater()
                }
            },
            end:function(data){
                dataControl.dg.setSpriteFrame("dg01.png")
                dataControl.dg.setPosition(cc.p(50,200))
                dataControl.dg = self.changeZ(dataControl.dg, -1)
                dataControl.haveWater = false
            }
        })

        var anidgxs = function () {
            return cc.sequence(createAnimation({
                frame: "dg%02d.png",
                end: 12,
                time: 0.04
            }), cc.callFunc(function () {
                dataControl.dg.stopAllActions()
                dataControl.dg.setSpriteFrame("dg12.png")
                dataControl.haveWater = true
                dataControl.dg.setPositionY(dataControl.dg.y - 120)
                dataControl.dg = self.changeZ(dataControl.dg, dataControl.dg.rootOrder)
            }))
        }
    },

    createMirrorBox:function(index,bread){
        var self = this

        var mould1 = function(){
            return cc.sequence(createAnimation({
                frame: "mouldTwo%02d.png",
                start:12,
                end: 15,
                time: 2.8
            }))
        }
        var mould2 = function(){
            return cc.sequence(createAnimation({
                frame: "mouldTwo%02d.png",
                end: 7,
                time: 2.3
            }))
        }
        var mould4 = function(){
            return cc.sequence(createAnimation({
                frame: "mouldTwo%02d.png",
                end: 11,
                time: 2.2
            }))
        }
        var dataControl = self.dataControl
        var node = ccs.load(res.mirrorBox).node
        self.addChild(node)
        node.setPosition(cc.p(640,320))
        var boxBg = node.getChildByName("boxBg")
        var panel = boxBg.getChildByName("panel")
        var mould = panel.getChildByName("mould")
        var num = boxBg.getChildByName("num")
        var wenzi = boxBg.getChildByName("wenzi")
        var mirrorBg = panel.getChildByName("mirrorBg")
        mould.setScale(0.85)
        switch (index){
            case 1:
                node.setPosition(500,500)
                mould.runAction(mould1())
                //mould.setSpriteFrame("mouldBack10.png")
                bread.runAction(mould1())
                break
            case 2:
                node.setPosition(710,500)
                mirrorBg.setTexture(res.mirrorBg2)
                num.setTexture(res.num2)
                mould.runAction(mould2())
                bread.runAction(mould2())
                break
            case 3:
                node.setPosition(500,290)
                mirrorBg.setTexture(res.mirrorBg3)
                num.setTexture(res.num3)
                wenzi.setTexture(res.wenzi2)
                mould.setSpriteFrame("mouldBack10.png")
                //bread.runAction(mould1())
                bread.setSpriteFrame("mouldBack10.png")
                break
            case 4:
                node.setPosition(710,290)
                mirrorBg.setTexture(res.mirrorBg4)
                num.setTexture(res.num4)
                wenzi.setTexture(res.wenzi3)
                mould.runAction(mould4())
                break
        }
        createTouchEvent({
            item:boxBg,
            begin:function(data){
                var item = data.item
                node.setLocalZOrder(dataControl.boxLocal)
                dataControl.boxLocal++
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta;
                item.x += delta.x
                item.y += delta.y
            }
        })
    },
    //把袋子放入四个位置存储
    bagPutIn:function(item){
        var self = this
        if(item.num == 0 && self.checkDistans(item,800,275,100)){
            item.setPosition(cc.p(750,280))
            self.setBag(item)
        }else if(item.num == 1 && self.checkDistans(item,900,275,100)){
            item.setPosition(cc.p(860,280))
            self.setBag(item)
        }else if(item.num == 2 && self.checkDistans(item,280,390,100)){
            item.setPosition(cc.p(285,390))
            self.iceAction(item)
            self.setBag(item)
        }else if(item.num == 3 && self.checkDistans(item,420,430,100)){
            item.setPosition(cc.p(430,430))
            self.setBag(item)
        }
    },

    iceAction:function(item){
        var self = this
        var aniIce = function(){
            return cc.sequence(createAnimation({
                frame: "iceBox%02d.png",
                end: 8,
                time: 0.3
            }), cc.callFunc(function () {
                item.setVisible(true)
                item.setOpacity(180)
            }))
        }

        var ice = new cc.Sprite("#iceBox01.png")
        self.inside_node.addChild(ice)
        ice.setPosition(cc.p(345,420))
        ice.runAction(aniIce())

        ice.scheduleOnce(function(){
            item.setVisible(false)
        },1.5)
    },

    blowMould:function(item){
        var self = this
        var dataControl = self.dataControl
        var bread_0 = self.getCurrent(0)[0]
        var aniblow = function (item) {
            return cc.sequence(createAnimation({
                frame: "blowMould%02d.png",
                end: 16,
                time: 0.1
            }), cc.callFunc(function () {
                item.resume()
                bread_0.resume()
                item.setPosition(cc.p(bread_0.x+55,bread_0.y+55))
                dataControl.curblow = false
                dataControl.haveMould = true
                item.setSpriteFrame("blowMould16.png")
            }))
        }
        var rect = cc.rect(bread_0.x-bread_0.width/2,bread_0.y-bread_0.height/2,bread_0.width,bread_0.height)
        if(dataControl.canplay && cc.rectContainsPoint(rect,cc.p(item.x-item.width/2,item.y-item.height/2))){
            item.pause()     //判断在刮霉中
            bread_0.pause()
            dataControl.curblow = true
            item.setPosition(cc.p(bread_0.x+120,bread_0.y+55))
            dataControl.canplay = false
            item.runAction(aniblow(item))
        }
    },

    //给袋子设置最后的属性放入物体中
    setBag:function(item){
        var self = this
        var dataControl = self.dataControl
        //item.pause()
        item.setScale(0.35)
        item.isend = true

        var count = 0
        for(var i=0;i<4;i++){
            if(self.getCurrent(3)[i].isend){
                count++
                if(count >= 4){
                    dataControl.dialogTip[7] = true
                    self.showTime()
                    var bread = self.getCurrent(0)
                    self.createMirrorBox(1,bread[1].getChildren()[0])
                    self.createMirrorBox(2,bread[2].getChildren()[0])
                    self.createMirrorBox(3,bread[3].getChildren()[0])
                    self.createMirrorBox(4,bread[4].getChildren()[0])
                }
            }
        }
    },

    //把面包放入袋子中,此处item为镊子
    pickBag:function(item){
        var self = this
        var dataControl = self.dataControl
        var bread = self.getCurrent(0)
        bread[dataControl.curClipNum].x = item.x - 90
        bread[dataControl.curClipNum].y = item.y - 120
        var baglist = self.toolbtn.getindex(3)
        var num = dataControl.curClipNum
        for(var k in baglist){
            if(baglist[k].outBag && self.bagRectBread(bread[num],baglist[k])){
                var bag = baglist[k]
                if(bag.num == 0 && !bread[num].canBack){
                    self.createDialog(10)
                    return false
                }else if(bag.num != 0 && bread[num].canBack){
                    self.createDialog(9)
                    return false
                }
                item.setVisible(false)
                item.pause()
                bag.outBag = false
                bag.back = false
                dataControl.counts++                        //判断是否四块面包都放入袋子中
                var bagAni = ccs.load(res.bagAni).node
                var node = bagAni.getChildByName("node")
                bread[num].retain()
                bread[num].removeFromParent(false)
                bread[num].setPosition(cc.p(0,0))
                node.addChild(bread[dataControl.curClipNum])
                bread[num].release()
                bagAni.curpagnum = k

                var bagAniac = ccs.load(res.bagAni).action
                bag.setVisible(false)
                dataControl.aniNode.setPosition(cc.p(bag.x,bag.y))
                dataControl.aniNode.addChild(bagAni)
                var numImg = new cc.Sprite(self.getBagPos(bag.num,2))  //给动画上添加数字标签
                numImg.setPosition(cc.p(32,44))
                bagAni.addChild(numImg)
                bagAniac.gotoFrameAndPlay(0,60,false)
                bagAniac.setLastFrameCallFunc(function(){
                    //var bag = self.getCurrent(3)[bagAni.curpagnum]
                    bread[num].retain()
                    bread[num].removeFromParent(false)
                    bag.addChild(bread[num],0)
                    bread[num].setPosition(cc.p(90,130))
                    bread[num].release()

                    bag.setVisible(true)
                    bag.getChildren()[0].setTexture(res.bagBeforeLast)
                    bag.setTexture(res.bagAfterLast)
                    bread[dataControl.curClipNum].pause()
                    dataControl.aniNode.removeAllChildren()
                    item.setVisible(true)
                    item.resume()
                    item.setTexture(res.niezi)
                    item.setPosition(cc.p(bag.x+40,bag.y+60))
                    dataControl.isClip = false
                    if(dataControl.counts >= 4){
                        dataControl.bg.setTexture(res.doBg)
                        dataControl.counts = 0
                        dataControl.canDropBag = true
                        item.removeFromParent()
                        self.nodebs.say({key:"tip5"})
                    }
                })
                bagAni.runAction(bagAniac)
                break
            }
        }
    },

    //用镊子夹取面包
    clipBread : function(niezi){
        var self = this
        var dataControl = self.dataControl
        var bread = self.getCurrent(0)
        for(var i=1;i<bread.length;i++) {
            if (self.breadRectNiezi(bread[i],niezi)) {
                niezi.setTexture(res.nieziSel)
                niezi.setLocalZOrder(25)
                bread[i].setLocalZOrder(24)
                bread[i].setPosition(cc.p(niezi.x-90,niezi.y-120))
                dataControl.isClip = true
                dataControl.curClipNum = i
                break
            }
        }
    },

    //从牙签上放霉到三个面包上
    releaseMould:function(item){

        var self = this
        var dataControl = self.dataControl
        var bread = self.getCurrent(0)
        var animouldPiece = function(){
            return cc.sequence(createAnimation({
                frame: "mouldPiece%02d.png",
                end: 9,
                time: 0.65
            }), cc.callFunc(function () {
                //mouldPiece.setSpriteFrame("mouldPiece01.png")
            }))
        }

        for(var i=1;i<bread.length;i++){
                if(cc.rectIntersectsRect(item,bread[i])&&bread[i].flag){
                    bread[i].pause()
                    item.setVisible(false)
                    dataControl.haveMould = false
                    dataControl.aniNode.setPosition(bread[i].getPosition())
                    self.playAni(dataControl.aniNode,res.putMouldAni,130)
                    var mouldPiece = bread[i].getChildren()[0]
                    mouldPiece.runAction(self.animouldPiece())
                    item.curindex = i
                    dataControl.counts++
                    bread[i].flag = false
                    bread[i].back = false
                    bread[i].noMove = true
                    bread[i].resume()
                    item.scheduleOnce(function(){
                        item.setVisible(true)
                        bread[i].noMove = false
                        dataControl.canplay = true
                        item.setSpriteFrame("blowMould01.png")
                        item.setPosition(cc.p(bread[item.curindex].x+130,bread[item.curindex].y+55))
                        if(dataControl.counts>=4){
                            item.removeFromParent()
                            bread[0].removeFromParent()
                            dataControl.canDrop = true
                            dataControl.counts = 0
                            self.nodebs.say({key:"tip3"})
                        }
                    },6.5)
                    break
                }
        }
    },
    //滴管上面滴水到发霉的面包上
    releaseWater:function(){
        var self = this
        var dataControl = self.dataControl
        var animouldBack = function () {
            return cc.sequence(createAnimation({
                frame: "mouldBack%02d.png",
                end: 10,
                time: 1.02
            }), cc.callFunc(function () {

            }))
        }
        var bread = self.getCurrent(0)
        for(var i=1;i<bread.length;i++){
            if(self.rectContainsPoint(bread[i],dataControl.dg) && bread[i].canBack){
                dataControl.dg.setPosition(cc.p(50,200))
                dataControl.dg.pause()
                dataControl.inWater = true
                dataControl.dg.setVisible(false)
                dataControl.aniNode.setPosition(cc.p(bread[i].x,bread[i].y-5))
                dataControl.counts++
                self.playAni(dataControl.aniNode,res.dgdsAni,245,2)
                var mouldPiece = bread[i].getChildren()[0]
                mouldPiece.runAction(animouldBack())
                bread[i].canBack = false
                bread[i].back = false
                if(dataControl.counts >= 3){
                    //dataControl.dialogTip[6] = false
                    //dataControl.dialogTip[7] = true
                    //self.nodebs.say({key:"tip4"})
                }
                break
            }
        }

    },
    //将面包放入下水道中
    breadInSewer : function(item){
        var self = this
        var dataControl = self.dataControl
        if(cc.rectIntersectsRect(item,dataControl.sewer)){
            item.setPosition(cc.p(970,250))
            item.setScale(0.4)
            self.showDay()
            dataControl.canSewer = false
            dataControl.inSewer = true
            //item.pause()
            dataControl.dialogTip[2] = false
            dataControl.dialogTip[3] = true
        }
    },

    animouldPiece:function(){
        return cc.sequence(createAnimation({
            frame: "mouldPiece%02d.png",
            end: 9,
            time: 0.8
        }), cc.callFunc(function () {

        }))
    },

    getNewPos:function(part){
        var breadPos = [
            {part:0,posX:810},
            {part:1,posX:300},
            {part:2,posX:430},
            {part:3,posX:560},
            {part:4,posX:690},
        ]
        for(var i =0; i< breadPos.length; i++){
            var temp = breadPos[i]
            if(part == temp.part){
                return temp.posX
            }
        }
    },

    getBagPos : function(part,index){
        if(index == 1){
            var bagPos = [
                {part:0,posX:360},
                {part:1,posX:540},
                {part:2,posX:720},
                {part:3,posX:900},
            ]
            for(var i =0; i< bagPos.length; i++){
                var temp = bagPos[i]
                if(part == temp.part){
                    return temp.posX
                }
            }
        }else{
            var bagPos = [
                {part:0,res:res.num1},
                {part:1,res:res.num2},
                {part:2,res:res.num3},
                {part:3,res:res.num4},
            ]
            for(var i =0; i< bagPos.length; i++){
                var temp = bagPos[i]
                if(part == temp.part){
                    return temp.res
                }
            }
        }
    },

    showDay:function(){
        var self = this
        var dataControl = self.dataControl
        var timeDay = new cc.Sprite(res.timeDay)
        timeDay.setPosition(cc.p(568,220))
        self.addChild(timeDay)

        var timedaytxt = new cc.LabelTTF("1","",28)
        timedaytxt.setPosition(cc.p(155,25))
        timedaytxt.setColor(cc.color(33,173,223))
        timeDay.addChild(timedaytxt);

        //显示放大镜的效果
        var sewerfdj = new cc.Sprite(res.sewerfdj)
        sewerfdj.setPosition(cc.p(568,350))
        self.addChild(sewerfdj)

        var bread = new cc.Sprite(res.bread)
        bread.setPosition(cc.p(100,110))
        sewerfdj.addChild(bread)

        dataControl.sewerfdj = sewerfdj
        dataControl.timeDay = timeDay

        createTouchEvent({
            item:sewerfdj,
            begin:function(data){
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta;
                item.x += delta.x
                item.y += delta.y
            }
        })

        var timedata = 0;
        timedaytxt.schedule(function(){
            timedata++
            timedaytxt.setString(timedata)
            if(timedata == 7){
                timedaytxt.unscheduleAllCallbacks()
                dataControl.canRemove_sewer = true
                //self.getCurrent(0)[0].resume()
                dataControl.inSewer = false
                self.nodebs.say({key:"tip2"})
                dataControl.dialogTip[3] = false
                dataControl.dialogTip[4] = true
            }

        },2)

        var animould = function () {
            return cc.sequence(createAnimation({
                frame: "mould%02d.png",
                end: 15,
                time: 0.8
            }), cc.callFunc(function () {
                mould.setSpriteFrame("mould15.png")
            }))
        }

        var mould = new cc.Sprite("#back12.png")
        mould.setPosition(cc.p(61,40))
        bread.addChild(mould)
        mould.setScale(0.85)
        mould.runAction(animould())

        dataControl.back.runAction(animould())
        dataControl.back.setScale(0.85)
    },

    //最后开启时间计时器
    showTime : function(){
        var self = this
        var dataControl = self.dataControl
        if(!dataControl.timeDay)    return false

        var time = dataControl.timeDay
        time.setVisible(true)
        time.setPosition(cc.p(568,140))

        var timeText = time.getChildren()[0]
        timeText.setString(0)

        var timedata = 0;
        timeText.schedule(function(){
            timedata++
            timeText.setString(timedata)
            if(timedata == 7){
                timeText.unscheduleAllCallbacks()
                self.nodebs.say({key:"tip6"})
            }
        },3)

    },

    playBackAni:function(){
        var self = this
        var dataControl = self.dataControl
        var aniback = function () {
            return cc.sequence(createAnimation({
                frame: "back%02d.png",
                start:02,
                end: 12,
                time: 0.86
            }), cc.callFunc(function () {
                back.setSpriteFrame("back12.png")
                //dataControl.sewer.setVisible(true) //下水道显示出现
            }))
        }

        var bread = self.getCurrent(0)[0]
        var back = new cc.Sprite("#back01.png")
        back.setPosition(cc.p(61,40))
        bread.addChild(back)
        dataControl.back = back

        dataControl.back.runAction(aniback())

    },

    playAni:function(node,name,frame,index){
        var self = this
        var dataControl = this.dataControl
        node.removeAllChildren();
        var sp = ccs.load(name).node;
        var ac = ccs.load(name).action;
        node.addChild(sp);
        ac.gotoFrameAndPlay(0,frame,false);
        ac.setLastFrameCallFunc(function(){
            if(index == 1){
                dataControl.dg.setVisible(true)
                dataControl.bottle.forceBack(false)
                dataControl.sewer.setVisible(true) //下水道显示出现
                self.getCurrent(0)[0].resume()
                dataControl.dialogTip[1] = false
                dataControl.dialogTip[2] = true
            }else if(index == 2){
                dataControl.dg.setVisible(true)
                dataControl.dg.resume()
                dataControl.inWater = false
                if(dataControl.counts >= 3){
                    dataControl.counts = 0
                    dataControl.dialogTip[6] = false
                    dataControl.bottle.removeFromParent()
                    dataControl.digai.removeFromParent()
                    self.nodebs.say({key:"tip4"})
                }
            }
            node.removeAllChildren();
        });
        sp.runAction(ac);
    },

    getCurrent:function(index){
        var self = this
        return self.toolbtn.getindex(index)
    },

    fdjDisappear:function(){
        var dataControl = this.dataControl
        dataControl.sewer.setVisible(false)
        dataControl.sewer.setPosition(cc.p(320,-600))
        dataControl.sewerfdj.setVisible(false)
        dataControl.sewerfdj.setPosition(cc.p(320,-600))
        dataControl.timeDay.setVisible(false)
        dataControl.timeDay.setPosition(cc.p(320,-600))
        dataControl.secondBread = true
        dataControl.dialogTip[4] = false
        dataControl.dialogTip[5] = true
    },

    rectContainsPoint : function (rect, point) {
        var self = this
        var dataControl = self.dataControl
        var ret = false;
        var pointPos = dataControl.bottle.convertToWorldSpace(point.getPosition())
        if (pointPos.x >= rect.x-10 &&
            pointPos.x <= rect.x + rect.width &&
            pointPos.y - 40 >= rect.y &&
            pointPos.y - 40 <= rect.y + rect.height+10) {
            ret = true;
        }
        return ret;
    },

    breadRectNiezi : function(rect,point){
        if (point.x - 40 >= rect.x - rect.width &&
            point.x - 40 <= rect.x + rect.width &&
            point.y - 40 >= rect.y - rect.height &&
            point.y - 40 <= rect.y + rect.height ) {
            return true
        }
        return false
    },

    bagRectBread : function (rect, point) {
        var ret = false;
        if (point.x >= rect.x - rect.width &&
            point.x <= rect.x + rect.width &&
            point.y + 140 >= rect.y - rect.height &&
            point.y + 140 <= rect.y + rect.height) {
            ret = true;
        }
        return ret;
    },

    checkDistans:function(target1,posX,posY,dis) {
        var dx = target1.x - posX
        var dy = target1.y - posY
        var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
        if (distance <= dis)
            return true
        else
            return false
    },

    initPeople:function(){
        this.nodebs = addPeople({
            id:"student",
            pos:cc.p(1030, 130)
        })
        this.addChild(this.nodebs,100)
        addContent({
            people: this.nodebs,
            key: "tip1",
            img: res.tip1,
            sound: res.soundTip1
        })
        addContent({
            people: this.nodebs,
            key: "tip2",
            img: res.tip2,
            sound: res.soundTip2
        })
        addContent({
            people: this.nodebs,
            key: "tip3",
            img: res.tip3,
            sound: res.soundTip3
        })
        addContent({
            people: this.nodebs,
            key: "tip4",
            img: res.tip4,
            sound: res.soundTip4
        })
        addContent({
            people: this.nodebs,
            key: "tip5",
            img: res.tip5,
            sound: res.soundTip5
        })
        addContent({
            people: this.nodebs,
            key: "tip6",
            img: res.tip6,
            sound: res.soundTip6
        })
    },

    createDialog : function(index){
        var img = null
        switch (index){
            case 1:img = res.doTip1
                break
            case 2:img = res.doTip2
                break
            case 3:img = res.doTip3
                break
            case 4:img = res.doTip4
                break
            case 5:img = res.doTip5
                break
            case 6:img = res.doTip6
                break
            case 7:img = res.doTip7
                break
            case 8:img = res.doTip8
                break
            case 9:img = res.doTip9
                break
            case 10:img = res.doTip10
                break
            case 11:img = res.doTip11
                break
        }
        if(!img)    return
        AddDialog("Tips", {
            res: img,
            face: 2,
            confirmBtn:true,
        })
    },

    table:function(){
        var self = this
        var table = ccs.load(res.mbfml_table).node
        table.setPosition(cc.p(568,320))
        self.addChild(table,1000)

        tableBg = table.getChildByName("tableBg")
        var panel = tableBg.getChildByName("Panel");
        var panelMove = panel.getChildByName("Panel2");

        self.showImg(tableBg,1)
        var yesList = []
        var noList = []
        var resultList = []
        var tagFlag = true
        var tag = 0
        var resultArray = [2,1,2,1]
        var curresultArray = [0,0,0,0]

        resultImg = table.getChildByName("resultImg")
        self.showImg(resultImg,2)
        var resultCloseBtn = resultImg.getChildByName("resultCloseBtn")
        var closeBtn = tableBg.getChildByName("closebtn")
        var clearBtn = tableBg.getChildByName("clearbtn")
        var resultBtn = tableBg.getChildByName("resultbtn")
        var submitBtn = tableBg.getChildByName("submitbtn")
        var conBtn = tableBg.getChildByName("conbtn")

        for(var i = 1;i < 5;i++) {
            var cellName = "cellbtn" + i
            var cellBtn = tableBg.getChildByName(cellName)
            cellBtn.setTag(10 + i)

            var laName = "labtn" + i
            var laBtn = tableBg.getChildByName(laName)
            laBtn.setTag(10 + i)

            var resultName = "result" + i
            var result = tableBg.getChildByName(resultName)
            resultList.push(result)

            cellBtn.addClickEventListener(function(){
                if(tag == this.getTag() && tagFlag){
                    self.move_Panel_in(panelMove,panel);
                    tagFlag = false;
                    return ;
                }
                self.move_Panel_out(panelMove,panel);
                panel.setPosition(cc.p(this.x+17,this.y-15));
                tag = this.getTag();
                tagFlag = true;
            })

            laBtn.addClickEventListener(function(){
                if(tag == this.getTag() && tagFlag){
                    self.move_Panel_in(panelMove,panel);
                    tagFlag = false;
                    return;
                }
                self.move_Panel_out(panelMove,panel);
                panel.setPosition(cc.p(this.x-38,this.y-15));
                tag = this.getTag();
                tagFlag = true;
            })

            var noName = "no" + i
            var no = tableBg.getChildByName(noName)
            var yesName = "yes" + i
            var yes = tableBg.getChildByName(yesName)


            yes.setVisible(false)
            no.setVisible(false)
            yes.setScale(0.6)
            no.setScale(0.6)
            yesList.push(yes)
            noList.push(no)
        }

        var selres = 0
        for(var i = 1;i < 4;i++){
            var btnName = "btn"+i
            var btn = panelMove.getChildByName(btnName)
            btn.setTag(30+i)
            btn.addClickEventListener(function(){
                switch (this.getTag()){
                    case 31:
                        selres = res.cellBg
                        break
                    case 32:
                        selres = res.fastImg
                        break
                    case 33:
                        selres = res.slowImg
                        break
                }
                resultList[tag-11].setTexture(selres)
                self.move_Panel_in(panelMove,panel);
                curresultArray[tag-11] = this.getTag() - 31
                tagFlag = false;
            })

        }

        var result = tableBg.getChildByName("result")
        conBtn.addClickEventListener(function(){
            if(!result.isVisible())
                result.setVisible(true)
            else
                result.setVisible(false)
            if(panel.getScaleY() != 0)
                self.move_Panel_in(panelMove,panel)
        })
        clearBtn.addClickEventListener(function(){
            for(var i=0;i<4;i++){
                resultList[i].setTexture(res.cellBg)
                noList[i].setVisible(false)
                yesList[i].setVisible(false)
            }
            if(result.isVisible())
                result.setVisible(false)
            if(panel.getScaleY() != 0)
                self.move_Panel_in(panelMove,panel)
        })
        resultBtn.addClickEventListener(function(){
            self.showImg(resultImg,1)
            if(panel.getScaleY() != 0)
                self.move_Panel_in(panelMove,panel)
        })
        resultCloseBtn.addClickEventListener(function(){
            self.showImg(resultImg,2)
        })
        closeBtn.addClickEventListener(function(){
            self.tableShowIn()
            tableFlag = true
        })
        submitBtn.addClickEventListener(function(){
            for(var i=0;i<4;i++){
                if(curresultArray[i] == 0)   {
                    yesList[i].setVisible(false);
                    noList[i].setVisible(false);
                    continue;
                }
                if(curresultArray[i] == resultArray[i]){
                    yesList[i].setVisible(true)
                    noList[i].setVisible(false)
                }else{
                    yesList[i].setVisible(false)
                    noList[i].setVisible(true)
                }
            }
            if(panel.getScaleY() != 0)
                self.move_Panel_in(panelMove,panel)
        })

    },

    tableShowIn:function(){
        var self = this
        self.showImg(tableBg,2)
        if(resultImg.getScale() != 0)
            self.showImg(resultImg,2)
    },

    tableShowOut:function(){
        var self = this
        self.showImg(tableBg,1)
    },

    move_Panel_in:function(panelMove,panel){
        var self = this;
        var call = new cc.CallFunc(function(){
            panelMove.runAction(cc.moveTo(0.2,56,200));
        });
        var call2 = new cc.CallFunc(function(){
            panel.setScaleY(0);
        });
        var del = new cc.DelayTime(0.2);
        var seq = new cc.Sequence(call,del,call2);
        self.runAction(seq);
    },

    move_Panel_out:function(panelMove,panel){
        panel.setScaleY(1);
        panelMove.setPositionY(200);
        panelMove.runAction(cc.moveTo(0.2,56,100));
    },
    showImg:function(img,flag){
        var self = this;
        if (flag == 1) {
            addShowType({
                item: img,
                show: "scale",
                time: 0.2,
                fun: function (img) {
                    createTouchEvent({
                        item:img,
                        begin:function(data){
                            var item = data.item
                            item.setLocalZOrder(curIndex)
                            curIndex = curIndex + 1
                            return true
                        },
                        move:function(data){
                            var item = data.item
                            var delta = data.delta
                            item.x += delta.x
                            item.y += delta.y
                        }
                    })
                }
            })
            img.setLocalZOrder(curIndex)
            curIndex = curIndex + 1
            img.setPosition(cc.p(0,0))
        } else {
            addShowType({
                item: img,
                show: "zoom",
                time: 0.2,
                fun: function (img) {
                    if(img.removeListen){
                        img.removeListen()
                        img.setPositionY(-600)
                    }
                }
            })
        }
    },

    getBreadNum:function(){
        var self = this
        var dataControl = self.dataControl
        var list = dataControl.judgeList
        for(var i = 0; i <list.length;i++ ){
            if(list[i] != 0){
                list[i] = 0
                return i
            }
        }
    },

    getBagNum:function(){
        var self = this
        var dataControl = self.dataControl
        var list = dataControl.judgeBagList
        for(var i = 0; i <list.length;i++ ){
            if(list[i] != 0){
                list[i] = 0
                return i
            }
        }
    },

})