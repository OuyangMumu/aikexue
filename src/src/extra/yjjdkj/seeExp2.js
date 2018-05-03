var seeExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "seeExp2", 
    preLayer: "seeLayer", 
    ctor: function() { 
        this._super();
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("shape_plist")
        loadPlist("bind_plist")
        var uiList = [
            "node_1","node_2","node_3","node_4",
            "shape","hand"
        ]
        var node = loadNode(res.yjjdkj_seeExp2_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"see2_tip1"})
        })

        var createSp = function(res,pos,father){
            var sp = new cc.Sprite(res)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var curDevide = 0
        var devideList = [10,20,30,40,50,60]

        var hand = node.hand
        var shape = node.shape
        var curShape = 0
        hand.isTouch = false
        createTouchEvent({
            item:hand,
            begin:function(data){
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(!item.isTouch){
                    if(checkdistans(item,shape,50)){
                        count[curShape+1] = true
                        cc.log(curShape+1)
                        item.isTouch = true  //判断进入
                        item.setVisible(false)
                        item.setPosition(shape.getPosition())
                        shape.setSpriteFrame(sprintf("shape%d_%02d.png",curShape+1, 2))
                    }
                }else{
                    if(!checkdistans(item,shape,50) && item.y > 320 && delta.y > 0){
                        item.isTouch = false //判断离开
                        item.setVisible(true)
                        shape.setSpriteFrame(sprintf("shape%d_%02d.png",curShape+1, 1))
                        return false
                    }
                    if(hand.isVisible())
                        hand.setVisible(false)
                    curDevide = shape.y - item.y
                    var curIndex = 1
                    for (var i = 0; i < devideList.length; i++) {
                        if (curDevide < devideList[i]) {
                            curIndex = i + 1
                            break
                        }
                    }
                    if(curShape > 2){
                        if(curIndex > 1)  curIndex = 1
                    }else{
                        if(curDevide > 60)  curIndex = 6
                    }
                    shape.setSpriteFrame(sprintf("shape%d_%02d.png", curShape+1,curIndex+1))
                }
                item.x += delta.x 
                item.y += delta.y
            },
            end:function(data){
                var item = data.item
                if(item.isTouch){
                    item.setPosition(shape.getPosition())
                }
                var judge = true
                for(var i = 1 ; i < count.length ; i++){
                    if(!count[i])
                        judge = false
                }
                if(judge)
                    btn_result.setVisible(true)
            }
        })

        var count = [false,false,false,false,false]
        for(var i = 0 ; i < 4 ; i++){
            node[uiList[i]].getChildByName("select").setVisible(false)
            var normal = node[uiList[i]].getChildByName("normal")
            normal.index = i
            createTouchEvent({
                item:normal,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    var pos = data.pos
                    if(curRod){
                        if(!curRod.over){
                            curRod.setPositionY(-600)
                            curRod.over = false
                            node[uiList[curRod.index]].getChildByName("normal").setVisible(true)
                            node[uiList[curRod.index]].getChildByName("select").setVisible(false)
                        }
                    }
                    for(var j = 0 ; j < 4 ; j++){
                        if(index == j){
                            count[index] = true
                            curRod = rodList[j]
                            rodList[j].setPosition(pos)
                            node[uiList[j]].getChildByName("normal").setVisible(false)
                            node[uiList[j]].getChildByName("select").setVisible(true)
                        }
                    }
                    return true
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta
                    var index = item.index
                    rodList[index].x += delta.x 
                    rodList[index].y += delta.y
                },
                end:function(data){
                    var index = data.item.index
                    var pos = data.pos
                    judgeFun(rodList[index],index)
                }
            })
        }

        var imgList = ["#rod_1.png","#rod_2.png","#rod_3.png","#rod_4.png"]
        var rodList = []
        for(var i = 0 ; i < 4 ; i++){
            var rod = createSp(imgList[i],cc.p(100,-600),node)
            rod.index = i
            rod.over = false
            rodList.push(rod)
            createTouchEvent({
                item:rod,
                begin:function(data){
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
                    judgeFun(item,index)
                }
            })
        }

        //判断是否挨到棍子
        var curRod = null
        var beginRod = null
        var judgeFun = function(item,index){
            if(checkdistans2(item,shape,80)){
                for(var j = 0 ; j < 4 ; j++){
                    if(index == j){
                        curShape = j + 1
                    }else{
                        node[uiList[j]].getChildByName("normal").setVisible(true)
                        node[uiList[j]].getChildByName("select").setVisible(false)
                    }
                }
                if(beginRod)
                    beginRod.over = false
                beginRod = item
                item.over = true
                bindFun()
                hand.setPosition(600,450)
                hand.setVisible(true)
                item.setPositionY(-600)
                shape.setSpriteFrame(sprintf("shape%d_01.png",item.index+2))
            }
        }

        var checkdistans = function(ra,rb,dis){
            var dx = ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis)
                return true
            else
                return false
        }
        var checkdistans2 = function(ra,rb,dis){
            var dx = ra.x - rb.x
            var dy = ra.y - (rb.y-100)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis)
                return true
            else
                return false
        }

        var btn_result = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
        btn_result.setPosition(1030,450)
        self.addChild(btn_result)
        btn_result.setVisible(false)
        btn_result.addClickEventListener(function(){
            if(btn_result.isVisible()){
                self.nodebs.say({key:"result"})
            }  
        })

        var bg = createSp(res.bg_blue,cc.p(568,-600),node)
        var bind = createSp("#bind01.png",cc.p(500,-600),node)
        bind.setScale(1.6)

        var bindFun = function(){
            bg.setPositionY(320)
            bind.setPositionY(355)
            bind.runAction(cc.sequence(
                ani("bind%02d.png",1,6,0.15),
                ani("bind%02d.png",1,6,0.15),
                ani("bind%02d.png",1,6,0.15),
                cc.fadeOut(0.5),
                cc.callFunc(function(){
                    bind.setPositionY(-600)
                    bind.setOpacity(255)
                    bg.setPositionY(-600)
                })
            ))
        }
        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
            }))
        }
        createTouchEvent({
            item:bg,
            begin:function(data){
                return true
            }
        })
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"see2_tip1",img:res.see2_tip1,sound:res.see2_sound1},
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
            key: "result",
            img: res.see2_tip2,
            sound: res.see2_sound2,
            id: "result",
        })
    },
})