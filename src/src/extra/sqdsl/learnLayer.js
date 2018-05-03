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
        loadPlist("learn_plist")
        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var btn_play = new ccui.Button(res.btn_restart_select,res.btn_restart_normal)
        btn_play.setPosition(150,50)
        self.addChild(btn_play)
        btn_play.setLocalZOrder(20)
        btn_play.setVisible(false)
        btn_play.addClickEventListener(function(){
            if(btn_play.isVisible()){
                btn_play.setVisible(false)
                againFun()
            }
        })

        var uiList = [
            "part1","part2","part3",
            "part1_bg1","part1_bg2","part1_qiliu","part1_wenzi",
            "part2_bg","car3","car2","car1","part2_last","part2_quan","part2_wenzi",
            "chuang1","chuang2","part3_car","part3_last","part3_zui","part3_wenzi","part3_lu"
        ]
        var node = loadNode(res.sqdsl_learnLayer_json,uiList)
        self.addChild(node)
        safeAdd(self,self.btn_home)
        safeAdd(self,self.btn_help)

        var normal = []
        var select = []
        for(var i = 0 ; i < 3 ; i++){
            var img = sprintf("#part_%d.png",2*i+1)
            sp = createSp(img,cc.p(1050,400 - i*100),self)
            normal[i] = sp
            var img2 = sprintf("#part_%d.png",2*i+2)
            select[i] = createSp(img2,cc.p(1050,400 - i*100),self)
            select[i].setVisible(false)
            sp.index = i
            createTouchEvent({
                item:sp,
                begin:function(data){
                    var index = data.item.index
                    for(var i = 0 ; i < 3 ; i++){
                        if(i == index){
                            normal[i].setVisible(false)
                            select[i].setVisible(true)
                            node[uiList[i]].setPositionY(0)
                            call(index)
                        }else{
                            normal[i].setVisible(true)
                            select[i].setVisible(false)
                            node[uiList[i]].setPositionY(-800)
                        }
                    }
                    return true 
                }
            }) 
        }

        normal[0].setVisible(false)
        select[0].setVisible(true)

        
        var call = function(index){
            curFun()
            switch(index){
                case 0:
                    part1_fun()
                    curFun = part1_stop_fun
                break
                case 1:
                    part2_fun()
                    againFun = part2_fun
                    curFun = part2_stop_fun
                break
                case 2:
                    part3_fun()
                    againFun = part3_fun
                    curFun = part3_stop_fun
                break
            }
        }
        var part1_stop_fun = function(){
            node.part1_qiliu.stopAllActions()
            node.part1_bg1.setPositionX(0)
            node.part1_bg2.setPositionX(1233)
            node.part1_wenzi.stopAllActions()
            node.part1_wenzi.setVisible(false)
            btn_play.setVisible(false)
            removeTimer("key")
        }

        var part2_stop_fun = function(){
            node.part2_bg.stopAllActions()
            node.part2_bg.setPositionX(130)
            node.car1.stopAllActions()
            node.car1.setPosition(680,330)
            node.car2.stopAllActions()
            node.car2.setPosition(570,500)
            node.car3.stopAllActions()
            node.car3.setPosition(1050,500)
            node.part2_last.setVisible(false)
            node.part2_wenzi.setVisible(false)
            node.part2_quan.stopAllActions()
            btn_play.setVisible(false)
        }

        var part3_stop_fun = function(){
            node.chuang1.stopAllActions()
            node.chuang2.stopAllActions()
            node.part3_lu.stopAllActions()
            node.part3_car.stopAllActions()
            node.part3_last.stopAllActions()
            node.part3_last.setVisible(false)
            node.part3_zui.stopAllActions()
            node.part3_wenzi.setVisible(false)
            btn_play.setVisible(false)
        }

        var part3_fun = function(){
            part3_stop_fun()
            node.chuang1.runAction(aniRepeat("chuang1_%02d.png",8,0.08))
            node.chuang2.runAction(aniRepeat("chuang2_%02d.png",8,0.08))
            node.part3_lu.runAction(aniRepeat("part3_lu%02d.png",2,0.1))
            node.part3_car.runAction(cc.repeatForever(cc.sequence(
                cc.callFunc(function(){
                    node.part3_car.setPositionY(405)
                }),
                cc.delayTime(0.1),
                cc.callFunc(function(){
                    node.part3_car.setPositionY(400)
                }),
                cc.delayTime(0.1)
            )))
            node.part3_last.runAction(cc.sequence(
                cc.delayTime(5),
                cc.callFunc(function(){
                    node.part3_last.setVisible(true)
                    node.chuang1.stopAllActions()
                    node.chuang2.stopAllActions()
                    node.part3_lu.stopAllActions()
                    node.part3_car.stopAllActions()
                }),
                cc.delayTime(0.5),
                cc.callFunc(function(){
                    node.part3_zui.runAction(aniRepeat("part3_zui%02d.png",2,0.1))
                }),
                cc.delayTime(3),
                cc.callFunc(function(){
                    node.part3_zui.stopAllActions()
                    node.part3_zui.setSpriteFrame("part3_zui01.png")
                    node.part3_wenzi.setVisible(true)
                    btn_play.setVisible(true)
                })
            ))
        }

        var part1_fun = function(){
            part1_stop_fun()
            node.part1_qiliu.runAction(aniRepeat("part3_qiliu%02d.png",5,0.1))
            node.part1_wenzi.runAction(cc.sequence(
                cc.delayTime(5),
                cc.callFunc(function(){
                    node.part1_wenzi.setVisible(true)
                })
            ))

            addTimer({
                fun:function(){
                    node.part1_bg1.x -= 1
                    node.part1_bg2.x -= 1
                    if(node.part1_bg1.x < -1230){
                        node.part1_bg1.x = 1233
                    }
                    if(node.part1_bg2.x < -1230){
                        node.part1_bg2.x = 1233
                    }
                },
                time: 0.001,
                repeat: 999999999999,
                key: "key"
            })

            // node.part1_bg1.runAction(cc.sequence(
            //     cc.moveTo(2,-1230,0),
            //     cc.callFunc(function(){
            //         node.part1_bg1.stopAllActions()
            //         node.part1_bg1.setPositionX(1233)
            //         node.part1_bg1.runAction(cc.repeatForever(cc.sequence(
            //             cc.moveTo(4,-1233,0),
            //             cc.callFunc(function(){
            //                 node.part1_bg1.setPositionX(1233)
            //             })
            //         )))   

            //     })
            // ))
            // node.part1_bg2.runAction(cc.repeatForever(cc.sequence(
            //     cc.moveTo(4,-1233,0),
            //     cc.callFunc(function(){
            //         node.part1_bg2.setPositionX(1233)
            //     })
            // )))
        }

        var part2_fun = function(){
            part2_stop_fun()
            var time = 1.5
            node.car1.runAction(cc.moveTo(time,730,70))
            node.car2.runAction(cc.moveTo(time,450,230))
            node.car3.runAction(cc.moveTo(time,1000,320))
            node.part2_bg.runAction(cc.sequence(
                cc.moveTo(time,1000,320),
                cc.delayTime(1),
                cc.callFunc(function(){
                    node.part2_last.setVisible(true)
                    node.part2_quan.runAction(cc.repeatForever(cc.sequence(
                        cc.callFunc(function(){
                            node.part2_quan.setVisible(false)
                        }),
                        cc.delayTime(0.1),
                        cc.callFunc(function(){
                            node.part2_quan.setVisible(true)
                        }),
                        cc.delayTime(0.1)
                    )))
                }),
                cc.delayTime(2),
                cc.callFunc(function(){
                    node.part2_quan.stopAllActions()
                    node.part2_quan.setVisible(true)
                    node.part2_wenzi.setVisible(true)
                    btn_play.setVisible(true)
                })
            ))
        }

        var curFun = part1_stop_fun
        var aniRepeat = function(frame,end,time){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:frame,
                end: end,
                time: time
            })))
        }

        part1_fun()
        var againFun = null

    }
})