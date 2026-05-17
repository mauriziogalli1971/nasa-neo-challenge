"use client";

import { Asteroid, CloseApproachDatum, EstimatedDiameter } from "@/src/types/types";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown, ZoomInIcon } from "lucide-react"; // icone per il feedback visivo
import { cn, formatCloseApproachDate } from "@/lib/utils";

type SortConfig = {
  key: keyof Asteroid | "closeApproachDate" | "relativeVelocity";
  direction: "ASC" | "DESC" | null;
};

interface AsteroidListProps {
  asteroids: Asteroid[];
  setSelectedId?: (value: ((prevState: string | null) => string | null) | string | null) => void;
}

export function AsteroidTable({ asteroids, setSelectedId }: AsteroidListProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "closeApproachDate",
    direction: "ASC",
  });

  // Funzione per gestire il click sulla colonna
  const requestSort = (key: SortConfig["key"]) => {
    let direction: SortConfig["direction"] = "ASC";
    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DESC";
    } else if (sortConfig.key === key && sortConfig.direction === "DESC") {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  // Logica di ordinamento locale
  useMemo(() => {
    if (!sortConfig.direction) return asteroids;

    return asteroids.sort((a, b) => {
      let aValue: number | CloseApproachDatum[] | EstimatedDiameter | string | boolean;
      let bValue: number | CloseApproachDatum[] | EstimatedDiameter | string | boolean;

      // Estrazione valori per colonne speciali o annidate
      switch (sortConfig.key) {
        case "closeApproachDate":
          aValue = a.closeApproachData[0]?.closeApproachDate || "";
          bValue = b.closeApproachData[0]?.closeApproachDate || "";
          break;
        case "relativeVelocity":
          aValue = a.closeApproachData[0]?.relativeVelocity.kilometersPerHour || 0;
          bValue = b.closeApproachData[0]?.relativeVelocity.kilometersPerHour || 0;
          break;
        case "estimatedDiameter":
          aValue = a.estimatedDiameter.meters.max;
          bValue = b.estimatedDiameter.meters.max;
          break;
        default:
          aValue = a[sortConfig.key as keyof Asteroid];
          bValue = b[sortConfig.key as keyof Asteroid];
      }

      if (aValue < bValue) return sortConfig.direction === "ASC" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ASC" ? 1 : -1;
      return 0;
    });
  }, [asteroids, sortConfig]);

  // Helper per renderizzare l'icona
  const getSortIcon = (key: SortConfig["key"]) => {
    if (sortConfig.key !== key || !sortConfig.direction) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortConfig.direction === "ASC" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="rounded-md border shadow-lg">
      <Table>
        <TableHeader className="bg-white dark:bg-slate-950">
          <TableRow className="bg-slate-50/90 backdrop-blur-md">
            <TableHead
              className="cursor-pointer hover:text-primary transition-colors text-center font-bold"
              onClick={() => requestSort("potentiallyHazardous")}
            >
              <div className="flex items-center justify-center">Pericolosità {getSortIcon("potentiallyHazardous")}</div>
            </TableHead>

            <TableHead
              className="cursor-pointer hover:text-primary transition-colors font-bold"
              onClick={() => requestSort("name")}
            >
              <div className="flex items-center">Nome {getSortIcon("name")}</div>
            </TableHead>

            <TableHead
              className="cursor-pointer hover:text-primary transition-colors text-center font-bold"
              onClick={() => requestSort("closeApproachDate")}
            >
              <div className="flex items-center justify-center">
                Data di approccio {getSortIcon("closeApproachDate")}
              </div>
            </TableHead>

            <TableHead
              className="cursor-pointer hover:text-primary transition-colors text-right font-bold"
              onClick={() => requestSort("estimatedDiameter")}
            >
              <div className="flex items-center justify-end">Diametro (m) {getSortIcon("estimatedDiameter")}</div>
            </TableHead>

            <TableHead
              className="cursor-pointer hover:text-primary transition-colors text-right font-bold"
              onClick={() => requestSort("relativeVelocity")}
            >
              <div className="flex items-center justify-end">Velocità (km/h) {getSortIcon("relativeVelocity")}</div>
            </TableHead>

            <TableHead className="text-center font-bold">Dettagli</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asteroids.map((asteroid) => (
            <TableRow key={asteroid.id} className="hover:bg-slate-50/50 transition-colors">
              <TableCell className="text-center">
                <Badge
                  variant={asteroid.potentiallyHazardous ? "destructive" : "outline"}
                  className={cn(
                    "justify-center",
                    !asteroid.potentiallyHazardous && "text-green-600 border-green-200 bg-green-50"
                  )}
                >
                  {asteroid.potentiallyHazardous ? "PERICOLOSO" : "SICURO"}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">{asteroid.name}</TableCell>
              <TableCell className="text-center">
                {asteroid.closeApproachData[0]
                  ? formatCloseApproachDate(asteroid.closeApproachData[0].closeApproachDate)
                  : "N/D"}
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {Math.round(asteroid.estimatedDiameter.meters.max).toLocaleString("it-IT")}
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {Math.round(asteroid.closeApproachData[0]?.relativeVelocity.kilometersPerHour || 0).toLocaleString(
                  "it-IT"
                )}
              </TableCell>
              <TableCell className={"text-center"}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => (setSelectedId ? setSelectedId(asteroid.id) : null)}
                >
                  <ZoomInIcon></ZoomInIcon>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
