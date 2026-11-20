#!/usr/bin/env python3
"""Usage: python3 build_worker.py invites.xlsx  ->  écrit worker.js (à coller dans Cloudflare).
Colonnes attendues (1re ligne = en-têtes) : Prénom, Nom, Téléphone."""
import sys, json, re, unicodedata, openpyxl
def norm(s): return unicodedata.normalize("NFKD", str(s).lower()).encode("ascii", "ignore").decode()
wb = openpyxl.load_workbook(sys.argv[1], data_only=True); ws = wb.active
rows = list(ws.iter_rows(values_only=True)); head = [norm(c or "") for c in rows[0]]
def col(*names):
    for i, h in enumerate(head):
        if any(n in h for n in names): return i
    raise SystemExit("Colonne introuvable : " + "/".join(names))
ip = col("prenom")
inn = next((i for i, h in enumerate(head) if "nom" in h and "prenom" not in h), None)
it = col("tel", "phone", "portable", "mobile")
g, bad = {}, []
for r in rows[1:]:
    if not r or not r[ip]: continue
    d = re.sub(r"\D", "", str(r[it] or "")); 
    if len(d) < 9: bad.append(r); continue
    k = d[-9:]
    if k in g: print("Doublon de numéro :", d, g[k][0], "/", r[ip]); continue
    p = str(r[ip]).strip(); n = (p + " " + str((r[inn] if inn is not None else "") or "").strip()).strip()
    g[k] = [p, n]
src = open(__file__.replace("build_worker.py", "worker-template.js"), encoding="utf-8").read()
out = src.replace("/*GUESTS*/{}/*END*/", json.dumps(g, ensure_ascii=False))
open("worker.js", "w", encoding="utf-8").write(out)
print(len(g), "invités ->", "worker.js"); 
if bad: print("Numéros invalides ignorés :", len(bad), bad)
