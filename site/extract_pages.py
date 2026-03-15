import fitz  # PyMuPDF
import os

pdf_path = r"E:\Inflight\UN260207_Inflight Guide OGS42.pdf"
output_dir = r"E:\Inflight\site\public\assets"

# Mapeamento: (Página no PDF - 1, Nome do Ficheiro)
# Nota: fitz usa indexação baseada em 0 (página 10 no PDF é índice 9)
pages_to_extract = [
    (9, "briefing-guide.png"),
    (11, "mission-folder-1.png"),
    (12, "mission-folder-2.png"),
    (13, "mission-folder-3.png"),
    (14, "mission-folder-4.png"),
    (15, "wind-chart.png"),
    (34, "stc-range.png"),
    (35, "aerodrome-lpot.png"),
    (36, "aerodrome-lpmi.png"),
    (37, "aerodrome-lpbj.png")
]

def extract():
    if not os.path.exists(pdf_path):
        print(f"Erro: PDF não encontrado em {pdf_path}")
        return

    doc = fitz.open(pdf_path)
    
    for page_index, file_name in pages_to_extract:
        print(f"A extrair página {page_index + 1} para {file_name}...")
        page = doc.load_page(page_index)
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # Alta resolução (2x)
        pix.save(os.path.join(output_dir, file_name))
    
    doc.close()
    print("\nConcluído! As imagens já devem aparecer no site.")

if __name__ == "__main__":
    extract()
