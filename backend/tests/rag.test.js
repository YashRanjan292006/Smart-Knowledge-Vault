const request = require('supertest');
const app = require('../src/app');

describe('RAG Pipeline Application APIs', () => {

  it('should return health check 200 asserting general startup connectivity', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.msg).toBe('System Online');
  });

  describe('Authentication & Security', () => {
    it('should cleanly reject unauthorized chat queries targeting the core vector database', async () => {
      const res = await request(app)
          .post('/api/chat')
          .send({ query: 'What is deep learning?' });
      
      expect(res.statusCode).toEqual(401); 
      expect(res.body.message).toBe('Not authorized, no token');
    });

    it('should assert 404 for random invalid paths protecting architecture scopes', async () => {
        const res = await request(app).get('/api/invalid-admin-path');
        expect(res.statusCode).toEqual(404);
    });
  });

  // Note: Due to the complexity of MongoDB Atlas integrations and Local Transformer instantiation, 
  // advanced semantic embedding tests are typically mocked in true CICD to avoid blocking.
});
