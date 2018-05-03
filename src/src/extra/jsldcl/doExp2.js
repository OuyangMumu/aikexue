var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        var self = this
        this.expCtor({
            vis: false,
            setZ:99,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun:function(){
                    if(!self.biaoge){
                        var bg = createBiaoge({
                            json: res.jsldcl_table_json,
                            scale:0.9,
                            judgeScale:0.7,
                            inputNum: 4,
                            downData: {
                                nums: 4,
                                scale:1.3,
                                bufs: [
                                    [null, res.do1_yu1, res.do1_yu2, res.do1_yu3, res.do1_yu4, res.do1_yu5],
                                    [null, res.do1_yu1, res.do1_yu2, res.do1_yu3, res.do1_yu4, res.do1_yu5],
                                    [null, res.do1_yu1, res.do1_yu2, res.do1_yu3, res.do1_yu4, res.do1_yu5],
                                    [null, res.do1_yu1, res.do1_yu2, res.do1_yu3, res.do1_yu4, res.do1_yu5], 
                                ],
                            },
                        })
                        self.biaoge = bg
                        safeAdd(self, bg)
                    }
                    self.biaoge.show()
                },
            }
        })
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        var uiList = ["strip","drag","btn_start","waterNode","fen","shi",
                    "water","btn_table"]
        var node = loadNode(res.jsldcl_doExp2_json,uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"do2_tip1"})
        })

        node.isStop = false
        var waterPosList = [83,93,103,113,123,133,143,153,180]
        var cupPosList = [-62,-110,-175,-223,-270,-320,-364,-428,-500]

        var fdj_sp = new cc.Sprite(res.fdjjm)
        var bigfdj = new cc.ClippingNode(fdj_sp)
        bigfdj.setPosition(200,160)
        bigfdj.setAlphaThreshold(0)
        self.addChild(bigfdj)

        var bigWater = new cc.Sprite(res.bigWater)
        bigWater.setPosition(0,-40)
        bigfdj.addChild(bigWater)

        var bigCup = new cc.Sprite(res.bigCup)
        bigCup.setPosition(0,-150)
        bigCup.setAnchorPoint(0.5,0)
        bigfdj.addChild(bigCup)

        var fdjjm = new cc.Sprite(res.fdjjm)
        fdjjm.setPosition(200,160)
        fdjjm.setScale(1.02)
        self.addChild(fdjjm)

        node.btn_table.addClickEventListener(function(){
            self.nodebs.say({key:"do2_result"})
        })
        node.btn_start.addClickEventListener(function(){
            node.isStop = true
            waterMove()
            node.btn_start.setEnabled(false)
            node.btn_start.setOpacity(150)
            node.fen.runAction(cc.repeatForever(cc.rotateBy(0.5,360)))
            node.shi.runAction(cc.sequence(
                cc.rotateBy(12, 720),
                cc.callFunc(function(){
                    node.fen.stopAllActions()
                    node.fen.setRotation(0)
                    node.shi.setRotation(0)
                    self.node.setClean()
                    node.btn_start.setEnabled(true)
                    node.btn_start.setOpacity(255)
                    node.isStop = false
                })
            ))
        })

        var waterMove = function(){
            bigWater.setPosition(0,-40)
            bigCup.setPosition(0,-150)
            var scaleX = Math.floor(node.strip.getScaleX() * 10) 
            var posY = 0
            if(scaleX > 8)
                scaleX = 8
            var index = scaleX  //得到当前的坐标
            scaleX = scaleX * 0.1 + 0.1  //转换作为为scale值
            if(scaleX == 0.9)
                scaleX = 1
            self.addYanParticle(scaleX)
            node.water.setPositionY(67)
            node.water.runAction(cc.sequence(
                cc.delayTime(1),
                cc.callFunc(function(){
                    bigWater.runAction(cc.moveTo(10,bigWater.x,-14))
                    bigCup.runAction(cc.moveTo(12,bigCup.x,cupPosList[index]-125))
                }),
                cc.moveTo(12, cc.p(node.water.x ,waterPosList[index] ))
            ))
        }

        self.waterNode = node.waterNode
        
        createTouchEvent({
            item:node.drag,
            begin:function(data){
                if(node.isStop)
                    return false
                return true 
            },
            move:function(data){
                var item = data.item 
                var delta = data.delta 
                if(item.x+delta.x < 210 && item.x+delta.x > 5){
                    item.x += delta.x
                    node.strip.setScaleX(item.x/200)
                }
            },
            end:function(data){

            }
        })  
        
    },

    addYanParticle:function(index){
        var total = 100 + 400 * index
        var dis = 3000 - 1000 * index
        var smoke = this.createWaterAir({
            total: total,
            width:140,
            height:-15,
            res:res.waterPar,
            dis:dis,
        })
        smoke.setPosition( 20 - 15 * index, 10 + 5 * index)//50 - 100 * index
        smoke.setScale(0.3 + 0.3 * index)
        this.waterNode.removeAllChildren(true)
        this.waterNode.setPositionY(570)
        this.waterNode.addChild(smoke);
    },

    createWaterAir:function (data){
        var self = this
        var total = data.total
        var width = data.width
        var height = data.height
        var tex = data.res

        var size = data.size || cc.size(8, 10)
        var finalsize = data.finalsize || cc.size(8, 10) //130,40
        var sizevar = data.sizevar || cc.size(8, 10) //40,10

        var rotate = data.rotate || 180
        var rotatevar = data.rotatevar || 0
        var dis = data.dis || 1000
        var disvar = data.disvar || 10
        var time = data.time || 1.4
        var timevar = data.timevar || 0//0.2

        var node = new cc.SpriteBatchNode(tex)
        node.list = []

        var reinit = function(temp, ifdelay) {
            if(temp.ifclean){
                return 
            }
            self.waterNode.setPositionY(620)
            ifdelay = ifdelay || false
            temp.setPosition(width * Math.random(), height * Math.random())
            var randsize = cc.size(size.width + Math.random() * sizevar.width, size.height + Math.random() * sizevar.height)
            var endSize = cc.size(finalsize.width + Math.random() * sizevar.width, finalsize.height + Math.random() * sizevar.height)
            setSize({
                item: temp,
                width: randsize.width,
                height: randsize.height,
            })
            rotate = (193 - temp.x/140 * 30)
            var randdis = dis + Math.random() * disvar
            var randRotate = rotate + Math.random() * rotatevar
            var buf = cc.p(randdis * Math.sin(randRotate / 180 * Math.PI), randdis * Math.cos(randRotate / 180 * Math.PI))
            var delay = ifdelay ? Math.random() * time : 0
            var finalTime = time + Math.random() * timevar
            temp.count = 0
            
            temp.setRotation(randRotate)
            temp.stopAllActions()
            temp.setOpacity(0)
            temp.runAction(cc.sequence(cc.delayTime(delay),cc.callFunc(function(){
                temp.setOpacity(255)
            })) )
            addShowType({
                item: temp,
                show: "scaleSize",
                time: finalTime,
                buf: endSize,
                delay: delay,
                fun: function(item) {
                    item.count--
                    if (item.count <= 0) {
                        reinit(item)
                    }
                }
            })
            temp.count++
            addShowType({
                item: temp,
                show: "moveTo",
                time: finalTime,
                buf: buf,
                delay: delay,
                fun: function(item) {
                    item.count--
                    if (item.count <= 0) {
                        reinit(item)
                    }
                }
            })
            temp.count++
        }

        for (var i = 0; i < total; i++) {
            var temp = new cc.Sprite(tex)
            reinit(temp, true)
            node.list[i] = temp
            node.addChild(temp)
        }

        node.setClean = function(){
            var node = this
            if(node.list){
                for (var i = 0; i < node.list.length; i++) {
                    node.list[i].ifclean = true
                }
            }
        }
        this.node = node

        return node
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        
        addContent({
            people: this.nodebs,
            key: "do2_tip1",
            img: res.do2_tip1,
            sound: res.do2_sound1,
        })
        addContent({
            people: this.nodebs,
            key: "do2_result",
            img: res.do2_result_tip,
            id:"result"
        })
        
    },
})