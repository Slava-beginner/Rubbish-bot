const {VK} = require('vk-io');
const {token,id,mongoDbLink,operatorIds} = require('./config.json');
const vk = new VK({
    apiMode:"parallel",
    pollingGroupId:id,
    token:token
    
});

module.exports = {vk,mongoDbLink,operatorIds};