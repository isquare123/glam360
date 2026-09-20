import React,{useEffect,useMemo,useState} from "react";
import {createRoot} from "react-dom/client";
import {createClient} from "@supabase/supabase-js";
import {Search,RefreshCw,Package,Plus,Boxes,AlertTriangle,ShoppingCart,IndianRupee,Printer,Minus,Trash2,Mail,LockKeyhole,Eye,EyeOff,ArrowRight,Check,CalendarDays,Receipt,BarChart3,ShieldCheck,MonitorSmart,Headphones} from "lucide-react";
import "./styles.css";
const SUPABASE_URL="https://izqeunbudrfizzamslqs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_ErxcEv-eqgwsKGqJNCeW0g_oU6OQCUK";
const supabase=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
const money=(m:number)=>"₹"+(m/100).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
const minor=(v:string)=>Math.round(Number(v||0)*100);
type Product={id:string;name:string;sku:string|null;barcode:string|null;unit:string;cost_minor:number;selling_price_minor:number;tax_rate:number;is_active:boolean;category_id:string|null};
type Category={id:string;name:string;is_active:boolean}; type Stock={product_id:string;branch_id:string;quantity:number;reorder_level:number}; type Branch={id:string;name:string;organization_id:string}; type Customer={id:string;full_name:string;phone:string|null};
type Invoice={id:string;invoice_number:string;status:string;total_minor:number;paid_minor:number;customer_id:string|null;issued_at:string|null;created_at:string};
function AuthScreen({onSignedIn}:{onSignedIn:(user:any)=>void}){
 const [mode,setMode]=useState<"login"|"signup">("login");
 const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
 const [salon,setSalon]=useState(""); const [branch,setBranch]=useState("");
 const [showPassword,setShowPassword]=useState(false); const [remember,setRemember]=useState(true);
 const [busy,setBusy]=useState(false); const [msg,setMsg]=useState("");
 async function submit(e:any){
  e.preventDefault();setBusy(true);setMsg("");
  if(mode==="login"){
   const {data,error}=await supabase.auth.signInWithPassword({email,password});
   if(error)setMsg(error.message); else if(data.user)onSignedIn(data.user);
  }else{
   if(!salon.trim()||!branch.trim()){setMsg("Salon name and first branch are required.");setBusy(false);return}
   const slug=salon.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"salon";
   const {data,error}=await supabase.auth.signUp({email,password});
   if(error)setMsg(error.message);
   else if(data.user&&data.session){
    const {error:oe}=await supabase.rpc("complete_organization_onboarding",{organization_name:salon,organization_slug:slug,first_branch_name:branch,first_service_name:"Haircut"});
    if(oe)setMsg(oe.message); else onSignedIn(data.user);
   }else{
    localStorage.setItem("glam360_pending_onboarding",JSON.stringify({salon,branch,slug}));
    setMsg("Account created. Please confirm your email, then sign in.");
    setMode("login");
   }
  }
  setBusy(false);
 }
 async function google(){
  setMsg("");const {error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}});
  if(error)setMsg(error.message);
 }
 async function forgot(){
  if(!email){setMsg("Enter your email first.");return}
  const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin});
  setMsg(error?error.message:"Password reset link sent to your email.");
 }
 return <div className="authPage">
  <div className="authShell">
   <section className="authVisual">
    <div className="visualOverlay"></div>
    <div className="visualTop"><div className="visualBrand">GLAM<span>360</span></div><div className="visualSub">Salon Management</div></div>
    <div className="visualCopy"><div className="goldLine"></div><h2>Beautiful<br/>Business<br/>Starts <span>Here.</span></h2><p>Manage&nbsp;&nbsp; | &nbsp;&nbsp;Grow&nbsp;&nbsp; | &nbsp;&nbsp;Delight</p></div>
    <div className="visualBottom">
      <div><CalendarDays/><span>Appointments</span></div><div><Receipt/><span>POS & Billing</span></div><div><Package/><span>Inventory</span></div><div><BarChart3/><span>Reports</span></div>
    </div>
   </section>
   <section className="authPanel">
    <div className="authTopLink">{mode==="login"?"New to GLAM360?":"Already have an account?"} <button onClick={()=>{setMode(mode==="login"?"signup":"login");setMsg("")}}>{mode==="login"?"Create an account":"Sign In"}</button></div>
    <div className="authContent">
      <p className="authKicker">GLAM360 • SALON MANAGEMENT</p>
      <h1>{mode==="login"?"Welcome Back":"Create your salon account"}</h1>
      <p className="authSubtitle">{mode==="login"?"Sign in to your salon management system":"Start your GLAM360 workspace."}</p>
      <form onSubmit={submit} className="authForm">
       {mode==="signup"&&<><label className="authField"><span>Salon name</span><div><Receipt/><input value={salon} onChange={e=>setSalon(e.target.value)} placeholder="Enter salon name" required/></div></label><label className="authField"><span>First branch</span><div><MonitorSmart/><input value={branch} onChange={e=>setBranch(e.target.value)} placeholder="Main Branch" required/></div></label></>}
       <label className="authField"><span>Email</span><div><Mail/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email" required/></div></label>
       <label className="authField"><span>Password</span><div><LockKeyhole/><input type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" minLength={6} required/><button type="button" className="fieldIcon" onClick={()=>setShowPassword(v=>!v)}>{showPassword?<EyeOff/>:<Eye/>}</button></div></label>
       {msg&&<div className="authMsg">{msg}</div>}
       <div className="authOptions"><label className="remember"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/><span><Check/></span>Remember me</label><button type="button" className="forgot" onClick={forgot}>Forgot password?</button></div>
       <button className="authPrimary" disabled={busy}>{busy?"Please wait…":mode==="login"?"Sign In":"Create Account"}<ArrowRight/></button>
      </form>
      <div className="authDivider"><span>or</span></div>
      <button className="googleButton" onClick={google}><span className="googleMark">G</span>Continue with Google</button>
      <div className="authBenefits"><div><ShieldCheck/><span>Secure & Reliable</span></div><div><MonitorSmart/><span>Access Anywhere</span></div><div><Headphones/><span>Dedicated Support</span></div></div>
    </div>
    <div className="authFooter"><span>© 2026 GLAM360. All rights reserved.</span><span>MORE THAN A SALON ♥</span></div>
   </section>
  </div>
 </div>
}
function App({user}:{user:any}){
const [page,setPage]=useState<"inventory"|"pos"|"sales">("inventory");
const [products,setProducts]=useState<Product[]>([]),[cats,setCats]=useState<Category[]>([]),[stock,setStock]=useState<Stock[]>([]),[branches,setBranches]=useState<Branch[]>([]),[customers,setCustomers]=useState<Customer[]>([]),[invoices,setInvoices]=useState<Invoice[]>([]);
const [branchId,setBranchId]=useState(""),[q,setQ]=useState(""),[loading,setLoading]=useState(true),[notice,setNotice]=useState("");
const [showProduct,setShowProduct]=useState(false),[showStock,setShowStock]=useState<Product|null>(null);
const [form,setForm]=useState({name:"",sku:"",barcode:"",unit:"pcs",cost:"",price:"",tax:"",category_id:""});
const [stockQty,setStockQty]=useState(""),[stockType,setStockType]=useState("purchase"); const [cart,setCart]=useState<{product:Product;qty:number}[]>([]),[customerId,setCustomerId]=useState(""),[saleBusy,setSaleBusy]=useState(false);
const stockMap=useMemo(()=>Object.fromEntries(stock.map(s=>[s.product_id,s])),[stock]); const catMap=useMemo(()=>Object.fromEntries(cats.map(c=>[c.id,c.name])),[cats]);
const filtered=products.filter(p=>(p.name+" "+(p.sku||"")+" "+(p.barcode||"")).toLowerCase().includes(q.toLowerCase())); const cartTotal=cart.reduce((a,x)=>a+x.product.selling_price_minor*x.qty,0);
async function load(){setLoading(true);const r=await Promise.all([supabase.from("products").select("*").order("name"),supabase.from("product_categories").select("*").order("name"),supabase.from("branches").select("id,name,organization_id").order("name"),branchId?supabase.from("branch_inventory").select("*").eq("branch_id",branchId):Promise.resolve({data:[],error:null}),supabase.from("customers").select("id,full_name,phone").order("full_name").limit(500),supabase.from("invoices").select("id,invoice_number,status,total_minor,paid_minor,customer_id,issued_at,created_at").order("created_at",{ascending:false}).limit(100)]);setProducts((r[0].data||[]) as Product[]);setCats((r[1].data||[]) as Category[]);setBranches((r[2].data||[]) as Branch[]);setStock((r[3].data||[]) as Stock[]);setCustomers((r[4].data||[]) as Customer[]);setInvoices((r[5].data||[]) as Invoice[]);if(!branchId&&r[2].data?.[0])setBranchId(r[2].data[0].id);setLoading(false)}
useEffect(()=>{load()},[]);useEffect(()=>{if(branchId)load()},[branchId]);
async function addProduct(){if(!form.name||!form.price){setNotice("Product name and selling price are required.");return}const branch=branches.find(b=>b.id===branchId); if(!branch){setNotice("Select a branch first.");return} const {error}=await supabase.from("products").insert({organization_id:(branch as any).organization_id,name:form.name,sku:form.sku||null,barcode:form.barcode||null,unit:form.unit,cost_minor:minor(form.cost),selling_price_minor:minor(form.price),tax_rate:Number(form.tax||0),category_id:form.category_id||null});setNotice(error?error.message:"Product added.");if(!error){setShowProduct(false);setForm({name:"",sku:"",barcode:"",unit:"pcs",cost:"",price:"",tax:"",category_id:""});load()}}
async function adjustStock(){if(!showStock||!branchId||Number(stockQty)<=0)return;const {error}=await supabase.rpc("adjust_product_stock",{target_branch_id:branchId,target_product_id:showStock.id,movement:stockType,movement_quantity:Number(stockQty),movement_notes:"Inventory screen adjustment"});setNotice(error?error.message:"Stock updated successfully.");if(!error){setShowStock(null);setStockQty("");load()}}
function addToCart(p:Product){setCart(c=>{const x=c.find(i=>i.product.id===p.id);return x?c.map(i=>i.product.id===p.id?{...i,qty:i.qty+1}:i):[...c,{product:p,qty:1}]})}
async function createSale(){if(!branchId||!cart.length)return;setSaleBusy(true);const {data:u}=await supabase.auth.getUser();if(!u.user){setNotice("Please sign in first.");setSaleBusy(false);return}const {data:b}=await supabase.from("branches").select("organization_id").eq("id",branchId).single();if(!b?.organization_id){setNotice("Could not determine branch organization.");setSaleBusy(false);return}const {data:inv,error:e}=await supabase.from("invoices").insert({organization_id:b.organization_id,branch_id:branchId,customer_id:customerId||null,invoice_number:"",status:"draft",subtotal_minor:cartTotal,discount_minor:0,tax_minor:0,total_minor:cartTotal,paid_minor:0,created_by:u.user.id}).select().single();if(e||!inv){setNotice(e?.message||"Could not create invoice.");setSaleBusy(false);return}const {error:ie}=await supabase.from("invoice_items").insert(cart.map(x=>({invoice_id:inv.id,organization_id:inv.organization_id,item_type:"product",item_name:x.product.name,product_id:x.product.id,quantity:x.qty,quantity_numeric:x.qty,unit_price_minor:x.product.selling_price_minor,discount_minor:0,tax_minor:0,line_total_minor:x.product.selling_price_minor*x.qty})));if(ie){setNotice(ie.message);setSaleBusy(false);return}const {data:issued,error:ie2}=await supabase.rpc("issue_invoice",{target_invoice_id:inv.id});setNotice(ie2?ie2.message:"Sale "+(issued?.invoice_number||"")+" created. Stock deducted automatically.");if(!ie2){setCart([]);setCustomerId("");load()}setSaleBusy(false)}
function print(i:Invoice){const c=customers.find(x=>x.id===i.customer_id);const w=window.open("","_blank");if(w){w.document.write("<h1>GLAM360</h1><p>Invoice: "+i.invoice_number+"</p><p>Customer: "+(c?.full_name||"Walk-in")+"</p><h2>"+money(i.total_minor)+"</h2><script>window.print()</script>");w.document.close()}}
return <div className="app"><aside><div className="brand"><div className="logo">G</div><div><b>GLAM360</b><small>Salon SaaS</small></div></div><nav>{[["inventory","Inventory"],["pos","POS / Billing"],["sales","Sales & Invoices"]].map(x=><button key={x[0]} className={page===x[0]?"active":""} onClick={()=>setPage(x[0] as any)}>{x[1]}</button>)}</nav><div className="phase">PHASE 1D<br/><span>Inventory + Product Sales</span></div></aside>
<main><header><div><p className="eyebrow">GLAM360 • PHASE 1D</p><h1>{page==="inventory"?"Inventory":page==="pos"?"POS / Product Sale":"Sales & Invoices"}</h1><p className="muted">Salon inventory, product sales and invoices.</p></div><div className="headActions"><select value={branchId} onChange={e=>setBranchId(e.target.value)}>{branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select><button className="outline" onClick={load}><RefreshCw size={16}/> Refresh</button><button className="outline" onClick={()=>supabase.auth.signOut()}>Sign Out</button></div></header>
{page==="inventory"&&(<><section className="cards"><div><span>Products</span><strong>{products.length}</strong></div><div><span>Stock items</span><strong>{stock.length}</strong></div><div><span>Low stock</span><strong>{products.filter(p=>(stockMap[p.id]?.quantity||0)<=(stockMap[p.id]?.reorder_level||0)).length}</strong></div><div><span>Inventory value</span><strong>{money(products.reduce((a,p)=>a+(stockMap[p.id]?.quantity||0)*p.cost_minor,0))}</strong></div></section><section className="panel"><div className="toolbar"><div className="search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search product, SKU or barcode"/></div><button className="primary" onClick={()=>setShowProduct(true)}><Plus size={17}/> Add Product</button></div><div className="table"><div className="thead"><span>Product</span><span>SKU / Barcode</span><span>Category</span><span>Stock</span><span>Price</span><span>Action</span></div>{loading?<div className="empty">Loading…</div>:filtered.map(p=>{const s=stockMap[p.id];const low=(s?.quantity||0)<=(s?.reorder_level||0);return <div className="row" key={p.id}><span><b>{p.name}</b><small>{p.unit}</small></span><span>{p.sku||"—"}<small>{p.barcode||""}</small></span><span>{p.category_id?catMap[p.category_id]:"Uncategorized"}</span><span className={low?"low":""}>{s?.quantity??0} {p.unit}{low&&<em><AlertTriangle size={13}/> Low</em>}</span><span>{money(p.selling_price_minor)}</span><span><button className="mini" onClick={()=>setShowStock(p)}><Boxes size={15}/> Stock</button></span></div>})}</div></section></>)}
{page==="pos"&&(<section className="pos"><div className="panel"><div className="toolbar"><div className="search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search product or barcode"/></div></div><div className="productGrid">{filtered.map(p=><button className="productCard" key={p.id} onClick={()=>addToCart(p)}><div className="productIcon"><Package/></div><b>{p.name}</b><span>{money(p.selling_price_minor)}</span><small>Stock: {stockMap[p.id]?.quantity??0} {p.unit}</small></button>)}</div></div><div className="panel cart"><div className="cartHead"><h2><ShoppingCart size={19}/> Current Sale</h2></div><select value={customerId} onChange={e=>setCustomerId(e.target.value)}><option value="">Walk-in Customer</option>{customers.map(c=><option key={c.id} value={c.id}>{c.full_name}</option>)}</select><div className="cartItems">{cart.length?cart.map(x=><div className="cartItem" key={x.product.id}><div><b>{x.product.name}</b><small>{money(x.product.selling_price_minor)} each</small></div><div className="qty"><button onClick={()=>setCart(c=>c.map(i=>i.product.id===x.product.id?{...i,qty:Math.max(1,i.qty-1)}:i))}><Minus size={14}/></button><b>{x.qty}</b><button onClick={()=>addToCart(x.product)}><Plus size={14}/></button><button onClick={()=>setCart(c=>c.filter(i=>i.product.id!==x.product.id))}><Trash2 size={14}/></button></div></div>):<div className="empty">Add products to start.</div>}</div><div className="cartTotal"><span>Total</span><strong>{money(cartTotal)}</strong></div><button className="primary checkout" disabled={saleBusy||!cart.length} onClick={createSale}><IndianRupee size={18}/>{saleBusy?"Processing…":"Create Sale & Deduct Stock"}</button></div></section>)}
{page==="sales"&&(<section className="panel"><div className="toolbar"><b>Recent invoices</b></div><div className="table"><div className="thead"><span>Invoice</span><span>Customer</span><span>Date</span><span>Total</span><span>Status</span><span></span></div>{invoices.map(i=><div className="row" key={i.id}><span><b>{i.invoice_number||"Draft"}</b></span><span>{customers.find(c=>c.id===i.customer_id)?.full_name||"Walk-in"}</span><span>{i.issued_at?new Date(i.issued_at).toLocaleDateString("en-IN"):"—"}</span><span>{money(i.total_minor)}</span><span className="status">{i.status}</span><span><button className="mini" onClick={()=>print(i)}><Printer size={15}/> Print</button></span></div>)}</div></section>)}
{notice&&<div className="toast">{notice}</div>}
{showProduct&&<div className="modal"><div className="modalCard"><h2>Add Product</h2><div className="formgrid"><label>Product name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Category<select value={form.category_id} onChange={e=>setForm({...form,category_id:e.target.value})}><option value="">Uncategorized</option>{cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>SKU<input value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})}/></label><label>Barcode<input value={form.barcode} onChange={e=>setForm({...form,barcode:e.target.value})}/></label><label>Unit<input value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}/></label><label>Cost ₹<input type="number" value={form.cost} onChange={e=>setForm({...form,cost:e.target.value})}/></label><label>Selling ₹<input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label><label>Tax %<input type="number" value={form.tax} onChange={e=>setForm({...form,tax:e.target.value})}/></label></div><div className="modalActions"><button className="outline" onClick={()=>setShowProduct(false)}>Cancel</button><button className="primary" onClick={addProduct}>Save Product</button></div></div></div>}
{showStock&&<div className="modal"><div className="modalCard small"><h2>{showStock?.name}</h2><label>Movement<select value={stockType} onChange={e=>setStockType(e.target.value)}><option value="purchase">Add stock / Purchase</option><option value="adjustment_in">Adjustment In</option><option value="adjustment_out">Adjustment Out</option><option value="return">Return</option></select></label><label>Quantity<input type="number" value={stockQty} onChange={e=>setStockQty(e.target.value)}/></label><div className="modalActions"><button className="outline" onClick={()=>setShowStock(null)}>Cancel</button><button className="primary" onClick={adjustStock}>Update Stock</button></div></div></div>}
</main></div>};
function Root(){
 const [user,setUser]=useState<any>(null); const [checking,setChecking]=useState(true);
 useEffect(()=>{supabase.auth.getUser().then(({data})=>{setUser(data.user);setChecking(false)});const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setUser(s?.user??null));return()=>subscription.unsubscribe()},[]);
 if(checking)return <div className="authPage"><div className="authCard"><div className="authLogo">G</div><h2>Loading GLAM360…</h2></div></div>;
 return user?<App user={user}/>:<AuthScreen onSignedIn={setUser}/>;
}
createRoot(document.getElementById("root")!).render(<Root/>);