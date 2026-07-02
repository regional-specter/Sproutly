# 🪴 Sproutly

Plant enthusiasts love taking cuttings and growing new plants, the user takes a photo of a sick leaf or a new propagation cutting & app identifies the specific plant species, assesses the health/root development, and generates a personalized watering, misting, or repotting schedule

## Tech-Stack and Application Overview

- Frontend - Built using TailwindCSS and React for faster development and implementation from the initial Figma design files. The application UI must be very user-friendly and high quality design, taking inspiration from Pinterest and other sites. Build a very simple yet effective landing page for marketing
- Backend - Comprised of the AI API route which takes in the plant image and returns the key information regarding the plant and it’s health status. User must be able to add their plants currently under care or in house into their virtual garden

✅ Plant Name, Key Facts and Information

✅ Plant Health Status from Image Detection and Analysis

✅ Logs the new or updated status of the plant

✅ Adds a reminder log for plant if required
- AI & Database - Supabase is sufficient for storing all the required material and user profile information for any future references and AI Usage. Gemini API should be more than sufficient for visual analysis from plant images

<img width="1347" height="601" alt="image" src="https://github.com/user-attachments/assets/12c2a098-6a47-4ef2-99a7-eeeab39706a1" />


## User Workflow + Backend Logic

1. User creates a profile and enters email to start choosing and building in-app garden/plant collection as a pre-paywall feature. This allows the user to experience the application UI and build a small connection with the application early
2. Paywall is only active after user has used their 3 free scans for their plants and premium allows for unlimited scans and reminders for plant misting/watering needs
3. Backend logic is mainly handled by 1 AI API (likely Gemini), AI identifies the plant species and returns a health score from 0-100% with the specific care requirements and a small schedule for each independent plant
4. Premium users are also able to add home garden vegetations and track their estimated vegetable growth with specific care information as per conditions to ensure maximum return per plant

<img width="1003" height="701" alt="image1" src="https://github.com/user-attachments/assets/073c40b4-40a6-47eb-bd90-a00a81bf18a5" />

