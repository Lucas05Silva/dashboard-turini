import KpiCard from "./KpiCard";
import { getKpis } from "@/lib/indicators";

export default function KpiRow() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {getKpis().map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}
