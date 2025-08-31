import { LitElement, TemplateResult, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  type HomeAssistant,
  type EnhancedPersonCardConfig,
  schema,
} from "./types/home-assistant";
import { EnhancedPersonCardEditor } from "./enhanced-person-card-editor";
import { fireEvent } from "custom-card-helpers";

// Extend Window interface for customCards
declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}

// Debug: Log before decorator application
console.log("🎯 About to apply @customElement decorator to EnhancedPersonCard");
console.log("🎯 customElements registry available:", !!customElements);

@customElement("enhanced-person-card")
export class EnhancedPersonCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  // setConfig Property entfernt, da Methode vorhanden
  @state() private _config?: EnhancedPersonCardConfig;
  //   @state() private _initialized = false;
  @state() private _usedSensors = new Set();

  constructor() {
    super();
    // Debug: SwissweatherCard constructor
    // console.log('🔧 SwissweatherCard constructor called');
    // console.log('🔧 LitElement base:', LitElement);
    // console.log('🔧 customElement decorator applied');
  }

  connectedCallback() {
    super.connectedCallback();
    // Debug: SwissweatherCard connected to DOM
    // console.log('🔌 SwissweatherCard connected to DOM');
    // console.log('🔌 Custom element defined:', customElements.get('swissweather-card'));
  }

  static get styles() {
    return css`
        :host {
            display: block;
            background: var(
            --ha-card-background,
            var(--card-background-color, #fff)
            );
            border-radius: 16px;
            box-shadow: var(
            --ha-card-box-shadow,
            0 4px 20px var(--box-shadow-color, rgba(0, 0, 0, 0.1))
            );
            font-family: var(
            --primary-font-family,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            sans-serif
            );
            color: var(--primary-text-color, #fff);
        }
        .person-card {
            padding: 16px;
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
          flex: 0 0 var(--person-left-width, 40%);
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
    `;
  }

  public setConfig(config: EnhancedPersonCardConfig): void {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this._config = config;
  }

  static getConfigElement() {
    return document.createElement("enhanced-person-card-editor");
  }
  // Schema for the visual editor
  public static getConfigSchema() {
    return schema;
  }

  public static getStubConfig() {
    return {
      type: "custom:enhanced-person-card",
      entity: "person.your_name",
      name: "Your Name",
      icon: "mdi:account",
      image: "",
      show_name: true,
      show_state: true,
      show_devices: true,
      badge_style: "icon_text",
      device_attributes: ["battery_level", "source_type", "zone"],
      excluded_entities: [],
    };
  }

  getCardSize() {
    const c = this._config;
    if (c?.grid_options?.rows) return Number(c.grid_options.rows);
    if (c?.layout_options?.grid_rows) return Number(c.layout_options.grid_rows);
    if (c && "grid_rows" in c) return Number(c.grid_rows);
    return 3;
  }

  getCardColumns() {
    const c = this._config;
    if (c?.grid_options?.columns !== undefined) return c.grid_options.columns;
    if (c?.layout_options?.grid_columns !== undefined)
      return c.layout_options.grid_columns;
    if (c && "grid_columns" in c && c.grid_columns !== undefined)
      return c.grid_columns;
    return 1;
  }

  protected updated(changedProps: PropertyValues) {
    super.updated(changedProps);
    //    this._updateDynamicStyles();
  }

  protected render() {
    if (!this.hass || !this._config) {
      return html``;
    }
    if (!this.hass) {
      return html`<div class="person-card error">
        <div class="error-icon">⚠️</div>
        <div class="error-text">Home Assistant not available</div>
      </div>`;
    }
    const entityId = this._config.entity;
    const stateObj = this.hass.states[entityId];
    if (!stateObj) {
      return html`<div class="person-card error">
        <div class="error-icon">❌</div>
        <div class="error-text">Entity "${entityId}" not found</div>
      </div>`;
    }
    const config = this._config;
    const name =
      config.name || stateObj.attributes.friendly_name || config.entity;
    const state = stateObj.state;
    const image = config.image || stateObj.attributes.entity_picture;
    const icon = config.icon;
    const showName = config.show_name !== false;
    const showState = config.show_state !== false;
    const showDevices = config.show_devices !== false;
    const stateText = this._getStateText(state);
    const stateClass = this._getStateClass(state);
    const devices = this._getPersonDevices(stateObj);
    this._usedSensors.clear();

    return html`
      <div class="person-card" data-entity="${config.entity}">
        ${showName
          ? html`<div class="person-header">
              <div class="person-name">${name}</div>
            </div>`
          : ""}
        <div class="person-content">
          <div class="person-left-section">
            <div class="person-avatar-container">
              <div class="person-avatar">
                ${this._renderIcon(image, icon, name)}
              </div>
              ${showState
                ? html`<div
                    class="person-status-badge ${stateClass} ${config.badge_style ===
                    "icon_only"
                      ? "icon-only"
                      : ""}"
                  >
                    ${stateText}
                  </div>`
                : ""}
            </div>
          </div>
          ${showDevices
            ? html`<div class="person-devices-section">
                <div class="devices-header">Devices</div>
                <div class="devices-list">
                  ${devices.length > 0
                    ? devices.map((device) => this._renderDevice(device))
                    : html`<div class="no-devices">No devices found</div>`}
                </div>
              </div>`
            : ""}
        </div>
      </div>
    `;
  }
  private _getStateText(state: string): string | TemplateResult {
    const badgeStyle = this._config?.badge_style || "icon_text";
    const stateIcon = this._getStateIcon(state);
    const stateText = this._getLocationDisplayName(state);
    switch (badgeStyle) {
      case "icon_only":
        return this._renderMDI(stateIcon);
      case "text_only":
        return stateText;
      case "icon_text":
      default:
        return html`${this._renderMDI(stateIcon)} ${stateText}`;
    }
  }

  private _getStateIcon(state: string): string {
    switch (state) {
      case "home":
        return "mdi:home";
      case "not_home":
        return "mdi:home-export-outline";
      case "unknown":
        return "mdi:help-circle-outline";
      default:
        return "mdi:map-marker";
    }
  }

  private _getLocationDisplayName(location: string): string {
    if (!location || location === "unknown") return "Unknown";
    switch (location) {
      case "home":
        return "Home";
      case "not_home":
        return "Away";
      case "unknown":
        return "Unknown";
    }
    let displayName = location.replace(/_/g, " ");
    displayName = displayName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    return displayName;
  }

  private _getStateClass(state: string): string {
    switch (state) {
      case "home":
        return "state-home";
      case "not_home":
        return "state-away";
      default:
        return "state-unknown";
    }
  }

  private _getPersonDevices(personEntity: any): any[] {
    if (!this.hass || !personEntity) return [];
    const config = this._config;
    const excludedEntities: string[] = config?.excluded_entities || [];
    const personId: string = personEntity.entity_id;
    const devices: any[] = [];
    if (
      personEntity.attributes.device_trackers &&
      Array.isArray(personEntity.attributes.device_trackers)
    ) {
      personEntity.attributes.device_trackers.forEach((deviceId: string) => {
        if (!excludedEntities.includes(deviceId)) {
          const deviceEntity = this.hass!.states[deviceId];
          if (deviceEntity && deviceEntity.attributes.source_type) {
            devices.push(deviceEntity);
          }
        }
      });
    }
    if (devices.length === 0) {
      Object.values(this.hass.states).forEach((entity: any) => {
        if (
          entity.entity_id.startsWith("device_tracker.") &&
          !excludedEntities.includes(entity.entity_id) &&
          entity.attributes.source_type &&
          entity.attributes.person === personId
        ) {
          devices.push(entity);
        }
      });
    }
    devices.sort((a: any, b: any) => {
      const nameA = a.attributes.friendly_name || a.entity_id;
      const nameB = b.attributes.friendly_name || b.entity_id;
      return nameB.length - nameA.length;
    });
    return devices;
  }

  private _renderIcon(image?: string, icon?: string, name?: string) {
    if (image) {
      return html`<img
          src="${image}"
          alt="${name}"
          @error="${(e: Event) =>
            ((e.target as HTMLElement).style.display = "none")}"
        />
        <div class="fallback-icon" style="display: none;">
          ${icon ? this._renderMDI(icon) : this._renderMDI("mdi:account")}
        </div>`;
    } else if (icon) {
      return html`<div class="fallback-icon">${this._renderMDI(icon)}</div>`;
    } else {
      return html`<div class="fallback-icon">
        ${this._renderMDI("mdi:account")}
      </div>`;
    }
  }

  private _renderMDI(iconName: string) {
    if (iconName.startsWith("mdi:")) {
      return html`<ha-icon .icon="${iconName}"></ha-icon>`;
    }
    return iconName;
  }

  private _renderDevice(deviceEntity: any) {
    const deviceName =
      deviceEntity.attributes.friendly_name || deviceEntity.entity_id;
    const deviceIcon = this._getDeviceIcon(deviceEntity);
    const configuredAttributes = this._config?.device_attributes || [
      "battery_level",
      "gps_accuracy",
      "source_type",
    ];
    const availableAttributes: any[] = [];
    configuredAttributes.forEach((attrName) => {
      if (attrName === "zone") {
        const value = deviceEntity.state;
        const displayValue = this._formatDeviceState(value);
        const icon = this._getAttributeIcon("zone", value);
        const label = this._getAttributeLabel("zone");
        availableAttributes.push({
          name: attrName,
          label: label,
          value: value,
          displayValue: displayValue,
          icon: icon,
          entityName: deviceName,
        });
      } else {
        const attributeEntries = this._getAttributeEntriesForDevice(
          deviceEntity,
          attrName,
        );
        availableAttributes.push(...attributeEntries);
      }
    });
    return html`
      <div
        class="device-item"
        data-entity="${deviceEntity.entity_id}"
        @click=${this._onDeviceClick}
        tabindex="0"
        style="cursor: pointer;"
      >
        <div class="device-icon">${this._renderMDI(deviceIcon)}</div>
        <div class="device-info">
          <div class="device-name">${deviceName}</div>
          ${availableAttributes.length > 0
            ? html`
                <div class="device-attributes">
                  ${(() => {
                    // Zähle, wie oft jedes Label vorkommt
                    const labelCounts: Record<string, number> = {};
                    availableAttributes.forEach((attr) => {
                      labelCounts[attr.label] =
                        (labelCounts[attr.label] || 0) + 1;
                    });
                    return availableAttributes.map(
                      (attr) => html`
                        <span
                          class="device-attribute"
                          data-attribute="${attr.name}"
                          title="${attr.label}: ${attr.displayValue} (${attr.entityName ||
                          deviceName})"
                        >
                          <span
                            class="attribute-icon"
                            style="color: ${attr.icon.color}"
                          >
                            ${this._renderMDI(attr.icon.icon)}
                          </span>
                          <span class="attribute-name">
                            ${attr.label}
                            ${labelCounts[attr.label] > 1 && attr.entityName
                              ? html`<span class="attribute-entity">
                                  (${attr.entityName})</span
                                >`
                              : ""}
                            :
                          </span>
                          <span class="attribute-value"
                            >${attr.displayValue}</span
                          >
                        </span>
                      `,
                    );
                  })()}
                </div>
              `
            : ""}
        </div>
      </div>
    `;
  }
  /**
   * Click-Handler für Geräte: holt Entity-ID aus data-entity und öffnet Dialog
   */
  private _onDeviceClick(e: Event) {
    console.debug("🔍 Device clicked, showing more info");
    const target = e.currentTarget as HTMLElement;
    console.debug("🔍 Click target:", target);
    const entityId = target.getAttribute("data-entity");
    if (entityId) {
      this._showMoreInfo(entityId);
    }
    e.stopPropagation();
  }
  /**
   * Öffnet das Standard-HA-Dialog für das angeklickte Gerät
   */
  private _showMoreInfo(entityId: string) {
    console.debug("🔍 Showing more info for", entityId);
    fireEvent(this, "hass-more-info", { entityId: entityId });
  }

  private _getDeviceIcon(deviceEntity: any) {
    if (deviceEntity.entity_id.startsWith("device_tracker.")) {
      if (deviceEntity.attributes.source_type === "gps") {
        return "mdi:cellphone";
      } else if (deviceEntity.attributes.source_type === "bluetooth") {
        return "mdi:bluetooth";
      } else if (deviceEntity.attributes.source_type === "router") {
        return "mdi:router-wireless";
      }
      return "mdi:crosshairs-gps";
    }
    return "mdi:devices";
  }
  private _getAttributeLabel(attributeName: string) {
    const labels: Record<string, string> = {
      battery_level: "Battery",
      gps_accuracy: "GPS Accuracy",
      source_type: "Source",
      zone: "Zone",
      latitude: "Latitude",
      longitude: "Longitude",
      altitude: "Altitude",
      course: "Course",
      speed: "Speed",
      ip: "IP Address",
      hostname: "Hostname",
      mac: "MAC Address",
      last_seen: "Last Seen",
    };
    return labels[attributeName] || attributeName;
  }

  private _getAttributeIcon(attributeName: string, value: any) {
    switch (attributeName) {
      case "battery_level": {
        const batteryLevel = parseInt(value);
        if (batteryLevel > 80) return { icon: "mdi:battery", color: "#4caf50" };
        if (batteryLevel > 60)
          return { icon: "mdi:battery-60", color: "#8bc34a" };
        if (batteryLevel > 40)
          return { icon: "mdi:battery-40", color: "#ff9800" };
        if (batteryLevel > 20)
          return { icon: "mdi:battery-20", color: "#ff5722" };
        return { icon: "mdi:battery-alert", color: "#f44336" };
      }
      case "gps_accuracy": {
        const accuracy = parseInt(value);
        if (accuracy <= 10)
          return { icon: "mdi:crosshairs-gps", color: "#4caf50" };
        if (accuracy <= 50)
          return { icon: "mdi:crosshairs-gps", color: "#ff9800" };
        return { icon: "mdi:crosshairs-question", color: "#f44336" };
      }
      case "source_type":
        switch (value) {
          case "gps":
            return { icon: "mdi:crosshairs-gps", color: "#2196f3" };
          case "bluetooth":
            return { icon: "mdi:bluetooth", color: "#3f51b5" };
          case "router":
            return { icon: "mdi:router-wireless", color: "#607d8b" };
          default:
            return { icon: "mdi:help-circle", color: "#757575" };
        }
      case "altitude":
        return { icon: "mdi:elevation-rise", color: "#795548" };
      case "course":
        return { icon: "mdi:compass", color: "#9c27b0" };
      case "speed": {
        const speed = parseInt(value);
        if (speed > 50) return { icon: "mdi:speedometer", color: "#f44336" };
        if (speed > 10)
          return { icon: "mdi:speedometer-medium", color: "#ff9800" };
        return { icon: "mdi:speedometer-slow", color: "#4caf50" };
      }
      case "zone":
        return { icon: "mdi:map-marker-radius", color: "#2196f3" };
      case "latitude":
      case "longitude":
        return { icon: "mdi:map-marker", color: "#9c27b0" };
      case "ip":
        return { icon: "mdi:ip-network", color: "#607d8b" };
      case "hostname":
        return { icon: "mdi:dns", color: "#607d8b" };
      case "mac":
        return { icon: "mdi:network", color: "#607d8b" };
      case "last_seen":
        return { icon: "mdi:clock-outline", color: "#757575" };
      default:
        return { icon: "mdi:information-outline", color: "#757575" };
    }
  }

  private _getAttributeDisplayValue(attributeName: string, value: any) {
    switch (attributeName) {
      case "battery_level":
        return `${value}%`;
      case "gps_accuracy":
        return `${value}m`;
      case "altitude":
        return `${value}m`;
      case "speed":
        return `${value} km/h`;
      case "course":
        return `${value}°`;
      case "zone":
        return String(value).replace(/_/g, " ");
      case "latitude":
        return `${parseFloat(value).toFixed(4)}°`;
      case "longitude":
        return `${parseFloat(value).toFixed(4)}°`;
      case "ip":
      case "hostname":
        return String(value);
      case "mac":
        return String(value).toUpperCase();
      case "last_seen":
        if (value && (value.includes("T") || value.includes("-"))) {
          try {
            const date = new Date(value);
            return date.toLocaleTimeString();
          } catch (e) {
            console.error("Error parsing last_seen date:", e);
            return String(value);
          }
        }
        return String(value);
      default:
        return String(value);
    }
  }

  private _getAttributeEntriesForDevice(
    deviceEntity: any,
    attrName: string,
  ): any[] {
    const results: any[] = [];
    const seenEntities = new Set<string>();
    if (!this.hass || !this.hass.states) return results;
    const deviceId = deviceEntity.attributes.device_id;
    const deviceEntityId = deviceEntity.entity_id;
    const deviceName =
      deviceEntity.attributes.friendly_name ||
      deviceEntity.entity_id.replace("device_tracker.", "");
    const attributePatterns: Record<string, string[]> = {
      battery_level: ["battery_level", "battery"],
      signal_strength: ["signal_strength", "wifi_signal", "signal"],
      gps_accuracy: ["gps_accuracy", "accuracy"],
    };
    const patterns = attributePatterns[attrName] || [attrName];
    if (!this.hass || !this.hass.states) return results;
    Object.values(this.hass.states).forEach((entity: any) => {
      if (!entity.entity_id.startsWith("sensor.")) return;
      const entityDisplayName =
        entity.attributes.friendly_name || entity.entity_id;
      if (seenEntities.has(entityDisplayName)) return;
      let isRelated = false;
      if (deviceId && entity.attributes.device_id === deviceId) {
        isRelated = true;
      }
      if (!isRelated) {
        const sensorId = entity.entity_id.toLowerCase();
        const sensorName = (
          entity.attributes.friendly_name || ""
        ).toLowerCase();
        const deviceBaseName = deviceEntityId
          .replace("device_tracker.", "")
          .toLowerCase();
        const deviceFriendlyName = (deviceName || "").toLowerCase();
        const allDeviceNames =
          this.hass && this.hass.states
            ? Object.values(this.hass.states)
                .filter((e) => e.entity_id.startsWith("device_tracker."))
                .map((e) => ({
                  entity_id: e.entity_id
                    .replace("device_tracker.", "")
                    .toLowerCase(),
                  friendly_name: (
                    e.attributes.friendly_name || ""
                  ).toLowerCase(),
                  full_entity: e.entity_id,
                }))
            : [];
        const exactEntityMatch =
          sensorId === `sensor.${deviceBaseName}` ||
          sensorId.startsWith(`sensor.${deviceBaseName}_`);
        let belongsToMoreSpecificDevice = false;
        if (exactEntityMatch) {
          for (const otherDevice of allDeviceNames) {
            if (
              otherDevice.entity_id !== deviceBaseName &&
              otherDevice.entity_id.includes(deviceBaseName) &&
              (sensorId.includes(otherDevice.entity_id) ||
                sensorName.includes(otherDevice.friendly_name))
            ) {
              belongsToMoreSpecificDevice = true;
              break;
            }
          }
        }
        if (exactEntityMatch && !belongsToMoreSpecificDevice) {
          isRelated = true;
        } else if (
          !isRelated &&
          deviceFriendlyName &&
          deviceFriendlyName.length > 3
        ) {
          const exactFriendlyMatch =
            sensorName.includes(deviceFriendlyName) ||
            sensorId.includes(deviceFriendlyName.replace(/\s+/g, "_"));
          let betterMatchExists = false;
          if (exactFriendlyMatch) {
            for (const otherDevice of allDeviceNames) {
              if (
                otherDevice.friendly_name !== deviceFriendlyName &&
                otherDevice.friendly_name.length > deviceFriendlyName.length &&
                (sensorName.includes(otherDevice.friendly_name) ||
                  sensorId.includes(
                    otherDevice.friendly_name.replace(/\s+/g, "_"),
                  ))
              ) {
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
      const sensorId = entity.entity_id.toLowerCase();
      const sensorName = (entity.attributes.friendly_name || "").toLowerCase();
      const hasAttributeMatch = patterns.some(
        (pattern) => sensorId.includes(pattern) || sensorName.includes(pattern),
      );
      if (!hasAttributeMatch) return;
      if (this._usedSensors.has(entity.entity_id)) return;
      const excludePatterns = [
        "battery_state",
        "charging_state",
        "power_state",
      ];
      const isExcluded = excludePatterns.some(
        (exclude) => sensorId.includes(exclude) || sensorName.includes(exclude),
      );
      if (isExcluded) return;
      const sensorValue = entity.state;
      if (
        sensorValue &&
        sensorValue !== "unknown" &&
        sensorValue !== "unavailable"
      ) {
        const displayValue = this._getAttributeDisplayValue(
          attrName,
          sensorValue,
        );
        const icon = this._getAttributeIcon(attrName, sensorValue);
        const label = this._getAttributeLabel(attrName);
        results.push({
          name: attrName,
          label: label,
          value: sensorValue,
          displayValue: displayValue,
          icon: icon,
          entityName: entityDisplayName,
        });
        seenEntities.add(entityDisplayName);
        this._usedSensors.add(entity.entity_id);
      }
    });
    return results;
  }

  private _formatDeviceState(state: string) {
    if (!state || state === "unknown") return "Unknown";
    switch (state) {
      case "home":
        return "Home";
      case "not_home":
        return "Away";
      case "unknown":
        return "Unknown";
    }
    let displayName = state.replace(/_/g, " ");
    displayName = displayName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    return displayName;
  }

  static get properties() {
    return {
      hass: { attribute: false },
      _config: { attribute: false },
    };
  }
}

export default EnhancedPersonCardEditor;

// Register card in window.customCards for HA UI discovery
if (!window.customCards) {
  window.customCards = [];
}

window.customCards.push({
  type: "enhanced-person-card",
  name: "Enhanced Person Card",
  description: "a",
  preview: true,
  documentationURL: "https://github.com/dmoo500/ha-enhanced-person-card",
});

console.log("✅ EnhancedPersonCard fully loaded and registered");
