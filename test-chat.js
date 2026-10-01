const http = require('http');

async function testChat() {
  const messagesList = [
    [{ role: 'user', content: 'What is your name and what do you do?' }],
    [{ role: 'user', content: 'Can you help me write a python script for sorting an array?' }],
    [{ role: 'user', content: 'Who are your main clients?' }]
  ];

  for (let i = 0; i < messagesList.length; i++) {
    console.log(`\n--- Test ${i + 1} ---`);
    console.log(`Input: ${messagesList[i][0].content}`);
    
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesList[i] })
      });
      
      const data = await response.json();
      console.log(`Status: ${response.status}`);
      console.log(`Model Used: ${data.model_used}`);
      console.log(`Response: ${data.content}`);
    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
  }
}

testChat();
