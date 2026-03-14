import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0c0b10",
        canvas: "#f4f1ea",
        ember: "#f05d23",
        ocean: "#2f80ed",
        moss: "#145a32",
        glow: "#f5c542"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"]
      },
      boxShadow: {
        halo: "0 0 40px rgba(240,93,35,0.35)",
        glass: "0 18px 45px rgba(12,11,16,0.2)"
      },
      backgroundImage: {
        "mesh": "radial-gradient(circle at 10% 20%, rgba(240,93,35,0.3) 0%, transparent 40%), radial-gradient(circle at 90% 10%, rgba(47,128,237,0.35) 0%, transparent 45%), radial-gradient(circle at 50% 90%, rgba(20,90,50,0.25) 0%, transparent 40%)"
      },
      animation: {
        float: "float 12s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
