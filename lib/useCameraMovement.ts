import { CameraControls } from "@react-three/drei";
import { RefObject, useCallback } from "react";
import { Box3, Object3D, Vector3 } from "three";

export interface CameraMovementOptions {
  offsetX?: number;
  offsetY?: number;
  offsetZ?: number;
  zoom?: number; // Zoom multiplier (default 1). <1 for zoom in, >1 for zoom out.
}

export type CameraMoveAction = "up" | "down" | "left" | "right";

export function move({
  action,
  cameraControlsRef,
  distance = 3,
}: {
  action: CameraMoveAction;
  cameraControlsRef: RefObject<CameraControls | null>;
  distance?: number;
}) {
  if (!cameraControlsRef.current) return;
  switch (action) {
    case "up":
      cameraControlsRef.current.forward(distance, true);
      break;
    case "right":
      cameraControlsRef.current.truck(distance, 0, true);

      break;
    case "down":
      cameraControlsRef.current.forward(-distance, true);
      break;
    case "left":
      cameraControlsRef.current.truck(-distance, 0, true);
      break;
  }
}

export function useCameraMovement(
  cameraControlRef: RefObject<CameraControls | null>
) {
  const moveCameraToObject = useCallback(
    async (object: Object3D, options: CameraMovementOptions = {}) => {
      if (!cameraControlRef.current) return;
      cameraControlRef.current.cancel();

      const box = new Box3().setFromObject(object);
      const sizeVec = box.getSize(new Vector3());
      const center = box.getCenter(new Vector3());

      const forward = new Vector3();
      object.getWorldDirection(forward);

      const distance =
        Math.max(sizeVec.x, sizeVec.y, sizeVec.z) * 0.5 * (options.zoom ?? 1);
      const targetPosition = center
        .clone()
        .add(forward.clone().multiplyScalar(distance))
        .add(
          new Vector3(
            options.offsetX ?? 0,
            options.offsetY ?? 0,
            options.offsetZ ?? 0
          )
        );

      const lookAtTarget = center;

      await cameraControlRef.current.setLookAt(
        targetPosition.x,
        targetPosition.y,
        targetPosition.z,
        lookAtTarget.x,
        lookAtTarget.y,
        lookAtTarget.z,
        true
      );
    },
    [cameraControlRef]
  );
  return moveCameraToObject;
}
