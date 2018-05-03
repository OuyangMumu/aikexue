var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "seeExp1", 
    preLayer: "seeLayer", 
    ctor: function() { 
        this._super()
        var self = this
        this.expCtor({
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    if (!self.bgg) {
                        var bg = createBiaoge({
                            json: res.pzg_tableNode_json,
                            scale: 0.9,
                            downData: {
                                nums: 6,
                                scale: 1.5,
                                bufs: [
                                    [null,res.table_wz1,res.table_wz2],[null,res.table_wz1,res.table_wz2],
                                    [null,res.table_wz1,res.table_wz2],[null,res.table_wz1,res.table_wz2],
                                    [null,res.table_wz1,res.table_wz2],[null,res.table_wz1,res.table_wz2],
                                ]
                            },
                        })
                        self.addChild(bg)
                        self.bgg = bg
                    }
                    var bg = self.bgg
                    bg.show()
                }
            }
        })
        //this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("see_plist")

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var normalList = []
        var selectList = []
        var judgePos = [
                cc.p(80,400),cc.p(200,400),
                cc.p(80,300),cc.p(200,300),
                cc.p(80,200),cc.p(200,200),
        ]
        for(var i = 0 ; i < 3 ; i++){
            createSp(sprintf("#jing_%d.png",i+1),cc.p(100,450 - 100*i),self)
        }

        for(var i = 0 ; i < 2 ; i++){
            normalList[i] = createSp(sprintf("#btn_see_%d.png",2*i+1),judgePos[i],self)
            selectList[i] = createSp(sprintf("#btn_see_%d.png",2*i+2),judgePos[i],self)

            normalList[2+i] = createSp(sprintf("#btn_see_%d.png",2*i+1),judgePos[2+i],self)
            selectList[2+i] = createSp(sprintf("#btn_see_%d.png",2*i+2),judgePos[2+i],self)

            normalList[4+i] = createSp(sprintf("#btn_see_%d.png",2*i+1),judgePos[4+i],self)
            selectList[4+i] = createSp(sprintf("#btn_see_%d.png",2*i+2),judgePos[4+i],self)
        }

        var curSp_normal = null
        var curSp_select = null
        for(var i = 0 ; i < 6 ; i++){
            selectList[i].setVisible(false)
            var sp = normalList[i]
            sp.index = i 
            createTouchEvent({
                item:sp,
                begin:function(data){
                    var item = data.item
                    var index = data.item.index
                    if(curSp_normal){
                        curSp_normal.setVisible(true)
                        curSp_select.setVisible(false)
                    }
                    curSp_normal = normalList[index]
                    curSp_select = selectList[index]
                    normalList[index].setVisible(false)
                    selectList[index].setVisible(true)
                    for(var j = 0 ; j < 2 ; j++){
                        glassList[j].l_lens.setOpacity(0)
                        glassList[j].r_lens.setOpacity(0)
                        glassList[j].rl_lens.setOpacity(0)
                        glassList[j].lr_lens.setOpacity(0)
                    }
                    switch(index){
                        case 0:
                            glass2.setRotation(0)
                            glass2.setPosition(650,370)
                        break
                        case 1:
                            glass2.setRotation(90)
                            glass1.l_lens.setRotation(90)
                            glass2.setPosition(600,340)
                            glass1.l_lens.setOpacity(255)
                            item.nodePos = glass1.l_lens.par.convertToNodeSpace(getWorldPos(glass2.bsl))
                            glass1.l_lens.setPosition(item.nodePos)
                        break
                        case 2:
                            glass2.setRotation(0)
                            glass2.setPosition(650,370)
                        break
                        case 3:
                            glass2.setRotation(90)
                            glass1.r_lens.setRotation(90)
                            glass2.setPosition(700,470)
                            glass1.r_lens.setOpacity(255)
                            item.nodePos = glass1.r_lens.par.convertToNodeSpace(getWorldPos(glass2.bsr))
                            glass1.r_lens.setPosition(item.nodePos)
                        break
                        case 4:
                            glass2.setRotation(180)
                            glass1.rl_lens.setRotation(180)
                            glass1.lr_lens.setRotation(180)
                            glass2.setPosition(650,410)
                            glass1.rl_lens.setOpacity(255)
                            glass1.lr_lens.setOpacity(255)

                            item.nodePos = glass1.l_lens.par.convertToNodeSpace(getWorldPos(glass2.bsr))
                            glass1.lr_lens.setPosition(item.nodePos)
                            item.nodePos2 = glass1.r_lens.par.convertToNodeSpace(getWorldPos(glass2.bsl))
                            glass1.rl_lens.setPosition(item.nodePos2)
                            
                        break
                        case 5:
                            glass2.setRotation(90)
                            glass2.setPosition(700,340)
                        break
                    }
                    return true
                }
            })
        }

        var glass1 = createSp("#glass.png",cc.p(650,400),self)
        var glass2 = createSp("#glass.png",cc.p(650,200),self)
        var glassList = [glass1,glass2]
        glass1.friend = glass2
        glass2.friend = glass1
        glass1.setLocalZOrder(5)
        glass2.setLocalZOrder(5)

        var label = new cc.LabelTTF("提示：请点击按钮，观察\n      不同重叠状态下是否透光\n      并将现象填入表格中！","",25)
        self.addChild(label)
        label.setPosition(200,80)

        // var zhuan = createSp("#zhuan.png",cc.p(0,0),self)
        // zhuan.setLocalZOrder(20)
        // zhuan.setVisible(false)
        // //计算旋转角度
        // var getMygel = function(node,pos){
        //     var nodepos = node.convertToNodeSpace(pos)
        //     var topos = cc.p(nodepos.x - node.width/2,nodepos.y - node.height/2)
        //     var tempAngel = 180*(1+Math.atan2(topos.x,topos.y)/Math.PI)
        //     return tempAngel
        // }
        // //拖住四边进行旋转
        // var getMyRota = function(sp){
        //     createTouchEvent({
        //         item:sp,
        //         begin:function(data){
        //             var item = data.item
        //             var pos = data.pos
        //             zhuan.setVisible(true)
        //             zhuan.setPosition(pos)
        //             item.par.startAngel = getMygel(item.par,pos)
        //             return true
        //         },
        //         move:function(data){
        //             var item = data.item
        //             var pos = data.pos
        //             var delta = data.delta
        //             var angel = getMygel(item.par,pos)
        //             var disAngel = angel - item.par.startAngel
        //             item.par.setRotation(item.par.getRotationX() + disAngel)
        //             zhuan.setRotation(zhuan.getRotationX() + disAngel)
        //             zhuan.x += delta.x 
        //             zhuan.y += delta.y
        //             //var rota = item.par.getRotationX() + disAngel
                    
        //             changeRota(item,disAngel)
        //             changePos(item)
        //         },
        //         end:function(data){
        //             zhuan.setVisible(false)
        //         }
        //     })
        // }

        // var glass1 = createSp("#glass.png",cc.p(570,350),self)
        // var glass2 = createSp("#glass.png",cc.p(570,200),self)
        // var glassList = [glass1,glass2]

        // glass2.friend = glass1
        // glass1.friend = glass2
        // for(var i = 0 ; i < 2 ; i++){
        //     var glass = glassList[i]
        //     glass.setLocalZOrder(10)
        //     glass.draw = createSp("#judge_1.png",cc.p(385,50),glass)
        //     glass.left = createSp("#judge_2.png",cc.p(60,60),glass)
        //     glass.right = createSp("#judge_2.png",cc.p(710,60),glass)

        //     //旋转
        //     glass.left.par = glass
        //     glass.right.par = glass
        //     getMyRota(glass.left)
        //     getMyRota(glass.right)

        //     //移动
        //     glass.draw.par = glass
        //     glass.draw.index = i
        //     createTouchEvent({
        //         item:glass.draw,
        //         begin:function(data){
        //             var item = data.item
        //             item.par.setLocalZOrder(item.par.getLocalZOrder()+1)
        //             item.par.l_lens.setPosition(0,0)
        //             item.par.r_lens.setPosition(0,0)
        //             //item.par.friend.lr_lens.setOpacity(200)
        //             //item.par.friend.rl_lens.setOpacity(200)
        //             //点击切换角度同步
        //             //changeRota(item,0)
        //             return true
        //         },
        //         move:function(data){
        //             var item = data.item
        //             var delta = data.delta
        //             var index = item.index
        //             item.par.x += delta.x
        //             item.par.y += delta.y
        //             item.par.l_lens.par.x = item.par.x - 62
        //             item.par.l_lens.par.y = item.par.y + 3
        //             item.par.r_lens.par.x = item.par.x + 62
        //             item.par.r_lens.par.y = item.par.y + 3
        //             changePos(item)
        //             changeRota(item,0)
        //         }
        //     }) 
        // }

        // var changePos = function(item){
        //     //我方设置
        //     item.nodePos = item.par.friend.l_lens.par.convertToNodeSpace(getWorldPos(item.par.bsl))
        //     item.par.friend.l_lens.setPosition(item.nodePos)

        //     item.nodePos2 = item.par.friend.r_lens.par.convertToNodeSpace(getWorldPos(item.par.bsr))
        //     item.par.friend.r_lens.setPosition(item.nodePos2)

        //     //对方放置 
        //     item.nodePos3 = item.par.friend.l_lens.par.convertToNodeSpace(getWorldPos(item.par.bsr))
        //     item.par.friend.lr_lens.setPosition(item.nodePos3)

        //     item.nodePos4 = item.par.friend.r_lens.par.convertToNodeSpace(getWorldPos(item.par.bsl))
        //     item.par.friend.rl_lens.setPosition(item.nodePos4)
        // }

        // //改变旋转角度
        // var changeRota = function(item,disAngel){
        //     var glass = item.par.friend
        //     var rota = item.par.getRotationX() + disAngel

        //     //只需要调用一次，可抽取，将其父类恢复为0
        //     glass.l_lens.par.setRotation(0)
        //     glass.r_lens.par.setRotation(0)

        //     //对方的 四个镜片旋转
        //     glass.l_lens.setRotation(rota)
        //     glass.r_lens.setRotation(rota)
        //     glass.lr_lens.setRotation(rota)
        //     glass.rl_lens.setRotation(rota)

        //     //我方的裁切 旋转
        //     item.par.l_lens.par.setRotation(rota)
        //     item.par.r_lens.par.setRotation(rota)

        //     //对方的裁切  位置设置


        //     //我方裁切 位置设置
        //     item.mypos1 = self.convertToNodeSpace(getWorldPos(item.par.bsl))
        //     item.par.l_lens.par.setPosition(item.mypos1)
        //     item.mypos2 = self.convertToNodeSpace(getWorldPos(item.par.bsr))
        //     item.par.r_lens.par.setPosition(item.mypos2)

        // }


        for(var i = 0 ; i < 2 ; i++){
            var glass = glassList[i]
            //左边两片镜片
            glass.l_lens = createClip({
                toShowimg:"#lens1.png",
                ShowimgPos:cc.p(0,0),
                toSencilimg:"#lens1.png",
                sencilPos:cc.p(0,0),
                father:self,
            })
            glass.l_lens.par = glass.l_lens.getParent()
            glass.l_lens.par.setPosition(glass.x-62,glass.y+3)
            glass.l_lens.setOpacity(0)
            //创建左边第二个镜片，放在第二个位置
            glass.lr_lens = createSp("#lens2.png",cc.p(0,0),glass.l_lens.par)
            glass.lr_lens.setOpacity(0)

            //用于判断镜片的位置一直不会改变
            glass.bsl = createSp("#lens1.png",cc.p(320,53),glass)
            glass.bsl.setVisible(false)

            //右边两片镜片
            glass.r_lens = createClip({
                toShowimg:"#lens2.png",
                ShowimgPos:cc.p(0,0),
                toSencilimg:"#lens2.png",
                sencilPos:cc.p(0,0),
                father:self,
            })
            glass.r_lens.par = glass.r_lens.getParent()
            glass.r_lens.par.setPosition(glass.x+62,glass.y+3)
            glass.r_lens.setOpacity(0)
            //创建右边第二个镜片，放在第二个位置
            glass.rl_lens = createSp("#lens1.png",cc.p(0,0),glass.r_lens.par)
            glass.rl_lens.setOpacity(0)

            glass.bsr = createSp("#lens2.png",cc.p(448,53),glass)
            glass.bsr.setVisible(false)
        }
    }
})