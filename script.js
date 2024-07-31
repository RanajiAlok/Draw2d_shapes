document.addEventListener("DOMContentLoaded", () => {
  const formContainer = document.getElementById("form-container");
  const drawButton = document.getElementById("draw-shape-button");
  const drawingArea = document.getElementById("drawing-area");
  const polygonSidesContainer = document.getElementById(
    "polygon-sides-container"
  );
  const polygonSidesInput = document.getElementById("polygon-sides");

  let jsxBoard;

  const createForm = (schema) => {
    for (let key in schema.properties) {
      const property = schema.properties[key];
      const formElement = document.createElement("div");

      const label = document.createElement("label");
      label.innerText = property.title;
      formElement.appendChild(label);

      let input;
      if (property.type === "boolean") {
        input = document.createElement("input");
        input.type = "checkbox";
      } else if (property.enum) {
        input = document.createElement("select");
        property.enum.forEach((optionValue) => {
          const option = document.createElement("option");
          option.value = optionValue;
          option.innerText = optionValue;
          input.appendChild(option);
        });
      } else {
        input = document.createElement("input");
        input.type = "text";
      }
      input.id = key;
      formElement.appendChild(input);
      formContainer.appendChild(formElement);
    }
  };

  const getFormData = () => {
    const formData = {};
    for (let key in schema.properties) {
      const input = document.getElementById(key);
      if (input.type === "checkbox") {
        formData[key] = input.checked;
      } else if (input.type === "select-one") {
        formData[key] = input.options[input.selectedIndex].value;
      } else {
        formData[key] = input.value;
      }
    }
    if (formData.shape_type === "any") {
      formData.polygon_sides = parseInt(polygonSidesInput.value, 10);
    }
    return formData;
  };

  const drawShape = (formData) => {
    drawingArea.innerHTML = "";
    const two = new Two({ width: 500, height: 500 }).appendTo(drawingArea);

    const shapeType = formData.shape_type;
    const divisions = parseInt(formData.divisions, 10);
    const shadedDivisions = parseInt(formData.shaded_divisions, 10);
    const rotationDegrees = parseInt(formData.rotation_degrees, 10);

    let shape;
    switch (shapeType) {
      case "circle":
        shape = drawCircle(two, divisions, shadedDivisions);
        break;
      case "square":
        shape = drawSquare(two, divisions, shadedDivisions);
        break;
      case "any":
        shape = drawPolygon(
          two,
          formData.polygon_sides,
          divisions,
          shadedDivisions
        );
        break;
      case "grid":
        shape = drawGrid(two, formData);
        break;
      default:
        console.log("Unsupported shape type");
    }

    if (shape) {
      shape.rotation = (rotationDegrees * Math.PI) / 180;
    }
    two.update();

    if (formData.allow_user_to_shade) {
      setupJSXGraph(formData);
    }
  };

  const drawCircle = (two, divisions, shadedDivisions) => {
    const radius = 100;
    const circle = two.makeCircle(250, 250, radius);
    circle.stroke = "black";

    const angleStep = (Math.PI * 2) / divisions;
    for (let i = 0; i < divisions; i++) {
      const x = 250 + radius * Math.cos(i * angleStep);
      const y = 250 + radius * Math.sin(i * angleStep);
      two.makeLine(250, 250, x, y);
    }

    for (let i = 0; i < shadedDivisions; i++) {
      const x1 = 250 + radius * Math.cos(i * angleStep);
      const y1 = 250 + radius * Math.sin(i * angleStep);
      const x2 = 250 + radius * Math.cos((i + 1) * angleStep);
      const y2 = 250 + radius * Math.sin((i + 1) * angleStep);
      const path = two.makePath(250, 250, x1, y1, x2, y2, true);
      path.fill = "rgba(255, 0, 0, 0.5)";
    }

    return circle;
  };

  const drawSquare = (two, divisions, shadedDivisions) => {
    const size = 200;
    const square = two.makeRectangle(250, 250, size, size);
    square.stroke = "black";

    const step = size / divisions;
    for (let i = 0; i <= divisions; i++) {
      two.makeLine(
        250 - size / 2,
        250 - size / 2 + i * step,
        250 + size / 2,
        250 - size / 2 + i * step
      );
      two.makeLine(
        250 - size / 2 + i * step,
        250 - size / 2,
        250 - size / 2 + i * step,
        250 + size / 2
      );
    }

    for (let i = 0; i < shadedDivisions; i++) {
      const rect = two.makeRectangle(
        250 - size / 2 + (i + 0.5) * step,
        250 - size / 2 + (i + 0.5) * step,
        step,
        step
      );
      rect.fill = "rgba(255, 0, 0, 0.5)";
    }

    return square;
  };

  const drawPolygon = (two, sides, divisions, shadedDivisions) => {
    const radius = 100;
    const polygon = two.makePolygon(250, 250, radius, sides);
    polygon.stroke = "black";

    const angleStep = (Math.PI * 2) / sides;
    for (let i = 0; i < sides; i++) {
      const x = 250 + radius * Math.cos(i * angleStep);
      const y = 250 + radius * Math.sin(i * angleStep);
      two.makeLine(250, 250, x, y);
    }

    for (let i = 0; i < shadedDivisions; i++) {
      const x1 = 250 + radius * Math.cos(i * angleStep);
      const y1 = 250 + radius * Math.sin(i * angleStep);
      const x2 = 250 + radius * Math.cos((i + 1) * angleStep);
      const y2 = 250 + radius * Math.sin((i + 1) * angleStep);
      const path = two.makePath(250, 250, x1, y1, x2, y2, true);
      path.fill = "rgba(255, 0, 0, 0.5)";
    }

    return polygon;
  };

  const drawGrid = (two, formData) => {
    const columns = parseInt(formData.columns, 10);
    const rows = parseInt(formData.rows, 10);
    const shadedElements = parseInt(formData.shade_element, 10);
    const drawDirection = formData.element_draw_direction;

    const cellWidth = 500 / columns;
    const cellHeight = 500 / rows;

    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        const rect = two.makeRectangle(
          i * cellWidth + cellWidth / 2,
          j * cellHeight + cellHeight / 2,
          cellWidth,
          cellHeight
        );
        rect.stroke = "black";
      }
    }

    for (let i = 0; i < shadedElements; i++) {
      let col, row;
      if (drawDirection === "row") {
        row = Math.floor(i / columns);
        col = i % columns;
      } else if (drawDirection === "col") {
        col = Math.floor(i / rows);
        row = i % rows;
      } else {
        col = Math.floor(Math.random() * columns);
        row = Math.floor(Math.random() * rows);
      }

      const rect = two.makeRectangle(
        col * cellWidth + cellWidth / 2,
        row * cellHeight + cellHeight / 2,
        cellWidth,
        cellHeight
      );
      rect.fill = "rgba(255, 0, 0, 0.5)";
    }
  };

  const setupJSXGraph = (formData) => {
    if (jsxBoard) {
      JSXGraph.freeBoard(jsxBoard);
    }
    jsxBoard = JXG.JSXGraph.initBoard("drawing-area", {
      boundingbox: [-5, 5, 5, -5],
      axis: true,
    });
    // More JSXGraph drawing logic based on formData
  };

  createForm(schema);

  drawButton.addEventListener("click", () => {
    const formData = getFormData();
    drawShape(formData);
  });
});
