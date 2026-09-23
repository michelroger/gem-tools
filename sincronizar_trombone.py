# -*- coding: utf-8 -*-
"""
Script para sincronizar as partituras de Trombone com o xml/catalog.json.
Varre a pasta xml/colecoes/hinario5-ccb/do/trombone/ procurando arquivos .musicxml e .mxl,
converte eventuais .mxl, renomeia para {num}_s.musicxml e {num}_t.musicxml,
e cadastra automaticamente Soprano e Tenor no catálogo.
"""
import os
import json
import re
import zipfile

CATALOG_PATH = os.path.join("xml", "catalog.json")
TROMBONE_DIR = os.path.join("xml", "colecoes", "hinario5-ccb", "do", "trombone")

def sincronizar_trombone():
    if not os.path.exists(CATALOG_PATH):
        print(f"Erro: Arquivo {CATALOG_PATH} não encontrado.")
        return

    if not os.path.exists(TROMBONE_DIR):
        os.makedirs(TROMBONE_DIR, exist_ok=True)
        print(f"Diretório criado: {TROMBONE_DIR}")

    # 1. Trata eventuais arquivos .mxl
    mxl_files = [f for f in os.listdir(TROMBONE_DIR) if f.lower().endswith(".mxl")]
    for mf in mxl_files:
        m = re.match(r"^(\d+).*?[-_]\s*(Sop|S|1P|Ten|T|3P)\.mxl$", mf, re.IGNORECASE)
        if m:
            num = int(m.group(1))
            part = m.group(2).lower()
            voice = "s" if part in ("sop", "s", "1p") else "t"
            new_name = f"{num}_{voice}.musicxml"
            mxl_p = os.path.join(TROMBONE_DIR, mf)
            dest_p = os.path.join(TROMBONE_DIR, new_name)
            try:
                with zipfile.ZipFile(mxl_p, "r") as z:
                    xml_data = z.read("document.xml")
                    with open(dest_p, "wb") as out_f:
                        out_f.write(xml_data)
                os.remove(mxl_p)
                print(f"Extraído e convertido .mxl: {mf} -> {new_name}")
            except Exception as e:
                print(f"Erro ao extrair {mf}: {e}")

    # 2. Renomeia arquivos longos do Flat
    files = [f for f in os.listdir(TROMBONE_DIR) if f.lower().endswith(".musicxml")]
    renamed = 0
    for f in files:
        m = re.match(r"^(\d+).*?[-_]\s*(Sop|S|1P|Ten|T|3P)\.musicxml$", f, re.IGNORECASE)
        if m:
            num = int(m.group(1))
            part = m.group(2).lower()
            voice = "s" if part in ("sop", "s", "1p") else "t"
            new_name = f"{num}_{voice}.musicxml"
            old_p = os.path.join(TROMBONE_DIR, f)
            new_p = os.path.join(TROMBONE_DIR, new_name)
            if old_p != new_p:
                os.rename(old_p, new_p)
                renamed += 1

    if renamed > 0:
        print(f"Arquivos renomeados com sucesso: {renamed}")

    # 3. Mapeia arquivos
    trombone_files = [f for f in os.listdir(TROMBONE_DIR) if f.lower().endswith(".musicxml")]
    hinos_map = {}
    for f in trombone_files:
        m = re.match(r"^(\d+)_([a-zA-Z0-9]+)\.musicxml$", f)
        if m:
            num = int(m.group(1))
            v = m.group(2).lower()
            hinos_map.setdefault(num, {})[v] = f"xml/colecoes/hinario5-ccb/do/trombone/{f}".replace("\\", "/")

    print(f"Total de hinos mapeados para Trombone: {len(hinos_map)}")

    # 4. Atualiza catalog.json
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    hinario = None
    for col in catalog.get("colecoes", []):
        if col.get("id") == "hinario5-ccb":
            hinario = col
            break

    if not hinario:
        print("Erro: Coleção hinario5-ccb não encontrada.")
        return

    atualizados = 0
    for item in hinario.get("items", []):
        num = item.get("numero")
        if num in hinos_map:
            s_path = hinos_map[num].get("s", "")
            t_path = hinos_map[num].get("t", "")
            if "arquivosPorInstrumento" not in item:
                item["arquivosPorInstrumento"] = {}
            item["arquivosPorInstrumento"]["trombone"] = {
                "s": s_path,
                "c": "",
                "t": t_path,
                "b": ""
            }
            atualizados += 1

    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

    print(f"Sucesso! Catálogo atualizado com {atualizados} hinos para Trombone.")

if __name__ == "__main__":
    sincronizar_trombone()
