import json
import subprocess
import pathlib

ROOT = pathlib.Path(r"C:\Users\pintu\Desktop\shopify_websites\curvd")
STORE = "y9yn6k-me.myshopify.com"
SHOPIFY = r"C:\Users\pintu\AppData\Roaming\npm\shopify.cmd"


def gql(query: str, variables=None):
    qpath = ROOT / "scripts" / "_op.graphql"
    qpath.write_text(query, encoding="utf-8")
    cmd = [SHOPIFY, "store", "execute", "--store", STORE, "--query-file", str(qpath), "--allow-mutations", "--json"]
    if variables is not None:
        vpath = ROOT / "scripts" / "_vars.json"
        vpath.write_text(json.dumps(variables), encoding="utf-8")
        cmd += ["--variable-file", str(vpath)]
    proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    raw = (proc.stdout or "") + (proc.stderr or "")
    start, end = raw.find("{"), raw.rfind("}")
    data = json.loads(raw[start:end + 1]) if start != -1 else {"raw": raw, "code": proc.returncode}
    return data


pubs = gql("{ publications(first: 10) { nodes { id name } } }")
nodes = pubs.get("data", pubs).get("publications", {}).get("nodes", [])
online = next((n for n in nodes if "Online Store" in n.get("name", "")), nodes[0] if nodes else None)
out = {"pubs": nodes, "online": online}

for title, handle, suffix in (
    ("Help Center", "help-center", "help-center"),
    ("Order Tracking", "order-tracking", "order-tracking"),
):
    created = gql(
        """
        mutation collectionCreate($input: CollectionInput!) {
          collectionCreate(input: $input) {
            collection { id handle }
            userErrors { field message }
          }
        }
        """,
        {"input": {"title": title, "handle": handle, "templateSuffix": suffix}},
    )
    out[handle] = created
    coll = (
        created.get("data", created)
        .get("collectionCreate", {})
        .get("collection")
    )
    cid = coll and coll.get("id")
    if cid and online:
        pub = gql(
            """
            mutation publish($id: ID!, $input: [PublicationInput!]!) {
              publishablePublish(id: $id, input: $input) { userErrors { message } }
            }
            """,
            {"id": cid, "input": [{"publicationId": online["id"]}]},
        )
        out[handle + "_pub"] = pub

(ROOT / "scripts" / "_coll_out.txt").write_text(json.dumps(out, indent=2)[:4000], encoding="utf-8")
print("done")
