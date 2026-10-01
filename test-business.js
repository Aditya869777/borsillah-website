const http = require('http');
async function testBusinessQuestion() {
  const input = [{ role: 'user', content: 'Do you supply to Maharashtra? And what is your minimum order quantity for custom blending?' }];
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
testBusinessQuestion();
