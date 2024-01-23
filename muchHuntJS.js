const axios = require('axios');
const fs = require('fs');

console.log('\x1b[33m%s\x1b[0m', 'Author: @Securi3yTalent'); 
console.log('\x1b[33m%s\x1b[0m', 'join_us: https://t.me/Securi3yTalent'); 
console.log(`
        Usage: node script.js <list.txt>
`);
async function waybackurls(domain) {
    const apiUrl = `http://web.archive.org/cdx/search/cdx?url=${domain}/*&output=json&fl=original`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        // Extract URLs from the response
        const urls = data.slice(1).map(entry => entry[0]);
        return urls;
    } catch (error) {
        console.error(`Error querying Wayback Machine API for ${domain}:`, error.message);
        return [];
    }
}

function saveToFile(filename, content) {
    fs.appendFileSync(filename, content);
}

async function processDomainsFile(filename) {
    try {
        const domains = fs.readFileSync(filename, 'utf-8').split('\n').map(line => line.trim()).filter(Boolean);

        for (const domain of domains) {
            const urls = await waybackurls(domain);
            if (urls.length > 0) {
                const outputContent = urls.join('\n') + '\n';
                saveToFile('./output.txt', outputContent);
                console.log(`${urls.length} URLs found for ${domain} and appended to output.txt`);
            } else {
                console.log(`No URLs found for ${domain}`);
            }
        }
    } catch (error) {
        console.error('Error processing domains file:', error.message);
    }
}

// Parse command-line arguments
const args = process.argv.slice(2);
const domainsFileName = args[0];

// Process the list of domains from the file
processDomainsFile(domainsFileName);
