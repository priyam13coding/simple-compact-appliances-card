# Changelog

## 0.3.0 — per-cell tap actions

- Every control cell can now run a standard Home Assistant `tap_action`
  on click (`none`, `toggle`, `call-service`, `more-info`, `navigate`,
  `url`) — same shape as Mushroom / button-card.
- When `tap_action` is set, it overrides the cell's default toggle
  behavior. Useful for the common pattern where a "switch" entity is
  actually a sensor and a script does the work (e.g. `light_entity:
  sensor.microwave_light_display` + `tap_action: { service:
  script.cycle_microwave_light }`).
- `action: none` explicitly disables a cell (e.g. read-only "Power"
  display without click handling).
- Light / fan / eco / child_lock cells now show the entity's raw state
  ("Low" / "High" / "Cooking") when it isn't simply "on"/"off".
- Editor: new "Tap actions per control" expandable section per
  appliance, with one HA-native `ui_action` selector per control.

## 0.2.0 — configurable status grid

- Each appliance can now define its own grid: `controls_rows` × `controls_per_row`,
  and an ordered `controls: [...]` list picking from the built-in catalog
  (status, power, door, temp, light, fan, water, eco, child_lock).
- New default for microwave: `[status, power, light, fan]`. Washer/dryer/dishwasher
  keep the original `[status, power, door, temp]`.
- New entity slots: `light_entity`, `fan_entity`, `water_entity`, `eco_entity`,
  `child_lock_entity`. Auto-discovery extended to find these on the configured
  `device_id` by domain + name pattern.
- New `show_delay` flag — set `false` to hide the delay −/+ buttons in the
  bottom row (program dropdown and Play/Pause stay rendered).
- Editor: new "Controls grid" expandable section per appliance with rows,
  per-row, control multi-select, and show_delay toggle.

## 0.1.0 — initial release

- Card scaffolding modeled on `simple-compact-thermostat`.
- Up to four appliances (washer / dryer / dishwasher / microwave) with a
  Control tab and a Summary tab.
- Per-control entity mapping with `device_id` auto-discovery and per-control
  overrides.
- GUI editor with collapsible per-appliance sections, plus an advanced YAML
  block for `start_action` / `pause_action` service calls.
- Theme-friendly: every color routed through a `--sca-*` CSS variable.
- Optimistic UI for power, program, and delay changes.
