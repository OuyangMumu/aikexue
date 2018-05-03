var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super()
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("do_plist")

        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1",force:true})
        })

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var wenzi = createSp("#do_wenzi.png",cc.p(150,400),self)
        wenzi.wz = createSp("#wenzi_nei.png",cc.p(132,40),wenzi)
        var cao2 = createSp("#cao2.png",cc.p(550,140),self)
        var shuimian = createSp("#shuimian.png",cc.p(550,210),self)
        var water = createSp("#shuimian2.png",cc.p(460,197),self)
        var cao = createSp("#cao.png",cc.p(549,136),self)
        cao.setLocalZOrder(10)
        water.setVisible(false)

        var curItem = null
        var toolbtn = createTool({
            pos: cc.p(290, 550),
            nums: 3,
            scale:0.8,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -12),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [1, 1, 1],
            swallow: [true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3],
            gets: [res.do_tools4,res.do_tools5,res.do_tools5],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                var index = data.index
                item.index = index
                if(curItem)
                    curItem.forceBack()
                item.judge = false
                curItem = item
                item.dis = 1
                item.curDis = 1
                item.qiu = createSp("#qiqiu01.png",cc.p(55,415),item)
                water.y = 197
                water.setVisible(false)
                shuimian.y = 210
                switch(index){
                    case 0:
                        wenzi.setVisible(false)
                    break
                    case 1:
                        wenzi.setVisible(true)
                        wenzi.wz.setSpriteFrame("wenzi_wai.png")
                        item.pian = createSp("#xiaopian1_01.png",cc.p(-3,222),item)
                    break
                    case 2:
                        wenzi.setVisible(true)
                        wenzi.wz.setSpriteFrame("wenzi_nei.png")
                        item.pian = createSp("#xiaopian2_01.png",cc.p(10,222),item)
                    break
                }
                return item
            },
            clickfun: function(data){
                var index = data.index
                var item = data.sp
                var pos = data.pos
                if(!judgeOpInPos({pos:pos,item:item}))
                    return false
                return true 
            },
            movefun: function(data){
                var index = data.index
                var item = data.sp
                var delta = data.delta
                var posx = item.x + delta.x 
                var posy = item.y + delta.y 

                if(posx < 450 || posx > 740){
                    if(posy > 430){
                        item.x += delta.x
                        item.y += delta.y
                    }
                }else{
                    if(posy > 210){
                        item.x += delta.x
                        item.y += delta.y
                        //水面360 - 210 = 150 1-18
                        if(item.y <= 360){
                            if(!item.judge){
                                item.judge = true
                                water.setVisible(true)
                            }
                        }else{
                            if(item.judge){
                                item.judge = false
                                water.setVisible(false)
                                if(index == 2)
                                    item.pian.setSpriteFrame("xiaopian2_01.png")
                                else if(index == 1){
                                    shuimian.y = 210
                                    water.setPositionY(197)
                                    item.pian.setSpriteFrame("xiaopian1_01.png")
                                }
                            } 
                        }
                        if(!item.judge)     return false
                        item.dis = Math.floor(19 - (item.y - 210) / 150 * 18)
                        if(item.dis < 1 && item.dis > 19)       return false
                        switch(index){
                            case 0:
                                water.x = item.x - 50
                                if(item.dis != item.curDis){
                                    cc.log(item.dis)
                                    item.curDis = item.dis
                                    item.qiu.setSpriteFrame(sprintf("qiqiu%02d.png",item.dis))
                                }
                            break
                            case 1:
                                water.x = item.x - 50
                                water.y += delta.y
                                if(water.y < 197)
                                    water.y = 197

                                //水槽中的液面上升
                                if(item.y < 360 && water.y > 200){
                                    shuimian.y += delta.y / 20
                                }

                                //小孔
                                item.pian.setSpriteFrame("xiaopian1_01.png")
                                if(delta.y < 0){
                                    if(delta.y < -2)
                                        item.pian.setSpriteFrame("xiaopian1_05.png")
                                    else if(delta.y > -2 && delta.y < -1.2)
                                        item.pian.setSpriteFrame("xiaopian1_03.png")
                                    else
                                        item.pian.setSpriteFrame("xiaopian1_01.png")
                                }
                            break
                            case 2:
                                water.x = item.x - 50
                                if(item.dis != item.curDis){
                                    item.curDis = item.dis
                                    item.qiu.setSpriteFrame(sprintf("qiqiu%02d.png",item.dis))
                                }

                                //小孔
                                item.pian.setSpriteFrame("xiaopian2_01.png")
                                if(delta.y > 0){
                                    if(delta.y >= 2)
                                        item.pian.setSpriteFrame("xiaopian2_05.png")
                                    else if(delta.y < 2 && delta.y > 1.2)
                                        item.pian.setSpriteFrame("xiaopian2_03.png")
                                    else
                                        item.pian.setSpriteFrame("xiaopian2_01.png")
                                }
                            break
                        }
                    }
                }
            },
            outfun: function(data){
                var index = data.index
                var item = data.sp
                switch(index){
                    case 0:
                        if(item.y > 360 && item.dis != 1)
                            item.qiu.setSpriteFrame("qiqiu01.png")
                    break
                    case 1:
                        item.pian.setSpriteFrame("xiaopian1_01.png")
                    break
                    case 2:
                        item.pian.setSpriteFrame("xiaopian2_01.png")
                    break
                }
            },
            backfun:function(data){
                curItem = null
                wenzi.setVisible(false)
                water.setVisible(false)
                shuimian.y = 210
                return true
            }
        })

        self.inside_node.addChild(toolbtn,1)
        self.toolbtn = toolbtn
        toolbtn.show()
    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        
        addContent({
            people: this.nodebs,
            key: "do_tip1",
            img: res.do_tip1,
            sound: res.do_sound1,
        })
    },
})