$ErrorActionPreference = 'Stop'

$analysis = 'C:\Workspace\Projects\CF\vozodrom\analysis\codex\skoda-drawings'
$raw = Join-Path $analysis 'raw'
$photoRoot = 'C:\Workspace\Projects\CF\vozodrom-data\front-photos\skoda'
$generatedRoot = 'C:\Users\Sevedge Anywhere\.codex\generated_images\01a189a5-dac4-76b1-90cb-291061986f45'
New-Item -ItemType Directory -Force -Path $raw | Out-Null

$items = @(
  @{Id='skoda--4r--0'; Model='4R'; Generation='4R – modelová rodina'; Source='exec-050e6fbe-55fe-4e1a-a292-2e9d84c9a0ac.png'; Qa='Identita odpovídá rané Škodě 4R; čelní geometrie je rekonstruována z bočního dobového snímku. Tvrdá pravidla splněna, ale přesnost neviditelných čelních detailů je omezená.'},
  @{Id='skoda--633--0'; Model='633'; Generation='633 – modelová rodina'; Source='exec-86a12250-3aa4-4354-a1a1-bc98d118badc.png'; Qa='Dobře zachycená vysoká karoserie, oválná maska a samostatné světlomety. Bez textu/interiéru/stěračů; symetrie dobrá.'},
  @{Id='skoda--637--0'; Model='637'; Generation='637 – modelová rodina'; Source='exec-4bbb0d41-a6dd-467e-b689-055e09cb8947.png'; Qa='Karoserie a dobové proporce odpovídají, ale zdroj neukazuje příď. Maska a nárazník jsou konzervativní rekonstrukce a vyžadují historickou kontrolu.'},
  @{Id='skoda--645--0'; Model='645'; Generation='645 – modelová rodina'; Source='exec-ae048ba1-3c81-4a78-bee7-577f48cf0873.png'; Qa='Příď, vysoká maska, dvojice světlometů a oddělené blatníky odpovídají referenci. Výsledek je symetrický a bez zakázaných prvků.'},
  @{Id='skoda--650--0'; Model='650'; Generation='650 – modelová rodina'; Source='exec-c0012f1f-7dd6-446d-9e83-2c4c8bfd7622.png'; Qa='Tovární dlouhá limuzína je správně identifikována, ale čelní vzhled byl rekonstruován z boční dobové fotografie. Přesnost masky a světlometů nelze plně potvrdit.'},
  @{Id='skoda--860--0'; Model='860'; Generation='860 – modelová rodina'; Source='exec-8747061a-7f2f-4e4f-a6c8-eab491b2f5c8.png'; Qa='Výrazná vysoká maska, velké samostatné světlomety a klasické blatníky odpovídají muzejnímu vozu. Tvrdá pravidla splněna.'},
  @{Id='skoda--enyaq-coupe--0'; Model='Enyaq Coupé'; Generation='Enyaq Coupé – modelová rodina'; Source='exec-75e390c5-5e29-4c18-adbc-7d37834f3051.png'; Qa='Přední partie Enyaq Coupé odpovídá referenci; RS text a registrační značka odstraněny. Zkontrolovat, zda drobná členitost spodních otvorů není příliš detailní.'},
  @{Id='skoda--epiq--0'; Model='Epiq'; Generation='Epiq — základní řada'; Source='exec-38e84d31-cb84-4bc7-aae6-3b89803a787c.png'; Qa='Použita sériová Epiq 2026, ne raný koncept. Úzká světla, Tech-Deck Face a spodní nárazník odpovídají čelní referenci; bez textu a interiéru.'},
  @{Id='skoda--favorit-1936--0'; Model='Favorit (1936)'; Generation='Favorit (1936) – modelová rodina'; Source='exec-c23fa0af-d1a5-4153-9416-b9cc99dd5398.png'; Qa='Správná předválečná rodina 904/923, nikoli hatchback 1987. Maska a kapkovité blatníky odpovídají; výsledek čistý a symetrický.'},
  @{Id='skoda--felicia-1959--0'; Model='Felicia (1959)'; Generation='Felicia (1959) – modelová rodina'; Source='exec-47a16e08-86a6-42e3-9155-6221009db0be.png'; Qa='Správný roadster 1959–1964; oválná maska, kulatá světla a panoramatické čelní sklo odpovídají. Tvrdá pravidla splněna.'},
  @{Id='skoda--felicia-fun--0'; Model='Felicia Fun'; Generation='Felicia Fun – modelová rodina'; Source='exec-f0dd7d6a-74c1-47b8-a5e2-b03eede22e04.png'; Qa='Příď Felicia Fun odpovídá sériové pickup verzi; výstavní tabule, registrační text a barevné doplňky odstraněny. Z čelního pohledu není pickup nástavba rozlišitelná.'},
  @{Id='skoda--forman--0'; Model='Forman'; Generation='Forman – modelová rodina'; Source='exec-0a8db4b3-a099-4099-9d42-c90af3930be9.png'; Qa='Příď první řady Forman/Favorit s obdélníkovými světlomety odpovídá referenci. Z čelního pohledu kombi karoserie není rozlišitelná; tvrdá pravidla splněna.'}
)

$photos = @()
$results = @()
$qa = @()

foreach ($item in $items) {
  $folder = Join-Path $photoRoot ($item.Id + ' ' + $item.Model)
  $source = Join-Path $generatedRoot $item.Source
  $rawTarget = Join-Path $raw ($item.Id + '.png')
  $folderTarget = Join-Path $folder ($item.Id + '.png')
  Copy-Item -LiteralPath $source -Destination $rawTarget -Force
  Copy-Item -LiteralPath $source -Destination $folderTarget -Force
  $reference = Get-ChildItem -LiteralPath $folder -File | Where-Object { $_.BaseName -eq 'reference' } | Select-Object -First 1
  $drawingHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $rawTarget).Hash.ToLowerInvariant()
  $referenceHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $reference.FullName).Hash.ToLowerInvariant()
  Add-Type -AssemblyName System.Drawing
  $img = [System.Drawing.Image]::FromFile($rawTarget)
  $width = $img.Width; $height = $img.Height; $img.Dispose()
  $refImg = [System.Drawing.Image]::FromFile($reference.FullName)
  $refWidth = $refImg.Width; $refHeight = $refImg.Height; $refImg.Dispose()
  $sourcePage = (Get-Content -LiteralPath (Join-Path $folder 'zdroj.txt') | Where-Object { $_ -like 'Stránka zdroje:*' }) -replace '^Stránka zdroje:\s*',''
  $directUrl = (Get-Content -LiteralPath (Join-Path $folder 'zdroj.txt') | Where-Object { $_ -like 'Přímý soubor:*' }) -replace '^Přímý soubor:\s*',''
  $photos += [ordered]@{ id=$item.Id; model=$item.Model; generation=$item.Generation; reference=$reference.FullName; sourcePage=$sourcePage; directUrl=$directUrl; sha256=$referenceHash; width=$refWidth; height=$refHeight }
  $results += [ordered]@{ id=$item.Id; model=$item.Model; generation=$item.Generation; raw=$rawTarget; copy=$folderTarget; sourceGenerated=$source; sha256=$drawingHash; width=$width; height=$height; generator='OpenAI built-in ImageGen'; attempts=1 }
  $qa += [ordered]@{ id=$item.Id; status='needs-review'; hardRules='checked'; notes=$item.Qa }
}

$photos | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $analysis 'batch-2-photos.json') -Encoding utf8
$results | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $analysis 'batch-2-results.json') -Encoding utf8
$qa | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $analysis 'batch-2-qa.json') -Encoding utf8
Write-Output ('Finalized ' + $items.Count + ' drawings.')
