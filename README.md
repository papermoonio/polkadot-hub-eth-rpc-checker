# RPC Health Check

This project contains a set of tests to check the health of Asset Hub Ethereum RPC endpoints using `npm` and `jest`. The tests verify various Ethereum JSON-RPC methods to ensure they return valid and expected responses. 

The health check is automated through GitHub Actions, running both weekly and manually when triggered.

## Setup

### Prerequisites

- Node.js (v16 or later)
- `npm` (Node package manager)

### Installing Dependencies

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/rpc-health-check.git
   ```

2. Navigate to the project folder:

   ```bash
   cd rpc-health-check
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Running Tests Locally

To run the tests locally:

```bash
npm test
```

### GitHub Actions

The workflow is configured to run the tests weekly (every Sunday at midnight) and manually through the GitHub Actions UI:
- **Schedule**: The action runs weekly using a cron expression (`0 0 * * 0`).
- **Manual Trigger**: You can trigger the action manually by navigating to the GitHub Actions tab and selecting "Run workflow."