# Návrh: fotografie v inzerátech (část podmínek užívání)

> Pracovní návrh pro budoucí podmínky užívání Vozodromu. Před zveřejněním ho musí zkontrolovat právník, a to až bude založena společnost provozující web (doplnit název, IČO a sídlo).
> Kontext: fotografie z inzerátů chceme se souhlasem uživatele použít i v katalogu modelů, pokud jsou lepší než ty současné.

## X. Fotografie a další obsah vložený uživatelem

1. **Kdo smí fotografie vkládat.** Uživatel smí k inzerátu vložit jen fotografie, které sám pořídil, nebo k nimž má dostatečná práva. Uživatel odpovídá za to, že jejich zveřejněním neporušuje práva třetích osob (autorská práva, právo na ochranu osobnosti, ochranu osobních údajů).

2. **Licence k fotografiím.** Vložením fotografie uděluje uživatel provozovateli bezúplatnou, nevýhradní, územně neomezenou licenci na dobu trvání majetkových autorských práv. Licence platí ke všem způsobům užití potřebným pro:
   a) zobrazení fotografie u inzerátu a jeho propagaci na Vozodromu a v jeho kanálech;
   b) užití fotografie jako ilustrace v katalogu modelů (stránky značek, modelů a generací), a to i po skončení nebo smazání inzerátu.

   Provozovatel smí fotografii upravit: oříznout, zmenšit, upravit barvy a jas, rozmazat registrační značku, obličeje a jiné identifikační údaje. Provozovatel smí licenci postoupit nebo udělit podlicenci jen nástupci provozovatele nebo osobě, která web provozuje jeho jménem.

3. **Označení autora.** U fotografie použité v katalogu uvede provozovatel na žádost autora jeho jméno nebo přezdívku. Jinak uvádí označení „Foto: uživatel Vozodromu“.

4. **Odvolání pro katalog.** Uživatel může kdykoli požádat (e-mailem nebo v nastavení účtu), aby jeho fotografie v katalogu nebyla dále používána. Provozovatel ji z katalogu odstraní do 30 dnů. Užití u samotného inzerátu tím není dotčeno.

5. **Osobní údaje na fotografiích.** Před použitím fotografie v katalogu provozovatel rozmaže registrační značku, VIN a obličeje osob. Fotografie s dalšími osobními údaji (např. adresa, interiér domu) do katalogu nepřebírá.

6. **Odstranění obsahu.** Provozovatel může odstranit fotografii, která porušuje tyto podmínky nebo práva třetích osob, nebo nesouvisí s nabízeným vozidlem.

---

### Poznámky pro právníka a pro implementaci
- **Souhlas při vkládání:** zaškrtávací pole „Souhlasím, aby mé fotografie mohly být použity i v katalogu modelů (lze kdykoli odvolat)“. Je čitelnější než schovat to jen do podmínek. Zvážit, zda souhlas pro katalog nedělat volitelný (opt-in).
- **Rozmazání značek a obličejů:** udělat automaticky při přebírání do katalogu, ne až na žádost.
- **Fotografie od prodejců (bazarů):** často je fotí třetí strana. Pro prodejce je potřeba stejné ujištění o právech, případně samostatná smlouva.
- **GDPR:** fotografie může být osobním údajem, pokud z ní lze určit osobu, a registrační značka v některých případech také. Proto bod 5 a záznam v informacích o zpracování (stránka /soukromi/).
