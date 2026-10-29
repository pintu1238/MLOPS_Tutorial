$ErrorActionPreference = "Stop"
$env:CI = "1"
function Write-Utf8($path, $text) {
  $utf8 = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::WriteAllText($path, $text, $utf8)
}
$root = "C:\Users\pintu\Desktop\shopify_websites\girls winter"
$assets = Join-Path $root "assets"
$work = Join-Path $root "shop-images"
$store = "y9yn6k-me.myshopify.com"

$items = @(
  @{ id = "gid://shopify/Product/8319024529477"; file = "gw-coat-04.jpg"; alt = "Woman in a black tailored winter coat" },
  @{ id = "gid://shopify/Product/8319024562245"; file = "gw-dress-03.jpg"; alt = "Woman in a cream cable-knit sweater dress" }
)

$inputs = foreach ($item in $items) {
  "{ filename: `"$($item.file)`", mimeType: `"image/jpeg`", httpMethod: POST, resource: PRODUCT_IMAGE }"
}
@"
mutation {
  stagedUploadsCreate(input: [$($inputs -join ", ")]) {
    stagedTargets { url resourceUrl parameters { name value } }
    userErrors { field message }
  }
}
"@ | ForEach-Object { Write-Utf8 (Join-Path $work "stage-two.graphql") $_ }
shopify store execute --store $store --allow-mutations --json --query-file (Join-Path $work "stage-two.graphql") --output-file (Join-Path $work "stage-two.json") | Out-Null
$stage = Get-Content (Join-Path $work "stage-two.json") -Raw | ConvertFrom-Json

$i = 0
foreach ($item in $items) {
  $target = $stage.stagedUploadsCreate.stagedTargets[$i]
  $i++
  $curlArgs = @("-s", "-o", "NUL", "-w", "%{http_code}", "-X", "POST", $target.url)
  foreach ($param in $target.parameters) { $curlArgs += @("-F", "$($param.name)=$($param.value)") }
  $curlArgs += @("-F", "file=@$(Join-Path $assets $item.file);type=image/jpeg")
  $code = & curl.exe @curlArgs
  $item.resourceUrl = $target.resourceUrl
  Write-Output "UPLOAD $($item.file) $code"
}

$i = 0
foreach ($item in $items) {
  $i++
  $file = Join-Path $work "media-two-$i.graphql"
  @"
mutation {
  productCreateMedia(productId: "$($item.id)", media: [{ originalSource: "$($item.resourceUrl)", mediaContentType: IMAGE, alt: "$($item.alt)" }]) {
    media { ... on MediaImage { id } }
    mediaUserErrors { field message }
  }
}
"@ | ForEach-Object { Write-Utf8 $file $_ }
  shopify store execute --store $store --allow-mutations --json --query-file $file --output-file (Join-Path $work "media-two-$i.json") | Out-Null
  Get-Content (Join-Path $work "media-two-$i.json") -Raw
}
