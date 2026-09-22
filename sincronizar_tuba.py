# -*- coding: utf-8 -*-
"""
Script para sincronizar as partituras de Tuba com o xml/catalog.json.
Varre a pasta xml/colecoes/hinario5-ccb/do/tuba/ procurando arquivos .musicxml
(suporta tanto nomes originais '1 ... - 3P.musicxml' quanto renomeados '1_t.musicxml')
e cadastra automaticamente as 2 vozes (Tenor 't' e Baixo 'b') para cada hino.
"""
import os
import json
import re

CATALOG_PATH = os.path.join("xml", "catalog.json")
TUBA_DIR = os.path.join("xml", "colecoes", "hinario5-ccb", "do", "tuba")

def sincronizar_tuba():
    if not os.path.exists(CATALOG_PATH):
        print(f"Erro: Arquivo {CATALOG_PATH} não encontrado.")
        return

    if not os.path.exists(TUBA_DIR):
        os.makedirs(TUBA_DIR, exist_ok=True)
        print(f"Diretório criado: {TUBA_DIR}")

    files = [f for f in os.listdir(TUBA_DIR) if f.lower().endswith(".musicxml") or f.lower().endswith(".xml")]
    print(f"Encontrados {len(files)} arquivos na pasta {TUBA_DIR}")

    # 1. Renomeia se houver arquivos com nomes longos do Flat (ex: '1 Cristo... - 3P.musicxml')
    renamed = 0
    for f in files:
        m = re.match(r"^(\d+).*?([34]P)\.musicxml$", f, re.IGNORECASE)
        if m:
            num = int(m.group(1))
            part = m.group(2).upper()
            voice = "t" if part == "3P" else "b"
            new_name = f"{num}_{voice}.musicxml"
            old_path = os.path.join(TUBA_DIR, f)
            new_path = os.path.join(TUBA_DIR, new_name)
            if old_path != new_path:
                os.rename(old_path, new_path)
                renamed += 1

    if renamed > 0:
        print(f"Arquivos renomeados para o padrão limpo: {renamed}")

    # 2. Mapeia os arquivos padronizados
    tuba_files = [f for f in os.listdir(TUBA_DIR) if f.lower().endswith(".musicxml")]
    hinos_map = {}
    for f in tuba_files:
        m = re.match(r"^(\d+)_([tb])\.musicxml$", f, re.IGNORECASE)
        if m:
            num = int(m.group(1))
            v = m.group(2).lower()
            hinos_map.setdefault(num, {})[v] = f"xml/colecoes/hinario5-ccb/do/tuba/{f}".replace("\\", "/")

    # 3. Atualiza catalog.json
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
            t_path = hinos_map[num].get("t", "")
            b_path = hinos_map[num].get("b", "")
            if "arquivosPorInstrumento" not in item:
                item["arquivosPorInstrumento"] = {}
            item["arquivosPorInstrumento"]["tuba"] = {
                "s": "",
                "c": "",
                "t": t_path,
                "b": b_path
            }
            atualizados += 1

    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

    print(f"Sucesso! Catálogo atualizado com {atualizados} hinos para Tuba.")

if __name__ == "__main__":
    sincronizar_tuba()
