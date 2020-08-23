// @flow

// "viewport" rectangle is { top, left, width, height }

// "scaled" means that data structure stores (0, 1) coordinates.
// for clarity reasons I decided not to store actual (0, 1) coordinates, but
// provide width and height, so user can compute ratio himself if needed

import type {T_LTWH, T_Scaled, T_VIEWPORT} from "../types";

type WIDTH_HEIGHT = { width: number, height: number };

export const viewportToScaled = (
    rect: T_LTWH,
    {width, height}: WIDTH_HEIGHT,
    scale: string,
    rotation: string
): T_Scaled => {
    return {
        x1: rect.left,
        y1: rect.top,

        x2: rect.left + rect.width,
        y2: rect.top + rect.height,

        width,
        height
    };
};

const pdfToViewport = (pdf, viewport, currentScaleValue: string,
                       rotation: string): T_LTWH => {
    const [x1, y1, x2, y2] = viewport.convertToViewportRectangle([
        pdf.x1,
        pdf.y1,
        pdf.x2,
        pdf.y2
    ]);

    return {
        left: x1,
        top: y1,

        width: x2 - x1,
        height: y1 - y2
    };
};

export const scaledToViewport = (
    scaled: T_Scaled,
    viewport: T_VIEWPORT,
    scale: number,
    rotation: number,
    usePdfCoordinates: boolean = false
): T_LTWH => {
    if (usePdfCoordinates) {
        return pdfToViewport(scaled, viewport, scale, rotation);
    }

    const {x1, x2, y1, y2} = scaled;
    const w = x2 - x1;
    const h = y2 - y1;
    const absRot = Math.abs(rotation);
    const {width: vWidth, height: vHeight} = viewport;
    let left = x1 * scale;
    let top = y1 * scale;
    switch (rotation) {
        case -90:
            left = top;
            top = vHeight - x2 * scale;
            break;
        case 90:
            top = left;
            left = vWidth - y2 * scale;
            break;
        case 180: case -180:
            left = vWidth - x2 * scale;
            top = vHeight - y2 * scale;
            break;
    }
    const height = (absRot === 90 ? w : h) * scale;
    const width = (absRot === 90 ? h : w) * scale;
    return {height, width, left, top};
};
