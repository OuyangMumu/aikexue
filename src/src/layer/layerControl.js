//author @mu @14/4/15
var layerControl = {}
var LayerList = [//layer管理器
	["doLayer", function() {
		return new doLayer()
	}],
	["seeLayer", function() {
		return new seeLayer()
	}],
	["learnLayer", function() {
		return new learnLayer()
	}],
	["mainLayer", function() {
		return new mainLayer()
	}],
	["helpLayer", function() {
		return new helpLayer()
	}],
	["videoLayer", function() {
		return new videoLayer()
	}],
	["showLayer", function() {
		return new showLayer()
	}],
]

var addList = function(list) {
	for (var i = 0; i < list.length; i++) {
		LayerList[LayerList.length] = list[i]
	}
}

addlist = layerControl.addList

layerControl.change = function(inlayer, changelayer) {//切换页面
	if (changelayer.layerName) {
		var past = layerControl[changelayer.layerName]
		if (past) {
			deleteLayer(past)
			layerControl[changelayer.layerName] = null
		}
		if (inlayer) {
			deleteLayer(inlayer)
			inlayer = null
		}
		layerControl[changelayer.layerName] = changelayer
	} else {
		cc.log("some layer has not layername please check")
	}
}

layerControl.newLayer = function(LayerName) {
	for (var i = 0; i < LayerList.length; i++) {
		if (LayerName == LayerList[i][0]) {
			var newLayer = LayerList[i][1]()
			getLoopOp(newLayer)
			return newLayer
		}
	}
}

layerControl.getLayer = function(LayerName, forceNew) {
	forceNew = forceNew || false
	if (layerControl[LayerName]) {
		if (forceNew) {
			var layer = layerControl[LayerName]
			deleteLayer(layer)
			var temp = getLayer(LayerName)
			getLoopOp(temp)
			return temp
		}
		layerControl[LayerName].setVisible(true)
		return layerControl[LayerName]
	} else {
		for (var i = 0; i < LayerList.length; i++) {
			if (LayerName == LayerList[i][0]) {
				layerControl[LayerName] = LayerList[i][1]()
				getLoopOp(layerControl[LayerName])
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
			if (layer.dataControl) {
				layer.dataControl = null
			}
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

deleteLayer = layerControl.deleteLayer
getLayer = layerControl.getLayer