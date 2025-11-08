"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Battery, ShieldCheck, Smartphone, ChevronRight, PhoneCall } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatIQD } from "@/lib/format";

const BRAND = { name: "BERRY STORE", logoSrc: "/logo.png", logoAlt: "Berry Store" };
type Product = { id: string; name: string; priceIQD: number; badge?: string; image?: string };

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [cust, setCust] = useState({ name: "", phone: "", address: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetch("/api/products").then(r=>r.json()).then((d)=>setProducts(d.products || [])); }, []);

  function openOrder(p: Product) {
    setSelected(p); setQty(1); setCust({ name: "", phone: "", address: "", notes: "" });
    setIsOrderOpen(true); setSent(false); setError("");
  }

  async function submitOrder() {
    try {
      setLoading(true); setError("");
      const payload = {
        productId: selected?.id, productName: selected?.name, priceIQD: selected?.priceIQD,
        quantity: Number(qty)||1, customerName: cust.name, customerPhone: cust.phone,
        customerAddress: cust.address, notes: cust.notes, totalIQD: (Number(qty)||1)*(selected?.priceIQD||0),
      };
      const res = await fetch("/api/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("send error");
      setSent(true);
    } catch (e) { setError("تعذر إرسال الطلب. تأكد من الاتصال أو راجع إعدادات السيرفر."); }
    finally { setLoading(false); }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl overflow-hidden grid place-items-center bg-white shadow-sm border">
              <img src={BRAND.logoSrc} alt={BRAND.logoAlt} className="w-full h-full object-contain p-1" onError={(e:any)=>{e.currentTarget.style.display='none';}} />
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="font-extrabold tracking-tight text-lg">{BRAND.name}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
            <a href="#features" className="hover:text-slate-900">المميزات</a>
            <a href="#products" className="hover:text-slate-900">المنتجات</a>
            <a href="#contact" className="hover:text-slate-900">تواصل</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button className="rounded-2xl" onClick={()=>document.getElementById('products')?.scrollIntoView({behavior:'smooth'})}>اطلب الآن</Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl md:text-5xl font-black leading-tight">
              كل اللي تحتاجه لموبايلك—
              <span className="bg-clip-text text-transparent bg-gradient-to-tr from	fuchsia-600 to-indigo-600"> بجودة مضمونة</span>
            </h1>
            <p className="mt-4 text-slate-600 md:text-lg">منتجات أصلية/هاي كوالتي بأسعار تنافسية وتوصيل لكل مناطق بغداد والمحافظات.</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button className="rounded-2xl px-5" onClick={()=>document.getElementById('products')?.scrollIntoView({behavior:'smooth'})}>
                تسوّق الآن <ChevronRight className="w-4 h-4 mr-1 inline" />
              </Button>
              <Button variant="outline" className="rounded-2xl">كتالوج واتساب</Button>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              <li>🚚 توصيل سريع</li><li>🛡️ ضمان استبدال</li><li>💳 دفع عند الاستلام</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
            <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full bg-fuchsia-200/40 blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-indigo-200/40 blur-3xl" />
            <Card className="rounded-3xl shadow-xl">
              <CardContent className="p-6 md:p-8">
                <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-indigo-50 to-fuchsia-50 grid place-items-center border">
                  <Smartphone className="w-24 h-24" />
                </div>
                <div className="mt-4">
                  <div className="text-sm text-slate-500">منتج مميز</div>
                  <div className="font-bold">سماعات Copy Master جيل جديد</div>
                  <div className="text-fuchsia-700 font-extrabold">{formatIQD(35000)}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black">ليش تختارنا؟</h2>
          <div className="grid md:grid-cols-3 gap-5 mt-6">
            {[
              { icon: <Battery className="w-6 h-6" />, title: "بطاريات قوية", desc: "بنوك طاقة أصلية، شحن سريع وموثوقية عالية." },
              { icon: <Smartphone className="w-6 h-6" />, title: "اكسسوارات موبايل", desc: "كفرات، حماية شاشة، قواعد مغناطيسية، وأكثر." },
              { icon: <ShieldCheck className="w-6 h-6" />, title: "ضمان واستبدال", desc: "ضمان استبدال فوري على عيوب التصنيع." },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                <Card className="rounded-3xl">
                  <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><span className="text-indigo-600">{f.icon}</span>{f.title}</CardTitle></CardHeader>
                  <CardContent className="text-slate-600">{f.desc}</CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="py-12 md:py-16 bg-slate-50 border-t">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl md:text-3xl font-black">منتجات مختارة</h2>
            <a href="/admin"><Button variant="outline" className="rounded-2xl">لوحة التحكم</Button></a>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mt-6">
            {products.map((p) => (
              <Card key={p.id} className="rounded-3xl">
                <CardContent className="p-5">
                  <div className="aspect-square rounded-2xl border grid place-items-center bg-white overflow-hidden">
                    {p.image ? (<img src={p.image} alt={p.name} className="w-full h-full object-cover" />) : (<ShoppingBag className="w-12 h-12" />)}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div>{p.badge && <div className="text-sm text-fuchsia-700 font-semibold">{p.badge}</div>}<div className="font-bold">{p.name}</div></div>
                    <div className="font-extrabold text-indigo-600">{formatIQD(p.priceIQD)}</div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button className="rounded-2xl flex-1" onClick={()=>openOrder(p)}>اطلب الآن</Button>
                    <Button variant="outline" className="rounded-2xl">تفاصيل</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {isOrderOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm grid place-items-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between"><h4 className="font-extrabold">طلب منتج</h4><button className="text-slate-500 hover:text-slate-900" onClick={()=>setIsOrderOpen(false)}>إغلاق</button></div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><div className="text-xs text-slate-500">المنتج</div><div className="font-bold">{selected?.name}</div></div>
                <div className="text-right"><div className="text-xs text-slate-500">السعر</div><div className="font-extrabold text-indigo-700">{formatIQD(selected?.priceIQD)}</div></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm">الكمية<input type="number" min={1} value={qty} onChange={e=>setQty(Number(e.target.value))} className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" /></label>
                <div className="text-right"><div className="text-sm text-slate-500">الإجمالي التقريبي</div><div className="font-extrabold">{formatIQD((Number(qty)||1)*(selected?.priceIQD||0))}</div></div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <label className="text-sm">الاسم الكامل<input value={cust.name} onChange={e=>setCust({...cust, name: e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="مثال: محمد علي" /></label>
                <label className="text-sm">رقم الهاتف<input value={cust.phone} onChange={e=>setCust({...cust, phone: e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="07XXXXXXXX" /></label>
              </div>
              <label className="text-sm block">العنوان (تفصيلي)<input value={cust.address} onChange={e=>setCust({...cust, address: e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="المدينة، المنطقة، أقرب نقطة دالة" /></label>
              <label className="text-sm block">ملاحظات إضافية (اختياري)<textarea value={cust.notes} onChange={e=>setCust({...cust, notes: e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[90px]" placeholder="لون/موديل محدد، وقت التوصيل المفضل..." /></label>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {sent ? (<div className="rounded-xl bg-green-50 text-green-700 p-3 text-sm">تم استلام طلبك! سنتواصل معك لتأكيده. شكراً لك ♥️</div>) : (
                <div className="flex gap-3 justify-end pt-2">
                  <Button variant="outline" className="rounded-2xl" onClick={()=>setIsOrderOpen(false)}>إلغاء</Button>
                  <Button className="rounded-2xl" onClick={submitOrder} disabled={!cust.name || !cust.phone || !cust.address || !selected}>{ "إرسال الطلب" }</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <section id="contact" className="py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-black">جاهز نوصّل لبيتك؟</h3>
          <p className="mt-2 text-slate-600">اضغط الزر وتواصل ويّانه على واتساب، واحنا نجهز طلبك فورًا.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="https://wa.me/9647XXXXXXXXX" target="_blank" rel="noreferrer">
              <Button className="rounded-2xl px-5"><PhoneCall className="w-4 h-4 ml-1 inline" /> تواصل واتساب</Button>
            </a>
            <Button variant="outline" className="rounded-2xl">اتصل بنا</Button>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 text-sm text-slate-600 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} {BRAND.name} — كل الحقوق محفوظة</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-900">سياسة الخصوصية</a>
            <a href="#" className="hover:text-slate-900">الشروط والأحكام</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
