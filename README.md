# sharepointdata-table-library

Absolutely! Here’s a **clean, professional, and README-friendly version** of your instructions that highlights features, usage, and examples clearly:

---

# SharePointTable.js

A lightweight JavaScript utility for rendering SharePoint REST API JSON data as a fully customizable HTML table.

## Features

- Automatically normalizes common SharePoint REST responses:

  - `data.d.results` (classic SharePoint REST format)
  - `data.results`
  - `data.d` (if an array)
  - Plain arrays of objects

- Displays table headers in the order defined by `includeHeaders` (optional)
- Formats nested objects and arrays into readable strings
- Handles null values as empty cells
- Optional date formatting (date + time or date only)
- Optional sorting by any field (ascending or descending)
- Fully customizable table styling:

  - Header and cell colors
  - Borders
  - Minimum cell width
  - Custom CSS classes

---

## Installation

Include the script in your HTML page:

```html
<script src="SharePointTable.js"></script>
```

---

## Usage

```javascript
// Example: Fetch data from a SharePoint list and render a table
fetch("/_api/web/lists/getbytitle('Documents')/items")
  .then((res) => res.json())
  .then((data) => {
    const table = new SharePointTable({
      data: data, // Your JSON data
      containerId: "tableContainer", // ID of the <div> to render the table
      includeHeaders: ["Id", "Title", "Author", "Modified"], // optional, specify header order
      tableHeaderColors: "#f4f4f4", // optional, header background color
      tableHeaderTextColor: "#000", // optional, header text color
      cellSize: "150px", // optional, minimum cell width
      outline: true, // optional, show borders (true/false)
      backgroundColor: "#fff", // optional, table background
      textColor: "#000", // optional, text color
      borderColor: "#ccc", // optional, border color
      customClass: "my-custom-table", // optional, custom CSS class
      formatDates: [true, true], // optional, [date, time] or null
      sortBy: { field: "Modified", order: "desc" }, // optional, sort table by a field
    });

    table.render();
  });
```

---

## Constructor Options

| Option                 | Type         | Default   | Description                                                                 |                                   |
| ---------------------- | ------------ | --------- | --------------------------------------------------------------------------- | --------------------------------- |
| `data`                 | Array/Object | `[]`      | SharePoint JSON data to render                                              |                                   |
| `containerId`          | String       | `null`    | ID of the `<div>` to render the table                                       |                                   |
| `includeHeaders`       | Array        | `null`    | Optional array of headers to display, order preserved                       |                                   |
| `tableHeaderColors`    | String       | `#f4f4f4` | Header background color                                                     |                                   |
| `tableHeaderTextColor` | String       | `#000`    | Header text color                                                           |                                   |
| `cellSize`             | String       | `auto`    | Minimum cell width                                                          |                                   |
| `outline`              | Boolean      | `true`    | Show cell borders                                                           |                                   |
| `backgroundColor`      | String       | `#fff`    | Table background color                                                      |                                   |
| `textColor`            | String       | `#000`    | Table text color                                                            |                                   |
| `borderColor`          | String       | `#ccc`    | Table border color                                                          |                                   |
| `customClass`          | String       | `""`      | Custom CSS class for the table                                              |                                   |
| `formatDates`          | Array/Null   | `null`    | `[showDate, showTime]` to format ISO date strings, or `null` to leave as-is |                                   |
| `sortBy`               | Object/Null  | `null`    | \`{ field: "FieldName", order: "asc"                                        | "desc" }\` to sort table by field |

---

## Notes

- For best readability, use `includeHeaders` to limit displayed fields.
- Supports nested objects, arrays, and SharePoint lookup fields.
- Sorting works with text, numbers, booleans, and ISO date strings.
- All styling options can be customized via constructor parameters.

---

## Example HTML

```html
<div id="tableContainer"></div>
<script src="SharePointTable.js"></script>
```

---
