import { useState } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import AdBanner from "../../components/AdBanner";

export default function BgRemove() {
    const [image, setImage] = useState<File | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [bgImage, setBgImage] = useState<File | null>(null);
    const [bgColor, setBgColor] = useState<string>("#000000");
    const [finalImage, setFinalImage] = useState<string | null>(null);
    const [bgPreview, setBgPreview] = useState<string | null>(null);

    const colors = ["#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", "#facc15"];

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setResult(null);
            setFinalImage(null);
            setError(null);
        }
    };

    const handleRemove = async () => {
        if (!image) {
            setError("⚠️ Please select an image first");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("image", image);

            // const res = await fetch("http://localhost:5000/remove-bg-ai", {
            const res = await fetch("https://nova-tools-backend.onrender.com:5000/remove-bg-ai", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to remove background");

            const blob = await res.blob();
            setResult(URL.createObjectURL(blob));
            setFinalImage(null);
        } catch (err) {
            console.error(err);
            setError("Something went wrong! Make sure the server is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!result) return;

        const a = document.createElement("a");
        a.href = result;
        a.download = "removed-bg.png";
        a.click();
    };

    const handleBgUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setBgImage(file);
            const previewUrl = URL.createObjectURL(file);

            // Clean up old preview URL to prevent memory leaks
            if (bgPreview) {
                URL.revokeObjectURL(bgPreview);
            }

            setBgPreview(previewUrl);
            setFinalImage(null);
        }
    };

    const clearBgImage = () => {
        if (bgPreview) {
            URL.revokeObjectURL(bgPreview);
        }
        setBgImage(null);
        setBgPreview(null);
        setFinalImage(null);
    };

    const applyBackground = () => {
        if (!result) {
            setError("⚠️ Please remove background first");
            return;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const fgImg = new Image();
        fgImg.src = result;

        fgImg.onload = () => {
            canvas.width = fgImg.width;
            canvas.height = fgImg.height;

            // Check if we should use image background or color
            const useImageBackground = bgImage !== null && bgPreview !== null;

            if (useImageBackground) {
                // Use uploaded image as background
                const bgImg = new Image();
                bgImg.src = bgPreview!;

                bgImg.onload = () => {
                    ctx?.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
                    ctx?.drawImage(fgImg, 0, 0);
                    setFinalImage(canvas.toDataURL("image/png"));
                    setError(null);
                };

                bgImg.onerror = () => {
                    setError("Failed to load background image");
                };
            } else {
                // Use solid color background
                if (ctx) {
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(fgImg, 0, 0);
                    setFinalImage(canvas.toDataURL("image/png"));
                    setError(null);
                }
            }
        };

        fgImg.onerror = () => {
            setError("Failed to load foreground image");
        };
    };

    const downloadFinalImage = () => {
        if (!finalImage) return;

        const a = document.createElement("a");
        a.href = finalImage;
        a.download = "final-with-bg.png";
        a.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#020617] text-white flex justify-center p-6">

            <div className="w-full max-w-7xl flex gap-6">

                {/* MAIN CONTENT */}
                <div className="flex-1">
                    <div className="w-full bg-[#0b1220] rounded-2xl shadow-xl p-6 space-y-8">

                        {/* Header */}
                        <div className="text-center">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                                Background Remover
                            </h1>
                            <p className="text-gray-400 mt-2">Remove & customize background with ease</p>
                        </div>

                        {/* TOP AD */}
                        <AdBanner />

                        {/* Upload Section */}
                        <div className="flex flex-col items-center gap-4">
                            <label className="w-full max-w-md h-40 border-2 border-dashed border-gray-600 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:border-green-500 hover:bg-[#0f172a] transition-all group">
                                <div className="text-center">
                                    <i className="fas fa-cloud-upload-alt text-3xl text-gray-500 group-hover:text-green-400 mb-2"></i>
                                    <p className="text-sm text-gray-400">
                                        {image ? image.name : "Click or drag to upload image"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG supported (Max 10MB)</p>
                                </div>
                                <input type="file" onChange={handleUpload} accept="image/*" className="hidden" />
                            </label>

                            <button
                                onClick={handleRemove}
                                disabled={loading || !image}
                                className={`bg-gradient-to-r from-green-500 to-green-600 px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${loading || !image ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:scale-105"
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-magic"></i>
                                        Remove Background
                                    </>
                                )}
                            </button>

                            {error && (
                                <div className="bg-red-500/20 border border-red-500 rounded-lg px-4 py-2 text-red-400 text-sm flex items-center gap-2">
                                    <i className="fas fa-exclamation-circle"></i>
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Image Preview Section */}
                        {(image || result) && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Original Image */}
                                {image && (
                                    <div className="bg-[#020617] rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                                <i className="fas fa-image"></i>
                                                Original Image
                                            </p>
                                            <span className="text-xs text-gray-500">{image.name}</span>
                                        </div>
                                        <div className="bg-[#0a0f1a] rounded-lg p-2 flex justify-center min-h-[250px] items-center">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt="original"
                                                className="max-h-[280px] w-auto object-contain rounded-lg"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Removed BG Result */}
                                {result && (
                                    <div className="bg-[#020617] rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                                <i className="fas fa-cut"></i>
                                                Background Removed
                                            </p>
                                            <button
                                                onClick={handleDownload}
                                                className="text-xs bg-blue-500/20 hover:bg-blue-500/30 px-3 py-1 rounded-lg transition flex items-center gap-1"
                                            >
                                                <i className="fas fa-download"></i>
                                                Download
                                            </button>
                                        </div>
                                        <div className="bg-[#0a0f1a] rounded-lg p-2 flex justify-center min-h-[250px] items-center">
                                            <img
                                                src={result}
                                                alt="removed bg"
                                                className="max-h-[280px] w-auto object-contain rounded-lg"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Background Customization Section */}
                        {result && (
                            <div className="bg-[#020617] rounded-xl p-6 space-y-6">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <i className="fas fa-palette text-purple-400"></i>
                                    Customize Background
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Background Image Option */}
                                    <div className="space-y-3">
                                        <label className="text-sm text-gray-400 flex items-center gap-2">
                                            <i className="fas fa-image"></i>
                                            Upload Background Image
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <label className="flex-1 cursor-pointer">
                                                <div className={`border-2 border-dashed rounded-lg p-3 text-center transition ${bgPreview ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 hover:border-purple-500'
                                                    }`}>
                                                    <i className="fas fa-upload text-gray-500 mb-1"></i>
                                                    <p className="text-xs text-gray-500">
                                                        {bgPreview ? 'Change background image' : 'Click to upload'}
                                                    </p>
                                                </div>
                                                <input
                                                    type="file"
                                                    onChange={handleBgUpload}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                            </label>
                                            {/* {bgPreview && (
                                                <button
                                                    onClick={clearBgImage}
                                                    className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded-lg hover:bg-red-500/10 transition"
                                                    title="Remove background image"
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                    <span className="ml-1 text-xs">Remove Bg</span>
                                                </button>
                                            )} */}
                                        </div>

                                        {/* Background Image Preview */}
                                        {bgPreview && bgImage && (
                                            <div className="mt-3 bg-[#0a0f1a] rounded-lg p-3 border border-purple-500/30">
                                                <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                                                    <i className="fas fa-check-circle text-green-500"></i>
                                                    Current background image:
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={bgPreview}
                                                        alt="background preview"
                                                        className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-300 truncate">{bgImage.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {((bgImage.size || 0) / 1024).toFixed(1)} KB
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={clearBgImage}
                                                        className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded-lg hover:bg-red-500/10 transition cursor-progress"
                                                        title="Remove background image"
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                        <span className="ml-1 text-m">Remove Image</span>
                                                    </button>

                                                </div>

                                            </div>




                                        )}
                                        {/* {bgPreview && (
                                                <button
                                                    onClick={clearBgImage}
                                                    className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded-lg hover:bg-red-500/10 transition"
                                                    title="Remove background image"
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                    <span className="ml-1 text-xs">Remove Bg</span>
                                                </button>
                                            )} */}
                                    </div>

                                    {/* Color Picker Option */}
                                    <div className="space-y-3">
                                        <label className="text-sm text-gray-400 flex items-center gap-2">
                                            <i className="fas fa-fill-drip"></i>
                                            Solid Color Background
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <input
                                                    type="color"
                                                    value={bgColor}
                                                    onChange={(e) => {
                                                        setBgColor(e.target.value);
                                                        // DON'T clear the image automatically - let user choose
                                                        // Only clear when they explicitly click on a predefined color
                                                    }}
                                                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-600"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 mb-1">Quick colors:</p>
                                                <div className="flex gap-2 flex-wrap">
                                                    {colors.map((c) => (
                                                        <button
                                                            key={c}
                                                            onClick={() => {
                                                                setBgColor(c);
                                                                // Only clear image if user clicks on a predefined color
                                                                // This gives user choice - they can have both image and color ready
                                                                // But when applying, image takes priority
                                                            }}
                                                            className={`w-8 h-8 rounded-lg cursor-pointer transition-transform hover:scale-110 ${bgColor === c && !bgImage ? "ring-2 ring-white ring-offset-2 ring-offset-[#020617]" : ""
                                                                }`}
                                                            style={{ backgroundColor: c }}
                                                            title={c}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Active background type indicator */}
                                        <div className="mt-2 text-xs space-y-1">
                                            {bgImage ? (
                                                <div className="text-blue-400 flex items-center gap-1">
                                                    <i className="fas fa-info-circle"></i>
                                                    Background image is selected (will be used when applying)
                                                </div>
                                            ) : (
                                                <div className="text-purple-400 flex items-center gap-1">
                                                    <i className="fas fa-paint-roller"></i>
                                                    Using solid color: {bgColor}
                                                </div>
                                            )}
                                            {bgImage && (
                                                <div className="text-yellow-500/80 flex items-center gap-1 text-xs">
                                                    <i className="fas fa-lightbulb"></i>
                                                    Tip: Click "Remove" button to switch to solid color
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Apply Button */}
                                <div className="flex justify-center pt-4">
                                    <button
                                        onClick={applyBackground}
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                        <i className="fas fa-sync-alt"></i>
                                        Apply Background
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Final Image Output */}
                        {finalImage && (
                            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-500/30">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <i className="fas fa-star text-yellow-400"></i>
                                        Final Result
                                    </h2>
                                    <button
                                        onClick={downloadFinalImage}
                                        className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg transition-all flex items-center gap-2"
                                    >
                                        <i className="fas fa-download"></i>
                                        Download Final Image
                                    </button>
                                </div>
                                <div className="bg-[#0a0f1a] rounded-lg p-4 flex justify-center">
                                    <img
                                        src={finalImage}
                                        alt="final result"
                                        className="max-h-[400px] w-auto object-contain rounded-lg shadow-xl"
                                    />
                                </div>
                            </div>
                        )}

                        {/* BOTTOM AD */}
                        <AdBanner />

                        {/* BACKLINKS */}
                        {/* <p className="text-center text-sm text-gray-400">
                            Try more tools:{" "}
                            <Link to="/image-compressor" className="text-green-400 hover:underline">
                                Image Compressor
                            </Link>{" "}
                            |{" "}
                            <Link to="/png-to-jpg" className="text-green-400 hover:underline">
                                PNG to JPG
                            </Link>{" "}
                            |{" "}
                            <Link to="/json-formatter" className="text-green-400 hover:underline">
                                JSON Formatter
                            </Link>
                        </p> */}

                        {/* SEO CONTENT */}
                        <div className="text-gray-300 space-y-4 mt-8">
                            <h2 className="text-xl font-semibold">Free Background Remover Tool</h2>
                            <p>
                                Easily remove background from images online using our AI-powered tool.
                                Upload your image, remove the background, and download instantly.
                            </p>

                            <h2 className="text-xl font-semibold">How to Use?</h2>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Upload your image</li>
                                <li>Click on remove background</li>
                                <li>Download the result</li>
                                <li>Apply custom background if needed</li>
                            </ul>

                            <h2 className="text-xl font-semibold">Features</h2>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>AI-powered background removal</li>
                                <li>Custom image & color background</li>
                                <li>Fast processing</li>
                                <li>Free to use</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="w-72 hidden lg:block space-y-4">

                    <div className="bg-[#0b1220] p-4 rounded-xl">
                        <h3 className="text-lg font-semibold mb-3">🔥 Popular Tools</h3>

                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/image-compressor" className="text-gray-400 hover:text-green-400">
                                    Image Compressor
                                </Link>
                            </li>
                            <li>
                                <Link to="/png-to-jpg" className="text-gray-400 hover:text-green-400">
                                    PNG to JPG Converter
                                </Link>
                            </li>
                            <li>
                                <Link to="/json-formatter" className="text-gray-400 hover:text-green-400">
                                    JSON Formatter
                                </Link>
                            </li>
                            <li>
                                <Link to="/password-generator" className="text-gray-400 hover:text-green-400">
                                    Password Generator
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* SIDE AD */}
                    <AdBanner />

                </div>
            </div>
        </div>
    );
}