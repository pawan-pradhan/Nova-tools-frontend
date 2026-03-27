import { useState } from "react";
import { Helmet } from "react-helmet-async";
import AdBanner from "../../components/AdBanner";
import { Link } from "react-router-dom";

export default function Validator() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleChange = (value: string) => {
    setInput(value);

    try {
      JSON.parse(value);
      setError("Valid JSON ✅");
      setIsValid(true);
    } catch {
      setError("Invalid JSON ❌");
      setIsValid(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
  };

  return (
    <div className="max-w-4xl mx-auto">

      {/* SEO */}
      <Helmet>
        <title>Free JSON Validator Online | Validate JSON Instantly</title>
        <meta
          name="description"
          content="Validate your JSON instantly with this free JSON validator tool. Detect errors and ensure proper JSON format easily."
        />
      </Helmet>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">
        JSON Validator Tool
      </h1>

      {/* Description */}
      <p className="text-gray-400 mb-4">
        This free online JSON validator helps you check whether your JSON data
        is valid or not. Instantly detect errors and fix them easily.
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
        onChange={(e) => handleChange(e.target.value)}
      />

      {/* Buttons */}
      <div className="flex gap-3 mt-3">
        <button
          onClick={handleCopy}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Copy JSON
        </button>
      </div>

      {/* Status */}
      {error && (
        <p
          className={`mt-3 font-semibold ${
            isValid ? "text-green-400" : "text-red-400"
          }`}
        >
          {error}
        </p>
      )}

      {/* Ad Bottom */}
      <div className="mt-6">
        <AdBanner />
      </div>

      {/* Internal Linking */}
      <p className="mt-3 text-sm text-gray-400">
        Need to format JSON?{" "}
        <Link
          to="/json-formatter"
          className="text-green-400 font-semibold hover:underline"
        >
          Try JSON Beautifier →
        </Link>
      </p>

      {/* Instructions / SEO Content */}
      <div className="mt-8 text-gray-300 space-y-3">

        <h2 className="text-xl font-semibold">
          How to Use JSON Validator?
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Paste your JSON data into the input box</li>
          <li>The tool will automatically validate your JSON</li>
          <li>Check if your JSON is valid or invalid instantly</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">
          Why Use This JSON Validator?
        </h2>
        <p>
          JSON validation is important to ensure your data structure is correct.
          This tool helps developers debug APIs, fix syntax errors, and avoid
          crashes caused by invalid JSON.
        </p>

        <h2 className="text-xl font-semibold mt-4">
          Features of This Tool
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Real-time JSON validation</li>
          <li>Instant error detection</li>
          <li>Simple and fast interface</li>
          <li>Works on all devices</li>
        </ul>

      </div>
    </div>
  );
}









// import { useState } from "react";

// export default function Validator() {
//   const [input, setInput] = useState("");
//   const [error, setError] = useState("");

//   const handleChange = (value: string) => {
//     setInput(value);
//     try {
//       JSON.parse(value);
//       setError("Valid JSON ✅");
//     } catch {
//       setError("Invalid JSON ❌");
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-xl mb-4">JSON Validator</h1>

//       <textarea
//         className="w-full h-40 p-2 bg-gray-800"
//         value={input}
//         onChange={(e) => handleChange(e.target.value)}
//       />

//       <p className="mt-2">{error}</p>
//     </div>
//   );
// }