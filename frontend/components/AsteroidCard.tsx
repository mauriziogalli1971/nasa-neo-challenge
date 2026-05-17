import { Asteroid } from "@/src/types/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/src/hooks/useCountdown";
import { cn, formatCloseApproachDate } from "@/lib/utils";

interface AsteroidCardProps {
  asteroid: Asteroid;
  maxDatasetDiameter: number;
  setSelectedId?: (value: ((prevState: string | null) => string | null) | string | null) => void;
}

export function AsteroidCard({ asteroid, maxDatasetDiameter, setSelectedId }: AsteroidCardProps) {
  const approach = asteroid.closeApproachData[0];
  const { days, hours, minutes, seconds } = useCountdown(approach.epochDateCloseApproach);

  // Calcoliamo il diametro di questo asteroide
  const currentDiameter = asteroid.estimatedDiameter.meters.max;

  // Calcoliamo le percentuali di dimensione rispetto all'asteroide più grande del dataset
  // Se maxDatasetDiameter è 0 (safety check), evitiamo divisioni per zero
  const currentScale = maxDatasetDiameter > 0 ? (currentDiameter / maxDatasetDiameter) * 100 : 100;

  return (
    <article className="bg-white border border-slate-200 rounded-xl p-6 text-slate-900 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
      <header className={"flex items-center mb-4"}>
        {asteroid.potentiallyHazardous && (
          <Badge variant="destructive" className="animate-pulse font-semibold">
            PERICOLOSO
          </Badge>
        )}
        <h3 className="text-2xl font-bold tracking-tighter text-slate-900 truncate ml-2">{asteroid.name}</h3>
      </header>

      <section className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div>
              <p className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Data di approccio</p>
              <p className="font-medium text-slate-700">{formatCloseApproachDate(approach.closeApproachDate)}</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Velocità</p>
              <p className="font-semibold font-mono text-blue-600">
                {Math.round(approach.relativeVelocity.kilometersPerHour).toLocaleString("it-IT")} km/h
              </p>
            </div>
            <div>
              <p className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Distanza minima</p>
              <p className="font-medium text-slate-700">
                {Math.round(approach.missDistance.kilometers).toLocaleString("it-IT")} km
              </p>
            </div>
            <div>
              <p className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Magnitudine ass.</p>
              <p className="font-medium text-slate-700">+{asteroid.absoluteMagnitudeH} H</p>
            </div>
          </div>
        </div>

        {/* RAPPRESENTAZIONE GRAFICA CON CONFRONTO PROPORZIONALE */}
        <div className="flex flex-col items-center justify-center px-6 border-y md:border-y-0 md:border-x border-slate-100 py-4 md:py-0 min-w-[160px]">
          <div className="relative w-28 h-28 flex items-center justify-center mb-2 bg-slate-50/50 rounded-lg border border-slate-100 p-2">
            {/* 1. SCALA GRADUATA IN SCONDO PIANO */}
            <svg className="absolute inset-0 w-full h-full text-slate-200 pointer-events-none" viewBox="0 0 100 100">
              {[25, 50, 75].map((y) => (
                <line
                  key={y}
                  x1="5"
                  y1={y}
                  x2="95"
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="2 2"
                />
              ))}
            </svg>

            {/* 2. SILHOUETTE ASTEROIDE MAX (SFONDO - 100% della dimensione del box) */}
            <div
              className="absolute bg-slate-100 border rounded-full"
              style={{
                width: "100%",
                height: "100%",
                clipPath: "polygon(50% 0%, 82% 12%, 98% 38%, 85% 85%, 52% 98%, 15% 82%, 2% 40%, 18% 12%)",
              }}
            />

            {/* 3. SILHOUETTE ASTEROIDE CORRENTE (PRIMO PIANO - Scalato in proporzione) */}
            <div
              className={cn(
                "rounded-full transition-all duration-500 z-10",
                asteroid.potentiallyHazardous ? "bg-amber-500 opacity-90 shadow-sm" : "bg-slate-400 opacity-90"
              )}
              style={{
                width: `${Math.max(8, currentScale)}%`, // Mettiamo un minimo di 8% per non farlo sparire se è microscopico
                height: `${Math.max(8, currentScale)}%`,
                clipPath: "polygon(50% 0%, 80% 10%, 100% 35%, 80% 90%, 50% 100%, 20% 90%, 0% 35%, 20% 10%)",
              }}
            />
          </div>

          <p className="text-sm font-bold font-mono text-slate-800">
            {Math.round(asteroid.estimatedDiameter.meters.max).toLocaleString("it-IT")} m
          </p>
          <p className="text-[10px] text-slate-400 font-medium">[approx]</p>
        </div>

        {/* Countdown */}
        <div className="bg-slate-50 rounded-lg p-4 min-w-[240px] border border-slate-100 flex flex-col justify-between shadow-inner">
          <p className="text-[10px] text-center text-slate-400 uppercase font-bold tracking-widest mb-2">
            Tempo rimasto
          </p>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Giorni", val: days },
              { label: "Ore", val: hours },
              { label: "Min", val: minutes },
              { label: "Sec", val: seconds },
            ].map((t) => (
              <div key={t.label}>
                <p className="text-2xl font-bold font-mono text-slate-900 leading-none">
                  {t.val.toString().padStart(2, "0")}
                </p>
                <p className="text-[8px] uppercase font-bold text-slate-400 mt-1">{t.label}</p>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full mt-4 h-8 text-xs font-semibold bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm transition-colors"
            onClick={() => (setSelectedId ? setSelectedId(asteroid.id) : null)}
          >
            Dettagli
          </Button>
        </div>
      </section>
    </article>
  );
}
