export const CARD_VERSION = "0.2.0";
export const CARD_NAME    = "simple-compact-appliances";

export type ApplianceType = "washer" | "dryer" | "dishwasher" | "microwave";

export const APPLIANCE_TYPES: ApplianceType[] = [
  "washer",
  "dryer",
  "dishwasher",
  "microwave",
];

// Display labels used in the appliance selector and the card header.
export const APPLIANCE_LABELS: Record<ApplianceType, string> = {
  washer:     "Washer",
  dryer:      "Dryer",
  dishwasher: "Dishwasher",
  microwave:  "Microwave",
};

// MDI icons rendered on the appliance selector chip and the big header tile.
export const APPLIANCE_ICONS: Record<ApplianceType, string> = {
  washer:     "mdi:washing-machine",
  dryer:      "mdi:tumble-dryer",
  dishwasher: "mdi:dishwasher",
  microwave:  "mdi:microwave",
};

// Each appliance type has its own accent color routed through a CSS variable
// so themes and card-mod can override per-appliance. Defaults pick a soft
// Material You-ish palette aligned with the mock.
export const APPLIANCE_COLOR_VARS: Record<ApplianceType, string> = {
  washer:     "var(--sca-color-washer, #58a6ff)",      // azure
  dryer:      "var(--sca-color-dryer, #f0883e)",       // orange
  dishwasher: "var(--sca-color-dishwasher, #79c0ff)",  // light blue
  microwave:  "var(--sca-color-microwave, #d29922)",   // amber
};

// State-cell color tokens (Status / Power / Door / Temp). Same routing pattern:
// surface the default through a variable so the user can rebrand from a theme.
export const STATE_COLOR_VARS = {
  running: "var(--sca-running, #d0bcff)",
  on:      "var(--sca-on, #a8d5a2)",
  off:     "var(--sca-off, #9e99a3)",
  warn:    "var(--sca-warn, #f2b8b8)",
  temp:    "var(--sca-temp, #ffcba4)",
} as const;

// ── Control catalog ────────────────────────────────────────────────────
// Each entry the user can put in `controls: [...]`. The catalog is data-only;
// the renderer in the main card dispatches on `type` to read state + format.
// Add a new built-in by appending here and handling its `case` in
// _readControlCell() in simple-compact-appliances.ts.
export type BuiltInControl =
  | "status"
  | "power"
  | "door"
  | "temp"
  | "light"
  | "fan"
  | "water"
  | "eco"
  | "child_lock";

export const BUILT_IN_CONTROLS: BuiltInControl[] = [
  "status", "power", "door", "temp",
  "light",  "fan",   "water",
  "eco",    "child_lock",
];

// Metadata for the editor's multi-select and the cell's fallback label.
// The renderer in the main card may pick a different icon based on state
// (e.g. door-open vs door-closed) but uses this as the default.
export const CONTROL_META: Record<BuiltInControl, {
  label: string;
  icon:  string;
  entitySlot?: string;                  // which ResolvedAppliance.*_entity to read
  interactive?: boolean;                // toggleable from the cell
}> = {
  status:     { label: "Status",     icon: "mdi:clock-outline",       entitySlot: "status_entity" },
  power:      { label: "Power",      icon: "mdi:flash",               entitySlot: "power_entity",      interactive: true },
  door:       { label: "Door",       icon: "mdi:door-closed",         entitySlot: "door_entity" },
  temp:       { label: "Temp",       icon: "mdi:thermometer",         entitySlot: "temp_entity" },
  light:      { label: "Light",      icon: "mdi:lightbulb-outline",   entitySlot: "light_entity",      interactive: true },
  fan:        { label: "Fan",        icon: "mdi:fan",                 entitySlot: "fan_entity",        interactive: true },
  water:      { label: "Water",      icon: "mdi:water",               entitySlot: "water_entity" },
  eco:        { label: "Eco",        icon: "mdi:leaf",                entitySlot: "eco_entity",        interactive: true },
  child_lock: { label: "Child Lock", icon: "mdi:lock-outline",        entitySlot: "child_lock_entity", interactive: true },
};

// Per-type default control layout. Washer/Dryer/Dishwasher follow the original
// 4-cell layout; Microwave drops door/temp (rarely sensored) for light/fan.
export const DEFAULT_CONTROLS: Record<ApplianceType, BuiltInControl[]> = {
  washer:     ["status", "power", "door",  "temp"],
  dryer:      ["status", "power", "door",  "temp"],
  dishwasher: ["status", "power", "door",  "temp"],
  microwave:  ["status", "power", "light", "fan"],
};

export const DEFAULT_CONTROLS_ROWS    = 1;
export const DEFAULT_CONTROLS_PER_ROW = 4;

// Default delay-timer bounds (minutes). Each appliance can override these via
// `delay_min` / `delay_max` / `delay_step` in YAML.
export const DELAY_MIN_DEFAULT  = 15;
export const DELAY_MAX_DEFAULT  = 480;
export const DELAY_STEP_DEFAULT = 15;

// Lowercased state strings considered "running" when reading the running_entity
// or status_entity state. Anything outside this set is treated as idle/standby.
export const RUNNING_STATES = new Set([
  "run",
  "running",
  "active",
  "on",
  "wash",
  "rinse",
  "spin",
  "dry",
  "cooking",
  "delay_start",
  "delayed_start",
]);

// Lowercased state strings considered "door open" when reading the door entity.
export const DOOR_OPEN_STATES = new Set(["on", "open", "opened"]);
