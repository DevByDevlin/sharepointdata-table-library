document.addEventListener("DOMContentLoaded", () => {
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
        tableHeaderColors: "#909093ff",
        tableHeaderTextColor: "#000000ff",
        cellSize: "120px",
        outline: true,
        backgroundColor: "#f9f9f9",
        textColor: "#3a0505ff",
        borderColor: "#000000ff",
        customClass: "sp-table",
        formatDates: [true, false],
        sortBy: { field: "Status", order: "asc" },
      });
      table.render();
    })
    .catch((error) => console.error("Error loading data:", error));
};
