//@author mu @14/4/15
var dialogControl = {};

var dialogList = [ //弹出列表
	["Exit", function(data) {
		return new exitDialog(data)
	}], //弹出标签及对应创建函数
	["QuitExp", function(data) {
		return new quitExpDialog(data)
	}],
	["Tips", function(data) {
		return new tipsDialog(data)
	}],
	["ShowScore", function(data) {
		return new showScoreDialog(data)
	}],
	["Judge", function(data) {
		return new judgeDialog(data)
	}]
];

dialogControl.AddDialog = function(dialogName, data)
	//弹出管理 采用对象缓存机制 除非需要 否则不重新创建
	{
		var scene = CC_CURRENT_LAYER || cc.director.getRunningScene()
		var size = cc.director.getWinSize()
		var dialog = dialogControl[dialogName]
		var judge = false
		if (!dialog) {
			judge = true
		} else {
			if (!dialog.getParent()) {
				judge = true
			}
		}
		if (judge) {
			for (var i = 0; i < dialogList.length; i++) {
				if (dialogName == dialogList[i][0]) {
					dialog = dialogList[i][1](data);
					dialog.retain()
				}
			}
		} else {
			if (dialog.getParent()) {
				dialog.removeFromParent(false)
				if (dialog.reload) {
					dialog.reload(data) //某些对话框重用需要重新加载 自动重新构建
				}
			}
		}
		
		dialogControl[dialogName] = dialog; //缓存对象
		if (dialogName != "ShowScore")
			dialog.setPosition(cc.p(size.width / 2, size.height / 2)) //窗口默认居中
		if (data && data.father) {} else {
			dialog.setLocalZOrder(9999)
			safeAdd(scene, dialog)
		}
		dialog.onIn() //调用窗口进场函数
		return dialog
	}

AddDialog = dialogControl.AddDialog