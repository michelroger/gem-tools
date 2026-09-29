# -*- coding: utf-8 -*-
"""
Script para sincronizar as partituras de Clarinete com o xml/catalog.json.
Varre a pasta xml/colecoes/hinario5-ccb/sib/clarineta/ procurando arquivos .musicxml e .mxl,
converte eventuais .mxl, move eventuais partituras de Saxofone Alto para mib/saxofone,
ajusta eventuais tags de instrumento no XML (ex: hino 80),
renomeia para {num}_s.musicxml e {num}_c.musicxml,
e cadastra automaticamente Soprano e Contralto no catálogo sob a chave 'clarinete'.
"""
import os
import json
import re
import zipfile
import xml.etree.ElementTree as ET

CATALOG_PATH = os.path.join("xml", "catalog.json")
CLARINETE_DIR = os.path.join("xml", "colecoes", "hinario5-ccb", "sib", "clarineta")
SAXOFONE_DIR = os.path.join("xml", "colecoes", "hinario5-ccb", "mib", "saxofone")

def sincronizar_clarinete():
    if not os.path.exists(CATALOG_PATH):
        print(f"Erro: Arquivo {CATALOG_PATH} não encontrado.")
        return

    if not os.path.exists(CLARINETE_DIR):
        os.makedirs(CLARINETE_DIR, exist_ok=True)
        print(f"Diretório criado: {CLARINETE_DIR}")

    # 1. Trata eventuais arquivos .mxl
    mxl_files = [f for f in os.listdir(CLARINETE_DIR) if f.lower().endswith(".mxl")]
    for mf in mxl_files:
        m = re.match(r"^(\d+).*?[-_]\s*(Ctr|C|Sop|S)(?:\s*\(\d+\))?\.mxl$", mf, re.IGNORECASE)
        if m:
            num = int(m.group(1))
            part = m.group(2).lower()
            voice = "c" if part in ("ctr", "c") else "s"
            new_name = f"{num}_{voice}.musicxml"
            mxl_p = os.path.join(CLARINETE_DIR, mf)
            dest_p = os.path.join(CLARINETE_DIR, new_name)
            try:
                with zipfile.ZipFile(mxl_p, "r") as z:
                    xml_data = z.read("document.xml")
                    with open(dest_p, "wb") as out_f:
                        out_f.write(xml_data)
                os.remove(mxl_p)
                print(f"Extraído e convertido .mxl: {mf} -> {new_name}")
            except Exception as e:
                print(f"Erro ao extrair {mf}: {e}")

    # 2. Desvia arquivos de Saxofone Alto para mib/saxofone se houver
    files = [f for f in os.listdir(CLARINETE_DIR) if f.lower().endswith(".musicxml")]
    for f in files:
        if f.startswith("14 ") and "(1)" in f:
            os.makedirs(SAXOFONE_DIR, exist_ok=True)
            voice = "c" if "Ctr" in f else "s"
            dest = os.path.join(SAXOFONE_DIR, f"14_{voice}.musicxml")
            src = os.path.join(CLARINETE_DIR, f)
            os.rename(src, dest)
            print(f"Arquivo de Saxofone Alto movido: {f} -> {dest}")

    # 3. Ajusta tags no XML do hino 80 (exportado com instrument-name Trompete)
    for f in os.listdir(CLARINETE_DIR):
        if f.startswith("80 ") and f.lower().endswith(".musicxml"):
            p = os.path.join(CLARINETE_DIR, f)
            try:
                content = open(p, "r", encoding="utf-8").read()
                if "<instrument-name>Trompete</instrument-name>" in content:
                    content = content.replace("<instrument-name>Trompete</instrument-name>", "<instrument-name>Clarinete</instrument-name>")
                    content = content.replace("<midi-program>57</midi-program>", "<midi-program>72</midi-program>")
                    with open(p, "w", encoding="utf-8") as out:
                        out.write(content)
                    print(f"Instrumento ajustado para Clarinete em: {f}")
            except Exception as e:
                print(f"Erro ao ajustar XML {f}: {e}")

    # 4. Renomeia arquivos longos do Flat
    files = [f for f in os.listdir(CLARINETE_DIR) if f.lower().endswith(".musicxml")]
    renamed = 0
    for f in files:
        m = re.match(r"^(\d+).*?[-_]\s*(Ctr|C|Sop|S)(?:\s*\(\d+\))?\.musicxml$", f, re.IGNORECASE)
        if m:
            num = int(m.group(1))
            part = m.group(2).lower()
            voice = "c" if part in ("ctr", "c") else "s"
            new_name = f"{num}_{voice}.musicxml"
            old_p = os.path.join(CLARINETE_DIR, f)
            new_p = os.path.join(CLARINETE_DIR, new_name)
            if old_p != new_p:
                os.rename(old_p, new_p)
                renamed += 1

    if renamed > 0:
        print(f"Arquivos renomeados com sucesso: {renamed}")

    # 5. Mapeia arquivos padronizados
    clarinete_files = [f for f in os.listdir(CLARINETE_DIR) if f.lower().endswith(".musicxml")]
    hinos_map = {}
    for f in clarinete_files:
        m = re.match(r"^(\d+)_([a-zA-Z0-9]+)\.musicxml$", f)
        if m:
            num = int(m.group(1))
            v = m.group(2).lower()
            hinos_map.setdefault(num, {})[v] = f"xml/colecoes/hinario5-ccb/sib/clarineta/{f}".replace("\\", "/")

    print(f"Total de hinos mapeados para Clarinete: {len(hinos_map)}")

    # 6. Atualiza catalog.json
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
        if "arquivosPorInstrumento" not in item:
            item["arquivosPorInstrumento"] = {}

        if num in hinos_map:
            s_path = hinos_map[num].get("s", "")
            c_path = hinos_map[num].get("c", "")
            item["arquivosPorInstrumento"]["clarinete"] = {
                "s": s_path,
                "c": c_path,
                "t": "",
                "b": ""
            }
            atualizados += 1
        else:
            if "clarinete" not in item["arquivosPorInstrumento"]:
                item["arquivosPorInstrumento"]["clarinete"] = {
                    "s": "",
                    "c": "",
                    "t": "",
                    "b": ""
                }

    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

    print(f"Sucesso! Catálogo atualizado com {atualizados} hinos para Clarinete.")

if __name__ == "__main__":
    sincronizar_clarinete()
