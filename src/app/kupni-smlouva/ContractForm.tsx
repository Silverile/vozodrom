"use client";

import { useState } from "react";

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

export function ContractForm() {
  const [seller, setSeller] = useState<Party>(EMPTY_PARTY);
  const [buyer, setBuyer] = useState<Party>(EMPTY_PARTY);
  const [car, setCar] = useState({ make: "", vin: "", plate: "", firstReg: "", orv: "", color: "", km: "" });
  const [price, setPrice] = useState("");
  const [payment, setPayment] = useState<"hotove" | "prevod">("hotove");
  const [account, setAccount] = useState("");
  const [payDue, setPayDue] = useState("");
  const [defects, setDefects] = useState("");
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

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] mt-6 items-start">
      <form className="card p-4 space-y-6 print:hidden" onSubmit={(e) => e.preventDefault()} autoComplete="off">
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
            <input className="input mt-1" value={place} onChange={(e) => setPlace(e.target.value)} />
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
          <label className="text-sm sm:col-span-2">
            Známé vady vozidla
            <textarea className="input mt-1 min-h-20" placeholder="např. škrábanec na zadním nárazníku, opotřebené brzdové kotouče" value={defects} onChange={(e) => setDefects(e.target.value)} />
          </label>
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

      <section className="lg:sticky lg:top-20 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 print:hidden">
          <h2 className="font-bold">Náhled smlouvy</h2>
          <button type="button" className="btn-cta text-sm" onClick={() => window.print()}>Vytisknout / uložit PDF</button>
        </div>
        <article className="contract card p-6 text-sm leading-relaxed space-y-4 bg-white text-[#14181d] print:border-0 print:p-0">
          <header className="text-center">
            <h2 className="text-lg font-bold uppercase tracking-wide">Kupní smlouva na motorové vozidlo</h2>
            <p>uzavřená podle § 2079 a násl. zákona č. 89/2012 Sb., občanský zákoník</p>
          </header>

          {(["Prodávající", "Kupující"] as const).map((role, i) => {
            const p = i === 0 ? seller : buyer;
            return (
              <p key={role}>
                <b>{role}:</b> {fill(p.name)}, nar. {fill(p.born)}, bytem {fill(p.address)}
                {p.idDoc.trim() && <>, číslo dokladu totožnosti {p.idDoc.trim()}</>}
              </p>
            );
          })}

          <section>
            <h3 className="font-bold">I. Předmět smlouvy</h3>
            <p>
              Prodávající prodává kupujícímu osobní automobil {fill(car.make)}, VIN {fill(car.vin)}, registrační značka {fill(car.plate)},
              datum první registrace {fill(car.firstReg)}, číslo ORV {fill(car.orv)}, barva {fill(car.color)}, se stavem tachometru
              při předání {formatKm(car.km)} (dále jen „vozidlo“).
            </p>
            <p className="mt-2">
              Prodávající prohlašuje, že je výlučným vlastníkem vozidla a že vozidlo není zatíženo zástavním právem ani jinými právy třetích
              osob. Prodávajícímu nejsou známy zásahy do počítadla ujeté vzdálenosti ani odchylky od skutečného nájezdu s výjimkou
              následujících skutečností: {odometerNote.trim() || BLANK}.
            </p>
          </section>

          <section>
            <h3 className="font-bold">II. Kupní cena</h3>
            <p>
              Kupní cena činí {formatCzk(price)}.{" "}
              {paidBy === "hotove" ? (
                "Kupující ji uhradil v hotovosti při podpisu této smlouvy a prodávající podpisem potvrzuje její převzetí."
              ) : (
                <>
                  Kupující uhradí kupní cenu na účet č. {fill(account)} nejpozději do {formatDay(payDue)}. Kupní cena je zaplacena
                  připsáním celé částky na tento účet. Prodávající předá vozidlo po úplném zaplacení kupní ceny, nejpozději dne{" "}
                  {formatDay(handoverDate)}.
                </>
              )}{" "}
              Vlastnické právo k vozidlu přechází na kupujícího úplným zaplacením kupní ceny.
            </p>
          </section>

          <section>
            <h3 className="font-bold">III. Stav vozidla</h3>
            <p>
              Kupující prohlašuje, že se se stavem vozidla seznámil, vozidlo si prohlédl{testDrive ? " a vyzkoušel zkušební jízdou" : ""} a
              kupuje je ve stavu, v jakém se ke dni podpisu nachází. Prodávající kupujícího upozornil na tyto známé vady:{" "}
              {defects.trim() || BLANK}.{noOtherDefects && " Prodávajícímu nejsou známy další vady."} Tímto prohlášením nejsou vyloučena
              zákonná práva kupujícího z vadného plnění.
            </p>
          </section>

          <section>
            <h3 className="font-bold">IV. Předání vozidla</h3>
            <p>
              {handedNow
                ? `Vozidlo bylo kupujícímu předáno při podpisu této smlouvy dne ${formatDay(signDate)} spolu s: ${items}.`
                : `${paidBy === "hotove" ? `Prodávající předá vozidlo kupujícímu nejpozději dne ${formatDay(handoverDate)}. ` : ""}Spolu s vozidlem se předává: ${items}. O předání sepíší strany předávací protokol s uvedením data a hodiny předání.`}{" "}
              Nebezpečí škody na vozidle přechází na kupujícího jeho převzetím.
            </p>
          </section>

          <section>
            <h3 className="font-bold">V. Zápis změny vlastníka</h3>
            <p>
              Smluvní strany se zavazují podat žádost o zápis změny vlastníka vozidla v registru silničních vozidel do 10 pracovních dnů
              ode dne převodu vlastnického práva (§ 8 zákona č. 56/2001 Sb.). Podání žádosti zajistí {FILERS[filer]}. Smluvní strany si poskytnou
              potřebnou součinnost a případně plnou moc. Toto ujednání nezbavuje žádnou ze stran zákonné povinnosti. Správní poplatek,
              případný emisní poplatek a evidenční kontrolu hradí kupující.
            </p>
            <p className="mt-2">
              Kupující zajistí účinné pojištění odpovědnosti z provozu vozidla nejpozději k okamžiku převzetí vozidla. Strany sladí
              ukončení dosavadního a počátek nového pojištění tak, aby nevznikla mezera v pojistném krytí.
            </p>
          </section>

          <section>
            <h3 className="font-bold">VI. Závěrečná ustanovení</h3>
            <p>
              Smlouva je vyhotovena ve dvou stejnopisech, z nichž každá smluvní strana obdrží jeden. Smluvní strany prohlašují, že si
              smlouvu přečetly, jejímu obsahu rozumějí a uzavírají ji svobodně a vážně.
            </p>
          </section>

          <p>V {fill(place)} dne {formatDay(signDate)}</p>
          <div className="grid grid-cols-2 gap-8 pt-10">
            <p className="border-t border-[#14181d] pt-1 text-center">prodávající</p>
            <p className="border-t border-[#14181d] pt-1 text-center">kupující</p>
          </div>
        </article>
      </section>
    </div>
  );
}
