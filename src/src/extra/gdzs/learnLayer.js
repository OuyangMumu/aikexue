//@author mu @14/5/10
var learnLayer = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  load: function() {
    loadPlist("learn_nums")
    loadPlist("xingxing")
  },
  ctor: function() {
    this._super();
    this.learnCtor()
    var self = this
    var caihong = new cc.Sprite(res.caihong00)
    var sheng1 = new cc.Sprite(res.sheng20)
    var sheng2 = new cc.Sprite(res.sheng20)
    var xue3 = ccs.load(res.heiye).node
    self.caihong = caihong
    self.sheng1 = sheng1
    self.sheng2 = sheng2
    self.xue3 = xue3
    self.initMySprite = function() {
      this.caihong.setTexture(res.caihong00)
      this.sheng1.setTexture(res.sheng00)
      this.sheng2.setTexture(res.sheng14)
      this.xue3.init()
    }
    var spriteAc = function(data) {
      var item = data.item
      var name = data.name
      var start = data.start
      var end = data.end

      item.stopAllActions()
      var spAction1 = createAnimation({
        ifFile: true,
        frame: name,
        start: start,
        end: end,
        time: 0.08
      })
      item.runAction(spAction1)
    }
    caihong.playAc = function() {
      spriteAc({
        item: this,
        name: "caihong%02d",
        start: 0,
        end: 30
      })
    }
    sheng1.playAc = function() {
      spriteAc({
        item: this,
        name: "sheng%02d",
        start: 0,
        end: 13
      })
    }
    sheng2.playAc = function() {
      spriteAc({
        item: this,
        name: "sheng%02d",
        start: 14,
        end: 26
      })
    }

    xue3.init = function() {
      var xue3 = this
      if (!xue3.zi) {
        xue3.zi = new cc.Sprite(res.xue3_1)
        xue3.addChild(xue3.zi)
      }
      xue3.zi.setPosition(0, -260)
      xue3.zi.setOpacity(0)
      xue3.stopAllActions()
    }
    xue3.playAc = function() {
      var xue3 = this
      xue3.init()
      xue3.zi.runAction(cc.spawn(
        cc.fadeIn(0.3),
        cc.moveTo(0.3, cc.p(0, -224))
      ))
    }
    xue3.xingxing = function() {
      var xue = this
      var yl = xue.getChildByName("ty")
      var spAction1 = createAnimation({
        frame: "xx%d.png",
        start: 2,
        end: 4,
        time: 0.2
      })
      yl.runAction(cc.repeatForever(spAction1))

      for (var i in xue.getChildren()) {
        var item = xue.getChildren()[i]
        if (item.getName() != "ty" && item.getName() != "xue3") {
          var scale = item.getScaleX()
          if (scale >= 0.8) {
            var time = Math.random() * 3 + 0.5
            var op = Math.random() * 80 + 40
            item.runAction(cc.repeatForever(cc.sequence(
              cc.fadeTo(time, op),
              cc.delayTime(time),
              cc.fadeIn(time)
            )))
          } else {
            var time1 = Math.random() * 2 + 0.5
            var op1 = Math.random() * 80 + 40
            item.runAction(cc.repeatForever(cc.sequence(
              cc.fadeTo(time1, op1),
              cc.delayTime(time1),
              cc.fadeIn(time1)
            )))
          }
        }
      }
    }
    xue3.xingxing()
    caihong.playAc()
    self.initPagegsr({
      imgs: [
        [caihong],
        [sheng1, sheng2],
        [xue3],
      ],
      pavedata: [{
        nodeX: 588,
        nodeY: 255
      }, {
        nodeX: 588,
        nodeY: 255,
        jdtpos: cc.p(230, 80)
      }, {
        nodeX: 578,
        nodeY: 340
      }],
      btns: [
        [res.xue1btn_nor, res.xue1btn_sel, res.xue1btn_dis],
        [res.xue2btn_nor, res.xue2btn_sel, res.xue2btn_dis],
        [res.xue3btn_nor, res.xue3btn_sel, res.xue3btn_dis]
      ],
      btnpos: [
        cc.p(330, 593),
        cc.p(582, 593),
        cc.p(810, 593)
      ],
      btnSkipbackFun: function(index) {
        self.initMySprite()
        switch (index) {
          case 0:
            caihong.playAc()
            break
          case 1:
            sheng1.playAc()
            break
          case 2:
            xue3.playAc()
            break
        }
      },
      func: function(data) {
        var num = data.num
        var index = data.index
        if (index == 1) {
          if(self.curNum != num){
              self.initMySprite()
              switch (num) {
                case 1:
                  sheng1.playAc()
                  break
                case 2:
                  sheng2.playAc()
                  break
              }
              self.curNum = num
          }
        }
      }
    })
    return true
  }
})