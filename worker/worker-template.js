// Cloudflare Worker : vérifie un numéro de téléphone et renvoie le prénom de l'invité.
// La liste des invités (GUESTS) est insérée par build_worker.py — ne jamais la publier sur GitHub.
const GUESTS = /*GUESTS*/{}/*END*/;
const ORIGINS = ["https://thewizelwedding.fr", "https://www.thewizelwedding.fr"];

function cors(req) {
  const o = req.headers.get("Origin");
  return {
    "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

export default {
  async fetch(req) {
    const h = cors(req);
    if (req.method === "OPTIONS") return new Response(null, { headers: h });
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: h });
    let tel = "";
    try { tel = String((await req.json()).tel || ""); } catch (e) {}
    const key = tel.replace(/\D/g, "").slice(-9);
    const g = key.length === 9 ? GUESTS[key] : null;
    if (!g) return new Response(JSON.stringify({ ok: false }), { status: 404, headers: { ...h, "Content-Type": "application/json" } });
    return new Response(JSON.stringify({ ok: true, prenom: g[0], nom: g[1] }), { headers: { ...h, "Content-Type": "application/json" } });
  },
};
