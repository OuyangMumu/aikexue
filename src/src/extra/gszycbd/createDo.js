var getDoIndex = function(index, fun) {
	var uilist = [
		"img_press",
		"item_btn",
		"show1",
		"show2",
	]
	var bg = loadNode(res.dojson, uilist)
	bg.show1.setVisible(index == 1)
	bg.show2.setVisible(index == 2)
	var curBg = bg[sprintf("show%d", index)]
	var bgList = [
		"light",
	]
	loadList(curBg, bgList)
	var light = curBg.light

	var pos = bg.item_btn.getPosition()
	bg.item_btn.removeFromParent(true)
	light.setVisible(false)
	var btn = createJudgeBtn({
		normal: "do_item_06.png",
		select: "do_item_09.png",
		frame: true,
		pos: pos,
		fun: function() {
			light.setVisible(true)
			if(bg.btn_result){
				bg.btn_result.setVisible(true)
			}
		},
		back: function() {
			light.setVisible(false)
		}
	})
	safeAdd(bg, btn)

	var img_press = bg.img_press
	addShowType({
		item: img_press,
		show: "moveBackForever",
		time: 0.25,
		buf: cc.p(0, -5),
	})

	var btn_result = new ccui.Button(res.btn_jielun_normal, res.btn_jielun_select)
	btn_result.setPosition(getMiddle(400, 140))
	safeAdd(bg, btn_result)
	btn_result.addClickEventListener(function(){
		if(fun){
			fun()
		}
	})
	bg.btn_result = btn_result
	btn_result.setVisible(false)

	return bg
}