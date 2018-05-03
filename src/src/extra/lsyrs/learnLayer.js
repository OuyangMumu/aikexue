//@author mu @14/4/15

var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    ctor: function() {
        this._super();
        this.learnCtor()
        if (this.myInit) {
            this.myInit()
        }
        return true
    },
    dataControl: {},
    myInit: function() {
        var self = this
        this.img_page.setVisible(false)
        this.img_title.loadTexture(res.img_learn_title)
        this.img_title.setContentSize(getSize(res.img_learn_title))
        var btn = new ccui.Button(res.btn_addms_normal, res.btn_addms_select)
        btn.setPosition(getMiddle(30, 0))
        this.loadUI.addChild(btn)
        btn.addClickEventListener(function() {
            self.show()
            btn.setVisible(false)
        })
        this.dataControl = {}
        var dataControl = self.dataControl
        loadPlist("lsjb")
        loadPlist("rsjb")
        loadPlist("msdx")
        var nodels = new cc.Sprite("#ls0001.png")
        var noders = new cc.Sprite("#rs0001.png")
        nodels.setScale(0.8)
        noders.setScale(0.8)
        nodels.setPosition(getMiddle(200, -180))
        noders.setPosition(getMiddle(-200, -180))
        self.loadUI.addChild(nodels)
        self.loadUI.addChild(noders)
        var dialogls = new ccui.ImageView(res.img_learn_dialog)
        dialogls.setPosition(getMiddle(270, 0))
        dialogls.setScale(0.8)
        dialogls.setFlippedX(true)
        this.loadUI.addChild(dialogls)

        var dialogrs = new ccui.ImageView(res.img_learn_dialog)
        dialogrs.setPosition(getMiddle(-250, 0))
        dialogrs.setScale(0.8)
        this.loadUI.addChild(dialogrs)

        var img = new ccui.ImageView(res.img_learnfont)
        img.setPosition(getMiddle(0, 140))
        img.setScale(0.9)
        this.loadUI.addChild(img)
        img.setVisible(false)
        dataControl.img = img
        var rectrs = new ccui.Layout()
        rectrs.setContentSize(255, 175)
        rectrs.setPosition(5, 35)
        rectrs.setBackGroundColor(cc.color(255, 0, 0, 255))
        rectrs.setBackGroundColorOpacity(0)
        rectrs.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID)
        rectrs.setClippingEnabled(true)
        dialogrs.addChild(rectrs)
        getZq({
            father: noders,
            devide: 10,
            scale: 2,
            pos: cc.p(150, 300),
        })

        var rectls = new ccui.Layout()
        rectls.setContentSize(255, 175)
        rectls.setPosition(5, 35)
        rectls.setBackGroundColor(cc.color(255, 0, 0, 255))
        rectls.setBackGroundColorOpacity(0)
        rectls.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID)
        rectls.setClippingEnabled(true)
        dialogls.addChild(rectls)
        var particle_rs = this.createNewWater({
            total: 40,
            res: res.img_blue,
            scale: 0.6,
            scalevar: 0,
            width: 300,
            height: 200,
            time: 1.0,
            minx: 70,
            miny: 250,
            xvar: 20,
            yvar: 20,
        })
        rectrs.addChild(particle_rs)

        var particle_ls = this.createNewWater({
            total: 70,
            res: res.img_blue,
            scale: 0.6,
            scalevar: 0,
            width: 300,
            height: 200,
            time: 1.0,
            minx: 20,
            miny: 50,
            xvar: 10,
            yvar: 20,
        })
        rectls.addChild(particle_ls)

        var anils = createAnimation({
            frame: "ls%04d.png",
            end: 40
        })
        anils.retain()
        var anirs = createAnimation({
            frame: "rs%04d.png",
            end: 11
        })
        anirs.retain()

        var animsdxls = cc.sequence(createAnimation({
            frame: "msdx%02d.png",
            end: 17
        }), cc.callFunc(function() {
            var dataControl = self.dataControl
            dataControl.img.setVisible(true)
            if (dataControl.item2) {
                addShowType({
                    item: dataControl.item2,
                    show: "fadeOut",
                    time: 0.1,
                })
            }
            nodels.runAction(anils)
            anils.release()
            var temp = self.createNewWater({
                total: 50,
                res: res.img_red,
                scale: 0.4,
                scalevar:0,
                width: 300,
                height: 200,
                time: 1.0,
                minx: 20,
                miny: 50,
                xvar: 10,
                yvar: 20,
            })
            rectls.addChild(temp)
        }))
        var animsdxrs = cc.sequence(createAnimation({
            frame: "msdx%02d.png",
            end: 17
        }), cc.callFunc(function() {
            var dataControl = self.dataControl
            dataControl.img.setVisible(true)
            if (dataControl.item1) {
                addShowType({
                    item: dataControl.item1,
                    show: "fadeOut",
                    time: 0.1,
                })
            }
            noders.runAction(anirs)
            anirs.release()
            var particle_rs = self.createNewWater({
                total: 20,
                res: res.img_red,
                scale: 0.4,
                scalevar:0,
                width: 300,
                height: 200,
                time: 1.0,
                minx: 70,
                miny: 250,
                xvar: 20,
                yvar: 20,
            })
            rectrs.addChild(particle_rs)
        }))
        this.dataControl.items = []

        var nodemsdx1 = new cc.Sprite("#msdx01.png")
        nodemsdx1.setPosition(getMiddle(-400, 10))
        nodemsdx1.setVisible(false)
        this.loadUI.addChild(nodemsdx1)
        nodemsdx1.movePos = cc.p(160, -50)
        this.dataControl.items[0] = nodemsdx1
        nodemsdx1.action = animsdxrs
        animsdxrs.retain()

        self.dataControl.item1 = nodemsdx1

        var nodemsdx2 = new cc.Sprite("#msdx01.png")
        nodemsdx2.setPosition(getMiddle(430, 10))
        nodemsdx2.setFlippedX(true)
        nodemsdx2.setVisible(false)
        this.loadUI.addChild(nodemsdx2)
        nodemsdx2.movePos = cc.p(-160, -50)
        this.dataControl.items[1] = nodemsdx2
        nodemsdx2.action = animsdxls
        animsdxls.retain()
        self.dataControl.item2 = nodemsdx2
    },
    show: function() {
        var dataControl = this.dataControl
        if (dataControl) {
            if (dataControl.items) {
                for (var i = 0; i < dataControl.items.length; i++) {
                    var item = dataControl.items[i]
                    item.setVisible(true)
                    addShowType({
                        item: item,
                        show: "moveBy",
                        time: 0.3,
                        buf: item.movePos,
                    })
                    addShowType({
                        item: item,
                        show: "fadeIn",
                        time: 0.2,
                    })
                    item.runAction(item.action)
                    item.action.release()
                }
            }
        }
    },
    createNewWater: function(data) {
        var total = data.total
        var width = data.width
        var height = data.height
        var tex = data.res
        var scale = data.scale
        var scalevar = data.scalevar
        if (scalevar == null) {
            scalevar = 0.3
        }
        var minx = data.minx
        var miny = data.miny
        var xvar = data.xvar || 10
        var yvar = data.yvar || 10

        var pertime = 0.02
        var time = data.time
        var timevar = data.timevar || 0.5
        var node = new cc.SpriteBatchNode(tex)
        node.list = []

        var reinit = function(temp) {
            temp.setScale(scale + Math.random() * scalevar)
            temp.tri = Math.random() > 0.5
            temp.curtime = Math.random() * (time + Math.random() * timevar)
            temp.time = time + Math.random() * timevar
            temp.movex = minx + xvar * Math.random()
            temp.movey = miny + yvar * Math.random()
            temp.perx = pertime / temp.time * temp.movex
            temp.pery = pertime / temp.time * temp.movey
        }

        for (var i = 0; i < total; i++) {
            var temp = new cc.Sprite(tex)
            reinit(temp)
            temp.setPosition(width * Math.random(), height * Math.random())
            node.list[i] = temp
            node.addChild(temp)
        }

        node.schedule(function() {
            for (var i = 0; i < node.list.length; i++) {
                var temp = node.list[i]
                temp.curtime += pertime
                var judge = temp.tri ? 1 : -1
                temp.x += judge * temp.perx
                temp.y += temp.pery
                if (temp.curtime >= temp.time) {
                    temp.curtime = 0
                    temp.tri = !temp.tri
                }
                if (temp.y > height) {
                    temp.y = 0
                    reinit(temp)
                }
            }
        }, pertime, cc.REPEAT_FOREVER)
        return node
    },
})