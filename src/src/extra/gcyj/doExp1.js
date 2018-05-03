//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           
        })
        this._super()
        var self = this
        this.expCtor()
        this.initPeople()
        this.initUI()    
        return true
    },
    initUI:function(){
        var self = this
        var uiname = []
        var donode = ccs.load(res.doJson).node
        for(var i in donode.getChildren()){
            var childrens = donode.getChildren()[i]
            uiname.push(childrens.getName())
        }
        var node = loadNode(res.doJson, uiname)
        self.addChild(node)

        var drawYellow = new cc.DrawNode()
        self.addChild(drawYellow)

        self.currentPosition = "short"
        self.currentEye = "normalEye"
        self.curDistance = 0
        self.key = null
        isfirst = false
        
        node.xlz.initPos = node.xlz.getPosition()
        var eyesData =  {
                            "short":{
                                shortEye:{
                                    x:-2,
                                    mp:"wenzi1"
                                },
                                normalEye:{
                                    x:0,
                                    mp:"wenzi2"
                                },
                                longEye:{
                                    x:9,
                                    mp:"wenzi3"
                                }
                            },
                            "long":{
                                shortEye:{
                                    x:-12,
                                    mp:"wenzi1"
                                },
                                normalEye:{
                                    x:0,
                                    mp:"wenzi2"
                                },
                                longEye:{
                                    x:4,
                                    mp:"wenzi3"
                                }
                            }
                        }
        var drawLaAndEye = function(){
            
            var offsetx = eyesData[self.currentPosition][self.currentEye].x - self.curDistance/20
            node.xlz.x = node.xlz.initPos.x + offsetx
            var ascale = self.currentPosition == "short" ? (1 + offsetx/120):(0.7 + offsetx/120)
            node.xlz.setScale(ascale)
            var key = eyesData[self.currentPosition][self.currentEye].mp
            if(self.key != key && isfirst){
                self.key = key
                self.speakeBykey(key)
            }
            isfirst = true
            var pos1 = cc.p(node.dalz.x,node.dalz.y + node.dalz.height/2-1)
            var pos2 = cc.p(node.yq.x-3,node.yq.y + node.yq.height/2-5)

            var pos3 = cc.p(node.dalz.x,node.dalz.y - node.dalz.height/2+1)
            var pos4 = cc.p(node.yq.x-3,node.yq.y - node.yq.height/2+5)

            var pos5 = cc.p(node.dalz.x,node.dalz.y + node.dalz.height/2-2)
            var pos6 = cc.p(node.yq.x,node.yq.y)

            var pos7 = cc.p(node.dalz.x,node.dalz.y - node.dalz.height/2+2)
            var pos8 = cc.p(node.yq.x,node.yq.y)

            drawYellow.clear()
            drawYellow.drawSegment(pos1,pos2,1,cc.color(255,255,0))
            drawYellow.drawSegment(pos3,pos4,1,cc.color(255,255,0))
            drawYellow.drawSegment(pos5,pos6,1,cc.color(255,255,0))
            drawYellow.drawSegment(pos7,pos8,1,cc.color(255,255,0))

            var despos1 = cc.p(node.xlz.x-3,node.xlz.y + ((node.xlz.height/2-3)*node.xlz.getScaleY()))
            var despos2 = cc.p(node.xlz.x-3,node.xlz.y - ((node.xlz.height/2-3)*node.xlz.getScaleY()))

            drawYellow.drawSegment(pos6,despos2,1,cc.color(255,255,0))
            drawYellow.drawSegment(pos6,despos1,1,cc.color(255,255,0))

            drawYellow.drawSegment(pos2,despos2,1,cc.color(255,255,0))
            drawYellow.drawSegment(pos4,despos1,1,cc.color(255,255,0))
        }
 
        drawLaAndEye()
        var Touches = true
        createTouchEvent({
            item:node.red_point1,
            begin:function(){
                if(Touches){
                    Touches = false
                    return true
                }else{
                    return false
                }
            },
            end:function(data){
                Touches = true
                var item = data.item
                item.setVisible(true)
                node.red_point1_0.setVisible(false)
                node.dalz.setPosition(327,429)
                //node.xlz.setScale(1)
                self.currentPosition  = "short"
                drawLaAndEye()
            }
        })
        createTouchEvent({
            item:node.red_point1_0,
            begin:function(){
                if(Touches){
                    Touches = false
                    return true
                }else{
                    return false
                }
            },
            end:function(data){
                Touches = true
                var item = data.item
                item.setVisible(true)
                node.red_point1.setVisible(false)
                node.dalz.setPosition(133,429)
                //node.xlz.setScale(0.7)
                self.currentPosition  = "long"
                drawLaAndEye()
            }
        })
        createTouchEvent({
            item:node.red_point2,
            begin:function(){
                if(Touches){
                    Touches = false
                    return true
                }else{
                    return false
                }
            },
            end:function(data){
                Touches = true
                var item = data.item
                item.setVisible(true)
                node.red_point2_0.setVisible(false)
                node.red_point2_1.setVisible(false)
                node.eye.setTexture(res.eyes1)
                node.yq.setTexture(res.yq1)
                self.currentEye = "shortEye"
                drawLaAndEye()
            }
        })
        createTouchEvent({
            item:node.red_point2_0,
            begin:function(){
                if(Touches){
                    Touches = false
                    return true
                }else{
                    return false
                }
            },
            end:function(data){
                Touches = true
                var item = data.item
                item.setVisible(true)
                node.red_point2.setVisible(false)
                node.red_point2_1.setVisible(false)
                node.eye.setTexture(res.eyes2)
                node.yq.setTexture(res.yq2)
                self.currentEye = "normalEye"
                drawLaAndEye()
            }
        })
        createTouchEvent({
            item:node.red_point2_1,
            begin:function(){
                if(Touches){
                    Touches = false
                    return true
                }else{
                    return false
                }
            },
            end:function(data){
                Touches = true
                var item = data.item
                item.setVisible(true)
                node.red_point2.setVisible(false)
                node.red_point2_0.setVisible(false)
                node.eye.setTexture(res.eyes3)
                node.yq.setTexture(res.yq3)
                self.currentEye = "longEye"
                drawLaAndEye()
            }
        })
        
        var jings = [node.aojing1,node.aojing2,node.tujing1,node.tujing2]
        var distance = [-100,-200,100,200]
        for (var i = 0; i < jings.length; i++) {
            jings[i].initPos = jings[i].getPosition()
            jings[i].infoDis = distance[i]
            createTouchEvent({
                item:jings[i],
                begin:function(){
                    if(Touches){
                        Touches = false
                        return true
                    }else{
                        return false
                    }
                },
                end:function(data){
                    Touches = true
                    var item = data.item
                    if(!item.inMubiao){
                        item.inMubiao = true
                        item.setPosition(621,412)
                        self.curDistance = item.infoDis
                    }else{
                        item.inMubiao = false
                        item.setPosition(item.initPos)
                        self.curDistance = 0
                    }
                    for (var k = 0; k < jings.length; k++){
                         if(jings[k]!= item){
                            jings[k].inMubiao = false
                            jings[k].setPosition(jings[k].initPos)
                         }
                    }
                    drawLaAndEye()
                }
            })
        }
       
    },
    speakeBykey:function(key){
        var self = this
        self.nodebs.say({
                    key: key,
                    force: true,
                    fun:function(){
                        self.key = null
                    }
                })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
               
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,900);
        
        addContent({
            people: this.nodebs,
            key: "wenzi1",
            img:res.wenzi1,
            sound: res.zimp1
        })

        addContent({
            people: this.nodebs,
            key: "wenzi2",
            img:res.wenzi2,
            sound: res.zimp2
        })

        addContent({
            people: this.nodebs,
            key: "wenzi3",
            img:res.wenzi3,
            sound: res.zimp3
        })
    }  
})