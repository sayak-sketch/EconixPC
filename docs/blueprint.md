# **App Name**: Econix Plantcare

## Core Features:

- Image Capture/Upload: Allow users to upload a photo of a plant leaf or capture a new image using their device's camera.
- AI-Powered Analysis: Utilize an AI model as a tool to analyze the uploaded image to identify plant species and detect diseases. The tool can reason on the image to determine the plant species.
- Treatment Recommendation: Based on the AI analysis, suggest a suitable treatment (pesticide, herbicide, or insecticide) along with dosage recommendations.
- CSV Formatting: Format the plant species, disease, and treatment details into a CSV format.
- BLE Connection: Enable the web app to open the device's Bluetooth, search for available devices, and connect to the ESP32.
- Data Transmission: Transmit the formatted CSV data to the connected ESP32 device via BLE.
- Spray Activation: A 'Spray' button that, upon activation, sends a signal to the ESP32 to trigger the dispensing of the correct treatment liquid in the specified dosage using the corresponding peristaltic pump. The application assumes actual functioning of ESP32 to provide the service and its main functionality won't depend on it. Without the connection to the device it can work as a service of the plants disease identifying with treatment types and dosage.

## Style Guidelines:

- Primary color: Fresh Green (#90EE90), representing plant life and health.
- Background color: Soft Beige (#F5F5DC), creating a natural and calming feel.
- Accent color: Earthy Brown (#A0522D), to highlight important actions and information.
- Font: 'PT Sans', a humanist sans-serif that balances a modern look with warmth; suitable for headlines and body text
- Use clear, simple icons related to plants, diseases, and treatment types.
- Maintain a clean and intuitive layout with clear sections for image upload, analysis results, and treatment recommendations.
- Subtle animations for loading states and transitions to enhance user experience.