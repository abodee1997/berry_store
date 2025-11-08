"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
type Product = { id: string; name: string; priceIQD: number; badge?: string; image?: string };

export default function Admin() {
  const [list, setList] = useState<Product[]>([]);
  const [p, setP] = useState({ name: "", priceIQD: "", badge: "", image: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() { const r = await fetch("/api/products"); const d = await r.json(); setList(d.products || []); }
  useEffect(()=>{ load(); }, []);

  async function add() {
    setLoading(true); setMsg("");
    const res = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, priceIQD: Number(p.priceIQD) || 0 }) });
    if (res.ok) { setP({ name: "", priceIQD: "", badge: "", image: "" }); await load(); setMsg("✔️ تمت الإضافة"); }
    else setMsg("❌ تعذر الإضافة");
    setLoading(false);
  }
  async function remove(id: string) { const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, { method: "DELETE" }); if (res.ok) await load(); }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="rounded-3xl"><CardHeader><CardTitle>لوحة التحكم — المنتجات</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-4 gap-3">
              <input className="rounded-xl border px-3 py-2" placeholder="اسم المنتج" value={p.name} onChange={e=>setP({...p, name: e.target.value})}/>
              <input className="rounded-xl border px-3 py-2" placeholder="السعر بالدينار" value={p.priceIQD} onChange={e=>setP({...p, priceIQD: e.target.value})}/>
              <input className="rounded-xl border px-3 py-2" placeholder="بادج (اختياري)" value={p.badge} onChange={e=>setP({...p, badge: e.target.value})}/>
              <input className="rounded-xl border px-3 py-2" placeholder="رابط الصورة (اختياري)" value={p.image} onChange={e=>setP({...p, image: e.target.value})}/>
            </div>
            <div className="flex gap-3"><Button onClick={add} disabled={loading || !p.name}>إضافة منتج</Button>{msg && <div className="text-sm text-slate-600">{msg}</div>}</div>
          </CardContent></Card>

        <Card className="rounded-3xl"><CardHeader><CardTitle>القائمة الحالية</CardTitle></CardHeader>
          <CardContent><div className="grid md:grid-cols-3 gap-4">
            {list.map((it) => (
              <div key={it.id} className="rounded-2xl border p-4 bg-white">
                <div className="font-bold mb-1">{it.name}</div>
                <div className="text-sm text-slate-600 mb-2">{it.priceIQD} IQD {it.badge ? `— ${it.badge}` : ""}</div>
                <div className="flex gap-2"><Button variant="outline" onClick={()=>remove(it.id)}>حذف</Button></div>
              </div>
            ))}
          </div></CardContent></Card>
      </div>
    </div>
  );
}
