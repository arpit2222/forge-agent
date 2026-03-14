import type { PromptType } from "../lib/types";

export function buildProject({
  name,
  description,
  promptType
}: {
  name: string;
  description: string;
  promptType: PromptType;
}) {
  const safeName = name || "Forge Generated App";
  const safeDescription = description || "AI generated SaaS application";

  const files = [
    {
      path: "package.json",
      content: JSON.stringify(
        {
          name: "forge-generated-app",
          private: true,
          scripts: {
            dev: "next dev",
            build: "next build",
            start: "next start",
            lint: "next lint"
          },
          dependencies: {
            next: "14.2.5",
            react: "18.3.1",
            "react-dom": "18.3.1",
            "@prisma/client": "^5.17.0"
          },
          devDependencies: {
            prisma: "^5.17.0",
            tailwindcss: "^3.4.6",
            autoprefixer: "^10.4.20",
            postcss: "^8.4.40",
            typescript: "^5.5.3",
            "@types/node": "^20.14.9",
            "@types/react": "^18.3.3",
            "@types/react-dom": "^18.3.0"
          }
        },
        null,
        2
      )
    },
    {
      path: "prisma/schema.prisma",
      content: `generator client {\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"sqlite\"\n  url      = \"file:./dev.db\"\n}\n\nmodel User {\n  id    String @id @default(uuid())\n  email String @unique\n}`
    },
    {
      path: "app/layout.tsx",
      content: `export const metadata = {\n  title: \"${safeName}\"\n};\n\nexport default function RootLayout({ children }) {\n  return (\n    <html lang=\"en\">\n      <body>{children}</body>\n    </html>\n  );\n}`
    },
    {
      path: "app/page.tsx",
      content: `export default function Page() {\n  return (\n    <main style={{ padding: 40, fontFamily: 'sans-serif' }}>\n      <h1>${safeName}</h1>\n      <p>${safeDescription}</p>\n      <p>Prompt type: ${promptType}</p>\n    </main>\n  );\n}`
    },
    {
      path: "README.md",
      content: `# ${safeName}\n\n${safeDescription}\n\n## Run\n\n\tnpm install\n\tnpm run dev\n`
    }
  ];

  return {
    name: safeName,
    description: safeDescription,
    files
  };
}
