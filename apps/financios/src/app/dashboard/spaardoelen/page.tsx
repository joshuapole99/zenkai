"use client";

import { useEffect, useState } from "react";

type Doel = {
  id: string;
  naam: string;
  doel_bedrag: string;
  huidig_bedrag: string;
  deadline: string | null;
};

function eur(n: number) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default function SpaardoelenPage() {
  const [doelen, setDoelen] = useState<Doel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editBedrag, setEditBedrag] = useState("");

  const [form, setForm] = useState({
    naam: "",
    doelBedrag: "",
    huidigBedrag: "",
    deadline: "",
  });

  async function load() {
    const res = await fetch("/api/spaardoelen");
    if (res.ok) setDoelen(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/spaardoelen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        naam: form.naam,
        doelBedrag: parseFloat(form.doelBedrag),
        huidigBedrag: parseFloat(form.huidigBedrag) || 0,
        deadline: form.deadline || null,
      }),
    });
    setForm({ naam: "", doelBedrag: "", huidigBedrag: "", deadline: "" });
    setShowForm(false);
    load();
  }

  async function handleUpdate(id: string) {
    await fetch(`/api/spaardoelen/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ huidigBedrag: parseFloat(editBedrag) }),
    });
    setEditId(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Weet je zeker dat je dit doel wilt verwijderen?")) return;
    await fetch(`/api/spaardoelen/${id}`, { method: "DELETE" });
    load();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Spaardoelen</h1>
          <p className="text-muted text-sm mt-0.5">Houd je voortgang bij per doel.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98]"
        >
          + Nieuw doel
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-4">
          <h3 className="font-semibold text-foreground text-sm">Nieuw spaardoel</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted mb-1">Naam doel</label>
              <input
                required
                placeholder="Bijv. Vakantie Japan"
                value={form.naam}
                onChange={e => setForm(f => ({ ...f, naam: e.target.value }))}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Doelbedrag (€)</label>
              <input
                required
                type="number"
                min="1"
                placeholder="3000"
                value={form.doelBedrag}
                onChange={e => setForm(f => ({ ...f, doelBedrag: e.target.value }))}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Al gespaard (€)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={form.huidigBedrag}
                onChange={e => setForm(f => ({ ...f, huidigBedrag: e.target.value }))}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Deadline (optioneel)</label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
            >
              Opslaan
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-muted hover:text-foreground transition-colors px-3 py-2"
            >
              Annuleren
            </button>
          </div>
        </form>
      )}

      {doelen.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card text-center">
          <p className="text-muted text-sm">Nog geen doelen. Voeg je eerste spaardoel toe.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {doelen.map((d) => {
            const pct = Math.min(100, Math.round((parseFloat(d.huidig_bedrag) / parseFloat(d.doel_bedrag)) * 100));
            const resterend = Math.max(0, parseFloat(d.doel_bedrag) - parseFloat(d.huidig_bedrag));
            return (
              <div key={d.id} className="bg-card border border-border rounded-2xl p-5 shadow-card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{d.naam}</h3>
                    {d.deadline && (
                      <p className="text-xs text-muted mt-0.5">
                        Deadline: {new Date(d.deadline).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-accent">{pct}%</span>
                </div>

                <div className="h-2.5 bg-background rounded-full overflow-hidden mb-3">
                  <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
                </div>

                <div className="flex justify-between text-xs text-muted mb-4">
                  <span>{eur(parseFloat(d.huidig_bedrag))} gespaard</span>
                  <span>{eur(resterend)} nog nodig · doel {eur(parseFloat(d.doel_bedrag))}</span>
                </div>

                {editId === d.id ? (
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      min="0"
                      value={editBedrag}
                      onChange={e => setEditBedrag(e.target.value)}
                      placeholder="Nieuw gespaard bedrag"
                      className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                    <button
                      onClick={() => handleUpdate(d.id)}
                      className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
                    >
                      Opslaan
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="text-xs text-muted hover:text-foreground transition-colors px-2 py-2"
                    >
                      Annuleer
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setEditId(d.id); setEditBedrag(d.huidig_bedrag); }}
                      className="text-xs text-accent hover:text-accent-hover transition-colors font-medium"
                    >
                      Voortgang bijwerken
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="text-xs text-muted hover:text-danger transition-colors"
                    >
                      Verwijderen
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
