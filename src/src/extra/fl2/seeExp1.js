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
        loadPlist("small_plist")
        self.nodebs.show(function(){
            self.nodebs.say({key:"see1_tip1"})
        })
        var uiList = ["judge1","judge2","judge3","judge4","judge5",
                    "judge6","judge7","judge8","judge9","judge10",
                    "judge11","judge12","judge13",
                    "kuang1","kuang2","kuang3",
                    "shuru1","shuru2","shuru3",
                    "input1","input2","input3",
                    "btn_result","btn_tip"]
        var node = loadNode(res.fl_seeExp1_json, uiList)
        self.inside_node.addChild(node)

        node.btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"result"})
        })
        node.btn_tip.addClickEventListener(function(){
            self.answerImg.show()
        })

        var shuruList = [node.shuru1,node.shuru2,node.shuru3]
        var inputList = [node.input1,node.input2,node.input3]
        for(var i = 0 ; i < 3 ; i++){
            var item = inputList[i]
            item.index = i
            addInput({
                item: item,
                inputSize: 25,
                color: cc.color(200,200,0,255),
                touchFun: function(data) {
                    var item = data
                    shuruList[item.index].setVisible(false)
                },
            })
        }

        var boxList = [node.kuang1,node.kuang2,node.kuang3]
        for(var i = 0 ; i < 3 ; i++){
            boxList[i].fruit = []//用于存放果实数组
        }

        for(var i = 0 ; i < 13 ; i++){
            var item = node[uiList[i]]
            item.index = i+1
            item.beginPos = item.getPosition()
            createTouchEvent({
                item:item,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    item.setLocalZOrder(20)
                    delFun(item)
                    return true
                },
                move:function(data){
                    var item = data.item
                    var index = item.index
                    var delta = data.delta 
                    item.x += delta.x 
                    item.y += delta.y 
                },
                end:function(data){
                    var item = data.item
                    var pos = data.pos
                    item.setPosition(item.beginPos)
                    for(var i = 0 ; i < 3 ; i++){
                        var box = boxList[i]
                        var judge = judgeInside({item:box,pos:pos})
                        if(judge){
                            if(!inputList[i].getStr()){
                                createDialog()
                                return false
                            }
                            box.fruit.push(item)
                            item.setScale(0.7)
                            item.setSpriteFrame(sprintf("small%d.png",item.index))
                            sortFun(box)
                            break
                        }
                    }
                    
                }
            })
        }

        var delFun = function(item){
            for(var i = 0 ; i < 3 ; i++){
                var fruit = boxList[i].fruit
                if(fruit){
                    for(var j = 0 ; j < fruit.length ; j++){
                        if(fruit[j].index == item.index){
                            fruit.splice(j, 1)
                            item.setSpriteFrame(sprintf("judge%d.png",item.index))
                            item.setScale(1)
                            sortFun(boxList[i])
                            break
                        }
                    }
                }
            }
        }

        var sortFun = function(box){
            var fruit = box.fruit
            var posX = box.x - 70
            for(var i = 0 ; i < fruit.length ; i++){
                var item = fruit[i]
                if(i < 3){
                    item.setPosition(posX + 60 * i , 260)
                }else if(i < 6){
                    item.setPosition(posX + 60 * (i-3) , 210)
                }else if(i < 9){
                    item.setPosition(posX + 60 * (i-6) , 160)
                }else{
                    item.setPosition(posX + 50 * (i-9) , 110)
                }
            }
        }

        var createDialog = function(){
            dialogControl.AddDialog("Tips", {
                res: res.see1_tip4,
                face: 2,
                father: self
            })
        }
        
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1030, 130)
        })
        this.addChild(this.nodebs,99)
        addContent({
            people: this.nodebs,
            key: "see1_tip1",
            img: res.see1_tip1,
            sound: res.see1_sound1
        })
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.see1_tip2,
            sound: res.see1_sound2,
            id: "result",
        })
        this.answerImg = createShowImg({
            img:res.see1_tip3,
        })
        safeAdd(this, this.answerImg)
    }
})