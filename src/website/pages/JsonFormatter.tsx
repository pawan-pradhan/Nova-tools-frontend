import { useState } from "react";

export default function JsonFormatter() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");

    const formatJSON = () => {
        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 2);
            setOutput(formatted);
            setError("");
        } catch (err) {
            setError("Invalid JSON ❌");
            setOutput("");
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        alert("Copied to clipboard ✅");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-2xl font-bold text-center mb-6">
                JSON Formatter 🚀
            </h1>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Input */}
                <div>
                    <h2 className="mb-2 font-semibold">Input JSON</h2>
                    <textarea
                        className="w-full h-80 p-3 rounded bg-gray-800 border border-gray-700 outline-none"
                        placeholder='Paste your JSON here...'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>

                {/* Output */}
                <div>
                    <h2 className="mb-2 font-semibold">Formatted JSON</h2>
                    <textarea
                        className="w-full h-80 p-3 rounded bg-gray-800 border border-gray-700 outline-none"
                        value={output}
                        readOnly
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
                <button
                    onClick={formatJSON}
                    className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded font-semibold"
                >
                    Format JSON
                </button>

                <button
                    onClick={copyToClipboard}
                    className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded font-semibold"
                    disabled={!output}
                >
                    Copy
                </button>
            </div>

            {/* Error */}
            {error && (
                <p className="text-red-400 text-center mt-4">{error}</p>
            )}
        </div>
    );
}