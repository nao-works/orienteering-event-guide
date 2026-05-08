const IOF_API_BASE = 'https://ranking.orienteering.org/api/ranking';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Cron: 4 patterns to fetch
const FETCH_PATTERNS = [
  { discipline: 'F', group: 'MEN' },
  { discipline: 'F', group: 'WOMEN' },
  { discipline: 'FS', group: 'MEN' },
  { discipline: 'FS', group: 'WOMEN' },
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (url.pathname === '/api/ranking') {
      return handleRankingProxy(url, env);
    }

    if (url.pathname === '/api/cached') {
      return handleCached(url, env);
    }

    if (url.pathname === '/api/dates') {
      return handleDates(url, env);
    }

    return jsonResponse({ error: 'Not found' }, 404);
  },

  async scheduled(event, env, ctx) {
    const today = new Date().toISOString().slice(0, 10);

    for (const { discipline, group } of FETCH_PATTERNS) {
      try {
        const params = new URLSearchParams({
          discipline,
          group,
          date: today,
          limit: '10000',
        });
        const res = await fetch(`${IOF_API_BASE}?${params}`);
        if (!res.ok) {
          console.error(`Failed to fetch ${discipline}/${group}: ${res.status}`);
          continue;
        }
        const data = await res.json();
        const gender = group === 'MEN' ? 'M' : 'W';
        const key = `iof_${discipline}_${gender}_${today}`;
        await env.RANKING_STORE.put(key, JSON.stringify(data));
        console.log(`Stored ${key} (${JSON.stringify(data).length} bytes)`);
      } catch (err) {
        console.error(`Error fetching ${discipline}/${group}:`, err);
      }
    }
  },
};

async function handleRankingProxy(url, env) {
  const params = new URLSearchParams();
  for (const key of ['discipline', 'group', 'date', 'limit']) {
    const val = url.searchParams.get(key);
    if (val) params.set(key, val);
  }
  if (!params.has('limit')) params.set('limit', '10000');

  // Check KV cache first
  const cacheKey = `proxy_${params.toString()}`;
  const cached = await env.RANKING_STORE.get(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const apiUrl = `${IOF_API_BASE}?${params}`;
  const res = await fetch(apiUrl);
  const body = await res.text();

  // Cache successful responses for 24 hours
  if (res.ok) {
    await env.RANKING_STORE.put(cacheKey, body, { expirationTtl: 86400 });
  }

  return new Response(body, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'application/json',
      ...CORS_HEADERS,
    },
  });
}

async function handleCached(url, env) {
  const discipline = url.searchParams.get('discipline');
  const group = url.searchParams.get('group');
  const date = url.searchParams.get('date');

  if (!discipline || !group || !date) {
    return jsonResponse({ error: 'Missing required params: discipline, group, date' }, 400);
  }

  const gender = group === 'MEN' ? 'M' : 'W';
  const key = `iof_${discipline}_${gender}_${date}`;
  const data = await env.RANKING_STORE.get(key);

  if (!data) {
    return jsonResponse({ error: 'No cached data for this combination' }, 404);
  }

  return new Response(data, {
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

async function handleDates(url, env) {
  const prefix = url.searchParams.get('prefix') || 'iof_';
  const list = await env.RANKING_STORE.list({ prefix });

  // Extract unique dates from keys like iof_F_M_2026-03-01
  const dates = new Set();
  const entries = [];

  for (const key of list.keys) {
    const parts = key.name.split('_');
    // iof_{discipline}_{gender}_{date}
    if (parts.length >= 4) {
      const date = parts.slice(3).join('_'); // handle date part
      dates.add(date);
      entries.push({
        key: key.name,
        discipline: parts[1],
        gender: parts[2],
        date,
      });
    }
  }

  return jsonResponse({
    dates: [...dates].sort(),
    entries,
  });
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}
