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
$publication = "gid://shopify/Publication/201500590149"
$coats = "gid://shopify/Collection/316935438405"
$dresses = "gid://shopify/Collection/316935471173"

$items = @(
  @{ title = "Camel wool overcoat"; price = "6490.00"; type = "Coats"; file = "gw-coat-01.jpg"; col = $coats; alt = "Woman in a long camel wool overcoat" },
  @{ title = "Burgundy belted coat"; price = "5890.00"; type = "Coats"; file = "gw-coat-02.jpg"; col = $coats; alt = "Woman in a burgundy belted winter coat" },
  @{ title = "Charcoal double-breasted coat"; price = "6720.00"; type = "Coats"; file = "gw-coat-03.jpg"; col = $coats; alt = "Woman in a charcoal double-breasted wool coat" },
  @{ title = "Burgundy knit midi"; price = "3680.00"; type = "Winter dresses"; file = "gw-dress-01.jpg"; col = $dresses; alt = "Woman in a burgundy knit winter midi dress" },
  @{ title = "Black sweater dress"; price = "3290.00"; type = "Winter dresses"; file = "gw-dress-02.jpg"; col = $dresses; alt = "Woman in a black ribbed sweater dress" },
  @{ title = "Forest velvet dress"; price = "4120.00"; type = "Winter dresses"; file = "gw-dress-04.jpg"; col = $dresses; alt = "Woman in a forest green velvet winter dress" }
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
"@ | ForEach-Object { Write-Utf8 (Join-Path $work "stage-missing.graphql") $_ }

shopify store execute --store $store --allow-mutations --json --query-file (Join-Path $work "stage-missing.graphql") --output-file (Join-Path $work "stage-missing.json") | Out-Null
$stage = Get-Content (Join-Path $work "stage-missing.json") -Raw | ConvertFrom-Json
if ($stage.stagedUploadsCreate.userErrors.Count -gt 0) {
  $stage.stagedUploadsCreate.userErrors | ConvertTo-Json -Compress | Write-Output
  exit 1
}

$i = 0
foreach ($item in $items) {
  $target = $stage.stagedUploadsCreate.stagedTargets[$i]
  $i++
  $curlArgs = @("-s", "-o", "NUL", "-w", "%{http_code}", "-X", "POST", $target.url)
  foreach ($param in $target.parameters) {
    $curlArgs += @("-F", "$($param.name)=$($param.value)")
  }
  $path = Join-Path $assets $item.file
  $curlArgs += @("-F", "file=@$path;type=image/jpeg")
  $code = & curl.exe @curlArgs
  $item.resourceUrl = $target.resourceUrl
  Write-Output "UPLOAD $($item.file) $code"
}

$index = 20
foreach ($item in $items) {
  $index++
  if (-not $item.resourceUrl) { continue }
  $file = Join-Path $work "product-$index.graphql"
  @"
mutation {
  productCreate(
    product: {
      title: "$($item.title)"
      vendor: "Girls Winter"
      productType: "$($item.type)"
      status: ACTIVE
      collectionsToJoin: ["$($item.col)"]
    }
    media: [{ originalSource: "$($item.resourceUrl)", mediaContentType: IMAGE, alt: "$($item.alt)" }]
  ) {
    product { id handle title variants(first: 1) { nodes { id } } }
    userErrors { field message }
  }
}
"@ | ForEach-Object { Write-Utf8 $file $_ }
  $out = Join-Path $work "product-$index.json"
  shopify store execute --store $store --allow-mutations --json --query-file $file --output-file $out | Out-Null
  $created = Get-Content $out -Raw | ConvertFrom-Json
  $errors = $created.productCreate.userErrors
  if ($errors -and $errors.Count -gt 0) {
    Write-Output ("FAIL " + $item.title + " " + ($errors | ConvertTo-Json -Compress))
    continue
  }
  $productId = $created.productCreate.product.id
  $handle = $created.productCreate.product.handle
  $variantId = $created.productCreate.product.variants.nodes[0].id
  $finish = Join-Path $work "finish-$index.graphql"
  @"
mutation {
  price: productVariantsBulkUpdate(productId: "$productId", variants: [{ id: "$variantId", price: "$($item.price)" }]) {
    userErrors { field message }
  }
  publish: publishablePublish(id: "$productId", input: [{ publicationId: "$publication" }]) {
    userErrors { field message }
  }
}
"@ | ForEach-Object { Write-Utf8 $finish $_ }
  $finishOut = Join-Path $work "finish-$index.json"
  shopify store execute --store $store --allow-mutations --json --query-file $finish --output-file $finishOut | Out-Null
  Write-Output "PRODUCT $($item.title) /$handle $productId"
}

Write-Utf8 (Join-Path $work "rename-two.graphql") @"
mutation {
  coat: productUpdate(product: { id: "gid://shopify/Product/8319024529477", title: "Black tailored coat" }) {
    product { id handle title }
    userErrors { field message }
  }
  dress: productUpdate(product: { id: "gid://shopify/Product/8319024562245", title: "Cream cable-knit dress" }) {
    product { id handle title }
    userErrors { field message }
  }
}
"@
shopify store execute --store $store --allow-mutations --json --query-file (Join-Path $work "rename-two.graphql") --output-file (Join-Path $work "rename-two.json") | Out-Null
Get-Content (Join-Path $work "rename-two.json") -Raw
