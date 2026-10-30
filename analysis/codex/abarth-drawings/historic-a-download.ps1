$root='C:/Workspace/Projects/CF/vozodrom-data/front-photos/abarth'
$items=@(
@('750',1,'750 GT Zagato','https://commons.wikimedia.org/wiki/File:Abarth_Zagato_750.jpg','https://upload.wikimedia.org/wikipedia/commons/8/82/Abarth_Zagato_750.jpg'),
@('1000',1,'1000 Bialbero  Zagato','https://www.hellenicmotormuseum.gr/en/car/abarth-1000-zagato-record-monza-bialbero/','https://www.hellenicmotormuseum.gr/wp-content/uploads/2019/06/Abarth-Fiat-1000.jpg'),
@('2200',0,'2200','https://commons.wikimedia.org/wiki/File:1960_Abarth_2200_Allemano_Coup%C3%A9_4VPJ_in_Bremen_(front).jpg','https://upload.wikimedia.org/wikipedia/commons/1/1f/1960_Abarth_2200_Allemano_Coup%C3%A9_4VPJ_in_Bremen_%28front%29.jpg'),
@('2400',0,'2400 Coup Allemano','https://commons.wikimedia.org/wiki/File:1964_Abarth_2400_Coupe_HH.jpg','https://upload.wikimedia.org/wikipedia/commons/7/74/1964_Abarth_2400_Coupe_HH.jpg'),
@('1000',0,'1000 Berlina stradale','https://www.autobelle.it/en/archive/1964_Abarth_1000_Berlina_49315.xhtml','https://www.autobelle.it/moduli/arcstor_media/direct_use.php?id=359228&variant=list&revision=0c7ff968d823c897cfdf&signature=615191baf008f78a5c70f7e2')
)
$d=Get-Content src/data/model-cards-index.json -Raw | ConvertFrom-Json
$m=@(Get-Content analysis/codex/abarth-drawings/historic-a-photos.json -Raw | ConvertFrom-Json)
foreach($it in $items){$id="abarth--$($it[0])--$($it[1])";$dir=Join-Path $root "$id $($it[2])";New-Item -ItemType Directory -Force $dir|Out-Null;Invoke-WebRequest $it[4] -OutFile "$dir/reference.jpg";$g=$d.abarth.($it[0]).generations[$it[1]];"ID: $id`nZnačka: Abarth`nModel: $($d.abarth.($it[0]).name)`nGenerace: $($g.name)`nRoky: $($g.from)–$($g.to)" | Set-Content "$dir/info.txt" -Encoding utf8;"Source webpage: $($it[3])`nImage URL: $($it[4])`nSelected variant: $($g.name)" | Set-Content "$dir/zdroj.txt" -Encoding utf8;$m+=@{id=$id;path="$dir/reference.jpg";source=$it[3];imageUrl=$it[4];selectedVersion=$g.name;verification='pending visual review'}}
$m | ConvertTo-Json -Depth 5 | Set-Content analysis/codex/abarth-drawings/historic-a-photos.json -Encoding utf8
