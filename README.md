
# nano-stream-amqp

A tiny and performant client that streams block data from a [Nano currency](https://nano.org/) node to an AMQP exchange for use in things like RabbitMQ.

It builds on the socket stream of block data set up by the [nano-stream-x](https://github.com/lukes/nano-stream-x) library, which is packaged in this library as a dependency.

## Installation

    npm install --global nano-stream-amqp

## Usage

You first start the stream of socket data from [nano-stream-x](https://github.com/lukes/nano-stream-x) and then start the AMQP client.

### Start the stream

    npm run stream

This will start a streaming server on `127.0.0.1:3000`. To override those defaults:

    npm run stream host=ipv6-localhost port=3001

### Start the AMQP client

    npm run amqp

Data will be sent to the default exchange `"amq.topic"`. To set a different default exchange:

    npm run amqp exchange=my_exchange

To set a routing key:

    npm run amqp exchange=my_exchange routing_key=my_routing_key

Set a number of publishing options like `immediate`, `headers` and many more through the `publishing_opts` argument as a stringified JSON value. See the [node-ampq docs](https://github.com/postwait/node-amqp#exchangepublishroutingkey-message-options-callback) for full options.

    npm run amqp exchange=my_exchange publishing_opts="{'mandatory':true}"
