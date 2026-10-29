"""Upload local product photos and attach them to CURVD products."""
import json
import mimetypes
import pathlib
import subprocess
import uuid
from urllib.request import Request, urlopen

ROOT = pathlib.Path(r"C:\Users\pintu\Desktop\shopify_websites\curvd")
ASSETS = ROOT / "theme" / "assets"
STORE = "y9yn6k-me.myshopify.com"
SHOPIFY = r"C:\Users\pintu\AppData\Roaming\npm\shopify.cmd"
IDS = json.loads((ROOT / "scripts" / "product_ids.json").read_text(encoding="utf-8"))

FILES = {
    "performance-work-trousers": ["pants-front.webp", "pants-rear.webp", "pants-move.webp"],
    "comfort-stretch-smart-capri-pants-high-rise-all-day-comfort": ["capri-hero.webp", "capri-black.webp", "capri-navy.webp", "capri-taupe.webp"],
    "tank-top-bra": ["tank-1.png", "tank-2.png"],
    "sherpa-fur-leggings-toasty-warm-figure-shaping": ["leggings-hero.webp", "leggings-navy.webp", "leggings-burgundy.webp"],
    "curvd-cozy-fall-slouch-socks": ["socks-five.jpg"],
    "curvd-cozy-suede-look-slippers": ["slippers-hero.webp"],
}


def run_gql(query: str, variables: dict | None = None):
    qpath = ROOT / "scripts" / "_op.graphql"
    qpath.write_text(query, encoding="utf-8")
    cmd = [SHOPIFY, "store", "execute", "--store", STORE, "--query-file", str(qpath), "--allow-mutations", "--json"]
    if variables is not None:
        vpath = ROOT / "scripts" / "_vars.json"
        vpath.write_text(json.dumps(variables), encoding="utf-8")
        cmd += ["--variable-file", str(vpath)]
    proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    raw = (proc.stdout or "") + "\n" + (proc.stderr or "")
    start, end = raw.find("{"), raw.rfind("}")
    if start == -1:
        raise SystemExit(raw)
    data = json.loads(raw[start:end + 1])
    return data.get("data", data)


def upload_file(path: pathlib.Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "image/jpeg"
    staged = run_gql(
        """
        mutation staged($input: [StagedUploadInput!]!) {
          stagedUploadsCreate(input: $input) {
            stagedTargets { url resourceUrl parameters { name value } }
            userErrors { field message }
          }
        }
        """,
        {"input": [{
            "filename": path.name,
            "mimeType": mime,
            "resource": "PRODUCT_IMAGE",
            "fileSize": str(path.stat().st_size),
            "httpMethod": "POST",
        }]},
    )
    target = staged["stagedUploadsCreate"]["stagedTargets"][0]
    boundary = "----Curvd" + uuid.uuid4().hex
    body = b""
    for param in target["parameters"]:
        body += f"--{boundary}\r\nContent-Disposition: form-data; name=\"{param['name']}\"\r\n\r\n{param['value']}\r\n".encode()
    body += (
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{path.name}\"\r\n"
        f"Content-Type: {mime}\r\n\r\n"
    ).encode()
    body += path.read_bytes()
    body += f"\r\n--{boundary}--\r\n".encode()
    req = Request(target["url"], data=body, method="POST")
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    with urlopen(req, timeout=120) as res:
        res.read()
    return target["resourceUrl"]


def main():
    for handle, names in FILES.items():
        media = []
        for name in names:
            print("upload", name, flush=True)
            source = upload_file(ASSETS / name)
            media.append({"originalSource": source, "mediaContentType": "IMAGE", "alt": handle})
        result = run_gql(
            """
            mutation attach($productId: ID!, $media: [CreateMediaInput!]!) {
              productCreateMedia(productId: $productId, media: $media) {
                media { alt status }
                mediaUserErrors { field message }
              }
            }
            """,
            {"productId": IDS[handle], "media": media},
        )
        print(handle, json.dumps(result)[:400], flush=True)
    print("IMAGES DONE")


if __name__ == "__main__":
    main()
