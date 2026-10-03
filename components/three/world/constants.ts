import { Vector3 } from 'three';

export const CAMERA_FOV = 35;
/** Distance from the camera to the plane the ring lives on, so layout can use half-viewports. */
export const VIEW_DISTANCE = 6;

/** The projector beam's direction in the frame: from the lens leftward and slightly down. */
export const BEAM_DIR = new Vector3(-1, -0.26, 0.1).normalize();
