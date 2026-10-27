#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para conversão estática de lições do MSA (Clave de Sol)
para Clave de Fá (4ª linha) e Clave de Dó (3ª linha - Viola).

Gera arquivos .musicxml dedicados e atualiza o catalogo-msa.json.
"""

import os
import re
import json
import xml.etree.ElementTree as ET

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CATALOG_PATH = os.path.join(BASE_DIR, "xml", "colecoes", "msa", "catalogo-msa.json")

def convert_musicxml(src_path, dst_path, clef_sign, clef_line, oct_shift=0):
    """Lê um MusicXML em Clave de Sol e gera a versão na clave indicada."""
    tree = ET.parse(src_path)
    root = tree.getroot()

    # 1. Atualizar todas as claves encontradas
    for clef in root.findall('.//clef'):
        s = clef.find('sign')
        l = clef.find('line')
        if s is not None:
            s.text = clef_sign
        if l is not None:
            l.text = str(clef_line)

    # 2. Ajustar notas
    for note in root.findall('.//note'):
        pitch = note.find('pitch')
        if pitch is not None and oct_shift != 0:
            octave = pitch.find('octave')
            if octave is not None and octave.text:
                try:
                    octave.text = str(int(octave.text) + oct_shift)
                except ValueError:
                    pass

        # Remover coordenadas verticais fixadas para a Clave de Sol original
        if 'default-y' in note.attrib:
            del note.attrib['default-y']

        # Remover direções de haste forçadas para que o OSMD renderize
        # as hastes corretamente com base nas novas linhas da clave
        stem = note.find('stem')
        if stem is not None:
            note.remove(stem)

    # Salva com declaração XML e utf-8
    tree.write(dst_path, encoding='utf-8', xml_declaration=True)

def main():
    if not os.path.exists(CATALOG_PATH):
        print(f"Erro: Arquivo do catálogo não encontrado: {CATALOG_PATH}")
        return

    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    exercicios = catalog.get("exercicios", [])
    print(f"Total de exercícios no catálogo: {len(exercicios)}")

    convertidos = 0
    total_com_altura = 0

    for ex in exercicios:
        tem_altura = ex.get("temNotasComAltura", False)
        arquivo_rel = ex.get("arquivo", "")

        if not tem_altura or not arquivo_rel:
            continue

        total_com_altura += 1
        src_path = os.path.join(BASE_DIR, arquivo_rel.replace("/", os.sep))

        if not os.path.exists(src_path):
            print(f"Aviso: Arquivo fonte não encontrado: {src_path}")
            continue

        base_no_ext = re.sub(r'\.musicxml$', '', arquivo_rel, flags=re.IGNORECASE)
        fa_rel = f"{base_no_ext}_fa.musicxml"
        do_rel = f"{base_no_ext}_do.musicxml"

        dst_fa = os.path.join(BASE_DIR, fa_rel.replace("/", os.sep))
        dst_do = os.path.join(BASE_DIR, do_rel.replace("/", os.sep))

        try:
            # Clave de Fá (4ª linha) com transposição de -1 oitava para tessitura de leitura grave
            convert_musicxml(src_path, dst_fa, clef_sign='F', clef_line=4, oct_shift=-1)

            # Clave de Dó (3ª linha - Viola) em altura real de concerto (Dó central C4 na 3ª linha)
            convert_musicxml(src_path, dst_do, clef_sign='C', clef_line=3, oct_shift=0)

            # Registrar caminhos no catálogo
            ex["arquivos"] = {
                "sol": arquivo_rel,
                "do": do_rel,
                "fa": fa_rel
            }
            ex["claves"] = ["G", "C", "F"]

            convertidos += 1
        except Exception as e:
            print(f"Erro ao converter {src_path}: {e}")

    # Salvar catálogo atualizado com formatação limpa
    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

    print(f"\nConversão concluída com sucesso!")
    print(f"Exercícios com altura melódica encontrados: {total_com_altura}")
    print(f"Exercícios convertidos para Clave de Fá e Dó: {convertidos}")
    print(f"Catálogo atualizado: {CATALOG_PATH}")

if __name__ == "__main__":
    main()
