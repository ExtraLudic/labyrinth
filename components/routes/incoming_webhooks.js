var debug = require('debug')('botkit:incoming_webhooks');

module.exports = function(webserver, controller) {

    debug('Configured /slack/receive url');
    webserver.post('/slack/receive', function(req, res) {

        // NOTE: we should enforce the token check here

        // respond to Slack that the webhook has been received.
        res.status(200);

        // Now, pass the webhook into be processed
        controller.handleWebhookPayload(req, res);

    });
  
  
    webserver.post('/slack/menu', function(req, res) {
        var data = JSON.parse(req.body.payload);
        console.log("retrieving menu options", data);
      
        var id = data.callback_id;
      
        console.log(id);
        var options = {
          options: []
        };

        if (id == "door_a") {
          options.options = [
            {
                "text": "Unexpected sentience",
                "value": "AI-2323"
            },
            {
                "text": "Bot biased toward other bots",
                "value": "SUPPORT-42"
            },
            {
                "text": "Bot broke my toaster",
                "value": "IOT-75"
            }
          ];
        }
      
          res.send(options);


    });

}
