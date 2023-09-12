const exp = require('constants');
const http = require('http')

describe('Products API', () => {
  test('GET: Should return 3 products', () => {
    http.get({ path: '/products', hostname: 'localhost', port: 3000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += "" + chunk })
      res.on('end', () => { expect(JSON.parse(body).length).toBe(3) })
    })
  })
  
  test('GET: Should return 2 products', () => {
    http.get({ path: '/products?page=1&pageSize=2', hostname: 'localhost', port: 3000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += "" + chunk })
      res.on('end', () => { expect(JSON.parse(body).length).toBe(2) })
    })
  })

  test('PUT: Should update a product', () => {
    const updatedProduct = { id: 3, name: 'Updated Book', author: 'Updated Author' }
    const options = {
      path: '/products',
      hostname: 'localhost',
      port: 3000,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += "" + chunk })
      res.on('end', () => { expect(JSON.parse(body).name).toBe(updatedProduct.name) })
    })
    req.write(JSON.stringify(updatedProduct))
    req.end()
  })
})
