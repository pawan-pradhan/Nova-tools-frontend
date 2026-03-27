import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-XXXX"   // 👈 replace
      data-ad-slot="1234567890"      // 👈 replace
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}