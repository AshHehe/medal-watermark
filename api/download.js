const fetch = require('node-fetch');
const { send, json } = require('micro');

async function getFileURL(url) {
    try {
        const res = await fetch(url);
        const html = await res.text();
        const fileURL = html.split('"contentUrl":"')[1]?.split('","')[0];
        if (fileURL) return fileURL;
        else return null;
    } catch (error) {
        console.error('Error fetching file URL:', error);
        throw new Error('Failed to fetch file URL');
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

        let validUrl = url;
        if (!validUrl) return send(res, 400, 'Invalid URL');
        if (!validUrl.includes('medal')) {
            if (!validUrl.includes('/')) validUrl = 'https://medal.tv/clips/' + validUrl;
            else return send(res, 400, 'Invalid URL');
        }

        if (!validUrl.toLowerCase().includes('?mobilebypass=true')) {
            validUrl += '?mobilebypass=true';
        }

        validUrl = validUrl.replace('?theater=true', '');

        const src = await getFileURL(validUrl);
        if (src) return send(res, 200, src);
        else return send(res, 404, 'Video URL not found');
    } catch (error) {
        console.error('Error processing request:', error);
        return send(res, 500, 'Internal server error');
    }
};
