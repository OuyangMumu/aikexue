var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super()
        this.learnCtor()
        this.load()
        loadPlist("learn_plist")
        var self = this
        self.img_title.setVisible(false)
        self.img_page.setVisible(false)
        //创建各种文字   标题
        var title = new cc.LabelTTF("洗手操","",45)
        title.setPosition(570,590)
        self.addChild(title)
        title.setColor(cc.color(255,0,255))

        var wz_step = new cc.LabelTTF("","",45)
        wz_step.setPosition(800,450)
        self.addChild(wz_step)
        wz_step.setColor(cc.color(255,255,0))

        var wz_content = new cc.LabelTTF("","",30)
        wz_content.setPosition(850,350)
        self.addChild(wz_content)
        wz_content.setColor(cc.color(255,255,255))

        var uiList = [
            "node_1","node_2","node_3","node_4","node_5",
            "node_6","node_7","step1_liu1","step1_liu2",
            "step2_hand","step3_hand","step4_hand","step5_hand",
            "step6_hand","step7_hand"
        ]
        var node = loadNode(res.wmds_learnLayer_json,uiList)
        self.inside_node.addChild(node)

        var music = [res.learn_sound1,res.learn_sound2,res.learn_sound3,
            res.learn_sound4,res.learn_sound5,res.learn_sound6,res.learn_sound7,]
        var call = function(index){
            wz_step.setString(inf[index].step)
            wz_content.setString(inf[index].content)
            playMusic(music[index])
        }
        playMusic(res.learn_sound0)
        node.runAction(cc.sequence(
            cc.delayTime(1.2),
            cc.callFunc(function(){
                node.step1_liu1.runAction(aniRepeat("step1_liu1_%d.png",2))
                node.step1_liu2.runAction(aniRepeat("step1_liu2_%d.png",2))
                call(0)
            }),
            cc.delayTime(8),
            cc.callFunc(function(){
                node.step1_liu1.stopAllActions()
                node.step1_liu2.stopAllActions()
                node.node_1.setVisible(false)
                node.node_2.setVisible(true)
                node.step2_hand.runAction(cc.repeatForever(cc.sequence(
                    ani("step2_%02d.png",5),
                    cc.delayTime(0.1),
                    aniRever("step2_%02d.png",5)
                )))
                call(1)
            }),
            cc.delayTime(6),
            cc.callFunc(function(){
                node.step2_hand.stopAllActions()
                node.node_2.setVisible(false)
                node.node_3.setVisible(true)
                node.step3_hand.runAction(cc.repeatForever(cc.sequence(
                    cc.moveTo(0.2,260,180),
                    cc.delayTime(0.1),
                    cc.moveTo(0.2,235,215),
                    cc.delayTime(0.1)
                )))
                call(2)
                //playMusic(res.learn_sound3)
            }),
            cc.delayTime(8),
            cc.callFunc(function(){
                node.step3_hand.stopAllActions()
                node.node_3.setVisible(false)
                node.node_4.setVisible(true)
                node.step4_hand.runAction(cc.repeatForever(cc.sequence(
                    ani("step4_hand%02d.png",5),
                    aniRever("step4_hand%02d.png",5)
                )))
                call(3)
            }),
            cc.delayTime(7),
            cc.callFunc(function(){
                node.step4_hand.stopAllActions()
                node.node_4.setVisible(false)
                node.node_5.setVisible(true)
                node.step5_hand.runAction(cc.repeatForever(cc.sequence(
                    cc.rotateTo(0.2,30),
                    cc.delayTime(0.1),
                    cc.rotateTo(0.2,0),
                    cc.delayTime(0.1)
                )))
                call(4)
            }),
            cc.delayTime(8),
            cc.callFunc(function(){
                node.step5_hand.stopAllActions()
                node.node_5.setVisible(false)
                node.node_6.setVisible(true)
                node.step6_hand.runAction(cc.repeatForever(cc.sequence(
                    cc.moveTo(0.2,380,260),
                    cc.delayTime(0.1),
                    cc.moveTo(0.2,370,330),
                    cc.delayTime(0.1)
                )))
                call(5)
            }),
            cc.delayTime(9),
            cc.callFunc(function(){
                node.step6_hand.stopAllActions()
                node.node_6.setVisible(false)
                node.node_7.setVisible(true)
                node.step7_hand.runAction(cc.repeatForever(cc.sequence(
                    ani("step7_hand%02d.png",6),
                    aniRever("step7_hand%02d.png",6)
                )))
                call(6)
            }),
            cc.delayTime(5),
            cc.callFunc(function(){
                node.step7_hand.stopAllActions()
            })
        ))

        var aniRepeat = function(frame,end){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:frame,
                end: end,
                time: 0.1,
            })))
        }

        var ani = function(frame,end) {
            return cc.sequence(createAnimation({
                frame: frame,
                end: end,
                time: 0.05,
            }))
        }

        var aniRever = function(frame,end) {
            return cc.sequence(createAnimation({
                frame: frame,
                end: end,
                time: 0.05,
                rever:true
            }))
        }

        var inf = [
            {   step:"步骤一",
                content:"一、在水龙头下把手淋湿，\n涂上肥皂或洗手液。"
            },{
                step:"步骤二",
                content:"二、掌心相对，手指\n并拢相互摩擦。"
            },{
                step:"步骤三",
                content:"三、手心对手背沿指缝\n相互戳擦，交换进行。"
            },{
                step:"步骤四",
                content:"四、掌心相对，双手交叉\n沿指缝相互摩擦。"
            },{
                step:"步骤五",
                content:"五、一手握另一手大拇\n指旋转搓擦，交换进行。"
            },{
                step:"步骤六",
                content:"六、弯曲各手指关节，在\n另一手掌心上旋转搓擦，\n交换进行。"
            },{
                step:"步骤七",
                content:"七、搓洗手腕，交换进行。"
            },
        ]

        return true
    },
})