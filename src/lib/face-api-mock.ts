const faceapi = {
  nets: {
    tinyFaceDetector: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      loadFromUri: async (_modelUrl?: string) => {
        return new Promise<void>((resolve) => setTimeout(resolve, 100));
      },
      params: true,
    },
    faceExpressionNet: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      loadFromUri: async (_modelUrl?: string) => {
        return new Promise<void>((resolve) => setTimeout(resolve, 100));
      },
    },
  },

  detectSingleFace: () => ({
    withFaceExpressions: async () => ({
      expressions: {
        happy: Math.random(),
        sad: Math.random(),
        angry: Math.random(),
        surprised: Math.random(),
        fearful: Math.random(),
        disgusted: Math.random(),
        neutral: Math.random(),
      },
    }),
  }),

  TinyFaceDetectorOptions: class {},
};

export default faceapi;
