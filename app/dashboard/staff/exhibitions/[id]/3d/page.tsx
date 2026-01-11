"use client";
import { updateExhibition3D, useGetExhibitionById } from "@/apis/exhibition";
import { Exhibition, PaintingFrame, Arrows } from "@/components/3d";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  CameraMovementOptions,
  useCameraMovement,
} from "@/lib/useCameraMovement";
import { Exhibition3DItem, ExhibitionPainting } from "@/types";
import {
  CameraControls,
  Environment,
  Html,
  Preload,
  Sparkles,
  TransformControls,
  useCursor,
  useProgress,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { IconArrowLeft } from "@tabler/icons-react";
import { button, buttonGroup, folder, useControls } from "leva";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  Suspense,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { Color, Group } from "three";
import { proxy, useSnapshot } from "valtio";

const state = proxy<{
  current: string | null;
  mode: number;
  hovered: boolean;
  data: ExhibitionPainting[];
}>({
  current: null,
  mode: 0,
  hovered: false,
  data: [],
});
const modes: ["translate", "rotate", "scale"] = [
  "translate",
  "rotate",
  "scale",
];

interface Exhibition3DSceneProps {
  cameraControlsRef: React.RefObject<CameraControls | null>;
  data: ExhibitionPainting[];
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  exhibitionId: string;
}

function Exhibition3DScene({
  exhibitionId,
  cameraControlsRef,
  data,
  setOpenDrawer,
}: Exhibition3DSceneProps) {
  const snap = useSnapshot(state);
  const scene = useThree((state) => state.scene);
  useCursor(snap.hovered);
  const moveCameraToObject = useCameraMovement(cameraControlsRef);
  const groupRef = useRef<Group>(null);
  const { mutate } = updateExhibition3D();
  useControls(
    {
      "Danh sách": folder(
        (() => {
          const obj: Record<string, any> = {};
          state.data
            .sort((a, b) => Number(a.award?.rank) - Number(b.award?.rank))
            .forEach((item) => {
              obj[`${item.title}`] = buttonGroup({
                "Di chuyển camera": () => {
                  const mesh = scene.getObjectByName(item.paintingId);
                  if (mesh) {
                    const options: CameraMovementOptions = { zoom: 1.2 };
                    moveCameraToObject(mesh, options);
                  }
                },
                "Đặt lại vị trí": () => {
                  const originalItem = data.find(
                    (p) => p.paintingId === item.paintingId
                  );
                  if (originalItem && originalItem.position) {
                    // Reset the mesh position to original API position
                    const mesh = scene.getObjectByName(item.paintingId);
                    if (mesh) {
                      mesh.position.set(
                        originalItem.position[0],
                        originalItem.position[1],
                        originalItem.position[2]
                      );
                      // Also reset rotation and scale if they exist
                      if (originalItem.rotation) {
                        mesh.rotation.set(
                          originalItem.rotation[0],
                          originalItem.rotation[1],
                          originalItem.rotation[2]
                        );
                      }
                      if (originalItem.scale) {
                        mesh.scale.set(
                          originalItem.scale[0],
                          originalItem.scale[1],
                          originalItem.scale[2]
                        );
                      }
                      toast.success(`Đã đặt lại vị trí cho "${item.title}"`);
                    }
                  } else {
                    // Fallback to default position
                    const mesh = scene.getObjectByName(item.paintingId);
                    if (mesh) {
                      mesh.position.set(0, 0, 0);
                      mesh.rotation.set(0, 0, 0);
                      mesh.scale.set(1, 1, 1);
                      toast.success(
                        `Đã đặt lại vị trí về mặc định cho "${item.title}"`
                      );
                    }
                  }
                },
                Xóa: () => {
                  state.data = state.data.filter(
                    (p) => p.paintingId !== item.paintingId
                  );

                  const mesh = scene.getObjectByName(item.paintingId);
                  if (mesh) {
                    scene.remove(mesh);
                  }

                  if (state.current === item.paintingId) {
                    state.current = null;
                  }
                },
              });
            });
          return obj;
        })(),
        { collapsed: true } // Optional: starts collapsed
      ),
      "Thêm tranh": button(() => {
        setOpenDrawer(true);
      }),
      "Lưu thay đổi": button(
        () => {
          if (!groupRef.current) {
            toast.error("Không có gì để lưu");
            return;
          }

          const items: Exhibition3DItem[] = groupRef.current.children.map(
            (child) => ({
              paintingId: child.name,
              position: child.position.toArray(),
              rotation: child.rotation.toArray(),
              scale: child.scale.toArray(),
            })
          );

          const restItem = state.data.filter(
            (item) =>
              !items?.some((child) => child.paintingId === item.paintingId)
          );
          restItem.forEach((item) => {
            items?.push({
              paintingId: item.paintingId,
              position: null,
              rotation: null,
              scale: null,
            });
          });
          mutate({
            exhibitionId,
            data: items,
          });
        }
        // {
        //   disabled: !groupRef.current || snap.data.length === 0,
        // }
      ),
    },
    [snap.data]
  );

  useEffect(() => {
    state.data = data.filter(
      (item) => item.position && item.rotation && item.scale
    );
  }, [data]);
  return (
    <mesh>
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
      <group ref={groupRef}>
        {state.data.map((item) => {
          return (
            <Suspense key={item.paintingId} fallback={null}>
              <PaintingFrame
                name={item.paintingId}
                onPointerMissed={(e) =>
                  e.type === "click" && (state.current = null)
                }
                onContextMenu={(e) =>
                  snap.current === item.paintingId &&
                  (e.stopPropagation(),
                  (state.mode = (snap.mode + 1) % modes.length))
                }
                onPointerOver={(e) => {
                  e.stopPropagation();
                  state.hovered = true;
                }}
                onPointerOut={() => {
                  state.hovered = false;
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  state.current = item.paintingId;
                }}
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
            </Suspense>
          );
        })}
        /
      </group>
      <Exhibition />
      {snap.current && (
        <TransformControls
          object={scene.getObjectByName(snap.current)}
          mode={modes[snap.mode]}
        />
      )}
      <CameraControls
        ref={cameraControlsRef}
        makeDefault
        minDistance={1}
        maxDistance={9}
        enabled
        smoothTime={0.5}
        restThreshold={0.5}
        verticalDragToForward={false}
        dollyToCursor={false}
        infinityDolly={false}
      />
    </mesh>
  );
}

export default function Exhibition3DPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const cameraControlsRef = useRef<CameraControls>(null);
  const { progress } = useProgress();
  const { data: exhibitionResponse, isLoading } = useGetExhibitionById(id);

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
      <Arrows cameraControlsRef={cameraControlsRef} />
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-bold">
              {exhibitionResponse?.data.name || "Exhibition Paintings"}
            </DrawerTitle>
            <DrawerDescription>
              {exhibitionResponse?.data.exhibitionPaintings?.length || 0}{" "}
              paintings in this exhibition
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {exhibitionResponse?.data.exhibitionPaintings
                ?.sort((a, b) =>
                  a.award && b.award ? a.award.rank - b.award.rank : 0
                )
                .map((painting) => {
                  const isAdded = state.data.some(
                    (p) => p.paintingId === painting.paintingId
                  );

                  return (
                    <div
                      key={painting.paintingId}
                      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 ${
                        isAdded
                          ? "cursor-not-allowed"
                          : "cursor-pointer hover:opacity-90 hover:scale-105"
                      } relative`}
                      onClick={() => {
                        if (!isAdded) {
                          state.data.push(painting);
                          toast.success(
                            `Đã thêm "${painting.title}" vào triển lãm 3D`
                          );
                          setOpen(false);
                        }
                      }}
                    >
                      <div className="aspect-video relative">
                        <img
                          src={painting.imageUrl}
                          alt={painting.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {painting.award && (
                          <div className="absolute top-1 right-1">
                            <span className="bg-yellow-500 text-white text-xs font-bold px-1.5 py-0.5 rounded shadow-sm">
                              #{painting.award.rank}
                            </span>
                          </div>
                        )}
                        {isAdded && (
                          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                            <span className="text-white font-bold text-sm px-3 py-1 rounded">
                              Đã thêm
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-2">
                        <h3 className="font-medium text-sm text-gray-900 line-clamp-1 mb-1">
                          {painting.title}
                        </h3>
                        <p className="text-xs text-gray-600 mb-1">
                          by {painting.competitor.fullName}
                        </p>

                        {painting.award && (
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-xs font-medium text-yellow-600">
                              🏆 {painting.award.name}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="truncate">
                            {painting.competitor.grade}
                          </span>
                          <span className="truncate ml-1">
                            {painting.competitor.schoolName}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }) || []}
            </div>

            {(!exhibitionResponse?.data.exhibitionPaintings ||
              exhibitionResponse.data.exhibitionPaintings.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>No paintings in this exhibition yet.</p>
              </div>
            )}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button className="cursor-pointer" variant="outline">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Button
        onClick={() => router.back()}
        className="fixed cursor-pointer top-6 left-4 z-50 bg-black/20 backdrop-blur-sm text-white p-5 rounded-full hover:bg-black/40 transition-all duration-200 shadow-lg"
      >
        <IconArrowLeft className="h-5 w-5" />
      </Button>
      <Canvas camera={{ position: [0, 3, 5], fov: 50, rotateX: 0 }} shadows>
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
            exhibitionId={id}
            data={exhibitionResponse?.data.exhibitionPaintings || []}
            cameraControlsRef={cameraControlsRef}
            setOpenDrawer={setOpen}
          />
          <Sparkles size={30} scale={80} count={800} />
          <Preload all />
        </Suspense>
      </Canvas>
    </>
  );
}
