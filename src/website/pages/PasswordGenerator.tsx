import { useState, useEffect } from "react";

export default function PasswordGenerator() {
    const [length, setLength] = useState(10);
    const [useUpper, setUseUpper] = useState(true);
    const [useLower, setUseLower] = useState(true);
    const [useNumber, setUseNumber] = useState(true);
    const [useSymbol, setUseSymbol] = useState(false);
    const [firstUpper, setFirstUpper] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [history, setHistory] = useState<string[]>([]);

    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+";

    const generatePassword = () => {
        let chars = "";

        if (useUpper) chars += upper;
        if (useLower) chars += lower;
        if (useNumber) chars += numbers;
        if (useSymbol) chars += symbols;

        if (!chars) {
            setError("⚠️ Select at least one option");
            return;
        }

        if (firstUpper && !useUpper) {
            setError("Enable Uppercase for first letter capital");
            return;
        }

        setError("");

        let pass = "";

        if (firstUpper) {
            pass += upper[Math.floor(Math.random() * upper.length)];
        }

        for (let i = pass.length; i < length; i++) {
            pass += chars[Math.floor(Math.random() * chars.length)];
        }

        setPassword(pass);
        savePassword(pass);
        setHistory(getPasswords());
    };

    const copyPassword = () => {
        if (!password) return;
        navigator.clipboard.writeText(password);
    };

    const getPasswords = () => {
        try {
            const data = localStorage.getItem("passwords");
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    };

    const savePassword = (newPass: string) => {
        const existing = localStorage.getItem("passwords");
        let passwords = existing ? JSON.parse(existing) : [];

        passwords.unshift(newPass);
        if (passwords.length > 10) passwords = passwords.slice(0, 10);

        localStorage.setItem("passwords", JSON.stringify(passwords));
    };

    const deletePassword = (index: number) => {
        const updated = [...history];
        updated.splice(index, 1);
        localStorage.setItem("passwords", JSON.stringify(updated));
        setHistory(updated);
    };

    const getStrength = () => {
        let score = 0;
        if (useUpper) score++;
        if (useLower) score++;
        if (useNumber) score++;
        if (useSymbol) score++;
        if (length >= 12) score++;

        if (score <= 2) return { label: "Weak", color: "text-red-400" };
        if (score <= 4) return { label: "Medium", color: "text-yellow-400" };
        return { label: "Strong", color: "text-green-400" };
    };

    const strength = getStrength();

    useEffect(() => {
        setHistory(getPasswords());
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#0f172a] text-white p-4">

            <div className="max-w-6xl mx-auto flex gap-6">

                {/* MAIN */}
                <div className="flex-1 flex flex-col items-center">

                    <div className="w-full max-w-md bg-white/5 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10">

                        <h2 className="text-2xl font-bold mb-4 text-center">
                            🔐 Password Generator
                        </h2>

                        <AdBanner />

                        {/* Output */}
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={password}
                                readOnly
                                className="w-full p-3 rounded-lg bg-[#1e293b]"
                            />
                            <button onClick={copyPassword} className="bg-blue-500 px-3 rounded-lg">📋</button>
                        </div>

                        {/* Length */}
                        <input
                            type="range"
                            min={4}
                            max={20}
                            value={length}
                            onChange={(e) => setLength(Number(e.target.value))}
                            className="w-full mb-4"
                        />

                        {/* Options */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <Toggle label="Uppercase" state={useUpper} setState={setUseUpper} />
                            <Toggle label="Lowercase" state={useLower} setState={setUseLower} />
                            <Toggle label="Numbers" state={useNumber} setState={setUseNumber} />
                            <Toggle label="Symbols" state={useSymbol} setState={setUseSymbol} />
                            <Toggle label="First Capital" state={firstUpper} setState={setFirstUpper} />
                        </div>

                        <p className={`mt-3 ${strength.color}`}>Strength: {strength.label}</p>

                        {error && <p className="text-red-400">{error}</p>}

                        <button onClick={generatePassword} className="w-full mt-3 bg-green-500 py-2 rounded-lg">
                            Generate
                        </button>

                        <div className="mt-4">
                            <AdBanner />
                        </div>

                    </div>

                    {/* HISTORY */}
                    <div className="mt-6 w-full max-w-md">
                        {history.map((p, i) => (
                            <div key={i} className="bg-[#1e293b] p-2 mb-2 flex justify-between">
                                <span>{p}</span>
                                <div className="flex gap-2 text-xs">
                                    <button onClick={() => navigator.clipboard.writeText(p)}>Copy</button>
                                    <button onClick={() => deletePassword(i)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SEO */}
                    <div className="mt-10 max-w-xl text-sm text-gray-300 space-y-3">
                        <h2 className="font-semibold">Free Password Generator</h2>
                        <p>Create strong passwords instantly.</p>

                        <p>
                            More tools:{" "}
                            <a href="/json-formatter" className="text-green-400">JSON Formatter</a> |{" "}
                            <a href="/image-compressor" className="text-green-400">Image Compressor</a>
                        </p>
                    </div>

                </div>

                {/* SIDEBAR */}
                <div className="w-64 hidden lg:block">
                    <div className="bg-[#0b1220] p-4 rounded-xl">
                        <h3 className="mb-2">Tools</h3>
                        <ul className="text-sm space-y-1">
                            <li><a href="/json-formatter">JSON Formatter</a></li>
                            <li><a href="/png-to-jpg">PNG to JPG</a></li>
                        </ul>
                    </div>

                    <div className="mt-4">
                        <AdBanner />
                    </div>
                </div>

            </div>
        </div>
    );
}

function Toggle({ label, state, setState }: any) {
    return (
        <label className="flex justify-between bg-[#1e293b] p-2 rounded cursor-pointer">
            {label}
            <input type="checkbox" checked={state} onChange={() => setState(!state)} />
        </label>
    );
}

const AdBanner = () => (
    <div className="h-16 bg-gray-700 flex items-center justify-center rounded">
        Ad Space
    </div>
);









// import { useState, useEffect } from "react";

// export default function PasswordGenerator() {
//     const [length, setLength] = useState(10);
//     const [useUpper, setUseUpper] = useState(true);
//     const [useLower, setUseLower] = useState(true);
//     const [useNumber, setUseNumber] = useState(true);
//     const [useSymbol, setUseSymbol] = useState(false);
//     const [firstUpper, setFirstUpper] = useState(false);
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const [history, setHistory] = useState<string[]>([]);

//     const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//     const lower = "abcdefghijklmnopqrstuvwxyz";
//     const numbers = "0123456789";
//     const symbols = "!@#$%^&*()_+";

//     //   const generatePassword = () => {
//     //     let chars = "";

//     //     if (useUpper) chars += upper;
//     //     if (useLower) chars += lower;
//     //     if (useNumber) chars += numbers;
//     //     if (useSymbol) chars += symbols;

//     //     if (!chars) {
//     //       setError("⚠️ Select at least one option");
//     //       return;
//     //     }

//     //     setError("");

//     //     let pass = "";
//     //     for (let i = 0; i < length; i++) {
//     //       pass += chars[Math.floor(Math.random() * chars.length)];
//     //     }

//     //     // First letter capital condition
//     //     if (firstUpper) {
//     //       pass = pass.charAt(0).toUpperCase() + pass.slice(1);
//     //     }

//     //     setPassword(pass);
//     //   };


//     const generatePassword = () => {
//         let chars = "";

//         if (useUpper) chars += upper;
//         if (useLower) chars += lower;
//         if (useNumber) chars += numbers;
//         if (useSymbol) chars += symbols;

//         if (!chars) {
//             setError("⚠️ Select at least one option");
//             return;
//         }

//         // ❗ conflict fix
//         if (firstUpper && !useUpper) {
//             setError("Enable Uppercase for first letter capital");
//             return;
//         }

//         setError("");

//         let pass = "";

//         // ✅ First letter force uppercase
//         if (firstUpper) {
//             pass += upper[Math.floor(Math.random() * upper.length)];
//         }

//         for (let i = pass.length; i < length; i++) {
//             pass += chars[Math.floor(Math.random() * chars.length)];
//         }

//         setPassword(pass);

//         // ✅ SAVE PASSWORD
//         savePassword(pass);

//         // ✅ UPDATE UI
//         setHistory(getPasswords());
//     };

//     // const generatePassword = () => {
//     //     let chars = "";

//     //     if (useUpper) chars += upper;
//     //     if (useLower) chars += lower;
//     //     if (useNumber) chars += numbers;
//     //     if (useSymbol) chars += symbols;

//     //     if (!chars) {
//     //         setError("⚠️ Select at least one option");
//     //         return;
//     //     }

//     //     setError("");

//     //     let pass = "";

//     //     // ✅ First letter must be uppercase
//     //     if (firstUpper) {
//     //         pass += upper[Math.floor(Math.random() * upper.length)];
//     //     }

//     //     // Remaining characters
//     //     for (let i = pass.length; i < length; i++) {
//     //         pass += chars[Math.floor(Math.random() * chars.length)];
//     //     }

//     //     setPassword(pass);
//     //     setHistory(getPasswords());
//     // };

//     const copyPassword = () => {
//         if (!password) return;
//         navigator.clipboard.writeText(password);
//     };

//     const getPasswords = () => {
//         try {
//             const data = localStorage.getItem("passwords");
//             return data ? JSON.parse(data) : [];
//         } catch {
//             return [];
//         }
//     };

//     const savePassword = (newPass: string) => {
//         const existing = localStorage.getItem("passwords");

//         let passwords = [];

//         if (existing) {
//             passwords = JSON.parse(existing);
//         }

//         passwords.unshift(newPass); // new password top पर

//         // optional: limit to 10 passwords
//         if (passwords.length > 10) {
//             passwords = passwords.slice(0, 10);
//         }

//         localStorage.setItem("passwords", JSON.stringify(passwords));
//     };

//     const deletePassword = (index: number) => {
//         const updated = [...history];
//         updated.splice(index, 1);

//         localStorage.setItem("passwords", JSON.stringify(updated));
//         setHistory(updated);
//     };

//     const getStrength = () => {
//         let score = 0;
//         if (useUpper) score++;
//         if (useLower) score++;
//         if (useNumber) score++;
//         if (useSymbol) score++;
//         if (length >= 12) score++;

//         if (score <= 2) return { label: "Weak", color: "text-red-400" };
//         if (score <= 4) return { label: "Medium", color: "text-yellow-400" };
//         return { label: "Strong", color: "text-green-400" };
//     };

//     const strength = getStrength();


//     useEffect(() => {
//         setHistory(getPasswords());
//     }, []);

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] to-[#0f172a] text-white p-4">
//             <div className="w-full max-w-md bg-white/5 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10">

//                 <h2 className="text-2xl font-bold mb-4 text-center">
//                     🔐 Password Generator
//                 </h2>

//                 {/* Password Output */}
//                 <div className="flex gap-2 mb-3">
//                     <input
//                         type="text"
//                         value={password}
//                         readOnly
//                         placeholder="Generated password..."
//                         className="w-full p-3 rounded-lg bg-[#1e293b] outline-none"
//                     />
//                     <button
//                         onClick={copyPassword}
//                         className="bg-blue-500 px-3 rounded-lg hover:bg-blue-600"
//                     >
//                         📋
//                     </button>
//                 </div>

//                 {/* Length */}
//                 <div className="mb-4">
//                     <div className="flex justify-between text-sm mb-1">
//                         <span>Password Length</span>
//                         <span>{length}</span>
//                     </div>
//                     <input
//                         type="range"
//                         min={4}
//                         max={20}
//                         value={length}
//                         onChange={(e) => setLength(Number(e.target.value))}
//                         className="w-full"
//                     />
//                 </div>

//                 {/* Options */}
//                 <div className="grid grid-cols-2 gap-3 text-sm">

//                     <Toggle label="Uppercase" state={useUpper} setState={setUseUpper} />
//                     <Toggle label="Lowercase" state={useLower} setState={setUseLower} />
//                     <Toggle label="Numbers" state={useNumber} setState={setUseNumber} />
//                     <Toggle label="Symbols" state={useSymbol} setState={setUseSymbol} />
//                     <Toggle label="First Letter Capital" state={firstUpper} setState={setFirstUpper} />

//                 </div>

//                 {/* Strength */}
//                 <div className="mt-4 text-sm">
//                     Strength: <span className={`font-bold ${strength.color}`}>{strength.label}</span>
//                 </div>

//                 {/* Error */}
//                 {error && (
//                     <p className="text-red-400 text-sm mt-2">{error}</p>
//                 )}

//                 {/* Button */}
//                 <button
//                     onClick={generatePassword}
//                     className="w-full mt-4 bg-green-500 hover:bg-green-600 py-2 rounded-lg font-semibold"
//                 >
//                     Generate Password
//                 </button>

//             </div>
//             {/* History */}
//             <div className="mt-6">
//                 <h3 className="text-sm mb-2 text-gray-300">Recent Passwords</h3>

//                 {history.length === 0 && (
//                     <p className="text-xs text-gray-500">No history yet</p>
//                 )}

//                 {history.map((pass, index) => (
//                     <div
//                         key={index}
//                         className="bg-[#1e293b] px-3 py-2 rounded mb-2 flex justify-between items-center"
//                     >
//                         <span className="text-xs truncate">{pass}</span>

//                         <div className="flex gap-2">
//                             <button
//                                 onClick={() => navigator.clipboard.writeText(pass)}
//                                 className="text-blue-400 text-xs"
//                             >
//                                 Copy
//                             </button>

//                             <button
//                                 onClick={() => deletePassword(index)}
//                                 className="text-red-400 text-xs"
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// // 🔁 Reusable Toggle Component
// function Toggle({
//     label,
//     state,
//     setState,
// }: {
//     label: string;
//     state: boolean;
//     setState: (val: boolean) => void;
// }) {
//     return (
//         <label className="flex items-center justify-between bg-[#1e293b] px-3 py-2 rounded-lg cursor-pointer">
//             {label}
//             <input
//                 type="checkbox"
//                 checked={state}
//                 onChange={() => setState(!state)}
//             />
//         </label>
//     );
// }