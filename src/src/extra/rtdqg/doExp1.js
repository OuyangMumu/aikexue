var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor()
        //this.initPeople()
        this.initUI()
        return true;
    },

    initUI: function () {
        var self = this
        var uiList = [
            "item_fei","item_gan","item_dannang","item_shen",
            "item_xiaochang","item_lanwei","item_zhichang","item_qiguan",
            "item_xinzang","item_pi","item_wei","item_yi",
            "item_dachang","item_shuniaoguan","item_pangguang",

            "fei","gan","dannang","shen",
            "xiaochang","lanwei","zhichang","qiguan",
            "xinzang","pi","wei","yi",
            "dachang","shuniaoguan","pangguang",
        ]
        var node = loadNode(res.rtdqg_doExp1_json, uiList)
        self.inside_node.addChild(node)

        node.beginPos = 0
        node.judgeOverCount = 0
        node.localOrder = 20
        for(var i = 0 ; i < 15 ; i++){
            var organ = node[uiList[i+15]]
            organ.index = i 
            createTouchEvent({
                item:organ,
                begin:function(data){
                    var item = data.item
                    if(!cc.sys.isMobile){
                        var result = judgeOpInPos(data)//使用像素判定，使得更加精准
                        if(result){
                            node.beginPos = item.getPosition()
                            item.getChildren()[0].setVisible(true)
                            node.localOrder++
                            item.setLocalZOrder(node.localOrder)
                        }
                        return result
                    }else{
                        node.beginPos = item.getPosition()
                        item.getChildren()[0].setVisible(true)
                        node.localOrder++
                        item.setLocalZOrder(node.localOrder)
                        return true 
                    }
                },
                move:function(data){
                    var item = data.item 
                    var delta = data.delta 
                    item.x += delta.x 
                    item.y += delta.y 
                },
                end:function(data){
                    var item = data.item
                    var index = item.index
                    if(rectIntersectsRect(item, node[uiList[index]])){
                        item.setPositionY(-500)
                        item.removeFromParent(true)
                        node[uiList[index]].setVisible(true)
                        node.judgeOverCount++
                        cc.log("curOver: ",node.judgeOverCount)
                        if(node.judgeOverCount == 15)
                            judgeOverFun()
                    }else{
                        item.getChildren()[0].setVisible(false)
                        item.setPosition(node.beginPos)
                        playMusic(res.zswd_wrong)
                    }
                        
                }
            })
        }

        //创建是否重新开始提示框
        var judgeOverFun = function(){
            playMusic(res.zswd_right)
            AddDialog("Tips", {
                res: res.img_retry,
                face: 1,
                ifCancle: true,
                yesCall: function() {
                    if (self.refreshCall) {
                        self.refreshCall()
                    }
                }
            })
        }
        var  rectIntersectsRect = function (ra, rb) {
            var maxax = ra.x + ra.width/2,
                maxay = ra.y + ra.height/2,
                maxbx = rb.x + rb.width/2,
                maxby = rb.y + rb.height/2;
            return !(maxax < rb.x - rb.width/2 || 
                maxbx < ra.x - ra.width/2 || 
                maxay < rb.y - rb.height/2 ||
                maxby < ra.y - ra.height/2/2);
        }
    }
})