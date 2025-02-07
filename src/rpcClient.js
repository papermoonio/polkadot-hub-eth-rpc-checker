const fetch = require('node-fetch');
const { RPC_ENDPOINT } = require('./config');

async function makeRpcCall(method, params = []) {
    const requestBody = {
        jsonrpc: '2.0',
        method,
        params,
        id: 1
    };

    try {
        const response = await fetch(RPC_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error calling ${method}: ${error.message}`);
    }
}

module.exports = { makeRpcCall };
