//@author mu @14/4/27

var judgeDialog = cc.Layer.extend({
    sprite: null,
    reload: function(data) { //需要重新布局对话框的就需要定义自己的reload函数
        //以下代码修改了对话框内的图片和尺寸
        var scale = data.scale || 1
        var judge = data.judge || false
        var self = this
        self.sound = data.sound
        self.judge = judge
        if (scale == null) {
            scale = 1
        }
        var node = this.node
        var texture = judge ? res.img_correct : res.img_fault
        node.img_face_1.setVisible(judge)
        node.img_face_2.setVisible(!judge)
        node.img_tip.loadTexture(texture)
        node.img_tip.setContentSize(getSize(texture))
        node.img_tip.setScale(scale)
        node.btn_confirm.setVisible(true)
        var fun = data.fun
        node.backFun = fun
    },
    ctor: function(data) {
        this._super()
        var ui_list = [
            "btn_close",
            "btn_confirm",
            "img_face_1",
            "img_face_2",
            "img_tip"
        ]
        var self = this
        var node = loadNode(res.tips, ui_list, "bg")
        self.node = node
        self.addChild(node)
        node.img_tip.rootPos = node.img_tip.getPosition()
        node.btn_close.addClickEventListener(function() {
            self.onOut()
            if (self.node.backFun) {
                self.node.backFun()
            }
        })
        node.btn_confirm.addClickEventListener(function() {
                self.onOut()
                if (self.node.backFun) {
                    self.node.backFun()
                }
            })
            //添加退出的监听
        self.reload(data)
        return true;
    },
    playSound: function() {
        var self = this
        var judge = self.judge
        var sound = self.sound
        cc.log(judge)
        if (sound) {
            switch (sound) {
                case "boshi":
                    playMusic(judge ? res.sound_right_bs : res.sound_fault_bs)
                    break
                case "student":
                    playMusic(judge ? res.sound_right : res.sound_fault)
                    break
            }
        }
    },
    onIn: function() //进场函数
        {
            var self = this
            var node = self.node
                //放大淡入
            node.setPosition(cc.p(0, 0))
            addShowType({
                item: node,
                show: "scale"
            })
            addShowType({
                item: node,
                show: "fadeIn",
                fun: function(item) {
                    addMoving(item)
                }
            })
            self.playSound()
        },
    onOut: function() //退场函数
        {
            var self = this
            var node = self.node
                //缩小淡出
            addShowType({
                item: node,
                show: "zoom"
            })
            addShowType({
                item: node,
                show: "fadeOut",
                fun: function(item) {
                    removeMoving(item)
                }
            })
        }
})