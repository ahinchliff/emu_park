export const getNumberParam = (paramId: string) => {
  const id = Number(paramId);
  return isNaN(id) ? undefined : id;
};
