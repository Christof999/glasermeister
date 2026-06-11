/** Blickrichtung in der Sphäre: Maus-Ziel, Drag-Versatz und Eigendrehung. */
export type LookState = {
  yaw: number;
  pitch: number;
  mouseYaw: number;
  mousePitch: number;
  dragYaw: number;
  dragPitch: number;
  drift: number;
};

export function createLookState(): LookState {
  return { yaw: 0, pitch: 0, mouseYaw: 0, mousePitch: 0, dragYaw: 0, dragPitch: 0, drift: 0 };
}
