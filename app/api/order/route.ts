import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const token = process.env.TELEGRAM_BOT_TOKEN!;
    let chatId = process.env.TELEGRAM_CHAT_ID!;
    if (!token || !chatId) return new Response("Missing Telegram env vars", { status: 500 });

    const { productId, productName, priceIQD, quantity, customerName, customerPhone, customerAddress, notes, totalIQD } = data || {};

    const text =
      `🛒 طلب جديد\n` +
      `---------------------------\n` +
      `👤 الاسم: ${customerName}\n` +
      `📞 الهاتف: ${customerPhone}\n` +
      `📍 العنوان: ${customerAddress}\n\n` +
      `📦 المنتج: ${productName} (ID: ${productId})\n` +
      `🔢 الكمية: ${quantity}\n` +
      `💵 السعر/واحد: ${priceIQD} IQD\n` +
      `🧮 الإجمالي: ${totalIQD} IQD\n` +
      (notes ? `\n📝 ملاحظات: ${notes}` : "");

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!tgRes.ok) {
      const err = await tgRes.text();
      return new Response(`Telegram error: ${err}`, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (e:any) {
    return new Response(`Bad request: ${e?.message || e}`, { status: 400 });
  }
}
