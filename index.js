const fs = require('fs');
const readline = require('readline');

const ipPattern = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}/;
// We don't always need the URL protocols. Path is most required
const urlPattern = /GET\s(https?:\/\/)?(www\.)?([a-z0-9.-]+\.[a-z]{2,})?(\/\S*)+?/i;

function sanitizeLine(line) {
    // Remove any null bytes
    line = line.replace(/\0/g, '');
    // Trim whitespace from the beginning and end
    line = line.trim();
    
    return line;
}

// Return user entry ip and url if both valid
function getUserEntry(line) {
    const sanitizedLine = sanitizeLine(line);
    const ipMatch = sanitizedLine.match(ipPattern);
    const urlMatch = sanitizedLine.match(urlPattern);

    // Invalidation/Mismatch of either IP or URL won't be consider an entry
    if (ipMatch && urlMatch) {
        const ip = ipMatch[0];
        // Getting path of the match including query strings and fragments
        const path = urlMatch.at(-1);

        return {
            ip,
            path
        }
    }

    return null;
}

function parseLog(filePath) {
    const ipAddresses = new Set();
    const urlVisits = new Map();
    const ipActivity = new Map();

    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePath);
        fileStream.on('error', (error) => reject(`Error reading file: ${error.message}`));

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {            
            try {
                const entry = getUserEntry(line);

                // Invalidation/Mismatch of either IP or URL won't be consider an entry
                if (entry) {
                    const { ip, path } = entry;
                    ipAddresses.add(ip);
                    urlVisits.set(path, (urlVisits.get(path) || 0) + 1);
                    ipActivity.set(ip, (ipActivity.get(ip) || 0) + 1);
                }
            } catch (error) {
                console.error(`Error processing line: ${error.message}`);
            }
        });

        rl.on('close', () => {
            resolve({ ipAddresses, urlVisits, ipActivity });
        });
    });
}

function sortMapByHigherNumber(map, slice = -1) {
    return Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, slice);
}

async function reportLog(filePath) {
    try {
        // If parseLog rejected will throw rejected error message
        const { ipAddresses, urlVisits, ipActivity } = await parseLog(filePath);

        console.log(`Number of unique IP addresses: ${ipAddresses.size}`);

        console.log("\nTop 3 most visited paths:");
        sortMapByHigherNumber(urlVisits, 3).forEach(([path, count]) => {
            console.log(`${path}: ${count} visits`);
        });

        console.log("\nTop 3 most active IP addresses:");
        sortMapByHigherNumber(ipActivity, 3).forEach(([ip, count]) => {
            console.log(`${ip}: ${count} requests`);
        });
    } catch (error) {
        console.error(`Error generating report: ${error}`);
    }
}

const logFilePath = 'data.log';
reportLog(logFilePath);