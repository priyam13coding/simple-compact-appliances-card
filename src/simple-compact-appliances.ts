import { LitElement, html, css, nothing, PropertyValues, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant } from "custom-card-helpers";

import {
  CARD_NAME,
  CARD_VERSION,
  ApplianceType,
  APPLIANCE_TYPES,
  APPLIANCE_LABELS,
  APPLIANCE_ICONS,
  APPLIANCE_COLOR_VARS,
  STATE_COLOR_VARS,
  CONTROL_META,
  DEFAULT_CONTROLS,
  DEFAULT_CONTROLS_ROWS,
  DEFAULT_CONTROLS_PER_ROW,
  DELAY_MIN_DEFAULT,
  DELAY_MAX_DEFAULT,
  DELAY_STEP_DEFAULT,
  RUNNING_STATES,
  DOOR_OPEN_STATES,
} from "./const";
import {
  ApplianceConfig,
  ResolvedAppliance,
  ServiceAction,
  SimpleCompactAppliancesConfig,
  TapAction,
} from "./types";

// Side-effect import: registers the editor element. Same trick the thermostat
// card uses — terser would otherwise strip the @customElement-decorated class
// because nothing references it directly.
import "./editor";

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: CARD_NAME,
  name: "Simple Compact Appliances",
  description: "A compact card for controlling household appliances (washer, dryer, dishwasher, microwave).",
  preview: false,
  documentationURL: "https://github.com/priyam13coding/simple-compact-appliances-card",
});

/* eslint-disable no-console */
console.info(
  `%c ${CARD_NAME} %c v${CARD_VERSION} `,
  "color: white; background: #58a6ff; font-weight: 700;",
  "color: #58a6ff; background: white; font-weight: 700;",
);
/* eslint-enable no-console */

type Tab = "control" | "summary";

@customElement(CARD_NAME)
export class SimpleCompactAppliancesCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: SimpleCompactAppliancesConfig;
  @state() private _tab: Tab = "control";
  @state() private _activeAppliance: ApplianceType | null = null;
  @state() private _programOpen = false;

  // Optimistic UI: when the user changes program/delay/power/door we display
  // the new value immediately and reconcile against the entity state in
  // updated(). Cleared once the entity catches up or STALE_MS elapses (the
  // call probably failed — let the entity win).
  @state() private _optimistic: Record<string, { value: unknown; setAt: number }> = {};

  private static readonly STALE_MS = 5 * 60 * 1000;

  public static getConfigElement(): HTMLElement {
    return document.createElement(`${CARD_NAME}-editor`);
  }

  public static getStubConfig(
    _hass: HomeAssistant,
    _entities: string[],
  ): Partial<SimpleCompactAppliancesConfig> {
    return {
      appliances: [
        { type: "washer" },
      ],
    };
  }

  public setConfig(config: SimpleCompactAppliancesConfig): void {
    if (!config) throw new Error("Invalid configuration");
    if (!Array.isArray(config.appliances) || config.appliances.length === 0) {
      throw new Error("You must specify at least one appliance");
    }
    for (const a of config.appliances) {
      if (!a.type || !APPLIANCE_TYPES.includes(a.type)) {
        throw new Error(`Invalid appliance type: ${a.type}`);
      }
    }

    this._config = {
      show_summary: true,
      default_tab: "control",
      ...config,
    };

    if (!this._activeAppliance) {
      const enabled = config.appliances.find(a => a.enabled !== false);
      this._activeAppliance =
        this._config.default_appliance ?? enabled?.type ?? config.appliances[0].type;
    }
    if (this._config.default_tab === "summary") this._tab = "summary";
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("click", this._outsideClickHandler, true);
  }

  public getCardSize(): number {
    return 4;
  }

  // Drop optimistic values once the entity catches up or they go stale.
  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (!this._config || !this.hass) return;
    const now = Date.now();
    let dirty = false;
    const next = { ...this._optimistic };
    for (const [key, entry] of Object.entries(next)) {
      if (now - entry.setAt > SimpleCompactAppliancesCard.STALE_MS) {
        delete next[key];
        dirty = true;
      }
    }
    if (dirty) this._optimistic = next;
  }

  private _outsideClickHandler = (e: MouseEvent): void => {
    if (!this._programOpen) return;
    const wrapper = this.shadowRoot?.querySelector(".program-wrapper");
    if (!wrapper) return;
    const path = e.composedPath();
    if (!path.includes(wrapper)) {
      this._programOpen = false;
      document.removeEventListener("click", this._outsideClickHandler, true);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────
  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) return nothing;

    const visible = this._visibleAppliances();
    if (visible.length === 0) {
      return html`
        <ha-card>
          <div class="warning">No appliances enabled. Edit the card to add one.</div>
        </ha-card>
      `;
    }

    if (!this._activeAppliance || !visible.some(a => a.type === this._activeAppliance)) {
      // Reset to the first visible appliance if the selected one is no longer present.
      this._activeAppliance = visible[0].type;
    }

    const showSummary = this._config.show_summary !== false;

    return html`
      <ha-card>
        ${showSummary ? this._renderTabs() : nothing}
        ${this._tab === "control" || !showSummary
          ? this._renderControlTab(visible)
          : this._renderSummaryTab(visible)}
      </ha-card>
    `;
  }

  private _renderTabs(): TemplateResult {
    return html`
      <div class="tab-bar">
        <button
          class="tab ${this._tab === "control" ? "active" : ""}"
          @click=${() => { this._tab = "control"; this._programOpen = false; }}
        >
          <ha-icon icon="mdi:tune-vertical-variant"></ha-icon>
          <span>Control</span>
        </button>
        <button
          class="tab ${this._tab === "summary" ? "active" : ""}"
          @click=${() => { this._tab = "summary"; this._programOpen = false; }}
        >
          <ha-icon icon="mdi:view-grid-outline"></ha-icon>
          <span>Summary</span>
        </button>
      </div>
    `;
  }

  // ── Control tab ──────────────────────────────────────────────────────
  private _renderControlTab(visible: ResolvedAppliance[]): TemplateResult {
    const current = visible.find(a => a.type === this._activeAppliance) ?? visible[0];
    return html`
      ${visible.length > 1 ? this._renderSelector(visible) : nothing}
      ${this._renderApplianceCard(current)}
    `;
  }

  private _renderSelector(visible: ResolvedAppliance[]): TemplateResult {
    return html`
      <div class="selector">
        ${visible.map(a => html`
          <button
            class="chip ${a.type === this._activeAppliance ? "active" : ""}"
            style="--chip-color: ${APPLIANCE_COLOR_VARS[a.type]};"
            @click=${() => { this._activeAppliance = a.type; this._programOpen = false; }}
            title=${a.name}
          >
            <ha-icon icon=${APPLIANCE_ICONS[a.type]}></ha-icon>
            <span class="chip-label">${a.name}</span>
          </button>
        `)}
      </div>
    `;
  }

  private _renderApplianceCard(app: ResolvedAppliance): TemplateResult {
    const power     = this._getPower(app);
    const door      = this._getDoor(app);
    const running   = this._getRunning(app);
    const remaining = this._getRemainingSeconds(app);
    const program   = this._getProgram(app);
    const delay     = this._getDelay(app);
    const accent    = APPLIANCE_COLOR_VARS[app.type];

    return html`
      <div class="appliance" style="--sca-accent: ${accent};">

        <!-- Header: tile + name/program + running pill -->
        <div class="app-header">
          <div class="app-id">
            <div class="tile ${power ? "tile-on" : "tile-off"}">
              <ha-icon icon=${APPLIANCE_ICONS[app.type]}></ha-icon>
            </div>
            <div>
              <div class="app-name">${app.name}</div>
              <div class="app-program">${program ?? "—"}</div>
            </div>
          </div>
          <div class="status-pill ${running ? "running" : ""}">
            ${running && remaining != null
              ? html`<ha-icon icon="mdi:timer-outline"></ha-icon> ${formatRemaining(remaining)}`
              : running
                ? html`<ha-icon icon="mdi:play"></ha-icon> Running`
                : "Standby"}
          </div>
        </div>

        <!-- Status grid: data-driven by app.controls / rows / per_row -->
        ${this._renderStatusGrid(app)}

        <!-- Delay / Program / Play row -->
        ${this._renderControlRow(app, power, door, running, program, delay)}

        ${door === "open" ? html`<p class="hint warn">Close the door to start</p>` : nothing}
        ${!power            ? html`<p class="hint dim">Turn on power to start</p>` : nothing}
      </div>
    `;
  }

  private _renderStatusGrid(app: ResolvedAppliance): TemplateResult {
    const rows    = Math.max(1, app.controls_rows);
    const perRow  = Math.max(1, app.controls_per_row);
    const total   = rows * perRow;

    // Slice/pad the user's controls list to exactly fill the grid. Excess
    // entries are dropped, short lists get blank trailing cells.
    const slots: (string | null)[] = app.controls.slice(0, total);
    while (slots.length < total) slots.push(null);

    return html`
      <div class="status-grid" style="grid-template-columns: repeat(${perRow}, 1fr);">
        ${slots.map((name, i) => {
          const col = i % perRow;
          const row = Math.floor(i / perRow);
          const borderClasses =
            (col > 0 ? "cell-border-left " : "") +
            (row > 0 ? "cell-border-top "  : "");
          if (name == null) {
            return html`<div class="cell cell-empty ${borderClasses}"></div>`;
          }
          const cell = this._readControlCell(app, name);
          return html`
            <div
              class="cell ${cell.interactive ? "cell-interactive" : ""} ${borderClasses}"
              @click=${cell.interactive ? cell.onClick : undefined}
              title=${cell.label}
            >
              <ha-icon icon=${cell.icon} style="color: ${cell.color};"></ha-icon>
              <span class="cell-value" style="color: ${cell.color};">${cell.value}</span>
              <span class="cell-label">${cell.label}</span>
            </div>
          `;
        })}
      </div>
    `;
  }

  // Reads one control cell's display state. Returns label/icon/color/value
  // plus interaction wiring. Dispatch by control name; unknown names render
  // as a placeholder so an unrecognized config entry doesn't break the card.
  //
  // Click handling priority:
  //   1. config: control_actions[name].tap_action — overrides everything
  //   2. built-in default (power/light/fan/eco/child_lock toggle their entity)
  //   3. non-interactive (cell renders but ignores clicks)
  // A configured tap_action with action: "none" explicitly disables the cell.
  private _readControlCell(app: ResolvedAppliance, name: string): {
    label: string;
    icon: string;
    color: string;
    value: string;
    interactive: boolean;
    onClick?: () => void;
  } {
    const meta = (CONTROL_META as Record<string, { label: string; icon: string }>)[name];
    const label = meta?.label ?? name;

    const base = this._readControlDisplay(app, name, label);
    const wiring = this._resolveCellInteraction(app, name, base.defaultToggle);
    return { ...base.display, ...wiring };
  }

  // Pulls just the visual state of a cell (label/icon/color/value) + records
  // whether a default toggle exists, leaving click wiring to the caller.
  private _readControlDisplay(app: ResolvedAppliance, name: string, label: string): {
    display: { label: string; icon: string; color: string; value: string };
    defaultToggle?: () => void;
  } {
    switch (name) {
      case "status": {
        const running   = this._getRunning(app);
        const remaining = this._getRemainingSeconds(app);
        return {
          display: {
            label,
            icon: "mdi:clock-outline",
            color: running ? STATE_COLOR_VARS.running : STATE_COLOR_VARS.off,
            value: running
              ? (remaining != null ? formatRemaining(remaining) : "Running")
              : "Idle",
          },
        };
      }
      case "power": {
        const power = this._getPower(app);
        return {
          display: {
            label,
            icon: "mdi:flash",
            color: power ? STATE_COLOR_VARS.on : STATE_COLOR_VARS.off,
            value: power ? "On" : "Off",
          },
          defaultToggle: app.power_entity ? () => this._togglePower(app) : undefined,
        };
      }
      case "door": {
        const door = this._getDoor(app);
        return {
          display: {
            label,
            icon: door === "open" ? "mdi:door-open" : "mdi:door-closed",
            color: door == null
              ? STATE_COLOR_VARS.off
              : door === "closed" ? STATE_COLOR_VARS.on : STATE_COLOR_VARS.warn,
            value: door == null ? "—" : door === "closed" ? "Closed" : "Open",
          },
        };
      }
      case "temp": {
        const temp = this._getTemp(app);
        return {
          display: {
            label,
            icon: "mdi:thermometer",
            color: temp ? STATE_COLOR_VARS.temp : STATE_COLOR_VARS.off,
            value: temp ? `${temp.value}${temp.unit}` : "—",
          },
        };
      }
      case "light": {
        const optKey = `light:${app.type}`;
        const value  = this._readToggleableDisplay(app.light_entity, optKey);
        return {
          display: {
            label,
            icon: value.on ? "mdi:lightbulb-on" : "mdi:lightbulb-outline",
            color: value.on ? STATE_COLOR_VARS.on : STATE_COLOR_VARS.off,
            value: value.text,
          },
          defaultToggle: app.light_entity
            ? () => this._toggleEntity(app.light_entity!, optKey)
            : undefined,
        };
      }
      case "fan": {
        const optKey = `fan:${app.type}`;
        const value  = this._readToggleableDisplay(app.fan_entity, optKey);
        return {
          display: {
            label,
            icon: "mdi:fan",
            color: value.on ? STATE_COLOR_VARS.on : STATE_COLOR_VARS.off,
            value: value.text,
          },
          defaultToggle: app.fan_entity
            ? () => this._toggleEntity(app.fan_entity!, optKey)
            : undefined,
        };
      }
      case "water": {
        const formatted = this._getNumericWithUnit(app.water_entity);
        return {
          display: {
            label,
            icon: "mdi:water",
            color: formatted ? STATE_COLOR_VARS.on : STATE_COLOR_VARS.off,
            value: formatted ?? "—",
          },
        };
      }
      case "eco": {
        const optKey = `eco:${app.type}`;
        const value  = this._readToggleableDisplay(app.eco_entity, optKey);
        return {
          display: {
            label,
            icon: "mdi:leaf",
            color: value.on ? STATE_COLOR_VARS.on : STATE_COLOR_VARS.off,
            value: value.text,
          },
          defaultToggle: app.eco_entity
            ? () => this._toggleEntity(app.eco_entity!, optKey)
            : undefined,
        };
      }
      case "child_lock": {
        const optKey = `child_lock:${app.type}`;
        const value  = this._readToggleableDisplay(app.child_lock_entity, optKey);
        return {
          display: {
            label,
            icon: value.on ? "mdi:lock" : "mdi:lock-open-variant-outline",
            color: value.on ? STATE_COLOR_VARS.warn : STATE_COLOR_VARS.off,
            value: value.text,
          },
          defaultToggle: app.child_lock_entity
            ? () => this._toggleEntity(app.child_lock_entity!, optKey)
            : undefined,
        };
      }
      default:
        return {
          display: {
            label,
            icon: "mdi:help-circle-outline",
            color: STATE_COLOR_VARS.off,
            value: "—",
          },
        };
    }
  }

  // Resolves the click wiring for a cell. Configured tap_action wins; falls
  // back to the cell's default toggle; otherwise non-interactive.
  private _resolveCellInteraction(
    app: ResolvedAppliance,
    name: string,
    defaultToggle: (() => void) | undefined,
  ): { interactive: boolean; onClick?: () => void } {
    const tap = app.control_actions?.[name]?.tap_action;
    if (tap) {
      if (tap.action === "none") return { interactive: false };
      return {
        interactive: true,
        onClick: () => this._handleTapAction(tap, app, name),
      };
    }
    if (defaultToggle) return { interactive: true, onClick: defaultToggle };
    return { interactive: false };
  }

  // Renders a generic on/off/<state> readout from a single entity. Used by
  // light/fan/eco/child_lock so they handle integrations that publish
  // non-binary states ("Low" / "High" / "Cooking") instead of just on/off.
  private _readToggleableDisplay(
    entityId: string | undefined,
    optKey: string,
  ): { on: boolean; text: string } {
    const opt = this._optimistic[optKey];
    if (opt) {
      const bv = !!opt.value;
      return { on: bv, text: bv ? "On" : "Off" };
    }
    if (!entityId) return { on: false, text: "—" };
    const st = this.hass.states[entityId];
    if (!st || st.state === "unknown" || st.state === "unavailable") {
      return { on: false, text: "—" };
    }
    const raw = String(st.state);
    const norm = raw.toLowerCase();
    if (norm === "on")  return { on: true,  text: "On"  };
    if (norm === "off") return { on: false, text: "Off" };
    // Treat any non-zero numeric or non-empty non-off string as "on" for color.
    const n = parseFloat(raw);
    const onNumeric = !isNaN(n) && n > 0;
    const onString  = isNaN(n) && norm !== "" && norm !== "none";
    return {
      on: onNumeric || onString,
      text: this._capitalize(raw),
    };
  }

  private _capitalize(s: string): string {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  // Standard HA tap_action dispatcher. Mirrors the contract `mushroom` and
  // `button-card` implement so configs imported from those cards Just Work.
  private _handleTapAction(action: TapAction, _app: ResolvedAppliance, _controlName: string): void {
    if (action.confirmation) {
      const text = typeof action.confirmation === "object"
        ? (action.confirmation.text ?? "Are you sure?")
        : "Are you sure?";
      if (!window.confirm(text)) return;
    }

    switch (action.action) {
      case "none":
        return;

      case "toggle": {
        const eid = this._firstEntityId(action.target?.entity_id);
        if (!eid) return;
        this.hass.callService("homeassistant", "toggle", { entity_id: eid });
        return;
      }

      case "call-service":
      case "perform-action": {
        if (!action.service) return;
        const dot = action.service.indexOf(".");
        if (dot < 0) return;
        const domain  = action.service.slice(0, dot);
        const service = action.service.slice(dot + 1);
        const data    = { ...(action.data ?? action.service_data ?? {}) };
        const target  = action.target ?? undefined;
        this.hass.callService(domain, service, data, target as any);
        return;
      }

      case "more-info": {
        const eid = this._firstEntityId(action.target?.entity_id);
        if (!eid) return;
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          detail:   { entityId: eid },
          bubbles:  true,
          composed: true,
        }));
        return;
      }

      case "navigate": {
        if (!action.navigation_path) return;
        history.pushState(null, "", action.navigation_path);
        window.dispatchEvent(new Event("location-changed"));
        return;
      }

      case "url": {
        if (action.url_path) window.open(action.url_path, "_blank");
        return;
      }

      case "assist":
        // Out of scope for now — silently no-op rather than throw so the
        // card stays usable if a future config sneaks this through.
        return;
    }
  }

  private _firstEntityId(eid: string | string[] | undefined): string | undefined {
    if (!eid) return undefined;
    return Array.isArray(eid) ? eid[0] : eid;
  }

  private _renderControlRow(
    app: ResolvedAppliance,
    power: boolean,
    door: "open" | "closed" | null,
    running: boolean,
    program: string | null,
    delay: number | null,
  ): TemplateResult {
    const canStart = power && door !== "open";
    const programOptions = this._getProgramOptions(app);
    const hasDelay = app.show_delay && app.delay_entity != null;
    const delayDisabled = !hasDelay || running;

    return html`
      <div class="control-row">
        ${app.show_delay ? html`
          <span class="row-label">Delay</span>

          <button
            class="round-btn"
            ?disabled=${delayDisabled || (delay != null && delay <= app.delay_min)}
            @click=${() => this._adjustDelay(app, -app.delay_step)}
            title="Decrease delay"
          >
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>

          <span class="delay-value">
            ${delay != null ? formatDelay(delay) : "—"}
          </span>

          <button
            class="round-btn"
            ?disabled=${delayDisabled || (delay != null && delay >= app.delay_max)}
            @click=${() => this._adjustDelay(app, app.delay_step)}
            title="Increase delay"
          >
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        ` : nothing}

        <!-- Program dropdown -->
        <div class="program-wrapper">
          <button
            class="program-trigger"
            ?disabled=${!app.program_entity || programOptions.length === 0}
            @click=${() => this._toggleProgram()}
            aria-expanded=${this._programOpen}
          >
            <span class="program-text">${program ?? "—"}</span>
            <ha-icon
              icon="mdi:chevron-down"
              class="chevron ${this._programOpen ? "open" : ""}"
            ></ha-icon>
          </button>
          ${this._programOpen && programOptions.length > 0 ? html`
            <div class="program-popup" @click=${(e: Event) => e.stopPropagation()}>
              ${programOptions.map((p, i) => html`
                <button
                  class="program-option ${p === program ? "selected" : ""}"
                  style=${i < programOptions.length - 1 ? "border-bottom: 1px solid var(--sca-border);" : ""}
                  @click=${() => this._selectProgram(app, p)}
                >${p}</button>
              `)}
            </div>
          ` : nothing}
        </div>

        <!-- Play / Pause -->
        <button
          class="play-btn ${running ? "running" : ""}"
          ?disabled=${!canStart || (running ? !app.pause_action : !app.start_action)}
          @click=${() => running ? this._pause(app) : this._start(app)}
          title=${running ? "Pause" : "Start"}
        >
          <ha-icon icon=${running ? "mdi:pause" : "mdi:play"}></ha-icon>
        </button>
      </div>
    `;
  }

  // ── Summary tab ──────────────────────────────────────────────────────
  private _renderSummaryTab(visible: ResolvedAppliance[]): TemplateResult {
    const activeCount = visible.filter(a => this._getRunning(a)).length;
    return html`
      <div class="summary">
        <div class="summary-header">
          <div class="summary-title">All Appliances</div>
          <div class="summary-sub">${activeCount} active</div>
        </div>
        <div class="summary-list">
          ${visible.map(a => this._renderSummaryRow(a))}
        </div>
      </div>
    `;
  }

  private _renderSummaryRow(app: ResolvedAppliance): TemplateResult {
    const power     = this._getPower(app);
    const door      = this._getDoor(app);
    const running   = this._getRunning(app);
    const remaining = this._getRemainingSeconds(app);
    const program   = this._getProgram(app);

    let statusClass = "off";
    let statusText  = "Off";
    if (power) {
      if (door === "open") { statusClass = "warn"; statusText = "Door open"; }
      else { statusClass = "idle"; statusText = "Idle"; }
    }

    return html`
      <button
        class="summary-row"
        style="--sca-accent: ${APPLIANCE_COLOR_VARS[app.type]};"
        @click=${() => {
          this._activeAppliance = app.type;
          this._tab = "control";
          this._programOpen = false;
        }}
      >
        <div class="row-tile ${running ? "tile-running" : power ? "tile-on" : "tile-off"}">
          <ha-icon icon=${APPLIANCE_ICONS[app.type]}></ha-icon>
        </div>
        <div class="row-id">
          <div class="row-name">${app.name}</div>
          <div class="row-program">${program ?? "—"}</div>
        </div>
        <div class="row-status">
          ${running
            ? html`
                <div class="row-time">${remaining != null ? formatRemaining(remaining) : "Running"}</div>
                <div class="row-time-sub">${remaining != null ? "remaining" : ""}</div>
              `
            : html`<span class="status-tag ${statusClass}">${statusText}</span>`}
        </div>
        ${running ? html`<span class="dot"></span>` : nothing}
      </button>
    `;
  }

  // ── State readers ────────────────────────────────────────────────────
  private _visibleAppliances(): ResolvedAppliance[] {
    return this._config.appliances
      .filter(a => a.enabled !== false)
      .map(a => this._resolve(a));
  }

  // Build the resolved per-control map: every *_entity from explicit config
  // wins; anything left is filled in from device_id auto-discovery.
  private _resolve(a: ApplianceConfig): ResolvedAppliance {
    const discovered = a.device_id ? this._discoverOnDevice(a.device_id, a.type) : {};
    return {
      type:     a.type,
      name:     a.name ?? APPLIANCE_LABELS[a.type],
      enabled:  a.enabled !== false,
      power_entity:      a.power_entity      ?? discovered.power_entity,
      door_entity:       a.door_entity       ?? discovered.door_entity,
      status_entity:     a.status_entity     ?? discovered.status_entity,
      running_entity:    a.running_entity    ?? discovered.running_entity,
      program_entity:    a.program_entity    ?? discovered.program_entity,
      delay_entity:      a.delay_entity      ?? discovered.delay_entity,
      remaining_entity:  a.remaining_entity  ?? discovered.remaining_entity,
      temp_entity:       a.temp_entity       ?? discovered.temp_entity,
      light_entity:      a.light_entity      ?? discovered.light_entity,
      fan_entity:        a.fan_entity        ?? discovered.fan_entity,
      water_entity:      a.water_entity      ?? discovered.water_entity,
      eco_entity:        a.eco_entity        ?? discovered.eco_entity,
      child_lock_entity: a.child_lock_entity ?? discovered.child_lock_entity,
      start_action: a.start_action,
      pause_action: a.pause_action,
      controls:         a.controls         ?? DEFAULT_CONTROLS[a.type],
      controls_rows:    a.controls_rows    ?? DEFAULT_CONTROLS_ROWS,
      controls_per_row: a.controls_per_row ?? DEFAULT_CONTROLS_PER_ROW,
      control_actions:  a.control_actions,
      show_delay: a.show_delay !== false,
      delay_min:  a.delay_min  ?? DELAY_MIN_DEFAULT,
      delay_max:  a.delay_max  ?? DELAY_MAX_DEFAULT,
      delay_step: a.delay_step ?? DELAY_STEP_DEFAULT,
    };
  }

  // Auto-discovery — scan entities registered to the given device_id and pick
  // a best-guess slot for each control by domain + name pattern. Anything we
  // can't confidently match is left undefined (the cell renders as "—").
  private _discoverOnDevice(deviceId: string, _type: ApplianceType): Partial<ResolvedAppliance> {
    const reg = (this.hass as any).entities as
      | Record<string, { device_id?: string }>
      | undefined;
    if (!reg) return {};

    const onDevice = Object.keys(reg).filter(eid => reg[eid].device_id === deviceId);
    const states = this.hass.states;
    const result: Partial<ResolvedAppliance> = {};

    const pickFirstMatching = (
      domains: string[],
      predicate: (eid: string) => boolean,
    ): string | undefined => {
      for (const eid of onDevice) {
        if (!domains.some(d => eid.startsWith(d + "."))) continue;
        if (!states[eid]) continue;
        if (predicate(eid)) return eid;
      }
      return undefined;
    };

    const nameHas = (eid: string, ...needles: string[]): boolean => {
      const lower = eid.toLowerCase();
      const fn = (states[eid]?.attributes?.friendly_name ?? "").toString().toLowerCase();
      return needles.some(n => lower.includes(n) || fn.includes(n));
    };

    result.power_entity     = pickFirstMatching(["switch"],        eid => nameHas(eid, "power", "switch") || true);
    result.door_entity      = pickFirstMatching(["binary_sensor"], eid => nameHas(eid, "door"));
    result.status_entity    = pickFirstMatching(["sensor"],        eid => nameHas(eid, "state", "status", "mode"));
    result.running_entity   = result.status_entity;
    result.program_entity   = pickFirstMatching(["select", "input_select"], eid => nameHas(eid, "program", "cycle", "course", "mode"));
    result.delay_entity     = pickFirstMatching(["number", "input_number"], eid => nameHas(eid, "delay"));
    result.remaining_entity = pickFirstMatching(["sensor"],        eid => nameHas(eid, "remaining", "time_left", "end_time", "finish"));
    result.temp_entity      = pickFirstMatching(["sensor"],        eid =>
      states[eid]?.attributes?.device_class === "temperature"
      || nameHas(eid, "temperature", "temp"));
    result.light_entity     = pickFirstMatching(["light", "switch"], eid => nameHas(eid, "light", "lamp"));
    result.fan_entity       = pickFirstMatching(["fan", "switch"],   eid => nameHas(eid, "fan", "vent", "hood"));
    result.water_entity     = pickFirstMatching(["sensor"],          eid =>
      states[eid]?.attributes?.device_class === "water"
      || nameHas(eid, "water", "rinse"));
    result.eco_entity       = pickFirstMatching(["switch"],          eid => nameHas(eid, "eco"));
    result.child_lock_entity = pickFirstMatching(["switch", "lock"], eid => nameHas(eid, "child", "lock"));

    return result;
  }

  private _getPower(app: ResolvedAppliance): boolean {
    const opt = this._optimistic[`power:${app.type}`];
    if (opt) return !!opt.value;
    if (!app.power_entity) return true;            // assume on when not exposed
    const st = this.hass.states[app.power_entity];
    if (!st) return true;
    return st.state === "on";
  }

  private _getDoor(app: ResolvedAppliance): "open" | "closed" | null {
    if (!app.door_entity) return null;
    const st = this.hass.states[app.door_entity];
    if (!st) return null;
    return DOOR_OPEN_STATES.has(st.state.toLowerCase()) ? "open" : "closed";
  }

  private _getRunning(app: ResolvedAppliance): boolean {
    const src = app.status_entity ?? app.running_entity;
    if (!src) return false;
    const st = this.hass.states[src];
    if (!st) return false;
    return RUNNING_STATES.has(st.state.toLowerCase());
  }

  // Pulls a remaining time in seconds from either a duration-style sensor
  // (number of seconds / minutes) or a timestamp-style sensor (ISO date in
  // the future). Returns null when we can't parse anything useful.
  private _getRemainingSeconds(app: ResolvedAppliance): number | null {
    if (!app.remaining_entity) return null;
    const st = this.hass.states[app.remaining_entity];
    if (!st || st.state === "unknown" || st.state === "unavailable") return null;

    if (st.attributes?.device_class === "timestamp") {
      const t = Date.parse(st.state);
      if (isNaN(t)) return null;
      return Math.max(0, Math.round((t - Date.now()) / 1000));
    }

    const n = parseFloat(st.state);
    if (isNaN(n)) return null;
    const unit = (st.attributes?.unit_of_measurement ?? "").toLowerCase();
    if (unit.includes("min")) return Math.round(n * 60);
    if (unit.includes("h"))   return Math.round(n * 3600);
    return Math.round(n);                          // assume seconds
  }

  private _getProgram(app: ResolvedAppliance): string | null {
    const opt = this._optimistic[`program:${app.type}`];
    if (opt) return opt.value as string;
    if (!app.program_entity) return null;
    const st = this.hass.states[app.program_entity];
    if (!st) return null;
    if (st.state === "unknown" || st.state === "unavailable") return null;
    return st.state;
  }

  private _getProgramOptions(app: ResolvedAppliance): string[] {
    if (!app.program_entity) return [];
    const st = this.hass.states[app.program_entity];
    return (st?.attributes?.options as string[]) ?? [];
  }

  private _getDelay(app: ResolvedAppliance): number | null {
    const opt = this._optimistic[`delay:${app.type}`];
    if (opt) return opt.value as number;
    if (!app.delay_entity) return null;
    const st = this.hass.states[app.delay_entity];
    if (!st) return null;
    const n = parseFloat(st.state);
    return isNaN(n) ? null : n;
  }

  private _getTemp(app: ResolvedAppliance): { value: string; unit: string } | null {
    if (!app.temp_entity) return null;
    const st = this.hass.states[app.temp_entity];
    if (!st) return null;
    const n = parseFloat(st.state);
    if (isNaN(n)) return null;
    const unit = st.attributes?.unit_of_measurement ?? "";
    return { value: String(Math.round(n)), unit };
  }

  // Read "is the entity on?" through the optimistic cache. Used for light /
  // fan / eco / child_lock controls. Returns false when the entity isn't set.
  private _isOn(entityId: string | undefined, optKey: string): boolean {
    const opt = this._optimistic[optKey];
    if (opt) return !!opt.value;
    if (!entityId) return false;
    const st = this.hass.states[entityId];
    return st?.state === "on";
  }

  // Generic numeric-with-unit reader for read-only cells (water level, etc.).
  // Returns "<rounded><unit>" or null if the entity is missing/non-numeric.
  private _getNumericWithUnit(entityId: string | undefined): string | null {
    if (!entityId) return null;
    const st = this.hass.states[entityId];
    if (!st) return null;
    const n = parseFloat(st.state);
    if (isNaN(n)) return null;
    const unit = st.attributes?.unit_of_measurement ?? "";
    return `${Math.round(n)}${unit}`;
  }

  // ── Actions ──────────────────────────────────────────────────────────
  private _togglePower(app: ResolvedAppliance): void {
    if (!app.power_entity) return;
    const current = this._getPower(app);
    this._setOptimistic(`power:${app.type}`, !current);
    const domain = app.power_entity.split(".")[0];
    this.hass.callService(domain, current ? "turn_off" : "turn_on", {
      entity_id: app.power_entity,
    });
  }

  // Generic on/off toggle for non-power switch entities (light/fan/eco/lock).
  // Calls turn_on or turn_off on whatever domain the entity belongs to.
  private _toggleEntity(entityId: string, optKey: string): void {
    const current = this._isOn(entityId, optKey);
    this._setOptimistic(optKey, !current);
    const domain = entityId.split(".")[0];
    this.hass.callService(domain, current ? "turn_off" : "turn_on", {
      entity_id: entityId,
    });
  }

  private _toggleProgram(): void {
    this._programOpen = !this._programOpen;
    if (this._programOpen) {
      setTimeout(
        () => document.addEventListener("click", this._outsideClickHandler, true),
        0,
      );
    } else {
      document.removeEventListener("click", this._outsideClickHandler, true);
    }
  }

  private _selectProgram(app: ResolvedAppliance, option: string): void {
    this._programOpen = false;
    document.removeEventListener("click", this._outsideClickHandler, true);
    if (!app.program_entity) return;
    this._setOptimistic(`program:${app.type}`, option);
    const domain = app.program_entity.split(".")[0];
    const service = domain === "input_select" ? "select_option" : "select_option";
    this.hass.callService(domain, service, {
      entity_id: app.program_entity,
      option,
    });
  }

  private _adjustDelay(app: ResolvedAppliance, delta: number): void {
    if (!app.delay_entity) return;
    const current = this._getDelay(app) ?? app.delay_min;
    const next = Math.max(app.delay_min, Math.min(app.delay_max, current + delta));
    if (next === current) return;
    this._setOptimistic(`delay:${app.type}`, next);
    const domain = app.delay_entity.split(".")[0];
    const service = domain === "input_number" ? "set_value" : "set_value";
    this.hass.callService(domain, service, {
      entity_id: app.delay_entity,
      value: next,
    });
  }

  private _start(app: ResolvedAppliance): void { this._callAction(app.start_action); }
  private _pause(app: ResolvedAppliance): void { this._callAction(app.pause_action); }

  private _callAction(action: ServiceAction | undefined): void {
    if (!action || !action.service) return;
    const [domain, service] = action.service.split(".");
    if (!domain || !service) return;
    const data: Record<string, unknown> = { ...(action.service_data ?? {}) };
    if (action.target) Object.assign(data, action.target);
    this.hass.callService(domain, service, data);
  }

  private _setOptimistic(key: string, value: unknown): void {
    this._optimistic = { ...this._optimistic, [key]: { value, setAt: Date.now() } };
  }

  // ── Styles ───────────────────────────────────────────────────────────
  static styles = css`
    :host {
      display: block;
      --sca-border:        rgba(127, 127, 127, 0.18);
      --sca-border-strong: rgba(127, 127, 127, 0.28);
      --sca-subtle-bg:     rgba(127, 127, 127, 0.06);
      --sca-hover-bg:      rgba(127, 127, 127, 0.12);
      --sca-radius:        20px;
      --sca-radius-inner:  14px;
      --sca-radius-small:  10px;
      --sca-text-primary:   var(--primary-text-color);
      --sca-text-secondary: var(--secondary-text-color);
      --sca-mono:           ui-monospace, "SF Mono", "Roboto Mono", "JetBrains Mono",
                            Menlo, Consolas, monospace;
    }

    ha-card {
      border-radius: var(--sca-radius);
      overflow: visible;
      padding: 0;
    }

    .warning {
      color: var(--error-color);
      padding: 14px 18px;
      font-size: 0.9rem;
    }

    /* ── Tab bar ────────────────────────────────────────────────────── */
    .tab-bar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      padding: 8px 8px 0;
    }
    .tab {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 4px;
      border: none;
      border-radius: var(--sca-radius-small);
      background: var(--sca-subtle-bg);
      color: var(--sca-text-secondary);
      font: inherit;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: background 180ms, color 180ms;
    }
    .tab:hover { background: var(--sca-hover-bg); color: var(--sca-text-primary); }
    .tab.active {
      background: color-mix(in srgb, var(--primary-color, #58a6ff) 18%, transparent);
      color: var(--primary-color, #58a6ff);
    }
    .tab ha-icon { --mdc-icon-size: 16px; }

    /* ── Appliance selector ────────────────────────────────────────── */
    .selector {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
      gap: 6px;
      padding: 8px;
    }
    .chip {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 4px;
      border: none;
      border-radius: var(--sca-radius-small);
      background: var(--sca-subtle-bg);
      color: var(--sca-text-secondary);
      font: inherit;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      min-width: 0;
      transition: background 180ms, color 180ms;
    }
    .chip:hover { background: var(--sca-hover-bg); color: var(--sca-text-primary); }
    .chip.active {
      background: color-mix(in srgb, var(--chip-color) 18%, transparent);
      color: var(--chip-color);
    }
    .chip ha-icon { --mdc-icon-size: 16px; }
    .chip-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media (max-width: 360px) {
      .chip-label { display: none; }
    }

    /* ── Appliance card ────────────────────────────────────────────── */
    .appliance {
      padding: 8px 12px 14px;
    }
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 6px 4px 12px;
    }
    .app-id {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .tile {
      width: 36px;
      height: 36px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 200ms;
    }
    .tile ha-icon { --mdc-icon-size: 20px; }
    .tile-on  {
      background: color-mix(in srgb, var(--sca-accent) 22%, transparent);
      color: var(--sca-accent);
    }
    .tile-off {
      background: var(--sca-subtle-bg);
      color: var(--sca-text-secondary);
    }
    .app-name {
      font-size: 15px;
      font-weight: 500;
      color: var(--sca-text-primary);
      line-height: 1.15;
      text-transform: capitalize;
    }
    .app-program {
      font-size: 11px;
      color: var(--sca-text-secondary);
      line-height: 1;
      margin-top: 2px;
    }
    .status-pill {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 500;
      padding: 4px 10px;
      border-radius: 999px;
      background: var(--sca-subtle-bg);
      color: var(--sca-text-secondary);
      font-family: var(--sca-mono);
    }
    .status-pill.running {
      background: color-mix(in srgb, var(--sca-accent) 22%, transparent);
      color: var(--sca-accent);
    }
    .status-pill ha-icon { --mdc-icon-size: 12px; }

    /* ── Status grid ───────────────────────────────────────────────── */
    /* grid-template-columns is set inline per appliance (controls_per_row). */
    .status-grid {
      display: grid;
      border: 1px solid var(--sca-border);
      border-radius: var(--sca-radius-inner);
      overflow: hidden;
      margin-bottom: 10px;
    }
    .cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      padding: 10px 4px;
      min-width: 0;
      transition: background 150ms;
    }
    .cell-border-left { border-left: 1px solid var(--sca-border); }
    .cell-border-top  { border-top:  1px solid var(--sca-border); }
    .cell-empty       { background: var(--sca-subtle-bg); }
    .cell-interactive {
      cursor: pointer;
    }
    .cell-interactive:hover { background: var(--sca-hover-bg); }
    .cell ha-icon { --mdc-icon-size: 14px; }
    .cell-value {
      font-size: 11px;
      font-weight: 500;
      line-height: 1.1;
      text-align: center;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .cell-label {
      font-size: 9px;
      color: var(--sca-text-secondary);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      line-height: 1;
    }

    /* ── Control row ──────────────────────────────────────────────── */
    .control-row {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: nowrap;
    }
    .row-label {
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--sca-text-secondary);
      font-weight: 500;
      flex-shrink: 0;
    }
    .round-btn {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid var(--sca-border-strong);
      background: var(--sca-subtle-bg);
      color: var(--sca-text-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 150ms, border-color 150ms, transform 80ms;
      padding: 0;
    }
    .round-btn ha-icon { --mdc-icon-size: 14px; }
    .round-btn:hover:not(:disabled) {
      background: var(--sca-hover-bg);
      border-color: var(--sca-accent);
    }
    .round-btn:active:not(:disabled) { transform: scale(0.92); }
    .round-btn:disabled { opacity: 0.35; cursor: not-allowed; }

    .delay-value {
      width: 44px;
      text-align: center;
      font-size: 12px;
      color: var(--sca-accent);
      font-family: var(--sca-mono);
      font-weight: 500;
      flex-shrink: 0;
    }

    /* program dropdown */
    .program-wrapper {
      position: relative;
      flex: 1;
      min-width: 0;
    }
    .program-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 4px;
      padding: 7px 10px;
      border: 1px solid var(--sca-border);
      background: var(--sca-subtle-bg);
      border-radius: var(--sca-radius-small);
      color: var(--sca-text-primary);
      font: inherit;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
    }
    .program-trigger:hover:not(:disabled) { background: var(--sca-hover-bg); }
    .program-trigger:disabled { opacity: 0.5; cursor: not-allowed; }
    .program-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-transform: capitalize;
    }
    .chevron {
      --mdc-icon-size: 14px;
      color: var(--sca-text-secondary);
      transition: transform 200ms;
      flex-shrink: 0;
    }
    .chevron.open { transform: rotate(180deg); }
    .program-popup {
      position: absolute;
      bottom: calc(100% + 4px);
      left: 0;
      right: 0;
      max-height: 220px;
      overflow-y: auto;
      background: var(--card-background-color, var(--ha-card-background, #1c1b1f));
      border: 1px solid var(--sca-border-strong);
      border-radius: var(--sca-radius-small);
      z-index: 1000;
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.32);
      animation: pop 140ms ease-out;
    }
    @keyframes pop {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .program-option {
      display: block;
      width: 100%;
      padding: 9px 12px;
      background: transparent;
      border: none;
      color: var(--sca-text-secondary);
      font: inherit;
      font-size: 11px;
      text-align: left;
      cursor: pointer;
      text-transform: capitalize;
    }
    .program-option:hover {
      background: var(--sca-hover-bg);
      color: var(--sca-text-primary);
    }
    .program-option.selected {
      color: var(--sca-accent);
      background: color-mix(in srgb, var(--sca-accent) 18%, transparent);
      font-weight: 600;
    }

    /* play / pause */
    .play-btn {
      width: 38px;
      height: 30px;
      border: none;
      border-radius: 10px;
      background: var(--sca-accent);
      color: var(--card-background-color, #fff);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 150ms, transform 80ms;
    }
    .play-btn ha-icon { --mdc-icon-size: 16px; }
    .play-btn.running {
      background: var(--sca-subtle-bg);
      color: var(--sca-text-primary);
      border: 1px solid var(--sca-border-strong);
    }
    .play-btn:active:not(:disabled) { transform: scale(0.92); }
    .play-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    /* hints */
    .hint {
      margin: 8px 0 0;
      text-align: center;
      font-size: 10px;
    }
    .hint.warn { color: var(--error-color, #f2b8b8); }
    .hint.dim  { color: var(--sca-text-secondary); }

    /* ── Summary ──────────────────────────────────────────────────── */
    .summary { padding: 8px 12px 14px; }
    .summary-header { padding: 6px 4px 10px; }
    .summary-title {
      font-size: 15px;
      font-weight: 500;
      color: var(--sca-text-primary);
    }
    .summary-sub {
      font-size: 11px;
      color: var(--sca-text-secondary);
      margin-top: 2px;
    }
    .summary-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .summary-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 10px;
      border-radius: var(--sca-radius-inner);
      background: var(--sca-subtle-bg);
      border: 1px solid var(--sca-border);
      color: var(--sca-text-primary);
      font: inherit;
      cursor: pointer;
      text-align: left;
      width: 100%;
      transition: background 150ms;
    }
    .summary-row:hover { background: var(--sca-hover-bg); }
    .row-tile {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .row-tile ha-icon { --mdc-icon-size: 18px; }
    .tile-running {
      background: color-mix(in srgb, var(--sca-accent) 22%, transparent);
      color: var(--sca-accent);
    }
    .row-id { flex: 1; min-width: 0; }
    .row-name {
      font-size: 13px;
      font-weight: 500;
      text-transform: capitalize;
      line-height: 1.15;
    }
    .row-program {
      font-size: 10px;
      color: var(--sca-text-secondary);
      line-height: 1;
      margin-top: 2px;
      text-transform: capitalize;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .row-status {
      text-align: right;
      flex-shrink: 0;
    }
    .row-time {
      font-size: 12px;
      font-family: var(--sca-mono);
      font-weight: 500;
      color: var(--sca-accent);
    }
    .row-time-sub {
      font-size: 9px;
      color: var(--sca-text-secondary);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .status-tag {
      font-size: 10px;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 999px;
      background: var(--sca-subtle-bg);
      color: var(--sca-text-secondary);
    }
    .status-tag.warn {
      background: color-mix(in srgb, var(--error-color, #f2b8b8) 18%, transparent);
      color: var(--error-color, #f2b8b8);
    }
    .status-tag.off {
      background: transparent;
      color: var(--sca-text-secondary);
      opacity: 0.6;
    }
    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--sca-accent);
      box-shadow: 0 0 8px var(--sca-accent);
      flex-shrink: 0;
      animation: pulse 1.6s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.4; }
    }
  `;
}

// ── Helpers ────────────────────────────────────────────────────────────
function formatDelay(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function formatRemaining(seconds: number): string {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  }
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

declare global {
  interface HTMLElementTagNameMap {
    "simple-compact-appliances": SimpleCompactAppliancesCard;
  }
}
