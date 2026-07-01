/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        "primary-container": "#68796a",
        "on-primary-container": "#f6fff4",
        "on-secondary": "#ffffff",
        "on-tertiary-container": "#fffbff",
        "tertiary-fixed": "#fedade",
        "outline": "#737873",
        "surface-tint": "#526255",
        "secondary": "#5f5e5e",
        "on-tertiary": "#ffffff",
        "surface-container": "#f0ede8",
        "inverse-on-surface": "#f3f0eb",
        "on-error-container": "#93000a",
        "inverse-surface": "#31302d",
        "tertiary": "#705559",
        "outline-variant": "#c3c8c1",
        "on-surface": "#1c1c19",
        "primary": "#506052",
        "surface-bright": "#fcf9f4",
        "on-surface-variant": "#434843",
        "on-secondary-fixed-variant": "#474746",
        "surface": "#fcf9f4",
        "secondary-container": "#e2dfde",
        "tertiary-fixed-dim": "#e0bec2",
        "inverse-primary": "#b9cbba",
        "background": "#fcf9f4",
        "on-secondary-container": "#636262",
        "tertiary-container": "#8a6d71",
        "primary-fixed-dim": "#b9cbba",
        "on-tertiary-fixed": "#291619",
        "surface-dim": "#dcdad5",
        "error": "#ba1a1a",
        "on-primary-fixed": "#101f14",
        "surface-container-lowest": "#ffffff",
        "primary-fixed": "#d5e7d6",
        "on-primary": "#ffffff",
        "on-background": "#1c1c19",
        "on-tertiary-fixed-variant": "#594044",
        "surface-container-low": "#f6f3ee",
        "secondary-fixed": "#e5e2e1",
        "surface-container-high": "#ebe8e3",
        "error-container": "#ffdad6",
        "surface-variant": "#e5e2dd",
        "surface-container-highest": "#e5e2dd",
        "secondary-fixed-dim": "#c8c6c5",
        "on-secondary-fixed": "#1c1b1b",
        "on-primary-fixed-variant": "#3b4b3e",
        "on-error": "#ffffff"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "margin-desktop": "64px",
        "gutter": "24px",
        "margin-mobile": "20px",
        "container-max": "1280px",
        "section-gap": "120px",
        "unit": "8px"
      },
      fontFamily: {
        "display-lg": ["Playfair Display", "serif"],
        "mono-data": ["Space Mono", "monospace"],
        "body-lg": ["Inter", "sans-serif"],
        "display-lg-mobile": ["Playfair Display", "serif"],
        "headline-md": ["Playfair Display", "serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline-sm": ["Playfair Display", "serif"],
        "label-caps": ["Inter", "sans-serif"]
      },
      fontSize: {
        "display-lg": ["64px", { lineHeight: "72px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "mono-data": ["11px", { lineHeight: "14px", letterSpacing: "0.05em", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "28px", letterSpacing: "0.01em", fontWeight: "400" }],
        "display-lg-mobile": ["40px", { lineHeight: "48px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-md": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-sm": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "600" }]
      }
    }
  },
  plugins: []
};
