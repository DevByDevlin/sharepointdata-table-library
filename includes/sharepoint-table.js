class SharePointTable {
  constructor({
    data = [],
    includeHeaders = null,
    containerId,
    tableHeaderColors = "#f4f4f4",
    cellSize = "auto",
    outline = true,
    backgroundColor = "#fff",
    textColor = "#000",
    borderColor = "#ccc",
    customClass = "",
  }) {
    this.data = data;
    this.includeHeaders = includeHeaders;
    this.containerId = containerId;
    this.tableHeaderColors = tableHeaderColors;
    this.cellSize = cellSize;
    this.outline = outline;
    this.backgroundColor = backgroundColor;
    this.textColor = textColor;
    this.borderColor = borderColor;
    this.customClass = customClass;
  }

  _normalizeData = () => {
    let raw = this.data;
    // if empty return empty array
    if (!raw) return [];

    if (raw.d?.results && Array.isArray(raw.d.results)) {
      return raw.d.results;
    }
    if (raw.results && Array.isArray(raw.results)) {
      return raw.results;
    }
    if (raw.d && Array.isArray(raw.d)) {
      return raw.d;
    }
    if (Array.isArray(raw)) {
      return raw;
    }
    return [];
  };

  _generateHeaders(rows) {
    const headers = new Set();
    rows.forEach((row) => {
      Object.keys(row).forEach((key) => headers.add(key));
    });

    let headerArray = Array.from(headers);

    if (this.includeHeaders && Array.isArray(this.includeHeaders)) {
      // Only keep the ones explicitly included
      headerArray = headerArray.filter((h) => this.includeHeaders.includes(h));
    } else {
      //Default: remove meta fields starting with "_"
      headerArray = headerArray.filter((h) => !h.startsWith("_"));
    }

    return headerArray;
  }

  _formatCellValue = (value) => {
    if (value === null) return "";

    //handle arrays
    if (Array.isArray(value)) {
      return value.map((v) => this._formatCellValue(v)).join(", ");
    }

    //handle objects
    if (typeof value === "object") {
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${this._formatCellValue(v)}`)
        .join(", ");
    }

    return String(value);
  };

  // Render the table
  render() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Container with ID "${this.containerId}" not found.`);
      return;
    }

    const rows = this._normalizeData();
    if (rows.length === 0) {
      container.innerHTML = "<p> No Data Available </p>";
    }

    // Clear existing content
    container.innerHTML = "";

    const table = document.createElement("table");
    table.className = this.customClass;

    // Table styling
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.backgroundColor = this.backgroundColor;
    table.style.color = this.textColor;

    // Headers
    const headers = this._generateHeaders(rows);
    if (headers.length > 0) {
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");

      headers.forEach((header) => {
        const th = document.createElement("th");
        th.innerText = header;
        th.style.backgroundColor = this.tableHeaderColors;
        th.style.padding = "8px";
        th.style.textAlign = "left";
        th.style.border = this.outline
          ? `1px solid ${this.borderColor}`
          : "none";
        th.style.minWidth = this.cellSize;
        headerRow.appendChild(th);
      });

      thead.appendChild(headerRow);
      table.appendChild(thead);
    }

    // Body
    const tbody = document.createElement("tbody");

    rows.forEach((row) => {
      const tr = document.createElement("tr");

      headers.forEach((header) => {
        const td = document.createElement("td");

        // using formatter for row content
        td.innerText = this._formatCellValue(row[header]);
        td.style.padding = "8px";
        td.style.border = this.outline
          ? `1px solid ${this.borderColor}`
          : "none";
        td.style.minWidth = this.cellSize;
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  }
}

// Make it available globally
window.SharePointTable = SharePointTable;
