import React, { createContext, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get theme from localStorage or default to 'system'
    if (typeof window !== "undefined") {
      return (localStorage.getItem("zen-therapy-theme") as Theme) || "system";
    }
    return "system";
  });

  const [actualTheme, setActualTheme] = useState<"dark" | "light">("light");

  // Function to get the actual theme considering system preference
  const getActualTheme = (currentTheme: Theme): "dark" | "light" => {
    if (currentTheme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return currentTheme;
  };

  // Update the actual theme and apply it to the document
  const updateTheme = React.useCallback((newTheme: Theme) => {
    const resolvedTheme = getActualTheme(newTheme);
    setActualTheme(resolvedTheme);

    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);

    // Update CSS variables for custom theming
    if (resolvedTheme === "dark") {
      root.style.setProperty("--background", "222.2% 84% 4.9%");
      root.style.setProperty("--foreground", "210% 40% 98%");
      root.style.setProperty("--card", "222.2% 84% 4.9%");
      root.style.setProperty("--card-foreground", "210% 40% 98%");
      root.style.setProperty("--popover", "222.2% 84% 4.9%");
      root.style.setProperty("--popover-foreground", "210% 40% 98%");
      root.style.setProperty("--primary", "210% 40% 98%");
      root.style.setProperty("--primary-foreground", "222.2% 84% 4.9%");
      root.style.setProperty("--secondary", "217.2% 32.6% 17.5%");
      root.style.setProperty("--secondary-foreground", "210% 40% 98%");
      root.style.setProperty("--muted", "217.2% 32.6% 17.5%");
      root.style.setProperty("--muted-foreground", "215% 20.2% 65.1%");
      root.style.setProperty("--accent", "217.2% 32.6% 17.5%");
      root.style.setProperty("--accent-foreground", "210% 40% 98%");
      root.style.setProperty("--destructive", "0% 62.8% 30.6%");
      root.style.setProperty("--destructive-foreground", "210% 40% 98%");
      root.style.setProperty("--border", "217.2% 32.6% 17.5%");
      root.style.setProperty("--input", "217.2% 32.6% 17.5%");
      root.style.setProperty("--ring", "212.7% 26.8% 83.9%");
    } else {
      root.style.setProperty("--background", "0 0% 100%");
      root.style.setProperty("--foreground", "222.2% 84% 4.9%");
      root.style.setProperty("--card", "0 0% 100%");
      root.style.setProperty("--card-foreground", "222.2% 84% 4.9%");
      root.style.setProperty("--popover", "0 0% 100%");
      root.style.setProperty("--popover-foreground", "222.2% 84% 4.9%");
      root.style.setProperty("--primary", "222.2% 47.4% 11.2%");
      root.style.setProperty("--primary-foreground", "210% 40% 98%");
      root.style.setProperty("--secondary", "210% 40% 96%");
      root.style.setProperty("--secondary-foreground", "222.2% 84% 4.9%");
      root.style.setProperty("--muted", "210% 40% 96%");
      root.style.setProperty("--muted-foreground", "215.4% 16.3% 46.9%");
      root.style.setProperty("--accent", "210% 40% 96%");
      root.style.setProperty("--accent-foreground", "222.2% 84% 4.9%");
      root.style.setProperty("--destructive", "0% 84.2% 60.2%");
      root.style.setProperty("--destructive-foreground", "210% 40% 98%");
      root.style.setProperty("--border", "214.3% 31.8% 91.4%");
      root.style.setProperty("--input", "214.3% 31.8% 91.4%");
      root.style.setProperty("--ring", "222.2% 84% 4.9%");
    }
  }, []);

  // Handle theme changes
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("zen-therapy-theme", newTheme);
    updateTheme(newTheme);
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = () => {
      if (theme === "system") {
        updateTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    // Initial theme application
    updateTheme(theme);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme, updateTheme]);

  const value = {
    theme,
    setTheme: handleThemeChange,
    actualTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Theme Toggle Component
export const ThemeToggle: React.FC<{ variant?: "button" | "dropdown" }> = ({
  variant = "dropdown",
}) => {
  const { theme, setTheme, actualTheme } = useTheme();

  if (variant === "button") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(actualTheme === "dark" ? "light" : "dark")}
        className="h-9 w-9 p-0"
      >
        {actualTheme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
          {actualTheme === "dark" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center gap-2"
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {theme === "light" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2"
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center gap-2"
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
          {theme === "system" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Enhanced Theme Settings Component
export const ThemeSettings: React.FC = () => {
  const { theme, setTheme, actualTheme } = useTheme();
  const [customColors, setCustomColors] = useState({
    primary: "#3b82f6",
    secondary: "#10b981",
    accent: "#f59e0b",
  });

  const themeOptions = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
      description: "Clean and bright interface",
    },
    {
      value: "dark",
      label: "Dark",
      icon: Moon,
      description: "Easy on the eyes for low-light environments",
    },
    {
      value: "system",
      label: "System",
      icon: Monitor,
      description: "Follows your device preference",
    },
  ] as const;

  const applyCustomColor = (colorType: string, color: string) => {
    const root = window.document.documentElement;
    const hsl = hexToHsl(color);
    root.style.setProperty(`--${colorType}`, hsl);
  };

  const hexToHsl = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(
      l * 100
    )}%`;
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Theme Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themeOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  theme === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setTheme(option.value)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium">{option.label}</span>
                  {theme === option.value && (
                    <span className="ml-auto text-primary">✓</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Current Theme</h3>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm">
            <span className="font-medium">Active Theme:</span> {actualTheme}
          </p>
          <p className="text-sm text-muted-foreground">
            {theme === "system"
              ? "Following system preference"
              : `Manually set to ${theme}`}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Color Customization</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(customColors).map(([colorType, color]) => (
            <div key={colorType} className="space-y-2">
              <label className="text-sm font-medium capitalize">
                {colorType} Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    setCustomColors((prev) => ({
                      ...prev,
                      [colorType]: newColor,
                    }));
                    applyCustomColor(colorType, newColor);
                  }}
                  className="w-10 h-10 rounded border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    if (/^#[0-9A-F]{6}$/i.test(newColor)) {
                      setCustomColors((prev) => ({
                        ...prev,
                        [colorType]: newColor,
                      }));
                      applyCustomColor(colorType, newColor);
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-border rounded"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Theme Preview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-card border border-border rounded-lg">
            <h4 className="font-medium mb-2">Sample Card</h4>
            <p className="text-sm text-muted-foreground mb-3">
              This is how content will appear in the current theme.
            </p>
            <Button size="sm">Primary Button</Button>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Muted Section</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Secondary content and backgrounds.
            </p>
            <Button variant="secondary" size="sm">
              Secondary Button
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default { ThemeProvider, ThemeToggle, ThemeSettings, useTheme };
