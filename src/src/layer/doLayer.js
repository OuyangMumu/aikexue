//@author mu @14/4/15

var doLayer = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  ctor: function() {
    this._super();
    var ui_list = [
      "img_title",
      "btn_home",
      "btn_start",
      "btn_ask",
      "node_cut",
    ]
    var self = this
    loadUI(this, res.expLayer, ui_list)
    this.img_title.setTexture("res/img/img_do.png")
    this.btn_home.addClickEventListener(function() {
      changeLayer({
        out: self,
        in : layerControl.getLayer("mainLayer")
      })
    })
    this.KeyBack = function() {
      changeLayer({
        out: self,
        in : layerControl.getLayer("mainLayer")
      })
    }
    this.btn_ask.addClickEventListener(function() {
      changeLayer({
        out: self,
        in : layerControl.getLayer("helpLayer"),
        back: "doLayer"
      })
    })

    var enter = function(index) {
      changeLayer({
        out: self,
        in : layerControl.getLayer(sprintf("doExp%d", index + 1), true),
      })
    }
    if (mainInfo.doList) {
      if (!mainInfo.useNew) {
        this.btn_start.setVisible(false)
        var node = createChoseExp({
          files: mainInfo.doList,
          names: mainInfo.doNames,
          fun: enter
        })
        this.node_cut.addChild(node)
        getLoopOp(self)
      } else {

        var node = createPageView({
          files: mainInfo.doList,
          names: mainInfo.doNames,
          fun: enter
        })

        this.btn_start.addClickEventListener(function() {
          enter(node.getPage())
        })
        this.node_cut.addChild(node)
        getLoopOp(self)
      }
      return true
    } else {
      return false
    }
  }
})