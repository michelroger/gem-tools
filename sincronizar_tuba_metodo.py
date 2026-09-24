import os
import re
import json
import xml.etree.ElementTree as ET

BASE_DIR = r"c:\Mega\gem-tools"
TUBA_DIR = os.path.join(BASE_DIR, "xml", "colecoes", "metodo-inclusivo-ccb", "do", "tuba")
CATALOG_PATH = os.path.join(BASE_DIR, "xml", "catalog.json")

def sanitize_filename(filename):
    name, ext = os.path.splitext(filename)
    # Remove sufixos como (1)
    name = re.sub(r'\s*\(\s*1\s*\)$', '', name)
    name = re.sub(r'\s+', ' ', name).strip()
    name = re.sub(r'\s+-\s+', ' - ', name)
    return f"{name}{ext}"

def main():
    print("Iniciando organização e catalogação da Tuba...")
    if not os.path.exists(TUBA_DIR):
        print(f"Diretório não existe: {TUBA_DIR}")
        return

    # 1. Renomear arquivos de posições para lições 161 a 167
    pos_map = {
        "1 Posição - TROMBONE e EUPHONIO.musicxml": "161 1ª Posição tuba.musicxml",
        "2 Posição - TROMBONE e EUPHONIO.musicxml": "162 2ª Posição tuba.musicxml",
        "3 Posição - TROMBONE e EUPHONIO.musicxml": "163 3ª Posição tuba.musicxml",
        "4 Posição - TROMBONE e EUPHONIO.musicxml": "164 4ª Posição tuba.musicxml",
        "5 Posição - TROMBONE e EUPHONIO.musicxml": "165 5ª Posição tuba.musicxml",
        "6 Posição - TROMBONE e EUPHONIO.musicxml": "166 6ª Posição tuba.musicxml",
        "7 Posição - TROMBONE e EUPHONIO.musicxml": "167 7ª Posição tuba.musicxml",
    }
    
    for old_pos, new_pos in pos_map.items():
        old_path = os.path.join(TUBA_DIR, old_pos)
        if os.path.exists(old_path):
            new_path = os.path.join(TUBA_DIR, new_pos)
            os.rename(old_path, new_path)
            print(f"Posição renomeada: '{old_pos}' -> '{new_pos}'")

    # 2. Renomear todos os arquivos para padronizar nomes (espaços, (1), etc.)
    all_files = os.listdir(TUBA_DIR)
    for fname in all_files:
        old_path = os.path.join(TUBA_DIR, fname)
        if not os.path.isfile(old_path):
            continue
        new_name = sanitize_filename(fname)
        if new_name != fname:
            new_path = os.path.join(TUBA_DIR, new_name)
            os.rename(old_path, new_path)
            print(f"Renomeado: '{fname}' -> '{new_name}'")

    # 3. Agrupar por número da lição
    files = sorted(os.listdir(TUBA_DIR))
    lessons = {}
    
    for fname in files:
        if not fname.lower().endswith(".musicxml") and not fname.lower().endswith(".xml"):
            continue
        
        m = re.match(r"^(\d+)\s*(.*)", fname)
        if not m:
            print(f"Aviso: arquivo fora do padrão de numeração: {fname}")
            continue
        
        num = int(m.group(1))
        
        if num not in lessons:
            lessons[num] = {
                "num": num,
                "files": []
            }
        lessons[num]["files"].append(fname)
    
    print(f"Total de lições encontradas: {len(lessons)}")
    if not lessons:
        print("Nenhuma lição encontrada para processar.")
        return

    # 4. Processar cada lição
    catalog_items = []
    
    for num in sorted(lessons.keys()):
        lesson_data = lessons[num]
        l_files = lesson_data["files"]
        
        s_file = None
        c_file = None
        t_file = None
        b_file = None
        sample_title = ""
        
        # Tratamento especial para as 7 posições
        if 161 <= num <= 167:
            pos_idx = num - 160
            sample_title = f"{pos_idx}ª Posição Tuba"
            s_file = f"xml/colecoes/metodo-inclusivo-ccb/do/tuba/{l_files[0]}"
        else:
            for f in l_files:
                full_fpath = os.path.join(TUBA_DIR, f)
                try:
                    tree = ET.parse(full_fpath)
                    root = tree.getroot()
                    wt = root.find(".//work-title")
                    if wt is not None and wt.text:
                        raw_title = wt.text.strip()
                        clean_wt = re.sub(r'^\d+[\s\.\-]+', '', raw_title).strip()
                        clean_wt = re.sub(r'\s*-\s*(Sop|Ctr|Ten|Bas|Bxo|Soprano|Contralto|Tenor|Baixo|P1|P2|Trombone)$', '', clean_wt, flags=re.I).strip()
                        clean_wt = re.sub(r'\s*\((Tuba|Tuba\s*\|\s*Tuba|Trombone\s*\|\s*Bar[ií]tono\s*\|\s*Tuba|Tuba\s*\|\s*Tuba\s*\|\s*Tuba)\)$', '', clean_wt, flags=re.I).strip()
                        if clean_wt and not sample_title:
                            sample_title = clean_wt
                except Exception:
                    pass
                
                if not sample_title:
                    m = re.match(r"^\d+\s+(.*?)(?:\s*-\s*(?:Sop|Ctr|Ten|Bas|Bxo|P1|P2|Trombone))?\.(?:musicxml|xml)$", f, flags=re.I)
                    if m:
                        sample_title = m.group(1).strip()
                
                f_rel = f"xml/colecoes/metodo-inclusivo-ccb/do/tuba/{f}"
                
                # Mapeamento de vozes:
                # - Bxo ou Bas -> b
                # - Ten -> t
                # - Ctr ou P2 -> c (ou se só tiver P1/P2)
                # - Sop ou P1 ou Trombone -> s
                if re.search(r'-\s*(Bxo|Bas)\b', f, flags=re.I):
                    b_file = f_rel
                elif re.search(r'-\s*Ten\b', f, flags=re.I):
                    t_file = f_rel
                elif re.search(r'-\s*(Ctr|P2)\b', f, flags=re.I):
                    c_file = f_rel
                elif re.search(r'-\s*(Sop|P1|Trombone)\b', f, flags=re.I):
                    s_file = f_rel
                else:
                    # Arquivo solo
                    s_file = f_rel
            
            # Se for duo e tiver apenas s e c (ex: P1 e P2 ou Trombone e P2), s e c estão setados.
            # Se tiver apenas s e b (ex: 146 Palavra gloriosa), s e b estão setados.
            # Se tiver trio (Sop, Ten, Bxo), s, t, b estão setados.
            # Se for solo sem marcação e não tiver s_file, usa o que tiver:
            if not s_file:
                s_file = b_file or t_file or c_file
                if s_file == b_file: b_file = None
                elif s_file == t_file: t_file = None
                elif s_file == c_file: c_file = None

        item = {
            "id": f"metodo-tuba-{num}",
            "numero": num,
            "titulo": sample_title or f"Lição {num}",
            "afinacao": "do",
            "compasso": "",
            "bpm": 0,
            "arquivosPorInstrumento": {
                "tuba": {
                    "s": s_file or "",
                    "c": c_file or "",
                    "t": t_file or "",
                    "b": b_file or ""
                }
            }
        }
        catalog_items.append(item)
    
    print(f"Itens prontos para o catálogo: {len(catalog_items)}")
    for it in catalog_items[:3]:
        print(f"  [{it['numero']}] {it['titulo']} -> {it['arquivosPorInstrumento']['tuba']}")
    for it in catalog_items[109:112]:
        print(f"  [{it['numero']}] {it['titulo']} -> {it['arquivosPorInstrumento']['tuba']}")
    for it in catalog_items[-8:]:
        print(f"  [{it['numero']}] {it['titulo']} -> {it['arquivosPorInstrumento']['tuba']}")

    # 5. Atualizar catalog.json
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog = json.load(f)
        
    metodo_col = None
    for col in catalog.get("colecoes", []):
        if col.get("id") == "metodo-inclusivo-ccb":
            metodo_col = col
            break
            
    if not metodo_col:
        print("Erro: Coleção metodo-inclusivo-ccb não encontrada no catalog.json!")
        return

    # Remover itens anteriores de tuba caso existam
    existing_items = metodo_col.get("items", [])
    filtered_items = [
        it for it in existing_items 
        if not (it.get("id", "").startswith("metodo-tuba-") or "tuba" in it.get("arquivosPorInstrumento", {}))
    ]
    
    print(f"Itens antes: {len(existing_items)}, mantidos de outros instrumentos: {len(filtered_items)}")
    
    metodo_col["items"] = filtered_items + catalog_items
    print(f"Total de itens na coleção agora: {len(metodo_col['items'])}")
    
    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
        
    print("catalog.json atualizado com sucesso!")

if __name__ == "__main__":
    main()
