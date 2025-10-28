# **App Name**: PWA Test

## Core Features:

- User Authentication: Collect user's full name and enrollment number before starting the exam.
- Offline Data Storage: Temporarily save user details and exam responses locally when offline.
- Data Synchronization: Automatically synchronize locally saved data with the database when the connection is restored.
- Exam Questions: Display multiple-choice questions related to PWA, with 3 answer options each.
- Real-time Evaluation: Evaluate and calculate the exam score after completion.
- Results Storage: Save the exam results in Firestore database.
- Display Stored Offline User Data: Display user registration details stored offline on the main page until they are synchronized to the database. These entries are cleared once synchronization happens.

## Style Guidelines:

- Primary color: Vivid yellow (#FFDA63) to match the reference design's cheerful aesthetic and draw user focus.
- Background color: Soft, desaturated yellow (#FAF0D7) provides a calm backdrop that reduces eye strain during testing.
- Accent color: Strong blue (#3A51A3) for buttons and key interactive elements. The analogous contrast creates a secure feeling and aligns to academic settings.
- Body and headline font: 'PT Sans', sans-serif.
- Follow a clean, block-based layout to clearly present the exam sections and questions, promoting an easy and distraction-free testing environment.
- Use intuitive icons related to each question to reinforce context.
- Add subtle transition animations when moving between questions to provide engaging visual feedback and encourage focus.