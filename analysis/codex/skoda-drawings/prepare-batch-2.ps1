$ErrorActionPreference = 'Stop'

$root = 'C:\Workspace\Projects\CF\vozodrom-data\front-photos\skoda'
$items = @(
  @{ Id='skoda--4r--0'; Model='4R'; Generation='4R – modelová rodina'; File='Škoda 4 R, 4-seat 1928 (6-cylinder, 75x110 mm, 22-50 HP).png'; Ext='png'; Note='Dobový tovární snímek otevřeného čtyřmístného provedení, přesná modelová řada 4 R; boční pohled je jediný kvalitní veřejný referenční materiál v kategorii.' },
  @{ Id='skoda--633--0'; Model='633'; Generation='633 – modelová rodina'; File='Škoda 633 - 1933.JPG'; Ext='jpg'; Note='Dochovaný sedan Škoda 633 z roku 1933, čelní tříčtvrteční pohled; charakteristická svislá maska, světlomety a blatníky jsou dobře viditelné.' },
  @{ Id='skoda--637--0'; Model='637'; Generation='637 – modelová rodina'; File='Škoda 637 (1934) 05.jpg'; Ext='jpg'; Note='Dochovaný sedan Škoda 637 z roku 1934; dostupná veřejná série neobsahuje čistý čelní záběr, tento snímek potvrzuje karoserii a proporce, přední část byla rekonstruována konzervativně.' },
  @{ Id='skoda--645--0'; Model='645'; Generation='645 – modelová rodina'; File='Skoda 645 1.jpg'; Ext='jpg'; Note='Restaurovaná Škoda 645 (1931), čelní tříčtvrteční pohled; viditelná tovární maska, světlomety, nárazník a blatníky.' },
  @{ Id='skoda--650--0'; Model='650'; Generation='650 – modelová rodina'; File='Škoda 650 (1934).jpg'; Ext='jpg'; Note='Dobová tovární fotografie limuzíny Škoda 650; veřejně dostupný snímek je boční, proto neviditelné čelní detaily byly ponechány jednoduché.' },
  @{ Id='skoda--860--0'; Model='860'; Generation='860 – modelová rodina'; File='2014 Škoda Museum, Škoda 860 1932 01.JPG'; Ext='jpg'; Note='Muzejní Škoda 860 (1932), kvalitní čelní tříčtvrteční pohled; maska, světlomety, nárazník a blatníky jsou dobře čitelné.' },
  @{ Id='skoda--enyaq-coupe--0'; Model='Enyaq Coupé'; Generation='Enyaq Coupé – modelová rodina'; File='Skoda Enyaq Coupe iV RS - front.jpg'; Ext='jpg'; Note='Sériová Škoda Enyaq Coupé iV RS (2022), téměř čelní pohled; použita pro modelovou rodinu Enyaq Coupé, bez přenosu RS nápisů a doplňků.' },
  @{ Id='skoda--epiq--0'; Model='Epiq'; Generation='Epiq — základní řada'; File='Skoda Epiq front view.jpg'; Ext='jpg'; Note='Aktuální sériová Škoda Epiq 2026 v přesném čelním pohledu; nejde o raný koncept 2024 ani showcar IAA 2025.' },
  @{ Id='skoda--favorit-1936--0'; Model='Favorit (1936)'; Generation='Favorit (1936) – modelová rodina'; File='1938 Skoda Favorit type 923 pic2.JPG'; Ext='jpg'; Note='Muzejní Škoda Favorit typ 923 (1938), téměř čelní pohled; přesná předválečná modelová rodina, ne novodobý Favorit.' },
  @{ Id='skoda--felicia-1959--0'; Model='Felicia (1959)'; Generation='Felicia (1959) – modelová rodina'; File='Skoda felicia 1962 front.jpg'; Ext='jpg'; Note='Škoda Felicia roadster 1962, čelní tříčtvrteční pohled; správná první modelová rodina 1959–1964.' },
  @{ Id='skoda--felicia-fun--0'; Model='Felicia Fun'; Generation='Felicia Fun – modelová rodina'; File='1999 Skoda Felicia FUN 1.6 Front.jpg'; Ext='jpg'; Note='Sériová Škoda Felicia Fun 1.6 (1999), čelní tříčtvrteční pohled; žluté tovární pickup provedení Fun.' },
  @{ Id='skoda--forman--0'; Model='Forman'; Generation='Forman – modelová rodina'; File='White Škoda Forman 135 LS in Kraków (5).jpg'; Ext='jpg'; Note='Škoda Forman 135 LS v přesném čelním pohledu; správné kombi provedení Favorit/Forman 1990–1995.' }
)

foreach ($item in $items) {
  $folder = Join-Path $root ($item.Id + ' ' + $item.Model)
  New-Item -ItemType Directory -Force -Path $folder | Out-Null
  $encoded = [uri]::EscapeDataString($item.File)
  $pageUrl = 'https://commons.wikimedia.org/wiki/File:' + $encoded
  $directUrl = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + $encoded + '?width=1280'
  $reference = Join-Path $folder ('reference.' + $item.Ext)
  Invoke-WebRequest -Headers @{ 'User-Agent'='VozodromCatalogResearch/1.0' } -Uri $directUrl -OutFile $reference
  Set-Content -LiteralPath (Join-Path $folder 'info.txt') -Encoding utf8 -Value ('Generace: ' + $item.Generation)
  $sourceText = [string[]]@(
    ('Stránka zdroje: ' + $pageUrl)
    ('Přímý soubor: ' + $directUrl)
    'Autor a licence: uvedeny na stránce souboru Wikimedia Commons; stažena největší stabilně dostupná náhledová verze 1280 px kvůli omezení Wikimedia pro automatizované stahování originálů.'
    ('Volba varianty: ' + $item.Note)
  )
  Set-Content -LiteralPath (Join-Path $folder 'zdroj.txt') -Encoding utf8 -Value $sourceText
  Write-Output ($item.Id + ' -> ' + $reference)
}
