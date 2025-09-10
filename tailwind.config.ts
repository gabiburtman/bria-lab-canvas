import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Shadcn UI colors (mapped to lab design system)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // Bria Lab dark mode design system colors
        lab: {
          primary: {
            DEFAULT: "hsl(var(--lab-primary))",
            hover: "hsl(var(--lab-primary-hover))",
            foreground: "hsl(var(--lab-primary-foreground))",
            glow: "hsl(var(--lab-primary-glow))",
          },
          background: "hsl(var(--lab-background))",
          surface: {
            DEFAULT: "hsl(var(--lab-surface))",
            elevated: "hsl(var(--lab-surface-elevated))",
          },
          text: {
            primary: "hsl(var(--lab-text-primary))",
            secondary: "hsl(var(--lab-text-secondary))",
            muted: "hsl(var(--lab-text-muted))",
          },
          border: {
            DEFAULT: "hsl(var(--lab-border))",
            focus: "hsl(var(--lab-border-focus))",
            hover: "hsl(var(--lab-border-hover))",
          },
          status: {
            success: "hsl(var(--lab-success))",
            warning: "hsl(var(--lab-warning))",
            error: "hsl(var(--lab-error))",
          },
          interactive: {
            hover: "hsl(var(--lab-hover))",
            active: "hsl(var(--lab-active))",
            disabled: "hsl(var(--lab-disabled))",
          },
          code: {
            bg: "hsl(var(--lab-code-bg))",
            text: "hsl(var(--lab-code-text))",
            highlight: "hsl(var(--lab-code-highlight))",
            line: "hsl(var(--lab-code-line))",
            border: "hsl(var(--lab-code-border))",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        lab: {
          DEFAULT: "var(--lab-radius)",
          sm: "var(--lab-radius-sm)",
          lg: "var(--lab-radius-lg)",
        },
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'google-sans': ['Google Sans', 'sans-serif'],
      },
      boxShadow: {
        'lab-glow-subtle': 'var(--lab-glow-subtle)',
        'lab-glow-focus': 'var(--lab-glow-focus)',
        'lab-glow-primary': 'var(--lab-glow-primary)',
      },
      transitionProperty: {
        'lab': 'var(--lab-transition)',
        'lab-fast': 'var(--lab-transition-fast)',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
