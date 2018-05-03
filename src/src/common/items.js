//authro @mu @2016/5/19
function createThclj2(data) {
	data = data || {}
	var touchFun = data.touchFun
	var backFun = data.backFun
	var limit = data.limit
	var uilist = [
		"item_th",
		"item_arrow",
		"rect",
		"item_gou",
		"item_lh",
		"item_arrdeco",
		"item_font",
		"add_node",
	]

	var bg = loadNode(res.item_thclj2, uilist, "bg")
	var rect = bg.rect
	var item_th = bg.item_th
	var item_lh = bg.item_lh
	var item_arrow = bg.item_arrow
	var item_gou = bg.item_gou
	var item_arrdeco = bg.item_arrdeco

	rect.setLocalZOrder(-1)
	item_gou.setLocalZOrder(-1)
	reAdd(item_gou)
	reAdd(rect)
	changeFather({
		item: item_th,
		father: rect,
	})

	item_arrdeco.rootPos = item_arrdeco.getPosition()

	var move1List = [
		item_th,
		item_arrow,
		item_gou,
	]

	for (var i = 0; i < move1List.length; i++) {
		var item = move1List[i]
		item.rootPos = item.getPosition()
	}

	bg.showDrag = function(judge) {
		var bg = this
		var item_arrdeco = bg.item_arrdeco
		var item_font = bg.item_font
		item_arrdeco.setVisible(judge)
		item_arrdeco.stopAllActions()
		item_font.setVisible(judge)
		if (judge) {
			item_arrdeco.stopAllActions()
			addShowType({
				item: item_arrdeco,
				show: "shakeF",
				time: 0.4,
				buf: cc.p(15, 0),
			})
		}
	}

	bg.setLimit = function(limit){
		var bg = this
		if(limit){
			bg.limit = limit
		}
	}

	bg.setMaxF = function(f) {
		var bg = this
		bg.maxF = f * bg.perF
	}

	bg.perF = 97 / 5

	bg.getBig = function() {
		var bg = this
		if (!bg.fdj) {
			var clip = new cc.ClippingNode(new cc.Sprite(res.img_fdj_back4))
			clip.setLocalZOrder(-1)
			clip.setAlphaThreshold(0)
			var fdj = new cc.Sprite(res.img_fdj4)
			var size = fdj.getContentSize()
			clip.setPosition(size.width / 2, size.height / 2)
			safeAdd(fdj, clip)
			bg.fdj = fdj

			var th2 = loadNode(res.item_thclj2, uilist)
			th2.item_gou.setLocalZOrder(-1)
			reAdd(th2.item_gou)
			th2.setScale(1.9)
			th2.setRotation(-90)
			safeAdd(clip, th2)

			th2.init = function(){
				var th2 = this
				var linkList = [
					"item_arrow",
					"item_th",
				]
				var linkMoveList = []
				for (var i = 0; i < linkList.length; i++) {
					var item = th2[linkList[i]]
					linkMoveList[i] = item
					item.rootPos = item.getPosition()
				}
				th2.linkMoveList = linkMoveList
			}

			th2.init()

			bg.link = th2
		}
		return bg.fdj
	}

	bg.addItem = function(data) {
		var bg = this
		var item = data.item
		var pos = data.pos
		var init = data.init
		var keepPos = data.keepPos || false
		pos && item.setPosition(pos);
		if (keepPos) {
			changeFather({
				item: item,
				father: bg.add_node
			})
		} else {
			safeAdd(bg.add_node, item)
		}
		init && init(item);
	}

	bg.reInit = function() {
		var bg = this
		item_lh.counter = null
		for (var i = 0; i < move1List.length; i++) {
			var initem = move1List[i]
			initem.setPositionX(initem.rootPos.x)
		}
		if(bg.link && bg.link.linkMoveList){
			var list = bg.link.linkMoveList
			for (var i = 0; i < list.length; i++) {
				var initem = list[i]
				initem.setPositionX(initem.rootPos.x)
			}
		}
		item_arrdeco.setPosition(item_arrdeco.rootPos)
		bg.judgeLimit = null
	}

	bg.back = function(none) {
		var dis = item_lh.counter || 0
		var bg = this
		setOff(bg, cc.p(-dis, 0))
		if(!none){
			for (var i = 0; i < move1List.length; i++) {
				var initem = move1List[i]
				setOff(initem, cc.p(dis, 0))
			}
			if(bg.link && bg.link.linkMoveList){
				var list = bg.link.linkMoveList
				for (var i = 0; i < list.length; i++) {
					var initem = list[i]
					setOff(initem, cc.p(dis, 0))
				}
			}
		}
		item_lh.counter = null
	}
    var btnRect = cc.rect(0,0,item_lh.width,item_lh.height)
	if(cc.sys.isNative){
	   btnRect = cc.rect(0,-10,item_lh.width+20,item_lh.height+30)
	}
	bg.itemBegan = function(){
		var bg = this
        var item = bg.item_lh
		if (item.counter == null) {
		   item.counter = 0
		}
	}
	bg.itemMove = function(delta,isMu){
		var bg = this
        var item = bg.item_lh
		if (bg.maxF >= 0) {
			var add1 = 0
			var add2 = 0
			var tempCount = item.counter + delta.x
			var final = null
			if (tempCount > bg.maxF) {
				final = bg.maxF
			} else if (tempCount < 0) {
				final = 0
			} else {
				final = tempCount
			}
			if(!isMu){
				final = 0
			}
			
			if (final != tempCount) {
				add1 = final - item.counter
				add2 = delta.x - add1
			} else {
				add1 = delta.x
			}
			item.counter += add1;
            
            if(isMu){
	            for (var i = 0; i < move1List.length; i++) {
					var initem = move1List[i]
					initem.setPositionX(initem.rootPos.x - item.counter)
				}

				if(bg.link && bg.link.linkMoveList){
					var list = bg.link.linkMoveList
					for (var i = 0; i < list.length; i++) {
						var initem = list[i]
						initem.setPositionX(initem.rootPos.x - item.counter)
					}
				}
            }
			bg.x += add1;
			if(bg.limit){
				var max = bg.limit[1]
				var min = bg.limit[0]
				if(bg.judgeLimit == null){
					bg.judgeLimit = 0
				}

				var temp = bg.judgeLimit + add2;
				(temp > max) && (temp = max);
				(temp < min) && (temp = min);
				add2 = temp - bg.judgeLimit;
				bg.judgeLimit = temp;
				bg.x += add2;
			}else{
				bg.x += add2;
			}
			//cc.log("add1", add1, "add2", add2)
		} else {
			cc.log("maxF has not seted,please set")
		}
	}
	createTouchEvent({
		item: item_lh,
		rect:btnRect,
		begin: function(data) {
			var item = data.item
			bg.itemBegan()
			var result = getLoopVis(item)
			if (result) {
				bg.showDrag(false)
				touchFun && touchFun(bg)
			}
			return result
		},
		move: function(data) {
			var delta = data.delta
			bg.itemMove(delta,true)
			// var item = data.item
			
			// if (bg.maxF >= 0) {
			// 	var tempCount = item.counter + delta.x
			// 	var final = null
			// 	if (tempCount > bg.maxF) {
			// 		final = bg.maxF
			// 	} else if (tempCount < 0) {
			// 		final = 0
			// 	} else {
			// 		final = tempCount
			// 	}
			// 	var add1 = 0
			// 	var add2 = 0
			// 	if (final != tempCount) {
			// 		add1 = final - item.counter
			// 		add2 = delta.x - add1
			// 	} else {
			// 		add1 = delta.x
			// 	}
			// 	item.counter += add1;

			// 	for (var i = 0; i < move1List.length; i++) {
			// 		var initem = move1List[i]
			// 		initem.setPositionX(initem.rootPos.x - item.counter)
			// 	}

			// 	if(bg.link && bg.link.linkMoveList){
			// 		var list = bg.link.linkMoveList
			// 		for (var i = 0; i < list.length; i++) {
			// 			var initem = list[i]
			// 			initem.setPositionX(initem.rootPos.x - item.counter)
			// 		}
			// 	}

			// 	bg.x += add1;
			// 	if(bg.limit){
			// 		var max = bg.limit[1]
			// 		var min = bg.limit[0]
			// 		if(bg.judgeLimit == null){
			// 			bg.judgeLimit = 0
			// 		}

			// 		var temp = bg.judgeLimit + add2;
			// 		(temp > max) && (temp = max);
			// 		(temp < min) && (temp = min);
			// 		add2 = temp - bg.judgeLimit;
			// 		bg.judgeLimit = temp;
			// 		bg.x += add2;
			// 	}else{
			// 		bg.x += add2;
			// 	}
			// 	//cc.log("add1", add1, "add2", add2)
			// } else {
			// 	cc.log("maxF has not seted,please set")
			// }
		},
		end: function(data) {
			backFun && backFun(bg)
		}
	})

	limit && bg.setLimit(limit);

	return bg
}

function createPlanet(data) {
	data = data || {}
	var radiu = data.radiu || 36
	var tri = data.tri || "right"
	var type = data.type || "moon"
	var time = data.time || 5
	var sp = new cc.Sprite(res.img_mooncover)
	setSize({
		item: sp,
		width: radiu,
		height: radiu,
	})
	var clip = new cc.ClippingNode(sp)
	clip.setAlphaThreshold(0)
	var inMov = null
	switch (type) {
		case "moon":
			inMov = new cc.Sprite(res.img_moonloop)
			break
		case "sun":
			inMov = new cc.Sprite(res.img_sunloop)
			break
	}
	inMov.tri = tri
	var size = inMov.getContentSize()
	switch (tri) {
		case "left":
			inMov.setAnchorPoint(0, 0.5)
			inMov.setPositionX(-radiu / 2)
			inMov.rootPos = -radiu / 2
			inMov.final = -(size.width - radiu / 2)
			break
		case "right":
			inMov.setAnchorPoint(1, 0.5)
			inMov.setPositionX(radiu / 2)
			inMov.rootPos = radiu / 2
			inMov.final = (size.width - radiu / 2)
			break
	}
	inMov.getNextX = function() {
		var item = this
		var tri = item.tri
		var size = inMov.getContentSize()
		switch (tri) {
			case "left":
				item.setPositionX(-(size.width + item.x))
				break
			case "right":
				item.setPositionX(size.width - item.x)
				break
		}
	}
	inMov.time = time
	inMov.run = function(judge) {
		var item = this
		judge = judge || false
		item.stopAllActions()
		if (!judge) {
			item.getNextX()
		}
		addShowType({
			item: item,
			show: "moveTo",
			buf: cc.p(item.final, item.y),
			time: item.time,
			fun: function(item) {
				item.run()
			}
		})
	}
	inMov.run(true)
	safeAdd(clip, inMov)
	return clip
}

function createXwj(data) {
	data = data || {}
	var pos = data.pos
	var showTeach = data.showTeach || false //是否教学模式 默认即可
	var fgjIndex = data.fgjIndex || 10 //反光镜的初始index 默认即可
	var showPos = data.showPos || getMiddle(-200, 0) //展示镜的位置
	var zhqFun = data.zhqFun //转换器的回调
	var fgjFun = data.fgjFun //反光镜完成的回调
	var ypjFun = data.ypjFun //压片夹完成的回调
	var judgeLxFun = data.judgeLxFun //判断是否已压住载玻片
	var judgeCountFun = data.judgeCountFun //判断是否两个旋转都有进行
	var linkTeach = data.linkTeach
	var radius = data.radius || 40
	var handList = [
		"hand1",
		"hand2",
		"hand3",
	]
	var zhqList = [8, 18]
	var itemList = [
		"item_jt",
		"item_zhq",
		"item_wj",
		"item_zwt",
		"item_zgq",
		"item_tgk",
		"item_fgj",
		"item_mj",
		"item_czjlx",
		"item_xzjlx",
		"item_jb",
		"item_yp2",
		"item_yp1",
		"item_jzhu",
		"item_jzuo",
		"item_zhqr",
		//"show",
		"judge",
	]
	var maxRadiu = radius
	addKey("XWJ 1 ")
	var bg = loadNode(res.item_xwj, itemList, "bg")
	if (pos) {
		bg.setPosition(pos)
	}
	addKey("XWJ 2 ")
	bg.curIndex = 1
	bg.curRate = 5
	loadList(bg, handList)
	bg.setChangeRate = function(rate) { //修改换图的角度间隔 默认为5°
		rate = rate || 5
		var bg = this
		bg.curRate = rate
	}
	bg.addItem = function(data) { //添加载玻片函数
		var item = data.item
		var pos = data.pos
		var scale = data.scale //绝对比例 无视父节点
		var fun = data.fun
		var result = judgeItemCrash({
			item1: bg.judge,
			item2: item,
		})
		if (result) {
			if (pos != null) {
				item.setPosition(pos)
			}
			safeAdd(bg.judge, item)
			if (scale != null) {
				setFinalScale({
					item: item,
					scale: scale
				})
			}
			bg.hasZBP = true
			if (fun) {
				fun()
			}
		}
		return result
	}
	bg.getNextIndex = function() {
		var bg = this
		var index = bg.curIndex
		if (index >= zhqList[0] && index < zhqList[1]) {
			index = zhqList[1]
		} else {
			index = zhqList[0]
		}
		return index
	}
	bg.setFile = function(data) { //设置需要模糊的图片
		var bg = this
		var tex = data.tex
		var scale = data.scale || 1.0
		data.scale = scale
		bg.fileData = data
		if (!bg.item_see) {
			cc.log("you should getSee first then you can set the file")
			return null
		}
		if (!bg.curZhq) {
			cc.log("转换器没好呀")
			return null
		}
		var file = bg.inFile

		var radiu = bg.getFinalRadiu()
		var judgeVis = true
		if (radiu > maxRadiu) {
			judgeVis = false
			radiu = maxRadiu
		}
		if (!file || (file && file.tex != tex)) {
			if (file) {
				file.removeFromParent(true)
				bg.inFile = null
			}
			var inFile = createBlur({
				img: tex,
				radiu: radiu,
			})
			safeAdd(bg.item_see.clip, inFile)
			setFinalScale({
				item: inFile,
				scale: scale,
			})
			inFile.setVisible(judgeVis)
			bg.inFile = inFile
			inFile.tex = tex
		} else {
			file.changeRadiu(radiu)
			file.setVisible(judgeVis)
		}
	}
	bg.setBgColor = function(color) { //设置背景颜色
		var bg = this
		bg.bgColor = color
		if (bg.item_see) {
			var see = bg.item_see
			if (see.inBg) {
				var inBg = see.inBg
				inBg.setBackGroundColor(color)
			}
		}
	}
	bg.getSee = function(data) { //获取视图框
		var bg = this
		data = data || {}
		var pos = data.pos || showPos
		var ifMove = data.ifMove || false
		var scale = data.scale || 0.8
		if (!bg.item_see) {
			var see = new cc.Sprite(res.xwj_bg1)
			bg.item_see = see
			see.setScale(scale)
			var size = see.getContentSize()

			var inBg = createLayout({
				size: size,
				op: 255,
				color: bg.bgColor || cc.color(127, 127, 127, 255),
			})
			inBg.setPosition(-size.width / 2, -size.height / 2)
			inBg.setLocalZOrder(-1)
			see.inBg = inBg


			var inClip = new cc.Sprite(res.xwj_bg2)
			inClip.setScale(0.9)
			var clip = new cc.ClippingNode(inClip)
			clip.setLocalZOrder(-1)
			clip.setPosition(size.width / 2, size.height / 2)
			clip.setAlphaThreshold(0)
			safeAdd(see, clip)
			see.clip = clip

			safeAdd(clip, inBg)

			if (ifMove) {
				addMoving(see, true, true)
			}
		}
		var see = bg.item_see
		see.setPosition(pos)
		return see
	}
	bg.getNextZhqAction = function(fun) {
		var bg = this
		var frame = "xwj_zd_%02d.png"
		var index = bg.getNextIndex()
		var pastIndex = bg.curIndex
		var action = null
		if (index > pastIndex) {
			action = createAnimation({
				frame: frame,
				start: pastIndex,
				end: index,
				time: 1 / 24,
				fun: function() {
					bg.curIndex = index
					bg.curZhq = index == 8 ? "db" : "gb"
					if (fun) {
						fun()
					}
				}
			})
		} else {
			action = cc.sequence(
				createAnimation({
					frame: frame,
					start: pastIndex,
					end: 26,
					time: 1 / 24,
				}),
				createAnimation({
					frame: frame,
					start: 1,
					end: index,
					time: 1 / 24,
					fun: function() {
						bg.curIndex = index
						bg.curZhq = index == 8 ? "db" : "gb"
						if (fun) {
							fun()
						}
					}
				})
			)
		}
		return action
	}
	var limit = [-6, 80]
	var moveList = [
		"item_mj",
		"item_jt",
		"item_zhqr",
	]
	bg.showUpTip = function() {
		if (!bg.showTip2) {
			bg.showTip2 = true
			AddDialog("Tips", {
				res: "xwj_tip2.png",
				face: 2,
				type: ccui.Widget.PLIST_TEXTURE,
				closeBack: function() {
					bg.showTip2 = false
				}
			})
		}
	}
	bg.up = function(dis) {
		var bg = this
		if (dis == null || dis == NaN) {
			return null
		}
		var temp = bg.rootHeight + dis
		if (temp > limit[1]) {
			temp = limit[1]
				//bg.showTip2()
		}
		if (temp < limit[0]) {
			temp = limit[0]
			bg.showUpTip()
		}
		bg.rootHeight = temp
		for (var i = 0; i < moveList.length; i++) {
			var item = bg[moveList[i]]
			item.setPositionY(item.rootY + temp)
		}
	}
	var zhqInfoList = [
		[-3, 5],
		[-4, 6]
	]

	bg.setMax = function(max) {
		maxRadiu = max
	}
	bg.getFinalRadiu = function() {
		var bg = this
		if (!bg.finishZHQ && !bg.curZhq) {
			cc.log("转换器没好呀")
			return null
		}
		var index = bg.curZhq == "db" ? 0 : 1
		var info = zhqInfoList[index]
		var finalRadiu = Math.abs(bg.rootHeight - info[0]) * info[1]
		return finalRadiu
	}
	bg.showHand = function(judge) {
		var bg = this
		for (var i = 0; i < handList.length; i++) {
			bg[handList[i]].setVisible(judge)
		}
		if (!judge && cc.sys.isNative && !showTeach) {
			if (bg.item_czjlx) {
				bg.item_czjlx.setVisible(true)
				if (bg.item_czjlx.draw) {
					bg.item_czjlx.draw.setVisible(true)
				}
			}
			if (bg.item_xzjlx) {
				bg.item_xzjlx.setVisible(true)
				if (bg.item_xzjlx.draw) {
					bg.item_xzjlx.draw.setVisible(true)
				}
			}
		}
	}
	bg.init = function() {
		var bg = this
		bg.rootHeight = 0
		bg.setBgColor(cc.color(127, 127, 127, 255)) //初始默认灰色
		for (var i = 0; i < moveList.length; i++) {
			var inItem = bg[moveList[i]]
			inItem.rootY = inItem.getPositionY()
		}
		bg.item_zhq.setVisible(showTeach)
		bg.item_wj.setVisible(showTeach)
		bg.item_zhqr.setVisible(!showTeach)
			//bg.show.setVisible(showTeach)
		bg.item_czjlx.rotate = bg.item_czjlx.getChildByName("rotate")
		bg.item_xzjlx.rotate = bg.item_xzjlx.getChildByName("rotate")
		bg.item_czjlx.rotate.setVisible(false)
		bg.item_xzjlx.rotate.setVisible(false)
		bg.showHand(!showTeach)

		if (!showTeach) {
			createTouchEvent({
				item: bg.item_fgj,
				begin: function(data) {
					if (bg.finishZHQ && !bg.finishFGJ) {
						return true
					} else {
						if (!bg.showTip1 && !bg.finishFGJ) {
							bg.showTip1 = true
							AddDialog("Tips", {
								res: "xwj_tip1.png",
								face: 2,
								type: ccui.Widget.PLIST_TEXTURE,
								closeBack: function() {
									bg.showTip1 = false
								}
							})
						}
						return false
					}
				},
				end: function(data) {
					var item = data.item
					if (!item.showIng) {
						item.showIng = true
						item.runAction(createAnimation({
							frame: "xwj_fgj_%02d.png",
							end: fgjIndex,
							time: 1 / 24,
							fun: function() {
								item.showIng = false
								bg.finishFGJ = true
									//反光后变白色
								bg.setBgColor(cc.color(230, 230, 230, 255))
								if (fgjFun) {
									fgjFun()
								}
							}
						}))
					}
				}
			})
			createTouchEvent({
				item: bg.item_zhqr,
				begin: function(data) {
					return judgeOpInPos(data)
				},
				end: function(data) {
					var item = data.item
					if (!item.showIng) {
						item.showIng = true
						item.runAction(bg.getNextZhqAction(function() {
							item.showIng = false
							bg.finishZHQ = true
							if (zhqFun) {
								zhqFun(bg.curZhq)
							}
							if (bg.zhqTips) {
								var tip = bg.zhqTips
								tip.setSpriteFrame(bg.curZhq == "db" ? "xwj_item_31.png" : "xwj_item_33.png")
							}
							if (cc.sys.isNative) {
								if (!bg.nativeTips) {
									var sp = new cc.Sprite()
									safeAdd(bg, sp)
									sp.setPosition(31, 210)
									bg.nativeTips = sp
								}
								var tip = bg.nativeTips
								tip.setSpriteFrame(bg.curZhq == "db" ? "xwj_item_31.png" : "xwj_item_33.png")
								tip.stopAllActions()
								tip.setOpacity(255)
								addShowType({
									item: tip,
									show: "fadeOut",
									time: 0.5,
									delay: 0.5,
								})
							}
						}))
					}
				}
			})
			var judgeRect = createLayout({
				size: cc.size(20, 30),
				op: 0,
			})
			judgeRect.setLocalZOrder(-1)
			judgeRect.setPosition(80, 168)
			safeAdd(bg, judgeRect)
			changeFather({
				item: judgeRect,
				father: bg.item_jt,
			})
			addMouseHover({
				item: judgeRect,
				disOp: true,
				infun: function() {
					if (bg.curZhq) {
						if (!bg.zhqTips) {
							var tips = new cc.Sprite()
							tips.setPosition(31, 210)
							safeAdd(bg, tips)
							bg.zhqTips = tips
						}
						var tip = bg.zhqTips
						tip.setSpriteFrame(bg.curZhq == "db" ? "xwj_item_31.png" : "xwj_item_33.png")
						tip.setVisible(true)
					}
				},
				outfun: function() {
					if (bg.zhqTips) {
						bg.zhqTips.setVisible(false)
					}
				},
			})
			createTouchEvent({
				item: bg.item_yp1,
				begin: function(data) {
					if (bg.hasZBP) {
						return judgeOpInPos(data)
					}
					return false
				},
				end: function(data) {
					var item = data.item
					if (!bg.finishYP1) {
						bg.finishYP1 = true
						item.runAction(createAnimation({
							frame: "xwj_yp1_%02d.png",
							end: 6,
							time: 1 / 24,
							fun: function() {
								if (bg.finishYP1 && bg.finishYP2) {
									if (ypjFun) {
										ypjFun()
										ypjFun = null
									}
								}
							}
						}))
					}
				}
			})
			createTouchEvent({
				item: bg.item_yp2,
				begin: function(data) {
					if (bg.hasZBP) {
						return judgeOpInPos(data)
					}
					return false
				},
				end: function(data) {
					var item = data.item
					if (!bg.finishYP2) {
						bg.finishYP2 = true
						item.runAction(createAnimation({
							frame: "xwj_yp2_%02d.png",
							end: 6,
							time: 1 / 24,
							fun: function() {
								if (bg.finishYP1 && bg.finishYP2) {
									if (ypjFun) {
										ypjFun()
										ypjFun = null
									}
								}
							}
						}))
					}
				}
			})
			var getDevideAngle = function(src, dest) {
				var dis = Math.abs(dest - src)
				var dis2 = 360 - dis
				var final = Math.min(dis, dis2)
				if (final == (dest - src)) {
					return -final
				} else {
					return final
				}
			}
			var getAngleIndex = function(angle) {
				angle = angle % 360
				if (angle < 0) {
					angle = angle + 360
				}
				var final = Math.floor(angle / 360 * 60) + 1
				if (final < 1) {
					final = 1
				}
				if (final > 60) {
					final = 60
				}
				return final
			}
			var packItem = function(data) {
				var item = data.item
				var frame = data.frame
				item.curIndex = 1
				var perDis = data.perDis
				var name = data.name
				var nativePos = data.nativePos
				var nativeScale = data.nativeScale
				if (cc.sys.isNative) {
					var temp = new cc.Sprite(item.getSpriteFrame())
					temp.setPosition(item.getPosition())
					temp.setLocalZOrder(item.getLocalZOrder())
					temp.setAnchorPoint(item.getAnchorPoint())
					safeAdd(item.getParent(), temp)
					item.setPosition(nativePos)
					item.setScale(nativeScale)
					item.setVisible(false)
					var draw = new cc.DrawNode()
					var devide = []
					var count = 10
					var first = temp.getPosition()
					var disX = (nativePos.x - first.x) / count
					var disY = (nativePos.y - first.y) / count
					for (var i = 0; i < count; i++) {
						devide[i] = cc.p(first.x + i * disX, first.y + i * disY)
					}
					for (var i = 0; i < devide.length - 1; i += 2) {
						draw.drawSegment(devide[i], devide[i + 1], 2, cc.color(255, 0, 0, 127))
					}
					safeAdd(bg, draw)
					item.draw = draw
					draw.setVisible(false)
				}
				createTouchEvent({
					item: item,
					begin: function(data) {
						var item = data.item
						item.startPos = data.pos
						item.rotate.setRotation(0)
						item.rotate.setVisible(true)
						item.devideCount = 0
						if (judgeLxFun) {
							return judgeLxFun()
						}
						return true
					},
					move: function(data) {
						var pos = data.pos
						var item = data.item
						var angle = getAngle(item.startPos, pos)
						var devide = null
						if (item.pastRotate == null) {
							item.pastRotate = angle
						} else {
							devide = getDevideAngle(item.pastRotate, angle)
							item.pastRotate = angle
						}
						if (devide == null && devide == NaN) {} else {
							item.rotate.setRotation(item.rotate.getRotationX() + devide)
							var index = getAngleIndex(item.rotate.getRotationX())
							if (index >= 1 && index <= 60 && index != NaN) {
								item.setSpriteFrame(sprintf(frame, index))
							} else {
								//cc.log(index)
								//cc.log("warning, index is not right")
							}
							//cc.log(devide)
							bg.up(devide * perDis)
							item.devideCount += devide
							if (Math.abs(item.devideCount) > bg.curRate) {
								item.devideCount = 0
								if (bg.fileData) {
									bg.setFile(bg.fileData)
								}
							}
						}
						//cc.log(devide)
					},
					end: function(data) {
						var item = data.item
						item.pastRotate = null
						item.rotate.setVisible(false)
						if (judgeCountFun) {
							judgeCountFun({
								name: name,
							})
						}
						if (bg.fileData) {
							bg.setFile(bg.fileData)
						}
					}
				})
			}
			packItem({
				item: bg.item_czjlx,
				frame: "item_czjlx_%02d.png",
				perDis: 0.02,
				name: "czjlx",
				nativePos: cc.p(280, 375),
				nativeScale: 2.5,
			})
			packItem({
				item: bg.item_xzjlx,
				frame: "xwj_xlx_%02d.png",
				perDis: 0.002,
				name: "xzjlx",
				nativePos: cc.p(297, 270),
				nativeScale: 2.5,
			})
		} else {
			var fontNums = 14
			var fontList = []
			var showList = []
			for (var i = 0; i < fontNums; i++) {
				fontList[i] = sprintf("font%d", i + 1)
				showList[i] = sprintf("show%d", i + 1)
			}
			var teach = loadNode(res.xwj_teach)
			safeAdd(bg, teach)
			loadList(teach, fontList)
			loadList(teach, showList)
			var allItemList = [
				"item_jt",
				"item_zhq",
				"item_wj",
				"item_zwt",
				"item_zgq",
				"item_tgk",
				"item_fgj",
				"item_mj",
				"item_czjlx",
				"item_xzjlx",
				"item_jb",
				"item_yp2",
				"item_yp1",
				"item_jzhu",
				"item_jzuo",
			]
			var zIndex = [
				"item_jzuo",
				"item_jb",
				"item_zgq",
				"item_zwt",
				"item_tgk",
				"item_jzhu",
				"item_fgj",
				"item_czjlx",
				"item_xzjlx",
				"item_wj",
				"item_yp2",
				"item_yp1",
				"item_zhq",
				"item_jt",
				"item_mj",
			]
			for (var i = 0; i < zIndex.length; i++) {
				var item = bg[zIndex[i]]
				item.setLocalZOrder(i + 1)
				item.pastZorder = i + 1
			}
			var clearFont = function() {
				for (var i = 0; i < fontList.length; i++) {
					teach[fontList[i]].setColor(cc.color(255, 255, 255, 255))
					teach[showList[i]].setVisible(false)
				}
			}
			var clearAll = function() {
				clearFont()
				for (var i = 0; i < allItemList.length; i++) {
					var item = bg[allItemList[i]]
					item.setOpacity(80)
					item.setLocalZOrder(item.pastZorder)
					if (item.change) {
						item.change()
					}
					reAdd(item)
				}
			}
			var packLink = function(data) {
				var fontIndex = data.index
				var link = data.link
				var font = teach[fontList[fontIndex - 1]]
				var show = teach[showList[fontIndex - 1]]
				var showFun = function() {
					clearAll()
					font.setColor(cc.color(255, 0, 0, 255))
					show.setVisible(true)
					for (var i = 0; i < link.length; i++) {
						var item = bg[link[i]]
						item.setOpacity(255)
						item.setLocalZOrder(99)
						if (item.change) {
							item.change({
								color: cc.color(255, 0, 0, 255)
							})
						} else {
							addOutLine({
								item: item,
								color: cc.color(255, 0, 0, 255)
							})
						}
						reAdd(item)
					}
				}
				createTouchEvent({
					item: font,
					end: function() {
						showFun()
						if (linkTeach) {
							linkTeach(fontIndex)
						}
					}
				})
				for (var i = 0; i < link.length; i++) {
					var item = bg[link[i]]
					createTouchEvent({
						item: item,
						begin: function(data) {
							return judgeOpInPos(data)
						},
						end: function() {
							showFun()
							if (linkTeach) {
								linkTeach(fontIndex)
							}
						}
					})
				}
			}
			var packList = [
				["item_jt"],
				["item_zhq"],
				["item_wj"],
				["item_zwt"],
				["item_zgq"],
				["item_tgk"],
				["item_fgj"],
				["item_mj"],
				["item_czjlx"],
				["item_xzjlx"],
				["item_jb"],
				["item_yp2", "item_yp1"],
				["item_jzhu"],
				["item_jzuo"],
			]
			for (var i = 0; i < packList.length; i++) {
				packLink({
					index: i + 1,
					link: packList[i],
				})
			}
			clearFont()
		}
	}
	bg.init()

	//以下是用例展示
	//  var xwj = createXwj({
	//     zhqFun: function(key) {
	//         cc.log(key)//对应的低倍和高倍
	//         var see = xwj.getSee({
	//             ifMove: true,
	//             pos: getMiddle(-300, 0),
	//             scale: 0.6,
	//         })
	//         safeAdd(self, see)
	//         //切换的时候在这里换图 内部会自动计算
	//         // xwj.setFile({
	//         //     tex: res.test_shader,
	//         //     scale: 1, //这个为绝对比例。无视父节点比例
	//         // })
	//     }
	// })
	// xwj.setPosition(getMiddle())
	// safeAdd(self, xwj)
	// xwj.showHand(false)
	// var zbp = new cc.Sprite(res.item_zbp)
	// zbp.setPosition(getMiddle(150, 0))
	// safeAdd(self, zbp)
	// createTouchEvent({
	//     item: zbp,
	//     autoMove: true,
	//     end: function(data) {
	//         var item = data.item
	//         xwj.addItem({
	//             item: item,
	//             pos: cc.p(30, 30),//放在载物台上的位置
	//             scale: 1.0,
	//             fun:function(){
	//                 removeMoving(zbp)
	//             }//成功的回调
	//         })
	//     }
	// })
	return bg
}

function createHL(data) {
	var uilist = [
		"item_hl",
		"left",
		"right",
		"item_gz",
		"hand",
		"judge",
	]
	var pos = data.pos || getMiddle()
	var father = data.father
	var length = data.length
	var getLeft = data.getLeft
	var getRight = data.getRight
	var fun = data.fun
	var seg = data.seg || 1.5
	var nums = data.nums || 50
	var color = data.color || cc.color(255, 255, 0, 255)
	if (!father) {
		cc.log("father is needed")
		return null
	}
	if (!length) {
		cc.log("line is needed to create hl")
		return null
	}
	if (!getLeft || !getRight) {
		cc.log("left or right fun is needed to get the pos to draw")
		return null
	}
	var bg = loadNode(res.item_hl, uilist, "bg")

	var left = bg.left
	var right = bg.right
	var gz = bg.item_gz
	gz.setVisible(false)
	var hand = bg.hand
	bg.init = function() {
		var bg = this
		hand.setVisible(false)
		if (pos) {
			bg.setPosition(pos)
		}
		safeAdd(father, bg)
		var leftDraw = new cc.DrawNode()
		leftDraw.fun = getLeft
		safeAdd(left, leftDraw)
		var rightDraw = new cc.DrawNode()
		rightDraw.fun = getRight
		safeAdd(right, rightDraw)
		bg.leftDraw = leftDraw
		bg.rightDraw = rightDraw
		bg.draw()
	}

	bg.showHand = function(judge) {
		var bg = this
		bg.hand.setVisible(judge)
	}

	bg.getHandPos = function() {
		var bg = this
		return getWorldPos(bg.hand)
	}

	bg.addItem = function(data) {
		var bg = this
		var item = data.item
		var height = data.height
		var modify = data.modify
		var limit = data.limit
		var right = bg.right
		var pos = getWorldPos(right)
		bg.item = item
		if (item.getParent()) {
			var par = item.getParent()
			item.setPosition(par.convertToNodeSpace(cc.p(pos.x + modify.x, pos.y + height + modify.y)))
		}
		for (var i = 0; i < limit.length; i++) {
			if (limit[i] == null) {
				limit[i] = bg.getInDis(0)
			}
		}
		bg.limit = limit
		cc.log(limit)
	}
	bg.reRight = function(tri, dis) {
		var bg = this
		if (bg.item) {
			var pastDis = bg.getInDis(0)
			var limit = bg.limit
			switch (tri) {
				case "up":
					if (dis > limit[0]) {
						dis = limit[0]
					}
					if (pastDis < dis) {
						setOff(bg.item, cc.p(0, dis - pastDis))
						return true
					}
					break
				case "down":
					if (dis < limit[1]) {
						dis = limit[1]
					}
					if (pastDis > dis) {
						setOff(bg.item, cc.p(0, dis - pastDis))
						return true
					}
					break
			}

		}
		return false
	}

	bg.getInDis = function(key) {
		var bg = this
		var drawList = [
			bg.rightDraw,
			bg.leftDraw, //此处顺序需要调整 如果后续还有用到的话
		]
		var node = drawList[key]
		var info = node.fun(bg)
		var pos = node.convertToNodeSpace(info.pos)
		var rootPos = cc.p(0, 0)
		return getDis(rootPos, pos)
	}

	bg.reSet = function() {
		var bg = this
		var dis1 = bg.getInDis(0)
		var dis2 = bg.getInDis(1)
		var limit = bg.limit
		if (limit) {
			if (dis1 < limit[0] && (dis1 + dis2) < length) {
				bg.reRight("up", length - dis2)
			} else if (dis1 > limit[1] && (dis1 + dis2) > length) {
				bg.reRight("down", length - dis2)
			}
			var dis1 = bg.getInDis(0)
			var percent = (limit[1] - dis1) / (limit[0] - limit[1]) + 1
			if (fun) {
				fun(percent)
			}
		}
	}

	bg.draw = function(key) {
		var bg = this
		var drawList = [
			bg.rightDraw,
			bg.leftDraw, //此处顺序需要调整 如果后续还有用到的话
		]
		var curLength = length
		var canUp = false
		var canDown = false
		var limit = bg.limit

		bg.reSet()

		for (var i = 0; i < drawList.length; i++) {
			if (key != null && i != key) {
				continue
			}
			var node = drawList[i]
			var info = node.fun(bg)
			node.clear()

			var pos = node.convertToNodeSpace(info.pos)
			var type = info.type
			var rootPos = cc.p(0, 0)

			switch (type) {
				case "line":
					var dis = getDis(rootPos, pos)
					node.drawSegment(rootPos, pos, seg, color)
					curLength = curLength - dis
						// if (limit && dis < limit[0]) {
						// 	canUp = true
						// 	cc.log("can up")
						// }
						// if (limit && dis > limit[1]) {
						// 	canDown = true
						// 	cc.log("can down")
						// }
					break
				case "curve":
					var xdis = Math.abs(rootPos.x - pos.x)
					var tDis = getDis(rootPos, pos)
					if (tDis >= curLength) {
						node.drawSegment(rootPos, pos, seg, color)
						if (canDown) {
							if (bg.reRight("down", length - tDis)) {
								bg.draw()
								break
							}
						}
					} else {
						if (canUp) {
							if (bg.reRight("up", length - tDis)) {
								bg.draw()
								break
							}

						}
						var midx = pos.x / 2
						var midy = pos.y / 2
						var dis = (curLength - tDis) / 2
						var ang = Math.tan(Math.acos(xdis / tDis) / Math.PI)
						midx = midx - dis
						midy = midy - ang * dis
						node.drawQuadBezier(rootPos, cc.p(midx, midy), pos, nums, seg, color)
					}
					break
			}
		}
	}
	bg.init()
	return bg
}

function craeteThclj(data) {
	var uilist = [
		"hand",
		"gang",
		"add",
		"gou",
		"item_zz",
		"th",
		"th_end",
		"judge",
		"img_type",
	]
	var pos = data.pos || getMiddle()
	var judgeFun = data.judgeFun
	var follow = data.follow
	var limit = data.limit
	var move = data.move
	var type = data.type || "10N"
	var allForce = (type == "10N" ? 10 : 5)

	var layer = data.layer
	if (!layer) {
		cc.log("layer is need to create thclj")
		return null
	}
	var fdjRoot = data.fdjRoot || 0.3
	var fdj = createFDJ({
		father: layer,
		hidebtn: false,
		rootScale: fdjRoot,
	})

	var createTH = function() {
		var bg = loadNode(res.item_thclj, uilist, "bg")
		var hand = data.hand || false
		var scale = data.scale || 0.4
		var th = bg.th
		var th_end = bg.th_end
		bg.limit = limit

		bg.img_type.setSpriteFrame(type == "10N" ? "thclj_11.png" : "thclj_10.png")

		var inCreateTH = function(data) {
			data = data || {}
			var nums = data.nums || 20
			var width = data.width || 10
			var length = data.length
			var seg = data.seg || 1
			if (!length) {
				cc.log("need length to create th")
				return null
			}
			var pos = data.pos || cc.p(0, 0)
			var base = (length / nums)
			var addJudge = 0
			var list = []
			for (var i = 0; i <= nums; i++) {
				if (i == 0 || i == nums) {
					list[list.length] = cc.p(0, addJudge)
				} else {
					list[list.length] = cc.p(i % 2 ? -width : width, addJudge)
				}
				addJudge -= base;
			}
			var inRoot = data.root || new cc.Node()
			if (!inRoot.drawList) {
				inRoot.drawList = []
				for (var i = 0; i < list.length - 1; i++) {
					var sp = null
					if (i % 2) {
						sp = new cc.Sprite("#thclj_08.png")
						sp.setLocalZOrder(2)
					} else {
						sp = new cc.Sprite("#thclj_09.png")
						sp.setLocalZOrder(1)
					}
					inRoot.drawList[i] = sp
					sp.setAnchorPoint(0, 0.5)
					sp.setPosition(list[i])
					safeAdd(inRoot, sp)
					sp.setRotation(360 - getAngle(list[i], list[i + 1]))
					var dis = getDis(list[i], list[i + 1])
					setSize({
						item: sp,
						width: dis,
					})
				}
			} else {
				var inList = inRoot.drawList
				for (var i = 0; i < list.length - 1; i++) {
					var draw = inList[i]
					if (draw) {
						draw.setPosition(list[i])
						var angle = getAngle(list[i], list[i + 1])
						draw.setRotation(360 - angle)
						var dis = getDis(list[i], list[i + 1])
						setSize({
							item: draw,
							width: dis,
						})
					}
				}
			}
			return inRoot
		}

		bg.getDistance = function() {
			var bg = this
			var p1 = getWorldPos(bg.th)
			var p2 = getWorldPos(bg.th_end)
			var dis = Math.abs(p1.y - p2.y) / getLoopScale(bg, true).y / bg.scale
			return dis
		}

		bg.init = function() {
			var bg = this
			bg.hand.setVisible(hand)
			if (pos) {
				bg.setPosition(pos)
				bg._rootPos = pos
			}
			var inTh = inCreateTH({
				length: bg.getDistance(),
				nums: 40,
				width: 18,
				seg: 2,
			})
			safeAdd(th, inTh)
			th.draw = inTh
			var zz = bg.item_zz
			bg.inTh = inTh
			zz.rootPos = zz.getPosition()
			inTh.refresh = function() {
				var draw = this
				draw = inCreateTH({
					length: bg.getDistance(),
					nums: 40,
					width: 18,
					root: draw,
					seg: 2,
				})
			}

			bg.setScale(scale)
		}
		bg.init()

		return bg
	}
	var rate = 465
	var inDevide = null
	fdj.createNew({
		key: "th",
		fun: createTH,
		outfun: function(item) {
			var outItem = item
			var zz = item.item_zz
			var inTh = item.inTh
			var hand = item.hand

			item.setLimit = function(limit) {
				var item = this
				if (limit[0] == null) {
					limit[0] = item.getPositionY()
				}
				if (limit[1] == null) {
					limit[1] = item.getPositionY()
				}
				item.limit = limit
			}

			createTouchEvent({
				item: hand,
				begin: function(data) {
					var inJudge = true
					if (judgeFun) {
						inJudge = judgeFun()
					}
					return inJudge && data.item.isVisible()
				},
				move: function(data) {
					var delta = data.delta
					var tempy = outItem.y + delta.y
					if (item.limit) {
						var limit = item.limit
						var max = limit[0]
						var min = limit[1]
						if (max && tempy > max) {
							tempy = max
						}
						if (min && tempy < min) {
							tempy = min
						}
					}
					outItem.y = tempy
					outItem.linkFun(function(data) {
						var item = data.item
						item.y = outItem.y
					})
					if (follow) {
						outItem.follow()
					}
					if (move) {
						move()
					}
				}
			})

			item.reSet = function() {
				var node = this
				var zz = node.item_zz
				var gang = node.gang
				var inTh = node.inTh
				if (!gang._rootPos) {
					gang._rootPos = gang.getPosition()
				}
				if (!zz._rootPos) {
					zz._rootPos = zz.getPosition()
				}
				if (node._rootPos) {
					node.setPosition(node._rootPos)
				}
				zz.setPositionY(zz._rootPos.y)
				gang.setPositionY(gang._rootPos.y)
				inTh.refresh()
				node.linkFun(function(data) {
					var item = data.item
					var inZz = item.item_zz
					var inTh = item.inTh
					var inGang = item.gang
					if (item._rootPos) {
						item.setPosition(item._rootPos)
					}
					inZz.y = zz.y
					inGang.setPositionY(gang.y)
					inTh.refresh()
				})
				node.item = null
			}

			item.getAddPoint = function() {
				var item = this
				var add = item.add
				if (add) {
					return getWorldPos(add)
				}
			}

			item.follow = function() {
				var item = this
				var zz = item.item_zz
				fdj.setGet(getWorldPos(zz))
				fdj.see[0].setVisible(true)
			}

			item.setForce = function(force) {
				var node = this
				var zz = node.item_zz
				var gang = node.gang
				var inTh = node.inTh
				if (force < 0) {
					cc.log("force should be larger than 0")
					return null
				}
				var h = force / allForce * rate
				if (!gang._rootPos) {
					gang._rootPos = gang.getPosition()
				}
				if (!zz._rootPos) {
					zz._rootPos = zz.getPosition()
				}
				zz.setPositionY(zz._rootPos.y - h)
				gang.setPositionY(gang._rootPos.y - h)
				inTh.refresh()
				node.linkFun(function(data) {
					var item = data.item
					var inZz = item.item_zz
					var inTh = item.inTh
					var inGang = item.gang
					inZz.y = zz.y
					inGang.setPositionY(gang.y)
					inTh.refresh()
				})
			}

			item.addItem = function(data) {
				var node = this
				var add = node.add
				var item = data.item
				var pos = data.pos
				var init = data.init
				var force = data.force
				if (!force) {
					cc.log("force is needed to add item")
					return null
				}
				node.setForce(force)
				if (pos) {
					item.setPosition(pos)
				}
				safeAdd(add, item)
				if (init) {
					init(item)
				}
			}

			inDevide = outItem.getContentSize().height * getLoopScale(outItem, true).y * outItem.getScaleY() / 2
				//cc.log(inDevide)
			createTouchEvent({
				item: zz,
				move: function(data) {
					var inItem = data.item
					var delta = data.delta
					inItem.y += delta.y
					inTh.refresh()
					outItem.linkFun(function(data) {
						var item = data.item
						var zz = item.item_zz
						var inTh = item.inTh
						zz.y = inItem.y
						inTh.refresh()
					})
				},
				end: function(data) {
					inTh.refresh()
					var item = data.item
					outItem.linkFun(function(data) {
						var item = data.item
						var inTh = item.inTh
						inTh.refresh()
					})
				}
			})
		}
	})
	var outTh = fdj.getOut("th")
	fdj.actMove({
		judgeGet: function(data) {
			var index = data.index
			var item = data.item
			var delta = data.delta
			var pos = item.getPositionY() + delta.y
			var top = outTh.y + inDevide
			var bottom = outTh.y - inDevide
				//cc.log(pos, top, bottom)
			if (pos > top) {
				pos = top
			}
			if (pos < bottom) {
				pos = bottom
			}
			delta.x = 0
			delta.y = pos - item.getPositionY()
			return delta
		},
	})
	fdj.see[0].setVisible(false)
	fdj.get[0].setVisible(true)
		//fdj.get[0]._rootPos = pos

	fdj.setGet(pos)
	createTouchEvent({
		item: fdj.see[0],
		begin: function(data) {
			return data.item.isVisible()
		},
		autoMove: true,
	})

	return {
		fdj: fdj,
		th: outTh,
	}
}

function createCqt(data) {
	var uilist = [
		"item_lg",
		"item_hand",
		"font",
		"judge",
	]
	data = data || {}
	var noFont = data.noFont || false
	var flip = data.flip || false
	var scale = data.scale || 1
	var callJudge = data.callJudge || 100
	var fun = data.fun
	var cqt = loadNode(res.item_cqt, uilist, flip ? "item_cqt2" : "item_cqt1")
	cqt.start = function() {
		cqt.canJudge = true
	}
	cqt.init = function() {
		var cqt = this
		var item_lg = cqt.item_lg
		var item_hand = cqt.item_hand
		item_hand.setVisible(false)
		item_lg.setLocalZOrder(-1)
		reAdd(item_lg)
		var font = cqt.font
		font.setVisible(!noFont)
		cqt.setScale(scale)
		item_lg.rootPos = item_lg.getPositionX()
		var dis = 100
		var countDis = 0
		createTouchEvent({
			item: item_hand,
			begin: function(data) {
				var item = data.item
				item.setVisible(true)
				return true
			},
			move: function(data) {
				var delta = data.delta
				var tx = item_lg.x + delta.x

				var buf = [item_lg.rootPos, item_lg.rootPos + dis]
				if (flip) {
					buf = [item_lg.rootPos - dis, item_lg.rootPos]
				}
				if (tx < buf[0]) {
					tx = buf[0]
				}
				if (tx > buf[1]) {
					tx = buf[1]
				}
				if (flip) {
					if (tx > item_lg.x) {
						if (cqt.canJudge) {
							countDis += (tx - item_lg.x)
						}
					}
				} else {
					if (tx < item_lg.x) {
						if (cqt.canJudge) {
							countDis += (item_lg.x - tx)
						}
					}
				}
				item_lg.x = tx
				if (countDis > callJudge) {
					if (fun) {
						fun()
					}
					countDis -= callJudge
				}
			},
			end: function(data) {
				var item = data.item
				item.setVisible(false)
			}
		})
	}
	cqt.init()
	return cqt
}

function createBoat(data) {
	data = data || {}
	var fileNums = 26
	var uilist = [
		"back",
		"front",
		"head",
		"mouse",
	]
	var boat = loadNode(res.item_boat, uilist, "boat")
	boat.act = function(data) {
		data = data || {}
		var boat = this
		var time = data.time || (1 / 24)
		boat.back.runAction(cc.repeatForever(createAnimation({
			ifFile: true,
			frame: "boat1_%02d",
			end: 26,
			time: time,
		})))
		boat.front.runAction(cc.repeatForever(createAnimation({
			ifFile: true,
			frame: "boat2_%02d",
			end: 26,
			time: time,
		})))
	}
	boat.say = function(judge) {
		if (judge) {
			boat.mouse.runAction(cc.repeatForever(
				createAnimation({
					frame: "father_mouse_%02d.png",
					end: 5,
					time: 1 / 24,
				})
			))
		} else {
			boat.mouse.stopAllActions()
			boat.mouse.setSpriteFrame("father_mouse_01.png")
		}
	}
	boat.addItem = function(item) {
		var boat = this
		safeAdd(boat.back, item)
	}
	boat.inPause = function() {
		var boat = this
		boat.back.pause()
		boat.front.pause()
	}
	boat.inResume = function() {
		var boat = this
		boat.back.resume()
		boat.front.resume()
	}
	boat.inStop = function() {
		var boat = this
		boat.back.stopAllActions()
		boat.front.stopAllActions()
		boat.back.setTexture(res.boat1_01)
		boat.front.setTexture(res.boat2_01)
	}
	return boat
}

function createShuiGang(data) {
	data = data || {}
	var height = data.height || 100
	var addWide = data.addWide || 0
	var uilist = [
		"water_top",
		"water_back",
		"node_inside",
		"water_front",
		"water",
		"deco"
	]

	var sg = loadNode(res.item_shuigang, uilist, "bg")
	sg.water.retain()
	var frame = sg.water.getSpriteFrame()

	if (addWide) {
		sg.width = sg.width + addWide
		setOff(sg.water_top, cc.p(addWide / 2, 0))
		sg.water_back.width = sg.water_back.width + addWide
		sg.water_front.width = sg.water_front.width + addWide
		setOff(sg.deco, cc.p(addWide / 2, 0))
		sg.deco.width = sg.deco.width + addWide
		setSize({
			item: sg.water,
			width: sg.water.width + addWide,
		})
		setOff(sg.water, cc.p(addWide / 2, 0))
	}

	var judgeRect = createLayout({
		size: cc.size(415 + addWide, 256),
		op: 0,
	})
	judgeRect.setPosition(16.82, 12)
		//addMoving(sg.water, true, true)
	safeAdd(sg, judgeRect)
	sg.judgeRect = judgeRect

	var getClip = function(height) {
		var clip = new cc.Sprite(frame)
		clip.setAnchorPoint(sg.water.getAnchorPoint())
		clip.setPosition(sg.water.getPosition())
		sg.water_top.setScaleX(0.98)
		sg.judgeWater = sg.water
		if (addWide) {
			setSize({
					item: clip,
					width: clip.width + addWide,
					height: height,
				})
				//setOff(clip, cc.p(addWide / 2, 0))
		} else {
			setSize({
				item: clip,
				height: height,
			})
		}
		return clip
	}

	sg.setHeight = function(height) {
		var clip = getClip(height)
		sg.water.removeFromParent(false)
		if (sg.clipNode) {
			sg.clipNode.removeFromParent(true)
			sg.clipNode = null
		}
		var clipNode = new cc.ClippingNode(clip)
		clipNode.setAlphaThreshold(0)
		sg.clipNode = clipNode
		safeAdd(sg, clipNode)
		safeAdd(clipNode, sg.water)
		sg.inHeight = height
		var front = sg.water_front
		var par = front.getParent()
		var backJudge = false
		if (par && par != sg.water_top) {
			changeFather({
				item: front,
				father: sg.water_top,
			})
			backJudge = true
		}
		sg.water_top.setPositionY(height + 25)
		if (backJudge) {
			changeFather({
				item: front,
				father: par,
			})
		}
	}

	sg.act = function(data) {
		var height = data.height
		var devide = data.devide || 1
		var time = data.time || 0.5
		if (height < sg.inHeight) {
			devide = -devide
		}
		var dis = Math.abs(time / (sg.inHeight - height))
		var devideTime = dis / devide
		if (height != sg.inHeight) {
			//cc.log(height, sg.inHeight, devide, devideTime)
			addTimer({
				fun: function(key) {
					if ((devide < 0 && sg.inHeight > height) || (devide > 0 && sg.inHeight < height)) {
						sg.inHeight += devide
						sg.setHeight(sg.inHeight)
					} else {
						removeTimer(key)
					}
				},
				time: devideTime,
				repeat: cc.REPEAT_FOREVER,
			})
		}
	}

	sg.addItem = function(data) {
		var item = data.item
		var pos = sg.node_inside.convertToNodeSpace(getWorldPos(item))
		item.setPosition(pos)
		safeAdd(sg.node_inside, item)
	}

	sg.setHeight(height)

	//sg.deco.setVisible(false)
	return sg
}

function createStaticFDJ(data) {
	var pos = data.pos
	var insideScale = data.insideScale
	var judgeFun = data.judgeFun
	var father = data.father
	var rootNode = new cc.Node()

	var cover = new cc.Sprite(res.img_fdj_back4_cover)
	var bg = new cc.Sprite(res.img_fdj4)
	var handle = new cc.Sprite(res.fdj_hand)
	var clipNode = new cc.Sprite(res.img_fdj_back4)
	var inside = new cc.ClippingNode(clipNode)
	inside.setAlphaThreshold(0)
	var size = bg.getContentSize()
	handle.setScale(3.0)
	safeAdd(bg, handle)
	handle.setPosition(260, -16)
	bg.setAnchorPoint(0.5, 0.5)
	cover.setAnchorPoint(0.5, 0.5)
	clipNode.setAnchorPoint(0.5, 0.5)


	var insideNode = new cc.Node()
	insideNode.setAnchorPoint(0, 0)
	insideNode.setPosition(0, 0)
	safeAdd(inside, insideNode)

	safeAdd(rootNode, cover)
	safeAdd(rootNode, inside)
	safeAdd(rootNode, bg)
	rootNode.setMoveItem = function(item) {
		if (item) {
			rootNode.moveData = get4Pos(item)
				//cc.log(rootNode.moveData)
		}
	}
	rootNode.addItem = function(item) {
		item.setPosition(getWorldPos(item))
		safeAdd(insideNode, item)
	}
	rootNode.setInsideScale = function(scale) {
		insideNode.setScale(scale)
	}
	rootNode.setOutsideScale = function(scale) {
		clipNode.setScale(scale)
		bg.setScale(scale)
		cover.setScale(scale)
	}
	rootNode.setPos = function(pos) {
		rootNode.setPosition(pos)
		insideNode.setPosition(cc.p((-pos.x) * insideNode.getScale(), (-pos.y) * insideNode.getScale()))
	}
	rootNode.move = function(delta) {
		var pos = cc.p(rootNode.x + delta.x, rootNode.y + delta.y)
		if (rootNode.moveData) {
			var info = rootNode.moveData
			if (pos.x > info.right) {
				pos.x = info.right
			}
			if (pos.x < info.left) {
				pos.x = info.left
			}
			if (pos.y > info.top) {
				pos.y = info.top
			}
			if (pos.y < info.bottom) {
				pos.y = info.bottom
			}
		}
		rootNode.setPos(pos)
	}
	createTouchEvent({
		item: bg,
		begin: function(data) {
			if (judgeFun) {
				return judgeFun(rootNode)
			}
			return true
		},
		move: function(data) {
			var delta = data.delta
			rootNode.move(delta)
		}
	})
	createTouchEvent({
		item: handle,
		begin: function(data) {
			if (judgeFun) {
				return judgeFun(rootNode)
			}
			return true
		},
		move: function(data) {
			var delta = data.delta
			rootNode.move(delta)
		}
	})
	if (insideScale != null) {
		rootNode.setInsideScale(insideScale)
	}
	if (pos) {
		rootNode.setPos(pos)
	}
	return rootNode
}

function createZKZ(data) { //创建真空罩
	var uilist = [
		"item_z",
		"item_cqk",
		"item_cqt",
		"item_lg",
		"item_hand",
		"item_qf",
		"item_kqhl",
		"addNode",
	]

	var bg = loadNode(res.item_zkz, uilist, "bg")
	var alarmList = [
		["zkz", 6, cc.p(40, 0)],
		["qf", 13, cc.p(70, 0)],
		["cqtSet", 16, cc.p(40, 0)],
		["cqtOut", 9, cc.p(40, 0)],
		["noGas", 18, cc.p(0, 0)]
	]
	bg.showAlarm = function(key) {
		for (var i = 0; i < alarmList.length; i++) {
			if (alarmList[i][0] == key) {
				AddDialog("Tips", {
					res: sprintf("zkz_%02d.png", alarmList[i][1]),
					face: 2,
					modify: alarmList[i][2],
					type: ccui.Widget.PLIST_TEXTURE,
				})
			}
		}
	}
	bg.isReady = function() {
		return !bg.qfOpen && bg.cqtSetOk && bg.zkzSetOk
	}
	bg.init = function() {
		var zorderList = [
			bg.item_lg,
		]
		for (var i = 0; i < zorderList.length; i++) {
			zorderList[i].setLocalZOrder(-1)
		}
		var rootPosList = [
			bg.item_z,
			bg.item_cqt,
			bg.item_lg,
		]
		for (var i = 0; i < rootPosList.length; i++) {
			rootPosList[i].rootPos = rootPosList[i].getPosition()
		}

		setOff(bg.item_cqt, cc.p(100, 0))
		setOff(bg.item_z, cc.p(0, 80))
		bg.item_z.limit = 400
		bg.item_z.judge = 30
		bg.item_cqt.limit = 460
		bg.item_cqt.judge = 13
		bg.item_lg.limit = 200
		bg.item_hand.setVisible(false)
		bg.percent = 1

		createTouchEvent({
			item: bg.item_qf,
			begin: function(data) {
				if (!bg.zkzSetOk) {
					bg.showAlarm("zkz")
					return false
				}
				return true
			},
			end: function(data) {
				var item = data.item
				bg.qfOpen = !bg.qfOpen
				item.setSpriteFrame(bg.qfOpen ? "zkz_20.png" : "zkz_21.png")
				item.getChildByName("deco").setSpriteFrame(bg.qfOpen ? "zkz_07.png" : "zkz_11.png")
				bg.showAir({
					type: "qf",
					keep: bg.qfOpen,
					modify: !bg.qfOpen ? 0 : 0.05,
					show: bg.qfOpen,
				})
			}
		})
		createTouchEvent({
			item: bg.item_z,
			begin: function(data) {
				if (bg.cqtSetOk) {
					bg.showAlarm("cqtOut")
					return false
				}
				return true
			},
			move: function(data) {
				var delta = data.delta
				var item = data.item
				var pos = item.getPosition()
				pos.y += delta.y
				if (pos.y > item.limit) {
					pos.y = item.limit
				}
				if (pos.y < item.rootPos.y) {
					pos.y = item.rootPos.y
				}
				item.y = pos.y
				if (item.y != item.rootPos.y) {
					bg.zkzSetOk = false
					bg.airChange(1)
				}
			},
			end: function(data) {
				var item = data.item
				var pos = item.getPosition()
				if (pos.y >= item.rootPos.y && pos.y <= item.rootPos.y + item.judge) {
					item.setPosition(item.rootPos)
					bg.zkzSetOk = true
				} else {
					bg.zkzSetOk = false
				}
				//cc.log("zkz", bg.zkzSetOk)
			}
		})
		createTouchEvent({
			item: bg.item_cqt,
			begin: function(data) {
				if (!bg.zkzSetOk) {
					bg.showAlarm("zkz")
					return false
				}
				return true
			},
			move: function(data) {
				var delta = data.delta
				var item = data.item
				var pos = item.getPosition()
				pos.x += delta.x
				if (pos.x > item.limit) {
					pos.x = item.limit
				}
				if (pos.x < item.rootPos.x) {
					pos.x = item.rootPos.x
				}
				item.x = pos.x
				var pos = item.getPosition()
				if (pos.x >= item.rootPos.x && pos.x <= item.rootPos.x + item.judge) {
					bg.cqtSetOk = true
				} else {
					bg.cqtSetOk = false
				}
				bg.showAir({
					type: "cqk",
					keep: !bg.cqtSetOk,
					modify: bg.cqtSetOk ? 0 : 0.05,
					show: !bg.cqtSetOk,
				})
			},
			end: function(data) {
				var item = data.item
				var pos = item.getPosition()
				if (pos.x >= item.rootPos.x && pos.x <= item.rootPos.x + item.judge) {
					item.setPosition(item.rootPos)
					bg.cqtSetOk = true
				} else {
					bg.cqtSetOk = false
				}
			}
		})
		createTouchEvent({
			item: bg.item_hand,
			begin: function(data) {
				var item = data.item
				if (!bg.zkzSetOk) {
					bg.showAlarm("zkz")
					return false
				}
				if (!bg.cqtSetOk) {
					bg.showAlarm("cqtSet")
					return false
				}
				if (bg.qfOpen) {
					bg.showAlarm("qf")
					return false
				}
				if (bg.percent <= 0) {
					return false
				}
				item.setVisible(true)
				return true
			},
			move: function(data) {
				var delta = data.delta
				var item = bg.item_lg
				var pos = item.getPosition()
				if (bg.percent <= 0) {
					data.item.setVisible(false)
					return
				}
				pos.x += delta.x
				if (pos.x > item.limit) {
					pos.x = item.limit
				}
				if (pos.x < item.rootPos.x) {
					pos.x = item.rootPos.x
				}
				var currentMove = pos.x - item.x
				item.x = pos.x
				if (currentMove > 0) {
					var modify = -currentMove / 1000 * (bg.percent + 0.05)
					bg.showAir({
						type: "cqt",
						modify: modify,
					})
				}
			},
			end: function(data) {
				var item = data.item
				item.setVisible(false)
			}
		})

		bg.qfOpen = true
		bg.cqtSetOk = false
		bg.zkzSetOk = false

		var draw = new cc.DrawNode()
		draw.drawRect(cc.p(0, 0), cc.p(240, 35), cc.color(0, 0, 0, 0), 1, cc.color(255, 0, 0, 255))
		draw.setPosition(400, 270)
		var rect = new cc.DrawNode()
		rect.drawRect(cc.p(0, 0), cc.p(240, 35), cc.color(255, 153, 0, 255), 1, cc.color(255, 0, 0, 255))
		safeAdd(draw, rect)
		safeAdd(bg, draw)
		bg.rect = rect
	}

	bg.showAir = function(data) {
		var modify = data.modify
		var type = data.type
		var show = data.show
		var keep = data.keep
		if (bg.percent != null && bg.rect) {
			var list = [14, 8, 19]
			var curAir = null
			var curPars = null

			var ani = function() {
				var inAni = cc.repeatForever(createAnimation({
					frame: "zkz_%02d.png",
					list: list,
					time: 0.1,
				}))
				return inAni
			}
			switch (type) {
				case "cqt":
					if (!bg.cqtAir) {
						var air = new cc.Sprite()
						air.runAction(ani())
						safeAdd(bg.addNode, air)
						air.setPosition(280, -13)
						bg.cqtAir = air
					}
					curPars = (-modify * 10)
					curAir = bg.cqtAir
					addShowType({
						item: curAir,
						show: "fadeOut",
						time: 0.5 + curPars,
					})
					curAir.setScale(0.5 + curPars)
					curAir.setVisible(true)
					break
				case "qf":
					if (!bg.qfAir) {
						var air = new cc.Sprite()
						air.runAction(ani())
						safeAdd(bg.addNode, air)
						air.setPosition(-63, 54)
						bg.qfAir = air
					}
					curPars = 0.5
					curAir = bg.qfAir
					break
				case "cqk":
					if (!bg.cqkAir) {
						var air = new cc.Sprite()
						air.runAction(ani())
						safeAdd(bg.addNode, air)
						air.setPosition(53, 49)
						bg.cqkAir = air
					}
					curPars = 0.5
					curAir = bg.cqkAir
					break
			}
			if (show != null) {
				curAir.setVisible(show)
			}
			var key = sprintf("ZKZ_AIR_%s", type)
			if (keep) {
				if (bg.percent >= 1) {
					curAir.setVisible(false)
				}
				if (!checkTimer(key)) {
					addTimer({
						fun: function() {
							bg.airChange(modify)
							if (bg.percent >= 1) {
								curAir.setVisible(false)
								removeTimer(key)
							}
						},
						time: 0.15,
						repeat: cc.REPEAT_FOREVER,
						key: key,
					})
				}
			} else {
				removeTimer(key)
				bg.airChange(modify)
				if (bg.percent >= 1 || bg.percent <= 0) {
					curAir.setVisible(false)
				}
				if (type == "cqt" && bg.percent == 0) {
					bg.showAlarm("noGas")
				}
			}
		}
	}

	bg.airChange = function(modify) {
		bg.percent = bg.percent + modify
		if (bg.percent < 0) {
			bg.percent = 0
		}
		if (bg.percent > 1) {
			bg.percent = 1
		}
		var rect = bg.rect
		rect.clear()
		rect.drawRect(cc.p(0, 0), cc.p(240 * bg.percent, 35), cc.color(255, 153, 0, 255), 1, cc.color(255, 0, 0, 255))
	}

	bg.addItem = function(item) {
		var bg = this
		safeAdd(bg.addNode, item)
	}

	bg.getAirPercent = function() {
		if (bg.percent != null) {
			return bg.percent
		}
		return 1
	}
	bg.init()
	return bg
}

function createSYJ(data) {
	var pos = data.pos || getMiddle()
	var type = data.type || "green"
	var music = data.music
	var uilist = [
		"red",
		"green"
	]
	var insideList = [
		"pause_btn",
		"play_btn",
		"s1",
		"s2"
	]
	loadPlist("syj_music")
	var bg = loadNode(res.item_syj, uilist, type, true)
	loadList(bg, insideList)

	bg.setMusic = function(key) {
		var bg = this
		bg.music = key
	}

	bg.change = function(force) {
		var bg = this
		if (force != null) {
			bg.ifPlay = force
		} else {
			bg.ifPlay = !bg.ifPlay
		}
		var ifPlay = bg.ifPlay
		bg.pause_btn.setVisible(ifPlay)
		bg.play_btn.setVisible(!ifPlay)
		if (ifPlay) {
			if (bg.music) {
				cc.log(bg.music)
				playMusic(bg.music, false)
				addTimer({
					fun: function() {
						if (judgeMusic(bg.music)) {
							removeTimer(bg.key)
							bg.change(false)
						}
					},
					time: 0.1,
					repeat: cc.REPEAT_FOREVER,
					key: bg.key,
				})
			}
		} else {
			if (force == null) {
				stopMusic()
			}
		}
		bg.showRy(ifPlay)
	}

	bg.showRy = function(judge) {
		var bg = this
		if (!bg.ry) {
			var ry = new cc.Sprite()
			ry.setPosition(120, 240)
			ry.setLocalZOrder(-1)
			safeAdd(bg, ry)
			bg.ry = ry
		}
		bg.ry.stopAllActions()
		bg.ry.setVisible(judge)
		bg.shake(judge)
		if (judge) {
			bg.ry.runAction(cc.repeatForever(createAnimation({
				frame: "syj_music_%02d.png",
				end: 25,
				time: 0.05,
			})))
		}
	}

	bg.shake = function(judge) {
		var bg = this
		var list = [
			bg.s1,
			bg.s2
		]
		var bufs = [
			cc.p(-2, 0),
			cc.p(3, 0)
		]
		for (var i = 0; i < list.length; i++) {
			list[i].stopAllActions()
			list[i].setPosition(list[i].rootPos)
			if (judge) {
				addShowType({
					item: list[i],
					show: "shakeF",
					time: 0.1,
					buf: bufs[i]
				})
				addShowType({
					item: list[i],
					show: "scaleLoop",
					time: 0.1,
					buf: {
						from: 0.9,
						to: 1.1,
					},
					repeat: cc.REPEAT_FOREVER,
				})
			}
		}
	}

	bg.init = function() {
		var bg = this
		bg.pause_btn.setVisible(false)
		bg.ifPlay = false
		bg.s1.rootPos = bg.s1.getPosition()
		bg.s2.rootPos = bg.s2.getPosition()
		bg.key = sprintf("music_%s", type)
		if (music) {
			bg.setMusic(music)
		}
		createTouchEvent({
			item: bg.pause_btn,
			begin: function(data) {
				bg.change()
				return true
			}
		})
	}
	bg.init()
	bg.setPosition(pos)
	return bg
}

function createShaobei(data) {
	data = data || {}
	var hot = data.hot || false
	var tri = data.tri || "left"
	var height = data.height
	var bgList = []
	bgList[0] = tri == "left" ? "bgl" : "bgr"

	var bg = loadNode(res.item_shaobei, bgList, bgList[0])

	var uilist = [
		"water",
		"back",
		"judge",
		"blb",
		"judgeAll",
	]

	loadList(bg, uilist)

	bg.water.setLocalZOrder(-2)
	bg.back.setLocalZOrder(-2)
	bg.blb.setLocalZOrder(-1)
	bg.blb.setVisible(false)
	bg.setWater = function(high) {
		bg.water.height = high
	}
	if (height) {
		bg.setWater(height)
	}
	bg.judgePos = function(pos) {
		return judgeInside({
			item: bg.judge,
			pos: pos,
		})
	}
	bg.jiaoBan = function(data) {
		data = data || {}
		var time = data.time || 0.05
		var blb = data.blb || false
		loadPlist("sbjb")
		if (!bg.nodeJb) {
			var sp = new cc.Sprite("#sbjb_01.png")
			bg.nodeJb = sp
			sp.setAnchorPoint(0.5, 0)
			var waterSize = bg.water.getContentSize()
			sp.setPosition(waterSize.width / 2, 0)
			switch (tri) {
				case "left":
					sp.setScale(0.65)
					break
				case "right":
					setSize({
						item: sp,
						width: waterSize.width,
						height: waterSize.height * 1.1,
					})
					break
			}
			bg.water.addChild(sp)
		}
		bg.nodeJb.setVisible(true)
		bg.nodeJb.stopAllActions()
		bg.nodeJb.runAction(cc.repeatForever(createAnimation({
			frame: "sbjb_%02d.png",
			end: 66,
			time: time,
		})))
		if (blb) {
			var bl = bg.blb
			bl.setRotation(0)
			bl.stopAllActions()
			bl.setVisible(true)
			addShowType({
				item: bl,
				show: "rotateLoop",
				time: time * 5,
				buf: 35,
			})
		}
	}
	bg.stopJiaoBan = function() {
		if (bg.nodeJb) {
			bg.nodeJb.stopAllActions()
			bg.nodeJb.setVisible(false)
		}
		bg.blb.stopAllActions()
		bg.blb.setVisible(false)
	}
	if (hot) {
		var air = createWaterAir()
		air.setLocalZOrder(-1)
		air.setScale(0.7)
		var water = bg.water
		air.setPosition(water.width / 2 - 10, water.height + 10)
		safeAdd(water, air)
		bg.air = air
	}
	return bg
}

function createJXMB() { //机械秒表
	var uilist = [
		"btn_start",
		"btn_pause",
		"hand",
		"pos_start"
	]
	var bg = loadNode(res.item_jxmb, uilist, "bg")
	bg.hand.setVisible(false)
	bg.btn_start.setLocalZOrder(-1)
	bg.pos_start.setLocalZOrder(-1)
	bg.mySetString = function(string) {
		if (bg.fonts && string.length == 5) {
			for (var i = 0; i < 5; i++) {
				bg.fonts[i].setString(string[i])
			}
		} else {
			cc.log("something wrong")
		}
	}
	bg.actHand = function() {
		bg.hand.setVisible(true)
		bg.hand.setPosition(bg.pos_start.getPosition())
		setOff(bg.hand, cc.p(50, 50))
		addShowType({
			item: bg.hand,
			time: 0.3,
			show: "moveBy",
			buf: cc.p(-50, -50)
		})
		addShowType({
			item: bg.hand,
			time: 0.3,
			show: "fadeIn",
			fun: function(item) {
				addShowType({
					item: bg.hand,
					time: 0.3,
					show: "moveBy",
					buf: cc.p(50, 50)
				})
				addShowType({
					item: bg.hand,
					time: 0.3,
					show: "fadeOut",
				})
			}
		})
	}
	bg.actBtn = function() {
		addShowType({
			item: bg.btn_start,
			delay: 0.25,
			time: 0.05,
			show: "moveBy",
			buf: cc.p(0, -10),
			fun: function(item) {
				addShowType({
					item: item,
					show: "moveBy",
					time: 0.05,
					buf: cc.p(0, 10)
				})
			}
		})
	}
	bg.start = function(data) {
		data = data || {}
		var ifHand = data.ifHand
		if (ifHand == null) {
			ifHand = true
		}
		if (ifHand) {
			bg.actHand()
		}
		bg.actBtn()
		if (!bg.fonts) {
			bg.fonts = []
			for (var i = 0; i < 5; i++) {
				var font = new cc.LabelBMFont("", res.counterfnt)
				font.setPosition(27 + i * 10.5, 51.59)
				font.setScale(0.75)
				font.setAnchorPoint(0.5, 0)
				safeAdd(bg, font)
				bg.fonts[i] = font
			}
			bg.curTime = 0
			bg.mySetString("00:00")
		}
		bg.key = getRandKey()
		addTimer({
			fun: function() {
				bg.curTime++
					var min = Math.floor(bg.curTime / 60)
				if (min > 99) {
					min = 0
					bg.curTime = 0
				}
				var sec = (bg.curTime % 60)
				bg.mySetString(sprintf("%02d:%02d", min, sec))
			},
			time: 1,
			repeat: cc.REPEAT_FOREVER,
			key: bg.key,
		})
	}
	bg.end = function(data) {
		data = data || {}
		var ifHand = data.ifHand
		if (ifHand == null) {
			ifHand = true
		}
		if (ifHand) {
			bg.actHand()
		}
		bg.actBtn()
		removeTimer(bg.key)
	}
	return bg
}

function createSelector(data) { //创建选择窗口
	var bg = data.bg // new cc.Scale9Sprite(res.bg_ruler, cc.rect(0, 0, 23, 24), cc.rect(5, 5, 10, 10))
	var list = data.list
	var numLines = data.numLines
	var size = data.size
	var border = data.border
	var closeModify = data.closeModify || cc.p(0, 0)
	var posModify = data.posModify || cc.p(0, 0)
	var selectFun = data.selectFun
	var result = null
	if (bg && list && numLines && size && border) {
		var count = 0
		for (var i = 0; i < numLines.length; i++) {
			count += numLines[i]
		}
		if (count == list.length) {
			result = bg
			bg.width = size.width
			bg.height = size.height
			bg.setAnchorPoint(0.5, 0.5)

			var divHeight = (size.height - border.y * 2) / numLines.length
			for (var i = 0, count = 0; i < numLines.length; i++) {
				var divWidth = (size.width - border.x * 2) / numLines[i]
				for (var j = 0; j < numLines[i]; j++) {
					var img = new cc.Sprite(list[count + j])
					img.index = count + j
					img.setAnchorPoint(0, 0)
					img.setPosition(border.x + divWidth * j + posModify.x, size.height - border.y - divHeight * (i + 1) + posModify.y)
					safeAdd(bg, img)

					createTouchEvent({
						item: img,
						end: function(data) {
							var item = data.item
							if (selectFun) {
								selectFun({
									item: item,
									tex: list[item.index],
									index: index,
									pos: data.pos,
								})
							}
						}
					})
				}
				count += numLines[i]
			}
			bg.isShow = false
			bg.show = function() {
				if (!bg.showing) {
					if (!bg.isShow) {
						bg.setPosition(getMiddle())
					}
					bg.setLocalZOrder(LOCAL_ORDER++)
					reAdd(bg)
					bg.showing = true
					addShowType({
						item: bg,
						show: bg.isShow ? "zoom" : "scale",
						time: 0.3,
						fun: function(bg) {
							bg.showing = false
							bg.isShow = !bg.isShow
							if (bg.isShow) {
								createTouchEvent({
									item: bg,
									begin: function(data) {
										var bg = data.item
										bg.setLocalZOrder(LOCAL_ORDER++)
										reAdd(bg)
										return true
									},
									autoMove: true,
								})
							} else {
								if (bg.removeListen) {
									bg.removeListen()
									bg.removeListen = null
								}
							}
						}
					})
				}
			}
			var btn = new ccui.Button(res.btn_result_quit_normal, res.btn_result_quit_select)
			btn.setAnchorPoint(0.5, 0.5)
			btn.setPosition(size.width - border.x + closeModify.x, size.height - border.y + closeModify.y)
			btn.setScale(0.7)
			bg.addChild(btn)
			btn.addClickEventListener(function() {
				bg.show()
			})
		} else {
			cc.log("numLines don't match the list length")
		}
	} else {
		cc.log("wrong pars", bg, list, numLines, size, border)
	}
	return result
}

function createPaper(data) {
	//创建白纸
	var data = data || {}
	var width = data.width || 100
	var height = data.height || 140 //A4尺寸
	var border = data.border || 10 //边缘尺寸
	var pixel = data.pixel || 10 //方格尺寸
	var color = data.color || cc.color(255, 255, 255, 255) //默认白纸
	var pixelColor = data.pixelColor || cc.color(0, 0, 0, 255) //黑色方格
	var seg = data.seg || 0.5
	var fontSize = data.fontSize || 7
	var fontColor = data.fontColor || cc.color(0, 0, 0, 255)
	var fontModify = data.fontModify || cc.p(5, 2)
	var changeFun = data.changeFun
	var rate = data.rate
	var judgeChange = data.judgeChange
	if (rate) {
		width *= rate
		height *= rate
		border *= rate
		pixel *= rate
		seg *= rate
		fontSize *= rate
		fontModify.x *= rate
		fontModify.y *= rate
	}
	var inModify = data.inModify || cc.p(0, border / 3)
	var run = function() {
		var sp = new cc.Sprite()
		sp.width = width
		sp.height = height
		var draw = new cc.DrawNode()
		draw.drawRect(cc.p(-width / 2, -height / 2), cc.p(width / 2, height / 2), color)
		draw.createPixel = function() {
			var inNode = new cc.DrawNode()
			for (var x = border; x <= width - border; x += pixel) {
				inNode.drawSegment(cc.p(x, border), cc.p(x, height - border), seg, pixelColor)
			}
			for (var y = border; y <= height - border; y += pixel) {
				inNode.drawSegment(cc.p(border, y), cc.p(width - border, y), seg, pixelColor)
			}
			inNode.setPosition(cc.p(-width / 2 + inModify.x, -height / 2 + inModify.y))
			draw.addChild(inNode)
		}

		draw.changePage = function(index) {
			draw.curPage = index || draw.curPage
			if (!draw.page) {
				var page = new cc.LabelTTF("", null, fontSize)
				page.setAnchorPoint(0, 0)
				page.setPosition(-width / 2 + fontModify.x, -height / 2 + fontModify.y)
				page.setColor(fontColor)
				draw.addChild(page)
				draw.page = page
			}
			draw.page.setString(sprintf("第%d页", draw.curPage))
			if (draw.pre) {
				draw.pre.setVisible(draw.curPage != 1)
			}
			if (sp.indexList && sp.itemList) {
				for (var i = 0; i < sp.indexList.length; i++) {
					var judgeIndex = sp.indexList[i]
					var item = sp.itemList[judgeIndex]
					if (item) {
						item.setVisible(judgeIndex == index)
					}
				}
			}
			if (changeFun) {
				changeFun()
			}
		}

		draw.initPage = function() {

			var createBtn = function(key) {
				var font = ""
				var pos = cc.p(width / 2 - fontModify.x, -height / 2 + fontModify.y)
				var needPass = false
				switch (key) {
					case "next":
						font = "下一页"
						break
					case "pre":
						font = "上一页"
						needPass = true
						break
				}
				var item = new cc.LabelTTF(font, null, fontSize)
				if (needPass) {
					pos.x = pos.x - item.getContentSize().width - 25
				}
				item.setPosition(pos)
				item.setAnchorPoint(1, 0)
				item.setColor(fontColor)
				draw.addChild(item)
				item.key = key

				createTouchEvent({
					item: item,
					begin: function(data) {
						var item = data.item
						var judge = true
						if (judgeChange) {
							judge = judgeChange()
						}
						if (item.isVisible() && judge) {
							switch (item.key) {
								case "next":
									draw.changePage(draw.curPage + 1)
									break
								case "pre":
									draw.changePage(draw.curPage - 1)
									break
							}
						}
						return true
					}
				})
				draw[key] = item
			}
			createBtn("next")
			createBtn("pre")
			draw.changePage()
		}

		draw.curPage = 1
		draw.createPixel()
		draw.initPage()
		draw.setPosition(width / 2, height / 2)
		safeAdd(sp, draw)

		sp.judgeItem = function() {
			return (sp.itemList && sp.itemList[draw.curPage])
		}

		sp.addItem = function(item) {
			if (!sp.itemList) {
				sp.itemList = []
				sp.indexList = []
			}
			if (!sp.itemList[draw.curPage]) {
				sp.itemList[draw.curPage] = item
				sp.indexList[sp.indexList.length] = draw.curPage
				safeAdd(sp, item)
			} else {
				cc.log("page already has things")
			}
		}

		return sp
	}
	return run()
}

function createWatch() { //创建秒表 秒表主要都是自管理
	var ui_list = [ //对应json中的item名字
		"watch_start",
		"watch_stop",
		"watch_second",
		"watch_minute",
		"item_stop_red",
		"item_start_red",
		"item_fzkd_red",
		"watch_second_red",
		"item_mzkd_red",
		"watch_minute_red",
		"font_resume",
		"arrow_resume",
		"font_start",
		"arrow_start",
		"bg_teach",
		"judge_stop",
	]
	var moveY = 10
	var node = loadNode(res.watch, ui_list, "bg")
	node.redKey = [
		"qdb",
		"fwb",
		"mz",
		"fz",
		"fzkd",
		"mzkd",
	]
	node.redList = [ //用于演示用的红线框 默认不显示
		"item_start_red",
		"item_stop_red",
		"watch_second_red",
		"watch_minute_red",
		"item_mzkd_red",
		"item_fzkd_red",
	]

	node.judgeList = [
		"item_start_red",
		"judge_stop",
		"watch_second_red",
		"watch_minute_red",
		"item_mzkd_red",
		"item_fzkd_red",
	]

	node.changeTeach = function(data) { //演示红线
		var item = data.father
		var modify = data.modify || cc.p(0, 0)
		var scale = data.scale || 1
		if (item && item.addChild) {
			node.bg_teach.retain()
			var pos = node.bg_teach.getParent().convertToWorldSpace(node.bg_teach.getPosition())
			node.bg_teach.removeFromParent(false)
			item.addChild(node.bg_teach)
			pos = item.convertToNodeSpace(pos)
			node.bg_teach.setPosition(cc.p(pos.x + modify.x, pos.y + modify.y))
			node.bg_teach.setScale(scale)
			node.bg_teach.release()
		}
		return node.bg_teach
	}
	node.showRed = function(key) {
		var node = this
		for (var i = 0; i < node.redKey.length; i++) {
			if (key == node.redKey[i]) {
				node[node.redList[i]].setVisible(true)
			} else {
				node[node.redList[i]].setVisible(false)
			}
		}
	}
	node.setGuideFunc = function(key, buf, fun) { //设置演示回调
		if (key && fun) {
			node[sprintf("guideBuf%s", key)] = buf
			node[sprintf("guideFunc%s", key)] = fun

			var result = null
			for (var i = 0; i < node.redKey.length; i++) {
				if (key == node.redKey[i]) {
					result = i
					break
				}
			}
			var temp = node[node.judgeList[result]]
			temp.myName = node.redKey[result]
			createTouchEvent({
				item: temp,
				begin: function(data) {
					var item = data.item
					if (!node.hasClick) {
						node.hasClick = true
						var fun = node[sprintf("guideFunc%s", item.myName)]
						var buf = node[sprintf("guideBuf%s", item.myName)]
						if (fun) {
							fun(buf)
						}
						return true
					}
					return false
				},
				end: function(data) {
					node.hasClick = false
				}
			})

		}
	}
	node.init = function() {
		node.watch_start.rootY = node.watch_start.getPositionY()
		node.watch_stop.rootY = node.watch_stop.getPositionY()
		node.watch_second.rootRotate = node.watch_second.getRotationX()
		node.watch_minute.rootRotate = node.watch_minute.getRotationX()
		node.font_resume.setVisible(false)
		node.arrow_resume.setVisible(false)
		node.font_start.setVisible(false)
		node.arrow_start.setVisible(false)
		node.item_stop_red.setLocalZOrder(-1)
		node.item_start_red.setLocalZOrder(-1)
		node.watch_start.setLocalZOrder(1)
		node.watch_stop.setLocalZOrder(1)
		node.judge_stop.setVisible(false)
		node.judge_stop.setLocalZOrder(999)

		addShowType({
			item: node.arrow_resume,
			show: "moveBackForever",
			time: 0.3,
			buf: cc.p(0, -10),
		})
		addShowType({
			item: node.arrow_start,
			show: "moveBackForever",
			time: 0.3,
			buf: cc.p(0, -10),
		})
		var list = [
			"item_stop_red",
			"item_start_red",
			"item_fzkd_red",
			"watch_second_red",
			"item_mzkd_red",
			"watch_minute_red",
		]
		for (var i = 0; i < list.length; i++) {
			node[list[i]].setVisible(false)
		}
	}
	node.init()

	node.setTime = function(time) { //设置当前秒表时间
		node.changeStatus("stop")
		node.watch_second.setRotation(time % 30 / 30 * 360 + node.watch_second.rootRotate)
		node.watch_minute.setRotation(time / 60 / 15 * 360 + node.watch_minute.rootRotate)
	}
	node.getTime = function() { //获取当前秒表时间
		var rotateMin = node.watch_minute.getRotationX() - node.watch_minute.rootRotate
		var rotateSec = node.watch_second.getRotationX() - node.watch_second.rootRotate
		var minus = Math.floor(rotateMin % 360 / (360 / 30))
		var second = rotateSec % 360 / 360 * 30
		return minus * 30 + second
	}
	node.changeStatus = function(statu, teachData) {
		var node = this
		for (var i = 0; i < node.status.length; i++) {
			if (statu == node.status[i][0]) {
				node.statu = statu
				node.status[i][1](teachData)
				return
			}
		}
	}
	node.showTeach = function(statu, inout) {
		inout = inout || false
		var item = null
		var font = null
		switch (statu) {
			case "stop":
				item = node.arrow_resume
				font = node.font_resume
				break
			case "start":
				item = node.arrow_start
				font = node.font_start
				break
		}
		if (item) {
			item.setVisible(inout)
		}
		if (font) {
			font.setVisible(inout)
		}
	}
	node.stop = function(teachData) {
		var tempClear = function() {
			removeTimer("TEACH_STOP")
			removeTimer("TEACH_STOP_BEFORE")
			node.watch_second.stopAllActions()
			node.watch_minute.stopAllActions()
			node.watch_second.setRotation(node.watch_second.rootRotate)
			node.watch_minute.setRotation(node.watch_minute.rootRotate)
			node.showTeach("stop", false)
		}
		if (teachData) {
			var time = teachData.time
			var afterFun = teachData.afterFun
			var beforeFun = teachData.beforeFun
			var delay = teachData.delay || 0.1
			var judgeFun = teachData.judgeFun || function() {
				return true
			}
			var item = node.watch_stop
			if (judgeFun()) {
				removeTimer("TEACH_STOP")
				removeTimer("TEACH_STOP_BEFORE")
				node.showTeach("stop", true)
				addTimer({
					fun: function() {
						if (judgeFun()) {
							removeTimer("TEACH_STOP_BEFORE")
							node.watch_second.stopAllActions()
							node.watch_minute.stopAllActions()
							node.watch_second.setRotation(node.watch_second.rootRotate)
							node.watch_minute.setRotation(node.watch_minute.rootRotate)
							item.y = item.rootY - moveY
							if (beforeFun) {
								beforeFun()
							}
							addTimer({
								fun: function() {
									if (judgeFun()) {
										removeTimer("TEACH_STOP")
										item.y = item.rootY
										if (afterFun) {
											afterFun()
										}
										node.showTeach("stop", false)
									} else {
										tempClear()
									}
								},
								time: time,
								repeat: 1,
								key: "TEACH_STOP",
							})
						} else {
							tempClear()
						}
					},
					time: delay,
					repeat: 1,
					key: "TEACH_STOP_BEFORE",
				})
			} else {
				tempClear()
			}
		} else {
			tempClear()
		}
	}

	node.showClick = function(data) { //演示按下
		var statu = data.statu
		var time = data.time
		var fun = data.fun
		var item = null
		var backFun = null
		var beforeFun = null
		switch (statu) {
			case "stop":
				item = node.watch_stop
				beforeFun = node.clickStopBefore
				BackFun = node.clickStopBack
				break
			case "start":
			case "pause":
				item = node.watch_start
				beforeFun = node.clickStartBefore
				BackFun = node.clickStartBack
				break
		}
		removeTimer("SHOWCLICK")
		if (beforeFun) {
			beforeFun()
		}
		node.changeStatus(statu)
		item.y = item.rootY - moveY
		addTimer({
			fun: function() {
				removeTimer("SHOWCLICK")
				if (BackFun) {
					BackFun()
				}
				if (fun) {
					fun()
				}
				item.y = item.rootY
			},
			repeat: 0,
			key: "SHOWCLICK",
			time: time,
		})
	}

	node.start = function(teachData) {
		var tempClear = function() {
			removeTimer("TEACH_START")
			removeTimer("TEACH_START_BEFORE")
			addShowType({
				item: node.watch_second,
				show: "circle",
				time: 30,
			})
			addShowType({
				item: node.watch_minute,
				show: "circle",
				time: 15 * 60,
			})
			node.showTeach("start", false)
		}
		if (teachData) {
			var time = teachData.time
			var afterFun = teachData.afterFun
			var beforeFun = teachData.beforeFun
			var delay = teachData.delay || 0.1
			var judgeFun = teachData.judgeFun || function() {
				return true
			}
			var item = node.watch_start
			if (judgeFun()) {
				removeTimer("TEACH_START_BEFORE")
				removeTimer("TEACH_START")
				node.showTeach("start", true)
				addTimer({
					fun: function() {
						if (judgeFun()) {
							removeTimer("TEACH_START_BEFORE")
							addShowType({
								item: node.watch_second,
								show: "circle",
								time: 30,
							})
							addShowType({
								item: node.watch_minute,
								show: "circle",
								time: 15 * 60,
							})

							item.y = item.rootY - moveY
							if (beforeFun) {
								beforeFun()
							}
							addTimer({
								fun: function() {
									if (judgeFun()) {
										removeTimer("TEACH_START")
										item.y = item.rootY
										if (afterFun) {
											afterFun()
										}
										node.showTeach("start", false)
									} else {
										tempClear()
									}
								},
								time: time,
								repeat: 0,
								key: "TEACH_START",
							})
						} else {
							tempClear()
						}
					},
					time: delay,
					repeat: 0,
					key: "TEACH_START_BEFORE",
				})
			} else {
				tempClear()
			}
		} else {
			tempClear()
		}
	}
	node.pause = function() {
		node.watch_second.pause()
		node.watch_minute.pause()
	}
	node.resume = function() {
		node.watch_second.resume()
		node.watch_minute.resume()
	}
	node.status = [
		["start", node.start],
		["stop", node.stop],
		["pause", node.pause],
		["resume", node.resume],
	]
	node.setUse = function(can) {
		node.canUse = can
	}
	node.canUse = true
	node.changeStatus("stop")
	createTouchEvent({
		item: node.watch_start,
		begin: function(data) {
			if (node.canUse) {
				var item = data.item
				var pos = data.pos
				var locationInNode = item.convertToNodeSpace(pos)
				var s = item.getContentSize()
				var rect = cc.rect(0, 0, s.width, s.height)
				if (cc.rectContainsPoint(rect, locationInNode)) {
					item.y = item.rootY - moveY
					if (node.clickStartBefore) {
						node.clickStartBefore()
					}
					return true
				}
			}
			return false
		},
		end: function(data) {
			var item = data.item
			item.y = item.rootY
			switch (node.statu) {
				case "start":
					node.changeStatus("pause")
					break
				case "pause":
					node.changeStatus("resume")
					node.statu = "start"
					break
				case "stop":
					node.changeStatus("start")
					break
				case "resume":
					cc.log("wrong!")
					break
			}
			if (node.clickStartBack) {
				node.clickStartBack()
			}
		}
	})

	createTouchEvent({
			item: node.watch_stop,
			begin: function(data) {
				if (node.canUse) {
					var item = data.item
					var pos = data.pos
					var locationInNode = item.convertToNodeSpace(pos)
					var s = item.getContentSize()
					var rect = cc.rect(0, 0, s.width, s.height)
					if (cc.rectContainsPoint(rect, locationInNode)) {
						item.y = item.rootY - moveY
						if (node.clickStopBefore) {
							node.clickStopBefore()
						}
						return true
					}
				}
				return false
			},
			end: function(data) {
				var item = data.item
				item.y = item.rootY
				node.changeStatus("stop")
				if (node.clickStopBack) {
					node.clickStopBack()
				}
			}
		})
		//addMoving(node.bg, false)
	node.setBack = function(data) {
		var statu = data.statu
		var fun = data.fun
		var before = data.before
		switch (statu) {
			case "stop":
				node.clickStopBefore = before
				node.clickStopBack = fun
				break
			case "start":
				node.clickStartBefore = before
				node.clickStartBack = fun
				break
		}
	}
	return node
}

function createCar(data) { //创建小车
	var type = data.type
	var tri = data.tri
	var judgeFun = data.judgeFun
	var scale = 0.35
	var ui = [
		"car",
		"cl_1",
		"cl_2",
		"unvis",
	]
	var node = loadNode(res.car, ui)
	node.unvis.setVisible(false)
	node.cir = node.cl_1.getContentSize().width
	node.judge = tri == "left" ? -1 : 1
	if (type != "blue") {
		node.car.setTexture(node.unvis.getTexture())
	}
	if (tri == "right") {
		var mix = 15
		node.car.setFlippedX(true)
		node.cl_1.setPositionX(node.cl_1.getPositionX() - mix)
		node.cl_2.setPositionX(node.cl_2.getPositionX() - mix)
	}

	node.start = function(data) { //xx/s
		var speed = data.speed
		var time = data.time || 1
		var repeat = data.repeat || 9999
		this.myStop()
		addShowType({
			item: this,
			show: "moveBy",
			infun: function() {
				judgeFun(node)
			},
			buf: cc.p(this.judge * speed, 0), //车子移动
			time: time,
			repeat: repeat
		})
		var cicle = speed / this.cir / Math.PI * 180 / scale
		var loop = [
			this.cl_1,
			this.cl_2
		]
		for (var i = 0; i < loop.length; i++) {
			addShowType({ //车轮无限循环
				item: loop[i],
				show: "rotateBy",
				buf: cicle * this.judge,
				time: time,
				repeat: repeat
			})
		}
	}
	node.myStop = function() {
		this.stopAllActions()
		this.cl_1.stopAllActions()
		this.cl_2.stopAllActions()
	}
	node.myPause = function() {
		this.pause()
		this.cl_1.pause()
		this.cl_2.pause()
	}
	node.myResume = function() {
		this.resume()
		this.cl_1.resume()
		this.cl_2.resume()
	}
	node.setScale(scale)
	return node
}

function createFDJ(data) { //创建放大镜 所有放大镜内的物品的所有操作必须通过放大镜去完成 否则会出现内外不匹配
	data = data || {}
	var father = data.father
	var max = data.max || 1
	var min = data.min || 0.1
	var perscale = data.perscale || 0.1
	var nums = data.nums || 1 //放大镜数量
	var seePos = data.seePos || cc.p(700, 270) //视图框位置
	var getPos = data.getPos || cc.p(0, 0) //取景框位置
	var type = data.type || 0
	var rootScale = data.rootScale || 0.4
	var backres = data.backres
	var frontres = data.frontres
	var frontscale = data.frontscale || 1
	var hidebtn = data.hidebtn || false
	type = judgeList({
		src: type,
		dest: 0,
		nums: nums,
	})
	seePos = judgeList({
		src: seePos,
		dest: cc.p(700, 270),
		nums: nums,
	})
	getPos = judgeList({
		src: getPos,
		dest: cc.p(0, 0),
		nums: nums,
	})
	rootScale = judgeList({
		src: rootScale,
		dest: 0.4,
		nums: nums,
	})
	var scale = data.maxScale || 5
	if (!father) {
		return
	}

	var fdjList = [
		[res.img_fdj, res.img_fdj_back],
		[res.img_fdj2, res.img_fdj_back2],
		[res.img_fdj3, res.img_fdj_back3],
		[res.img_fdj4, res.img_fdj_back4]
	]

	var allTargets = []

	var insideCreateItem = function(data) {
		var index = data.index
		var back = data.back || fdjList[type[index]][1]
		var front = data.front || fdjList[type[index]][0]
		cc.log("back", back)
		cc.log("front", front)
		var inside = new cc.ClippingNode(new cc.Sprite(back))
		var outside = new cc.ClippingNode(new cc.Sprite(back))
		inside.setAlphaThreshold(0)
		outside.setAlphaThreshold(0) //多层嵌套 造成放大镜的效果
		var fr = new cc.Sprite(front)
		fr.addChild(outside)
		fr.setScale(frontscale)
		outside.addChild(inside)
		fr.setPosition(getMiddle())
		fr.setAnchorPoint(0, 0)
		outside.setPosition(cc.p(fr.getContentSize().width / 2, fr.getContentSize().height / 2))
		fr.inside = inside
		var target = new cc.Node()
		target.setPosition(cc.p(-fr.getContentSize().width / 2, -fr.getContentSize().height / 2))
		var btn_list = [
			"sx",
			"fd",
			"close",
		]
		var devide = 35
		for (var i = 0; i < btn_list.length; i++) {
			var normal = res[sprintf("btn_fdj_%s_normal", btn_list[i])]
			var select = res[sprintf("btn_fdj_%s_select", btn_list[i])]
			var btn = new ccui.Button(normal, select)
			btn.setAnchorPoint(0, 0)
			btn.setPosition(fr.getContentSize().width - devide * btn_list.length + i * devide, fr.getContentSize().height)
			fr[btn_list[i]] = btn
			fr.addChild(btn)
		}
		fr.close.addClickEventListener(function() {
			fr.setVisible(false)
			removeMoving(fr)
		})
		fr.fd.addClickEventListener(function() {
			var link = fr.link
			if (link && link.getScale() > (min + perscale)) {
				link.setScale(link.getScale() - perscale)
				fr.inside.setScale(1 / link.getScale())
			}
		})
		fr.sx.addClickEventListener(function() {
			var link = fr.link
			if (link && link.getScale() < (max - perscale)) {
				link.setScale(link.getScale() + perscale)
				fr.inside.setScale(1 / link.getScale())
			}
		})
		if (hidebtn) {
			for (var i = 0; i < btn_list.length; i++) {
				fr[btn_list[i]].removeFromParent()
			}
		}
		var link = new cc.Sprite(front)
		link.setAnchorPoint(0.5, 0.5)
		fr.link = link
		link.setPosition(link.getContentSize().width / 2, link.getContentSize().height / 2)
		father.addChild(fr)
		father.addChild(link)
		fr.inside.addChild(target)
		allTargets[index] = target

		if (type[index] == 3) {
			var glass = new cc.Sprite(front)
			glass.setPosition(fr.width / 2, fr.height / 2)
			fr.addChild(glass)

			var fdjhand = new cc.Sprite(res.fdj_hand)
			fdjhand.setPosition(link.width + 30, -20)
			fdjhand.setScale(3)
			link.addChild(fdjhand)
			link.hand = fdjhand
		}

		return {
			fr: fr,
			link: link,
		}
	}

	var node = new cc.Node()
	node.setPosition(0, 0)
	node.setAnchorPoint(0, 0)
	father.addChild(node)
	node.setCascadeOpacityEnabled(true)
	var links = []
	var frs = []
	for (var i = 0; i < nums; i++) {
		var temp = insideCreateItem({
			index: i,
			back: backres,
			front: frontres,
		})
		links[i] = temp.link
		frs[i] = temp.fr
	}
	var result = {
		node: node,
		get: links,
		see: frs,
	}
	result.Init = function() {
		var node = this
		for (var i = 0; i < node.see.length; i++) {
			node.see[i].setPosition(seePos[i])
			node.get[i].setScale(rootScale[i])
			node.see[i].inside.setScale(1 / rootScale[i])
			node.get[i].setVisible(false)
			node.see[i].setVisible(false)
			node.setGet(getPos[i], i)
		}
	}

	result.setGet = function(pos, index) { //设置取景框位置 必须通过这个设置
		var node = this
		var links = node.get
		index = index || 0
		var from = links[index].getPosition()
		var delta = cc.p(pos.x - from.x, pos.y - from.y)
		node.move(delta, index)
	}

	result.runData = function(data) {
		var key = data.key
		var fun = data.fun
		var judgeNode = false
		for (var i = 0; i < allTargets.length; i++) {
			if (node[key] && allTargets[i][key]) {
				if (!judgeNode) {
					fun({
						all: node,
						item: node[key],
					})
					judgeNode = true
				}
				fun({
					all: allTargets[i],
					item: allTargets[i][key],
				})
			}
		}
	}

	result.getKey = function(key, index) { //获取key是否存在
		index = index || 0
		return (node[key] && allTargets[index][key])
	}

	result.getOut = function(key) { //获取外部对象
		if (node[key]) {
			return node[key]
		}
	}

	result.getIn = function(key, index) { //获取放大镜内部对象
		if (node[key]) {
			index = index || 0
			return allTargets[index][key]
		}
	}

	result.deleteInside = function(key) { //删除放大镜内部对象
		for (var i = 0; i < allTargets.length; i++) {
			if (allTargets[i][key]) {
				var item = allTargets[i][key]
				item.stopAllActions()
				item.removeFromParent(true)
				allTargets[i][key] = null
			}
		}
	}

	result.deleteOutside = function(key) { //删除外部对象
		if (node[key]) {
			var item = node[key]
			item.stopAllActions()
			item.removeFromParent(true)
			node[key] = null
		}
	}

	result.deleteKey = function(key) { //删除指定key
		this.deleteInside(key)
		this.deleteOutside(key)
	}

	result.createNew = function(data) { //所有放大镜对象的创建必须通过createNew 并且支持重载所有touch函数
		var key = data.key
		var fun = data.fun //对应的构造函数 需要返回一个item
		var father = data.father
		var begin = data.begin
		var move = data.move
		var end = data.end
		var init = data.init //对应的初始化函数 可以在fun内完成
		var inMove = data.inMove //内部item移动函数
		var outMove = data.outMove //外部item移动函数
		var buf = data.buf //构造函数参数
		var order = data.order //强制localorder
		var infun = data.infun //创建时候内部对象的调用函数 传参为item自身
		var outfun = data.outfun //创建时候外部对象的调用函数


		var item1 = fun(buf)
		if (outfun) {
			outfun(item1)
		}
		if (order != null) {
			item1.setLocalZOrder(order)
		}
		var item2 = []
		node[key] = item1

		if (!father) {
			node.addChild(item1)
		} else {
			node[father].addChild(item1)
		}
		if (init) {
			init({
				item: item1
			})
		}
		for (var i = 0; i < allTargets.length; i++) {
			var temp = fun(buf)
			if (order) {
				temp.setLocalZOrder(order)
			}
			if (infun) {
				infun(temp)
			}
			allTargets[i][key] = temp
			item2[i] = temp
			if (!father) {
				allTargets[i].addChild(temp)
			} else {
				allTargets[i][father].addChild(temp)
			}
			if (init) {
				init({
					item: temp
				})
			}
		}
		item1.linkFun = function(fun) { //链接内部所有对应key并进行操作
			if (fun) {
				for (var i = 0; i < item2.length; i++) {
					fun({
							item: item2[i],
							all: allTargets[i],
						}) //mark data all item
				}
			}
		}

		if (begin || move || end || inMove || outMove) {
			createTouchEvent({
				item: item1,
				begin: function(data) {
					if (begin) {
						for (var i = 0; i < item2.length; i++) {
							var item = item2[i]
							var pos = data.pos
							begin({
								item: item,
								pos: pos,
							})
						}
						return begin(data)
					}
					return true
				},
				move: function(data) {
					if (move) {
						move(data)
						for (var i = 0; i < item2.length; i++) {
							data.item = item2[i]
							move(data)
						}
					}
					if (inMove) {
						for (var i = 0; i < item2.length; i++) {
							data.item = item2[i]
							inMove(data)
						}
					}
					if (outMove) {
						data.item = item1
						outMove(data)
					}
				},
				end: function(data) {
					if (end) {
						end(data)
						for (var i = 0; i < item2.length; i++) {
							data.item = item2[i]
							end(data)
						}
					}
				}
			})
		}
	}

	result.move = function(delta, index, show) { //放大镜对应的位移函数 达到绝对精确
		index = index || 0
		show = show || false
		var node = this
		var links = node.get
		links[index].x += delta.x
		links[index].y += delta.y
		if (result.moveWithEvent)
			result.moveWithEvent(links[index])
		allTargets[index].x -= delta.x
		allTargets[index].y -= delta.y
		if (show) {
			cc.log(index, links[index].x, links[index].y)
		}
	}
	result.actMove = function(data) { //对指定放大镜的取景框进行位置修正 judgeGet函数必须返回位置修正的delta
		var result = this
		data = data || {}
		var fun = data.fun
		var links = result.get
		var isHideGet = data.isHideGet
		var frs = result.see
		var index = data.index
		var judgeGet = data.judgeGet
		var show = data.show
		for (var i = 0; i < links.length; i++) {
			if (index == null || (index != null && i == index)) {
				links[i].judgeIndex = i
				createTouchEvent({
					item: links[i],
					begin: function(data) {
						var item = data.item
						return item.isVisible()
					},
					beginfail: function(data) {
						var item = data.item
						var pos = data.pos
						if (item.hand) {
							if (judgeInside({
									item: item.hand,
									pos: pos,
								})) {
								return true
							}
						}
						return false
					},
					move: function(data) {
						var item = data.item
						var pos = data.pos
						var delta = data.delta
						var fr = frs[item.judgeIndex]
						if (!fr.isVisible() && !isHideGet) {
							addMoving(fr)
							fr.setVisible(true)
						}
						if (judgeGet) {
							var final = judgeGet({
								index: item.judgeIndex,
								delta: delta,
								item: item,
								pos: pos,
							})
							if (final != null) {
								delta = final
							}
						}
						if (fun) {
							fun(data)
						}
						result.move(delta, item.judgeIndex, show)
					},
					end: function(data) {
						if (result.endfun)
							result.endfun(data)
					}
				})
				if (frs[i].isVisible()) {
					addMoving(frs[i])
				}
			}
		}
	}
	result.Init()
	return result
}

function createCounter() { //创建计算器
	var list = [
		"back", "off", "c", "mc", "mr", "ms", "m+",
		"add", "close", "equal", "minus",
		"div", "point", "1/x", "x", "0", "1", "2", "3",
		"4", "5", "6", "7", "8", "9", "%", "sprt", "+/-",
	]
	var templist = []
	for (var i = 0; i < list.length; i++) {
		templist[i] = "btn_" + list[i]
	}
	templist[templist.length] = "img_kuang"

	var counter = function() {
		var node = loadNode(res.counter, templist, "bg")
		var dataControl = {}
		dataControl.limit = 12 //nums limit
		dataControl.buf = ""
		dataControl.past = null
		dataControl.option = null
		var judgeMlist = function(str) {
			var mlist = [
				"mr", "ms", "m+", "mc"
			]
			for (var i = 0; i < mlist.length; i++) {
				if (str == mlist[i]) {
					switch (str) {
						case "ms":
							if (!node.store) {
								node.store = new cc.LabelBMFont("", res.counterfnt)
								node.store.setAlignment(cc.TEXT_ALIGNMENT_LEFT)
								node.store.setAnchorPoint(1, 0.5)
								node.store.setScale(2)
								node.store.setString(String.fromCharCode(77))
								var size = node.img_kuang.getContentSize()
								var offset = cc.p(50, 0)
								node.store.setPosition(offset.x, size.height / 2 + offset.y)
								node.img_kuang.addChild(node.store)
							}
							node.store.setVisible(true)
							var buf = dataControl.buf
							if (buf == "") {
								buf = "0"
							}
							dataControl.storage = buf
							break
						case "mc":
							if (node.store) {
								node.store.setVisible(false)
							}
							dataControl.storage = null
							break
						case "mr":
							if (dataControl.storage) {
								dataControl.buf = dataControl.storage
								dataControl.needRestart = false
							}
							break
						case "m+":
							if (dataControl.storage) {
								var store = parseFloat(dataControl.storage)
								var buf = dataControl.buf
								if (buf == "") {
									buf = "0"
								}
								buf = parseFloat(buf)
								dataControl.storage = (store + buf).toString()
							}
							break
					}
					return true
				}
			}
			return false
		}

		var judgeOp = function(str) {
			var oplist = [
				"add", "minus", "div", "x", "equal",
			]
			for (var i = 0; i < oplist.length; i++) {
				if (str == oplist[i]) {
					return true
				}
			}
			return false
		}

		var clearPast = function() {
			dataControl.past = null
			dataControl.option = null
		}

		var countPast = function() {
			if (dataControl.past && dataControl.option && !dataControl.needRestart) {
				var buf = parseFloat(dataControl.buf)
				var past = parseFloat(dataControl.past)
				var result = null
				switch (dataControl.option) {
					case "add":
						result = buf + past
						break
					case "minus":
						result = past - buf
						break
					case "div":
						result = past / buf
						break
					case "x":
						result = past * buf
						break
					case "equal":
						result = buf
						break
				}
				dataControl.buf = result.toString()
			}
		}

		var getPast = function(str) {
			dataControl.past = dataControl.buf
			dataControl.option = str
		}

		var judgeReset = function() {
			if (dataControl.needRestart) {
				dataControl.buf = "0"
			}
			return dataControl.buf
		}

		var link = function(str) {
			var buf = dataControl.buf
			if (buf == "") {
				buf = "0"
			}
			if (judgeNum(str)) {
				buf = judgeReset()
				buf = buf + str
				dataControl.buf = buf
				dataControl.needRestart = false
				return show()
			}
			if (str == "point") {
				buf = judgeReset()
				if (!judgeContain(buf, ".")) {
					buf = buf + "."
				}
				dataControl.buf = buf
				dataControl.needRestart = false
				return show()
			}
			if (str == "c") {
				dataControl.buf = ""
				clearPast()
				return show()
			}
			if (str == "back") {
				if (buf.length > 0) {
					buf = buf.substr(0, buf.length - 1)
					dataControl.buf = buf
				}
				dataControl.needRestart = false
				return show()
			}
			if (str == "sprt") {
				var temp = Math.sqrt(parseFloat(buf))
				buf = temp.toString()
				dataControl.buf = buf
				clearPast()
				return show()
			}
			if (str == "+/-") {
				dataControl.buf = (parseFloat(buf) * -1).toString()
				dataControl.needRestart = false
				return show()
			}
			if (str == "1/x") {
				dataControl.buf = (1 / parseFloat(buf)).toString()
				clearPast()
				return show()
			}
			if (judgeOp(str)) {
				countPast()
				getPast(str)
				dataControl.needRestart = true
				return show()
			}
			if (judgeMlist(str)) {
				return show()
			}
			if (str == "close" || str == "off") {
				node.close()
				return
			}
		}
		var judgeResult = function(str) {
			var result = str
			for (var i = 0; i < str.length; i++) {
				if (str[i] == "e" || str[i] == "E") {
					result = str.substr(0, (dataControl.limit - str.length + i)) + str.substr(i, str.length)
					break
				}
			}
			return result
		}
		var show = function() {
			if (!node.label) {
				node.label = new cc.LabelBMFont("", res.counterfnt)
				node.label.setAlignment(cc.TEXT_ALIGNMENT_RIGHT)
				node.label.setAnchorPoint(1, 0.5)
				node.label.setScale(2)
				var size = node.img_kuang.getContentSize()
				var offset = cc.p(-15, 0)
				node.label.setPosition(size.width + offset.x, size.height / 2 + offset.y)
				node.img_kuang.addChild(node.label)
			}
			if (dataControl.buf == "") {
				dataControl.buf = "0"
			}
			var ifpoint = false
			if (dataControl.buf[dataControl.buf.length - 1] == ".") {
				ifpoint = true
			}
			dataControl.buf = judgeResult(dataControl.buf)
			if (dataControl.buf.length > dataControl.limit) {
				dataControl.buf = dataControl.buf.substr(0, dataControl.limit)
			}
			dataControl.buf = parseFloat(dataControl.buf).toString()
			if (ifpoint && !judgeContain(dataControl.buf, ".")) {
				dataControl.buf = dataControl.buf + "."
			}
			node.label.setString(dataControl.buf)
		}
		for (var i = 0; i < templist.length - 1; i++) {
			node[templist[i]].key = list[i]
			node[templist[i]].addClickEventListener(function() {
				link(this.key)
			})
		}
		show()
		node.setLocalZOrder(999)
		node.setScale(0)

		node.show = function() {
			var node = this
			if (!node.showing) {
				node.showing = true
				node.setPosition(getMiddle())
				node.setLocalZOrder(LOCAL_ORDER++)
				addShowType({
					item: node,
					show: "scale",
					time: 0.3,
					scale: 0.8,
					fun: function(item) {
						item.showing = false
						node.act = true
						createTouchEvent({
							item: item,
							begin: function(data) {
								var item = data.item
								item.setLocalZOrder(LOCAL_ORDER++)
								return true
							},
							move: function(data) {
								var item = data.item
								var delta = data.delta
								item.x += delta.x
								item.y += delta.y
							}
						})
					}
				})
			}
		}

		node.close = function() {
			var node = this
			if (!node.showing) {
				node.showing = true
				addShowType({
					item: node,
					show: "zoom",
					time: 0.3,
					fun: function(item) {
						item.showing = false
						node.act = false
						if (item.removeListen) {
							item.removeListen()
						}
					}
				})
			}
		}
		node.reEnter = function() {
			if (node) {
				node.label.setOpacity(255)
			}
		}
		node.setLocalZOrder(LOCAL_ORDER++)
		return node
	}

	return counter()
}

function createNewRuler(data) { //创建新尺子
	var devide = data.devide || 30
	var height = data.height || (devide * 1.5)
	var line1 = data.line1 || 3
	var line2 = data.line2 || 5
	var line3 = data.line3 || 8
	var lineColor = data.lineColor || cc.color(0, 0, 0, 255)
	var add = data.add || (devide * 0.3)
	var fontScale = data.fontScale || 0.4
	var max = data.max || 20
	var fontColor = data.fontColor || cc.color(0, 0, 0, 255)
	var fontModify = data.fontModify || cc.p(0, 0)
	var fontY = data.fontY || (height * 0.5) //top to bottom
	var seg = data.seg || 1.0
	var rotate = data.rotate || 0
	var unit = data.unit || ""
	var unitModify = data.unitModify || cc.p(7.5, 0)

	var run = function() {
		var bg = new cc.Scale9Sprite(res.bg_ruler, cc.rect(0, 0, 23, 24), cc.rect(5, 5, 10, 10))
		var width = devide * max + add * 2
		bg.width = width
		bg.height = height

		var start = add
		var draw = new cc.DrawNode()
		var littlediv = devide / 10
		for (var i = 0; i <= max; i++) {
			var label = null
			if (i == 0) {
				label = new cc.LabelBMFont(i.toString() + unit, res.rulerfnt)
				label.setPosition(start + fontModify.x + unitModify.x, height - fontY + fontModify.y + unitModify.y)
			} else {
				label = new cc.LabelBMFont(i.toString(), res.rulerfnt)
				label.setPosition(start + fontModify.x, height - fontY + fontModify.y)
			}
			label.setColor(fontColor)
			label.setAnchorPoint(0.5, 0.5)
			label.setScale(fontScale)
			for (var j = 0; j < 10; j++) {
				var mix = 0
				if (j % 10 == 0) {
					mix = line3
				} else if (j % 5 == 0) {
					mix = line2
				} else {
					mix = line1
				}
				draw.drawSegment(cc.p(start + j * littlediv, height),
					cc.p(start + j * littlediv, height - mix),
					seg, lineColor)
				if (i == max && j == 0) {
					break
				}
			}
			start = start + devide
			bg.addChild(label)
		}
		bg.addChild(draw)
		bg.setRotation(rotate)
		return bg
	}
	return run()
}

function createRuler(data) { //创建尺子
	var scale = data.scale || 1
	var devide = data.devide || 18
	var max = data.max
	var height = data.height || 60
	var add = data.add || 2
	var width = data.width || ((max + add) * devide)
	var littlediv = devide / 10
	var labeldix = 30
	var updix = 5
	var seg = data.seg || 0.35 * scale
	var lineModify = data.lineModify || cc.p(0, 0)
	var fontModify = data.fontModify || cc.p(0, 0)
	var rotate = data.rotate || 0
	var lineInfo = data.lineInfo
	var labelScale = data.labelScale || 1

	devide *= scale
	height *= scale
	width *= scale
	labeldix *= scale
	updix *= scale
	littlediv *= scale

	var bg = new cc.Scale9Sprite(res.bg_ruler, cc.rect(0, 0, 23, 24), cc.rect(5, 5, 10, 10))
	bg.width = width
	bg.height = height
	var start = add / 2 * devide
	var draw = new cc.DrawNode()
	for (var i = 0; i <= max; i++) {
		var label = new cc.LabelBMFont(i.toString(), res.rulerfnt)
		label.setColor(cc.color(0, 0, 0, 255))
		label.setAnchorPoint(0.5, 0.5)
		label.setScale(0.25 * scale * labelScale)
		label.setPosition(start + fontModify.x, height - labeldix + fontModify.y)
		for (var j = 0; j < 10; j++) {
			var mix = 0
			if (i == max) {
				draw.drawSegment(cc.p(start + j * littlediv, height - updix),
					cc.p(start + j * littlediv, height - labeldix + updix + 8 + mix),
					seg, cc.color(0, 0, 0))
				break
			}
			if (j != 0) {
				mix = 8
			}
			if (j == 5) {
				mix = 6
			}
			draw.drawSegment(cc.p(start + j * littlediv, height - updix),
				cc.p(start + j * littlediv, height - labeldix + updix + 8 + mix),
				seg, cc.color(0, 0, 0))
		}
		start = start + devide
		bg.addChild(label)
	}
	draw.setPosition(lineModify)
	bg.addChild(draw)
	bg.setScale(1 / scale)
	bg.setRotation(rotate)
	return bg
}

function createTubiao(data) { //创建图表
	data = data || {}
	var Buf = {}
	Buf.xmax = data.xmax || 50
	Buf.ymax = data.ymax || 50
	Buf.xmin = data.xmin || 0
	Buf.ymin = data.ymin || 0
	Buf.segs = data.segs || 50 //拟合曲线每段的线段数 越大精度越高 但消耗也对应提升
	Buf.rootX = Buf.xmin
	Buf.rootY = Buf.ymin
	Buf.xnum = data.xnum || 10
	Buf.ynum = data.ynum || 10
	Buf.xname = data.xname
	Buf.yname = data.yname
	Buf.labelmix = data.labelmix || 35
	Buf.labelmiy = data.labelmiy || 20
	Buf.autoData = data.autoData //自动描点的参数获取 必须传回一个结构体 参考jlsj
	var father = data.father
	if (!father) {
		cc.log("tubiao needs a father to init")
		return null
	}
	Buf.beginx = 0
	Buf.beginy = 0
	Buf.modifyNum = 300
	Buf.endx = 430
	Buf.endy = 350 //坐标
	Buf.mix = 20
	Buf.mixpos = 5
	Buf.hmix = 40
	Buf.zmix = 20
	Buf.netNum = 5
	Buf.radiu = 5
	Buf.xr = false
	Buf.yr = false

	Buf.changeSet = function(data) {
		var Buf = this
		Buf.xmax = data.xmax
		Buf.ymax = data.ymax
		Buf.xmin = data.xmin
		Buf.ymin = data.ymin
	}

	Buf.getPars = function() {
		Buf.xdevide = (Buf.xmax - Buf.xmin) / Buf.xnum
		Buf.ydevide = (Buf.ymax - Buf.ymin) / Buf.ynum

		Buf.begin = cc.p(Buf.beginx, Buf.beginy)
		Buf.end = cc.p(Buf.endx, Buf.endy)
		Buf.misx = -Buf.mixpos
		Buf.misy = -Buf.mixpos
		Buf.anchorX = cc.p(0.5, 1)
		Buf.anchorY = cc.p(1, 0.5)

		if (Buf.xr) {
			Buf.begin.x = Buf.endx + Buf.hmix
			Buf.end.x = Buf.beginx + Buf.hmix
			Buf.misy = Buf.mixpos
			Buf.anchorY = cc.p(0, 0.5)
		}
		if (Buf.yr) {
			Buf.begin.y = Buf.endy + Buf.zmix
			Buf.end.y = Buf.beginy + Buf.zmix
			Buf.misx = Buf.mixpos
			Buf.anchorX = cc.p(0.5, 0)
		}
		Buf.xdis = ((Buf.end.x - Buf.begin.x) + (Buf.xr ? Buf.mix : -Buf.mix)) / Buf.xnum
		Buf.ydis = ((Buf.end.y - Buf.begin.y) + (Buf.yr ? Buf.mix : -Buf.mix)) / Buf.xnum

		Buf.netdisx = Buf.xdis / Buf.netNum
		Buf.netdisy = Buf.ydis / Buf.netNum

		Buf.judgeX = Buf.yr ? -1 : 1
		Buf.judgeY = Buf.xr ? -1 : 1
		var tempWidth = Buf.end.x - Buf.begin.x
		var tempHeight = Buf.end.y - Buf.begin.y
		if (Buf.yr) {
			Buf.xheight = Buf.endy - (Buf.rootY - Buf.ymin) / (Buf.ymax - Buf.ymin) * (Buf.endy - Buf.mix) + Buf.mix
			tempHeight = tempHeight + Buf.mix
		} else {
			Buf.xheight = (Buf.rootY - Buf.ymin) / (Buf.ymax - Buf.ymin) * (Buf.endy - Buf.mix)
			tempHeight = tempHeight - Buf.mix
		}
		if (Buf.xr) {
			Buf.yheight = Buf.endx - (Buf.rootX - Buf.xmin) / (Buf.xmax - Buf.xmin) * (Buf.endx - Buf.mix) + Buf.mix * 2
			tempWidth = tempWidth + Buf.mix
		} else {
			Buf.yheight = (Buf.rootX - Buf.xmin) / (Buf.xmax - Buf.xmin) * (Buf.endx - Buf.mix)
			tempWidth = tempWidth - Buf.mix
		}
		Buf.TouchSize = cc.size(tempWidth, tempHeight)
	}

	var list = [
		"bg_set",
		"btn_1",
		"btn_2",
		"btn_3",
		"btn_4",
		"btn_5",
		"btn_c1",
		"btn_c2",
		"btn_c3",
		"btn_c4",
		"btn_c5",
		"btn_close",
		"btn_sure",
		"btn_cancle",
		"input_1",
		"input_2",
		"input_3",
		"input_4",
		"input_5",
		"input_6",
	]
	var node = loadNode(res.tubiao, list, "bg")
	node.Buf = Buf
	var drawNode = new cc.Node()
	drawNode.setPosition(200, 60)
	node.drawNode = drawNode
	node.addChild(drawNode)
	node.drawNet = function() {
		var node = this
		var Buf = node.Buf
		if (!node.netNode) {
			node.netNode = new cc.DrawNode()
			node.drawNode.addChild(node.netNode)
		}
		var net = node.netNode
		net.clear()
		if (node.showNet) {
			for (var i = 0; i < Buf.xnum; i++) {
				for (var j = 0; j < Buf.netNum; j++) {
					net.drawSegment(cc.p(Buf.begin.x + i * Buf.xdis + j * Buf.netdisx, Buf.begin.y),
						cc.p(Buf.begin.x + i * Buf.xdis + j * Buf.netdisx, Buf.ynum * Buf.ydis + Buf.begin.y),
						1, cc.color(30, 30, 30, 50))
				}
			}
			for (var i = 0; i < Buf.ynum; i++) {
				for (var j = 0; j < Buf.netNum; j++) {
					net.drawSegment(cc.p(Buf.begin.x, Buf.begin.y + i * Buf.ydis + j * Buf.netdisy),
						cc.p(Buf.xnum * Buf.xdis + Buf.begin.x, Buf.begin.y + i * Buf.ydis + j * Buf.netdisy),
						1, cc.color(30, 30, 30, 50))
				}
			}
		}
	}
	node.drawBg = function() {
		var node = this
		var Buf = node.Buf
		Buf.getPars()
		if (!node.bgNode) {
			node.bgNode = new cc.DrawNode()
			node.drawNode.addChild(node.bgNode)
		}
		var draw = node.bgNode
		draw.clear()
		if (node.labelList) {
			for (var i = 0; i < node.labelList.length; i++) {
				node.labelList[i].removeFromParent(true)
			}
		}
		node.labelList = []
		draw.drawSegment(cc.p(Buf.begin.x, Buf.xheight), cc.p(Buf.end.x, Buf.xheight), 1.5, cc.color(0, 0, 0))
		draw.drawSegment(cc.p(Buf.yheight, Buf.begin.y), cc.p(Buf.yheight, Buf.end.y), 1.5, cc.color(0, 0, 0))

		if (Buf.xname) {
			var judge = Buf.xr ? -1 : 1
			var label = new cc.LabelTTF(Buf.xname, null, 16)
			label.setAnchorPoint(0.5, (Buf.yr ? 1 : 0))
			label.setPosition(Buf.end.x + Buf.labelmix * judge, Buf.xheight)
			label.setColor(cc.color(0, 0, 0, 255))
			node.drawNode.addChild(label)
			node.labelList[node.labelList.length] = label
		}
		if (Buf.yname) {
			var judge = Buf.yr ? -1 : 1
			var label = new cc.LabelTTF(Buf.yname, null, 16)
			label.setAnchorPoint((Buf.xr ? 1 : 0), 0.5)
			label.setColor(cc.color(0, 0, 0, 255))
			label.setPosition(Buf.yheight, Buf.end.y + Buf.labelmiy * judge)
			node.drawNode.addChild(label)
			node.labelList[node.labelList.length] = label
		}
		var ver3 = [cc.p(Buf.yheight - Buf.radiu * Buf.judgeX, Buf.end.y),
			cc.p(Buf.yheight + Buf.radiu * Buf.judgeX, Buf.end.y),
			cc.p(Buf.yheight, Buf.end.y + Buf.radiu * 1.2 * Buf.judgeX)
		]
		draw.drawPoly(ver3, cc.color(0, 0, 0, 255), 2, cc.color(0, 0, 0, 255))
		ver3 = [cc.p(Buf.end.x, Buf.xheight - Buf.radiu * Buf.judgeY),
			cc.p(Buf.end.x, Buf.xheight + Buf.radiu * Buf.judgeY),
			cc.p(Buf.end.x + Buf.radiu * 1.2 * Buf.judgeY, Buf.xheight)
		]
		draw.drawPoly(ver3, cc.color(0, 0, 0, 255), 2, cc.color(0, 0, 0, 255))

		for (var i = 0; i <= Buf.xnum; i++) {
			var tempNum = (i * Buf.xdevide + Buf.xmin).toString()
			if (judgeContain(tempNum, ".")) {
				tempNum = (i * Buf.xdevide + Buf.xmin).toFixed(2).toString()
			}
			var label = new cc.LabelBMFont(tempNum, res.rulerfnt)
			label.setColor(cc.color(0, 0, 0))
			label.setScale(0.25)
			label.setAnchorPoint(Buf.anchorX)
			label.setPosition(cc.p(Buf.begin.x + Buf.xdis * i, Buf.begin.y + Buf.misx))
			node.drawNode.addChild(label)
			node.labelList[node.labelList.length] = label
			draw.drawSegment(cc.p(Buf.begin.x + Buf.xdis * i, Buf.begin.y), cc.p(Buf.begin.x + Buf.xdis * i,
				Buf.ynum * Buf.ydis + Buf.begin.y), 0.6, cc.color(30, 30, 30))
		}
		for (var i = 0; i <= Buf.ynum; i++) {
			var tempNum = (i * Buf.ydevide + Buf.ymin).toString()
			if (judgeContain(tempNum, ".")) {
				tempNum = (i * Buf.ydevide + Buf.ymin).toFixed(2).toString()
			}
			var label = new cc.LabelBMFont(tempNum, res.rulerfnt)
			label.setColor(cc.color(255, 0, 0))
			label.setScale(0.25)
			label.setAnchorPoint(Buf.anchorY)
			label.setPosition(cc.p(Buf.begin.x + Buf.misy, Buf.begin.y + Buf.ydis * i))
			node.drawNode.addChild(label)
			node.labelList[node.labelList.length] = label
			draw.drawSegment(cc.p(Buf.begin.x, Buf.begin.y + Buf.ydis * i),
				cc.p(Buf.xnum * Buf.xdis + Buf.begin.x, Buf.begin.y + Buf.ydis * i), 0.6, cc.color(30, 30, 30))
		}
		if (!node.touchLay) {
			node.touchLay = createLayout({
				pos: cc.p(Buf.begin.x + tempx, Buf.begin.y + tempy),
				size: Buf.TouchSize,
				op: 0,
			})
			node.touchLay.setClippingEnabled(true)
			node.drawNode.addChild(node.touchLay)
				// node.touchLay.removeFromParent(true)
				// node.touchLay.removeListen()
				// node.touchLay = null
		}
		var tempx = 0
		var tempy = 0
		if (Buf.TouchSize.width < 0) {
			tempx = Buf.TouchSize.width
			Buf.TouchSize.width = -Buf.TouchSize.width
		}
		if (Buf.TouchSize.height < 0) {
			tempy = Buf.TouchSize.height
			Buf.TouchSize.height = -Buf.TouchSize.height
		}
		node.touchLay.setPosition(cc.p(Buf.begin.x + tempx, Buf.begin.y + tempy))

		if (!node.Free) {
			node.Free = new cc.DrawNode()
			node.touchLay.addChild(node.Free)
		}
		if (!node.autoDraw) {
			node.autoDraw = new cc.DrawNode()
			node.touchLay.addChild(node.autoDraw)
		}
		node.Free.clear()
		node.autoDraw.clear()
		var tempPos = cc.p(0, 0)
		if (Buf.xr) {
			tempPos.x = -Buf.mix - Buf.hmix
		}
		if (Buf.yr) {
			tempPos.y = -Buf.mix - Buf.zmix
		}
		node.Free.setPosition(tempPos)
		node.autoDraw.setPosition(tempPos)
		if (node.touchLay.removeListen) {
			node.touchLay.removeListen()
		}
		createTouchEvent({
			item: node.touchLay,
			end: function(data) {
				var pos = data.pos
				var item = data.item
				var vert = item.convertToNodeSpace(pos)
				var size = item.getContentSize()
				var judge = cc.p(0, 0)
				if (Buf.xr) {
					judge.x = parseFloat((Buf.xmax - vert.x / size.width * (Buf.xmax - Buf.xmin)).toFixed(2))
				} else {
					judge.x = parseFloat((vert.x / size.width * (Buf.xmax - Buf.xmin) + Buf.xmin).toFixed(2))
				}
				if (Buf.yr) {
					judge.y = parseFloat((Buf.ymax - vert.y / size.height * (Buf.ymax - Buf.ymin)).toFixed(2))
				} else {
					judge.y = parseFloat((vert.y / size.height * (Buf.ymax - Buf.ymin) + Buf.ymin).toFixed(2))
				}
				node.drawPoint(judge)
			}
		})

		node.drawNet()
	}
	node.drawItems = function() {
		node.Free.clear()
		node.drawPoints()
		node.drawLinks()
		node.drawRelations()
		node.drawBeziers()
		node.judgeAuto()
	}
	node.showSetting = function() {
		var node = this
		var show = node.showSet ? "scale" : "zoom"
		node.bg_set.stopAllActions()
		addShowType({
			item: node.bg_set,
			show: show,
			time: 0.3,
			fun: function(item) {
				if (node.showSet) {
					addMoving(item)
				} else {
					removeMoving(item)
				}
			}
		})
	}
	node.changeSet = function() {
		var list = [
			"input_1",
			"input_2",
			"input_3",
			"input_4",
			"input_5",
			"input_6",
		]
		for (var i = 0; i < list.length; i++) {
			var input = node[list[i]].input
			var str = parseFloat(input.getString()).toString()
			input.setString(str)
		}
		var tempminx = parseFloat(node[list[0]].input.getString())
		var tempmaxx = parseFloat(node[list[1]].input.getString())
		var tempminy = parseFloat(node[list[2]].input.getString())
		var tempmaxy = parseFloat(node[list[3]].input.getString())
		var tempx = parseFloat(node[list[4]].input.getString())
		var tempy = parseFloat(node[list[5]].input.getString())
		var Buf = node.Buf
		Buf.xmin = getMin([tempminx, tempmaxx, tempx])
		Buf.xmax = getMax([tempminx, tempmaxx, tempx])
		Buf.ymin = getMin([tempminy, tempmaxy, tempy])
		Buf.ymax = getMax([tempminy, tempmaxy, tempy])
		Buf.rootX = tempx
		Buf.rootY = tempy
		node[list[0]].input.setString(Buf.xmin.toString())
		node[list[1]].input.setString(Buf.xmax.toString())
		node[list[2]].input.setString(Buf.ymin.toString())
		node[list[3]].input.setString(Buf.ymax.toString())
		node.drawBg()
		node.drawItems()
	}
	node.getLoop = function(posArray) {
		var zx = 0
		var zxx = 0
		var zxy = 0
		var zy = 0
		for (var i = 0; i < posArray.length; i++) {
			zx += posArray[i].x
			zy += posArray[i].y
			zxx += Math.pow(posArray[i].x, 2)
			zxy += posArray[i].x * posArray[i].y
		}
		var pingx = zx / posArray.length
		var pingy = zy / posArray.length
		var pingxandy = pingx * pingy
		var pingx2 = pingx * pingx
		var b = (zxy - posArray.length * pingxandy) / (zxx - posArray.length * pingx2)
		var a = pingy - b * pingx
		var data = [a, b]
		return data
	}
	node.getLoopLine = function(data) {
		var node = this
		var a = data[1]
		var b = data[0]
		return [cc.p(Buf.xmin, a * Buf.xmin + b), cc.p(Buf.xmax, a * Buf.xmax + b)]
	}
	node.init = function() {
		var node = this
		node.setLocalZOrder(100)
		node.setScale(0)
		node.Links = []
		node.Relation = []
		node.Centon = []
		node.AllRelations = []
		node.AllLinks = []
		node.AllCentons = []
		node.FreePoints = []
		node.bg_set.setScale(0)
		node.bg_set.setLocalZOrder(100)
		node.showNet = false
		node.showSet = false
		node.canDraw = false
		node.auto = false

		node.getAutoSize = function(autoData) {
			var xmin = 0
			var ymin = 0
			var xmax = 0
			var ymax = 0
			var data = autoData
			var change = false
			for (var i = 0; i < data.length; i++) {
				var points = data[i].points
				for (var j = 0; j < points.length; j++) {
					var point = points[j]
					if (point.x < xmin) {
						xmin = point.x
						change = true
					}
					if (point.x > xmax) {
						xmax = point.x
						change = true
					}
					if (point.y < ymin) {
						ymin = point.y
						change = true
					}
					if (point.y > ymax) {
						ymax = point.y
						change = true
					}
				}
			}
			if (xmax == xmin) {
				xmax = xmax + 1
			}
			if (ymax == ymin) {
				ymax = ymax + 1
			}
			if (change) {
				Buf.xmax = xmax
				Buf.xmin = xmin
				Buf.ymax = ymax
				Buf.ymin = ymin
				node.drawBg()
			}
		}

		node.drawAuto = function(data) {
			if (!node.auto) {
				return
			}
			var auto = node.autoDraw
			for (var i = 0; i < data.length; i++) {
				var temp = data[i]
				var colorPoint = temp.colorPoint || cc.color(0, 0, 255, 255)
				var pointSize = temp.pointSize || 2.5
				var colorLine = temp.colorLine || cc.color(255, 0, 0, 255)
				var colorRleation = temp.colorRleation || cc.color(255, 0, 255, 255)
				var colorCurve = temp.colorCurve || cc.color(0, 255, 255, 255)
				var points = node.order(temp.points)
				for (var j = 0; j < points.length; j++) {
					var pos = points[j]
					auto.drawDot(node.Convert(pos),pointSize,colorPoint)
					if (node.autoLink) {
						if (j != points.length - 1) {
							auto.drawSegment(node.Convert(pos), node.Convert(points[j + 1]), 0.8, colorLine)
						}
					}
				}
				if (points.length > 1 && node.autoRelation) {
					var temp = node.getLoop(points)
					var result = node.getLoopLine(temp)
					auto.drawSegment(node.Convert(result[0]), node.Convert(result[1]), 0.8, colorRleation)
				}
				if (points.length > 1 && node.autoBezier) {
					var beziers = node.getBezier(node.though, points)
					for (var j = 0; j < beziers.length; j++) {
						if (j != 0) {
							node.drawBezier({
								start: beziers[j - 1].end,
								control: beziers[j].control,
								end: beziers[j].end,
								seg: Buf.segs,
								father: auto,
								color: colorCurve,
							})
						} else {
							node.drawBezier({
								start: beziers[j].start,
								control: beziers[j].control,
								end: beziers[j].end,
								seg: Buf.segs,
								father: auto,
								color: colorCurve,
							})
						}
					}
				}
			}
		}

		node.judgeAuto = function() {
			if (node.auto) {
				var autoData = Buf.autoData()
				if (!node.canDraw) {
					node.getAutoSize(autoData)
				}
				node.drawAuto(autoData)
			} else {
				if (node.autoDraw) {
					node.autoDraw.clear()
				}
			}
		}

		node.changeBtn = function(index, vis) {
			var btn = node[sprintf("btn_%d", index)]
			btn.setBright(vis)
			btn.setEnabled(vis)
		}
		node.initBtn = function() {
				for (var i = 1; i <= 5; i++) {
					node.changeBtn(i, false)
				}
			}
			//node.initBtn()
		node.in = function() {
			if (!node.showing) {
				node.showing = true
				node.setPosition(getMiddle())
				node.setLocalZOrder(LOCAL_ORDER++)
				addShowType({
					item: node,
					show: "scale",
					fun: function(item) {
						item.show = true
						item.showing = false
						createTouchEvent({
							item: item,
							begin: function(data) {
								var item = data.item
								item.setLocalZOrder(LOCAL_ORDER++)
								return true
							},
							move: function(data) {
								var item = data.item
								var delta = data.delta
								item.x += delta.x
								item.y += delta.y
							}
						})
					}
				})
			}
		}
		node.out = function() {
			if (!node.showing) {
				node.showing = true
				addShowType({
					item: node,
					show: "zoom",
					fun: function(item) {
						item.show = false
						item.showing = false
						if (item.removeListen) {
							item.removeListen()
						}
					}
				})
			}
		}
		node.btn_close.addClickEventListener(function() {
			if (node.show) {
				node.out()
			}
		})
		var fun_u1 = function() {
			node.drawRelation()
			if (node.auto) {
				node.autoRelation = true
				node.judgeAuto()
			}
		}
		var fun_u2 = function() {
			node.drawLink()
			if (node.auto) {
				node.autoLink = true
				node.judgeAuto()
			}
		}
		var fun_u3 = function() {
			node.getBezier()
			if (node.auto) {
				node.autoBezier = true
				node.judgeAuto()
			}
		}
		var fun_u4 = function() {
			node.Free.clear()
			node.AllCentons = []
			node.AllLinks = []
			node.AllRelations = []
			node.Centon = []
			node.Links = []
			node.Relation = []
			node.FreePoints = []

			//node.initBtn()
			node.auto = false
			node.autoLink = false
			node.autoRelation = false
			node.autoBezier = false
			node.canDraw = false
			node.btn_c1.setSelected(false)
			node.btn_c2.setSelected(false)
			node.changeSet()
			node.drawBg()
			node.drawItems()
		}
		var fun_u5 = function() {
			node.showSet = !node.showSet
			node.showSetting()
		}
		node.btn_1.addClickEventListener(fun_u1)
		node.btn_2.addClickEventListener(fun_u2)
		node.btn_3.addClickEventListener(fun_u3)
		node.btn_4.addClickEventListener(fun_u4)
		node.btn_5.addClickEventListener(fun_u5)
		var fun_1 = function() {
			node.auto = !node.auto
			if (!node.auto) {
				node.changeSet()
			} else {
				node.judgeAuto()
			}
		}
		var fun_2 = function() {
			node.canDraw = !node.canDraw
				// for (var i = 0; i < 5; i++) {
				// 	Things[i]
				// }
				// node.changeBtn(5, node.canDraw)
			if (node.Free) {
				node.Free.setVisible(node.canDraw)
			}
		}
		var fun_3 = function() {
			node.showNet = !node.showNet
			node.drawNet()
		}
		var fun_4 = function() {
			Buf.xr = !Buf.xr
			node.drawBg()
			node.drawItems()
		}
		var fun_5 = function() {
			Buf.yr = !Buf.yr
			node.drawBg()
			node.drawItems()
		}
		var list = [
			["input_1", Buf.xmin],
			["input_2", Buf.xmax],
			["input_3", Buf.ymin],
			["input_4", Buf.ymax],
			["input_5", Buf.xmin],
			["input_6", Buf.ymin],
		]
		node.controlInput = {}
		for (var i = 0; i < list.length; i++) {
			addInput({
				item: node[list[i][0]],
				str: list[i][1].toString(),
				size: 15,
				control: node.controlInput,
			})
		}
		var itemlist = [
			["btn_c1", fun_1],
			["btn_c2", fun_2],
			["btn_c3", fun_3],
			["btn_c4", fun_4],
			["btn_c5", fun_5],
		]
		for (var i = 0; i < itemlist.length; i++) {
			node[itemlist[i][0]].addClickEventListener(itemlist[i][1])
			node[itemlist[i][0]].fun = itemlist[i][1]
			createTouchEvent({
				item: node[itemlist[i][0]].getChildByName("label"),
				end: function(data) {
					var item = data.item
					item.getParent().setSelected(!item.getParent().isSelected())
					item.getParent().fun()
				}
			})
		}
		node.btn_cancle.addClickEventListener(function() {
			node.showSet = false
			node.showSetting()
		})
		node.btn_sure.addClickEventListener(function() {
			node.showSet = false
			node.showSetting()
			node.changeSet()
		})
		node.drawBg()
	}
	node.drawPoints = function() {
		var node = this
		if (!node.canDraw) {
			return
		} else {
			for (var i = 0; i < node.FreePoints.length; i++) {
				var pos = node.FreePoints[i]
				node.Free.drawDot(node.Convert(pos), 2.5, cc.color(255, 102, 0, 255))
			}
		}
	}
	node.order = function(list) {
		for (var i = 0; i < list.length; i++) {
			for (var j = i; j < list.length; j++) {
				if (list[i].x > list[j].x) {
					var temp = list[i]
					list[i] = list[j]
					list[j] = temp
				}
			}
		}
		return list
	}
	node.Convert = function(pos) {
		var node = this
		var result = cc.p(0, 0)
		var xDis = Buf.xmax - Buf.xmin
		var yDis = Buf.ymax - Buf.ymin
		var size = node.touchLay.getContentSize()
		if (Buf.xr) {
			result.x = (Buf.xmax - pos.x) / xDis * size.width
		} else {
			result.x = (pos.x - Buf.xmin) / xDis * size.width
		}
		if (Buf.yr) {
			result.y = (Buf.ymax - pos.y) / yDis * size.height
		} else {
			result.y = (pos.y - Buf.ymin) / yDis * size.height
		}
		result.x = parseFloat(result.x.toFixed(2))
		result.y = parseFloat(result.y.toFixed(2))
		result = node.drawNode.convertToNodeSpace(node.touchLay.convertToWorldSpace(result))
		return result
	}
	node.drawPoint = function(pos) {
		var node = this
		if (!node.canDraw) {
			return
		} else {
			node.FreePoints.push(pos)
			node.Free.drawDot(node.Convert(pos), 2.5, cc.color(255, 102, 0, 255))
			if (node.NeedNew) {
				node.Links = []
				node.Relation = []
				node.Centon = []
				node.NeedNew = false
			}
			node.Links.push(pos)
			node.Relation.push(pos)
			node.Centon.push(pos)
		}
	}
	node.drawLink = function() {
		var node = this
		if (!(node.Links.length > 1)) {
			return
		}
		var temp = node.order(node.Links)
		node.AllLinks.push(temp)
		for (var i = 0; i < temp.length - 1; i++) {
			node.Free.drawSegment(node.Convert(temp[i]), node.Convert(temp[i + 1]), 0.8, cc.color(153, 0, 255, 255))
		}
		node.Links = []
		node.NeedNew = true
	}
	node.drawLinks = function() {
		var node = this
		for (var i = 0; i < node.AllLinks.length; i++) {
			var temp = node.AllLinks[i]
			for (var j = 0; j < temp.length - 1; j++) {
				node.Free.drawSegment(node.Convert(temp[j]), node.Convert(temp[j + 1]), 0.8, cc.color(153, 0, 255, 255))
			}
		}
	}
	node.drawBeziers = function() {
		var node = this
		for (var j = 0; j < node.AllCentons.length; j++) {
			var beziers = node.AllCentons[j]
			for (var i = 0; i < beziers.length; i++) {
				if (i != 0) {
					node.drawBezier({
						start: beziers[i - 1].end,
						control: beziers[i].control,
						end: beziers[i].end,
						seg: Buf.segs,
					})
				} else {
					node.drawBezier({
						start: beziers[i].start,
						control: beziers[i].control,
						end: beziers[i].end,
						seg: Buf.segs,
					})
				}
			}
		}
	}
	node.drawBezier = function(data) {
		var start = data.start
		var end = data.end
		var control = data.control
		var node = this
		var seg = data.seg
		var devide = (1 / data.seg)
		var begin = start
		var father = data.father || node.Free
		var color = data.color || cc.color(255, 102, 0, 255)
		var getResult = function(t) {
			var a = (1 - t) * (1 - t)
			var b = 2 * t * (1 - t)
			var c = t * t
			return cc.p(a * start.x + b * control.x + c * end.x, a * start.y + b * control.y + c * end.y)
		}
		for (var i = 0; i <= seg; i++) {
			var temp = getResult(i * devide)
			father.drawSegment(node.Convert(begin), node.Convert(temp), 0.8, color)
			begin = temp
		}
	}
	node.getBezier = function(though, data) {
			var node = this
			var Buf = node.Buf
			var data = data || node.Centon
			if (!(data.length > 1)) {
				return
			}
			var path = node.order(data)
			var beziers = []
			if (path.length == 2) {
				beziers.push({
					start: path[0],
					control: path[0],
					end: path[1],
				})
			} else {
				var start = path[0]
				var end = path[path.length - 1]
				var subtract = function(p1, p2) {
					return cc.p(p1.x - p2.x, p1.y - p2.y)
				}
				var add = function(p1, p2) {
					return cc.p(p1.x + p2.x, p1.y + p2.y)
				}
				var interpolate = function(p1, p2, num) {
					return cc.p(p1.x * num + p2.x * (1 - num), p1.y * num + p2.y * (1 - num))
				}
				if (though) {
					var p = subtract(path[2], path[0])
					p.x /= 4
					p.y /= 4
					var prevBezier = {}
					prevBezier.start = start
					prevBezier.control = subtract(path[1], p)
					prevBezier.end = {}
					beziers.push(prevBezier)
					for (var i = 1; i < path.length - 1; i++) {
						var currentBezier = {}
						currentBezier.start = prevBezier.end
						currentBezier.control = add(path[i], subtract(path[i], prevBezier.control))
						currentBezier.end = {}
						currentBezier.start.x = path[i].x
						currentBezier.start.y = path[i].y
						beziers.push(currentBezier)
						prevBezier = currentBezier
					}
					prevBezier.end = end
				} else {
					var prevBezier = {}
					prevBezier.start = start
					prevBezier.control = cc.p(path[1].x, path[1].y)
					prevBezier.end = {}
					beziers.push(prevBezier)
					for (var i = 1; i < path.length - 2; i++) {
						var currentBezier = {}
						currentBezier.start = prevBezier.end
						currentBezier.control = cc.p(path[i + 1].x, path[i + 1].y)
						currentBezier.end = {}
						var mid = interpolate(prevBezier.control, currentBezier.control, 0.5)
						currentBezier.start.x = mid.x
						currentBezier.start.y = mid.y
						beziers.push(currentBezier)
						prevBezier = currentBezier
					}
					prevBezier.end = end
				}
			}
			for (var i = 0; i < beziers.length; i++) {
				if (i != 0) {
					node.drawBezier({
						start: beziers[i - 1].end,
						control: beziers[i].control,
						end: beziers[i].end,
						seg: Buf.segs,
					})
				} else {
					node.drawBezier({
						start: beziers[i].start,
						control: beziers[i].control,
						end: beziers[i].end,
						seg: Buf.segs,
					})
				}
			}
			if (data == node.Centon) {
				node.Centon = []
				node.AllCentons.push(beziers)
			}
			return beziers
		}
		// //多项式拟合
		// node.getModify = function() {
		// 	var node = this
		// 	if (!(node.Centon.length > 1)) {
		// 		return
		// 	}
		// 	var userInput = node.order(node.Centon)
		// 	var returnResult = []
		// 	var inputMatrix = []
		// 	var n = userInput.length
		// 	for (var i = 0; i < n; i++) {
		// 		var tempArr = [];
		// 		for (var j = 0; j < n; j++) {
		// 			tempArr.push(Math.pow(userInput[i].x, n - j - 1))
		// 		}
		// 		tempArr.push(userInput[i].y)
		// 		inputMatrix.push(tempArr)
		// 	}
		// 	for (var i = 0; i < n; i++) {
		// 		var base = inputMatrix[i][i]
		// 		for (var j = 0; j < n + 1; j++) {
		// 			if (base == 0) {
		// 				//存在相同x不同y的点，无法使用多项式进行拟合
		// 				return false;
		// 			}
		// 			inputMatrix[i][j] = inputMatrix[i][j] / base;
		// 		}
		// 		for (var j = 0; j < n; j++) {
		// 			if (i != j) {
		// 				var baseInner = inputMatrix[j][i]
		// 				for (var k = 0; k < n + 1; k++) {
		// 					inputMatrix[j][k] = inputMatrix[j][k] - baseInner * inputMatrix[i][k];
		// 				}
		// 			}
		// 		}
		// 	}
		// 	for (var i = 0; i < n; i++) {

	// 		if (inputMatrix[i][n] != 0) {
	// 			var tmp_x = 0
	// 			for (var j = 0; j < n - 1 - i; j++) {
	// 				tmp_x = tmp_x + 1
	// 			}
	// 			returnResult.push({
	// 				buf: parseFloat(inputMatrix[i][n]),
	// 				times: tmp_x,
	// 			})
	// 		}
	// 	}
	// 	var pair = {
	// 		begin: userInput[0].x,
	// 		end: userInput[userInput.length - 1].x,
	// 		buf: returnResult,
	// 	}
	// 	node.AllCentons.push(pair)
	// 	node.Centon = []
	// 	node.NeedNew = true
	// 	var vers = node.getCurve(pair)
	// 	var result = []
	// 	for (var i = 0; i < vers.length; i++) {
	// 		result[i] = node.Convert(vers[i])
	// 	}
	// 	for (var i = 0; i < result.length - 1; i++) {
	// 		node.Free.drawSegment(result[i], result[i + 1], 0.8, cc.color(255, 0, 0, 255))
	// 	}
	// }

	// node.countY = function(x, seg) {
	// 	var result = 0
	// 	for (var data in seg) {
	// 		var multi = seg[data].buf
	// 		var times = seg[data].times
	// 		result += (Math.pow(x, times) * multi)
	// 	}
	// 	return result
	// }

	// node.getCurve = function(data) {
	// 	var node = this
	// 	var begin = data.begin
	// 	var end = data.end
	// 	var count = data.buf
	// 	var modifyNum = Buf.modifyNum
	// 	var dis = (end - begin) / modifyNum
	// 	var vertices = []
	// 	for (var i = 0; i <= modifyNum; i++) {
	// 		vertices.push(cc.p(begin + i * dis, node.countY(begin + i * dis, count)))
	// 	}
	// 	return vertices
	// }

	node.drawRelation = function() {
		var node = this
		if (!(node.Relation.length > 1)) {
			return
		}
		var temp = node.getLoop(node.Relation)
		node.AllRelations.push(temp)
		var result = node.getLoopLine(temp)
		node.Free.drawSegment(node.Convert(result[0]), node.Convert(result[1]), 0.8, cc.color(255, 0, 0, 255))
		node.Relation = []
		node.NeedNew = true
	}
	node.drawRelations = function() {
		var node = this
		for (var i = 0; i < node.AllRelations.length; i++) {
			var temp = node.AllRelations[i]
			var result = node.getLoopLine(temp)
			node.Free.drawSegment(node.Convert(result[0]), node.Convert(result[1]), 0.8, cc.color(255, 0, 0, 255))
		}
	}
	node.init()
	father.tubiao = node
	father.addChild(node)
	node.setLocalZOrder(LOCAL_ORDER++)
	return node
}

function createBiaoge(data) { //创建表格
	var json = data.json
	var inputs = data.inputs || "input%d" //会对应读取json中命名为input%d的item去对其调用addinput id从1开始
	var downs = data.downs || "down%d" //同上 会对应创建下拉菜单
	var gous = data.gous || "gou%d"
	var inputNum = data.inputNum || 0 //输入框的数量
	var inputLineChange = data.inputLineChange || []
	var inputSize = data.inputSize
	var gouNum = data.gouNum || 0 //打钩框的数量
	var finalBg = data.finalBg || "bg_final"
	var overClear = data.overClear 
	var finalLabelNmae = data.finalLabelName || "label%d"
	var checkBoxName = data.checkBoxName || "chose%d_%d"
	var checkBoxImg = data.checkBoxImg
	var checkBoxpos = data.checkBoxpos || cc.p(0,0)
	var checkBoxNum = data.checkBoxNum || [0,0]
	var checkAnswers = data.checkAnswers || []
	var showType = data.showType || "scale"
	var finalList = data.finalList || []
	var finalLabelNum = data.finalLabelNum || 0
	var rootData = data.rootData || []
	var rootColor = data.rootColor || []
	var fontTypeList = data.fontTypeList || []
	var noUp = data.noUp || false
	var scale = data.scale || 1
	var strlen = data.strlen
	var inputKeys = data.inputKeys || []
	var downData = data.downData || {}
	var downNums = downData.nums || 0
	var downBufs = downData.bufs || []
	var downKeys = downData.keys || []
	var downFT = downData.downFT || 0
	var downScale = downData.scale
	var keyEndFun = downData.keyEndFun
	var isShowResult = data.isShowResult || false
	var answerNum = data.answerNum || 0
	var txtLabel = data.txtLabel || "txt%d"
	var answerlist = data.answerlist || []
	var answerfontsize = data.answerfontsize || 30
	var answerShowKey = data.answerShowKey || false
	var judgeScale = data.judgeScale || 1 //用于改写正确或错误图片的大小
	var CloseFun = data.CloseFun //关闭回调
	var listPos = data.listPos //多表格
	var bglist = data.bglist
	var bgInit = data.bgInit
	var initFinal = data.initFinal
	var resultFun = data.resultFun
	var disJudgeInput = data.disJudgeInput || false
	var answerModify = data.answerModify
	var judgeOrder = data.judgeOrder || false //用于判断表格显示更高层级关系
	var userUIlist = data.userUIlist || [] //自定义名字绑定控件
	answerModify = judgeList({
		src: answerModify,
		dest: cc.p(0, 0),
		nums: inputs.length,
	})
	if(overClear == null){
		overClear = false
	}

	downScale = judgeList({
		src: downScale,
		dest: 1,
		nums: downNums,
	})

	var uilist = [
		"bg_final",
		"btn_close",
		"btn_upload",
		"btn_answer",
		"btn_clear",
		"btn_result",
		"img_result",
		"btn_final_close",
		"btn_retry",
	]

	for (var i = 1; i <= inputNum; i++) {
		uilist.push(sprintf(inputs, i))
	}
	for (var i = 1; i <= answerNum; i++) {
		uilist.push(sprintf(txtLabel, i))
	}
	for (var i = 1; i <= downNums; i++) {
		uilist.push(sprintf(downs, i))
	}
	for (var i = 1; i <= finalLabelNum; i++) {
		uilist.push(sprintf(finalLabelNmae, i))
	}
	for (var i = 1; i <= gouNum; i++) {
		uilist.push(sprintf(gous, i))
	}
	for (var i = 1; i <= checkBoxNum[0]; i++) {
		for (var j = 1; j <= checkBoxNum[1]; j++) {
			uilist.push(sprintf(checkBoxName,i,j))
		}
	}
	for (var i = 0; i < userUIlist.length; i++) {
		uilist.push(userUIlist[i])
	}
	var biaoge = loadNode(json, uilist, "bg")
	biaoge.setCascadeOpacityEnabled(true)
	biaoge.setScale(scale)
	biaoge.rootScale = scale
	var down = loadNode(res.biaoge_down, [], "down")
	biaoge.copy = down
	down.retain()

	//单选框
	biaoge.checkList = []
	biaoge.checkAnswer = []
	for (var i = 1; i <= checkBoxNum[0]; i++) {
		var tempList = []
		for (var j = 1; j <= checkBoxNum[1]; j++) {
			var checkName = sprintf(checkBoxName,i,j)
			tempList[j-1] = biaoge[checkName]
			biaoge[checkName].preIndex = i-1
			biaoge[checkName].behIndex = j-1
			createTouchEvent({
               item:biaoge[checkName],
               begin:function(data){
               	  var item = data.item
               	  var preIndex = item.preIndex
               	  var behIndex = item.behIndex
               	  if(!item.haveChild){
                    var sp = new cc.Sprite(checkBoxImg)
	                sp.setPosition(item.width/2 + checkBoxpos.x,item.height/2 + checkBoxpos.y)
	                item.addChild(sp)
	                item.haveChild = true
	                var childs = biaoge.checkList[preIndex]
	               	for (var i = childs.length - 1; i >= 0; i--) {
	               	  if(i　!= behIndex &&　childs[i].haveChild){
	               	  	childs[i].removeAllChildren()
	               	  	childs[i].haveChild = false	
	               	  }
	               	}
	               	biaoge.checkAnswer[preIndex] = behIndex
               	  }else{
               	  	item.removeAllChildren()
                    item.haveChild = false
                    biaoge.checkAnswer[preIndex] = null
               	  }
             
               },
			})
		}
		biaoge.checkList[i-1] = tempList
		biaoge.checkAnswer[i-1] = null
	}
	if (bglist && listPos && bglist.length == listPos.length) {
		biaoge.bgBtnList = []
		loadList(biaoge, bglist)
		for (var i = 0; i < listPos.length; i++) {
			var btn = createJudgeBtn({
				normal: sprintf("btn_b%d_normal.png", i + 1),
				select: sprintf("btn_b%d_select.png", i + 1),
				pos: listPos[i],
				father: biaoge,
				frame: true,
				scale: 1.7,
				fun: function(btn) {
					if (biaoge.showBgIndex) {
						biaoge.showBgIndex(btn.index)
					}
				}
			})
			btn.index = i
			biaoge.bgBtnList[i] = btn
		}
		if (bgInit) {
			for (var i = 0; i < bglist.length; i++) {
				biaoge[bglist[i]].index = i
				bgInit(biaoge[bglist[i]])
			}
		}
		biaoge.showBgIndex = function(index) {
			var btnlist = biaoge.bgBtnList
			for (var i = 0; i < bglist.length; i++) {
				var curbg = biaoge[bglist[i]]
				curbg.setVisible(i == index)
				if (i == index && curbg.show) {
					curbg.show()
				}
			}
			if (btnlist) {
				for (var i = 0; i < btnlist.length; i++) {
					btnlist[i].change(i == index, false)
				}
			}
		}
	}

	for (var i = 1; i <= finalLabelNum; i++) {
		if (finalList[i - 1]) {
			biaoge[sprintf(finalLabelNmae, i)].setString(finalList[i - 1])
		}
	}
	if (biaoge.bg_final)
		biaoge.bg_final.rootScale = biaoge.bg_final.getScale()

	biaoge.setPosition(getMiddle())
	var orderCount = 100
	var createDown = function(data) { //创建下拉菜单
		var data = data || {}
		var item = data.item
		var buf = data.buf
		var key = data.key
		var index = data.index
		var keyEndFun = data.keyEndFun
		var size = item.getContentSize()
		var order = data.order
		var btn_copy = null
		if (!biaoge.copy) {
			return
		} else {
			btn_copy = biaoge.copy.getChildByName("btn_copy")
			btn_copy.setVisible(false)
		}
		item.key = key
		item.getAnswer = function() {
			var item = this
			var down = item.down
			return (item && down && item.key == down.key)
		}
		var temp = biaoge.copy.clone()
		temp.setScaleY(downScale[index - 1])
		var height = temp.height * buf.length
		var normal = temp.getChildByName("normal")
		var select = temp.getChildByName("select")
		normal.setScaleX(downScale[index - 1])
		select.setScaleX(downScale[index - 1])
		var img_correct = temp.getChildByName("img_correct")
		var img_fault = temp.getChildByName("img_fault")
		var normalSize = normal.getContentSize()
		img_correct.setVisible(false)
		img_fault.setVisible(false)
		img_correct.setScale(judgeScale)
		img_fault.setScale(judgeScale)
		temp.isOut = false
		temp.width = size.width
		temp.setVisible(true)
		temp.setPosition(size.width / 2, size.height / 2)
		temp.imgPos = cc.p((size.width - normalSize.width * downScale[index - 1]) / 2, temp.height / 2)
		normal.setPositionX(size.width)
		select.setPositionX(size.width)
		img_correct.setPositionX(size.width)
		img_fault.setPositionX(size.width)
		img_correct.y = img_correct.y + downFT
		img_fault.y = img_fault.y  + downFT
		temp.normal = normal
		temp.select = select
		temp.img_correct = img_correct
		temp.img_fault = img_fault
		temp.fatherKey = key
		temp.fatherIndex = index
		temp.keyEndFun = keyEndFun
		select.setVisible(false)

		temp.setAnswer = function(judge) {
			var temp = this
			if (!temp.hasSetFinal) {
				temp.hasSetFinal = true
				var myScale = judgeScale || 1
				setFinalScale({
					item: temp.img_correct,
					scale: myScale,
				})
				setFinalScale({
					item: temp.img_fault,
					scale: myScale,
				})
			}
			temp.img_correct.setVisible(judge)
			temp.img_fault.setVisible(!judge)
		}
		temp.clear = function() {
			temp.img_correct.setVisible(false)
			temp.img_fault.setVisible(false)
			if (temp.img) {
				temp.img.removeFromParent(true)
				temp.img = null
			}
			temp.key = null
		}
		temp.pack = function() {
			var temp = this
			temp.init = true
			temp.show = function() {
				var temp = this
				if (!temp.showing) {
					temp.showing = true
					var lay = temp.lay
					var buf = temp.isOut ? lay.moveDis : cc.p(lay.moveDis.x, -lay.moveDis.y)
					temp.normal.setVisible(temp.isOut)
					temp.select.setVisible(!temp.isOut)
					if (lay) {
						addShowType({
							item: lay,
							show: "moveBy",
							buf: buf,
							time: 0.2,
							fun: function() {
								temp.showing = false
								temp.isOut = !temp.isOut

							}
						})
					}
				}
			}
			temp.back = function() {
				var temp = this
				if (temp.isOut) {
					temp.show()
				}
			}
			temp.set = function(data) {
				var temp = this
				var src = data.src
				var key = data.key
				var noback = data.noback || false
				var noShow = data.noShow || false
				temp.key = key
				temp.src = src
				if (temp.img) {
					temp.img.removeFromParent(true)
					temp.img = null
				}
				if (src) {
					temp.img = new cc.Sprite(src)
					temp.img.setPosition(temp.imgPos)
					safeAdd(temp, temp.img)
					setFinalScale({
						item: temp.img,
						scale: 1,
					})
				}
				if (!noShow) {
					temp.show()
				}
				if (!noback) {
					if (temp.myCallBack) {
						temp.myCallBack()
					}
				}
				if (temp.key == temp.fatherKey) {
					if (temp.keyEndFun) {
						temp.keyEndFun(temp.fatherIndex)
					}
				}
			}

			var layDown = createLayout({
				size: cc.size(temp.width, height),
				op: 0,
			})
			layDown.setClippingEnabled(true)
			layDown.setAnchorPoint(0, 1)
			safeAdd(temp, layDown)
				// setFinalScale({
				// 	item:layDown,
				// 	scale:1,
				// })

			var lay = createLayout({
				size: cc.size(temp.width, height),
				op: 0,
			})
			lay.setPosition(0, height + temp.height)
			temp.lay = lay
			lay.moveDis = cc.p(0, (height + temp.height))
			for (var i = 0; i < buf.length; i++) {
				var t_btn = btn_copy.clone()
				t_btn.width = temp.width
				t_btn.height = temp.height
				t_btn.setVisible(true)
				if (buf[i]) {
					var sp = new cc.Sprite(buf[i])
					sp.setPosition(temp.width / 2, temp.height / 2)
					safeAdd(t_btn, sp)
				}
				t_btn.src = buf[i]
				t_btn.key = i
				t_btn.setPosition(temp.width / 2, height - temp.height / 2 - i * temp.height)
				t_btn.addClickEventListener(function() {
					var btn = this
					temp.set({
						src: btn.src,
						key: btn.key,
					})
				})
				safeAdd(lay, t_btn)
			}
			safeAdd(layDown, lay)
			setFinalScale({
				item: layDown,
				scale: 1,
				judge: [0, 1],
			})
		}
		createTouchEvent({
			item: temp,
			swallow: false,
			begin: function(data) {
				var item = data.item
				var pos = data.pos
				if (!getLoopVis(item)) {
					return false
				}
				var par = item.getParent()
				if (!item.init) {
					item.pack()
				}
				par.setLocalZOrder(orderCount++)
				safeAdd(par.getParent(), par)
				item.normal.setVisible(temp.isOut)
				item.select.setVisible(!temp.isOut)
				return true
			},
			beginfail: function(data) {
				var item = data.item
				var pos = data.pos
				if (item.back) {
					item.back()
				}
				return false
			},
			end: function(data) {
				var item = data.item
				item.show()
			}
		})
		safeAdd(item, temp)
		item.down = temp
		temp.init = false
		temp.setCascadeOpacityEnabled(true)
		item.setCascadeOpacityEnabled(true)
	}

	for (var i = 1; i <= downNums; i++) {
		var item = biaoge[sprintf(downs, i)]
		createDown({
			item: item,
			index: i,
			buf: downBufs[i - 1],
			key: downKeys[i - 1],
			judgeScale: judgeScale,
			keyEndFun: keyEndFun
		})
	}
	biaoge.controlInput = {}
	for (var i = 1; i <= inputNum; i++) {
		var font = biaoge[sprintf(inputs, i)]
		addInput({
			item: font,
			strlen: strlen,
			size: inputSize,
			backFun: function() {
				if (biaoge.BackFun) {
					biaoge.BackFun()
				}
			},
			lineChange: inputLineChange[i - 1] || false,
			control: biaoge.controlInput,
			color: rootColor[i - 1],
			str: rootData[i - 1],
			answerModify: answerModify[i - 1],
			fontType: fontTypeList[i - 1]
		})
	}

	for (var i = 1; i <= answerNum; i++) {
		var font = biaoge[sprintf(txtLabel, i)]

		var daan = answerlist[i - 1]
			//if(typeof(daan) != 'string')
			// daan = parseFloat(daan).toFixed(2)

		var lab = new cc.LabelTTF(daan, "", answerfontsize)
		var size = font.getContentSize()
		lab.setPosition(size.width / 2, size.height / 2)
		lab.setColor(rootColor[0])
		font.addChild(lab)
	}


	if (biaoge.btn_result) {
		biaoge.btn_result.addClickEventListener(function() {
			if (biaoge.img_result) {
				biaoge.img_result.setVisible(!biaoge.img_result.isVisible())
			}
			if (resultFun) {
				resultFun()
			}
			if(biaoge.linkResult){
				biaoge.img_result.setVisible(false)
				biaoge.linkResult()
			}
		})
	}
	if (noUp) {
		if (biaoge.btn_upload) {
			biaoge.btn_upload.setVisible(!noUp)
		}
		// var mix = 100
		// if (biaoge.btn_answer) {
		// 	biaoge.btn_answer.setPositionY(biaoge.btn_answer.getPositionY() + mix)
		// }
		// if (biaoge.btn_clear) {
		// 	biaoge.btn_clear.setPositionY(biaoge.btn_clear.getPositionY() + mix / 2)
		// }
	}
	if (biaoge.btn_answer) {
		biaoge.btn_answer.addClickEventListener(function() {
			if (biaoge.bg_final) {
				if (biaoge.bg_final.close) {
					if (initFinal) {
						initFinal(biaoge.bg_final)
					}
					biaoge.bg_final.showIn()
				} else {
					biaoge.bg_final.showOut()
				}
			}
			if (answerShowKey && inputKeys && inputNum) {
				for (var i = 0; i < inputNum; i++) {
					var item = biaoge[sprintf(inputs, i + 1)]
					item.setStr(inputKeys[i])
				}
			}
			if (biaoge.linkAnswer) {
				biaoge.linkAnswer()
			}
		})
	}

	if (biaoge.btn_retry) {
		biaoge.btn_retry.addClickEventListener(function() {
			if (biaoge.linkRetry) {
				biaoge.linkRetry()
			}
		})
	}

	if (biaoge.btn_final_close) {
		biaoge.btn_final_close.addClickEventListener(function() {
			if (!biaoge.bg_final.close) {
				biaoge.bg_final.showOut()
			}
		})
	}
    
    biaoge.setCheckFun = function(fun){
       if(fun){
       	 biaoge.checkFun = fun
       }
    }
    biaoge.resetItemKey = function(list){
    	for (var i = 0; i < downNums; i++) {
			var item = biaoge[sprintf(downs, i + 1)]
			item.key = list[i]
		}
    }

    biaoge.resetInputKey = function(list){
    	inputKeys = list
	    if (answerShowKey && inputKeys && inputNum) {
			for (var i = 0; i < inputNum; i++) {
				var item = biaoge[sprintf(inputs, i + 1)]
				item.setStr(inputKeys[i])
			}
		}
    }

	if (biaoge.btn_upload) {
		biaoge.btn_upload.addClickEventListener(function() {
			if (biaoge.upLoadFun) {
				biaoge.upLoadFun()
			}
			if (!disJudgeInput) {
				for (var i = 0; i < inputNum; i++) {
					var item = biaoge[sprintf(inputs, i + 1)]
					var result = item.getStr()
					if (result != null && inputKeys[i] != null && result == inputKeys[i]) {
						if (item.setAnswer) {
							item.setAnswer(true)
						}
					} else {
						if (result != null && result.length > 0 && inputKeys[i] != null) {
							if (item.setAnswer) {
								item.setAnswer(false)
							}
						}
					}
				}
			}
			for (var i = 0; i < downNums; i++) {
				var item = biaoge[sprintf(downs, i + 1)]
				var down = item.down
				if (item && item.key != null && down.key != null && item.key == down.key) {
					if (down.setAnswer) {
						down.setAnswer(true)
					}
				} else {
					if (down.setAnswer && down.key != null && down.key != 0) {
						down.setAnswer(false)
					}
				}
			}

			var tempCheck = null
			var checkcount = 0
			for (var i = 0; i< checkBoxNum[0]; i++){
				tempCheck = "T"
				if(biaoge.checkAnswer[i] == null){
					checkcount++
				}
			    if(biaoge.checkAnswer[i] != null && biaoge.checkAnswer[i] != checkAnswers[i]){
			       tempCheck = "F"
                   break
			    }
			}
			if(checkBoxNum[0] != 0 && checkcount == checkBoxNum[0]){
                tempCheck = "AF"
			}
			if(tempCheck!=null){
				if (biaoge.checkFun) {
				   biaoge.checkFun(tempCheck)
			    }
			}
		})
	}

	biaoge.actClear = function() {
		if (biaoge.img_result) {
			biaoge.img_result.setVisible(false)
		}
		if (biaoge.img_result && !isShowResult) {
			biaoge.img_result.setVisible(false)
		}
		if(!overClear){
			for (var i = 1; i <= inputNum; i++) {
				var temp = biaoge[sprintf(inputs, i)]
				temp.clear(rootData[i - 1])
			}
		}
		for (var i = 1; i <= downNums; i++) {
			var temp = biaoge[sprintf(downs, i)].down
			if (temp) {
				temp.clear()
			}
		}
		if (biaoge.BackFun) {
			biaoge.BackFun()
		}
		if (biaoge.ClearFun) {
			biaoge.ClearFun()
		}
	}

	biaoge.setGouState = function(index, status) {
		var curItem = biaoge[sprintf(gous, index)]
		var curRes = status ? res.img_gou : res.img_cha
		var gou = new cc.Sprite(curRes)
		gou.setPosition(curItem.width / 2, curItem.height / 2)
		curItem.addChild(gou)
	}

	if (biaoge.btn_clear) {
		biaoge.btn_clear.addClickEventListener(function() {
			biaoge.actClear()
		})
	}



	var showOut = function() {
		var temp = this
		getLoopOp(temp)
		if (!temp.showing) {
			temp.showing = true
			temp.stopAllActions()
			switch (showType) {
				case "scale":
					addShowType({
						item: temp,
						show: "zoom",
						time: 0.3,
						fun: function() {
							temp.showing = false
							temp.close = true
							if (biaoge._showoutfun)
								biaoge._showoutfun()
							if (temp.removeListen) {
								temp.removeListen()
							}
						}
					})
					break
				case "fade":
					addShowType({
						item: temp,
						show: "moveBy",
						buf: cc.p(0, 60),
						time: 0.3
					})
					addShowType({
						item: temp,
						show: "fadeOut",
						time: 0.3,
						fun: function() {
							temp.showing = false
							temp.setScale(0)
							if (temp.removeListen) {
								temp.removeListen()
							}
							temp.close = true
						}
					})
					break
			}
		}
		if (CloseFun) {
			CloseFun()
		}
	}
	var showIn = function() {
		var temp = this
		if (!temp.isGetLoop) {
			temp.isGetLoop = true
			getLoopOp(temp)
		}
		setLoopOp(temp)
		if ((temp.close == null || temp.close) && !temp.showing) {
			temp.close = false
			temp.showing = true
			temp.setPosition(getMiddle())
			temp.setLocalZOrder(LOCAL_ORDER++)
			safeAdd(biaoge.getParent(), temp)
			temp.stopAllActions()
			switch (showType) {
				case "fade":
					temp.setPosition(getMiddle(0, -60))
					temp.setScale(temp.rootScale)
					addShowType({
						item: temp,
						show: "moveBy",
						buf: cc.p(0, 60),
						time: 0.3
					})
					addShowType({
						item: temp,
						show: "fadeIn",
						time: 0.3,
						fun: function(item) {
							item.showing = false
							createTouchEvent({
								item: item,
								autoMove: true,
								begin: function(data) {
									var item = data.item
									item.setLocalZOrder(LOCAL_ORDER++)
									return true
								}
							})
						}
					})
					break
				case "scale":
					addShowType({
						item: temp,
						show: "scale",
						time: 0.3,
						scale: temp.rootScale,
						fun: function(item) {
							if (biaoge._showInfun)
								biaoge._showInfun()
							item.showing = false
							createTouchEvent({
								item: item,
								autoMove: true,
								begin: function(data) {
									var item = data.item
									item.setLocalZOrder(LOCAL_ORDER++)
									if (judgeOrder)
										item.setLocalZOrder(1000)
									return true
								}
							})
						}
					})
					break
			}
		}
	}
	biaoge.showOut = showOut
	biaoge.showIn = showIn
	if (biaoge.bg_final) {
		biaoge.bg_final.showOut = showOut
		biaoge.bg_final.showIn = showIn
	}
	biaoge.setShowEndFun = function(data) {
		var data = data || {}
		var showInfun = data.in
		var showoutfun = data.out
		if (showInfun)
			biaoge._showInfun = showInfun
		if (showoutfun)
			biaoge._showoutfun = showoutfun
	}
	biaoge.show = function(data) { //表格弹出弹入
		if (biaoge.close) {
			biaoge.showIn()
		} else {
			biaoge.showOut()
		}
	}
	biaoge.getBg = function() {
		return biaoge.getChildByName("img_bg")
	}

	biaoge.getData = function() {
		var result = []
		for (var i = 1; i <= inputNum; i++) {
			var font = biaoge[sprintf(inputs, i)].input.getString()
			result.push(font)
		}
		return result
	}

	biaoge.getKey = function(key) {
		var item = biaoge[sprintf(inputs, key)]
		if (item) {
			return item.input.getString()
		}
	}

	biaoge.setBack = function(fun) {
		biaoge.BackFun = fun
	}
	biaoge.setClear = function(fun) {
		biaoge.ClearFun = fun
	}
	biaoge.setUpLoad = function(fun) {
		biaoge.upLoadFun = fun
	}
	if (biaoge.btn_close) {
		biaoge.btn_close.addClickEventListener(function() {
			biaoge.showOut()
		})
	}
	if (biaoge.img_result && !isShowResult) {
		biaoge.img_result.setVisible(false)
	}
	if (biaoge.bg_final) {
		biaoge.bg_final.setScale(0)
		biaoge.bg_final.rootpos = biaoge.bg_final.getPosition()
		biaoge.bg_final.close = true
	}
	biaoge.close = true
	biaoge.setLocalZOrder(LOCAL_ORDER++)
	return biaoge
}

function createTimeClock(data) {
	data = data || {}
	var pos = data.pos
	var font = data.font || "第%d天"
	var time = data.time || 12 //12秒一天
	var scale = data.scale || 0.3
	var fontSize = data.fontSize || 24
	var fontPos = data.fontPos || cc.p(100, 0)
	var start = data.start || 0 //第N天开始
	var node = new cc.Node()
	var dayCall = data.dayCall
	var hourCall = data.hourCall
	var getPoints = function(count) {
		var str = ""
		for (var i = 0; i < count; i++) {
			str = str + "."
		}
		return str
	}
	var clock = createClock({
		noSec: true,
		rate: 3600 * 24 / time,
		dayCall: function() {
			node.curDay++
				node.changeFont()
			if (dayCall) {
				dayCall({
					day: node.curDay,
				})
			}
		},
		hourCall: function() {
			node.count++
				if (node.count >= 6) {
					node.count = 1
				}
			node.changeFont()
			if (hourCall) {
				hourCall()
			}
		}
	})
	clock.setScale(scale)
	clock.changeStatus("start")
	safeAdd(node, clock)
	node.count = 1
	node.curDay = start
	var label = new cc.LabelTTF(sprintf(font, node.curDay), null, fontSize)
	label.setPosition(fontPos)
	label.setAnchorPoint(0, 0.5)
	safeAdd(node, label)
	node.font = label
	node.changeFont = function() {
		var base = sprintf(font, node.curDay)
		var points = getPoints(node.count)
		var final = sprintf("%s%s", base, points)
		node.font.setString(final)
	}
	return node
}

function createClock(data) { //创建时钟
	data = data || {}
	type = data.type || "normal"
	ifsound = data.ifsound || false
	ifsec = data.ifsec || false
	noSec = data.noSec || false
	rate = data.rate || 1 //旋转速率
	dayCall = data.dayCall
	hourCall = data.hourCall
	var ui_list = [
		"deco",
		"item_sz",
		"item_sz_red",
		"item_fz",
		"item_fz_red",
		"item_mz",
		"item_mz_red",
		"item_kd",
		"item_kd_red",
	]
	var node = null
	switch (type) {
		case "naozhong":
			node = loadNode(res.naozhong, ui_list, "bg")
			node.newBg = node.getChildByName("bg2")
			node.newBg.setVisible(false)
			break
		default:
			node = loadNode(res.clock, ui_list, "bg")
			break
	}

	node.redKey = [
		"sz",
		"fz",
		"mz",
		"kd",
	]
	node.redList = [
		"item_sz_red",
		"item_fz_red",
		"item_mz_red",
		"item_kd_red",
	]

	node.setGuideFunc = function(key, buf, fun) {
		if (key && fun) {
			node[sprintf("guideBuf%s", key)] = buf
			node[sprintf("guideFunc%s", key)] = fun
		}
	}

	node.init = function() {
		node.item_sz.rootRotate = node.item_sz.getRotationX()
		node.item_fz.rootRotate = node.item_fz.getRotationX()
		node.item_mz.rootRotate = node.item_mz.getRotationX()
		for (var i = 0; i < node.redList.length; i++) {
			var item = node[node.redList[i]]
			if (item) {
				item.setVisible(false)
			}
		}
		if (noSec) {
			node.item_mz.setVisible(false)
		}
		for (var i = 0; i < node.redKey.length; i++) {
			var temp = node[node.redList[i]]
			if (temp) {
				temp.myName = node.redKey[i]
				createTouchEvent({
					item: temp,
					begin: function(data) {
						var item = data.item
						if (!node.hasClick) {
							node.hasClick = true
							var fun = node[sprintf("guideFunc%s", item.myName)]
							var buf = node[sprintf("guideBuf%s", item.myName)]
							if (fun) {
								fun(buf)
							}
							return true
						}
						return false
					},
					end: function(data) {
						node.hasClick = false
					}
				})
			}
		}
	}
	node.init()

	node.setTime = function(time) {
		node.changeStatus("stop")
		node.item_sz.setRotation(time / 3600 / 12 * 360 + node.item_sz.rootRotate)
		node.item_fz.setRotation(time % 3600 / 60 / 60 * 360 + node.item_fz.rootRotate)
		node.item_mz.setRotation(time % 60 / 60 * 360 + node.item_mz.rootRotate)
	}
	node.getTime = function(ifStruct) {
		var hour = Math.floor(node.item_sz.getRotationX() % 360 / 360 * 12)
		var mins = Math.floor(node.item_fz.getRotationX() % 360 / 360 * 60)
		var second = node.item_mz.getRotationX() % 360 / 360 * 60
		if (ifStruct) {
			return {
				hour: hour,
				mins: mins,
				second: second,
			}
		} else {
			return hour * 3600 + mins * 60 + second
		}
	}

	node.showRed = function(key) { //对应的红色线展示
		var node = this
		for (var i = 0; i < node.redKey.length; i++) {
			if (key == node.redKey[i]) {
				node[node.redList[i]].setVisible(true)
			} else {
				node[node.redList[i]].setVisible(false)
			}
		}
	}

	node.changeStatus = function(statu) {
		var node = this
		for (var i = 0; i < node.status.length; i++) {
			if (statu == node.status[i][0]) {
				node.statu = statu
				node.status[i][1]()
				return
			}
		}
	}
	node.itemList = [
		"item_sz",
		"item_fz",
		"item_mz",
	]
	node.stopItem = function(key) {
		node[key].stopAllActions()
		node[key].setRotation(node[key].rootRotate)
	}
	node.stop = function() {
		for (var i = 0; i < node.itemList.length; i++) {
			node.stopItem(node.itemList[i])
		}
	}
	node.start = function() {
		addShowType({
			item: node.item_sz,
			show: "circle",
			time: 60 * 60 * 12 / rate,
			infun: function() {
				if (dayCall) {
					dayCall()
				}
			}
		})
		addShowType({
			item: node.item_fz,
			show: "circle",
			time: 60 * 60 / rate,
			infun: function() {
				if (hourCall) {
					hourCall()
				}
			}
		})
		if (!noSec) {
			if (ifsec) {
				node.item_mz.runAction(cc.repeatForever(
					cc.sequence(
						cc.delayTime(1 / rate),
						cc.callFunc(function() {
							node.item_mz.setRotation(node.item_mz.getRotationX() + 6)
							if (ifsound) {
								playEffect(res.sound_clock)
							}
						})
					)))
			} else {
				addShowType({
					item: node.item_mz,
					show: "rotateBy",
					time: 1 / rate,
					buf: 6,
					infun: function() {
						if (ifsound) {
							playEffect(res.sound_clock)
						}
					},
					repeat: cc.REPEAT_FOREVER,
				})
			}
		}
	}
	node.pause = function() {
		node.item_sz.pause()
		node.item_fz.pause()
		node.item_mz.pause()
	}
	node.resume = function() {
		node.item_sz.resume()
		node.item_fz.resume()
		node.item_mz.resume()
	}
	node.status = [
		["start", node.start],
		["stop", node.stop],
		["pause", node.pause],
		["resume", node.resume],
	]
	node.changeStatus("stop")
	return node
}

function createMatchEll() { //创建测试用椭圆
	var draw = new cc.DrawNode()
	var uiList = [
		"btn_a",
		"btn_b",
		"btn_move",
		"btn_print",
		"btn_rotate",
	]
	var node = loadNode(res.match, uiList)
	node.btn_a.addClickEventListener(function() {
		node.curChoose = "A"
	})
	node.btn_b.addClickEventListener(function() {
		node.curChoose = "B"
	})
	node.btn_move.addClickEventListener(function() {
		node.curChoose = "M"
	})
	node.btn_rotate.addClickEventListener(function() {
		node.curChoose = "R"
	})
	node.btn_print.addClickEventListener(function() {
		cc.log("A:", node.a)
		cc.log("B:", node.b)
		cc.log("R:", draw.getRotation())
		cc.log("P:", draw.getPosition())
	})
	draw.setPosition(getMiddle())
	CC_CURRENT_LAYER.addChild(node)
	CC_CURRENT_LAYER.addChild(draw)

	node.curChoose = "A"
	node.a = 100
	node.b = 100
	node.draw = draw

	node.drawEll = function() {
		var node = this
		drawEllipse({
			root: cc.p(0, 0),
			buf: getEllipsePoint({
				a: node.a,
				b: node.b,
				devide: 3,
			}),
			father: node.draw,
		})
	}
	node.drawEll()
	createTouchEvent({
		force: true,
		item: node,
		swallow: false,
		move: function(data) {
			var item = data.item
			var rootPos = data.pos
			var pos = draw.convertToNodeSpace(rootPos)
			switch (item.curChoose) {
				case "A":
					draw.clear()
					item.a = Math.abs(pos.x)
					node.drawEll()
					break
				case "B":
					draw.clear()
					item.b = Math.abs(pos.y)
					node.drawEll()
					break
				case "M":
					draw.setPosition(rootPos)
					break
				case "R":
					draw.setRotation(-getAngle(draw.getPosition(), rootPos))
					break
			}
		}
	})
}

function createTp(data) { //创建天平
	data = data || {}
	var noFama = data.noFama || false
	var addFun = data.addFun
	var teach = data.teach || false
	var teachFun = data.teachFun
	var teachFail = data.teachFail
	var balanceShu = data.balanceShu || false
	var balanceBcak = data.balanceBcak
	var uiList = [
		"img_ym",
		"img_rotate",
		"img_lm_left",
		"img_lm_right",
		"node_left",
		"node_right",
		"img_tp_left",
		"img_tp_right",
		"img_balance",
		"img_balance_shu"
	]
	var redList = [
		"dizuo_red",
		"fdp_red",
		"hl_red",
		"bc_red",
		"lmr_red",
		"lml_red",
		"zz_red",
		"tpl_red",
		"tpr_red",
		"ym_red"
	]

	var nameList = [
		"dz",
		"fdp",
		"hl",
		"bc",
		"phlm",
		"phlm",
		"zz",
		"tp",
		"tp",
		"ym"
	]

	var readLink = [
		"lmr_red",
		"lml_red",
		"tpl_red",
		"tpr_red",
	]
	var tp = loadNode(res.nodetp, uiList)
	loadList(tp, redList)
	for (var i = 0; i < redList.length; i++) {
		tp[redList[i]].setVisible(false)
		tp[redList[i]].teachName = nameList[i]
	}
	for (var i = 0; i < readLink.length; i++) {
		if (i % 2 == 0) {
			tp[readLink[i]].link = tp[readLink[i + 1]]
		} else {
			tp[readLink[i]].link = tp[readLink[i - 1]]
		}
	}
	tp.initTeach = function() { //初始化红色线
		var actTeach = function() {
			var item = this
			for (var i = 0; i < redList.length; i++) {
				tp[redList[i]].setVisible(false)
			}
			item.setVisible(true)
			if (item.link) {
				item.link.setVisible(true)
			}
			if (teachFun) {
				teachFun(item.teachName)
			}
		}
		for (var i = 0; i < redList.length; i++) {
			tp[redList[i]].actTeach = actTeach
			createTouchEvent({
				item: tp[redList[i]],
				begin: function(data) {
					var item = data.item
					item.actTeach()
					return true
				},
				beginfail: function(data) {
					var item = data.item
					item.setVisible(false)
					if (teachFail) {
						teachFail(item.teachName)
					}
					return false
				}
			})
		}
		tp.showTeach = function(judge) {
			for (var i = 0; i < redList.length; i++) {
				if (judge == tp[redList[i]].teachName) {
					tp[redList[i]].actTeach()
					break
				}
			}
		}
	}

	var pos = data.tppos || cc.p(440, 150)
	var famapos = data.famapos || cc.p(800, 150)
	var father = data.father || CC_CURRENT_LAYER
	var blanceModify = data.blanceModify || cc.p(0, 0)
	var balancepos = data.balancepos || "down"
	tp.setPosition(pos)
	tp.initControl = function() { //初始化所有控制函数
		var tp = this
		var s = tp.lmleft.getContentSize()
		createTouchEvent({
			item: tp.lmleft,
			rect: cc.rect(-s.width, -s.height, s.width * 3, s.height * 3), //触发区域九倍
			begin: function(data) {
				var target = data.item
				var pos = data.pos
				var locationInNode = target.convertToNodeSpace(pos)
				var rectdown = cc.rect(-s.width, -s.height, s.width * 3, s.height * 1.5)
				var recttop = cc.rect(-s.width, s.height / 2, s.width * 3, s.height * 1.5)
				if (cc.rectContainsPoint(rectdown, locationInNode)) {
					target.touch = "down"
					if (!target.down) {
						target.down = new cc.Sprite(res.img_arrow)
						target.down.setAnchorPoint(0.5, 0.5)
						target.down.setScale(0.4)
						switch (target.name) {
							case "left":
								target.down.setPosition(5, 0)
								break
							case "right":
								target.down.setPosition(35, 0)
								break
						}
						target.addChild(target.down)
					} else {
						target.down.setVisible(true)
					}
					return true;
				}
				if (cc.rectContainsPoint(recttop, locationInNode)) {
					target.touch = "top"
					if (!target.top) {
						target.top = new cc.Sprite(res.img_arrow)
						target.top.setAnchorPoint(0.5, 0.5)
						target.top.setScale(0.4)
						target.top.setFlippedX(true)
						target.addChild(target.top)
						switch (target.name) {
							case "left":
								target.top.setPosition(5, 30)
								break
							case "right":
								target.top.setPosition(35, 30)
								break
						}
					} else {
						target.top.setVisible(true)
					}
					return true;
				}
				return false
			},
			end: function(data) {
				var target = data.item
				var pos = data.pos
				var count = 1
				if (target.name == "left") {
					if (target.touch == "down") {
						target.down.setVisible(false)
						count = 1
					} else {
						target.top.setVisible(false)
						count = -1
					}
				} else {
					if (target.touch == "down") {
						target.down.setVisible(false)
						count = -1
					} else {
						target.top.setVisible(false)
						count = 1
					}
				}
				tp.moveLm({
					lm: target.name,
					count: count,
				})
				tp.UpdateBalance()
			},
		})
		copyEvent(tp.lmleft, tp.lmright)
		var sizeYm = tp.youma.getContentSize()
		createTouchEvent({
			item: tp.youma,
			rect: cc.rect(-sizeYm.width, -sizeYm.height / 2, sizeYm.width * 3, sizeYm.height * 2),
			move: function(data) {
				var target = data.item
				var delta = data.delta
				if (tp.moveYm(delta.x)) {
					tp.UpdateBalance()
				}
			},
		})

		createTouchEvent({
			item: tp.niezi,
			begin: function(data) {
				var item = data.item
				var pos = data.pos
				if (tp.BALANCE) {
					if (item.isVisible()) {
						item.setVisible(false)
						if (!item.gray) {
							var gray = new cc.Sprite(res.img_niezi_gray)
							gray.setAnchorPoint(0.7, 0.7)
							father.addChild(gray)
							item.gray = gray
						}
						var gray = item.gray
						gray.setPosition(pos)
						gray.setVisible(true)
						return true;
					} else {
						return false
					}
				} else {
					tp.showAlarm(0)
				}
			},
			move: function(data) {
				var item = data.item
				var pos = data.pos
				var delta = data.delta
				item.gray.x += delta.x
				item.gray.y += delta.y
			},
			end: function(data) {
				var item = data.item
				var pos = data.pos
				var finalpos = getAnchor({
					item: item.gray,
					pos: pos,
					anchor: cc.p(0.1, 0.2),
				})
				var target = judgeFama(finalpos)
				if (!target) {
					item.gray.setVisible(false)
					item.setVisible(true)
				} else {
					var weight = target.weight
					switch (target.type) {
						case "in":
							var fama = new cc.Sprite(res[sprintf("img_fama_%d", weight)])
							fama.setPosition(finalpos)
							father.addChild(fama)
							fama.link = target
							target.link = fama
							fama.type = "in"
							fama.weight = weight
							target.setVisible(false)
							item.setVisible(false)
							item.gray.setVisible(false)
							tp.niezijia.setPosition(fama.getContentSize().width / 4, fama.getContentSize().height / 2)
							safeAdd(fama, tp.niezijia)
							break
						case "out":
							target.retain()
							var final = target.getParent().convertToWorldSpace(target.getPosition())
							target.removeFromParent(false)
							father.addChild(target)
							target.setPosition(final)
							target.release()
							tp.niezijia.setPosition(target.getContentSize().width / 4, target.getContentSize().height / 2)
							safeAdd(target, tp.niezijia)
							item.gray.setVisible(false)
							item.setVisible(false)
							tp.addWeight(null, -target.weight)
							tp.followRight[target.key] = null
							tp.UpdateBalance()
							break
					}
				}
			}
		})

		createTouchEvent({
			item: tp.niezijia,
			begin: function(data) {
				var item = data.item
				var pos = data.pos
				if (item.isVisible()) {
					return true
				} else {
					return false
				}
			},
			move: function(data) {
				var item = data.item
				var delta = data.delta
				var par = item.getParent()
				if (par) {
					par.x += delta.x
					par.y += delta.y
				}
			},
			end: function(data) {
				var item = data.item
				var pos = data.pos
				var par = item.getParent()
				pos = par.getPosition()
				var back = function() {
					par.link.setVisible(true)
					tp.niezijia.removeFromParent(false)
					par.removeFromParent(true)
					tp.niezi.setVisible(true)

				}
				var success = function() {
					tp.niezijia.removeFromParent(false)
					tp.niezi.setVisible(true)
				}
				if (judgeIn(tp.tpleft, pos, cc.p(0, 1.2))) {
					tp.showAlarm(1)
					back()
				} else if (judgeIn(tp.tpright, pos, cc.p(0, 1.2))) {
					var target = par.link
					if (!tp.followRight[target.key]) {
						var temp = par
						tp.followRight[target.key] = temp
						temp.retain()
						temp.setPosition(target.rootPos)
						temp.rootPos = target.rootPos
						temp.setLocalZOrder(target.order)
						temp.removeFromParent(false)
						temp.link = target
						temp.key = target.key
						temp.weight = target.weight
						tp.tpright.addChild(temp)
						temp.release()
						tp.addWeight(null, target.weight)
						tp.UpdateBalance()
						success()
					}
				} else {
					back()
				}
			}
		})
		createTouchEvent({
			item: tp.famahe,
			begin: function() {
				if (!tp.BALANCE) {
					tp.showAlarm(0)
				}
			},
		})
	}
	tp.showAlarm = function(index) { //展示提示
		var dia = res[sprintf("tp_tip%d", index + 1)]
		AddDialog("Tips", {
			res: dia,
			face: 2,
		})
	}
	tp.randomInit = function() { //随机初始化
		//随机初始化天平
		var tp = this
		var max = tp.lmmaxmove / tp.lmpermove
		tp.moveLm({
			lm: "left",
			count: Math.floor(Math.random() * max)
		})
		tp.moveLm({
			lm: "right",
			count: Math.floor(Math.random() * max)
		})
		tp.moveYm(Math.random() * 230)
		tp.UpdateBalance()
	}
	tp.moveYm = function(dis) {
		var tp = this
		var temp = tp.youma.getPositionX() + dis
		if (temp >= tp.youmaMin && temp <= tp.youmaMax) {
			tp.youma.setPositionX(temp)
			tp.addWeight(null, dis * tp.youmaPer)
			return true
		} else if (temp < tp.youmaMin) {
			dis = tp.youmaMin - tp.youma.getPositionX()
			tp.youma.setPositionX(tp.youmaMin)
			tp.addWeight(null, dis * tp.youmaPer)
			return true
		}
	}
	tp.moveLm = function(data) {
		var tp = this
		var lm = data.lm
		var count = data.count
		var par = null
		var item = null
		switch (lm) {
			case "left":
				item = tp.lmleft
				par = 1
				break
			case "right":
				item = tp.lmright
				par = -1
				break
		}
		var temp = item.count + count
		var max = tp.lmmaxmove / tp.lmpermove
		if (temp >= 0 && temp <= max) {
			//可以移动
			item.count = temp
		} else if (temp < 0) {
			count = item.count
			item.count = 0
		} else if (temp > max) {
			count = max - item.count
			item.count = max
		}
		item.x += (count * tp.lmpermove * par)
		if (par == 1) {
			tp.addWeight(null, count * tp.perlm)
		} else {
			tp.addWeight(count * tp.perlm, null)
		}
	}
	tp.UpdateBalance = function() {
		var tp = this
		var dix = tp.weights.right - tp.weights.left
		var par = dix > 0 ? 1 : -1
		var per = 1
		var act = true
		var mix = 0
		var result = {}
		dix = Math.abs(dix)
		if (!(dix >= tp.startRotate)) {
			per = dix / tp.startRotate
		}
		tp.rotate.stopAllActions()
		tp.nodeleft.stopAllActions()
		tp.noderight.stopAllActions()
		var shakes = [{
			per: 0.1,
			time: 0.1
		}, {
			per: -0.1,
			time: 0.1
		}, {
			per: 0.05,
			time: 0.05
		}, {
			per: -0.05,
			time: 0.05
		}, {
			per: 0,
			time: 0.03
		}, ]
		var balanceFun = function(call) {
			if (call && (tp.BALANCE || tp.youma.getPositionX() <= tp.youmaMin + 0.01)) { //允许的误差值
				var mix = Math.abs(tp.weights.left - tp.weights.right)
				if (mix <= 0.03) {
					tp.BALANCE = true
					if (balanceShu) {
						tp.img_balance_shu.setVisible(true)
					} else {
						tp.img_balance.setVisible(true)
					}
					if (balanceBcak) {
						cc.log("天平已平衡 回调balanceBcak")
						balanceBcak()
					}
				}
			}
		}
		if (tp.rotate.getRotation() == tp.maxRotate * par * per) {
			act = false
		} else {
			mix = (tp.rotate.getRotation() - tp.maxRotate * par * per) / 10
		}
		tp.rotate.current = 0
		tp.nodeleft.current = 0
		tp.noderight.current = 0
		var runloop = function(item, index, call) {
			call = call || false
			var show = (index == 0) ? "rotateTo" : "moveBy"
			var time = shakes[item.current].time
			var buf = null
			switch (index) {
				case 0:
					buf = tp.maxRotate * par * (per + mix * shakes[item.current].per)
					break
				case 1:
					buf = cc.p(0, tp.maxDis * par * (per + mix * shakes[item.current].per) + tp.rooty - item.getPositionY())
					break
				case 2:
					buf = cc.p(0, tp.maxDis * par * -1 * (per + mix * shakes[item.current].per) + tp.rooty - item.getPositionY())
					break
			}
			addShowType({
				item: item,
				show: show,
				time: time,
				buf: buf,
				fun: function(item) {
					item.current++
						if (shakes[item.current]) {
							runloop(item, index, call)
						} else {
							tp.Updating = false
							balanceFun(call)
						}
				}
			})
		}
		if (act) {
			tp.Updating = true
			runloop(tp.rotate, 0, true)
			runloop(tp.nodeleft, 1)
			runloop(tp.noderight, 2)
		}
	}
	tp.addWeight = function(left, right) {
		var tp = this
		if (left != null) {
			tp.weights.left += left
		}
		if (right != null) {
			tp.weights.right += right
		}
	}
	tp.addItem = function(data) { //添加对象 外部调用
		var tp = this
		tp.tpleft.addItem(data)
		tp.tpright.addItem(data)
	}
	tp.disWeight = function(weight, tri) { //拿下重量 默认拿下左边的
		var tp = this
		tri = tri || "left"
		switch (tri) {
			case "right":
				tp.addWeight(null, -weight)
				break
			case "left":
				tp.addWeight(-weight, null)
				break
		}
		tp.UpdateBalance()
	}
	tp.init = function() {
		var tp = this
		tp.ym = tp.img_ym
		tp.rotate = tp.img_rotate
		tp.lmleft = tp.img_lm_left
		tp.lmright = tp.img_lm_right
		tp.nodeleft = tp.node_left
		tp.noderight = tp.node_right
		tp.tpleft = tp.img_tp_left
		tp.tpright = tp.img_tp_right
		tp.youma = tp.img_ym
		tp.addFun = addFun
		tp.lmleft.count = 0
		tp.lmleft.name = "left"
		tp.lmright.count = 0
		tp.lmright.name = "right"
		tp.maxRotate = 7 //最大旋转角度
		tp.maxDis = 20 //最大垂直位移
		tp.startRotate = 0.5 //开始偏移的差值
		tp.perlm = 0.05 //每次移动螺母造成的重量差
		tp.rooty = tp.node_left.getPositionY()
		tp.lmleftmin = tp.lmleft.getPositionX()
		tp.lmrightmax = tp.lmright.getPositionX()
		tp.youmaMin = tp.youma.getPositionX() //游码最小位置
		tp.youmaMax = tp.youmaMin + 230 //最大位置
		tp.youmaPer = 5 / 230 //每个位置代表质量
		tp.lmmaxmove = 36 //螺母最大偏移
		tp.lmpermove = 3 //螺母每次移动偏移
		tp.img_balance.setVisible(false)
		tp.img_balance_shu.setVisible(false)
		if (balancepos == "up") {
			tp.img_balance.setPosition(25, 380)
		} else {
			tp.img_balance.setPosition(cc.p(tp.img_balance.getPositionX() + blanceModify.x, tp.img_balance.getPositionY() + blanceModify.y))
		}
		tp.followRight = {}
		tp.followLeft = {}
		tp.weights = {
			left: 0.0,
			right: 0.0,
		}
		var addItem = function(data) {
			var node = this
			var weight = data.weight
			var item = data.item
			var type = data.type || "normal"
			var pos = data.pos
			var safeAddBack = data.safeAddBack
			if (judgeIn(node, pos, cc.p(0, 4.5)) && !node.noneAdd) {
				if (!tp.BALANCE) {
					tp.showAlarm(0)
					return
				}
				if (type != "both" && type != node.type) {
					tp.showAlarm(node.alarm)
				} else {
					if (type != "fama") {
						if (addFun) {
							addFun({
								item: item,
								pos: pos,
							})
						}
						item.curSide = node == tp.tpleft ? "left" : "right"
					}
					safeAdd(node, item)
					if (safeAddBack) {
						safeAddBack()
					}
					if (node == tp.tpleft) {
						tp.addWeight(weight, null)
					} else {
						tp.addWeight(null, weight)
					}
					tp.UpdateBalance()
				}
			}
		}
		tp.tpleft.addItem = addItem
		tp.tpleft.type = "normal"
		tp.tpleft.alarm = 1
		tp.tpright.addItem = addItem
		tp.tpright.type = "fama"
		tp.tpright.alarm = 2
		if (!teach) {
			tp.initControl()
			tp.randomInit()
		} else {
			tp.initTeach()
		}
	}
	var famalist = [
		"img_5g",
		"img_10g",
		"img_20g_1",
		"img_20g_2",
		"img_50g",
		"img_100g",
	]
	tp.famalist = famalist
	famalist.push("img_nz")
	var fama = loadNode(res.nodefm, famalist, "bg")
	tp.niezi = fama.img_nz
	tp.niezijia = new cc.Sprite(res.img_niezi_jia)
	tp.niezijia.retain()
	tp.famahe = fama
	tp.niezijia.setAnchorPoint(0, 0)
	tp.famalist = [{
		weight: 5,
		item: fama.img_5g,
		key: "5g",
		root: cc.p(80, 30),
		order: 6
	}, {
		weight: 10,
		item: fama.img_10g,
		key: "10g",
		root: cc.p(110, 40),
		order: 5
	}, {
		weight: 20,
		item: fama.img_20g_1,
		key: "20g1",
		root: cc.p(140, 50),
		order: 4
	}, {
		weight: 20,
		item: fama.img_20g_2,
		key: "20g2",
		root: cc.p(60, 50),
		order: 3
	}, {
		weight: 50,
		item: fama.img_50g,
		key: "50g",
		root: cc.p(90, 60),
		order: 2
	}, {
		weight: 100,
		item: fama.img_100g,
		key: "100g",
		root: cc.p(120, 70),
		order: 1
	}, ]
	fama.setPosition(famapos)
	var judgeFama = function(pos) {
		for (var i = 0; i < tp.famalist.length; i++) {
			var item = tp.famalist[i]
			item.item.weight = item.weight
			item.item.key = item.key
			item.item.rootPos = item.root
			item.item.order = item.order
			var target = item.item
			target.type = "in"
			var s = target.getContentSize()
			var local = target.convertToNodeSpace(pos)
			var rect = cc.rect(-s.width * 0.1, -s.height * 0.1, s.width * 1.2, s.height * 1.2)
			if (target.isVisible() && cc.rectContainsPoint(rect, local)) {
				return target
			}
		}
		for (var key in tp.followRight) {
			var item = tp.followRight[key]
			if (item) {
				var s = item.getContentSize()
				var local = item.convertToNodeSpace(pos)
				var rect = cc.rect(0, 0, s.width, s.height)
				item.type = "out"
				if (cc.rectContainsPoint(rect, local)) {
					return item
				}
			}
		}
	}
	tp.BALANCE = false
	tp.init()
	if (!noFama) {
		father.addChild(fama)
	}
	father.addChild(tp)

	//天平用例 拷贝到任意界面即可
	// var tp = createTp({
	//            father: self,
	//            addFun: function(data) {
	//                var item = data.item
	//                item.setPosition(0, 0)
	//                item.inTp = true
	//            },
	//        })
	//        var item = new cc.Sprite(res.img_exp1)
	//        item.setPosition(getMiddle())
	//        createTouchEvent({
	//            item: item,
	//            begin:function(data){
	//                var item = data.item
	//                var pos = data.pos
	//                if(item.inTp){
	//                    cc.log("fuck me !11")
	//                    item.inTp = false
	//                    tp.disWeight(10)
	//                    item.setPosition(pos)
	//                    safeAdd(self, item)
	//                }
	//                return true
	//            },
	//            move: function(data) {
	//                var item = data.item
	//                var delta = data.delta
	//                item.x += delta.x
	//                item.y += delta.y
	//            },
	//            end: function(data) {
	//                data.weight = 10
	//                tp.addItem(data)
	//            }
	//        })
	//        safeAdd(self, item)
	return tp
}

function createJJD(data) { //创建酒精灯
	loadPlist("hcfire")
	loadPlist("dgtq")
	loadPlist("jjhy")
	data = data || {}
	var pos = data.pos || getMiddle()
	var father = data.father
	var fun = data.fun
	var doSomeFun = data.doSomeFun
	var closeFireFun = data.closeFireFun
	var staticDg = data.staticDg || false
	var scale = data.scale || 1
	var dgFlag = data.dgFlag || false //是否重新设置灯盖的位置
	var dgPos = data.dgPos //灯盖坐标
	var jjd = new cc.Sprite(res.img_jjd)
	var sp = jjd
	jjd.setScale(scale)
	var dg = new ccui.ImageView(res.img_dg)
	var size = sp.getContentSize()
	dg.setPosition(size.width * 0.52, size.height * 0.85)
	dg.rootPos = cc.p(size.width * 0.52, size.height * 0.85)
	sp.addChild(dg)
	sp.dg = dg
	var dataControl = {}
	dg.state = "DOWN"
	var judgeBeforeDgFun = data.judgeBeforeDgFun //此方法用于判断提示点燃酒精灯之前请做其他操作

	var TAG_HC = 520
	var TAG_JJHY = 521
	var anihcfire = function() {
		return cc.repeatForever(createAnimation({
			frame: "hcfire%02d.png",
			end: 9
		}))
	}
	var anijjhy = function() {
		return cc.repeatForever(createAnimation({
			frame: "jjhy%02d.png",
			end: 10
		}))
	}
	var anidgtq = function(fun, rever) {
		return cc.sequence(createAnimation({
			frame: "dgtq%02d.png",
			end: 13,
			time: 0.05,
			rever: rever,
		}), cc.callFunc(function() {
			if (fun) {
				fun()
			}
		}))
	}

	jjd.canClick = true

	jjd.setCanClick = function(judge) {
		jjd.canClick = judge
	}

	jjd.onlyFire = function() {
		var tfire = new cc.Sprite()
		tfire.runAction(anijjhy())
		tfire.setTag(TAG_JJHY)
		dataControl.fire = tfire
		var xinfire = new cc.Sprite()
		xinfire.setPosition(18, 32)
		xinfire.setScale(1.5, 1)
		xinfire.setOpacity(200)
		xinfire.runAction(anihcfire())
		tfire.addChild(xinfire)
		tfire.setPosition(65, 150)
		jjd.addChild(tfire)
		dg.setVisible(false)
		this.setCanClick(false)
	}

	jjd.setCallBack = function(data) {
		var up = data.up
		var down = data.down
		var fire = data.fire
		var cutFire = data.cutFire
		jjd.upFunc = up
		jjd.downFunc = down
		jjd.fireFunc = fire
		jjd.cutFireFunc = cutFire
	}

	jjd.exeDown = function() {
		var target = dg
		var node = new cc.Sprite()
		node.setAnchorPoint(0, 0)
		node.setPositionX(-6)
		target.setOpacity(0)
		if (target.state == "UP") {
			dataControl.dianran = false
			if (sp.getChildByTag(TAG_HC)) {
				sp.removeChildByTag(TAG_HC)
			}
			if (sp.getChildByTag(TAG_JJHY)) {
				sp.removeChildByTag(TAG_JJHY)
			}
			if (!staticDg) {
				target.setPosition(target.rootPos)
			} else {
				safeAdd(jjd, target)
				target.setPosition(target.rootPos)
			}
			node.runAction(anidgtq(function() {
				node.removeFromParent(true)
				target.setOpacity(255)
				target.state = "DOWN"
			}, true))
			target.addChild(node)
			if (jjd.downFunc) {
				jjd.downFunc()
			}
			if (jjd.isFire) {
				if (jjd.cutFireFunc) {
					jjd.cutFireFunc()
				}
			}
			jjd.isFire = false
		}
	}

	createTouchEvent({
		item: dg,
		begin: function(data) {
			if (!jjd.canClick) {
				if (judgeBeforeDgFun)
					judgeBeforeDgFun()
				return false
			}
			var target = data.item
			if (!target.noTouch) {
				target.noTouch = true
				var node = new cc.Sprite()
				node.setAnchorPoint(0, 0)
				node.setPositionX(-6)
				target.setOpacity(0)
				switch (target.state) {
					case "DOWN":
						node.runAction(anidgtq(function() {
							node.removeFromParent(true)
							target.setOpacity(255)
							if (!staticDg) {
								target.setPosition(200, 50)
								if (dgFlag)
									target.setPosition(dgPos)
							} else {
								safeAdd(jjd.getParent(), target)
								target.setPosition(jjd.x + 150, jjd.y - 25)
							}
							target.state = "UP"
							var hc = new ccui.ImageView(res.img_hc)
							hc.setPosition(200, 145)
							if (dgPos) //重新修改火柴的位置
								hc.setPosition(150, 145)
							var tnode = new cc.Sprite()
							tnode.runAction(anihcfire())
							tnode.setPosition(8, 19)
							hc.setTag(TAG_HC)
							hc.addChild(tnode)
							sp.addChild(hc)
							jjd.isFire = false
							createTouchEvent({
								item: hc,
								begin: function(data) {
									var target = data.item
									addShowType({
										item: target,
										show: "moveTo",
										time: 0.6,
										fun: function(item) {
											var tfire = new cc.Sprite()
											var xinfire = new cc.Sprite()
											xinfire.setPosition(18, 32)
											xinfire.setScale(1.5, 1)
											xinfire.setOpacity(200)
											xinfire.runAction(anihcfire())
											tfire.addChild(xinfire)
											tfire.runAction(anijjhy())
											tfire.setTag(TAG_JJHY)
											dataControl.fire = tfire
											tfire.setPosition(65, 150)
											if(doSomeFun){
												doSomeFun(tfire)
											}
											dataControl.dianran = true
											sp.addChild(tfire)
											if (jjd.fireFunc) {
												jjd.fireFunc()
											}
											item.removeFromParent(true)
											if (fun) {
												fun()
											}
											jjd.isFire = true
										},
										buf: cc.p(95, 145)
									})
									return true
								}
							})
							target.noTouch = false
							if (jjd.upFunc) {
								jjd.upFunc()
							}
						}))
						target.addChild(node)
							// if (jjd.upFunc) {
							// 	jjd.upFunc()
							// }
						break
					case "UP":
						dataControl.dianran = false
						if (sp.getChildByTag(TAG_HC)) {
							sp.removeChildByTag(TAG_HC)
						}
						if (sp.getChildByTag(TAG_JJHY)) {
							sp.removeChildByTag(TAG_JJHY)
						}
						if (!staticDg) {
							target.setPosition(target.rootPos)
						} else {
							safeAdd(jjd, target)
							target.setPosition(target.rootPos)
						}
						target.runAction(cc.sequence(
							cc.delayTime(0.08),
							cc.callFunc(function(){
								if(closeFireFun){
									closeFireFun()
								}
							})
						))
						node.runAction(anidgtq(function() {
							node.removeFromParent(true)
							target.setOpacity(255)
							target.state = "DOWN"
							target.noTouch = false
							if (jjd.downFunc) {
								jjd.downFunc()
							}
							if (jjd.isFire) {
								if (jjd.cutFireFunc) {
									jjd.cutFireFunc()
								}
							}
						}, true))
						target.addChild(node)

						// if (jjd.downFunc) {
						// 	jjd.downFunc()
						// }
						// if (jjd.isFire) {
						// 	if (jjd.cutFireFunc) {
						// 		jjd.cutFireFunc()
						// 	}
						// }
						jjd.isFire = false
						break
				}
			}
			return true
		}
	})
	if (father) {
		father.addChild(jjd)
	}
	if (pos) {
		jjd.setPosition(pos)
	}
	jjd.getFirePos = function() {
		if (dataControl.dianran) {
			var fire = dataControl.fire
			var size = fire.getContentSize()
			var pos = cc.p(size.width / 2, size.height)
			pos = fire.convertToWorldSpace(pos)
			return pos
		}
		return null
	}
	return jjd
}

function createHand(data) {
	data = data || {}
	var item = data.item
	var flip = data.flip || false
	var uiList = [
		"item",
		"back",
		"front",
	]
	var hand = loadNode(res.hand, uiList, "bg")
	if (item) {
		safeAdd(hand.item, item)
	}
	if (flip) {
		hand.setFlippedX(true)
		hand.setRotation(-hand.getRotationX())
	}
	return hand
}

function createNiezi(data) {
	data = data || {}
	var item = data.item
	var flip = data.flip || false
	var uilist = [
		"item",
	]
	var niezi = loadNode(res.item_niezi, uilist, "bg")
	if (item) {
		safeAdd(niezi.item, item)
	}
	if (flip) {
		niezi.setFlippedX(true)
		niezi.setRotation(-niezi.getRotationX())
	}
	return niezi
}

function createWater(data) {
	var key = data.key || "cold"
	var nogas = data.nogas || false
	var uilist = [
		"hot",
		"cold",
	]
	var bg = loadNode(res.item_water, uilist, "bg")
	switch (key) {
		case "cold":
			bg.hot.setVisible(false)
			break
		case "hot":
			bg.cold.setVisible(false)
			break
		default:
			cc.log("wrong water key was called. only hot and cold supported")
			break
	}
	if (key == "hot" && !nogas) {
		var air = createWaterAir()
		air.setLocalZOrder(-1)
		air.setPosition(bg.width / 2 - 10, bg.height * 0.65)
		safeAdd(bg, air)
	}
	return bg
}

function createSmell(data) { //创建小孩吸气的动画
	var pos = data.pos || getMiddle()
	var fun = data.fun
	var repeat = data.repeat || 6
	var saykey = data.saykey || repeat
	var father = data.father
	var key = data.key || "cj"
	var delay = data.delay || 1.5
	var scale = data.scale || 1
	var keyList = [
		["cj", 1],
		["sz", 2],
	]
	for (var i = 0; i < keyList.length; i++) {
		if (keyList[i][0] == key) {
			key = keyList[i][1]
			break
		}
	}
	var uiList = [
		"hand",
		"font",
		"back",
		"btn_close",
	]

	var man = loadNode(res.smell, uiList, "bg")
	man.act = function() {
		var man = this
		var buf = man.show ? "zoom" : "scale"
		addShowType({
			item: man.back,
			show: buf,
			time: 0.3,
			fun: function() {
				man.show = !man.show
			}
		})
	}
	man.dis = function(judge) {
		judge = judge || false
		var man = this
		man.stopAllActions()
		addShowType({
			item: man,
			show: "fadeOut",
			time: 0.3,
			fun: function(item) {
				item.removeFromParent(!judge)
			}
		})
	}
	man.init = function() {
		var man = this
		man.back.setScale(0)
		man.show = false
		man.setPosition(pos)
		man.setScale(scale)
		if (father) {
			safeAdd(father, man)
		}
		var ani = cc.sequence(cc.repeat(createAnimation({
			frame: "img_smell_%02d.png",
			start: 1,
			end: 8,
			time: 0.05,
		}), repeat), cc.callFunc(function() {
			man.act()
			if (fun) {
				fun()
			}
		}), cc.delayTime(delay), cc.callFunc(function() {
			man.dis()
		}))
		man.btn_close.addClickEventListener(function() {
			man.dis()
		})
		man.hand.runAction(ani)
		man.font.setSpriteFrame(sprintf("img_smell_font%d.png", key))
	}
	man.init()
	return man
}

//创建水的滴瓶
function createDiWater(data) {
	var data = data || {}
	var pos = data.pos || cc.p(220, 150)
	var father = data.father
	var rect = data.rect
	var sp = data.sp
	var nodescale = data.nodescale || 1
	var offsetY = data.offsetY
	var offsetX = data.offsetX
	var pullback = data.pullback
	var pullMidFun = data.pullMidFun
	cc.assert(res.diwater, "please copy plist and png from zdgc to your exp")
	loadPlist("diwater")
	loadPlist("pull")

	var node = new cc.Node()
	node.setPosition(pos)
	if (father)
		father.addChild(node)
	node.setScale(nodescale)

	var di = new cc.Sprite("#di.png")
	di.y = 80
	di.initpos = di.getPosition()
	node.addChild(di, 1)
	node.di = di
	node.gaiClick = true
	var dimao = new cc.Sprite("#gaizi.png")
	dimao.y = 180
	dimao.initpos = dimao.getPosition()
	dimao.setOpacity(0)
	node.addChild(dimao, 2)
	node.dimao = dimao
	dimao.initpos = dimao.getPosition()
	var bei = new cc.Sprite("#cup.png")
	node.addChild(bei, 3)
	dimao.state = "in"

	dimao.inrect = cc.rect(-4, 300, 8, 50)

	var dimaotouch = new cc.Sprite("#gaizi.png")
	dimaotouch.setPosition(111, 53)
	dimaotouch.setScale(9.7, 2.4)
	dimaotouch.setOpacity(0)
	dimao.addChild(dimaotouch)
	node.flag = true

	node.setAllnosee = function() {
		di.setVisible(false)
		dimao.setVisible(false)
		di.setPosition(0, -1000)
		dimao.setPosition(0, -1000)
	}
	node.init = function() {
		di.setVisible(true)
		dimao.setVisible(true)
		di.setPosition(di.initpos)
		cc.log("fuck...", dimao.initpos)
		dimao.setPosition(dimao.initpos)
		if (dimao.water)
			dimao.water.removeFromParent()
		dimao.disListen(false)
		dimaotouch.disListen(true)
		dimao.state = "in"
	}
	node.setGaiClick = function(jude, fun) {
		node.gaiClick = jude
		node.warnfun = fun
	}

	node.pullWater = function() {
		var pullwater = new cc.Sprite()
		pullwater.runAction(
			cc.sequence(createAnimation({
					start: 0,
					frame: "pull%02d.png",
					end: 37,
					time: 0.05,
				}),
				cc.callFunc(function() {

					node.init()
					pullwater.removeFromParent()
					if (pullback)
						pullback()
				})
			))
		pullwater.setScale(1.4)
		pullwater.setPosition(sp.x + offsetX, sp.y + offsetY)
		father.addChild(pullwater)
	}

	dimao.pushWater = function() {
		var water = new cc.Sprite()
		water.runAction(
			createAnimation({
				frame: "push%02d.png",
				end: 9,
				time: 0.05
			})
		)
		water.setScale(0.87)
		water.setPosition(107, -40)
		this.water = water
		this.addChild(water)
	}

	createTouchEvent({
		item: dimaotouch,
		swallow: false,
		begin: function(data) {
			cc.log("1111111111")
			return true
		},
		move: function(data) {
			var item = data.item
			var delta = data.delta
			var father = item.getParent()
			var tempx = father.x + delta.x
			var tempy = father.y + delta.y
			if (father.state == "in" && father.y <= 300) {
				tempx = 0
				if (tempy <= 180) {
					tempy = father.y
					return
				}
			}
			if (father.y > 310) {
				father.state = "out"
				father.setLocalZOrder(10)
			}

			if (father.y >= 290 && father.y <= 310 && father.x >= -4 && father.x <= 4) {
				father.state = "in"
				father.setLocalZOrder(1)
			}

			father.x = tempx
			father.y = tempy

			var worldpos = node.convertToWorldSpace(dimao.getPosition())
			if (cc.rectContainsPoint(rect, worldpos)) {
				node.pullWater()
				if (pullMidFun)
					pullMidFun()
				node.setAllnosee()
			}
		},
		end: function(data) {
			var item = data.item
			var father = item.getParent()
			if (father.state == "in") {
				node.init()
			}
		}
	})
	dimaotouch.disListen(true)


	createTouchEvent({
		item: dimao,
		begin: function(data) {
			if (!node.gaiClick) {
				if (node.warnfun)
					node.warnfun()
				return false
			}
			var item = data.item
			node.di.setVisible(false)
			item.pushWater()
			return true
		},
		move: function(data) {
			var item = data.item
			var delta = data.delta
			var tempx = item.x + delta.x
			var tempy = item.y + delta.y
			if (item.state == "in" && item.y <= 300) {
				tempx = 0
				item.setLocalZOrder(1)
				cc.log("fff", item.y)
				if (tempy <= 179) {
					tempy = item.y + 1
					return
				}
			}
			if (item.y > 310) {
				item.state = "out"
				item.setLocalZOrder(100)
			}

			if (item.y >= 290 && item.y <= 310 && item.x >= -4 && item.x <= 4) {
				item.state = "in"
				item.setLocalZOrder(1)
			}
			item.x = tempx
			item.y = tempy

			var worldpos = item.getParent().convertToWorldSpace(item.getPosition())
			if (cc.rectContainsPoint(rect, worldpos)) {
				node.pullWater()
				if (pullMidFun)
					pullMidFun()
				node.setAllnosee()
			}
		},
		end: function(data) {
			var item = data.item
			if (item.state == "in") {
				node.di.setVisible(true)
				if (item.water) {
					item.water.removeFromParent()
					item.water = null
				}

				item.setPosition(item.initpos)
			}
			if (item.state == "out") {
				item.disListen(true)
				dimaotouch.disListen(false)
			}
		}
	})

	return node

}

//创建碘酒的滴瓶
function createIWater(data) {
	var data = data || {}
	var pos = data.pos || cc.p(220, 150)
	var father = data.father
	var rect = data.rect
	var pullTime = data.pullTime || 0.15
	var showDraw = data.showDraw
	if (showDraw == null)
		showDraw = true
	var sp = data.sp || []
	var nodescale = data.nodescale || 1
	var movedis = data.movedis || 230
	var pullback = data.pullback
	var pullMidFun = data.pullMidFun
	var userFun = data.userFun
	cc.assert(res.Ipushandpull, "please copy plist and png from mfhdf to your exp")
	loadPlist("Ipushandpull")

	var node = new cc.Node()
	node.setPosition(pos)
	if (father)
		father.addChild(node)
	node.setScale(nodescale)

	var di = new cc.Sprite("#Idi.png")
	di.y = 35
	di.initpos = di.getPosition()
	node.addChild(di, 1)
	node.di = di
	node.gaiClick = true
	var dimao = new cc.Sprite("#Igaizi.png")
	dimao.y = 118
	dimao.initpos = dimao.getPosition()
	dimao.setOpacity(0)
	node.addChild(dimao, 2)
	node.dimao = dimao
	dimao.initpos = dimao.getPosition()
	var bei = new cc.Sprite("#Icup.png")
	node.addChild(bei, 3)
	dimao.state = "in"

	dimao.inrect = cc.rect(-4, 300, 8, 50)
	var draws = new cc.DrawNode()
	father.addChild(draws)
	for (var i = 0; i < sp.length; i++) {
		var worldpos = sp[i].getParent().convertToWorldSpace(sp[i].getPosition())
		var temprect = cc.rect(worldpos.x - sp[i].width / 2, worldpos.y - sp[i].height / 2 + movedis,
			sp[i].width, 60)
		sp[i].restRect = temprect
		sp[i].haveWater = false
		sp[i].index = i
		draws.drawRect(cc.p(temprect.x, temprect.y),
			cc.p(temprect.x + temprect.width, temprect.y + temprect.height),
			null, 2, cc.color(250, 0, 0))
	}

	if (!showDraw) {
		draws.removeFromParent()
	}

	node.flag = true
	node.setAllnosee = function() {
		di.setVisible(false)
		dimao.setVisible(false)
		di.setPosition(0, -1000)
		dimao.setPosition(0, -1000)
	}
	node.init = function() {
		di.setVisible(true)
		dimao.setVisible(true)
		di.setPosition(di.initpos)
		dimao.setPosition(dimao.initpos)
		dimao.setLocalZOrder(1)
		if (dimao.water)
			dimao.water.removeFromParent()
		dimao.disListen(false)
		dimao.state = "in"
	}
	node.setGaiClick = function(jude, fun) {
		node.gaiClick = jude
		node.warnfun = fun
	}

	node.pullWater = function(sp) {
		var pullwater = new cc.Sprite()
		pullwater.runAction(
			cc.sequence(createAnimation({
					frame: "Ipull%02d.png",
					start: 0,
					end: 16,
					time: pullTime
				}),
				cc.callFunc(function() {
					node.init()
					pullwater.removeFromParent()
					if (pullback)
						pullback({
							item: sp,
							index: sp.index
						})
				})
			))
		pullwater.setScale(1)
		pullwater.setPosition(sp.restRect.x + sp.restRect.width / 2,
			sp.restRect.y - 20)
		father.addChild(pullwater)
	}

	node.pullWaterStart = function(sp) {
		var pullwater = new cc.Sprite("#Ipull00.png")
		pullwater.setScale(1)
		pullwater.setPosition(sp.restRect.x + sp.restRect.width / 2,
			sp.restRect.y - 20)
		father.addChild(pullwater)
		node.pullStart = pullwater
	}

	dimao.pushWater = function() {
		var water = new cc.Sprite()
		water.runAction(
			createAnimation({
				frame: "Ipush%02d.png",
				start: 0,
				end: 3,
				time: 0.1
			})
		)
		water.setPosition(9.5, -65)
		this.water = water
		this.addChild(water)
	}



	var moveItem = function(item, delta) {
		var tempx = item.x + delta.x
		var tempy = item.y + delta.y
		if (item.state == "in" && item.y <= 300) {
			tempx = 0
			item.setLocalZOrder(1)
			if (tempy <= 114) {
				tempy = item.y + 1
				return
			}
		}
		if (item.y > 210) {
			item.state = "out"
			item.setLocalZOrder(100)
		}

		if (item.y >= 200 && item.y <= 210 && item.x >= -4 && item.x <= 4) {
			item.state = "in"
			item.setLocalZOrder(1)
		}
		item.x = tempx
		item.y = tempy
			//移动监听

		var worldpos = item.getParent().convertToWorldSpace(item.getPosition())
		for (var i = 0; i < sp.length; i++) {
			if (cc.rectContainsPoint(sp[i].restRect, worldpos) && !sp[i].haveWater) {
				if (userFun) {
					userFun(sp[i])
				} else {
					node.pullWater(sp[i])
					sp[i].haveWater = true
					if (pullMidFun)
						pullMidFun({
							item: sp[i],
							index: sp[i].index
						})
					node.setAllnosee()
				}
				break
			}
		}
	}
	createTouchEvent({
		item: dimao,
		rect: cc.rect(-15, -15, dimao.width + 30, dimao.height + 30),
		begin: function(data) {
			if (!node.gaiClick) {
				if (node.warnfun)
					node.warnfun()
				return false
			}
			var item = data.item
			if (item.state == "in") {
				node.di.setVisible(false)
				item.pushWater()
			}
			return true
		},
		move: function(data) {
			var item = data.item
			var delta = data.delta
			moveItem(item, delta)
		},
		end: function(data) {
			var item = data.item
			if (item.state == "in") {
				node.di.setVisible(true)
				if (item.water) {
					item.water.removeFromParent()
					item.water = null
				}

				item.setPosition(item.initpos)
			}
		}
	})

	return node
}

//创建电子天平
function createDZTP(data) {
	var data = data || {}
	var father = data.father
	var pos = data.pos || getMiddle()
	var itempos = data.itempos || cc.p(150, 250)
	var qupibtnCallBack = data.qupibtnCallBack
	var onoffBtnCallBack = data.onoffBtnCallBack

	var dztp = new cc.Sprite(res.DZTP)
	if (father) {
		father.addChild(dztp)
	}
	dztp.setPosition(pos)

	var addJudge = function() {
		var judge = createLayout({
			size: cc.size(130, 50),
			op: 0,
		})
		judge.setPosition(87, 184)
		safeAdd(dztp, judge)
		dztp.judge = judge
	}

	addJudge()

	//记录重量
	dztp.initWeight = 0
	dztp.curWeight = 0
	dztp.itempos = itempos
	dztp.qupibtnCallBack = qupibtnCallBack
	dztp.onoffBtnCallBack = onoffBtnCallBack


	dztp.txt = new cc.LabelTTF(dztp.initWeight, "", 28)
	dztp.txt.setPosition(180, 108)
	dztp.txt.setAnchorPoint(1, 0.5)
	dztp.txt.setColor(cc.color(0, 0, 0))
	dztp.addChild(dztp.txt)
	dztp.txt.setVisible(false)

	dztp.onbtn = new ccui.Button(res.dztpOnbtn_nor, res.dztpOnbtn_sel)
	dztp.onbtn.setPosition(70, 60)
	dztp.addChild(dztp.onbtn)
	dztp.onbtn.nor = res.dztpOnbtn_nor
	dztp.onbtn.sel = res.dztpOnbtn_sel
	dztp.onbtn.addClickEventListener(function(sender, type) {
		var nor = dztp.onbtn.nor
		var sel = dztp.onbtn.sel
		if (!sender.ok) {
			nor = dztp.onbtn.sel
			sel = dztp.onbtn.nor
			sender.ok = true
			dztp.onFun()
		} else {
			sender.ok = false
			dztp.offFun()
		}
		sender.loadTextureNormal(nor)
		sender.loadTexturePressed(sel)
		if (dztp.onoffBtnCallBack) {
			dztp.onoffBtnCallBack()
		}

	})

	dztp.qupibtn = new ccui.Button(res.dztpqupibtn_nor, res.dztpqupibtn_sel)
	dztp.qupibtn.setPosition(225, 110)
	dztp.addChild(dztp.qupibtn)
	dztp.qupibtn.addClickEventListener(function() {
		dztp.qupiFun()
		if (dztp.qupibtnCallBack) {
			dztp.qupibtnCallBack(dztp.onbtn.ok)
		}
	})

	dztp.onFun = function() {
		var temp = Math.random() / 10
		this.curWeight = this.initWeight + temp
		this.txt.setVisible(true)
		dztp.upDateBalance()
		dztp._on = true
	}
	dztp.offFun = function() {
		this.txt.setVisible(false)
		dztp._on = false
	}

	dztp.qupiFun = function() {
		this.curWeight = 0.00
		dztp.upDateBalance()
	}
	dztp.canShow = true

	dztp.addItem = function(data) {
		var data = data || {}
		var item = data.item
		var needpos = data.needpos || cc.p(300, 100)
		var noFather = data.noFather || false
		var judge = data.judge || false
		var judgeOn = data.judgeOn || false
		var dztp = this

		var result = judgeItemCrash({
			item1: item,
			item2: judge ? dztp.judge : dztp
		})
		if (result) {
			if (judgeOn && !dztp._on) {
				if (dztp.canShow) {
					AddDialog("Tips", {
						res: res.img_tip_on,
						face: 2,
						closeBack: function() {
							dztp.canShow = true
						}
					})
					dztp.canShow = false
				}
				result = false
			} else {
				if (!noFather) {
					safeAdd(this, item)
					item.setPosition(this.itempos)
				} else {
					item.setPosition(needpos)
				}
				item.inTp = true
				dztp.addWeight(item.weight, item.inTp)
			}
		}
		return result
	}
	dztp.upDateBalance = function() {
		var temp = parseFloat(this.curWeight).toFixed(2)
		this.txt.setString(temp)
	}
	dztp.disWeight = function(data) {
		var item = data.item
		var noFather = data.noFather || false

		if (item.inTp) {
			this.curWeight = this.curWeight - item.weight
			this.initWeight = this.initWeight - item.weight
			if (!noFather) {
				var temppos = item.firstFather.convertToNodeSpace(getWorldPos(item))
				safeAdd(item.firstFather, item)
				item.setPosition(temppos)
			}
			item.inTp = false
		}
		dztp.upDateBalance()
	}
	dztp.addWeight = function(weight, Isreset) {
		this.curWeight = this.curWeight + weight
		this.initWeight = this.initWeight + weight
		if (Isreset) {
			dztp.upDateBalance()
		}
	}

	return dztp
}