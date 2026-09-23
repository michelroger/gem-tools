import os
import re
import json
import xml.etree.ElementTree as ET

BASE_DIR = r"c:\Mega\gem-tools"
TROMPETE_DIR = os.path.join(BASE_DIR, "xml", "colecoes", "metodo-inclusivo-ccb", "sib", "trompete")
CATALOG_PATH = os.path.join(BASE_DIR, "xml", "catalog.json")

def sanitize_filename(filename):
    # Remove espaços duplos ou espaços antes de ponto/hífen
    name, ext = os.path.splitext(filename)
    name = re.sub(r'\s+', ' ', name).strip()
    name = re.sub(r'\s+-\s+', ' - ', name)
    return f"{name}{ext}"

def main():
    print("Iniciando organização e catalogação do Trompete...")
    
    # 1. Renomear arquivos para padronizar nomes
    all_files = os.listdir(TROMPETE_DIR)
    for fname in all_files:
        old_path = os.path.join(TROMPETE_DIR, fname)
        if not os.path.isfile(old_path):
            continue
        new_name = sanitize_filename(fname)
        if new_name != fname:
            new_path = os.path.join(TROMPETE_DIR, new_name)
            os.rename(old_path, new_path)
            print(f"Renomeado: '{fname}' -> '{new_name}'")

    # 2. Agrupar por número da lição
    files = sorted(os.listdir(TROMPETE_DIR))
    lessons = {}
    
    for fname in files:
        if not fname.lower().endswith(".musicxml") and not fname.lower().endswith(".xml"):
            continue
        
        m = re.match(r"^(\d+)\s*(.*)", fname)
        if not m:
            print(f"Aviso: arquivo fora do padrão de numeração: {fname}")
            continue
        
        num = int(m.group(1))
        rest = m.group(2)
        
        if num not in lessons:
            lessons[num] = {
                "num": num,
                "files": []
            }
        lessons[num]["files"].append(fname)
    
    print(f"Total de lições encontradas: {len(lessons)}")
    
    # 3. Processar cada lição
    catalog_items = []
    
    for num in sorted(lessons.keys()):
        lesson_data = lessons[num]
        l_files = lesson_data["files"]
        
        s_file = None
        c_file = None
        sample_title = ""
        
        for f in l_files:
            # Tentar ler o título de dentro do XML
            full_fpath = os.path.join(TROMPETE_DIR, f)
            try:
                tree = ET.parse(full_fpath)
                root = tree.getroot()
                wt = root.find(".//work-title")
                if wt is not None and wt.text:
                    raw_title = wt.text.strip()
                    # Limpar número inicial do título se houver
                    clean_wt = re.sub(r'^\d+[\s\.\-]+', '', raw_title).strip()
                    # Limpar sufixo de instrumento/voz do título se houver
                    clean_wt = re.sub(r'\s*-\s*(Sop|Ctr|Soprano|Contralto)$', '', clean_wt, flags=re.I).strip()
                    clean_wt = re.sub(r'\s*\((Trompete|Trompete\s*\|\s*Trompete)\)$', '', clean_wt, flags=re.I).strip()
                    if clean_wt and not sample_title:
                        sample_title = clean_wt
            except Exception as e:
                pass
            
            # Se não conseguiu do XML, extrair do nome do arquivo
            if not sample_title:
                m = re.match(r"^\d+\s+(.*?)(?:\s*-\s*(?:Sop|Ctr))?\.(?:musicxml|xml)$", f, flags=re.I)
                if m:
                    sample_title = m.group(1).strip()
            
            # Identificar voz Soprano / Contralto / Solo
            if re.search(r'-\s*Ctr\b', f, flags=re.I):
                c_file = f"xml/colecoes/metodo-inclusivo-ccb/sib/trompete/{f}"
            elif re.search(r'-\s*Sop\b', f, flags=re.I):
                s_file = f"xml/colecoes/metodo-inclusivo-ccb/sib/trompete/{f}"
            else:
                s_file = f"xml/colecoes/metodo-inclusivo-ccb/sib/trompete/{f}"
        
        if not s_file and c_file:
            s_file = c_file
            c_file = None
            
        item = {
            "id": f"metodo-trompete-{num}",
            "numero": num,
            "titulo": sample_title or f"Lição {num}",
            "afinacao": "sib",
            "compasso": "",
            "bpm": 0,
            "arquivosPorInstrumento": {
                "trompete": {
                    "s": s_file or "",
                    "c": c_file or "",
                    "t": "",
                    "b": ""
                }
            }
        }
        catalog_items.append(item)
    
    print(f"Itens prontos para o catálogo: {len(catalog_items)}")
    for it in catalog_items[:5]:
        print(f"  [{it['numero']}] {it['titulo']} -> s: {it['arquivosPorInstrumento']['trompete']['s']}")
    for it in catalog_items[112:116]:
        print(f"  [{it['numero']}] {it['titulo']} -> s: {it['arquivosPorInstrumento']['trompete']['s']}, c: {it['arquivosPorInstrumento']['trompete']['c']}")
    for it in catalog_items[-5:]:
        print(f"  [{it['numero']}] {it['titulo']} -> s: {it['arquivosPorInstrumento']['trompete']['s']}, c: {it['arquivosPorInstrumento']['trompete']['c']}")

    # 4. Atualizar catalog.json
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

    # Remover itens anteriores de trompete caso existam
    existing_items = metodo_col.get("items", [])
    filtered_items = [
        it for it in existing_items 
        if not (it.get("id", "").startswith("metodo-trompete-") or "trompete" in it.get("arquivosPorInstrumento", {}))
    ]
    
    print(f"Itens antes: {len(existing_items)}, mantidos de outros instrumentos: {len(filtered_items)}")
    
    # Adicionar novos itens de trompete
    metodo_col["items"] = filtered_items + catalog_items
    print(f"Total de itens na coleção agora: {len(metodo_col['items'])}")
    
    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
        
    print("catalog.json atualizado com sucesso!")

if __name__ == "__main__":
    main()
