//author @mu @14/4/15
var layerControl = {}
var LayerList = [//layer管理器
	["mainLayer", function() {
		return new views.mainLayer()
	}],
	["choseLayer", function() {
		return new views.choseLayer()
	}],
	["selectLayer", function() {
		return new views.selectLayer()
	}],
	["answerLayer", function() {
		return new views.answerLayer()
	}],
	["passLayer", function() {
		return new views.passLayer()
	}]
]

layerControl.currentLayer = null
CC_CURRENT_LAYER = null
layerControl.addList = function(list) {
	for (var i = 0; i < list.length; i++) {
		LayerList[LayerList.length] = list[i]
	}
}

layerControl.getLayer = function(LayerName, forceNew) {
	forceNew = forceNew || false
	if (layerControl[LayerName]) {
		if (forceNew) {
			var layer = layerControl[LayerName]
			layerControl.deleteLayer(layer)
			var temp = getLayer(LayerName)
			return temp
		}
		layerControl[LayerName].setVisible(true)
		return layerControl[LayerName]
	} else {
		for (var i = 0; i < LayerList.length; i++) {
			if (LayerName == LayerList[i][0]) {
				layerControl[LayerName] = LayerList[i][1]()
				return layerControl[LayerName]
			}
		}
	}
	cc.log("err layer call")
	return null
}
layerControl.deleteLayer = function(layer) {
	for (var i = 0; i < LayerList.length; i++) {
		var templayer = layerControl[LayerList[i][0]]
		if (layer == templayer) {
			layer.removeAllChildren(true)
			layer.removeFromParent(true)
			layerControl[LayerList[i][0]] = null
			cc.log("delete success")
			return true
		}
	}
	cc.log("delete failed")
	return false
}
layerControl.showLayer = function(LayerName) { //场景切换
	if(layerControl.currentLayer)
	{
		layerControl.deleteLayer(layerControl.currentLayer)
		layerControl.currentLayer = null
	}
    
    layerControl.currentLayer = layerControl.getLayer(LayerName)
    CC_CURRENT_LAYER = layerControl.currentLayer
    senceControl.currentSence.addChild(layerControl.currentLayer)
    return layerControl.currentLayer
}