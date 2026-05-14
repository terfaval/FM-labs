"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudioLoginPage() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/studio/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (!response.ok) {
        setError("Hibas kulcs.");
        return;
      }
      router.push("/studio/journal");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="studio-login">
      <form className="studio-login__form" onSubmit={onSubmit}>
        <h1>Studio Login</h1>
        <label htmlFor="studio-key">Kulcs</label>
        <input
          id="studio-key"
          type="password"
          value={key}
          onChange={(event) => setKey(event.target.value)}
          required
          autoComplete="off"
        />
        {error ? <p className="studio-login__error">{error}</p> : null}
        <button type="submit" disabled={submitting}>
          {submitting ? "Ellenorzes..." : "Belepes"}
        </button>
      </form>
    </main>
  );
}
