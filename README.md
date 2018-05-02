
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

    nano-stream-x host=ipv6-localhost port=3001

### Start the AMQP client

    nano-stream-amqp

Data will be sent to the default exchange `"amq.topic"`. To set a different default exchange:

    nano-stream-amqp exchange=my_exchange

To set a routing key:

    nano-stream-amqp exchange=my_exchange routing_key=my_routing_key

Set a number of publishing options like `immediate`, `headers` and many more through the `publishing_opts` argument as a stringified JSON value. See the [node-ampq docs](https://github.com/postwait/node-amqp#exchangepublishroutingkey-message-options-callback) for full options.

    nano-stream-amqp exchange=my_exchange publishing_opts="{'mandatory':true}"
