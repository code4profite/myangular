'use strict';

var _ = require('lodash');

function Scope(){
    this.$$watchers = [];
}

module.exports = Scope;

Scope.prototype.$watch = function (watchFn,listenerFn) {
    var watcher = {
        watchFn: watchFn,
        listenerFn: listenerFn,
    }
    this.$$watchers.push(watcher);
};

Scope.prototype.$digest = function () {
    this.$$watchers.forEach(watcher => {
        watcher.listenerFn();
    });
    _.forEach(this.$$watchers,function(watcher){
        watcher.listenerFn();
    });
};