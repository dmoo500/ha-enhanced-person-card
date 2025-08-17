"use strict";(()=>{var w=class extends HTMLElement{constructor(){super();this._hass=null;this._config=null;this._initialized=!1;this._lastEntityState="";this._lastEntityAttributes=null;this._lastDevicesData=[];this._lastConfigHash="";this._rendered=!1;this._usedSensors=new Set;this.attachShadow({mode:"open"}),this._render()}set hass(e){this._hass=e||null,this._initialized&&this._updateIfNeeded()}get hass(){return this._hass||void 0}setConfig(e){var s,a,i,n,c,d,o,u;if(!e)throw new Error("Invalid configuration");if(!e.entity)throw new Error("You need to define an entity");let t=this._config;this._config=e,this._initialized=!0,this._lastConfigHash="",this._rendered=!1,(((s=t==null?void 0:t.grid_options)==null?void 0:s.rows)!==((a=e==null?void 0:e.grid_options)==null?void 0:a.rows)||((i=t==null?void 0:t.layout_options)==null?void 0:i.grid_rows)!==((n=e==null?void 0:e.layout_options)==null?void 0:n.grid_rows)||(t==null?void 0:t.grid_rows)!==(e==null?void 0:e.grid_rows)||((c=t==null?void 0:t.grid_options)==null?void 0:c.columns)!==((d=e==null?void 0:e.grid_options)==null?void 0:d.columns)||((o=t==null?void 0:t.layout_options)==null?void 0:o.grid_columns)!==((u=e==null?void 0:e.layout_options)==null?void 0:u.grid_columns)||(t==null?void 0:t.grid_columns)!==(e==null?void 0:e.grid_columns))&&this._updateDynamicStyles(),this._hass?this._updateIfNeeded():this._render()}getCardSize(){var e,t,r,s;return(t=(e=this._config)==null?void 0:e.grid_options)!=null&&t.rows?Number(this._config.grid_options.rows):(s=(r=this._config)==null?void 0:r.layout_options)!=null&&s.grid_rows?Number(this._config.layout_options.grid_rows):this._config&&"grid_rows"in this._config?Number(this._config.grid_rows):3}getCardColumns(){var e,t,r,s;return((t=(e=this._config)==null?void 0:e.grid_options)==null?void 0:t.columns)!==void 0?this._config.grid_options.columns:((s=(r=this._config)==null?void 0:r.layout_options)==null?void 0:s.grid_columns)!==void 0?this._config.layout_options.grid_columns:this._config&&"grid_columns"in this._config&&this._config.grid_columns!==void 0?this._config.grid_columns:1}_updateDynamicStyles(){var d,o,u,l,_;if(!this.shadowRoot)return;let e=((o=(d=this._config)==null?void 0:d.grid_options)==null?void 0:o.rows)||((l=(u=this._config)==null?void 0:u.layout_options)==null?void 0:l.grid_rows)||((_=this._config)==null?void 0:_.grid_rows)||this.getCardSize(),t=this.getCardColumns(),r=t==="full"?12:typeof t=="number"?t:1,s=40;r===1?s=Math.max(60,e*20+40):r===2?s=Math.max(70,e*22+50):r>=3&&r<=5?s=Math.max(80,e*25+60):r>=6&&r<=8?s=Math.max(55,e*15+40):r>=9&&(s=Math.max(40,e*8+25));let a=Math.max(1,e);s=s+(a-1)*8;let i,n;if(r>=9?(i=30,n=60):r>=6?(i=40,n=90):r>=3?(i=60,n=140):(i=50,n=120),s=Math.max(i,Math.min(n,s)),this.style.setProperty("--dynamic-icon-size",`${s}px`),t==="full"?(this.style.setProperty("--card-width","100%"),this.style.setProperty("--card-flex-grow","1"),this.style.setProperty("--card-grid-column","1 / -1"),this.style.setProperty("--card-max-width","none"),this.style.setProperty("--card-margin","0")):typeof t=="number"&&t>1?(this.style.setProperty("--card-grid-column","calc( var(--base-column-count) * var(--column-span, 1)"),this.style.removeProperty("--card-width"),this.style.removeProperty("--card-flex-grow"),this.style.removeProperty("--card-max-width"),this.style.removeProperty("--card-margin")):(this.style.removeProperty("--card-width"),this.style.removeProperty("--card-flex-grow"),this.style.removeProperty("--card-grid-column"),this.style.removeProperty("--card-max-width"),this.style.removeProperty("--card-margin")),e>1){let g=`${e*80}px`;this.style.setProperty("--dynamic-height",g)}let c;t==="full"||r>=12?c="12%":r>=9?c="15%":r>=6?c="20%":r>=3?c="25%":c="30%",this.style.setProperty("--person-left-width",c)}_updateIfNeeded(){if(!this._hass||!this._config||!this._initialized){this._render();return}let e=this._config.entity,t=this._hass.states[e];if(!t){this._render();return}let r=t.state,s=t.attributes,a=this._getPersonDevices(t),i=JSON.stringify({name:this._config.name,image:this._config.image,icon:this._config.icon,show_name:this._config.show_name,show_state:this._config.show_state,show_devices:this._config.show_devices,badge_style:this._config.badge_style,device_attributes:this._config.device_attributes}),n=this._lastEntityState!==r,c=JSON.stringify(this._lastEntityAttributes)!==JSON.stringify(s),d=JSON.stringify(this._lastDevicesData)!==JSON.stringify(a),o=this._lastConfigHash!==i;(n||c||d||o||!this._rendered)&&(this._lastEntityState=r,this._lastEntityAttributes=s,this._lastDevicesData=a,this._lastConfigHash=i,this._render())}_getPersonDevices(e){if(!this._hass||!e)return[];let t=this._config,r=(t==null?void 0:t.excluded_entities)||[],s=e.entity_id,a=[];return e.attributes.device_trackers&&Array.isArray(e.attributes.device_trackers)&&e.attributes.device_trackers.forEach(i=>{if(!r.includes(i)){let n=this._hass.states[i];n&&n.attributes.source_type&&a.push(n)}}),a.length===0&&Object.values(this._hass.states).forEach(i=>{i.entity_id.startsWith("device_tracker.")&&!r.includes(i.entity_id)&&i.attributes.source_type&&i.attributes.person===s&&a.push(i)}),a.sort((i,n)=>{let c=i.attributes.friendly_name||i.entity_id;return(n.attributes.friendly_name||n.entity_id).length-c.length}),a}_getAttributeLabel(e){return{battery_level:"Battery",gps_accuracy:"GPS Accuracy",source_type:"Source",zone:"Zone",latitude:"Latitude",longitude:"Longitude",altitude:"Altitude",course:"Course",speed:"Speed",ip:"IP Address",hostname:"Hostname",mac:"MAC Address",last_seen:"Last Seen"}[e]||e}_getAttributeIcon(e,t){switch(e){case"battery_level":let r=parseInt(t);return r>80?{icon:"mdi:battery",color:"#4caf50"}:r>60?{icon:"mdi:battery-60",color:"#8bc34a"}:r>40?{icon:"mdi:battery-40",color:"#ff9800"}:r>20?{icon:"mdi:battery-20",color:"#ff5722"}:{icon:"mdi:battery-alert",color:"#f44336"};case"gps_accuracy":let s=parseInt(t);return s<=10?{icon:"mdi:crosshairs-gps",color:"#4caf50"}:s<=50?{icon:"mdi:crosshairs-gps",color:"#ff9800"}:{icon:"mdi:crosshairs-question",color:"#f44336"};case"source_type":switch(t){case"gps":return{icon:"mdi:crosshairs-gps",color:"#2196f3"};case"bluetooth":return{icon:"mdi:bluetooth",color:"#3f51b5"};case"router":return{icon:"mdi:router-wireless",color:"#607d8b"};default:return{icon:"mdi:help-circle",color:"#757575"}}case"altitude":return{icon:"mdi:elevation-rise",color:"#795548"};case"course":return{icon:"mdi:compass",color:"#9c27b0"};case"speed":let a=parseInt(t);return a>50?{icon:"mdi:speedometer",color:"#f44336"}:a>10?{icon:"mdi:speedometer-medium",color:"#ff9800"}:{icon:"mdi:speedometer-slow",color:"#4caf50"};case"zone":return{icon:"mdi:map-marker-radius",color:"#2196f3"};case"latitude":return{icon:"mdi:latitude",color:"#9c27b0"};case"longitude":return{icon:"mdi:longitude",color:"#9c27b0"};case"ip":return{icon:"mdi:ip-network",color:"#607d8b"};case"hostname":return{icon:"mdi:dns",color:"#607d8b"};case"mac":return{icon:"mdi:network",color:"#607d8b"};case"last_seen":return{icon:"mdi:clock-outline",color:"#757575"};default:return{icon:"mdi:information-outline",color:"#757575"}}}_getAttributeDisplayValue(e,t){switch(e){case"battery_level":return`${t}%`;case"gps_accuracy":return`${t}m`;case"altitude":return`${t}m`;case"speed":return`${t} km/h`;case"course":return`${t}\xB0`;case"zone":return String(t).replace(/_/g," ");case"latitude":return`${parseFloat(t).toFixed(4)}\xB0`;case"longitude":return`${parseFloat(t).toFixed(4)}\xB0`;case"ip":return String(t);case"hostname":return String(t);case"mac":return String(t).toUpperCase();case"last_seen":if(t&&(t.includes("T")||t.includes("-")))try{return new Date(t).toLocaleTimeString()}catch{return String(t)}return String(t);default:return String(t)}}_render(){if(!this.shadowRoot){console.warn("\u26A0\uFE0F Shadow Root not available");return}if(this._usedSensors.clear(),!this._initialized||!this._config){this.shadowRoot.innerHTML=this._getLoadingHTML();return}if(!this._hass){this.shadowRoot.innerHTML=this._getNoHassHTML();return}let e=this._config.entity,t=this._hass.states[e];if(!t){this.shadowRoot.innerHTML=this._getEntityNotFoundHTML(e);return}this.shadowRoot.innerHTML=this._getCardHTML(t),this._attachEventListeners(),this._updateDynamicStyles(),this._rendered=!0}_getLoadingHTML(){return`
      ${this._getStyles()}
      <div class="person-card loading">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading...</div>
      </div>
    `}_getNoHassHTML(){return`
      ${this._getStyles()}
      <div class="person-card error">
        <div class="error-icon">\u26A0\uFE0F</div>
        <div class="error-text">Home Assistant not available</div>
      </div>
    `}_getEntityNotFoundHTML(e){return`
      ${this._getStyles()}
      <div class="person-card error">
        <div class="error-icon">\u274C</div>
        <div class="error-text">Entity "${e}" not found</div>
      </div>
    `}_getCardHTML(e){let t=this._config,r=t.name||e.attributes.friendly_name||t.entity,s=e.state,a=t.image||e.attributes.entity_picture,i=t.icon,n=t.show_name!==!1,c=t.show_state!==!1,d=t.show_devices!==!1,o=this._getStateText(s),u=this._getStateClass(s),l=this._getPersonDevices(e);return`
      ${this._getStyles()}
      <div class="person-card" data-entity="${t.entity}">
        ${n?`<div class="person-header">
          <div class="person-name">${r}</div>
        </div>`:""}
        <div class="person-content">
          <div class="person-left-section">
            <div class="person-avatar-container">
              <div class="person-avatar">
                ${this._renderIcon(a,i,r)}
              </div>
              ${c?`<div class="person-status-badge ${u} ${t.badge_style==="icon_only"?"icon-only":""}">${o}</div>`:""}
            </div>
          </div>
          ${d?`<div class="person-devices-section">
            <div class="devices-header">Devices</div>
            <div class="devices-list">
              ${l.length>0?l.map(_=>this._renderDevice(_)).join(""):'<div class="no-devices">No devices found</div>'}
            </div>
          </div>`:""}
        </div>
      </div>
    `}_renderIcon(e,t,r){return e?`<img src="${e}" alt="${r}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="fallback-icon" style="display: none;">${t?this._renderMDI(t):this._renderMDI("mdi:account")}</div>`:t?`<div class="fallback-icon">${this._renderMDI(t)}</div>`:`<div class="fallback-icon">${this._renderMDI("mdi:account")}</div>`}_renderMDI(e){return e.startsWith("mdi:")?`<ha-icon icon="${e}"></ha-icon>`:e}_getStateText(e){var a;let t=((a=this._config)==null?void 0:a.badge_style)||"icon_text",r=this._getStateIcon(e),s=this._getLocationDisplayName(e);switch(t){case"icon_only":return this._renderMDI(r);case"text_only":return s;case"icon_text":default:return`${this._renderMDI(r)} ${s}`}}_getStateIcon(e){switch(e){case"home":return"mdi:home";case"not_home":return"mdi:home-export-outline";case"unknown":return"mdi:help-circle-outline";default:return"mdi:map-marker"}}_getLocationDisplayName(e){if(!e||e==="unknown")return"Unknown";switch(e){case"home":return"Home";case"not_home":return"Away";case"unknown":return"Unknown"}let t=e.replace(/_/g," ");return t=t.split(" ").map(r=>r.charAt(0).toUpperCase()+r.slice(1).toLowerCase()).join(" "),t}_getStateClass(e){switch(e){case"home":return"state-home";case"not_home":return"state-away";default:return"state-unknown"}}_renderDevice(e){let t=e.attributes.friendly_name||e.entity_id,r=this._getDeviceIcon(e),s=this._config.device_attributes||["battery_level","gps_accuracy","source_type"],a=[];return s.forEach(i=>{if(i==="zone"){let n=e.state,c=this._formatDeviceState(n),d=this._getAttributeIcon("zone",n),o=this._getAttributeLabel("zone");a.push({name:i,label:o,value:n,displayValue:c,icon:d,entityName:t})}else{let n=this._getAttributeEntriesForDevice(e,i);a.push(...n)}}),`
      <div class="device-item" data-entity="${e.entity_id}">
        <div class="device-icon">
          ${this._renderMDI(r)}
        </div>
        <div class="device-info">
          <div class="device-name">${t}</div>
          ${a.length>0?`
            <div class="device-attributes">
              ${a.map(i=>{let n=String(i.entityName||i.label);return`
                <span class="device-attribute" data-attribute="${i.name}" title="${i.label}: ${i.displayValue} (${i.entityName||t})">
                  <span class="attribute-icon" style="color: ${i.icon.color}">
                    ${this._renderMDI(i.icon.icon)}
                  </span>
                  <span class="attribute-name${!1?" scrolling":""}">${n}:</span>
                  <span class="attribute-value">${i.displayValue}</span>
                </span>
              `}).join("")}
            </div>
          `:""}
        </div>
      </div>
    `}_getAttributeEntriesForDevice(e,t){let r=[],s=new Set;if(!this._hass||!this._hass.states)return r;let a=e.attributes.device_id,i=e.entity_id,n=e.attributes.friendly_name||e.entity_id.replace("device_tracker.",""),d={battery_level:["battery_level","battery"],signal_strength:["signal_strength","wifi_signal","signal"],gps_accuracy:["gps_accuracy","accuracy"]}[t]||[t];return Object.values(this._hass.states).forEach(o=>{if(!o.entity_id.startsWith("sensor."))return;let u=o.attributes.friendly_name||o.entity_id;if(s.has(u))return;let l=!1;if(a&&o.attributes.device_id===a&&(l=!0),!l){let h=o.entity_id.toLowerCase(),b=(o.attributes.friendly_name||"").toLowerCase(),y=i.replace("device_tracker.","").toLowerCase(),v=(n||"").toLowerCase(),S=Object.values(this._hass.states).filter(p=>p.entity_id.startsWith("device_tracker.")).map(p=>({entity_id:p.entity_id.replace("device_tracker.","").toLowerCase(),friendly_name:(p.attributes.friendly_name||"").toLowerCase(),full_entity:p.entity_id})),C=h===`sensor.${y}`||h.startsWith(`sensor.${y}_`),L=!1;if(C){for(let p of S)if(p.entity_id!==y&&p.entity_id.includes(y)&&(h.includes(p.entity_id)||b.includes(p.friendly_name))){L=!0;break}}if(C&&!L)l=!0;else if(!l&&v&&v.length>3){let p=b.includes(v)||h.includes(v.replace(/\s+/g,"_")),z=!1;if(p){for(let x of S)if(x.friendly_name!==v&&x.friendly_name.length>v.length&&(b.includes(x.friendly_name)||h.includes(x.friendly_name.replace(/\s+/g,"_")))){z=!0;break}}p&&!z&&(l=!0)}}if(!l)return;let _=o.entity_id.toLowerCase(),g=(o.attributes.friendly_name||"").toLowerCase();if(!d.some(h=>_.includes(h)||g.includes(h))||this._usedSensors.has(o.entity_id)||["battery_state","charging_state","power_state"].some(h=>_.includes(h)||g.includes(h)))return;let f=o.state;if(f&&f!=="unknown"&&f!=="unavailable"){let h=this._getAttributeDisplayValue(t,f),b=this._getAttributeIcon(t,f),y=this._getAttributeLabel(t);r.push({name:t,label:y,value:f,displayValue:h,icon:b,entityName:u}),s.add(u),this._usedSensors.add(o.entity_id)}}),r}_formatDeviceState(e){if(!e||e==="unknown")return"Unknown";switch(e){case"home":return"Home";case"not_home":return"Away";case"unknown":return"Unknown"}let t=e.replace(/_/g," ");return t=t.split(" ").map(r=>r.charAt(0).toUpperCase()+r.slice(1).toLowerCase()).join(" "),t}_getDeviceIcon(e){return e.entity_id.startsWith("device_tracker.")?e.attributes.source_type==="gps"?"mdi:cellphone":e.attributes.source_type==="bluetooth"?"mdi:bluetooth":e.attributes.source_type==="router"?"mdi:router-wireless":"mdi:crosshairs-gps":"mdi:devices"}_getStyles(){var r,s,a,i,n;return`
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
          min-height: ${(((s=(r=this._config)==null?void 0:r.grid_options)==null?void 0:s.rows)||((i=(a=this._config)==null?void 0:a.layout_options)==null?void 0:i.grid_rows)||((n=this._config)==null?void 0:n.grid_rows)||this.getCardSize())>1?"100%":"var(--card-min-height, 120px)"};
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
    `}_attachEventListeners(){var t,r,s;let e=(t=this.shadowRoot)==null?void 0:t.querySelector(".person-card");if(e&&!e.classList.contains("loading")&&!e.classList.contains("error")){e.addEventListener("click",()=>this._handleClick());let a=(r=this.shadowRoot)==null?void 0:r.querySelectorAll(".device-item");a==null||a.forEach(n=>{n.addEventListener("click",c=>{c.stopPropagation();let d=n.getAttribute("data-entity");d&&this._handleDeviceClick(d)})});let i=(s=this.shadowRoot)==null?void 0:s.querySelectorAll(".device-attribute");i==null||i.forEach(n=>{n.addEventListener("click",c=>{c.stopPropagation();let d=n.closest(".device-item"),o=d==null?void 0:d.getAttribute("data-entity"),u=n.getAttribute("data-attribute");if(o){if(u==="battery_level"){let l=o.replace("device_tracker.",""),_=Object.keys(this._hass.states).find(g=>g.includes("battery")&&g.includes(l));if(_){this._handleDeviceClick(_);return}}this._handleDeviceClick(o)}})})}}_handleClick(){var t;if(!((t=this._config)!=null&&t.entity))return;let e=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:this._config.entity}});this.dispatchEvent(e)}_handleDeviceClick(e){let t=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}});this.dispatchEvent(t)}static getConfigElement(){return document.createElement("enhanced-person-card-editor")}static getStubConfig(){return{type:"custom:enhanced-person-card",entity:"",show_name:!0,show_state:!0,show_devices:!0,badge_style:"icon_text",device_attributes:["battery_level","gps_accuracy","source_type","zone"],excluded_entities:[],grid_options:{rows:1,columns:1}}}static getConfigSchema(){return k.getConfigSchema()}static getCardColumns(e){var t,r;return((t=e==null?void 0:e.grid_options)==null?void 0:t.columns)!==void 0?e.grid_options.columns:((r=e==null?void 0:e.layout_options)==null?void 0:r.grid_columns)!==void 0?e.layout_options.grid_columns:e&&"grid_columns"in e&&e.grid_columns!==void 0?e.grid_columns:1}connectedCallback(){}disconnectedCallback(){}};try{customElements.get("enhanced-person-card")||customElements.define("enhanced-person-card",w)}catch(m){console.warn("Error registering enhanced-person-card:",m)}var I=w;typeof window!="undefined"&&(window.customCards=window.customCards||[],window.customCards.some(m=>m.type==="enhanced-person-card")||window.customCards.push({type:"enhanced-person-card",name:"Enhanced Person Card",description:"Advanced person card with device tracking, sensor integration, and grid layout support",preview:!1,documentationURL:"https://github.com/your-username/ha-enhanced-person-card"}));var k=class extends HTMLElement{constructor(){super();this._hass=null;this._config={};this._rendered=!1;this._computeLabel=e=>({entity:"Entit\xE4t",name:"Name (optional)",image:"Bild URL (optional)",icon:"Icon (optional)",show_name:"Namen anzeigen",show_state:"Status anzeigen",show_devices:"Ger\xE4te anzeigen",badge_style:"Badge-Stil",device_attributes:"Ger\xE4te-Attribute",excluded_entities:"Ausgeschlossene Entit\xE4ten (optional)",theme:"Theme (optional)"})[e.name]||e.name;this._valueChanged=e=>{if(!e.detail.value)return;this._config={type:"custom:enhanced-person-card",...e.detail.value};let t=new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0});this.dispatchEvent(t)};this.attachShadow({mode:"open"})}connectedCallback(){this._rendered||this._render()}set hass(e){this._hass=e,this._rendered?this._updateHaForm():this._render()}setConfig(e){var t;if(this._config={...e},!this._rendered)this._render();else{let r=(t=this.shadowRoot)==null?void 0:t.querySelector("ha-form");r&&(r.data=this._config)}}_updateHaForm(){if(!this.shadowRoot||!this._hass)return;let e=this.shadowRoot.querySelector("ha-form");if(e&&(e.hass=this._hass,e.schema=this._getSchema(),typeof e.requestUpdate=="function"))try{e.requestUpdate()}catch{}}_render(){if(!this.shadowRoot||this._rendered)return;let e=this._getSchema();this.shadowRoot.innerHTML=`
            <style>
                ha-form {
                    display: block;
                    width: 100%;
                }
            </style>
            
            <ha-form></ha-form>
        `;let t=this.shadowRoot.querySelector("ha-form");t&&(t.addEventListener("value-changed",this._valueChanged),t.hass=this._hass,t.data=this._config,t.schema=e,t.computeLabel=this._computeLabel),this._rendered=!0}_getSchema(){return[{name:"entity",required:!0,selector:{entity:{filter:[{domain:"person"},{domain:"device_tracker"},{domain:"input_select"}]}}},{name:"name",selector:{text:{}}},{name:"image",selector:{text:{type:"url"}}},{name:"icon",selector:{icon:{}}},{name:"show_name",default:!0,selector:{boolean:{}}},{name:"show_state",default:!0,selector:{boolean:{}}},{name:"show_devices",default:!0,selector:{boolean:{}}},{name:"badge_style",default:"icon_text",selector:{select:{options:[{value:"icon_text",label:"Icon + Text"},{value:"icon_only",label:"Nur Icon"},{value:"text_only",label:"Nur Text"}]}}},{name:"device_attributes",default:["battery_level","gps_accuracy","source_type","zone"],selector:{select:{multiple:!0,options:[{value:"battery_level",label:"Akku-Level"},{value:"gps_accuracy",label:"GPS Genauigkeit"},{value:"source_type",label:"Ger\xE4tetyp"},{value:"zone",label:"Zone"},{value:"last_seen",label:"Zuletzt gesehen"},{value:"ip",label:"IP-Adresse"},{value:"hostname",label:"Hostname"},{value:"mac",label:"MAC-Adresse"},{value:"latitude",label:"Breitengrad"},{value:"longitude",label:"L\xE4ngengrad"}]}}},{name:"excluded_entities",required:!1,selector:{entity:{domain:"device_tracker",multiple:!0}}},{name:"theme",selector:{select:{options:this._getThemeOptions()}}}]}_getThemeOptions(){if(!this._hass||!this._hass.themes||!this._hass.themes.themes)return[{value:"",label:"Standard"}];let e=Object.keys(this._hass.themes.themes),t=[{value:"",label:"Standard"}];return e.forEach(r=>{t.push({value:r,label:r})}),t}static getConfigSchema(){return[{name:"entity",required:!0,selector:{entity:{domain:"person"}}},{name:"name",required:!1,selector:{text:{}}},{name:"image",required:!1,selector:{text:{}}},{name:"icon",required:!1,selector:{icon:{}}},{name:"show_name",required:!1,default:!0,selector:{boolean:{}}},{name:"show_state",required:!1,default:!0,selector:{boolean:{}}},{name:"show_devices",required:!1,default:!0,selector:{boolean:{}}},{name:"badge_style",required:!1,default:"icon_text",selector:{select:{options:[{value:"icon_text",label:"Icon + Text"},{value:"icon_only",label:"Icon Only"},{value:"text_only",label:"Text Only"}]}}},{name:"excluded_entities",required:!1,selector:{entity:{domain:"device_tracker",multiple:!0}}}]}};try{customElements.get("enhanced-person-card-editor")||customElements.define("enhanced-person-card-editor",k)}catch(m){console.warn("Error registering EnhancedPersonCardEditor:",m)}console.info("%c ENHANCED-PERSON-CARD %c v1.3.0 - Advanced Device Tracking %c","background: #1976d2; color: white; padding: 2px 6px; border-radius: 3px 0 0 3px; font-weight: bold;","background: #388e3c; color: white; padding: 2px 6px; border-radius: 0 3px 3px 0; font-weight: bold;","background: transparent;");console.info("%c Enhanced Person Card %c Loaded successfully %c","background: #4caf50; color: white; padding: 2px 6px; border-radius: 3px 0 0 3px; font-weight: bold;","background: #2196f3; color: white; padding: 2px 6px; border-radius: 0 3px 3px 0;","background: transparent;");})();
