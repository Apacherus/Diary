module.exports = (function(){

    if(!Vue) return;

    Vue.filter('translate', function(value, lang = 'en'){
        return value.translate();
    });

})();