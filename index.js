const fs = require('fs');

const ipPattern = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}/;
const urlPattern = /(https?:\/\/)?(www\.)?([-a-zA-Z0-9@:%._\+~#=]{0,256}\.[a-zA-Z0-9()]{1,6}\b)?([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/;

function parseData(data) {
    const lines = data.split('\n');
    const ipAddresses = new Set();
    const urlVisits = {};
    const ipActivity = {};
}