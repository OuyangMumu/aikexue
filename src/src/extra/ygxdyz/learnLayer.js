var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        this.load()
        var self = this
        this.img_title.setVisible(false)
        this.img_page.setVisible(false)
        this.bg_title.setVisible(false)
        loadPlist("img_plist")
        var uiList = ["node_learn1","node_learn2","node_learn3",
                    "btn1","btn2","btn_back2","btn_back3",

                    "sun","yingzi","zhibg","zhi","shang","zheng","xia",
                    "judge1","judge2","judge3","btn_answer","topic","result1","result2",

                    "img","item1","item2","item3","hand"
                    ]
        var node = loadNode(res.ygxdyz_learnLayer_json,uiList)
        node.setPosition(0,0)
        self.inside_node.addChild(node)
        self.node = node
        node.time = [node.shang,node.zheng,node.xia]
        node.judge = [node.judge1,node.judge2,node.judge3]

        
        // node.btn2.addClickEventListener(function(){
        //     node.node_learn1.setPositionX(-570)
        //     node.node_learn3.setPositionX(570)
        //     for(var i = 0 ; i < 3 ; i++){
        //         node.time[i].setSpriteFrame(sprintf("time%d_1.png",i+1))
        //         node.judge[i].setSpriteFrame(sprintf("judge%d.png",i+1))
        //     }
        // })
        node.btn_back2.addClickEventListener(function(){
            node.node_learn1.setPositionX(570)
            node.node_learn2.setPositionX(-570)
        })
        node.btn_back3.addClickEventListener(function(){
            node.node_learn1.setPositionX(570)
            node.node_learn3.setPositionX(-570)
        })

        self.learn2()
        self.learn3()
        return true
    },

    learn2:function(){
        var node = this.node
        var curIndex = 0
        var beginPos = [30,140,250]//-50
        var endPos = [220,420,220]//35
        var curJudge = null //判断当前指向
        for(var i = 0 ; i < 3 ; i++){
            var time = node.time[i]
            time.index = i
            createTouchEvent({
                item:time,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    if(curIndex == index)   return false
                    curIndex = index
                    curJudge = null
                    node.zhi.setSpriteFrame("learn2_z1.png")
                    node.result1.setVisible(false)
                    node.result2.setVisible(false)
                    for(var i = 0 ; i < 3 ; i++){
                        node.time[i].setSpriteFrame(sprintf("time%d_1.png",i+1))
                        node.judge[i].setSpriteFrame(sprintf("judge%d.png",index*3+i+1))
                        node.judge[i].setPosition(beginPos[i],-50)
                        node.judge[i].over = false
                    }
                    item.setSpriteFrame(sprintf("time%d_2.png",index+1))
                    node.yingzi.setSpriteFrame(sprintf("yingzi%d.png",index+1))
                    node.topic.setSpriteFrame(sprintf("topic%d.png",index+1))
                    switch(index){
                        case 0:
                        node.zhi.setPosition(-180,80)
                        node.zhibg.setPosition(-180,80)
                        node.zhibg.setScaleX(1)
                        node.sun.setPosition(-400,70)
                        break
                        case 1:
                        node.zhi.setPosition(-180,80)
                        node.zhibg.setPosition(-180,80)
                        node.zhibg.setScaleX(1)
                        node.sun.setPosition(-310,125)
                        break
                        case 2:
                        node.zhi.setPosition(-420,80)
                        node.zhibg.setPosition(-420,80)
                        node.zhibg.setScaleX(-1)
                        node.sun.setPosition(-200,70)
                        break
                    }
                    return true
                }
            })

            var judge = node.judge[i]
            judge.index = i
            judge.over = false 
            createTouchEvent({
                item:judge,
                begin:function(data){

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
                    var index = item.index
                    
                    if(checkdistans(item,cc.p(endPos[curIndex],35),30)){
                        if(curJudge){
                            curJudge.setPosition(beginPos[curJudge.index],-50)
                        }
                        curJudge = item
                        item.setPosition(endPos[curIndex],35)
                        item.over = true
                    }else{
                        if(item.over)
                            curJudge = null
                        item.setPosition(beginPos[index],-50)
                        item.over = false
                    }
                }
            })
        }

        node.btn1.addClickEventListener(function(){
            node.node_learn1.setPositionX(-570)
            node.node_learn2.setPositionX(570)
            node.zhi.setPosition(-180,80)
            node.zhibg.setPosition(-180,80)
            node.zhibg.setScaleX(1)
            node.sun.setPosition(-400,70)
            curIndex = 0
            curJudge = null
            node.zhi.setSpriteFrame("learn2_z1.png")
            node.yingzi.setVisible(false)
            node.yingzi.setSpriteFrame("yingzi1.png")
            node.result1.setVisible(false)
            node.result2.setVisible(false)
            node.topic.setSpriteFrame("topic1.png")
            for(var i = 0 ; i < 3 ; i++){
                node.time[i].setSpriteFrame(sprintf("time%d_1.png",i+1))
                node.judge[i].setSpriteFrame(sprintf("judge%d.png",i+1))
                node.judge[i].setPosition(beginPos[i],-50)
                node.judge[i].over = false
            }
            node.time[0].setSpriteFrame("time1_2.png")
        })

        var result = [2,6,8]
        var result2 = [1,2,1]
        node.btn_answer.addClickEventListener(function(){
            node.zhi.setSpriteFrame(sprintf("learn2_z%d.png",curIndex+2))
            node.result2.setSpriteFrame(sprintf("judge%d.png",result[curIndex]))
            node.result2.setVisible(true)
            node.yingzi.setVisible(true)
            if(curIndex == 1)
                node.result1.setPositionX(500)
            else
                node.result1.setPositionX(330)
            if(curJudge){
                node.result1.setVisible(true)
                if(curJudge.index == result2[curIndex])
                    node.result1.setSpriteFrame("yes.png")
                else
                    node.result1.setSpriteFrame("no.png")
            }
        })

        var checkdistans = function(ra,rb,dis){
            var dx = ra.x - rb.x ;
            var dy = ra.y - rb.y ;
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
            cc.log(distance)
            if(distance <= dis)
                return true;
            else
                return false;
        }
    },

    learn3:function(){
        var node = this.node
        var pos = [cc.p(510,60),cc.p(460,0),cc.p(340,-65)]
        var curIndex = 0
        var handFun = function(){
            node.hand.stopAllActions()
            node.hand.runAction(cc.repeatForever(cc.sequence(
                cc.moveTo(0.2,node.hand.x-20,node.hand.y),
                cc.delayTime(0.1),
                cc.moveTo(0.2,node.hand.x,node.hand.y),
                cc.delayTime(0.1)
            )))
        }
        handFun()
        
        node.btn2.addClickEventListener(function(){
            node.node_learn1.setPositionX(-570)
            node.node_learn3.setPositionX(570)
            node.img.setSpriteFrame("img1.png")
            node.hand.setPosition(pos[0])
            handFun()
            for(var j = 0 ; j < 3 ; j++){
                if(0 == j){
                    itemList[j].setSpriteFrame(sprintf("pic%d_2.png",j+1))
                }else{
                    itemList[j].setSpriteFrame(sprintf("pic%d_1.png",j+1))
                }
            }
        })
        var itemList = [node.item1,node.item2,node.item3]
        for(var i = 0 ; i < 3 ; i++){
            var item = itemList[i]
            item.index = i 
            createTouchEvent({
                item:item,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    node.img.setSpriteFrame(sprintf("img%d.png",index+1))
                    for(var j = 0 ; j < 3 ; j++){
                        if(index == j){
                            node.hand.setPosition(pos[j])
                            handFun()
                            itemList[j].setSpriteFrame(sprintf("pic%d_2.png",j+1))
                        }else{
                            itemList[j].setSpriteFrame(sprintf("pic%d_1.png",j+1))
                        }
                    }
                    return true
                },
            })
        }
    }
})