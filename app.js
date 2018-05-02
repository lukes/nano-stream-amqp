#!/usr/bin/env node

const amqp = require('amqp');
const ipc = require('node-ipc');

ipc.config.id = 'nanoStreamAMQP';
ipc.config.retry = 1500;

let URL = 'amqp://guest:guest@localhost:5672';
let EXCHANGE = 'amq.topic';
let ROUTING_KEY = '';

const PUBLISHING_OPTS = {
};


// Process any args passed in and overwrite defaults
const args =  process.argv.slice(2);
args.forEach((arg) => {
  const [key, value] = arg.split('=');
  switch (key) {
  case 'publishing_opts':
    Object.assign(PUBLISHING_OPTS, JSON.parse(value));
    break;
  case 'routing_key':
    ROUTING_KEY = value;
    break;
  case 'url':
    URL = value;
    break;
  case 'exchange':
    EXCHANGE = value;
    break;
  }
});

const connection = amqp.createConnection({url: URL});

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
  console.debug(`Connected to ${URL}`);

  const exchange = connection.exchange(EXCHANGE, { noDeclare: false, confirm: true });

  // Connect to the block data streaming socket
  ipc.connectTo(
    'nanoStream', () => {
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
