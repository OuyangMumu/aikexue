var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    load: function() {
        loadPlist("learn_nums")
        loadPlist("learnAni_plist")
        this.initPeople()
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        this.load()
        var self = this
        this.img_title.setVisible(false)
        this.img_page.setVisible(false)
        //this.bg_title.setVisible(false)
        var uiList = [
            "wordn_1","wordn_2","wordn_3","wordn_4","wordn_5","wordn_6","wordn_7",
            "words_1","words_2","words_3","words_4","words_5","words_6","words_7",
            "learn21","learn22","learn41","learn42","learn61","learn62",
        ]
        var node = loadNode(res.jjddsy_learn_json,uiList)
        node.setPosition(0,0)
        self.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:self.sayKey[0],fun:function(){
                cc.log("say1")
                self.nodebs.say({key:self.sayKey[1],fun:function(){
                    cc.log("say2")
                    self.nodebs.say({key:self.sayKey[2],fun:function(){
                        cc.log("say3")
                        self.nodebs.say({key:self.sayKey[3],fun:function(){
                            cc.log("say4")
                            self.nodebs.say({key:self.sayKey[4],fun:function(){
                                cc.log("say5")
                                self.nodebs.say({key:self.sayKey[5],fun:function(){
                                    cc.log("say6")
                                    self.nodebs.say({key:self.sayKey[6],fun:function(){
                                        cc.log("say7")
                                        self.nodebs.say({key:self.sayKey[7],fun:function(){
                                            cc.log("say8")
                                        }})
                                    }})
                                }})
                            }})
                        }})
                    }})
                }})
            }})
        })


        var curIndex = 10
        for(var i = 0 ; i < 7 ; i++){
            var wordn = node[uiList[i]]
            wordn.index = i
            createTouchEvent({
                item:wordn,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    if(curIndex == index)
                        return false
                    curIndex == index
                    for(var j = 0 ; j < 7 ; j++){
                        var words = node[uiList[7+j]]
                        var wordn = node[uiList[j]]
                        if(index == j){
                            self.nodebs.say({key:self.sayKey[j+1],force:true})
                            item.setVisible(false)
                            words.setVisible(true)
                            for(var i = 0 ; i < 6 ; i++){
                                node[uiList[i+14]].setVisible(false)
                                node[uiList[i+14]].setVisible(false)
                            }
                            switch(j+1){
                                case 2:
                                    learnfun(node.learn21,node.learn22,"learn21_%02d.png","learn22_%02d.png",13,13)
                                break
                                case 4:
                                    learnfun(node.learn41,node.learn42,"learn41_%02d.png","learn42_%02d.png",13,8)
                                break
                                case 6:
                                    learnfun(node.learn61,node.learn62,"learn61_%02d.png","learn62_%02d.png",9,5)
                                break
                            }
                        }else{
                            wordn.setVisible(true)
                            words.setVisible(false)
                        }
                    }
                    return true
                }
            })
        }

        var learnfun = function(learn1,learn2,frame1,frame2,end1,end2){
            learn1.stopAllActions()
            learn2.stopAllActions()
            learn1.setVisible(true)
            learn2.setVisible(true)
            learn1.runAction(ani(frame1,end1,0.15))
            learn2.runAction(ani(frame2,end2,0.15))
        }

        var ani = function(frame,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: 1,
                end: end,
                time:time,
            }))
        }

        return true
    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs)
        this.nodebs.setVisible(false)
        var self = this
        this.sayKey = ["see1_tip0","see1_tip1","see1_tip2","see1_tip3","see1_tip4",
                        "see1_tip5","see1_tip6","see1_tip7",
                    ]
        var addList = [
            {sound:res.learn_sound0},
            {sound:res.learn_sound1},
            {sound:res.learn_sound2},
            {sound:res.learn_sound3},
            {sound:res.learn_sound4},
            {sound:res.learn_sound5},
            {sound:res.learn_sound6},
            {sound:res.learn_sound7},
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: self.sayKey[i],
                sound: addList[i].sound,
            })
        }
    }
})