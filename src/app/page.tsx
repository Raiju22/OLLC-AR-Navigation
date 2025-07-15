
"use client";

import { useState, useEffect, useRef } from "react";
import type { Building, Room } from "@/lib/data";
import { buildings, popularDestinations } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, HomeIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ArMarkerIcon } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

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
  const [view, setView] = useState<"welcome" | "destinations" | "building" | "ar">("welcome");
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
      const isPopular = popularDestinations.some(dest => dest.id === selectedRoom?.id);
      setView(isPopular ? "destinations" : "building");
      setSelectedRoom(null);
    } else if (view === "building") {
      setView("destinations");
      setSelectedBuilding(null);
    }
  };
  
  const goHome = () => {
    setView("welcome");
    setSelectedBuilding(null);
    setSelectedRoom(null);
  }

  const renderWelcome = () => (
    <motion.div
      key="welcome"
      variants={viewVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col items-center justify-center h-full text-center px-4"
    >
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 font-headline [text-shadow:0_4px_8px_rgba(0,0,0,0.3)]">
        <span className="text-white">OLLC</span> <span className="text-primary">AR Navigation</span>
      </h1>
      <p className="max-w-xl mb-8 text-base sm:text-lg text-foreground/80">
        Effortlessly find your way around campus with our augmented reality navigator.
      </p>
      <div className="flex flex-col items-center gap-4">
          <Button
            onClick={() => setView("destinations")}
            size="lg"
            className="h-14 px-10 text-lg rounded-full shadow-lg transition-transform transform hover:scale-105 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Start Navigating
          </Button>
      </div>
    </motion.div>
  );


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
            SELECT A DESTINATION
          </h1>
      </header>
      <Card className="w-full shadow-lg rounded-2xl bg-card/80">
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
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex items-center gap-3 bg-black/30">
        <Image src="/ollc.png" alt="OLLC Logo" width={40} height={40} />
        <h1 className="text-xl font-semibold text-white font-headline">
          Our Lady of Lourdes College
        </h1>
      </header>
      <main className="flex flex-col items-center justify-center flex-grow p-4 font-body">
        <div className="w-full max-w-lg mx-auto relative flex-grow flex items-center">
          <AnimatePresence mode="wait">
            {view === "welcome" && renderWelcome()}
            {view === "destinations" && renderDestinations()}
            {view === "building" && renderBuilding()}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {view === "ar" && renderARView()}
        </AnimatePresence>
      </main>
      <footer className="p-4 text-center text-xs text-foreground/50 bg-black/30">
        <p>&copy; 2024 OLLC AR Navigation. All rights reserved.</p>
      </footer>
    </div>
  );
}
