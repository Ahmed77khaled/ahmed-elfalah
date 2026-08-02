const tokenMessages = '8790393178:AAEJKEMwituS7Exp9xmcDrLESF1_fUYqc8c';
const tokenVisitors = '8352050648:AAGLq-QTCZ-bxUNCDPVICq15n9XK6a71NpI';

async function check(name, token) {
  console.log(`=== Checking Bot: ${name} ===`);
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    const data = await res.json();
    if (data.ok && data.result) {
      console.log('Updates count:', data.result.length);
      const chatIds = new Set();
      data.result.forEach(u => {
        const chat = u.message?.chat || u.my_chat_member?.chat || u.channel_post?.chat;
        if (chat) {
          chatIds.add(`${chat.id} (${chat.first_name || chat.title || chat.username || 'User'})`);
        }
      });
      if (chatIds.size > 0) {
        console.log('Found Chat IDs:', Array.from(chatIds).join(', '));
      } else {
        console.log('No chat IDs found in updates. Please send a message (e.g. /start) to the bot in Telegram!');
      }
    } else {
      console.log('API Error:', data.description);
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

async function run() {
  await check('Portfolio Messages Bot', tokenMessages);
  console.log('');
  await check('Visitors Bot', tokenVisitors);
}

run();
