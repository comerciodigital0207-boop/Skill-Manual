"""Genera una sola página HTML de English Coach para publicarla como Artifact de claude.ai.
Uso: python3 tools/build_artifact.py <salida.html>"""
import pathlib, re, sys

root = pathlib.Path(__file__).resolve().parent.parent
css = (root / "styles.css").read_text()
html = (root / "index.html").read_text()
body = re.search(r"<body>(.*?)<script", html, re.S).group(1).strip()
scripts = ["js/curriculum.js", "js/explanations.js", "js/native.js", "js/context.js", "js/grammar.js", "js/artifact-adapter.js", "js/ai.js", "js/app.js"]
js = "\n".join(f"<script>\n{(root / s).read_text()}\n</script>" for s in scripts)

extra_css = """
/* Ajustes para el visor de claude.ai */
.top { top: env(safe-area-inset-top, 0px); }
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 10; background: var(--card); }
:root[data-theme="dark"] { color-scheme: dark; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { color-scheme: dark; } }
.typed { margin: 6px 0; }
"""
out = f"""<title>English Coach</title>
<style>
{css}
{extra_css}
</style>
{body}
{js}
"""
pathlib.Path(sys.argv[1]).write_text(out)
print("ok", len(out), "bytes")
