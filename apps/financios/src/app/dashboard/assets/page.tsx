"use client";

import { useEffect, useState } from "react";

type Asset = {
  id: string;
  type: "spaar" | "belegging" | "crypto" | "overig";
  naam: string;
  waarde: string;
  updated_at: string;
};

const TYPE_LABELS: Record<string, string> = {
  spaar: "Spaargeld",
  belegging: "Beleggingen",
  crypto: "Crypto",
  overig: "Overig",
};

const TYPE_COLORS: Record<string, string> = {
  spaar: "text-success bg-success/10 border-success/20",
  belegging: "text-accent bg-accent/10 border-accent/20",
  crypto: "text-warning bg-warning/10 border-warning/20",
  overig: "text-muted bg-card border-border",
};

function eur(n: number) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editNaam, setEditNaam] = useState("");
  const [editWaarde, setEditWaarde] = useState("");

  const [form, setForm] = useState({ type: "spaar", naam: "", waarde: "" });

  async function load() {
    const res = await fetch("/api/assets");
    if (res.ok) setAssets(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: form.type, naam: form.naam, waarde: parseFloat(form.waarde) }),
    });
    setForm({ type: "spaar", naam: "", waarde: "" });
    setShowForm(false);
    load();
  }

  async function handleUpdate(id: string) {
    await fetch(`/api/assets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ naam: editNaam, waarde: parseFloat(editWaarde) }),
    });
    setEditId(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Asset verwijderen?")) return;
    await fetch(`/api/assets/${id}`, { method: "DELETE" });
    load();
  }

  const totalPerType = assets.reduce<Record<string, number>>((acc, a) => {
    acc[a.type] = (acc[a.type] ?? 0) + parseFloat(a.waarde);
    return acc;
  }, {});
  const totalAll = Object.values(totalPerType).reduce((s, v) => s + v, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const grouped = Object.entries(TYPE_LABELS).map(([type, label]) => ({
    type,
    label,
    items: assets.filter(a => a.type === type),
    totaal: totalPerType[type] ?? 0,
  })).filter(g => g.items.length > 0 || showForm);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Vermogen</h1>
          <p className="text-muted text-sm mt-0.5">Houd je spaargeld, beleggingen en crypto bij.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98]"
        >
          + Toevoegen
        </button>
      </div>

      {/* Totaal */}
      {assets.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <p className="text-xs text-muted uppercase tracking-wide font-medium mb-1">Totaal vermogen</p>
          <p className="text-3xl font-bold text-foreground">{eur(totalAll)}</p>
          <div className="flex flex-wrap gap-3 mt-3">
            {Object.entries(totalPerType).map(([type, val]) => (
              <span key={type} className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${TYPE_COLORS[type]}`}>
                {TYPE_LABELS[type]}: {eur(val)}
              </span>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-4">
          <h3 className="font-semibold text-foreground text-sm">Nieuwe asset toevoegen</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-muted mb-1">Type</label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                {Object.entries(TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Omschrijving</label>
              <input
                required
                placeholder="Bijv. DEGIRO portfolio"
                value={form.naam}
                onChange={e => setForm(f => ({ ...f, naam: e.target.value }))}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Waarde (€)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="5000"
                value={form.waarde}
                onChange={e => setForm(f => ({ ...f, waarde: e.target.value }))}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
              Toevoegen
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-muted hover:text-foreground transition-colors px-3 py-2">
              Annuleren
            </button>
          </div>
        </form>
      )}

      {assets.length === 0 && !showForm ? (
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card text-center">
          <p className="text-muted text-sm">Nog geen assets. Voeg je spaargeld, beleggingen of crypto toe.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ type, label, items, totaal }) => items.length > 0 && (
            <section key={type}>
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-lg border ${TYPE_COLORS[type]}`}>{label}</span>
                </h2>
                <span className="text-sm font-semibold text-foreground">{eur(totaal)}</span>
              </div>
              <div className="space-y-2">
                {items.map(a => (
                  <div key={a.id} className="bg-card border border-border rounded-xl p-4 shadow-card">
                    {editId === a.id ? (
                      <div className="flex gap-2 flex-wrap items-center">
                        <input
                          value={editNaam}
                          onChange={e => setEditNaam(e.target.value)}
                          className="flex-1 min-w-0 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <input
                          type="number"
                          value={editWaarde}
                          onChange={e => setEditWaarde(e.target.value)}
                          className="w-32 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <button onClick={() => handleUpdate(a.id)} className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all">
                          Opslaan
                        </button>
                        <button onClick={() => setEditId(null)} className="text-xs text-muted hover:text-foreground transition-colors">
                          Annuleer
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-foreground font-medium">{a.naam}</p>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-semibold text-foreground">{eur(parseFloat(a.waarde))}</p>
                          <button
                            onClick={() => { setEditId(a.id); setEditNaam(a.naam); setEditWaarde(a.waarde); }}
                            className="text-xs text-accent hover:text-accent-hover transition-colors"
                          >
                            Bewerk
                          </button>
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="text-xs text-muted hover:text-danger transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
