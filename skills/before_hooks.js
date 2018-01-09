module.exports = function(controller) {


    
    controller.studio.before('help', function(convo, next) {

        next();

    });

}