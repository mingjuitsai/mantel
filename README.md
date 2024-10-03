# Log Parser Application

## Overview

A Node.js-based tool designed to analyze web server log files.

## Features

- Parse log files using a memory-efficient streaming approach
- Extract unique IP addresses from log entries
- Track the number of visits for each URL path
- Monitor activity levels for each IP address
- Provide a summary report of the parsed data

## Assumptions
Our log parser assumes the following format for each log entry:
```
CopyIP_ADDRESS - - [DATE:TIME -TIMEZONE] "METHOD /PATH HTTP/VERSION" STATUS_CODE BYTES_SENT "REFERRER" "USER_AGENT"
```

### Example:
```
Copy192.168.1.1 - - [26/Apr/2000:00:23:48 -0400] "GET /index.html HTTP/1.0" 200 6248 "http://www.example.com" "Mozilla/4.08 [en] (Win98; I ;Nav)"
```

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