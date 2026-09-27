export const getSelectionType = (selection: any): string[] | null => {
  if (!selection) {
    return null;
  }

  const types = new Set<string>();

  if (selection._objects && Array.isArray(selection._objects)) {
    selection._objects.forEach((object: any) => {
      if (object?.type) {
        types.add(object.type);
      }
    });
  } else if (selection.type) {
    types.add(selection.type);
  }

  return types.size > 0 ? Array.from(types) : null;
};
