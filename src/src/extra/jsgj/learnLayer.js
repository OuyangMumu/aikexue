//@author mu @16/5/19

var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        var self = this
        self.initPageBtns([{
            btn: [res.jsgj_learn1_normal, res.jsgj_learn1_select],
            createFun: function() {
                var uilist = [
                    "btn_1",
                    "btn_2",
                    "btn_3",
                    "btn_4",
                    "btn_5",
                    "show1",
                    "show2",
                    "show3",
                    "show4",
                    "show5",
                    "node_show",
                ]
                var node = loadNode(res.jsgj_learn_json, uilist, "bg")
                node.setCascadeOpacityEnabled(true)
                node.node_show.setCascadeOpacityEnabled(true)
                node.setPosition(getMiddle(0, -50))
                createLink({
                    touchs: [
                        node.btn_1,
                        node.btn_2,
                        node.btn_3,
                        node.btn_4,
                        node.btn_5,
                    ],
                    links: [
                        node.show1,
                        node.show2,
                        node.show3,
                        node.show4,
                        node.show5,
                    ],
                    moveNode: node.node_show,
                })
                return node
            }
        }, {
            btn: [res.jsgj_learn2_normal, res.jsgj_learn2_select],
            tabs: [{
                normal: res.jsgj_tab2_normal,
                select: res.jsgj_tab2_select,
                pos: cc.p(100, 450),
                pics: [
                    res.jsgj_tab2_pic1,
                    res.jsgj_tab2_pic2,
                    res.jsgj_tab2_pic3,
                    res.jsgj_tab2_pic4,
                    res.jsgj_tab2_pic5,
                ],
                scales: [
                    1, 0.9, 1, 1, 1
                ]
            }, {
                normal: res.jsgj_tab1_normal,
                select: res.jsgj_tab1_select,
                pos: cc.p(100, 200),
                pics: [
                    res.jsgj_tab1_pic1,
                    res.jsgj_tab1_pic2,
                    res.jsgj_tab1_pic3,
                    res.jsgj_tab1_pic4,
                ],
                scales: [
                    0.9, 0.9, 0.9, 0.9
                ],
                posOff: [
                    cc.p(0, -30),
                    cc.p(0, -35),
                    cc.p(0, -40),
                    cc.p(0, -30),
                ],
            }]
        }])
        return true
    },
    dataControl: {},
})