'use strict';
/**
 * load lodash library
 */
var _ = require('lodash');

/**
 * to init watch value you need a unique var content
 */
function initWatchVal(){}

/**
 * this is the scope to whitch variable bind to it
 * @constructor
 */
function Scope(){
    this.$$watchers = [];
    this.$$lastDirtyWatch = null;
    this.$$asyncQueue = [];
}


module.exports = Scope;

Scope.prototype.$watch = function (watchFn,listenerFn,valueEq) {
    var self = this;
    var watcher = {
        watchFn: watchFn,
        listenerFn: listenerFn || function () {},
        valueEq: !!valueEq,
        last: initWatchVal
    };
    this.$$watchers.unshift(watcher);
    this.$$lastDirtyWatch = null;
    return function(){
        var index = self.$$watchers.indexOf(watcher);
        if(index>=0){
            self.$$watchers.splice(index,1);
            self.$$lastDirtyWatch = null;
        }
    };
};

Scope.prototype.$$digestOnce = function () {
    var self = this;
    var newValue, oldValue, dirty;
    _.forEachRight(this.$$watchers,function(watcher){
        try {
            if (watcher) {
                newValue= watcher.watchFn(self);
                oldValue = watcher.last;
                //console.log(self.$$lastDirtyWatch === watcher);
                //console.log('\n\n '+JSON.stringify(self) + '\n\n');  
                if(!self.$$areEquals(newValue,oldValue,watcher.valueEq)){
                    self.$$lastDirtyWatch = watcher;    
                    watcher.last = (watcher.valueEq) ? _.cloneDeep(newValue): newValue; 
                    //console.log('\n\n '+ JSON.stringify(watcher) + '\n\n');
                    watcher.listenerFn(newValue,( oldValue === initWatchVal) ? newValue: oldValue ,self);
                    dirty = true;
                }else if(self.$$lastDirtyWatch === watcher){ 
                    //console.log("test !!!!");
                    return false;
                }
            }
        } catch (e) {
            console.log(e);
        }
    });
    return dirty;
};

Scope.prototype.$digest = function(){
    var ttl = 10;
    var dirty;
    this.$$lastDirtyWatch = null; 
    do{
        while (this.$$asyncQueue.length) {
            var asyncTask = this.$$asyncQueue.shift();
            asyncTask.scope.$eval(asyncTask.expression);
        }
        //console.log('\n digestOnce(); \n');
        dirty = this.$$digestOnce();
        //console.log('\ntest again ttl='+ttl+' dirty='+dirty+' \n' );
        if(dirty && !(ttl--)){
            //console.log('\n throw expection \n');
            throw '10 digest iterations reached';
        }
    } while(dirty);
};

Scope.prototype.$$areEquals = function(newValue,oldValue,valueEq){
    if(valueEq){
        return _.isEqual(newValue,oldValue);
    } else {
        return newValue === oldValue || 
        (typeof newValue === 'number' && typeof oldValue === 'number' && isNaN(newValue) && isNaN(oldValue)); 
    }
};

/**
 * evalutate code in the context of a scope
 * @param {requestCallback} expr 
 * @param [*] locals 
 * @returns {*}
 */
Scope.prototype.$eval = function (expr,locals) {
    return expr(this,locals);
};

/**
 * Integration external code with the digest cycle
 * @param {requestCallback} expr 
 * @returns {*}
 */
Scope.prototype.$apply = function(expr) {
    try {
        return this.$eval(expr);
    } finally {
        this.$digest();
    }
}
/**
 * Deffered execution 
 * @param {*} expr 
 */
Scope.prototype.$evalAsync = function(expr){
    this.$$asyncQueue.push({scope:this,expression:expr});
};
