import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Thrainax Store" },
      { name: "description", content: "Sign in to your Thrainax account to shop, checkout and track orders." },
      { property: "og:title", content: "Sign In — Thrainax Store" },
      { property: "og:description", content: "Access your Thrainax account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const user = await login(email.trim(), password);
      toast.success(`Welcome back, ${user.name}`);
      navigate({ to: user.role === "ADMIN" ? "/admin" : "/products" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/register" className="text-primary hover:underline">
          Create an account
        </Link>
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="mt-4 rounded-lg border border-border bg-secondary p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Demo accounts</p>
        <p>Admin — admin@thrainax.com / admin123</p>
        <p>User — user@thrainax.com / user123</p>
      </div>
    </div>
  );
}
