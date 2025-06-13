// Mock face-api.js for demonstration (replace with actual import)
const faceapi = {
  nets: {
    tinyFaceDetector: {
      loadFromUri: async (MODEL_URL: string) => {},
      params: true
    },
    faceExpressionNet: {
      loadFromUri: async (MODEL_URL: string) => {}
    }
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
        neutral: Math.random()
      }
    })
  }),
  TinyFaceDetectorOptions: class {}
};

export default faceapi;