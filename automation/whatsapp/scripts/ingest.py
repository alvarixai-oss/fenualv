"""Build knowledge from committed website pages, never from arbitrary customer URLs."""
from pathlib import Path
from html.parser import HTMLParser
import json
root=Path(__file__).resolve().parents[3]/'public_html'
class Text(HTMLParser):
    def __init__(self):
        super().__init__(); self.skip=0; self.parts=[]
    def handle_starttag(self,tag,attrs):
        if tag in ('script','style','nav','footer','header'): self.skip+=1
    def handle_endtag(self,tag):
        if tag in ('script','style','nav','footer','header'): self.skip=max(0,self.skip-1)
    def handle_data(self,data):
        if not self.skip and data.strip(): self.parts.append(data.strip())
pages=[]
for p in sorted(root.rglob('*.html')):
    rel=str(p.relative_to(root))
    # Editorial/demo content must not become commercial promises.
    if rel.startswith('blog/') or rel=='404.html': continue
    parser=Text(); parser.feed(p.read_text())
    pages.append({'path':rel,'url':'https://fenualv.com/'+rel.replace('index.html',''),'text':' '.join(parser.parts)})
out=Path(__file__).resolve().parents[1]/'lib/pages.json'
out.write_text(json.dumps(pages,ensure_ascii=False,indent=2)+'\n')
print(f'{len(pages)} website pages indexed')
