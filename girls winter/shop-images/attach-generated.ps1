$ErrorActionPreference = "Stop"
$env:CI = "1"
function Write-Utf8($path, $text) {
  $utf8 = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::WriteAllText($path, $text, $utf8)
}
$root = "C:\Users\pintu\Desktop\shopify_websites\girls winter"
$work = Join-Path $root "shop-images"
$store = "y9yn6k-me.myshopify.com"
$src = "C:\Users\pintu\.cursor\projects\c-Users-pintu-Desktop-shopify-websites-girls-winter\assets"
$assets = Join-Path $root "assets"

$items = @(
  @{ id = "gid://shopify/Product/8319023939653"; handle = "belted-wool-jacket"; file = "gw-gen-belted-wool-jacket.jpg"; alt = "Woman in a black belted wool jacket" },
  @{ id = "gid://shopify/Product/8319023972421"; handle = "camel-parka"; file = "gw-gen-camel-parka.jpg"; alt = "Woman in a camel hooded parka" },
  @{ id = "gid://shopify/Product/8319024005189"; handle = "cropped-puffer"; file = "gw-gen-cropped-puffer.jpg"; alt = "Woman in a black cropped puffer jacket" },
  @{ id = "gid://shopify/Product/8319024037957"; handle = "chocolate-wool-jacket"; file = "gw-gen-chocolate-wool-jacket.jpg"; alt = "Woman in a chocolate belted wool jacket" },
  @{ id = "gid://shopify/Product/8319024103493"; handle = "cream-fleece-hoodie"; file = "gw-gen-cream-fleece-hoodie.jpg"; alt = "Woman in a cream sherpa hoodie" },
  @{ id = "gid://shopify/Product/8319024201797"; handle = "black-zip-hoodie"; file = "gw-gen-black-zip-hoodie.jpg"; alt = "Woman in a black zip hoodie" },
  @{ id = "gid://shopify/Product/8319024267333"; handle = "grey-oversized-hoodie"; file = "gw-gen-grey-oversized-hoodie.jpg"; alt = "Woman in a grey oversized hoodie" },
  @{ id = "gid://shopify/Product/8319024332869"; handle = "burgundy-hoodie"; file = "gw-gen-burgundy-hoodie.jpg"; alt = "Woman in a burgundy hoodie" },
  @{ id = "gid://shopify/Product/8319024365637"; handle = "white-turtleneck"; file = "gw-gen-white-turtleneck.jpg"; alt = "Woman in a white turtleneck" },
  @{ id = "gid://shopify/Product/8319024398405"; handle = "camel-crewneck"; file = "gw-gen-camel-crewneck.jpg"; alt = "Woman in a camel crewneck pullover" },
  @{ id = "gid://shopify/Product/8319024431173"; handle = "black-rib-turtleneck"; file = "gw-gen-black-rib-turtleneck.jpg"; alt = "Woman in a black ribbed turtleneck" },
  @{ id = "gid://shopify/Product/8319024463941"; handle = "ivory-rollneck"; file = "gw-gen-ivory-rollneck.jpg"; alt = "Woman in an ivory rollneck pullover" },
  @{ id = "gid://shopify/Product/8323176562757"; handle = "camel-wool-overcoat"; file = "gw-gen-camel-wool-overcoat.jpg"; alt = "Woman in a long camel wool overcoat" },
  @{ id = "gid://shopify/Product/8323178627141"; handle = "burgundy-belted-coat"; file = "gw-gen-burgundy-belted-coat.jpg"; alt = "Woman in a burgundy belted winter coat" },
  @{ id = "gid://shopify/Product/8323180101701"; handle = "charcoal-double-breasted-coat"; file = "gw-gen-charcoal-double-breasted-coat.jpg"; alt = "Woman in a charcoal double-breasted wool coat" },
  @{ id = "gid://shopify/Product/8319024529477"; handle = "long-black-coat"; file = "gw-gen-black-tailored-coat.jpg"; alt = "Woman in a black tailored winter coat" },
  @{ id = "gid://shopify/Product/8323181051973"; handle = "burgundy-knit-midi"; file = "gw-gen-burgundy-knit-midi.jpg"; alt = "Woman in a burgundy knit winter midi dress" },
  @{ id = "gid://shopify/Product/8323181543493"; handle = "black-sweater-dress"; file = "gw-gen-black-sweater-dress.jpg"; alt = "Woman in a black ribbed sweater dress" },
  @{ id = "gid://shopify/Product/8319024562245"; handle = "cream-knit-dress"; file = "gw-gen-cream-cable-knit-dress.jpg"; alt = "Woman in a cream cable-knit sweater dress" },
  @{ id = "gid://shopify/Product/8323182035013"; handle = "forest-velvet-dress"; file = "gw-gen-forest-velvet-dress.jpg"; alt = "Woman in a forest green velvet winter dress" }
)

foreach ($item in $items) {
  $from = Join-Path $src $item.file
  $to = Join-Path $assets $item.file
  if (-not (Test-Path $from)) { throw "MISSING $from" }
  Copy-Item $from $to -Force
}

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
"@ | ForEach-Object { Write-Utf8 (Join-Path $work "stage-gen.graphql") $_ }

shopify store execute --store $store --allow-mutations --json --query-file (Join-Path $work "stage-gen.graphql") --output-file (Join-Path $work "stage-gen.json") | Out-Null
$stage = Get-Content (Join-Path $work "stage-gen.json") -Raw | ConvertFrom-Json
if ($stage.stagedUploadsCreate.userErrors.Count -gt 0) {
  $stage.stagedUploadsCreate.userErrors | ConvertTo-Json -Compress | Write-Output
  exit 1
}

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

$n = 0
foreach ($item in $items) {
  $n++
  $file = Join-Path $work "gen-media-$n.graphql"
  @"
mutation {
  productCreateMedia(productId: "$($item.id)", media: [{ originalSource: "$($item.resourceUrl)", mediaContentType: IMAGE, alt: "$($item.alt)" }]) {
    media { ... on MediaImage { id } }
    mediaUserErrors { field message }
  }
}
"@ | ForEach-Object { Write-Utf8 $file $_ }
  $out = Join-Path $work "gen-media-$n.json"
  shopify store execute --store $store --allow-mutations --json --query-file $file --output-file $out | Out-Null
  $created = Get-Content $out -Raw | ConvertFrom-Json
  $err = $created.productCreateMedia.mediaUserErrors
  if ($err -and $err.Count -gt 0) {
    Write-Output ("FAIL MEDIA " + $item.handle + " " + ($err | ConvertTo-Json -Compress))
    continue
  }
  $mediaId = $created.productCreateMedia.media[0].id
  $move = Join-Path $work "gen-move-$n.graphql"
  @"
mutation {
  productReorderMedia(id: "$($item.id)", moves: [{ id: "$mediaId", newPosition: "0" }]) {
    job { id done }
    userErrors { field message }
  }
}
"@ | ForEach-Object { Write-Utf8 $move $_ }
  shopify store execute --store $store --allow-mutations --json --query-file $move --output-file (Join-Path $work "gen-move-$n.json") | Out-Null
  Write-Output "FEATURED $($item.handle) $mediaId"
}
