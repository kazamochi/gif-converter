declare module 'imagetracerjs' {
    interface ImageTracerOptions {
        ltres?: number;
        qtres?: number;
        pathomit?: number;
        colorsampling?: number;
        numberofcolors?: number;
        blurradius?: number;
        strokewidth?: number;
        scale?: number;
        roundcoords?: number;
        desc?: boolean;
        viewbox?: boolean;
        colorquantcycles?: number;
        pal?: Array<{ r: number; g: number; b: number; a: number }>;
    }

    function imageToSVG(
        url: string,
        callback: (svgString: string) => void,
        options?: ImageTracerOptions
    ): void;

    function imagedataToSVG(
        imageData: ImageData,
        options?: ImageTracerOptions
    ): string;

    export { imageToSVG, imagedataToSVG, ImageTracerOptions };
}
