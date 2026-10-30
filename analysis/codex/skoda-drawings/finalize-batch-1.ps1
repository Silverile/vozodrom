$ErrorActionPreference = 'Stop'

$projectRoot = 'C:\Workspace\Projects\CF\vozodrom'
$analysisRoot = Join-Path $projectRoot 'analysis\codex\skoda-drawings'
$rawRoot = Join-Path $analysisRoot 'raw'
$photoManifest = Get-Content -Raw (Join-Path $analysisRoot 'batch-1-photos.json') | ConvertFrom-Json
New-Item -ItemType Directory -Force -Path $rawRoot | Out-Null
Add-Type -AssemblyName System.Drawing

$generated = [ordered]@{
    'skoda--110-1925--0' = 'C:\Users\Sevedge Anywhere\.codex\generated_images\01a189a5-bb01-76b0-a6b3-534bbec6ed48\exec-c4aae9ad-e312-44c3-8424-e48c6618d20c.png'
    'skoda--110-r--0' = 'C:\Users\Sevedge Anywhere\.codex\generated_images\01a189a5-bb01-76b0-a6b3-534bbec6ed48\exec-95edaf3f-8fe7-4be3-b26c-42c519701864.png'
    'skoda--1101-1102--0' = 'C:\Users\Sevedge Anywhere\.codex\generated_images\01a189a5-bb01-76b0-a6b3-534bbec6ed48\exec-c1f2a3c4-9506-44a5-a8d5-6f78a949e395.png'
    'skoda--1200--0' = 'C:\Users\Sevedge Anywhere\.codex\generated_images\01a189a5-bb01-76b0-a6b3-534bbec6ed48\exec-50ef7dc8-72da-423e-8608-ecf9213bb2da.png'
    'skoda--1201--0' = 'C:\Users\Sevedge Anywhere\.codex\generated_images\01a189a5-bb01-76b0-a6b3-534bbec6ed48\exec-839c0e13-dd20-4b3b-868f-8566a02ff6cb.png'
    'skoda--1202--0' = 'C:\Users\Sevedge Anywhere\.codex\generated_images\01a189a5-bb01-76b0-a6b3-534bbec6ed48\exec-8f4d76ac-041a-4ddb-afdd-f9c73dac3487.png'
    'skoda--1203--0' = 'C:\Users\Sevedge Anywhere\.codex\generated_images\01a189a5-bb01-76b0-a6b3-534bbec6ed48\exec-9f2ff89a-26a8-4e03-b595-82f8cd71e1f1.png'
    'skoda--130-135-136--0' = 'C:\Users\Sevedge Anywhere\.codex\generated_images\01a189a5-bb01-76b0-a6b3-534bbec6ed48\exec-3639e8ab-c61d-46c0-a1df-eeafcfc2fdbe.png'
    'skoda--420-standard--0' = 'C:\Users\Sevedge Anywhere\.codex\generated_images\01a189a5-bb01-76b0-a6b3-534bbec6ed48\exec-b1d9ec90-eae7-4b77-b2e1-46d2b8c9f13b.png'
    'skoda--422--0' = 'C:\Users\Sevedge Anywhere\.codex\generated_images\01a189a5-bb01-76b0-a6b3-534bbec6ed48\exec-e7504c3e-856e-43c8-b27e-5fbe297ea940.png'
    'skoda--430--0' = 'C:\Users\Sevedge Anywhere\.codex\generated_images\01a189a5-bb01-76b0-a6b3-534bbec6ed48\exec-31456238-2eba-446a-82bc-7451c6f6e475.png'
    'skoda--440-445-450--0' = 'C:\Users\Sevedge Anywhere\.codex\generated_images\01a189a5-bb01-76b0-a6b3-534bbec6ed48\exec-c10330f0-82e3-49f7-b29c-506304dfdc9c.png'
}

$qaNotes = [ordered]@{
    'skoda--110-1925--0' = [ordered]@{ status='needs-review'; hardRules=@('No wipers, antenna, text or interior are visible; symmetry is strong.','Background is subtly radial/gradient instead of a perfectly flat #13233F.','Car occupies roughly 90% of image height rather than about 70%.','Detailed bonnet mascot and added pair of high circular mirrors are more elaborate than the prompt allows and are not confirmed by the reference.'); accuracy='Recognisable 1925 L&K–Škoda 110 front with tall radiator, separate lamps, cycle fenders and exposed axle. The reconstructed upper body/roof is less certain because the reference is oblique.' }
    'skoda--110-r--0' = [ordered]@{ status='needs-review'; hardRules=@('No wipers, antenna, text or interior are visible.','Background is subtly gradient and the car is larger than the requested 70%.','Perfect symmetry is broken by cowl slots only on the left and a small circular feature only on the right.'); accuracy='Four-lamp 110 R face, central trim and bumper are faithful and clearly identifiable.' }
    'skoda--1101-1102--0' = [ordered]@{ status='needs-review'; hardRules=@('No wipers, antenna, text or interior are visible; symmetry is good.','Background is subtly gradient and scale is larger than requested.','Central emblem contains small decorative detail rather than only a minimal outline.'); accuracy='The split horizontal grille, rounded wings and Tudor bumper are convincing. Bar count/details are simplified from an angled, cropped reference.' }
    'skoda--1200--0' = [ordered]@{ status='needs-review'; hardRules=@('No wipers, antenna, text or interior are visible; symmetry is good.','Background is subtly gradient and scale is larger than requested.'); accuracy='Rounded early 1200 nose, lamps and bumper treatment match the selected reference. The 1200/1201 family resemblance means small trim distinctions should receive editorial review.' }
    'skoda--1201--0' = [ordered]@{ status='needs-review'; hardRules=@('No wipers, antenna, text or interior are visible; symmetry is good.','Background is subtly gradient and scale is larger than requested.','A pair of rectangular mirrors was added although factory fitment for the depicted period is not established by the reference.'); accuracy='The 1201 rounded nose, lamp positions and guarded chrome bumper are represented well.' }
    'skoda--1202--0' = [ordered]@{ status='needs-review'; hardRules=@('No wipers, antenna, text or interior are visible; symmetry is good.','Background is subtly gradient and scale is larger than requested.','A pair of mirrors was added even though the reference only establishes the front body.'); accuracy='Wide horizontal grille, round headlamps, small indicators and split bumper accurately distinguish the 1202.' }
    'skoda--1203--0' = [ordered]@{ status='needs-review'; hardRules=@('No wipers, antenna, text or interior are visible; symmetry is good.','Background is subtly gradient and scale is larger than requested.','The centre badge is a filled pictogram rather than only a simple outline.'); accuracy='Very close to the early round-headlamp 1203 front, with correct cab-over proportions and mirror arms. Auxiliary lamps from the photo were removed as required.' }
    'skoda--130-135-136--0' = [ordered]@{ status='needs-review'; hardRules=@('No wipers, antenna, text or interior are visible; symmetry is strong.','Background is subtly gradient and scale is larger than requested.'); accuracy='Official 130 L front is followed closely: rectangular lamps, outer indicators, grille, lower slots and bumper are all convincing for the 130/135/136 family.' }
    'skoda--420-standard--0' = [ordered]@{ status='needs-review'; hardRules=@('No wipers, antenna, text or interior are visible; symmetry is good.','Background is subtly gradient and scale is larger than requested.','Two circular mirrors and a detailed crest-like radiator badge were added without firm evidence of factory fitment.'); accuracy='Pre-war 420 Standard layout is recognisable, but the radiator opening is more rounded/oval than the pointed split shell seen in the selected museum reference.' }
    'skoda--422--0' = [ordered]@{ status='needs-review'; hardRules=@('No wipers, antenna, text or interior are visible; symmetry is good.','Background is subtly gradient and scale is larger than requested.','Small badge detail is more complex than a simple outline.'); accuracy='Radiator, separate lamps, crossbar, cycle fenders and exposed suspension closely follow the preserved Škoda 422.' }
    'skoda--430--0' = [ordered]@{ status='needs-review'; hardRules=@('No wipers, antenna, text or interior are visible; symmetry is good.','Background is subtly gradient and scale is larger than requested.','A pair of round mirrors was added although the museum reference does not establish original factory mirrors.'); accuracy='Tall rectangular radiator, separate lamps and pre-war fender/axle architecture are plausible for the 430; hidden areas were necessarily reconstructed from one oblique view.' }
    'skoda--440-445-450--0' = [ordered]@{ status='needs-review'; hardRules=@('No wipers, antenna, text or interior are visible; symmetry is good.','Background is subtly gradient and scale is larger than requested.','Mirror faces contain diagonal interior lines that read like reflections.'); accuracy='The two upper grille slots and round lamps identify the 440/445 family, but bonnet sculpting and central lower grille are noticeably smoothed and generalised relative to the Škoda 445 reference.' }
}

$results = @()
$qa = @()
foreach ($photo in $photoManifest) {
    $id = $photo.id
    $source = $generated[$id]
    if (-not (Test-Path -LiteralPath $source)) { throw "Missing generated source for $id" }
    $raw = Join-Path $rawRoot ($id + '.png')
    $folder = Split-Path -Parent $photo.reference
    $folderCopy = Join-Path $folder ($id + '.png')
    Copy-Item -LiteralPath $source -Destination $raw -Force
    Copy-Item -LiteralPath $source -Destination $folderCopy -Force
    $image = [System.Drawing.Image]::FromFile($raw)
    try {
        $rawHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $raw).Hash.ToLowerInvariant()
        $copyHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $folderCopy).Hash.ToLowerInvariant()
        $results += [ordered]@{
            id = $id
            model = $photo.model
            generation = $photo.generation
            reference = $photo.reference
            generatedSource = $source
            raw = $raw
            folderCopy = $folderCopy
            width = $image.Width
            height = $image.Height
            sha256 = $rawHash
            folderCopySha256 = $copyHash
            copiesMatch = ($rawHash -eq $copyHash)
            tool = 'built-in ImageGen'
            attempts = 1
            promptFile = (Join-Path $analysisRoot 'prompt.txt')
        }
    } finally {
        $image.Dispose()
    }
    $review = $qaNotes[$id]
    $qa += [ordered]@{
        id = $id
        status = $review.status
        hardRules = $review.hardRules
        generationAccuracy = $review.accuracy
        reference = $photo.reference
        drawing = $raw
    }
}

$results | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $analysisRoot 'batch-1-results.json') -Encoding utf8NoBOM
$qa | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $analysisRoot 'batch-1-qa.json') -Encoding utf8NoBOM
$results | Select-Object id,width,height,copiesMatch,sha256 | ConvertTo-Json -Depth 5
