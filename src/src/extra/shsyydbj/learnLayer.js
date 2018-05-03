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
        self.img_title.setVisible(false)
        var uiList = ["cai_water","cai_soil","btn_look_water","btn_look_soil",
                    "btn_enter","mi_water","mi_soil","input1","input2"
            ]
        var node = loadNode(res.shsyydbj_learn_json,uiList)
        node.setPosition(0,0)
        self.addChild(node)
        self.img_page.setVisible(false)
        addInput({
            item:node.input1,
            size:36,
            color:cc.color(255,0,0,255),
        })
        addInput({
            item:node.input2,
            size:36,
            color:cc.color(255,0,0,255),
        })
        node.btn_look_water.addClickEventListener(function(){
            node.cai_water.setPositionY(-400)
            node.mi_water.setVisible(true)
        })
        node.btn_look_soil.addClickEventListener(function(){
            node.cai_soil.setPositionY(-400)
            node.mi_soil.setVisible(true)
        })
        node.btn_enter.addClickEventListener(function(){
            enterPage()
            node.removeFromParent(true)
        })
        var enterPage = function(){
            self.initPageBtns([{
                btn: [res.learn_btn1_normal, res.learn_btn1_select,res.learn_btn1_act],
                modify: cc.p(10, 0),
                pics: [res.study_1],
                btnScale:0.9
            }, {
                btn: [res.learn_btn2_normal, res.learn_btn2_select,res.learn_btn2_act],
                modify: cc.p(-10, 0),
                pics: [res.study_2],
                btnScale:0.9
            }, {
                btn: [res.learn_btn3_normal, res.learn_btn3_select,res.learn_btn3_act],
                modify: cc.p(-20, 0),
                pics: [res.study_3],
                btnScale:0.9
            }])
        }

        return true
    },
})