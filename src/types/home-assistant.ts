// Typdefinition für Home Assistant LovelaceCardEditor
export interface LovelaceCardEditor extends HTMLElement {
  hass: any;
  setConfig(config: any): void;
  config?: any;
}

export interface HomeAssistant {
  states: { [entity_id: string]: any };
  callService: (domain: string, service: string, serviceData?: any) => void;
  [key: string]: any;
}

export interface EnhancedPersonCardConfig {
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
  badge_style?: "icon_text" | "icon_only" | "text_only";
  theme?: string;
  grid_options?: {
    rows?: number;
    columns?: number | "full";
  };
  layout_options?: {
    grid_rows?: number;
    grid_columns?: number | "full";
  };
  grid_rows?: number;
  grid_columns?: number | "full";
}
export type EnhancedPersonCardEditorConfig =
  Partial<EnhancedPersonCardConfig> & {
    type?: string;
    entity?: string;
    name?: string;
    image?: string;
    icon?: string;
    show_name?: boolean;
    show_state?: boolean;
    show_devices?: boolean;
    device_attributes?: string[];
    excluded_entities?: string[];
    badge_style?: "icon_text" | "icon_only" | "text_only";
    [key: string]: any; // <-- nur wenn du beliebige Keys erlauben willst
  };

export const schema = [
  { name: "entity", required: true, selector: { entity: {} } },
  { name: "name", selector: { text: {}, placeholder: "Custom name" } },
  { name: "image", selector: { text: { placeholder: "URL to an image" } } },
  { name: "icon", selector: { icon: {} } },
  { name: "show_name", selector: { boolean: {} } },
  { name: "show_state", selector: { boolean: {} } },
  { name: "show_devices", selector: { boolean: {} } },
  {
    name: "badge_style",
    selector: {
      select: {
        options: [
          { value: "icon_text", label: "Icon + Text" },
          { value: "icon_only", label: "Nur Icon" },
          { value: "text_only", label: "Nur Text" },
        ],
      },
    },
  },
  {
    name: "device_attributes",
    selector: {
      select: {
        multiple: true,
        options: [
          "battery",
          "battery_level",
          "gps_accuracy",
          "source_type",
          "last_update_trigger",
          "latitude",
          "longitude",
          "altitude",
          "speed",
          "direction",
        ],
        placeholder: "e.g. battery, bluetooth",
      },
    },
  },
  {
    name: "excluded_entities",
    selector: { entity: { multiple: true }, domain: "device_tracker" },
  },
];
