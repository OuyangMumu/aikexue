var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    load: function() {
        //loadPlist("learn_nums")
    },
    ctor: function() {
        this._super()
        this.learnCtor()
        this.load()
        var self = this
        self.img_title.setVisible(false)
        self.img_page.setVisible(false)
        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        loadPlist("learn_plist")

        loadPlist("tang_plist")
        loadPlist("jiaoban_plist")
        loadPlist("you_plist")
        loadPlist("jiu_plist")
        loadPlist("yan_plist")
        loadPlist("xue_plist")
        loadPlist("nai_plist")
        loadPlist("shi_plist")
        createSp(res.zhuozi,cc.p(568,140),self)

        var mater = null
        var curIndex = null

        var normalList = []
        var selectList = []
        for(var i = 0 ; i < 7 ; i++){
            var img = sprintf("#le_normal_%d.png",i+1)
            normal = createSp(img,cc.p(250 + i * 105,570),self)
            normalList[i] = normal
            var img2 = sprintf("#le_select_%d.png",i+1)
            selectList[i] = createSp(img2,cc.p(250 + i * 105,570),self)
            selectList[i].setVisible(false)
            if(i == 3){
                selectList[i].setPositionY(565)
                normalList[i].setPositionY(565)
            }

            //创建点击事件
            var next1 = null
            var next2 = null
            normal.index = i
            createTouchEvent({
                item:normal,
                begin:function(data){
                    var item = data.item
                    cc.log(item.index)
                    for(var j = 0 ; j < 7 ; j++){
                        if(item.index == normalList[j].index){
                            item.setVisible(false)
                            selectList[item.index].setVisible(true)
                            next1 = item
                            next2 = selectList[item.index]
                            break
                        }
                    }
                    return true
                },
                end:function(data){
                    var index = data.item.index
                    curIndex = index
                    if(next1){
                        next1.setVisible(true)
                        next2.setVisible(false)
                    }

                    //开始调用搅拌
                    if(!mater){
                        mater = createSp("#tang01.png",cc.p(500,450),self)
                        mater.setScale(1.3)
                        safeAdd(self,cup)
                    }
                    label.setVisible(false)
                    jiaoban.stopAllActions()
                    boli.setVisible(true)
                    jiaoban.setVisible(false)
                    mater.stopAllActions()
                    mater.setPosition(450,450)
                    smallMater.setPositionY(-300)

                    switch(index){
                        case 0:
                            mater.setSpriteFrame("you01.png")
                            mater.setPosition(490,280)
                            mater.runAction(cc.sequence(
                                cc.delayTime(0.1),
                                ani("you%02d.png",1,8,0.2),
                                cc.callFunc(function(){
                                    fun()
                                }),
                                cc.delayTime(0.1),
                                ani("you%02d.png",8,22,0.25),
                                cc.callFunc(function(){
                                    fun2()
                                })
                            ))
                        break
                        case 1:
                            mater.setSpriteFrame("jiu01.png")
                            mater.setPosition(410,350)
                            mater.runAction(cc.sequence(
                                cc.delayTime(0.1),
                                ani("jiu%02d.png",1,8,0.2),
                                cc.callFunc(function(){
                                    mater.setPositionY(-300)
                                    fun()
                                }),
                                cc.delayTime(0.1),
                                cc.callFunc(function(){
                                    fun2()
                                })
                            ))
                        break
                        case 2:
                            mater.setSpriteFrame("saoyan01.png")
                            mater.runAction(cc.sequence(
                                cc.moveTo(0.5,460,370),
                                cc.delayTime(0.1),
                                cc.callFunc(function(){
                                    smallMater.setSpriteFrame("yan01.png")
                                    smallMater.setPosition(570,100)
                                    smallMater.runAction(cc.sequence(
                                        cc.delayTime(0.5),
                                        ani("yan%02d.png",1,8,0.2),
                                        cc.callFunc(function(){
                                            mater.setPositionY(-500)
                                        })
                                    ))
                                }),
                                ani("saoyan%02d.png",1,8,0.2),
                                cc.callFunc(function(){
                                    smallMater.runAction(cc.sequence(
                                        cc.delayTime(0.3),
                                        ani("yan%02d.png",8,10,0.25)
                                    ))
                                    fun()
                                }),
                                cc.delayTime(3),
                                cc.callFunc(function(){
                                    fun2()
                                })
                            ))
                        break
                        case 3:
                            mater.setSpriteFrame("tang01.png")
                            mater.runAction(cc.sequence(
                                cc.moveTo(0.5,500,230),
                                cc.delayTime(0.1),
                                ani("tang%02d.png",1,10,0.2),
                                cc.callFunc(function(){
                                    fun()
                                }),
                                cc.delayTime(0.2),
                                ani("tang%02d.png",10,19,0.25),
                                cc.callFunc(function(){
                                    fun2()
                                })
                            ))
                        break
                        case 4:
                            mater.setSpriteFrame("saoxue01.png")
                            mater.runAction(cc.sequence(
                                cc.moveTo(0.5,520,360),
                                cc.delayTime(0.1),
                                ani("saoxue%02d.png",1,5,0.2),
                                cc.callFunc(function(){
                                    mater.setPositionY(-500)
                                    smallMater.setPosition(570,170)
                                    smallMater.runAction(cc.sequence(
                                        cc.delayTime(0.3),
                                        ani("xue%02d.png",1,5,0.2),
                                        ani("xue%02d.png",3,7,0.4)
                                    ))
                                    fun()
                                }),
                                cc.callFunc(function(){
                                    fun2()
                                })
                            ))
                        break
                        case 5:
                            mater.setSpriteFrame("saonai01.png")
                            mater.runAction(cc.sequence(
                                cc.moveTo(0.5,520,340),
                                cc.delayTime(0.1),
                                ani("saonai%02d.png",1,7,0.2),
                                cc.callFunc(function(){
                                    smallMater.runAction(cc.sequence(
                                        cc.delayTime(0.3),
                                        cc.callFunc(function(){
                                            mater.setPositionY(-500)
                                            smallMater.setPosition(570,165)
                                        }),
                                        ani("nai%02d.png",1,3,0.4)
                                    ))
                                    fun()
                                }),
                                cc.callFunc(function(){
                                    fun2()
                                })
                            ))
                        break
                        case 6:
                            mater.setSpriteFrame("shi01.png")
                            mater.runAction(cc.sequence(
                                cc.moveTo(0.5,500,255),
                                cc.delayTime(0.1),
                                ani("shi%02d.png",1,5,0.2),
                                cc.callFunc(function(){
                                    fun()
                                }),
                                cc.delayTime(0.2),
                                ani("shi%02d.png",5,10,0.2),
                                ani("shi%02d.png",5,10,0.2),
                                cc.callFunc(function(){
                                    fun2()
                                }),
                                ani("shi%02d.png",5,10,0.2),
                                ani("shi%02d.png",5,10,0.2),
                                ani("shi%02d.png",5,10,0.2)
                            ))
                        break
                    }
                }
            })
        }

        var fun = function(){
            jiaoban.setVisible(true)
            boli.setVisible(false)
            jiaoban.runAction(aniRepeat())
        }
        var fun2 = function(){
            mater.runAction(cc.sequence(
                cc.delayTime(3),
                cc.callFunc(function(){
                    jiaoban.stopAllActions()
                    jiaoban.setVisible(false)
                    label.setVisible(true)
                    label.setString(inf[curIndex].str)
                })
            ))
        }

        var inf = [
            {str: "油不溶于水，浮在水面上"},
            {str: "酒精溶解在水中。"},
            {str: "食盐溶解在水中。"},
            {str: "糖块逐渐溶解在水中。"},
            {str: "木屑不溶于水，漂浮在水面。"},
            {str: "奶粉溶于水中。"},
            {str: "石头不溶于水，沉在水底。"},
        ]

        var label = new cc.LabelTTF("","",36)
        self.addChild(label)
        label.setPosition(300,400)

        var str = "       水能溶解一\n些物质，用玻璃\n棒搅动能够加快\n溶解。点击选择\n不同的物质进行\n溶解，观察其现\n象有什么不同。"
        var text = new cc.LabelTTF(str,"",32)
        self.addChild(text)
        text.setPosition(900,300)

        var cup2 = createSp("#le_cup2.png",cc.p(570,200),self)
        var boli = createSp("#bolibang.png",cc.p(660,300),self)
        var jiaoban = createSp("#jiaoban01.png",cc.p(697,295),self)
        //杯子中的小物体
        var smallMater = createSp("#yan10.png",cc.p(570,100),self)
        var cup = createSp("#le_cup.png",cc.p(570,175),self)
        boli.setScale(1.2)
        jiaoban.setScale(1.25)
        jiaoban.setVisible(false)
        smallMater.setScale(1.45)
        

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
                frame:"jiaoban%02d.png",
                end: 8,
                time: 0.1
            })))
        }
        return true
    },
})