var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super()
        this.expCtor()
        //this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("do_plist")
        loadPlist("do2_plist")

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var bg = createSp("#do_bg.png",cc.p(500,240),self)
        bg.setColor(cc.color(0,0,255))
        var guntiaoBg = createSp("#guntiaoBg.png",cc.p(820,240),self)
        var guntiao = createSp("#guntiao.png",cc.p(11.5,288),guntiaoBg)
        guntiaoBg.setVisible(false)

        var curIndex = 0
        var normalList = []
        var selectList = []
        for(var i = 0 ; i < 4 ; i++){
            var img = sprintf("#normal_%d.png",i+1)
            var sp = createSp(img,cc.p(1020,400 - i *80),self)
            normalList[i] = sp
            sp.index = i 
            var img2 = sprintf("#select_%d.png",i+1)
            selectList[i] = createSp(img2,cc.p(1020,400 - 80*i),self)
            selectList[i].setVisible(false)

            createTouchEvent({
                item:sp,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    if(curIndex == index)   return false
                    curIndex = index
                    for(var j = 0 ; j < 4 ; j++){
                        if(index == j){
                            //normalList[j].setVisible(false)
                            selectList[j].setVisible(true)
                            imgFun()
                        }else{
                            //normalList[j].setVisible(true)
                            selectList[j].setVisible(false)
                        }
                    }
                    return true
                }
            })
        }
        selectList[0].setVisible(true)

        //创建小图标
        var doTouch = createSp("#doTouch.png",cc.p(-100,100),self)
        doTouch.setLocalZOrder(20)
        var imgNode = new cc.Node()
        imgNode.setPosition(0,0)
        self.addChild(imgNode)
        var curImgList = []

        //仪器名称
        var titleLabel = new cc.LabelTTF("","",28)
        titleLabel.setPosition(550,420)
        self.addChild(titleLabel)
        //仪器图片
        var curImg = createSp("#showImg_1.png",cc.p(300,240),self)

        //文字介绍
        var lay = new ccui.Layout()
        lay.setBackGroundColor(cc.color(255, 255, 255))
        lay.setBackGroundColorOpacity(200)
        lay.setContentSize(cc.size(420,350))
        lay.setPosition(450,50)
        //lay.setAnchorPoint(0.5,1)
        lay.setClippingEnabled(true)
        self.addChild(lay)

        lay.img = createSp("#wenziImg_1.png",cc.p(0,350),lay)
        lay.img.setAnchorPoint(0,1)


        var curImgIndex = 0
        var imgFun = function(){
            curImgIndex = 0
            doTouch.setPosition(200,500)
            titleLabel.setString(inf[curIndex].titleWz[curImgIndex])
            curImg.img = sprintf("showImg_%d.png",inf[curIndex].list[curImgIndex])
            curImg.setSpriteFrame(curImg.img)
            judgeWenzi()

            var list = inf[curIndex].list
            imgNode.removeAllChildren()
            var posx = 200
            for(var i = 0 ; i < list.length ; i++){
                var img = sprintf("#doImg_%d.png",list[i])
                var sp = createSp(img,cc.p(posx + i * 100 , 512),imgNode)
                sp.index = i 
                createTouchEvent({
                    item:sp,
                    begin:function(data){
                        var item = data.item
                        var index = item.index
                        if(curImgIndex == index)    return false
                        curImgIndex = index
                        curImg.img = sprintf("showImg_%d.png",inf[curIndex].list[curImgIndex])
                        curImg.setSpriteFrame(curImg.img)
                        titleLabel.setString(inf[curIndex].titleWz[curImgIndex])
                        doTouch.setPosition(item.x,500)
                        judgeWenzi()
                        return true
                    }
                })
            }
        }

        var judgeWenzi = function(){
            lay.img.setSpriteFrame(sprintf("wenziImg_%d.png",inf[curIndex].list[curImgIndex]))
            guntiaoBg.setVisible(false)
            lay.setPosition(450,50)
            lay.img.setPositionY(350)
            if(lay.img.width > 350){
                lay.setPositionX(450 - (lay.img.width-350))
            }
            if(lay.img.height > 350){
                guntiaoBg.setVisible(true)
                guntiao.setPositionY(288)
                guntiao.disHei = lay.img.height - 350
                guntiao.del = guntiao.disHei / 220
            }
        }

        createTouchEvent({
            item:guntiao,
            begin:function(data){
                var item = data.item
                if(!guntiaoBg.isVisible())      return false
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                var posy = item.y + delta.y
                if(posy < 289 && posy > 68){
                    item.y += delta.y
                    lay.img.y -= delta.y * item.del
                }
            }
        })

        //文字620,400  图片  300,240   剪切 600,220
        var inf = [
            {
                list:[1,2,3,4,5,6],
                titleWz:["试   管    (可直接加热)","蒸发皿    (可直接加热)","石棉网",
                        "烧   杯","烧   瓶","锥形瓶"
                        ],
            },{
                list:[7,8,9,10,11],
                titleWz:["集气瓶    (瓶口边缘磨砂)","广口瓶 、细口瓶    (瓶颈内侧磨砂)",
                        "滴    瓶","胶头滴管","水     槽"
                        ],
            },{
                list:[12],
                titleWz:["量    筒"],
            },{
                list:[13,14,15,16,17,18,19,20],
                titleWz:["酒精灯","漏     斗","温度计","玻璃棒","试管夹","方座支架    (铁架台)",
                        "三脚架","托盘天平"
                        ],
            }
        ]

        imgFun(0)

    }
})