let __MEM_PRODUCTS = [
  { id: "1", name: "باور بنك 20,000mAh", priceIQD: 25000, badge: "الأكثر مبيعًا" },
  { id: "2", name: "سماعات TWS Copy Master", priceIQD: 35000, badge: "عرض خاص" },
  { id: "3", name: "حماية شاشة 9H", priceIQD: 5000, badge: "جديد" },
];

async function kvGet() {
  const url = process.env.VERCEL_KV_REST_API_URL;
  const token = process.env.VERCEL_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const res = await fetch(`${url}/get/products`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.result ? JSON.parse(data.result) : [];
}

async function kvSet(value: any) {
  const url = process.env.VERCEL_KV_REST_API_URL;
  const token = process.env.VERCEL_KV_REST_API_TOKEN;
  if (!url || !token) { __MEM_PRODUCTS = value; return; }
  const res = await fetch(`${url}/set/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ value: JSON.stringify(value) }),
  });
  if (!res.ok) throw new Error("KV set failed");
}

export async function GET() {
  const list = (await kvGet()) ?? __MEM_PRODUCTS;
  return Response.json({ products: list });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const list = (await kvGet()) ?? __MEM_PRODUCTS;
    const item = { id: Date.now().toString(), name: body.name, priceIQD: Number(body.priceIQD) || 0, badge: body.badge || undefined, image: body.image || undefined };
    const next = [item, ...list];
    await kvSet(next);
    return Response.json({ ok: true, item });
  } catch (e:any) {
    return new Response(e?.message || "error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new Response("missing id", { status: 400 });
    const list = (await kvGet()) ?? __MEM_PRODUCTS;
    const next = list.filter((x:any)=>x.id != id);
    await kvSet(next);
    return Response.json({ ok: true });
  } catch (e:any) {
    return new Response(e?.message || "error", { status: 500 });
  }
}
