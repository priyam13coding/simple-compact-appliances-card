import { LovelaceCardConfig } from "custom-card-helpers";
import { ApplianceType } from "./const";

// Service call descriptor used for start_action / pause_action / etc. — same
// shape Home Assistant uses for tap_action: { tap_action: { service: "..." } }.
export interface ServiceAction {
  service: string;                                 // e.g. "button.press" or "script.washer_start"
  service_data?: Record<string, unknown>;          // arbitrary YAML payload
  target?: {
    entity_id?: string | string[];
    device_id?: string | string[];
    area_id?:   string | string[];
  };
}

// Standard Home Assistant tap_action shape, used by the per-control click
// handler (control_actions[<name>].tap_action). Mirrors the `ui_action`
// selector other HACS cards expose — so a user familiar with mushroom /
// button-card finds the same fields here.
export interface TapAction {
  action: "none" | "toggle" | "call-service" | "perform-action"
        | "more-info" | "navigate" | "url" | "assist";
  service?:         string;                        // for call-service / perform-action
  data?:            Record<string, unknown>;       // newer alias
  service_data?:    Record<string, unknown>;       // legacy alias
  target?: {
    entity_id?: string | string[];
    device_id?: string | string[];
    area_id?:   string | string[];
  };
  navigation_path?: string;                        // for navigate
  url_path?:        string;                        // for url
  confirmation?: boolean | { text?: string };      // simple confirm dialog
}

export interface ControlActionConfig {
  tap_action?: TapAction;
  // hold_action / double_tap_action could be added later — same shape.
}

// Per-appliance entity mapping. `type` selects which icon/label to render and
// what discovery slug to look for; `device_id` enables auto-discovery of the
// per-control entities. Every *_entity field is an override that takes priority
// over auto-discovery.
export interface ApplianceConfig {
  type: ApplianceType;                             // washer | dryer | dishwasher | microwave
  name?: string;                                   // Display name (defaults to APPLIANCE_LABELS[type])
  device_id?: string;                              // Auto-discover entities on this device
  enabled?: boolean;                               // Hide the appliance without removing it (default true)

  // Per-control entity overrides
  power_entity?:      string;                      // switch.* — power toggle
  door_entity?:       string;                      // binary_sensor.* — state "on" = open
  status_entity?:     string;                      // sensor.* — running/idle/done text
  running_entity?:    string;                      // sensor.* or binary_sensor.* — used when status_entity isn't set
  program_entity?:    string;                      // select.* — current program
  delay_entity?:      string;                      // number.* — delay-start in minutes
  remaining_entity?:  string;                      // sensor.* — remaining time (seconds, minutes, or timestamp)
  temp_entity?:       string;                      // sensor.* — water/cook temperature
  light_entity?:      string;                      // switch.* or light.* — appliance light (interactive)
  fan_entity?:        string;                      // switch.* or fan.* — appliance fan (interactive)
  water_entity?:      string;                      // sensor.* — water level / consumption (read-only)
  eco_entity?:        string;                      // switch.* — eco mode (interactive)
  child_lock_entity?: string;                      // switch.* — child lock (interactive)

  // Service calls for start / pause buttons. Most integrations expose
  // button.* or script.* — set these explicitly.
  start_action?: ServiceAction;
  pause_action?: ServiceAction;

  // Status-grid layout. `controls` is the ordered list of cells (any name from
  // BUILT_IN_CONTROLS). Grid total = rows × per_row; excess controls are
  // truncated, empty slots render as blank cells. Defaults: per-type from
  // DEFAULT_CONTROLS, rows=1, per_row=4.
  controls?:         string[];
  controls_rows?:    number;
  controls_per_row?: number;

  // Per-cell tap behavior. Map from built-in control name → action config.
  // When `tap_action` is set, it overrides the cell's default click handler
  // (e.g. light/fan default toggle the switch — set tap_action to call a
  // script instead). Action "none" makes the cell explicitly non-interactive.
  control_actions?: Record<string, ControlActionConfig>;

  // Bottom control row. show_delay hides only the delay −/+/value triplet;
  // program dropdown and play/pause stay rendered. Default true.
  show_delay?: boolean;

  // Delay slider bounds (minutes). Defaults: 15 / 480 / 15.
  delay_min?:  number;
  delay_max?:  number;
  delay_step?: number;
}

export interface SimpleCompactAppliancesConfig extends LovelaceCardConfig {
  type: string;                                    // Always "custom:simple-compact-appliances"
  name?: string;                                   // Optional: card title
  appliances: ApplianceConfig[];                   // Required: one entry per appliance
  show_summary?: boolean;                          // Show the Summary tab (default true)
  default_tab?: "control" | "summary";             // Tab opened on first render (default "control")
  default_appliance?: ApplianceType;               // Appliance selected on first render
}

// Internal: a resolved per-control mapping after auto-discovery + overrides.
export interface ResolvedAppliance {
  type: ApplianceType;
  name: string;
  enabled: boolean;
  power_entity?:      string;
  door_entity?:       string;
  status_entity?:     string;
  running_entity?:    string;
  program_entity?:    string;
  delay_entity?:      string;
  remaining_entity?:  string;
  temp_entity?:       string;
  light_entity?:      string;
  fan_entity?:        string;
  water_entity?:      string;
  eco_entity?:        string;
  child_lock_entity?: string;
  start_action?: ServiceAction;
  pause_action?: ServiceAction;
  controls:         string[];
  controls_rows:    number;
  controls_per_row: number;
  control_actions?: Record<string, ControlActionConfig>;
  show_delay: boolean;
  delay_min:  number;
  delay_max:  number;
  delay_step: number;
}
