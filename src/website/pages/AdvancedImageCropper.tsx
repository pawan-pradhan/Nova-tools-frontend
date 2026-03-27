import { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";

export default function AdvancedImageCropper() {
    const [image, setImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [aspect, setAspect] = useState<number | undefined>(1);
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);
    const [isCircle, setIsCircle] = useState(false);

    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);

    // Upload
    const onSelectFile = (file: File) => {
        const url = URL.createObjectURL(file);
        setImage(url);
        setCroppedImage(null); // reset preview
    };

    // Drag Drop
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) {
            onSelectFile(e.dataTransfer.files[0]);
        }
    };

    const onCropComplete = useCallback((_: any, areaPixels: any) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    const createImage = (url: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });

    const getCroppedImg = async () => {
        if (!image || !croppedAreaPixels) return;

        const img = await createImage(image);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        const { width, height, x, y } = croppedAreaPixels;

        canvas.width = width;
        canvas.height = height;

        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

        ctx.drawImage(
            img,
            x,
            y,
            width,
            height,
            -width / 2,
            -height / 2,
            width,
            height
        );

        ctx.restore();

        if (isCircle) {
            ctx.globalCompositeOperation = "destination-in";
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        setCroppedImage(canvas.toDataURL("image/png"));
    };

    const downloadImage = () => {
        if (!croppedImage) return;
        const link = document.createElement("a");
        link.href = croppedImage;
        link.download = "cropped.png";
        link.click();
    };

    const resetAll = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
        setIsCircle(false);
    };

    const aspectOptions = [
        { label: "1:1", value: 1 },
        { label: "16:9", value: 16 / 9 },
        { label: "4:3", value: 4 / 3 },
        { label: "Free", value: undefined },
    ];

    // 🔥 Real-time preview debounce
    useEffect(() => {
        if (!image || !croppedAreaPixels) return;

        const t = setTimeout(() => {
            getCroppedImg();
        }, 200);

        return () => clearTimeout(t);
    }, [crop, zoom, rotation, flipH, flipV, isCircle, aspect]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#0f172a] text-white p-4">

            <div className="max-w-6xl mx-auto flex gap-6">

                {/* MAIN */}
                <div className="flex-1 flex flex-col items-center">

                    <h2 className="text-2xl font-bold mb-4">🖼️ Image Crop Tool</h2>

                    <AdBanner />

                    {!image && (
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => document.getElementById("fileInput")?.click()}
                            className="w-full max-w-md border-2 border-dashed border-gray-500 p-8 text-center rounded-xl cursor-pointer"
                        >
                            Upload / Drag Image
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    e.target.files && onSelectFile(e.target.files[0])
                                }
                                className="hidden"
                            />
                        </div>
                    )}

                    {image && (
                        <>
                            <div className="relative w-full max-w-md h-[300px] bg-black rounded-xl overflow-hidden">
                                <Cropper
                                    image={image}
                                    crop={crop}
                                    zoom={zoom}
                                    rotation={rotation}
                                    aspect={aspect}
                                    cropShape={isCircle ? "round" : "rect"}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onRotationChange={setRotation}
                                    onCropComplete={onCropComplete}
                                />
                            </div>

                            {/* Controls */}
                            <div className="w-full max-w-md mt-4 space-y-3">

                                {/* Aspect */}
                                <div className="flex gap-2 flex-wrap">
                                    {aspectOptions.map((a) => (
                                        <button
                                            key={a.label}
                                            onClick={() => setAspect(a.value)}
                                            className="bg-[#1e293b] px-3 py-1 rounded"
                                        >
                                            {a.label}
                                        </button>
                                    ))}
                                </div>

                                <input type="range" min={1} max={3} step={0.1} value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))} />

                                <input type="range" min={0} max={360} value={rotation}
                                    onChange={(e) => setRotation(Number(e.target.value))} />

                                <div className="grid grid-cols-3 gap-2">
                                    <button onClick={() => setFlipH(!flipH)}>Flip H</button>
                                    <button onClick={() => setFlipV(!flipV)}>Flip V</button>
                                    <button onClick={() => setIsCircle(!isCircle)}>Circle</button>
                                </div>

                                <div className="flex gap-2">
                                    <button onClick={getCroppedImg} className="bg-green-500 w-full py-2 rounded">Crop</button>
                                    <button onClick={downloadImage} className="bg-blue-500 w-full py-2 rounded">Download</button>
                                </div>

                                {/* EXTRA */}
                                <div className="flex gap-2">
                                    <button onClick={resetAll} className="bg-gray-500 w-full py-2 rounded">Reset</button>
                                    <button onClick={() => setImage(null)} className="bg-red-500 w-full py-2 rounded">Change Image</button>
                                </div>

                            </div>

                            {/* Preview */}
                            {croppedImage && (
                                <div className="mt-4 w-full max-w-md">
                                    <img src={croppedImage} className="rounded-xl" />
                                </div>
                            )}
                        </>
                    )}

                    {/* SEO */}
                    <div className="mt-10 max-w-xl text-sm text-gray-300">
                        <h2>Free Image Crop Tool</h2>
                        <p>Crop, rotate, flip and download images online.</p>

                        <p>
                            Try more:{" "}
                            <a href="/image-compressor">Image Compressor</a> |{" "}
                            <a href="/png-to-jpg">PNG to JPG</a>
                        </p>
                    </div>

                </div>

                {/* SIDEBAR */}
                <div className="w-64 hidden lg:block">
                    <AdBanner />
                </div>

            </div>
        </div>
    );
}

const AdBanner = () => (
    <div className="h-16 bg-gray-700 flex items-center justify-center rounded">
        Ad Space
    </div>
);









// import { useState, useEffect, useCallback } from "react";
// import Cropper from "react-easy-crop";

// export default function AdvancedImageCropper() {
//     const [image, setImage] = useState<string | null>(null);
//     const [crop, setCrop] = useState({ x: 0, y: 0 });
//     const [zoom, setZoom] = useState(1);
//     const [rotation, setRotation] = useState(0);
//     const [aspect, setAspect] = useState<number | undefined>(1);
//     const [flipH, setFlipH] = useState(false);
//     const [flipV, setFlipV] = useState(false);
//     const [isCircle, setIsCircle] = useState(false);

//     const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
//     const [croppedImage, setCroppedImage] = useState<string | null>(null);

//     // Upload
//     const onSelectFile = (file: File) => {
//         const url = URL.createObjectURL(file);
//         setImage(url);
//     };

//     // Drag Drop
//     const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         if (e.dataTransfer.files?.[0]) {
//             onSelectFile(e.dataTransfer.files[0]);
//         }
//     };

//     // Crop complete
//     const onCropComplete = useCallback((_: any, areaPixels: any) => {
//         setCroppedAreaPixels(areaPixels);
//     }, []);

//     // Load image
//     const createImage = (url: string) =>
//         new Promise<HTMLImageElement>((resolve, reject) => {
//             const img = new Image();
//             img.src = url;
//             img.onload = () => resolve(img);
//             img.onerror = reject;
//         });

//     // Crop logic
//     // const getCroppedImg = async () => {
//     //     if (!image || !croppedAreaPixels) return;

//     //     const img = await createImage(image);
//     //     const canvas = document.createElement("canvas");
//     //     const ctx = canvas.getContext("2d");

//     //     if (!ctx) return;

//     //     canvas.width = croppedAreaPixels.width;
//     //     canvas.height = croppedAreaPixels.height;

//     //     ctx.save();

//     //     // Move to center
//     //     ctx.translate(canvas.width / 2, canvas.height / 2);

//     //     // Rotate
//     //     ctx.rotate((rotation * Math.PI) / 180);

//     //     // Flip
//     //     ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

//     //     // Draw image
//     //     ctx.drawImage(
//     //     img,
//     //     croppedAreaPixels.x,
//     //     croppedAreaPixels.y,
//     //     croppedAreaPixels.width,
//     //     croppedAreaPixels.height,
//     //     -canvas.width / 2,
//     //     -canvas.height / 2,
//     //     canvas.width,
//     //     canvas.height
//     //     );

//     //     ctx.restore();

//     //     // Circle crop
//     //     if (isCircle) {
//     //     ctx.globalCompositeOperation = "destination-in";
//     //     ctx.beginPath();
//     //     ctx.arc(
//     //         canvas.width / 2,
//     //         canvas.height / 2,
//     //         canvas.width / 2,
//     //         0,
//     //         Math.PI * 2
//     //     );
//     //     ctx.closePath();
//     //     ctx.fill();
//     //     }

//     //     const base64 = canvas.toDataURL("image/png");
//     //     setCroppedImage(base64);
//     // };

//     const getCroppedImg = async () => {
//         if (!image || !croppedAreaPixels) return;

//         const img = await createImage(image);

//         const canvas = document.createElement("canvas");
//         const ctx = canvas.getContext("2d");

//         if (!ctx) return;

//         const { width, height, x, y } = croppedAreaPixels;

//         canvas.width = width;
//         canvas.height = height;

//         ctx.save();

//         // Move to center
//         ctx.translate(width / 2, height / 2);

//         // Rotate
//         ctx.rotate((rotation * Math.PI) / 180);

//         // Flip
//         ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

//         // Draw from original image (IMPORTANT FIX)
//         ctx.drawImage(
//             img,
//             x,
//             y,
//             width,
//             height,
//             -width / 2,
//             -height / 2,
//             width,
//             height
//         );

//         ctx.restore();

//         // Circle crop
//         if (isCircle) {
//             ctx.globalCompositeOperation = "destination-in";
//             ctx.beginPath();
//             ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
//             ctx.fill();
//         }

//         setCroppedImage(canvas.toDataURL("image/png"));
//     };

//     // Download
//     const downloadImage = () => {
//         if (!croppedImage) return;

//         const link = document.createElement("a");
//         link.href = croppedImage;
//         link.download = "cropped.png";
//         link.click();
//     };

//     // Aspect options
//     const aspectOptions = [
//         { label: "1:1", value: 1 },
//         { label: "16:9", value: 16 / 9 },
//         { label: "4:3", value: 4 / 3 },
//         { label: "Free", value: undefined },
//     ];

//     useEffect(() => {
//         if (!image || !croppedAreaPixels) return;

//         const delayDebounce = setTimeout(() => {
//             getCroppedImg();
//         }, 300); // 👈 smooth performance

//         return () => clearTimeout(delayDebounce);
//     }, [
//         crop,
//         zoom,
//         rotation,
//         flipH,
//         flipV,
//         isCircle,
//         aspect,
//     ]);

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#0f172a] text-white p-4 flex flex-col items-center">

//             <h2 className="text-2xl font-bold mb-4">🖼️ Advanced Image Tool</h2>

//             {/* Upload */}
//             {!image && (
//                 <div
//                     onDrop={handleDrop}
//                     onDragOver={(e) => e.preventDefault()}
//                     onClick={() => document.getElementById("fileInput")?.click()}
//                     className="w-full max-w-md border-2 border-dashed border-gray-500 p-8 text-center rounded-xl cursor-pointer hover:border-blue-400 transition"
//                 >
//                     <p>📁 Drag & Drop Image</p>
//                     <p className="text-sm text-gray-400">or Click to Upload</p>

//                     <input
//                         id="fileInput"
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) =>
//                             e.target.files && onSelectFile(e.target.files[0])
//                         }
//                         className="hidden"
//                     />
//                 </div>
//             )}

//             {/* Cropper */}
//             {image && (
//                 <>
//                     <div className="relative w-full max-w-md h-[300px] bg-black rounded-xl overflow-hidden">
//                         <Cropper
//                             image={image}
//                             crop={crop}
//                             zoom={zoom}
//                             rotation={rotation}
//                             aspect={aspect}
//                             cropShape={isCircle ? "round" : "rect"}
//                             onCropChange={setCrop}
//                             onZoomChange={setZoom}
//                             onRotationChange={setRotation}
//                             onCropComplete={onCropComplete}
//                         />
//                     </div>

//                     {/* Controls */}
//                     <div className="w-full max-w-md mt-4 space-y-4">

//                         {/* Aspect */}
//                         <div className="flex gap-2 flex-wrap">
//                             {aspectOptions.map((item) => (
//                                 <button
//                                     key={item.label}
//                                     onClick={() => setAspect(item.value)}
//                                     className={`px-3 py-1 rounded-lg text-sm ${aspect === item.value ? "bg-blue-500" : "bg-[#1e293b]"
//                                         }`}
//                                 >
//                                     {item.label}
//                                 </button>
//                             ))}
//                         </div>

//                         {/* Zoom */}
//                         <div>
//                             <label className="text-sm text-gray-300">Zoom</label>
//                             <input
//                                 type="range"
//                                 min={1}
//                                 max={3}
//                                 step={0.1}
//                                 value={zoom}
//                                 onChange={(e) => setZoom(Number(e.target.value))}
//                                 className="w-full accent-blue-500"
//                             />
//                         </div>

//                         {/* Rotate */}
//                         <div>
//                             <label className="text-sm text-gray-300">Rotate</label>
//                             <input
//                                 type="range"
//                                 min={0}
//                                 max={360}
//                                 value={rotation}
//                                 onChange={(e) => setRotation(Number(e.target.value))}
//                                 className="w-full accent-purple-500"
//                             />
//                         </div>

//                         {/* Flip & Circle */}
//                         <div className="grid grid-cols-3 gap-2">
//                             <button
//                                 onClick={() => setFlipH(!flipH)}
//                                 className={`py-2 rounded-lg ${flipH ? "bg-blue-500" : "bg-[#1e293b]"
//                                     }`}
//                             >
//                                 ↔ Flip H
//                             </button>

//                             <button
//                                 onClick={() => setFlipV(!flipV)}
//                                 className={`py-2 rounded-lg ${flipV ? "bg-blue-500" : "bg-[#1e293b]"
//                                     }`}
//                             >
//                                 ↕ Flip V
//                             </button>

//                             <button
//                                 onClick={() => setIsCircle(!isCircle)}
//                                 className={`py-2 rounded-lg ${isCircle ? "bg-purple-500" : "bg-[#1e293b]"
//                                     }`}
//                             >
//                                 ⭕ Circle
//                             </button>
//                         </div>

//                         {/* Buttons */}
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={getCroppedImg}
//                                 className="w-full bg-green-500 hover:bg-green-600 py-2 rounded-lg font-semibold"
//                             >
//                                 ✂ Crop
//                             </button>

//                             <button
//                                 onClick={downloadImage}
//                                 className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg font-semibold"
//                             >
//                                 ⬇ Download
//                             </button>
//                         </div>
//                     </div>

//                     {/* Preview */}
//                     {croppedImage && (
//                         <div className="mt-4 w-full max-w-md">
//                             <p className="text-sm text-gray-400 mb-2">Preview</p>
//                             <img
//                                 src={croppedImage}
//                                 className="w-full rounded-xl border border-white/10"
//                             />
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// }