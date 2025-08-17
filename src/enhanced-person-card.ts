/**
 * Enhanced Person Card for Home Assistant 2025.08.1+
 * Advanced person card with device tracking, sensor integration, and grid layout support
 */

// @ts-nocheck
// Disable TypeScript checking for now to allow mixed JS/TS syntax

interface HomeAssistant {
  states: { [entity_id: string]: any };
  callService: (domain: string, service: string, serviceData?: any) => void;
  [key: string]: any;
}

interface EnhancedPersonCardConfig {
  type: string;
  entity: string;
  name?: string;
  image?: string;
  icon?: string;
  show_name?: boolean;
  show_state?: boolean;
  show_devices?: boolean;
  device_attributes?: string[];
  excluded_entities?: string[];
  badge_style?: 'icon_text' | 'icon_only' | 'text_only';
  theme?: string;
  
  // Grid Layout Options
  grid_options?: {
    rows?: number;
    columns?: number | 'full';
  };
  layout_options?: {
    grid_rows?: number;
    grid_columns?: number | 'full';
  };
  grid_rows?: number;
  grid_columns?: number | 'full';
}

class EnhancedPersonCard extends HTMLElement {
    private _hass: any = null;
    private _config: any = null;
    private _initialized = false;
    private _lastEntityState = '';
    private _lastEntityAttributes: any = null;
    private _lastDevicesData: any[] = [];
    private _lastConfigHash = '';
    private _rendered = false;
    private _usedSensors = new Set(); // Track sensors that have already been assigned to prevent cross-device matches

    constructor() {
        super();
        // Shadow DOM for encapsulation
        this.attachShadow({ mode: 'open' });
        // Initial render
        this._render();
    }
    
    // Home Assistant Lifecycle Methods
    set hass(hass: any) {
        this._hass = hass || null;
        if (this._initialized) {
            this._updateIfNeeded();
        }
    }
    
    get hass(): any {
        return this._hass || undefined;
    }
    setConfig(config: any): void {
        if (!config) {
            throw new Error('Invalid configuration');
        }
        if (!config.entity) {
            throw new Error('You need to define an entity');
        }
        const oldConfig = this._config;
        this._config = config;
        this._initialized = true;
        // Reset cache when config changes
        this._lastConfigHash = '';
        this._rendered = false;
        // Check if layout changed and force re-render
        const layoutChanged = oldConfig?.grid_options?.rows !== config?.grid_options?.rows ||
            oldConfig?.layout_options?.grid_rows !== config?.layout_options?.grid_rows ||
            oldConfig?.grid_rows !== config?.grid_rows ||
            oldConfig?.grid_options?.columns !== config?.grid_options?.columns ||
            oldConfig?.layout_options?.grid_columns !== config?.layout_options?.grid_columns ||
            oldConfig?.grid_columns !== config?.grid_columns;
        if (layoutChanged) {
            this._updateDynamicStyles();
        }
        // Use optimized update instead of forced render
        if (this._hass) {
            this._updateIfNeeded();
        }
        else {
            this._render();
        }
    }
    getCardSize() {
        // Use grid_options.rows for height if specified (HA standard)
        if (this._config?.grid_options?.rows) {
            return Number(this._config.grid_options.rows);
        }
        // Fallback: check layout_options for height if specified
        if (this._config?.layout_options?.grid_rows) {
            return Number(this._config.layout_options.grid_rows);
        }
        // Fallback: check if config has grid_rows at root level
        if (this._config && 'grid_rows' in this._config) {
            return Number(this._config.grid_rows);
        }
        // Default to 3 for better compatibility with Home Assistant
        return 3;
    }
    getCardColumns() {
        // Check for grid_options.columns first (HA standard)
        if (this._config?.grid_options?.columns !== undefined) {
            return this._config.grid_options.columns;
        }
        // Fallback: check layout_options for columns
        if (this._config?.layout_options?.grid_columns !== undefined) {
            return this._config.layout_options.grid_columns;
        }
        // Fallback: check if config has grid_columns at root level
        if (this._config && 'grid_columns' in this._config && this._config.grid_columns !== undefined) {
            return this._config.grid_columns;
        }
        // Default to 1 column
        return 1;
    }
    // Update CSS Custom Properties dynamically
    _updateDynamicStyles() {
        if (!this.shadowRoot)
            return;
        const layoutRows = this._config?.grid_options?.rows ||
            this._config?.layout_options?.grid_rows ||
            this._config?.grid_rows ||
            this.getCardSize();
        const layoutColumns = this.getCardColumns();
        
        // Calculate icon size based on both rows and columns with improved logic
        const numericColumns = layoutColumns === 'full' ? 12 : (typeof layoutColumns === 'number' ? layoutColumns : 1); // Treat 'full' as 12 columns for sizing calculations
        
        // Enhanced icon size calculation considering card space and preventing oversized icons
        let iconSize = 40; // Smaller base size for very wide layouts
        
        // Column-based sizing with special handling for very wide layouts
        if (numericColumns === 1) {
            // Single column: moderate size
            iconSize = Math.max(60, layoutRows * 20 + 40);
        } else if (numericColumns === 2) {
            // Two columns: slightly larger than single
            iconSize = Math.max(70, layoutRows * 22 + 50);
        } else if (numericColumns >= 3 && numericColumns <= 5) {
            // Three to five columns: larger icons
            iconSize = Math.max(80, layoutRows * 25 + 60);
        } else if (numericColumns >= 6 && numericColumns <= 8) {
            // Six to eight columns: moderate size to prevent overcrowding
            iconSize = Math.max(55, layoutRows * 15 + 40);
        } else if (numericColumns >= 9) {
            // Nine or more columns (including 'full'): much smaller icons to fit properly
            iconSize = Math.max(40, layoutRows * 8 + 25);
        }
        
        // Row-based adjustments: more rows = more vertical space
        const rowMultiplier = Math.max(1, layoutRows);
        iconSize = iconSize + (rowMultiplier - 1) * 8; // Further reduced multiplier for very wide layouts
        
        // Apply reasonable bounds based on layout with stricter limits for wide layouts
        let minSize, maxSize;
        if (numericColumns >= 9) {
            minSize = 30;
            maxSize = 60; // Much smaller maximum for full-width layouts
        } else if (numericColumns >= 6) {
            minSize = 40;
            maxSize = 90;
        } else if (numericColumns >= 3) {
            minSize = 60;
            maxSize = 140;
        } else {
            minSize = 50;
            maxSize = 120;
        }
        
        iconSize = Math.max(minSize, Math.min(maxSize, iconSize));
        
        // Note: No special size override for 'full' layouts - they use the same logic as 9+ columns
        // which keeps icons appropriately sized for wide layouts
        
        this.style.setProperty('--dynamic-icon-size', `${iconSize}px`);
        
        // Handle grid column properties for proper layout
        // --grid-column-count: calc( var(--base-column-count) * var(--column-span, 1) );
        // --grid-column-count: calc( var(--base-column-count) * var(--column-span, 1) );
        if (layoutColumns === 'full') {
            // Full width: span all columns and take full container width
            this.style.setProperty('--card-width', '100%');
            this.style.setProperty('--card-flex-grow', '1');
            this.style.setProperty('--card-grid-column', '1 / -1');
            // Additional properties for full width containers
            this.style.setProperty('--card-max-width', 'none');
            this.style.setProperty('--card-margin', '0');
        }
        else if (typeof layoutColumns === 'number' && layoutColumns > 1) {
            this.style.setProperty('--card-grid-column', `calc( var(--base-column-count) * var(--column-span, 1)`);
            // Reset full-width properties
            this.style.removeProperty('--card-width');
            this.style.removeProperty('--card-flex-grow');
            this.style.removeProperty('--card-max-width');
            this.style.removeProperty('--card-margin');
        }
        else {
            // Single column: reset all special properties
            this.style.removeProperty('--card-width');
            this.style.removeProperty('--card-flex-grow');
            this.style.removeProperty('--card-grid-column');
            this.style.removeProperty('--card-max-width');
            this.style.removeProperty('--card-margin');
        }
        
        // Update card height based on rows
        if (layoutRows > 1) {
            const dynamicHeight = `${layoutRows * 80}px`; // Increased height per row
            this.style.setProperty('--dynamic-height', dynamicHeight);
        }
        
        // Set responsive left section width based on columns - narrower for very wide layouts
        let leftSectionWidth;
        if (layoutColumns === 'full' || numericColumns >= 12) {
            leftSectionWidth = '12%'; // Very narrow for full-width layouts
        } else if (numericColumns >= 9) {
            leftSectionWidth = '15%'; // Very narrow for 9+ columns
        } else if (numericColumns >= 6) {
            leftSectionWidth = '20%'; // Narrow for 6-8 columns
        } else if (numericColumns >= 3) {
            leftSectionWidth = '25%'; // Standard for 3-5 columns
        } else {
            leftSectionWidth = '30%'; // Wide for 1-2 columns
        }
        this.style.setProperty('--person-left-width', leftSectionWidth);
    }
    // Optimized update check - only re-render if something actually changed
    _updateIfNeeded() {
        if (!this._hass || !this._config || !this._initialized) {
            this._render();
            return;
        }
        const entityId = this._config.entity;
        const stateObj = this._hass.states[entityId];
        if (!stateObj) {
            this._render();
            return;
        }
        // Check if entity state changed
        const currentState = stateObj.state;
        const currentAttributes = stateObj.attributes;
        const devicesData = this._getPersonDevices(stateObj);
        const configHash = JSON.stringify({
            name: this._config.name,
            image: this._config.image,
            icon: this._config.icon,
            show_name: this._config.show_name,
            show_state: this._config.show_state,
            show_devices: this._config.show_devices,
            badge_style: this._config.badge_style,
            device_attributes: this._config.device_attributes
        });
        // Compare with last known state
        const stateChanged = this._lastEntityState !== currentState;
        const attributesChanged = JSON.stringify(this._lastEntityAttributes) !== JSON.stringify(currentAttributes);
        const devicesChanged = JSON.stringify(this._lastDevicesData) !== JSON.stringify(devicesData);
        const configChanged = this._lastConfigHash !== configHash;
        if (stateChanged || attributesChanged || devicesChanged || configChanged || !this._rendered) {
            // Update cache
            this._lastEntityState = currentState;
            this._lastEntityAttributes = currentAttributes;
            this._lastDevicesData = devicesData;
            this._lastConfigHash = configHash;
            // Full render for now (could be optimized with selective updates)
            this._render();
        }
    }
    _getPersonDevices(personEntity) {
        if (!this._hass || !personEntity)
            return [];
        const config = this._config;
        const excludedEntities = config?.excluded_entities || [];
        const personId = personEntity.entity_id;
        const devices = [];
        
        // First, use the device_trackers attribute from the person entity (HA standard)
        if (personEntity.attributes.device_trackers && Array.isArray(personEntity.attributes.device_trackers)) {
            personEntity.attributes.device_trackers.forEach((deviceId) => {
                if (!excludedEntities.includes(deviceId)) {
                    const deviceEntity = this._hass.states[deviceId];
                    if (deviceEntity && deviceEntity.attributes.source_type) {
                        devices.push(deviceEntity);
                    }
                }
            });
        }
        
        // Fallback: search for device_tracker entities with person attribute pointing to this person
        if (devices.length === 0) {
            Object.values(this._hass.states).forEach((entity) => {
                if (entity.entity_id.startsWith('device_tracker.') &&
                    !excludedEntities.includes(entity.entity_id) &&
                    entity.attributes.source_type &&
                    entity.attributes.person === personId) {
                    devices.push(entity);
                }
            });
        }
        
        // Sort devices by specificity (longer names first) to ensure specific devices get their sensors first
        devices.sort((a, b) => {
            const nameA = a.attributes.friendly_name || a.entity_id;
            const nameB = b.attributes.friendly_name || b.entity_id;
            // Longer names (more specific) should come first
            return nameB.length - nameA.length;
        });
        
        return devices;
    }

    // Get human-readable label for attribute
    _getAttributeLabel(attributeName) {
        const labels = {
            'battery_level': 'Battery',
            'gps_accuracy': 'GPS Accuracy',
            'source_type': 'Source',
            'zone': 'Zone',
            'latitude': 'Latitude',
            'longitude': 'Longitude',
            'altitude': 'Altitude',
            'course': 'Course',
            'speed': 'Speed',
            'ip': 'IP Address',
            'hostname': 'Hostname',
            'mac': 'MAC Address',
            'last_seen': 'Last Seen'
        };
        return labels[attributeName] || attributeName;
    }

    // Get icon for attribute
    _getAttributeIcon(attributeName, value) {
        switch (attributeName) {
            case 'battery_level':
                const batteryLevel = parseInt(value);
                if (batteryLevel > 80) return { icon: 'mdi:battery', color: '#4caf50' };
                if (batteryLevel > 60) return { icon: 'mdi:battery-60', color: '#8bc34a' };
                if (batteryLevel > 40) return { icon: 'mdi:battery-40', color: '#ff9800' };
                if (batteryLevel > 20) return { icon: 'mdi:battery-20', color: '#ff5722' };
                return { icon: 'mdi:battery-alert', color: '#f44336' };
                
            case 'gps_accuracy':
                const accuracy = parseInt(value);
                if (accuracy <= 10) return { icon: 'mdi:crosshairs-gps', color: '#4caf50' };
                if (accuracy <= 50) return { icon: 'mdi:crosshairs-gps', color: '#ff9800' };
                return { icon: 'mdi:crosshairs-question', color: '#f44336' };
                
            case 'source_type':
                switch (value) {
                    case 'gps': return { icon: 'mdi:crosshairs-gps', color: '#2196f3' };
                    case 'bluetooth': return { icon: 'mdi:bluetooth', color: '#3f51b5' };
                    case 'router': return { icon: 'mdi:router-wireless', color: '#607d8b' };
                    default: return { icon: 'mdi:help-circle', color: '#757575' };
                }
                
            case 'altitude':
                return { icon: 'mdi:elevation-rise', color: '#795548' };
                
            case 'course':
                return { icon: 'mdi:compass', color: '#9c27b0' };
                
            case 'speed':
                const speed = parseInt(value);
                if (speed > 50) return { icon: 'mdi:speedometer', color: '#f44336' };
                if (speed > 10) return { icon: 'mdi:speedometer-medium', color: '#ff9800' };
                return { icon: 'mdi:speedometer-slow', color: '#4caf50' };
                
            case 'zone':
                return { icon: 'mdi:map-marker-radius', color: '#2196f3' };
                
            case 'latitude':
                return { icon: 'mdi:latitude', color: '#9c27b0' };
                
            case 'longitude':
                return { icon: 'mdi:longitude', color: '#9c27b0' };
                
            case 'ip':
                return { icon: 'mdi:ip-network', color: '#607d8b' };
                
            case 'hostname':
                return { icon: 'mdi:dns', color: '#607d8b' };
                
            case 'mac':
                return { icon: 'mdi:network', color: '#607d8b' };
                
            case 'last_seen':
                return { icon: 'mdi:clock-outline', color: '#757575' };
                
            default:
                return { icon: 'mdi:information-outline', color: '#757575' };
        }
    }

    // Get display value for attribute
    _getAttributeDisplayValue(attributeName, value) {
        switch (attributeName) {
            case 'battery_level':
                return `${value}%`;
            case 'gps_accuracy':
                return `${value}m`;
            case 'altitude':
                return `${value}m`;
            case 'speed':
                return `${value} km/h`;
            case 'course':
                return `${value}°`;
            case 'zone':
                return String(value).replace(/_/g, ' ');
            case 'latitude':
                return `${parseFloat(value).toFixed(4)}°`;
            case 'longitude':
                return `${parseFloat(value).toFixed(4)}°`;
            case 'ip':
                return String(value);
            case 'hostname':
                return String(value);
            case 'mac':
                return String(value).toUpperCase();
            case 'last_seen':
                // Format timestamp if it's a date
                if (value && (value.includes('T') || value.includes('-'))) {
                    try {
                        const date = new Date(value);
                        return date.toLocaleTimeString();
                    } catch (e) {
                        return String(value);
                    }
                }
                return String(value);
            default:
                return String(value);
        }
    }
    _render() {
        if (!this.shadowRoot) {
            console.warn('⚠️ Shadow Root not available');
            return;
        }
        
        // Reset used sensors tracking for fresh rendering cycle
        this._usedSensors.clear();
        
        // Loading state
        if (!this._initialized || !this._config) {
            this.shadowRoot.innerHTML = this._getLoadingHTML();
            return;
        }
        // No Hass state
        if (!this._hass) {
            this.shadowRoot.innerHTML = this._getNoHassHTML();
            return;
        }
        // Get entity
        const entityId = this._config.entity;
        const stateObj = this._hass.states[entityId];
        if (!stateObj) {
            this.shadowRoot.innerHTML = this._getEntityNotFoundHTML(entityId);
            return;
        }
        // Render card
        this.shadowRoot.innerHTML = this._getCardHTML(stateObj);
        this._attachEventListeners();
        // Update dynamic styles after rendering
        this._updateDynamicStyles();
        // Mark as rendered
        this._rendered = true;
    }
    _getLoadingHTML() {
        return `
      ${this._getStyles()}
      <div class="person-card loading">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading...</div>
      </div>
    `;
    }
    _getNoHassHTML() {
        return `
      ${this._getStyles()}
      <div class="person-card error">
        <div class="error-icon">⚠️</div>
        <div class="error-text">Home Assistant not available</div>
      </div>
    `;
    }
    _getEntityNotFoundHTML(entityId) {
        return `
      ${this._getStyles()}
      <div class="person-card error">
        <div class="error-icon">❌</div>
        <div class="error-text">Entity "${entityId}" not found</div>
      </div>
    `;
    }
    _getCardHTML(stateObj) {
        const config = this._config;
        const name = config.name || stateObj.attributes.friendly_name || config.entity;
        const state = stateObj.state;
        const image = config.image || stateObj.attributes.entity_picture;
        const icon = config.icon;
        const showName = config.show_name !== false;
        const showState = config.show_state !== false;
        const showDevices = config.show_devices !== false;
        const stateText = this._getStateText(state);
        const stateClass = this._getStateClass(state);
        const devices = this._getPersonDevices(stateObj);
        return `
      ${this._getStyles()}
      <div class="person-card" data-entity="${config.entity}">
        ${showName ? `<div class="person-header">
          <div class="person-name">${name}</div>
        </div>` : ''}
        <div class="person-content">
          <div class="person-left-section">
            <div class="person-avatar-container">
              <div class="person-avatar">
                ${this._renderIcon(image, icon, name)}
              </div>
              ${showState ? `<div class="person-status-badge ${stateClass} ${config.badge_style === 'icon_only' ? 'icon-only' : ''}">${stateText}</div>` : ''}
            </div>
          </div>
          ${showDevices ? `<div class="person-devices-section">
            <div class="devices-header">Devices</div>
            <div class="devices-list">
              ${devices.length > 0 ? devices.map(device => this._renderDevice(device)).join('') : '<div class="no-devices">No devices found</div>'}
            </div>
          </div>` : ''}
        </div>
      </div>
    `;
    }
    _renderIcon(image, icon, name) {
        if (image) {
            return `<img src="${image}" alt="${name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="fallback-icon" style="display: none;">${icon ? this._renderMDI(icon) : this._renderMDI('mdi:account')}</div>`;
        }
        else if (icon) {
            return `<div class="fallback-icon">${this._renderMDI(icon)}</div>`;
        }
        else {
            return `<div class="fallback-icon">${this._renderMDI('mdi:account')}</div>`;
        }
    }
    _renderMDI(iconName) {
        if (iconName.startsWith('mdi:')) {
            return `<ha-icon icon="${iconName}"></ha-icon>`;
        }
        return iconName;
    }
    _getStateText(state) {
        const badgeStyle = this._config?.badge_style || 'icon_text';
        const stateIcon = this._getStateIcon(state);
        const stateText = this._getLocationDisplayName(state);
        switch (badgeStyle) {
            case 'icon_only':
                return this._renderMDI(stateIcon);
            case 'text_only':
                return stateText;
            case 'icon_text':
            default:
                return `${this._renderMDI(stateIcon)} ${stateText}`;
        }
    }
    _getStateIcon(state) {
        switch (state) {
            case 'home': return 'mdi:home';
            case 'not_home': return 'mdi:home-export-outline';
            case 'unknown': return 'mdi:help-circle-outline';
            default: return 'mdi:map-marker';
        }
    }
    _getLocationDisplayName(location) {
        if (!location || location === 'unknown')
            return 'Unknown';
        switch (location) {
            case 'home': return 'Home';
            case 'not_home': return 'Away';
            case 'unknown': return 'Unknown';
        }
        // Format location name
        let displayName = location.replace(/_/g, ' ');
        displayName = displayName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        return displayName;
    }
    _getStateClass(state) {
        switch (state) {
            case 'home': return 'state-home';
            case 'not_home': return 'state-away';
            default: return 'state-unknown';
        }
    }
    _renderDevice(deviceEntity: any): string {
        const deviceName = deviceEntity.attributes.friendly_name || deviceEntity.entity_id;
        const deviceIcon = this._getDeviceIcon(deviceEntity);
        
        // Enhanced attribute collection - only show attributes that belong to THIS device
        const configuredAttributes = this._config.device_attributes || ['battery_level', 'gps_accuracy', 'source_type'];
        const availableAttributes = [];
        
        configuredAttributes.forEach(attrName => {
            if (attrName === 'zone') {
                // Use device state for zone attribute
                const value = deviceEntity.state;
                const displayValue = this._formatDeviceState(value);
                const icon = this._getAttributeIcon('zone', value);
                const label = this._getAttributeLabel('zone');
                
                availableAttributes.push({
                    name: attrName,
                    label: label,
                    value: value,
                    displayValue: displayValue,
                    icon: icon,
                    entityName: deviceName
                });
            } else {
                // Get all entries for this attribute from this specific device
                const attributeEntries = this._getAttributeEntriesForDevice(deviceEntity, attrName);
                availableAttributes.push(...attributeEntries);
            }
        });

        return `
      <div class="device-item" data-entity="${deviceEntity.entity_id}">
        <div class="device-icon">
          ${this._renderMDI(deviceIcon)}
        </div>
        <div class="device-info">
          <div class="device-name">${deviceName}</div>
          ${availableAttributes.length > 0 ? `
            <div class="device-attributes">
              ${availableAttributes.map(attr => {
                // Disable scrolling for now to fix issues
                const textContent = String(attr.entityName || attr.label);
                // No scrolling - let CSS handle truncation properly
                const needsScrolling = false; // Disabled
                return `
                <span class="device-attribute" data-attribute="${attr.name}" title="${attr.label}: ${attr.displayValue} (${attr.entityName || deviceName})">
                  <span class="attribute-icon" style="color: ${attr.icon.color}">
                    ${this._renderMDI(attr.icon.icon)}
                  </span>
                  <span class="attribute-name${needsScrolling ? ' scrolling' : ''}">${textContent}:</span>
                  <span class="attribute-value">${attr.displayValue}</span>
                </span>
              `;
              }).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
    }

    // Get all attribute entries for a specific device (simplified device_id + name fallback)
    _getAttributeEntriesForDevice(deviceEntity: any, attrName: string): any[] {
        const results = [];
        const seenEntities = new Set();
        
        if (!this._hass || !this._hass.states) {
            return results;
        }
        
        // Get device identification info for matching
        const deviceId = deviceEntity.attributes.device_id;
        const deviceEntityId = deviceEntity.entity_id;
        const deviceName = deviceEntity.attributes.friendly_name || deviceEntity.entity_id.replace('device_tracker.', '');
        
        // Define attribute patterns for sensor matching
        const attributePatterns = {
            'battery_level': ['battery_level', 'battery'],
            'signal_strength': ['signal_strength', 'wifi_signal', 'signal'],
            'gps_accuracy': ['gps_accuracy', 'accuracy'],
        };
        
        const patterns = attributePatterns[attrName] || [attrName];
        
        // Look for sensors that belong to the same device
        Object.values(this._hass.states).forEach((entity: any) => {
            if (!entity.entity_id.startsWith('sensor.')) return;
            
            const entityDisplayName = entity.attributes.friendly_name || entity.entity_id;
            if (seenEntities.has(entityDisplayName)) return;
            
            // Check if sensor belongs to same device
            let isRelated = false;
            
            // Method 1: Same device_id (most precise)
            if (deviceId && entity.attributes.device_id === deviceId) {
                isRelated = true;
            }
            
            // Method 2: Radically strict name-based matching with exact device name verification
            if (!isRelated) {
                const sensorId = entity.entity_id.toLowerCase();
                const sensorName = (entity.attributes.friendly_name || '').toLowerCase();
                const deviceBaseName = deviceEntityId.replace('device_tracker.', '').toLowerCase();
                const deviceFriendlyName = (deviceName || '').toLowerCase();
                
                // Get all device tracker names to compare against
                const allDeviceNames = Object.values(this._hass.states)
                    .filter(e => e.entity_id.startsWith('device_tracker.'))
                    .map(e => ({
                        entity_id: e.entity_id.replace('device_tracker.', '').toLowerCase(),
                        friendly_name: (e.attributes.friendly_name || '').toLowerCase(),
                        full_entity: e.entity_id
                    }));
                
                // Strategy 1: Exact entity_id match (most reliable)
                const exactEntityMatch = sensorId === `sensor.${deviceBaseName}` || 
                    sensorId.startsWith(`sensor.${deviceBaseName}_`);
                
                // Check if this sensor belongs to a longer/more specific device name
                let belongsToMoreSpecificDevice = false;
                if (exactEntityMatch) {
                    for (const otherDevice of allDeviceNames) {
                        if (otherDevice.entity_id !== deviceBaseName && 
                            otherDevice.entity_id.includes(deviceBaseName) &&
                            (sensorId.includes(otherDevice.entity_id) || 
                             sensorName.includes(otherDevice.friendly_name))) {
                            belongsToMoreSpecificDevice = true;
                            break;
                        }
                    }
                }
                
                if (exactEntityMatch && !belongsToMoreSpecificDevice) {
                    isRelated = true;
                }
                
                // Strategy 2: Exact friendly name match (only if Strategy 1 fails)
                else if (!isRelated && deviceFriendlyName && deviceFriendlyName.length > 3) {
                    // Check if sensor name contains the EXACT device friendly name
                    const exactFriendlyMatch = sensorName.includes(deviceFriendlyName) ||
                        sensorId.includes(deviceFriendlyName.replace(/\s+/g, '_'));
                    
                    // Verify that no other device has a better match
                    let betterMatchExists = false;
                    if (exactFriendlyMatch) {
                        for (const otherDevice of allDeviceNames) {
                            if (otherDevice.friendly_name !== deviceFriendlyName &&
                                otherDevice.friendly_name.length > deviceFriendlyName.length &&
                                (sensorName.includes(otherDevice.friendly_name) ||
                                 sensorId.includes(otherDevice.friendly_name.replace(/\s+/g, '_')))) {
                                betterMatchExists = true;
                                break;
                            }
                        }
                    }
                    
                    if (exactFriendlyMatch && !betterMatchExists) {
                        isRelated = true;
                    }
                }
            }
            
            if (!isRelated) return;
            
            // Check if sensor has the requested attribute data
            const sensorId = entity.entity_id.toLowerCase();
            const sensorName = (entity.attributes.friendly_name || '').toLowerCase();
            
            const hasAttributeMatch = patterns.some(pattern => 
                sensorId.includes(pattern) || sensorName.includes(pattern)
            );
            
            if (!hasAttributeMatch) {
                return;
            }
            
            // Skip if sensor already used by another device
            if (this._usedSensors.has(entity.entity_id)) {
                return;
            }
            
            // Exclude unrelated sensor types
            const excludePatterns = ['battery_state', 'charging_state', 'power_state'];
            const isExcluded = excludePatterns.some(exclude => 
                sensorId.includes(exclude) || sensorName.includes(exclude)
            );
            
            if (isExcluded) {
                return;
            }
            
            const sensorValue = entity.state;
            if (sensorValue && sensorValue !== 'unknown' && sensorValue !== 'unavailable') {
                const displayValue = this._getAttributeDisplayValue(attrName, sensorValue);
                const icon = this._getAttributeIcon(attrName, sensorValue);
                const label = this._getAttributeLabel(attrName);
                
                results.push({
                    name: attrName,
                    label: label,
                    value: sensorValue,
                    displayValue: displayValue,
                    icon: icon,
                    entityName: entityDisplayName
                });
                
                seenEntities.add(entityDisplayName);
                this._usedSensors.add(entity.entity_id); // Mark sensor as used to prevent cross-device assignment
            } else {
                // Skip sensors with invalid states
            }
        });
        
        return results;
    }

    // Format device state (zone/location) for better display
    _formatDeviceState(state) {
        if (!state || state === 'unknown') return 'Unknown';
        
        // Format location name (same as _getLocationDisplayName)
        switch (state) {
            case 'home': return 'Home';
            case 'not_home': return 'Away'; 
            case 'unknown': return 'Unknown';
        }
        
        // Format custom zone names
        let displayName = state.replace(/_/g, ' ');
        displayName = displayName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        
        return displayName;
    }
    _getDeviceIcon(deviceEntity) {
        if (deviceEntity.entity_id.startsWith('device_tracker.')) {
            if (deviceEntity.attributes.source_type === 'gps') {
                return 'mdi:cellphone';
            }
            else if (deviceEntity.attributes.source_type === 'bluetooth') {
                return 'mdi:bluetooth';
            }
            else if (deviceEntity.attributes.source_type === 'router') {
                return 'mdi:router-wireless';
            }
            return 'mdi:crosshairs-gps';
        }
        return 'mdi:devices';
    }
    _getStyles() {
        const layoutRows = this._config?.grid_options?.rows ||
            this._config?.layout_options?.grid_rows ||
            this._config?.grid_rows ||
            this.getCardSize();
        const dynamicHeight = '100%';
        return `
      <style>
        :host {
            --row-gap: var(--ha-section-grid-row-gap, 8px);
            --column-gap: var(--ha-section-grid-column-gap, 8px);
            --row-height: var(--ha-section-grid-row-height, 56px);
            display: block;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .person-card {
          background: var(--ha-card-background, var(--card-background-color));
          border-radius: var(--ha-card-border-radius);
          border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color));
          box-shadow: var(--ha-card-box-shadow);
          padding: var(--ha-card-padding, 16px);
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: ${layoutRows > 1 ? dynamicHeight : 'var(--card-min-height, 120px)'};
	      height: calc((var(--row-size,1) * (var(--row-height) + var(--row-gap))) - var(--row-gap));
          box-sizing: border-box;
          font-family: var(--paper-font-body1_-_font-family);
          width: 100%;
        }

        .person-card:hover {
          box-shadow: var(--ha-card-box-shadow-hover, var(--ha-card-box-shadow));
        }

        .person-card.loading, .person-card.error {
          justify-content: center;
          align-items: center;
          cursor: default;
        }

        .person-card.error {
          background: var(--error-color);
          color: var(--text-primary-color);
        }

        .person-header {
          margin-bottom: 12px;
        }

        .person-name {
          font-weight: var(--paper-font-headline_-_font-weight);
          font-size: var(--person-name-font-size, var(--paper-font-subhead_-_font-size));
          color: var(--primary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .person-content {
          display: flex;
          align-items: stretch;
          gap: 16px;
          flex: 1;
        }

        .person-left-section {
          flex: 0 0 var(--person-left-width, 30%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .person-avatar-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .person-avatar {
          width: var(--dynamic-icon-size, 80px);
          height: var(--dynamic-icon-size, 80px);
          border-radius: 50%;
          background: transparent;
          color: var(--primary-text-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: calc(var(--dynamic-icon-size, 80px) * 0.45);
          flex-shrink: 0;
          overflow: hidden;
        }

        .person-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .fallback-icon {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-text-color);
        }

        .fallback-icon ha-icon {
          --mdc-icon-size: var(--dynamic-icon-size, 64px);
          color: var(--primary-text-color);
        }

        .person-status-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: bold;
          color: white;
          background: var(--secondary-text-color);
          text-transform: uppercase;
          white-space: nowrap;
          border: 2px solid var(--ha-card-background, var(--card-background-color));
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 4px;
          min-width: 24px;
          min-height: 24px;
          justify-content: center;
        }

        .person-status-badge.icon-only {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .person-status-badge.icon-only ha-icon {
          --mdc-icon-size: 16px;
        }

        .person-status-badge.state-home {
          background: var(--state-person-home-color, var(--success-color, #4caf50));
        }

        .person-status-badge.state-away {
          background: var(--state-person-away-color, var(--warning-color, #ff9800));
        }

        .person-status-badge.state-unknown {
          background: var(--state-person-unknown-color, var(--info-color, var(--secondary-text-color)));
        }

        .person-devices-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .devices-header {
          font-size: 14px;
          font-weight: bold;
          color: var(--primary-text-color);
          margin-bottom: 8px;
          border-bottom: 1px solid var(--divider-color);
          padding-bottom: 4px;
        }

        .devices-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .device-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: transparent;
          border-radius: 8px;
          transition: background-color 0.2s ease;
          cursor: pointer;
        }

        .device-item:hover {
          background: var(--secondary-background-color, rgba(0,0,0,0.05));
        }

        .device-icon {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-text-color);
        }

        .device-icon ha-icon {
          --mdc-icon-size: 20px;
        }

        .device-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .device-name {
          font-size: 12px;
          font-weight: 500;
          color: var(--primary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .device-attributes {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 4px;
        }

        .device-attribute {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 4px;
          transition: background-color 0.2s ease;
          overflow: hidden; /* Prevent text from overflowing */
          position: relative;
          max-width: 180px; /* Limit total width to prevent overlap */
        }

        .device-attribute:hover {
          background: var(--secondary-background-color, rgba(0,0,0,0.1));
        }

        .attribute-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 12px;
          height: 12px;
          flex-shrink: 0;
        }

        .attribute-icon ha-icon {
          --mdc-icon-size: 12px;
        }

        .attribute-name {
          font-weight: 500;
          white-space: nowrap;
          color: var(--secondary-text-color);
          position: relative;
          display: inline-block;
          max-width: 120px; /* Increased from 90px to show more text */
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .attribute-name.scrolling {
          animation: scroll-text 6s ease-in-out infinite;
          overflow: hidden; /* Keep overflow hidden even when scrolling */
          text-overflow: unset;
          max-width: 90px; /* Keep same width for consistency */
        }

        .attribute-value {
          font-weight: 600;
          white-space: nowrap;
          color: var(--primary-text-color);
        }

        @keyframes scroll-text {
          0%, 25% { 
            transform: translateX(0); 
          }
          75%, 100% { 
            transform: translateX(-15%); 
          }
        }

        .no-devices {
          text-align: center;
          color: var(--secondary-text-color);
          font-size: 12px;
          font-style: italic;
          padding: 20px;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid var(--disabled-text-color);
          border-top: 2px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }

        .loading-text, .error-text {
          color: var(--secondary-text-color);
          font-size: var(--paper-font-body1_-_font-size);
        }

        .error-icon {
          font-size: 20px;
          margin-right: 8px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          :host {
            padding: 15px;
          }
          .person-card {
            flex-direction: column;
            gap: 12px;
          }
          
          .person-left-section {
            flex: none;
            justify-content: center;
          }
          
          .person-devices-section {
            flex: none;
          }
          
          .person-avatar {
            width: calc(var(--dynamic-icon-size, 80px) * 0.75) !important;
            height: calc(var(--dynamic-icon-size, 80px) * 0.75) !important;
            font-size: calc(var(--dynamic-icon-size, 80px) * 0.75 * 0.45) !important;
          }
          
          .fallback-icon ha-icon {
            --mdc-icon-size: calc(var(--dynamic-icon-size, 80px) * 0.6) !important;
          }

          .device-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            background: transparent;
            border-radius: 8px;
            transition: background-color 0.2s ease;
            cursor: pointer;
          }          
          
          .person-devices-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
      </style>
    `;
    }
    _attachEventListeners() {
        const card = this.shadowRoot?.querySelector('.person-card');
        if (card && !card.classList.contains('loading') && !card.classList.contains('error')) {
            card.addEventListener('click', () => this._handleClick());
            
            const deviceItems = this.shadowRoot?.querySelectorAll('.device-item');
            deviceItems?.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const entityId = item.getAttribute('data-entity');
                    if (entityId) {
                        this._handleDeviceClick(entityId);
                    }
                });
            });
            
            // Add click handlers for device attributes
            const attributeItems = this.shadowRoot?.querySelectorAll('.device-attribute');
            attributeItems?.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const deviceItem = item.closest('.device-item');
                    const entityId = deviceItem?.getAttribute('data-entity');
                    const attributeName = item.getAttribute('data-attribute');
                    
                    if (entityId) {
                        // Try to find specific sensor for this attribute
                        if (attributeName === 'battery_level') {
                            const deviceName = entityId.replace('device_tracker.', '');
                            const batterySensor = Object.keys(this._hass.states).find(id => 
                                id.includes('battery') && id.includes(deviceName)
                            );
                            if (batterySensor) {
                                this._handleDeviceClick(batterySensor);
                                return;
                            }
                        }
                        // Fallback to device entity
                        this._handleDeviceClick(entityId);
                    }
                });
            });
        }
    }
    _handleClick() {
        if (!this._config?.entity)
            return;
        const event = new CustomEvent('hass-more-info', {
            bubbles: true,
            composed: true,
            detail: { entityId: this._config.entity },
        });
        this.dispatchEvent(event);
    }
    _handleDeviceClick(entityId) {
        const event = new CustomEvent('hass-more-info', {
            bubbles: true,
            composed: true,
            detail: { entityId: entityId },
        });
        this.dispatchEvent(event);
    }
    // Static methods for Home Assistant
    static getConfigElement() {
        // EnhancedPersonCardEditor is now defined in this same file
        return document.createElement('enhanced-person-card-editor');
    }
    
    static getStubConfig() {
        return {
            type: 'custom:enhanced-person-card',
            entity: '',
            show_name: true,
            show_state: true,
            show_devices: true,
            badge_style: 'icon_text',
            device_attributes: ['battery_level', 'gps_accuracy', 'source_type', 'zone'],
            excluded_entities: [],
            grid_options: {
                rows: 1,
                columns: 1
            }
        };
    }

    // Configuration schema for Home Assistant
    static getConfigSchema() {
        // Delegate to editor class
        return EnhancedPersonCardEditor.getConfigSchema();
    }
    static getCardColumns(config) {
        // Check for grid_options.columns first (HA standard)
        if (config?.grid_options?.columns !== undefined) {
            return config.grid_options.columns;
        }
        // Fallback: check layout_options for columns
        if (config?.layout_options?.grid_columns !== undefined) {
            return config.layout_options.grid_columns;
        }
        // Fallback: check if config has grid_columns at root level
        if (config && 'grid_columns' in config && config.grid_columns !== undefined) {
            return config.grid_columns;
        }
        // Default to 1 column
        return 1;
    }
    connectedCallback() {
        // Called when element is added to DOM
    }
    disconnectedCallback() {
        // Called when element is removed from DOM
    }
}
// Register Custom Element with enhanced name
try {
    if (!customElements.get('enhanced-person-card')) {
        customElements.define('enhanced-person-card', EnhancedPersonCard);
    }
} catch (error) {
    console.warn('Error registering enhanced-person-card:', error);
}

// Export for module systems
export default EnhancedPersonCard;
export { EnhancedPersonCard };
if (typeof window !== 'undefined') {
    window.customCards = window.customCards || [];
    // Register enhanced person card
    if (!window.customCards.some((card) => card.type === 'enhanced-person-card')) {
        window.customCards.push({
            type: 'enhanced-person-card',
            name: 'Enhanced Person Card',
            description: 'Advanced person card with device tracking, sensor integration, and grid layout support',
            preview: false,
            documentationURL: 'https://github.com/your-username/ha-enhanced-person-card'
        });
    }
}
// EnhancedPersonCardEditor class for visual configuration
class EnhancedPersonCardEditor extends HTMLElement {
    private _hass: any = null;
    private _config: any = {};
    private _rendered = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        if (!this._rendered) {
            this._render();
        }
    }

    set hass(hass: any) {
        this._hass = hass;
        if (!this._rendered) {
            this._render();
        } else {
            // Update ha-form when hass changes
            this._updateHaForm();
        }
    }

    setConfig(config: any) {
        this._config = { ...config };
        if (!this._rendered) {
            this._render();
        } else {
            // Update ha-form data when config changes
            const haForm = this.shadowRoot?.querySelector('ha-form');
            if (haForm) {
                (haForm as any).data = this._config;
            }
        }
    }

    private _updateHaForm() {
        if (!this.shadowRoot || !this._hass) return;
        
        const haForm = this.shadowRoot.querySelector('ha-form') as any;
        if (haForm) {
            haForm.hass = this._hass;
            haForm.schema = this._getSchema(); // Update schema with new hass data for themes
            if (typeof haForm.requestUpdate === 'function') {
                try {
                    haForm.requestUpdate();
                } catch (e) {
                    // Silently handle requestUpdate failures
                }
            }
        }
    }

    private _render() {
        if (!this.shadowRoot) return;

        // Only render once, then update values
        if (this._rendered) {
            return;
        }

        const schema = this._getSchema();

        this.shadowRoot.innerHTML = `
            <style>
                ha-form {
                    display: block;
                    width: 100%;
                }
            </style>
            
            <ha-form></ha-form>
        `;

        // Add event listener after rendering
        const haForm = this.shadowRoot.querySelector('ha-form') as any;
        if (haForm) {
            haForm.addEventListener('value-changed', this._valueChanged);
            
            // Set properties directly to ensure they're properly assigned
            haForm.hass = this._hass;
            haForm.data = this._config;
            haForm.schema = schema;
            haForm.computeLabel = this._computeLabel;
        }

        this._rendered = true;
    }

    private _getSchema() {
        return [
            {
                name: "entity",
                required: true,
                selector: {
                    entity: {
                        filter: [
                            { domain: "person" },
                            { domain: "device_tracker" },
                            { domain: "input_select" }
                        ]
                    }
                }
            },
            {
                name: "name",
                selector: { text: {} }
            },
            {
                name: "image",
                selector: { 
                    text: { 
                        type: "url" 
                    } 
                }
            },
            {
                name: "icon",
                selector: { icon: {} }
            },
            {
                name: "show_name",
                default: true,
                selector: { boolean: {} }
            },
            {
                name: "show_state", 
                default: true,
                selector: { boolean: {} }
            },
            {
                name: "show_devices",
                default: true,
                selector: { boolean: {} }
            },
            {
                name: "badge_style",
                default: "icon_text",
                selector: { 
                    select: {
                        options: [
                            { value: "icon_text", label: "Icon + Text" },
                            { value: "icon_only", label: "Nur Icon" },
                            { value: "text_only", label: "Nur Text" }
                        ]
                    }
                }
            },
            {
                name: "device_attributes",
                default: ["battery_level", "gps_accuracy", "source_type", "zone"],
                selector: { 
                    select: {
                        multiple: true,
                        options: [
                            { value: "battery_level", label: "Akku-Level" },
                            { value: "gps_accuracy", label: "GPS Genauigkeit" },
                            { value: "source_type", label: "Gerätetyp" },
                            { value: "zone", label: "Zone" },
                            { value: "last_seen", label: "Zuletzt gesehen" },
                            { value: "ip", label: "IP-Adresse" },
                            { value: "hostname", label: "Hostname" },
                            { value: "mac", label: "MAC-Adresse" },
                            { value: "latitude", label: "Breitengrad" },
                            { value: "longitude", label: "Längengrad" }
                        ]
                    }
                }
            },
            {
                name: 'excluded_entities',
                required: false,
                selector: {
                    entity: {
                        domain: 'device_tracker',
                        multiple: true
                    }
                }
            },
            {
                name: "theme",
                selector: { 
                    select: {
                        options: this._getThemeOptions()
                    }
                }
            }
        ];
    }

    private _getThemeOptions() {
        if (!this._hass || !this._hass.themes || !this._hass.themes.themes) {
            return [{ value: "", label: "Standard" }];
        }
        
        const themes = Object.keys(this._hass.themes.themes);
        const options = [{ value: "", label: "Standard" }];
        
        themes.forEach((theme: string) => {
            options.push({ value: theme, label: theme });
        });
        
        return options;
    }

    private _computeLabel = (schema: any) => {
        const labels: { [key: string]: string } = {
            entity: "Entität",
            name: "Name (optional)",
            image: "Bild URL (optional)", 
            icon: "Icon (optional)",
            show_name: "Namen anzeigen",
            show_state: "Status anzeigen",
            show_devices: "Geräte anzeigen",
            badge_style: "Badge-Stil",
            device_attributes: "Geräte-Attribute",
            excluded_entities: "Ausgeschlossene Entitäten (optional)",
            theme: "Theme (optional)"
        };
        return labels[schema.name] || schema.name;
    };

    private _valueChanged = (ev: any) => {
        if (!ev.detail.value) return;
        
        this._config = { 
            type: 'custom:enhanced-person-card',
            ...ev.detail.value 
        };

        // Fire config changed event
        const event = new CustomEvent('config-changed', {
            detail: { config: this._config },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    };

    // Static method for schema (compatibility)
    static getConfigSchema() {
        return [
            {
                name: 'entity',
                required: true,
                selector: {
                    entity: {
                        domain: 'person'
                    }
                }
            },
            {
                name: 'name',
                required: false,
                selector: {
                    text: {}
                }
            },
            {
                name: 'image',
                required: false,
                selector: {
                    text: {}
                }
            },
            {
                name: 'icon',
                required: false,
                selector: {
                    icon: {}
                }
            },
            {
                name: 'show_name',
                required: false,
                default: true,
                selector: {
                    boolean: {}
                }
            },
            {
                name: 'show_state',
                required: false,
                default: true,
                selector: {
                    boolean: {}
                }
            },
            {
                name: 'show_devices',
                required: false,
                default: true,
                selector: {
                    boolean: {}
                }
            },
            {
                name: 'badge_style',
                required: false,
                default: 'icon_text',
                selector: {
                    select: {
                        options: [
                            { value: 'icon_text', label: 'Icon + Text' },
                            { value: 'icon_only', label: 'Icon Only' },
                            { value: 'text_only', label: 'Text Only' }
                        ]
                    }
                }
            },
            {
                name: 'excluded_entities',
                required: false,
                selector: {
                    entity: {
                        domain: 'device_tracker',
                        multiple: true
                    }
                }
            }
        ];
    }
}

// Register EnhancedPersonCardEditor with improved safety
try {
    if (!customElements.get('enhanced-person-card-editor')) {
        customElements.define('enhanced-person-card-editor', EnhancedPersonCardEditor);
    }
} catch (error) {
    console.warn('Error registering EnhancedPersonCardEditor:', error);
}

console.info('%c ENHANCED-PERSON-CARD %c v1.3.0 - Advanced Device Tracking %c', 'background: #1976d2; color: white; padding: 2px 6px; border-radius: 3px 0 0 3px; font-weight: bold;', 'background: #388e3c; color: white; padding: 2px 6px; border-radius: 0 3px 3px 0; font-weight: bold;', 'background: transparent;');
console.info('%c Enhanced Person Card %c Loaded successfully %c', 'background: #4caf50; color: white; padding: 2px 6px; border-radius: 3px 0 0 3px; font-weight: bold;', 'background: #2196f3; color: white; padding: 2px 6px; border-radius: 0 3px 3px 0;', 'background: transparent;');
