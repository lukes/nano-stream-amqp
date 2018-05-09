#!/usr/bin/env node

const amqp = require('amqp');
const util = require('util');
const ipc = require('node-ipc');

ipc.config.id = 'nanoStreamAMQP';
ipc.config.retry = 1500;
ipc.config.logger = () => {}; // Make ipc logger a no-op

const args = {};
// Collect all args passed in
process.argv.slice(2).forEach((arg) => {
  const [key, value] = arg.split('=');
  args[key] = value;
});

const HOST = args.host || 'amqp://guest:guest@localhost:5672';
const EXCHANGE = args.exchange || 'amq.topic';
const ROUTING_KEY = args.routing_key || '';
const PUBLISHING_OPTS = args.publishing_opts ? JSON.parse(args.publishing_opts) : {};

const connection = amqp.createConnection({url: HOST});

connection.on('error', function(e) {
  console.error('Error from amqp: ', e);
});

const publishCallback = (failed, error) => {
  if (failed) {
    console.error(`Error encountered when publishing to exchange ${EXCHANGE}`, error);
  }
};

// Wait for connection to become established
connection.on('ready', function () {
  console.debug('Connected to AMQP server');
  console.debug(`Will publish to exchange "${EXCHANGE}" using publishing opts ${util.inspect(PUBLISHING_OPTS)}`);

  const exchange = connection.exchange(EXCHANGE, { noDeclare: false, confirm: true });

  // Connect to the block data streaming socket
  ipc.connectTo(
    'nanoStream', () => {
      ipc.of.nanoStream.on('error', (err) => {
        if (err.errno == 'ECONNREFUSED') {
          console.error('Error trying to connect to nano-stream-x, nano-stream-x is not running');
        } else {
          console.error('Error trying to connect to nano-stream-x', err);
        }
      });
      ipc.of.nanoStream.on('connect', () => console.debug('Connected to nano-stream-x'));
      ipc.of.nanoStream.on(
        'payload', // topic
        function(data){
          exchange.publish(ROUTING_KEY, data, PUBLISHING_OPTS, publishCallback);
          console.debug(`Sending data to exchange ${EXCHANGE}`);
        }
      );
    }
  );
});
