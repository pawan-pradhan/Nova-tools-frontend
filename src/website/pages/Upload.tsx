import { useState } from "react";
import { Helmet } from "react-helmet-async";
import AdBanner from "../../components/AdBanner";
import { Link } from "react-router-dom";

export default function Upload() {
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleFile = (e: any) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.name.endsWith(".json")) {
      setError("Please upload a valid JSON file ❌");
      setContent("");
      return;
    }

    setFileName(file.name);
    setError("");

    const reader = new FileReader();

    reader.onload = (event: any) => {
      try {
        const text = event.target.result;
        JSON.parse(text); // validate JSON
        setContent(text);
      } catch {
        setError("Invalid JSON file ❌");
        setContent("");
      }
    };

    reader.readAsText(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="max-w-4xl mx-auto">

      {/* SEO */}
      <Helmet>
        <title>Upload JSON File Online | Free JSON Viewer Tool</title>
        <meta
          name="description"
          content="Upload and view JSON files online instantly. Validate, copy, and format JSON data easily with this free tool."
        />
      </Helmet>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">
        Upload JSON File
      </h1>

      {/* Description */}
      <p className="text-gray-400 mb-4">
        Upload your JSON file and instantly view its content. This tool helps
        developers quickly inspect and validate JSON files online.
      </p>

      {/* Ad Top */}
      <div className="mb-4">
        <AdBanner />
      </div>

      {/* File Input */}
      <input
        type="file"
        accept=".json"
        onChange={handleFile}
        className="mb-3"
      />

      {/* File Name */}
      {fileName && (
        <p className="text-sm text-green-400">
          Uploaded: {fileName}
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-400 mt-2">{error}</p>
      )}

      {/* Output */}
      <textarea
        placeholder="Uploaded JSON will appear here..."
        className="w-full h-40 mt-4 p-3 bg-gray-800 rounded-lg"
        value={content}
        readOnly
      />

      {/* Buttons */}
      {content && (
        <div className="mt-3">
          <button
            onClick={handleCopy}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Copy JSON
          </button>
        </div>
      )}

      {/* Ad Bottom */}
      <div className="mt-6">
        <AdBanner />
      </div>

      {/* Internal Linking */}
      <p className="mt-3 text-sm text-gray-400">
        Want to format your JSON?{" "}
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
          How to Upload JSON File?
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Click on the file input button</li>
          <li>Select your .json file from your device</li>
          <li>The content will be displayed instantly</li>
          <li>Copy or validate your JSON easily</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">
          Why Use This Tool?
        </h2>
        <p>
          This online JSON uploader helps developers quickly inspect JSON files
          without installing any software. It ensures your JSON is valid and
          easy to read.
        </p>

        <h2 className="text-xl font-semibold mt-4">
          Features
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Instant JSON file preview</li>
          <li>Automatic validation</li>
          <li>Copy JSON with one click</li>
          <li>Fast and secure (no upload to server)</li>
        </ul>

      </div>
    </div>
  );
}









// import { useState } from "react";

// export default function Upload() {
//   const [content, setContent] = useState("");

//   const handleFile = (e: any) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (event: any) => {
//       setContent(event.target.result);
//     };

//     reader.readAsText(file);
//   };

//   return (
//     <div>
//       <h1 className="text-xl mb-4">Upload JSON</h1>

//       <input type="file" accept=".json" onChange={handleFile} />

//       <textarea
//         className="w-full h-40 mt-4 p-2 bg-gray-800"
//         value={content}
//         readOnly
//       />
//     </div>
//   );
// }