"use client";

import { useState, useRef, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

interface OtpInputProps {
  email: string;
  onSuccess: () => void;
}

export default function OtpInput({ email, onSuccess }: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle typing logic
  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = element.value.substring(element.value.length - 1);
    setOtp(newOtp);

    // Move focus to next box
    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste (very important for user experience!)
  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData("text").slice(0, 6).split("");
    if (data.length === 6 && data.every((char) => !isNaN(Number(char)))) {
      setOtp(data);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    const code = otp.join("");

    const { data, error } = await authClient.emailOtp.verifyVerificationOtp({
      email,
      otp: code,
    });

    if (error) {
      setError(error.message || "Invalid code. Please try again.");
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex gap-2" onPaste={handlePaste}>
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            ref={(el) => (inputRefs.current[index] = el)}
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg bg-white border-gray-300 focus:border-blue-500 focus:outline-none transition-all"
          />
        ))}
      </div>

      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

      <button
        onClick={handleVerify}
        disabled={loading || otp.join("").length < 6}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 transition-colors"
      >
        {loading ? "Verifying..." : "Verify Code"}
      </button>

      <button 
        onClick={async () => await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" })}
        className="text-blue-600 hover:underline text-sm"
      >
        Resend Code
      </button>
    </div>
  );
}