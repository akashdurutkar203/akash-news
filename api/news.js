export default async function handler(req, res) {
  // Enable CORS for ease of development
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { category = 'general', q, page = 1, token: clientToken } = req.query;
    
    // Prioritize client-provided token (if custom key entered in Settings), fallback to server environment key
    const activeToken = (clientToken && clientToken.trim() !== '') 
      ? clientToken.trim() 
      : process.env.VITE_GNEWS_API_KEY;

    if (!activeToken || activeToken.trim() === '') {
      return res.status(400).json({ 
        error: 'Missing API Key', 
        message: 'No GNews API Key was provided. Please configure it in Settings or via VITE_GNEWS_API_KEY environment variable.' 
      });
    }

    const limit = 10;
    let fetchUrl = '';

    if (q && q.trim() !== '') {
      fetchUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
        q
      )}&lang=en&token=${activeToken}&page=${page}&max=${limit}`;
    } else {
      const gnewsCategory = category === 'all' ? 'general' : category;
      fetchUrl = `https://gnews.io/api/v4/top-headlines?category=${gnewsCategory}&lang=en&token=${activeToken}&page=${page}&max=${limit}`;
    }

    const response = await fetch(fetchUrl);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'GNews API Error',
        message: data.errors ? data.errors.join(', ') : (data.message || `HTTP ${response.status}`)
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy Fetch Error:', error);
    return res.status(500).json({ 
      error: 'Proxy Error', 
      message: error.message || 'Failed to fetch news from GNews' 
    });
  }
}
