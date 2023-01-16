'use strict';

var _ = require('lodash');

function Scope(){
    this.$$watchers = [];
    this.$$lastDirtyWatch = null;
}

module.exports = Scope;

function initWatchVal(){}

Scope.prototype.$watch = function (watchFn,listenerFn,valueEq) {
    var watcher = {
        watchFn: watchFn,
        listenerFn: listenerFn || function () {},
        valueEq: !!valueEq,
        last: initWatchVal
    };
    this.$$watchers.push(watcher);
    this.$$lastDirtyWatch = null;
};

Scope.prototype.$$digestOnce = function () {
    var self = this;
    var newValue, oldValue, dirty;
    _.forEach(this.$$watchers,function(watcher){
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
            return false;
        }
    });
    return dirty;
};

Scope.prototype.$digest = function(){
    var ttl = 10;
    var dirty;
    this.$$lastDirtyWatch = null; 
    do{
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
