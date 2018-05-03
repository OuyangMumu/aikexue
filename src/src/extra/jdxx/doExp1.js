var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        var self = this
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        var uiList = ["hand","bolibang","sichou","tip1","tip2"]
        var node = loadNode(res.jdxx_doExp1_json,uiList)
        self.inside_node.addChild(node)

        var label = new cc.LabelTTF("1.抓起丝绸摩擦玻璃棒\n2.分别摩擦玻璃棒不同次数\n3.观察玻璃棒分别会有什么现象", "", 22)
        label.setPosition(800,560)
        self.addChild(label)

        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
        })
        var num = 0
        var paomoList = []
        var randList = []
        for(var i = 0 ; i < 14 ; i++){
            var name = "paomo_" + i
            var paomo = node.getChildByName(name)
            paomoList.push(paomo)
        }
        node.tip1.getChildByName("jiantou").runAction(cc.repeatForever(cc.sequence(
            cc.delayTime(0.1),
            cc.moveTo(0.4,50,-30),
            cc.delayTime(0.1),
            cc.moveTo(0.4,60,-15)
        )))
        var hand = node.hand
        hand.sichou = false
        hand.boli = false
        hand.noMove = false
        createTouchEvent({
            item:hand,
            begin:function(data){
                return true
            },
            move:function(data){
                var item = data.item 
                var delta = data.delta 
                if(!item.noMove){
                    item.x += delta.x 
                    item.y += delta.y
                }else{
                    if(item.x + delta.x > 350 && item.x + delta.x < 495 &&
                    item.y + delta.y > 290 && item.y + delta.y < 380){
                        item.x += delta.x   //公式  y = 0.62K + 73
                        item.y = 0.62 * item.x + 73
                        num = num + Math.abs(delta.x)
                    }
                }
                

                if(!item.sichou && checkdistans(item,node.sichou,80)){
                    item.sichou = true
                    item.boli = true
                    item.setTexture(res.hand2)
                    node.tip1.setPositionY(-200)
                    node.sichou.setPositionY(-200)
                    self.nodebs.say({key:"do1_tip2",force:true})
                    node.tip2.setVisible(true)
                    node.tip2.getChildByName("jiantou").runAction(cc.repeatForever(cc.sequence(
                        cc.delayTime(0.1),
                        cc.moveTo(0.4,70,-30),
                        cc.delayTime(0.1),
                        cc.moveTo(0.4,60,-15)
                    )))
                }

                if(item.boli && checkdistans(item,cc.p(290,450),150)){
                    item.boli = false
                    item.noMove = true
                    item.setRotation(40)
                    node.tip2.setPositionY(-200)
                    item.setPosition(425,336.5)
                }   
            },
            end:function(data){
                var item = data.item 
                if(item.noMove){
                    node.bolibang.setRotation(0)
                    item.setTexture(res.hand)
                    item.setRotation(0)
                    item.setPosition(730,370)
                    node.sichou.setPosition(760,160)
                    item.removeListen()
                    var rand = getRand(14)    //先随机得到14个泡沫
                    var count = 0
                    if(num < 100)
                        count = 0
                    else if(num <= 200)
                        count = 4
                    else if(num < 600 && num > 200)
                        count = 8
                    else
                        count = 14
                    for(var i = 0 ; i < count ; i++){
                        var paomo = paomoList[rand[i]]
                        paomo.runAction(cc.moveTo(0.3,paomo.x,215))
                    }
                }
            }
        })

        var checkdistans = function(ra,rb,dis){
            var dx =  ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis){
                return true
            }else
                return false
        }

    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1030, 120)
        })
        this.addChild(this.nodebs,99)
        
        var addList = [
            {key:"do1_tip1",sound:res.do1_sound1},
            {key:"do1_tip2",sound:res.do1_sound2},
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                sound: addList[i].sound,
            })
        }
    },
})