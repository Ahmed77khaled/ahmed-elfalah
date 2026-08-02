const tokenMessages = '8790393178:AAEJKEMwituS7Exp9xmcDrLESF1_fUYqc8c';
const tokenVisitors = '8352050648:AAGLq-QTCZ-bxUNCDPVICq15n9XK6a71NpI';
const chatId = '8275645729';

async function sendTest(botName, token, text) {
  console.log(`Sending test from ${botName} to chat ${chatId}...`);
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML'
      })
    });
    const data = await res.json();
    console.log(`Result from ${botName}:`, data);
  } catch (e) {
    console.error(`Error sending from ${botName}:`, e.message);
  }
}

async function run() {
  await sendTest(
    'Portfolio Messages Bot',
    tokenMessages,
    '📬 <b>Test Notification from Portfolio Bot</b>\n\nTelegram contact notifications are now active!'
  );

  console.log('');

  await sendTest(
    'Visitors Bot',
    tokenVisitors,
    '👁️ <b>Test Notification from Visitors Bot</b>\n\nWebsite visitor and admin login tracking is now active!'
  );
}

run();
