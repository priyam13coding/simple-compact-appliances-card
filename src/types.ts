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
  power_entity?:     string;                       // switch.* — power toggle
  door_entity?:      string;                       // binary_sensor.* — state "on" = open
  status_entity?:    string;                       // sensor.* — running/idle/done text
  running_entity?:   string;                       // sensor.* or binary_sensor.* — used when status_entity isn't set
  program_entity?:   string;                       // select.* — current program
  delay_entity?:     string;                       // number.* — delay-start in minutes
  remaining_entity?: string;                       // sensor.* — remaining time (seconds, minutes, or timestamp)
  temp_entity?:      string;                       // sensor.* — water/cook temperature

  // Service calls for start / pause buttons. Most integrations expose
  // button.* or script.* — set these explicitly.
  start_action?: ServiceAction;
  pause_action?: ServiceAction;

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
  power_entity?:     string;
  door_entity?:      string;
  status_entity?:    string;
  running_entity?:   string;
  program_entity?:   string;
  delay_entity?:     string;
  remaining_entity?: string;
  temp_entity?:      string;
  start_action?: ServiceAction;
  pause_action?: ServiceAction;
  delay_min:  number;
  delay_max:  number;
  delay_step: number;
}
