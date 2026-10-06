"""Package only this public foundation. Python 3 standard library, no secrets."""
import argparse, hashlib, pathlib, zipfile
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'release'
SOURCES = ('README.md','README.ru.md','LICENSE','NOTICE.md','CONTRIBUTING.md','SECURITY.md',
           '.gitignore','package.json','package-lock.json','tsconfig.json','vite.config.ts','index.html',
           'src','public','guides','scripts','.github','docs')
SKIP = {'node_modules','.git','artifacts','release','dist','__pycache__'}
SENSITIVE = {'.env','.p12','.pem','.key','.keystore','.apk'}
def archive(name, paths, prefix=''):
    with zipfile.ZipFile(OUT/name, 'w', zipfile.ZIP_DEFLATED) as store:
        for base in paths:
            base = ROOT/base
            if base.is_symlink(): raise RuntimeError('Symlinks are not publishable')
            if not base.exists(): raise RuntimeError('Missing public source: '+str(base.relative_to(ROOT)))
            for path in sorted(base.rglob('*')) if base.is_dir() else [base]:
                relative = path.relative_to(ROOT)
                parts = relative.parts[1:] if name == 'clickngoal-web.zip' else relative.parts
                if any(part in SKIP for part in parts): continue
                if path.is_symlink(): raise RuntimeError('Symlinks are not publishable')
                if not path.is_file(): continue
                if path.name.startswith('.env') or path.suffix in SENSITIVE: raise RuntimeError('Forbidden public file: '+str(relative))
                target = path.relative_to(ROOT/'dist') if name == 'clickngoal-web.zip' else relative
                store.write(path, prefix+target.as_posix())
def checksums():
    names=('clickngoal.apk','clickngoal-web.zip','clickngoal-source.zip')
    lines=[]
    for name in names:
        path=OUT/name
        if not path.is_file(): raise RuntimeError('Missing release package '+name)
        lines.append(hashlib.sha256(path.read_bytes()).hexdigest()+'  '+name)
    (OUT/'SHA256SUMS.txt').write_text('\n'.join(lines)+'\n', encoding='utf8')
    print('\n'.join(lines))
parser=argparse.ArgumentParser();parser.add_argument('--checksums',action='store_true');args=parser.parse_args()
OUT.mkdir(exist_ok=True)
if args.checksums: checksums()
else:
    archive('clickngoal-web.zip',['dist'])
    archive('clickngoal-source.zip',SOURCES,'clickngoal-community/')
    print('Packaged public web/source archives. Add the verified official APK, then run --checksums.')
