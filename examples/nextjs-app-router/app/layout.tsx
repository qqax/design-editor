import '@fastlabai/design-editor/theme.css';

export const metadata = {
  title: 'Design Editor — App Router example',
  description: 'Example of @fastlabai/design-editor in Next.js App Router.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
