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

$products = @(
  @{ id = "gid://shopify/Product/8319023939653"; files = @("gw-gallery-belted-detail.jpg","gw-gallery-belted-back.jpg","gw-gallery-belted-card.jpg"); alt = @("Belted wool jacket fabric detail","Belted wool jacket back view","Belted wool jacket features") },
  @{ id = "gid://shopify/Product/8319023972421"; files = @("gw-gallery-camel-detail.jpg","gw-gallery-camel-back.jpg","gw-gallery-camel-card.jpg"); alt = @("Camel parka fabric detail","Camel parka back view","Camel parka features") },
  @{ id = "gid://shopify/Product/8319024005189"; files = @("gw-gallery-puffer-detail.jpg","gw-gallery-puffer-back.jpg","gw-gallery-puffer-card.jpg"); alt = @("Cropped puffer fabric detail","Cropped puffer back view","Cropped puffer features") },
  @{ id = "gid://shopify/Product/8319024037957"; files = @("gw-gallery-chocolate-detail.jpg","gw-gallery-chocolate-back.jpg","gw-gallery-chocolate-life.jpg","gw-gallery-chocolate-card.jpg"); alt = @("Chocolate wool jacket fabric detail","Chocolate wool jacket back view","Chocolate wool jacket lifestyle","Chocolate wool jacket features") },
  @{ id = "gid://shopify/Product/8319024103493"; files = @("gw-gallery-creamhoodie-detail.jpg","gw-gallery-creamhoodie-back.jpg","gw-gallery-creamhoodie-card.jpg"); alt = @("Cream fleece hoodie fabric detail","Cream fleece hoodie back view","Cream fleece hoodie features") },
  @{ id = "gid://shopify/Product/8319024201797"; files = @("gw-gallery-blackzip-detail.jpg","gw-gallery-blackzip-back.jpg","gw-gallery-blackzip-card.jpg"); alt = @("Black zip hoodie fabric detail","Black zip hoodie back view","Black zip hoodie features") },
  @{ id = "gid://shopify/Product/8319024267333"; files = @("gw-gallery-greyhoodie-detail.jpg","gw-gallery-greyhoodie-back.jpg","gw-gallery-greyhoodie-card.jpg"); alt = @("Grey oversized hoodie fabric detail","Grey oversized hoodie back view","Grey oversized hoodie features") },
  @{ id = "gid://shopify/Product/8319024332869"; files = @("gw-gallery-burgundy-detail.jpg","gw-gallery-burgundy-back.jpg","gw-gallery-burgundy-card.jpg"); alt = @("Burgundy hoodie fabric detail","Burgundy hoodie back view","Burgundy hoodie features") },
  @{ id = "gid://shopify/Product/8319024365637"; files = @("gw-gallery-whitetn-detail.jpg","gw-gallery-whitetn-back.jpg","gw-gallery-whitetn-card.jpg"); alt = @("White turtleneck knit detail","White turtleneck back view","White turtleneck features") },
  @{ id = "gid://shopify/Product/8319024398405"; files = @("gw-gallery-camelcrew-detail.jpg","gw-gallery-camelcrew-back.jpg","gw-gallery-camelcrew-card.jpg"); alt = @("Camel crewneck knit detail","Camel crewneck back view","Camel crewneck features") },
  @{ id = "gid://shopify/Product/8319024431173"; files = @("gw-gallery-blackrib-detail.jpg","gw-gallery-blackrib-back.jpg","gw-gallery-blackrib-card.jpg"); alt = @("Black rib turtleneck knit detail","Black rib turtleneck back view","Black rib turtleneck features") },
  @{ id = "gid://shopify/Product/8319024463941"; files = @("gw-gallery-ivory-detail.jpg","gw-gallery-ivory-back.jpg","gw-gallery-ivory-card.jpg"); alt = @("Ivory rollneck knit detail","Ivory rollneck back view","Ivory rollneck features") },
  @{ id = "gid://shopify/Product/8319024529477"; files = @("gw-gallery-longcoat-detail.jpg","gw-gallery-longcoat-back.jpg","gw-gallery-longcoat-card.jpg"); alt = @("Long black coat fabric detail","Long black coat back view","Long black coat features") },
  @{ id = "gid://shopify/Product/8319024562245"; files = @("gw-gallery-dress-detail.jpg","gw-gallery-dress-back.jpg","gw-gallery-dress-card.jpg"); alt = @("Cream knit dress fabric detail","Cream knit dress back view","Cream knit dress features") }
)

$allFiles = foreach ($p in $products) { $p.files }
$inputs = foreach ($file in $allFiles) {
  "{ filename: `"$file`", mimeType: `"image/jpeg`", httpMethod: POST, resource: PRODUCT_IMAGE }"
}

$stageFile = Join-Path $work "stage-gallery.graphql"
@"
mutation {
  stagedUploadsCreate(input: [$($inputs -join ", ")]) {
    stagedTargets { url resourceUrl parameters { name value } }
    userErrors { field message }
  }
}
"@ | ForEach-Object { Write-Utf8 $stageFile $_ }

$stageOut = Join-Path $work "stage-gallery.json"
shopify store execute --store $store --allow-mutations --json --query-file $stageFile --output-file $stageOut | Out-Null
$stage = Get-Content $stageOut -Raw | ConvertFrom-Json
if ($stage.stagedUploadsCreate.userErrors.Count -gt 0) {
  $stage.stagedUploadsCreate.userErrors | ConvertTo-Json -Compress | Write-Output
  exit 1
}

$targetsByFile = @{}
foreach ($target in $stage.stagedUploadsCreate.stagedTargets) {
  foreach ($file in $allFiles) {
    if ($target.resourceUrl -like "*$file*") {
      $targetsByFile[$file] = $target
    }
  }
}

foreach ($file in $allFiles) {
  $target = $targetsByFile[$file]
  if (-not $target) { Write-Output "NO_TARGET $file"; continue }
  $curlArgs = @("-s", "-o", "NUL", "-w", "%{http_code}", "-X", "POST", $target.url)
  foreach ($param in $target.parameters) {
    $curlArgs += @("-F", "$($param.name)=$($param.value)")
  }
  $path = Join-Path $assets $file
  $curlArgs += @("-F", "file=@$path;type=image/jpeg")
  $code = & curl.exe @curlArgs
  Write-Output "UPLOAD $file $code"
}

$index = 0
foreach ($product in $products) {
  $index++
  $media = @()
  for ($i = 0; $i -lt $product.files.Count; $i++) {
    $file = $product.files[$i]
    $target = $targetsByFile[$file]
    if (-not $target) { continue }
    $alt = $product.alt[$i] -replace '"', '\"'
    $media += "{ originalSource: `"$($target.resourceUrl)`", mediaContentType: IMAGE, alt: `"$alt`" }"
  }
  $gql = Join-Path $work "gallery-attach-$index.graphql"
  @"
mutation {
  productCreateMedia(
    productId: "$($product.id)"
    media: [$($media -join ", ")]
  ) {
    media { id alt }
    mediaUserErrors { field message }
  }
}
"@ | ForEach-Object { Write-Utf8 $gql $_ }
  $out = Join-Path $work "gallery-attach-$index.json"
  shopify store execute --store $store --allow-mutations --json --query-file $gql --output-file $out | Out-Null
  Write-Output "ATTACH $index $(Get-Content $out -Raw)"
}
