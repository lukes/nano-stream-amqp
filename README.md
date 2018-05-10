
# nano-stream-amqp

A tiny and performant client that streams block data from a [Nano currency](https://nano.org/) node to an AMQP exchange for use in things like RabbitMQ.

It builds on the socket stream of block data set up by the [nano-stream-x](https://github.com/lukes/nano-stream-x) library.

## Installation

Install both [`nano-stream-x`](https://github.com/lukes/nano-stream-x) and `nano-stream-amqp` as global packages:

    npm install --global nano-stream-x
    npm install --global nano-stream-amqp

## Usage

### Start the stream

    nano-stream-x

This will start a streaming server on `127.0.0.1:3000`. To override these:

    nano-stream-x host=ip6-localhost port=3001

### Start the AMQP client

    nano-stream-amqp

By default you will connect to `amqp://guest:guest@localhost:5672`. This URL includes authentication for your AMQP server in the format `amqp://<username>:<password>@<host>:<port>`. To connect to a different host, or with different credentials:

    nano-stream-amqp host=amqp://my_user:my_pass@localhost:5672

Data will be sent to the default exchange `amq.topic`. To set a different exchange:

    nano-stream-amqp exchange=my_exchange

To set a routing key:

    nano-stream-amqp routing_key=my_routing_key

Set a number of publishing options like `immediate`, `headers` and many more through the `publishing_opts` argument as a stringified JSON value. See the [node-ampq docs](https://github.com/postwait/node-amqp#exchangepublishroutingkey-message-options-callback) for full options.

    nano-stream-amqp publishing_opts='{"mandatory":true}'

### Configure your Nano node to send data to nano-stream-x

Your Nano node is easily configured to send block processing data to a server (in this case `nano-stream-x`). See the [wiki article](https://github.com/lukes/nano-stream-x/wiki/Configure-your-Nano-node-to-send-data-to-the-nano-stream-x) (external link) for how to set this up.
