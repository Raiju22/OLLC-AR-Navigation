
"use client";

import { useState } from "react";
import type { Building, Room } from "@/lib/data";
import { buildings, popularDestinations } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ArMarkerIcon } from "@/components/icons";

const viewVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function Home() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [view, setView] = useState<'destinations' | 'building' | 'ar'>('destinations');

  const handleDestinationSelect = (destination: string) => {
    if (destination === 'SHS Building' || destination === 'Elem. Building') {
      const building = buildings.find(b => b.name === destination);
      if (building) {
        setSelectedBuilding(building);
        setView('building');
      }
    } else {
      // Find which building and room this destination corresponds to
      for (const building of buildings) {
        for (const floor of building.floors) {
          const room = floor.rooms.find(r => r.name === destination);
          if (room) {
            setSelectedBuilding(building);
            setSelectedRoom(room);
            setView('ar');
            return;
          }
        }
      }
    }
  };

  const handleBuildingSelect = (building: Building) => {
    setSelectedBuilding(building);
    setView('building');
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setView('ar');
  };

  const back = () => {
    if (view === 'ar') {
      setView('building');
      setSelectedRoom(null);
    } else if (view === 'building') {
      setView('destinations');
      setSelectedBuilding(null);
    }
  };

  const renderDestinations = () => (
    <motion.div
      key="destinations"
      variants={viewVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="w-full shadow-lg rounded-2xl bg-white/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4 text-center">
            SELECT A DESTINATION
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {popularDestinations.map((dest) => (
              <Button
                key={dest.id}
                onClick={() => handleDestinationSelect(dest.name)}
                className="w-full h-14 text-base font-semibold rounded-full shadow-md transition-transform transform hover:scale-105"
              >
                {dest.name}
              </Button>
            ))}
          </div>
          <Button
            onClick={() => handleBuildingSelect(buildings.find(b => b.name === 'SHS Building')!)}
            className="w-full h-14 text-base font-semibold rounded-full shadow-md transition-transform transform hover:scale-105"
          >
            SHS Building
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderBuilding = () => selectedBuilding && (
    <motion.div
      key="building-view"
      variants={viewVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <header className="flex justify-between items-center w-full mb-4">
        <Button variant="ghost" size="icon" onClick={back} aria-label="Back">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-xl font-bold">{selectedBuilding.name}</h2>
        <div className="w-8"></div>
      </header>
      <Card className="w-full shadow-lg rounded-2xl">
        <CardContent className="p-6">
          {selectedBuilding.floors.map((floor) => (
            <div key={floor.name} className="mb-6 last:mb-0">
              <h3 className="font-semibold mb-3 border-b pb-2">{floor.name}</h3>
              <div className="grid grid-cols-3 gap-3">
                {floor.rooms.map((room) => (
                  <Button
                    key={room.id}
                    onClick={() => handleRoomSelect(room)}
                    variant="default"
                    className="h-12 text-sm rounded-full"
                  >
                    {room.name}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderARView = () => selectedRoom && selectedBuilding && (
     <motion.div
      key="ar-view"
      variants={viewVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="w-full"
    >
        <header className="flex justify-start items-center w-full mb-4">
            <Button variant="ghost" size="icon" onClick={back} aria-label="Back">
                <ChevronLeft className="w-6 h-6" />
            </Button>
        </header>
        <Card className="w-full shadow-lg rounded-2xl">
            <CardContent className="p-6">
                 <div className="text-center py-10">
                    <ArMarkerIcon className="w-32 h-32 mx-auto text-primary" />
                     <h2 className="text-2xl font-bold mt-6">{selectedRoom.name}</h2>
                    <p className="text-muted-foreground mt-2">
                      AR marker is now active.
                    </p>
                  </div>
                {selectedBuilding.floors.map((floor) => (
                    <div key={floor.name} className="mb-6 last:mb-0">
                        <h3 className="font-semibold mb-3 border-b pb-2">{floor.name}</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {floor.rooms.map((room) => (
                                <Button
                                    key={room.id}
                                    onClick={() => handleRoomSelect(room)}
                                    variant={selectedRoom?.id === room.id ? "secondary" : "default"}
                                    className="h-12 text-sm rounded-full"
                                >
                                    {room.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    </motion.div>
  );

  return (
    <main className="flex flex-col items-center min-h-screen bg-background p-4 pt-20 font-body">
      <div className="w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {view === 'destinations' && renderDestinations()}
          {view === 'building' && renderBuilding()}
          {view === 'ar' && renderARView()}
        </AnimatePresence>
      </div>
    </main>
  );
}
