// ─── Sistema de Design Metamorfose ───────────────────────────────────────────

// Detecta modo pelo horário: 6h-18h = claro, 18h-6h = escuro
export function getMode() {
  const h = new Date().getHours();
  return h >= 6 && h < 18 ? "light" : "dark";
}

export function getTokens(mode = "dark") {
  const dark = {
    bg:       "#070B14",
    bgAlt:    "#0A0F1E",
    surf:     "#0D1525",
    surf2:    "#111C30",
    surf3:    "#162038",
    border:   "#1B2A45",
    border2:  "#223354",
    text:     "#E8F4FD",
    textSub:  "#A8C8E8",
    textMuted:"#5A7A9A",
    primary:  "#1565C0",
    primaryL: "#1E88E5",
    primaryXL:"#42A5F5",
    accent:   "#0D47A1",
    glow:     "#1565C0",
    success:  "#00C853",
    warning:  "#FFD600",
    error:    "#F44336",
    shadow:   "0 8px 32px rgba(0,0,0,0.4)",
    glowBox:  "0 0 24px rgba(21,101,192,0.35)",
  };
  const light = {
    bg:       "#F0F6FF",
    bgAlt:    "#E8F2FF",
    surf:     "#FFFFFF",
    surf2:    "#F5F9FF",
    surf3:    "#EBF3FF",
    border:   "#C5D8F0",
    border2:  "#D0E4F8",
    text:     "#0D1B2A",
    textSub:  "#1A3A5C",
    textMuted:"#5A7A9A",
    primary:  "#1565C0",
    primaryL: "#1976D2",
    primaryXL:"#1E88E5",
    accent:   "#0D47A1",
    glow:     "#1565C0",
    success:  "#00897B",
    warning:  "#F57F17",
    error:    "#C62828",
    shadow:   "0 4px 20px rgba(21,101,192,0.12)",
    glowBox:  "0 0 20px rgba(21,101,192,0.2)",
  };
  return mode === "light" ? light : dark;
}

export function getGradients(T) {
  return {
    primary:  `linear-gradient(135deg, ${T.accent} 0%, ${T.primary} 40%, ${T.primaryL} 100%)`,
    primaryH: `linear-gradient(90deg, ${T.accent}, ${T.primaryL})`,
    hero:     `linear-gradient(135deg, ${T.accent} 0%, ${T.primary} 50%, ${T.primaryXL} 100%)`,
    card:     `linear-gradient(145deg, ${T.surf2}, ${T.surf})`,
    glass:    `linear-gradient(135deg, ${T.surf2}CC, ${T.surf}99)`,
    text:     `linear-gradient(135deg, ${T.primaryXL}, #90CAF9)`,
    shine:    `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)`,
  };
}
