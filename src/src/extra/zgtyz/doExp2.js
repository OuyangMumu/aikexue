var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        this.expCtor();
        //this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var uiList = [
            "btn_next","fen","shi","guimian","zhen","ty",
            "yy1","yy2","yy3","znz"
        ]
        var self = this
        var node = loadNode(res.zgtyz_doExp2_json,uiList)
        self.inside_node.addChild(node)

        var zhen = node.zhen
        var sun = node.ty
        var myScale = [1.2,1.1,0.8,0.7,0.6,0.5,0.5,0.6,0.7,0.9,1,1.1]
        var myRotate = [0,8,18,30,45,65,87,110,130,145,159,170,178]
        var sunPos = [cc.p(-62,408),cc.p(80,465),cc.p(196,537),cc.p(296,570),
                    cc.p(400,590),cc.p(508,595),cc.p(557,610),cc.p(658,592),
                    cc.p(770,576),cc.p(852,560),cc.p(935,514),cc.p(1060,470),cc.p(1160,408),
        ]
        node.canRun = true
        var num = 0
        var lineList = []
        for(var i = 0 ; i < 12 ; i++){
            var name = "line_" + (i+1)
            var line = node.guimian.getChildByName(name)
            line.setVisible(false)
            lineList.push(line)
        }
        node.btn_next.addClickEventListener(function () {
            if(node.canRun){
                num++
                if(num == 1){
                    node.yy1.runAction(cc.fadeTo(1,0))//全部覆盖，阴影
                    node.yy2.runAction(cc.fadeTo(1,0))//天空
                    node.yy3.runAction(cc.fadeTo(1,0))//大地
                }else if(num == 10){
                    node.yy2.setVisible(true)
                    node.yy3.setVisible(true)
                    node.yy2.runAction(cc.fadeTo(1,127))//50
                    node.yy3.runAction(cc.fadeTo(1,170))//67
                }else if(num == 11){
                    node.yy2.runAction(cc.fadeTo(1,255))
                    node.yy3.runAction(cc.fadeTo(1,255))
                }else if(num == 12){
                    //node.yy3.setVisible(false)
                    node.yy1.setVisible(true)
                    node.yy1.setOpacity(0)
                    node.yy1.runAction(cc.fadeTo(1,150))
                    node.yy3.runAction(cc.fadeTo(1,127))
                    node.yy2.runAction(cc.fadeTo(1,90))
                }else if(num == 13){
                    //到达6点钟方向，然后恢复到原来的值
                    num = 0
                    node.fen.setRotation(0)
                    node.shi.setRotation(180)
                    node.zhen.setRotation(0)
                    node.yy1.runAction(cc.fadeTo(1,255))
                    node.yy3.runAction(cc.fadeTo(1,255))
                    node.yy2.setOpacity(90)
                    sun.setPosition(sunPos[0])
                    node.yy3.setVisible(true)
                    for(var i = 0 ; i < 12 ; i++){
                        lineList[i].setVisible(false)
                    }
                    return
                }
                node.canRun = false
                sun.runAction(cc.moveTo(1,sunPos[num]))
                lineList[num-1].setVisible(true)
                zhen.runAction(cc.rotateTo(1,myRotate[num]))
                zhen.runAction(cc.scaleTo(1,myScale[num-1],1))
                node.fen.runAction(cc.rotateBy(1,360))
                node.shi.runAction(cc.sequence(
                    cc.rotateBy(1,30),
                    cc.callFunc(function(){
                        node.canRun = true
                })))
            } 
        })

        // createTouchEvent({
        //     item: node.znz,
        //     begin: function (data) {
        //         return true
        //     },
        //     move:function(data){
        //         var item = data.item
        //         var delta = data.delta
        //         item.x += delta.x
        //         item.y += delta.y
        //     }
        // })
    }
})