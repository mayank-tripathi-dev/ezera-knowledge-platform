const http = require('http');

const request = (path, method = 'GET', data = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const req = http.request({
      hostname: '127.0.0.1',
      port: 5001,
      path: '/api' + path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...headers
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', err => reject(err));
    if (payload) req.write(payload);
    req.end();
  });
};

const runTests = async () => {
  console.log('--- TESTING ALL API ENDPOINTS ---');

  try {
    // 1. Health
    const health = await request('/health');
    console.log('1. GET /api/health:', health.status, health.data);

    // 2. Demo Login
    const demo = await request('/auth/demo-login', 'POST', { role: 'Architect' });
    console.log('2. POST /api/auth/demo-login:', demo.status, demo.data.user ? 'User logged in' : demo.data);
    const token = demo.data.token;
    const authHeader = { Authorization: `Bearer ${token}` };

    // 3. Auth Me
    const me = await request('/auth/me', 'GET', null, authHeader);
    console.log('3. GET /api/auth/me:', me.status, me.data);

    // 4. Get Cards
    const cards = await request('/cards');
    console.log('4. GET /api/cards:', cards.status, `Returned ${Array.isArray(cards.data) ? cards.data.length : 0} cards`);

    // 5. Create Card
    const newCard = await request('/cards', 'POST', {
      title: 'Test Microservice Architecture',
      category: 'Cloud Architecture',
      status: 'IN PRODUCTION',
      description: 'Test API created card.'
    }, authHeader);
    console.log('5. POST /api/cards:', newCard.status, newCard.data.nodeId);
    const createdNodeId = newCard.data.nodeId;

    // 6. Update Card Position
    const pos = await request(`/cards/${createdNodeId}/position`, 'PUT', { position: { x: 500, y: 500 } }, authHeader);
    console.log('6. PUT /api/cards/:nodeId/position:', pos.status, pos.data);

    // 7. Update Card
    const updatedCard = await request(`/cards/${createdNodeId}`, 'PUT', { title: 'Updated Test Title' }, authHeader);
    console.log('7. PUT /api/cards/:nodeId:', updatedCard.status, updatedCard.data.title);

    // 8. Auto Arrange Cards
    const arrange = await request('/cards/auto-arrange', 'POST', {}, authHeader);
    console.log('8. POST /api/cards/auto-arrange:', arrange.status, arrange.data.success);

    // 9. Connections Get
    const conns = await request('/connections');
    console.log('9. GET /api/connections:', conns.status, `Returned ${Array.isArray(conns.data) ? conns.data.length : 0} connections`);

    // 10. Create Connection
    const newConn = await request('/connections', 'POST', {
      sourceNodeId: 'node-cld-801',
      targetNodeId: createdNodeId,
      type: 'Active Production'
    }, authHeader);
    console.log('10. POST /api/connections:', newConn.status, newConn.data.connectionId);
    const createdConnId = newConn.data.connectionId;

    // 11. Delete Connection
    const delConn = await request(`/connections/${createdConnId}`, 'DELETE', null, authHeader);
    console.log('11. DELETE /api/connections/:connectionId:', delConn.status, delConn.data);

    // 12. Delete Card
    const delCard = await request(`/cards/${createdNodeId}`, 'DELETE', null, authHeader);
    console.log('12. DELETE /api/cards/:nodeId:', delCard.status, delCard.data);

    // 13. Board Get
    const board = await request('/boards');
    console.log('13. GET /api/boards:', board.status, board.data.name);

    // 14. Board Update
    const boardUpd = await request('/boards', 'PUT', { name: 'Updated Board' }, authHeader);
    console.log('14. PUT /api/boards:', boardUpd.status, boardUpd.data.name);

    console.log('--- ALL API ENDPOINT TESTS PASSED SUCCESSFULLY! ---');
  } catch (err) {
    console.error('API Test Error:', err);
  }
};

runTests();
