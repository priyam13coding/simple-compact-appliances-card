# Changelog

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
