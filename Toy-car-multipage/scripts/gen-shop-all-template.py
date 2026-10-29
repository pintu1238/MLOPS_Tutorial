import json
from pathlib import Path

LINK = "/products/flytek-curve-rc-drift-car-4x4"

CATALOG = [
    ("FLYTEK Curve RC Drift Car 4x4", "Drift · 1:14 · 4WD · LED", "Drift", "From ₹1,376", "tc-mp-shop-01.jpg"),
    ("Ridge Runner Rock Crawler 4WD", "Crawler · Locked diffs · Trail", "Crawler", "From ₹1,499", "tc-mp-shop-02.jpg"),
    ("Pulse Hobby RC Street Racer", "Hobby · 2.4 GHz · USB charge", "Hobby RC", "From ₹1,199", "tc-mp-shop-03.jpg"),
    ("SiteBoss RC Excavator 1:14", "Construction · 360° cab", "Construction", "From ₹1,899", "tc-mp-shop-04.jpg"),
    ("Goliath Monster Truck 4x4", "Monster · Big tyres · Bash", "Monster", "From ₹1,649", "tc-mp-shop-05.jpg"),
    ("Rescue Force RC Fire Truck", "Lights · Ladder · RTR kit", "Ready to ship", "From ₹1,549", "tc-mp-shop-06.jpg"),
    ("LoadMaster RC Wheel Loader", "Construction · Articulated arm", "Construction", "From ₹1,799", "tc-mp-shop-07.jpg"),
    ("Summit King Rock Crawler Pro", "4WD · Oil shocks · Trail", "Crawler", "From ₹1,699", "tc-mp-shop-08.jpg"),
    ("Hurricane RTR Drift Muscle Kit", "Remote · Battery · Spare tyres", "Drift", "From ₹2,199", "tc-mp-shop-09.jpg"),
    ("Triple Threat RC Bundle Set", "Rally · Monster · Truggy picks", "Bundle", "From ₹3,499", "tc-mp-shop-10.jpg"),
    ("Classic Red Drift Sedan RTR", "Remote + 4 spare wheels", "Drift", "From ₹1,599", "tc-mp-shop-11.jpg"),
    ("GT-R Style Drift Pro Kit", "Remote · Cones · Charger", "Drift", "From ₹2,049", "tc-mp-shop-12.jpg"),
    ("Ferrari F1 RC Formula Racer", "Wheel remote · Pirelli slicks", "F1", "From ₹2,299", "tc-mp-shop-13.jpg"),
    ("Blaze Truggy 4x4 Stadium", "Remote · High clearance", "Off-road", "From ₹1,749", "tc-mp-shop-14.jpg"),
    ("Neon Pulse Drift LED", "Remote · Drift wheel set", "Drift", "From ₹1,899", "tc-mp-shop-15.jpg"),
    ("Bulldozer Pro RC 1:16", "Remote · Metal blade", "Construction", "From ₹1,949", "tc-mp-shop-16.jpg"),
    ("Shadow Short Course 4x4", "Remote · USB battery pack", "Off-road", "From ₹1,679", "tc-mp-shop-17.jpg"),
    ("Rally Polo WRC Replica", "Remote · Extra tyre set", "Rally", "From ₹1,829", "tc-mp-shop-18.jpg"),
    ("Teal Trail Crawler X", "Remote · Oil shocks", "Crawler", "From ₹1,769", "tc-mp-shop-19.jpg"),
    ("Titan Bash Monster Truck", "Remote · Tool kit", "Monster", "From ₹1,999", "tc-mp-shop-20.jpg"),
    ("Silver Storm Supercar", "Remote · Fast charge cable", "Hobby RC", "From ₹2,149", "tc-mp-shop-21.jpg"),
    ("MixMaster Cement Mixer RC", "Construction · Rotating drum", "Construction", "From ₹2,099", "tc-mp-shop-22.jpg"),
    ("Midnight Gold Drift Coupe", "Remote · Drift cones", "Drift", "From ₹1,959", "tc-mp-shop-23.jpg"),
    ("Skyline RC Buggy", "Remote · Stadium jump ready", "Off-road", "From ₹1,719", "tc-mp-shop-24.jpg"),
    ("Ladder Rescue Fire 1:14", "Remote · Spare wheels", "Ready to ship", "From ₹1,889", "tc-mp-shop-25.jpg"),
    ("Camo Trail Jeep 4x4", "Remote · Roof rack", "Crawler", "From ₹1,839", "tc-mp-shop-26.jpg"),
    ("Candy Drift Mini Cooper", "Remote · Li-ion pack", "Drift", "From ₹1,429", "tc-mp-shop-27.jpg"),
    ("SkyLift RC Crane Truck", "Remote · Construction", "Construction", "From ₹2,249", "tc-mp-shop-28.jpg"),
    ("Splatter Beast Truggy", "Remote · Knobby spare tyres", "Off-road", "From ₹1,869", "tc-mp-shop-29.jpg"),
    ("Widebody Street Spec R", "Remote · Wheel wrench", "Hobby RC", "From ₹2,019", "tc-mp-shop-30.jpg"),
    ("DumpKing RC Tipper", "Construction · RTR", "Construction", "From ₹1,979", "tc-mp-shop-31.jpg"),
    ("Night Raid Trail 4x4", "Remote · Dual batteries", "Crawler", "From ₹1,909", "tc-mp-shop-32.jpg"),
]

BEST = [
    ("Hurricane RTR Drift Muscle Kit", "Drift · Full box kit", "Drift", "4WD", "LED", "4.9", "312", "tc-mp-shop-09.jpg"),
    ("Classic Red Drift Sedan RTR", "Remote + spare wheels", "Drift", "RTR", "2.4G", "4.9", "248", "tc-mp-shop-11.jpg"),
    ("GT-R Style Drift Pro Kit", "Cones · Charger included", "Drift", "Pro", "Kit", "4.8", "196", "tc-mp-shop-12.jpg"),
    ("Ferrari F1 RC Formula Racer", "Wheel-style remote", "F1", "1:12", "RTR", "4.9", "174", "tc-mp-shop-13.jpg"),
    ("Goliath Monster Truck 4x4", "Bash ready · Big tyres", "Monster", "4WD", "Bash", "4.8", "158", "tc-mp-shop-05.jpg"),
    ("Summit King Rock Crawler Pro", "Trail rated crawler", "Crawler", "4x4", "Outdoor", "4.8", "142", "tc-mp-shop-08.jpg"),
    ("Titan Bash Monster Truck", "Tool kit in box", "Monster", "4WD", "LED", "4.7", "131", "tc-mp-shop-20.jpg"),
    ("FLYTEK Curve RC Drift Car 4x4", "Store bestseller · 4WD", "Drift", "1:14", "LED", "4.9", "124", "tc-mp-shop-01.jpg"),
]

blocks = {}
order = []
for i, (title, sub, tag, price, asset) in enumerate(CATALOG):
    key = f"item_{i+1:02d}"
    blocks[key] = {
        "type": "catalog_item",
        "settings": {
            "title": title,
            "subtitle": sub,
            "price_text": price,
            "tag": tag,
            "link": LINK,
            "fallback_asset": asset,
            "fallback_index": f"{i+1:02d}"[:2] if i < 9 else "01",
        },
    }
    order.append(key)

bs_blocks = {}
bs_order = []
for i, (title, sub, t1, t2, t3, rating, reviews, img) in enumerate(BEST):
    key = f"bs_{i+1:02d}"
    bs_blocks[key] = {
        "type": "product",
        "settings": {
            "product": "flytek-curve-rc-drift-car-4x4",
            "title_override": title,
            "subtitle": sub,
            "tag_1": t1,
            "tag_2": t2,
            "tag_3": t3,
            "rating": rating,
            "review_count": reviews,
            "fallback_image": img,
        },
    }
    bs_order.append(key)

data = {
    "sections": {
        "tc_mp_shop_bestsellers": {
            "type": "tc-mp-bestsellers",
            "blocks": bs_blocks,
            "block_order": bs_order,
            "settings": {
                "background_color": "#111111",
                "heading": "Bestsellers",
                "subheading": "Top picks — full kits with remote, wheels & chargers",
                "view_all_label": "",
                "view_all_link": "",
                "products_to_show": 8,
                "show_badge": True,
                "badge_text": "Hot",
                "default_rating": "4.8",
                "default_review_count": "100",
                "reviews_label": "reviews",
                "choose_options_label": "Choose options",
                "add_to_cart_label": "Add to cart",
            },
        },
        "tc_mp_shop_all": {
            "type": "tc-mp-shop-all",
            "blocks": blocks,
            "block_order": order,
            "settings": {
                "kicker": "Ready to ship",
                "heading": "Shop all RC cars",
                "subheading": "32+ remote-control rides — drift, crawl, hobby, construction, monster & more.",
                "card_cta": "View product",
                "products_per_page": 48,
                "show_store_products": False,
                "show_catalog_blocks": True,
            },
        },
    },
    "order": ["tc_mp_shop_bestsellers", "tc_mp_shop_all"],
}

out = Path(__file__).resolve().parents[1] / "templates" / "collection.tc-mp-remote-shop-155057.json"
out.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
print(f"Wrote {out} with {len(CATALOG)} catalog items and {len(BEST)} bestsellers")
