"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Asteroid, CloseApproachDatum } from "@/src/types/types";
import { asteroidService } from "@/src/services/asteroidService";
import { cn, findNextCloseApproach } from "@/lib/utils";
import { ExternalLinkIcon } from "lucide-react";

// Definiamo chiaramente le Props del componente
interface AsteroidDetailsProps {
  id: string;
  onClose: () => void;
}

export function AsteroidDetails({ id, onClose }: AsteroidDetailsProps) {
  const [asteroidDetail, setAsteroidDetail] = useState<Asteroid | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [nextApproach, setNextApproach] = useState<CloseApproachDatum | null>(null);

  // useEffect gestisce la fetch all'avvio senza creare loop infiniti
  useEffect(() => {
    async function loadAsteroidData() {
      setLoadingDetail(true);
      try {
        const detail = await asteroidService.getAsteroidById(id);
        setAsteroidDetail(detail);
        setNextApproach(findNextCloseApproach(detail.closeApproachData));
      } catch (error) {
        console.error("Errore nel recupero dei dettagli", error);
      } finally {
        setLoadingDetail(false);
      }
    }

    if (id) {
      loadAsteroidData();
    }
  }, [id]); // Si attiva solo se l'ID cambia

  return (
    // La modale è aperta finché questo componente è montato
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {loadingDetail ? "Caricamento..." : asteroidDetail?.name || "Dettagli"}
          </DialogTitle>
          <DialogDescription>
            Dettagli tecnici forniti da{" "}
            <a href={asteroidDetail?.nasaJplUrl} target="_blank" rel="noopener noreferrer" className={"inline-flex"}>
              NASA NeoWS
              <ExternalLinkIcon className={"w-4 h-4 ml-1"}></ExternalLinkIcon>
            </a>
          </DialogDescription>
        </DialogHeader>

        {loadingDetail ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : asteroidDetail ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <p className="text-sm text-muted-foreground">ID NASA</p>
                <p className="font-mono font-medium">
                  <a
                    href={asteroidDetail.nasaJplUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={"inline-flex"}
                  >
                    {asteroidDetail.id}
                    <ExternalLinkIcon className={"w-4 h-4 ml-1"}></ExternalLinkIcon>
                  </a>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pericolosità</p>
                <Badge
                  variant={asteroidDetail.potentiallyHazardous ? "destructive" : "outline"}
                  className={cn(
                    "justify-center",
                    !asteroidDetail.potentiallyHazardous && "text-green-600 border-green-200 bg-green-50"
                  )}
                >
                  {asteroidDetail.potentiallyHazardous ? "PERICOLOSO" : "SICURO"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Magnitudine Assoluta</p>
                <p className="font-medium">{asteroidDetail.absoluteMagnitudeH} H</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Velocità Relativa</p>
                <p className="font-medium">
                  {Math.round(
                    asteroidDetail.closeApproachData[0]?.relativeVelocity.kilometersPerHour || 0
                  ).toLocaleString("it-IT")}{" "}
                  km/h
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg space-y-2 border dark:bg-slate-900">
              <p className="text-xs font-bold uppercase text-slate-500">Prossimo Avvicinamento</p>
              <div className="flex justify-between text-sm">
                <span>Data:</span>
                <span className="font-bold">
                  {nextApproach
                    ? format(parseISO(nextApproach.closeApproachDate), "EEEE dd MMMM yyyy", { locale: it })
                    : "N/D"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Distanza Minima:</span>
                <span className="font-bold">
                  {nextApproach
                    ? `${Math.round(nextApproach.missDistance.kilometers).toLocaleString("it-IT")} km`
                    : "N/D"}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="secondary" onClick={onClose}>
                Chiudi
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-center py-4 text-destructive">Impossibile caricare i dettagli.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
