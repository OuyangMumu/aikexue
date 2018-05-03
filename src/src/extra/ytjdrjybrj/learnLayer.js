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
        loadPlist("learnAni_plist")
        var self = this
        self.initPageBtns([{
            btn: [res.learn_btn1_normal, res.learn_btn1_select,res.learn_btn1_act],
            modify: cc.p(30, 3),
            pics: [res.study_1],
         },{
            btn: [res.learn_btn2_normal, res.learn_btn2_select,res.learn_btn2_act],
            modify: cc.p(10, 3),
            createFun: function(){
                var uiList = ["jiaoban","qipao","waiyan"]
                var node = loadNode(res.ytjdrjybrj_learn_json,uiList)
                
                var ani = function(frame,end,time) {
                    return cc.repeatForever(createAnimation({
                        frame: frame,
                        end: end,
                        time:time
                    }))
                }
                
                node.jiaoban.runAction(ani("learnjb%02d.png",22,0.2))
                node.qipao.runAction(ani("qipao%02d.png",10,0.2))
                node.waiyan.runAction(ani("waiyan%02d.png",10,0.15))
                return node
            }
        }
        ])
        return true
    },
})