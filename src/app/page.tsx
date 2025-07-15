
"use client";

import { useState, useEffect, useRef } from "react";
import type { Building, Room } from "@/lib/data";
import { buildings, popularDestinations } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ArMarkerIcon } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const viewVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function Home() {
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
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
      if (selectedRoom) {
        // If we are in AR view for a specific room, go back to the building view.
        setView("building");
        setSelectedRoom(null);
      } else {
        // If we came from the main destinations, go back there.
        setView("destinations");
        setSelectedBuilding(null);
      }
    } else if (view === "building") {
      setView("destinations");
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
            onClick={() =>
              handleBuildingSelect(
                buildings.find((b) => b.name === "SHS Building")!
              )
            }
            className="w-full h-14 text-base font-semibold rounded-full shadow-md transition-transform transform hover:scale-105"
          >
            SHS Building
          </Button>
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
                <h3 className="font-semibold mb-3 border-b pb-2">
                  {floor.name}
                </h3>
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

  const renderARView = () =>
    selectedRoom &&
    selectedBuilding && (
      <motion.div
        key="ar-view"
        variants={viewVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="w-full h-full fixed inset-0"
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        />

        <div className="absolute inset-0 bg-black/30 flex flex-col p-4 pt-20">
          <header className="flex justify-start items-center w-full mb-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={back}
              aria-label="Back"
              className="bg-background/50 hover:bg-background/80"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </header>

          <div className="flex-grow flex items-center justify-center">
            {hasCameraPermission === false && (
              <Card className="w-full max-w-md bg-destructive/90">
                <CardHeader>
                  <CardTitle className="text-destructive-foreground">
                    Camera Access Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-destructive-foreground">
                    Please allow camera access in your browser to use the AR
                    feature.
                  </p>
                </CardContent>
              </Card>
            )}
            {hasCameraPermission === true && (
              <div className="text-center text-white p-6 bg-black/50 rounded-2xl">
                <ArMarkerIcon className="w-32 h-32 mx-auto text-primary" />
                <h2 className="text-4xl font-bold mt-6">
                  {selectedRoom.name}
                </h2>
                <p className="text-lg mt-2">
                  Point your camera to an AR marker to start navigation.
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
    <main className="flex flex-col items-center min-h-screen bg-background p-4 pt-20 font-body">
      <div className="w-full max-w-md mx-auto relative">
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
