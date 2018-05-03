function createInTool(item) {
	var uilist = [
		"deco"
	]
	var bg = loadNode(res.toolPack, uilist, "bg")
	bg.deco.setLocalZOrder(-1)
	var size = bg.deco.getContentSize()
	if (item) {
		item.setPosition(size.width / 2, size.height / 2)
		safeAdd(bg.deco, item)
	}
	bg.addItem = function(item) {
		if (item) {
			item.setPosition(size.width / 2, size.height / 2)
			safeAdd(bg.deco, item)
		}
	}
	return bg
}