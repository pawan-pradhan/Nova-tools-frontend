import { useState } from "react";
import { Helmet } from "react-helmet-async";
import AdBanner from "../../components/AdBanner";

import { Link } from "react-router-dom";

export default function Beautify() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleBeautify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch {
      setError("Invalid JSON ❌");
      setOutput("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="max-w-4xl mx-auto">

      {/* SEO */}
      <Helmet>
        <title>Free JSON Formatter Online | Beautify JSON Instantly</title>
        <meta
          name="description"
          content="Format and beautify your JSON instantly with our free JSON formatter tool. Validate, clean, and view structured JSON easily."
        />
      </Helmet>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">
        JSON Formatter & Beautifier
      </h1>

      {/* Description */}
      <p className="text-gray-400 mb-4">
        Use this free online JSON formatter tool to beautify, validate, and
        structure your JSON data. It helps developers easily read and debug JSON.
      </p>

      {/* Ad Top */}
      <div className="mb-4">
        <AdBanner />
      </div>

      {/* Input */}
      <textarea
        placeholder="Paste your JSON here..."
        className="w-full h-40 p-3 bg-gray-800 rounded-lg outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* Buttons */}
      <div className="flex gap-3 mt-3">
        <button
          onClick={handleBeautify}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
        >
          Beautify
        </button>

        <button
          onClick={handleCopy}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Copy
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-400 mt-2">{error}</p>}

      {/* Output */}
      <textarea
        placeholder="Formatted JSON will appear here..."
        className="w-full h-40 mt-4 p-3 bg-gray-800 rounded-lg"
        value={output}
        readOnly
      />


      <p className="mt-2 text-sm text-gray-400">
        Need minify JSON?{" "}
        <Link to="/minify" className="text-green-400 hover:underline">
          Try our Minifier tool
        </Link>
      </p>

      {/* Ad Bottom */}
      <div className="mt-6">
        <AdBanner />
      </div>

      {/* Instructions / SEO Content */}
      <div className="mt-8 text-gray-300 space-y-3">
        <h2 className="text-xl font-semibold">How to Use JSON Formatter?</h2>

        <ul className="list-disc pl-5 space-y-1">
          <li>Paste your raw JSON data in the input box</li>
          <li>Click on the "Beautify" button</li>
          <li>Your formatted JSON will appear instantly</li>
          <li>Click "Copy" to copy the result</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">
          Why Use This JSON Beautifier?
        </h2>

        <p>
          This tool helps developers format messy JSON into a clean and readable
          structure. It also helps in debugging APIs and understanding data easily.
        </p>

        <h2 className="text-xl font-semibold mt-4">
          Features of This Tool
        </h2>

        <ul className="list-disc pl-5 space-y-1">
          <li>Free and fast JSON formatting</li>
          <li>Instant validation</li>
          <li>Easy copy option</li>
          <li>Works on all devices</li>
        </ul>
      </div>
    </div>
  );
}









// import { useState } from "react";

// export default function Beautify() {
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState("");
//   const [error, setError] = useState("");

//   const handleBeautify = () => {
//     try {
//       const parsed = JSON.parse(input);
//       setOutput(JSON.stringify(parsed, null, 2));
//       setError("");
//     } catch {
//       setError("Invalid JSON ❌");
//       setOutput("");
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-xl mb-4">Beautify JSON</h1>

//       <textarea
//         className="w-full h-40 p-2 bg-gray-800"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//       />

//       <button onClick={handleBeautify} className="mt-2 bg-green-500 px-4 py-2">
//         Beautify
//       </button>

//       {error && <p className="text-red-400">{error}</p>}

//       <textarea
//         className="w-full h-40 mt-4 p-2 bg-gray-800"
//         value={output}
//         readOnly
//       />
//     </div>
//   );
// }