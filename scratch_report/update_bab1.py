with open("scratch_report/build_security_update_pdf.py", "r") as f:
    text = f.read()

# Replace Bab I explanation with the comprehensive breakthrough
old_bab1 = """    story.append(Paragraph(
        "Pada tanggal 30 Oktober 2026, beredar sebuah infografis digital di kalangan anggota yang menampilkan tajuk <i>'QUICK COUNT PEMILIHAN IAGI - Hasil Sementara Data hingga 29 Oktober 2026, 18:26 WIB'</i> dengan klaim perolehan 688 suara yang membagi persentase ketiga calon. Tim IT KPKU segera melakukan audit forensik stempel waktu (timestamp audit) langsung pada brankas database server <code>pemiluiagi.web.id</code>.",
        body_style
    ))"""

new_bab1 = """    story.append(Paragraph(
        "Pada tanggal 30 Oktober 2026, beredar sebuah infografis digital di kalangan anggota yang menampilkan tajuk <i>'QUICK COUNT PEMILIHAN IAGI - Hasil Sementara Data hingga 29 Oktober 2026, 18:26 WIB'</i> dengan klaim 688 suara yang membagi persentase ketiga calon. Tim IT KPKU segera melakukan audit forensik stempel waktu dan logika enkripsi pada server <code>pemiluiagi.web.id</code>.",
        body_style
    ))"""

text = text.replace(old_bab1, new_bab1)

old_table_text = """    story.append(Paragraph(
        "<b>Temuan Forensik Kunci:</b> Pada detik ke 29 Oktober 2026 pukul 18:26 WIB, surat suara ke-688 <b>BELUM PERNAH ADA</b> di dalam sistem. Surat suara ke-687 masuk pada pukul 17:57:29 WIB, dan suara berikutnya baru masuk jauh setelah waktu tersebut. Perbedaan angka ini menjadi bukti absolut bahwa infografis tersebut adalah <b>rekayasa grafis fiktif (hoaks)</b> yang dibuat secara spekulatif.",
        body_style
    ))"""

new_table_text = """    story.append(Paragraph(
        "<b>Penjelasan Forensik Ilmiah (Mengapa Angka Total Tertulis 688?):</b><br/>"
        "1. <b>Angka 688 Adalah Angka Partisipasi / Kuorum Terbuka:</b> Berdasarkan log audit, surat suara ke-688 masuk tepat pada <b>29 Oktober 2026 pukul 18:26:44 WIB</b> (11:26:44 UTC). Pada detik tersebut, counter publik <code>total_votes</code> di dashboard KPKU bertambah menjadi 688. Angka kuorum kehadiran ini memang <b>transparan dan dapat dipantau umum</b> (terbukti di selebaran tertulis: <i>'+12 suara dari update sebelumnya 676'</i>).<br/>"
        "2. <b>Persentase Paslon (56,4% vs 25,3% vs 18,3%) Adalah 100% Karangan Fiktif:</b> Selama masa pemilihan, brankas server berstatus <b>TERSEGEL (is_sealed: true)</b> yang secara absolut mengunci rincian calon menjadi <code>{1:0, 2:0, 3:0}</code>. Pembuat selebaran hanya menunggangi angka total kehadiran publik (688), lalu <b>membagi-bagi sendiri angka 688 tersebut ke 3 calon</b> secara spekulatif untuk menggiring opini.",
        body_style
    ))"""

text = text.replace(old_table_text, new_table_text)

# Also update side table captions
old_captions = """                Paragraph("<b>Fakta Server:</b> Surat suara ke-687 masuk pukul 17:57:29 WIB. Pada 18:26:00 WIB suara ke-688 belum ada. Total akumulasi saat ini 764 suara sah.", caption_style),
                Paragraph("<b>Fakta Pemalsuan:</b> Angka 688 ditebak spekulatif tanpa akses ke brankas database asli KPKU yang berstatus tersegel kriptografis.", caption_style)"""

new_captions = """                Paragraph("<b>Data Asli Server KPKU:</b> Suara ke-688 masuk tepat pukul 18:26:44 WIB (counter kuorum terbuka: 688). Namun rincian calon TERKUNCI RAPAT (counts: 0, 0, 0). Total saat ini 764 suara sah.", caption_style),
                Paragraph("<b>Rekayasa Selebaran Hoaks:</b> Pembuat flyer melihat angka kuorum 688 di monitor, lalu MENGARANG SENDIRI persentase ketiga paslon (388, 174, 126) untuk framing opini.", caption_style)"""

text = text.replace(old_captions, new_captions)

with open("scratch_report/build_security_update_pdf.py", "w") as f:
    f.write(text)

print("Berhasil update narasi forensik Bab I!")
