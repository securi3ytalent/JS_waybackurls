const axios = require('axios');
const fs = require('fs');

console.log('\x1b[33m%s\x1b[0m', 'Author: @Securi3yTalent'); 
console.log('\x1b[33m%s\x1b[0m', 'join_us: https://t.me/Securi3yTalent'); 

async function waybackurls(domain) {
    if (!domain) {
        console.log('Usage: node script.js <domain>');
        return [];
    }

    const apiUrl = `http://web.archive.org/cdx/search/cdx?url=${domain}/*&output=json&fl=original`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        // Extract URLs from the response
        const urls = data.slice(1).map(entry => entry[0]);

        // Print and save the URLs
        console.log('Output:');
        urls.forEach(url => console.log(url));

        if (urls.length > 0) {
            const filename = `./output.txt`;
            fs.writeFileSync(filename, urls.join('\n'));
            console.log(`${urls.length} URLs found and saved in ${filename}`);
        } else {
            console.log('No URLs found.');
        }

        return urls;
    } catch (error) {
        console.error('Error querying Wayback Machine API:', error.message);
        return [];
    }
}

// Parse command-line arguments
const args = process.argv.slice(2);
const domain = args[0];
waybackurls(domain);
