/**
 * SharePointTable.js
 * -------------------
 * Utility class for rendering SharePoint REST API JSON data as an HTML table.
 *
 * FEATURES:
 * - Automatically normalizes SharePoint REST responses:
 *      - data.d.results
 *      - data.results
 *      - data.d (if an array)
 *      - plain arrays of objects
 * - Displays table headers in the order defined by `includeHeaders` (if provided)
 * - Formats nested objects and arrays into readable strings
 * - Handles null values as empty cells
 * - Optional date formatting (local date/time or date-only)
 * - Optional sorting by any field (ascending or descending)
 * - Fully customizable table styling (colors, borders, cell size, CSS class)
 *
 * HOW TO USE:
 *
 * 1. Include this file in your HTML page:
 *    <script src="SharePointTable.js"></script>
 *
 * 2. Prepare your SharePoint data.
 *    Example: fetch items from a SharePoint list.
 *
 * 3. Create a new instance of SharePointTable:
 *
 *    const table = new SharePointTable({
 *      data: responseFromSharePoint,   // Your JSON data
 *      containerId: "tableContainer",  // ID of the <div> to render the table in
 *      includeHeaders: ["Id", "Title", "Author", "Modified"], // optional, header order
 *      tableHeaderColors: "#f4f4f4",   // optional, header background color
 *      tableHeaderTextColor: "#000",   // optional, header text color
 *      cellSize: "150px",              // optional, minimum cell width
 *      outline: true,                  // optional, show borders (true/false)
 *      backgroundColor: "#fff",        // optional, table background
 *      textColor: "#000",              // optional, text color
 *      borderColor: "#ccc",            // optional, border color
 *      customClass: "my-custom-table", // optional, add a custom CSS class
 *      formatDates: [true, true],      // optional, formatDates = null | [date, time]
 *                                      // [true, true] = show date + time
 *                                      // [true, false] = show date only
 *                                      // null = leave dates as-is
 *      sortBy: { field: "Title", order: "asc" } // optional, sort table by field ascending or descending
 *    });
 *
 * 4. Render the table:
 *    table.render();
 *
 * EXAMPLE HTML:
 *
 *    <div id="tableContainer"></div>
 *
 *    <script>
 *      fetch("/_api/web/lists/getbytitle('Documents')/items")
 *        .then(res => res.json())
 *        .then(data => {
 *          const table = new SharePointTable({
 *            data: data,
 *            containerId: "tableContainer",
 *            includeHeaders: ["Id", "Title", "Author", "Modified"],
 *            formatDates: [true, true],
 *            sortBy: { field: "Modified", order: "desc" }
 *          });
 *          table.render();
 *        });
 *    </script>
 *
 * NOTES:
 * - For best performance and readability, use `includeHeaders` to limit displayed fields.
 * - Supports nested objects, arrays, and SharePoint lookup fields.
 * - Sorting works on text, numbers, booleans, and ISO date strings.
 * - Styling options are fully customizable via constructor parameters.
 */

class SharePointTable {
  constructor({
    data = [],
    includeHeaders = null,
    containerId,
    tableHeaderColors = "#f4f4f4",
    tableHeaderTextColor = "#000",
    cellSize = "auto",
    outline = true,
    backgroundColor = "#fff",
    textColor = "#000",
    borderColor = "#ccc",
    customClass = "",
    formatDates = null,
    sortBy = null,
  }) {
    this.data = data;
    this.includeHeaders = includeHeaders;
    this.containerId = containerId;
    this.tableHeaderColors = tableHeaderColors;
    this.tableHeaderTextColor = tableHeaderTextColor;
    this.cellSize = cellSize;
    this.outline = outline;
    this.backgroundColor = backgroundColor;
    this.textColor = textColor;
    this.borderColor = borderColor;
    this.customClass = customClass;
    this.formatDates = formatDates;
    this.sortBy = sortBy;
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
      // Keep only headers that exist in the data, and respect the order in includeHeaders
      headerArray = this.includeHeaders.filter((h) => headerArray.includes(h));
    } else {
      // Default: remove meta fields starting with "_"
      headerArray = headerArray.filter((h) => !h.startsWith("_"));
    }

    return headerArray;
  }

  _formatCellValue = (value) => {
    if (value === null) return "";

    // Format ISO dates if formatDates is set
    if (this.formatDates && typeof value === "string") {
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
      if (isoDateRegex.test(value)) {
        const date = new Date(value);
        const [showDate, showTime] = this.formatDates;

        if (showDate && showTime) return date.toLocaleString(); // date + time
        if (showDate && !showTime) return date.toLocaleDateString(); // date only
        if (!showDate && showTime) return date.toLocaleTimeString(); // time only
        return ""; // neither
      }
    }

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

    // Apply sorting if sortBy is set
    if (this.sortBy && this.sortBy.field) {
      const { field, order } = this.sortBy;
      rows.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];

        // Convert dates for comparison if formatDates is set
        let aComp = valA;
        let bComp = valB;
        const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

        if (typeof valA === "string" && isoDateRegex.test(valA))
          aComp = new Date(valA);
        if (typeof valB === "string" && isoDateRegex.test(valB))
          bComp = new Date(valB);

        if (aComp < bComp) return order === "desc" ? 1 : -1;
        if (aComp > bComp) return order === "desc" ? -1 : 1;
        return 0;
      });
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
        th.style.color = this.tableHeaderTextColor;
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
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD (RequireJS)
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    // CommonJS (Node, bundlers)
    module.exports = factory();
  } else {
    // Browser global
    root.SharePointTable = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  return SharePointTable;
});
