# Text-to-Speech App with Firebase.studio and Gemini Models

This document explains how to use Firebase.studio to generate a text-to-speech application using Gemini models. The app will allow users to input text, select a voice and language, and then have the text read aloud in the chosen voice and language. The text will also be translated to the selected language before being read.

## Generating the App with Firebase.studio

Firebase.studio allows you to build applications using natural language prompts. Below are the prompts you can use to create this text-to-speech app. Each prompt builds upon the previous one, adding more features.

### Prompt 1: Basic Text-to-Speech Functionality

**Prompt:** "Build me an app that uses Gemini models to read back the text I paste into a textbox."

**Explanation:** This initial prompt will generate the core application. It will create a user interface with a textbox where users can paste text. It will also integrate with Gemini models to convert that text into speech and play it back.

### Prompt 2: Adding Voice Selection

**Prompt:** "add a dropdown that lets me switch the voice name based on available voices from the docs:

Voice options TTS models support the following 30 voice options in the voice_name field:

Zephyr -- Bright Puck -- Upbeat Charon -- Informative Kore -- Firm Fenrir -- Excitable Leda -- Youthful Orus -- Firm Aoede -- Breezy Callirrhoe -- Easy-going Autonoe -- Bright Enceladus -- Breathy Iapetus -- Clear Umbriel -- Easy-going Algieba -- Smooth Despina -- Smooth Erinome -- Clear Algenib -- Gravelly Rasalgethi -- Informative Laomedeia -- Upbeat Achernar -- Soft Alnilam -- Firm Schedar -- Even Gacrux -- Mature Pulcherrima -- Forward Achird -- Friendly Zubenelgenubi -- Casual Vindemiatrix -- Gentle Sadachbia -- Lively Sadaltager -- Knowledgeable Sulafat -- Warm"

**Explanation:** This prompt enhances the application by adding a dropdown menu. This menu will be populated with the voice options listed, allowing users to select their preferred voice for the text-to-speech output. Firebase.studio will understand to use the `voice_name` field when interacting with the Gemini TTS model.

### Prompt 3 & 4: Adding Language Selection and Translation

**Prompt 3:** "add another selector for language to pass in the selected language so it reads the text in the selected voice and lanugage:

The TTS models detect the input language automatically. They support the following 24 languages:

Language BCP-47 Code Language BCP-47 Code Arabic (Egyptian) ar-EG German (Germany) de-DE English (US) en-US Spanish (US) es-US French (France) fr-FR Hindi (India) hi-IN Indonesian (Indonesia) id-ID Italian (Italy) it-IT Japanese (Japan) ja-JP Korean (Korea) ko-KR Portuguese (Brazil) pt-BR Russian (Russia) ru-RU Dutch (Netherlands) nl-NL Polish (Poland) pl-PL Thai (Thailand) th-TH Turkish (Turkey) tr-TR Vietnamese (Vietnam) vi-VN Romanian (Romania) ro-RO Ukrainian (Ukraine) uk-UA Bengali (Bangladesh) bn-BD English (India) en-IN & hi-IN bundle Marathi (India) mr-IN Tamil (India) ta-IN Telugu (India) te-IN"

**Prompt 4:** "before sending the text to the model for speech generation, translate the text using the languages selector to the target language then pass that into the language generator"

**Explanation (Prompts 3 & 4 Combined):**
These two prompts work together to introduce multilingual capabilities.

*   **Prompt 3** adds a language selector dropdown, populated with the BCP-47 language codes provided. This allows the user to choose the target language for the speech output.
*   **Prompt 4** instructs Firebase.studio to implement a two-step process:
    1.  First, take the input text and use a Gemini model to translate it into the language selected by the user in the language dropdown.
    2.  Then, take this *translated* text and pass it to the Gemini text-to-speech model, using the selected voice (from Prompt 2) and the selected language (from Prompt 3) to generate the audio.

This combination ensures that the app first translates the text to the desired language and then reads it aloud in that language, using the chosen voice.

By following these prompts sequentially in Firebase.studio, you can build a powerful text-to-speech application with voice and language customization, including on-the-fly translation.
