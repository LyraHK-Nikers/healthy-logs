import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  isAuthed,
  isAdminConfigured,
  ghConfigured,
} from "@/lib/admin";
import { getAllArticles, getArticleBySlug } from "@/lib/content";
import { categories } from "@/config/categories";

/**
 * /admin — route handler (not a page) so it bypasses the "coming soon" gate.
 * Self-contained HTML + inline JS. Talks to /api/admin/login and /api/admin/import.
 * Supports create (file upload or pasted markdown), hero image, and edit mode.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function esc(s: string): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

function page(body: string): Response {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Admin · Healthy Logs</title>
<style>
:root{--bg:#FBFBF9;--surface:#fff;--ink:#1C2520;--soft:#4A554E;--line:#E4E6E1;--accent:#2F6B4F}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.5}
.wrap{max-width:720px;margin:0 auto;padding:36px 20px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:24px;margin-bottom:18px}
h1{font-size:22px;margin:0 0 4px}h2{font-size:16px;margin:0 0 10px}
.muted{color:var(--soft);font-size:14px}
label{display:block;font-size:13px;font-weight:600;margin:14px 0 4px}
input,select,textarea{width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font:inherit;background:#fff}
textarea{min-height:90px}#body{min-height:200px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px}
.row{display:flex;gap:12px;flex-wrap:wrap}.row>div{flex:1;min-width:180px}
.check{display:flex;align-items:center;gap:8px;margin-top:14px}.check input{width:auto}
button{margin-top:18px;background:var(--accent);color:#fff;border:0;border-radius:8px;padding:11px 18px;font:inherit;font-weight:600;cursor:pointer}
button:disabled{opacity:.6;cursor:default}
.out{margin-top:16px;padding:12px;border-radius:8px;font-size:14px;white-space:pre-wrap;word-break:break-word}
.ok{background:#EAF2EC}.err{background:#fbeaea;color:#7a1f1f}
a{color:var(--accent)}
.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.list{list-style:none;margin:0;padding:0}
.list li{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);font-size:14px}
.list li:last-child{border:0}
pre{background:#f3f3f1;padding:12px;border-radius:8px;overflow:auto;font-size:12px}
.pill{font-size:11px;color:var(--accent);background:#EAF2EC;border-radius:999px;padding:2px 8px}
.btn2{background:#fff;color:var(--accent);border:1px solid var(--accent)}
.pvcard{border:1px solid var(--line);border-radius:10px;padding:22px;margin-top:16px;background:#fff;max-width:680px}
.eyebrow{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--accent)}
.pvtitle{font-size:24px;margin:6px 0}
.pvbody{color:var(--ink)}
.pvbody h2{font-size:19px;margin:20px 0 6px}.pvbody h3{font-size:16px;margin:16px 0 4px}
.pvbody p{margin:10px 0}.pvbody ul,.pvbody ol{padding-left:22px;margin:10px 0}
.pvbody a{color:var(--accent)}.pvbody img{max-width:100%;border-radius:8px}
.pvhero{width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:14px}
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
<p class="muted">Enter your admin username and password to manage articles.</p>
<label for="user">Username</label>
<input id="user" type="text" autocomplete="username" autofocus>
<label for="pw">Password</label>
<input id="pw" type="password" autocomplete="current-password">
<button id="go">Log in</button>
<div id="out"></div>
</div>
<script>
var go=document.getElementById('go'),user=document.getElementById('user'),pw=document.getElementById('pw'),out=document.getElementById('out');
function login(){go.disabled=true;out.textContent='';
 fetch('/api/admin/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username:user.value,password:pw.value})})
 .then(function(r){return r.json().then(function(d){return {ok:r.ok,d:d}})})
 .then(function(x){if(x.ok){location.reload()}else{out.className='out err';out.textContent=(x.d&&x.d.error)||'Login failed';go.disabled=false}})
 .catch(function(){out.className='out err';out.textContent='Network error';go.disabled=false});}
go.onclick=login;pw.addEventListener('keydown',function(e){if(e.key==='Enter')login()});
</script>`;
}

type Editing = {
  slug: string;
  title: string;
  category: string;
  type: string;
  author: string;
  reviewer: string;
  excerpt: string;
  tags: string;
  featured: boolean;
  heroImage: string;
  heroAlt: string;
  body: string;
};

function listView(): string {
  const items = getAllArticles()
    .map((a) => {
      const fm = a.frontmatter;
      return `<li><span>${esc(fm.title)} <span class="pill">${esc(fm.category)}</span></span><a href="/admin?edit=${encodeURIComponent(fm.slug)}">Edit</a></li>`;
    })
    .join("");
  return `<div class="card"><h2>Existing articles</h2><ul class="list">${items || '<li class="muted">None yet.</li>'}</ul></div>`;
}

function formView(editing: Editing | null): string {
  const e = editing;
  const sel = (v: string, cur: string) =>
    v === cur ? " selected" : "";
  const cats = categories
    .map(
      (c) =>
        `<option value="${c.slug}"${sel(c.slug, e?.category ?? "")}>${esc(c.name)}</option>`,
    )
    .join("");
  const heading = e ? "Edit article" : "Publish a new article";
  const dryNote = ghConfigured()
    ? ""
    : `<p class="muted">⚠️ No GitHub token set — submitting will show a preview only (nothing published). Set <code>GITHUB_TOKEN</code> to publish.</p>`;
  const currentImg = e?.heroImage
    ? `<p class="muted">Current image: <code>${esc(e.heroImage)}</code> (upload a new one to replace)</p>`
    : "";

  return `<div class="top"><h1>${heading}</h1><a href="#" id="logout">Log out</a></div>
<div class="card">
${dryNote}
${e ? "" : `<label for="file">Upload a file (.docx, .md, .txt) — optional if you write the body below</label>
<input id="file" type="file" accept=".docx,.md,.markdown,.txt">`}
<label for="title">Title</label>
<input id="title" type="text" value="${esc(e?.title ?? "")}" placeholder="e.g. Magnesium for Athletes">
<div class="row">
<div><label for="category">Category</label><select id="category">${cats}</select></div>
<div><label for="type">Type</label><select id="type"><option value="informational"${sel("informational", e?.type ?? "informational")}>informational</option><option value="commercial"${sel("commercial", e?.type ?? "")}>commercial</option></select></div>
</div>
<div class="row">
<div><label for="author">Author slug</label><input id="author" type="text" value="${esc(e?.author ?? "jane-doe")}"></div>
<div><label for="reviewer">Reviewer slug (optional)</label><input id="reviewer" type="text" value="${esc(e?.reviewer ?? "")}" placeholder="dr-smith-rd"></div>
</div>
<label for="excerpt">Excerpt (optional — auto from first paragraph if blank)</label>
<textarea id="excerpt" placeholder="One-sentence summary">${esc(e?.excerpt ?? "")}</textarea>
<label for="tags">Tags (comma separated)</label>
<input id="tags" type="text" value="${esc(e?.tags ?? "")}" placeholder="magnesium, sleep">
<label for="image">Hero image (optional — jpg, png, webp)</label>
<input id="image" type="file" accept="image/png,image/jpeg,image/webp">
${currentImg}
<label for="heroAlt">Hero image alt text</label>
<input id="heroAlt" type="text" value="${esc(e?.heroAlt ?? "")}" placeholder="Describe the image">
<div class="check"><input id="featured" type="checkbox"${e ? (e.featured ? " checked" : "") : " checked"}><label for="featured" style="margin:0">Feature on the homepage</label></div>
<label for="body">Body (Markdown)${e ? "" : " — used if no file is uploaded"}</label>
<textarea id="body" placeholder="## Section heading&#10;&#10;Your content. Cite claims with footnotes [^1].">${esc(e?.body ?? "")}</textarea>
<div style="display:flex;gap:10px;flex-wrap:wrap">
<button id="prev" class="btn2" type="button">Preview</button>
<button id="pub" type="button">${e ? "Save changes" : "Publish article"}</button>
</div>
<div id="out"></div>
</div>
<div id="preview"></div>
<script>
var pub=document.getElementById('pub'),prev=document.getElementById('prev'),out=document.getElementById('out'),preview=document.getElementById('preview');
var MODE=${e ? "'edit'" : "'create'"};var SLUG=${e ? `'${esc(e.slug)}'` : "''"};
document.getElementById('logout').onclick=function(ev){ev.preventDefault();fetch('/api/admin/login',{method:'DELETE'}).then(function(){location.href='/admin'})};
function val(id){var el=document.getElementById(id);return el?el.value.trim():''}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function gather(){
 var fileEl=document.getElementById('file');var f=fileEl?fileEl.files[0]:null;
 var body=val('body');
 var fd=new FormData();
 fd.append('mode',MODE);fd.append('slug',SLUG);
 if(f)fd.append('file',f);
 fd.append('body',body);
 fd.append('title',val('title'));fd.append('category',val('category'));fd.append('type',val('type'));
 fd.append('author',val('author'));fd.append('reviewer',val('reviewer'));fd.append('excerpt',val('excerpt'));
 fd.append('tags',val('tags'));fd.append('heroAlt',val('heroAlt'));
 fd.append('featured',document.getElementById('featured').checked?'true':'false');
 var img=document.getElementById('image').files[0];if(img)fd.append('image',img);
 return {fd:fd,f:f,body:body,img:img};
}
prev.onclick=function(){
 var b=gather();
 if(MODE==='create'&&!b.f&&!b.body){out.className='out err';out.textContent='Upload a file or write the body.';return}
 prev.disabled=true;out.className='out';out.textContent='Rendering preview…';preview.innerHTML='';
 b.fd.append('preview','true');
 fetch('/api/admin/import',{method:'POST',body:b.fd})
 .then(function(r){return r.json().then(function(d){return{ok:r.ok,d:d}})})
 .then(function(x){prev.disabled=false;var d=x.d||{};
  if(!x.ok){out.className='out err';out.textContent=(d.error||'Preview failed');return}
  out.className='out ok';out.textContent='Preview below — nothing published yet. Click Publish when it looks right.';
  var hero=b.img?'<img class="pvhero" src="'+URL.createObjectURL(b.img)+'">':'';
  preview.innerHTML='<div class="pvcard">'+hero+'<div class="eyebrow">'+esc(d.category)+'</div><div class="pvtitle" style="font-family:Georgia,serif">'+esc(d.title)+'</div><p style="color:var(--soft)">'+esc(d.excerpt)+'</p><hr><div class="pvbody">'+(d.bodyHtml||'')+'</div></div><details style="margin-top:12px"><summary class="muted">Raw .mdx that will be saved</summary><pre>'+esc(d.mdx)+'</pre></details>';
 })
 .catch(function(){prev.disabled=false;out.className='out err';out.textContent='Network error'});
};
pub.onclick=function(){
 var b=gather();
 if(MODE==='create'&&!b.f&&!b.body){out.className='out err';out.textContent='Upload a file or write the body.';return}
 pub.disabled=true;out.className='out';out.textContent='Publishing…';
 fetch('/api/admin/import',{method:'POST',body:b.fd})
 .then(function(r){return r.json().then(function(d){return{ok:r.ok,d:d}})})
 .then(function(x){pub.disabled=false;var d=x.d||{};
  if(!x.ok){out.className='out err';out.textContent=(d.error||'Failed');return}
  if(d.committed){out.className='out ok';out.innerHTML='Saved <b>'+esc(d.slug)+'</b>. The site will redeploy shortly.'+(d.url?' <a href="'+d.url+'" target="_blank" rel="noopener">View on GitHub</a>':'')+' · <a href="/admin">Back</a>';preview.innerHTML=''}
  else{out.className='out ok';out.textContent='Not published — no GITHUB_TOKEN set. Set it to publish (use Preview to review in the meantime).'}
 })
 .catch(function(){pub.disabled=false;out.className='out err';out.textContent='Network error'});
};
</script>`;
}

export async function GET(req: Request) {
  if (!isAdminConfigured()) return page(loginView(true));
  if (!isAuthed(cookies().get(ADMIN_COOKIE)?.value)) return page(loginView(false));

  const editSlug = new URL(req.url).searchParams.get("edit");
  let editing: Editing | null = null;
  if (editSlug) {
    const art = getArticleBySlug(editSlug);
    if (art) {
      const fm = art.frontmatter;
      editing = {
        slug: fm.slug,
        title: fm.title,
        category: fm.category,
        type: fm.type,
        author: fm.author,
        reviewer: fm.reviewer ?? "",
        excerpt: fm.excerpt,
        tags: (fm.tags ?? []).join(", "),
        featured: Boolean(fm.featured),
        heroImage: fm.heroImage ?? "",
        heroAlt: fm.heroAlt ?? "",
        body: art.content.trim(),
      };
    }
  }

  return page(formView(editing) + (editing ? "" : listView()));
}
