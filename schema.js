const schema = {
  title: "Draw Defined 2D Shape",
  type: "object",
  properties: {
    shape_type: {
      type: "string",
      enum: ["circle", "square", "any", "grid"],
      title: "Shape Type",
    },
    divisions: {
      type: "number",
      title: "Number of Divisions",
    },
    shaded_divisions: {
      type: "number",
      title: "Number of Shaded Divisions",
    },
    divide_shaded_division: {
      type: "string",
      title: "Divide Shaded Division",
    },
    label_parts: {
      type: "string",
      enum: ["number", "alphabet"],
      title: "Label Parts",
    },
    label_vertices: {
      type: "string",
      enum: ["number", "alphabet"],
      title: "Label Vertices",
    },
    label_edge_distance: {
      type: "string",
      enum: ["number", "alphabet"],
      title: "Label Edge Distance",
    },
    distance_unit: {
      type: "string",
      enum: ["m", "cm", "km"],
      title: "Distance Unit",
    },
    allow_user_to_shade: {
      type: "boolean",
      title: "Allow User to Shade",
    },
    rotation_degrees: {
      type: "number",
      title: "Rotation Degrees",
    },
    // New grid properties
    columns: {
      type: "number",
      title: "Number of Columns",
    },
    rows: {
      type: "number",
      title: "Number of Rows",
    },
    element_draw_direction: {
      type: "string",
      enum: ["row", "col", "cell"],
      title: "Element Draw Direction",
    },
    shade_element: {
      type: "number",
      title: "Number of Elements to Shade",
    },
  },
};
