$ErrorActionPreference = 'Stop'

$projectRoot = 'C:\Workspace\Projects\CF\vozodrom'
$candidateRoot = Join-Path $projectRoot 'analysis\codex\skoda-drawings\candidates-batch-1'
$photoRoot = 'C:\Workspace\Projects\CF\vozodrom-data\front-photos\skoda'
$manifestPath = Join-Path $projectRoot 'analysis\codex\skoda-drawings\batch-1-photos.json'

$items = @(
    [ordered]@{ id='skoda--110-1925--0'; model='110 (1925)'; generation='110 (1925) – modelová rodina'; candidate='skoda--110-1925--0.jpg'; page='https://commons.wikimedia.org/wiki/File:1925Skoda-LaurinKlement110Phaeton_IMG_0112.jpg'; direct='https://commons.wikimedia.org/wiki/Special:Redirect/file/1925Skoda-LaurinKlement110Phaeton%20IMG%200112.jpg'; credit='nemor2; CC BY 2.0'; note='1925 Laurin & Klement–Škoda 110 Phaeton; museum photograph. Three-quarter frontal view clearly shows the tall radiator, separate headlights, front axle and cycle fenders.' },
    [ordered]@{ id='skoda--110-r--0'; model='110 R'; generation='110 R – modelová rodina'; candidate='skoda--110-r--0.jpg'; page='https://commons.wikimedia.org/wiki/File:%C5%A0koda_110_R_(front).jpg'; direct='https://commons.wikimedia.org/wiki/Special:Redirect/file/%C5%A0koda%20110%20R%20(front).jpg'; credit='Wikimedia Commons contributor; see file page for attribution and license'; note='Direct head-on photograph of a road Škoda 110 R. Four round lamps, narrow centre trim and chrome bumper are clearly visible.' },
    [ordered]@{ id='skoda--1101-1102--0'; model='1101 / 1102 Tudor'; generation='1101 / 1102 Tudor – modelová rodina'; candidate='skoda--1101-1102--0.jpg'; page='https://commons.wikimedia.org/wiki/File:%C5%A0koda_Tudor_(front),_2013_Oldtimer_Bohemia_Rally_02.JPG'; direct='https://commons.wikimedia.org/wiki/Special:Redirect/file/%C5%A0koda%20Tudor%20(front),%202013%20Oldtimer%20Bohemia%20Rally%2002.JPG'; credit='Miloslav Rejha; CC BY-SA 3.0'; note='Škoda 1101 Tudor front detail. The split eight-bar grille, round lamps, bonnet and factory bumper are documented; oblique angle must be reconstructed symmetrically.' },
    [ordered]@{ id='skoda--1200--0'; model='1200'; generation='1200 – modelová rodina'; candidate='skoda--1200--0.jpg'; page='https://commons.wikimedia.org/wiki/File:%C5%A0koda_1200_at_Legendy_2018_in_Prague.jpg'; direct='https://commons.wikimedia.org/wiki/Special:Redirect/file/%C5%A0koda%201200%20at%20Legendy%202018%20in%20Prague.jpg'; credit='Wikimedia Commons contributor; see file page for attribution and license'; note='Confirmed Škoda 1200 sedan at Legendy 2018. Three-quarter front view documents the early 1200 horizontal trim, round lamps and two-piece chrome bumper.' },
    [ordered]@{ id='skoda--1201--0'; model='1201'; generation='1201 – modelová rodina'; candidate='skoda--1201--0.jpg'; page='https://commons.wikimedia.org/wiki/File:%C5%A0koda1200_Decinfront.jpg'; direct='https://commons.wikimedia.org/wiki/Special:Redirect/file/%C5%A0koda1200%20Decinfront.jpg'; credit='Atinad Samot; CC BY 2.0'; note='Despite the legacy filename, Commons structured data and caption identify this car as Škoda 1201. Frontal three-quarter view clearly shows the 1201 lamps, fog lamps and bumper guards.' },
    [ordered]@{ id='skoda--1202--0'; model='1202'; generation='1202 – modelová rodina'; candidate='alt-1202.jpg'; page='https://commons.wikimedia.org/wiki/File:Skoda_1202.JPG'; direct='https://commons.wikimedia.org/wiki/Special:Redirect/file/Skoda%201202.JPG'; credit='Wikimedia Commons contributor; see file page for attribution and license'; note='Near head-on Škoda 1202 with full front visible. The wide horizontal grille, separate round indicators, round headlamps and split bumper distinguish it from 1200/1201.' },
    [ordered]@{ id='skoda--1203--0'; model='1203'; generation='1203 – modelová rodina'; candidate='official-1203.jpg'; page='https://www.idnes.cz/auto/historie/legenda-dodavka-skoda-1203-50-let-vyroci-vyroba-trnava-vrchlabi.A180601_101333_automoto_taj/foto'; direct='https://1gr.cz/fotky/idnes/18/061/org/TAJ73b2ba_pednpohlednasvtlemodrvz1203typ997.jpg'; credit='iDNES archive; author/license not stated on image endpoint'; note='Period-correct early Škoda 1203, direct head-on view, with round headlights and original narrow black grille. Auxiliary yellow lamps are accessories and must be omitted.' },
    [ordered]@{ id='skoda--130-135-136--0'; model='130 / 135 / 136'; generation='130 / 135 / 136 – modelová rodina'; candidate='official-130.jpg'; page='https://www.skoda-storyboard.com/en/03-skoda-130-l/'; direct='https://cdn.skoda-storyboard.com/2018/08/03-Skoda-130-L.jpg'; credit='Škoda Auto official archive / Škoda Storyboard'; note='Official factory front photograph of the Škoda 130 L, representative of the 130/135/136 model family. Exact head-on proportions and late-series rectangular light/grille treatment are visible.' },
    [ordered]@{ id='skoda--420-standard--0'; model='420 Standard'; generation='420 Standard – modelová rodina'; candidate='alt-420-front.jpg'; page='https://auta5p.eu/muzea/muzeum_skoda_2005/mb_10.php'; direct='https://auta5p.eu/muzea/muzeum_skoda_2005/mb_10.jpg'; credit='Z. Patera / Auta5P; license not stated'; note='Škoda 420 Standard Sedan (1933) in the Škoda museum. Three-quarter frontal view documents the tall split radiator, two separate lamps and broad cycle fenders.' },
    [ordered]@{ id='skoda--422--0'; model='422'; generation='422 – modelová rodina'; candidate='skoda--422--0.jpg'; page='https://commons.wikimedia.org/wiki/File:13-04-05-Skoda_Museum_Mlad%C3%A1_Boleslav_by_RalfR-008.jpg'; direct='https://commons.wikimedia.org/wiki/Special:Redirect/file/13-04-05-Skoda%20Museum%20Mlad%C3%A1%20Boleslav%20by%20RalfR-008.jpg'; credit='Ralf Roletschek; license stated on Commons file page'; note='Škoda 422 museum preservation photograph. Three-quarter front view clearly shows the model-specific radiator shell, headlamp spacing, fenders and front axle.' },
    [ordered]@{ id='skoda--430--0'; model='430'; generation='430 – modelová rodina'; candidate='skoda--430--0.jpg'; page='https://commons.wikimedia.org/wiki/File:%C5%A0koda_430.jpg'; direct='https://commons.wikimedia.org/wiki/Special:Redirect/file/%C5%A0koda%20430.jpg'; credit='Addvisor; CC BY-SA 4.0'; note='Preserved Škoda 430 in museum, near-frontal view. Tall rectangular radiator, separate lamps and front fender geometry are visible; reconstruct the obscured side symmetrically.' },
    [ordered]@{ id='skoda--440-445-450--0'; model='440 / 445 / 450'; generation='440 / 445 / 450 – modelová rodina'; candidate='skoda--440-445-450--0.jpg'; page='https://auta5p.eu/katalog/skoda/s445_04.php'; direct='https://auta5p.eu/srazy/slavkov_2004/slavkov_069b.jpg'; credit='Z. Patera / Auta5P; license not stated'; note='Škoda 445, a production member of the catalogue 440/445/450 family, direct head-on. The two upper grille slots, round lamps and chrome bumper are clearly visible; yellow auxiliary lamps must be omitted.' }
)

Add-Type -AssemblyName System.Drawing
$manifest = @()
foreach ($item in $items) {
    $safeModel = ($item.model -replace '\s*[\\/]+\s*', ' - ')
    $folder = Join-Path $photoRoot ($item.id + ' ' + $safeModel)
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
    $source = Join-Path $candidateRoot $item.candidate
    $reference = Join-Path $folder 'reference.jpg'
    Copy-Item -LiteralPath $source -Destination $reference -Force
    Set-Content -LiteralPath (Join-Path $folder 'info.txt') -Value ('Generace: ' + $item.generation) -Encoding utf8NoBOM
    $sourceText = @(
        'Page URL: ' + $item.page
        'Direct image URL: ' + $item.direct
        'Attribution / license: ' + $item.credit
        'Variant and identity notes: ' + $item.note
    ) -join [Environment]::NewLine
    Set-Content -LiteralPath (Join-Path $folder 'zdroj.txt') -Value $sourceText -Encoding utf8NoBOM
    $image = [System.Drawing.Image]::FromFile($reference)
    try {
        $manifest += [ordered]@{
            id = $item.id
            model = $item.model
            generation = $item.generation
            reference = $reference
            pageUrl = $item.page
            directUrl = $item.direct
            attribution = $item.credit
            identityNotes = $item.note
            width = $image.Width
            height = $image.Height
            sha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $reference).Hash.ToLowerInvariant()
        }
    } finally {
        $image.Dispose()
    }
}

$manifest | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $manifestPath -Encoding utf8NoBOM
Write-Output ($manifest | ConvertTo-Json -Depth 6)
