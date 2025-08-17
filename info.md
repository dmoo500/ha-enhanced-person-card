## Enhanced Person Card

An advanced person card for Home Assistant that provides intelligent device tracking, comprehensive sensor integration, and responsive grid layout support.

### Key Features

🔋 **Smart Sensor Assignment** - Automatic detection and assignment of device sensors with cross-device protection  
📱 **Enhanced Device Display** - Detailed information for each device tracker with visual indicators  
🏗️ **Responsive Grid Layout** - Flexible sizing that adapts to modern Home Assistant dashboards  
🎨 **Customizable Attributes** - Configurable display of battery level, GPS accuracy, zones, and more  
🚫 **Cross-Device Protection** - Prevents duplicate sensor assignments between similar device names  
🔧 **Visual Configuration** - Easy setup through the Home Assistant UI editor  
🎯 **Full-Width Support** - Optimal display across different dashboard layouts  

### Problem Solving

This card specifically addresses common issues with device tracking:
- Resolves duplicate sensor assignments for similar device names
- Eliminates battery level duplication across devices  
- Provides accurate sensor-to-device matching using device IDs
- Offers proper responsive sizing for wide dashboard layouts

### Installation

This card can be installed through HACS (Home Assistant Community Store):

1. Add this repository to HACS as a custom repository
2. Install "Enhanced Person Card"
3. Add the card to your dashboard

### Basic Configuration

```yaml
type: custom:enhanced-person-card
entity: person.john_doe
```

### Advanced Configuration

```yaml
type: custom:enhanced-person-card
entity: person.john_doe
name: "John Doe"
show_name: true
show_state: true
show_devices: true
badge_style: icon_text
device_attributes:
  - battery_level
  - gps_accuracy
  - source_type
  - zone
grid_options:
  rows: 2
  columns: 3  # or "full" for full width
```

For complete documentation, configuration options, and troubleshooting, see the [README](https://github.com/dmoo500/ha-enhanced-person-card#readme).
