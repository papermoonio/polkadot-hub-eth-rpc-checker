const { makeRpcCall } = require("../src/rpcClient");
const { TEST_ADDRESS, CONTRACT_ADDRESS } = require("../src/config");

describe("[Ethereum JSON-RPC API Tests] - Health APIs", () => {
  test("system_health should return a health status", async () => {
    const response = await makeRpcCall("system_health");
    expect(response).toHaveProperty("result");
    expect(response.result).toHaveProperty("peers");
    expect(response.result).toHaveProperty("isSyncing");
    expect(response.result).toHaveProperty("shouldHavePeers");
  });

  test("net_peerCount should return the number of connected peers", async () => {
    const response = await makeRpcCall("net_peerCount");
    expect(response).toHaveProperty("result");
    expect(response.result).toMatch(/^0x[0-9a-fA-F]+$/);
  });
});

describe("[Ethereum JSON-RPC API Tests] - Execution APIs", () => {
  // Basic Chain Info APIs
  test("eth_chainId should return a valid chain ID", async () => {
    const response = await makeRpcCall("eth_chainId");
    expect(response).toHaveProperty("result");
    expect(response.result).toMatch(/^0x[a-fA-F0-9]+$/);
  });

  test("eth_blockNumber should return the latest block number", async () => {
    const response = await makeRpcCall("eth_blockNumber");
    expect(response).toHaveProperty("result");
    expect(response.result).toMatch(/^0x[a-fA-F0-9]+$/);
  });

  // Account APIs
  test("eth_accounts should return an array of addresses", async () => {
    const response = await makeRpcCall("eth_accounts");
    expect(response).toHaveProperty("result");
    expect(Array.isArray(response.result)).toBe(true);
  });

  test("eth_getBalance should return balance for a test address", async () => {
    const response = await makeRpcCall("eth_getBalance", [
      TEST_ADDRESS,
      "latest",
    ]);
    expect(response).toHaveProperty("result");
    expect(response.result).toMatch(/^0x[a-fA-F0-9]+$/);
  });

  test("eth_getTransactionCount should return a valid nonce", async () => {
    const response = await makeRpcCall("eth_getTransactionCount", [
      TEST_ADDRESS,
      "latest",
    ]);
    expect(response).toHaveProperty("result");
    expect(response.result).toMatch(/^0x[a-fA-F0-9]+$/);
  });

  // Code and Storage APIs
  test("eth_getCode should return contract code or 0x", async () => {
    const response = await makeRpcCall("eth_getCode", [
      CONTRACT_ADDRESS,
      "latest",
    ]);
    expect(response).toHaveProperty("result");
    expect(response.result).toMatch(/^0x[a-fA-F0-9]*$/);
  });

  test("eth_getStorageAt should return storage value", async () => {
    const response = await makeRpcCall("eth_getStorageAt", [
      CONTRACT_ADDRESS,
      "0x0", // storage slot 0
      "latest",
    ]);
    expect(response).toHaveProperty("result");
    expect(response.result).toMatch(/^0x[a-fA-F0-9]*$/);
  });

  // Block APIs
  test("eth_getBlockByNumber should return block data", async () => {
    const response = await makeRpcCall("eth_getBlockByNumber", [
      "latest",
      false,
    ]);
    expect(response).toHaveProperty("result");
    if (response.result) {
      expect(response.result).toHaveProperty("hash");
      expect(response.result).toHaveProperty("number");
    }
  });

  test("eth_getBlockByHash should return block data by hash", async () => {
    // First get latest block to get a valid hash
    const latestBlock = await makeRpcCall("eth_getBlockByNumber", [
      "latest",
      false,
    ]);
    if (latestBlock.result && latestBlock.result.hash) {
      const response = await makeRpcCall("eth_getBlockByHash", [
        latestBlock.result.hash,
        false,
      ]);
      expect(response).toHaveProperty("result");
      if (response.result) {
        expect(response.result).toHaveProperty("hash");
        expect(response.result.hash).toBe(latestBlock.result.hash);
      }
    }
  });

  test("eth_getBlockTransactionCountByNumber should return transaction count", async () => {
    const response = await makeRpcCall("eth_getBlockTransactionCountByNumber", [
      "latest",
    ]);
    expect(response).toHaveProperty("result");
    if (response.result !== null) {
      expect(response.result).toMatch(/^0x[a-fA-F0-9]+$/);
    }
  });

  test("eth_getBlockTransactionCountByHash should return transaction count by hash", async () => {
    // First get latest block to get a valid hash
    const latestBlock = await makeRpcCall("eth_getBlockByNumber", [
      "latest",
      false,
    ]);
    if (latestBlock.result && latestBlock.result.hash) {
      const response = await makeRpcCall("eth_getBlockTransactionCountByHash", [
        latestBlock.result.hash,
      ]);
      expect(response).toHaveProperty("result");
      if (response.result !== null) {
        expect(response.result).toMatch(/^0x[a-fA-F0-9]+$/);
      }
    }
  });

  // Transaction APIs
  test("eth_getTransactionByHash should handle valid/invalid hashes", async () => {
    // Test with a dummy hash - should return null for non-existent transaction
    const dummyHash =
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const response = await makeRpcCall("eth_getTransactionByHash", [dummyHash]);
    expect(response).toHaveProperty("result");
    // Result should be null for non-existent transaction
    expect(response.result).toBeNull();
  });

  test("eth_getTransactionByBlockNumberAndIndex should return transaction or null", async () => {
    const response = await makeRpcCall(
      "eth_getTransactionByBlockNumberAndIndex",
      [
        "latest",
        "0x0", // first transaction index
      ]
    );
    expect(response).toHaveProperty("result");
    // Result can be null if no transactions in the block
    if (response.result) {
      expect(response.result).toHaveProperty("hash");
    }
  });

  test("eth_getTransactionByBlockHashAndIndex should return transaction or null", async () => {
    // First get latest block hash
    const latestBlock = await makeRpcCall("eth_getBlockByNumber", [
      "latest",
      false,
    ]);
    if (latestBlock.result && latestBlock.result.hash) {
      const response = await makeRpcCall(
        "eth_getTransactionByBlockHashAndIndex",
        [
          latestBlock.result.hash,
          "0x0", // first transaction index
        ]
      );
      expect(response).toHaveProperty("result");
      // Result can be null if no transactions in the block
      if (response.result) {
        expect(response.result).toHaveProperty("hash");
      }
    }
  });

  test("eth_getTransactionReceipt should handle valid/invalid hashes", async () => {
    // Test with a dummy hash - should return null for non-existent transaction
    const dummyHash =
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const response = await makeRpcCall("eth_getTransactionReceipt", [
      dummyHash,
    ]);
    expect(response).toHaveProperty("result");
    // Result should be null for non-existent transaction
    expect(response.result).toBeNull();
  });

  // Gas and Fee APIs
  test("eth_gasPrice should return current gas price", async () => {
    const response = await makeRpcCall("eth_gasPrice");
    expect(response).toHaveProperty("result");
    expect(response.result).toMatch(/^0x[a-fA-F0-9]+$/);
  });

  test("eth_maxPriorityFeePerGas should return max priority fee", async () => {
    const response = await makeRpcCall("eth_maxPriorityFeePerGas");
    expect(response).toHaveProperty("result");
    expect(response.result).toMatch(/^0x[a-fA-F0-9]+$/);
  });

  test("eth_estimateGas should return a gas estimate", async () => {
    const txParams = {
      from: TEST_ADDRESS,
      to: TEST_ADDRESS,
    };
    const response = await makeRpcCall("eth_estimateGas", [txParams]);
    expect(response).toHaveProperty("result");
    expect(response.result).toMatch(/^0x[a-fA-F0-9]+$/);
  });

  test("eth_feeHistory should return fee history", async () => {
    const response = await makeRpcCall("eth_feeHistory", [
      "0x4", // 4 blocks
      "latest",
      [25, 75], // 25th and 75th percentiles
    ]);
    expect(response).toHaveProperty("result");
    if (response.result) {
      expect(response.result).toHaveProperty("baseFeePerGas");
      expect(response.result).toHaveProperty("gasUsedRatio");
      expect(Array.isArray(response.result.baseFeePerGas)).toBe(true);
      expect(Array.isArray(response.result.gasUsedRatio)).toBe(true);
    }
  });

  // Call APIs
  test("eth_call should return a response for a message call", async () => {
    const callParams = {
      to: TEST_ADDRESS,
      data: "0x",
    };
    const response = await makeRpcCall("eth_call", [callParams, "latest"]);
    expect(response).toHaveProperty("result");
    expect(response.result).toMatch(/^0x[a-fA-F0-9]*$/);
  });

  // Logs API
  test("eth_getLogs should return logs array", async () => {
    const filterParams = {
      fromBlock: "latest",
      toBlock: "latest",
    };
    const response = await makeRpcCall("eth_getLogs", [filterParams]);
    expect(response).toHaveProperty("result");
    expect(Array.isArray(response.result)).toBe(true);
  });

  // Network Status APIs
  test("eth_syncing should return sync status", async () => {
    const response = await makeRpcCall("eth_syncing");
    expect(response).toHaveProperty("result");
    // Result can be false (not syncing) or an object with sync info
    if (typeof response.result === "object" && response.result !== null) {
      expect(response.result).toHaveProperty("startingBlock");
      expect(response.result).toHaveProperty("currentBlock");
      expect(response.result).toHaveProperty("highestBlock");
    } else {
      expect(response.result).toBe(false);
    }
  });

  test("net_version should return a valid network ID", async () => {
    const response = await makeRpcCall("net_version");
    expect(response).toHaveProperty("result");
    expect(response.result).toMatch(/^\d+$/);
  });

  test("net_listening should return listening status", async () => {
    const response = await makeRpcCall("net_listening");
    expect(response).toHaveProperty("result");
    expect(typeof response.result).toBe("boolean");
  });

  test("web3_clientVersion should return client version", async () => {
    const response = await makeRpcCall("web3_clientVersion");
    expect(response).toHaveProperty("result");
    expect(typeof response.result).toBe("string");
    expect(response.result.length).toBeGreaterThan(0);
  });

  // Transaction Sending APIs (These might fail in read-only environments)
  test("eth_sendRawTransaction should handle raw transaction", async () => {
    // Using a dummy raw transaction - this will likely fail but should return proper error
    const dummyRawTx = "0x1234567890abcdef";
    const response = await makeRpcCall("eth_sendRawTransaction", [dummyRawTx]);

    // This should either succeed or return a proper error
    if (response.error) {
      expect(response.error).toHaveProperty("code");
      expect(response.error).toHaveProperty("message");
    } else {
      expect(response).toHaveProperty("result");
      expect(response.result).toMatch(/^0x[a-fA-F0-9]+$/);
    }
  });

  test("eth_sendTransaction should handle transaction object", async () => {
    const txParams = {
      from: TEST_ADDRESS,
      to: TEST_ADDRESS,
      value: "0x1",
    };
    const response = await makeRpcCall("eth_sendTransaction", [txParams]);

    // This should either succeed or return a proper error
    if (response.error) {
      expect(response.error).toHaveProperty("code");
      expect(response.error).toHaveProperty("message");
    } else {
      expect(response).toHaveProperty("result");
      expect(response.result).toMatch(/^0x[a-fA-F0-9]+$/);
    }
  });
});

describe("[Ethereum JSON-RPC API Tests] - Debug APIs", () => {
  test("debug_traceBlockByNumber should return execution trace for latest block", async () => {
    const response = await makeRpcCall("debug_traceBlockByNumber", ["latest", {}]);
    expect(response).toHaveProperty("result");

    // The result is usually an array or object containing traces
    if (response.result) {
      expect(typeof response.result).toBe("object");
    }
  });

  test("debug_traceTransaction should return trace for a transaction (if tx exists)", async () => {
    // Replace with a real tx hash if available, otherwise expect null or error
    const dummyTxHash =
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const response = await makeRpcCall("debug_traceTransaction", [dummyTxHash, {}]);

    expect(response).toHaveProperty("result");
    // Result may be null for non-existent tx
    if (response.result) {
      expect(typeof response.result).toBe("object");
    }
  });

  test("debug_traceCall should return a trace result of a call", async () => {
    const callParams = {
      from: TEST_ADDRESS,
      to: TEST_ADDRESS,
      data: "0x",
    };
    const response = await makeRpcCall("debug_traceCall", [callParams, "latest", {}]);
    expect(response).toHaveProperty("result");
    if (response.result) {
      expect(typeof response.result).toBe("object");
    }
  });
});

