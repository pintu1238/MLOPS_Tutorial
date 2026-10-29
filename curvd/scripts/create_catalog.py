"""Create CURVD products, collection, pages, and blog on the Shopify store."""
import json
import subprocess
import pathlib

ROOT = pathlib.Path(r"C:\Users\pintu\Desktop\shopify_websites\curvd")
STORE = "y9yn6k-me.myshopify.com"
PRODUCTS = json.loads((ROOT / "_scrape_products_json_limit_250.txt").read_text(encoding="utf-8"))["products"]

PRICES = {
    "performance-work-trousers": ("6400.00", "10300.00"),
    "comfort-stretch-smart-capri-pants-high-rise-all-day-comfort": ("6400.00", None),
    "tank-top-bra": ("3800.00", "5100.00"),
    "sherpa-fur-leggings-toasty-warm-figure-shaping": ("6400.00", "11600.00"),
    "curvd-cozy-suede-look-slippers": ("5878.00", "6400.00"),
    "curvd-cozy-fall-slouch-socks": ("1300.00", "1960.00"),
}

MUTATION = """
mutation productSet($input: ProductSetInput!) {
  productSet(synchronous: true, input: $input) {
    product { id handle title }
    userErrors { field message code }
  }
}
"""

PAGE_MUTATION = """
mutation pageCreate($page: PageCreateInput!) {
  pageCreate(page: $page) {
    page { id handle }
    userErrors { field message }
  }
}
"""


def run_gql(query: str, variables: dict | None = None):
    qpath = ROOT / "scripts" / "_op.graphql"
    qpath.write_text(query, encoding="utf-8")
    cmd = [
        r"C:\Users\pintu\AppData\Roaming\npm\shopify.cmd", "store", "execute",
        "--store", STORE,
        "--query-file", str(qpath),
        "--allow-mutations",
        "--json",
    ]
    if variables is not None:
        vpath = ROOT / "scripts" / "_vars.json"
        vpath.write_text(json.dumps(variables), encoding="utf-8")
        cmd += ["--variable-file", str(vpath)]
    proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    raw = (proc.stdout or "") + "\n" + (proc.stderr or "")
    start = raw.find("{")
    end = raw.rfind("}")
    if start == -1:
        raise SystemExit(f"No JSON\n{raw}")
    data = json.loads(raw[start:end + 1])
    if proc.returncode != 0 and "data" not in data:
        raise SystemExit(raw)
    return data


def build_input(product: dict) -> dict:
    price, compare = PRICES[product["handle"]]
    options = []
    for opt in product["options"]:
        options.append({
            "name": opt["name"],
            "values": [{"name": v} for v in opt["values"]],
        })
    variants = []
    for variant in product["variants"]:
        parts = [p.strip() for p in variant["title"].split(" / ")]
        option_values = []
        for opt, part in zip(product["options"], parts):
            option_values.append({"optionName": opt["name"], "name": part})
        row = {
            "optionValues": option_values,
            "price": price,
            "inventoryPolicy": "CONTINUE",
            "taxable": True,
        }
        if compare:
            row["compareAtPrice"] = compare
        if variant.get("available") is False:
            row["inventoryPolicy"] = "DENY"
        variants.append(row)
    return {
        "title": product["title"],
        "handle": product["handle"],
        "status": "ACTIVE",
        "vendor": "CURVD.",
        "productType": product.get("product_type") or "Apparel",
        "tags": product.get("tags") or [],
        "descriptionHtml": product.get("body_html") or "",
        "productOptions": options,
        "variants": variants,
    }


def main():
    ids = {}
    for product in PRODUCTS:
        print(f"Creating {product['handle']} ({len(product['variants'])} variants)...", flush=True)
        data = run_gql(MUTATION, {"input": build_input(product)})
        payload = data.get("productSet") or data.get("data", {}).get("productSet")
        if not payload:
            print(json.dumps(data, indent=2)[:4000])
            raise SystemExit("Unexpected response")
        if payload["userErrors"]:
            print(payload["userErrors"])
            raise SystemExit("productSet failed")
        node = payload["product"]
        ids[node["handle"]] = node["id"]
        print("  ", node["id"], flush=True)

    (ROOT / "scripts" / "product_ids.json").write_text(json.dumps(ids, indent=2), encoding="utf-8")
    print("DONE", ids)


if __name__ == "__main__":
    main()
