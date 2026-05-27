import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const CLIENT_ENTRIES = [
  'components/index',
  'components/AdminShell',
  'hooks/index',
];

function addUseClientDirective() {
  for (const entry of CLIENT_ENTRIES) {
    for (const ext of ['.js', '.mjs']) {
      const filePath = resolve('dist', entry + ext);
      try {
        const content = readFileSync(filePath, 'utf-8');
        if (!content.startsWith('"use client"')) {
          writeFileSync(filePath, `"use client";\n${content}`);
        }
      } catch {}
    }
  }
}

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'components/index': 'src/components/index.ts',
    'components/AdminShell': 'src/components/AdminShell.tsx',
    'hooks/index': 'src/hooks/index.ts',
    'infrastructure/index': 'src/infrastructure/index.ts',
    'infrastructure/middleware/index': 'src/infrastructure/middleware/index.ts',
    'services/index': 'src/services/index.ts',
    'handlers/index': 'src/handlers/index.ts',
    'types/index': 'src/types/index.ts',
    'utils/index': 'src/utils/index.ts',
    'utils/admin-fetch': 'src/utils/admin-fetch.ts',
    'utils/academic-year': 'src/utils/academic-year/index.ts',
    'utils/holidays': 'src/utils/holidays/index.ts',
    'validators/index': 'src/validators/index.ts',
    'errors/index': 'src/errors/index.ts',
    'auth/index': 'src/auth/index.ts',
    'facade/index': 'src/facade/index.ts',
    'rbac/index': 'src/rbac/index.ts',
    'presets/index': 'src/presets/index.ts',
    'counseling/index': 'src/counseling/index.ts',
    'scheduling/index': 'src/scheduling/index.ts',
    'attendance/index': 'src/attendance/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: [
    /^react/,
    /^next/,
    /^@prisma\/client/,
    /^@withwiz\//,
    /^@tiptap\//,
    /^korean-lunar-calendar/,
    /^zod/,
    /^sonner/,
    /\.css$/,
  ],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
  onSuccess: async () => {
    const stylesDir = resolve('dist', 'styles');
    mkdirSync(stylesDir, { recursive: true });
    try {
      copyFileSync(resolve('src', 'styles', 'admin.css'), resolve(stylesDir, 'admin.css'));
    } catch {}
    // Copy component CSS files to dist/components/
    const componentsDir = resolve('dist', 'components');
    mkdirSync(componentsDir, { recursive: true });
    const cssToCopy = ['image-drop-zone.css', 'toggle-switch.css'];
    for (const css of cssToCopy) {
      try {
        copyFileSync(resolve('src', 'components', css), resolve(componentsDir, css));
      } catch {}
    }
    addUseClientDirective();
  },
});
