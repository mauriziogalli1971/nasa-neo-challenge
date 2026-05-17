"use client";

import { useState, useEffect, useMemo, SetStateAction } from "react";
import { AsteroidTable } from "@/components/AsteroidTable";
import { asteroidService } from "@/src/services/asteroidService";
import { Asteroid } from "@/src/types/types";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { AsteroidCard } from "@/components/AsteroidCard";
import { getMaxVelocity } from "@/lib/utils";
import { AsteroidDetails } from "@/components/AsteroidDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(false);

  // Stato dei filtri
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyHazardous, setOnlyHazardous] = useState(false);
  const [minDiameter, setMinDiameter] = useState<string>("0");
  const [velocityLimit, setVelocityLimit] = useState([0]);

  // Stato per le date selezionate nel picker
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  // Funzione che scatena effettivamente la ricerca
  const handleSearch = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      // TODO mostrare un toast o un avviso se mancano le date
      return;
    }

    setLoading(true);
    try {
      const startStr = format(dateRange.from, "yyyy-MM-dd");
      const endStr = format(dateRange.to, "yyyy-MM-dd");
      const data = await asteroidService.getAsteroids(startStr, endStr);
      setAsteroids(data);
      setVelocityLimit([getMaxVelocity(data)]);
    } catch (error) {
      console.error("Errore nel caricamento:", error);
    } finally {
      setLoading(false);
    }
  };

  // Caricamento iniziale "one-shot" all'apertura della pagina
  useEffect(() => {
    const handleSearchAsync = async () => await handleSearch();
    handleSearchAsync();
  }, []);

  // Stato per la visualizzazione
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  // Logica di filtraggio locale (Client-side)
  const filteredAsteroids = useMemo(() => {
    return asteroids.filter((a) => {
      const matchesName = a.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesHazard = onlyHazardous ? a.potentiallyHazardous : true;
      const matchesDiameter = a.estimatedDiameter.meters.max >= parseInt(minDiameter || "0");
      const velocity = a.closeApproachData[0]?.relativeVelocity.kilometersPerHour || 0;
      const matchesVelocity = velocity <= velocityLimit[0];

      return matchesName && matchesHazard && matchesDiameter && matchesVelocity;
    });
  }, [asteroids, searchTerm, onlyHazardous, minDiameter, velocityLimit]);

  const resetFilters = () => {
    setSearchTerm("");
    setOnlyHazardous(false);
    setMinDiameter("0");
    setVelocityLimit([getMaxVelocity(asteroids)]);
  };

  // Stato per la modale di dettaglio
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 1. Calcola il diametro massimo tra gli asteroidi attualmente filtrati
  const maxAsteroidDiameter = useMemo(() => {
    if (filteredAsteroids.length === 0) return 0;
    return Math.max(...filteredAsteroids.map((a) => a.estimatedDiameter.meters.max));
  }, [filteredAsteroids]);

  return (
    <main className="container mx-auto py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 bg-slate-50 p-6 rounded-lg border">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">NASA NEO Tracker</h1>
          <p className="text-muted-foreground">Seleziona l&apos;intervallo temporale per il monitoraggio.</p>
        </div>

        <div className="flex items-center gap-3">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Button onClick={handleSearch} disabled={loading || !dateRange?.to} className="px-8">
            {loading ? (
              "Ricerca..."
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" /> Cerca
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Pannello dei filtri */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-5 p-4">
        <div className="flex items-center space-x-2">
          <Switch id="hazardous-filter" checked={onlyHazardous} onCheckedChange={setOnlyHazardous} />{" "}
          <Label htmlFor="hazardous-filter" className="cursor-pointer">
            Solo Pericolosi
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor={"search"}>Cerca per nome</Label>{" "}
          <Input
            id="search"
            name="search"
            placeholder="Es: 2024 BX..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Diametro Minimo (m)</Label>{" "}
          <Select value={minDiameter} onValueChange={setMinDiameter}>
            <SelectTrigger>
              {" "}
              <SelectValue placeholder="Tutti" />{" "}
            </SelectTrigger>{" "}
            <SelectContent>
              <SelectItem value="0">Tutti i diametri</SelectItem> <SelectItem value="100"> 100 m</SelectItem>
              <SelectItem value="500"> 500 m</SelectItem> <SelectItem value="1000"> 1 km</SelectItem>
            </SelectContent>{" "}
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <Label htmlFor="velocity-slider">Velocità Massima (km/h)</Label>
            <span className="text-sm font-mono font-bold text-primary">
              {velocityLimit[0].toLocaleString("it-IT")} km/h
            </span>
          </div>
          <Slider
            id="velocity-slider"
            max={150000} // Limite realistico per la maggior parte dei NEO
            step={10000}
            value={velocityLimit}
            onValueChange={(value: SetStateAction<number[]>) => setVelocityLimit(value)}
          />
        </div>
      </div>

      {/* Riepilogo e Tabella */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Monitoraggio:</span>
          <Badge variant={filteredAsteroids.length === 0 ? "destructive" : "outline"} className="px-3 py-1">
            {filteredAsteroids.length} di {asteroids.length} oggetti visualizzati
          </Badge>

          {/* Bottone rapido per resettare se ci sono filtri attivi */}
          {filteredAsteroids.length < asteroids.length && (
            <button
              onClick={resetFilters}
              className="text-xs text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Resetta filtri
            </button>
          )}
        </div>
      </section>

      <Tabs defaultValue="cards">
        <TabsList>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="table">Tabella</TabsTrigger>
        </TabsList>
        <TabsContent value="cards">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredAsteroids.map((asteroid) => (
              <AsteroidCard
                key={asteroid.id}
                asteroid={asteroid}
                setSelectedId={setSelectedId}
                maxDatasetDiameter={maxAsteroidDiameter}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="table">
          <AsteroidTable asteroids={filteredAsteroids} setSelectedId={setSelectedId} />
        </TabsContent>
      </Tabs>

      {selectedId && <AsteroidDetails id={selectedId} onClose={() => (setSelectedId ? setSelectedId(null) : null)} />}
    </main>
  );
}
