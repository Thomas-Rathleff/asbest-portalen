const https = require("https");
const fs = require("fs");

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "";

// Læs lokal JSON fil
const data = JSON.parse(fs.readFileSync("public/data/virksomheder.json", "utf8"));

function supabasePost(batch) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(batch);
    const options = {
      hostname: SUPABASE_URL,
      path: "/rest/v1/virksomheder",
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
        "Content-Length": Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  // Filtrer og map data
  const virksomheder = data
    .filter(v => v.asbe_nr)
    .map(v => ({
      asbe_nr: v.asbe_nr,
      navn: v.navn || null,
      adresse: v.adresse || null,
      postnr: v.postnr || null,
      by: v.by || null,
      cvr: v.cvr || null,
    }));

  console.log(`Importerer ${virksomheder.length} virksomheder...`);

  const batchSize = 100;
  let total = 0;

  for (let i = 0; i < virksomheder.length; i += batchSize) {
    const batch = virksomheder.slice(i, i + batchSize);
    const result = await supabasePost(batch);
    if (result.status === 200 || result.status === 201) {
      total += batch.length;
      console.log(`Batch ${Math.floor(i/batchSize)+1}: ${total}/${virksomheder.length} ✅`);
    } else {
      console.log(`Batch fejl: ${result.status} ${result.body.slice(0, 200)}`);
    }
  }

  console.log(`\nFærdig! ${total} virksomheder importeret til Supabase.`);
}

main().catch(console.error);
