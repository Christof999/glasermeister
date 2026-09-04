/** Blickrichtung in der Sphäre: Maus-Ziel, Drag-Versatz und Eigendrehung. */
export type LookState = {
  yaw: number;
  pitch: number;
  mouseYaw: number;
  mousePitch: number;
  dragYaw: number;
  dragPitch: number;
  drift: number;
  /** true, solange eine Kachel anvisiert wird – pausiert die Eigendrehung */
  hold: boolean;
  /** true, sobald zuletzt mit der Maus gezeigt wurde. Bei Touch bleibt nach
   *  dem Loslassen kein Zeiger auf dem Schirm, dort darf der Hover nicht
   *  weiter nachgeführt werden. */
  usesMouse: boolean;
};

export function createLookState(): LookState {
  return {
    yaw: 0,
    pitch: 0,
    mouseYaw: 0,
    mousePitch: 0,
    dragYaw: 0,
    dragPitch: 0,
    drift: 0,
    hold: false,
    usesMouse: false,
  };
}
