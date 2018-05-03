loadSee = function(data) {
	var key = data.key
	var uiList = [
		key
	]
	var see = loadNode(res.sydcs_see, uiList, key)
	return see
}

loadDo = function(data) {
	var key = data.key
	var uiList = [
		key
	]
	var item_do = loadNode(res.sydcs_do, uiList, key)
	return item_do
}