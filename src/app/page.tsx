
"use client";

import { useState, useEffect, useRef } from "react";
import type { Building, Room } from "@/lib/data";
import { buildings, popularDestinations } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Home as HomeIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ArMarkerIcon } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";

const viewVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function HomePage() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [view, setView] = useState<"destinations" | "building" | "ar">(
    "destinations"
  );
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let stream: MediaStream | null = null;
    const getCameraPermission = async () => {
      if (view === "ar") {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
          setHasCameraPermission(false);
          toast({
            variant: "destructive",
            title: "Camera Access Denied",
            description:
              "Please enable camera permissions in your browser settings to use this feature.",
          });
        }
      }
    };

    getCameraPermission();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [view, toast]);

  const handleDestinationSelect = (destination: string) => {
    if (destination === "SHS Building" || destination === "Elem. Building") {
      const building = buildings.find((b) => b.name === destination);
      if (building) {
        setSelectedBuilding(building);
        setView("building");
      }
    } else {
      for (const building of buildings) {
        for (const floor of building.floors) {
          const room = floor.rooms.find((r) => r.name === destination);
          if (room) {
            setSelectedBuilding(building);
            setSelectedRoom(room);
            setView("ar");
            return;
          }
        }
      }
    }
  };

  const handleBuildingSelect = (building: Building) => {
    setSelectedBuilding(building);
    setView("building");
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setView("ar");
  };

  const back = () => {
    if (view === "ar") {
      setView(selectedBuilding ? "building" : "destinations");
      setSelectedRoom(null); // Keep selectedBuilding to go back to its view
    } else if (view === "building") {
      setView("destinations");
      setSelectedBuilding(null);
    }
  };
  
  const goHome = () => {
    setView("destinations");
    setSelectedBuilding(null);
    setSelectedRoom(null);
  }

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
      <header className="flex justify-center items-center w-full mb-6">
          <h1 className="text-2xl font-bold text-center">
            Campus AR Navigator
          </h1>
      </header>
      <Card className="w-full shadow-lg rounded-2xl bg-white/50 backdrop-blur-sm border-none">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-4 text-center">
            Popular Destinations
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {popularDestinations.map((dest) => (
              <Button
                key={dest.id}
                onClick={() => handleDestinationSelect(dest.name)}
                className="w-full h-16 text-sm font-semibold rounded-2xl shadow-md transition-transform transform hover:scale-105"
              >
                {dest.name}
              </Button>
            ))}
          </div>
          <h2 className="text-xl font-bold my-4 text-center">
            Buildings
          </h2>
          <div className="flex flex-col gap-3">
          {buildings.map(building => (
             <Button
                key={building.id}
                onClick={() => handleBuildingSelect(building)}
                className="w-full h-16 text-base font-semibold rounded-2xl shadow-md transition-transform transform hover:scale-105"
            >
                {building.name}
            </Button>
          ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderBuilding = () =>
    selectedBuilding && (
      <motion.div
        key="building-view"
        variants={viewVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <header className="flex justify-between items-center w-full mb-4 sticky top-0 bg-background/80 backdrop-blur-sm p-2 z-10 -mx-2">
          <Button variant="ghost" size="icon" onClick={back} aria-label="Back">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h2 className="text-xl font-bold">{selectedBuilding.name}</h2>
          <Button variant="ghost" size="icon" onClick={goHome} aria-label="Home">
            <HomeIcon className="w-6 h-6" />
          </Button>
        </header>
        <Card className="w-full shadow-lg rounded-2xl border-none bg-transparent">
          <CardContent className="p-0">
            {selectedBuilding.floors.map((floor) => (
              <div key={floor.name} className="mb-6 last:mb-0">
                <h3 className="font-semibold mb-3 border-b pb-2 text-lg">
                  {floor.name}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {floor.rooms.map((room) => (
                    <Button
                      key={room.id}
                      onClick={() => handleRoomSelect(room)}
                      variant="default"
                      className="h-14 text-xs rounded-xl"
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

  const renderARView = () =>
    selectedRoom &&
    selectedBuilding && (
      <motion.div
        key="ar-view"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 },
        }}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.2 }}
        className="w-full h-full fixed inset-0"
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        />

        <div className="absolute inset-0 bg-black/30 flex flex-col">
          <header className="flex justify-between items-center w-full p-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={back}
              aria-label="Back"
              className="bg-background/50 hover:bg-background/80 rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goHome}
              aria-label="Home"
              className="bg-background/50 hover:bg-background/80 rounded-full"
            >
              <HomeIcon className="w-6 h-6" />
            </Button>
          </header>

          <div className="flex-grow flex items-center justify-center p-4">
            {hasCameraPermission === false && (
              <Card className="w-full max-w-md bg-destructive/90">
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-destructive-foreground text-center mb-2">
                    Camera Access Required
                  </h2>
                  <p className="text-destructive-foreground text-center">
                    Please allow camera access in your browser to use the AR
                    feature.
                  </p>
                </CardContent>
              </Card>
            )}
            {hasCameraPermission === true && (
              <div className="text-center text-white p-6 bg-black/50 rounded-2xl">
                <ArMarkerIcon className="w-24 h-24 mx-auto text-primary" />
                <h2 className="text-3xl font-bold mt-4">
                  {selectedRoom.name}
                </h2>
                <p className="text-md mt-2">
                  Point camera at an AR marker to navigate.
                </p>
              </div>
            )}
            {hasCameraPermission === null && (
                 <div className="text-center text-white">
                    <p>Requesting camera permission...</p>
                 </div>
            )}
          </div>
        </div>
      </motion.div>
    );

  return (
    <main className="flex flex-col items-center min-h-screen bg-background p-4 font-body">
      <div className="w-full max-w-lg mx-auto relative flex-grow">
        <AnimatePresence mode="wait">
          {view === "destinations" && renderDestinations()}
          {view === "building" && renderBuilding()}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {view === "ar" && renderARView()}
      </AnimatePresence>
    </main>
  );
}
