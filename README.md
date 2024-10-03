# Log Parser Application

## Overview

This Log Parser Application is a Node.js-based tool designed to analyze web server log files. It processes log entries to extract information about IP addresses, URL visits, and IP activity. The application uses a streaming approach to efficiently handle large log files without excessive memory usage.

## Features

- Parse log files using a memory-efficient streaming approach
- Extract unique IP addresses from log entries
- Track the number of visits for each URL path
- Monitor activity levels for each IP address
- Provide a summary report of the parsed data

## Installation

1. Ensure you have Node.js installed on your system (version 12.0 or higher recommended).
2. Clone this repository:
   ```
   git clone https://github.com/mingj/log-parser-app.git
   ```
3. Navigate to the project directory:
   ```
   cd log-parser-app
   ```
4. Install the dependencies:
   ```
   npm install
   ```

## Usage

### Basic Usage

To parse a log file and generate a report, use the following command:

```
node app.js path/to/your/logfile.log
```

### Example Output

```
Number of unique IP addresses: 2

Top 3 most visited paths:
/pics/wpaper.gif: 1 visits
/index.html: 1 visits
/pics/5star2000.gif: 1 visits

Top 3 most active IP addresses:
192.168.1.1: 2 requests
192.168.1.2: 1 requests

Total execution time: 153.41ms
```

```

## Testing

This project uses Vitest for testing. To run the tests:

1. Ensure you have the dev dependencies installed:
   ```
   npm install
   ```
2. Run the test command:
   ```
   npm test
   ```