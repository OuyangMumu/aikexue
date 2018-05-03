var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "seeExp1", 
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
        var inside = this.inside_node
        loadPlist("earth_plist")
        loadPlist("sun_plist")
        //createMatchEll()
        self.nodebs.show(function(){
            self.nodebs.say({key:"see_tip0"})
        })
        var createSp = function(sprite,pos,father){
            var sp = new cc.Sprite(sprite)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }
        createSp(res.see_bg,cc.p(568,320),inside)
        var sun = createSp("#sun01.png",cc.p(530,360),self)
        var taiyang = createSp("#taiyang.png",cc.p(530,360),self)
        var north = createSp(res.north,cc.p(150,100),self)
        north.runAction(cc.repeatForever(cc.rotateBy(13,-360)))
        var diqiu = createSp("#earth01.png",cc.p(900,100),self)
        diqiu.runAction(cc.repeatForever(createAnimation({
                frame: "earth%02d.png",
                end: 90,
                time: 0.12,
            })))

        var ani_sun = function() {
            return cc.sequence(createAnimation({
                frame: "sun%02d.png",
                end: 10,
                time:0.1,
                rever:true,
            }))
        }
        var ani = function(frame,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                end: end,
                time: time,
            }))
        }
        sun.setScale(1.1)
        sun.runAction(cc.repeatForever(cc.sequence(
            ani("sun%02d.png",10,0.1),
            ani_sun()
        )))


        var mix = cc.p(20, 50)
        var timeDevide = 0.001
        var getMyRotate = []
        var earth = new cc.Sprite()
        var points = null
        var count = -25  //用于判断位置
        var curCount = 0
        var createEarth = function() {
            points = getEllipsePoint({
                a: 330,
                b: 160,
                devide: 1.2,
                ifRotate: true,
                useWeight:true,
                getMyRotate: getMyRotate,  //将内部属性角度值拿出来
            })
            var ell = drawEllipse({
                buf: points,
                color: cc.color(245, 180, 0, 255),
                seg: 1.5,
                //ifPoint:true,
            })
            //ell.setPosition(getMiddle(mix.x, mix.y))
            ell.setPosition(530,360)
            safeAdd(self, ell)
            
            
            var ani = cc.repeatForever(createAnimation({
                frame: "earth%02d.png",
                end: 90,
                time: 0.12,
            }))
            earth.runAction(ani)
            earth.setRotation(30)
            earth.setScale(0.5)
            earth.setLocalZOrder(10)
            goWithPos({
                item: earth,
                posList: points,
                time: 0.001,
                repeat: cc.REPEAT_FOREVER,
                init: true,
                rootPos: cc.p(530,360),
                fun: function(index) {
                    var myRotate = Math.floor(getMyRotate[index])
                    if (self.yx && myRotate) {
                        var yx = self.yx
                        //cc.log(myRotate)
                        drawFun()
                        if(myRotate > 180 || myRotate < 3)
                            self.drawLine.setLocalZOrder(earth.getLocalZOrder()-1)
                        else
                            self.drawLine.setLocalZOrder(earth.getLocalZOrder()+1)
                        switch (Math.floor((myRotate - 1) / 90)) {
                            case 0:
                                var percent = myRotate / 90 
                                yx.run1(percent)
                                yx.diqiuRun1(myRotate)
                                if(curCount != 0){
                                    count = -25
                                    curCount = 0
                                }
                                count += 0.3
                                break
                            case 1:
                                var percent = (myRotate - 90) / 90
                                yx.run2(percent)
                                yx.diqiuRun1(myRotate)
                                if(curCount != 1){
                                    count = 0
                                    curCount = 1
                                }
                                count += 0.25
                                break
                            case 2:
                                var percent = (myRotate - 180) / 90
                                yx.run3(percent)
                                yx.diqiuRun3(myRotate)
                                if(curCount != 2){
                                    count = 25
                                    curCount = 2
                                }
                                count -= 0.3
                                break
                            case 3:
                                var percent = (myRotate - 270) / 90
                                yx.run4(percent)
                                yx.diqiuRun4(myRotate)
                                if(curCount != 3){
                                    count = 10
                                    curCount = 3
                                }
                                count -= 0.1
                                break
                        }
                    }
                }
            })
            safeAdd(self, earth)
        }
        createEarth()

        //画线连接地球和太阳
        self.drawLine = null
        var posList = [515,390,190,360]

        var drawFun = function(){
            if(self.drawLine)
                self.drawLine.removeFromParent(true)
            self.drawLine = new cc.DrawNode()
            self.addChild(self.drawLine)
            self.drawLine.drawSegment(cc.p(sun.getPosition()),
                cc.p(earth.x,earth.y+count),1,cc.color(254, 242, 48, 255))
        }

        var createClip = function() {
            var yx = new cc.Node()
            yx.setPosition(north.x,north.y)
            safeAdd(self, yx)

            var leftClip = new cc.Sprite(res.clip)
            leftClip.setFlippedX(true)
            leftClip.setAnchorPoint(1, 0.5)
            var left = new cc.ClippingNode()
            left.setStencil(leftClip)
            left.setAlphaThreshold(0)
            safeAdd(yx, left)
            var leftIn = new cc.Sprite(res.clip)
            leftIn.setAnchorPoint(1, 0.5)
            leftIn.setFlippedX(true)
            safeAdd(left, leftIn)
            leftIn.setOpacity(200)

            var rightClip = new cc.Sprite(res.clip)
            rightClip.setAnchorPoint(0, 0.5)
            var right = new cc.ClippingNode()
            right.setStencil(rightClip)
            right.setAlphaThreshold(0)
            safeAdd(yx, right)
            var rightIn = new cc.Sprite(res.clip)
            rightIn.setAnchorPoint(0, 0.5)
            safeAdd(right, rightIn)
            rightIn.setOpacity(200)

            var diqiuXy = new cc.Node()
            diqiuXy.setPosition(91,91)
            safeAdd(diqiu, diqiuXy)
            var diqiuClip = new cc.Sprite(res.clip)
            diqiuClip.setPosition(900,100)
            diqiuClip.setAnchorPoint(0, 0.5)
            safeAdd(self, diqiuClip)
            diqiuClip.setScaleX(-1)
            diqiuClip.setRotation(30)
            diqiuClip.setOpacity(180)

            var a = new cc.Sprite(res.north)
            a.setAnchorPoint(0.5, 0.5)
            var lineClip = new cc.ClippingNode()
            lineClip.setStencil(a)
            lineClip.setAlphaThreshold(0)
            safeAdd(diqiuXy, lineClip)
            var diqiuline = new cc.Sprite(res.earthLine)
            diqiuline.setPosition(-91, 0)
            lineClip.addChild(diqiuline)

            var earthXy = new cc.Node()
            earthXy.setPosition(91,91)
            safeAdd(earth, earthXy)
            var b = new cc.Sprite(res.north)
            b.setAnchorPoint(0.5, 0.5)
            var lineClip2 = new cc.ClippingNode()
            lineClip2.setStencil(b)
            lineClip2.setAlphaThreshold(0)
            safeAdd(earthXy, lineClip2)
            var earthline = new cc.Sprite(res.earthLine)
            earthline.setPosition(-91, 0)
            lineClip2.addChild(earthline)

            earthline.runAction(cc.repeatForever(cc.sequence(
                    cc.moveTo(9, 91, 0),
                    cc.callFunc(function(){
                        earthline.setPositionX(-91)
                    })
                )))
            //var diqiulineRun = function(){
                diqiuline.runAction(cc.repeatForever(cc.sequence(
                    cc.moveTo(9, 91, 0),
                    cc.callFunc(function(){
                        diqiuline.setPositionX(-91)
                    })
                )))
            //}

            var diqiuRun1 = function(rate){
                diqiuClip.setRotation(30 - rate / 3)
            }
            var diqiuRun3 = function(rate){
                diqiuClip.setRotation((rate-180)/3-30)
            }
            var diqiuRun4 = function(rate){
                diqiuClip.setRotation((rate-270)/3)
            }
            var run1 = function(percent){
                leftClip.setScaleX(0)
                left.setInverted(true)
                rightClip.setScaleX(1 - (0.5+0.5*percent))
                right.setInverted(false)
            }

            var run2 = function(percent) {
                right.setInverted(true)
                rightClip.setScaleX(1)
                leftClip.setScaleX(0.5*percent)
                left.setInverted(true)
            }

            var run3 = function(percent) {
                left.setInverted(true)
                leftClip.setScaleX(1 - (0.5+0.5*percent))
                right.setInverted(false)
                rightClip.setScaleX(0)
            }

            var run4 = function(percent) {
                leftClip.setScaleX(0)
                left.setInverted(true)
                right.setInverted(false)
                rightClip.setScaleX(0.5*percent)
            }
            yx.run1 = run1
            yx.run2 = run2
            yx.run3 = run3
            yx.run4 = run4
            yx.diqiuRun1 = diqiuRun1
            yx.diqiuRun3 = diqiuRun3
            yx.diqiuRun4 = diqiuRun4
            self.yx = yx
        }
        createClip()


        var modify = 100
        var fontList = null
        var fontListFun = function(){
            fontList = [{
                name: "小寒",
                time: "1月5~7日",
                modify: cc.p(modify + 20, 10),
                date: 0.8,
            },{
                name: "大寒",
                time: "1月20~21日",
                modify: cc.p(modify + 0, 40),
                date: 1.2,
            },{
                name: "立春",
                time: "2月3~5日",
                modify: cc.p(modify - 10, 45),
                date: 2,
            },{
                name: "雨水",
                time: "2月18~20日",
                modify: cc.p(modify - 50, 65),
                date: 3,
            },{
                name: "惊蛰",
                time: "3月5~7日",
                modify: cc.p(modify - 65, 65),
                date: 4.5,
            },{
                name: "春分",
                time: "3月20~21日",
                modify: cc.p(0, -40),
                date: 6,
            },{
                name: "清明",
                time: "4月4~6日",
                modify: cc.p(-modify + 60, 70),
                date: 8,
            },{
                name: "谷雨",
                time: "4月19~21日",
                modify: cc.p(-modify + 50, 70),
                date: 9.5,
            },{
                name: "立夏",
                time: "5月5~7日",
                modify: cc.p(-modify - 10, 50),
                date: 10,
            },{
                name: "小满",
                time: "5月20~22日",
                modify: cc.p(-modify - 30, 30),
                date: 10.5,
            },{
                name: "芒种",
                time: "6月5~7日",
                modify: cc.p(-modify - 30, 30),
                date: 11.5,
            },{
                name: "夏至",
                time: "6月21~22日",
                modify: cc.p(-modify + 200, 0),
                date: 12,
            },{
                name: "小暑",
                time: "7月6~8日",
                modify: cc.p(-modify - 30, -30),
                date: 12.5,
            },{
                name: "大暑",
                time: "7月22~24日",
                modify: cc.p(-modify - 0, -50),
                date: 13,
            },{
                name: "立秋",
                time: "8月7~9日",
                modify: cc.p(-modify + 30, -60),
                date: 13.5,
            },{
                name: "处暑",
                time: "8月22~24日",
                modify: cc.p(-modify + 50, -70),
                date: 14.5,
            },{
                name: "白露",
                time: "9月7~9日",
                modify: cc.p(-modify + 80, -70),
                date: 15.5,
            },{
                name: "秋分",
                time: "9月22~24日",
                modify: cc.p(0, 40),
                date: 18,
            },{
                name: "寒露",
                time: "10月8~9日",
                modify: cc.p(modify - 70, -70),
                date: 19.5,
            },{
                name: "霜降",
                time: "10月23~24日",
                modify: cc.p(modify - 55, -70),
                date: 21,
            },{
                name: "立冬",
                time: "11月7~8日",
                modify: cc.p(modify - 40, -60),
                date: 22,
            },{
                name: "小雪",
                time: "11月22~23日",
                modify: cc.p(modify - 30, -40),
                date: 23,
            },{
                name: "大雪",
                time: "12月6~8日",
                modify: cc.p(modify + 0, -20),
                date: 23.5,
            },{
                name: "冬至",
                time: "12月21~23日",
                modify: cc.p(-modify, 0),
                date: 24,
            }]
        }
        fontListFun()

        
        //获取坐标的索引下标
        var posIndex = []
        for(var i = 0 ; i < fontList.length ; i++){
            var rate = fontList[i].date * 15
            for(var j = 0 ; j < getMyRotate.length ; j++){
                if(rate == Math.floor(getMyRotate[j])){
                    posIndex[i] = j
                    break
                }else{
                    if(rate < Math.floor(getMyRotate[j+1]) && rate > Math.floor(getMyRotate[j-1])){
                        if(rate - Math.floor(getMyRotate[j-1]) < Math.floor(getMyRotate[j+1]) - rate)
                            posIndex[i] = j - 1
                        else
                            posIndex[i] = j + 1
                        break
                    }

                }
            }
        }

        createTouchEvent({
            item: earth,
            begin: function(data) {
                var item = data.item
                item.changeAct()
                if(curItem){
                    curItem.setPositionY(curItem.y-15)
                    fontLabel[curItem.index].setVisible(false)
                    curIndex = 30
                    curItem = null
                }
                return true
            }
        })

        var fontLabel = []
        var curIndex = 30
        var curItem = null
        var beside = cc.p(530,360)
        for (var i = 0; i < fontList.length; i++) {
            var font = new cc.LabelTTF(fontList[i].name, null, 22)
            var point = points[posIndex[i]]
            font.setPosition(point.x + beside.x + fontList[i].modify.x,
                point.y + beside.y + fontList[i].modify.y)
            safeAdd(self, font)
            font.index = i
            font.posIndex = posIndex[i]
            fontLabel[i] = new cc.LabelTTF(fontList[i].time, null, 15)
            fontLabel[i].setPosition(font.x,font.y-15)
            self.addChild(fontLabel[i])
            fontLabel[i].setVisible(false)
            createTouchEvent({
                item:font,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    if(curIndex == index)   return false 
                    curIndex = index
                    if(curItem){
                        curItem.setPositionY(curItem.y-15)
                        fontLabel[curItem.index].setVisible(false)
                    }
                    curItem = item
                    fontLabel[index].setVisible(true)
                    item.runAction(cc.moveTo(0.2,item.x,item.y+15))
                    earth.goTo({
                        index: item.posIndex,
                    })
                    return true
                },
                // move:function(data){
                //     var item = data.item 
                //     var delta = data.delta 
                //     item.x += delta.x 
                //     item.y += delta.y
                // },
                end:function(data){
                    var item = data.item
                    var index = item.index
                    self.nodebs.say({key:self.sayKey[index+1],force:true})
                }
            })
        }
        var _wenzi = "       由于地球倾斜着绕太阳旋转，使得太阳光\n的直射以赤道为中心，以南北回归线为界限南\n北扫动，每年一次，循环不断，从而形成了地\n球上一年四季顺序交替的现象。"
        var wenzi = new cc.LabelTTF(_wenzi, null, 20)
        wenzi.setPosition(540,50)
        self.addChild(wenzi)
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1040, 130)
        })
        this.addChild(this.nodebs)
        var self = this
        this.sayKey = [
            "see_tip0","see_tip1","see_tip2","see_tip3","see_tip4","see_tip5","see_tip6",
            "see_tip7","see_tip8","see_tip9","see_tip10","see_tip11","see_tip12","see_tip13",
            "see_tip14","see_tip15","see_tip16","see_tip17","see_tip18","see_tip19","see_tip20",
            "see_tip21","see_tip22","see_tip23","see_tip24",
        ]
        var addList = [
            {sound:res.see_sound0},{sound:res.see_sound1},{sound:res.see_sound2},
            {sound:res.see_sound3},{sound:res.see_sound4},{sound:res.see_sound5},
            {sound:res.see_sound6},{sound:res.see_sound7},{sound:res.see_sound8},
            {sound:res.see_sound9},{sound:res.see_sound10},{sound:res.see_sound11},
            {sound:res.see_sound12},{sound:res.see_sound13},{sound:res.see_sound14},
            {sound:res.see_sound15},{sound:res.see_sound16},{sound:res.see_sound17},
            {sound:res.see_sound18},{sound:res.see_sound19},{sound:res.see_sound20},
            {sound:res.see_sound21},{sound:res.see_sound22},{sound:res.see_sound23},
            {sound:res.see_sound24},
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: self.sayKey[i],
                sound: addList[i].sound,
            })
        }
    }
})