"use client";

import { useEffect, useState } from "react";

type Stat = { label: string; value: number; change: number; prefix?: string; suffix?: string };
type Txn = { id: string; counterparty: string; amount: number; status: "settled" | "pending" | "flagged"; date: string };

const STATS: Stat[] = [
  { label: "Total volume", value: 4823190, change: 12.4, prefix: "$" },
  { label: "Active accounts", value: 1284, change: 3.1 },
  { label: "Settlement rate", value: 99.2, change: 0.4, suffix: "%" },
  { label: "Flagged transactions", value: 17, change: -22.7 },
];

const TXNS: Txn[] = [
  { id: "TX-98213", counterparty: "Meridian Capital", amount: 182_400, status: "settled", date: "2026-07-31" },
  { id: "TX-98214", counterparty: "Northwind Ltd", amount: 42_150, status: "pending", date: "2026-07-31" },
  { id: "TX-98215", counterparty: "Aster Holdings", amount: 913_000, status: "settled", date: "2026-07-30" },
  { id: "TX-98216", counterparty: "Cobalt Partners", amount: 7_900, status: "flagged", date: "2026-07-30" },
  { id: "TX-98217", counterparty: "Halcyon Group", amount: 265_720, status: "settled", date: "2026-07-29" },
];

function formatAmount(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function StatsPanel() {
  const [txns, setTxns] = useState<Txn[]>([]);

  useEffect(() => {
    // simulated fetch
    const t = setTimeout(() => setTxns(TXNS), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Treasury overview</h2>
        <button className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700">
          Export
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {s.prefix}
              {s.value.toLocaleString()}
              {s.suffix}
            </p>
            <p className={`mt-1 text-xs ${s.change >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {s.change >= 0 ? "+" : ""}
              {s.change}% vs last month
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Transaction</th>
              <th className="px-4 py-3 font-medium">Counterparty</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {txns.map((t) => (
              <tr key={t.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{t.id}</td>
                <td className="px-4 py-3 text-slate-900">{t.counterparty}</td>
                <td className="px-4 py-3 tabular-nums text-slate-900">{formatAmount(t.amount)}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      t.status === "settled"
                        ? "text-emerald-700"
                        : t.status === "pending"
                          ? "text-amber-700"
                          : "text-rose-700"
                    }
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
