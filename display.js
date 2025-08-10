document.addEventListener('DOMContentLoaded', function() {
    // UI element references
    const toggleBtn = document.getElementById("toggleBtn");
    const buttonText = document.getElementById("buttonText");
    const statusBadge = document.getElementById("statusBadge");
    const hideComments = document.getElementById("hideComments");
    const hideSidebar = document.getElementById("hideSidebar");

    // Update the toggle button's appearance and status text
    function updateButton(isEnabled) {
        if (isEnabled) {
            toggleBtn.className = "toggle-button disable";
            buttonText.textContent = "Disable Focus Mode";
            statusBadge.textContent = "Active";
            statusBadge.className = "status-badge active";
        } else {
            toggleBtn.className = "toggle-button enable";
            buttonText.textContent = "Enter Focus Mode";
            statusBadge.textContent = "Inactive";
            statusBadge.className = "status-badge inactive";
        }
        toggleBtn.disabled = false;
    }

    // Update the button state based on selected checkboxes
    function updateButtonBasedOnSelections() {
        const hasSelection = hideComments.checked || hideSidebar.checked;
        
        if (chrome.storage) {
            chrome.storage.sync.get(["focusMode"], (data) => {
                if (hasSelection) {
                    updateButton(data.focusMode || false);
                } else {
                    toggleBtn.className = "toggle-button enable";
                    buttonText.textContent = "Select an Option";
                    statusBadge.textContent = "Inactive";
                    statusBadge.className = "status-badge inactive";
                    toggleBtn.disabled = true;
                }
            });
        }
    }

    // Initialize UI state with saved preferences
    if (chrome.storage) {
        chrome.storage.sync.get(["focusMode", "hideComments", "hideSidebar"], (data) => {
            hideComments.checked = data.hideComments !== undefined ? data.hideComments : true;
            hideSidebar.checked = data.hideSidebar !== undefined ? data.hideSidebar : true;
            updateButtonBasedOnSelections();
        });
    }

    // Handle changes to "Hide Comments" checkbox
    hideComments.addEventListener("change", () => {
        chrome.storage.sync.set({ hideComments: hideComments.checked }, () => {
            updateButtonBasedOnSelections();
            // Update content script if focus mode is already active
            chrome.storage.sync.get(["focusMode"], (data) => {
                if (data.focusMode) {
                    sendMessageToActiveTab({
                        type: "focusToggle",
                        value: true,
                        hideComments: hideComments.checked,
                        hideSidebar: hideSidebar.checked
                    });
                }
            });
        });
    });

    // Handle changes to "Hide Sidebar" checkbox
    hideSidebar.addEventListener("change", () => {
        chrome.storage.sync.set({ hideSidebar: hideSidebar.checked }, () => {
            updateButtonBasedOnSelections();
            // Update content script if focus mode is already active
            chrome.storage.sync.get(["focusMode"], (data) => {
                if (data.focusMode) {
                    sendMessageToActiveTab({
                        type: "focusToggle",
                        value: true,
                        hideComments: hideComments.checked,
                        hideSidebar: hideSidebar.checked
                    });
                }
            });
        });
    });

    // Handle toggle button click (enable/disable focus mode)
    toggleBtn.addEventListener("click", () => {
        if (toggleBtn.disabled) return;
        toggleBtn.disabled = true;

        if (chrome.storage) {
            chrome.storage.sync.get(["focusMode"], (data) => {
                const newState = !data.focusMode;
                buttonText.textContent = newState ? "Enabling..." : "Disabling...";

                // Save new state and checkbox settings
                chrome.storage.sync.set({
                    focusMode: newState,
                    hideComments: hideComments.checked,
                    hideSidebar: hideSidebar.checked
                }, () => {
                    if (chrome.tabs) {
                        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                            const tab = tabs[0];
                            if (tab && tab.url.includes('youtube.com/watch')) {
                                if (newState) {
                                    // Reload page before enabling focus mode
                                    chrome.tabs.reload(tab.id, () => {
                                        setTimeout(() => {
                                            sendMessageToActiveTab({
                                                type: "focusToggle",
                                                value: true,
                                                hideComments: hideComments.checked,
                                                hideSidebar: hideSidebar.checked
                                            });
                                            updateButton(true);
                                        }, 2000);
                                    });
                                } else {
                                    // Directly disable focus mode without reload
                                    sendMessageToActiveTab({
                                        type: "focusToggle",
                                        value: false,
                                        hideComments: hideComments.checked,
                                        hideSidebar: hideSidebar.checked
                                    });
                                    updateButton(false);
                                }
                            } else {
                                buttonText.textContent = "Open a YouTube Video";
                                setTimeout(() => updateButtonBasedOnSelections(), 2000);
                            }
                        });
                    }
                });
            });
        }
    });

    // Send a message to the active YouTube tab
    function sendMessageToActiveTab(message) {
        if (chrome.tabs) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    const tab = tabs[0];
                    if (tab.url && tab.url.includes('youtube.com/watch')) {
                        chrome.tabs.sendMessage(tab.id, message, (response) => {
                            if (chrome.runtime.lastError) {
                                // Inject content script if not loaded
                                if (chrome.scripting) {
                                    chrome.scripting.executeScript({
                                        target: { tabId: tab.id },
                                        files: ['content.js']
                                    }, () => {
                                        setTimeout(() => {
                                            chrome.tabs.sendMessage(tab.id, message);
                                        }, 100);
                                    });
                                }
                            }
                        });
                    } else {
                        buttonText.textContent = "Open YouTube Video";
                        toggleBtn.disabled = true;
                        setTimeout(() => updateButtonBasedOnSelections(), 2000);
                    }
                }
            });
        }
    }

    // Allow clicking anywhere in checkbox item row to toggle
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.type === 'checkbox' || e.target.tagName === 'LABEL') return;
            const checkboxId = this.dataset.checkbox;
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    });

    // Update UI when switching or reloading tabs
    if (chrome.tabs) {
        chrome.tabs.onActivated.addListener(() => {
            updateButtonBasedOnSelections();
        });

        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete') {
                updateButtonBasedOnSelections();
            }
        });
    }
});
