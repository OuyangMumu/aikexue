var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super();
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this

        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })
        loadPlist("shuifei_plist")
        var createSp = function(res,pos,father){
            var sp = new cc.Sprite(res)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }
        createSp(res.do_tip2,cc.p(150,470),self)
        //var creatjjd = function(){
        var jjd = createJJD({
            father:self,
            scale:1.2,
            dgFlag:true,
            dgPos:cc.p(200, 50),
            pos:cc.p(730,-110),
        })
            //return jjd
        //}
        jjd.judgeFire = false  //判断酒精灯是否点燃
        jjd.canClick = true

        var hot = null//创建热气
        var createHot = function(){
            hot = createWaterAir()
            hot.setPosition(40,20)
            shaobei.water.addChild(hot)
            hot.setScale(0)
        }
        
        
        jjd.setCallBack({
            fire:function(){
                cc.log("jjd fire")
                jjd.judgeFire = true
            },
            cutFire:function(){
                cc.log("jjd cut fire")
                jjd.judgeFire = false
            }
        })
        
        var curLocal = 1
        var tiejia = null
        var wang = null
        var shaobei = null
        var toolbtn = createTool({
            pos: cc.p(280, 550),
            nums: 4,
            scale:0.8,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -15),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            //arrow:true,
            father: self,
            counts: [1, 1, 1, 1],
            swallow: [true, true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3,res.do_tools4],
            gets: [res.tools_1,res.tools_2,null,res.tools_3],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                var index = data.index
                switch(index){
                    case 0:
                        item.gan = createSp(res.tools_4,cc.p(95,170),item)
                        item.setPosition(400,150)
                        tiejia = item
                        item.setScale(1.1)
                        item.setLocalZOrder(0)
                    break
                    case 1:
                        item.setPosition(650,290)
                        wang = item
                        item.havesb = false
                    break
                    case 2:
                        item = jjd
                        item.judgeFire = false
                        item.setPosition(600, 100)
                    break
                    case 3:
                        item.setLocalZOrder(5)
                        item.setPosition(800,150)
                        shaobei = item
                        shaobei.havehot = false
                        item.water = createSp("#shuifei01.png",cc.p(88,103),item)
                    break
                }
                item.nopos = true
                item.noMove = true
                item.over = false
                return item
            },
            clickfun: function(data){
                var index = data.index
                var item = data.sp
                var pos = data.pos

                if(index != 0){
                    curLocal++
                    if(item.noMove){
                        item.noMove = false
                    }
                    item.over = false
                    item.setLocalZOrder(curLocal)
                }

                if(index == 1 && shaobei){  //判断石棉网上面，是否含有烧杯
                    if(shaobei.over){
                        shaobei.setLocalZOrder(curLocal++)
                        item.havesb = true
                    }
                }else if(index == 3 && wang){  //判断烧杯已经从石棉网上面拿出来了
                    if(wang.havesb)
                        wang.havesb = false
                }
                // else if(index == 2){
                //     if(item.over){
                //         tiejia.gan.setScale(1)
                //         changeFather({item:tiejia.gan,father:tiejia})
                //     }
                // }
                
                return true 
            },
            movefun: function(data){
                var index = data.index
                var item = data.sp
                var delta = data.delta
                if(index == 1 && item.havesb){
                    shaobei.x += delta.x 
                    shaobei.y += delta.y
                }
                
                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                }
            },
            outfun: function(data){
                var index = data.index
                var item = data.sp

                if(tiejia){
                    if(index != 0){
                        stopTemp()
                    }
                    switch(index){
                        case 1:
                            if(checkdistans(tiejia,wang,120)){
                                item.setLocalZOrder(3)
                                item.setPosition(tiejia.x,tiejia.y+100)
                                item.over = true
                                if(item.havesb){
                                    item.havesb = false
                                    shaobei.setPosition(wang.x-20,wang.y+70)
                                }
                            }
                        break
                        case 2:
                            jjd.canClick = true
                            if(checkdistans(tiejia,jjd,100)){
                                item.setLocalZOrder(1)
                                item.over = true
                                jjd.canClick = false
                                tiejia.gan.setScale(1.1)
                                changeFather({item:tiejia.gan,father:self})
                                //safeAdd(self, tiejia.gan)
                                //if(wang)
                                tiejia.gan.setLocalZOrder(2)
                                item.setPosition(tiejia.x,tiejia.y-30)
                                judgeAct()
                            }
                        break
                        case 3:
                            if(wang){
                                if(wang.over && checkdistans(wang,item,120)){
                                    item.setLocalZOrder(4)
                                    item.setPosition(wang.x-20,wang.y+70)
                                    item.over = true
                                    judgeAct()
                                }
                            }
                        break
                    }
                }
            },
            backfun:function(data){
                return false
            }
        })

        self.inside_node.addChild(toolbtn,1)
        self.toolbtn = toolbtn
        toolbtn.show()

        var judgeAct = function(){
            if(shaobei){
                if(jjd.judgeFire && jjd.over && shaobei.over){
                    addTemp()
                    cc.log("shao============")
                }
            }
            
        }
        var addTemp = function(){
            shaobei.stopAllActions()
            shaobei.runAction(cc.sequence(
                cc.delayTime(10),
                cc.callFunc(function(){
                    shaobei.havehot = true
                    shaobei.isstop = false
                    shaobei.water.runAction(aniRepeat())
                    if(!hot)
                        createHot()
                    hot.runAction(cc.scaleTo(10,1))
                })
            ))
        }

        var stopTemp = function(){
            if(!shaobei)    return true
            if(shaobei){
                if(!shaobei.havehot){
                    shaobei.stopAllActions()
                    return true
                }
            }
            
            if(shaobei.isstop)      return false//判断是否已经调用了停止项
            shaobei.isstop = true
            cc.log("stop shao")
            shaobei.runAction(cc.sequence(
                cc.delayTime(10),
                cc.callFunc(function(){
                    shaobei.havehot = false
                    shaobei.water.stopAllActions()
                    shaobei.water.setSpriteFrame("shuifei01.png")
                    if(hot)
                        hot.runAction(cc.scaleTo(6,0))
                })
            ))
        }
        

        var checkdistans = function(ra,rb,dis){
            var dx =  ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis){
                return true
            }else
                return false
        } 

        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
            }))
        }

        var aniRepeat = function(){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:"shuifei%02d.png",
                start:2,
                end: 12,
                time: 0.15,
            })))
        }

    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do_tip1",img:res.do_tip1,sound:res.do_sound1},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
    },
})