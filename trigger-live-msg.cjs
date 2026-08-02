async function run() {
  const res = await fetch('https://ahmed-elfalah.vercel.app/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Ahmed Test User',
      email: 'ahmed@example.com',
      subject: 'Portfolio Contact Test',
      message: 'Hello! Testing live Telegram notification delivery from ahmed-elfalah.vercel.app!'
    })
  });
  const data = await res.json();
  console.log('API Response:', data);
}
run().catch(console.error);
