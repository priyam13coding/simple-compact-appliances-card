import { LitElement, html, css, nothing, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant } from "custom-card-helpers";
import {
  CARD_NAME,
  APPLIANCE_TYPES,
  APPLIANCE_LABELS,
  BUILT_IN_CONTROLS,
  CONTROL_META,
  DEFAULT_CONTROLS,
  DEFAULT_CONTROLS_ROWS,
  DEFAULT_CONTROLS_PER_ROW,
} from "./const";
import { ApplianceConfig, SimpleCompactAppliancesConfig } from "./types";

export const EDITOR_NAME = `${CARD_NAME}-editor`;

const TOP_LABELS: Record<string, string> = {
  name:              "Card title",
  show_summary:      "Show summary tab",
  default_tab:       "Default tab",
  default_appliance: "Default appliance",
};

const TOP_SCHEMA = [
  { name: "name", selector: { text: {} } },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "show_summary", selector: { boolean: {} } },
      {
        name: "default_tab",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "control", label: "Control" },
              { value: "summary", label: "Summary" },
            ],
          },
        },
      },
    ],
  },
];

const APPLIANCE_LABELS_FORM: Record<string, string> = {
  type:              "Appliance type",
  name:              "Display name",
  device_id:         "Device (auto-discovery)",
  enabled:           "Enabled",
  power_entity:      "Power switch",
  door_entity:       "Door sensor",
  status_entity:     "Status sensor",
  running_entity:    "Running sensor (fallback)",
  program_entity:    "Program select",
  delay_entity:      "Delay start",
  remaining_entity:  "Remaining time sensor",
  temp_entity:       "Temperature sensor",
  light_entity:      "Light",
  fan_entity:        "Fan",
  water_entity:      "Water sensor",
  eco_entity:        "Eco switch",
  child_lock_entity: "Child lock",
  controls:          "Controls (in display order)",
  controls_rows:     "Rows",
  controls_per_row:  "Controls per row",
  show_delay:        "Show delay timer",
  delay_min:         "Delay min (minutes)",
  delay_max:         "Delay max (minutes)",
  delay_step:        "Delay step (minutes)",
};

const APPLIANCE_SCHEMA = [
  {
    type: "grid",
    name: "",
    schema: [
      {
        name: "type",
        required: true,
        selector: {
          select: {
            mode: "dropdown",
            options: APPLIANCE_TYPES.map(t => ({ value: t, label: APPLIANCE_LABELS[t] })),
          },
        },
      },
      { name: "enabled", selector: { boolean: {} } },
    ],
  },
  { name: "name",      selector: { text: {} } },
  { name: "device_id", selector: { device: {} } },
  {
    type: "expandable",
    name: "",
    title: "Entity mapping (overrides auto-discovery)",
    icon: "mdi:link-variant",
    schema: [
      { name: "power_entity",      selector: { entity: { domain: ["switch", "input_boolean"] } } },
      { name: "door_entity",       selector: { entity: { domain: ["binary_sensor"] } } },
      { name: "status_entity",     selector: { entity: { domain: ["sensor"] } } },
      { name: "running_entity",    selector: { entity: { domain: ["sensor", "binary_sensor"] } } },
      { name: "program_entity",    selector: { entity: { domain: ["select", "input_select"] } } },
      { name: "delay_entity",      selector: { entity: { domain: ["number", "input_number"] } } },
      { name: "remaining_entity",  selector: { entity: { domain: ["sensor"] } } },
      { name: "temp_entity",       selector: { entity: { domain: ["sensor"] } } },
      { name: "light_entity",      selector: { entity: { domain: ["light", "switch"] } } },
      { name: "fan_entity",        selector: { entity: { domain: ["fan", "switch"] } } },
      { name: "water_entity",      selector: { entity: { domain: ["sensor"] } } },
      { name: "eco_entity",        selector: { entity: { domain: ["switch", "input_boolean"] } } },
      { name: "child_lock_entity", selector: { entity: { domain: ["switch", "lock"] } } },
    ],
  },
  {
    type: "expandable",
    name: "",
    title: "Controls grid (which cells, how many rows)",
    icon: "mdi:view-grid-outline",
    schema: [
      {
        type: "grid",
        name: "",
        schema: [
          { name: "controls_rows",    selector: { number: { min: 1, max: 4, step: 1, mode: "box" } } },
          { name: "controls_per_row", selector: { number: { min: 1, max: 6, step: 1, mode: "box" } } },
        ],
      },
      {
        name: "controls",
        selector: {
          select: {
            multiple: true,
            mode: "list",
            options: BUILT_IN_CONTROLS.map(c => ({ value: c, label: CONTROL_META[c].label })),
          },
        },
      },
      { name: "show_delay", selector: { boolean: {} } },
    ],
  },
  {
    type: "expandable",
    name: "",
    title: "Delay bounds (minutes)",
    icon: "mdi:timer-sand",
    schema: [
      {
        type: "grid",
        name: "",
        schema: [
          { name: "delay_min",  selector: { number: { min: 0,   max: 720, step: 1, mode: "box" } } },
          { name: "delay_max",  selector: { number: { min: 15,  max: 1440, step: 15, mode: "box" } } },
          { name: "delay_step", selector: { number: { min: 1,   max: 60, step: 1, mode: "box" } } },
        ],
      },
    ],
  },
];

const APPLIANCE_DEFAULTS: Partial<ApplianceConfig> = {
  enabled:          true,
  controls_rows:    DEFAULT_CONTROLS_ROWS,
  controls_per_row: DEFAULT_CONTROLS_PER_ROW,
  show_delay:       true,
  delay_min:        15,
  delay_max:        480,
  delay_step:       15,
};

@customElement(EDITOR_NAME)
export class SimpleCompactAppliancesEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: SimpleCompactAppliancesConfig;
  @state() private _expanded = 0;                  // index of the open appliance section

  public setConfig(config: SimpleCompactAppliancesConfig): void {
    this._config = config;
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) return html``;

    const appliances = this._config.appliances ?? [];
    const topData = {
      show_summary: this._config.show_summary !== false,
      default_tab:  this._config.default_tab ?? "control",
      ...this._config,
    };

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${topData}
        .schema=${TOP_SCHEMA}
        .computeLabel=${(s: { name: string }) => TOP_LABELS[s.name] ?? s.name}
        @value-changed=${this._topChanged}
      ></ha-form>

      <div class="section-title">Appliances</div>
      ${appliances.map((a, i) => this._renderApplianceEditor(a, i))}

      <div class="actions">
        <ha-button @click=${this._addAppliance}>
          <ha-icon icon="mdi:plus" slot="icon"></ha-icon>
          Add appliance
        </ha-button>
      </div>

      <div class="advanced">
        <div class="advanced-title">Advanced YAML — start_action / pause_action</div>
        <div class="advanced-desc">
          Service calls used by the Play/Pause button per appliance. Each appliance gets a
          <code>start_action</code> and <code>pause_action</code> object with
          <code>service</code>, optional <code>service_data</code>, and optional <code>target</code>.
        </div>
        <ha-yaml-editor
          .defaultValue=${this._actionsConfig()}
          @value-changed=${this._actionsChanged}
        ></ha-yaml-editor>
      </div>
    `;
  }

  private _renderApplianceEditor(a: ApplianceConfig, i: number): TemplateResult {
    const expanded = this._expanded === i;
    // Prefill controls with the per-type default so the multi-select shows
    // what the card is actually rendering (rather than appearing empty).
    const typeDefault = DEFAULT_CONTROLS[a.type] ?? DEFAULT_CONTROLS.washer;
    const data = { ...APPLIANCE_DEFAULTS, controls: typeDefault, ...a };
    return html`
      <div class="appliance-card">
        <div class="appliance-head" @click=${() => this._expanded = expanded ? -1 : i}>
          <ha-icon icon="mdi:${expanded ? "chevron-down" : "chevron-right"}"></ha-icon>
          <span class="appliance-head-name">
            ${a.name ?? APPLIANCE_LABELS[a.type] ?? "Appliance"}
            <span class="appliance-head-type">(${a.type})</span>
          </span>
          <ha-icon-button
            label="Move up"
            @click=${(e: Event) => { e.stopPropagation(); this._move(i, -1); }}
            ?disabled=${i === 0}
          >
            <ha-icon icon="mdi:arrow-up"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            label="Move down"
            @click=${(e: Event) => { e.stopPropagation(); this._move(i, 1); }}
            ?disabled=${i === (this._config.appliances?.length ?? 0) - 1}
          >
            <ha-icon icon="mdi:arrow-down"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            label="Remove"
            @click=${(e: Event) => { e.stopPropagation(); this._remove(i); }}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </ha-icon-button>
        </div>
        ${expanded ? html`
          <div class="appliance-body">
            <ha-form
              .hass=${this.hass}
              .data=${data}
              .schema=${APPLIANCE_SCHEMA}
              .computeLabel=${(s: { name: string }) => APPLIANCE_LABELS_FORM[s.name] ?? s.name}
              @value-changed=${(e: CustomEvent) => this._applianceChanged(i, e)}
            ></ha-form>
          </div>
        ` : nothing}
      </div>
    `;
  }

  // Subset of the config kept in the actions YAML editor — per-appliance
  // start_action / pause_action that ha-form can't really render directly.
  private _actionsConfig(): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    (this._config.appliances ?? []).forEach((a, i) => {
      const key = `${a.type}_${i}`;
      const entry: Record<string, unknown> = {};
      if (a.start_action) entry.start_action = a.start_action;
      if (a.pause_action) entry.pause_action = a.pause_action;
      out[key] = entry;
    });
    return out;
  }

  // Re-merge the YAML-edited actions back into the appliance list by index.
  private _actionsChanged = (e: CustomEvent): void => {
    if (e.detail.isValid === false) return;
    const adv = (e.detail.value ?? {}) as Record<string, { start_action?: unknown; pause_action?: unknown }>;
    const entries = Object.values(adv);
    const merged: SimpleCompactAppliancesConfig = {
      ...this._config,
      appliances: (this._config.appliances ?? []).map((a, i) => ({
        ...a,
        start_action: entries[i]?.start_action as ApplianceConfig["start_action"],
        pause_action: entries[i]?.pause_action as ApplianceConfig["pause_action"],
      })),
    };
    this._fire(merged);
  };

  private _topChanged = (e: CustomEvent): void => {
    const merged: any = { ...this._config, ...e.detail.value };
    if (merged.show_summary === true) delete merged.show_summary;
    if (merged.default_tab === "control") delete merged.default_tab;
    if (merged.name === "" || merged.name == null) delete merged.name;
    this._fire(merged);
  };

  private _applianceChanged(i: number, e: CustomEvent): void {
    const v = e.detail.value;
    const next: ApplianceConfig = { ...this._config.appliances[i], ...v };

    // Strip values that match runtime defaults so the YAML stays minimal.
    for (const [k, dv] of Object.entries(APPLIANCE_DEFAULTS)) {
      if ((next as any)[k] === dv) delete (next as any)[k];
    }
    // Strip `controls` when it equals the per-type default (same length AND
    // same order). User-customised lists are kept verbatim.
    const typeDefault = DEFAULT_CONTROLS[next.type] ?? DEFAULT_CONTROLS.washer;
    if (Array.isArray(next.controls)
        && next.controls.length === typeDefault.length
        && next.controls.every((c, idx) => c === typeDefault[idx])) {
      delete next.controls;
    }
    for (const k of Object.keys(next) as (keyof ApplianceConfig)[]) {
      if (next[k] === "" || next[k] === undefined) delete (next as any)[k];
    }

    const merged: SimpleCompactAppliancesConfig = {
      ...this._config,
      appliances: this._config.appliances.map((a, j) => j === i ? next : a),
    };
    this._fire(merged);
  }

  private _addAppliance = (): void => {
    const used = new Set((this._config.appliances ?? []).map(a => a.type));
    const next = APPLIANCE_TYPES.find(t => !used.has(t)) ?? APPLIANCE_TYPES[0];
    const merged: SimpleCompactAppliancesConfig = {
      ...this._config,
      appliances: [...(this._config.appliances ?? []), { type: next }],
    };
    this._expanded = merged.appliances.length - 1;
    this._fire(merged);
  };

  private _remove(i: number): void {
    const merged: SimpleCompactAppliancesConfig = {
      ...this._config,
      appliances: this._config.appliances.filter((_, j) => j !== i),
    };
    this._fire(merged);
  }

  private _move(i: number, delta: number): void {
    const arr = [...this._config.appliances];
    const j = i + delta;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    if (this._expanded === i) this._expanded = j;
    else if (this._expanded === j) this._expanded = i;
    this._fire({ ...this._config, appliances: arr });
  }

  private _fire(config: SimpleCompactAppliancesConfig): void {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail:   { config },
        bubbles:  true,
        composed: true,
      }),
    );
  }

  static styles = css`
    :host { display: block; }
    .section-title {
      margin: 18px 0 6px;
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .appliance-card {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--secondary-background-color);
      margin-bottom: 8px;
      overflow: hidden;
    }
    .appliance-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 8px 8px 12px;
      cursor: pointer;
      user-select: none;
    }
    .appliance-head:hover { background: var(--input-fill-color, rgba(127,127,127,0.06)); }
    .appliance-head-name {
      flex: 1;
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-text-color);
      text-transform: capitalize;
    }
    .appliance-head-type {
      color: var(--secondary-text-color);
      font-weight: 400;
      margin-left: 6px;
      font-size: 11px;
    }
    .appliance-body {
      padding: 4px 12px 12px;
      border-top: 1px solid var(--divider-color);
    }
    .actions { margin: 10px 0 6px; display: flex; justify-content: flex-start; }
    .advanced {
      margin-top: 18px;
      padding: 12px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }
    .advanced-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
      margin-bottom: 4px;
    }
    .advanced-desc {
      font-size: 11px;
      color: var(--secondary-text-color);
      line-height: 1.6;
      margin-bottom: 10px;
    }
    .advanced-desc code {
      font-family: var(--code-font-family, ui-monospace, "Roboto Mono", monospace);
      font-size: 11px;
      padding: 1px 5px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      border-radius: 4px;
    }
    ha-yaml-editor { display: block; }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "simple-compact-appliances-editor": SimpleCompactAppliancesEditor;
  }
}
