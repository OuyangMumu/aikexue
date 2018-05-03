var GB_BG = null
var gb_biaoge = function() {
	if (!GB_BG) {
		var bg = createBiaoge({
			json: res.gb_bg,
			downData: {
				nums: 12,
				bufs: [
					[null, "#gb_bg_01.png", "#gb_bg_02.png", "#gb_bg_03.png"],
					[null, "#gb_bg_01.png", "#gb_bg_02.png", "#gb_bg_03.png"],
					[null, "#gb_bg_01.png", "#gb_bg_02.png", "#gb_bg_03.png"],
					[null, "#gb_bg_01.png", "#gb_bg_02.png", "#gb_bg_03.png"],
					[null, "#gb_bg_07.png", "#gb_bg_08.png", "#gb_bg_09.png", "#gb_bg_10.png"],
					[null, "#gb_bg_07.png", "#gb_bg_08.png", "#gb_bg_09.png", "#gb_bg_10.png"],
					[null, "#gb_bg_07.png", "#gb_bg_08.png", "#gb_bg_09.png", "#gb_bg_10.png"],
					[null, "#gb_bg_07.png", "#gb_bg_08.png", "#gb_bg_09.png", "#gb_bg_10.png"],
					[null, "#gb_bg_01.png", "#gb_bg_02.png", "#gb_bg_03.png"],
					[null, "#gb_bg_01.png", "#gb_bg_02.png", "#gb_bg_03.png"],
					[null, "#gb_bg_01.png", "#gb_bg_02.png", "#gb_bg_03.png"],
					[null, "#gb_bg_01.png", "#gb_bg_02.png", "#gb_bg_03.png"],
				],
			},
		})
		bg.retain()
		GB_BG = bg
	}
	return GB_BG
}

var createInPy = function(data) {
	var self = data.layer
	var addWide = data.addWide || 0
	var show = data.show || false
	loadPlist("doTool")
	createWaterPhy({
		layer: self,
		showDebug: show,
	})
	var desk = new cc.Sprite(res.img_desk)
	desk.setPosition(getMiddle(0, -360))
	safeAdd(self, desk)
	var shuigang = createShuiGang({
		addWide: addWide,
	})
	shuigang.setPosition(getMiddle(0, -120))
	safeAdd(self, shuigang)
	shuigang.setHeight(200)
	shuigang.clipNode.setLocalZOrder(1)
	shuigang.water_front.setLocalZOrder(1)
	shuigang.deco.setLocalZOrder(1)
	changeFather({
		item: shuigang.clipNode,
		father: self,
	})
	changeFather({
		item: shuigang.water_front,
		father: self,
		needScale: true,
	})

	changeFather({
		item: shuigang.deco,
		father: self,
		needScale: true,
	})
	self.shuigang = shuigang
	var water = self.addWater({
		item: shuigang.judgeWater,
		disHeight: 45,
	})
	self.actPys(true)
}