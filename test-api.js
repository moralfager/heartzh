#!/usr/bin/env node

// Простая проверка API тестов
const https = require('https');

const options = {
  hostname: 'heartofzha.ru',
  port: 443,
  path: '/api/admin/tests',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; API-Test)'
  }
};

console.log('🔍 Проверяем API тестов на production...\n');

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('\n📊 Ответ API:');
      console.log(JSON.stringify(json, null, 2));
      
      if (json.tests && json.tests.length > 0) {
        console.log(`\n✅ Найдено тестов: ${json.tests.length}`);
        json.tests.forEach((test, i) => {
          console.log(`${i+1}. ${test.title} (${test.slug}) - published: ${test.published}`);
        });
      } else {
        console.log('\n❌ Тесты не найдены');
      }
    } catch (e) {
      console.log('\n❌ Ошибка парсинга JSON:', e.message);
      console.log('Raw data:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Ошибка запроса:', e.message);
});

req.end();



