const axios = require('axios');
const { JSDOM } = require('jsdom');

module.exports = async (req, res) => {
    const url = req.body.url;
    try {
        const response = await axios.get(url);
        const dom = new JSDOM(response.data);
        const title = dom.window.document.title;
        const scriptTag = dom.window.document.querySelector('script[type="application/ld+json"]');
        if (scriptTag) {
            const jsonData = JSON.parse(scriptTag.textContent);
            if (jsonData.contentUrl) {
                res.json({ src: jsonData.contentUrl, title });
                return;
            }
        }
        res.status(404).json({ error: 'No video URL found' });
    } catch (error) {
        console.error('Error extracting video URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
