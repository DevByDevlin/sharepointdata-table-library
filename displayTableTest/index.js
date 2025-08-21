class SharePointTable {
  constructor({
    data = [],
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
    this.containerId = containerId;
    this.tableHeaderColors = tableHeaderColors;
    this.cellSize = cellSize;
    this.outline = outline;
    this.backgroundColor = backgroundColor;
    this.textColor = textColor;
    this.borderColor = borderColor;
    this.customClass = customClass;
  }

  generateHeaders = () => {
    if (!this.data || this.data.length === 0) return [];
    console.log(this.data.d.results);
    const headers = Object.keys(this.data.d.results[0]).shift();

    console.log(headers);
  };

  // Render the table
  render() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Container with ID "${this.containerId}" not found.`);
      return;
    }

    const headers = this.generateHeaders();

    //     // Clear existing content
    //     container.innerHTML = "";

    //     const table = document.createElement("table");
    //     table.className = this.customClass;

    //     // Table styling
    //     table.style.width = "100%";
    //     table.style.borderCollapse = "collapse";
    //     table.style.backgroundColor = this.backgroundColor;
    //     table.style.color = this.textColor;

    //     // Headers
    //     const headers = this._generateHeaders();
    //     if (headers.length > 0) {
    //       const thead = document.createElement("thead");
    //       const headerRow = document.createElement("tr");

    //       headers.forEach((header) => {
    //         const th = document.createElement("th");
    //         th.innerText = header;
    //         th.style.backgroundColor = this.tableHeaderColors;
    //         th.style.padding = "8px";
    //         th.style.textAlign = "left";
    //         th.style.border = this.outline
    //           ? `1px solid ${this.borderColor}`
    //           : "none";
    //         th.style.minWidth = this.cellSize;
    //         headerRow.appendChild(th);
    //       });

    //       thead.appendChild(headerRow);
    //       table.appendChild(thead);
    //     }

    //     // Body
    //     const tbody = document.createElement("tbody");

    //     this.data.forEach((row) => {
    //       const tr = document.createElement("tr");

    //       headers.forEach((header) => {
    //         const td = document.createElement("td");
    //         td.innerText = row[header] ?? "";
    //         td.style.padding = "8px";
    //         td.style.border = this.outline
    //           ? `1px solid ${this.borderColor}`
    //           : "none";
    //         td.style.minWidth = this.cellSize;
    //         tr.appendChild(td);
    //       });

    //       tbody.appendChild(tr);
    //     });

    //     table.appendChild(tbody);
    //     container.appendChild(table);
  }
}

fetch("../TestSharePointData/sharePointData.json")
  .then((response) => response.json())
  .then((data) => {
    console.log("Data loaded:", data);
    const table = new SharePointTable({
      data: data,
      containerId: "sharepointTable",
      // tableHeaderColors: "#0078D4",
      // cellSize: "120px",
      // outline: true,
      // backgroundColor: "#fafafa",
      // textColor: "#333",
      // borderColor: "#0078D4",
      // customClass: "sp-table",
    });
    table.render();
  })
  .catch((error) => console.error("Error loading data:", error));

// Make it available globally
window.SharePointTable = SharePointTable;
