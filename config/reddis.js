const reddis = require('redis')


const client = reddis.createClient({
    username: 'default',
    password: 'mdrzhFS4lOcIg3V197ZWKvNjZKaZBrmZ',
    socket: {
        host: 'redis-18964.c265.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 18964
    }
});
const connectRedis = async () => {
    await client.connect();
    console.log(' Connected to Redis successfully');
};
//  attach client as a property of the functio //
connectRedis.client = client;
module.exports = connectRedis;    