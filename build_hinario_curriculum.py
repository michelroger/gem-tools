# -*- coding: utf-8 -*-
"""Gera hinario5-curriculum.json a partir de pdf_sample.txt + grupos por tonalidade (ficha Dó)."""
import json
import re
from collections import OrderedDict


def extract_flat_curriculum_from_pdf_sample(path: str = "pdf_sample.txt") -> dict:
    """Extrai listas planas por afinação (ordem do PDF), fatiadas nas 4 fases."""
    with open(path, "rb") as bf:
        raw = bf.read()
    enc = "utf-16" if raw[:2] in (b"\xff\xfe", b"\xfe\xff") else "utf-8"
    text = raw.decode(enc, errors="ignore")
    parts = text.split("=== FILE ===")[1:]
    labels = ["do", "mib", "sib"]
    titles = [
        "1ª FASE: ENSAIOS (100 hinos + 3 coros)",
        "2ª FASE: RJM (50 hinos)",
        "3ª FASE: CULTOS OFICIAIS (200 hinos + 3 coros)",
        "4ª FASE: OFICIALIZAÇÃO (130 hinos)",
    ]
    coro_f1 = [
        {"id": "coro-5", "label": "Coro 5"},
        {"id": "coro-3", "label": "Coro 3"},
        {"id": "coro-2", "label": "Coro 2"},
    ]
    coro_f3 = [
        {"id": "coro-1", "label": "Coro 1"},
        {"id": "coro-3", "label": "Coro 3"},
        {"id": "coro-4", "label": "Coro 4"},
    ]
    out = {}
    for i, lab in enumerate(labels):
        block = parts[i] if i < len(parts) else parts[-1]
        if "--- page 1 ---" in block:
            block = block.split("--- page 1 ---", 1)[1]
        nums = []
        seen = set()
        for m in re.finditer(r"\b(\d{1,3})\b", block[:25000]):
            n = int(m.group(1))
            if 1 <= n <= 480 and n not in seen:
                seen.add(n)
                nums.append(n)
        miss = sorted(set(range(1, 481)) - seen)
        nums.extend(miss)
        f1, f2, f3, f4 = nums[0:100], nums[100:150], nums[150:350], nums[350:480]
        phases = []
        for fi, hslice in enumerate([f1, f2, f3, f4]):
            coros = coro_f1 if fi == 0 else coro_f3 if fi == 2 else []
            phases.append({"titulo": titles[fi], "hinos": hslice, "coros": coros})
        out[lab] = phases
    return out

# Classificação conforme ficha HINÁRIO 5 Afinação Dó (agrupamentos por tonalidade).
# Coros da 1ª fase na ficha física ficam em Sol (2, 6) e Sib (5); Coro 3 em outro bloco.
F1_TONS: OrderedDict[str, set] = OrderedDict(
    [
        ("Dó Maior", {158, 388, 172, 28, 81, 220, 351, 333, 45, 103, 201, 71, 224, 358}),
        ("Fá Maior", {20, 39, 412, 428, 235, 284, 104, 208, 383, 44, 399}),
        ("Sol Maior", {96, 131, 230, 25, 66, 106, 184, 256}),
        ("Sib Maior", {153, 292, 299, 258, 266, 310, 332, 77, 249, 393, 8, 114, 132, 165, 128}),
        ("Ré Maior", {312, 385, 58, 248, 262, 418, 202, 226, 68, 229}),
        ("Mib Maior", {2, 119, 144, 164, 314, 400, 416, 1, 34, 38, 221, 276, 371, 27, 260, 213, 293, 160}),
        ("Lá Maior", {242, 22}),
        ("Láb Maior", {62, 365, 373, 391, 5, 189, 423, 80, 85, 75, 321, 32, 72, 218, 4}),
        ("Réb Maior", {194, 69, 387, 204, 340, 361}),
        ("Mi Maior", {289}),
    ]
)

F2_TONS: OrderedDict[str, set] = OrderedDict(
    [
        ("Dó Maior", {461, 434, 471, 472, 431, 457, 459}),
        ("Sol Maior", {437, 454, 466, 446}),
        ("Fá Maior", {468, 460, 453, 440}),
        ("Ré Maior", {441, 470, 444, 436}),
        ("Sib Maior", {445, 443, 476, 477, 433, 479, 439, 480, 448, 451, 474, 465}),
        ("Mib Maior", {456, 458, 447, 467, 478, 435, 475, 464, 438, 473, 462}),
        ("Láb Maior", {432, 449, 450, 463, 452, 469, 442}),
        ("Réb Maior", {455}),
    ]
)

# 3ª e 4ª fases — ficha Afinação Dó (grupos conforme impresso CCB). F4: Mi Maior só 429 (289 já está na 1ª fase).
F3_TONS: OrderedDict[str, set] = OrderedDict(
    [
        ("Dó Maior", {264, 302, 324, 386, 55, 364, 390, 403, 375, 155, 282, 52, 116, 73, 175, 211, 348, 342, 303, 94, 130, 343, 415, 6}),
        ("Fá Maior", {49, 135, 424, 239, 357, 402, 125, 430, 241, 244, 261, 268, 133, 64, 254, 14, 30, 47, 60, 326, 197}),
        (
            "Sol Maior",
            {
                207,
                17,
                101,
                115,
                271,
                363,
                406,
                295,
                410,
                419,
                278,
                137,
                329,
                78,
                269,
                23,
                99,
                283,
                409,
                3,
                297,
                325,
                231,
                288,
                306,
                227,
                253,
                162,
                277,
                108,
                139,
                159,
                228,
                232,
                319,
                368,
                287,
                315,
                16,
                9,
            },
        ),
        ("Sib Maior", {323, 272, 15, 123, 129, 190, 298, 328, 378, 63, 10, 89, 100, 168, 178, 222, 338, 109, 316, 51, 196, 93, 255, 320, 337, 396}),
        ("Ré Maior", {234, 414, 300, 336, 31, 146, 250, 286, 367, 341, 417, 127, 263, 187, 143, 198}),
        ("Mib Maior", {252, 84, 376, 411, 92, 236, 360, 112, 369, 134, 176, 274, 179, 102, 355, 370, 395, 121, 183, 83, 86, 79, 280, 87, 12, 111, 210, 212, 225, 427, 35, 193, 48, 56, 113, 349, 374, 7}),
        ("Lá Maior", {200, 285}),
        (
            "Láb Maior",
            {195, 347, 317, 290, 397, 97, 169, 147, 273, 151, 161, 305, 246, 26, 82, 330, 392, 191, 192, 240, 148, 90, 13, 40, 362, 98, 344, 346, 308, 247},
        ),
        ("Réb Maior", {216, 238, 67, 65}),
    ]
)

F4_TONS: OrderedDict[str, set] = OrderedDict(
    [
        ("Dó Maior", {170, 233, 401, 50, 215, 76, 322, 372, 33, 313}),
        ("Fá Maior", {59, 281, 345, 366, 413, 107, 54, 140, 223, 142, 42, 257}),
        ("Sol Maior", {18, 180, 214, 251, 352, 354, 407, 420, 166, 36, 124, 353, 70, 149, 291, 327, 334, 199, 185, 209, 88, 243, 259, 245, 24}),
        ("Sib Maior", {11, 182, 382, 219, 173, 267, 296, 318, 265, 389, 105, 398}),
        ("Ré Maior", {380, 37, 384, 74, 350, 356, 359, 203, 394, 136}),
        (
            "Mib Maior",
            {61, 163, 421, 156, 301, 120, 141, 154, 167, 186, 304, 307, 335, 21, 422, 294, 43, 110, 181, 270, 426, 206, 53, 177, 237},
        ),
        ("Lá Maior", {138, 188, 41, 275}),
        (
            "Láb Maior",
            {122, 150, 152, 309, 408, 29, 126, 157, 279, 311, 379, 405, 46, 117, 339, 19, 171, 174, 331, 377, 404, 205, 95},
        ),
        ("Mi Maior", {429}),
        ("Réb Maior", {118, 145, 425, 91, 57, 217, 381}),
    ]
)

CORO_BY_ID = {
    "coro-1": "Coro 1",
    "coro-2": "Coro 2",
    "coro-3": "Coro 3",
    "coro-4": "Coro 4",
    "coro-5": "Coro 5",
    "coro-6": "Coro 6",
}


def classify_hino(n: int, ton_map: OrderedDict[str, set]) -> str:
    for nome, s in ton_map.items():
        if n in s:
            return nome
    return "Outras"


def sort_hinos_nums(nums: list[int]) -> list[int]:
    return sorted(nums)


def flatten_ordered(ton_map: OrderedDict[str, set]) -> list[int]:
    """Lista de hinos na ordem da ficha: grupos na ordem do mapa, números crescentes em cada grupo."""
    out: list[int] = []
    for _nome, s in ton_map.items():
        out.extend(sorted(s))
    return out


def phase_to_grupos(
    phase: dict,
    ton_map: OrderedDict[str, set] | None,
    coro_placement: dict[str, str],
) -> dict:
    """coro_placement: coro_id -> tonalidade grupo (ex. coro-5 -> Sib Maior)"""
    hinos = list(phase.get("hinos") or [])
    coros = phase.get("coros") or []
    out_grupos: OrderedDict[str, list] = OrderedDict()

    def ensure_g(name: str):
        if name not in out_grupos:
            out_grupos[name] = []

    if ton_map:
        buckets: dict[str, list[int]] = {nome: [] for nome in ton_map.keys()}
        buckets["Outras"] = []
        for n in hinos:
            g = classify_hino(n, ton_map)
            buckets.setdefault(g, []).append(n)
        ordered = list(ton_map.keys())
        if buckets.get("Outras"):
            ordered.append("Outras")
        for nome in ordered:
            lst = buckets.get(nome) or []
            for n in sort_hinos_nums(lst):
                ensure_g(nome)
                out_grupos[nome].append({"t": "hino", "n": n})
    else:
        ensure_g("Geral")
        for n in sort_hinos_nums(hinos):
            out_grupos["Geral"].append({"t": "hino", "n": n})

    for c in coros:
        cid = c["id"]
        label = c.get("label") or CORO_BY_ID.get(cid, cid)
        gname = coro_placement.get(cid) or "Coros"
        ensure_g(gname)
        out_grupos[gname].append({"t": "coro", "id": cid, "label": label})

    grupos_list = []
    for nome, itens in out_grupos.items():
        if not itens:
            continue
        grupos_list.append({"tonalidade": nome, "itens": itens})

    return {"titulo": phase["titulo"], "grupos": grupos_list}


def main():
    cur = extract_flat_curriculum_from_pdf_sample()

    # Coros 1ª fase Dó (ficha): 5 e 3 em Sib; 2 em Sol.
    f1_coro_place = {"coro-5": "Sib Maior", "coro-3": "Sib Maior", "coro-2": "Sol Maior"}
    # 3ª fase: Coro 3 em Sol; Coro 1 em Lá; Coro 4 em Láb.
    f3_coro_place = {"coro-3": "Sol Maior", "coro-1": "Lá Maior", "coro-4": "Láb Maior"}

    out_all = {}
    for afin in ("do", "mib", "sib"):
        phases = cur[afin]
        new_phases = []
        for idx, ph in enumerate(phases):
            if afin == "do":
                if idx == 0:
                    ph0 = dict(ph)
                    ph0["hinos"] = flatten_ordered(F1_TONS)
                    new_phases.append(phase_to_grupos(ph0, F1_TONS, f1_coro_place))
                elif idx == 1:
                    ph1 = dict(ph)
                    ph1["hinos"] = flatten_ordered(F2_TONS)
                    new_phases.append(phase_to_grupos(ph1, F2_TONS, {}))
                elif idx == 2:
                    ph2 = dict(ph)
                    ph2["hinos"] = flatten_ordered(F3_TONS)
                    new_phases.append(phase_to_grupos(ph2, F3_TONS, f3_coro_place))
                else:
                    ph3 = dict(ph)
                    ph3["hinos"] = flatten_ordered(F4_TONS)
                    new_phases.append(phase_to_grupos(ph3, F4_TONS, {}))
            else:
                # Mib/Sib: ordenação por número; um grupo "Geral" (tonalidades na ficha própria).
                cp = {}
                for c in ph.get("coros") or []:
                    cp[c["id"]] = "Geral"
                new_phases.append(phase_to_grupos(ph, None, cp))
        out_all[afin] = new_phases

    with open("hinario5-curriculum.json", "w", encoding="utf-8") as f:
        json.dump(out_all, f, ensure_ascii=False, separators=(",", ":"))

    print("OK", {k: len(v) for k, v in out_all.items()})


if __name__ == "__main__":
    main()
