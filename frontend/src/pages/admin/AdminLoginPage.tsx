import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../api/adminApi";
import { getErrorMessage } from "../../api/apiClient";
import { Logo } from "../../components/Logo";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Field, Input } from "../../components/ui/Input";
import { setAdminToken } from "../../lib/adminAuth";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { token } = await adminLogin(username.trim(), password);
      setAdminToken(token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <Card className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center">
          <Logo className="h-8" />
          <p className="mt-2 text-sm font-medium text-neutral-500">Admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Username">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </Field>

          {error && <p className="text-sm text-danger-600">{error}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
