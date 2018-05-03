//author mu @16/4/20

var timerControl = {
		timerNode: null,
		timerData: {},
	} //添加在场景上 场景切换上个场景的计时器全部删除 由于目前是图层切换 只在加载的时候有场景切换 暂时不做改动

timerControl.addTimer = function(data) { //添加计时函数
	var fun = data.fun
	var delay = data.delay || 0
	var time = data.time || 0.1
	var repeat = data.repeat || 1
	var key = data.key || getRandKey()
	var type = data.type || "action"
	var finish = data.finish
	var after = data.after
	var buf = data.buf
	if(buf == null){
		buf = key
	}

	var father = data.father
	if (!father) {
		if (!this.timerNode) {
			this.timerNode = new cc.Node()
			this.timerNode.retain()
			cc.director.getRunningScene().addChild(this.timerNode)
		} else {
			var scene = this.timerNode.getParent()
			var curscene = cc.director.getRunningScene()
			if (!(scene && scene == curscene)) {
				this.timerNode = null
				return this.addTimer(data)
			}
		}
	}

	var node = null
	switch (type) {
		case "normal":
			node = new cc.Node()
			node.finish = finish
			node.schedule(fun, time, repeat, delay)
			node.myType = type
			break
		case "action":
			if (repeat == cc.REPEAT_FOREVER) {
				repeat = 999999
			}
			node = new cc.Node()
			node.finish = finish
			node.runAction(
				cc.sequence(
					cc.delayTime(delay),
					cc.repeat(
						cc.sequence(
							cc.delayTime(time),
							cc.callFunc(function() {
								if (fun) {
									fun(buf)
								}
							})), repeat),
					cc.callFunc(function() {
						if (after) {
							after()
						}
					})
				)
			)
			node.myType = type
			break
	}

	if (!this.timerData) {
		this.timerData = {}
	}

	removeTimer(key)
	if (father) {
		father.addChild(node)
	} else {
		this.timerNode.addChild(node)
	}
	this.timerData[key] = node
	if (CC_CURRENT_LAYER) {
		node.curLayer = CC_CURRENT_LAYER
	}
	node.setName(key)
	return node
}

timerControl.removeTimer = function(key) { //删除对应key的timer
	var node = this.timerData[key]
	if (node) {
		switch (node.myType) {
			case "normal":
				node.unschedule()
				break
			case "action":
				node.stopAllActions()
				break
		}
		node.removeFromParent(true)
		this.timerData[key] = null
		cc.log("removeTimer:", key)
	}
}

timerControl.finishTimer = function(key) { //完成指定timer并调用其finish
	var node = this.timerData[key]
	if (node) {
		if (node.finish) {
			node.finish()
		}
		removeTimer(key)
	}
}

timerControl.printTimer = function() { //打印当前所有timer
	cc.log("node", this.timerNode)
	if (this.timerNode) {
		var children = this.timerNode.getChildren()
		for (var i = 0; i < children.length; i++) {
			cc.log("Name:", children[i].getName())
		}
	}
}

timerControl.clearTimer = function() { //删除所有timer
	if (this.timerNode) {
		if (this.timerNode.getParent) {
			this.timerNode.release()
			this.timerNode.removeFromParent(true)
		}
	}
	this.timerNode = null
}

timerControl.clearByLayer = function(Layer) {
	if (this.timerNode) {
		var children = this.timerNode.getChildren()
		for (var i = 0; i < children.length; i++) {
			var child = children[i]
			if (child && child.curLayer && child.curLayer == Layer) {
				var tName = child.getName()
				removeTimer(tName)
				cc.log("auto clean: ", tName)
			}
		}
	}
}

timerControl.checkTimer = function(key) {
	var node = this.timerData[key]
	if (node) {
		return true
	} else {
		return false
	}
}

timerControl.addKey = function(key) {
	if (!timerControl.timeList) {
		timerControl.timeList = []
	}
	var getDate = function() {
		var date = new Date()
		return date.getTime()
	}
	var list = timerControl.timeList
	list[list.length] = {
		time: getDate(),
		key: key,
	}
	if (list.length == 1) {
		cc.log(sprintf("KEY:%s DEVIDE:%f", key, 0))
	} else {
		cc.log(sprintf("KEY:%s DEVIDE:%f", key, list[list.length - 1].time - list[list.length - 2].time))
	}
}

clearTimer = timerControl.clearTimer
addTimer = timerControl.addTimer
removeTimer = timerControl.removeTimer
printTimer = timerControl.printTimer
finishTimer = timerControl.finishTimer
clearByLayer = timerControl.clearByLayer
checkTimer = timerControl.checkTimer
addKey = timerControl.addKey