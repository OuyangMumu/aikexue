//@author mu @14/4/27

var tipsDialog = function(data) {
    var ui_list = [
        "btn_close",
        "btn_confirm",
        "btn_cancle",
        "img_face_1",
        "img_face_2",
        "img_tip"
    ]
    var node = loadNode(res.tips, ui_list, "bg")
    node.img_tip.rootPos = node.img_tip.getPosition()
        //加载UI
    node.reload = function(data) {
        var texture = data.res
        var face = data.face
        var scale = data.scale
        var sound = data.sound
        var father = data.father
        var closeBack = data.closeBack
        var yesCall = data.yesCall
        var noCall = data.noCall
        var confirmBtn = data.confirmBtn || true
        var ifCancle = data.ifCancle || false
        var modify = data.modify || cc.p(0, 0)
        var diaScale = data.diaScale || 1
        var type = data.type || ccui.Widget.LOCAL_TEXTURE
        if (scale == null) {
            scale = 1
        }
        var self = this
        self.closeBack = closeBack
        self.yesCall = yesCall
        self.noCall = noCall
        self.img_face_1.setVisible(face == 1)
        self.img_face_2.setVisible(face == 2)
        self.img_tip.loadTexture(texture, type)
        switch (type) {
            case ccui.Widget.LOCAL_TEXTURE:
                self.img_tip.setContentSize(getSize(texture))
                break
            default:
                self.img_tip.setContentSize(getSize(sprintf("#%s", texture)))
                break
        }
        var root = self.img_tip.rootPos
        var final = cc.p(root.x + modify.x, root.y + modify.y)
        self.img_tip.setPosition(final)
        self.img_tip.setScale(scale)
        self.btn_confirm.setVisible(confirmBtn)
        self.btn_cancle.setVisible(ifCancle)
        if (ifCancle) {
            self.btn_confirm.setPositionX(170)
        }
        if (father) {
            safeAdd(father, self)
        }
        if (sound) {
            self.sound = true
            playMusic(sound)
        } else {
            self.sound = false
        }
        self.diaScale = diaScale
    }
    node.onIn = function() {
        var self = this
        var node = self
            //放大淡入
        node.setLocalZOrder(LOCAL_ORDER++)
        safeAdd(node.getParent(), node)
        node.setPosition(getMiddle())
        node.setScale(0)
        addShowType({
            item: node,
            show: "scaleTo",
            buf: self.diaScale,
        })
        addShowType({
            item: node,
            show: "fadeIn",
            fun: function(item) {
                createTouchEvent({
                    item: item,
                    begin: function(data) {
                        var item = data.item
                        item.setLocalZOrder(LOCAL_ORDER++)
                        safeAdd(item.getParent(), item)
                        return true
                    },
                    autoMove: true,
                })
            }
        })
    }
    node.onOut = function(data) {
        var self = this
        var node = self
        data = data || {}
        var callFun = data.callFun
            //缩小淡出
        addShowType({
            item: node,
            show: "zoom"
        })
        addShowType({
            item: node,
            show: "fadeOut",
            fun: function(item) {
                item.removeListen()
                if (item.sound) {
                    stopMusic()
                }
                switch (callFun) {
                    case "YES":
                        if (self.yesCall) {
                            self.yesCall()
                        }
                        break
                    case "NO":
                        if (self.noCall) {
                            self.noCall()
                        }
                        break
                }
                if (self.closeBack) {
                    self.closeBack()
                }
            }
        })
    }

    node.btn_close.addClickEventListener(function() {
        node.onOut()
    })
    node.btn_confirm.addClickEventListener(function() {
        node.onOut({
            callFun: "YES",
        })
    })
    node.btn_cancle.addClickEventListener(function() {
        node.onOut({
            callFun: "NO",
        })
    })
    node.reload(data)

    return node
}