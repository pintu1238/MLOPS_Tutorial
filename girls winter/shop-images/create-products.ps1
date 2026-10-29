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

$items = @(
  @{ title = "Belted wool jacket"; price = "4290.00"; type = "Jackets"; file = "gw-cat-jackets.jpg"; col = "gid://shopify/Collection/316935340101"; alt = "Woman in a black belted wool jacket" },
  @{ title = "Camel parka"; price = "5480.00"; type = "Jackets"; file = "gw-jacket-2.jpg"; col = "gid://shopify/Collection/316935340101"; alt = "Woman in a camel hooded parka" },
  @{ title = "Cropped puffer"; price = "3650.00"; type = "Jackets"; file = "gw-jacket-3.jpg"; col = "gid://shopify/Collection/316935340101"; alt = "Woman in a black cropped puffer jacket" },
  @{ title = "Chocolate wool jacket"; price = "4990.00"; type = "Jackets"; file = "gw-jacket-4.jpg"; col = "gid://shopify/Collection/316935340101"; alt = "Woman in a chocolate belted wool jacket" },
  @{ title = "Cream fleece hoodie"; price = "2890.00"; type = "Hoodies"; file = "gw-cat-hoodies.jpg"; col = "gid://shopify/Collection/316935372869"; alt = "Woman in a cream sherpa hoodie" },
  @{ title = "Black zip hoodie"; price = "2640.00"; type = "Hoodies"; file = "gw-hoodie-2.jpg"; col = "gid://shopify/Collection/316935372869"; alt = "Woman in a black zip hoodie" },
  @{ title = "Grey oversized hoodie"; price = "3120.00"; type = "Hoodies"; file = "gw-hoodie-3.jpg"; col = "gid://shopify/Collection/316935372869"; alt = "Woman in a grey oversized hoodie" },
  @{ title = "Burgundy hoodie"; price = "2980.00"; type = "Hoodies"; file = "gw-hoodie-4.jpg"; col = "gid://shopify/Collection/316935372869"; alt = "Woman in a burgundy hoodie" },
  @{ title = "White turtleneck"; price = "2450.00"; type = "Pullovers"; file = "gw-cat-pullovers.jpg"; col = "gid://shopify/Collection/316935405637"; alt = "Woman in a white turtleneck and long coat" },
  @{ title = "Camel crewneck"; price = "3280.00"; type = "Pullovers"; file = "gw-pullover-2.jpg"; col = "gid://shopify/Collection/316935405637"; alt = "Woman in a camel crewneck pullover" },
  @{ title = "Black rib turtleneck"; price = "2190.00"; type = "Pullovers"; file = "gw-pullover-3.jpg"; col = "gid://shopify/Collection/316935405637"; alt = "Woman in a black ribbed turtleneck" },
  @{ title = "Ivory rollneck"; price = "2760.00"; type = "Pullovers"; file = "gw-pullover-4.jpg"; col = "gid://shopify/Collection/316935405637"; alt = "Woman in an ivory rollneck pullover" },
  @{ title = "Long black coat"; price = "6200.00"; type = "Coats"; file = "gw-cat-coats.jpg"; col = "gid://shopify/Collection/316935438405"; alt = "Woman in a long black winter coat" },
  @{ title = "Cream knit dress"; price = "3490.00"; type = "Winter dresses"; file = "gw-cat-dresses.jpg"; col = "gid://shopify/Collection/316935471173"; alt = "Woman in a cream knit winter dress" }
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
"@ | ForEach-Object { Write-Utf8 (Join-Path $work "stage-all.graphql") $_ }

shopify store execute --store $store --allow-mutations --json --query-file (Join-Path $work "stage-all.graphql") --output-file (Join-Path $work "stage-all.json") | Out-Null
$stage = Get-Content (Join-Path $work "stage-all.json") -Raw | ConvertFrom-Json
if ($stage.stagedUploadsCreate.userErrors.Count -gt 0) {
  $stage.stagedUploadsCreate.userErrors | ConvertTo-Json -Compress | Write-Output
  exit 1
}

foreach ($item in $items) {
  $target = $stage.stagedUploadsCreate.stagedTargets | Where-Object { $_.resourceUrl -like "*$($item.file)" } | Select-Object -First 1
  if (-not $target) { Write-Output "NO_TARGET $($item.file)"; continue }
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

$index = 0
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
    product { id title variants(first: 1) { nodes { id } } }
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
  Write-Output "PRODUCT $($item.title) $productId"
}
