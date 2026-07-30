import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-muted-foreground">Page not found</p>
        <Link href="/" className="text-primary hover:underline">
          ← Back home
        </Link>
      </div>
    </div>
  );
}
