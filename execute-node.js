module.exports = function (RED) {
    this.isRequesting = false;

    var handle_error = function (err, node) {
        node.log(err.body);
        node.status({
            fill: "red",
            shape: "dot",
            text: err.message
        });
        node.error(err.message);
    };

    function FullcontactExecuteNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.host = RED.nodes.getNode(config.host);

        const got = require('got');
        node.client = got.extend({
            baseUrl: 'https://api.fullcontact.com/v3/',
            headers: {
                "Authorization": "Bearer " + node.host.api_key
            }
        });

        const requiredArgs = ['resource', 'args'];
        node.on('input', function (msg) {
            node.status({
                fill: "blue",
                shape: "dot",
                text: `Try ${msg.payload.resource}.${msg.payload.method}...`
            });

            var validation = requiredArgs.reduce((p, v) => {
                if (!msg.payload[v]) {
                    handle_error(new Error(`No msg.payload.${v} provided, cancel`), node);
                    return false;
                }
                return p;
            }, true);

            // validation
            if (!validation)
                return false;

            msg['_original'] = msg.payload;
            node.client.post(
                    msg.payload.resource, {
                        body: JSON.stringify(msg.payload.args)
                    })
                .then(function (res) {
                    node.status({
                        fill: "green",
                        shape: "dot",
                        text: `Success ${msg.payload.resource} !`
                    });
                    msg.payload = JSON.parse(res.body);
                    node.send(msg);
                })
                .catch(function (err) {
                    // Email address could not be found
                    handle_error(err, node);
                    msg.payload = false;
                    node.send(msg);
                })
        });
    }
    RED.nodes.registerType("fullcontact-execute", FullcontactExecuteNode);
};