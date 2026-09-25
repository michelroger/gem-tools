import os
import re
import json
import xml.etree.ElementTree as ET

BASE_DIR = r"c:\Mega\gem-tools"
CORDAS_DIR = os.path.join(BASE_DIR, "xml", "colecoes", "musicas-cordas")
CATALOG_PATH = os.path.join(BASE_DIR, "xml", "catalog.json")

def clean_filename(filename):
    # Tratar extensões duplas como ..musicxml
    filename = re.sub(r'\.\.musicxml$', '.musicxml', filename)
    filename = re.sub(r'\.\.xml$', '.musicxml', filename)
    filename = re.sub(r'\.mxl$', '.musicxml', filename)
    
    # Padronizar número com 2 dígitos se estiver com 1 dígito
    m = re.match(r"^(\d+)(?:-|\s+)(.*)", filename)
    if m:
        num = int(m.group(1))
        rest = m.group(2)
        rest = re.sub(r'\s+', ' ', rest).strip()
        rest = re.sub(r'\s+-\s+', ' - ', rest)
        # Padronizar sufixos de instrumentos
        rest = re.sub(r'-\s*Vc\.\.', '- Vc.', rest)
        rest = re.sub(r'-\s*Vla\.\.', '- Vla.', rest)
        rest = re.sub(r'-\s*Vln\.\.', '- Vln.', rest)
        filename = f"{num:02d} {rest}"
    else:
        filename = re.sub(r'\s+', ' ', filename).strip()
    return filename

def main():
    print("Iniciando organização e catalogação da coleção Músicas para Cordas...")
    
    # 1. Renomear arquivos para padronizar
    all_files = sorted(os.listdir(CORDAS_DIR))
    for fname in all_files:
        if fname == ".gitkeep":
            continue
        old_path = os.path.join(CORDAS_DIR, fname)
        if not os.path.isfile(old_path):
            continue
        new_name = clean_filename(fname)
        if new_name != fname:
            new_path = os.path.join(CORDAS_DIR, new_name)
            os.rename(old_path, new_path)
            print(f"Renomeado: '{fname}' -> '{new_name}'")

    # 2. Agrupar por número da música (1 a 36)
    files = sorted([f for f in os.listdir(CORDAS_DIR) if f != ".gitkeep"])
    songs = {}
    
    for fname in files:
        if not fname.lower().endswith(".musicxml") and not fname.lower().endswith(".xml"):
            continue
        
        m = re.match(r"^(\d+)\s*(.*)", fname)
        if not m:
            print(f"Aviso: arquivo fora do padrão de numeração: {fname}")
            continue
        num = int(m.group(1))
        
        if num not in songs:
            songs[num] = {
                "num": num,
                "files": []
            }
        songs[num]["files"].append(fname)
    
    print(f"Total de músicas agrupadas: {len(songs)}")

    # 3. Processar cada música
    catalog_items = []
    
    for num in sorted(songs.keys()):
        song_data = songs[num]
        s_files = song_data["files"]
        
        sample_title = ""
        s_file = None
        c_file = None
        t_file = None
        b_file = None
        
        by_inst = {
            "violin": {"s": "", "c": "", "t": "", "b": ""},
            "viola": {"s": "", "c": "", "t": "", "b": ""},
            "violoncelo": {"s": "", "c": "", "t": "", "b": ""}
        }
        
        # Mapeamento detalhado por arquivo
        for f in s_files:
            full_fpath = os.path.join(CORDAS_DIR, f)
            f_rel = f"xml/colecoes/musicas-cordas/{f}"
            
            # Tentar ler o título de dentro do XML
            try:
                tree = ET.parse(full_fpath)
                root = tree.getroot()
                wt = root.find(".//work-title")
                if wt is not None and wt.text:
                    raw_title = wt.text.strip()
                    clean_wt = re.sub(r'^\d+[\s\.\-]+', '', raw_title).strip()
                    clean_wt = re.sub(r'\s*-\s*(Violino\s*\d*|Viola|Violoncelo|Cello|Vc\.?|Vla\.?|Vln\.?\d*|Violin\s*\d*|S|C|T|B)$', '', clean_wt, flags=re.I).strip()
                    clean_wt = re.sub(r'\s*\((Violino.*?|Viola.*?|Violoncelo.*?)\)$', '', clean_wt, flags=re.I).strip()
                    if clean_wt and not sample_title:
                        sample_title = clean_wt
            except Exception:
                pass
            
            if not sample_title:
                m = re.match(r"^\d+\s+(.*?)(?:\s*-\s*.*)?\.(?:musicxml|xml)$", f, flags=re.I)
                if m:
                    sample_title = m.group(1).strip()
            
            f_lower = f.lower()
            
            # Identificação de partes
            # Violino 1 / S
            if re.search(r'-\s*(vln1|violin1|violino1)\b', f_lower) or re.search(r'-\s*s\.(?:musicxml|xml)$', f_lower):
                s_file = f_rel
                by_inst["violin"]["s"] = f_rel
            # Violino 2 / C
            elif re.search(r'-\s*(vln2|violin2|violino2)\b', f_lower) or re.search(r'-\s*c\.(?:musicxml|xml)$', f_lower):
                c_file = f_rel
                by_inst["violin"]["c"] = f_rel
            # Violino 3
            elif re.search(r'-\s*(vln3|violin3|violino3)\b', f_lower):
                by_inst["violin"]["t"] = f_rel
            # Violino solo / voz única
            elif re.search(r'-\s*(violino|violin|vln)\b', f_lower):
                s_file = f_rel
                by_inst["violin"]["s"] = f_rel
            # Viola / T
            elif re.search(r'-\s*(viola|vla)\b', f_lower) or re.search(r'-\s*t\.(?:musicxml|xml)$', f_lower):
                t_file = f_rel
                by_inst["viola"]["t"] = f_rel
            # Violoncelo / B
            elif re.search(r'-\s*(violoncelo|cello|vc)\b', f_lower) or re.search(r'-\s*b\.(?:musicxml|xml)$', f_lower):
                b_file = f_rel
                by_inst["violoncelo"]["b"] = f_rel
            else:
                # Arquivo único de partitura geral (score)
                s_file = f_rel
                by_inst["violin"]["s"] = f_rel
                by_inst["viola"]["s"] = f_rel
                by_inst["violoncelo"]["s"] = f_rel

        # Ajustes de fallback nos instrumentos se for arquivo único ou se faltar alguma voz
        if len(s_files) == 1:
            single = f"xml/colecoes/musicas-cordas/{s_files[0]}"
            s_file = single
            by_inst["violin"]["s"] = single
            by_inst["viola"]["s"] = single
            by_inst["violoncelo"]["s"] = single

        item = {
            "id": f"cordas-{num}",
            "numero": num,
            "titulo": sample_title or f"Música {num}",
            "afinacao": "do",
            "compasso": "",
            "bpm": 0,
            "arquivos": {
                "s": s_file or "",
                "c": c_file or "",
                "t": t_file or "",
                "b": b_file or ""
            },
            "arquivosPorInstrumento": by_inst
        }
        catalog_items.append(item)
    
    print(f"Total de itens catalogados: {len(catalog_items)}")
    for it in catalog_items[:5]:
        print(f"  [{it['numero']}] {it['titulo']} -> {it['arquivos']}")
    for it in catalog_items[15:19]:
        print(f"  [{it['numero']}] {it['titulo']} -> {it['arquivos']}")
    for it in catalog_items[-5:]:
        print(f"  [{it['numero']}] {it['titulo']} -> {it['arquivos']}")

    # 4. Atualizar catalog.json
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog = json.load(f)
        
    cordas_col = None
    for col in catalog.get("colecoes", []):
        if col.get("id") == "musicas-cordas":
            cordas_col = col
            break
            
    if not cordas_col:
        cordas_col = {
            "id": "musicas-cordas",
            "nome": "Músicas para Cordas",
            "tipo": "repertorio",
            "ordem": 4,
            "filtros": {
                "afinacoes": ["do"],
                "vozes": ["s", "c", "t", "b"]
            },
            "items": []
        }
        catalog.setdefault("colecoes", []).append(cordas_col)

    cordas_col["items"] = catalog_items
    
    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
        
    print("catalog.json atualizado com sucesso!")

if __name__ == "__main__":
    main()
