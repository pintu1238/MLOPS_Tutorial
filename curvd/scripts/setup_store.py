"""Publish products, create collections, pages, menu, and policies."""
import json
import subprocess
import pathlib

ROOT = pathlib.Path(r"C:\Users\pintu\Desktop\shopify_websites\curvd")
STORE = "y9yn6k-me.myshopify.com"
SHOPIFY = r"C:\Users\pintu\AppData\Roaming\npm\shopify.cmd"
IDS = json.loads((ROOT / "scripts" / "product_ids.json").read_text(encoding="utf-8"))

ORDER = [
    "comfort-stretch-smart-capri-pants-high-rise-all-day-comfort",
    "performance-work-trousers",
    "tank-top-bra",
    "sherpa-fur-leggings-toasty-warm-figure-shaping",
    "curvd-cozy-fall-slouch-socks",
    "curvd-cozy-suede-look-slippers",
]


def run_gql(query: str, variables: dict | None = None):
    qpath = ROOT / "scripts" / "_op.graphql"
    qpath.write_text(query, encoding="utf-8")
    cmd = [SHOPIFY, "store", "execute", "--store", STORE, "--query-file", str(qpath), "--allow-mutations", "--json"]
    if variables is not None:
        vpath = ROOT / "scripts" / "_vars.json"
        vpath.write_text(json.dumps(variables), encoding="utf-8")
        cmd += ["--variable-file", str(vpath)]
    proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    raw = proc.stdout or ""
    start, end = raw.find("{"), raw.rfind("}")
    if start == -1:
        raise SystemExit((proc.stderr or "") + "\n" + raw)
    data = json.loads(raw[start:end + 1])
    print(json.dumps(data)[:500], flush=True)
    if proc.returncode != 0 and "userErrors" not in json.dumps(data):
        print(proc.stderr, flush=True)
    return data.get("data", data)


def main():
    pubs = run_gql("{ publications(first: 10) { nodes { id name } } }")
    nodes = pubs["publications"]["nodes"]
    online = next((n for n in nodes if "Online Store" in n["name"]), nodes[0])
    print("PUB", online)
    product_ids = [IDS[h] for h in ORDER]
    run_gql(
        """
        mutation publish($id: ID!, $input: [PublicationInput!]!) {
          publishablePublish(id: $id, input: $input) { userErrors { message } }
        }
        """,
        {"id": product_ids[0], "input": [{"publicationId": online["id"]}]},
    )
    for pid in product_ids:
        run_gql(
            """
            mutation publish($id: ID!, $input: [PublicationInput!]!) {
              publishablePublish(id: $id, input: $input) { userErrors { message } }
            }
            """,
            {"id": pid, "input": [{"publicationId": online["id"]}]},
        )

    cols = run_gql("{ collections(first: 30) { nodes { id handle title } } }")
    by_handle = {c["handle"]: c["id"] for c in cols["collections"]["nodes"]}
    for handle, title in (("frontpage", "Home page"), ("2026-fall", "2026 Fall")):
        if handle not in by_handle:
            created = run_gql(
                """
                mutation collectionCreate($input: CollectionInput!) {
                  collectionCreate(input: $input) {
                    collection { id handle }
                    userErrors { field message }
                  }
                }
                """,
                {"input": {"title": title, "handle": handle}},
            )
            by_handle[handle] = created["collectionCreate"]["collection"]["id"]
        run_gql(
            """
            mutation add($id: ID!, $productIds: [ID!]!) {
              collectionAddProducts(id: $id, productIds: $productIds) {
                userErrors { field message }
              }
            }
            """,
            {"id": by_handle[handle], "productIds": product_ids},
        )
        run_gql(
            """
            mutation publish($id: ID!, $input: [PublicationInput!]!) {
              publishablePublish(id: $id, input: $input) { userErrors { message } }
            }
            """,
            {"id": by_handle[handle], "input": [{"publicationId": online["id"]}]},
        )

    pages = [
        ("Help Center", "help-center", "help-center", "<p>Help with orders, shipping, returns, and sizing.</p>"),
        ("Contact", "contact", "contact", "<p>Send us a message and we will reply by email.</p>"),
        ("Order Tracking", "order-tracking", "order-tracking", "<p>Track an order with the email used at checkout.</p>"),
    ]
    for title, handle, suffix, body in pages:
        run_gql(
            """
            mutation pageCreate($page: PageCreateInput!) {
              pageCreate(page: $page) {
                page { id handle }
                userErrors { field message }
              }
            }
            """,
            {"page": {"title": title, "handle": handle, "templateSuffix": suffix, "body": body, "isPublished": True}},
        )

    run_gql(
        """
        mutation menuCreate($title: String!, $handle: String!, $items: [MenuItemCreateInput!]!) {
          menuCreate(title: $title, handle: $handle, items: $items) {
            menu { id handle }
            userErrors { field message }
          }
        }
        """,
        {
            "title": "Main menu",
            "handle": "main-menu",
            "items": [
                {"title": "Everyday Stretch Pants", "type": "HTTP", "url": "/products/performance-work-trousers"},
                {"title": "Everyday Stretch Capris", "type": "HTTP", "url": "/products/comfort-stretch-smart-capri-pants-high-rise-all-day-comfort"},
                {"title": "Shop All", "type": "HTTP", "url": "/collections/all"},
                {"title": "Order Tracking", "type": "HTTP", "url": "/pages/order-tracking"},
                {"title": "Help Center", "type": "HTTP", "url": "/pages/help-center"},
            ],
        },
    )

    policies = {
        "SHIPPING_POLICY": "<p>We offer fast worldwide shipping with tracking. Delivery times vary by destination. Free shipping offers are shown on the storefront when active.</p>",
        "REFUND_POLICY": "<p>Eligible online orders can be returned within 30 days of delivery for a refund. Items should be unworn, unwashed, and in original condition. Contact us to start a return.</p>",
        "PRIVACY_POLICY": "<p>We collect the details you share at checkout and in your account so we can fulfill orders, provide support, and improve the store. We do not sell personal information.</p>",
        "TERMS_OF_SERVICE": "<p>By shopping with CURVD you agree to these terms. Product colors may vary slightly. Offers such as buy one get one free apply only while they are shown on the product page and at checkout.</p>",
        "CONTACT_INFORMATION": "<p>CURVD. London<br>Email us from the contact page and we will reply as soon as we can.</p>",
    }
    for kind, body in policies.items():
        run_gql(
            """
            mutation shopPolicyUpdate($shopPolicy: ShopPolicyInput!) {
              shopPolicyUpdate(shopPolicy: $shopPolicy) {
                shopPolicy { type }
                userErrors { field message }
              }
            }
            """,
            {"shopPolicy": {"type": kind, "body": body}},
        )

    run_gql(
        """
        mutation blogCreate($blog: BlogCreateInput!) {
          blogCreate(blog: $blog) {
            blog { id handle }
            userErrors { field message }
          }
        }
        """,
        {"blog": {"title": "News", "handle": "news"}},
    )
    print("SETUP DONE")


if __name__ == "__main__":
    main()
