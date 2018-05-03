var seeExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "seeExp2",
    preLayer: "seeLayer",
    ctor: function () {
        this._super();
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var uiList = [
            "ci","shui","item_zhen","item_mian","node_wenzi",
            "box_mian_ci","box_zhen_ci","box_mian_ci_0","box_zhen_ci_0",
            "box_mian_shui","box_zhen_shui",
            "btn_ci","btn_shui"
        ]
        var self = this
        var node = loadNode(res.zgtyz_seeExp2_json,uiList)
        self.inside_node.addChild(node)

        var curCiIndex = 10
        var curShuiIndex = 10
        var btnList = ["btn_ci","btn_shui"]
        var boxCiList = ["box_zhen_ci_0","box_mian_ci_0","box_zhen_ci","box_mian_ci"]
        var boxShuiList = ["box_zhen_shui","box_mian_shui"]

        var addContens = function() {
            for (var i = 0 ; i < 5; i++) {
                addContent({
                    people: self.nodebs,
                    key: uiList[i],
                    sound: res[sprintf("see2_sound%d", i)]
                })
            }
        }
        addContens()
        self.nodebs.show(function() {
            self.nodebs.say({key:uiList[0]})
        })
        var curBtn = 0
        node.btnTouch = function(){
            for (var i = 0; i < 2; i++) {
                var item = node[btnList[i]]
                if (item) {
                    var judge = item.getChildByName("normal")
                    judge.index = i
                    createTouchEvent({
                        item: judge,
                        begin: function (data) {
                            var item = data.item
                            curBtn = item.index
                            setBtnFun(item.index)
                            return true
                        }
                    })
                }
            }
        }
        node.btnTouch()

        //底部文字的显示
        var wenziVisible = function(index){
            var index = index + 1
            for(var i = 1 ; i < 6 ; i++){
                var wzName = "wz_" + i
                if(i == index){
                    node.node_wenzi.getChildByName(wzName).setVisible(true)
                }else{
                    node.node_wenzi.getChildByName(wzName).setVisible(false)
                }
            }
        }

        //设置所有的显示为不见
        var reSetVisible = function(){
            curCiIndex = 10
            curShuiIndex = 10
            for(var i = 0 ; i < 2 ; i++){
                node[boxCiList[i+2]].setVisible(false)
                node[boxShuiList[i]].setVisible(false)
                node[uiList[i+2]].getChildByName("select").setVisible(false)
                node[uiList[i+2]].getChildByName("normal").setVisible(true)
            }
        }
        //将其他的东西设置出现
        var setBtnFun = function(index){
            wenziVisible(0)
            reSetVisible()
            if(index == 0){
                node.btn_ci.getChildByName("select").setVisible(true)
                node.btn_ci.getChildByName("normal").setVisible(false)
                node.btn_shui.getChildByName("select").setVisible(false)
                node.btn_shui.getChildByName("normal").setVisible(true)
                node.ci.setPosition(550,295)
                node.shui.setPositionY(-500)
                node.item_zhen.setPosition(260,390)
                node.item_mian.setPosition(260,295)
                self.nodebs.say({key:uiList[0],force:true})
            }else{
                node.btn_ci.getChildByName("select").setVisible(false)
                node.btn_ci.getChildByName("normal").setVisible(true)
                node.btn_shui.getChildByName("select").setVisible(true)
                node.btn_shui.getChildByName("normal").setVisible(false)
                node.ci.setPositionY(-550)
                node.shui.setPosition(550,295)
                node.item_zhen.setPosition(280,425)//280,315
                node.item_mian.setPosition(280,315)//280,425
                self.nodebs.say({key:"see2_sound_0",force:true})
             }
        }

        //点击赤道日晷触发的事件
        var ciBox = function(){
            for (var i = 0; i < 2; i++) {
                var item = node[boxCiList[i]]
                item.index = i
                createTouchEvent({
                    item: item,
                    begin: function (data) {
                        var item = data.item
                        showCi(item.index)
                        return true
                    }
                })
            }
        }
        ciBox()

        //点击水平日晷触发的事件
        var shuiBox = function(){
            for (var i = 0; i < 2; i++) {
                var item = node[boxShuiList[i]]
                item.index = i
                createTouchEvent({
                    item: item,
                    begin: function (data) {
                        var item = data.item
                        showShui(item.index)
                        return true
                    }
                })
            }
        }
        shuiBox()

        var showCi = function(index){
            if(index == curCiIndex)  return false
                curCiIndex = index
            wenziShow(index)
            wenziVisible(index+1)
            self.nodebs.say({key:uiList[index+1],force:true})
            for(var i = 0 ; i < 2 ; i++){
                var judge = node[boxCiList[i+2]]
                if(i == index){
                    judge.setVisible(true)
                }else{
                    judge.setVisible(false)
                }
            }
        }

        var showShui = function(index){
            if(index == curShuiIndex)  return false
                curShuiIndex = index
            wenziShow(index)  //左边文字的显示
            wenziVisible(index+3)  //底部文字的显示
            self.nodebs.say({key:uiList[index+3],force:true})
            for(var i = 0 ; i < 2 ; i++){
                var judge = node[boxShuiList[i]]
                if(i == index){
                    judge.setVisible(true)
                }else{
                    judge.setVisible(false)
                }
            }
        }

        var wenziShow = function(index){
            for (var i = 0; i < 2; i++) {
                var judge = node[uiList[i+2]]
                if(index == i){
                    judge.getChildByName("select").setVisible(true)
                    judge.getChildByName("normal").setVisible(false)
                }else{
                    judge.getChildByName("select").setVisible(false)
                    judge.getChildByName("normal").setVisible(true)
                }

            }
        }
        //点击左边文字所触发的事件
        var wenziTouch = function(){
            for (var i = 2; i < 4; i++) {
                var item = node[uiList[i]]
                if (item) {
                    var judge = item.getChildByName("normal")
                    judge.index = i-2
                    createTouchEvent({
                        item: judge,
                        begin: function (data) {
                            var item = data.item
                            if(curBtn == 0)
                                showCi(item.index)
                            if(curBtn == 1)
                                showShui(item.index)
                            return true
                        }
                    })
                }
            }
        }
        wenziTouch()
    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs)
        addContent({
            people: this.nodebs,
            key: "see2_sound_0",
            sound: res.see2_sound_0
        })
    },
})