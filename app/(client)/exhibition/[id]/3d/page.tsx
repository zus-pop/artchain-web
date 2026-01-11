"use client";

import { useGetExhibitionById } from "@/apis/exhibition";
import {
  CameraControls,
  Environment,
  Html,
  Preload,
  Sparkles,
  useCursor,
  useProgress,
} from "@react-three/drei";
import { Suspense, use, useEffect, useRef, useState } from "react";
import { Arrows, Exhibition, PaintingFrame } from "@/components/3d";
import { proxy, useSnapshot } from "valtio";
import { ExhibitionPainting } from "@/types";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { button, buttonGroup, folder, useControls } from "leva";
import ChatBox from "@/components/3d/ChatBox";
import Image from "next/image";
import Panel from "@/components/3d/Panel";
import {
  CameraMovementOptions,
  useCameraMovement,
} from "@/lib/useCameraMovement";
import { usePersonStore } from "@/store/person";
import { useSocket } from "@/providers";
import { Color, Group, Vector3 } from "three";
import { CustomEcctrlRigidBody } from "ecctrl";
import { useSpring } from "@react-spring/three";
import { Physics, RigidBody } from "@react-three/rapier";
import RemoteModel from "../../../../../components/3d/RemoteModel";
import LocalModel from "../../../../../components/3d/LocalModel";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { Button } from "../../../../../components/ui/button";
import { useRouter } from "next/navigation";

interface ExhibitionSceneProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  cameraControlsRef: React.RefObject<CameraControls | null>;
  onShowPanel: (item: ExhibitionPainting) => void;
  mode: string;
  selectedItem: ExhibitionPainting | null;
  data: ExhibitionPainting[];
}

const state = proxy<{
  current: string | null;
  mode: number;
  hovered: boolean;
  viewMode: "camera" | "first person" | "third person";
  localChatMessage: string | null;
}>({
  current: null,
  mode: 0,
  hovered: false,
  viewMode: "camera",
  localChatMessage: null,
});

function Exhibition3DScene({
  cameraControlsRef,
  onShowPanel,
  mode,
  selectedItem,
  data,
}: ExhibitionSceneProps) {
  const groupRef = useRef<Group>(null);
  const snap = useSnapshot(state);
  const scene = useThree((state) => state.scene);
  useCursor(snap.hovered);
  const moveCameraToObject = useCameraMovement(cameraControlsRef);
  const persons = usePersonStore((state) => state.persons);
  const { socket } = useSocket();
  const localModelRef = useRef<CustomEcctrlRigidBody | null>(null);
  const [currentFrame, setCurrentFrame] = useState<ExhibitionPainting | null>(
    null
  );
  useControls({
    "Danh sách": folder(
      (() => {
        const obj: Record<string, any> = {};
        data
          .sort((a, b) => Number(a.award?.rank) - Number(b.award?.rank))
          .forEach((item, index) => {
            obj[`${index + 1}. ${item.title}`] = button(() => {
              const options: CameraMovementOptions = { zoom: 1.2 };
              moveCameraToObject(
                scene.getObjectByName(item.paintingId)!,
                options
              );
            });
          });
        return obj;
      })(),
      { collapsed: true } // Optional: starts collapsed
    ),
  });

  useSpring({
    dummy: 1,
    from: 0,
    delay: 800,
    onRest: () => {
      const name = scene.getObjectByName("exhibition");
      if (!name) return;
      moveCameraToObject(name, {
        offsetX: -6,
        zoom: 0.4,
      });
    },
  });

  useEffect(() => {
    if (mode === "camera" && cameraControlsRef.current) {
      const name = scene.getObjectByName("exhibition");
      if (!name) return;
      moveCameraToObject(name, {
        offsetX: -6,
        zoom: 0.4,
      });
    }
  }, [mode, cameraControlsRef, scene, moveCameraToObject]);

  useFrame(() => {
    if (mode === "camera") return;

    if (!localModelRef.current) return;

    if (!localModelRef.current.group) return;

    const modelPosition = localModelRef.current.group.translation();

    let closestFrame: ExhibitionPainting | null = null;
    let minDistance = Infinity;
    const offset = 6;

    data.forEach((item) => {
      if (!item.position || item.position.length !== 3) return;
      const distance = new Vector3(
        modelPosition.x,
        modelPosition.y,
        modelPosition.z
      ).distanceTo(
        new Vector3(item.position[0], item.position[1], item.position[2])
      );
      if (distance < minDistance && distance < offset) {
        minDistance = distance;
        closestFrame = item;
      }
    });

    setCurrentFrame(closestFrame);
  });

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        mode !== "camera" &&
        event.key.toLowerCase() === "e" &&
        currentFrame
      ) {
        onShowPanel(currentFrame);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [mode, currentFrame, onShowPanel]);
  return (
    <>
      <ambientLight intensity={2} />
      <pointLight position={[10, 10, 10]} />
      <hemisphereLight
        groundColor={new Color(0xffffff)}
        intensity={1}
        position={[0, 50, 0]}
      />
      <directionalLight
        color={new Color(0xffffff)}
        intensity={1}
        position={[-8, 12, 8]}
        castShadow
      />
      <pointLight position={[0, 5, 5]} intensity={0.6} />
      <Environment preset="city" />
      <Physics timeStep={"vary"}>
        {persons.map((p) =>
          p.id === socket.id &&
          (mode === "first person" || mode === "third person") ? (
            <LocalModel
              key={p.id}
              modelId={p.id}
              hairColor={p.colors.hairColor}
              skinColor={p.colors.skinColor}
              mode={mode}
              position={p.position}
              rotation={p.rotation}
              localModelRef={localModelRef}
              localModelChatMessage={snap.localChatMessage}
              clearLocalChatMessage={() => (state.localChatMessage = null)}
            />
          ) : (
            p.id !== socket.id && (
              <RemoteModel
                key={p.id}
                modelId={p.id}
                hairColor={p.colors.hairColor}
                skinColor={p.colors.skinColor}
              />
            )
          )
        )}
        <RigidBody type="fixed" colliders="trimesh">
          <Exhibition scale={2} name="exhibition" />
        </RigidBody>
        <group ref={groupRef}>
          {data.map((item) => {
            return (
              <PaintingFrame
                key={item.paintingId}
                name={item.paintingId}
                onShowPanel={onShowPanel}
                mode={mode}
                isClose={currentFrame === item}
                isOpen={!!selectedItem}
                onPointerMissed={(e) =>
                  e.type === "click" &&
                  mode === "camera" &&
                  (state.current = null)
                }
                onPointerOver={(e) => {
                  if (mode !== "camera") return;
                  e.stopPropagation();
                  state.hovered = true;
                }}
                onPointerOut={() => {
                  if (mode !== "camera") return;
                  state.hovered = false;
                }}
                onClick={(e) => {
                  if (mode !== "camera") return;
                  e.stopPropagation();
                }}
                onMoveCamera={
                  mode === "camera" ? moveCameraToObject : undefined
                }
                item={item}
                position={
                  item.position
                    ? [item.position[0], item.position[1], item.position[2]]
                    : undefined
                }
                rotation={
                  item.rotation
                    ? [item.rotation[0], item.rotation[1], item.rotation[2]]
                    : undefined
                }
                scale={
                  item.scale
                    ? [item.scale[0], item.scale[1], item.scale[2]]
                    : undefined
                }
              />
            );
          })}
        </group>
      </Physics>
      {mode === "camera" && (
        <>
          <CameraControls
            ref={cameraControlsRef}
            makeDefault
            minDistance={1}
            maxDistance={9}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            enabled
            smoothTime={0.5}
            restThreshold={0.5}
            verticalDragToForward={false}
            dollyToCursor={false}
            infinityDolly={false}
          />
        </>
      )}
    </>
  );
}

export default function Exhibition3DPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snap = useSnapshot(state);
  const cameraControlsRef = useRef<CameraControls>(null);
  const { progress } = useProgress();
  const { data: exhibitionResponse, isLoading } = useGetExhibitionById(id);
  const [selectedItem, setSelectedItem] = useState<ExhibitionPainting | null>(
    null
  );
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { isOpenGuide } = useControls({
    "Chế độ xem": buttonGroup({
      Camera: () => (state.viewMode = "camera"),
      "Góc nhìn thứ nhất": () => (state.viewMode = "first person"),
      "Góc nhìn thứ ba": () => (state.viewMode = "third person"),
    }),
    isOpenGuide: {
      value: true,
      label: "Hướng dẫn điều khiển",
    },
  });
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (snap.viewMode !== "camera" && event.key.toLowerCase() === "t") {
        setIsChatOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [snap.viewMode]);

  useEffect(() => {
    if (snap.viewMode !== "camera") {
      setTimeout(() => {
        canvasRef.current?.requestPointerLock();
      }, 200);
    }
  }, [snap.viewMode]);
  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          zIndex: 1000,
        }}
      >
        Đang tải...
      </div>
    );
  }
  return (
    <>
      {snap.viewMode === "camera" && (
        <Arrows cameraControlsRef={cameraControlsRef} />
      )}
      <Button
        onClick={() => router.back()}
        className="fixed cursor-pointer top-6 left-4 z-50 bg-black/20 backdrop-blur-sm text-white p-5 rounded-full hover:bg-black/40 transition-all duration-200 shadow-lg"
      >
        <IconArrowLeft className="h-5 w-5" />
      </Button>
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 8, 3600] }}
        shadows
        onDoubleClick={() => {
          if (snap.viewMode === "camera") return;
          if (document.pointerLockElement) {
            document.exitPointerLock();
          } else {
            canvasRef.current?.requestPointerLock();
          }
        }}
      >
        <Suspense
          fallback={
            <Html
              center
              style={{
                color: "white",
                fontSize: "24px",
                textAlign: "center",
                whiteSpace: "nowrap",
                backgroundColor: "black",
              }}
            >
              <div>
                <p>Đang tải...</p>
                <p>
                  {progress === 100 ? "Hoàn thành" : `${progress.toFixed(0)}%`}
                </p>
              </div>
            </Html>
          }
        >
          <Exhibition3DScene
            data={
              exhibitionResponse?.data.exhibitionPaintings.filter(
                (item) =>
                  item.position !== null &&
                  item.rotation !== null &&
                  item.scale !== null
              ) || []
            }
            mode={snap.viewMode}
            cameraControlsRef={cameraControlsRef}
            canvasRef={canvasRef}
            onShowPanel={(item) => setSelectedItem(item)}
            selectedItem={selectedItem}
          />
          <Sparkles size={30} scale={80} count={800} />
          <Preload all />
        </Suspense>
      </Canvas>
      {snap.viewMode !== "camera" && isOpenGuide && (
        <Image
          className="fixed bottom-4 left-6 z-50 opacity-80"
          src={"/keyControlsAI.png"}
          alt="Key Controls"
          width={400}
          height={150}
        />
      )}
      {snap.viewMode !== "camera" &&
        isChatOpen &&
        (document.exitPointerLock(),
        (
          <ChatBox
            isOpen={isChatOpen}
            onClose={() => (
              canvasRef.current?.requestPointerLock(), setIsChatOpen(false)
            )}
            onSendCallback={(message: string) => {
              state.localChatMessage = message;
            }}
          />
        ))}

      {selectedItem &&
        (document.exitPointerLock(),
        (
          <Panel
            selectedItem={selectedItem}
            onClick={() => (
              snap.viewMode !== "camera" &&
                canvasRef.current?.requestPointerLock(),
              setSelectedItem(null)
            )}
          />
        ))}
    </>
  );
}
