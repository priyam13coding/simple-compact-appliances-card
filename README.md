# Simple Compact Appliances Card

A minimalist, themable Lovelace card for controlling household appliances — washer, dryer, dishwasher, and microwave — in Home Assistant.

Designed alongside [simple-compact-thermostat](https://github.com/priyam13coding/simple-compact-thermostat-card): same compact footprint, same theme-driven palette, full GUI editor.

## Features

- **One card, up to four appliances.** Tab between them in the Control view, or see them all at a glance in the Summary view.
- **Per-control entity mapping.** Map any combination of `switch.*`, `binary_sensor.*`, `sensor.*`, `select.*`, `number.*`, and `button.*` / `script.*` entities. Anything you don't map is hidden or shown as "—".
- **Auto-discovery from a device.** Point at a `device_id` and the card auto-fills power, door, status, program, delay, remaining-time, and temperature entities. Per-control overrides win when set.
- **GUI editor.** No YAML required for the common cases. An expandable section per appliance, plus an advanced YAML block for `start_action` / `pause_action` service calls.
- **Theme-friendly.** Every color, spacing, and radius is routed through a CSS variable (`--sca-*`). Override per appliance type (`--sca-color-washer`, …) or per state token (`--sca-running`, …) from your theme or with `card_mod`.
- **Optimistic UI.** Toggling power, changing a program, or adjusting the delay updates the card instantly; the card reconciles against the entity once Home Assistant catches up.

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
