// Puts @SellerOnly() / @DoctorOnly() on the controller handlers the route audit flagged.
//
//   node scripts/apply-role-guards.js          -> DRY RUN: prints what would change
//   node scripts/apply-role-guards.js --write  -> applies changes, then runs prettier on them
//
// Run from the backend root. Uses the `typescript` package already in your node_modules.
// Handlers that already have @Roles(...) are skipped. Review with `git diff` afterwards.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ts = require('typescript');

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const DECORATOR_MODULE = path.join(SRC, 'modules', 'auth', 'roles_access.decorator');
const WRITE = process.argv.includes('--write');

const WRITES = ['Post', 'Patch', 'Put', 'Delete'];
const VERTICALS =
  /^(listings|vehicles|jobs|trades|rental|agriculture|secondhand-goods|foods|beauty)$/;

// [controller path, HTTP decorators, handler route, decorator to apply]
const RULES = [
  [VERTICALS, WRITES, /^(?!.*\/(apply|lead)$)/, 'SellerOnly'], // apply/lead stay "any logged-in role"
  [/^listings$/, ['Get'], /^mine/, 'SellerOnly'],
  [/^vendor-sales-overview$/, ['Get'], /.*/, 'SellerOnly'],
  [/^orders$/, ['Get'], /^seller/, 'SellerOnly'],
  [/^reports$/, ['Get'], /.*/, 'SellerOnly'],
  [/^leads$/, ['Patch'], /:id\/status$/, 'SellerOnly'],
  [/^medical$/, WRITES, /.*/, 'DoctorOnly'],
  [/^medical\/slots$/, WRITES, /.*/, 'DoctorOnly'],
  [/^beauty\/slots$/, WRITES, /.*/, 'SellerOnly'],
];

const HTTP = ['Get', 'Post', 'Patch', 'Put', 'Delete'];
const getDecos = (n) =>
  (ts.canHaveDecorators && ts.canHaveDecorators(n) ? ts.getDecorators(n) : n.decorators) || [];
const decoName = (d) =>
  ts.isCallExpression(d.expression) ? d.expression.expression.getText() : d.expression.getText();
const decoArgs = (d) => (ts.isCallExpression(d.expression) ? d.expression.arguments : []);
const firstStringArg = (d) => {
  const a = decoArgs(d)[0];
  return a && ts.isStringLiteralLike(a) ? a.text.replace(/^\/+|\/+$/g, '') : '';
};

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.controller.ts')) out.push(p);
  }
  return out;
}

function pruneUnused(text, file, names) {
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const used = new Set();
  const visit = (n) => {
    if (ts.isImportDeclaration(n)) return;
    if (ts.isIdentifier(n)) used.add(n.text);
    ts.forEachChild(n, visit);
  };
  visit(sf);
  const edits = [];
  for (const st of sf.statements) {
    const nb = ts.isImportDeclaration(st) && st.importClause && st.importClause.namedBindings;
    if (!nb || !ts.isNamedImports(nb)) continue;
    const keep = nb.elements.filter((e) => !(names.includes(e.name.text) && !used.has(e.name.text)));
    if (keep.length === nb.elements.length) continue;
    if (keep.length === 0 && !st.importClause.name) {
      let end = st.getEnd();
      if (text[end] === '\r') end++;
      if (text[end] === '\n') end++;
      edits.push({ start: st.getStart(), end, text: '' });
    } else {
      edits.push({
        start: nb.getStart(),
        end: nb.getEnd(),
        text: `{ ${keep.map((e) => e.getText()).join(', ')} }`,
      });
    }
  }
  return applyEdits(text, edits);
}

function applyEdits(text, edits) {
  return [...edits].sort((a, b) => b.start - a.start).reduce(
    (t, e) => t.slice(0, e.start) + e.text + t.slice(e.end),
    text,
  );
}

const changedFiles = [];
let total = 0;

for (const file of walk(SRC)) {
  const text = fs.readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const nl = text.includes('\r\n') ? '\r\n' : '\n';
  const edits = [];
  const notes = [];
  const usedDecorators = new Set();

  for (const cls of sf.statements.filter(ts.isClassDeclaration)) {
    const ctl = getDecos(cls).find((d) => decoName(d) === 'Controller');
    if (!ctl) continue;
    const base = firstStringArg(ctl);

    for (const m of cls.members.filter(ts.isMethodDeclaration)) {
      const decos = getDecos(m);
      const http = decos.find((d) => HTTP.includes(decoName(d)));
      if (!http) continue;
      const verb = decoName(http);
      const route = firstStringArg(http);
      const rule = RULES.find(([c, verbs, r]) => c.test(base) && verbs.includes(verb) && r.test(route));
      if (!rule) continue;
      const want = rule[3];
      const label = `${verb.toUpperCase()} /${[base, route].filter(Boolean).join('/')}`;

      const names = decos.map(decoName);
      if (names.includes('Roles')) {
        notes.push(`  skip   ${label} (already has @Roles)`);
        continue;
      }
      if (names.includes('SellerOnly') || names.includes('DoctorOnly')) {
        notes.push(`  skip   ${label} (already has ${want})`);
        continue;
      }

      const plain = decos.find(
        (d) =>
          decoName(d) === 'UseGuards' &&
          decoArgs(d).length === 1 &&
          decoArgs(d)[0].getText() === 'JwtAuthGuard',
      );
      if (plain) {
        edits.push({ start: plain.getStart(), end: plain.getEnd(), text: `@${want}()` });
      } else {
        const start = http.getStart();
        const lineStart = text.lastIndexOf('\n', start - 1) + 1;
        const indent = text.slice(lineStart, start).match(/^\s*/)[0];
        edits.push({ start, end: start, text: `@${want}()${nl}${indent}` });
      }
      usedDecorators.add(want);
      const extra = plain ? '' : names.includes('UseGuards') ? ' (added; kept existing guards)' : ' (added)';
      notes.push(`  change ${label} -> @${want}()${extra}`);
      total++;
    }
  }

  if (!edits.length) {
    notes.filter((n) => n.includes('skip')).forEach((n) => console.log(path.relative(ROOT, file) + '\n' + n));
    continue;
  }

  const rel = path.relative(path.dirname(file), DECORATOR_MODULE).split(path.sep).join('/');
  const spec = rel.startsWith('.') ? rel : './' + rel;
  const imports = sf.statements.filter(ts.isImportDeclaration);
  const last = imports[imports.length - 1];
  edits.push({
    start: last.getEnd(),
    end: last.getEnd(),
    text: `${nl}import { ${[...usedDecorators].sort().join(', ')} } from '${spec}';`,
  });

  let out = applyEdits(text, edits);
  out = pruneUnused(out, file, ['JwtAuthGuard', 'UseGuards']);

  console.log(path.relative(ROOT, file));
  notes.forEach((n) => console.log(n));

  if (WRITE) {
    fs.writeFileSync(file, out, 'utf8');
    changedFiles.push(file);
  }
}

console.log(`\n${total} handler(s) ${WRITE ? 'updated' : 'would be updated'}.`);
if (!WRITE) {
  console.log('Dry run only. Re-run with --write to apply.');
} else if (changedFiles.length) {
  try {
    execSync(`npx prettier --write ${changedFiles.map((f) => `"${f}"`).join(' ')}`, {
      stdio: 'inherit',
      shell: true,
    });
  } catch {
    console.log('Prettier failed; run: npx prettier --write "src/**/*.controller.ts"');
  }
  console.log('Done. Check `git diff`, then re-run the route audit.');
}