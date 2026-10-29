import json
import subprocess
import pathlib

ROOT = pathlib.Path(r"C:\Users\pintu\Desktop\shopify_websites\curvd")
STORE = "y9yn6k-me.myshopify.com"
SHOPIFY = r"C:\Users\pintu\AppData\Roaming\npm\shopify.cmd"
qpath = ROOT / "scripts" / "_op.graphql"
vpath = ROOT / "scripts" / "_vars.json"
qpath.write_text(
    """mutation pageCreate($page: PageCreateInput!) {
  pageCreate(page: $page) {
    page { id handle }
    userErrors { field message }
  }
}""",
    encoding="utf-8",
)
pages = [
    {"title": "Help Center", "handle": "help-center", "templateSuffix": "help-center", "body": "<p>Help Center</p>", "isPublished": True},
    {"title": "Order Tracking", "handle": "order-tracking", "templateSuffix": "order-tracking", "body": "<p>Order Tracking</p>", "isPublished": True},
]
chunks = []
for page in pages:
    vpath.write_text(json.dumps({"page": page}), encoding="utf-8")
    proc = subprocess.run(
        [SHOPIFY, "store", "execute", "--store", STORE, "--query-file", str(qpath), "--variable-file", str(vpath), "--allow-mutations", "--json"],
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    chunks.append(f"==== {page['handle']} rc={proc.returncode}\n{(proc.stdout or '')}\n{(proc.stderr or '')}\n")
(ROOT / "scripts" / "_pagecreate_out.txt").write_text("\n".join(chunks), encoding="utf-8")
print("done")
