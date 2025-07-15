"use client";

import { useState } from "react";
import type { Building, Room } from "@/lib/data";
import { buildings } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronLeft,
  ChevronDown,
  Building as BuildingIcon,
  School,
  PenSquare,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArMarkerIcon } from "@/components/icons";

const viewVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function Home() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const getBuildingIcon = (name: string) => {
    if (name.toLowerCase().includes("shs")) {
      return <BuildingIcon className="w-8 h-8 mr-4 text-primary" />;
    }
    return <School className="w-8 h-8 mr-4 text-primary" />;
  };

  const resetSelection = () => {
    setSelectedBuilding(null);
    setSelectedRoom(null);
  };

  const handleBackToBuildings = () => {
    setSelectedBuilding(null);
  };

  const handleBackToRooms = () => {
    setSelectedRoom(null);
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-background p-4 font-body">
      <div className="w-full max-w-md mx-auto">
        <header className="flex justify-between items-center w-full mb-6">
          <h1 className="text-xl font-bold text-foreground font-headline" onClick={resetSelection} style={{cursor: 'pointer'}}>
            Campus Navigator AR
          </h1>
          <Link href="/generate-label" passHref>
            <Button variant="ghost" size="icon" aria-label="Generate Label">
              <PenSquare className="w-5 h-5" />
            </Button>
          </Link>
        </header>

        <AnimatePresence mode="wait">
          {selectedRoom ? (
            <motion.div
              key="ar-view"
              variants={viewVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Card className="w-full shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToRooms}
                    className="mb-4"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <div className="text-center py-10">
                    <ArMarkerIcon className="w-24 h-24 mx-auto text-primary animate-pulse" />
                    <h2 className="text-2xl font-bold mt-6 font-headline">
                      {selectedRoom.name}
                    </h2>
                    <p className="text-muted-foreground mt-2">
                      AR marker is now active. Point your camera to see it.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : selectedBuilding ? (
            <motion.div
              key="room-list"
              variants={viewVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Card className="w-full shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToBuildings}
                    className="mb-4"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Buildings
                  </Button>
                  <h2 className="text-2xl font-bold mb-4 font-headline flex items-center">
                    {getBuildingIcon(selectedBuilding.name)}
                    {selectedBuilding.name}
                  </h2>
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    defaultValue="item-0"
                  >
                    {selectedBuilding.floors.map((floor, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-lg font-semibold">
                          {floor.name}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col space-y-3 pt-2">
                            {floor.rooms.map((room) => (
                              <Button
                                key={room.id}
                                onClick={() => setSelectedRoom(room)}
                                variant="secondary"
                                className="justify-start h-12 text-base rounded-lg"
                              >
                                {room.name}
                              </Button>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <div className="flex justify-center mt-6 text-muted-foreground animate-bounce">
                    <ChevronDown className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="building-selection"
              variants={viewVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Card className="w-full shadow-lg rounded-2xl bg-white/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 font-headline text-center">
                    Select a Building
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {buildings.map((building) => (
                      <Button
                        key={building.id}
                        onClick={() => setSelectedBuilding(building)}
                        className="w-full h-20 text-xl font-semibold rounded-full shadow-md transition-transform transform hover:scale-105"
                      >
                        {building.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
