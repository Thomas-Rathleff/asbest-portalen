#!/usr/bin/env python3
"""
Import SIK asbest-virksomheder til Supabase + hent firmanavne fra CVR API.
Kør: python3 import-virksomheder.py
"""

import csv, json, re, time, requests, os

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
CSV_URL = "https://www.sik.dk/registries/export/csv/autorisationsregister"

def hent_firmanavn(cvr: str) -> str | None:
    """Hent firmanavn fra CVR API (gratis, offentlig)."""
    if not cvr or len(cvr) < 8:
        return None
    try:
        r = requests.get(
            f"https://api.cvr.dk/virksomhed/{cvr}",
            headers={"Accept": "application/json"},
            timeout=5
        )
        if r.status_code == 200:
            data = r.json()
            return data.get("navn") or data.get("virksomhedMetadata", {}).get("nyesteNavn", {}).get("navn")
    except:
        pass
    # Fallback: DAWA CVR opslag
    try:
        r = requests.get(
            f"https://api.dataforsyningen.dk/cvr/virksomheder?cvr_nummer={cvr}",
            timeout=5
        )
        if r.status_code == 200:
            data = r.json()
            if data and len(data) > 0:
                return data[0].get("navn")
    except:
        pass
    return None

def main():
    print("📥 Downloader SIK register...")
    r = requests.get(CSV_URL, timeout=30)
    r.encoding = "utf-8"
    lines = r.text.splitlines()

    virksomheder = []
    reader = csv.DictReader(iter(lines), delimiter=";")
    for row in reader:
        autnr = row.get("autnr", "")
        forr = row.get("forretningsomr", "")
        if "ASBE" not in autnr and "asbest" not in forr.lower():
            continue
        asbe_match = re.search(r"ASBE-\d+", autnr)
        if not asbe_match:
            continue
        virksomheder.append({
            "asbe_nr": asbe_match.group(0),
            "adresse": row.get("adresse1", "").strip('"'),
            "postnr": row.get("postnr", "").strip(),
            "by": row.get("postdst", "").strip('"'),
            "cvr": row.get("cvr", "").strip(),
            "navn": row.get("navn", "").strip('"') or None,
        })

    print(f"✅ Fundet {len(virksomheder)} asbest-virksomheder")

    # Hent firmanavne fra CVR for virksomheder uden navn
    print("🔍 Henter firmanavne fra CVR...")
    for i, v in enumerate(virksomheder):
        if not v["navn"] and v["cvr"]:
            navn = hent_firmanavn(v["cvr"])
            if navn:
                v["navn"] = navn
                print(f"  [{i+1}/{len(virksomheder)}] {v['asbe_nr']}: {navn}")
            time.sleep(0.1)  # Respekter rate limit

    # Importer til Supabase i batches af 100
    print("📤 Importerer til Supabase...")
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
    }

    batch_size = 100
    total = 0
    for i in range(0, len(virksomheder), batch_size):
        batch = virksomheder[i:i+batch_size]
        r = requests.post(
            f"{SUPABASE_URL}/rest/v1/virksomheder",
            headers=headers,
            json=batch,
            timeout=30
        )
        if r.status_code in (200, 201):
            total += len(batch)
            print(f"  ✅ Batch {i//batch_size + 1}: {len(batch)} virksomheder importeret ({total} total)")
        else:
            print(f"  ❌ Fejl i batch {i//batch_size + 1}: {r.status_code} {r.text[:200]}")

    print(f"\n🎉 Import færdig! {total}/{len(virksomheder)} virksomheder i Supabase.")

if __name__ == "__main__":
    main()
