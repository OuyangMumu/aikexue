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
        self.img_title.setVisible(false)
        self.initPageBtns([{
            pics: [
                function() {
                    var zswd = createZSWD({
                        infos: [{
                            img: {
                                res: res.learn1,
                                pos: cc.p(186, 154),
                            },
                            descript: {
                                str: "题目一：\n       盐、味精在炒菜时，为什么会溶解得比较快呢？"
                            },
                            answer: {
                                list: [
                                    "被加热了。",
                                    "被搅拌了。",
                                    "被加热，搅拌了。",
                                ],
                                posOff: cc.p(-10, -20),
                                devide: cc.p(0, -30),
                            },
                            result:{
                                key:2,
                            }
                        }, {
                            img: {
                                res: res.learn2,
                                posOff: cc.p(-75, 5),
                            },
                            descript: {
                                str: "题目二：\n       冬天洗衣服时，用什么办法可以将洗衣粉快速\n溶解？（请选择最快溶解洗衣粉的办法）",
                                posOff: cc.p(10, 10),
                            },
                            answer: {
                                list: [
                                    "加多点温水。",
                                    "用温水冲，并不停地\n  用手搅拌。",
                                    "不停地用手搅拌。",
                                ],
                                posOff: cc.p(-120, 0),
                                devide: cc.p(0, -30),
                            },
                            result:{
                                key:1,
                            }
                        }, {
                            img: {
                                res: res.learn3,
                                pos: cc.p(186, 154),
                            },
                            descript: {
                                str: "题目三：\n       把以下物质分别放进四杯热水中，并搅拌，猜猜\n看，哪一种物质的溶解最慢。",
                                posOff:cc.p(5, 10)
                            },
                            answer: {
                                list: [
                                    "冰糖",
                                    "白砂糖",
                                    "奶粉",
                                    "感冒冲剂",
                                ]
                            },
                            result:{
                                key:0,
                            }
                        }, {
                            img: {
                                res: res.learn4,
                                posOff:cc.p(-30, 0),
                            },
                            descript: {
                                str: "题目四：\n       请从下面四个答案中选择吃糖最快的一种方法。"
                            },
                            answer: {
                                list: [
                                    "含在嘴里不动",
                                    "用舌头翻动搅拌",
                                    "把糖块咬碎",
                                    "咬碎糖块并搅拌",
                                ],
                                posOff:cc.p(-80, 0)
                            },
                            result:{
                                key:3,
                            }
                        }]
                    })
                    self.title = zswd.title
                    return zswd
                },
            ],
        }])
        changeFather({
            item: self.title,
            father: self,
        })
        return true
    },
    dataControl: {},
})