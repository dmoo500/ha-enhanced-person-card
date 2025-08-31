# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## v2.0.0 - 2025-08-31

### Added
- Visual Editor: Fully modernized Lovelace editor based on LitElement
- Configuration editor now preserves all Lovelace layout options (e.g., full width)
- Device attributes: Shows the `friendly_name` next to the attribute name if multiple attributes with the same name (e.g., several "Battery") are present
- Device click: Clicking a device now opens the Home Assistant more-info dialog for that device

### Improved
- Improved dynamic display and sizing (uses Home Assistant calculations)
- Better assignment and display of device and sensor attributes
- Responsive design and optimized appearance on all devices

### Fixed
- Editor: Layout options like "full width card" are no longer overwritten when saving
- Correct display and assignment of multiple attributes with the same name (e.g., Battery)

---

## v1.3.2 - 2025-08-17

- Fix: Improved dynamic display and sizing (use the HA calculations)

## v1.3.1 – 2025-08-17

- Fix: Improved display and sizing on small screens (e.g., iPhone 15 portrait)
- Build: Added minified build using esbuild

## [1.3.0] - 2025-08-17

### Added
- Full-width layout support with `columns: "full"`
- Responsive icon sizing based on grid column count
- Enhanced CSS grid properties for better container integration
- Cross-device sensor protection to prevent duplicate assignments
- Visual configuration editor with badge style options
- Comprehensive device attribute display options
- Smart sensor-to-device matching using device IDs

### Improved
- Icon sizing now scales appropriately for wide layouts (9+ columns)
- Better device name matching algorithms to prevent cross-contamination
- Optimized rendering performance with selective updates
- Enhanced grid layout responsiveness across different dashboard layouts
- More precise sensor assignment with strict name verification

### Fixed
- Resolved duplicate battery level displays for similar device names
- Fixed oversized icons in full-width layouts
- Corrected sensor assignment conflicts between devices
- Improved responsive behavior on mobile devices

### Technical
- Migrated to TypeScript for better code maintainability
- Implemented shadow DOM for proper style encapsulation
- Added comprehensive error handling and debug logging
- Optimized CSS custom properties for dynamic styling
- Enhanced HACS compatibility with proper metadata

## [1.2.0] - Previous Release

### Added
- Basic person card functionality
- Device tracker integration
- Simple grid layout support

## [1.1.0] - Previous Release

### Added
- Initial release
- Person entity display
- Basic device tracking