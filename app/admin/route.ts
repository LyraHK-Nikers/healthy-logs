import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAuthed, isAdminConfigured } from "@/lib/admin";

/**
 * /admin — served as a route handler (not a page) so it bypasses the root
 * layout's "coming soon" gate and is reachable even while the site is hidden.
 * Self-contained HTML + inline JS; talks to /api/admin/login and /api/admin/import.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATEGORIES = [
  "vitamins",
  "minerals",
  "protein",
  "gut-health",
  "weight-management",
  "sports-nutrition",
  "general-nutrition",
];

function html(body: string): Response {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Admin · Healthy Logs</title>
<style>
:root{--bg:#FBFBF9;--surface:#fff;--ink:#1C2520;--soft:#4A554E;--line:#E4E6E1;--accent:#2F6B4F}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.5}
.wrap{max-width:680px;margin:0 auto;padding:40px 20px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:24px}
h1{font-size:22px;margin:0 0 4px}
.muted{color:var(--soft);font-size:14px}
label{display:block;font-size:13px;font-weight:600;margin:14px 0 4px}
input,select,textarea{width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font:inherit;background:#fff}
textarea{min-height:80px}
.row{display:flex;gap:12px}.row>div{flex:1}
.check{display:flex;align-items:center;gap:8px;margin-top:14px}.check input{width:auto}
button{margin-top:18px;background:var(--accent);color:#fff;border:0;border-radius:8px;padding:11px 18px;font:inherit;font-weight:600;cursor:pointer}
button:disabled{opacity:.6;cursor:default}
.out{margin-top:16px;padding:12px;border-radius:8px;font-size:14px;white-space:pre-wrap;word-break:break-word}
.ok{background:#EAF2EC;color:#1C2520}.err{background:#fbeaea;color:#7a1f1f}
a{color:var(--accent)}
.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
pre{background:#f3f3f1;padding:12px;border-radius:8px;overflow:auto;font-size:12px}
</style></head><body><div class="wrap">${body}</div></body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

function loginView(notConfigured: boolean): string {
  if (notConfigured) {
    return `<div class="card"><h1>Admin not configured</h1>
<p class="muted">Set <code>ADMIN_PASSWORD</code> (and <code>GITHUB_TOKEN</code>, <code>GITHUB_REPO</code>) in your host's environment variables, then redeploy.</p></div>`;
  }
  return `<div class="card">
<h1>Admin login</h1>
<p class="muted">Enter the admin password to publish articles.</p>
<label for="pw">Password</label>
<input id="pw" type="password" autofocus>
<button id="go">Log in</button>
<div id="out"></div>
</div>
<script>
var go=document.getElementById('go'),pw=document.getElementById('pw'),out=document.getElementById('out');
function login(){go.disabled=true;out.textContent='';
 fetch('/api/admin/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({password:pw.value})})
 .then(function(r){return r.json().then(function(d){return {ok:r.ok,d:d}})})
 .then(function(x){if(x.ok){location.reload()}else{out.className='out err';out.textContent=(x.d&&x.d.error)||'Login failed';go.disabled=false}})
 .catch(function(){out.className='out err';out.textContent='Network error';go.disabled=false});}
go.onclick=login;pw.addEventListener('keydown',function(e){if(e.key==='Enter')login()});
</script>`;
}

function uploadView(): string {
  const cats = CATEGORIES.map((c) => `<option value="${c}">${c}</option>`).join("");
  return `<div class="top"><h1>Publish an article</h1><a href="#" id="logout">Log out</a></div>
<div class="card">
<p class="muted">Upload a Word (.docx) or Markdown/text (.md, .txt) file. The title comes from the file's first heading unless you set one below. Publishing commits the article to GitHub and the site redeploys automatically.</p>
<label for="file">Article file (.docx, .md, .txt)</label>
<input id="file" type="file" accept=".docx,.md,.markdown,.txt">
<label for="title">Title (optional — overrides the file heading)</label>
<input id="title" type="text" placeholder="e.g. Magnesium for Athletes">
<div class="row">
<div><label for="category">Category</label><select id="category">${cats}</select></div>
<div><label for="type">Type</label><select id="type"><option value="informational">informational</option><option value="commercial">commercial</option></select></div>
</div>
<div class="row">
<div><label for="author">Author slug</label><input id="author" type="text" value="jane-doe"></div>
<div><label for="reviewer">Reviewer slug (optional)</label><input id="reviewer" type="text" placeholder="dr-smith-rd"></div>
</div>
<label for="excerpt">Excerpt (optional — auto from first paragraph if blank)</label>
<textarea id="excerpt" placeholder="One-sentence summary"></textarea>
<label for="tags">Tags (comma separated)</label>
<input id="tags" type="text" placeholder="magnesium, sleep">
<div class="check"><input id="featured" type="checkbox" checked><label for="featured" style="margin:0">Feature on the homepage</label></div>
<button id="pub">Publish article</button>
<div id="out"></div>
</div>
<script>
var pub=document.getElementById('pub'),out=document.getElementById('out');
document.getElementById('logout').onclick=function(e){e.preventDefault();fetch('/api/admin/login',{method:'DELETE'}).then(function(){location.reload()})};
function val(id){return document.getElementById(id).value.trim()}
pub.onclick=function(){
 var f=document.getElementById('file').files[0];
 if(!f){out.className='out err';out.textContent='Please choose a file.';return}
 pub.disabled=true;out.className='out';out.textContent='Publishing…';
 var fd=new FormData();
 fd.append('file',f);
 fd.append('title',val('title'));
 fd.append('category',val('category'));
 fd.append('type',val('type'));
 fd.append('author',val('author'));
 fd.append('reviewer',val('reviewer'));
 fd.append('excerpt',val('excerpt'));
 fd.append('tags',val('tags'));
 fd.append('featured',document.getElementById('featured').checked?'true':'false');
 fetch('/api/admin/import',{method:'POST',body:fd})
 .then(function(r){return r.json().then(function(d){return{ok:r.ok,d:d}})})
 .then(function(x){pub.disabled=false;var d=x.d||{};
  if(!x.ok){out.className='out err';out.textContent=(d.error||'Failed');return}
  if(d.committed){out.className='out ok';out.innerHTML='Published <b>'+d.slug+'</b>. The site will redeploy shortly.'+(d.url?' <a href="'+d.url+'" target="_blank" rel="noopener">View on GitHub</a>':'')}
  else{out.className='out ok';out.innerHTML='Preview (no GitHub token set, nothing published):<pre>'+(d.preview||'').replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})+'</pre>'}
 })
 .catch(function(){pub.disabled=false;out.className='out err';out.textContent='Network error'});
};
</script>`;
}

export async function GET() {
  if (!isAdminConfigured()) return html(loginView(true));
  const authed = isAuthed(cookies().get(ADMIN_COOKIE)?.value);
  return html(authed ? uploadView() : loginView(false));
}
