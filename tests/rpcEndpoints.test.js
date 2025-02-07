const { makeRpcCall } = require('../src/rpcClient');
const { TEST_ADDRESS } = require('../src/config');

describe('Ethereum JSON-RPC API Tests', () => {
    test('eth_chainId should return a valid chain ID', async () => {
        const response = await makeRpcCall('eth_chainId');
        expect(response).toHaveProperty('result');
        expect(response.result).toMatch(/^0x[a-fA-F0-9]+$/);
    });

    test('net_version should return a valid network ID', async () => {
        const response = await makeRpcCall('net_version');
        expect(response).toHaveProperty('result');
        expect(response.result).toMatch(/^\d+$/);
    });

    test('eth_blockNumber should return the latest block number', async () => {
        const response = await makeRpcCall('eth_blockNumber');
        expect(response).toHaveProperty('result');
        expect(response.result).toMatch(/^0x[a-fA-F0-9]+$/);
    });

    test('eth_getBalance should return balance for a test address', async () => {
        const response = await makeRpcCall('eth_getBalance', [TEST_ADDRESS, 'latest']);
        expect(response).toHaveProperty('result');
        expect(response.result).toMatch(/^0x[a-fA-F0-9]+$/);
    });

    test('eth_getCode should return contract code or 0x', async () => {
        const response = await makeRpcCall('eth_getCode', [TEST_ADDRESS, 'latest']);
        expect(response).toHaveProperty('result');
        expect(response.result).toMatch(/^0x[a-fA-F0-9]*$/);
    });

    test('eth_accounts should return an array of addresses', async () => {
        const response = await makeRpcCall('eth_accounts');
        expect(response).toHaveProperty('result');
        expect(Array.isArray(response.result)).toBe(true);
    });

    test('eth_getTransactionCount should return a valid nonce', async () => {
        const response = await makeRpcCall('eth_getTransactionCount', [TEST_ADDRESS, 'latest']);
        expect(response).toHaveProperty('result');
        expect(response.result).toMatch(/^0x[a-fA-F0-9]+$/);
    });

    test('eth_getBlockByNumber should return block data', async () => {
        const response = await makeRpcCall('eth_getBlockByNumber', ['latest', false]);
        expect(response).toHaveProperty('result');
        expect(response.result).toHaveProperty('hash');
    });

    test('eth_estimateGas should return a gas estimate', async () => {
        const txParams = {
            from: TEST_ADDRESS,
            to: TEST_ADDRESS,
        };
        const response = await makeRpcCall('eth_estimateGas', [txParams]);
        expect(response).toHaveProperty('result');
        expect(response.result).toMatch(/^0x[a-fA-F0-9]+$/);
    });

    test('eth_call should return a response for a message call', async () => {
        const callParams = {
            to: TEST_ADDRESS,
            data: '0x'
        };
        const response = await makeRpcCall('eth_call', [callParams, 'latest']);
        expect(response).toHaveProperty('result');
        expect(response.result).toMatch(/^0x[a-fA-F0-9]*$/);
    });
});
