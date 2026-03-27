import { useState } from "react";
import { Helmet } from "react-helmet-async";
import AdBanner from "../../components/AdBanner";
 import { Link } from "react-router-dom";

export default function Minify() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
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
        <title>Free JSON Minifier Online | Compress JSON Instantly</title>
        <meta
          name="description"
          content="Minify and compress JSON data instantly with this free online JSON minifier tool. Remove spaces and reduce file size easily."
        />
      </Helmet>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">
        JSON Minifier Tool
      </h1>

      {/* Description */}
      <p className="text-gray-400 mb-4">
        This free online JSON minifier helps you compress JSON data by removing
        unnecessary spaces and formatting. Perfect for reducing file size and
        improving performance.
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
          onClick={handleMinify}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Minify
        </button>

        <button
          onClick={handleCopy}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
        >
          Copy
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-400 mt-2">{error}</p>}

      {/* Output */}
      <textarea
        placeholder="Minified JSON will appear here..."
        className="w-full h-40 mt-4 p-3 bg-gray-800 rounded-lg"
        value={output}
        readOnly
      />

      {/* Ad Bottom */}
      <div className="mt-6">
        <AdBanner />
      </div>

     

      <p className="mt-2 text-sm text-gray-400">
        Need formatted JSON?{" "}
        <Link to="/json-formatter" className="text-green-400 hover:underline">
          Try our Beautifier tool
        </Link>
      </p>

      {/* Instructions / SEO Content */}
      <div className="mt-8 text-gray-300 space-y-3">

        <h2 className="text-xl font-semibold">How to Use JSON Minifier?</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Paste your JSON data into the input field</li>
          <li>Click on the "Minify" button</li>
          <li>Your compressed JSON will be generated instantly</li>
          <li>Use the "Copy" button to copy the result</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">
          Why Use JSON Minifier?
        </h2>
        <p>
          Minifying JSON removes unnecessary whitespace, making the data smaller
          and faster to transfer. This is useful for APIs, web apps, and storing
          data efficiently.
        </p>

        <h2 className="text-xl font-semibold mt-4">
          Features of This Tool
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Instant JSON compression</li>
          <li>Reduces file size</li>
          <li>Improves API performance</li>
          <li>Simple and easy to use</li>
          <li>Works on all devices</li>
        </ul>

      </div>
    </div>
  );
}









// import { useState } from "react";

// export default function Minify() {
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState("");

//   const handleMinify = () => {
//     try {
//       const parsed = JSON.parse(input);
//       setOutput(JSON.stringify(parsed));
//     } catch {
//       setOutput("Invalid JSON ❌");
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-xl mb-4">Minify JSON</h1>

//       <textarea
//         className="w-full h-40 p-2 bg-gray-800"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//       />

//       <button onClick={handleMinify} className="mt-2 bg-blue-500 px-4 py-2">
//         Minify
//       </button>

//       <textarea
//         className="w-full h-40 mt-4 p-2 bg-gray-800"
//         value={output}
//         readOnly
//       />
//     </div>
//   );
// }