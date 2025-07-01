import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface HeroSectionProps {
  onSearch: (query: string, city: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("query") || "";
    const cityParamRaw = params.get("city") || "all";
    const cityParam = cityParamRaw === "" ? "all" : cityParamRaw;

    setSearchQuery(queryParam);
    setSelectedCity(cityParam);
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, city);
  };

  return (
    <section className="hero-gradient py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Finn en{" "}
            <span className="text-gradient">profesjonell håndverker</span> i din
            by
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-balance">
            Rørleggere, elektrikere, rengjørere, reparatører og andre
            kvalifiserte spesialister er klare til å hjelpe deg
          </p>

          {/* Søkelinje */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-soft-lg p-2 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center px-4">
              <Search className="text-gray-400 mr-3 h-5 w-5" />
              <Input
                type="text"
                placeholder="Hva trenger du? (f.eks. rørlegger)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border-none outline-none text-lg bg-transparent focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center px-4 border-l border-gray-200">
              <MapPin className="text-gray-400 mr-3 h-5 w-5" />
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="border-none outline-none text-lg bg-transparent focus:ring-0 w-32">
                  <SelectValue placeholder="By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oslo">Oslo</SelectItem>
                  <SelectItem value="bergen">Bergen</SelectItem>
                  <SelectItem value="trondheim">Trondheim</SelectItem>
                  <SelectItem value="stavanger">Stavanger</SelectItem>
                  <SelectItem value="tromso">Tromsø</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSubmit}
              className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-primary/90 font-semibold transition-colors"
            >
              Søk
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
