views.choseLayer = views.ILayer.extend({
	ctor:function () {
        this._super();
        return true
    },
    onEnter:function(){
    	this._super();
    },
    onEnterTransitionDidFinish:function(){
    	this._super();
    },
    onExit:function(){
    	this._super();
    }
})