const fetch = require('node-fetch');
const { parse } = require('url');
const { send, json } = require('micro');

async function getFileURL(url) {
    try {
        // Fetches the HTML and finds the contentUrl (from the hydrationData), then returns the URL if it exists
        const res = await fetch(url);
        const html = await res.text();
        const fileURL = html.split('"contentUrl":"')[1]?.split('","')[0];
        if (fileURL) return fileURL;
        else return null;
    } catch (error) {
        console.error('Error fetching file URL:', error);
        return null;
    }
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return send(res, 200);
    }

    try {
        const { url } = await json(req);

        // Checks and helps make valid URL
        let validUrl = url;
        if (!validUrl) return send(res, 400, { valid: false });
        if (!validUrl.includes('medal')) {
            if (!validUrl.includes('/')) validUrl = 'https://medal.tv/clips/' + validUrl;
            else return send(res, 400, { valid: false });
        }

        if (!validUrl.toLowerCase().includes('?mobilebypass=true')) {
            validUrl += '?mobilebypass=true';
        }

        validUrl = validUrl.replace('?theater=true', '');

        const src = await getFileURL(validUrl);
        if (src) return send(res, 200, { valid: true, src });
        else return send(res, 400, { valid: false });
    } catch (error) {
        console.error('Error processing request:', error);
        return send(res, 500, { error: 'Internal server error' });
    }
};
