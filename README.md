
# YouTube Focus Mode 

A lightweight and beautifully designed Chrome extension that removes distractions from YouTube. Hide comments and the suggested videos sidebar with a simple toggle to help you focus entirely on the video content.

---

## Key Features

* **Hide Distractions**: Choose to hide the comment section, the suggested videos sidebar, or both.
* **Simple UI**: An intuitive and clean popup interface makes it easy to turn focus mode on and off.
* **Persistent Settings**: Your preferences for hiding comments and the sidebar are saved automatically for future sessions.
* **Smart Updates**: Changes to your settings apply instantly, even while focus mode is active.
* **Active Status Indicator**: A clear badge in the popup shows whether Focus Mode is currently active or inactive.

---

## 📸 Screenshots

A quick look at the extension in action.

| Before Focus Mode (Standard YouTube) | Extension Popup | After Focus Mode (Distractions Hidden) |
| :----------------------------------: | :---------------: | :------------------------------------: |
| <img src="https://github.com/user-attachments/assets/8013d5c9-6fcb-430f-bc7c-c1dd73edde5d" alt="Screenshot of a YouTube page before applying focus mode" /> | <img src="https://github.com/user-attachments/assets/a288ba83-76f1-42d7-978b-9a6d4ada60b7" alt="Screenshot of the YouTube Focus Mode extension popup" /> | <img src="https://github.com/user-attachments/assets/e5fb509b-c517-44b8-8b28-21e520419f62" alt="Screenshot of a YouTube page after applying focus mode" /> |

---

## How It Works

1.  **Pin the Extension**: After installing, pin the YouTube Focus Mode icon to your Chrome toolbar for easy access.
2.  **Open a YouTube Video**: Navigate to any video on `youtube.com`.
3.  **Configure Your View**: Click the extension icon. In the popup, use the checkboxes to select what you want to hide.
4.  **Enable Focus Mode**: Click the **Enable Focus Mode** button. The page will reload with a clean, distraction-free interface.
5.  **Disable Focus Mode**: To bring everything back, simply open the popup again and click **Disable Focus Mode**.

---

## Project Files & Structure

This project is built with standard web technologies and follows a structure typical for Chrome extensions.

* `manifest.json`: The core configuration file for the Chrome extension. It defines permissions, content scripts, the popup action, and icons.
* `display.html`: Defines the HTML structure for the popup window that users interact with.
* `display.js`: Contains all the JavaScript logic for the popup, including handling button clicks, checkbox changes, and communication with the content script.
* `content.js`: This script is injected directly into YouTube watch pages. It's responsible for finding and hiding/showing the comments and sidebar elements based on messages from the popup.
* `styles.css`: Contains the CSS styles that are injected into YouTube pages, primarily for styling the on-page notifications when focus mode is enabled.
* `icon.jpg`: The display icon for the extension, used in the toolbar and the Chrome Web Store.

---

## Installation
### From Source (For Development)
1.  Clone or download this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable **"Developer mode"** using the toggle in the top-right corner.
4.  Click the **"Load unpacked"** button.
5.  Select the directory where you cloned/downloaded the project files.
6.  The extension will be installed and ready to use!
