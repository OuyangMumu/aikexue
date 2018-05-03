/**
 * Created by Administrator on 2016/5/31.
 */
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        var self = this
        var exp2Table = true
        tableFlag = true

        this.expCtor({
            settingData:{
                biaogeFun:function(){
                    var child = getMyTable()
                    self.biaoge = child
                    if(exp2Table) {
                        exp2Table = false
                        if (child.getParent()) {
                            child.retain()
                            child.removeFromParent(false)
                            self.addChild(child, 1000)
                            child.release()
                        } else {
                            self.addChild(child, 1000)
                            child.showIn()
                        }
                    }else{
                        if(tableFlag){
                            child.showIn()
                            tableFlag = false
                        }else{
                            child.showOut()
                            tableFlag = true
                        }
                    }
                },
                pos: cc.p(1080, 580),
            }
        });
        this.initPeople();
        this.initUI();
        return true;
    },
    dataControl: {},
    myDelete: function() {
        var self = this
        stopMusic()
        if(self.biaoge){
            self.biaoge.removeFromParent(false)
        }
    },
    initUI:function(){
        var self = this
        self.createTool()

        this.nodebs.show(function() {
            self.nodebs.say({
                key: "do2"
            })
        })

    },
    getCurrent:function(index){
        var self = this
        return self.toolbtn.getindex(index)
    },
    createTool:function(){
        var self = this
        var dataControl = self.dataControl
            self.node = new cc.Node();
            this.addChild(self.node,10)
            dataControl.Gets = []

        var toolbtn = createTool({
            pos: cc.p(100, 500),
            nums: 2,
            tri: "down",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.6, 1.5),
            itempos: cc.p(0, -20),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:true,
            father: self.node,
            counts: [999, 999, 999, 999],
            swallow: [true, true, true, true],
            files: [res.btytdz_tool_1, res.btytdz_tool_2, res.btytdz_tool_3, res.btytdz_tool_4],
            gets: [null, null, null, null],
            reTouch:function(data){
                var item = data.sp
                var pos = data.pos
                item.setPosition(pos)
                return item
            },
            firstClick: function(data) {
                var index = data.index
                var pos = data.pos
                var item = data.sp

                if(self.node.getChildrenCount() == 2 || self.node.getChildrenCount() == 6){
                    self.node.removeAllChildren()
                    dataControl.noMove = false
                    dataControl.Gets[0] = null
                }
                var judge = function(key, pos){
                    if(dataControl.Gets[0]){
                        if(dataControl.Gets[0].judge == key)
                        {
                            dataControl.Gets[0].setPosition(pos)
                            return dataControl.Gets[0]
                        }
                    }else{
                        dataControl.Gets[0] = item
                        item.judge = key
                    }
                }
                switch (index){
                    case indexList.niuPaper:
                        item = new cc.Sprite(res.btytdz_do2_nz)
                        var temp = judge("niuPaper", pos)
                        if(temp){
                            return temp
                        }
                        break
                    case indexList.canPaper:
                        item = new cc.Sprite(res.btytdz_do2_cz)
                        var temp = judge("canPaper", pos)
                        if(temp){
                            return temp
                        }
                        break
                    case indexList.daPaper:
                        item = new cc.Sprite(res.btytdz_do2_dz)
                        var temp = judge("daPaper", pos)
                        if(temp){
                            return temp
                        }
                        break
                    case indexList.baoPaper:
                        item = new cc.Sprite(res.btytdz_do2_bz)
                        var temp = judge("baoPaper", pos)
                        if(temp){
                            return temp
                        }
                        break
                }
                return item
            },
            outfun:function(data){
                self.addSpriteEnd(data)
            },
            movefun:function(data){
                var delta = data.delta
                var index = data.index
                var sp = data.sp
                if(dataControl.noMove)
                    return
                sp.x += delta.x
                sp.y += delta.y
            },
            backfun:function(){
                return false
            }
        });
        this.toolbtn = toolbtn
        this.addChild(toolbtn,5)
        toolbtn.show()
    },
    addSpriteEnd:function(data){
        var self = this
        var dataControl = self.dataControl
        dataControl.res1 = 0
        dataControl.res2 = 0

        if(this.node.getChildrenCount()==2){
            var child1 = this.node.getChildren()[0]
            var child2 = this.node.getChildren()[1]

            var pos = child1.convertToNodeSpace(child2.getPosition())

            if(cc.rectIntersectsRect(child1,child2)){
            //if(cc.rectContainsPoint(cc.rect(0,0,child1.width,child1.height),pos)){
                var rchild
                var lchild
                if(child1.index == data.index){
                    rchild = child1
                    lchild = child2
                }
                if(child2.index == data.index){
                    rchild = child2
                    lchild = child1
                }
                rchild.setAnchorPoint(cc.p(0,0.5))
                lchild.setAnchorPoint(cc.p(1,0.5))
                lchild.x = data.sp.x + 7
                lchild.y = data.sp.y

                var lhand1 = new cc.Sprite(res.btytdz_do2_lHand1)
                var lhand2 = new cc.Sprite(res.btytdz_do2_lHand2)
                lhand1.setPosition(rchild.x-235,rchild.y-38)
                lhand2.setPosition(rchild.x-227,rchild.y-10)
                lchild.getParent().addChild(lhand1,3)
                lchild.setLocalZOrder(2)
                lchild.getParent().addChild(lhand2,1)


                var rhand1 = new cc.Sprite(res.btytdz_do2_rHand1)
                var rhand2 = new cc.Sprite(res.btytdz_do2_rHand2)
                rhand1.setPosition(lchild.x+235,lchild.y-38)
                rhand2.setPosition(lchild.x+227,lchild.y-10)
                rchild.getParent().addChild(rhand1,3)
                rchild.setLocalZOrder(2)
                rchild.getParent().addChild(rhand2,1)

                var lscale = 1
                var rscale = 1
                dataControl.noMove = true
                dataControl.handMove = true
                lhand1.setTag(7)
                rhand1.setTag(8)

                var beginX = 0
                var beginHandX = 0
                var endHandX = 0
                var moveX = 0
                var handList = [lhand1,rhand1]
                for(var i = 0 ; i < 2 ; i++){
                    createTouchEvent({
                        item: handList[i],
                        begin: function (data) {
                            var item = data.item
                            var pos = data.pos
                            beginX = pos.x
                            beginHandX = item.x
                            return true
                        },
                        move: function(data) {
                            var item = data.item
                            var delta  = data.delta
                            var pos = data.pos
                            moveX = pos.x
                            endHandX = item.x
                            if(item.getTag() == 7 && (beginX - moveX > 5) && dataControl.handMove){
                                if(beginHandX - endHandX > 10 || lchild.getScale() > 1.15 ){
                                    lchild.x = lchild.x + 60
                                    rchild.x = rchild.x - 60
                                    lchild.setScaleX(1)
                                    rchild.setScaleX(1)
                                    self.getNewPaer(lchild.index,rchild.index)
                                    lchild.setTexture(dataControl.res1)
                                    rchild.setTexture(dataControl.res2)
                                    dataControl.handMove = false
                                    return
                                }
                                item.x += delta.x
                                lhand2.x += delta.x
                                rhand1.x -= delta.x
                                rhand2.x -= delta.x
                                rchild.setScaleX(lscale)
                                lchild.setScaleX(lscale)
                                lscale = lscale + 0.0105
                            }else if(item.getTag() == 8 && (moveX - beginX > 5) && dataControl.handMove){
                                if(endHandX - beginHandX > 10 || rchild.getScale() > 1.15 ){
                                    lchild.x = lchild.x + 60
                                    rchild.x = rchild.x - 60
                                    lchild.setScaleX(1)
                                    rchild.setScaleX(1)
                                    self.getNewPaer(lchild.index,rchild.index)
                                    lchild.setTexture(dataControl.res1)
                                    rchild.setTexture(dataControl.res2)
                                    dataControl.handMove = false
                                    return
                                }
                                item.x += delta.x
                                rhand2.x += delta.x
                                lhand1.x -= delta.x
                                lhand2.x -= delta.x
                                rchild.setScaleX(rscale)
                                lchild.setScaleX(rscale)
                                rscale = rscale + 0.0105
                            }
                        }
                    })
                }
            }
        }
    },

    getNewPaer: function(lPaper,rPaper) {
        var self = this
        var dataControl = this.dataControl
        var paperData = [
            { l:0, r: 1, res1:res.lnz_cz, res2:res.rcz_d},
            { l:0, r: 2, res1:res.lnz_dz, res2:res.rdz_d},
            { l:0, r: 3, res1:res.lnz_bz, res2:res.rbz_d},
            { l:1, r: 0, res1:res.lcz_d, res2:res.rnz_cz},
            { l:2, r: 0, res1:res.ldz_d, res2:res.rnz_dz},
            { l:3, r: 0, res1:res.lbz_d, res2:res.rnz_bz},
            { l:2, r: 3, res1:res.ldz_bz, res2:res.rbz_d},
            { l:2, r: 1, res1:res.ldz_cz, res2:res.rcz_d},
            { l:3, r: 2, res1:res.lbz_d, res2:res.rdz_bz},
            { l:1, r: 2, res1:res.lcz_d, res2:res.rdz_cz},
            { l:3, r: 1, res1:res.lbz_cz, res2:res.rcz_d},
            { l:1, r: 3, res1:res.lcz_d, res2:res.rbz_cz},
        ]
        for(var i =0; i< paperData.length; i++){
            var temp = paperData[i]
            if(lPaper == temp.l && rPaper == temp.r){
                dataControl.res1 = temp.res1
                dataControl.res2 = temp.res2
            }
        }

    },

    initPeople: function () {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,100);

        addContent({
            people: this.nodebs,
            key: "do2",
            sound: res.btytdz_do2_sound,
            img: res.do2_tip
        })
    }

})