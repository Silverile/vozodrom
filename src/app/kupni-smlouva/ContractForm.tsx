"use client";

import { useEffect, useState } from "react";
import { CITIES, getCity, locativeOf } from "@/lib/geo";
import { savedLocation } from "@/lib/storage";

// Sale contract for a used car between two private persons. Everything stays in this
// component's memory: nothing is sent, stored or logged, and it is gone on reload.
// Empty fields print as dotted lines so the contract can also be completed by hand.

interface Party {
  name: string;
  born: string;
  address: string;
  idDoc: string;
}

const EMPTY_PARTY: Party = { name: "", born: "", address: "", idDoc: "" };

const HANDOVER_ITEMS = [
  "osvědčení o registraci vozidla (ORV)",
  "technický průkaz (pokud byl vydán)",
  "klíče",
  "servisní knížka",
  "protokol o poslední technické kontrole",
  "zimní / letní pneumatiky",
];

const BLANK = "……………………";
/** Zákon č. 254/2004 Sb., § 4: payments above this amount must be cashless. */
const CASH_LIMIT = 270_000;

const FILERS = {
  spolecne: "obě smluvní strany společně",
  prodavajici: "prodávající",
  kupujici: "kupující",
} as const;

function fill(value: string, blank = BLANK) {
  return value.trim() ? value.trim() : blank;
}

function formatKm(value: string) {
  const n = Number(value.replace(/\s/g, ""));
  return value.trim() && Number.isFinite(n) ? `${new Intl.NumberFormat("cs-CZ").format(n)} km` : `${BLANK} km`;
}

function formatDay(value: string) {
  return value ? new Date(`${value}T12:00:00`).toLocaleDateString("cs-CZ") : BLANK;
}

function formatCzk(value: string) {
  const n = Number(value.replace(/\s/g, ""));
  return value.trim() && Number.isFinite(n) ? `${new Intl.NumberFormat("cs-CZ").format(n)} Kč` : `${BLANK} Kč`;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Place of signing in the correct Czech form: "V Praze" for known towns, the visitor's own
 * "v Lovosicích" as typed, and the always-grammatical "V obci Lovosice" otherwise.
 */
function placePhrase(input: string): { text: string; known: boolean } {
  const value = input.trim();
  if (!value) return { text: `V ${BLANK}`, known: true };
  if (/^ve?\s/i.test(value)) return { text: capitalize(value), known: true };
  const locative = locativeOf(value);
  return locative ? { text: capitalize(locative), known: true } : { text: `V obci ${value}`, known: false };
}

function PartyFields({ title, value, onChange }: { title: string; value: Party; onChange: (p: Party) => void }) {
  const field = (key: keyof Party, label: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="text-sm">
      {label}
      <input className="input mt-1" value={value[key]} onChange={(e) => onChange({ ...value, [key]: e.target.value })} {...extra} />
    </label>
  );
  return (
    <fieldset className="grid gap-3 sm:grid-cols-2">
      <legend className="font-bold mb-2">{title}</legend>
      {field("name", "Jméno a příjmení", { autoComplete: "off" })}
      {field("born", "Datum narození", { placeholder: "např. 1. 2. 1985", autoComplete: "off" })}
      <div className="sm:col-span-2">{field("address", "Trvalé bydliště", { autoComplete: "off" })}</div>
      {field("idDoc", "Číslo dokladu totožnosti (nepovinné)", { autoComplete: "off" })}
    </fieldset>
  );
}

/** One article of the contract: centred heading and numbered paragraphs. */
function Article({ no, title, children }: { no: string; title: string; children: React.ReactNode }) {
  return (
    // Pages may break between paragraphs, never right after a heading or inside a paragraph.
    <section>
      <h3 className="text-center font-bold mt-7 mb-3 print:mt-4 print:mb-2 break-after-avoid">
        <span className="block">Článek {no}</span>
        <span className="block">{title}</span>
      </h3>
      <ol className="list-decimal pl-6 space-y-2 print:space-y-1 marker:font-semibold [&>li]:break-inside-avoid">{children}</ol>
    </section>
  );
}

function PartyBlock({ role, party, alias }: { role: string; party: Party; alias: string }) {
  return (
    <div>
      <p className="text-[0.7rem] uppercase tracking-[0.12em] text-[#5a6370]">{role}</p>
      <p className="font-bold mt-0.5">{fill(party.name)}</p>
      <p>nar. {fill(party.born)}</p>
      <p>bytem {fill(party.address)}</p>
      {party.idDoc.trim() && <p>č. dokladu totožnosti {party.idDoc.trim()}</p>}
      <p className="mt-1 italic">(dále jen „{alias}“)</p>
    </div>
  );
}

export function ContractForm() {
  const [seller, setSeller] = useState<Party>(EMPTY_PARTY);
  const [buyer, setBuyer] = useState<Party>(EMPTY_PARTY);
  const [car, setCar] = useState({ make: "", vin: "", plate: "", firstReg: "", orv: "", color: "", km: "" });
  const [price, setPrice] = useState("");
  const [payment, setPayment] = useState<"hotove" | "prevod">("hotove");
  const [account, setAccount] = useState("");
  const [payDue, setPayDue] = useState("");
  const [defects, setDefects] = useState<string[]>([""]);
  const [noOtherDefects, setNoOtherDefects] = useState(false);
  const [odometerNote, setOdometerNote] = useState("");
  const [filer, setFiler] = useState<keyof typeof FILERS>("spolecne");
  const [handover, setHandover] = useState<string[]>(HANDOVER_ITEMS.slice(0, 3));
  const [keys, setKeys] = useState("2");
  // Off by default so the contract never certifies a test drive that did not happen.
  const [testDrive, setTestDrive] = useState(false);
  const [place, setPlace] = useState("");
  const [signDate, setSignDate] = useState("");
  const [handoverDate, setHandoverDate] = useState("");
  const [handedAtSigning, setHandedAtSigning] = useState(true);

  // Prefill the place with the town chosen in the header (after mount, to match server HTML).
  useEffect(() => {
    const town = getCity(savedLocation.read()?.cities[0])?.name;
    if (town) setPlace((current) => current || town);
  }, []);

  const carField = (key: keyof typeof car, label: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="text-sm">
      {label}
      <input className="input mt-1" value={car[key]} onChange={(e) => setCar({ ...car, [key]: e.target.value })} {...extra} />
    </label>
  );

  const priceValue = Number(price.replace(/\s/g, "")) || 0;
  const cashAllowed = priceValue <= CASH_LIMIT;
  const paidBy = cashAllowed ? payment : "prevod";
  const handedNow = paidBy === "hotove" && handedAtSigning;
  const handed = handover.map((h) => (h === "klíče" ? `klíče (${fill(keys, "…")} ks)` : h));
  const items = handed.length ? handed.join(", ") : BLANK;
  const listedDefects = defects.map((d) => d.trim()).filter(Boolean);
  const where = placePhrase(place);

  const VEHICLE_ROWS: [string, string][] = [
    ["Tovární značka a model", fill(car.make)],
    ["VIN", fill(car.vin)],
    ["Registrační značka", fill(car.plate)],
    ["Datum první registrace", fill(car.firstReg)],
    ["Číslo ORV", fill(car.orv)],
    ["Barva", fill(car.color)],
    ["Stav tachometru při předání", formatKm(car.km)],
  ];

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] mt-6 items-start">
      <form className="card p-4 space-y-6 min-w-0 print:hidden" onSubmit={(e) => e.preventDefault()} autoComplete="off">
        <PartyFields title="Prodávající" value={seller} onChange={setSeller} />
        <PartyFields title="Kupující" value={buyer} onChange={setBuyer} />

        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="font-bold mb-2">Vozidlo</legend>
          <div className="sm:col-span-2">{carField("make", "Tovární značka a model", { placeholder: "např. Škoda Octavia Combi 2.0 TDI" })}</div>
          {carField("vin", "VIN", { maxLength: 17, onChange: (e) => setCar({ ...car, vin: e.target.value.toUpperCase() }) })}
          {carField("plate", "Registrační značka (SPZ)", { onChange: (e) => setCar({ ...car, plate: e.target.value.toUpperCase() }) })}
          {carField("firstReg", "Datum první registrace", { placeholder: "např. 3/2019" })}
          {carField("orv", "Číslo ORV (malého techničáku)")}
          {carField("color", "Barva")}
          {carField("km", "Stav tachometru při předání (km)", { inputMode: "numeric", onChange: (e) => setCar({ ...car, km: e.target.value.replace(/[^\d\s]/g, "") }) })}
        </fieldset>

        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="font-bold mb-2">Stav vozidla</legend>
          <div className="sm:col-span-2 space-y-2">
            <p className="text-sm">Známé vady vozidla</p>
            {defects.map((d, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="input"
                  aria-label={`Vada ${i + 1}`}
                  placeholder={i === 0 ? "např. škrábanec na zadním nárazníku" : "další vada"}
                  value={d}
                  onChange={(e) => setDefects(defects.map((x, j) => (j === i ? e.target.value : x)))}
                />
                {defects.length > 1 && (
                  <button
                    type="button"
                    className="px-3 rounded-[10px] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-field)]"
                    aria-label={`Odebrat vadu ${i + 1}`}
                    onClick={() => setDefects(defects.filter((_, j) => j !== i))}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="pill" onClick={() => setDefects([...defects, ""])}>+ Přidat vadu</button>
          </div>
          <label className="flex gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={noOtherDefects} onChange={(e) => setNoOtherDefects(e.target.checked)} />
            Prodávajícímu nejsou známy další vady
          </label>
          <label className="text-sm sm:col-span-2">
            Známé zásahy do tachometru nebo odchylky od skutečného nájezdu
            <input className="input mt-1" placeholder="např. výměna přístrojové desky v roce 2021 při 120 000 km; jinak napište „žádné“" value={odometerNote} onChange={(e) => setOdometerNote(e.target.value)} />
          </label>
          <label className="flex gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={testDrive} onChange={(e) => setTestDrive(e.target.checked)} />
            Kupující vozidlo vyzkoušel zkušební jízdou
          </label>
        </fieldset>

        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="font-bold mb-2">Cena a předání</legend>
          <label className="text-sm">
            Kupní cena (Kč)
            <input className="input mt-1" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d\s]/g, ""))} />
          </label>
          <label className="text-sm">
            Způsob úhrady
            <select className="input mt-1" value={paidBy} onChange={(e) => setPayment(e.target.value as "hotove" | "prevod")}>
              <option value="hotove" disabled={!cashAllowed}>V hotovosti při podpisu</option>
              <option value="prevod">Bankovním převodem</option>
            </select>
          </label>
          {!cashAllowed && (
            <p className="text-sm text-[var(--color-warn)] sm:col-span-2">
              Platbu přesahující 270 000 Kč je nutné provést bezhotovostně. Do limitu se započítávají všechny platby téhož plátce témuž
              příjemci během jednoho kalendářního dne.
            </p>
          )}
          {paidBy === "prevod" && (
            <>
              <label className="text-sm">
                Číslo účtu prodávajícího
                <input className="input mt-1" value={account} onChange={(e) => setAccount(e.target.value)} />
              </label>
              <label className="text-sm">
                Zaplatit nejpozději do
                <input className="input mt-1" type="date" value={payDue} onChange={(e) => setPayDue(e.target.value)} />
              </label>
            </>
          )}
          <label className="text-sm">
            Místo podpisu
            <input className="input mt-1" list="contract-towns" value={place} onChange={(e) => setPlace(e.target.value)} aria-describedby="place-help" />
            <datalist id="contract-towns">
              {CITIES.map((c) => <option key={c.slug} value={c.name} />)}
            </datalist>
            <span id="place-help" className="block mt-1 text-xs text-[var(--color-muted)]">
              {place.trim() && where.known
                ? <>Ve smlouvě: „{where.text}“</>
                : place.trim()
                  ? <>Ve smlouvě: „{where.text}“. Vlastní tvar můžete napsat i s předložkou, např. „v Lovosicích“.</>
                  : "Napište město; ve smlouvě ho správně vyskloňujeme."}
            </span>
          </label>
          <label className="text-sm">
            Datum podpisu
            <input className="input mt-1" type="date" value={signDate} onChange={(e) => setSignDate(e.target.value)} />
          </label>
          {paidBy === "hotove" && (
            <label className="flex gap-2 text-sm sm:col-span-2">
              <input type="checkbox" checked={handedAtSigning} onChange={(e) => setHandedAtSigning(e.target.checked)} />
              Vozidlo se předává při podpisu smlouvy
            </label>
          )}
          {!handedNow && (
            <label className="text-sm">
              Předat vozidlo nejpozději dne
              <input className="input mt-1" type="date" value={handoverDate} onChange={(e) => setHandoverDate(e.target.value)} />
            </label>
          )}
          <label className="text-sm">
            Žádost o přepis podá
            <select className="input mt-1" value={filer} onChange={(e) => setFiler(e.target.value as keyof typeof FILERS)}>
              <option value="spolecne">Obě strany společně</option>
              <option value="prodavajici">Prodávající (s plnou mocí kupujícího)</option>
              <option value="kupujici">Kupující (s plnou mocí prodávajícího)</option>
            </select>
          </label>
          <div className="sm:col-span-2">
            <p className="text-sm mb-1">Předává se spolu s vozidlem</p>
            <div className="grid gap-1 sm:grid-cols-2">
              {HANDOVER_ITEMS.map((item) => (
                <label key={item} className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={handover.includes(item)}
                    onChange={(e) => setHandover(e.target.checked ? [...handover, item] : handover.filter((h) => h !== item))}
                  />
                  {item}
                </label>
              ))}
            </div>
            {handover.includes("klíče") && (
              <label className="text-sm mt-2 inline-flex items-center gap-2">
                Počet klíčů
                <input className="input w-20" inputMode="numeric" value={keys} onChange={(e) => setKeys(e.target.value.replace(/\D/g, ""))} />
              </label>
            )}
          </div>
        </fieldset>
      </form>

      <section className="min-w-0 lg:sticky lg:top-20 space-y-3 print:static">
        <div className="flex flex-wrap items-center justify-between gap-2 print:hidden">
          <h2 className="font-bold">Náhled smlouvy</h2>
          <button type="button" className="btn-cta text-sm" onClick={() => window.print()}>Vytisknout / uložit PDF</button>
        </div>
        {/* A sheet of paper on a grey desk; on print only the sheet remains. */}
        <div className="rounded-[14px] bg-[var(--color-field)] p-3 sm:p-6 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto print:max-h-none print:overflow-visible print:bg-transparent print:p-0">
          <article
            lang="cs"
            className="contract mx-auto max-w-[210mm] bg-white text-[#16191d] shadow-xl px-6 py-8 sm:px-12 sm:py-12 text-[14.5px] leading-[1.65] text-justify hyphens-auto [font-family:Georgia,'Times_New_Roman',serif] print:max-w-none print:shadow-none print:p-0 print:text-[10.5pt] print:leading-[1.5]"
          >
            <header className="text-center">
              <h2 className="text-[1.45em] font-bold uppercase tracking-[0.08em]">Kupní smlouva</h2>
              <p className="font-semibold">na prodej ojetého osobního automobilu</p>
              <p className="mt-1 text-[0.85em] italic text-[#5a6370]">uzavřená podle § 2079 a násl. zákona č. 89/2012 Sb., občanský zákoník</p>
              <div className="mx-auto mt-5 h-px w-24 bg-[#16191d]" />
            </header>

            <div className="mt-7 grid gap-5 sm:grid-cols-2 text-left">
              <PartyBlock role="Prodávající" party={seller} alias="prodávající" />
              <PartyBlock role="Kupující" party={buyer} alias="kupující" />
            </div>
            <p className="mt-5 text-center italic">uzavírají níže uvedeného dne tuto kupní smlouvu:</p>

            <Article no="I." title="Předmět smlouvy">
              <li>
                Prodávající prodává kupujícímu osobní automobil (dále jen „vozidlo“):
                <table className="mt-2 w-full text-left text-[0.95em]">
                  <tbody>
                    {VEHICLE_ROWS.map(([label, value]) => (
                      <tr key={label} className="border-b border-[#dfe3e8] last:border-0">
                        <td className="py-1 pr-3 text-[#5a6370] w-[45%]">{label}</td>
                        <td className="py-1 font-semibold">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </li>
              <li>
                Prodávající prohlašuje, že je výlučným vlastníkem vozidla a že vozidlo není zatíženo zástavním právem ani jinými právy
                třetích osob.
              </li>
              <li>
                Prodávajícímu nejsou známy zásahy do počítadla ujeté vzdálenosti ani odchylky od skutečného nájezdu s výjimkou
                následujících skutečností: {odometerNote.trim() || BLANK}.
              </li>
            </Article>

            <Article no="II." title="Kupní cena">
              <li>Kupní cena činí <b>{formatCzk(price)}</b>.</li>
              {paidBy === "hotove" ? (
                <li>Kupující ji uhradil v hotovosti při podpisu této smlouvy a prodávající podpisem potvrzuje její převzetí.</li>
              ) : (
                <li>
                  Kupující uhradí kupní cenu na účet č. {fill(account)} nejpozději do {formatDay(payDue)}. Kupní cena je zaplacena
                  připsáním celé částky na tento účet. Prodávající předá vozidlo po úplném zaplacení kupní ceny, nejpozději dne{" "}
                  {formatDay(handoverDate)}.
                </li>
              )}
              <li>Vlastnické právo k vozidlu přechází na kupujícího úplným zaplacením kupní ceny.</li>
            </Article>

            <Article no="III." title="Stav vozidla">
              <li>
                Kupující prohlašuje, že se se stavem vozidla seznámil, vozidlo si prohlédl{testDrive ? " a vyzkoušel zkušební jízdou" : ""} a
                kupuje je ve stavu, v jakém se ke dni podpisu nachází.
              </li>
              <li>
                Prodávající kupujícího upozornil na tyto známé vady:
                {listedDefects.length ? (
                  <ul className="mt-1 list-[lower-alpha] pl-6">
                    {listedDefects.map((d) => <li key={d}>{d}</li>)}
                  </ul>
                ) : (
                  <span className="block mt-1">{BLANK}{BLANK}{BLANK}</span>
                )}
                {noOtherDefects && <span className="block mt-1">Prodávajícímu nejsou známy další vady.</span>}
              </li>
              <li>Tímto prohlášením nejsou vyloučena zákonná práva kupujícího z vadného plnění.</li>
            </Article>

            <Article no="IV." title="Předání vozidla">
              {handedNow ? (
                <li>Vozidlo bylo kupujícímu předáno při podpisu této smlouvy dne {formatDay(signDate)} spolu s: {items}.</li>
              ) : (
                <>
                  {paidBy === "hotove" && <li>Prodávající předá vozidlo kupujícímu nejpozději dne {formatDay(handoverDate)}.</li>}
                  <li>Spolu s vozidlem se předává: {items}.</li>
                  <li>O předání sepíší strany předávací protokol s uvedením data a hodiny předání.</li>
                </>
              )}
              <li>Nebezpečí škody na vozidle přechází na kupujícího jeho převzetím.</li>
            </Article>

            <Article no="V." title="Zápis změny vlastníka a pojištění">
              <li>
                Smluvní strany se zavazují podat žádost o zápis změny vlastníka vozidla v registru silničních vozidel do 10 pracovních
                dnů ode dne převodu vlastnického práva (§ 8 zákona č. 56/2001 Sb.). Podání žádosti zajistí {FILERS[filer]}. Smluvní strany
                si poskytnou potřebnou součinnost a případně plnou moc. Toto ujednání nezbavuje žádnou ze stran zákonné povinnosti.
              </li>
              <li>Správní poplatek, případný emisní poplatek a evidenční kontrolu hradí kupující.</li>
              <li>
                Kupující zajistí účinné pojištění odpovědnosti z provozu vozidla nejpozději k okamžiku převzetí vozidla. Strany sladí
                ukončení dosavadního a počátek nového pojištění tak, aby nevznikla mezera v pojistném krytí.
              </li>
            </Article>

            <Article no="VI." title="Závěrečná ustanovení">
              <li>Smlouva je vyhotovena ve dvou stejnopisech, z nichž každá smluvní strana obdrží jeden.</li>
              <li>Smluvní strany prohlašují, že si smlouvu přečetly, jejímu obsahu rozumějí a uzavírají ji svobodně a vážně.</li>
            </Article>

            <div className="break-inside-avoid">
              <p className="mt-8">{where.text} dne {formatDay(signDate)}</p>
              <div className="mt-16 grid grid-cols-2 gap-10 text-center">
                {([["prodávající", seller], ["kupující", buyer]] as const).map(([role, party]) => (
                  <div key={role}>
                    <div className="border-t border-[#16191d]" />
                    <p className="mt-1 font-semibold">{party.name.trim() || " "}</p>
                    <p className="text-[0.85em] text-[#5a6370]">{role}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
