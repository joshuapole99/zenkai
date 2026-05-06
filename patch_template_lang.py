"""
Patch template.html:
1. Replace 3 hardcoded Dutch section intros with LABELS template vars
2. Add f_risk_label + f.risk row between description and recommendation in finding card
"""

with open('/root/zenkai/template.html', 'r') as f:
    src = f.read()

# ── 1. DNS section intro ──────────────────────────────────────────────────────
old_dns = 'SPF bepaalt welke mailservers e-mails mogen versturen namens dit domein. DMARC voegt handhaving en rapportage toe tegen e-mail spoofing en phishing. CAA beperkt welke certificaatautoriteiten SSL-certificaten mogen uitgeven voor dit domein.'
new_dns = '{{ L.intro_dns }}'
src = src.replace(old_dns, new_dns)
print('[1] DNS intro:', 'ok' if '{{ L.intro_dns }}' in src else 'FAIL')

# ── 2. SSL/TLS section intro ─────────────────────────────────────────────────
old_ssl = 'TLS-versies ouder dan 1.2 zijn kwetsbaar: TLS 1.0 is vatbaar voor BEAST en POODLE, TLS 1.1 is deprecated per RFC 8996. Alleen TLS 1.2 en 1.3 voldoen aan de huidige standaard. Verouderde versies moeten uitgeschakeld worden via de webserverconfiguratie.'
new_ssl = '{{ L.intro_ssl }}'
src = src.replace(old_ssl, new_ssl)
print('[2] SSL intro:', 'ok' if '{{ L.intro_ssl }}' in src else 'FAIL')

# ── 3. Headers section intro ─────────────────────────────────────────────────
old_hdr = 'HTTP Security Headers instrueren de browser hoe content van dit domein behandeld moet worden. Ontbrekende headers verhogen het risico op clickjacking, XSS en MIME-sniffing aanvallen.'
new_hdr = '{{ L.intro_headers }}'
src = src.replace(old_hdr, new_hdr)
print('[3] Headers intro:', 'ok' if '{{ L.intro_headers }}' in src else 'FAIL')

# ── 4. Add risk row between description and recommendation in finding card ────
old_body = '''        <div class="f-body">
          <div>
            <div class="f-field-label">{{ L.f_description_label }}</div>
            <div class="f-field-value">{{ f.description }}</div>
          </div>
          <div>
            <div class="f-field-label">{{ L.f_rec_label }}</div>
            <div class="f-field-value">{{ f.recommendation }}</div>
          </div>
        </div>'''

new_body = '''        <div class="f-body">
          <div>
            <div class="f-field-label">{{ L.f_description_label }}</div>
            <div class="f-field-value">{{ f.description }}</div>
          </div>
          {% if f.risk %}
          <div>
            <div class="f-field-label">{{ L.f_risk_label }}</div>
            <div class="f-field-value">{{ f.risk }}</div>
          </div>
          {% endif %}
          <div>
            <div class="f-field-label">{{ L.f_rec_label }}</div>
            <div class="f-field-value">{{ f.recommendation }}</div>
          </div>
        </div>'''

if old_body in src:
    src = src.replace(old_body, new_body)
    print('[4] Risk row added: ok')
else:
    print('[4] Risk row: FAIL — f-body block not found')
    # debug: show what's around f_rec_label
    idx = src.find('f_rec_label')
    if idx != -1:
        print(repr(src[idx-300:idx+200]))

with open('/root/zenkai/template.html', 'w') as f:
    f.write(src)
print('template.html saved.')
