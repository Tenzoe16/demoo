export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const webhook = process.env.N8N_HOTEL_WEBHOOK;
  if (!webhook) { res.status(500).json({ error: 'N8N_HOTEL_WEBHOOK env not set' }); return; }
  const b = req.body || {};
  const upstream = await fetch(webhook, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: b.customerName, customerPhone: b.customerPhone,
      checkIn: b.checkIn, checkOut: b.checkOut, roomType: b.roomType,
      guests: Number(b.guests || 1), sessionId: 'web-' + Date.now(),
    }),
  });
  res.status(200).json(await upstream.json());
}
