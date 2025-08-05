exports.findCaracteristica = ({ caracteristicas, campo }) => {
  if (!caracteristicas || campo) return;
  return caracteristicas.find(
    (e) => e?.campo?.toLowerCase() === campo.toLowerCase()
  );
};
