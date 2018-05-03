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

    initUI: function () {
        var self = this
        var createSp = function(sprite,pos,father){
            var sp = new cc.Sprite(sprite)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }
        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
        })
        var btn_result = new ccui.Button(res.btn_get_normal,res.btn_get_select)
        btn_result.setPosition(1030,450)//350
        self.addChild(btn_result)
        btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"do1_result"})
        })

        var bg = new cc.Sprite(res.do_bg)
        bg.setPosition(cc.p(568,320))
        self.inside_node.addChild(bg)

        //创建大的放大镜显示
        var fdj_node = new cc.Node()
        fdj_node.setPosition(750,-700)
        fdj_node.setLocalZOrder(99)
        self.addChild(fdj_node)
        var fdj_sp = new cc.Sprite(res.fdj)
        var bigfdj = new cc.ClippingNode(fdj_sp)
        bigfdj.setAlphaThreshold(0)
        fdj_node.addChild(bigfdj)

        var fdj_item = new cc.Sprite(res.fdj_item1)
        fdj_item.setPosition(0,30)
        bigfdj.addChild(fdj_item)

        var fdjjm = new cc.Sprite(res.fdj)
        fdjjm.setScale(1.02)
        fdj_node.addChild(fdjjm)

        var posList = [cc.p(320,230),cc.p(330,250),cc.p(300,180)]
        var itemList = [res.do1_bigItem1,res.do1_bigItem2,res.do1_bigItem3]
        var fdjPos = [cc.p(315,280),cc.p(230,290),cc.p(210,290)]
        var fdjNum = [20,30,20]
        var bigItemList = [res.fdj_item1,res.fdj_item2,res.fdj_item3]
        var bigItemPos = [cc.p(0,0),cc.p(25,25),cc.p(100,120)]
        var curItem = null
        var itemFdj = null

        var toolbtn = createTool({
            pos: cc.p(340, 530),
            nums: 4,
            scale:0.7,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.9),
            itempos: cc.p(0, -15),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            arrow:false,
            father: self,
            counts: [1, 1, 1, 1],
            swallow: [true, true, true, true],
            files: [res.do1_tools1, res.do1_tools2, res.do1_tools3, res.tools_fdj],
            gets: [res.do1_item1,res.do1_item2,res.do1_item3,res.item_fdj],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                if(index != 3){
                    if(curItem)
                        curItem.forceBack(false)
                    if(itemFdj){
                        itemFdj.forceBack(false)
                        itemFdj = null
                    }
                    curItem = item
                    curItem.index = index
                    fdj_node.setPositionY(-700)
                }else{
                    item.setAnchorPoint(0.45,0.7)
                    itemFdj = item
                    item.canMove = true
                    if(curItem){
                        item.canMove = false
                        item.nopos = true
                        item.setPosition(fdjPos[curItem.index])
                        fdj_item.setTexture(bigItemList[curItem.index])
                        fdj_item.setPosition(bigItemPos[curItem.index])
                        fdj_node.setPositionY(250)
                    }
                    
                }
                return item
            },
            clickfun: function(data){
                var item = data.sp
                var index = data.index
                if(item.noMove && index != 3){
                    return false
                }
                item.canMove = true
                return true
            },
            movefun: function(data){
                var item = data.sp 
                var index = data.index
                var delta = data.delta 
                if(!item.noMove && index != 3){
                    item.x += delta.x 
                    item.y += delta.y
                }
                if(index == 3){
                    if(!curItem){
                        item.x += delta.x 
                        item.y += delta.y
                    }else if(item.canMove){
                       if( item.x + delta.x > fdjPos[curItem.index].x - fdjNum[curItem.index] &&
                            item.x + delta.x < fdjPos[curItem.index].x + fdjNum[curItem.index]+10 &&
                            item.y + delta.y > fdjPos[curItem.index].y - fdjNum[curItem.index] &&
                            item.y + delta.y < fdjPos[curItem.index].y + fdjNum[curItem.index]+10
                        ){
                            item.x += delta.x 
                            item.y += delta.y
                            fdj_item.x -= delta.x * 5
                            fdj_item.y -= delta.y * 4
                        } 
                    }
                    

                }
            },
            outfun: function(data){
                var item = data.sp 
                var index = data.index
                if(index != 3){
                    item.noMove = true
                    item.setTexture(itemList[index])
                    item.setPosition(posList[index])
                }
                
            },
            backfun: function(data){
                var item = data.sp 
                var index = data.index
                if(index != 3){
                    item.noMove = true
                    item.setTexture(itemList[index])
                    item.setPosition(posList[index])
                }else{
                    if(item.canMove){
                        itemFdj = null
                        return true
                    }
                }
                return false
            }
        })
        self.inside_node.addChild(toolbtn,1)
        toolbtn.show()
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,100)
        var addList = [
            {key:"do1_tip1",img:res.do1_tip1,sound:res.do1_sound1},
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
            key: "do1_result",
            img: res.do1_result,
            sound: res.do1_sound_result,
            id: "result",
        })
    },

})