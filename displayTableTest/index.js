document.addEventListener("DOMContentLoaded", (event) => {
  getTableData();
});

const getTableData = () => {
  fetch("../TestSharePointData/sharePointData2.json")
    .then((response) => response.json())
    .then((data) => {
      console.log("Data loaded:", data);
      const table = new SharePointTable({
        data: data,
        containerId: "sharepointTable",
        includeHeaders: ["Author", "Title", "Tags", "Status", "Modified"],
        tableHeaderColors: "#0078D4",
        cellSize: "120px",
        outline: true,
        backgroundColor: "#f9f9f9",
        textColor: "#333",
        borderColor: "#0078D4",
        customClass: "sp-table",
        formatDates: [true, false],
        sortBy: { field: "Status", order: "asc" },
      });
      table.render();
    })
    .catch((error) => console.error("Error loading data:", error));
};
