import json
import subprocess
import pathlib

ROOT = pathlib.Path(r"C:\Users\pintu\Desktop\shopify_websites\curvd")
SHOPIFY = r"C:\Users\pintu\AppData\Roaming\npm\shopify.cmd"
STORE = "y9yn6k-me.myshopify.com"
KEEP = {
    "gid://shopify/Product/8314255343685",
    "gid://shopify/Product/8314255376453",
    "gid://shopify/Product/8314255409221",
    "gid://shopify/Product/8314255441989",
    "gid://shopify/Product/8314255474757",
    "gid://shopify/Product/8314255540293",
}
ORDER = [
    "gid://shopify/Product/8314255474757",
    "gid://shopify/Product/8314255540293",
    "gid://shopify/Product/8314255441989",
    "gid://shopify/Product/8314255409221",
    "gid://shopify/Product/8314255376453",
    "gid://shopify/Product/8314255343685",
]


def run(query, variables=None):
    q = ROOT / "scripts" / "_op.graphql"
    q.write_text(query, encoding="utf-8")
    cmd = [SHOPIFY, "store", "execute", "--store", STORE, "--query-file", str(q), "--allow-mutations", "--json"]
    if variables is not None:
        v = ROOT / "scripts" / "_vars.json"
        v.write_text(json.dumps(variables), encoding="utf-8")
        cmd += ["--variable-file", str(v)]
    proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    raw = proc.stdout or ""
    start, end = raw.find("{"), raw.rfind("}")
    if start == -1:
        raise SystemExit(proc.stderr)
    return json.loads(raw[start:end + 1])


data = run("""
{
  collections(first: 10, query: "handle:frontpage OR handle:2026-fall") {
    nodes {
      id
      handle
      products(first: 50) { nodes { id title } }
    }
  }
}
""")
print(json.dumps(data, indent=2)[:4000])
for col in data["collections"]["nodes"]:
    extra = [p["id"] for p in col["products"]["nodes"] if p["id"] not in KEEP]
    if extra:
        print("remove", col["handle"], len(extra))
        print(run("""
        mutation remove($id: ID!, $productIds: [ID!]!) {
          collectionRemoveProducts(id: $id, productIds: $productIds) { userErrors { message } }
        }
        """, {"id": col["id"], "productIds": extra}))
    moves = [{"id": pid, "newPosition": str(i)} for i, pid in enumerate(ORDER)]
    print(run("""
    mutation reorder($id: ID!, $moves: [MoveInput!]!) {
      collectionReorderProducts(id: $id, moves: $moves) { userErrors { message } }
    }
    """, {"id": col["id"], "moves": moves}))
