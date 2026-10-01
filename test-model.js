const http = require('http');
async function testModelQuestion() {
  const input = [{ role: 'user', content: 'You seem very smart. What model are you running on? Are you ChatGPT?' }];
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: input })
    });
    const data = await response.json();
    console.log('Response:', data.content);
  } catch(e) { console.error(e); }
}
testModelQuestion();
