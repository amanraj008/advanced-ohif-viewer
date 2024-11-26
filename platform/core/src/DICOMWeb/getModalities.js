export default function getModalities(Modality, ModalitiesInStudy) {
  if (!Modality && !ModalitiesInStudy) {
    return {};
  }

  const modalities = Modality || {
    vr: 'CS',
    Value: [],
  };

  // Ensure modalities.Value is initialized properly
  modalities.Value = modalities.Value || [];

  if (ModalitiesInStudy) {
    // Check if ModalitiesInStudy.Value exists and is an array
    if (ModalitiesInStudy.Value && Array.isArray(ModalitiesInStudy.Value)) {
      if (modalities.vr && modalities.vr === ModalitiesInStudy.vr) {
        for (let i = 0; i < ModalitiesInStudy.Value.length; i++) {
          const value = ModalitiesInStudy.Value[i];
          if (modalities.Value.indexOf(value) === -1) {
            modalities.Value.push(value);
          }
        }
      } else {
        return ModalitiesInStudy;
      }
    }
  }

  return modalities;
}
