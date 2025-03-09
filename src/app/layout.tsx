import "./ui/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="p-4">
          <nav className="container mx-auto flex justify-between items-center">
            <h1>Gamescout</h1>
            <ul className="flex gap-6">
              <li className="bg-black hover:bg-gold rounded-xl">Dashboard</li>
              <li className="bg-black hover:bg-gold rounded-xl">Profile</li>
              <li className="bg-black hover:bg-gold rounded-xl">Community</li>
              <li className="bg-black hover:bg-gold rounded-xl">Report</li>
              <li className="bg-black hover:bg-gold rounded-xl">Subscribe</li>
              <li className="bg-black hover:bg-gold rounded-xl">Sign Out</li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
