# Simple Compact Appliances Card

A minimalist, themable Lovelace card for controlling household appliances — washer, dryer, dishwasher, and microwave — in Home Assistant.

Designed alongside [simple-compact-thermostat](https://github.com/priyam13coding/simple-compact-thermostat-card): same compact footprint, same theme-driven palette, full GUI editor.

## Features

- **One card, up to four appliances.** Tab between them in the Control view, or see them all at a glance in the Summary view.
- **Configurable status grid.** Pick any of 9 built-in controls (`status`, `power`, `door`, `temp`, `light`, `fan`, `water`, `eco`, `child_lock`) and lay them out as 1×4, 2×3, 1×6, etc. — independently per appliance. Microwave defaults to `[status, power, light, fan]`; washer/dryer/dishwasher default to `[status, power, door, temp]`.
- **Per-control entity mapping.** Map any combination of `switch.*`, `light.*`, `fan.*`, `binary_sensor.*`, `sensor.*`, `select.*`, `number.*`, `button.*` / `script.*`. Anything you don't map is hidden or shown as "—".
- **Auto-discovery from a device.** Point at a `device_id` and the card auto-fills every entity slot it can. Per-control overrides win when set.
- **Optional delay timer.** Set `show_delay: false` per appliance to hide the delay −/+ buttons. Program selector and Play/Pause stay rendered.
- **GUI editor.** No YAML required for the common cases. Per-appliance sections for entity mapping, controls grid, and delay bounds, plus an advanced YAML block for `start_action` / `pause_action` service calls.
- **Theme-friendly.** Every color, spacing, and radius is routed through a CSS variable (`--sca-*`). Override per appliance type (`--sca-color-washer`, …) or per state token (`--sca-running`, …) from your theme or with `card_mod`.
- **Optimistic UI.** Toggling power, light, fan, eco, child lock, changing a program, or adjusting the delay updates the card instantly; the card reconciles against the entity once Home Assistant catches up.

## Install

### HACS (recommended)

1. HACS → Frontend → ⋮ → Custom repositories → add this repo as type "Lovelace".
2. Install **Simple Compact Appliances**.
3. Add it to a dashboard from the card picker.

### Manual

1. Copy `dist/simple-compact-appliances.js` into `<config>/www/`.
2. Add it as a Lovelace resource (type `module`).
3. Add the card from the picker, or paste the YAML below.

## Minimal YAML

```yaml
type: custom:simple-compact-appliances
appliances:
  - type: washer
    device_id: a1b2c3d4e5f6                    # auto-discovers everything on this device
    start_action: { service: button.press, target: { entity_id: button.washer_start } }
    pause_action: { service: button.press, target: { entity_id: button.washer_pause } }
  - type: dryer
    device_id: f6e5d4c3b2a1
    start_action: { service: button.press, target: { entity_id: button.dryer_start } }
    pause_action: { service: button.press, target: { entity_id: button.dryer_pause } }
```

## Full YAML reference

```yaml
type: custom:simple-compact-appliances
name: Laundry & kitchen        # optional title
show_summary: true             # default true — show the Summary tab
default_tab: control           # control | summary (default: control)
default_appliance: washer      # which appliance is selected on first render

appliances:
  - type: washer               # required: washer | dryer | dishwasher | microwave
    name: Front-loader         # display name (default: capitalized type)
    enabled: true              # default true — hide without removing
    device_id: a1b2c3d4e5f6    # optional: auto-discover related entities

    # Per-control overrides — set any of these to override auto-discovery.
    # Anything omitted is filled from device_id, or left empty (cell shows "—").
    power_entity:     switch.washer
    door_entity:      binary_sensor.washer_door
    status_entity:    sensor.washer_state           # "running"/"idle"/"done"
    running_entity:   binary_sensor.washer_running  # fallback if status_entity is set
    program_entity:   select.washer_program
    delay_entity:     number.washer_delay_start
    remaining_entity: sensor.washer_remaining_time  # seconds, minutes, or timestamp
    temp_entity:      sensor.washer_water_temperature
    light_entity:     switch.washer_light            # for `light` control cell
    fan_entity:       switch.washer_fan              # for `fan` control cell
    water_entity:     sensor.washer_water_level      # for `water` control cell
    eco_entity:       switch.washer_eco              # for `eco` control cell
    child_lock_entity: switch.washer_child_lock      # for `child_lock` control cell

    # Status-grid layout. Defaults depend on the appliance `type`:
    #   washer/dryer/dishwasher: [status, power, door, temp] in a 1×4 grid
    #   microwave:               [status, power, light, fan] in a 1×4 grid
    controls_rows:    2
    controls_per_row: 3
    controls:                                        # rendered row-by-row, ltr
      - status
      - power
      - door
      - temp
      - eco
      - water

    show_delay: true                                 # hide the −/+ delay
                                                     # buttons when false

    # Service calls fired by the Play/Pause button.
    start_action:
      service: button.press
      target:  { entity_id: button.washer_start }
    pause_action:
      service: button.press
      target:  { entity_id: button.washer_pause }

    # Delay-timer slider bounds (minutes). Defaults: 15 / 480 / 15.
    delay_min:  15
    delay_max:  480
    delay_step: 15
```

## Status grid recipes

| Appliance | Want | YAML |
|---|---|---|
| **Microwave with light + fan** (default) | `[status, power, light, fan]` | nothing — it's the default |
| **Dishwasher 2×3 with eco + water** | 6 cells in two rows | `controls_rows: 2`<br>`controls_per_row: 3`<br>`controls: [status, power, door, temp, eco, water]` |
| **Washer 1×3 without temp** | drop temp cell | `controls_per_row: 3`<br>`controls: [status, power, door]` |
| **Microwave with no delay** | hide the −/+ buttons | `show_delay: false` |
| **Smart plug-only appliance** | just status + power | `controls_per_row: 2`<br>`controls: [status, power]`<br>`show_delay: false` |

## Theming

Every color and radius is a CSS variable. Override from a theme or with `card_mod`:

```yaml
card_mod:
  style: |
    ha-card {
      --sca-color-washer:     #58a6ff;   /* per-appliance accent */
      --sca-color-dryer:      #f0883e;
      --sca-color-dishwasher: #79c0ff;
      --sca-color-microwave:  #d29922;
      --sca-running: #d0bcff;            /* state-cell tokens */
      --sca-on:      #a8d5a2;
      --sca-warn:    #f2b8b8;
      --sca-radius:  20px;
    }
```

## Build

```powershell
powershell -ExecutionPolicy Bypass -File build.ps1
```

The bundle lands at `dist/simple-compact-appliances.js`.

## License

MIT
