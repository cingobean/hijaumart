import http from 'node:http';
import { URL } from 'node:url';
import { categories, products } from '../src/catalog.js';

const port = Number(process.env.PORT || 4000);
const cartItems = [];

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    request.on('error', reject);
  });
}

function getFilteredProducts(searchParams) {
  const query = (searchParams.get('q') || '').trim().toLowerCase();
  const category = searchParams.get('category') || 'Semua';
  const onlyPromo = searchParams.get('promo') === 'true';
  const sort = searchParams.get('sort') || 'popular';

  let filtered = products.filter((product) => {
    const matchesQuery = product.name.toLowerCase().includes(query);
    const categoryMatch =
      category === 'Semua' ||
      product.name.toLowerCase().includes(category.toLowerCase()) ||
      (category === 'Elektronik' && /galaxy|headphone/i.test(product.name)) ||
      (category === 'Fashion' && /sepatu|kemeja/i.test(product.name)) ||
      (category === 'Makanan' && /kopi/i.test(product.name)) ||
      (category === 'Rumah Tangga' && /rak|panci/i.test(product.name)) ||
      (category === 'Kesehatan' && /serum/i.test(product.name));

    return matchesQuery && categoryMatch && (!onlyPromo || Number.parseInt(product.discount, 10) >= 20);
  });

  if (sort === 'price-low') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === 'price-high') filtered = [...filtered].sort((a, b) => b.price - a.price);

  return filtered;
}

async function handleRequest(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/api/health') {
    sendJson(response, 200, {
      status: 'ok',
      service: 'hijaumart-api',
      uptime: Math.round(process.uptime())
    });
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/api/categories') {
    sendJson(response, 200, { data: categories });
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/api/products') {
    sendJson(response, 200, { data: getFilteredProducts(requestUrl.searchParams) });
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/api/cart') {
    sendJson(response, 200, {
      data: cartItems,
      count: cartItems.length,
      total: cartItems.reduce((sum, item) => sum + item.price, 0)
    });
    return;
  }

  if (request.method === 'POST' && requestUrl.pathname === '/api/cart') {
    try {
      const body = await readBody(request);
      const product = products.find((item) => item.id === body.productId || item.name === body.name);

      if (!product) {
        sendJson(response, 404, { message: 'Product not found' });
        return;
      }

      cartItems.push({ ...product, cartId: `${product.id}-${Date.now()}` });
      sendJson(response, 201, {
        data: cartItems,
        count: cartItems.length,
        latest: product
      });
    } catch (error) {
      sendJson(response, 400, { message: 'Invalid JSON body' });
    }
    return;
  }

  if (request.method === 'DELETE' && requestUrl.pathname === '/api/cart') {
    cartItems.length = 0;
    sendJson(response, 200, { data: cartItems, count: 0 });
    return;
  }

  sendJson(response, 404, { message: 'Route not found' });
}

const server = http.createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    console.error(error);
    sendJson(response, 500, { message: 'Internal server error' });
  });
});

server.listen(port, () => {
  console.log(`HijauMart API running at http://127.0.0.1:${port}`);
});
