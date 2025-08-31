import { LitElement, html, css, TemplateResult } from "lit";
import { use } from "lit-translate";
import { customElement, property, state } from "lit/decorators.js";
//import { fireEvent } from "custom-card-helpers";
import type {
  HomeAssistant,
  LovelaceCardEditor,
  EnhancedPersonCardEditorConfig,
} from "./types/home-assistant.js";
import { schema } from "./types/home-assistant.js";

/**
 * Visual Editor für die enhanced-person-card (LitElement + ha-form)
 */
@customElement("enhanced-person-card-editor")
export class EnhancedPersonCardEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public lovelace?: any;
  @state() private _config!: EnhancedPersonCardEditorConfig;

  constructor() {
    super();
    console.log("🎨 EnhancedPersonCardEditor constructor called");
  }

  static get styles() {
    return css`
      .card-config {
        padding: 16px;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--card-divider-color);
      }

      .header-title {
        font-size: 24px;
        font-weight: bold;
        color: var(--primary-text-color, #dc143c);
      }

      .header-subtitle {
        font-size: 14px;
        color: var(--secondary-text-color);
        margin-top: 4px;
      }

      ha-form {
        display: block;
        margin-bottom: 24px;
      }

      .preview {
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        padding: 20px;
        margin-top: 24px;
      }

      .preview-title {
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--primary-text-color);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .preview-config {
        font-family: "SFMono-Regular", "Monaco", "Consolas", monospace;
        font-size: 13px;
        color: var(--secondary-text-color);
        background: var(--code-editor-background-color, #f8f8f8);
        padding: 16px;
        border-radius: 8px;
        overflow-x: auto;
        white-space: pre-wrap;
        line-height: 1.4;
        border: 1px solid var(--divider-color);
      }

      @media (max-width: 768px) {
        .card-config {
          padding: 12px;
        }
      }
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    console.log("🎨 EnhancedPersonCardEditor connected to DOM");
    console.log("🎨 HASS available:", !!this.hass);
  }

  public setConfig(config: EnhancedPersonCardEditorConfig): void {
    // Only set defaults if a value is truly missing, never overwrite existing config values
    // This prevents unnecessary resets when grid_options or other Lovelace options change
    const defaults: Partial<EnhancedPersonCardEditorConfig> = {
      type: "custom:enhanced-person-card",
      entity: "",
      show_name: true,
      show_state: true,
      show_devices: true,
      badge_style: "icon_text" as "icon_text",
    };
    // Only use default if config[key] is undefined
    const merged: Partial<EnhancedPersonCardEditorConfig> = {
      ...defaults,
      ...config,
    };
    Object.keys(merged).forEach((key) => {
      if (config[key] !== undefined) {
        merged[key] = config[key];
      }
    });
    this._config = merged;
  }

  protected render(): TemplateResult {
    use(
      (this.hass.selectedLanguage || this.hass.language || "en").substring(
        0,
        2,
      ),
    );
    if (!this.hass) {
      return html`
        <div class="card-config">
          <div class="warning">⚠️ Waiting for Home Assistant connection...</div>
        </div>
      `;
    }

    if (!this._config) {
      return html`
        <div class="card-config">
          <div class="warning">⚠️ Loading configuration...</div>
        </div>
      `;
    }

    const data = {
      entity: this._config.entity || "",
      name: this._config.name || "",
      image: this._config.image || "",
      icon: this._config.icon || "",
      show_name: this._config.show_name ?? true,
      show_state: this._config.show_state ?? true,
      show_devices: this._config.show_devices ?? true,
      badge_style: this._config.badge_style || "icon_text",
      device_attributes: this._config.device_attributes || [],
      excluded_entities: this._config.excluded_entities || [],
    };

    return html`
      <div class="card-config">
        <!-- Header -->
        <div class="section">
          <div class="section-header">
            🌦️ Enhanced Person Card Configuration
          </div>
          <div class="section-description">
            Configure your Enhanced Person with the options below. All changes
            are saved automatically.
          </div>
        </div>

        <!-- HA Form -->
        <ha-form
          .hass=${this.hass}
          .data=${data}
          .schema=${schema}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>

        <!-- Configuration Preview -->
        ${this._config.entity
          ? html`
              <div class="preview">
                <div class="preview-title">📋 YAML Configuration</div>
                <div class="preview-config">${this._renderConfigPreview()}</div>
              </div>
            `
          : html`
              <div class="warning">
                ⚠️ Please select a device to complete the configuration.
              </div>
            `}
      </div>
    `;
  }

  private _renderConfigPreview(): string {
    const config: any = {
      type: "custom:enhanced-person-card",
      ...this._config,
    };

    // Remove undefined and empty values for cleaner preview
    Object.keys(config).forEach((key) => {
      if (config[key] === undefined || config[key] === "") {
        delete config[key];
      }
    });

    return Object.entries(config)
      .map(([key, value]) => {
        if (typeof value === "string") {
          return `${key}: "${value}"`;
        }
        return `${key}: ${value}`;
      })
      .join("\n");
  }

  private _computeLabel = (schema: any) => {
    const labels: Record<string, string> = {
      entity: "Person Entity",
      name: "Custom Name",
      image: "Image URL",
      icon: "Icon",
      show_name: "Show Name",
      show_state: "Show State",
      show_devices: "Show Devices",
      badge_style: "Badge Style",
      device_attributes: "Device Attributes",
      excluded_entities: "Excluded Entities",
    };
    return labels[schema.name] || schema.name;
  };

  private _valueChanged(ev: any): void {
    if (!this._config || !this.hass) {
      return;
    }

    const newConfig = {
      type: "custom:enhanced-person-card",
      ...ev.detail.value,
    };

    // Remove empty values
    Object.keys(newConfig).forEach((key) => {
      if (
        (newConfig as any)[key] === "" ||
        (newConfig as any)[key] === undefined
      ) {
        delete (newConfig as any)[key];
      }
    });

    this._config = newConfig;
    // fireEvent(this, "config-changed", { config: this._config });
    // Dispatch config-changed event
    const event = new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    });

    (this as any).dispatchEvent(event);
  }

  static get properties() {
    return {
      hass: {},
      _config: {},
    };
  }
}
