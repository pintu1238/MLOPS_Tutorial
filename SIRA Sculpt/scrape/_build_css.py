import re, os, shutil

ROOT = r"C:\Users\pintu\Desktop\shopify_websites\SIRA Sculpt"
SCRAPE = os.path.join(ROOT, "scrape")
EXT = os.path.join(SCRAPE, "extracted")
ASSETS = os.path.join(ROOT, "theme", "assets")
os.makedirs(ASSETS, exist_ok=True)

html = open(os.path.join(SCRAPE, "product.html"), encoding="utf-8", errors="ignore").read()
print("product html", len(html))
for cls in ["sc-lp", "ss-lp", "ssbb", "ss-sticky", "ss-lp2"]:
    print(cls, html.find('class="' + cls + '"'), html.find("class='" + cls + "'"))

# save product css as-is
shutil.copyfile(os.path.join(EXT, "product_all_styles.css"), os.path.join(ASSETS, "ss-product.css"))
print("copied ss-product.css")

# concat homepage/header/footer/cart/contact/track css
parts = []
for fn in [
    "home_style_11.css",
    "home_style_12.css",
    "home_style_15.css",
    "home_style_16.css",
    "home_style_07.css",
]:
    p = os.path.join(EXT, fn)
    if os.path.exists(p):
        parts.append(open(p, encoding="utf-8").read())

contact = open(os.path.join(EXT, "contact.html"), encoding="utf-8").read()
cm = re.search(r"<style>(.*?)</style>", contact, re.S)
if cm:
    parts.append(cm.group(1))
track = open(os.path.join(EXT, "track.html"), encoding="utf-8").read()
tm = re.search(r"<style>(.*?)</style>", track, re.S)
if tm:
    parts.append(tm.group(1))

header_css = r"""
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Poppins:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Nunito+Sans:ital,wght@0,500;0,700;1,500;1,700&display=swap');

:root{
  --ss-cream:#FAF6EF;
  --ss-cream-2:#FAF6F1;
  --ss-blush:#F6E7DF;
  --ss-sand:#EDE3D8;
  --ss-plum:#4A2E3A;
  --ss-plum-2:#362229;
  --ss-clay:#B0654A;
  --ss-gold:#B87A6B;
  --ss-ink:#2C2C2C;
  --ss-espresso:#26201C;
}

html,body{
  background:var(--ss-cream-2)!important;
  color:var(--ss-ink);
}
body.page-width-narrow .page-wrapper,
.page-wrapper{background:var(--ss-cream-2);}
#header-group, #MainContent, footer{background:transparent;}

/* Hide Horizon chrome we replace */
#header-group .header-section,
#header-group .header-announcements,
cart-drawer-component,
.cart-drawer,
#search-modal,
dialog-component.search-modal{display:none!important;}

/* ========== HEADER ========== */
.ss-hdr{
  background:#FAF6EF;
  position:sticky; top:0; z-index:1200;
  border-bottom:1px solid rgba(44,44,44,.06);
  font-family:'Inter',-apple-system,sans-serif;
}
.ss-hdr *{box-sizing:border-box;}
.ss-hdr__bar{
  display:grid;
  grid-template-columns:1fr auto 1fr;
  align-items:center;
  gap:12px;
  max-width:1400px;
  margin:0 auto;
  padding:18px 40px;
  min-height:92px;
}
.ss-hdr__nav{display:flex;align-items:center;gap:28px;flex-wrap:wrap;}
.ss-hdr__nav a{
  color:#2c2c2c; text-decoration:none;
  font-size:14px; font-weight:500; letter-spacing:.01em;
  line-height:1.2;
}
.ss-hdr__nav a[aria-current="page"],
.ss-hdr__nav a.is-active{font-weight:600;}
.ss-hdr__nav a:hover{opacity:.7;}
.ss-hdr__logo{display:flex;justify-content:center;align-items:center;line-height:0;}
.ss-hdr__logo img{
  width:160px; height:auto; display:block; max-width:160px;
}
.ss-hdr__icons{display:flex;justify-content:flex-end;align-items:center;gap:18px;}
.ss-hdr__icon{
  width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;
  color:#2c2c2c;background:none;border:0;padding:0;cursor:pointer;text-decoration:none;position:relative;
}
.ss-hdr__icon svg{width:22px;height:22px;display:block;}
.ss-hdr__icon--cart svg{width:22px;height:26px;}
.ss-hdr__count{
  position:absolute; top:-6px; right:-8px;
  min-width:16px; height:16px; padding:0 4px;
  border-radius:99px; background:var(--ss-plum); color:#fff;
  font-size:10px; font-weight:700; display:none; align-items:center; justify-content:center;
}
.ss-hdr__count.is-on{display:inline-flex;}
.ss-hdr__burger{display:none;background:none;border:0;cursor:pointer;padding:4px;color:#2c2c2c;}
.ss-hdr__burger svg{width:18px;height:16px;}

/* Search overlay */
.ss-search{position:fixed;inset:0;z-index:2147482999;visibility:hidden;}
.ss-search.open{visibility:visible;}
.ss-search__overlay{position:absolute;inset:0;background:rgba(38,32,28,.45);opacity:0;transition:opacity .25s;}
.ss-search.open .ss-search__overlay{opacity:1;}
.ss-search__panel{
  position:relative; background:#FAF6EF; max-width:720px; margin:8vh auto 0;
  border-radius:16px; padding:22px 22px 18px; box-shadow:0 20px 50px rgba(38,32,28,.2);
  transform:translateY(-8px); transition:transform .25s;
}
.ss-search.open .ss-search__panel{transform:none;}
.ss-search__row{display:flex;gap:10px;align-items:center;}
.ss-search__input{
  flex:1;border:1px solid #e6dace;background:#fff;border-radius:999px;
  padding:14px 18px;font-size:16px;font-family:inherit;outline:none;
}
.ss-search__input:focus{border-color:var(--ss-clay);box-shadow:0 0 0 3px rgba(176,101,74,.15);}
.ss-search__go,.ss-search__x{
  width:42px;height:42px;border:0;border-radius:50%;cursor:pointer;
  background:#fff;color:var(--ss-plum);display:flex;align-items:center;justify-content:center;
}
.ss-search__results{margin-top:14px;max-height:60vh;overflow:auto;}
.ss-search__item{
  display:flex;gap:12px;align-items:center;padding:10px;border-radius:12px;
  text-decoration:none;color:var(--ss-ink);background:#fff;border:1px solid #ece2d7;margin-bottom:8px;
}
.ss-search__item:hover{border-color:var(--ss-clay);}
.ss-search__item img{width:56px;height:56px;object-fit:cover;border-radius:8px;background:var(--ss-blush);}
.ss-search__item strong{display:block;font-size:14px;font-family:Poppins,sans-serif;}
.ss-search__item span{font-size:13px;color:#6a5c53;}
.ss-search__empty{padding:18px;text-align:center;color:#6a5c53;}

/* Collection */
.sscol{background:#fff;font-family:Inter,-apple-system,sans-serif;color:var(--ss-espresso);}
.sscol__wrap{max-width:1180px;margin:0 auto;padding:48px 20px 72px;}
.sscol__head{text-align:center;max-width:640px;margin:0 auto 36px;}
.sscol__eyebrow{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--ss-clay);font-weight:600;margin:0 0 10px;}
.sscol h1{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:clamp(32px,5vw,48px);margin:0 0 12px;color:var(--ss-plum);}
.sscol__sub{color:#5a4c44;font-size:17px;margin:0;}
.sscol__grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
.sscol .pcard{display:flex;flex-direction:column;text-decoration:none;color:inherit;background:#fff;border:1px solid #EDE3D8;border-radius:16px;overflow:hidden;}
.sscol .pcard img{width:100%;aspect-ratio:1/1;object-fit:cover;background:var(--ss-blush);}
.sscol .pc-b{padding:14px;}
.sscol .pc-b h3{font-family:Poppins,sans-serif;font-size:15px;margin:0 0 6px;color:var(--ss-plum);}
.sscol .pc-p{font-size:14px;font-weight:700;}
.sscol .pc-p s{color:#a99;font-weight:500;font-size:12.5px;margin-left:4px;}
.sscol .pc-cta{color:var(--ss-clay);font-weight:700;font-size:13px;display:inline-block;margin-top:8px;}

/* Search results page */
.sssr{background:#fff;padding:48px 20px 72px;max-width:1120px;margin:0 auto;font-family:Inter,sans-serif;}
.sssr h1{font-family:Fraunces,Georgia,serif;color:var(--ss-plum);font-size:clamp(28px,4vw,40px);}
.sssr__grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:28px;}

/* Product native tweaks */
.product-information, product-information{background:#fff;}

/* 4D page */
.ss4d{background:var(--ss-cream-2);font-family:Inter,sans-serif;color:var(--ss-espresso);}
.ss4d__wrap{max-width:860px;margin:0 auto;padding:56px 22px 80px;}
.ss4d h1{font-family:Fraunces,Georgia,serif;color:var(--ss-plum);font-size:clamp(32px,5vw,48px);line-height:1.1;}
.ss4d h2{font-family:Fraunces,Georgia,serif;color:var(--ss-plum);font-size:28px;margin:32px 0 12px;}
.ss4d p{font-size:17px;line-height:1.7;color:#5a4c44;}
.ss4d ul{color:#5a4c44;line-height:1.7;}

/* Policy pages */
.sspol{background:var(--ss-cream-2);font-family:Inter,sans-serif;}
.sspol__wrap{max-width:760px;margin:0 auto;padding:56px 22px 80px;}
.sspol h1{font-family:Fraunces,Georgia,serif;color:var(--ss-plum);}
.sspol h3{color:var(--ss-plum);}
.sspol p,.sspol li{color:#5a4c44;line-height:1.7;}

/* Cart page */
.ss-cartpage{background:var(--ss-cream-2);padding:40px 20px 80px;max-width:980px;margin:0 auto;font-family:Inter,sans-serif;}
.ss-cartpage h1{font-family:Fraunces,Georgia,serif;color:var(--ss-plum);}

/* Footer brand column */
.sfoot__brand{min-width:0;}
.sfoot{--sf-bg:#4A2E3A;--sf-ink:#FAF6F1;--sf-green:#4A2E3A;--sf-gold:#B87A6B;--sf-cream:#FAF6F1;}

/* Extra responsive breakpoints requested */
@media (min-width:1920px){
  .ss-hdr__bar{max-width:1600px;padding:20px 56px;}
  .ss-hdr__logo img{width:168px;}
  .ssh .hero h1{font-size:58px;}
}
@media (min-width:1680px) and (max-width:1919px){
  .ss-hdr__bar{padding:18px 48px;}
}
@media (min-width:1600px) and (max-width:1679px){
  .ss-hdr__bar{padding:18px 40px;}
}
@media (min-width:1400px) and (max-width:1599px){
  .ss-hdr__bar{padding:16px 32px;}
}
@media (min-width:1300px) and (max-width:1399px){
  .ss-hdr__bar{padding:16px 28px;}
  .ss-hdr__nav{gap:22px;}
}
@media (min-width:1200px) and (max-width:1299px){
  .ss-hdr__bar{padding:16px 24px;}
  .ss-hdr__nav{gap:18px;}
  .ss-hdr__nav a{font-size:13.5px;}
  .sscol__grid,.sssr__grid{grid-template-columns:repeat(3,1fr);}
}
@media (min-width:992px) and (max-width:1199px){
  .ss-hdr__bar{padding:14px 20px;min-height:84px;}
  .ss-hdr__nav{gap:14px;}
  .ss-hdr__nav a{font-size:13px;}
  .ss-hdr__logo img{width:140px;}
  .sscol__grid,.sssr__grid{grid-template-columns:repeat(3,1fr);}
}
@media (min-width:768px) and (max-width:991px){
  .ss-hdr__nav{display:none;}
  .ss-hdr__burger{display:inline-flex;}
  .ss-hdr__bar{grid-template-columns:auto 1fr auto;padding:12px 16px;min-height:72px;}
  .ss-hdr__logo{justify-content:center;}
  .ss-hdr__logo img{width:132px;}
  .sscol__grid,.sssr__grid{grid-template-columns:1fr 1fr;}
  .ssh .hero h1{font-size:40px;}
}
@media (min-width:576px) and (max-width:767px){
  .ss-hdr__nav{display:none;}
  .ss-hdr__burger{display:inline-flex;}
  .ss-hdr__bar{grid-template-columns:auto 1fr auto;padding:10px 14px;min-height:68px;}
  .ss-hdr__logo img{width:120px;}
  .ss-hdr__icons{gap:12px;}
  .sscol__grid,.sssr__grid{grid-template-columns:1fr 1fr;}
}
@media (min-width:361px) and (max-width:575px){
  .ss-hdr__nav{display:none;}
  .ss-hdr__burger{display:inline-flex;}
  .ss-hdr__bar{grid-template-columns:auto 1fr auto;padding:8px 12px;min-height:64px;}
  .ss-hdr__logo img{width:110px;}
  .ss-hdr__icons{gap:10px;}
  .ss-hdr__icon svg{width:20px;height:20px;}
  .sscol__grid,.sssr__grid{grid-template-columns:1fr 1fr;gap:10px;}
  .ssh .hero-txt{padding:32px 18px;}
  .ssh .hero h1{font-size:30px;}
}
@media (min-width:321px) and (max-width:361px){
  .ss-hdr__nav{display:none;}
  .ss-hdr__burger{display:inline-flex;}
  .ss-hdr__bar{padding:8px 10px;min-height:60px;}
  .ss-hdr__logo img{width:96px;}
  .ss-hdr__icons{gap:8px;}
  .sscol__grid,.sssr__grid{grid-template-columns:1fr;}
}
@media (max-width:320px){
  .ss-hdr__nav{display:none;}
  .ss-hdr__burger{display:inline-flex;}
  .ss-hdr__bar{padding:6px 8px;min-height:56px;gap:6px;}
  .ss-hdr__logo img{width:88px;}
  .ss-hdr__icons{gap:6px;}
  .sscol__grid,.sssr__grid{grid-template-columns:1fr;}
  .ssh .hero h1{font-size:26px;}
}
"""

css = header_css + "\n\n" + "\n\n".join(parts)
open(os.path.join(ASSETS, "ss-core.css"), "w", encoding="utf-8").write(css)
print("wrote ss-core.css", len(css))
print("done")
