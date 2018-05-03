var senceControl = {}
senceControl.currentSence = null
senceControl.showSence = function(sence,layer){
    if(sence){
        cc.director.runScene(sence)
        senceControl.currentSence = sence
        if(layer){
            senceControl.currentSence.addChild(layer)
        }
    }
}