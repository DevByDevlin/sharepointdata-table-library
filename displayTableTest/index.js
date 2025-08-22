document.addEventListener("DOMContentLoaded", (event) => {
  getTableData();
});

const getTableData = () => {
  fetch("../TestSharePointData/sharePointData.json")
    .then((response) => response.json())
    .then((data) => {
      console.log("Data loaded:", data);
      const table = new SharePointTable({
        data: data,
        containerId: "sharepointTable",
        includeHeaders: ["Title", "Author", "Status"],
        tableHeaderColors: "#0078D4",
        cellSize: "120px",
        outline: true,
        backgroundColor: "#f9f9f9",
        textColor: "#333",
        borderColor: "#0078D4",
        customClass: "sp-table",
      });
      table.render();
    })
    .catch((error) => console.error("Error loading data:", error));
};
